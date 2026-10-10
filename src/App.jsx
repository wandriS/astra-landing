import { useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Command,
  Sparkles,
} from "lucide-react";

import OrbScene from "./components/OrbScene";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";

function Navbar({ onExplore }) {
  return (
    <nav className="relative z-20 flex items-center justify-between gap-4">
      <a
        href="#home"
        aria-label="Astra home"
        className="flex shrink-0 items-center gap-2.5"
      >
        <span className="grid size-10 place-items-center rounded-xl border border-white/90 bg-white/75 shadow-sm backdrop-blur-xl">
          <Command size={19} strokeWidth={1.7} />
        </span>

        <span className="text-lg font-semibold tracking-tight">
          astra<span className="text-violet-500">.</span>
        </span>
      </a>

      <div className="hidden items-center gap-7 md:flex">
        <a
          href="#home"
          className="text-sm text-zinc-500 transition hover:text-violet-600"
        >
          Overview
        </a>

        <button
          onClick={onExplore}
          className="text-sm text-zinc-500 transition hover:text-violet-600"
        >
          Experience
        </button>
      </div>

      <a
        href="mailto:hello@example.com?subject=Astra%20project"
        className="group flex shrink-0 items-center gap-2 rounded-full border border-white bg-white/70 px-3.5 py-2.5 text-xs font-medium shadow-sm backdrop-blur-xl transition hover:border-violet-200 hover:bg-white sm:px-4 sm:text-sm"
      >
        Contact
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </nav>
  );
}

export default function App() {
  const [explored, setExplored] = useState(false);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();

  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.25]);

  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, -35]);

  const reveal = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const scrollToExperience = () => {
    setExplored(true);

    document.getElementById("experience")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <Loader />
      <CustomCursor />

      <main
        id="home"
        className="relative isolate min-h-[145svh] overflow-clip bg-[#fbfaff] text-zinc-900"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-20 size-[420px] rounded-full bg-violet-200/35 blur-[120px]" />

          <div className="absolute -right-40 top-40 size-[480px] rounded-full bg-sky-200/35 blur-[140px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(#65558b 0.7px, transparent 0.7px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <section className="sticky top-0 h-[100svh] min-h-[580px] overflow-hidden">
          <OrbScene />

          <motion.div
            style={{
              opacity: contentOpacity,
              y: contentY,
            }}
            className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 pb-6 pt-6 sm:px-10 sm:pt-8 lg:px-16"
          >
            <div className="pointer-events-auto">
              <Navbar onExplore={scrollToExperience} />
            </div>

            <div className="flex flex-1 items-center">
              <div className="w-full max-w-xl">
                <motion.div
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-3.5 py-2 shadow-[0_4px_24px_rgba(83,63,130,0.06)] backdrop-blur-xl"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 sm:text-[11px]">
                    A new dimension of AI
                  </span>

                  <Sparkles size={13} className="text-violet-500" />
                </motion.div>

                <motion.h1
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.12 }}
                  className="text-[clamp(3.15rem,7.4vw,6.8rem)] font-medium leading-[0.94] tracking-[-0.075em]"
                >
                  Intelligence,
                  <br />
                  <span className="text-shimmer">in motion.</span>
                </motion.h1>

                <motion.p
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.24 }}
                  className="mt-6 max-w-md text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8"
                >
                  Discover a new kind of digital experience. Where fluid forms,
                  living light, and intelligent design come together.
                </motion.p>

                <motion.div
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.36 }}
                  className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3"
                >
                  <button
                    onClick={scrollToExperience}
                    className="group inline-flex items-center gap-3 rounded-full bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-violet-700 sm:px-6"
                  >
                    {explored ? "Explore again" : "Explore the experience"}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <button
                    onClick={scrollToTop}
                    className="rounded-full border border-white/90 bg-white/65 px-5 py-3.5 text-sm font-medium text-zinc-600 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-violet-700 sm:px-6"
                  >
                    Back to top
                  </button>
                </motion.div>

                <motion.div
                  variants={reveal}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="mt-9 flex items-center gap-3 sm:mt-12"
                >
                  <div className="flex -space-x-2">
                    <span className="size-7 rounded-full border-2 border-[#fbfaff] bg-gradient-to-br from-violet-200 to-violet-400" />
                    <span className="size-7 rounded-full border-2 border-[#fbfaff] bg-gradient-to-br from-sky-200 to-sky-400" />
                    <span className="size-7 rounded-full border-2 border-[#fbfaff] bg-gradient-to-br from-rose-200 to-rose-400" />
                  </div>

                  <span className="text-xs text-zinc-500">
                    Designed for a more fluid digital world
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400 sm:text-[10px]">
                Independent digital concept
              </span>

              <button
                onClick={scrollToExperience}
                className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-3 py-2 text-xs text-zinc-500 backdrop-blur-lg transition hover:bg-white hover:text-violet-700"
              >
                Scroll to explore
                <ArrowDown size={14} className="float-slow" />
              </button>
            </div>
          </motion.div>
        </section>

        <section
          id="experience"
          className="relative z-20 mx-auto flex min-h-[48svh] max-w-[1440px] scroll-mt-8 items-center px-5 py-16 sm:px-10 lg:px-16"
        >
          <div className="w-full rounded-3xl border border-white/90 bg-white/70 p-6 shadow-[0_20px_80px_rgba(100,75,150,0.08)] backdrop-blur-2xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Beyond the interface
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
              Technology should feel
              <span className="text-shimmer"> effortless.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
              A small exploration of light, movement, and interaction. Built
              with React, Tailwind CSS, and real-time 3D graphics.
            </p>

            <button
              onClick={scrollToTop}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium transition hover:border-violet-300 hover:text-violet-700"
            >
              Return to the beginning
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
