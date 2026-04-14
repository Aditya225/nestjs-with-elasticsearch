"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Upload, LogOut, Search, Shield, FileText, 
  Loader2, CheckCircle, Clock, Activity, ChevronDown, CreditCard, X
} from "lucide-react";

// 1. Import statements ke pass
// import AIInsight from "@/components/AIInsight";
import AIInsight from "@/component/AIInsight";
export default function Dashboard() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  
  // Upload States
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState<string>("0 KB/s");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [uploadCount,setUploadCount] = useState(2); // Dummy count for UI
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
const [aiData, setAiData] = useState(null); // B

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleUpload = async () => {
    if (!file) return;
    if (uploadCount >= 5) {
      alert("Limit reached! Upgrade plan to upload more.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    const startTime = Date.now();

    try {
     let response=  await axios.post("http://localhost:3001/logs/upload", formData, {
        onUploadProgress: (p) => {
          const loaded = p.loaded;
          const total = p.total || file.size;
          setProgress(Math.round((loaded * 100) / total));
          const duration = (Date.now() - startTime) / 1000;
          const speed = loaded / duration;
          if (speed > 0) {
            setTimeLeft(Math.round((total - loaded) / speed));
            setUploadSpeed(speed > 1024 * 1024 ? `${(speed / 1048576).toFixed(2)} MB/s` : `${(speed / 1024).toFixed(2)} KB/s`);
          }
        },
      });
      
     if (response.status === 201 || response.status === 200) {
      // ✅ SUCCESS FLOW:
      setAiData(response.data); // Backend se jo AI analysis aaya hai
      setIsAnalysisReady(true);  // AI card ko "Zinda" rakho
      // 2. Upload Count badhao
      setUploadCount((prev) => prev + 1);

      // 3. UI Reset karo (File removed from UI)
      setFile(null); 
      setProgress(0);
      setTimeLeft(null);
      setUploadSpeed("0 KB/s");

      alert("Mubarak ho! File ingest ho gayi aur background process shuru ho gaya.");
    }
      
    } catch (e) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col shadow-xl">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg"><FileText size={20} /></div>
          <h1 className="text-xl font-bold tracking-tight">LogPulse <span className="text-blue-400">AI</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl flex items-center gap-3 cursor-pointer font-medium">
            <Search size={18} /> Logs Explorer
          </div>
          <div className="p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer transition text-slate-400">
            <Activity size={18} /> Analytics
          </div>
          
          {/* PRICING TRIGGER BUTTON */}
          <div 
            onClick={() => setShowPricing(true)}
            className="p-3 mt-4 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-3 cursor-pointer transition hover:border-amber-500/50 text-amber-500 group"
          >
            <CreditCard size={18} className="group-hover:scale-110 transition" /> 
            <span className="font-bold">Upgrade Plan</span>
          </div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-8 flex justify-between items-center sticky top-0 z-10">
          <div className="text-sm font-medium text-slate-500">Dashboard</div>
          
          <div className="flex items-center gap-4">
            {/* USAGE DROPDOWN */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <span className="text-xs font-bold text-blue-700">Free: {uploadCount}/5 Files</span>
                <ChevronDown size={14} className="text-blue-600" />
              </div>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-4 z-50">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Usage</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{width: '40%'}}></div>
                </div>
                <p className="text-[11px] text-slate-600">You have **3 uploads** left today. Upgrade for more.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Shield className="text-blue-600" size={14} />
              <span className="text-xs font-bold text-slate-700">{session?.user?.role || 'USER'}</span>
            </div>
            
            <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Hello, {session?.user?.name?.split(' ')[0]}!</h2>
            <p className="text-slate-500 mt-1">Ready to analyze some massive log files today?</p>
          </div>

          {session?.user?.role === 'ADMIN' ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                <input type="file" id="log-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {!file ? (
                  <label htmlFor="log-upload" className="cursor-pointer">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Upload className="text-blue-600" size={28} /></div>
                    <h3 className="text-lg font-bold text-slate-800">Upload Log File</h3>
                    <p className="text-slate-500 text-sm mt-1">2GB Max limit per file</p>
                  </label>
                ) : (
                  <div>
                    <CheckCircle className="text-green-600 mx-auto mb-4" size={40} />
                    <h3 className="text-lg font-bold">{file.name}</h3>
                    <button onClick={() => setFile(null)} className="text-xs text-red-500 font-bold mt-2">Remove</button>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Speed: {uploadSpeed}</span>
                    <span>Remaining: {timeLeft}s</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              )}

              <button onClick={handleUpload} disabled={uploading || !file} className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3">
                {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                {uploading ? "Ingesting..." : "Start Ingestion"}
              </button>
                        {(uploading || isAnalysisReady) && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <AIInsight 
                isProcessing={uploading} 
                data={aiData} 
                onClose={() => setIsAnalysisReady(false)} // Optional: Close button ke liye
                />
            </div>
            )}
            </div>
          ) : (
            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <h4 className="font-bold text-amber-900">Standard User Access</h4>
              <p className="text-amber-800/70 text-sm mt-1">Uploads are only available for Admin accounts. Please contact support to upgrade.</p>
            </div>
          )}
        </main>
      </div>

      {/* PRICING MODAL OVERLAY */}
      {showPricing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition"><X size={24} /></button>
            
            <div className="p-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-slate-900">Select Your Power Plan</h2>
                <p className="text-slate-500 mt-2">Scalable logging for engineers who don't have time to wait.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Silver */}
                <div className="border border-slate-200 p-8 rounded-[32px] hover:border-blue-500 transition group cursor-pointer">
                  <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Silver</span>
                  <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-black">$9</span><span className="text-slate-400">/mo</span></div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">✅ 50 Uploads / Day</li>
                    <li className="flex items-center gap-2">✅ 10GB Total Storage</li>
                  </ul>
                  <button className="w-full mt-8 py-3 rounded-xl bg-slate-100 font-bold group-hover:bg-blue-600 group-hover:text-white transition">Choose Silver</button>
                </div>
                {/* Gold */}
                <div className="border-2 border-blue-600 p-8 rounded-[32px] bg-blue-50/30 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                  <span className="text-[10px] font-bold bg-blue-100 px-3 py-1 rounded-full text-blue-600 uppercase">Gold</span>
                  <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-black">$29</span><span className="text-slate-400">/mo</span></div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-2">🔥 Unlimited Uploads</li>
                    <li className="flex items-center gap-2">🔥 AI Log Analysis</li>
                  </ul>
                  <button className="w-full mt-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Go Gold</button>
                </div>
                {/* Platinum */}
                <div className="border border-slate-200 p-8 rounded-[32px] hover:border-indigo-500 transition group cursor-pointer">
                  <span className="text-[10px] font-bold bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 uppercase">Platinum</span>
                  <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-black">$99</span><span className="text-slate-400">/mo</span></div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">💎 Dedicated Worker</li>
                    <li className="flex items-center gap-2">💎 24/7 Support</li>
                  </ul>
                  <button className="w-full mt-8 py-3 rounded-xl bg-slate-100 font-bold group-hover:bg-indigo-600 group-hover:text-white transition">Custom Plan</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}