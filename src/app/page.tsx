"use client";

import Input from "@/components/Input";
import StatsModal from "@/components/StatsModal";
import { useState, FormEvent } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [recentCode, setRecentCode] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    const fullUrl = data.shortUrl;
    setShortUrl(fullUrl);
    setIsCopied(false);

    const code = fullUrl.split("/").pop() || "";
    setRecentCode(code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>URL Shortener</h1>

        <div className="p-10 w-full max-w-[800px]">
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Enter your URL"
                value={url}
                onChange={setUrl}
              />
              <button
                className="w-24 cursor-pointer bg-white text-black"
                type="submit"
              >
                Shorten
              </button>
            </div>

            <div className="flex gap-2 w-full">
              <Input
                placeholder="Short URL"
                value={shortUrl}
                onChange={setShortUrl}
                isReadOnly={true}
              />
              <button
                type="button"
                className="w-24 cursor-pointer bg-white text-black"
                onClick={handleCopy}
              >
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setStatsOpen(true)}
              className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Get Stats
            </button>
          </div>
        </div>
      </div>

      <StatsModal
        open={statsOpen}
        onClose={() => {
          setStatsOpen(false);
        }}
        recentShortUrl={recentCode}
      />
    </div>
  );
}
