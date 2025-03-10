"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  summary: string | undefined;
  isLoading: boolean;
}

export function SummaryCard({ summary, isLoading }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const defaultSummary = "Summary here...";

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-emerald-500 lg:text-4xl text-2xl">
          Summary
        </CardTitle>
        {!isLoading && summary && (
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
            <span className="sr-only">Copy summary</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="text-zinc-400">
        {isLoading ? (
          <div className="space-y-2.5">
            <Skeleton className="h-2.5 bg-zinc-800" />
            <Skeleton className="h-2.5 w-1/2 bg-zinc-800" />
          </div>
        ) : (
          <p className="leading-relaxed">
            {summary ? summary : defaultSummary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
