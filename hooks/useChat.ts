'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE =
  "Hello! Welcome to Logbloga. I'm here to help you learn about our AI to USD packages, pricing, resources, and how to get started. How may I help you today?";

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  showContactForm: boolean;
  dismissContactForm: () => void;
  addAssistantMessage: (content: string) => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setShowContactForm(false);

    try {
      const historyPlusNew = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPlusNew }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data?.error || `Request failed (${res.status})`;
        setError(errMsg);
        return;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data?.message?.content ?? 'Sorry, I could not generate a response.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setShowContactForm(!!data?.showContactForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setError(null);
    setShowContactForm(false);
  }, []);

  const dismissContactForm = useCallback(() => {
    setShowContactForm(false);
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content }]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    showContactForm,
    dismissContactForm,
    addAssistantMessage,
    sendMessage,
    clearMessages,
  };
}
