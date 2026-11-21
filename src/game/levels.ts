import { BiomeId, EnemySpawn, LevelDef, LevelProp, MovingPlatformDef, WeatherZone } from './types';

class MapBuilder {
  private rows: string[][];
  public readonly cols: number;

  constructor(cols: number, withCeiling = false) {
    this.cols = cols;
    this.rows = Array.from({ length: 18 }, () => Array(cols).fill('.'));
    this.fillGround(0, cols - 1);
    if (withCeiling) {
      for (let c = 0; c < cols; c++) {
        this.rows[0][c] = 'D';
        this.rows[1][c] = 'D';
      }
    }
  }

  public set(c: number, r: number, ch: string): void {
    if (r >= 0 && r < 18 && c >= 0 && c < this.cols) {
      this.rows[r][c] = ch;
    }
  }

  public fillRect(c1: number, r1: number, c2: number, r2: number, ch: string): void {
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        this.set(c, r, ch);
      }
    }
  }

  public fillGround(c1: number, c2: number): void {
    this.fillRect(c1, 14, c2, 14, '#');
    this.fillRect(c1, 15, c2, 17, 'D');
  }

  public water(c1: number, c2: number): void {
    this.fillRect(c1, 14, c2, 15, '~');
    this.fillRect(c1, 16, c2, 17, 'D');
  }

  public spikes(c1: number, c2: number, r = 14): void {
    this.fillRect(c1, r, c2, r, '^');
  }

  public cliff(c1: number, c2: number, topRow: number): void {
    this.fillRect(c1, topRow, c2, topRow, '#');
    this.fillRect(c1, topRow + 1, c2, 14, 'D');
  }

  public bridge(c1: number, c2: number, row: number): void {
    this.fillRect(c1, row, c2, row, '=');
  }

  public bricks(c1: number, c2: number, row: number, questionCol?: number): void {
    this.fillRect(c1, row, c2, row, 'B');
    if (typeof questionCol === 'number') {
      this.set(questionCol, row, '?');
    }
  }

  public wall(col: number, rTop: number, rBottom: number): void {
    this.fillRect(col, rTop, col, rBottom, '#');
  }

  public coinsRow(c1: number, c2: number, row: number): void {
    for (let c = c1; c <= c2; c++) {
      this.set(c, row, 'C');
    }
  }

  public coinsArc(centerCol: number, baseRow: number, count = 3): void {
    const half = Math.floor(count / 2);
    for (let i = -half; i <= half; i++) {
      const r = baseRow - (half - Math.abs(i));
      this.set(centerCol + i, r, 'C');
    }
  }

  public toRows(): string[] {
    return this.rows.map((r) => r.join(''));
  }
}

// ---------- Handcrafted Signature Worlds ----------

