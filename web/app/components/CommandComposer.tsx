"use client";

import React, { useMemo, useState } from "react";

export type OrderDraft = {
  text: string;
  urgency?: "low" | "med" | "high"; // computed later
  resources?: "conserve" | "standard" | "excess"; // computed later
  targetLabel?: string;
  personalities: string[];
};

type Props = {
  initialText?: string;
  targetLabel?: string;
  onPreview?: (summary: string, misreads: string[]) => void;
  onSend?: (draft: OrderDraft) => void;
};

export default function CommandComposer({
  initialText = "",
  targetLabel,
  onPreview,
  onSend,
}: Props) {
  const [text, setText] = useState(initialText);
  const [urgency, setUrgency] = useState<"low" | "med" | "high">("med");
  const [resources, setResources] = useState<
    "conserve" | "standard" | "excess"
  >("standard");
  const [personalities, setPersonalities] = useState<string[]>([]);

  const targetChip = useMemo(
    () =>
      targetLabel ? (
        <span className="px-2 py-0.5 text-xs bg-zinc-700 text-white rounded-full border border-zinc-600">
          {targetLabel}
        </span>
      ) : null,
    [targetLabel]
  );

  const preview = useMemo(() => {
    if (!text) return null;
    const summary = `Intent: ${text.trim().slice(0, 80)}${
      text.length > 80 ? "…" : ""
    }`;
    const misreads = [
      "Troops interpret 'hold hill' as 'build hill-themed cafe'",
      "Scouts try to recruit local wildlife as archers",
      "Logistics buys 400 cups of decaf by mistake",
    ];
    return { summary, misreads };
  }, [text]);

  return (
    <div className="fixed left-44 bottom-4 z-40 w-[min(900px,calc(100vw-440px))]">
      <div className="bg-zinc-900/95 backdrop-blur border border-zinc-700 rounded-xl shadow-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          {targetChip}
          <input
            className="flex-1 bg-zinc-800 text-zinc-100 text-sm rounded-md px-3 py-2 outline-none border border-zinc-700 focus:border-zinc-500"
            placeholder="What's your intent?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text && !e.shiftKey) {
                e.preventDefault();
                onSend?.({
                  text,
                  urgency,
                  resources,
                  targetLabel,
                  personalities,
                });
                setText(""); // Clear input after sending
              }
            }}
          />
          <button
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-md disabled:opacity-50"
            disabled={!text}
            onClick={() => {
              onSend?.({
                text,
                urgency,
                resources,
                targetLabel,
                personalities,
              });
              setText(""); // Clear input after sending
            }}
          >
            Issue Order
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-300">Urgency</label>
            <select
              className="flex-1 bg-zinc-800 text-zinc-100 text-xs rounded-md px-2 py-1 border border-zinc-700"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
            >
              <option value="low">low</option>
              <option value="med">med</option>
              <option value="high">high</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-300">Resources</label>
            <select
              className="flex-1 bg-zinc-800 text-zinc-100 text-xs rounded-md px-2 py-1 border border-zinc-700"
              value={resources}
              onChange={(e) => setResources(e.target.value as any)}
            >
              <option value="conserve">conserve</option>
              <option value="standard">standard</option>
              <option value="excess">excess</option>
            </select>
          </div>
        </div>

        {preview && (
          <div className="mt-3 border-t border-zinc-800 pt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-zinc-300">Preview</div>
              <div className="text-[10px] text-zinc-500">
                Press Enter to submit
              </div>
            </div>
            <div className="text-xs text-zinc-200">{preview.summary}</div>
            <ul className="mt-1 text-[11px] text-zinc-400 list-disc pl-5 grid gap-0.5">
              {preview.misreads.slice(0, 2).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
