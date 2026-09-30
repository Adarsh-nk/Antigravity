import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Spinner } from '../ui/Spinner.jsx';
import { useChat } from '../../hooks/useChat.js';

const suggestedQuestions = [
  'What low-cost organic alternatives can I use for this?',
  'When should I perform the next irrigation or spray?',
  'How does recent heavy rain affect this advice?',
  'What are the main safety precautions during application?',
];

function SafeMarkdownText({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Hyphen bullets
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }

        return <p key={idx}>{trimmed}</p>;
      })}
    </div>
  );
}

export function AdvisoryChat({ advisoryId }) {
  const { messages, isLoading, sendMessage, isSending } = useChat(advisoryId);
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const text = inputMessage;
    setInputMessage('');
    try {
      await sendMessage(text);
    } catch {
      // Handled by hook toast
    }
  };

  const handleChipClick = async (question) => {
    if (isSending) return;
    try {
      await sendMessage(question);
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <Card className="space-y-4 border-slate-200 shadow-sm print:hidden">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Follow-Up Advisory Q&A</h3>
          <p className="text-xs text-slate-500">
            Ask specific questions grounded in this farm advisory.
          </p>
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              disabled={isSending}
              onClick={() => handleChipClick(q)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 transition-colors text-left disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" className="text-emerald-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">No follow-up questions asked yet.</p>
            <p>Type a question below to consult KrishiMitra further on this advisory.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-slate-800 text-white' : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    isUser
                      ? 'bg-slate-800 text-white rounded-tr-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-xs'
                  }`}
                >
                  <SafeMarkdownText content={msg.content} />
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2">
              <Spinner size="sm" className="text-emerald-600" />
              <span className="text-xs font-semibold text-slate-600">KrishiMitra is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <Input
          placeholder="Ask KrishiMitra a question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isSending}
          maxLength={1000}
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          isLoading={isSending}
          disabled={!inputMessage.trim()}
          className="shrink-0"
        >
          Send
        </Button>
      </form>
    </Card>
  );
}