function buildLevel1(): LevelDef {
  const m = new MapBuilder(190);
  m.set(3, 13, 'P');
  m.coinsRow(7, 9, 12);

  // Section 1: Sunny Garden & ? Block
  m.water(16, 18);
  m.bricks(22, 26, 10, 24);
  m.coinsRow(23, 25, 9);
  m.cliff(30, 34, 11);
  m.coinsRow(31, 33, 9);

  // Wall-jump chimney up to Key 1
  m.cliff(40, 44, 9);
  m.wall(49, 4, 12);
  m.wall(54, 4, 13);
  m.coinsRow(51, 52, 10);
  m.coinsRow(51, 52, 7);
  m.bridge(48, 56, 4);
  m.coinsRow(50, 54, 3);
  m.set(52, 3, 'K');

  // Checkpoint 1
  m.set(64, 13, 'F');
  m.water(68, 76);
  m.bridge(71, 73, 12);
  m.coinsArc(72, 10, 3);

  // Section 2: Twin Meadow Cliffs & Power-up/Coin ? Block
  m.cliff(82, 86, 11);
  m.bricks(88, 92, 8, 90);
  m.coinsRow(89, 91, 7);
  m.spikes(94, 96);
  m.cliff(97, 102, 10);
  m.set(99, 9, 'H');
  m.bridge(105, 111, 7);
  m.coinsRow(106, 110, 6);
  m.set(108, 6, 'K');

  // Checkpoint 2
  m.set(126, 13, 'F');
  m.water(130, 141);

  // Section 3: Spring Launch & Sky Canopy
  m.set(145, 13, 'S');
  m.bridge(149, 155, 7);
  m.coinsRow(150, 154, 6);
  m.cliff(158, 163, 9);
  m.bridge(167, 173, 6);
  m.coinsRow(168, 172, 5);
  m.set(170, 5, 'K');
  m.spikes(175, 177);

  m.set(185, 13, 'G');

  const enemies: EnemySpawn[] = [
    { kind: 'slime', tileX: 12, tileY: 13, patrolRangeTiles: 3 },
    { kind: 'imp', tileX: 24, tileY: 13, patrolRangeTiles: 4 },
    { kind: 'slime', tileX: 32, tileY: 10, patrolRangeTiles: 2 },
    { kind: 'chicken', tileX: 59, tileY: 13, patrolRangeTiles: 3 },
    { kind: 'slime', tileX: 84, tileY: 10, patrolRangeTiles: 2 },
    { kind: 'imp', tileX: 100, tileY: 9, patrolRangeTiles: 2 },
    { kind: 'bird', tileX: 117, tileY: 7, patrolRangeTiles: 5 },
    { kind: 'chicken', tileX: 121, tileY: 13, patrolRangeTiles: 3 },
    { kind: 'slime', tileX: 160, tileY: 8, patrolRangeTiles: 2 },
    { kind: 'imp', tileX: 180, tileY: 13, patrolRangeTiles: 2 },
  ];

  const movingPlatforms: MovingPlatformDef[] = [
    { tileX: 68, tileY: 12, widthTiles: 3, dxTiles: 0, dyTiles: -3, speed: 1.4 },
    { tileX: 131, tileY: 12, widthTiles: 3, dxTiles: 7, dyTiles: 0, speed: 1.8 },
  ];

  const props: LevelProp[] = [
    { kind: 'giantCarrot', tileX: 5, tileY: 13 },
    { kind: 'fence', tileX: 8, tileY: 13 },
    { kind: 'tree', tileX: 13, tileY: 13 },
    { kind: 'mushroomHouse', tileX: 20, tileY: 13 },
    { kind: 'bush', tileX: 37, tileY: 13 },
    { kind: 'tree', tileX: 57, tileY: 13 },
    { kind: 'fence', tileX: 61, tileY: 13 },
    { kind: 'giantCarrot', tileX: 78, tileY: 13 },
    { kind: 'tree', tileX: 114, tileY: 13 },
    { kind: 'mushroomHouse', tileX: 120, tileY: 13 },
    { kind: 'bush', tileX: 143, tileY: 13 },
    { kind: 'tree', tileX: 165, tileY: 13 },
    { kind: 'giantCarrot', tileX: 179, tileY: 13 },
    { kind: 'fence', tileX: 182, tileY: 13 },
  ];

  const weatherZones: WeatherZone[] = [
    { fromProgress: 0, weather: 'clear', label: 'Sunny' },
    { fromProgress: 0.32, weather: 'rain', label: 'Rain' },
    { fromProgress: 0.68, weather: 'petals', label: 'Breeze' },
    { fromProgress: 0.86, weather: 'clear', label: 'Clear' },
  ];

  return {
    id: 1,
    name: 'Meadow Gardens',
    subtitle: 'Sunny Trails & Changing Skies',
    biome: 'meadow',
    timeLimitSec: 260,
    mapRows: m.toRows(),
    enemies,
    movingPlatforms,
    props,
    checkpointTiles: [
      { x: 64, y: 13 },
      { x: 126, y: 13 },
    ],
    goalTile: { x: 185, y: 13 },
    weatherZones,
  };
}

