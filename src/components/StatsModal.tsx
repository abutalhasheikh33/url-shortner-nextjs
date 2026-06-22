"use client";

import { JSX, useState, FormEvent, useEffect, useRef } from "react";
import Modal from "./Modal";

type StatsData = {
  shortUrl: string;
  totalClicks: number;
  todayClicks: number;
  last24HoursClicks: number;
  thisHourClicks: number;
};

type StatsModalProps = {
  open: boolean;
  onClose: () => void;
  recentShortUrl?: string;
};

export default function StatsModal({
  open,
  onClose,
  recentShortUrl,
}: StatsModalProps): JSX.Element {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInput(recentShortUrl || "");
      setStats(null);
      setError("");
      requestAnimationFrame(() => inputRef.current?.focus());
      if (recentShortUrl) {
        setLoading(true);
        fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shortUrl: recentShortUrl }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok || data.error) {
              setError(data.error || "Unable to fetch stats");
            } else {
              setStats(data);
            }
          })
          .catch(() => setError("Unable to fetch stats"))
          .finally(() => setLoading(false));
      }
    }
  }, [open, recentShortUrl]);

  const handleFetch = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setStats(null);

    try {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortUrl: input.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to fetch stats");
        return;
      }

      setStats(data);
    } catch {
      setError("Unable to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Get URL Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleFetch} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">Enter Short URL</label>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="abc123"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-400">
            Examples: https://mydomain.com/abc123 or abc123
          </p>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching..." : "Fetch Stats"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm rounded-lg">
            {error}
          </div>
        )}

        {stats && (
          <div className="flex flex-col gap-3">
            <div className="border border-gray-200 rounded-xl py-4 px-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.totalClicks}</div>
              <div className="text-xs font-medium text-gray-400 mt-0.5">Total Clicks</div>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-xs font-medium text-gray-400">Clicks This Hour</span>
                  <span className="font-bold text-gray-900">{stats.thisHourClicks}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-xs font-medium text-gray-400">Clicks Today</span>
                  <span className="font-bold text-gray-900">{stats.todayClicks}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-xs font-medium text-gray-400">Last 24 Hours</span>
                  <span className="font-bold text-gray-900">{stats.last24HoursClicks}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
