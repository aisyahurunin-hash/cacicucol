import { CharacterDef, CharacterId, PlayerAnimState } from './types';

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'kelinci',
    name: 'Kelinci',
    tagline: 'Seimbang & lincah',
    bodyColor: '#FEFDF8',
    bellyColor: '#FFD5DF',
    accentColor: '#FF90A3',
    outlineColor: '#2B1C39',
    earStyle: 'bunny',
    trailColor: '#FFFFFF',
    speedBonus: 1.0,
    jumpBonus: 1.0,
    speedStat: 4,
    jumpStat: 4,
  },
  {
    id: 'kodok',
    name: 'Kodok',
    tagline: 'Lompatan tinggi',
    bodyColor: '#6FD359',
    bellyColor: '#E3F9A7',
    accentColor: '#65AF58',
    outlineColor: '#2B1D37',
    earStyle: 'frog',
    trailColor: '#86EFAC',
    speedBonus: 1.0,
    jumpBonus: 1.05,
    speedStat: 4,
    jumpStat: 5,
  },
  {
    id: 'kucing',
    name: 'Kucing',
    tagline: 'Lincah & gesit',
    bodyColor: '#FFA849',
    bellyColor: '#FFF1D6',
    accentColor: '#FF7E64',
    outlineColor: '#2B1C39',
    earStyle: 'cat',
    trailColor: '#FDBA74',
    speedBonus: 1.04,
    jumpBonus: 1.0,
    speedStat: 5,
    jumpStat: 4,
  },
  {
    id: 'anjing',
    name: 'Anjing',
    tagline: 'Setia & cepat',
    bodyColor: '#D8A56C',
    bellyColor: '#FFF1D6',
    accentColor: '#7A4A24',
    outlineColor: '#2B1C39',
    earStyle: 'dog',
    trailColor: '#FCD34D',
    speedBonus: 1.05,
    jumpBonus: 0.98,
    speedStat: 5,
    jumpStat: 3,
  },
  {
    id: 'panda',
    name: 'Panda',
    tagline: 'Santai tapi kuat',
    bodyColor: '#FFFFFF',
    bellyColor: '#DCDADF',
    accentColor: '#111111',
    outlineColor: '#2B1C39',
    earStyle: 'panda',
    trailColor: '#E2E8F0',
    speedBonus: 0.97,
    jumpBonus: 1.02,
    speedStat: 3,
    jumpStat: 4,
  },
  {
    id: 'rubah',
    name: 'Rubah',
    tagline: 'Pelari tercepat',
    bodyColor: '#FF7930',
    bellyColor: '#FFFEFF',
    accentColor: '#FE6857',
    outlineColor: '#2B1C39',
    earStyle: 'fox',
    trailColor: '#FB923C',
    speedBonus: 1.08,
    jumpBonus: 1.0,
    speedStat: 6,
    jumpStat: 4,
  },
  {
    id: 'ayam',
    name: 'Ayam',
    tagline: 'Sayap ringan',
    bodyColor: '#FEF8E0',
    bellyColor: '#FEE9A8',
    accentColor: '#FFA71F',
    outlineColor: '#2B1C39',
    earStyle: 'chicken',
    trailColor: '#FEF08A',
    speedBonus: 1.0,
    jumpBonus: 1.04,
    speedStat: 4,
    jumpStat: 5,
  },
  {
    id: 'robo',
    name: 'Robo',
    tagline: 'Presisi & stabil',
    bodyColor: '#D6DEE9',
    bellyColor: '#ABB4C5',
    accentColor: '#38E8FF',
    outlineColor: '#2B1C39',
    earStyle: 'robo',
    trailColor: '#7DD3FC',
    speedBonus: 1.02,
    jumpBonus: 1.01,
    speedStat: 4,
    jumpStat: 4,
  },
  {
    id: 'dino',
    name: 'Dino',
    tagline: 'Pelompat tangguh',
    bodyColor: '#57C96A',
    bellyColor: '#D5F5A0',
    accentColor: '#FF6B6B',
    outlineColor: '#2B1C39',
    earStyle: 'dino',
    trailColor: '#4ADE80',
    speedBonus: 1.0,
    jumpBonus: 1.06,
    speedStat: 4,
    jumpStat: 5,
  },
  {
    id: 'pinguin',
    name: 'Pinguin',
    tagline: 'Licin & cepat',
    bodyColor: '#2B3550',
    bellyColor: '#FFFFFF',
    accentColor: '#FFA71F',
    outlineColor: '#2B1C39',
    earStyle: 'penguin',
    trailColor: '#BAE6FD',
    speedBonus: 1.05,
    jumpBonus: 1.0,
    speedStat: 5,
    jumpStat: 4,
  },
  {
    id: 'beruang',
    name: 'Beruang',
    tagline: 'Kuat & mantap',
    bodyColor: '#996A40',
    bellyColor: '#DFB98A',
    accentColor: '#D26260',
    outlineColor: '#2B1C39',
    earStyle: 'bear',
    trailColor: '#D97706',
    speedBonus: 0.97,
    jumpBonus: 1.05,
    speedStat: 3,
    jumpStat: 5,
  },
  {
    id: 'babi',
    name: 'Babi',
    tagline: 'Imut & membal',
    bodyColor: '#FEB3C7',
    bellyColor: '#FFD5DF',
    accentColor: '#FF799A',
    outlineColor: '#2B1C39',
    earStyle: 'pig',
    trailColor: '#F9A8D4',
    speedBonus: 1.01,
    jumpBonus: 1.02,
    speedStat: 4,
    jumpStat: 4,
  },
];

