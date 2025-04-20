'use client';

import { AskBrainhackChat } from '@/components/AskBrainhackChat';

export default function AskBrainhackPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold gradient-text mb-8">Ask Brain Hack AI</h1>
      <AskBrainhackChat />
    </div>
  );
}