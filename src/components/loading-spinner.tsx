'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      className="loading-spinner"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
      style={{
        width: "50px",
        height: "50px",
        border: "5px solid #ccc",
        borderTop: "5px solid #007bff",
        borderRadius: "50%",
        margin: "auto",
      }}
    />
  );
}