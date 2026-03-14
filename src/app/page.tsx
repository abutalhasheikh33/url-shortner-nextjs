"use client";
import Input from "@/components/Input";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>URL Shortener</h1>
        <div className="p-10 w-full max-w-[800px]">
          <form className="flex flex-col gap-4 w-full">
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
              />
              <button className="w-24">Copy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
