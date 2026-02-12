"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const INJURY_TYPES = [
  "Shin splints",
  "Plantar fasciitis",
  "IT band syndrome",
  "Runner's knee",
  "Achilles tendinitis",
  "Hamstring strain",
  "Hip flexor strain",
  "Stress fracture",
  "Ankle sprain",
  "Calf strain",
  "Groin strain",
  "Lower back pain",
  "Piriformis syndrome",
  "Other",
];

const BODY_PARTS = [
  "Head",
  "Neck",
  "Shoulders",
  "Upper back",
  "Lower back",
  "Chest",
  "Biceps",
  "Forearms",
  "Wrists",
  "Core/Abs",
  "Hips",
  "Glutes",
  "Quads",
  "Hamstrings",
  "IT Band",
  "Knees",
  "Shins",
  "Calves",
  "Ankles",
  "Feet",
];

interface InjuryFormProps {
  preselectedBodyPart?: string;
}

export default function InjuryForm({ preselectedBodyPart }: InjuryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bodyPart, setBodyPart] = useState(preselectedBodyPart || "");
  const [bodySide, setBodySide] = useState<"" | "left" | "right">("");

  useEffect(() => {
    if (preselectedBodyPart) setBodyPart(preselectedBodyPart);
  }, [preselectedBodyPart]);
  const [injuryType, setInjuryType] = useState("");
  const [severity, setSeverity] = useState(5);
  const [onsetDate, setOnsetDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");

  const severityColor =
    severity >= 7
      ? "text-red-400"
      : severity >= 4
        ? "text-amber-400"
        : "text-yellow-400";

  const severityLabel =
    severity >= 8
      ? "Severe"
      : severity >= 6
        ? "Significant"
        : severity >= 4
          ? "Moderate"
          : severity >= 2
            ? "Mild"
            : "Minor";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bodyPart || !injuryType) {
      setError("Please select a body part and injury type");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/injuries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body_part: bodyPart,
          body_side: bodySide || null,
          injury_type: injuryType,
          severity,
          onset_date: onsetDate,
          description: description || null,
          status: "active",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log injury");
      }

      setShowSuccess(true);
      setBodyPart("");
      setBodySide("");
      setInjuryType("");
      setSeverity(5);
      setDescription("");

      setTimeout(() => setShowSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log injury");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Log New Injury
      </h3>

      {showSuccess && (
        <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-800 rounded-lg text-sm text-emerald-300">
          Injury logged successfully
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Injury Type */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Injury Type
          </label>
          <select
            value={injuryType}
            onChange={(e) => setInjuryType(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-rose-500 focus:outline-none"
          >
            <option value="">Select injury...</option>
            {INJURY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Body Part + Side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Body Part
            </label>
            <select
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-rose-500 focus:outline-none"
            >
              <option value="">Select area...</option>
              {BODY_PARTS.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Side</label>
            <div className="flex gap-2 mt-1">
              {(["left", "right", ""] as const).map((side) => (
                <button
                  key={side || "both"}
                  type="button"
                  onClick={() => setBodySide(side)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    bodySide === side
                      ? "bg-rose-900/30 border-rose-700 text-rose-300"
                      : "bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {side === "" ? "Both/Center" : side === "left" ? "Left" : "Right"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Severity Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-400">Severity</label>
            <span className={`text-sm font-bold ${severityColor}`}>
              {severity}/10 — {severityLabel}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>Minor</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        {/* Onset Date */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            When did it start?
          </label>
          <input
            type="date"
            value={onsetDate}
            onChange={(e) => setOnsetDate(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            Notes (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How it happened, what makes it worse..."
            rows={2}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-rose-500 focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {isSubmitting ? "Logging..." : "Log Injury"}
        </button>
      </form>
    </div>
  );
}
