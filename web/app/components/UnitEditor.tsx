"use client";

import React, { useState } from "react";
import type { Unit, UnitClass, Quirk } from "../types/unit";

type Props = {
  unit: Unit | null;
  onSave: (unit: Unit) => void;
  onCancel: () => void;
  isNewUnit?: boolean;
};

const ALL_CLASSES: UnitClass[] = ["warrior", "mage", "ranger", "cleric", "rogue", "bard"];

const ALL_QUIRKS: Quirk[] = [
  "coffee-curious",
  "fire-enthusiast",
  "easily-distracted",
  "overly-literal",
  "rebel",
  "kiss-ass",
  "paranoid",
  "optimist",
  "pessimist",
  "creative",
];

const CLASS_COLORS: Record<UnitClass, string> = {
  warrior: "#c53030",
  mage: "#3182ce",
  ranger: "#38a169",
  cleric: "#d69e2e",
  rogue: "#805ad5",
  bard: "#d53f8c",
};

const CLASS_DESCRIPTIONS: Record<UnitClass, string> = {
  warrior: "High defense, moderate attack, low speed",
  mage: "Very high attack, low defense, moderate speed",
  ranger: "Balanced attack & defense, high speed",
  cleric: "Low attack, high defense, moderate speed",
  rogue: "High attack, low defense, very high speed",
  bard: "Balanced stats, moderate across the board",
};

export default function UnitEditor({ unit, onSave, onCancel, isNewUnit = false }: Props) {
  const [name, setName] = useState(unit?.name || "");
  const [unitClass, setUnitClass] = useState<UnitClass>(unit?.class || "warrior");
  const [attack, setAttack] = useState(unit?.stats.attack || 70);
  const [defense, setDefense] = useState(unit?.stats.defense || 70);
  const [speed, setSpeed] = useState(unit?.stats.speed || 60);
  const [discipline, setDiscipline] = useState(unit?.stats.discipline || 50);
  const [morale, setMorale] = useState(unit?.stats.morale || 70);
  const [maxHealth, setMaxHealth] = useState(unit?.state.maxHealth || 100);
  const [selectedQuirks, setSelectedQuirks] = useState<Quirk[]>(unit?.quirks || []);

  const toggleQuirk = (quirk: Quirk) => {
    if (selectedQuirks.includes(quirk)) {
      setSelectedQuirks(selectedQuirks.filter((q) => q !== quirk));
    } else if (selectedQuirks.length < 3) {
      // Max 3 quirks
      setSelectedQuirks([...selectedQuirks, quirk]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a unit name");
      return;
    }

    const updatedUnit: Unit = {
      id: unit?.id || Date.now(),
      name: name.trim(),
      class: unitClass,
      playerId: unit?.playerId || 1,
      stats: {
        attack,
        defense,
        speed,
        discipline,
        morale,
      },
      quirks: selectedQuirks,
      state: {
        health: maxHealth,
        maxHealth,
        position: unit?.state.position || { x: 100, y: 200 },
        isAlive: true,
      },
      currentIntent: unit?.currentIntent,
    };

    onSave(updatedUnit);
  };

  const totalStats = attack + defense + speed + discipline + morale;
  const statBudget = 350; // Reasonable budget for balanced units
  const isOverBudget = totalStats > statBudget;

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <h2 className="text-2xl font-bold text-white mb-1">
            {isNewUnit ? "✨ Create New Unit" : "🛠️ Edit Unit"}
          </h2>
          <p className="text-zinc-400 text-sm">
            Customize your unit&apos;s stats, class, and quirks
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Unit Name
              </label>
              <input
                type="text"
                className="w-full bg-zinc-800 text-white text-base rounded-lg px-4 py-2.5 border border-zinc-700 focus:border-emerald-500 focus:outline-none"
                placeholder="Enter unit name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Class
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    className={`
                      relative border-2 rounded-lg p-3 transition-all text-left
                      ${
                        unitClass === cls
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                      }
                    `}
                    onClick={() => setUnitClass(cls)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center text-lg"
                        style={{ backgroundColor: CLASS_COLORS[cls] }}
                      >
                        👤
                      </div>
                      <span className="text-white font-semibold capitalize text-sm">
                        {cls}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {CLASS_DESCRIPTIONS[cls]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-zinc-300">
                Combat Stats
              </label>
              <div
                className={`text-xs px-2 py-1 rounded-md ${
                  isOverBudget
                    ? "bg-red-500/20 text-red-400"
                    : totalStats > statBudget * 0.9
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                Total: {totalStats} / {statBudget}
                {isOverBudget && " (Over budget!)"}
              </div>
            </div>

            <div className="space-y-3">
              {/* Attack */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">⚔️ Attack</span>
                  <span className="text-sm font-bold text-red-400">{attack}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={attack}
                  onChange={(e) => setAttack(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              {/* Defense */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">🛡️ Defense</span>
                  <span className="text-sm font-bold text-blue-400">{defense}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={defense}
                  onChange={(e) => setDefense(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Speed */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">⚡ Speed</span>
                  <span className="text-sm font-bold text-green-400">{speed}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              {/* Discipline */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">🎯 Discipline</span>
                  <span className="text-sm font-bold text-yellow-400">{discipline}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={discipline}
                  onChange={(e) => setDiscipline(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              {/* Morale */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">😊 Morale</span>
                  <span className="text-sm font-bold text-purple-400">{morale}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={morale}
                  onChange={(e) => setMorale(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Max Health */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">❤️ Max Health</span>
                  <span className="text-sm font-bold text-pink-400">{maxHealth}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={maxHealth}
                  onChange={(e) => setMaxHealth(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Quirks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-zinc-300">
                🎭 Quirks
              </label>
              <span className="text-xs text-zinc-500">
                {selectedQuirks.length} / 3 selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_QUIRKS.map((quirk) => {
                const isSelected = selectedQuirks.includes(quirk);
                const canSelect = !isSelected && selectedQuirks.length < 3;

                return (
                  <button
                    key={quirk}
                    className={`
                      text-xs px-3 py-2 rounded-lg border-2 transition-all text-left font-medium
                      ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/20 text-purple-300"
                          : canSelect
                          ? "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                          : "border-zinc-800 bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
                      }
                    `}
                    onClick={() => toggleQuirk(quirk)}
                    disabled={!isSelected && selectedQuirks.length >= 3}
                  >
                    {isSelected && "✓ "}
                    {quirk}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center">
          <button
            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isOverBudget
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
            onClick={handleSave}
          >
            {isOverBudget ? "Save Anyway" : isNewUnit ? "Create Unit" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

