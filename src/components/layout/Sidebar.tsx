import React, { useState } from 'react';
import { Plus, MessageSquare, Edit3, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { SessionInfo } from '../../../worker/types';
import { NexusLogo } from '../icons/NexusLogo';
interface SidebarProps {
  sessions: SessionInfo[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSessionTitle: (sessionId: string, newTitle: string) => void;
}
export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
  onUpdateSessionTitle,
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const handleEdit = (session: SessionInfo) => {
    setEditingSessionId(session.id);
    setNewTitle(session.title);
  };
  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setNewTitle('');
  };
  const handleSaveEdit = () => {
    if (editingSessionId && newTitle.trim()) {
      onUpdateSessionTitle(editingSessionId, newTitle.trim());
    }
    handleCancelEdit();
  };
  return (
    <aside className="w-72 bg-secondary/50 flex flex-col h-full border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NexusLogo className="w-7 h-7 text-primary" />
          <h2 className="text-lg font-semibold font-display">NexusHR</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onNewSession} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center justify-between rounded-md text-sm font-medium transition-colors cursor-pointer',
                activeSessionId === session.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <button
                onClick={() => onSwitchSession(session.id)}
                className="flex items-center gap-3 px-3 py-2 flex-1 truncate"
              >
                <MessageSquare className="h-4 w-4" />
                {editingSessionId === session.id ? (
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    onBlur={handleSaveEdit}
                    autoFocus
                    className="h-7 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">{session.title}</span>
                )}
              </button>
              <div className="flex items-center pr-2">
                {editingSessionId === session.id ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(session)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={() => onDeleteSession(session.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <footer className="p-4 border-t text-xs text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </aside>
  );
};