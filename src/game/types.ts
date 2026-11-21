export type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'DYING'
  | 'LEVEL_CLEAR'
  | 'GAME_OVER'
  | 'VICTORY';

export type CharacterId =
  | 'kelinci'
  | 'kodok'
  | 'kucing'
  | 'anjing'
  | 'panda'
  | 'rubah'
  | 'ayam'
  | 'robo'
  | 'dino'
  | 'pinguin'
  | 'beruang'
  | 'babi';

export type BiomeId =
  | 'meadow'
  | 'autumn'
  | 'cavern'
  | 'sunset'
  | 'frost'
  | 'bamboo'
  | 'volcano'
  | 'sakura'
  | 'desert'
  | 'ocean'
  | 'cyber'
  | 'citadel';

export type WeatherKind =
  | 'clear'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'leaves'
  | 'petals'
  | 'sparks';

export interface WeatherZone {
  fromProgress: number;
  weather: WeatherKind;
  label: string;
}

export type PlayerAnimState =
  | 'idle'
  | 'run'
  | 'jump'
  | 'doubleJump'
  | 'fall'
  | 'wallSlide'
  | 'hurt'
  | 'win';

export type CharacterStyle =
  | 'bunny'
  | 'frog'
  | 'cat'
  | 'dog'
  | 'panda'
  | 'fox'
  | 'chicken'
  | 'robo'
  | 'dino'
  | 'penguin'
  | 'bear'
  | 'pig';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  tagline: string;
  bodyColor: string;
  bellyColor: string;
  accentColor: string;
  outlineColor: string;
  earStyle: CharacterStyle;
  trailColor: string;
  speedBonus: number;
  jumpBonus: number;
  speedStat: number;
  jumpStat: number;
}

export type TileKind =
  | 'empty'
  | 'ground'
  | 'dirt'
  | 'brick'
  | 'bridge'
  | 'coinBlock'
  | 'usedBlock'
  | 'spike'
  | 'water'
  | 'spring';

export type EnemyKind = 'slime' | 'imp' | 'chicken' | 'bird' | 'bat' | 'boss';

export type PowerUpKind = 'star' | 'magnet';

export interface EnemySpawn {
  kind: EnemyKind;
  tileX: number;
  tileY: number;
  patrolRangeTiles?: number;
}

export interface MovingPlatformDef {
  tileX: number;
  tileY: number;
  widthTiles: number;
  dxTiles: number;
  dyTiles: number;
  speed: number;
}

export interface LevelProp {
  kind:
    | 'tree'
    | 'giantCarrot'
    | 'fence'
    | 'bush'
    | 'mushroomHouse'
    | 'crystal'
    | 'pine'
    | 'pillar'
    | 'bambooCluster'
    | 'lantern'
    | 'volcanoRock'
    | 'arch'
    | 'cherryTree'
    | 'pyramid'
    | 'coral'
    | 'neonSign';
  tileX: number;
  tileY: number;
  scale?: number;
}

export interface LevelDef {
  id: number;
  name: string;
  subtitle: string;
  biome: BiomeId;
  timeLimitSec: number;
  mapRows: string[];
  enemies: EnemySpawn[];
  movingPlatforms: MovingPlatformDef[];
  props: LevelProp[];
  checkpointTiles: { x: number; y: number }[];
  goalTile: { x: number; y: number };
  weatherZones: WeatherZone[];
}

export interface CoinEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isDynamic: boolean;
  bounces: number;
  ttl: number;
  pickupDelay: number;
  bobPhase: number;
  collected: boolean;
  droppedFromPlayer?: boolean;
}

export interface PowerUpEntity {
  id: number;
  kind: PowerUpKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bobPhase: number;
  collected: boolean;
}

export interface KeyEntity {
  id: number;
  x: number;
  y: number;
  bobPhase: number;
  collected: boolean;
}

export interface HeartPickupEntity {
  id: number;
  x: number;
  y: number;
  bobPhase: number;
  collected: boolean;
}

export interface EnemyEntity {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  minX: number;
  maxX: number;
  baseY: number;
  dir: 1 | -1;
  animTime: number;
  alive: boolean;
  squishTimer: number;
  hp: number;
  maxHp: number;
  hitCooldown: number;
}

export interface MovingPlatform {
  x: number;
  y: number;
  w: number;
  h: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  progress: number;
  dir: 1 | -1;
  vx: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
  shape: 'square' | 'circle' | 'ring' | 'leaf' | 'spark';
}

export interface FloatingText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface HudSnapshot {
  gameState: GameState;
  lives: number;
  maxLives: number;
  coins: number;
  totalLevelCoins: number;
  keys: number;
  totalKeys: number;
  score: number;
  timeLeft: number;
  levelIndex: number;
  levelName: string;
  biome: BiomeId;
  characterId: CharacterId;
  muted: boolean;
  comboCount: number;
  starTimeLeft: number;
  magnetTimeLeft: number;
  dashCooldownRatio: number;
  levelProgress: number;
  enemiesStomped: number;
  weather: WeatherKind;
}

export interface LevelProgressRecord {
  bestScore: number;
  bestCoins: number;
  cleared: boolean;
  stars: number;
}
