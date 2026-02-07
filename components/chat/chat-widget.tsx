'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatContactForm } from './chat-contact-form';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 560;

/**
 * AI Chat Assistant widget - fixed bottom-right.
 * Entitled users (signed in + at least one package): blue chat icon opens chat.
 * Others: grey ? icon opens "Need help?" modal (FAQ, View Packages, Contact).
 */
export function ChatWidget() {
  const { user, isLoading: authLoading } = useAuth();
  const [canUseChat, setCanUseChat] = useState(false);
  const [isCheckingEntitlement, setIsCheckingEntitlement] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, showContactForm, dismissContactForm, addAssistantMessage, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    if (!user) {
      setCanUseChat(false);
      setIsCheckingEntitlement(false);
      return;
    }
    let cancelled = false;
    setIsCheckingEntitlement(true);
    fetch('/api/chat/entitlement', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCanUseChat(data?.canUse === true);
      })
      .catch(() => {
        if (!cancelled) setCanUseChat(false);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingEntitlement(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (isOpen && (messages.length > 0 || isLoading || showContactForm)) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, showContactForm]);

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

  const showChatPanel = canUseChat && isOpen;
  const showHelpModal = !canUseChat && isOpen;

  return (
    <div className="fixed bottom-6 right-6 z-[100]" aria-live="polite">
      {showChatPanel && (
        <div
          className={cn(
            'mb-4 flex flex-col overflow-hidden rounded-xl border bg-background shadow-xl',
            !prefersReducedMotion && 'animate-chat-panel-in'
          )}
          style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT }}
          role="dialog"
          aria-label="Logbloga Assistant chat"
        >
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
            <h2 className="text-base font-semibold">Logbloga Assistant</h2>
            <div className="flex gap-1">
              {messages.length > 1 && (
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
              {showContactForm && (
                <ChatContactForm
                  chatContext={{
                    lastUserMessage: messages.filter((m) => m.role === 'user').pop()?.content,
                    lastAssistantMessage: messages.filter((m) => m.role === 'assistant').pop()?.content,
                  }}
                  onSuccess={() => {
                    addAssistantMessage("Thanks for reaching out! We'll get back to you within 24-48 hours.");
                    dismissContactForm();
                  }}
                />
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t p-3">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask about your packages or Logbloga..."
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

      {showHelpModal && (
        <div
          className={cn(
            'mb-4 flex flex-col overflow-hidden rounded-xl border bg-background shadow-xl p-5',
            !prefersReducedMotion && 'animate-chat-panel-in'
          )}
          style={{ width: PANEL_WIDTH, maxWidth: 'calc(100vw - 3rem)' }}
          role="dialog"
          aria-labelledby="need-help-title"
          aria-label="Need help"
        >
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 id="need-help-title" className="text-base font-semibold">
              Need help?
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="size-8 rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Visit our FAQ, explore packages, or get in touch.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-center">
              <Link href="/resources/faq">Visit FAQ</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-center">
              <Link href="/ai-to-usd">View packages</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-center">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      )}

      {!authLoading && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={cn(
            'size-12 rounded-full shadow-lg',
            canUseChat
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border',
            canUseChat && !prefersReducedMotion && 'animate-chat-glow'
          )}
          aria-label={canUseChat ? (isOpen ? 'Close chat' : 'Open chat') : (isOpen ? 'Close help' : 'Need help?')}
          aria-expanded={isOpen}
        >
          {canUseChat ? (
            <MessageCircle className="size-6" />
          ) : (
            <HelpCircle className="size-6" />
          )}
        </Button>
      )}
    </div>
  );
}
