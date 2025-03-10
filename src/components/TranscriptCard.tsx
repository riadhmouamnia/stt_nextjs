"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";

interface TranscriptCardProps {
  transcript: string | undefined;
}

const defaultTranscript = "Open your microphone and start speaking...";
export function TranscriptCard({ transcript }: TranscriptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-blue-500 lg:text-4xl text-2xl">
          Transcript
        </CardTitle>
        {transcript && transcript !== defaultTranscript && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy transcript</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[550px] pr-4">
          <div className="p-6 text-zinc-400">
            {!transcript && defaultTranscript}
            {transcript?.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className={`leading-relaxed ${index > 0 ? "mt-4" : ""}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
