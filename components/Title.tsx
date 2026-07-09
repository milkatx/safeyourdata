"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: "5%" },
  show: { opacity: 1, y: "0%" },
};

interface TitleProps {
  text: string;
  className?: string;
  noAnimation?: boolean;
}

/** Letter-by-letter animated title, ported from Brazilians Who Design. `*` breaks the line. */
export default function Title({ text, className, noAnimation }: TitleProps) {
  return (
    <motion.h1
      className={className}
      variants={container}
      initial={noAnimation ? "show" : "hidden"}
      animate="show"
    >
      {text.split("").map((letter, i) => {
        if (letter === "*") return <br key={`br-${i}`} />;
        return (
          <motion.span className="letter" variants={item} key={`${letter}-${i}`}>
            {letter === " " ? " " : letter}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
