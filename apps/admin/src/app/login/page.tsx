"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(
            `Too many failed attempts. Please retry in ${data.retryAfterSeconds || 900} seconds.`
          );
        } else {
          setErrorMessage(data.error || "Authentication failed.");
        }
        setLoading(false);
        return;
      }

      // Success: redirect to dashboard
      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage("Network error connecting to authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 selection:bg-yellow-400 selection:text-black">
      {/* Background kinetic grid subtle accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black text-xl mb-4 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-yellow-400 uppercase mb-1">
            Studio Security Gateway
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            Art Work OS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Production Stage Scenography & Content Control
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Studio Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chief@artwork.stage"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Passphrase
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(250,204,21,0.25)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <span>Enter Studio OS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600 font-mono">
          DUAL-BOUNDARY DEFENSE // RLS + HTTPONLY JWT
        </div>
      </div>
    </div>
  );
}
