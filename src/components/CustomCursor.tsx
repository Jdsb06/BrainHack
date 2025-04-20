'use client';

import { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="custom-cursor fixed w-10 h-10 rounded-full border-2 border-orange-500 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
    />
  );
}; 