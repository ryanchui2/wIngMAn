'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    setReply('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setReply(data.reply);
      } else {
        setReply('Error: ' + (data.error || 'Failed to get response'));
      }
    } catch (error) {
      setReply('Error: Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e2c0d7] to-white">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-16 md:px-16 lg:px-24">
        <div className="w-full max-w-3xl">
          {/* Site Name - Brutalist Typography */}
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[8rem] lg:text-[10rem] font-black leading-none mb-12 text-black tracking-tighter">
            WINGMAN
          </h1>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="what's the plan?"
                disabled={loading}
                className="w-full px-8 py-6 text-2xl md:text-3xl bg-white border-4 border-black text-black placeholder-gray-400 focus:outline-none focus:border-black font-mono disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full px-8 py-6 text-xl md:text-2xl bg-black text-white border-4 border-black font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {loading ? 'cooking...' : 'ask wingman'}
            </button>
          </form>

          {/* Response */}
          {reply && (
            <div className="mt-8 p-8 bg-white border-4 border-black">
              <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {reply}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex flex-wrap gap-8 text-sm md:text-base font-mono uppercase tracking-wider">
            <a href="#" className="hover:underline font-bold">
              Dates
            </a>
            <a href="#" className="hover:underline font-bold">
              Profile
            </a>
            <a href="#" className="hover:underline font-bold">
              History
            </a>
            <a href="#" className="hover:underline font-bold">
              About
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
