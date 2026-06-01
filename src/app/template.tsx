"use client";

import { m as motion } from "framer-motion";
import { pageEnterTransition } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageEnterTransition()}
    >
      {children}
    </motion.div>
  );
}
