'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import { SiOpenai, SiAnthropic, SiCanva, SiGithub } from 'react-icons/si';
import { Sparkles } from 'lucide-react';

const SLOT_WIDTH_PX = 140;
const INTERVAL_MS = 3500;
const TRANSITION_MS = 500;

export interface PlatformItem {
  id: string;
  name: string;
  icon: ReactNode;
}

const DEFAULT_PLATFORMS: PlatformItem[] = [
  { id: 'openai', name: 'OpenAI', icon: <SiOpenai className="size-full shrink-0" aria-hidden /> },
  { id: 'anthropic', name: 'Anthropic', icon: <SiAnthropic className="size-full shrink-0" aria-hidden /> },
  { id: 'canva', name: 'Canva', icon: <SiCanva className="size-full shrink-0" aria-hidden /> },
  { id: 'github', name: 'GitHub Copilot', icon: <SiGithub className="size-full shrink-0" aria-hidden /> },
  { id: 'midjourney', name: 'Midjourney', icon: <Sparkles className="size-full shrink-0" aria-hidden /> },
];

interface CompatibleWithCarouselProps {
  platforms?: PlatformItem[];
  intervalMs?: number;
  slotWidth?: number;
}

function getScale(distance: number): number {
  if (Math.abs(distance) < 0.5) return 1.2;
  if (Math.abs(distance) <= 1) return 0.85;
  return 0.75;
}

function getOpacity(distance: number): number {
  if (distance < -1.2) return 0;
  if (distance > 1.2) return 0;
  if (distance < -0.8) return Math.max(0, (distance + 1.2) / 0.4);
  if (distance > 1) return Math.max(0, (1.2 - distance) / 0.2);
  return 1;
}

export function CompatibleWithCarousel({
  platforms = DEFAULT_PLATFORMS,
  intervalMs = INTERVAL_MS,
  slotWidth = SLOT_WIDTH_PX,
}: CompatibleWithCarouselProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const skipTransitionRef = useRef(false);
  const n = platforms.length;
  const strip = [...platforms, ...platforms];

  useEffect(() => {
    const t = setInterval(() => {
      setScrollOffset((prev) => prev + 1);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  useEffect(() => {
    if (scrollOffset >= n) {
      skipTransitionRef.current = true;
      const raf = requestAnimationFrame(() => {
        setScrollOffset(0);
        requestAnimationFrame(() => {
          skipTransitionRef.current = false;
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [scrollOffset, n]);

  const containerWidth = slotWidth * 3;
  const effectiveOffset = scrollOffset >= n ? 0 : scrollOffset;
  const translateX = -(effectiveOffset * slotWidth);
  const useTransition = !skipTransitionRef.current;

  return (
    <section className="mb-12" aria-label="Compatible with AI platforms">
      <h2 className="text-center text-xl md:text-2xl font-semibold mb-6 text-foreground">
        Compatible with
      </h2>
      <div
        className="mx-auto overflow-hidden relative"
        style={{ width: containerWidth, minHeight: slotWidth + 24 }}
      >
        <div
          className="flex flex-nowrap items-center"
          style={{
            width: strip.length * slotWidth,
            minHeight: slotWidth,
            transform: `translateX(${translateX}px)`,
            transition: useTransition ? `transform ${TRANSITION_MS}ms ease-in-out` : 'none',
          }}
        >
          {strip.map((platform, i) => {
            const distance = i - effectiveOffset - 1;
            const scale = getScale(distance);
            const opacity = getOpacity(distance);
            return (
              <div
                key={`${platform.id}-${i}`}
                className="flex flex-shrink-0 items-center justify-center"
                style={{
                  width: slotWidth,
                  height: slotWidth,
                  transform: `scale(${scale})`,
                  opacity,
                  transition: useTransition
                    ? `transform ${TRANSITION_MS}ms ease-in-out, opacity ${TRANSITION_MS}ms ease-in-out`
                    : 'none',
                }}
              >
                <div
                  className="flex items-center justify-center text-foreground [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg]:shrink-0"
                  style={{ width: 72, height: 72, color: 'var(--foreground)' }}
                  title={platform.name}
                >
                  {platform.icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
