"use client";

import { useState } from "react";
import type { Phase } from "@prisma/client";
import type { ShotWithMarkers } from "@/types";
import { Plus } from "lucide-react";
import { upsertPhaseMarker } from "@/lib/actions/markers";
import { createShot } from "@/lib/actions/shots";
import { PHASES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhaseMarkerButton } from "./phase-marker-button";
import { PhaseMarkerList } from "./phase-marker-list";
import { ShotList } from "./shot-list";

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
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedShot = shots.find((shot) => shot.id === selectedShotId) ?? null;
  const markedPhases = new Set(
    selectedShot?.markers.map((marker) => marker.phase) ?? [],
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

    setSaving(true);
    setError(null);

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
      setNote("");
    } catch (markError) {
      setError(
        markError instanceof Error ? markError.message : "Failed to save marker",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Shot Marking
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Mark phases at the current playhead position
          </p>
        </div>
        <Button size="sm" onClick={handleCreateShot} disabled={creating}>
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "New Shot"}
        </Button>
      </div>

      <ShotList
        shots={shots}
        selectedShotId={selectedShotId}
        onSelect={onSelectShot}
      />

      {selectedShot ? (
        <div className="space-y-3 rounded-lg border border-slate-700/60 bg-slate-950/40 p-4">
          <div>
            <p className="text-sm font-medium text-slate-100">
              {selectedShot.label ?? `Shot #${selectedShot.index}`}
            </p>
            <p className="text-xs text-slate-500">
              Current: frame {frameNumber} · {currentTime.toFixed(2)}s
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Optional note</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. slight shoulder rotation"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            {PHASES.map((phase) => (
              <PhaseMarkerButton
                key={phase}
                phase={phase}
                isMarked={markedPhases.has(phase)}
                disabled={saving}
                onMark={handleMarkPhase}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Marked phases</Label>
            <PhaseMarkerList
              markers={selectedShot.markers}
              shotId={selectedShot.id}
              onSeek={onSeek}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-700/60 p-4 text-sm text-slate-500">
          Create or select a shot to begin phase marking.
        </div>
      )}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saving ? (
        <p className="text-xs text-cyan-400">Saving marker…</p>
      ) : null}
    </div>
  );
}
