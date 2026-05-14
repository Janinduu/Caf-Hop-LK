"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { FullLogo } from "./Logo";

interface Props {
  onSkip: () => void;
}

export function CinematicHero({ onSkip }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Image: subtle Ken Burns zoom, fades to transparent as user scrolls
  const imageOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.65, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Content (logo + tagline): drifts up and fades a bit faster than the image
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      aria-label="CaféHop LK intro"
      className="relative h-[100dvh] sm:h-[120vh] z-0"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
        {/* Image layer */}
        <motion.div
          style={{ opacity: imageOpacity, scale: imageScale }}
          className="absolute inset-0"
        >
          <Image
            src="/hero/04-golden.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/80 pointer-events-none" />

        {/* Logo — upper-middle on mobile, near-top on desktop */}
        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
          className="absolute inset-x-0 top-[22vh] sm:top-16 flex flex-col items-center px-6 z-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white drop-shadow-2xl"
          >
            <div className="sm:hidden">
              <FullLogo size={130} variant="light" />
            </div>
            <div className="hidden sm:block">
              <FullLogo size={180} variant="light" />
            </div>
          </motion.div>
        </motion.div>

        {/* Big glassy tagline anchored to the lower part of the hero */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-x-0 bottom-20 sm:bottom-28 flex justify-center px-6 z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center leading-[1.15] hero-tagline"
          >
            <span className="whitespace-normal sm:whitespace-nowrap">
              A handpicked atlas of Sri Lanka&apos;s
            </span>
            <br />
            <span className="whitespace-normal sm:whitespace-nowrap">
              cafes &amp; quiet corners.
            </span>
          </motion.p>
        </motion.div>

        {/* Skip intro button — respects iOS safe-area with floor for webviews */}
        <button
          type="button"
          onClick={onSkip}
          style={{
            top: "max(calc(env(safe-area-inset-top, 0px) + 1rem), 4rem)",
            right: "max(calc(env(safe-area-inset-right, 0px) + 1rem), 1rem)",
          }}
          className="group absolute z-20 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 text-xs font-medium hover:bg-white/25 transition-colors"
        >
          <span>Skip intro</span>
          <X
            size={12}
            strokeWidth={2.25}
            className="transition-transform group-hover:rotate-90"
          />
        </button>

        {/* Scroll hint */}
        <ScrollHint scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}

function ScrollHint({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/85 flex flex-col items-center gap-1.5 pointer-events-none"
    >
      <span className="text-[10px] uppercase tracking-[0.3em]">
        Scroll to explore
      </span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={16} strokeWidth={2} />
      </motion.span>
    </motion.div>
  );
}
