import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { NexusLogo } from '../icons/NexusLogo';
interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}
const suggestedPrompts = [
  "What is our company's PTO policy?",
  "Start the onboarding process for 'Alex Doe'",
  "Find the remote work policy document",
  "How do I submit an expense report?",
];
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-primary/10 rounded-full mb-6">
          <NexusLogo className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-display text-slate-800 dark:text-slate-100 mb-2">
          Welcome to NexusHR
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Your AI-powered HR companion. How can I assist you today?
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="mt-12 w-full max-w-2xl"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-4">SUGGESTED PROMPTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className="p-4 border rounded-lg text-left text-sm hover:bg-accent transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};