'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Send, Loader2 } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject').min(3, 'Subject must be at least 3 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  website: z.string().max(0, 'Spam detected').optional(), // Honeypot field
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const subjectValue = watch('subject');

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          website: data.website || '', // Honeypot field
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '60';
          setError(`Too many requests. Please wait ${retryAfter} seconds before trying again.`);
          return;
        }

        // Handle validation errors
        if (response.status === 400 && result.errors) {
          const errorMessages = result.errors.map((err: { field: string; message: string }) => err.message).join(', ');
          setError(`Validation error: ${errorMessages}`);
          return;
        }

        // Handle other errors
        setError(result.error || 'Something went wrong. Please try again or email us directly at support@logbloga.com');
        return;
      }

      // Success
      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Network error. Please check your connection and try again, or email us directly at support@logbloga.com');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          Your message has been sent. We'll get back to you within 24-48 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setError(null);
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Your name"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="your.email@example.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Select
          value={subjectValue}
          onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
        >
          <SelectTrigger
            id="subject"
            className="w-full"
            aria-invalid={errors.subject ? 'true' : 'false'}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          >
            <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && (
          <p id="subject-error" className="text-sm text-destructive" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell us how we can help..."
          rows={6}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot field - hidden from users, bots will fill it */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="text"
          {...register('website')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
