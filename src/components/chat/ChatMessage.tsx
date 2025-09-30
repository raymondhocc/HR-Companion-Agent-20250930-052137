import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Wrench, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Message, ToolCall } from '../../../worker/types';
interface ChatMessageProps {
  message: Message;
  onTriggerOnboarding?: (data: any) => void;
}
const renderToolResult = (tool: ToolCall, onTriggerOnboarding?: (data: any) => void) => {
  if (!tool.result) return `Executing ${tool.name}...`;
  const result = tool.result as any;
  if (result.error) return `Error: ${result.error}`;
  switch (tool.name) {
    case 'start_onboarding_process':
      if (result.ui_component === 'onboarding_checklist') {
        return (
          <div className="flex flex-col items-start gap-2">
            <span>Onboarding for <strong>{result.employee_name}</strong> initiated.</span>
            <Button size="sm" variant="outline" onClick={() => onTriggerOnboarding?.(result)}>
              <ListChecks className="w-4 h-4 mr-2" />
              View Checklist
            </Button>
          </div>
        );
      }
      return `Onboarding initiated.`;
    case 'request_pto_balance':
      return `PTO Balance: ${result.pto_balance_hours} hours.`;
    case 'find_policy_document':
      return result.status === 'found'
        ? `Found: ${result.document_title}`
        : `Policy not found.`;
    default:
      return `${tool.name} executed.`;
  }
};
export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onTriggerOnboarding }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-xl rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-secondary text-secondary-foreground rounded-bl-none'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Wrench className="w-3 h-3" />
              <span>Tools Used</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              {message.toolCalls.map((tool, index) => (
                <div key={index} className="text-sm">
                  {renderToolResult(tool, onTriggerOnboarding)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
};