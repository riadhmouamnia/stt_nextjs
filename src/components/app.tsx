/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Visualizer from "./visualizer";
import { Mic, MicOff } from "lucide-react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";
import { TranscriptCard } from "@/components/TranscriptCard";
import { SummaryCard } from "@/components/SummaryCard";
import { TopicsCard } from "@/components/TopicsCard";
import { Button } from "@/components/ui/button";

const summaryText = `coming soon...`;

const topics = [
  "Medicine",
  "Health",
  "Therapy",
  "Anatomy",
  "Psychiatry",
  "Surgery",
];

export default function App() {
  const [caption, setCaption] = useState<string>(
    "Open your microphone and start speaking to get started"
  );
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    microphoneState,
    stopMicrophone,
  } = useMicrophone();
  const captionTimeout = useRef<any>(null);
  const keepAliveInterval = useRef<any>(null);

  const isMicOn = microphoneState === MicrophoneState.Open;

  const toggleMic = () => {
    if (microphoneState === MicrophoneState.NotSetup) {
      setupMicrophone();
      setCaption("");
    }
    if (isMicOn) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        smart_format: true,
        filler_words: true,
        // interim_results: true,
        // utterance_end_ms: 3000,
        no_delay: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const thisCaption = data.channel.alternatives[0].transcript;

      console.log(thisCaption);

      if (thisCaption !== "") {
        // console.log('thisCaption !== ""', thisCaption);
        setCaption((prev) =>
          prev === thisCaption ? prev : prev + " " + thisCaption
        );
      }

      if (isFinal && speechFinal) {
        console.log({ isFinal });
        console.log({ speechFinal });
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          // setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  return (
    <div className="flex min-h-screen gap-4 flex-col p-4 md:p-8 bg-black">
      <div className="bg-zinc-900 border rounded-xl border-zinc-800 p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMic}
            className={`h-10 w-10 ${
              isMicOn ? "text-green-500" : "text-zinc-400"
            } hover:text-zinc-100 hover:bg-zinc-800`}
          >
            {isMicOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
            <span className="sr-only">
              {isMicOn ? "Stop recording" : "Start recording"}
            </span>
          </Button>
          {microphone && (
            <Visualizer microphone={microphone} isRecording={isMicOn} />
          )}
        </div>
      </div>
      <main className="grid flex-1 gap-4 md:grid-cols-2">
        <TranscriptCard transcript={caption} />
        <div className="flex flex-col gap-4">
          <SummaryCard summary={summaryText} />
          <TopicsCard topics={topics} />
        </div>
      </main>
    </div>
  );
}
