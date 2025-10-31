"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type GameState = {
	chaos: number; // global 0-100
	supplies: number; // abstract 0-100
	morale: number; // abstract 0-100
};

type GameContextValue = {
	state: GameState;
	setChaos: (c: number) => void;
	setSupplies: (s: number) => void;
	setMorale: (m: number) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
	const [chaos, setChaos] = useState<number>(50);
	const [supplies, setSupplies] = useState<number>(70);
	const [morale, setMorale] = useState<number>(70);

	const value = useMemo<GameContextValue>(
		() => ({ state: { chaos, supplies, morale }, setChaos, setSupplies, setMorale }),
		[chaos, supplies, morale]
	);

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
	const ctx = useContext(GameContext);
	if (!ctx) throw new Error("useGame must be used within GameProvider");
	return ctx;
}


