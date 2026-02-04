'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';

const CHAT_CONTACT_SUBJECT = 'Chat Assistant - Follow-up';

const chatContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  website: z.string().max(0, 'Spam detected').optional(),
});

type ChatContactFormData = z.infer<typeof chatContactSchema>;

export interface ChatContactFormProps {
  onSuccess?: () => void;
}

/**
 * Compact inline contact form for the chat panel.
 * Submits to /api/contact with subject "Chat Assistant - Follow-up".
 */
export function ChatContactForm({ onSuccess }: ChatContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChatContactFormData>({
    resolver: zodResolver(chatContactSchema),
  });

  const onSubmit = async (data: ChatContactFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: CHAT_CONTACT_SUBJECT,
          message: data.message,
          website: data.website || '',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '60';
          setError(`Too many requests. Please wait ${retryAfter} seconds before trying again.`);
          return;
        }
        if (response.status === 400 && result.errors) {
          const errorMessages = result.errors
            .map((err: { field: string; message: string }) => err.message)
            .join(', ');
          setError(errorMessages);
          return;
        }
        setError(result.error || 'Something went wrong. Please try again.');
        return;
      }

      setIsSubmitted(true);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting chat contact form:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        Thanks! We&apos;ll get back to you within 24-48 hours.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 rounded-lg border bg-muted/30 p-3"
      aria-label="Contact form"
    >
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <Label htmlFor="chat-contact-name" className="text-xs">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="chat-contact-name"
          {...register('name')}
          placeholder="Your name"
          className="h-8 text-sm"
          aria-invalid={!!errors.name}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-destructive text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="chat-contact-email" className="text-xs">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="chat-contact-email"
          type="email"
          {...register('email')}
          placeholder="your@email.com"
          className="h-8 text-sm"
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="chat-contact-message" className="text-xs">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="chat-contact-message"
          {...register('message')}
          placeholder="How can we help?"
          rows={3}
          className="min-h-[60px] resize-none text-sm"
          aria-invalid={!!errors.message}
          disabled={isLoading}
        />
        {errors.message && (
          <p className="text-destructive text-xs">{errors.message.message}</p>
        )}
      </div>

      <div style={{ display: 'none' }} aria-hidden="true">
        <Label htmlFor="chat-contact-website">Website</Label>
        <Input
          id="chat-contact-website"
          {...register('website')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" size="sm" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-3.5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 size-3.5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
