'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
}

const BubbleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles = useRef<Bubble[]>([]);
  const themeColors = [
    'rgba(255, 165, 0, 0.2)',  // orange
    'rgba(255, 69, 0, 0.2)',   // red-orange
    'rgba(255, 140, 0, 0.2)',  // dark orange
    'rgba(255, 99, 71, 0.2)',  // tomato
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize bubbles
    const initBubbles = () => {
      bubbles.current = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20, // Smaller bubbles (20-50px)
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        speed: Math.random() * 1 + 0.5, // Faster speed (0.5-1.5)
        rotation: Math.random() * 360,
      }));
    };
    initBubbles();

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.current.forEach((bubble) => {
        // Move bubble
        bubble.y -= bubble.speed;
        bubble.rotation += bubble.speed * 2; // Faster rotation

        // Reset bubble position when it goes off screen
        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }

        // Draw bubble
        ctx.save();
        ctx.translate(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2);
        ctx.rotate((bubble.rotation * Math.PI) / 180);
        ctx.translate(-(bubble.x + bubble.size / 2), -(bubble.y + bubble.size / 2));

        ctx.beginPath();
        ctx.fillStyle = bubble.color;
        ctx.filter = 'blur(3px)'; // Reduced blur for smaller bubbles
        ctx.arc(bubble.x + bubble.size / 2, bubble.y + bubble.size / 2, bubble.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle gradient
        const gradient = ctx.createRadialGradient(
          bubble.x + bubble.size / 2,
          bubble.y + bubble.size / 2,
          0,
          bubble.x + bubble.size / 2,
          bubble.y + bubble.size / 2,
          bubble.size / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default BubbleBackground; 