"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: "15%" },
  show: { opacity: 1, y: "0%" },
};

/**
 * Staggered phrase animation for the big About lede, ported from the
 * original fork's about page. `|` separates the animated chunks.
 */
export default function AnimatedLede({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {text.split("|").map((chunk, i) => (
        <motion.span variants={item} key={i}>
          {chunk}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}
