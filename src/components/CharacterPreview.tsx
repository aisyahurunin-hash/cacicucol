import { useEffect, useRef } from 'react';
import { drawCharacterSprite, getCharacterById } from '../game/characters';
import { CharacterId } from '../game/types';

interface CharacterPreviewProps {
  characterId: CharacterId;
  active: boolean;
  size?: number;
}

export function CharacterPreview({ characterId, active, size = 48 }: CharacterPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let animTime = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      animTime += dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      const char = getCharacterById(characterId);
      const spriteScale = size / 38;
      drawCharacterSprite(
        ctx,
        char,
        canvas.width / 2,
        canvas.height - 3,
        1,
        active ? 'run' : 'idle',
        animTime,
        spriteScale
      );

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [characterId, active, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pixelated block mx-auto"
      style={{ width: size, height: size }}
    />
  );
}
