'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const AnimatedBrain = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative"
      >
        <Image
          src="/brain.png"
          alt="Brain"
          layout="fill"
          objectFit="cover"
          className="filter brightness-75"
          priority
        />
      </motion.div>
    </div>
  );
};

export default AnimatedBrain; 