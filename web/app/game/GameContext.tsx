"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Unit, GamePhase, Player } from "../types/unit";

export type GameState = {
  phase: GamePhase;
  round: number;
  currentPlayerId: 1 | 2;
  units: Unit[];
  players: Player[];
  chaos: number; // global 0-100
  supplies: number; // abstract 0-100
  morale: number; // abstract 0-100
  resolutionTick: number; // 0-10 during resolution phase
};

type GameContextValue = {
  state: GameState;
  setPhase: (phase: GamePhase) => void;
  setRound: (round: number) => void;
  setCurrentPlayer: (id: 1 | 2) => void;
  setUnits: (units: Unit[]) => void;
  updateUnit: (unitId: number, updates: Partial<Unit>) => void;
  setPlayers: (players: Player[]) => void;
  updatePlayer: (playerId: 1 | 2, updates: Partial<Player>) => void;
  setChaos: (c: number) => void;
  setSupplies: (s: number) => void;
  setMorale: (m: number) => void;
  setResolutionTick: (tick: number) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<GamePhase>("draft");
  const [round, setRound] = useState<number>(1);
  const [currentPlayerId, setCurrentPlayer] = useState<1 | 2>(1);
  const [units, setUnits] = useState<Unit[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", score: 0, hasSubmittedOrder: false },
    { id: 2, name: "Player 2", score: 0, hasSubmittedOrder: false },
  ]);
  const [chaos, setChaos] = useState<number>(50);
  const [supplies, setSupplies] = useState<number>(70);
  const [morale, setMorale] = useState<number>(70);
  const [resolutionTick, setResolutionTick] = useState<number>(0);

  const updateUnit = (unitId: number, updates: Partial<Unit>) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          // Deep merge to preserve nested objects
          return {
            ...u,
            ...updates,
            state: updates.state ? { ...u.state, ...updates.state } : u.state,
            stats: updates.stats ? { ...u.stats, ...updates.stats } : u.stats,
          };
        }
        return u;
      })
    );
  };

  const updatePlayer = (playerId: 1 | 2, updates: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, ...updates } : p))
    );
  };

  const resetGame = () => {
    setPhase("draft");
    setRound(1);
    setCurrentPlayer(1);
    setUnits([]);
    setPlayers([
      { id: 1, name: "Player 1", score: 0, hasSubmittedOrder: false },
      { id: 2, name: "Player 2", score: 0, hasSubmittedOrder: false },
    ]);
    setResolutionTick(0);
  };

  const value = useMemo<GameContextValue>(
    () => ({
      state: {
        phase,
        round,
        currentPlayerId,
        units,
        players,
        chaos,
        supplies,
        morale,
        resolutionTick,
      },
      setPhase,
      setRound,
      setCurrentPlayer,
      setUnits,
      updateUnit,
      setPlayers,
      updatePlayer,
      setChaos,
      setSupplies,
      setMorale,
      setResolutionTick,
      resetGame,
    }),
    [
      phase,
      round,
      currentPlayerId,
      units,
      players,
      chaos,
      supplies,
      morale,
      resolutionTick,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
