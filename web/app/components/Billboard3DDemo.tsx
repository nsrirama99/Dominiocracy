"use client";

import React, { useRef, useEffect, useState } from "react";
import { Camera, Flame, Coffee } from "lucide-react";
import type { Unit } from "../types/unit";

export type MapClick = { x: number; y: number };

type Props = {
  units: Unit[];
  onMapClick?: (pos: MapClick) => void;
  onUnitSelect?: (unitId: number) => void;
  showHealthBars?: boolean;
};

export default function Billboard3DDemo({
  units,
  onMapClick,
  onUnitSelect,
  showHealthBars = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw terrain
    ctx.fillStyle = "#2d5016";
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "#3d6026";
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(150, 220);
    ctx.lineTo(300, 240);
    ctx.lineTo(450, 200);
    ctx.lineTo(600, 230);
    ctx.lineTo(600, 400);
    ctx.lineTo(0, 400);
    ctx.fill();

    ctx.fillStyle = "#4d7036";
    ctx.beginPath();
    ctx.moveTo(0, 280);
    ctx.lineTo(200, 260);
    ctx.lineTo(400, 280);
    ctx.lineTo(600, 250);
    ctx.lineTo(600, 400);
    ctx.lineTo(0, 400);
    ctx.fill();

    // Grid
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 600; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
    }
    for (let i = 0; i < 400; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(600, i);
      ctx.stroke();
    }
  }, []);

  const getClassColor = (className: string): string => {
    const colors: Record<string, string> = {
      warrior: "#c53030",
      mage: "#3182ce",
      ranger: "#38a169",
      cleric: "#d69e2e",
      rogue: "#805ad5",
      bard: "#d53f8c",
    };
    return colors[className] || "#718096";
  };

  return (
    <div className="w-full mx-auto bg-gray-900 rounded-lg">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full"
          onClick={(e) => {
            if (!onMapClick) return;
            const rect = (
              e.target as HTMLCanvasElement
            ).getBoundingClientRect();
            const scaleX = 600 / rect.width;
            const scaleY = 400 / rect.height;
            const x = Math.round((e.clientX - rect.left) * scaleX);
            const y = Math.round((e.clientY - rect.top) * scaleY);
            onMapClick({ x, y });
          }}
        />

        {units
          .filter((u) => u.state.isAlive)
          .map((unit) => {
            const hasFireQuirk = unit.quirks.includes("fire-enthusiast");
            const hasCoffeeQuirk = unit.quirks.includes("coffee-curious");
            const isLowHealth = unit.state.health < 30;

            return (
              <div
                key={unit.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
                style={{
                  left: `${(unit.state.position.x / 600) * 100}%`,
                  top: `${(unit.state.position.y / 400) * 100}%`,
                  transition:
                    "left 0.5s ease-out, top 0.5s ease-out, transform 0.2s",
                }}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = unit.id === selectedUnit ? null : unit.id;
                  setSelectedUnit(next);
                  if (next && onUnitSelect) onUnitSelect(next);
                }}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-16 rounded-lg shadow-lg flex items-center justify-center text-2xl relative overflow-hidden transition-all duration-300 ${
                      isLowHealth ? "animate-pulse" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${getClassColor(
                        unit.class
                      )}, ${getClassColor(unit.class)}dd)`,
                      border:
                        hoveredUnit === unit.id
                          ? "3px solid white"
                          : `2px solid ${
                              unit.playerId === 1 ? "#3b82f6" : "#ef4444"
                            }`,
                      opacity: unit.state.health < 30 ? 0.6 : 1,
                      boxShadow:
                        hoveredUnit === unit.id
                          ? "0 0 20px rgba(255,255,255,0.5)"
                          : "none",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <span className="relative z-10">👤</span>

                    {/* Damage flash effect */}
                    {isLowHealth && (
                      <div className="absolute inset-0 bg-red-500 animate-ping opacity-20" />
                    )}
                  </div>

                  {showHealthBars && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-1.5 bg-gray-700 rounded-full overflow-hidden border border-zinc-600 shadow-md">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            (unit.state.health / unit.state.maxHealth) * 100
                          }%`,
                          filter: isLowHealth
                            ? "brightness(0.7) saturate(2)"
                            : "none",
                        }}
                      />
                    </div>
                  )}

                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-full px-2 py-0.5 text-[10px] text-white whitespace-nowrap shadow-lg border border-gray-700">
                    P{unit.playerId}
                  </div>

                  {hasFireQuirk && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <Flame
                        className="w-5 h-5 text-orange-500 drop-shadow-lg"
                        fill="currentColor"
                      />
                    </div>
                  )}

                  {hasCoffeeQuirk && (
                    <div className="absolute -top-8 right-0 transform translate-x-2 animate-pulse">
                      <Coffee
                        className="w-4 h-4 text-amber-700 drop-shadow-lg"
                        fill="currentColor"
                      />
                    </div>
                  )}
                </div>

                {selectedUnit === unit.id && (
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-xl whitespace-nowrap z-50 min-w-[150px]">
                    <div className="text-xs font-semibold text-gray-800">
                      {unit.name}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      HP: {Math.round(unit.state.health)}/{unit.state.maxHealth}
                    </div>
                    {unit.currentIntent && (
                      <div className="text-[10px] text-purple-600 mt-1 italic">
                        &ldquo;{unit.currentIntent.interpretation.slice(0, 40)}
                        ...&rdquo;
                      </div>
                    )}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                  </div>
                )}

                {hoveredUnit === unit.id && selectedUnit !== unit.id && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap bg-black/70 px-2 py-1 rounded z-40">
                    {unit.name}
                  </div>
                )}
              </div>
            );
          })}

        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-lg px-3 py-2 text-white text-xs flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span>Battle Map</span>
        </div>
      </div>
    </div>
  );
}
