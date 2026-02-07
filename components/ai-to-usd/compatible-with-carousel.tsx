'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import {
  SiOpenai,
  SiAnthropic,
  SiCanva,
  SiGithub,
  SiBuffer,
  SiStripe,
  SiNextdotjs,
  SiSupabase,
  SiVercel,
  SiGoogleanalytics,
  SiHootsuite,
  SiHubspot,
  SiClickup,
  SiFiverr,
  SiUpwork,
  SiPaypal,
} from 'react-icons/si';

const SLOT_WIDTH_PX = 140;
const CONTAINER_MAX_WIDTH_PX = SLOT_WIDTH_PX * 3;
/** Time between each cycle step (one logo moves left). */
const CYCLE_INTERVAL_MS = 3000;
const STEP_TRANSITION_MS = 400;
/** Idle time (no interaction) before auto-advance resumes. */
const IDLE_BEFORE_RESUME_MS = 3000;

export interface PlatformItem {
  id: string;
  name: string;
  icon: ReactNode;
}

const DEFAULT_PLATFORMS: PlatformItem[] = [
  // AI
  { id: 'openai', name: 'OpenAI', icon: <SiOpenai className="size-full shrink-0" aria-hidden /> },
  { id: 'anthropic', name: 'Anthropic', icon: <SiAnthropic className="size-full shrink-0" aria-hidden /> },
  { id: 'canva', name: 'Canva', icon: <SiCanva className="size-full shrink-0" aria-hidden /> },
  { id: 'github', name: 'GitHub Copilot', icon: <SiGithub className="size-full shrink-0" aria-hidden /> },
  // Web Apps
  { id: 'nextjs', name: 'Next.js', icon: <SiNextdotjs className="size-full shrink-0" aria-hidden /> },
  { id: 'supabase', name: 'Supabase', icon: <SiSupabase className="size-full shrink-0" aria-hidden /> },
  { id: 'stripe', name: 'Stripe', icon: <SiStripe className="size-full shrink-0" aria-hidden /> },
  { id: 'vercel', name: 'Vercel', icon: <SiVercel className="size-full shrink-0" aria-hidden /> },
  // Social Media
  { id: 'buffer', name: 'Buffer', icon: <SiBuffer className="size-full shrink-0" aria-hidden /> },
  { id: 'google-analytics', name: 'Google Analytics', icon: <SiGoogleanalytics className="size-full shrink-0" aria-hidden /> },
  { id: 'hootsuite', name: 'Hootsuite', icon: <SiHootsuite className="size-full shrink-0" aria-hidden /> },
  // Agency
  { id: 'hubspot', name: 'HubSpot', icon: <SiHubspot className="size-full shrink-0" aria-hidden /> },
  { id: 'clickup', name: 'ClickUp', icon: <SiClickup className="size-full shrink-0" aria-hidden /> },
  // Freelancing
  { id: 'fiverr', name: 'Fiverr', icon: <SiFiverr className="size-full shrink-0" aria-hidden /> },
  { id: 'upwork', name: 'Upwork', icon: <SiUpwork className="size-full shrink-0" aria-hidden /> },
  { id: 'paypal', name: 'PayPal', icon: <SiPaypal className="size-full shrink-0" aria-hidden /> },
];

