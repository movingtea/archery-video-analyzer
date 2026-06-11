"use client";

import { useState } from "react";
import type { Phase } from "@/generated/prisma/client";
import type { ShotWithMarkers } from "@/types";
import { ChevronDown, Plus } from "lucide-react";
import { upsertPhaseMarker, deletePhaseMarker } from "@/lib/actions/markers";
import { createShot, deleteShot, updateShot } from "@/lib/actions/shots";
import { PHASES, PHASE_LABELS } from "@/lib/constants";
import { getShotDisplayName } from "@/lib/shots";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
  variant?: "desktop" | "mobile";
};

type ShotNoteFieldProps = {
  shotId: string;
  initialNote: string | null;
  saving: boolean;
  onSave: (note: string) => Promise<void>;
};

function ShotNoteField({
  shotId,
  initialNote,
  saving,
  onSave,
}: ShotNoteFieldProps) {
  const [shotNote, setShotNote] = useState(initialNote ?? "");

  return (
    <div className="space-y-2 rounded-xl border border-slate-700/60 bg-slate-950/40 p-3 sm:p-4">
      <Label htmlFor={`shot-note-${shotId}`} className="text-xs text-slate-500">
        Shot note
      </Label>
      <Textarea
        id={`shot-note-${shotId}`}
        value={shotNote}
        onChange={(event) => setShotNote(event.target.value)}
        onBlur={() => void onSave(shotNote)}
        placeholder="Notes for this shot (e.g. wind, equipment change)"
        rows={2}
        disabled={saving}
        className="min-h-[44px] text-sm"
      />
      {saving ? (
        <p className="text-xs text-cyan-400">Saving shot note…</p>
      ) : null}
    </div>
  );
}

