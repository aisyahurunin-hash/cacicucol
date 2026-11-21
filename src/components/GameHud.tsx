import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Gamepad2,
  Magnet,
  Pause,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';
import { getCharacterById } from '../game/characters';
import { HudSnapshot, WeatherKind } from '../game/types';

function WeatherBadge({ weather }: { weather: WeatherKind }) {
  const map: Record<WeatherKind, { label: string; color: string; Icon: typeof Sun }> = {
    clear: { label: 'Sunny', color: 'text-amber-200', Icon: Sun },
    rain: { label: 'Rain', color: 'text-sky-300', Icon: CloudRain },
    snow: { label: 'Snow', color: 'text-cyan-100', Icon: CloudSnow },
    storm: { label: 'Storm', color: 'text-indigo-300', Icon: CloudLightning },
    leaves: { label: 'Wind', color: 'text-orange-300', Icon: Wind },
    petals: { label: 'Petals', color: 'text-pink-300', Icon: Wind },
    sparks: { label: 'Sparks', color: 'text-violet-300', Icon: Sparkles },
  };
  const info = map[weather];
  const Icon = info.Icon;
  return (
    <span className={`inline-flex items-center gap-1 ${info.color}`}>
      <Icon className="w-3 h-3" />
      <span>{info.label}</span>
    </span>
  );
}

interface GameHudProps {
  hud: HudSnapshot;
  onPause: () => void;
  onToggleMute: () => void;
  onTouchControl: (control: 'left' | 'right' | 'jump' | 'dash', pressed: boolean) => void;
}

function PixelHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 16 14" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" aria-hidden="true">
      <path
        d="M2 1h4v1h1v1h2V2h1V1h4v1h1v4h-1v2h-2v2h-2v2H9v1H7v-1H5v-2H3V8H2V6H1V2h1V1z"
        fill={filled ? '#ef4444' : '#334155'}
        stroke="#0f172a"
        strokeWidth="1.2"
      />
      {filled && <rect x="3" y="3" width="2" height="2" fill="#fecaca" />}
    </svg>
  );
}

function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth < 1024
  );
}

