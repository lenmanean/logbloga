'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FAQ } from '@/lib/resources/types';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
  faqs: FAQ[];
  searchQuery?: string;
  className?: string;
}

export function FAQAccordion({ faqs, searchQuery, className }: FAQAccordionProps) {
  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (faqs.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">No FAQs found matching your search.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className={cn('w-full', className)}>
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left">
            {searchQuery ? highlightText(faq.question, searchQuery) : faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {searchQuery ? highlightText(faq.answer, searchQuery) : faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
