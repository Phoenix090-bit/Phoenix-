import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, AlertTriangle, Lightbulb, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { AIInsight, BusinessProfile, DebtRecord, FinancialTotals, Product, Sale } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface PhoenixAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  totals: FinancialTotals;
  insights: AIInsight[];
  business: BusinessProfile;
  products: Product[];
  debts: DebtRecord[];
  onNavigateTab: (tab: any) => void;
}

export const PhoenixAdvisorModal: React.FC<PhoenixAdvisorModalProps> = ({
  isOpen,
  onClose,
  totals,
  insights,
  business,
  products,
  debts,
  onNavigateTab,
}) => {
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: `Hello ${business.ownerName || 'Boss'}! I am Phoenix AI, your business copilot for ${business.name}. I analyze your sales, expenses, debts, and inventory in real time to help you grow your profit. What would you like to review today?`,
      time: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const lowStockProducts = products.filter((p) => p.quantity <= p.minStockLevel);
  const activeDebts = debts.filter((d) => d.status !== 'cleared');

  const QUICK_QUESTIONS = [
    'How is my profit looking today?',
    'Which items must I restock now?',
    'How much debt is currently unpaid?',
    'How can I reduce my generator fuel costs?',
  ];

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: questionText, time };

    let aiReply = '';
    const qLower = questionText.toLowerCase();

    if (qLower.includes('profit') || qLower.includes('margin') || qLower.includes('performance')) {
      const margin =
        totals.todaySales > 0 ? ((totals.todayNetProfit / totals.todaySales) * 100).toFixed(1) : '0';
      aiReply = `📊 *Today's Financial Diagnostic:*\n• Total Sales: ${formatNaira(totals.todaySales)}\n• Cost of Goods: ${formatNaira(totals.todayGrossProfit > 0 ? totals.todaySales - totals.todayGrossProfit : 0)}\n• Operating Expenses: ${formatNaira(totals.todayExpenses)}\n• *Net Profit:* ${formatNaira(totals.todayNetProfit)} (${margin}% net margin).\n\n💡 *Tip:* To boost your margin above 30%, focus on fast-moving beverages and bundles with high markup!`;
    } else if (qLower.includes('stock') || qLower.includes('restock') || qLower.includes('inventory')) {
      if (lowStockProducts.length > 0) {
        const list = lowStockProducts.map((p) => `• ${p.name}: only ${p.quantity} ${p.unit} left (Min: ${p.minStockLevel})`).join('\n');
        aiReply = `⚠️ *Restock Warning:*\nYou currently have ${lowStockProducts.length} items that need restocking right away:\n${list}\n\nDon't let customers go elsewhere because an item is finished! Check the Stock tab to order fresh inventory.`;
      } else {
        aiReply = `✅ *Stock Levels are Healthy!*\nNone of your products are currently below safety thresholds. Total inventory value across your shop is ${formatNaira(totals.inventoryTotalSalesValue)} at selling price.`;
      }
    } else if (qLower.includes('debt') || qLower.includes('owe') || qLower.includes('credit')) {
      aiReply = `💼 *Customer Credit & Debt Status:*\nYou have *${formatNaira(totals.totalOutstandingDebt)}* tied up in customer credit across ${totals.debtorCount} customers.\n\n📱 *Recommendation:* Use Phoenix PocketBiz's 1-tap WhatsApp reminder in Nigerian Pidgin: "How far! Abeg remember the balance for the goods you took..." Most customers respond positively when reminded before Friday!`;
    } else if (qLower.includes('fuel') || qLower.includes('generator') || qLower.includes('expense')) {
      aiReply = `⚡ *Expense Control Strategy:*\nToday's operating expenses stand at ${formatNaira(totals.todayExpenses)}.\n\nKey actions for Nigerian shops:\n1. Run the heavy freezer on generator for 3-4 peak hours, then keep the lid closed to retain coldness.\n2. Ensure items delivered via Keke or dispatch are grouped into single trips to save on delivery fees.`;
    } else {
      aiReply = `Based on your live figures for ${business.name}: You have generated ${formatNaira(totals.todaySales)} in sales today with ${formatNaira(totals.todayNetProfit)} in clean net profit. Total stock is valued at ${formatNaira(totals.inventoryTotalSalesValue)}. Keep recording all sales and expenses accurately!`;
    }

    setConversation((prev) => [...prev, userMsg, { sender: 'ai', text: aiReply, time }]);
    setUserQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#9A6B0A] flex items-center justify-center text-[#0B192C] font-black shadow-md">
              <Sparkles className="w-5 h-5 text-[#0B192C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Phoenix AI Advisor</h2>
                <span className="bg-[#D4AF37]/20 text-[#F5D061] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                  SMART
                </span>
              </div>
              <p className="text-xs text-slate-300">Live intelligence & business copilot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Health Overview Strip */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 p-3 grid grid-cols-3 gap-2 text-center shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Today's Margin</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#0B192C]">
              {totals.todaySales > 0
                ? `${((totals.todayNetProfit / totals.todaySales) * 100).toFixed(1)}%`
                : '0%'}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Uncollected Debts</div>
            <div className="text-xs sm:text-sm font-extrabold text-rose-600">
              {formatNaira(totals.totalOutstandingDebt)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Low Stock Alert</div>
            <div className="text-xs sm:text-sm font-extrabold text-amber-700">
              {totals.lowStockCount} items
            </div>
          </div>
        </div>

        {/* Chat / Insights Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#0B192C] text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 active:scale-95 transition-transform"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Ask Phoenix AI about your business..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk(userQuestion);
            }}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
          <button
            onClick={() => handleAsk(userQuestion)}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] flex items-center justify-center text-[#0B192C] hover:opacity-95 active:scale-95 transition-transform shrink-0"
          >
            <Send className="w-4 h-4 font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
};
