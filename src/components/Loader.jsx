
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Command } from "lucide-react";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setLoading(false),
      reduceMotion ? 100 : 1100
    );

    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="astra-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0 : 0.5 },
          }}
          className="fixed inset-0 z-[200] grid place-items-center bg-[#fbfaff]"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : { rotate: 360, scale: [1, 1.06, 1] }
              }
              transition={{
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                },
              }}
              className="grid size-16 place-items-center rounded-2xl border border-white bg-white/80 text-violet-600 shadow-[0_10px_50px_rgba(139,92,246,0.15)]"
            >
              <Command size={28} />
            </motion.div>

            <p className="mt-5 text-lg font-semibold tracking-tight">
              astra<span className="text-violet-500">.</span>
            </p>

            <div
              className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-violet-100"
              role="progressbar"
              aria-label="Loading Astra"
            >
              <motion.div
                className="h-full rounded-full bg-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: reduceMotion ? 0 : 1,
                  ease: "easeInOut",
                }}
              />
            </div>

            <button
              onClick={() => setLoading(false)}
              className="mt-5 rounded-full px-4 py-2 text-xs text-zinc-500 transition hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-500"
            >
              Skip intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
