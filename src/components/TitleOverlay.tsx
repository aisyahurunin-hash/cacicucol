import { Download, Play, Volume2, VolumeX } from 'lucide-react';
import { CHARACTERS } from '../game/characters';
import { LEVELS } from '../game/levels';
import { CharacterId, LevelProgressRecord } from '../game/types';
import { downloadSourceZip } from '../utils/sourceZip';
import { CharacterPreview } from './CharacterPreview';

interface TitleOverlayProps {
  selectedCharacter: CharacterId;
  selectedLevelIndex: number;
  muted: boolean;
  progress: Record<number, LevelProgressRecord>;
  onSelectCharacter: (id: CharacterId) => void;
  onSelectLevel: (idx: number) => void;
  onPlay: () => void;
  onToggleMute: () => void;
}

const BIOME_SWATCH: Record<string, string> = {
  meadow: 'bg-emerald-500 border-emerald-300',
  autumn: 'bg-amber-500 border-amber-300',
  cavern: 'bg-violet-600 border-violet-300',
  sunset: 'bg-orange-500 border-orange-300',
  frost: 'bg-sky-500 border-sky-200',
  bamboo: 'bg-teal-500 border-emerald-200',
  volcano: 'bg-rose-600 border-orange-300',
  sakura: 'bg-pink-400 border-pink-200',
  desert: 'bg-yellow-500 border-amber-200',
  ocean: 'bg-cyan-500 border-cyan-200',
  cyber: 'bg-fuchsia-500 border-cyan-300',
  citadel: 'bg-indigo-600 border-yellow-300',
};