export function ShotMarkerPanel({
  videoId,
  shots,
  selectedShotId,
  currentTime,
  frameNumber,
  onSelectShot,
  onShotsChange,
  onSeek,
  variant = "desktop",
}: ShotMarkerPanelProps) {
  const [markerNote, setMarkerNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingShotNote, setSavingShotNote] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingShotId, setDeletingShotId] = useState<string | null>(null);
  const [deletingPhase, setDeletingPhase] = useState<Phase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedPhase, setSavedPhase] = useState<Phase | null>(null);

  const selectedShot = shots.find((shot) => shot.id === selectedShotId) ?? null;
  const markerByPhase = new Map(
    selectedShot?.markers.map((marker) => [marker.phase, marker]) ?? [],
  );
  const isMobile = variant === "mobile";

  async function handleCreateShot() {
    setCreating(true);
    setError(null);
    try {
      const shot = await createShot(videoId);
      const nextShots = [...shots, shot].sort((a, b) => a.index - b.index);
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

  async function handleDeleteShot(shotId: string) {
    const shot = shots.find((item) => item.id === shotId);
    if (!shot) return;

    const confirmed = window.confirm(
      `Delete ${getShotDisplayName(shot)} and all its phase markers?`,
    );
    if (!confirmed) return;

    setDeletingShotId(shotId);
    setError(null);
    try {
      await deleteShot(shotId);
      const nextShots = shots.filter((item) => item.id !== shotId);
      onShotsChange(nextShots);
      if (selectedShotId === shotId) {
        onSelectShot(nextShots[0]?.id ?? null);
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete shot",
      );
    } finally {
      setDeletingShotId(null);
    }
  }

  async function handleSaveShotNote(note: string) {
    if (!selectedShot) return;

    const trimmed = note.trim();
    if (trimmed === (selectedShot.note ?? "")) return;

    setSavingShotNote(true);
    setError(null);
    try {
      const updated = await updateShot(selectedShot.id, { note: trimmed || null });
      onShotsChange(
        shots.map((shot) =>
          shot.id === selectedShot.id ? { ...shot, note: updated.note } : shot,
        ),
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save shot note",
      );
    } finally {
      setSavingShotNote(false);
    }
  }

  async function handleDeleteMarker(phase: Phase) {
    if (!selectedShot) return;

    const confirmed = window.confirm(
      `Remove ${PHASE_LABELS[phase]} marker from ${getShotDisplayName(selectedShot)}?`,
    );
    if (!confirmed) return;

    setDeletingPhase(phase);
    setError(null);
    try {
      await deletePhaseMarker(selectedShot.id, phase);
      onShotsChange(
        shots.map((shot) =>
          shot.id === selectedShot.id
            ? {
                ...shot,
                markers: shot.markers.filter((marker) => marker.phase !== phase),
              }
            : shot,
        ),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete marker",
      );
    } finally {
      setDeletingPhase(null);
    }
  }

  async function handleMarkPhase(phase: Phase) {
    if (!selectedShot) {
      setError("Select or create a shot first");
      return;
    }

    setSaving(true);
    setError(null);
    setSavedPhase(null);

    try {
      const marker = await upsertPhaseMarker(selectedShot.id, {
        phase,
        timestamp: currentTime,
        frameNumber,
        note: markerNote.trim() || null,
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
      setMarkerNote("");
      setSavedPhase(phase);
      setTimeout(() => setSavedPhase(null), 1500);
    } catch (markError) {
      setError(
        markError instanceof Error ? markError.message : "Failed to save marker",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <ShotList
        shots={shots}
        selectedShotId={selectedShotId}
        onSelect={onSelectShot}
        onCreateShot={handleCreateShot}
        onDeleteShot={handleDeleteShot}
        creating={creating}
        deletingId={deletingShotId}
        variant={isMobile ? "chips" : "list"}
      />

      {isMobile && shots.length === 0 ? (
        <Button
          type="button"
          onClick={handleCreateShot}
          disabled={creating}
          className="min-h-11 w-full"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "Create Shot"}
        </Button>
      ) : null}

      {selectedShot ? (
        <>
          <ShotNoteField
            key={selectedShot.id}
            shotId={selectedShot.id}
            initialNote={selectedShot.note}
            saving={savingShotNote}
            onSave={handleSaveShotNote}
          />

          <div className="space-y-4 rounded-xl border border-slate-700/60 bg-slate-950/40 p-3 sm:p-4">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Current shot
              </p>
              <p className="mt-1 text-sm font-medium text-cyan-100">
                {getShotDisplayName(selectedShot)}
                {selectedShot.label ? (
                  <span className="ml-2 text-slate-400">{selectedShot.label}</span>
                ) : null}
              </p>
              <p className="mt-1 font-mono text-xs tabular-nums text-slate-400">
                Playhead: f{frameNumber} · {currentTime.toFixed(2)}s
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
                Mark phase
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Pause at the action moment, then tap a phase to save.
              </p>
            </div>

            <div
              className={cn(
                "grid gap-2",
                isMobile ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {PHASES.map((phase) => (
                <PhaseMarkerButton
                  key={phase}
                  phase={phase}
                  isMarked={markerByPhase.has(phase)}
                  marker={markerByPhase.get(phase)}
                  disabled={saving}
                  onMark={handleMarkPhase}
                />
              ))}
            </div>

            {savedPhase ? (
              <p className="text-sm text-cyan-400">
                Saved {PHASE_LABELS[savedPhase]} marker
              </p>
            ) : null}

            {isMobile ? (
              <div>
                <button
                  type="button"
                  onClick={() => setNoteOpen((open) => !open)}
                  className="flex min-h-11 w-full items-center justify-between rounded-md border border-slate-700/60 px-3 text-sm text-slate-400"
                >
                  Marker note (optional)
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      noteOpen && "rotate-180",
                    )}
                  />
                </button>
                {noteOpen ? (
                  <Textarea
                    value={markerNote}
                    onChange={(event) => setMarkerNote(event.target.value)}
                    placeholder="e.g. slight shoulder rotation"
                    rows={2}
                    className="mt-2 min-h-[44px] text-base"
                  />
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">
                  Marker note (optional)
                </Label>
                <Textarea
                  value={markerNote}
                  onChange={(event) => setMarkerNote(event.target.value)}
                  placeholder="e.g. slight shoulder rotation"
                  rows={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Marked phases</Label>
              <PhaseMarkerList
                markers={selectedShot.markers}
                onSeek={onSeek}
                onDelete={handleDeleteMarker}
                deletingPhase={deletingPhase}
                variant={isMobile ? "cards" : "default"}
              />
            </div>
          </div>
        </>
      ) : shots.length > 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700/60 p-4 text-center text-sm text-slate-500">
          Select a shot to edit notes and mark phases.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {saving ? (
        <p className="text-sm text-cyan-400">Saving marker…</p>
      ) : null}
    </div>
  );
}
