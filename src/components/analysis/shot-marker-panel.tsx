"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Phase } from "@/generated/prisma/client";
import type { ShotWithMarkers } from "@/types";
import { upsertPhaseMarker } from "@/lib/actions/markers";
import { createShot } from "@/lib/actions/shots";
import { PHASES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhaseMarkerButton } from "./phase-marker-button";
import { PhaseMarkerList } from "./phase-marker-list";
import { ShotList } from "./shot-list";
import { ShotSelectorChips } from "./shot-selector-chips";

type ShotMarkerPanelProps = {
  videoId: string;
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  currentTime: number;
  frameNumber: number;
  onSelectShot: (shotId: string) => void;
  onShotsChange: (shots: ShotWithMarkers[]) => void;
  onSeek: (timestamp: number) => void;
};

export function ShotMarkerPanel({
  videoId,
  shots,
  selectedShotId,
  currentTime,
  frameNumber,
  onSelectShot,
  onShotsChange,
  onSeek,
}: ShotMarkerPanelProps) {
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPhase, setSavedPhase] = useState<Phase | null>(null);

  const selectedShot = shots.find((shot) => shot.id === selectedShotId) ?? null;
  const markerMap = new Map(
    selectedShot?.markers.map((m) => [m.phase, m]) ?? [],
  );

  async function handleCreateShot() {
    setCreating(true);
    setError(null);
    try {
      const shot = await createShot(videoId);
      const nextShots = [...shots, shot];
      onShotsChange(nextShots);
      onSelectShot(shot.id);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create shot",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleMarkPhase(phase: Phase) {
    if (!selectedShot) {
      setError("Select or create a shot first");
      return;
    }

    if (saving) return;

    setSaving(true);
    setError(null);
    setSavedPhase(null);

    try {
      const marker = await upsertPhaseMarker(selectedShot.id, {
        phase,
        timestamp: currentTime,
        frameNumber,
        note: note.trim() || null,
      });

      const nextShots = shots.map((shot) => {
        if (shot.id !== selectedShot.id) return shot;
        const otherMarkers = shot.markers.filter((m) => m.phase !== phase);
        return {
          ...shot,
          markers: [...otherMarkers, marker].sort(
            (a, b) => a.timestamp - b.timestamp,
          ),
        };
      });

      onShotsChange(nextShots);
      setSavedPhase(phase);
      setTimeout(() => setSavedPhase(null), 2000);
    } catch (markError) {
      setError(
        markError instanceof Error ? markError.message : "Failed to save marker",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:h-full">
      {/* Desktop header */}
      <div className="hidden items-center justify-between lg:flex">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Shot Marking
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Mark phases at the current playhead position
          </p>
        </div>
        <Button size="sm" onClick={handleCreateShot} disabled={creating}>
          {creating ? "Creating…" : "New Shot"}
        </Button>
      </div>

      {/* Mobile: horizontal shot chips */}
      <div className="lg:hidden">
        <Label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-500">
          Current Shot
        </Label>
        <ShotSelectorChips
          shots={shots}
          selectedShotId={selectedShotId}
          creating={creating}
          onSelect={onSelectShot}
          onCreate={handleCreateShot}
        />
      </div>

      {/* Desktop: vertical shot list */}
      <div className="hidden lg:block">
        <ShotList
          shots={shots}
          selectedShotId={selectedShotId}
          onSelect={onSelectShot}
        />
      </div>

      {selectedShot ? (
        <div className="space-y-4 rounded-lg border border-slate-700/60 bg-slate-950/40 p-4 lg:space-y-3">
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-100">
              {selectedShot.label ?? `Shot #${selectedShot.index}`}
            </p>
            <p className="text-xs text-slate-500">
              Current: frame {frameNumber} · {currentTime.toFixed(2)}s
            </p>
          </div>

          {/* Mobile: current position */}
          <div className="flex items-center justify-between rounded-md bg-slate-900/60 px-3 py-2 lg:hidden">
            <span className="text-xs text-slate-500">Playhead</span>
            <span className="font-mono text-sm tabular-nums text-cyan-300">
              f{frameNumber} · {currentTime.toFixed(2)}s
            </span>
          </div>

          {/* Phase markers — 2-col grid on mobile, single col on desktop */}
          <div>
            <Label className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-500">
              Mark Phase
            </Label>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {PHASES.map((phase) => {
                const marker = markerMap.get(phase);
                return (
                  <PhaseMarkerButton
                    key={phase}
                    phase={phase}
                    isMarked={!!marker}
                    markerTimestamp={marker?.timestamp}
                    markerFrameNumber={marker?.frameNumber}
                    disabled={saving}
                    saving={saving}
                    isActive={savedPhase === phase}
                    onMark={handleMarkPhase}
                  />
                );
              })}
            </div>
          </div>

          {savedPhase ? (
            <p className="text-center text-sm text-cyan-400" role="status">
              Saved {savedPhase.replace("_", " ").toLowerCase()} marker
            </p>
          ) : null}

          {saving ? (
            <p className="text-center text-sm text-slate-400" role="status">
              Saving…
            </p>
          ) : null}

          {/* Note — collapsible on mobile, always visible on desktop */}
          <Collapsible open={noteOpen} onOpenChange={setNoteOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex min-h-[44px] w-full items-center justify-between rounded-md border border-slate-700/60 px-3 py-2 text-sm text-slate-400 lg:hidden"
              >
                Add note (optional)
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${noteOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 lg:hidden">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="e.g. slight shoulder rotation"
                rows={2}
                className="min-h-[44px] text-base"
              />
            </CollapsibleContent>
          </Collapsible>

          <div className="hidden space-y-2 lg:block">
            <Label className="text-xs text-slate-500">Optional note</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. slight shoulder rotation"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Saved markers
            </Label>
            <PhaseMarkerList
              markers={selectedShot.markers}
              shotId={selectedShot.id}
              onSeek={onSeek}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-700/60 p-6 text-center text-sm text-slate-500">
          <p>Tap <strong className="text-slate-300">+ Add</strong> to create your first shot.</p>
        </div>
      )}

      {error ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
