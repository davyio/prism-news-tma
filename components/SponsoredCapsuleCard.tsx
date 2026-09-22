'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram/haptics';

export const SponsoredCapsuleCard: React.FC = () => {
  return (
    <aside className="w-full apple-card rounded-2xl p-4 border border-white/10 bg-gradient-to-br from-neutral-900/60 via-neutral-950/40 to-black relative overflow-hidden">
      {/* Specular Edge Highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 font-mono text-[9px] uppercase tracking-widest text-neutral-400 flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 text-neutral-300" />
          <span>CURATED SPECIMEN DISPATCH</span>
        </span>
        <span className="text-[10px] font-mono text-neutral-500">PROMOTED</span>
      </div>

      <div className="flex items-start justify-between space-x-3 my-1">
        <div>
          <h4 className="font-semibold text-sm text-white tracking-tight leading-snug">
            Autonomous Sovereign Cloud: Deploy High-Throughput AI Clusters with Zero Ops
          </h4>
          <p className="text-xs text-neutral-400 font-sans mt-1 leading-relaxed">
            Engineered for high-frequency agentic swarms. Enterprise cryptographic isolation with 99.999% deterministic uptime.
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
        <div className="text-[11px] font-mono text-neutral-500">
          SPONSOR: <span className="text-neutral-300">AETHER COMPUTING</span>
        </div>

        <a
          href="https://t.me/AetherCloudBot"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic('medium')}
          className="px-3 py-1 rounded-lg bg-white text-black font-semibold text-xs flex items-center space-x-1 shadow-sm hover:bg-neutral-200 transition-all"
        >
          <span>INSPECT NODE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
