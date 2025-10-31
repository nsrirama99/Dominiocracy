"use client";

import React from "react";
import type { Unit } from "../types/unit";

type Props = {
  units: Unit[];
  onClose?: () => void;
};

export default function GroupSheet({ units, onClose }: Props) {
  if (!units || units.length === 0) {
    return null;
  }

  const unit = units[0]; // Show first unit's details

  return (
    <div className="fixed right-4 top-20 w-96 z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-800/50">
          <div className="text-sm text-zinc-200 font-semibold">
            Unit Details
          </div>
          <button
            className="text-zinc-400 text-xs hover:text-zinc-200 px-2 py-1 hover:bg-zinc-700 rounded transition-colors"
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Unit Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{
                backgroundColor: unit.playerId === 1 ? "#3b82f6" : "#ef4444",
                opacity: 0.8,
              }}
            >
              👤
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white">
                {unit.name}
              </div>
              <div className="text-xs text-zinc-400 capitalize">
                {unit.class} • Player {unit.playerId}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-500">ID</div>
              <div className="text-sm text-zinc-300 font-mono">{unit.id}</div>
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-zinc-400">Health</div>
            <div className="text-xs font-mono text-zinc-300">
              {Math.round(unit.state.health)} / {unit.state.maxHealth}
            </div>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(unit.state.health / unit.state.maxHealth) * 100}%`,
                backgroundColor:
                  unit.state.health > 50
                    ? "#10b981"
                    : unit.state.health > 25
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs text-zinc-400 mb-2">Combat Stats</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500 mb-0.5">⚔️ Attack</div>
              <div className="text-lg font-bold text-red-400">
                {unit.stats.attack}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500 mb-0.5">🛡️ Defense</div>
              <div className="text-lg font-bold text-blue-400">
                {unit.stats.defense}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500 mb-0.5">⚡ Speed</div>
              <div className="text-lg font-bold text-green-400">
                {unit.stats.speed}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-2">
              <div className="text-[10px] text-zinc-500 mb-0.5">
                🎯 Discipline
              </div>
              <div className="text-lg font-bold text-yellow-400">
                {unit.stats.discipline}
              </div>
            </div>
          </div>
        </div>

        {/* Morale Bar */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-zinc-400">😊 Morale</div>
            <div className="text-xs font-mono text-zinc-300">
              {unit.stats.morale}%
            </div>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${unit.stats.morale}%` }}
            />
          </div>
        </div>

        {/* Quirks */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs text-zinc-400 mb-2">🎭 Quirks</div>
          <div className="flex flex-wrap gap-1.5">
            {unit.quirks.map((quirk, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium"
              >
                {quirk}
              </span>
            ))}
          </div>
        </div>

        {/* Current Intent */}
        {unit.currentIntent && (
          <div className="px-4 py-3 border-b border-zinc-800 bg-purple-500/5">
            <div className="text-xs text-zinc-400 mb-2">💭 Current Intent</div>
            <div className="text-xs text-zinc-300 italic leading-relaxed">
              "{unit.currentIntent.interpretation}"
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {unit.currentIntent.action}
              </span>
              <span className="text-[10px] text-zinc-500">
                Priority: {unit.currentIntent.priority}
              </span>
            </div>
          </div>
        )}

        {/* Position */}
        <div className="px-4 py-3 bg-zinc-800/30">
          <div className="text-xs text-zinc-400 mb-1.5">📍 Position</div>
          <div className="text-xs font-mono text-zinc-300">
            X: {Math.round(unit.state.position.x)} • Y:{" "}
            {Math.round(unit.state.position.y)}
          </div>
        </div>
      </div>
    </div>
  );
}
