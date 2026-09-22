'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { playTactileFeedback } from '@/lib/telegram/haptics';

export const SponsoredCapsuleCard: React.FC = () => {
  return (
    <aside className="w-full apple-card rounded-2xl p-4 border relative overflow-hidden text-break-boundary transition-all">
      {/* Specular Edge Highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <span className="px-2 py-0.5 rounded-full bg-[var(--bg-pill)] border border-[var(--border-subtle)] font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] flex items-center space-x-1">
          <Sparkles className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
          <span>CURATED SPECIMEN DISPATCH</span>
        </span>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">PROMOTED</span>
      </div>

      <div className="flex items-start justify-between space-x-3 my-1">
        <div className="text-break-boundary">
          <h4 className="font-semibold text-sm text-[var(--text-primary)] tracking-tight leading-snug text-break-boundary">
            Autonomous Sovereign Cloud: Deploy High-Throughput AI Clusters with Zero Ops
          </h4>
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-1 leading-relaxed text-break-boundary">
            Engineered for high-frequency agentic swarms. Enterprise cryptographic isolation with 99.999% deterministic uptime.
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <div className="text-[11px] font-mono text-[var(--text-muted)]">
          SPONSOR: <span className="text-[var(--text-secondary)] font-medium">AETHER COMPUTING</span>
        </div>

        <a
          href="https://t.me/AetherCloudBot"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playTactileFeedback('pop')}
          className="px-3 py-1 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-xs flex items-center space-x-1 shadow-sm hover:opacity-90 transition-all"
        >
          <span>INSPECT NODE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};