interface SpriteMatrix {
  palette: Record<string, string>;
  rows: string[];
  blinkKeys?: string[];
  feetTopRow: number; // row index where legs start (last 2 rows)
}

const SPRITE_MATRICES: Record<CharacterId, SpriteMatrix> = {
  kelinci: {
    palette: {
      A: '#2B1C39',
      B: '#FEFDF8',
      C: '#FF90A3',
      D: '#111111',
      E: '#FFD5DF',
      F: '#DAD9D4',
    },
    rows: [
      '....AAAA.AAAA..',
      '....ABBA.ABBA..',
      '....ACCA.ACCA..',
      '....ACCA.ACCA..',
      '....ACCA.ACCA..',
      '..AAAAAAAAAAAA.',
      '..ABBBBBBBBBBA.',
      '.ABBBBBBBBBBBBA',
      '.ABBBBBBBBBBBBA',
      '.ABBBBBDBBBDBBA',
      '.ABBBEDDEEDDBBA',
      '.ABBCCDDEEDDCCA',
      '.ABBBEEEEEEBBBA',
      'ABAFFEEEEEEFFA.',
      '..AAAAAAAAAAAA.',
      '...ABBA..ABBA..',
      '...AAAA..AAAA..',
    ],
    blinkKeys: ['D'],
    feetTopRow: 15,
  },
  kodok: {
    palette: {
      A: '#2B1D37',
      B: '#FFFFFF',
      C: '#111111',
      D: '#6FD359',
      E: '#E3F9A7',
      F: '#65AF58',
    },
    rows: [
      '.AAAAA..AAAAA.',
      '.ABBBA..ABBBA.',
      '.ABBCAAAABBCA.',
      '.ABBCADDABBCA.',
      'AAAAAADDAAAAAA',
      'ADDDDDDDDDDDDA',
      'ADDDDDDDDDDDDA',
      'ADDDEEEEEEDDDA',
      'ADDDEEEEEEDDDA',
      'ADDDEEEEAAAAAA',
      'ADDDEEEEEEDDDA',
      '.AFFEEEEEEFFA.',
      '.AAAAAAAAAAAA.',
      '..ADDA..ADDA..',
      '..AAAA..AAAA..',
    ],
    blinkKeys: ['C'],
    feetTopRow: 13,
  },
  kucing: {
    palette: {
      A: '#2B1C39',
      B: '#FFA849',
      C: '#FFFFFF',
      D: '#111111',
      E: '#FFF1D6',
      F: '#FF7E64',
      G: '#FF9DA2',
      H: '#C16728',
      I: '#D4914D',
    },
    rows: [
      '..AAAA....AAAA.',
      '..ABBA....ABBA.',
      '..AAAAAAAAAAAA.',
      '..ABBBBBBBBBBA.',
      '.ABBBBBBBBBBBBA',
      '.ABBBBBBBBBBBBA',
      '.ABBBBCDBBCDBBA',
      '.ABBBEDDEEDDAAA',
      '.ABBFGDDEEDDAAA',
      '.ABBBEEEEEEBBBA',
      'AHAIIEEEEEEIIA.',
      '.AAAAAAAAAAAAA.',
      '...ABBA..ABBA..',
      '...AAAA..AAAA..',
    ],
    blinkKeys: ['D'],
    feetTopRow: 12,
  },
  anjing: {
    palette: {
      A: '#2B1C39',
      B: '#D8A56C',
      C: '#7A4A24',
      D: '#FFFFFD',
      E: '#171008',
      F: '#FFF1D6',
      G: '#EF7A71',
      H: '#FE9EA2',
      I: '#B78D65',
    },
    rows: [
      '.AAAAAAAAAAAA.',
      'AABBBBBBBBBBA.',
      'ABCCCCBBBBBBBA',
      'ABCCCCBBBBBBBA',
      'ABCCCDEBBDEBBA',
      'ABBBFEEFFEEAAA',
      'ABBGHEEFFEEAAA',
      'ABBBFFFFFFBBBA',
      'ABBBFFFFFFBBBA',
      '.AIIFFFFFFIIA.',
      '.AAAAAAAAAAAA.',
      '..ABBA..ABBA..',
      '..AAAA..AAAA..',
    ],
    blinkKeys: ['E'],
    feetTopRow: 11,
  },
  panda: {
    palette: {
      A: '#2B1C39',
      B: '#FFFFFF',
      C: '#111111',
      D: '#DCDADF',
    },
    rows: [
      '.AAAA....AAAA.',
      '.AAAAAAAAAAAA.',
      '.ABBBBBBBBBBA.',
      'ABBBBBBBBBBBBA',
      'ABBBBBBBBBBBBA',
      'ABBBBBCBBBCBBA',
      'ABBBBCCBBCCBBA',
      'ABAAACCAACCABA',
      'ABAAAAAAAAAABA',
      '.AAAADDDDAAAA.',
      '.AAAAAAAAAAAA.',
      '..AAAA..AAAA..',
      '..AAAA..AAAA..',
    ],
    blinkKeys: ['C'],
    feetTopRow: 11,
  },
  rubah: {
    palette: {
      A: '#2B1C39',
      B: '#FF7930',
      C: '#FFFEFF',
      D: '#1C0E03',
      E: '#FE6857',
      F: '#FFA4B5',
      G: '#D26A37',
    },
    rows: [
      '...AAAA....AAAA.',
      '...ABBA....ABBA.',
      '...AAAAAAAAAAAA.',
      '...ABBBBBBBBBBA.',
      '..ABBBBBBBBBBBBA',
      'AAABBBBBBBBBBBBA',
      'ACABBBBCDBBCDBBA',
      'ACABBBCDDCCDDAAA',
      'ABABBEFDDCCDDAAA',
      'ABABBBCCCCCCCCCA',
      'ABABBBCCCCCCBBBA',
      '.AAAAGGCCCCCGGA.',
      '...AAAAAAAAAAAA.',
      '....ABBA..ABBA..',
      '....AAAA..AAAA..',
    ],
    blinkKeys: ['D'],
    feetTopRow: 13,
  },
  ayam: {
    palette: {
      A: '#2B1C39',
      B: '#FF3B3C',
      C: '#FEF8E0',
      D: '#111111',
      E: '#FEE9A8',
      F: '#FFA71F',
      G: '#FF9A8E',
      H: '#E1861B',
      I: '#DBD4C4',
    },
    rows: [
      '.....AAAAA......',
      '.....ABABA......',
      '..AAAAAAAAAAAA..',
      '..ACCCCCCCCCCA..',
      '.ACCCCCCCCCCCCA.',
      '.ACCCCCCCCCCCCA.',
      '.ACCCCCDCCCDCCA.',
      '.ACEEEDDEEDDFFFA',
      '.ACEGGDDEEDDHHHA',
      '.ACEEEEEEEECCCA.',
      '..AEEEEEEEEIIA..',
      '..AAAAAAAAAAAA..',
      '....ACCA..ACCA..',
      '....AAAA..AAAA..',
    ],
    blinkKeys: ['D'],
    feetTopRow: 12,
  },
  robo: {
    palette: {
      A: '#2B1C39',
      B: '#FFD33F',
      C: '#D6DEE9',
      D: '#ABB4C5',
      E: '#0D1A2A',
      F: '#38E8FF',
      G: '#7A8597',
      H: '#9399A7',
      I: '#6B7388',
    },
    rows: [
      '.....AAAA.....',
      '.....ABBA.....',
      '.....AAAA.....',
      '......AA......',
      '......AA......',
      '.AAAAAAAAAAAA.',
      '.ACCCCCCCCCCA.',
      'ADDDDDDDDDDDDA',
      'ADDDEEEEEEEEDA',
      'ADDDEFFEEFFEDA',
      'ADDDEEEEEEEEDA',
      'ADDDGGGGGGDGDA',
      'ADDDGFFFFGDGDA',
      'ADDDGFFFFGDGDA',
      '.AHHGGGGGGHGA.',
      '.AAAAAAAAAAAA.',
      '..AIIA..AIIA..',
      '..AAAA..AAAA..',
    ],
    blinkKeys: [],
    feetTopRow: 16,
  },
  dino: {
    palette: {
      A: '#2B1C39',
      B: '#FF6B6B',
      C: '#57C96A',
      D: '#47AA5A',
      E: '#FFFFFF',
      F: '#111111',
      G: '#D5F5A0',
      H: '#B48C72',
      I: '#ECA089',
    },
    rows: [
      '......AAA......',
      '....AAAABAAAA..',
      '....ABAABAABA..',
      '..AAAAAAAAAAAA.',
      '..ACCCCCCCCCCA.',
      '.ACCCCCCDDCCCCA',
      '.ACCDDCCDDCCCCA',
      '.ACCDDEFCCEFCCA',
      '.ACCCGFFGGFFCCA',
      '.ACCHIFFGGFFHHA',
      '.ACCCGGGGGGCCCA',
      'ABADDGGGGGGDDA.',
      '.AAAAAAAAAAAAA.',
      '...ACCA..ACCA..',
      '...AAAA..AAAA..',
    ],
    blinkKeys: ['F'],
    feetTopRow: 13,
  },
  pinguin: {
    palette: {
      A: '#2B1C39',
      B: '#2B3550',
      C: '#FFFFFF',
      D: '#111111',
      E: '#FFA71F',
      F: '#FFA4B5',
      G: '#E2851B',
    },
    rows: [
      '.AAAAAAAAAAAA...',
      '.ABBBBBBBBBBA...',
      'ABBBBBBBBBBBBA..',
      'ABBBBBBBBBBBBA..',
      'ABBCCCDCCCDBBA..',
      'ABBCCDDCCDDEEEA.',
      'ABBFFDDCCDDGGGA.',
      'ABBCCCCCCCCBBA..',
      'ABBCCCCCCCCBBA..',
      '.AACCCCCCCCAA...',
      '.AAAAAAAAAAAA...',
      '...AEEA..AEEA...',
      '...AAAA..AAAA...',
    ],
    blinkKeys: ['D'],
    feetTopRow: 11,
  },
  beruang: {
    palette: {
      A: '#2B1C39',
      B: '#996A40',
      C: '#FFFFFF',
      D: '#111111',
      E: '#DFB98A',
      F: '#D26260',
      G: '#F18481',
    },
    rows: [
      '.AAAA....AAAA.',
      '.AAAAAAAAAAAA.',
      '.ABBBBBBBBBBA.',
      'ABBBBBBBBBBBBA',
      'ABBBBBBBBBBBBA',
      'ABBBBCDBBCDBBA',
      'ABBBEDDEEDDAAA',
      'ABBFGDDEEDDAAA',
      'ABBBEEEEEEEEEA',
      '.ABBEEEEEEEEEA',
      '.AAAAAAAAAAAA.',
      '..ABBA..ABBA..',
      '..AAAA..AAAA..',
    ],
    blinkKeys: ['D'],
    feetTopRow: 11,
  },
  babi: {
    palette: {
      A: '#2B1C39',
      B: '#FEB3C7',
      C: '#FFFFFF',
      D: '#111111',
      E: '#FFD5DF',
      F: '#FF799A',
      G: '#E45072',
      H: '#C3456A',
      I: '#D89BAD',
    },
    rows: [
      '..AAAA....AAAA..',
      '..ABBA....ABBA..',
      '..AAAAAAAAAAAA..',
      '..ABBBBBBBBBBA..',
      '.ABBBBBBBBBBBBA.',
      '.ABBBBBBBBBBBBA.',
      '.ABBBBCDBBCDBBA.',
      '.ABBBEDDEEDDFFFA',
      '.ABBFFDDEEDDFGFA',
      '.ABBBEEEEEFHFHFA',
      '.ABBBEEEEEFFFFFA',
      '..AIIEEEEEEIIA..',
      '..AAAAAAAAAAAA..',
      '...ABBA..ABBA...',
      '...AAAA..AAAA...',
    ],
    blinkKeys: ['D'],
    feetTopRow: 13,
  },
};