function StatSquares({ value, max = 6 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 border ${
            i < value
              ? 'bg-slate-200 border-slate-100'
              : 'bg-slate-800 border-slate-500'
          }`}
        />
      ))}
    </span>
  );
}

export function TitleOverlay({
  selectedCharacter,
  selectedLevelIndex,
  muted,
  progress,
  onSelectCharacter,
  onSelectLevel,
  onPlay,
  onToggleMute,
}: TitleOverlayProps) {
  const totalStars = Object.values(progress).reduce((sum, rec) => sum + (rec.stars || 0), 0);
  const maxStars = LEVELS.length * 3;
  const activeChar = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 bg-slate-950/55 overflow-y-auto">
      {/* Top utility row */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="text-xs font-pixel text-slate-200 tracking-wide flex items-center gap-3 tabular-nums">
          <span>5 HEARTS · {CHARACTERS.length} HEROES · {LEVELS.length} WORLDS</span>
          <span className="text-amber-300">★ {totalStars}/{maxStars}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadSourceZip}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 border-2 border-slate-700 hover:border-amber-400 text-xs font-pixel text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Source ZIP</span>
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-slate-900 border-2 border-slate-700 hover:border-slate-400 text-slate-100 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Center hero lockup + selectors */}
      <div className="mx-auto w-full max-w-4xl flex flex-col items-center gap-3.5 my-auto py-2">
        {/* Bespoke SVG pixel-arcade title lockup */}
        <div className="flex flex-col items-center gap-1 animate-float-slow">
          <svg
            viewBox="0 0 540 96"
            className="w-[260px] sm:w-[400px] h-auto drop-shadow-[0_6px_0_rgba(15,23,42,0.95)]"
            aria-label="CACICUCOL"
          >
            <defs>
              <linearGradient id="caciGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="52%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <rect x="8" y="8" width="524" height="80" rx="10" fill="#0f172a" stroke="#facc15" strokeWidth="4" />
            <text
              x="270"
              y="66"
              textAnchor="middle"
              fill="url(#caciGrad)"
              stroke="#451a03"
              strokeWidth="6"
              paintOrder="stroke"
              style={{ fontFamily: 'Silkscreen, monospace', fontWeight: 700, fontSize: '54px', letterSpacing: '6px' }}
            >
              CACICUCOL
            </text>
          </svg>
          <p className="text-[11px] sm:text-xs text-slate-100 font-medium tracking-wide drop-shadow text-center">
            Leap through {LEVELS.length} vibrant realms, brace for shifting weather, and guard your 5 hearts
          </p>
        </div>

        {/* Character Selector (12 Pixel Heroes matching reference grid) */}
        <div
          className="w-full border-2 border-[#5a4ba8] rounded-xl p-3 sm:p-4 shadow-2xl"
          style={{ background: 'radial-gradient(circle at 50% 30%, rgba(58, 42, 106, 0.94), rgba(18, 12, 40, 0.96))' }}
        >
          <div className="flex items-center justify-center mb-2.5">
            <span className="font-pixel text-sm sm:text-base text-[#ffe27a] tracking-[0.18em] drop-shadow-[0_2px_0_rgba(0,0,0,0.45)]">
              PILIH KARAKTER
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2.5">
            {CHARACTERS.map((char) => {
              const isSelected = char.id === selectedCharacter;
              return (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => onSelectCharacter(char.id)}
                  className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border-2 transition-transform active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#52429c] border-[#ffd23f] scale-[1.04] shadow-[0_0_12px_rgba(255,210,63,0.3)]'
                      : 'bg-[#2d2360] border-[#5a4ba8] hover:border-[#ffd23f]'
                  }`}
                >
                  <CharacterPreview characterId={char.id} active={isSelected} size={46} />
                  <span className="mt-1 text-[11px] sm:text-xs font-extrabold text-white truncate max-w-full">
                    {char.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-[#cfc3ff] tabular-nums">
            <span className="font-bold text-white">
              {activeChar.name} — {activeChar.tagline}
            </span>
            <span className="text-[#9a8fd0]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <span>Kecepatan</span>
              <StatSquares value={activeChar.speedStat} />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span>Lompat</span>
              <StatSquares value={activeChar.jumpStat} />
            </span>
          </div>
        </div>

        {/* World / Level Selector (20 Worlds) */}
        <div className="w-full bg-slate-900/90 border-2 border-slate-700 rounded-xl p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-pixel text-xs text-emerald-300">
              Select Place / Level ({LEVELS.length} Worlds)
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 truncate max-w-full">
              LV {LEVELS[selectedLevelIndex].id}: {LEVELS[selectedLevelIndex].name} · {LEVELS[selectedLevelIndex].subtitle}
            </span>
          </div>
          <div className="max-h-36 sm:max-h-44 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
            {LEVELS.map((lvl, idx) => {
              const isSelected = idx === selectedLevelIndex;
              const rec = progress[lvl.id];
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(idx)}
                  className={`flex flex-col items-start p-2 rounded-lg border-2 text-left transition-transform active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_2px_0_0_#059669]'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-0.5">
                    <span className={`w-2.5 h-2.5 rounded-sm border ${BIOME_SWATCH[lvl.biome]}`} />
                    <span className="font-pixel text-[10px] text-slate-300 tabular-nums">
                      {rec?.cleared ? `${'★'.repeat(rec.stars)}${'☆'.repeat(3 - rec.stars)}` : `LV ${lvl.id}`}
                    </span>
                  </div>
                  <span className="font-pixel text-[10px] sm:text-[11px] text-white truncate w-full">
                    {lvl.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Play CTA */}
        <button
          type="button"
          onClick={onPlay}
          className="inline-flex items-center justify-center gap-3 px-10 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-base sm:text-lg border-2 border-emerald-200 shadow-[0_5px_0_0_#065f46] active:translate-y-1 active:shadow-[0_1px_0_0_#065f46] transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>PLAY</span>
        </button>
      </div>

      {/* Bottom single-line control hint */}
      <div className="text-center text-[11px] sm:text-xs text-slate-200 font-medium tracking-wide shrink-0">
        A / D or Arrows Move · Space / W Jump &amp; Double Jump · Shift / X Dash · Cling Walls to Wall-Jump · Esc Pause
      </div>
    </div>
  );
}
