import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { ChatState, ToolCall } from '../../../worker/types';
interface ChatViewProps {
  chatState: ChatState;
  onSendMessage: (message: string) => void;
  onToolResult: (toolCall: ToolCall) => void;
  onTriggerOnboarding: (data: any) => void;
}
export const ChatView: React.FC<ChatViewProps> = ({ chatState, onSendMessage, onToolResult, onTriggerOnboarding }) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastProcessedMessageId = useRef<string | null>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatState.messages, chatState.streamingMessage, chatState.isProcessing]);
  useEffect(() => {
    const lastMessage = chatState.messages[chatState.messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === 'assistant' &&
      lastMessage.toolCalls &&
      lastMessage.id !== lastProcessedMessageId.current
    ) {
      lastProcessedMessageId.current = lastMessage.id;
      lastMessage.toolCalls.forEach(onToolResult);
    }
  }, [chatState.messages, onToolResult]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };
  const hasMessages = chatState.messages.length > 0;
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 md:p-8 space-y-6">
            <AnimatePresence>
              {!hasMessages && <WelcomeScreen onPromptClick={handlePromptClick} />}
            </AnimatePresence>
            {chatState.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onTriggerOnboarding={onTriggerOnboarding} />
            ))}
            {chatState.streamingMessage && (
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: chatState.streamingMessage,
                  timestamp: Date.now(),
                }}
              />
            )}
            {chatState.isProcessing && !chatState.streamingMessage && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">NexusHR is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={chatState.isProcessing}
      />
    </div>
  );
};