export function GameHud({ hud, onPause, onToggleMute, onTouchControl }: GameHudProps) {
  const char = getCharacterById(hud.characterId);
  const [showTouchControls, setShowTouchControls] = useState<boolean>(detectTouchDevice);
  const [activeKeys, setActiveKeys] = useState({ left: false, right: false, jump: false, dash: false });

  const dpadRef = useRef<HTMLDivElement | null>(null);
  const jumpRef = useRef<HTMLButtonElement | null>(null);
  const dashRef = useRef<HTMLButtonElement | null>(null);
  const touchCallbackRef = useRef(onTouchControl);
  touchCallbackRef.current = onTouchControl;

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
        setShowTouchControls(true);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Independent multi-touch listeners using targetTouches so D-pad, Dash, and Jump never block each other
  useEffect(() => {
    if (!showTouchControls) return;
    const dpadEl = dpadRef.current;
    const jumpEl = jumpRef.current;
    const dashEl = dashRef.current;
    if (!dpadEl || !jumpEl || !dashEl) return;

    let dpadLeft = false;
    let dpadRight = false;
    let jumpDown = false;
    let dashDown = false;

    const syncDpadTouches = (e: TouchEvent) => {
      e.preventDefault();
      let nextLeft = false;
      let nextRight = false;
      const rect = dpadEl.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;

      for (let i = 0; i < e.targetTouches.length; i++) {
        const t = e.targetTouches[i];
        if (t.clientX < midX) {
          nextLeft = true;
        } else {
          nextRight = true;
        }
      }

      if (nextLeft !== dpadLeft) {
        dpadLeft = nextLeft;
        touchCallbackRef.current('left', nextLeft);
      }
      if (nextRight !== dpadRight) {
        dpadRight = nextRight;
        touchCallbackRef.current('right', nextRight);
      }
      setActiveKeys((prev) =>
        prev.left === nextLeft && prev.right === nextRight
          ? prev
          : { ...prev, left: nextLeft, right: nextRight }
      );
    };

    const syncJumpTouches = (e: TouchEvent) => {
      e.preventDefault();
      const nextJump = e.targetTouches.length > 0;
      if (nextJump !== jumpDown) {
        jumpDown = nextJump;
        touchCallbackRef.current('jump', nextJump);
        setActiveKeys((prev) => (prev.jump === nextJump ? prev : { ...prev, jump: nextJump }));
      }
    };

    const syncDashTouches = (e: TouchEvent) => {
      e.preventDefault();
      const nextDash = e.targetTouches.length > 0;
      if (nextDash !== dashDown) {
        dashDown = nextDash;
        touchCallbackRef.current('dash', nextDash);
        setActiveKeys((prev) => (prev.dash === nextDash ? prev : { ...prev, dash: nextDash }));
      }
    };

    const opts: AddEventListenerOptions = { passive: false };
    dpadEl.addEventListener('touchstart', syncDpadTouches, opts);
    dpadEl.addEventListener('touchmove', syncDpadTouches, opts);
    dpadEl.addEventListener('touchend', syncDpadTouches, opts);
    dpadEl.addEventListener('touchcancel', syncDpadTouches, opts);

    jumpEl.addEventListener('touchstart', syncJumpTouches, opts);
    jumpEl.addEventListener('touchmove', syncJumpTouches, opts);
    jumpEl.addEventListener('touchend', syncJumpTouches, opts);
    jumpEl.addEventListener('touchcancel', syncJumpTouches, opts);

    dashEl.addEventListener('touchstart', syncDashTouches, opts);
    dashEl.addEventListener('touchmove', syncDashTouches, opts);
    dashEl.addEventListener('touchend', syncDashTouches, opts);
    dashEl.addEventListener('touchcancel', syncDashTouches, opts);

    return () => {
      dpadEl.removeEventListener('touchstart', syncDpadTouches);
      dpadEl.removeEventListener('touchmove', syncDpadTouches);
      dpadEl.removeEventListener('touchend', syncDpadTouches);
      dpadEl.removeEventListener('touchcancel', syncDpadTouches);

      jumpEl.removeEventListener('touchstart', syncJumpTouches);
      jumpEl.removeEventListener('touchmove', syncJumpTouches);
      jumpEl.removeEventListener('touchend', syncJumpTouches);
      jumpEl.removeEventListener('touchcancel', syncJumpTouches);

      dashEl.removeEventListener('touchstart', syncDashTouches);
      dashEl.removeEventListener('touchmove', syncDashTouches);
      dashEl.removeEventListener('touchend', syncDashTouches);
      dashEl.removeEventListener('touchcancel', syncDashTouches);

      if (dpadLeft) touchCallbackRef.current('left', false);
      if (dpadRight) touchCallbackRef.current('right', false);
      if (jumpDown) touchCallbackRef.current('jump', false);
      if (dashDown) touchCallbackRef.current('dash', false);
    };
  }, [showTouchControls]);

  const bindMouseOnly = (control: 'left' | 'right' | 'jump' | 'dash') => ({
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      e.preventDefault();
      onTouchControl(control, true);
      setActiveKeys((prev) => ({ ...prev, [control]: true }));
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      e.preventDefault();
      onTouchControl(control, false);
      setActiveKeys((prev) => ({ ...prev, [control]: false }));
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      onTouchControl(control, false);
      setActiveKeys((prev) => (prev[control] ? { ...prev, [control]: false } : prev));
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const progressPct = Math.round(hud.levelProgress * 100);
  const dashOnCooldown = hud.dashCooldownRatio > 0.05;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-4">
      {/* Top 3px Stage Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950/80" aria-hidden="true">
        <div
          className="h-full bg-amber-400 transition-[width] duration-150"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Top Perimeter HUD */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 pt-0.5">
        {/* Top-left: 5 Hearts + Level & Hero + Active Power-Up Timers */}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-1.5 bg-slate-950/75 border-2 border-slate-800 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2">
            <div className="flex items-center gap-1" aria-label={`Lives: ${hud.lives} of ${hud.maxLives}`}>
              {Array.from({ length: hud.maxLives }).map((_, i) => (
                <PixelHeart key={i} filled={i < hud.lives} />
              ))}
              <span className="ml-1.5 font-pixel text-xs text-rose-300 tabular-nums">
                {hud.lives}/{hud.maxLives}
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-pixel text-slate-200 flex items-center gap-2">
              <span>{char.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-300">
                LV {hud.levelIndex + 1} {hud.levelName}
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="hidden sm:inline-flex">
                <WeatherBadge weather={hud.weather} />
              </span>
            </div>
          </div>

          {(hud.starTimeLeft > 0 || hud.magnetTimeLeft > 0) && (
            <div className="flex items-center gap-1.5">
              {hud.starTimeLeft > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-amber-500/90 border-2 border-yellow-200 rounded-md px-2 py-1 font-pixel text-[10px] text-slate-950 tabular-nums">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>STAR {hud.starTimeLeft}s</span>
                </div>
              )}
              {hud.magnetTimeLeft > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-sky-500/90 border-2 border-sky-200 rounded-md px-2 py-1 font-pixel text-[10px] text-slate-950 tabular-nums">
                  <Magnet className="w-3.5 h-3.5" />
                  <span>MAGNET {hud.magnetTimeLeft}s</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top-right: Coins, Keys, Score, Timer + Touch Controls Toggle, Mute & Pause */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 bg-slate-950/75 border-2 border-slate-800 rounded-lg px-2.5 sm:px-3 py-2 font-pixel text-xs sm:text-sm tabular-nums">
            <div className="flex items-center gap-1.5 text-amber-300">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-amber-700" />
              <span>{hud.coins}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-200">
              <svg viewBox="0 0 16 10" className="w-4 h-3" aria-hidden="true">
                <rect x="0" y="2" width="6" height="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                <rect x="6" y="4" width="9" height="2" fill="#fbbf24" />
                <rect x="11" y="6" width="2" height="3" fill="#fbbf24" />
                <rect x="14" y="6" width="2" height="2" fill="#fbbf24" />
              </svg>
              <span>
                {hud.keys}/{hud.totalKeys}
              </span>
            </div>
            <div className="hidden sm:block text-white">{hud.score.toString().padStart(5, '0')}</div>
            <div className={`${hud.timeLeft <= 25 ? 'text-rose-400' : 'text-sky-200'}`}>
              {hud.timeLeft}s
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTouchControls((prev) => !prev)}
            aria-label={showTouchControls ? 'Hide on-screen buttons' : 'Show on-screen buttons'}
            title={showTouchControls ? 'Hide Touch Buttons' : 'Show Touch Buttons'}
            className={`pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-950/85 border-2 transition-colors ${
              showTouchControls
                ? 'border-emerald-400 text-emerald-300'
                : 'border-slate-700 hover:border-slate-400 text-slate-300'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={hud.muted ? 'Unmute audio' : 'Mute audio'}
            className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-950/85 border-2 border-slate-700 hover:border-slate-400 text-white transition-colors"
          >
            {hud.muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={onPause}
            aria-label="Pause game"
            className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-950/85 border-2 border-slate-700 hover:border-amber-400 text-white transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-Touch On-Screen Controls: Independent Slide D-Pad + Dash & Jump Buttons */}
      {showTouchControls && (
        <div className="flex items-end justify-between w-full pb-2 px-1 sm:px-2 touch-none select-none">
          <div
            ref={dpadRef}
            className="flex items-center gap-2.5 pointer-events-auto touch-none select-none p-1.5 rounded-2xl bg-slate-950/35"
          >
            <button
              type="button"
              aria-label="Move Left"
              {...bindMouseOnly('left')}
              className={`touch-none select-none w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex items-center justify-center text-white shadow-lg transition-transform ${
                activeKeys.left
                  ? 'bg-amber-400/50 border-amber-300 scale-95'
                  : 'bg-slate-950/75 border-slate-400/80'
              }`}
            >
              <ArrowLeft className="w-7 h-7 pointer-events-none" />
            </button>
            <button
              type="button"
              aria-label="Move Right"
              {...bindMouseOnly('right')}
              className={`touch-none select-none w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex items-center justify-center text-white shadow-lg transition-transform ${
                activeKeys.right
                  ? 'bg-amber-400/50 border-amber-300 scale-95'
                  : 'bg-slate-950/75 border-slate-400/80'
              }`}
            >
              <ArrowRight className="w-7 h-7 pointer-events-none" />
            </button>
          </div>

          <div className="flex items-end gap-2.5 touch-none select-none">
            <button
              ref={dashRef}
              type="button"
              aria-label="Dash"
              {...bindMouseOnly('dash')}
              className={`pointer-events-auto touch-none select-none w-16 h-16 rounded-full border-3 flex flex-col items-center justify-center text-slate-950 font-pixel shadow-lg transition-transform ${
                dashOnCooldown
                  ? 'bg-amber-700/60 border-amber-400/50 opacity-70'
                  : activeKeys.dash
                    ? 'bg-amber-200 border-white scale-95'
                    : 'bg-amber-400/90 border-amber-200'
              }`}
            >
              <Zap className="w-5 h-5 stroke-[2.5] pointer-events-none" />
              <span className="text-[8px] leading-none mt-0.5 pointer-events-none">DASH</span>
            </button>

            <button
              ref={jumpRef}
              type="button"
              aria-label="Jump"
              {...bindMouseOnly('jump')}
              className={`pointer-events-auto touch-none select-none w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center text-slate-950 font-pixel shadow-lg transition-transform ${
                activeKeys.jump
                  ? 'bg-emerald-300 border-white scale-95'
                  : 'bg-emerald-500/90 border-emerald-200'
              }`}
            >
              <ArrowUp className="w-7 h-7 stroke-[3] pointer-events-none" />
              <span className="text-[9px] leading-none mt-0.5 pointer-events-none">JUMP</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
