import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';

interface CommandBarProps {
  onClose: () => void;
}

const mockResponses: Record<string, string> = {
  'تحليل': 'تم تحليل 1550 سجل مكالمات. وجدت 7 أنماط مشبوهة و3 روابط بين أرقام غير معروفة سابقاً.',
  ' analyze': 'Analysis complete: 1,550 call records processed. Found 7 suspicious patterns and 3 cross-references between previously unknown numbers.',
  'agents': 'Currently 299 agents active across 12 cases. 187 agents investigating, 89 idle, 23 paused. 7 warning states detected in CDR-2025-0130.',
  'وكلاء': '299 وكيل نشط حالياً في 12 قضية. 187 وكيل في التحقيق، 89 خاملين، 23 متوقفين. 7 حالات تحذير في CDR-2025-0130.',
  'alert': '7 critical alerts: 3 cross-case correlations detected, 2 anomalous call patterns, 1 blocked number attempt, 1 agent requiring manual review.',
  'تنبيه': '7 تنبيهات حرجة: 3 ارتباطات بين قضايا، 2 نمط مكالمات شاذ، 1 محاولة من رقم محظور، 1 وكيل يحتاج مراجعة يدوية.',
  'cross': 'Cross-reference analysis: Number 7826963756 appears in 3 cases (Daghara, Shamiya, Hilla) with same IMEI hash. 42 total cross-references found.',
  'ربط': 'تحليل الربط: الرقم 7826963756 يظهر في 3 قضايا (الدغارة، الشامية، الحلة) بنفس IMEI. 42 ربط إجمالي.',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(mockResponses)) {
    if (lower.includes(key.trim())) return value;
  }
  if (/[\u0600-\u06FF]/.test(input)) {
    return `تم استلام استفسارك: "${input}". أنا أقوم بتحليل البيانات... وجدت نتائج مبدئية تتطلب مراجعة إضافية.`;
  }
  return `Received: "${input}". Processing your request... Initial findings require additional review. Type "agents", "alerts", "analyze", or "cross" for specific data.`;
}

export function CommandBar({ onClose }: CommandBarProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const response = getResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 200 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{
        background: 'rgba(5, 11, 20, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 300, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
        className="w-full max-w-[640px] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: '#0A111D',
          border: '1px solid #1A2840',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1A2840' }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#3B82F6' }} />
            <span className="font-display text-sm font-semibold text-text-primary">
              AI Command Center
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#121C2B]"
          >
            <X className="w-4 h-4" style={{ color: '#475569' }} />
          </button>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto px-5 py-3 space-y-3">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 200 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className="max-w-[85%] rounded-xl px-4 py-2.5"
                    style={{
                      background: msg.role === 'user' ? '#121C2B' : 'rgba(59, 130, 246, 0.1)',
                      border: msg.role === 'ai' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid #1A2840',
                    }}
                  >
                    <p className="font-body text-sm text-text-primary leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-5 py-4" style={{ borderTop: messages.length > 0 ? '1px solid #1A2840' : 'none' }}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اسأل الذكاء الاصطناعي..."
              className="w-full h-11 pr-10 pl-4 rounded-lg text-sm outline-none transition-all duration-200 font-body"
              style={{
                background: '#121C2B',
                border: '1px solid #1A2840',
                color: '#F8FAFC',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#1A2840';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <p className="font-body text-xs mt-2" style={{ color: '#475569' }}>
            جرب: "تحليل" أو "وكلاء" أو "تنبيه" أو "ربط" — Try: "agents", "alerts", "analyze", "cross"
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}
