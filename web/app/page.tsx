"use client";

import Billboard3DDemo from "./components/Billboard3DDemo";
import CommandComposer, { type OrderDraft } from "./components/CommandComposer";
import GroupSheet from "./components/GroupSheet";
import OutcomeStream, { type Outcome } from "./components/OutcomeStream";
import NewGameControl from "./components/NewGameControl";
import React, { useMemo, useState } from "react";
import { GameProvider, useGame } from "./game/GameContext";
import { deriveOrderParams } from "./lib/deriveOrder";

function HomeInner() {
	const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
	const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
	const [outcomes, setOutcomes] = useState<Outcome[]>([]);
const [sessionId, setSessionId] = useState<number>(1);
const { state: game, setChaos } = useGame();

	const targetLabel = useMemo(() => {
		if (target) return `Pin (${target.x}, ${target.y})`;
		if (selectedUnitId) return `Unit #${selectedUnitId}`;
		return undefined;
	}, [target, selectedUnitId]);

	function handleSend(draft: OrderDraft) {
		const id = `${Date.now()}`;
		const { urgency, resources } = deriveOrderParams(draft, [
			{ id: selectedUnitId ?? 0, stats: { speed: 55, discipline: 50, morale: 65 }, traits: ["coffee-curious"] },
		], game, { distance: target ? Math.min(100, (target.x + target.y) / 6) : 50 });
		const funny = game.chaos > 60 ? "Built a Starbucks for morale, sir." : "Taking position. Might improvise seating.";
		setOutcomes((prev) => [
			{
				id,
				icon: game.chaos > 60 ? "🧋" : "🏗️",
				title: `Order issued to ${draft.targetLabel || "unspecified target"}`,
				quote: funny,
				tags: [urgency, resources, `chaos:${game.chaos}`],
			},
			...prev,
		]);
	}

	return (
		<div className="relative min-h-screen bg-zinc-900 p-8">
			<NewGameControl
				onStart={({ chaos }) => {
					// reset local session state and remount map
					setTarget(null);
					setSelectedUnitId(null);
					setOutcomes([]);
					setSessionId((s) => s + 1);
					// update global chaos
					setChaos(chaos);
				}}
			/>
			<div className="mx-auto w-[min(100%,900px)]">
				<Billboard3DDemo
					key={sessionId}
					onMapClick={(pos) => {
						setTarget(pos);
						setSelectedUnitId(null);
					}}
					onUnitSelect={(id) => {
						setSelectedUnitId(id);
						setTarget(null);
					}}
				/>
			</div>

			{selectedUnitId && (
				<GroupSheet
					units={[{ id: selectedUnitId, name: `Unit ${selectedUnitId}`, quirk: "coffee-curious" }]}
					onClose={() => setSelectedUnitId(null)}
				/>
			)}

			<OutcomeStream outcomes={outcomes} />

			<CommandComposer
				targetLabel={targetLabel}
				onSend={(d) => handleSend(d)}
			/>
		</div>
	);
}

export default function Home() {
	return (
		<GameProvider>
			<HomeInner />
		</GameProvider>
	);
}

