'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 560;

/**
 * AI Chat Assistant widget - fixed bottom-right, opens panel on click.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    if (isOpen && (messages.length > 0 || isLoading)) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = inputRef.current?.value ?? '';
    if (!text.trim()) return;
    inputRef.current!.value = '';
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="fixed bottom-6 right-6 z-[100]" aria-live="polite">
      {isOpen && (
        <div
          className={cn(
            "mb-4 flex flex-col overflow-hidden rounded-xl border bg-background shadow-xl",
            !prefersReducedMotion && "animate-fade-in"
          )}
          style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT }}
          role="dialog"
          aria-label="Logbloga Assistant chat"
        >
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
            <h2 className="text-base font-semibold">Logbloga Assistant</h2>
            <div className="flex gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  aria-label="Clear chat"
                  className="text-muted-foreground hover:text-foreground h-8 text-xs"
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-3" style={{ maxHeight: PANEL_HEIGHT - 180 }}>
            <div className="flex flex-col gap-3">
              {messages.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-sm">
                  Ask me anything about our packages, products, or how to get started. I can point you to the right pages and resources.
                </p>
              )}
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex justify-start" aria-busy="true" aria-live="polite">
                  <div className="rounded-2xl rounded-bl-md border bg-muted/50 px-4 py-2.5">
                    <span className="text-muted-foreground text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                  {error}
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t p-3">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask about our packages..."
                className="min-h-[44px] max-h-32 resize-none"
                rows={2}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                aria-label="Chat message"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                size="sm"
                className="shrink-0 self-end"
                aria-label="Send message"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon-lg"
        className="rounded-full shadow-lg"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        <MessageCircle className="size-6" />
      </Button>
    </div>
  );
}
