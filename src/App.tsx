import { useCallback, useEffect, useRef, useState } from 'react';
import { GameHud } from './components/GameHud';
import { GameModals } from './components/GameModals';
import { TitleOverlay } from './components/TitleOverlay';
import { soundEngine } from './game/audio';
import { GameEngine } from './game/engine';
import { LEVELS } from './game/levels';
import { CharacterId, HudSnapshot, LevelProgressRecord } from './game/types';

const STORAGE_KEY = 'cacicocol_progress_v1';

const INITIAL_HUD: HudSnapshot = {
  gameState: 'TITLE_MENU',
  lives: 5,
  maxLives: 5,
  coins: 0,
  totalLevelCoins: 0,
  keys: 0,
  totalKeys: 3,
  score: 0,
  timeLeft: 180,
  levelIndex: 0,
  levelName: LEVELS[0].name,
  biome: LEVELS[0].biome,
  characterId: 'kelinci',
  muted: false,
  comboCount: 0,
  starTimeLeft: 0,
  magnetTimeLeft: 0,
  dashCooldownRatio: 0,
  levelProgress: 0,
  enemiesStomped: 0,
  weather: 'clear',
};

function loadProgress(): Record<number, LevelProgressRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [progress, setProgress] = useState<Record<number, LevelProgressRecord>>(loadProgress);

  // Sync canvas logical dimensions cleanly to viewport aspect ratio with 576px world height
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const worldHeight = 18 * 32; // 576px (matches 18-row tile maps)
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const logicalWidth = Math.max(640, Math.min(1280, Math.round(worldHeight * aspect)));
    if (canvas.width !== logicalWidth || canvas.height !== worldHeight) {
      canvas.width = logicalWidth;
      canvas.height = worldHeight;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const engine = new GameEngine(canvas, (snapshot) => {
      setHud(snapshot);
    });
    engineRef.current = engine;
    engine.start();

    const unlockAudio = () => soundEngine.unlock();
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('touchend', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('touchend', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      engine.destroy();
      engineRef.current = null;
    };
  }, [updateCanvasSize]);

  // Save level progress when clearing a level or finishing the game
  useEffect(() => {
    if (hud.gameState === 'LEVEL_CLEAR' || hud.gameState === 'VICTORY') {
      const levelId = LEVELS[hud.levelIndex].id;
      const stars =
        (hud.keys >= hud.totalKeys ? 1 : 0) +
        (hud.lives >= 3 ? 1 : 0) +
        (hud.coins >= Math.max(5, Math.floor(hud.totalLevelCoins * 0.4)) ? 1 : 0);

      setProgress((prev) => {
        const existing = prev[levelId];
        const next: Record<number, LevelProgressRecord> = {
          ...prev,
          [levelId]: {
            cleared: true,
            bestScore: Math.max(existing?.bestScore ?? 0, hud.score),
            bestCoins: Math.max(existing?.bestCoins ?? 0, hud.coins),
            stars: Math.max(existing?.stars ?? 0, Math.max(1, stars)),
          },
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });
    }
  }, [hud.gameState, hud.levelIndex, hud.score, hud.coins, hud.keys, hud.totalKeys, hud.lives, hud.totalLevelCoins]);

  // Allow Enter / Space to start from Title Screen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hud.gameState === 'TITLE_MENU' && (e.code === 'Enter' || e.code === 'Space')) {
        if (document.activeElement?.tagName === 'BUTTON' || document.activeElement?.tagName === 'A') {
          return;
        }
        e.preventDefault();
        engineRef.current?.startGame();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hud.gameState]);

  const handleSelectCharacter = useCallback((id: CharacterId) => {
    engineRef.current?.setCharacter(id);
  }, []);

  const handleSelectLevel = useCallback((idx: number) => {
    engineRef.current?.selectLevel(idx);
  }, []);

  const handlePlay = useCallback(() => {
    engineRef.current?.startGame();
  }, []);

  const handleToggleMute = useCallback(() => {
    engineRef.current?.toggleMute();
  }, []);

  const handlePause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    engineRef.current?.resume();
  }, []);

  const handleRetry = useCallback(() => {
    engineRef.current?.retryLevel();
  }, []);

  const handleNextLevel = useCallback(() => {
    engineRef.current?.nextLevel();
  }, []);

  const handleTitle = useCallback(() => {
    engineRef.current?.returnToTitle();
  }, []);

  const handleTouchControl = useCallback(
    (control: 'left' | 'right' | 'jump' | 'dash', pressed: boolean) => {
      engineRef.current?.setTouchControl(control, pressed);
    },
    []
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Isolated Canvas Container */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover pixelated"
      />

      {hud.gameState === 'TITLE_MENU' && (
        <TitleOverlay
          selectedCharacter={hud.characterId}
          selectedLevelIndex={hud.levelIndex}
          muted={hud.muted}
          progress={progress}
          onSelectCharacter={handleSelectCharacter}
          onSelectLevel={handleSelectLevel}
          onPlay={handlePlay}
          onToggleMute={handleToggleMute}
        />
      )}

      {hud.gameState !== 'TITLE_MENU' && (
        <GameHud
          hud={hud}
          onPause={handlePause}
          onToggleMute={handleToggleMute}
          onTouchControl={handleTouchControl}
        />
      )}

      <GameModals
        hud={hud}
        onResume={handleResume}
        onRetry={handleRetry}
        onNextLevel={handleNextLevel}
        onTitle={handleTitle}
      />
    </main>
  );
}