function buildLevel2(): LevelDef {
  const m = new MapBuilder(190);
  m.set(3, 13, 'P');
  m.coinsRow(6, 8, 12);

  m.water(13, 18);
  m.bridge(14, 17, 12);
  m.coinsArc(15, 10, 3);
  m.bricks(23, 27, 10, 25);
  m.cliff(32, 37, 10);
  m.bridge(40, 45, 7);
  m.coinsRow(40, 44, 6);
  m.set(42, 6, 'K');
  m.water(47, 54);

  m.set(62, 13, 'F');

  m.wall(70, 5, 13);
  m.wall(75, 5, 12);
  m.coinsRow(72, 73, 10);
  m.coinsRow(72, 73, 7);
  m.cliff(76, 83, 6);
  m.set(80, 5, 'H');
  m.water(85, 97);
  m.bridge(90, 93, 9);
  m.set(91, 8, 'K');

  m.bricks(106, 110, 10, 108);
  m.coinsRow(107, 109, 9);
  m.spikes(114, 117);
  m.bridge(114, 117, 11);

  m.set(125, 13, 'F');
  m.cliff(132, 137, 11);
  m.set(140, 13, 'S');
  m.bridge(144, 152, 7);
  m.coinsRow(145, 151, 6);
  m.water(154, 165);
  m.bridge(167, 173, 8);
  m.coinsRow(168, 172, 7);
  m.set(170, 7, 'K');

  m.set(185, 13, 'G');

  const enemies: EnemySpawn[] = [
    { kind: 'slime', tileX: 10, tileY: 13, patrolRangeTiles: 2 },
    { kind: 'chicken', tileX: 25, tileY: 13, patrolRangeTiles: 4 },
    { kind: 'bird', tileX: 36, tileY: 6, patrolRangeTiles: 5 },
    { kind: 'slime', tileX: 58, tileY: 13, patrolRangeTiles: 3 },
    { kind: 'chicken', tileX: 79, tileY: 5, patrolRangeTiles: 3 },
    { kind: 'bird', tileX: 92, tileY: 5, patrolRangeTiles: 5 },
    { kind: 'chicken', tileX: 104, tileY: 13, patrolRangeTiles: 4 },
    { kind: 'imp', tileX: 134, tileY: 10, patrolRangeTiles: 2 },
    { kind: 'bird', tileX: 158, tileY: 6, patrolRangeTiles: 5 },
    { kind: 'chicken', tileX: 178, tileY: 13, patrolRangeTiles: 4 },
  ];

  const movingPlatforms: MovingPlatformDef[] = [
    { tileX: 47, tileY: 12, widthTiles: 3, dxTiles: 5, dyTiles: 0, speed: 1.7 },
    { tileX: 85, tileY: 12, widthTiles: 3, dxTiles: 4, dyTiles: 0, speed: 1.8 },
    { tileX: 154, tileY: 12, widthTiles: 3, dxTiles: 8, dyTiles: 0, speed: 2.0 },
  ];

  const props: LevelProp[] = [
    { kind: 'pine', tileX: 5, tileY: 13 },
    { kind: 'bush', tileX: 9, tileY: 13 },
    { kind: 'pine', tileX: 21, tileY: 13 },
    { kind: 'fence', tileX: 29, tileY: 13 },
    { kind: 'pine', tileX: 56, tileY: 13 },
    { kind: 'pine', tileX: 65, tileY: 13 },
    { kind: 'bush', tileX: 100, tileY: 13 },
    { kind: 'pine', tileX: 119, tileY: 13 },
    { kind: 'fence', tileX: 128, tileY: 13 },
    { kind: 'pine', tileX: 142, tileY: 13 },
    { kind: 'pine', tileX: 175, tileY: 13 },
    { kind: 'bush', tileX: 181, tileY: 13 },
  ];

  const weatherZones: WeatherZone[] = [
    { fromProgress: 0, weather: 'leaves', label: 'Leaves' },
    { fromProgress: 0.35, weather: 'rain', label: 'Drizzle' },
    { fromProgress: 0.72, weather: 'leaves', label: 'Windy' },
  ];

  return {
    id: 2,
    name: 'Autumn Woods',
    subtitle: 'Crisp Leaves & Misty Lakes',
    biome: 'autumn',
    timeLimitSec: 270,
    mapRows: m.toRows(),
    enemies,
    movingPlatforms,
    props,
    checkpointTiles: [
      { x: 62, y: 13 },
      { x: 125, y: 13 },
    ],
    goalTile: { x: 185, y: 13 },
    weatherZones,
  };
}

// ---------- Parametric Adventure Builder for Rich Long Worlds ----------

interface AdventurePlan {
  id: number;
  name: string;
  subtitle: string;
  biome: BiomeId;
  cols: number;
  timeLimitSec: number;
  withCeiling?: boolean;
  withBoss?: boolean;
  variant: number; // shifts heights, hazards, ferry lengths, and chimney/spring geometry
  groundEnemyA: 'slime' | 'imp' | 'chicken';
  groundEnemyB: 'slime' | 'imp' | 'chicken';
  airEnemy: 'bird' | 'bat';
  propsCycle: LevelProp['kind'][];
  weatherZones: WeatherZone[];
}

