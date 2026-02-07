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
import { Sparkles, Code2, PenLine, Calendar, BarChart3, Layout, Building2, FileSignature, Box } from 'lucide-react';

const SLOT_WIDTH_PX = 140;
/** One slot passes by in this many ms for a continuous stream */
const MS_PER_SLOT = 3500;

export interface PlatformItem {
  id: string;
  name: string;
  icon: ReactNode;
}

const DEFAULT_PLATFORMS: PlatformItem[] = [
  // AI (all packages)
  { id: 'openai', name: 'OpenAI', icon: <SiOpenai className="size-full shrink-0" aria-hidden /> },
  { id: 'anthropic', name: 'Anthropic', icon: <SiAnthropic className="size-full shrink-0" aria-hidden /> },
  { id: 'cursor', name: 'Cursor', icon: <Code2 className="size-full shrink-0" aria-hidden /> },
  { id: 'canva', name: 'Canva', icon: <SiCanva className="size-full shrink-0" aria-hidden /> },
  { id: 'github', name: 'GitHub Copilot', icon: <SiGithub className="size-full shrink-0" aria-hidden /> },
  { id: 'jasper', name: 'Jasper', icon: <PenLine className="size-full shrink-0" aria-hidden /> },
  { id: 'midjourney', name: 'Midjourney', icon: <Sparkles className="size-full shrink-0" aria-hidden /> },
  // Web Apps
  { id: 'nextjs', name: 'Next.js', icon: <SiNextdotjs className="size-full shrink-0" aria-hidden /> },
  { id: 'supabase', name: 'Supabase', icon: <SiSupabase className="size-full shrink-0" aria-hidden /> },
  { id: 'stripe', name: 'Stripe', icon: <SiStripe className="size-full shrink-0" aria-hidden /> },
  { id: 'vercel', name: 'Vercel', icon: <SiVercel className="size-full shrink-0" aria-hidden /> },
  // Social Media
  { id: 'buffer', name: 'Buffer', icon: <SiBuffer className="size-full shrink-0" aria-hidden /> },
  { id: 'later', name: 'Later', icon: <Calendar className="size-full shrink-0" aria-hidden /> },
  { id: 'metricool', name: 'Metricool', icon: <BarChart3 className="size-full shrink-0" aria-hidden /> },
  { id: 'google-analytics', name: 'Google Analytics', icon: <SiGoogleanalytics className="size-full shrink-0" aria-hidden /> },
  { id: 'hootsuite', name: 'Hootsuite', icon: <SiHootsuite className="size-full shrink-0" aria-hidden /> },
  // Agency
  { id: 'systeme-io', name: 'Systeme.io', icon: <Layout className="size-full shrink-0" aria-hidden /> },
  { id: 'gohighlevel', name: 'GoHighLevel', icon: <Building2 className="size-full shrink-0" aria-hidden /> },
  { id: 'hubspot', name: 'HubSpot', icon: <SiHubspot className="size-full shrink-0" aria-hidden /> },
  { id: 'clickup', name: 'ClickUp', icon: <SiClickup className="size-full shrink-0" aria-hidden /> },
  { id: 'hello-bonsai', name: 'Hello Bonsai', icon: <FileSignature className="size-full shrink-0" aria-hidden /> },
  { id: 'zite', name: 'Zite', icon: <Box className="size-full shrink-0" aria-hidden /> },
  // Freelancing
  { id: 'fiverr', name: 'Fiverr', icon: <SiFiverr className="size-full shrink-0" aria-hidden /> },
  { id: 'upwork', name: 'Upwork', icon: <SiUpwork className="size-full shrink-0" aria-hidden /> },
  { id: 'paypal', name: 'PayPal', icon: <SiPaypal className="size-full shrink-0" aria-hidden /> },
];

interface CompatibleWithCarouselProps {
  platforms?: PlatformItem[];
  /** Milliseconds for one logo to travel one slot width (controls stream speed). */
  msPerSlot?: number;
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
  msPerSlot = MS_PER_SLOT,
  slotWidth = SLOT_WIDTH_PX,
}: CompatibleWithCarouselProps) {
  const [position, setPosition] = useState(0);
  const lastTimeRef = useRef<number>(0);
  const n = platforms.length;
  const strip = [...platforms, ...platforms];
  const wrapAt = n * slotWidth;
  const pxPerMs = slotWidth / msPerSlot;

  useEffect(() => {
    let rafId: number;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      setPosition((prev) => {
        let next = prev + pxPerMs * delta;
        while (next >= wrapAt) next -= wrapAt;
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [wrapAt, pxPerMs]);

  const containerWidth = slotWidth * 3;
  const translateX = -position;

  return (
    <section className="mb-12" aria-label="Compatible with tools and platforms">
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
          }}
        >
          {strip.map((platform, i) => {
            const centerOffset = position / slotWidth;
            const distance = i - centerOffset - 1;
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
