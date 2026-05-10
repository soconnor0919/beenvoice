"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface TimeTrackerProps {
  invoiceId: string;
  onStop: (hours: number, description: string) => void;
  defaultRate?: number;
}

interface PersistedState {
  running: boolean;
  startedAt: number | null;
  description: string;
}

function storageKey(invoiceId: string) {
  return `time-tracker-${invoiceId}`;
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function readPersistedState(invoiceId: string): PersistedState {
  if (typeof window === "undefined") return { running: false, startedAt: null, description: "" };
  try {
    const raw = localStorage.getItem(storageKey(invoiceId));
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return { running: false, startedAt: null, description: "" };
}

export function TimeTracker({ invoiceId, onStop }: TimeTrackerProps) {
  const [running, setRunning] = useState(() => readPersistedState(invoiceId).running);
  const [startedAt, setStartedAt] = useState<number | null>(
    () => readPersistedState(invoiceId).startedAt,
  );
  const [elapsed, setElapsed] = useState(() => {
    const s = readPersistedState(invoiceId);
    if (s.running && s.startedAt) {
      return Math.max(0, Math.floor((Date.now() - s.startedAt) / 1000));
    }
    return 0;
  });
  const [description, setDescription] = useState(
    () => readPersistedState(invoiceId).description,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && startedAt !== null) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, startedAt]);

  function persist(state: PersistedState) {
    localStorage.setItem(storageKey(invoiceId), JSON.stringify(state));
  }

  function handleStart() {
    const now = Date.now();
    setStartedAt(now);
    setElapsed(0);
    setRunning(true);
    persist({ running: true, startedAt: now, description });
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const hours = Math.max(0.25, Math.ceil(elapsed / 900) * 0.25);
    setRunning(false);
    setStartedAt(null);
    setElapsed(0);
    localStorage.removeItem(storageKey(invoiceId));
    onStop(hours, description);
    setDescription("");
  }

  return (
    <div className="bg-secondary flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center">
      {running ? (
        <>
          <span className="text-primary font-mono text-xl font-bold tabular-nums">
            {formatElapsed(elapsed)}
          </span>
          <Input
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              persist({ running: true, startedAt, description: e.target.value });
            }}
            placeholder="What are you working on?"
            className="flex-1"
          />
          <Button type="button" variant="default" size="sm" onClick={handleStop} className="shrink-0">
            <Square className="mr-1 h-3.5 w-3.5" />
            Stop & add
          </Button>
        </>
      ) : (
        <>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will you work on?"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleStart();
              }
            }}
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleStart} className="shrink-0">
            <Play className="mr-1 h-3.5 w-3.5" />
            Start timer
          </Button>
        </>
      )}
    </div>
  );
}