function buildAdventureLevel(plan: AdventurePlan): LevelDef {
  const m = new MapBuilder(plan.cols, !!plan.withCeiling);
  const v = plan.variant;
  const gRow = 14;
  const standRow = 13;

  m.set(3, standRow, 'P');
  m.coinsRow(6, 9, 12);

  const enemies: EnemySpawn[] = [];
  const movingPlatforms: MovingPlatformDef[] = [];
  const props: LevelProp[] = [];

  const propKind = (idx: number): LevelProp['kind'] =>
    plan.propsCycle[idx % plan.propsCycle.length];

  // --- SECTION 1 (cols 12..60) ---
  const s1PondStart = 12 + (v % 3);
  const s1PondEnd = s1PondStart + 6 + (v % 3);
  if (v % 2 === 0) {
    m.water(s1PondStart, s1PondEnd);
    m.bridge(s1PondStart + 1, s1PondEnd - 1, 12 - (v % 2));
    m.coinsArc(Math.floor((s1PondStart + s1PondEnd) / 2), 9, 3);
  } else {
    m.spikes(s1PondStart, s1PondStart + 3);
    m.bridge(s1PondStart, s1PondStart + 3, 11);
    m.coinsRow(s1PondStart + 1, s1PondStart + 2, 10);
  }

  const b1Start = 23 + (v % 3);
  m.bricks(b1Start, b1Start + 4, 10 - (v % 2), b1Start + 2);
  m.coinsRow(b1Start + 1, b1Start + 3, 9 - (v % 2));
  enemies.push({ kind: plan.groundEnemyA, tileX: b1Start + 2, tileY: standRow, patrolRangeTiles: 3 });

  // Chimney or High Cliff Key 1
  if (v % 3 === 0) {
    // Wall-jump chimney
    const wLeft = 33 + (v % 2);
    m.wall(wLeft, 4, 13);
    m.wall(wLeft + 5, 4, 12);
    m.coinsRow(wLeft + 2, wLeft + 3, 10);
    m.coinsRow(wLeft + 2, wLeft + 3, 7);
    m.bridge(wLeft - 1, wLeft + 9, 4);
    m.coinsRow(wLeft + 5, wLeft + 8, 3);
    m.set(wLeft + 7, 3, 'K');
  } else if (v % 3 === 1) {
    // Spring launch tower to Key 1
    m.cliff(32, 37, 11);
    m.set(39, standRow, 'S');
    m.bridge(42, 48, 7);
    m.coinsRow(43, 47, 6);
    m.set(45, 6, 'K');
    m.spikes(41, 46);
  } else {
    // Stepped canyon & Key 1
    m.cliff(31, 36, 11);
    m.cliff(39, 44, 8);
    m.bridge(46, 51, 6);
    m.coinsRow(47, 50, 5);
    m.set(49, 5, 'K');
    enemies.push({ kind: plan.groundEnemyB, tileX: 41, tileY: 7, patrolRangeTiles: 2 });
  }

  m.water(52, 60);
  movingPlatforms.push({ tileX: 53, tileY: 12, widthTiles: 3, dxTiles: 5, dyTiles: 0, speed: 1.7 + (v % 4) * 0.15 });

  // Checkpoint 1
  const cp1 = 65;
  m.set(cp1, standRow, 'F');
  enemies.push({ kind: plan.airEnemy, tileX: 56, tileY: 6, patrolRangeTiles: 4 });

  // --- SECTION 2 (cols 70..126) ---
  const s2Start = 70;
  if (v % 2 === 0) {
    // Long lagoon / magma / void crossing with mid cliff & ferry
    m.water(s2Start, s2Start + 21);
    m.cliff(s2Start + 8, s2Start + 13, 10);
    m.set(s2Start + 10, 9, 'H');
    m.bridge(s2Start + 15, s2Start + 20, 7);
    m.coinsRow(s2Start + 16, s2Start + 19, 6);
    m.set(s2Start + 18, 6, 'K');
    movingPlatforms.push({ tileX: s2Start + 1, tileY: 12, widthTiles: 3, dxTiles: 5, dyTiles: 0, speed: 1.8 });
    movingPlatforms.push({ tileX: s2Start + 14, tileY: 11, widthTiles: 3, dxTiles: 5, dyTiles: 0, speed: 1.9 });
    enemies.push({ kind: plan.airEnemy, tileX: s2Start + 11, tileY: 5, patrolRangeTiles: 5 });
  } else {
    // Vertical elevator + spike pit + Key 2
    m.water(s2Start, s2Start + 7);
    movingPlatforms.push({ tileX: s2Start + 1, tileY: 12, widthTiles: 3, dxTiles: 0, dyTiles: -4, speed: 1.5 });
    m.cliff(s2Start + 9, s2Start + 15, 8);
    m.set(s2Start + 12, 7, 'H');
    m.bridge(s2Start + 18, s2Start + 24, 6);
    m.coinsRow(s2Start + 19, s2Start + 23, 5);
    m.set(s2Start + 21, 5, 'K');
    enemies.push({ kind: plan.groundEnemyA, tileX: s2Start + 12, tileY: 7, patrolRangeTiles: 2 });
  }

  m.cliff(96, 103, 10);
  enemies.push({ kind: plan.groundEnemyB, tileX: 99, tileY: 9, patrolRangeTiles: 3 });
  m.spikes(105, 109);
  m.bridge(105, 109, 10);
  m.bricks(112, 117, 9, 114);
  m.coinsRow(113, 116, 8);
  enemies.push({ kind: plan.airEnemy, tileX: 118, tileY: 6, patrolRangeTiles: 4 });
  enemies.push({ kind: plan.groundEnemyA, tileX: 123, tileY: standRow, patrolRangeTiles: 3 });

  // Checkpoint 2
  const cp2 = 132;
  m.set(cp2, standRow, 'F');

  // --- SECTION 3 (cols 137..goal) ---
  const ferryEnd = plan.withBoss ? 166 : 176;
  m.set(138, standRow, 'S');
  m.bridge(142, 149, 7);
  m.coinsRow(143, 148, 6);
  enemies.push({ kind: plan.airEnemy, tileX: 145, tileY: 4, patrolRangeTiles: 5 });

  m.water(151, ferryEnd);
  movingPlatforms.push({
    tileX: 152,
    tileY: 12,
    widthTiles: 3,
    dxTiles: ferryEnd - 156,
    dyTiles: 0,
    speed: 2.0 + (v % 3) * 0.15,
  });

  if (plan.withBoss) {
    // High Key 3 over the last stretch before Boss Arena
    m.bridge(157, 163, 7);
    m.coinsRow(158, 162, 6);
    m.set(160, 6, 'K');

    m.set(171, standRow, 'H');
    m.coinsRow(173, 176, 11);
    enemies.push({ kind: plan.groundEnemyB, tileX: 175, tileY: standRow, patrolRangeTiles: 2 });

    // Wide Boss Arena
    const bossCenter = plan.cols - 16;
    enemies.push({ kind: 'boss', tileX: bossCenter, tileY: standRow, patrolRangeTiles: 8 });
  } else {
    // Classic climax gauntlet + Key 3
    m.cliff(161, 166, 10);
    enemies.push({ kind: plan.groundEnemyA, tileX: 163, tileY: 9, patrolRangeTiles: 2 });
    m.bridge(168, 174, 6);
    m.coinsRow(169, 173, 5);
    m.set(171, 5, 'K');

    m.spikes(178, 181);
    m.bricks(183, 187, 10, 185);
    enemies.push({ kind: plan.groundEnemyB, tileX: plan.cols - 12, tileY: standRow, patrolRangeTiles: 3 });
  }

  const goalX = plan.cols - 5;
  m.set(goalX, standRow, 'G');

  // Rich Biome Props along safe ground tiles
  const propAnchors = [5, 9, 20, 29, 62, 67, 94, 121, 129, 135, 168, goalX - 3];
  propAnchors.forEach((tx, i) => {
    // Only place props on solid ground row
    if (tx > 4 && tx < goalX - 1 && m.toRows()[gRow][tx] === '#') {
      props.push({ kind: propKind(i), tileX: tx, tileY: standRow });
    }
  });

  return {
    id: plan.id,
    name: plan.name,
    subtitle: plan.subtitle,
    biome: plan.biome,
    timeLimitSec: plan.timeLimitSec,
    mapRows: m.toRows(),
    enemies,
    movingPlatforms,
    props,
    checkpointTiles: [
      { x: cp1, y: standRow },
      { x: cp2, y: standRow },
    ],
    goalTile: { x: goalX, y: standRow },
    weatherZones: plan.weatherZones,
  };
}

