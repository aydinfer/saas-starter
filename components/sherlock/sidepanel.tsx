'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useSherlock } from './provider';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function SherlockSidepanel() {
  const { isOpen, closeSherlock } = useSherlock();
  const pathname = usePathname();
  const [input, setInput] = useState('');

  // Context-aware chat - Sherlock knows which page you're on!
  const { messages, status, sendMessage } = useChat();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSherlock}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidepanel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-background border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sherlock AI</h3>
                  <p className="text-xs text-muted-foreground">
                    Analyzing {pathname.split('/').pop() || 'dashboard'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeSherlock}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">S</span>
                  </div>
                  <h4 className="font-semibold mb-2">Hi! I'm Sherlock</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    I can help you understand your revenue leaks, explain findings, and suggest
                    optimizations.
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        sendMessage({ text: 'What revenue leaks did you find?' });
                      }}
                    >
                      What revenue leaks did you find?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        sendMessage({ text: 'How much money am I leaving on the table?' });
                      }}
                    >
                      How much money am I leaving on the table?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        sendMessage({ text: 'What should I fix first?' });
                      }}
                    >
                      What should I fix first?
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'mb-4 p-3 rounded-lg',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-8'
                      : 'bg-muted mr-8'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.parts.map((part, index) => {
                      if (part.type === 'text') {
                        return <span key={index}>{part.text}</span>;
                      }
                      return null;
                    })}
                  </p>
                </motion.div>
              ))}

              {status === 'streaming' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-muted-foreground text-sm"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sherlock is thinking...
                </motion.div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    sendMessage({ text: input });
                    setInput('');
                  }
                }}
                data-sherlock-form
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this page..."
                  className="flex-1"
                  disabled={status !== 'ready'}
                  autoFocus
                />
                <Button type="submit" size="icon" disabled={status !== 'ready'}>
                  {status === 'streaming' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
