import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}
export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSubmit, isLoading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };
  return (
    <div className="p-4 bg-background border-t">
      <form onSubmit={onSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask NexusHR anything..."
          rows={1}
          className="w-full pr-12 py-3 resize-none max-h-40"
          disabled={isLoading}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send Message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
      <p className="text-xs text-center text-muted-foreground mt-2">
        AI features require API key configuration. This demo uses mock data.
      </p>
    </div>
  );
};