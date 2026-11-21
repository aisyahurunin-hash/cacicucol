import { BiomeId, EnemyEntity, LevelProp, PowerUpKind, TileKind, WeatherKind } from './types';

export const TILE_SIZE = 32;

export interface BiomePalette {
  skyTop: string;
  skyBottom: string;
  cloudColor: string;
  cloudShade: string;
  farHill: string;
  farTrim: string;
  nearHill: string;
  midWall: string;
  midWallTrim: string;
  nearBush: string;
  nearBushHighlight: string;
  grassTop: string;
  grassHighlight: string;
  dirtBody: string;
  dirtShade: string;
  brickFill: string;
  brickTrim: string;
  spikeFill: string;
  spikeTip: string;
  waterSurface: string;
  waterDeep: string;
  treeTrunk: string;
  treeLeaves: string;
  treeHighlight: string;
  ambientParticleColor: string;
  ambientKind: 'none' | 'leaf' | 'spark' | 'snow' | 'petal';
}

export const BIOME_PALETTES: Record<BiomeId, BiomePalette> = {
  meadow: {
    skyTop: '#4f94ec',
    skyBottom: '#bae6fd',
    cloudColor: '#f8fafc',
    cloudShade: '#cbd5e1',
    farHill: '#526582',
    farTrim: '#7c93b5',
    nearHill: '#39485f',
    midWall: '#3e506b',
    midWallTrim: '#607799',
    nearBush: '#2f6f5e',
    nearBushHighlight: '#4ade80',
    grassTop: '#4ade80',
    grassHighlight: '#86efac',
    dirtBody: '#334155',
    dirtShade: '#1e293b',
    brickFill: '#475569',
    brickTrim: '#94a3b8',
    spikeFill: '#e11d48',
    spikeTip: '#fda4af',
    waterSurface: '#38bdf8',
    waterDeep: '#0284c7',
    treeTrunk: '#78350f',
    treeLeaves: '#22c55e',
    treeHighlight: '#86efac',
    ambientParticleColor: '#fef08a',
    ambientKind: 'none',
  },
  autumn: {
    skyTop: '#f59e0b',
    skyBottom: '#fef3c7',
    cloudColor: '#fffbeb',
    cloudShade: '#fde68a',
    farHill: '#b45309',
    farTrim: '#f59e0b',
    nearHill: '#78350f',
    midWall: '#92400e',
    midWallTrim: '#d97706',
    nearBush: '#9a3412',
    nearBushHighlight: '#fb923c',
    grassTop: '#f59e0b',
    grassHighlight: '#fcd34d',
    dirtBody: '#92400e',
    dirtShade: '#78350f',
    brickFill: '#b45309',
    brickTrim: '#fbbf24',
    spikeFill: '#be123c',
    spikeTip: '#fecdd3',
    waterSurface: '#38bdf8',
    waterDeep: '#0369a1',
    treeTrunk: '#d97706',
    treeLeaves: '#ea580c',
    treeHighlight: '#facc15',
    ambientParticleColor: '#f97316',
    ambientKind: 'leaf',
  },
  cavern: {
    skyTop: '#16133b',
    skyBottom: '#312e81',
    cloudColor: '#4338ca',
    cloudShade: '#312e81',
    farHill: '#1e1b4b',
    farTrim: '#6366f1',
    nearHill: '#25215c',
    midWall: '#2e296e',
    midWallTrim: '#818cf8',
    nearBush: '#3b0764',
    nearBushHighlight: '#a855f7',
    grassTop: '#a855f7',
    grassHighlight: '#d8b4fe',
    dirtBody: '#1e293b',
    dirtShade: '#0f172a',
    brickFill: '#334155',
    brickTrim: '#818cf8',
    spikeFill: '#f43f5e',
    spikeTip: '#ffe4e6',
    waterSurface: '#22d3ee',
    waterDeep: '#0e7490',
    treeTrunk: '#4c1d95',
    treeLeaves: '#8b5cf6',
    treeHighlight: '#c4b5fd',
    ambientParticleColor: '#c084fc',
    ambientKind: 'spark',
  },
  sunset: {
    skyTop: '#7c2d12',
    skyBottom: '#fb923c',
    cloudColor: '#fed7aa',
    cloudShade: '#fb923c',
    farHill: '#6b2714',
    farTrim: '#ea580c',
    nearHill: '#521d10',
    midWall: '#5c261a',
    midWallTrim: '#f97316',
    nearBush: '#701a3c',
    nearBushHighlight: '#f472b6',
    grassTop: '#10b981',
    grassHighlight: '#6ee7b7',
    dirtBody: '#44403c',
    dirtShade: '#292524',
    brickFill: '#57534e',
    brickTrim: '#d6d3d1',
    spikeFill: '#e11d48',
    spikeTip: '#fecdd3',
    waterSurface: '#f59e0b',
    waterDeep: '#b45309',
    treeTrunk: '#451a03',
    treeLeaves: '#ec4899',
    treeHighlight: '#fbcfe8',
    ambientParticleColor: '#fbcfe8',
    ambientKind: 'petal',
  },
  frost: {
    skyTop: '#0369a1',
    skyBottom: '#e0f2fe',
    cloudColor: '#ffffff',
    cloudShade: '#bae6fd',
    farHill: '#4c7fb8',
    farTrim: '#bae6fd',
    nearHill: '#365f91',
    midWall: '#3b6a9e',
    midWallTrim: '#e0f2fe',
    nearBush: '#1e4e79',
    nearBushHighlight: '#7dd3fc',
    grassTop: '#e0f2fe',
    grassHighlight: '#ffffff',
    dirtBody: '#334155',
    dirtShade: '#1e293b',
    brickFill: '#64748b',
    brickTrim: '#bae6fd',
    spikeFill: '#06b6d4',
    spikeTip: '#cffafe',
    waterSurface: '#0ea5e9',
    waterDeep: '#0369a1',
    treeTrunk: '#475569',
    treeLeaves: '#38bdf8',
    treeHighlight: '#e0f2fe',
    ambientParticleColor: '#ffffff',
    ambientKind: 'snow',
  },
  bamboo: {
    skyTop: '#0d9488',
    skyBottom: '#ccfbf1',
    cloudColor: '#f0fdfa',
    cloudShade: '#99f6e4',
    farHill: '#115e59',
    farTrim: '#2dd4bf',
    nearHill: '#0f4c48',
    midWall: '#134e4a',
    midWallTrim: '#5eead4',
    nearBush: '#065f46',
    nearBushHighlight: '#34d399',
    grassTop: '#10b981',
    grassHighlight: '#6ee7b7',
    dirtBody: '#1e3a3a',
    dirtShade: '#0f2626',
    brickFill: '#115e59',
    brickTrim: '#5eead4',
    spikeFill: '#e11d48',
    spikeTip: '#fda4af',
    waterSurface: '#2dd4bf',
    waterDeep: '#0f766e',
    treeTrunk: '#15803d',
    treeLeaves: '#22c55e',
    treeHighlight: '#bbf7d0',
    ambientParticleColor: '#a7f3d0',
    ambientKind: 'leaf',
  },
  volcano: {
    skyTop: '#2a0a12',
    skyBottom: '#9a3412',
    cloudColor: '#7c2d12',
    cloudShade: '#450a0a',
    farHill: '#3b1019',
    farTrim: '#dc2626',
    nearHill: '#290c12',
    midWall: '#43141c',
    midWallTrim: '#f97316',
    nearBush: '#58151c',
    nearBushHighlight: '#fb923c',
    grassTop: '#ef4444',
    grassHighlight: '#fca5a5',
    dirtBody: '#292524',
    dirtShade: '#1c1917',
    brickFill: '#44403c',
    brickTrim: '#f97316',
    spikeFill: '#f97316',
    spikeTip: '#fef08a',
    waterSurface: '#fb923c',
    waterDeep: '#c2410c',
    treeTrunk: '#451a03',
    treeLeaves: '#ea580c',
    treeHighlight: '#fde047',
    ambientParticleColor: '#fb923c',
    ambientKind: 'spark',
  },
  citadel: {
    skyTop: '#0f172a',
    skyBottom: '#4c1d95',
    cloudColor: '#6d28d9',
    cloudShade: '#4c1d95',
    farHill: '#1e1b4b',
    farTrim: '#a855f7',
    nearHill: '#2e1065',
    midWall: '#312e81',
    midWallTrim: '#fbbf24',
    nearBush: '#4c1d95',
    nearBushHighlight: '#facc15',
    grassTop: '#facc15',
    grassHighlight: '#fef08a',
    dirtBody: '#312e81',
    dirtShade: '#1e1b4b',
    brickFill: '#4338ca',
    brickTrim: '#fbbf24',
    spikeFill: '#f43f5e',
    spikeTip: '#fda4af',
    waterSurface: '#a855f7',
    waterDeep: '#6b21a8',
    treeTrunk: '#581c87',
    treeLeaves: '#eab308',
    treeHighlight: '#fef08a',
    ambientParticleColor: '#fde047',
    ambientKind: 'spark',
  },
  sakura: {
    skyTop: '#f472b6',
    skyBottom: '#fce7f3',
    cloudColor: '#fff1f2',
    cloudShade: '#fbcfe8',
    farHill: '#be185d',
    farTrim: '#f9a8d4',
    nearHill: '#9d174d',
    midWall: '#831843',
    midWallTrim: '#f472b6',
    nearBush: '#9d174d',
    nearBushHighlight: '#fbcfe8',
    grassTop: '#f472b6',
    grassHighlight: '#fbcfe8',
    dirtBody: '#78350f',
    dirtShade: '#451a03',
    brickFill: '#9d174d',
    brickTrim: '#f9a8d4',
    spikeFill: '#e11d48',
    spikeTip: '#ffe4e6',
    waterSurface: '#38bdf8',
    waterDeep: '#0284c7',
    treeTrunk: '#78350f',
    treeLeaves: '#f472b6',
    treeHighlight: '#fbcfe8',
    ambientParticleColor: '#fbcfe8',
    ambientKind: 'petal',
  },
  desert: {
    skyTop: '#0284c7',
    skyBottom: '#fef08a',
    cloudColor: '#fefce8',
    cloudShade: '#fde047',
    farHill: '#d97706',
    farTrim: '#fcd34d',
    nearHill: '#b45309',
    midWall: '#92400e',
    midWallTrim: '#fbbf24',
    nearBush: '#a16207',
    nearBushHighlight: '#facc15',
    grassTop: '#fbbf24',
    grassHighlight: '#fef08a',
    dirtBody: '#b45309',
    dirtShade: '#78350f',
    brickFill: '#d97706',
    brickTrim: '#fde68a',
    spikeFill: '#dc2626',
    spikeTip: '#fecaca',
    waterSurface: '#22d3ee',
    waterDeep: '#0891b2',
    treeTrunk: '#78350f',
    treeLeaves: '#65a30d',
    treeHighlight: '#bef264',
    ambientParticleColor: '#fde047',
    ambientKind: 'leaf',
  },
  ocean: {
    skyTop: '#0369a1',
    skyBottom: '#a5f3fc',
    cloudColor: '#f0fdfa',
    cloudShade: '#99f6e4',
    farHill: '#0e7490',
    farTrim: '#67e8f9',
    nearHill: '#155e75',
    midWall: '#164e63',
    midWallTrim: '#22d3ee',
    nearBush: '#0f766e',
    nearBushHighlight: '#5eead4',
    grassTop: '#2dd4bf',
    grassHighlight: '#99f6e4',
    dirtBody: '#ca8a04',
    dirtShade: '#854d0e',
    brickFill: '#0e7490',
    brickTrim: '#67e8f9',
    spikeFill: '#f43f5e',
    spikeTip: '#fecdd3',
    waterSurface: '#22d3ee',
    waterDeep: '#0369a1',
    treeTrunk: '#92400e',
    treeLeaves: '#14b8a6',
    treeHighlight: '#99f6e4',
    ambientParticleColor: '#a5f3fc',
    ambientKind: 'petal',
  },
  cyber: {
    skyTop: '#090d1e',
    skyBottom: '#31105f',
    cloudColor: '#22d3ee',
    cloudShade: '#c026d3',
    farHill: '#1e1b4b',
    farTrim: '#22d3ee',
    nearHill: '#2e1065',
    midWall: '#1e1b4b',
    midWallTrim: '#e879f9',
    nearBush: '#3b0764',
    nearBushHighlight: '#22d3ee',
    grassTop: '#22d3ee',
    grassHighlight: '#a5f3fc',
    dirtBody: '#1e293b',
    dirtShade: '#0f172a',
    brickFill: '#334155',
    brickTrim: '#e879f9',
    spikeFill: '#f43f5e',
    spikeTip: '#fda4af',
    waterSurface: '#e879f9',
    waterDeep: '#701a75',
    treeTrunk: '#475569',
    treeLeaves: '#22d3ee',
    treeHighlight: '#f0abfc',
    ambientParticleColor: '#22d3ee',
    ambientKind: 'spark',
  },
};

