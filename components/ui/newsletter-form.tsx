"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { FormField } from "./form-field";
import { Mail } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    // TODO: Integrate with email service (Resend, Mailchimp, etc.)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Email"
        hint="We'll never share your email address"
        error={status === "error" ? "Something went wrong. Please try again." : undefined}
      >
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </FormField>
      <Button
        type="submit"
        variant="subscribe"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        {status === "success" ? "Subscribed!" : "Subscribe to Newsletter"}
      </Button>
      {status === "success" && (
        <p className="text-sm text-success text-center">
          Thank you for subscribing!
        </p>
      )}
    </form>
  );
}

