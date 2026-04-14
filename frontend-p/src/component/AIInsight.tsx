"use client";
import { useState } from "react";
import { Sparkles, Terminal, Send } from "lucide-react";
import axios from "axios";

export default function AIInsight({ isProcessing, data,onClose }: any) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const askAiImprovement = async () => {
  if (!question) return;
  setAsking(true);
  
  try {
    const res = await axios.post("http://localhost:3001/logs/ask", { 
      question, 
      logContext: data.rawLogs // Ensure backend se rawLogs frontend tak aa rahe hain
    });
    setAnswer(res.data.answer);
  } catch (e) {
    setAnswer("Bhai, connection fail ho gaya. Backend check karo!");
  } finally {
    setAsking(false);
  }
};

  return (
    <div className="bg-slate-900 rounded-[40px] p-8 text-white border border-slate-800 shadow-2xl">
      {/* Summary Card (Jo pehle banaya tha) */}
      <div className="mb-6">
        <h3 className="text-blue-400 font-bold flex items-center gap-2">
          <Sparkles size={18} /> Log Analysis Result
        </h3>
        <p className="text-slate-300 mt-2 italic text-sm">
          {data?.summary || "Analyzing your logs for improvements..."}
        </p>
      </div>

      {/* CHAT INTERFACE */}
      <div className="mt-8 bg-black/40 rounded-3xl p-6 border border-slate-700">
        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Chat with Logs</h4>
        
        {answer && (
          <div className="mb-4 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl text-sm animate-in fade-in zoom-in">
            <p className="text-blue-300 font-bold mb-1 italic">AI Response:</p>
            <p className="text-slate-200 leading-relaxed">{answer}</p>
          </div>
        )}

        <div className="flex gap-2">
          <input 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask: 'How to optimize DB calls?'"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={askAiImprovement}
            disabled={asking}
            className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition disabled:bg-slate-700"
          >
            {asking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}