import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatView } from '@/components/chat/ChatView';
import { OnboardingModal, OnboardingData } from '@/components/hr/OnboardingModal';
import { chatService } from '@/lib/chat';
import type { ChatState, SessionInfo, ToolCall } from '../../worker/types';
export function HomePage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: '',
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    streamingMessage: '',
  });
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const handleNewSession = useCallback(async () => {
    const newSessionId = crypto.randomUUID();
    const response = await chatService.createSession('New Chat', newSessionId);
    if (response.success && response.data) {
      // This will trigger a reload of sessions and switch to the new one
      await loadSessions(response.data.sessionId);
    }
  }, []);
  const handleSwitchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    loadChatHistory(sessionId);
  }, []);
  const loadSessions = useCallback(async (switchToId?: string) => {
    const response = await chatService.listSessions();
    if (response.success && response.data) {
      setSessions(response.data);
      const nextSessionId = switchToId || activeSessionId;
      if (nextSessionId && response.data.some(s => s.id === nextSessionId)) {
        handleSwitchSession(nextSessionId);
      } else if (response.data.length > 0) {
        handleSwitchSession(response.data[0].id);
      } else {
        handleNewSession();
      }
    }
  }, [activeSessionId, handleNewSession, handleSwitchSession]);
  const loadChatHistory = useCallback(async (sessionId: string) => {
    chatService.switchSession(sessionId);
    const response = await chatService.getMessages();
    if (response.success && response.data) {
      setChatState(response.data);
    }
  }, []);
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  const handleDeleteSession = async (sessionId: string) => {
    await chatService.deleteSession(sessionId);
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(remainingSessions);
    if (activeSessionId === sessionId) {
      if (remainingSessions.length > 0) {
        handleSwitchSession(remainingSessions[0].id);
      } else {
        handleNewSession();
      }
    }
  };
  const handleUpdateSessionTitle = async (sessionId: string, newTitle: string) => {
    await chatService.updateSessionTitle(sessionId, newTitle);
    await loadSessions();
  };
  const handleSendMessage = async (message: string) => {
    if (!activeSessionId) return;
    const isFirstMessage = chatState.messages.length === 0;
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { id: crypto.randomUUID(), role: 'user', content: message, timestamp: Date.now() }],
      isProcessing: true,
      streamingMessage: '',
    }));
    if (isFirstMessage) {
      const newTitle = message.length > 30 ? message.substring(0, 27) + '...' : message;
      await handleUpdateSessionTitle(activeSessionId, newTitle);
    }
    await chatService.sendMessage(message, chatState.model, (chunk) => {
      setChatState(prev => ({
        ...prev,
        streamingMessage: (prev.streamingMessage || '') + chunk,
      }));
    });
    await loadChatHistory(activeSessionId);
  };
  const handleToolResult = (toolCall: ToolCall) => {
    const result = toolCall.result as any;
    if (result?.ui_component === 'onboarding_checklist') {
      setOnboardingData(result);
      setIsOnboardingModalOpen(true);
    }
  };
  const triggerOnboarding = (data: any) => {
    setOnboardingData(data);
    setIsOnboardingModalOpen(true);
  };
  const activeSession = sessions.find(s => s.id === activeSessionId);
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSwitchSession={handleSwitchSession}
        onDeleteSession={handleDeleteSession}
        onUpdateSessionTitle={handleUpdateSessionTitle}
      />
      <main className="flex-1 flex flex-col h-screen">
        <Header sessionTitle={activeSession?.title || 'NexusHR'} />
        <div className="flex-1 overflow-y-auto">
          <ChatView
            chatState={chatState}
            onSendMessage={handleSendMessage}
            onToolResult={handleToolResult}
            onTriggerOnboarding={triggerOnboarding}
          />
        </div>
      </main>
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        data={onboardingData}
      />
    </div>
  );
}