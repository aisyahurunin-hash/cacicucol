import { ArrowRight, Download, Home, Play, RotateCcw, Trophy } from 'lucide-react';
import { HudSnapshot } from '../game/types';
import { downloadSourceZip } from '../utils/sourceZip';

interface GameModalsProps {
  hud: HudSnapshot;
  onResume: () => void;
  onRetry: () => void;
  onNextLevel: () => void;
  onTitle: () => void;
}

export function GameModals({
  hud,
  onResume,
  onRetry,
  onNextLevel,
  onTitle,
}: GameModalsProps) {
  if (hud.gameState === 'PLAYING' || hud.gameState === 'TITLE_MENU' || hud.gameState === 'DYING') {
    return null;
  }

  const isPaused = hud.gameState === 'PAUSED';
  const isClear = hud.gameState === 'LEVEL_CLEAR';
  const isVictory = hud.gameState === 'VICTORY';
  const isGameOver = hud.gameState === 'GAME_OVER';

  const stars =
    (hud.keys >= hud.totalKeys ? 1 : 0) +
    (hud.lives >= 3 ? 1 : 0) +
    (hud.coins >= Math.max(5, Math.floor(hud.totalLevelCoins * 0.4)) ? 1 : 0);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-600 rounded-2xl p-6 shadow-2xl text-center">
        {isPaused && (
          <>
            <h2 className="font-pixel text-2xl text-amber-300 mb-1">Paused</h2>
            <p className="text-sm text-slate-300 mb-6">
              Level {hud.levelIndex + 1}: {hud.levelName}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onResume}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-sm border-2 border-emerald-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Resume</span>
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs border-2 border-slate-600 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Level</span>
              </button>
              <button
                type="button"
                onClick={onTitle}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs border-2 border-slate-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Change Character / World</span>
              </button>
              <button
                type="button"
                onClick={downloadSourceZip}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-pixel text-xs border-2 border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Source (.zip)</span>
              </button>
            </div>
          </>
        )}

        {(isClear || isVictory) && (
          <>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/20 border-2 border-amber-400 mb-3">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <h2 className="font-pixel text-2xl text-emerald-300 mb-1">
              {isVictory ? 'All Worlds Cleared!' : 'Level Clear!'}
            </h2>
            <p className="text-sm text-slate-300 mb-4">{hud.levelName}</p>

            <div className="font-pixel text-2xl text-amber-300 tracking-widest mb-4">
              {'★'.repeat(Math.max(1, stars))}
              <span className="text-slate-600">{'☆'.repeat(3 - Math.max(1, stars))}</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-700 rounded-xl p-3 mb-5 font-pixel text-xs tabular-nums">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-slate-400 text-[10px]">Score</div>
                  <div className="text-white mt-0.5">{hud.score}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Keys</div>
                  <div className="text-amber-300 mt-0.5">
                    {hud.keys}/{hud.totalKeys}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Hearts</div>
                  <div className="text-rose-400 mt-0.5">
                    {hud.lives}/{hud.maxLives}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-800">
                <div>
                  <div className="text-slate-400 text-[10px]">Coins</div>
                  <div className="text-yellow-300 mt-0.5">{hud.coins}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Stomped</div>
                  <div className="text-emerald-300 mt-0.5">{hud.enemiesStomped}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {isClear && (
                <button
                  type="button"
                  onClick={onNextLevel}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-sm border-2 border-emerald-200 cursor-pointer"
                >
                  <span>Next Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onRetry}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs border-2 border-slate-600 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                type="button"
                onClick={onTitle}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs border-2 border-slate-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Main Menu</span>
              </button>
            </div>
          </>
        )}

        {isGameOver && (
          <>
            <h2 className="font-pixel text-2xl text-rose-400 mb-1">Game Over</h2>
            <p className="text-sm text-slate-300 mb-5">
              Out of hearts in {hud.levelName}!
            </p>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/70 border border-slate-700 rounded-xl p-3 mb-5 font-pixel text-xs tabular-nums">
              <div>
                <div className="text-slate-400 text-[10px]">Final Score</div>
                <div className="text-white mt-0.5">{hud.score}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">Coins</div>
                <div className="text-amber-300 mt-0.5">{hud.coins}</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-sm border-2 border-emerald-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onTitle}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs border-2 border-slate-600 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Main Menu</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
