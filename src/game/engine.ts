import { soundEngine } from './audio';
import { drawCharacterSprite, getCharacterById } from './characters';
import { LEVELS } from './levels';
import {
  BIOME_PALETTES,
  drawBiomeBackground,
  drawCheckpointFlag,
  drawCoinSprite,
  drawEnemySprite,
  drawGoalFlag,
  drawHeartSprite,
  drawKeySprite,
  drawLevelProp,
  drawPowerUpSprite,
  drawTile,
  drawWeatherAtmosphere,
  TILE_SIZE,
} from './sprites';
import {
  CharacterId,
  CoinEntity,
  EnemyEntity,
  FloatingText,
  GameState,
  HeartPickupEntity,
  HudSnapshot,
  KeyEntity,
  LevelDef,
  MovingPlatform,
  Particle,
  PlayerAnimState,
  PowerUpEntity,
  TileKind,
  WeatherKind,
} from './types';

interface WeatherParticle {
  kind: WeatherKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
}

const GRAVITY = 1280;
const MAX_FALL_SPEED = 660;
const WALL_SLIDE_SPEED = 56;
const BASE_MOVE_SPEED = 242;
const BASE_JUMP_VY = -535;
const DOUBLE_JUMP_VY = -505;
const WALL_JUMP_VY = -515;
const SPRING_VY = -750;
const MAX_LIVES = 5;
const MAX_JUMPS = 2;

const PLAYER_W = 20;
const PLAYER_H = 26;

export interface InputState {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  jumpJustPressed: boolean;
  jumpJustReleased: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId: number | null = null;
  private lastTimestamp = 0;
  private worldTime = 0;

  private gameState: GameState = 'TITLE_MENU';
  private characterId: CharacterId = 'kelinci';
  private levelIndex = 0;
  private level: LevelDef = LEVELS[0];
  private grid: TileKind[][] = [];
  private mapCols = 100;
  private mapRows = 18;

  // Player state
  private px = 96;
  private py = 300;
  private pvx = 0;
  private pvy = 0;
  private facing: 1 | -1 = 1;
  private onGround = false;
  private onWall: -1 | 0 | 1 = 0;
  private lastWallDir: -1 | 0 | 1 = 0;
  private wallCoyoteTimer = 0;
  private wallJumpLockTimer = 0;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private maxJumps = MAX_JUMPS;
  private jumpsRemaining = MAX_JUMPS;
  private isDoubleJumping = false;
  private invulnTimer = 0;
  private hurtTimer = 0;
  private animState: PlayerAnimState = 'idle';
  private animTime = 0;
  private dustTimer = 0;
  private ridingPlatform: MovingPlatform | null = null;
  private starTimer = 0;
  private magnetTimer = 0;
  private dashTimer = 0;
  private dashCooldown = 0;
  private airStompCombo = 0;

  // Checkpoint / Respawn
  private spawnX = 96;
  private spawnY = 300;
  private checkpoints: { x: number; y: number; active: boolean }[] = [];

  // Level state
  private lives = MAX_LIVES;
  private coins = 0;
  private totalLevelCoins = 0;
  private keys = 0;
  private totalKeys = 0;
  private score = 0;
  private timeLeft = 180;
  private comboCount = 0;
  private comboTimer = 0;
  private enemiesStomped = 0;
  private coinBlockHits = 0;

  // Entities
  private coinEntities: CoinEntity[] = [];
  private powerUpEntities: PowerUpEntity[] = [];
  private keyEntities: KeyEntity[] = [];
  private heartEntities: HeartPickupEntity[] = [];
  private enemies: EnemyEntity[] = [];
  private movingPlatforms: MovingPlatform[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private nextEntityId = 1;

  // Camera & Juice
  private camX = 0;
  private camY = 0;
  private shakeTimer = 0;
  private shakeIntensity = 0;
  private hitstopTimer = 0;
  private ambientSpawnTimer = 0;
  private weatherParticles: WeatherParticle[] = [];
  private currentWeather: WeatherKind = 'clear';
  private weatherWeights: Record<WeatherKind, number> = {
    clear: 1,
    rain: 0,
    snow: 0,
    storm: 0,
    leaves: 0,
    petals: 0,
    sparks: 0,
  };
  private weatherSpawnAcc: Record<WeatherKind, number> = {
    clear: 0,
    rain: 0,
    snow: 0,
    storm: 0,
    leaves: 0,
    petals: 0,
    sparks: 0,
  };
  private lightningFlash = 0;
  private lightningTimer = 3.5;
  private deathTimer = 0;
  private deathHopStarted = false;

  // Input
  private keysHeld = new Set<string>();
  private touchInput = { left: false, right: false, jump: false, dash: false };
  private jumpQueued = false;
  private jumpReleasedQueued = false;
  private dashQueued = false;

  // HUD Callback
  private onHudUpdate: (hud: HudSnapshot) => void;
  private lastHudKey = '';

  constructor(canvas: HTMLCanvasElement, onHudUpdate: (hud: HudSnapshot) => void) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;
    this.onHudUpdate = onHudUpdate;

    this.loadLevel(0, true);
    this.bindEvents();
    soundEngine.startBgm();
  }

  private bindEvents(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    soundEngine.stopBgm();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
  }

  private handleBlur = (): void => {
    this.keysHeld.clear();
    this.touchInput = { left: false, right: false, jump: false, dash: false };
    this.dashQueued = false;
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    const code = e.code;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(code)) {
      e.preventDefault();
    }

    if (code === 'Escape' || code === 'KeyP') {
      if (this.gameState === 'PLAYING') {
        this.pause();
        return;
      } else if (this.gameState === 'PAUSED') {
        this.resume();
        return;
      }
    }

