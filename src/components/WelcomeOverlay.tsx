'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      title: "Welcome to Brain Hack",
      description: "Your journey to enhanced productivity begins here"
    },
    {
      title: "Unlock Your Potential",
      description: "AI-powered insights to optimize your workflow"
    },
    {
      title: "Let's Begin",
      description: "Scroll down to explore our features"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < welcomeSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        clearInterval(timer);
        setTimeout(() => setIsVisible(false), 2000);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentStep]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center space-y-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                {welcomeSteps[currentStep].title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-300">
                {welcomeSteps[currentStep].description}
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-400 w-4'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay; 