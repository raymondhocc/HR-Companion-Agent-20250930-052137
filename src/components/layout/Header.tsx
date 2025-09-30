import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NexusLogo } from '@/components/icons/NexusLogo';
interface HeaderProps {
  sessionTitle: string;
}
export const Header: React.FC<HeaderProps> = ({ sessionTitle }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <NexusLogo className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          {sessionTitle || "NexusHR"}
        </h1>
      </div>
      <ThemeToggle className="relative top-0 right-0" />
    </header>
  );
};