    if (!this.keysHeld.has(code)) {
      this.keysHeld.add(code);
      if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        this.jumpQueued = true;
      } else if (
        code === 'ShiftLeft' ||
        code === 'ShiftRight' ||
        code === 'KeyX' ||
        code === 'KeyJ' ||
        code === 'KeyK'
      ) {
        this.dashQueued = true;
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    const code = e.code;
    this.keysHeld.delete(code);
    if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
      this.jumpReleasedQueued = true;
    }
  };

  public setTouchControl(control: 'left' | 'right' | 'jump' | 'dash', pressed: boolean): void {
    if (control === 'jump') {
      if (pressed && !this.touchInput.jump) {
        this.jumpQueued = true;
      } else if (!pressed && this.touchInput.jump) {
        this.jumpReleasedQueued = true;
      }
    } else if (control === 'dash') {
      if (pressed && !this.touchInput.dash) {
        this.dashQueued = true;
      }
    }
    this.touchInput[control] = pressed;
  }

  public start(): void {
    this.lastTimestamp = performance.now();
    const loop = (now: number) => {
      const rawDt = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      this.update(dt);
      this.render();
      this.emitHud(false);

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  public setCharacter(id: CharacterId): void {
    this.characterId = id;
    soundEngine.playSelect();
    this.emitHud(true);
  }

  public selectLevel(index: number): void {
    const clamped = Math.max(0, Math.min(LEVELS.length - 1, index));
    this.loadLevel(clamped, true);
    soundEngine.playSelect();
    this.emitHud(true);
  }

  public startGame(levelIdx?: number): void {
    if (typeof levelIdx === 'number') {
      this.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, levelIdx));
    }
    this.score = 0;
    this.loadLevel(this.levelIndex, false);
    this.gameState = 'PLAYING';
    soundEngine.playUiClick();
    soundEngine.startBgm(this.level.biome);
    this.emitHud(true);
  }

  public nextLevel(): void {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.levelIndex++;
      this.loadLevel(this.levelIndex, false);
      this.gameState = 'PLAYING';
      soundEngine.playUiClick();
      soundEngine.startBgm(this.level.biome);
    } else {
      this.gameState = 'VICTORY';
    }
    this.emitHud(true);
  }

  public retryLevel(): void {
    this.loadLevel(this.levelIndex, false);
    this.gameState = 'PLAYING';
    soundEngine.playUiClick();
    soundEngine.startBgm(this.level.biome);
    this.emitHud(true);
  }

  public returnToTitle(): void {
    soundEngine.playUiClick();
    this.gameState = 'TITLE_MENU';
    this.loadLevel(this.levelIndex, true);
    soundEngine.startBgm();
    this.emitHud(true);
  }

  public pause(): void {
    if (this.gameState === 'PLAYING') {
      this.gameState = 'PAUSED';
      soundEngine.playUiClick();
      this.emitHud(true);
    }
  }

  public resume(): void {
    if (this.gameState === 'PAUSED') {
      this.gameState = 'PLAYING';
      soundEngine.playUiClick();
      this.emitHud(true);
    }
  }

  public toggleMute(): void {
    soundEngine.toggleMute();
    this.emitHud(true);
  }

  private loadLevel(index: number, keepTitleState: boolean): void {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.mapRows = this.level.mapRows.length;
    this.mapCols = this.level.mapRows[0].length;

    this.grid = [];
    this.coinEntities = [];
    this.powerUpEntities = [];
    this.keyEntities = [];
    this.heartEntities = [];
    this.particles = [];
    this.weatherParticles = [];
    this.floatingTexts = [];
    this.checkpoints = this.level.checkpointTiles.map((cp) => ({
      x: cp.x * TILE_SIZE + TILE_SIZE / 2,
      y: (cp.y + 1) * TILE_SIZE,
      active: false,
    }));

    const startWeather = this.level.weatherZones[0]?.weather ?? 'clear';
    this.currentWeather = startWeather;
    this.weatherWeights = {
      clear: startWeather === 'clear' ? 1 : 0,
      rain: startWeather === 'rain' ? 1 : 0,
      snow: startWeather === 'snow' ? 1 : 0,
      storm: startWeather === 'storm' ? 1 : 0,
      leaves: startWeather === 'leaves' ? 1 : 0,
      petals: startWeather === 'petals' ? 1 : 0,
      sparks: startWeather === 'sparks' ? 1 : 0,
    };
    this.lightningFlash = 0;
    this.lightningTimer = 3.5;

    this.lives = MAX_LIVES;
    this.coins = 0;
    this.keys = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.enemiesStomped = 0;
    this.coinBlockHits = 0;
    this.timeLeft = this.level.timeLimitSec;
    this.invulnTimer = 0;
    this.hurtTimer = 0;
    this.starTimer = 0;
    this.magnetTimer = 0;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.airStompCombo = 0;
    this.dashQueued = false;
    this.hitstopTimer = 0;
    this.shakeTimer = 0;
    this.pvx = 0;
    this.pvy = 0;
    this.facing = 1;
    this.onGround = false;
    this.jumpsRemaining = this.maxJumps;
    this.isDoubleJumping = false;

    let staticCoins = 0;
    let keyCount = 0;

    for (let r = 0; r < this.mapRows; r++) {
      const row: TileKind[] = [];
      const line = this.level.mapRows[r];
      for (let c = 0; c < this.mapCols; c++) {
        const ch = line[c];
        const cx = c * TILE_SIZE + TILE_SIZE / 2;
        const cy = r * TILE_SIZE + TILE_SIZE / 2;
        if (ch === '#') row.push('ground');
        else if (ch === 'D') row.push('dirt');
        else if (ch === 'B') row.push('brick');
        else if (ch === '=') row.push('bridge');
        else if (ch === '?') row.push('coinBlock');
        else if (ch === '^') row.push('spike');
        else if (ch === '~') row.push('water');
        else if (ch === 'S') row.push('spring');
        else {
          row.push('empty');
          if (ch === 'P') {
            this.spawnX = c * TILE_SIZE + (TILE_SIZE - PLAYER_W) / 2;
            this.spawnY = (r + 1) * TILE_SIZE - PLAYER_H;
            this.px = this.spawnX;
            this.py = this.spawnY;
          } else if (ch === 'C') {
            staticCoins++;
            this.coinEntities.push({
              id: this.nextEntityId++,
              x: cx,
              y: cy,
              vx: 0,
              vy: 0,
              radius: 9,
              isDynamic: false,
              bounces: 0,
              ttl: 9999,
              pickupDelay: 0,
              bobPhase: c * 0.45 + r * 0.2,
              collected: false,
            });
          } else if (ch === 'K') {
            keyCount++;
            this.keyEntities.push({
              id: this.nextEntityId++,
              x: cx,
              y: cy,
              bobPhase: c * 0.6,
              collected: false,
            });
          } else if (ch === 'H') {
            this.heartEntities.push({
              id: this.nextEntityId++,
              x: cx,
              y: cy,
              bobPhase: c * 0.5,
              collected: false,
            });
          }
        }
      }
      this.grid.push(row);
    }

    this.totalLevelCoins = staticCoins;
    this.totalKeys = keyCount;

    this.enemies = this.level.enemies.map((sp) => {
      const range = (sp.patrolRangeTiles ?? 3) * TILE_SIZE;
      const w = sp.kind === 'boss' ? 36 : 24;
      const h = sp.kind === 'boss' ? 36 : sp.kind === 'slime' ? 20 : 24;
      const startX = sp.tileX * TILE_SIZE;
      const startY = (sp.tileY + 1) * TILE_SIZE - h;
      const maxHp = sp.kind === 'boss' ? 3 : 1;
      const vx =
        sp.kind === 'boss' ? 105 : sp.kind === 'imp' ? 92 : sp.kind === 'chicken' ? 76 : 62;
      return {
        id: this.nextEntityId++,
        kind: sp.kind,
        x: startX,
        y: startY,
        w,
        h,
        vx,
        vy: 0,
        minX: Math.max(TILE_SIZE, startX - range),
        maxX: Math.min((this.mapCols - 2) * TILE_SIZE, startX + range),
        baseY: startY,
        dir: 1,
        animTime: Math.random() * 5,
        alive: true,
        squishTimer: 0,
        hp: maxHp,
        maxHp,
        hitCooldown: 0,
      };
    });

    this.movingPlatforms = this.level.movingPlatforms.map((mp) => ({
      x: mp.tileX * TILE_SIZE,
      y: mp.tileY * TILE_SIZE,
      w: mp.widthTiles * TILE_SIZE,
      h: 14,
      startX: mp.tileX * TILE_SIZE,
      startY: mp.tileY * TILE_SIZE,
      endX: (mp.tileX + mp.dxTiles) * TILE_SIZE,
      endY: (mp.tileY + mp.dyTiles) * TILE_SIZE,
      speed: mp.speed,
      progress: 0,
      dir: 1,
      vx: 0,
      vy: 0,
    }));

    this.camX = 0;
    this.camY = 0;
    soundEngine.setBgmBiome(this.level.biome);
    if (!keepTitleState) {
      this.gameState = 'PLAYING';
    }
  }

  private getInput(): InputState {
    const left =
      this.keysHeld.has('ArrowLeft') ||
      this.keysHeld.has('KeyA') ||
      this.touchInput.left;
    const right =
      this.keysHeld.has('ArrowRight') ||
      this.keysHeld.has('KeyD') ||
      this.touchInput.right;
    const jumpHeld =
      this.keysHeld.has('Space') ||
      this.keysHeld.has('ArrowUp') ||
      this.keysHeld.has('KeyW') ||
      this.touchInput.jump;

    const jumpJustPressed = this.jumpQueued;
    const jumpJustReleased = this.jumpReleasedQueued;
    this.jumpQueued = false;
    this.jumpReleasedQueued = false;

    return { left, right, jumpHeld, jumpJustPressed, jumpJustReleased };
  }

  private isSolidTile(kind: TileKind): boolean {
    return kind === 'ground' || kind === 'dirt' || kind === 'brick' || kind === 'coinBlock' || kind === 'usedBlock';
  }

  private getTile(col: number, row: number): TileKind {
    if (col < 0 || col >= this.mapCols) return 'ground';
    if (row < 0) return 'empty';
    if (row >= this.mapRows) return 'empty';
    return this.grid[row][col];
  }

  private update(dt: number): void {
    this.worldTime += dt;

    if (this.gameState === 'TITLE_MENU') {
      // Gentle scenic camera pan & character idle bounce on Title Screen
      const viewW = this.canvas.width;
      const maxCam = Math.max(0, this.mapCols * TILE_SIZE - viewW);
      this.camX = Math.min(maxCam, (Math.sin(this.worldTime * 0.22) * 0.5 + 0.5) * Math.min(maxCam, 420));
      this.animTime += dt;
      this.animState = 'idle';
      this.updateWeather(dt, false);
      this.updateAmbientParticles(dt);
      this.updateParticles(dt);
      return;
    }

    if (this.gameState === 'DYING') {
      this.deathTimer += dt;
      this.animTime += dt;
      this.animState = 'hurt';
      if (this.shakeTimer > 0) this.shakeTimer -= dt;
      if (this.deathTimer >= 0.35) {
        if (!this.deathHopStarted) {
          this.deathHopStarted = true;
          this.pvy = -450;
        }
        this.pvy = Math.min(720, this.pvy + GRAVITY * dt);
        this.py += this.pvy * dt;
      }
      this.updateParticles(dt);
      this.updateFloatingTexts(dt);
      if (this.deathTimer >= 2.75) {
        this.gameState = 'GAME_OVER';
        this.emitHud(true);
      }
      return;
    }

    if (this.gameState !== 'PLAYING') {
      this.updateParticles(dt);
      this.updateFloatingTexts(dt);
      return;
    }

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      if (this.shakeTimer > 0) this.shakeTimer -= dt;
      return;
    }

    // Level Timer
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.lives = 0;
      this.triggerDeathSequence();
      return;
    }

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.comboCount = 0;
    }

    if (this.invulnTimer > 0) this.invulnTimer = Math.max(0, this.invulnTimer - dt);
    if (this.hurtTimer > 0) this.hurtTimer = Math.max(0, this.hurtTimer - dt);
    if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);
    if (this.starTimer > 0) this.starTimer = Math.max(0, this.starTimer - dt);
    if (this.magnetTimer > 0) this.magnetTimer = Math.max(0, this.magnetTimer - dt);
    if (this.dashCooldown > 0) this.dashCooldown = Math.max(0, this.dashCooldown - dt);

    this.updateMovingPlatforms(dt);
    this.updatePlayer(dt);
    this.updateCoins(dt);
    this.updatePowerUps(dt);
    this.updateKeysAndHearts();
    this.updateEnemies(dt);
    this.updateCheckpointsAndGoal();
    this.updateWeather(dt, true);
    this.updateAmbientParticles(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);
    this.updateCamera(dt);
  }

  private updateMovingPlatforms(dt: number): void {
    for (const mp of this.movingPlatforms) {
      const prevX = mp.x;
      const prevY = mp.y;
      const dist = Math.hypot(mp.endX - mp.startX, mp.endY - mp.startY);
      const step = dist > 0 ? (mp.speed * TILE_SIZE * dt) / dist : 0;

      mp.progress += step * mp.dir;
      if (mp.progress >= 1) {
        mp.progress = 1;
        mp.dir = -1;
      } else if (mp.progress <= 0) {
        mp.progress = 0;
        mp.dir = 1;
      }

      const smooth = 0.5 - 0.5 * Math.cos(mp.progress * Math.PI);
      mp.x = mp.startX + (mp.endX - mp.startX) * smooth;
      mp.y = mp.startY + (mp.endY - mp.startY) * smooth;
      mp.vx = (mp.x - prevX) / Math.max(dt, 0.001);
      mp.vy = (mp.y - prevY) / Math.max(dt, 0.001);
    }
  }

  private updatePlayer(dt: number): void {
    const input = this.getInput();
    const char = getCharacterById(this.characterId);
    const starBoost = this.starTimer > 0 ? 1.24 : 1;
    const moveSpeed = BASE_MOVE_SPEED * char.speedBonus * starBoost;
    const jumpVy = BASE_JUMP_VY * char.jumpBonus;

    // Carry player with moving platform
    if (this.ridingPlatform && this.onGround) {
      this.px += this.ridingPlatform.vx * dt;
      this.py += this.ridingPlatform.vy * dt;
    }
    this.ridingPlatform = null;

    // Dash input & burst movement
    const wantDash = this.dashQueued;
    this.dashQueued = false;
    if (wantDash && this.dashCooldown <= 0 && this.dashTimer <= 0) {
      this.dashTimer = 0.15;
      this.dashCooldown = 0.85;
      this.pvx = this.facing * 540;
      this.pvy = Math.min(this.pvy, 0);
      soundEngine.playDash();
      this.spawnRing(this.px + PLAYER_W / 2, this.py + PLAYER_H / 2, char.trailColor);
      this.spawnDustBurst(this.px + PLAYER_W / 2, this.py + PLAYER_H * 0.7, 6, char.trailColor);
    }

    if (this.dashTimer > 0) {
      this.dashTimer = Math.max(0, this.dashTimer - dt);
      this.pvx = this.facing * 540;
      this.pvy = 0;
      if (Math.random() < 0.85) {
        this.particles.push({
          x: this.px + PLAYER_W / 2,
          y: this.py + PLAYER_H / 2 + (Math.random() - 0.5) * 10,
          vx: -this.facing * 45,
          vy: (Math.random() - 0.5) * 20,
          size: 8,
          color: char.trailColor,
          alpha: 0.72,
          life: 0.18,
          maxLife: 0.18,
          gravity: 0,
          shape: 'square',
        });
      }
    } else if (this.wallJumpLockTimer > 0) {
      this.wallJumpLockTimer -= dt;
    } else {
      let targetVx = 0;
      if (input.left) targetVx -= moveSpeed;
      if (input.right) targetVx += moveSpeed;

      const accel = this.onGround ? 18 : 11;
      this.pvx += (targetVx - this.pvx) * Math.min(1, accel * dt);
      if (Math.abs(targetVx) < 1 && Math.abs(this.pvx) < 6) {
        this.pvx = 0;
      }
      if (targetVx > 0) this.facing = 1;
      else if (targetVx < 0) this.facing = -1;
    }

    if (this.starTimer > 0 && Math.random() < 0.45) {
      const hue = Math.floor((this.worldTime * 360) % 360);
      this.particles.push({
        x: this.px + Math.random() * PLAYER_W,
        y: this.py + Math.random() * PLAYER_H,
        vx: (Math.random() - 0.5) * 40,
        vy: -20 - Math.random() * 30,
        size: 5,
        color: `hsl(${hue}, 95%, 65%)`,
        alpha: 0.9,
        life: 0.28,
        maxLife: 0.28,
        gravity: 0,
        shape: 'square',
      });
    }

    // Coyote & Jump Buffer
    if (this.onGround) {
      this.coyoteTimer = 0.12;
      this.wallCoyoteTimer = 0;
      this.jumpsRemaining = this.maxJumps;
      this.isDoubleJumping = false;
      this.airStompCombo = 0;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
      if (this.coyoteTimer <= 0 && this.jumpsRemaining >= this.maxJumps) {
        // Walking off a ledge without a ground jump leaves 1 air jump allowance
        this.jumpsRemaining = this.maxJumps - 1;
      }
      if (this.onWall !== 0) {
        this.lastWallDir = this.onWall;
        this.wallCoyoteTimer = 0.14;
      } else {
        this.wallCoyoteTimer = Math.max(0, this.wallCoyoteTimer - dt);
      }
    }

    if (input.jumpJustPressed) {
      this.jumpBufferTimer = 0.14;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // Execute Jump / Wall Jump / Double Jump using jump count allowance
    if (this.jumpBufferTimer > 0) {
      if (this.coyoteTimer > 0 && this.jumpsRemaining > 0) {
        this.pvy = jumpVy;
        this.onGround = false;
        this.dashTimer = 0;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.jumpsRemaining = Math.max(0, this.maxJumps - 1);
        this.isDoubleJumping = false;
        soundEngine.playJump();
        this.spawnDustBurst(this.px + PLAYER_W / 2, this.py + PLAYER_H, 6, char.trailColor);
      } else if (this.onWall !== 0 || (this.wallCoyoteTimer > 0 && this.lastWallDir !== 0)) {
        // Climb/jump upward off wall cleanly without bouncing backward off the wall
        this.pvy = WALL_JUMP_VY * char.jumpBonus;
        this.dashTimer = 0;
        this.wallJumpLockTimer = 0;
        this.wallCoyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.jumpsRemaining = Math.max(0, this.maxJumps - 1);
        this.isDoubleJumping = false;
        soundEngine.playWallJump();
        this.spawnRing(this.px + PLAYER_W / 2, this.py + PLAYER_H / 2, '#ffffff');
      } else if (this.jumpsRemaining > 0) {
        this.pvy = DOUBLE_JUMP_VY * char.jumpBonus;
        this.dashTimer = 0;
        this.jumpsRemaining -= 1;
        this.isDoubleJumping = true;
        this.jumpBufferTimer = 0;
        soundEngine.playDoubleJump();
        this.spawnRing(this.px + PLAYER_W / 2, this.py + PLAYER_H, '#ffffff');
        this.spawnDustBurst(this.px + PLAYER_W / 2, this.py + PLAYER_H, 5, char.trailColor);
      }
    }

    // Gentle variable jump height (keeps quick mobile taps high & responsive)
    if (input.jumpJustReleased && this.pvy < -180) {
      this.pvy *= 0.74;
    }

    // Gravity & Wall Slide
    if (this.dashTimer <= 0) {
      this.pvy = Math.min(MAX_FALL_SPEED, this.pvy + GRAVITY * dt);
    }

    // Horizontal Movement & Collision
    this.px += this.pvx * dt;
    this.px = Math.max(0, Math.min(this.mapCols * TILE_SIZE - PLAYER_W, this.px));
    this.onWall = 0;

    const topRow = Math.floor((this.py + 2) / TILE_SIZE);
    const bottomRow = Math.floor((this.py + PLAYER_H - 2) / TILE_SIZE);

    if (this.pvx > 0) {
      const rightCol = Math.floor((this.px + PLAYER_W) / TILE_SIZE);
      for (let r = topRow; r <= bottomRow; r++) {
        if (this.isSolidTile(this.getTile(rightCol, r))) {
          this.px = rightCol * TILE_SIZE - PLAYER_W;
          this.pvx = 0;
          break;
        }
      }
    } else if (this.pvx < 0) {
      const leftCol = Math.floor(this.px / TILE_SIZE);
      for (let r = topRow; r <= bottomRow; r++) {
        if (this.isSolidTile(this.getTile(leftCol, r))) {
          this.px = (leftCol + 1) * TILE_SIZE;
          this.pvx = 0;
          break;
        }
      }
    }

    // 1px side wall sensor so wall-slide & wall-jump stay active even if direction key is released briefly
    if (!this.onGround) {
      const rightSensorCol = Math.floor((this.px + PLAYER_W + 1.5) / TILE_SIZE);
      const leftSensorCol = Math.floor((this.px - 1.5) / TILE_SIZE);
      for (let r = topRow; r <= bottomRow; r++) {
        if (this.isSolidTile(this.getTile(rightSensorCol, r))) {
          this.onWall = 1;
          break;
        }
        if (this.isSolidTile(this.getTile(leftSensorCol, r))) {
          this.onWall = -1;
          break;
        }
      }
    }

    // Stick / Cling slowly to walls when airborne (like reference video)
    if (this.onWall !== 0 && this.pvy > 0) {
      const pressingIntoWall =
        (this.onWall === 1 && input.right) || (this.onWall === -1 && input.left);
      const maxSlide = pressingIntoWall ? 28 : WALL_SLIDE_SPEED;
      if (this.pvy > maxSlide) {
        this.pvy = maxSlide;
      }
      if (Math.random() < 0.3) {
        this.particles.push({
          x: this.onWall === 1 ? this.px + PLAYER_W : this.px,
          y: this.py + PLAYER_H * 0.6,
          vx: -this.onWall * 15,
          vy: -12,
          size: 4,
          color: '#ffffff',
          alpha: 0.85,
          life: 0.25,
          maxLife: 0.25,
          gravity: 0,
          shape: 'circle',
        });
      }
    }

    // Vertical Movement & Collision
    const prevBottom = this.py + PLAYER_H;
    this.py += this.pvy * dt;
    this.onGround = false;

    const leftCol = Math.floor((this.px + 2) / TILE_SIZE);
    const rightCol = Math.floor((this.px + PLAYER_W - 2) / TILE_SIZE);

    if (this.pvy >= 0) {
      const footRow = Math.floor((this.py + PLAYER_H) / TILE_SIZE);
      for (let c = leftCol; c <= rightCol; c++) {
        const tile = this.getTile(c, footRow);
        if (this.isSolidTile(tile)) {
          this.py = footRow * TILE_SIZE - PLAYER_H;
          this.pvy = 0;
          this.onGround = true;
          this.isDoubleJumping = false;
          break;
        } else if (tile === 'bridge') {
          const bridgeTop = footRow * TILE_SIZE;
          if (prevBottom <= bridgeTop + 8) {
            this.py = bridgeTop - PLAYER_H;
            this.pvy = 0;
            this.onGround = true;
            this.isDoubleJumping = false;
            break;
          }
        } else if (tile === 'spring') {
          const springTop = footRow * TILE_SIZE + 10;
          if (prevBottom <= springTop + 10 && this.py + PLAYER_H >= springTop) {
            this.py = springTop - PLAYER_H;
            this.pvy = SPRING_VY;
            this.onGround = false;
            this.jumpsRemaining = Math.max(0, this.maxJumps - 1);
            soundEngine.playSpring();
            this.spawnDustBurst(c * TILE_SIZE + TILE_SIZE / 2, springTop, 8, '#fde047');
            break;
          }
        }
      }

      // Check Moving Platforms
      if (!this.onGround) {
        for (const mp of this.movingPlatforms) {
          const overlapsX = this.px + PLAYER_W > mp.x + 2 && this.px < mp.x + mp.w - 2;
          if (overlapsX && prevBottom <= mp.y + 8 && this.py + PLAYER_H >= mp.y) {
            this.py = mp.y - PLAYER_H;
            this.pvy = 0;
            this.onGround = true;
            this.isDoubleJumping = false;
            this.ridingPlatform = mp;
            break;
          }
        }
      }
    } else {
      const headRow = Math.floor(this.py / TILE_SIZE);
      for (let c = leftCol; c <= rightCol; c++) {
        const tile = this.getTile(c, headRow);
        if (this.isSolidTile(tile)) {
          this.py = (headRow + 1) * TILE_SIZE;
          this.pvy = 0;
          if (tile === 'coinBlock') {
            this.triggerCoinBlock(c, headRow);
          }
          break;
        }
      }
    }

    // Check Hazards: Spikes & Water & Pit
    this.checkHazards();

    // Update Animation State & Run Dust
    this.animTime += dt;
    if (this.hurtTimer > 0) {
      this.animState = 'hurt';
    } else if (this.onWall !== 0 && !this.onGround) {
      this.animState = 'wallSlide';
    } else if (!this.onGround) {
      if (this.isDoubleJumping) this.animState = 'doubleJump';
      else if (this.pvy < 0) this.animState = 'jump';
      else this.animState = 'fall';
    } else if (Math.abs(this.pvx) > 25) {
      this.animState = 'run';
      this.dustTimer += dt;
      if (this.dustTimer > 0.085) {
        this.dustTimer = 0;
        this.particles.push({
          x: this.px + PLAYER_W / 2 - this.facing * 8,
          y: this.py + PLAYER_H - 2,
          vx: -this.facing * (35 + Math.random() * 25),
          vy: -12 - Math.random() * 18,
          size: 5 + Math.random() * 4,
          color: '#ffffff',
          alpha: 0.78,
          life: 0.28,
          maxLife: 0.28,
          gravity: -20,
          shape: 'circle',
        });
      }
    } else {
      this.animState = 'idle';
    }
  }

  private triggerCoinBlock(col: number, row: number): void {
    this.grid[row][col] = 'usedBlock';
    this.coinBlockHits++;
    soundEngine.playBlockHit();
    this.shake(0.1, 3);

    const cx = col * TILE_SIZE + TILE_SIZE / 2;
    const cy = row * TILE_SIZE - 4;

    if (this.coinBlockHits === 1) {
      const kind = this.levelIndex % 2 === 0 ? 'star' : 'magnet';
      this.powerUpEntities.push({
        id: this.nextEntityId++,
        kind,
        x: cx,
        y: cy,
        vx: this.facing * 85,
        vy: -280,
        bobPhase: 0,
        collected: false,
      });
      this.addFloatingText(cx, cy - 12, kind === 'star' ? 'STAR SHIELD!' : 'COIN MAGNET!', '#fde047');
      this.spawnDustBurst(cx, row * TILE_SIZE, 8, '#fde047');
      return;
    }

    // Pop 3 bouncing physical coins out!
    for (let i = 0; i < 3; i++) {
      this.coinEntities.push({
        id: this.nextEntityId++,
        x: cx,
        y: cy,
        vx: (i - 1) * 75 + (Math.random() - 0.5) * 30,
        vy: -310 - Math.random() * 70,
        radius: 9,
        isDynamic: true,
        bounces: 0,
        ttl: 9,
        pickupDelay: 0.18,
        bobPhase: Math.random() * 6,
        collected: false,
      });
    }
    this.spawnDustBurst(cx, row * TILE_SIZE, 6, '#fbbf24');
  }

  private checkHazards(): void {
    const c1 = Math.floor((this.px + 4) / TILE_SIZE);
    const c2 = Math.floor((this.px + PLAYER_W - 4) / TILE_SIZE);
    const r1 = Math.floor((this.py + 8) / TILE_SIZE);
    const r2 = Math.floor((this.py + PLAYER_H - 2) / TILE_SIZE);

    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const tile = this.getTile(c, r);
        if (tile === 'spike') {
          // Only hurt if overlapping lower half of spike tile
          if (this.py + PLAYER_H > r * TILE_SIZE + 16) {
            this.damagePlayer(this.px + PLAYER_W / 2 > c * TILE_SIZE + 16 ? 1 : -1);
            return;
          }
        } else if (tile === 'water') {
          soundEngine.playSplash();
          this.spawnDustBurst(this.px + PLAYER_W / 2, r * TILE_SIZE + 8, 12, '#bae6fd');
          this.damagePlayer(0, true);
          return;
        }
      }
    }

    // Bottomless fall
    if (this.py > this.mapRows * TILE_SIZE + 40) {
      this.damagePlayer(0, true);
    }
  }

  private damagePlayer(knockDir: number, respawnAtCheckpoint = false): void {
    if (this.invulnTimer > 0 && !respawnAtCheckpoint) return;

    this.lives = Math.max(0, this.lives - 1);
    this.comboCount = 0;
    this.hurtTimer = 0.35;
    this.invulnTimer = 1.45;
    this.hitstopTimer = 0.048;
    this.shake(0.24, 6);

    if (this.lives <= 0) {
      this.py = Math.min(this.py, this.mapRows * TILE_SIZE - 44);
      this.spawnDustBurst(this.px + PLAYER_W / 2, this.py + PLAYER_H / 2, 12, '#ef4444');
      this.triggerDeathSequence();
      return;
    }

    soundEngine.playHurt();

    // Scatter up to 5 coins when hit ("coinnya jatuh")!
    const dropCount = Math.min(this.coins, 5);
    if (dropCount > 0) {
      this.coins -= dropCount;
      soundEngine.playCoinDrop();
      for (let i = 0; i < dropCount; i++) {
        const angle = -Math.PI * 0.2 - (i / Math.max(1, dropCount - 1)) * Math.PI * 0.6;
        const speed = 150 + Math.random() * 90;
        this.coinEntities.push({
          id: this.nextEntityId++,
          x: this.px + PLAYER_W / 2,
          y: this.py + 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 120,
          radius: 9,
          isDynamic: true,
          bounces: 0,
          ttl: 6.5,
          pickupDelay: 0.45,
          bobPhase: i,
          collected: false,
          droppedFromPlayer: true,
        });
      }
      this.addFloatingText(this.px + PLAYER_W / 2, this.py - 8, `-${dropCount} COINS!`, '#fbbf24');
    }

    this.addFloatingText(this.px + PLAYER_W / 2, this.py - 22, '-1 HEART', '#ef4444');
    this.spawnDustBurst(this.px + PLAYER_W / 2, this.py + PLAYER_H / 2, 10, '#ef4444');

    if (respawnAtCheckpoint) {
      this.px = this.spawnX;
      this.py = this.spawnY;
      this.pvx = 0;
      this.pvy = 0;
    } else {
      this.pvy = -290;
      this.pvx = (knockDir !== 0 ? knockDir : -this.facing) * 190;
    }
  }

  private triggerDeathSequence(): void {
    this.gameState = 'DYING';
    this.deathTimer = 0;
    this.deathHopStarted = false;
    this.pvx = 0;
    this.pvy = 0;
    this.invulnTimer = 0;
    this.hurtTimer = 3.0;
    this.animState = 'hurt';
    soundEngine.stopBgm();
    soundEngine.playGameOver();
    this.emitHud(true);
  }

  private updateCoins(dt: number): void {
    const pCx = this.px + PLAYER_W / 2;
    const pCy = this.py + PLAYER_H / 2;

    for (const coin of this.coinEntities) {
      if (coin.collected) continue;

      if (coin.pickupDelay > 0) coin.pickupDelay -= dt;

      if (coin.isDynamic) {
        coin.ttl -= dt;
        if (coin.ttl <= 0) {
          coin.collected = true;
          continue;
        }

        coin.vy = Math.min(540, coin.vy + GRAVITY * 0.85 * dt);
        coin.x += coin.vx * dt;
        coin.y += coin.vy * dt;

        // Horizontal bounce off walls
        const col = Math.floor(coin.x / TILE_SIZE);
        const row = Math.floor(coin.y / TILE_SIZE);
        if (this.isSolidTile(this.getTile(col, row))) {
          coin.vx = -coin.vx * 0.7;
          coin.x += coin.vx * dt * 2;
        }

        // Floor / bridge bounce when coin falls!
        const footRow = Math.floor((coin.y + coin.radius) / TILE_SIZE);
        const curCol = Math.floor(coin.x / TILE_SIZE);
        const belowTile = this.getTile(curCol, footRow);

        if (coin.vy > 0 && (this.isSolidTile(belowTile) || belowTile === 'bridge')) {
          coin.y = footRow * TILE_SIZE - coin.radius;
          if (Math.abs(coin.vy) > 75) {
            coin.vy = -coin.vy * 0.56;
            coin.vx *= 0.78;
            coin.bounces++;
            if (coin.bounces <= 3) {
              soundEngine.playCoinBounce();
              this.spawnDustBurst(coin.x, coin.y + coin.radius, 3, '#fde047');
            }
          } else {
            coin.vy = 0;
            coin.vx *= 0.85;
          }
        } else if (belowTile === 'water') {
          // Coin fell into water! Splash & vanish
          soundEngine.playSplash();
          this.spawnDustBurst(coin.x, footRow * TILE_SIZE + 6, 7, '#bae6fd');
          coin.collected = true;
          continue;
        } else if (coin.y > this.mapRows * TILE_SIZE + 30) {
          // Coin fell into bottomless void
          coin.collected = true;
          continue;
        }
      }

      // Coin Magnet attraction
      if (this.magnetTimer > 0 && coin.pickupDelay <= 0) {
        const distToPlayer = Math.hypot(pCx - coin.x, pCy - coin.y);
        if (distToPlayer > 4 && distToPlayer < 185) {
          const pull = 380 * dt;
          coin.x += ((pCx - coin.x) / distToPlayer) * pull;
          coin.y += ((pCy - coin.y) / distToPlayer) * pull;
        }
      }

      // Check player pickup
      if (coin.pickupDelay <= 0) {
        const dist = Math.hypot(pCx - coin.x, pCy - coin.y);
        if (dist < 22) {
          coin.collected = true;
          this.coins++;
          this.comboCount++;
          this.comboTimer = 2.0;
          const pts = coin.droppedFromPlayer ? 10 : 50 + Math.min(this.comboCount * 5, 50);
          this.score += pts;
          soundEngine.playCoin();
          this.spawnRing(coin.x, coin.y, '#fde047');
          this.spawnDustBurst(coin.x, coin.y, 5, '#fef08a');
          this.addFloatingText(coin.x, coin.y - 10, `+${pts}`, '#fde047');
        }
      }
    }

    this.coinEntities = this.coinEntities.filter((c) => !c.collected);
  }

  private updatePowerUps(dt: number): void {
    const pCx = this.px + PLAYER_W / 2;
    const pCy = this.py + PLAYER_H / 2;

    for (const pu of this.powerUpEntities) {
      if (pu.collected) continue;

      pu.vy = Math.min(520, pu.vy + GRAVITY * 0.8 * dt);
      pu.x += pu.vx * dt;
      pu.y += pu.vy * dt;

      const col = Math.floor(pu.x / TILE_SIZE);
      const row = Math.floor(pu.y / TILE_SIZE);
      if (this.isSolidTile(this.getTile(col, row))) {
        pu.vx = -pu.vx;
        pu.x += pu.vx * dt * 2;
      }

      const footRow = Math.floor((pu.y + 10) / TILE_SIZE);
      const curCol = Math.floor(pu.x / TILE_SIZE);
      const belowTile = this.getTile(curCol, footRow);
      if (pu.vy > 0 && (this.isSolidTile(belowTile) || belowTile === 'bridge')) {
        pu.y = footRow * TILE_SIZE - 10;
        pu.vy = -190;
      } else if (pu.y > this.mapRows * TILE_SIZE + 30) {
        pu.collected = true;
        continue;
      }

      if (Math.hypot(pCx - pu.x, pCy - pu.y) < 24) {
        pu.collected = true;
        this.score += 200;
        soundEngine.playPowerUp();
        this.spawnRing(pu.x, pu.y, '#fde047');
        this.spawnDustBurst(pu.x, pu.y, 12, '#fef08a');
        if (pu.kind === 'star') {
          this.starTimer = 8.0;
          this.addFloatingText(pu.x, pu.y - 14, 'STAR SHIELD 8s!', '#fde047');
        } else {
          this.magnetTimer = 10.0;
          this.addFloatingText(pu.x, pu.y - 14, 'COIN MAGNET 10s!', '#38bdf8');
        }
      }
    }

    this.powerUpEntities = this.powerUpEntities.filter((p) => !p.collected);
  }

  private updateKeysAndHearts(): void {
    const pCx = this.px + PLAYER_W / 2;
    const pCy = this.py + PLAYER_H / 2;

    for (const key of this.keyEntities) {
      if (key.collected) continue;
      if (Math.hypot(pCx - key.x, pCy - key.y) < 24) {
        key.collected = true;
        this.keys++;
        this.score += 250;
        soundEngine.playKey();
        this.spawnRing(key.x, key.y, '#fbbf24');
        this.spawnDustBurst(key.x, key.y, 10, '#fef08a');
        this.addFloatingText(key.x, key.y - 12, 'KEY +250!', '#fbbf24');
      }
    }

    for (const heart of this.heartEntities) {
      if (heart.collected) continue;
      if (Math.hypot(pCx - heart.x, pCy - heart.y) < 24) {
        heart.collected = true;
        if (this.lives < MAX_LIVES) {
          this.lives++;
          this.addFloatingText(heart.x, heart.y - 12, '+1 HEART!', '#4ade80');
        } else {
          this.score += 300;
          this.addFloatingText(heart.x, heart.y - 12, '+300 BONUS!', '#4ade80');
        }
        soundEngine.playHeart();
        this.spawnRing(heart.x, heart.y, '#f87171');
        this.spawnDustBurst(heart.x, heart.y, 8, '#fecaca');
      }
    }
  }

  private spawnEnemyCoins(enemy: EnemyEntity, count: number): void {
    for (let i = 0; i < count; i++) {
      this.coinEntities.push({
        id: this.nextEntityId++,
        x: enemy.x + enemy.w / 2,
        y: enemy.y + 4,
        vx: (i % 2 === 0 ? -1 : 1) * (75 + Math.random() * 65),
        vy: -260 - Math.random() * 80,
        radius: 9,
        isDynamic: true,
        bounces: 0,
        ttl: 8,
        pickupDelay: 0.2,
        bobPhase: i,
        collected: false,
      });
    }
  }

  private updateEnemies(dt: number): void {
    for (const enemy of this.enemies) {
      enemy.animTime += dt;
      if (enemy.hitCooldown > 0) {
        enemy.hitCooldown = Math.max(0, enemy.hitCooldown - dt);
      }
      if (!enemy.alive) {
        enemy.squishTimer -= dt;
        continue;
      }

      if (enemy.kind === 'bird' || enemy.kind === 'bat') {
        enemy.x += enemy.vx * enemy.dir * dt;
        enemy.y = enemy.baseY + Math.sin(enemy.animTime * 4) * 18;
        if (enemy.x <= enemy.minX) {
          enemy.x = enemy.minX;
          enemy.dir = 1;
        } else if (enemy.x >= enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.dir = -1;
        }
      } else {
        enemy.x += enemy.vx * enemy.dir * dt;
        if (enemy.x <= enemy.minX) {
          enemy.x = enemy.minX;
          enemy.dir = 1;
        } else if (enemy.x >= enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.dir = -1;
        }
        // Turn around if hitting a solid wall or edge
        const probeX = enemy.dir === 1 ? enemy.x + enemy.w + 2 : enemy.x - 2;
        const probeCol = Math.floor(probeX / TILE_SIZE);
        const midRow = Math.floor((enemy.y + enemy.h / 2) / TILE_SIZE);
        const belowRow = Math.floor((enemy.y + enemy.h + 4) / TILE_SIZE);
        if (
          this.isSolidTile(this.getTile(probeCol, midRow)) ||
          (!this.isSolidTile(this.getTile(probeCol, belowRow)) && this.getTile(probeCol, belowRow) !== 'bridge')
        ) {
          enemy.dir = (enemy.dir * -1) as 1 | -1;
        }
      }

      // Player vs Enemy Collision
      const overlapX = this.px + PLAYER_W - 2 > enemy.x + 2 && this.px + 2 < enemy.x + enemy.w - 2;
      const overlapY = this.py + PLAYER_H > enemy.y + 2 && this.py + 2 < enemy.y + enemy.h;
      if (overlapX && overlapY) {
        const playerBottom = this.py + PLAYER_H;
        const isStomp = this.pvy > 10 && playerBottom - this.pvy * dt <= enemy.y + enemy.h * 0.55;
        const starHit = this.starTimer > 0;

        if (starHit || isStomp) {
          if (enemy.kind === 'boss') {
            if (enemy.hitCooldown > 0) {
              if (isStomp) this.pvy = -420;
              continue;
            }
            enemy.hp -= 1;
            if (isStomp) {
              this.pvy = -420;
              this.jumpsRemaining = Math.max(0, this.maxJumps - 1);
            }
            this.hitstopTimer = 0.05;
            this.shake(0.16, 5);
            soundEngine.playBossHit();

            if (enemy.hp > 0) {
              enemy.hitCooldown = 0.45;
              enemy.vx += 24;
              this.score += 250;
              this.spawnRing(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#fb923c');
              this.spawnDustBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 10, '#fed7aa');
              this.addFloatingText(
                enemy.x + enemy.w / 2,
                enemy.y - 16,
                `BOSS HIT! (${enemy.hp} HP)`,
                '#fb923c'
              );
            } else {
              enemy.alive = false;
              enemy.squishTimer = 0.65;
              this.enemiesStomped++;
              this.score += 1000;
              this.spawnRing(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#fde047');
              this.spawnDustBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 22, '#fde047');
              this.addFloatingText(enemy.x + enemy.w / 2, enemy.y - 18, '+1000 BOSS KO!', '#fde047');
              this.spawnEnemyCoins(enemy, 8);
            }
          } else {
            enemy.alive = false;
            enemy.squishTimer = 0.45;
            this.enemiesStomped++;
            if (isStomp) {
              this.airStompCombo++;
              this.pvy = -385;
              this.jumpsRemaining = Math.max(0, this.maxJumps - 1);
            }
            const mult = isStomp ? this.airStompCombo : 1;
            const pts = 150 * mult;
            this.hitstopTimer = 0.04;
            this.shake(0.12, 4);
            this.score += pts;
            soundEngine.playStomp();
            this.spawnRing(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#ffffff');
            this.spawnDustBurst(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 10, '#fef08a');
            const label =
              starHit && !isStomp
                ? `+${pts} STAR KO!`
                : mult > 1
                  ? `+${pts} ${mult}x COMBO!`
                  : '+150 STOMP!';
            this.addFloatingText(
              enemy.x + enemy.w / 2,
              enemy.y - 10,
              label,
              mult > 1 || starHit ? '#fde047' : '#4ade80'
            );
            this.spawnEnemyCoins(enemy, 2);
          }
        } else if (enemy.hitCooldown <= 0) {
          this.damagePlayer(this.px < enemy.x ? -1 : 1);
        }
      }
    }

    this.enemies = this.enemies.filter((e) => e.alive || e.squishTimer > 0);
  }

  private updateCheckpointsAndGoal(): void {
    const pCx = this.px + PLAYER_W / 2;
    const pBottom = this.py + PLAYER_H;

    for (const cp of this.checkpoints) {
      if (!cp.active && Math.abs(pCx - cp.x) < 28 && Math.abs(pBottom - cp.y) < 48) {
        cp.active = true;
        this.spawnX = cp.x - PLAYER_W / 2;
        this.spawnY = cp.y - PLAYER_H;
        soundEngine.playCheckpoint();
        this.spawnRing(cp.x, cp.y - 24, '#4ade80');
        this.addFloatingText(cp.x, cp.y - 50, 'CHECKPOINT!', '#4ade80');
      }
    }

    const goalX = this.level.goalTile.x * TILE_SIZE + TILE_SIZE / 2;
    const goalBottom = (this.level.goalTile.y + 1) * TILE_SIZE;
    if (Math.abs(pCx - goalX) < 28 && Math.abs(pBottom - goalBottom) < 105) {
      // Level Clear!
      const timeBonus = Math.floor(this.timeLeft) * 10;
      const lifeBonus = this.lives * 100;
      const keyBonus = this.keys >= this.totalKeys ? 500 : 0;
      this.score += timeBonus + lifeBonus + keyBonus;
      this.animState = 'win';
      soundEngine.stopBgm();
      soundEngine.playLevelClear();
      if (keyBonus > 0) {
        soundEngine.playBonusFanfare();
        this.addFloatingText(goalX, goalBottom - 88, '3-KEY BONUS +500!', '#fde047');
        this.spawnDustBurst(goalX, goalBottom - 70, 20, '#fef08a');
      }
      this.spawnDustBurst(goalX, goalBottom - 60, 22, '#fde047');

      if (this.levelIndex === LEVELS.length - 1) {
        this.gameState = 'VICTORY';
      } else {
        this.gameState = 'LEVEL_CLEAR';
      }
      this.emitHud(true);
    }
  }

  private updateWeather(dt: number, allowToast: boolean): void {
    const goalPx = Math.max(1, this.level.goalTile.x * TILE_SIZE);
    const progress = Math.max(0, Math.min(1, (allowToast ? this.px : this.camX) / goalPx));
    const zones = this.level.weatherZones;

    let activeZone = zones[0] ?? { fromProgress: 0, weather: 'clear' as WeatherKind, label: 'Clear' };
    for (const z of zones) {
      if (progress >= z.fromProgress) {
        activeZone = z;
      }
    }

    const targetWeather = activeZone.weather;
    if (targetWeather !== this.currentWeather) {
      this.currentWeather = targetWeather;
      if (allowToast && activeZone.label) {
        this.addFloatingText(this.px + PLAYER_W / 2, this.py - 28, activeZone.label.toUpperCase(), '#bae6fd');
      }
    }

    // Smooth crossfade weights (~2.4 seconds per weather shift)
    const rate = dt * 0.42;
    const allKinds: WeatherKind[] = ['clear', 'rain', 'snow', 'storm', 'leaves', 'petals', 'sparks'];
    for (const k of allKinds) {
      if (k === targetWeather) {
        this.weatherWeights[k] = Math.min(1, this.weatherWeights[k] + rate);
      } else {
        this.weatherWeights[k] = Math.max(0, this.weatherWeights[k] - rate);
      }
    }

    // Lightning flash during storm
    if (this.lightningFlash > 0) {
      this.lightningFlash = Math.max(0, this.lightningFlash - dt * 3.4);
    }
    if (this.weatherWeights.storm > 0.3) {
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.lightningFlash = 0.35 * this.weatherWeights.storm;
        this.lightningTimer = 3.2 + Math.random() * 4.5;
      }
    }

    const viewW = this.canvas.width;
    const viewH = this.canvas.height;

    const spawnRates: Record<WeatherKind, number> = {
      clear: 0,
      rain: 95,
      storm: 145,
      snow: 38,
      leaves: 12,
      petals: 14,
      sparks: 16,
    };

    for (const k of allKinds) {
      const weight = this.weatherWeights[k];
      if (weight <= 0.02 || spawnRates[k] === 0) continue;
      this.weatherSpawnAcc[k] += spawnRates[k] * weight * dt;
      while (this.weatherSpawnAcc[k] >= 1 && this.weatherParticles.length < 180) {
        this.weatherSpawnAcc[k] -= 1;
        const spawnX = this.camX - 60 + Math.random() * (viewW + 160);
        if (k === 'rain' || k === 'storm') {
          const isStorm = k === 'storm';
          this.weatherParticles.push({
            kind: k,
            x: spawnX,
            y: this.camY - 12,
            vx: isStorm ? -175 : -95,
            vy: isStorm ? 640 : 510,
            size: isStorm ? 14 : 11,
            color: isStorm ? '#93c5fd' : '#bae6fd',
            alpha: (isStorm ? 0.65 : 0.5) * weight,
            phase: 0,
          });
        } else if (k === 'snow') {
          this.weatherParticles.push({
            kind: 'snow',
            x: spawnX,
            y: this.camY - 8,
            vx: -18 + (Math.random() - 0.5) * 20,
            vy: 48 + Math.random() * 42,
            size: 2 + Math.floor(Math.random() * 3),
            color: '#f8fafc',
            alpha: (0.65 + Math.random() * 0.25) * weight,
            phase: Math.random() * Math.PI * 2,
          });
        } else if (k === 'leaves') {
          const leafColors = ['#f97316', '#facc15', '#22c55e', '#ea580c'];
          this.weatherParticles.push({
            kind: 'leaves',
            x: spawnX,
            y: this.camY - 8,
            vx: -42 - Math.random() * 28,
            vy: 46 + Math.random() * 28,
            size: 5 + Math.floor(Math.random() * 3),
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            alpha: 0.85 * weight,
            phase: Math.random() * Math.PI * 2,
          });
        } else if (k === 'petals') {
          const petalColors = ['#fbcfe8', '#f9a8d4', '#fef08a'];
          this.weatherParticles.push({
            kind: 'petals',
            x: spawnX,
            y: this.camY - 8,
            vx: -26 - Math.random() * 18,
            vy: 34 + Math.random() * 24,
            size: 4,
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
            alpha: 0.85 * weight,
            phase: Math.random() * Math.PI * 2,
          });
        } else if (k === 'sparks') {
          const sparkColors =
            this.level.biome === 'volcano'
              ? ['#fb923c', '#fde047', '#f87171']
              : ['#c084fc', '#fef08a', '#7dd3fc'];
          this.weatherParticles.push({
            kind: 'sparks',
            x: spawnX,
            y: this.camY + viewH + 8,
            vx: (Math.random() - 0.5) * 24,
            vy: -38 - Math.random() * 35,
            size: 2 + Math.floor(Math.random() * 2),
            color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            alpha: 0.85 * weight,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    const nextWeatherParticles: WeatherParticle[] = [];
    for (const wp of this.weatherParticles) {
      wp.phase += dt * 3;
      if (wp.kind === 'snow' || wp.kind === 'petals') {
        wp.x += (wp.vx + Math.sin(wp.phase) * 26) * dt;
      } else {
        wp.x += wp.vx * dt;
      }
      wp.y += wp.vy * dt;

      if (wp.kind === 'rain' || wp.kind === 'storm') {
        const col = Math.floor(wp.x / TILE_SIZE);
        const row = Math.floor(wp.y / TILE_SIZE);
        const tile = this.getTile(col, row);
        if (this.isSolidTile(tile) || tile === 'water') {
          if (Math.random() < 0.25 && this.particles.length < 180) {
            this.particles.push({
              x: wp.x,
              y: row * TILE_SIZE,
              vx: (Math.random() - 0.5) * 40,
              vy: -30 - Math.random() * 30,
              size: 2,
              color: '#bae6fd',
              alpha: 0.55,
              life: 0.14,
              maxLife: 0.14,
              gravity: 220,
              shape: 'square',
            });
          }
          continue;
        }
      }

      if (wp.kind === 'sparks') {
        if (wp.y < this.camY - 20) continue;
      } else if (wp.y > this.camY + viewH + 20) {
        continue;
      }
      if (wp.x < this.camX - 120 || wp.x > this.camX + viewW + 140) continue;
      nextWeatherParticles.push(wp);
    }
    this.weatherParticles = nextWeatherParticles;
  }

  private updateAmbientParticles(dt: number): void {
    const pal = BIOME_PALETTES[this.level.biome];
    if (pal.ambientKind === 'none') return;

    this.ambientSpawnTimer += dt;
    if (this.ambientSpawnTimer > 0.28) {
      this.ambientSpawnTimer = 0;
      const viewW = this.canvas.width;
      const sx = this.camX + Math.random() * (viewW + 120);
      this.particles.push({
        x: sx,
        y: -10,
        vx: pal.ambientKind === 'leaf' ? -38 - Math.random() * 30 : (Math.random() - 0.5) * 24,
        vy: pal.ambientKind === 'snow' ? 55 + Math.random() * 35 : 42 + Math.random() * 30,
        size: pal.ambientKind === 'spark' ? 3 : 5,
        color: pal.ambientParticleColor,
        alpha: 0.55,
        life: 6.5,
        maxLife: 6.5,
        gravity: 0,
        shape: pal.ambientKind === 'leaf' ? 'leaf' : 'circle',
      });
    }
  }

  private updateParticles(dt: number): void {
    for (const p of this.particles) {
      p.life -= dt;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  private updateFloatingTexts(dt: number): void {
    for (const ft of this.floatingTexts) {
      ft.life -= dt;
      ft.y += ft.vy * dt;
    }
    this.floatingTexts = this.floatingTexts.filter((ft) => ft.life > 0);
  }

  private updateCamera(dt: number): void {
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;
    const worldW = this.mapCols * TILE_SIZE;
    const worldH = this.mapRows * TILE_SIZE;

    const targetX = this.px + PLAYER_W / 2 + this.facing * 55 - viewW * 0.44;
    const targetY = this.py + PLAYER_H / 2 - viewH * 0.55;

    const clampedX = Math.max(0, Math.min(Math.max(0, worldW - viewW), targetX));
    const clampedY = Math.max(0, Math.min(Math.max(0, worldH - viewH), targetY));

    this.camX += (clampedX - this.camX) * Math.min(1, 8.5 * dt);
    this.camY += (clampedY - this.camY) * Math.min(1, 7.5 * dt);
  }

  private shake(duration: number, intensity: number): void {
    this.shakeTimer = Math.max(this.shakeTimer, duration);
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  private spawnDustBurst(x: number, y: number, count: number, color: string): void {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 110;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 35,
        size: 4 + Math.random() * 4,
        color,
        alpha: 0.9,
        life: 0.38 + Math.random() * 0.2,
        maxLife: 0.58,
        gravity: 240,
        shape: 'square',
      });
    }
  }

  private spawnRing(x: number, y: number, color: string): void {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 6,
      color,
      alpha: 0.95,
      life: 0.28,
      maxLife: 0.28,
      gravity: 0,
      shape: 'ring',
    });
  }

  private addFloatingText(x: number, y: number, text: string, color: string): void {
    this.floatingTexts.push({
      x,
      y,
      vy: -36,
      text,
      color,
      life: 0.85,
      maxLife: 0.85,
    });
  }

  private render(): void {
    const ctx = this.ctx;
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;
    ctx.imageSmoothingEnabled = false;

    const shakeX = this.shakeTimer > 0 ? (Math.random() - 0.5) * 2 * this.shakeIntensity : 0;
    const shakeY = this.shakeTimer > 0 ? (Math.random() - 0.5) * 2 * this.shakeIntensity : 0;

    drawBiomeBackground(ctx, this.level.biome, this.camX, viewW, viewH, this.worldTime);
    drawWeatherAtmosphere(ctx, this.weatherWeights, viewW, viewH, this.worldTime, this.lightningFlash);

    ctx.save();
    ctx.translate(Math.round(-this.camX + shakeX), Math.round(-this.camY + shakeY));

    // Props behind tiles
    for (const prop of this.level.props) {
      drawLevelProp(ctx, prop, this.level.biome, this.worldTime);
    }

    // Visible tiles culling
    const startCol = Math.max(0, Math.floor(this.camX / TILE_SIZE) - 1);
    const endCol = Math.min(this.mapCols - 1, Math.ceil((this.camX + viewW) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(this.camY / TILE_SIZE) - 1);
    const endRow = Math.min(this.mapRows - 1, Math.ceil((this.camY + viewH) / TILE_SIZE) + 1);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const kind = this.grid[r][c];
        if (kind === 'empty') continue;
        const above = r > 0 ? this.grid[r - 1][c] : 'empty';
        const hasTopNeighbor = above === 'ground' || above === 'dirt';
        drawTile(ctx, kind, c * TILE_SIZE, r * TILE_SIZE, this.level.biome, this.worldTime, hasTopNeighbor);
      }
    }

    // Moving platforms
    for (const mp of this.movingPlatforms) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(Math.round(mp.x), Math.round(mp.y), mp.w, mp.h);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(Math.round(mp.x + 2), Math.round(mp.y + 2), mp.w - 4, mp.h - 4);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(Math.round(mp.x + 4), Math.round(mp.y + 3), mp.w - 8, 3);
    }

    // Checkpoints & Goal Flag
    for (const cp of this.checkpoints) {
      drawCheckpointFlag(ctx, cp.x, cp.y, cp.active, this.worldTime);
    }
    drawGoalFlag(
      ctx,
      this.level.goalTile.x * TILE_SIZE + TILE_SIZE / 2,
      (this.level.goalTile.y + 1) * TILE_SIZE,
      this.worldTime,
      this.keys >= this.totalKeys
    );

    // Coins (static bob + dynamic bouncing coins)
    for (const coin of this.coinEntities) {
      const bob = coin.isDynamic ? 0 : Math.sin(this.worldTime * 4.5 + coin.bobPhase) * 3;
      const blinkAlpha =
        coin.isDynamic && coin.ttl < 2.2 ? (Math.sin(this.worldTime * 28) > 0 ? 0.3 : 1) : 1;
      drawCoinSprite(ctx, coin.x, coin.y + bob, this.worldTime + coin.bobPhase, blinkAlpha);
    }

    // Power-Ups (Star Shield & Coin Magnet)
    for (const pu of this.powerUpEntities) {
      if (!pu.collected) {
        drawPowerUpSprite(ctx, pu.kind, pu.x, pu.y, this.worldTime + pu.bobPhase);
      }
    }

    // Keys & Heart Pickups
    for (const key of this.keyEntities) {
      if (!key.collected) drawKeySprite(ctx, key.x, key.y, this.worldTime + key.bobPhase);
    }
    for (const heart of this.heartEntities) {
      if (!heart.collected) drawHeartSprite(ctx, heart.x, heart.y, this.worldTime + heart.bobPhase);
    }

    // Enemies
    for (const enemy of this.enemies) {
      if (enemy.hitCooldown > 0 && Math.floor(enemy.hitCooldown * 24) % 2 === 0) continue;
      drawEnemySprite(ctx, enemy, this.worldTime);
    }

    // Star Shield rainbow aura ring around player
    if (this.starTimer > 0) {
      const hue = Math.floor((this.worldTime * 360) % 360);
      ctx.save();
      ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(
        Math.round(this.px + PLAYER_W / 2),
        Math.round(this.py + PLAYER_H / 2),
        20 + Math.sin(this.worldTime * 16) * 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    // Player Character
    const blinkHide = this.invulnTimer > 0 && Math.floor(this.invulnTimer * 18) % 2 === 0;
    if (!blinkHide) {
      const char = getCharacterById(this.characterId);
      drawCharacterSprite(
        ctx,
        char,
        this.px + PLAYER_W / 2,
        this.py + PLAYER_H,
        this.facing,
        this.animState,
        this.animTime,
        1.12,
        this.hurtTimer > 0.24
      );
    }

    // Particles
    for (const p of this.particles) {
      const ratio = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = p.alpha * ratio;
      if (p.shape === 'ring') {
        const radius = p.size + (1 - ratio) * 20;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(Math.round(p.x), Math.round(p.y), radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'leaf') {
        ctx.translate(Math.round(p.x), Math.round(p.y));
        ctx.rotate(this.worldTime * 4 + p.x * 0.05);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
      } else if (p.shape === 'circle') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(Math.round(p.x), Math.round(p.y), p.size * 0.5 * (0.5 + 0.5 * ratio), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        const sz = p.size * (0.5 + 0.5 * ratio);
        ctx.fillRect(Math.round(p.x - sz / 2), Math.round(p.y - sz / 2), sz, sz);
      }
      ctx.restore();
    }

    // Weather Particles (Rain, Storm, Snow, Leaves, Petals, Sparks)
    for (const wp of this.weatherParticles) {
      ctx.save();
      ctx.globalAlpha = wp.alpha;
      if (wp.kind === 'rain' || wp.kind === 'storm') {
        ctx.strokeStyle = wp.color;
        ctx.lineWidth = wp.kind === 'storm' ? 2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.round(wp.x), Math.round(wp.y));
        ctx.lineTo(Math.round(wp.x + wp.vx * 0.025), Math.round(wp.y + wp.size));
        ctx.stroke();
      } else if (wp.kind === 'leaves') {
        ctx.translate(Math.round(wp.x), Math.round(wp.y));
        ctx.rotate(wp.phase);
        ctx.fillStyle = wp.color;
        ctx.fillRect(-wp.size / 2, -wp.size / 3, wp.size, wp.size * 0.65);
      } else {
        ctx.fillStyle = wp.color;
        ctx.fillRect(Math.round(wp.x), Math.round(wp.y), wp.size, wp.size);
      }
      ctx.restore();
    }

    // Floating Score / Alert Texts
    ctx.font = 'bold 11px Silkscreen, monospace';
    ctx.textAlign = 'center';
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.fillStyle = '#0f172a';
      ctx.fillText(ft.text, Math.round(ft.x) + 1, Math.round(ft.y) + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, Math.round(ft.x), Math.round(ft.y));
      ctx.restore();
    }

    ctx.restore();
  }

  public getHudSnapshot(): HudSnapshot {
    const goalPx = Math.max(1, this.level.goalTile.x * TILE_SIZE);
    return {
      gameState: this.gameState,
      lives: this.lives,
      maxLives: MAX_LIVES,
      coins: this.coins,
      totalLevelCoins: this.totalLevelCoins,
      keys: this.keys,
      totalKeys: this.totalKeys,
      score: this.score,
      timeLeft: Math.ceil(this.timeLeft),
      levelIndex: this.levelIndex,
      levelName: this.level.name,
      biome: this.level.biome,
      characterId: this.characterId,
      muted: soundEngine.isMuted(),
      comboCount: this.comboCount,
      starTimeLeft: Math.ceil(this.starTimer),
      magnetTimeLeft: Math.ceil(this.magnetTimer),
      dashCooldownRatio: Math.max(0, Math.min(1, this.dashCooldown / 0.85)),
      levelProgress: Math.max(0, Math.min(1, this.px / goalPx)),
      enemiesStomped: this.enemiesStomped,
      weather: this.currentWeather,
    };
  }

  private emitHud(force: boolean): void {
    const snap = this.getHudSnapshot();
    const dashPct = Math.round(snap.dashCooldownRatio * 20);
    const progPct = Math.round(snap.levelProgress * 100);
    const key = `${snap.gameState}|${snap.lives}|${snap.coins}|${snap.keys}|${snap.score}|${snap.timeLeft}|${snap.levelIndex}|${snap.characterId}|${snap.muted}|${snap.comboCount}|${snap.starTimeLeft}|${snap.magnetTimeLeft}|${dashPct}|${progPct}|${snap.enemiesStomped}|${snap.weather}`;
    if (force || key !== this.lastHudKey) {
      this.lastHudKey = key;
      this.onHudUpdate(snap);
    }
  }
}