export function getCharacterById(id: CharacterId): CharacterDef {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}

export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  char: CharacterDef,
  cx: number,
  bottomY: number,
  facing: 1 | -1,
  anim: PlayerAnimState,
  animTime: number,
  scale = 1,
  flashWhite = false
): void {
  const sprite = SPRITE_MATRICES[char.id] || SPRITE_MATRICES.kelinci;
  const rows = sprite.rows;
  const hCells = rows.length;
  const wCells = rows[0].length;
  const pxUnit = 2; // 15 cells * 2 = 30px world width/height matching 32px tiles

  ctx.save();
  ctx.translate(Math.round(cx), Math.round(bottomY));

  let scaleX = facing * scale;
  let scaleY = scale;
  let offsetY = 0;
  let rotation = 0;

  if (anim === 'idle') {
    const breath = Math.sin(animTime * 4.5) * 0.03;
    scaleY *= 1 + breath;
    scaleX *= 1 - breath * 0.5;
  } else if (anim === 'run') {
    const bounce = Math.abs(Math.sin(animTime * 14));
    offsetY = -bounce * 2 * scale;
  } else if (anim === 'jump') {
    scaleX *= 0.9;
    scaleY *= 1.1;
  } else if (anim === 'doubleJump') {
    rotation = animTime * 16 * facing;
    scaleX *= 0.92;
    scaleY *= 0.92;
  } else if (anim === 'fall') {
    scaleX *= 1.06;
    scaleY *= 0.94;
  } else if (anim === 'wallSlide') {
    scaleX *= 0.92;
    scaleY *= 1.05;
  } else if (anim === 'hurt') {
    rotation = -0.2 * facing;
    scaleX *= 1.08;
    scaleY *= 0.9;
  } else if (anim === 'win') {
    offsetY = -Math.abs(Math.sin(animTime * 10)) * 6 * scale;
  }

  ctx.translate(0, offsetY);
  ctx.rotate(rotation);
  ctx.scale(scaleX, scaleY);

  const originX = -(wCells * pxUnit) / 2;
  const originY = -(hCells * pxUnit);

  // Walking foot lift matching the animated Kelinci in reference screenshot
  const stepPhase = anim === 'run' ? Math.floor(animTime * 10) % 2 : -1;
  const halfCol = Math.floor(wCells / 2);

  for (let r = 0; r < hCells; r++) {
    const rowStr = rows[r];
    for (let c = 0; c < wCells; c++) {
      const ch = rowStr[c];
      if (ch === '.') continue;
      let color = sprite.palette[ch];
      if (!color) continue;

      if (flashWhite) {
        color = '#FFFFFF';
      }

      let liftY = 0;
      if (r >= sprite.feetTopRow && stepPhase !== -1) {
        const isLeftFoot = c < halfCol;
        if ((stepPhase === 0 && !isLeftFoot) || (stepPhase === 1 && isLeftFoot)) {
          liftY = -pxUnit;
        }
      }

      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(originX + c * pxUnit),
        Math.round(originY + r * pxUnit + liftY),
        pxUnit,
        pxUnit
      );
    }
  }

  ctx.restore();
}