export function drawBiomeBackground(
  ctx: CanvasRenderingContext2D,
  biome: BiomeId,
  camX: number,
  viewW: number,
  viewH: number,
  time: number
): void {
  const pal = BIOME_PALETTES[biome];
  const grad = ctx.createLinearGradient(0, 0, 0, viewH);
  grad.addColorStop(0, pal.skyTop);
  grad.addColorStop(1, pal.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, viewW, viewH);

  // Stars / glowing motes for cavern, volcano, citadel & cyber
  if (biome === 'cavern' || biome === 'citadel' || biome === 'volcano' || biome === 'cyber') {
    ctx.fillStyle =
      biome === 'citadel'
        ? '#fef08a'
        : biome === 'volcano'
          ? '#fdba74'
          : biome === 'cyber'
            ? '#22d3ee'
            : '#c4b5fd';
    for (let i = 0; i < 42; i++) {
      const sx = ((i * 173 - camX * 0.06) % (viewW + 40) + viewW + 40) % (viewW + 40) - 20;
      const sy = (i * 67) % (viewH * 0.72);
      const twinkle = Math.sin(time * 3 + i) > 0.2 ? 3 : 2;
      ctx.globalAlpha = 0.45 + 0.4 * Math.sin(time * 2 + i);
      if (biome === 'cyber' && i % 3 === 0) {
        ctx.fillStyle = '#e879f9';
      } else if (biome === 'cyber') {
        ctx.fillStyle = '#22d3ee';
      }
      ctx.fillRect(Math.round(sx), Math.round(sy), twinkle, twinkle);
    }
    ctx.globalAlpha = 1;
  }

  // Sun or Moon with soft pixel aura
  if (biome !== 'cavern') {
    const sunX = viewW * 0.8 - ((camX * 0.015) % 140);
    const sunY = biome === 'sunset' || biome === 'volcano' ? viewH * 0.36 : viewH * 0.2;
    const sunRadius = biome === 'sunset' ? 42 : biome === 'volcano' ? 36 : 28;
    ctx.fillStyle =
      biome === 'citadel'
        ? '#fef08a'
        : biome === 'volcano'
          ? '#fb923c'
          : biome === 'sunset'
            ? '#fde047'
            : '#fffbeb';
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius + 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // LAYER 1: Rich Stacked Puffy Cloud Banks (0.08x parallax)
  if (biome !== 'cavern') {
    const cloudSpan = 190;
    const cStart = Math.floor((camX * 0.08 + time * 10) / cloudSpan) - 1;
    const cCount = Math.ceil(viewW / cloudSpan) + 3;
    ctx.globalAlpha = biome === 'citadel' || biome === 'volcano' ? 0.35 : 0.92;
    for (let i = cStart; i < cStart + cCount; i++) {
      const cx = Math.round(i * cloudSpan - (camX * 0.08 + time * 10));
      const cy = 62 + (Math.abs(i * 53) % 3) * 34;
      const w = 130 + (Math.abs(i * 29) % 3) * 28;
      // Cloud base shadow
      ctx.fillStyle = pal.cloudShade;
      ctx.fillRect(cx, cy + 16, w, 18);
      // Main cloud domes
      ctx.fillStyle = pal.cloudColor;
      ctx.fillRect(cx + 6, cy + 8, w - 12, 22);
      ctx.fillRect(cx + 22, cy - 8, w - 48, 22);
      ctx.fillRect(cx + 40, cy - 20, Math.max(28, w - 84), 16);
    }
    ctx.globalAlpha = 1;
  }

  // LAYER 2: Far Giant Stepped Cliffs / Monoliths / Spires (0.16x parallax)
  const farSpan = 210;
  const fStart = Math.floor((camX * 0.16) / farSpan) - 1;
  const fCount = Math.ceil(viewW / farSpan) + 3;
  for (let i = fStart; i < fStart + fCount; i++) {
    const fx = Math.round(i * farSpan - camX * 0.16);
    const seed = Math.abs(i * 73 + 19);
    const fh = 155 + (seed % 5) * 32;
    const fy = viewH - fh;

    if (biome === 'autumn' || biome === 'frost' || biome === 'volcano' || biome === 'desert') {
      // Jagged alpine/volcanic peaks or desert pyramids overlapping
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(fx - 26, viewH);
      ctx.lineTo(fx + farSpan * 0.52, fy - 18);
      ctx.lineTo(fx + farSpan + 26, viewH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = pal.farHill;
      ctx.beginPath();
      ctx.moveTo(fx - 20, viewH);
      ctx.lineTo(fx + farSpan * 0.52, fy - 12);
      ctx.lineTo(fx + farSpan + 20, viewH);
      ctx.closePath();
      ctx.fill();

      // Peak snow/lava/gold cap
      ctx.fillStyle = pal.farTrim;
      ctx.beginPath();
      ctx.moveTo(fx + farSpan * 0.34, fy + 40);
      ctx.lineTo(fx + farSpan * 0.52, fy - 12);
      ctx.lineTo(fx + farSpan * 0.7, fy + 40);
      ctx.closePath();
      ctx.fill();
    } else {
      // Video 1 style giant overlapping stepped monoliths / cliff walls
      const fw = farSpan + 24;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fx - 2, fy - 2, fw + 4, fh + 2);
      ctx.fillRect(fx + 22, fy - 24, fw - 44, 24);
      ctx.fillStyle = pal.farHill;
      ctx.fillRect(fx, fy, fw, fh);
      ctx.fillRect(fx + 24, fy - 22, fw - 48, 24);
      ctx.fillStyle = pal.farTrim;
      ctx.fillRect(fx, fy, fw, 5);
      ctx.fillRect(fx + 24, fy - 22, fw - 48, 4);
    }
  }

  // LAYER 3: Midground Stacked Backdrop Walls, Trees & Ruins (0.30x parallax)
  const midSpan = 165;
  const mStart = Math.floor((camX * 0.3) / midSpan) - 1;
  const mCount = Math.ceil(viewW / midSpan) + 3;
  for (let i = mStart; i < mStart + mCount; i++) {
    const mx = Math.round(i * midSpan - camX * 0.3);
    const seed = Math.abs(i * 41 + 7);
    const mh = 110 + (seed % 4) * 34;
    const my = viewH - mh;
    const mw = midSpan - 6 + (seed % 3) * 18;

    // Stepped backdrop panel wall (signature stacked look from Video 1!)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mx - 2, my - 2, mw + 4, mh + 2);
    ctx.fillStyle = pal.midWall;
    ctx.fillRect(mx, my, mw, mh);
    ctx.fillStyle = pal.midWallTrim;
    ctx.fillRect(mx, my, mw, 5);

    // Recessed architectural notch / distant tree silhouette
    if (seed % 2 === 0) {
      ctx.fillStyle = pal.nearHill;
      ctx.fillRect(mx + 18, my + 16, Math.max(24, mw - 36), mh - 24);
    } else {
      // Distant giant tree / pagoda / spire rising above the wall
      ctx.fillStyle = pal.nearHill;
      ctx.fillRect(mx + 26, my - 42, 16, 42);
      ctx.fillStyle = pal.nearBush;
      ctx.fillRect(mx + 12, my - 78, 44, 42);
      ctx.fillStyle = pal.nearBushHighlight;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(mx + 16, my - 74, 14, 32);
      ctx.globalAlpha = 1;
    }
  }

  // LAYER 4: Near Rolling Overlapping Bushes & Ridge (0.48x parallax)
  const nearSpan = 96;
  const nStart = Math.floor((camX * 0.48) / nearSpan) - 1;
  const nCount = Math.ceil(viewW / nearSpan) + 3;
  for (let i = nStart; i < nStart + nCount; i++) {
    const nx = Math.round(i * nearSpan - camX * 0.48);
    const seed = Math.abs(i * 29 + 3);
    const nh = 54 + (seed % 4) * 16;
    const ny = viewH - nh;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(nx - 2, ny - 2, nearSpan + 18, nh + 2);
    ctx.fillRect(nx + 14, ny - 16, nearSpan - 22, 16);
    ctx.fillStyle = pal.nearBush;
    ctx.fillRect(nx, ny, nearSpan + 14, nh);
    ctx.fillRect(nx + 16, ny - 14, nearSpan - 26, 16);
    ctx.fillStyle = pal.nearBushHighlight;
    ctx.globalAlpha = 0.42;
    ctx.fillRect(nx + 18, ny - 11, Math.max(12, nearSpan - 48), 5);
    ctx.globalAlpha = 1;
  }
}

export function drawWeatherAtmosphere(
  ctx: CanvasRenderingContext2D,
  weights: Record<WeatherKind, number>,
  viewW: number,
  viewH: number,
  time: number,
  lightningFlash: number
): void {
  const rainAmt = weights.rain + weights.storm;
  const snowAmt = weights.snow;
  const warmAmt = weights.leaves + weights.petals;
  const sparkAmt = weights.sparks;

  if (rainAmt > 0.01) {
    ctx.fillStyle = `rgba(15, 23, 42, ${(0.22 * weights.rain + 0.36 * weights.storm).toFixed(3)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }
  if (snowAmt > 0.01) {
    ctx.fillStyle = `rgba(224, 242, 254, ${(0.18 * snowAmt).toFixed(3)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }
  if (warmAmt > 0.01) {
    ctx.fillStyle = `rgba(251, 146, 60, ${(0.08 * warmAmt).toFixed(3)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }
  if (sparkAmt > 0.01) {
    ctx.fillStyle = `rgba(88, 28, 135, ${(0.1 * sparkAmt).toFixed(3)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }

  // Smooth drifting mist band near lower horizon during rain/snow/storm
  const mistAmt = Math.min(1, rainAmt * 0.8 + snowAmt * 0.9);
  if (mistAmt > 0.02) {
    const mistShift = (time * 24) % 160;
    ctx.fillStyle = snowAmt > rainAmt ? '#f0f9ff' : '#cbd5e1';
    ctx.globalAlpha = 0.14 * mistAmt;
    for (let x = -160; x < viewW + 160; x += 160) {
      ctx.fillRect(Math.round(x - mistShift), viewH - 96, 130, 32);
    }
    ctx.globalAlpha = 1;
  }

  // Subtle lightning flash during storm
  if (lightningFlash > 0.01) {
    ctx.fillStyle = `rgba(248, 250, 252, ${Math.min(0.42, lightningFlash).toFixed(3)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }
}

export function drawLevelProp(
  ctx: CanvasRenderingContext2D,
  prop: LevelProp,
  biome: BiomeId,
  time: number
): void {
  const pal = BIOME_PALETTES[biome];
  const x = prop.tileX * TILE_SIZE;
  const bottomY = (prop.tileY + 1) * TILE_SIZE;
  const sway = Math.sin(time * 2 + prop.tileX) * 2;

  ctx.save();
  if (prop.kind === 'tree') {
    // Tall rounded pixel tree like Video 1
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 9, bottomY - 56, 14, 56);
    ctx.fillStyle = pal.treeTrunk;
    ctx.fillRect(x + 11, bottomY - 54, 10, 54);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 6 + sway * 0.3, bottomY - 126, 44, 74);
    ctx.fillStyle = pal.treeLeaves;
    ctx.fillRect(x - 3 + sway * 0.3, bottomY - 123, 38, 68);
    ctx.fillStyle = pal.treeHighlight;
    ctx.fillRect(x + 2 + sway * 0.3, bottomY - 118, 12, 56);
  } else if (prop.kind === 'pine') {
    // Tall autumn/frost pine tree like Video 2
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 11, bottomY - 160, 10, 160);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + 13, bottomY - 160, 4, 160);

    for (let tier = 0; tier < 3; tier++) {
      const ty = bottomY - 115 - tier * 24;
      const w = 44 - tier * 10;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 16 - w / 2 - 2, ty - 2, w + 4, 20);
      ctx.fillStyle = pal.treeLeaves;
      ctx.fillRect(x + 16 - w / 2, ty, w, 16);
      ctx.fillStyle = pal.treeHighlight;
      ctx.fillRect(x + 16 - w / 2 + 2, ty + 2, w - 4, 6);
    }
  } else if (prop.kind === 'giantCarrot') {
    // Cute giant carrot / turnip like Video 1
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x + 10, bottomY - 50, 12, 18);
    ctx.fillRect(x + 4, bottomY - 46, 8, 12);
    ctx.fillRect(x + 20, bottomY - 46, 8, 12);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, bottomY - 34, 28, 34);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x + 4, bottomY - 32, 24, 30);
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(x + 8, bottomY - 28, 6, 18);
  } else if (prop.kind === 'fence') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, bottomY - 22, 64, 5);
    ctx.fillRect(x, bottomY - 11, 64, 5);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(x + 2, bottomY - 21, 60, 3);
    ctx.fillRect(x + 2, bottomY - 10, 60, 3);
    for (let p = 0; p < 3; p++) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 6 + p * 22, bottomY - 28, 8, 28);
      ctx.fillStyle = '#be123c';
      ctx.fillRect(x + 7 + p * 22, bottomY - 27, 6, 26);
    }
  } else if (prop.kind === 'bush') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, bottomY - 22, 46, 22);
    ctx.fillRect(x + 8, bottomY - 30, 30, 12);
    ctx.fillStyle = pal.treeLeaves;
    ctx.fillRect(x + 2, bottomY - 20, 42, 20);
    ctx.fillRect(x + 10, bottomY - 28, 26, 10);
    ctx.fillStyle = pal.treeHighlight;
    ctx.fillRect(x + 12, bottomY - 26, 14, 5);
  } else if (prop.kind === 'mushroomHouse') {
    // Huge charming mushroom house backdrop from Video 1
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 18, bottomY - 76, 76, 76);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 21, bottomY - 73, 70, 73);
    // Door
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 42, bottomY - 36, 28, 36);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(x + 46, bottomY - 32, 20, 32);
    // Big red cap
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 6, bottomY - 122, 124, 52);
    ctx.fillRect(x + 14, bottomY - 138, 84, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 2, bottomY - 118, 116, 44);
    ctx.fillRect(x + 18, bottomY - 134, 76, 18);
    // Spots
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(x + 16, bottomY - 110, 16, 14);
    ctx.fillRect(x + 52, bottomY - 124, 18, 14);
    ctx.fillRect(x + 82, bottomY - 104, 14, 14);
  } else if (prop.kind === 'crystal') {
    const pulse = 0.7 + 0.3 * Math.sin(time * 4 + prop.tileX);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(x + 8, bottomY - 34, 14, 34);
    ctx.fillRect(x + 12, bottomY - 42, 6, 8);
    ctx.fillStyle = '#e9d5ff';
    ctx.fillRect(x + 11, bottomY - 34, 4, 28);
    ctx.globalAlpha = 1;
  } else if (prop.kind === 'pillar') {
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 6, bottomY - 96, 20, 96);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 2, bottomY - 98, 28, 10);
    ctx.fillRect(x + 2, bottomY - 10, 28, 10);
  } else if (prop.kind === 'bambooCluster') {
    const stalks = [4, 16, 28];
    stalks.forEach((sx, idx) => {
      const h = 96 + idx * 18;
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(x + sx - 1, bottomY - h, 8, h);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + sx, bottomY - h + 2, 6, h - 2);
      ctx.fillStyle = '#a7f3d0';
      for (let seg = 18; seg < h; seg += 22) {
        ctx.fillRect(x + sx, bottomY - seg, 6, 2);
      }
    });
    ctx.fillStyle = '#34d399';
    ctx.fillRect(x + sway * 0.4, bottomY - 126, 24, 10);
    ctx.fillRect(x + 18 + sway * 0.4, bottomY - 140, 22, 10);
  } else if (prop.kind === 'lantern') {
    const glow = 0.75 + 0.25 * Math.sin(time * 5 + prop.tileX);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 13, bottomY - 58, 6, 58);
    ctx.fillRect(x + 6, bottomY - 58, 20, 4);
    ctx.globalAlpha = glow;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 9, bottomY - 54, 14, 16);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x + 11, bottomY - 52, 10, 12);
    ctx.globalAlpha = 1;
  } else if (prop.kind === 'volcanoRock') {
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x + 2, bottomY - 40, 40, 40);
    ctx.fillRect(x + 10, bottomY - 52, 24, 14);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(x + 4, bottomY - 38, 36, 38);
    ctx.fillRect(x + 12, bottomY - 49, 20, 12);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x + 16, bottomY - 34, 4, 18);
    ctx.fillRect(x + 20, bottomY - 22, 8, 4);
  } else if (prop.kind === 'arch') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, bottomY - 88, 16, 88);
    ctx.fillRect(x + 46, bottomY - 88, 16, 88);
    ctx.fillRect(x - 2, bottomY - 96, 68, 16);
    ctx.fillStyle = pal.brickFill;
    ctx.fillRect(x + 4, bottomY - 86, 12, 86);
    ctx.fillRect(x + 48, bottomY - 86, 12, 86);
    ctx.fillRect(x, bottomY - 94, 64, 12);
    ctx.fillStyle = pal.brickTrim;
    ctx.fillRect(x, bottomY - 94, 64, 3);
  } else if (prop.kind === 'cherryTree') {
    // Blossom sakura tree
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + 10, bottomY - 62, 12, 62);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 12, bottomY - 60, 8, 60);
    ctx.fillStyle = '#9d174d';
    ctx.fillRect(x - 10 + sway * 0.3, bottomY - 124, 52, 66);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(x - 7 + sway * 0.3, bottomY - 121, 46, 60);
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(x - 2 + sway * 0.3, bottomY - 116, 18, 44);
    ctx.fillRect(x + 20 + sway * 0.3, bottomY - 104, 14, 24);
  } else if (prop.kind === 'pyramid') {
    // Stepped sandstone pyramid obelisk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 4, bottomY - 20, 60, 20);
    ctx.fillRect(x + 4, bottomY - 38, 44, 18);
    ctx.fillRect(x + 12, bottomY - 54, 28, 16);
    ctx.fillRect(x + 20, bottomY - 68, 12, 14);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x - 2, bottomY - 18, 56, 18);
    ctx.fillRect(x + 6, bottomY - 36, 40, 18);
    ctx.fillRect(x + 14, bottomY - 52, 24, 16);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 22, bottomY - 66, 8, 14);
  } else if (prop.kind === 'coral') {
    // Colorful ocean coral reef cluster
    ctx.fillStyle = '#be185d';
    ctx.fillRect(x + 4, bottomY - 38, 8, 38);
    ctx.fillRect(x + 20, bottomY - 46, 8, 46);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(x + 6, bottomY - 36, 4, 34);
    ctx.fillRect(x + 22, bottomY - 44, 4, 42);
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(x + 12, bottomY - 26, 8, 26);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x + 6, bottomY - 38, 6, 4);
    ctx.fillRect(x + 22, bottomY - 46, 6, 4);
  } else if (prop.kind === 'neonSign') {
    // Glowing cyber arcade beacon pylon
    const pulse = 0.72 + 0.28 * Math.sin(time * 6 + prop.tileX);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 11, bottomY - 76, 10, 76);
    ctx.fillRect(x - 2, bottomY - 88, 36, 26);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(x, bottomY - 86, 32, 22);
    ctx.fillStyle = '#e879f9';
    ctx.fillRect(x + 4, bottomY - 82, 24, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 8, bottomY - 78, 16, 6);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

export function drawTile(
  ctx: CanvasRenderingContext2D,
  kind: TileKind,
  px: number,
  py: number,
  biome: BiomeId,
  time: number,
  hasTopNeighbor: boolean
): void {
  const pal = BIOME_PALETTES[biome];
  const s = TILE_SIZE;

  if (kind === 'ground' || kind === 'dirt') {
    ctx.fillStyle = pal.dirtBody;
    ctx.fillRect(px, py, s, s);
    // Pixel texture speckles
    ctx.fillStyle = pal.dirtShade;
    ctx.fillRect(px + 4, py + 12, 6, 4);
    ctx.fillRect(px + 20, py + 20, 6, 5);
    ctx.fillRect(px + 10, py + 24, 4, 4);

    if (kind === 'ground' && !hasTopNeighbor) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px, py + 8, s, 2);
      ctx.fillStyle = pal.grassTop;
      ctx.fillRect(px, py, s, 8);
      ctx.fillStyle = pal.grassHighlight;
      ctx.fillRect(px, py, s, 3);
      // Hanging grass tufts
      ctx.fillStyle = pal.grassTop;
      ctx.fillRect(px + 4, py + 8, 5, 3);
      ctx.fillRect(px + 18, py + 8, 6, 4);
    }
  } else if (kind === 'brick') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px, py, s, s);
    ctx.fillStyle = pal.brickFill;
    ctx.fillRect(px + 2, py + 2, s - 4, s - 4);
    ctx.fillStyle = pal.brickTrim;
    ctx.fillRect(px + 2, py + 2, s - 4, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 2, py + 15, s - 4, 2);
    ctx.fillRect(px + 15, py + 2, 2, 13);
    ctx.fillRect(px + 8, py + 17, 2, 13);
    ctx.fillRect(px + 24, py + 17, 2, 13);
  } else if (kind === 'bridge') {
    ctx.fillStyle = '#451a03';
    ctx.fillRect(px, py, s, 10);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(px + 1, py + 1, s - 2, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px + 2, py + 2, s - 4, 2);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(px + 15, py, 2, 10);
  } else if (kind === 'coinBlock') {
    const shimmer = Math.sin(time * 6) > 0;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px, py, s, s);
    ctx.fillStyle = shimmer ? '#fbbf24' : '#f59e0b';
    ctx.fillRect(px + 2, py + 2, s - 4, s - 4);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px + 4, py + 4, s - 8, 3);
    // "?" symbol
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px + 11, py + 8, 10, 3);
    ctx.fillRect(px + 18, py + 11, 3, 4);
    ctx.fillRect(px + 14, py + 15, 7, 3);
    ctx.fillRect(px + 14, py + 21, 4, 4);
  } else if (kind === 'usedBlock') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px, py, s, s);
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 2, py + 2, s - 4, s - 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(px + 6, py + 6, s - 12, s - 12);
  } else if (kind === 'spike') {
    // 3 sharp pixel spikes
    for (let i = 0; i < 3; i++) {
      const sx = px + i * 10 + 1;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(sx, py + s);
      ctx.lineTo(sx + 5, py + 14);
      ctx.lineTo(sx + 10, py + s);
      ctx.fill();

      ctx.fillStyle = pal.spikeFill;
      ctx.beginPath();
      ctx.moveTo(sx + 1, py + s);
      ctx.lineTo(sx + 5, py + 16);
      ctx.lineTo(sx + 9, py + s);
      ctx.fill();

      ctx.fillStyle = pal.spikeTip;
      ctx.fillRect(sx + 4, py + 18, 2, 4);
    }
  } else if (kind === 'water') {
    const wave = Math.sin(time * 4 + px * 0.08) * 2;
    ctx.fillStyle = pal.waterDeep;
    ctx.fillRect(px, py + 6, s, s - 6);
    ctx.fillStyle = pal.waterSurface;
    ctx.fillRect(px, py + 4 + wave, s, 6);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(px + 4, py + 5 + wave, 10, 2);
  } else if (kind === 'spring') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 4, py + 24, 24, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(px + 10, py + 16, 12, 8);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + 3, py + 10, 26, 7);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(px + 5, py + 11, 22, 2);
  }
}

export function drawCoinSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  alpha = 1
): void {
  const spin = Math.abs(Math.cos(time * 6));
  const w = Math.max(4, Math.round(14 * spin));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(Math.round(x), Math.round(y));

  ctx.fillStyle = '#78350f';
  ctx.fillRect(-w / 2 - 2, -9, w + 4, 18);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-w / 2, -7, w, 14);
  if (w >= 8) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-w / 2 + 2, -5, Math.max(2, w - 5), 10);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-1, -4, 2, 8);
  }
  ctx.restore();
}

export function drawKeySprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
): void {
  const bob = Math.sin(time * 4) * 3;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y + bob));

  ctx.fillStyle = '#78350f';
  ctx.fillRect(-12, -7, 24, 14);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-10, -5, 8, 10);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-8, -3, 4, 6);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-2, -2, 13, 4);
  ctx.fillRect(5, 2, 3, 4);
  ctx.fillRect(9, 2, 2, 3);
  ctx.restore();
}

export function drawHeartSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
): void {
  const bob = Math.sin(time * 4.5) * 3;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y + bob));

  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-9, -7, 18, 14);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-8, -6, 7, 6);
  ctx.fillRect(1, -6, 7, 6);
  ctx.fillRect(-7, -2, 14, 6);
  ctx.fillRect(-4, 4, 8, 3);
  ctx.fillRect(-2, 7, 4, 2);
  ctx.fillStyle = '#fecaca';
  ctx.fillRect(-6, -5, 3, 3);
  ctx.restore();
}

export function drawPowerUpSprite(
  ctx: CanvasRenderingContext2D,
  kind: PowerUpKind,
  x: number,
  y: number,
  time: number
): void {
  const bob = Math.sin(time * 5) * 3;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y + bob));

  if (kind === 'star') {
    const hue = Math.floor((time * 240) % 360);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.fillStyle = `hsl(${hue}, 92%, 62%)`;
    ctx.fillRect(-8, -4, 16, 8);
    ctx.fillRect(-4, -9, 8, 18);
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -3, 3, 3);
  } else {
    // Golden Coin Magnet
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-9, -9, 18, 18);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-7, -7, 4, 12);
    ctx.fillRect(3, -7, 4, 12);
    ctx.fillRect(-7, 2, 14, 5);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-7, -7, 4, 4);
    ctx.fillRect(3, -7, 4, 4);
  }
  ctx.restore();
}

export function drawEnemySprite(
  ctx: CanvasRenderingContext2D,
  enemy: EnemyEntity,
  time: number
): void {
  ctx.save();
  const cx = enemy.x + enemy.w / 2;
  const bottomY = enemy.y + enemy.h;
  ctx.translate(Math.round(cx), Math.round(bottomY));

  if (!enemy.alive) {
    // Squished flat!
    ctx.scale(enemy.dir * 1.35, 0.35);
  } else {
    ctx.scale(enemy.dir, 1);
  }

  if (enemy.kind === 'slime') {
    const hop = enemy.alive ? Math.abs(Math.sin(enemy.animTime * 8)) * 3 : 0;
    ctx.translate(0, -hop);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-13, -20, 26, 20);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(-11, -18, 22, 16);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-8, -16, 10, 5);
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -11, 3, 4);
    ctx.fillRect(3, -11, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -11, 1, 2);
    ctx.fillRect(3, -11, 1, 2);
  } else if (enemy.kind === 'imp') {
    // Red horned runner like Video 1
    const step = enemy.alive ? Math.sin(enemy.animTime * 14) * 2 : 0;
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(-11, -24, 22, 20);
    // Horns
    ctx.fillRect(-10, -30, 5, 6);
    ctx.fillRect(5, -30, 5, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-9, -22, 18, 17);
    ctx.fillRect(-9, -28, 3, 6);
    ctx.fillRect(6, -28, 3, 6);
    // Angry eyes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(1, -17, 4, 3);
    ctx.fillRect(-6, -17, 4, 3);
    // Feet
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(-8 + step, -4, 5, 4);
    ctx.fillRect(3 - step, -4, 5, 4);
  } else if (enemy.kind === 'chicken') {
    // Flapping white chicken like Video 2
    const flap = enemy.alive ? Math.sin(enemy.animTime * 18) * 2 : 0;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-12, -24, 24, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -22, 20, 16);
    // Red comb & wattle
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-2, -27, 8, 5);
    ctx.fillRect(8, -14, 3, 4);
    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(9, -18, 5, 4);
    // Wing
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-7, -16 + flap, 9, 7);
    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, -19, 3, 3);
    // Legs
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-5, -4, 3, 4);
    ctx.fillRect(2, -4, 3, 4);
  } else if (enemy.kind === 'bird' || enemy.kind === 'bat') {
    const wingY = Math.sin(time * 16 + enemy.id) * 6;
    const isBat = enemy.kind === 'bat';
    ctx.fillStyle = isBat ? '#312e81' : '#0369a1';
    ctx.fillRect(-12, -20, 24, 16);
    ctx.fillStyle = isBat ? '#7c3aed' : '#38bdf8';
    ctx.fillRect(-10, -18, 20, 12);
    // Wings
    ctx.fillStyle = isBat ? '#5b21b6' : '#0284c7';
    ctx.fillRect(-16, -16 + wingY, 8, 7);
    ctx.fillRect(8, -16 - wingY, 8, 7);
    // Eyes & beak
    ctx.fillStyle = isBat ? '#fef08a' : '#ffffff';
    ctx.fillRect(2, -16, 4, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, -15, 2, 2);
    if (!isBat) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(10, -14, 5, 4);
    }
  } else if (enemy.kind === 'boss') {
    const stompBounce = enemy.alive ? Math.abs(Math.sin(enemy.animTime * 9)) * 2 : 0;
    const flash = enemy.hitCooldown > 0 && Math.floor(enemy.hitCooldown * 24) % 2 === 0;
    ctx.translate(0, -stompBounce);
    // Big Crowned King Imp (40x36)
    ctx.fillStyle = flash ? '#ffffff' : '#3b0764';
    ctx.fillRect(-18, -34, 36, 30);
    ctx.fillStyle = flash ? '#fef08a' : '#9333ea';
    ctx.fillRect(-16, -32, 32, 26);
    // Golden Crown
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, -41, 24, 7);
    ctx.fillRect(-12, -45, 5, 4);
    ctx.fillRect(-2, -46, 5, 5);
    ctx.fillRect(7, -45, 5, 4);
    // Fierce eyes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(2, -25, 6, 4);
    ctx.fillRect(-9, -25, 6, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(4, -24, 3, 3);
    ctx.fillRect(-7, -24, 3, 3);
    // Fangs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -14, 3, 4);
    ctx.fillRect(3, -14, 3, 4);
    // Heavy boots
    const step = enemy.alive ? Math.sin(enemy.animTime * 12) * 3 : 0;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-13 + step, -5, 9, 5);
    ctx.fillRect(4 - step, -5, 9, 5);
  }

  ctx.restore();

  // Boss HP pips above head
  if (enemy.kind === 'boss' && enemy.alive) {
    const pipW = 10;
    const gap = 4;
    const totalW = enemy.maxHp * pipW + (enemy.maxHp - 1) * gap;
    const startX = Math.round(cx - totalW / 2);
    const barY = Math.round(enemy.y - 16);
    for (let i = 0; i < enemy.maxHp; i++) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(startX + i * (pipW + gap) - 1, barY - 1, pipW + 2, 6);
      ctx.fillStyle = i < enemy.hp ? '#ef4444' : '#334155';
      ctx.fillRect(startX + i * (pipW + gap), barY, pipW, 4);
    }
  }
}

export function drawGoalFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottomY: number,
  time: number,
  unlocked: boolean
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(bottomY));

  // Striped candy/arcade pole like Video 1
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-5, -96, 10, 96);
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#ffffff';
    ctx.fillRect(-3, -94 + i * 8, 6, 7);
  }

  // Top orb / flag
  const wave = Math.sin(time * 7) * 3;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-10, -112, 20, 20);
  ctx.fillStyle = unlocked ? '#22c55e' : '#ef4444';
  ctx.fillRect(-8, -110, 16, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-5, -107, 4, 4);

  // Waving banner
  ctx.fillStyle = unlocked ? '#4ade80' : '#f97316';
  ctx.fillRect(5, -94 + wave * 0.3, 28, 16);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(10, -90 + wave * 0.3, 18, 8);

  ctx.restore();
}

export function drawCheckpointFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  bottomY: number,
  active: boolean,
  time: number
): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(bottomY));
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-3, -44, 6, 44);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-2, -42, 4, 42);

  const wave = active ? Math.sin(time * 8) * 2 : 0;
  ctx.fillStyle = active ? '#22c55e' : '#64748b';
  ctx.fillRect(2, -42 + wave * 0.4, 18, 12);
  if (active) {
    ctx.fillStyle = '#bbf7d0';
    ctx.fillRect(5, -39 + wave * 0.4, 8, 6);
  }
  ctx.restore();
}