export const LEVELS: LevelDef[] = [
  buildLevel1(),
  buildLevel2(),
  buildAdventureLevel({
    id: 3,
    name: 'Sakura Valley',
    subtitle: 'Pink Blossoms & Breeze Shrines',
    biome: 'sakura',
    cols: 195,
    timeLimitSec: 270,
    variant: 1,
    groundEnemyA: 'slime',
    groundEnemyB: 'chicken',
    airEnemy: 'bird',
    propsCycle: ['cherryTree', 'lantern', 'bush', 'arch'],
    weatherZones: [
      { fromProgress: 0, weather: 'petals', label: 'Sakura' },
      { fromProgress: 0.42, weather: 'clear', label: 'Spring Sun' },
      { fromProgress: 0.72, weather: 'petals', label: 'Petal Gust' },
    ],
  }),
  buildAdventureLevel({
    id: 4,
    name: 'Coral Coast',
    subtitle: 'Turquoise Reefs & Tide Ferries',
    biome: 'ocean',
    cols: 195,
    timeLimitSec: 275,
    variant: 2,
    groundEnemyA: 'slime',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['coral', 'bush', 'pillar', 'arch'],
    weatherZones: [
      { fromProgress: 0, weather: 'clear', label: 'Ocean Breeze' },
      { fromProgress: 0.38, weather: 'rain', label: 'Sea Squall' },
      { fromProgress: 0.75, weather: 'clear', label: 'Rainbow Coast' },
    ],
  }),
  buildAdventureLevel({
    id: 5,
    name: 'Crystal Cavern',
    subtitle: 'Deep Amethyst Vaults & Chasms',
    biome: 'cavern',
    cols: 195,
    timeLimitSec: 280,
    withCeiling: true,
    variant: 3,
    groundEnemyA: 'slime',
    groundEnemyB: 'imp',
    airEnemy: 'bat',
    propsCycle: ['crystal', 'pillar', 'arch', 'crystal'],
    weatherZones: [
      { fromProgress: 0, weather: 'sparks', label: 'Sparks' },
      { fromProgress: 0.36, weather: 'snow', label: 'Crystal Frost' },
      { fromProgress: 0.7, weather: 'sparks', label: 'Arcane Glow' },
    ],
  }),
  buildAdventureLevel({
    id: 6,
    name: 'Golden Dunes',
    subtitle: 'Oasis Bridges & Sandstone Steps',
    biome: 'desert',
    cols: 200,
    timeLimitSec: 280,
    variant: 4,
    groundEnemyA: 'imp',
    groundEnemyB: 'chicken',
    airEnemy: 'bird',
    propsCycle: ['pyramid', 'pillar', 'arch', 'bush'],
    weatherZones: [
      { fromProgress: 0, weather: 'clear', label: 'Heat Haze' },
      { fromProgress: 0.35, weather: 'leaves', label: 'Sand Gust' },
      { fromProgress: 0.72, weather: 'sparks', label: 'Golden Dusk' },
    ],
  }),
  buildAdventureLevel({
    id: 7,
    name: 'Skyline Ruins',
    subtitle: 'Floating Temples & Dusk Storms',
    biome: 'sunset',
    cols: 195,
    timeLimitSec: 285,
    variant: 5,
    groundEnemyA: 'slime',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['pillar', 'arch', 'bush', 'lantern'],
    weatherZones: [
      { fromProgress: 0, weather: 'petals', label: 'Dusk Petals' },
      { fromProgress: 0.36, weather: 'storm', label: 'Storm' },
      { fromProgress: 0.72, weather: 'clear', label: 'Twilight' },
    ],
  }),
  buildAdventureLevel({
    id: 8,
    name: 'Frostbite Peak',
    subtitle: 'Alpine Snow & Shifting Blizzards',
    biome: 'frost',
    cols: 200,
    timeLimitSec: 290,
    variant: 6,
    groundEnemyA: 'slime',
    groundEnemyB: 'chicken',
    airEnemy: 'bird',
    propsCycle: ['pine', 'bush', 'pillar', 'pine'],
    weatherZones: [
      { fromProgress: 0, weather: 'snow', label: 'Light Snow' },
      { fromProgress: 0.32, weather: 'storm', label: 'Blizzard' },
      { fromProgress: 0.68, weather: 'snow', label: 'Snowfall' },
    ],
  }),
  buildAdventureLevel({
    id: 9,
    name: 'Monsoon Bamboo',
    subtitle: 'Jade Groves & Shifting Typhoons',
    biome: 'bamboo',
    cols: 200,
    timeLimitSec: 290,
    variant: 7,
    groundEnemyA: 'chicken',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['bambooCluster', 'lantern', 'arch', 'bambooCluster'],
    weatherZones: [
      { fromProgress: 0, weather: 'rain', label: 'Monsoon' },
      { fromProgress: 0.36, weather: 'storm', label: 'Typhoon' },
      { fromProgress: 0.68, weather: 'leaves', label: 'Bamboo Wind' },
    ],
  }),
  buildAdventureLevel({
    id: 10,
    name: 'Neon Arcade',
    subtitle: 'Mid-Game Cyber Boss Arena',
    biome: 'cyber',
    cols: 208,
    timeLimitSec: 300,
    withBoss: true,
    variant: 8,
    groundEnemyA: 'imp',
    groundEnemyB: 'chicken',
    airEnemy: 'bat',
    propsCycle: ['neonSign', 'pillar', 'arch', 'neonSign'],
    weatherZones: [
      { fromProgress: 0, weather: 'sparks', label: 'Neon Pulse' },
      { fromProgress: 0.35, weather: 'rain', label: 'Cyber Rain' },
      { fromProgress: 0.72, weather: 'storm', label: 'Boss Grid' },
    ],
  }),
  buildAdventureLevel({
    id: 11,
    name: 'Emerald Highlands',
    subtitle: 'Terraced Hills & Cloud Bridges',
    biome: 'meadow',
    cols: 200,
    timeLimitSec: 290,
    variant: 9,
    groundEnemyA: 'chicken',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['tree', 'mushroomHouse', 'giantCarrot', 'fence'],
    weatherZones: [
      { fromProgress: 0, weather: 'clear', label: 'Morning Sun' },
      { fromProgress: 0.34, weather: 'rain', label: 'Shower' },
      { fromProgress: 0.66, weather: 'petals', label: 'Rainbow Wind' },
    ],
  }),
  buildAdventureLevel({
    id: 12,
    name: 'Maple Canyon',
    subtitle: 'Crimson Gorges & Canopy Paths',
    biome: 'autumn',
    cols: 200,
    timeLimitSec: 295,
    variant: 10,
    groundEnemyA: 'imp',
    groundEnemyB: 'chicken',
    airEnemy: 'bird',
    propsCycle: ['pine', 'fence', 'bush', 'lantern'],
    weatherZones: [
      { fromProgress: 0, weather: 'leaves', label: 'Maple Drift' },
      { fromProgress: 0.38, weather: 'storm', label: 'Autumn Squall' },
      { fromProgress: 0.74, weather: 'leaves', label: 'Amber Dusk' },
    ],
  }),
  buildAdventureLevel({
    id: 13,
    name: 'Blossom Shrine',
    subtitle: 'Sacred Cherry Steps & Snow',
    biome: 'sakura',
    cols: 202,
    timeLimitSec: 295,
    variant: 11,
    groundEnemyA: 'slime',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['cherryTree', 'arch', 'lantern', 'cherryTree'],
    weatherZones: [
      { fromProgress: 0, weather: 'petals', label: 'Blossom Wind' },
      { fromProgress: 0.4, weather: 'snow', label: 'Spring Flurry' },
      { fromProgress: 0.75, weather: 'petals', label: 'Shrine Calm' },
    ],
  }),
  buildAdventureLevel({
    id: 14,
    name: 'Tidepool Cliffs',
    subtitle: 'Coastal Arches & Rolling Waves',
    biome: 'ocean',
    cols: 202,
    timeLimitSec: 295,
    variant: 12,
    groundEnemyA: 'chicken',
    groundEnemyB: 'imp',
    airEnemy: 'bird',
    propsCycle: ['coral', 'arch', 'pillar', 'coral'],
    weatherZones: [
      { fromProgress: 0, weather: 'clear', label: 'High Tide' },
      { fromProgress: 0.33, weather: 'storm', label: 'Ocean Gale' },
      { fromProgress: 0.7, weather: 'rain', label: 'Sea Mist' },
    ],
  }),
  buildAdventureLevel({
    id: 15,
    name: 'Amethyst Deep',
    subtitle: 'Twin Shafts & Bat Caverns',
    biome: 'cavern',
    cols: 204,
    timeLimitSec: 300,
    withCeiling: true,
    variant: 13,
    groundEnemyA: 'imp',
    groundEnemyB: 'slime',
    airEnemy: 'bat',
    propsCycle: ['crystal', 'arch', 'crystal', 'pillar'],
    weatherZones: [
      { fromProgress: 0, weather: 'sparks', label: 'Crystal Hum' },
      { fromProgress: 0.4, weather: 'storm', label: 'Cavern Draft' },
      { fromProgress: 0.75, weather: 'sparks', label: 'Deep Glow' },
    ],
  }),
  buildAdventureLevel({
    id: 16,
    name: 'Pharaoh Sands',
    subtitle: 'Sun Pyramids & Mirage Bridges',
    biome: 'desert',
    cols: 204,
    timeLimitSec: 300,
    variant: 14,
    groundEnemyA: 'imp',
    groundEnemyB: 'slime',
    airEnemy: 'bird',
    propsCycle: ['pyramid', 'arch', 'pillar', 'pyramid'],
    weatherZones: [
      { fromProgress: 0, weather: 'clear', label: 'High Noon' },
      { fromProgress: 0.35, weather: 'storm', label: 'Sandstorm' },
      { fromProgress: 0.7, weather: 'sparks', label: 'Mirage' },
    ],
  }),
  buildAdventureLevel({
    id: 17,
    name: 'Blizzard Spire',
    subtitle: 'Glacier Climbs & Icy Bridges',
    biome: 'frost',
    cols: 205,
    timeLimitSec: 305,
    variant: 15,
    groundEnemyA: 'imp',
    groundEnemyB: 'chicken',
    airEnemy: 'bird',
    propsCycle: ['pine', 'crystal', 'pillar', 'pine'],
    weatherZones: [
      { fromProgress: 0, weather: 'snow', label: 'Frost Wind' },
      { fromProgress: 0.3, weather: 'storm', label: 'Whiteout' },
      { fromProgress: 0.7, weather: 'snow', label: 'Ice Peak' },
    ],
  }),
  buildAdventureLevel({
    id: 18,
    name: 'Ember Volcano',
    subtitle: 'Basalt Cliffs & Ash Storms',
    biome: 'volcano',
    cols: 205,
    timeLimitSec: 305,
    variant: 16,
    groundEnemyA: 'imp',
    groundEnemyB: 'imp',
    airEnemy: 'bat',
    propsCycle: ['volcanoRock', 'pillar', 'lantern', 'arch'],
    weatherZones: [
      { fromProgress: 0, weather: 'sparks', label: 'Embers' },
      { fromProgress: 0.35, weather: 'storm', label: 'Ash Storm' },
      { fromProgress: 0.72, weather: 'sparks', label: 'Magma Glow' },
    ],
  }),
  buildAdventureLevel({
    id: 19,
    name: 'Cyber Metropolis',
    subtitle: 'Rooftop Ferries & Synth Storms',
    biome: 'cyber',
    cols: 208,
    timeLimitSec: 310,
    variant: 17,
    groundEnemyA: 'imp',
    groundEnemyB: 'chicken',
    airEnemy: 'bat',
    propsCycle: ['neonSign', 'arch', 'pillar', 'neonSign'],
    weatherZones: [
      { fromProgress: 0, weather: 'rain', label: 'Neon Rain' },
      { fromProgress: 0.38, weather: 'storm', label: 'Synth Storm' },
      { fromProgress: 0.72, weather: 'sparks', label: 'Laser Sky' },
    ],
  }),
  buildAdventureLevel({
    id: 20,
    name: 'Starlight Citadel',
    subtitle: 'Grand Finale & King Imp Boss',
    biome: 'citadel',
    cols: 215,
    timeLimitSec: 330,
    withBoss: true,
    variant: 18,
    groundEnemyA: 'imp',
    groundEnemyB: 'imp',
    airEnemy: 'bat',
    propsCycle: ['arch', 'crystal', 'pillar', 'lantern'],
    weatherZones: [
      { fromProgress: 0, weather: 'sparks', label: 'Starlight' },
      { fromProgress: 0.32, weather: 'snow', label: 'Cosmic Snow' },
      { fromProgress: 0.62, weather: 'storm', label: 'Void Storm' },
      { fromProgress: 0.85, weather: 'sparks', label: 'Boss Arena' },
    ],
  }),
];
