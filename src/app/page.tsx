"use client";
import Input from "@/components/Input";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setShortUrl(data.shortUrl);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>URL Shortener</h1>
        <div className="p-10 w-full max-w-[800px]">
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Enter your URL"
                value={url}
                onChange={setUrl}
              />
              <button className="w-24" type="submit">
                Shorten
              </button>
            </div>

            {/* Row 2 */}
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Short URL"
                value={shortUrl}
                onChange={setShortUrl}
                isReadOnly={true}
              />
              <button type="button" className="w-24" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
