"use client";

import { JSX, useState, FormEvent } from "react";
import Modal from "./Modal";
import Input from "./Input";

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
};

export default function StatsModal({
  open,
  onClose,
}: StatsModalProps): JSX.Element {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleClose = () => {
    setInput("");
    setStats(null);
    setError("");
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Get URL Stats</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleFetch} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">Enter Short URL</label>
          <Input
            placeholder="abc123"
            value={input}
            onChange={setInput}
          />
          <p className="text-xs text-gray-400">
            Examples: https://mydomain.com/abc123 or abc123
          </p>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full cursor-pointer bg-white text-black border p-2 disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Fetch Stats"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-2 text-sm rounded">
            {error}
          </div>
        )}

        {stats && (
          <div className="border rounded p-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Clicks:</span>
              <span className="font-semibold">{stats.totalClicks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Clicks Today:</span>
              <span className="font-semibold">{stats.todayClicks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Clicks Last 24 Hours:</span>
              <span className="font-semibold">{stats.last24HoursClicks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Clicks This Hour:</span>
              <span className="font-semibold">{stats.thisHourClicks}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
