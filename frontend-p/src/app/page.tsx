"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogIn, Shield } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Agar user pehle se login hai, toh use dashboard bhej do
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">LogPulse AI</h1>
        <p className="text-slate-500 mb-8">Secure Log Analytics & AI Insights</p>
        
        <button 
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700 hover:border-blue-500"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
          Continue with Google
        </button>

        <p className="mt-8 text-xs text-slate-400">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}