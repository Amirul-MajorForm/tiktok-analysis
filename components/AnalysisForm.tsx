'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (profileUrl: string, username: string) => void;
  loading: boolean;
}

export default function AnalysisForm({ onSubmit, loading }: Props) {
  const [profileUrl, setProfileUrl] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim() || !username.trim()) return;
    onSubmit(profileUrl.trim(), username.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink" htmlFor="profileUrl">
          TikTok Profile URL
        </label>
        <input
          id="profileUrl"
          type="url"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder="https://www.tiktok.com/@username"
          required
          className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-ink" htmlFor="username">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-medium select-none">@</span>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
            placeholder="username"
            required
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-surface-border bg-surface text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition text-sm"
          />
        </div>
        <p className="text-xs text-ink-muted">Enter the username exactly as it appears on TikTok.</p>
      </div>

      <button
        type="submit"
        disabled={loading || !profileUrl.trim() || !username.trim()}
        className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analysing…
          </>
        ) : (
          'Run Analysis'
        )}
      </button>
    </form>
  );
}