interface CompatibleWithCarouselProps {
  platforms?: PlatformItem[];
  /** Milliseconds between each cycle step (one slot moves left). */
  cycleIntervalMs?: number;
  /** Idle ms after last interaction before auto-advance resumes. */
  idleBeforeResumeMs?: number;
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
  cycleIntervalMs = CYCLE_INTERVAL_MS,
  idleBeforeResumeMs = IDLE_BEFORE_RESUME_MS,
  slotWidth = SLOT_WIDTH_PX,
}: CompatibleWithCarouselProps) {
  /** Integer index 0..n (wrap when n). One logo per slot; keeps left/middle/right centered. */
  const [scrollOffset, setScrollOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const skipTransitionRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const n = platforms.length;
  const strip = [...platforms, ...platforms];
  /** One slot = 1/3 of container; strip has 2n slots so width = (200*n/3)% of container. Each slot = 100/(2n)% of strip. */
  const stripWidthPercent = (200 * n) / 3;
  const slotWidthPercentOfStrip = 100 / (2 * n);

  const scheduleResume = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setPaused(false), idleBeforeResumeMs);
  };

  const onInteract = () => {
    setPaused(true);
    scheduleResume();
  };

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setScrollOffset((p) => p + 1), cycleIntervalMs);
    return () => clearInterval(t);
  }, [paused, cycleIntervalMs, n]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    onInteract();
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = scrollOffset;
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    const totalDeltaX = dragStartXRef.current - e.clientX;
    const containerW = containerRef.current?.getBoundingClientRect().width ?? CONTAINER_MAX_WIDTH_PX;
    const slotW = containerW / 3;
    const slotDelta = Math.round(totalDeltaX / slotW);
    const oneStep = Math.max(-1, Math.min(1, slotDelta));
    const target = dragStartOffsetRef.current + oneStep;
    setScrollOffset(Math.max(0, Math.min(n, target)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 5) return;
    e.preventDefault();
    onInteract();
    setScrollOffset((p) => {
      const step = delta > 0 ? 1 : -1;
      const next = p + step;
      if (next < 0) return 0;
      if (next >= n) return n;
      return next;
    });
  };

  useEffect(() => {
    if (scrollOffset >= n) {
      skipTransitionRef.current = true;
      const raf = requestAnimationFrame(() => {
        setScrollOffset((prev) => (prev >= n ? prev - n : prev));
        requestAnimationFrame(() => {
          skipTransitionRef.current = false;
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [scrollOffset, n]);

  const effectiveOffset = scrollOffset >= n ? scrollOffset - n : scrollOffset;
  const translateXPercent = (effectiveOffset / (2 * n)) * 100;
  const useTransition = !skipTransitionRef.current;
  const slotHeightMin = slotWidth + 32;

  return (
    <section className="mb-12 w-full overflow-x-hidden" aria-label="Compatible with tools and platforms">
      <h2 className="text-center text-xl md:text-2xl font-semibold mb-6 text-foreground">
        Compatible with
      </h2>
      <div className="w-full flex justify-center">
        <div
          ref={containerRef}
          className="overflow-hidden relative cursor-grab active:cursor-grabbing touch-none select-none w-full"
          style={{ maxWidth: CONTAINER_MAX_WIDTH_PX, minHeight: slotHeightMin }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          role="region"
          aria-label="Scroll to browse compatible platforms"
        >
        <div
          className="flex flex-nowrap items-stretch"
          style={{
            width: `${stripWidthPercent}%`,
            minHeight: slotHeightMin,
            transform: `translateX(-${translateXPercent}%)`,
            transition: useTransition ? `transform ${STEP_TRANSITION_MS}ms ease-in-out` : 'none',
          }}
        >
          {strip.map((platform, i) => {
            const distance = i - effectiveOffset - 1;
            const scale = getScale(distance);
            const opacity = getOpacity(distance);
            return (
              <div
                key={`${platform.id}-${i}`}
                className="flex flex-shrink-0 flex-col items-center justify-center gap-2"
                style={{
                  width: `${slotWidthPercentOfStrip}%`,
                  minHeight: slotHeightMin,
                  transform: `scale(${scale})`,
                  opacity,
                  transition: useTransition
                    ? `transform ${STEP_TRANSITION_MS}ms ease-in-out, opacity ${STEP_TRANSITION_MS}ms ease-in-out`
                    : 'none',
                }}
              >
                <div
                  className="flex items-center justify-center text-foreground [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg]:shrink-0 transition-transform duration-200 ease-out hover:scale-110 cursor-default"
                  style={{ width: 72, height: 72, color: 'var(--foreground)' }}
                  title={platform.name}
                >
                  {platform.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center leading-tight truncate max-w-full px-1">
                  {platform.name}
                </span>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
