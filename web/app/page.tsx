"use client";

import Billboard3DDemo from "./components/Billboard3DDemo";
import CommandComposer, { type OrderDraft } from "./components/CommandComposer";
import GroupSheet from "./components/GroupSheet";
import OutcomeStream, { type Outcome } from "./components/OutcomeStream";
import DraftPhase from "./components/DraftPhase";
import React, { useState, useEffect } from "react";
import { GameProvider, useGame } from "./game/GameContext";
import { generateUnitPool } from "./lib/unitGenerator";
import { runFullSimulation, type BattleEvent } from "./lib/simulator";
import { calculateScore, determineWinner, checkRoundEnd } from "./lib/scoring";
import type { Unit, Intent } from "./types/unit";

function HomeInner() {
	const game = useGame();
	const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
	const [outcomes, setOutcomes] = useState<Outcome[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	
	// Draft state
	const [player1Pool, setPlayer1Pool] = useState<Unit[]>([]);
	const [player2Pool, setPlayer2Pool] = useState<Unit[]>([]);
	const [player1Selected, setPlayer1Selected] = useState<Unit[]>([]);
	const [player2Selected, setPlayer2Selected] = useState<Unit[]>([]);

	// Start new game
	const startNewGame = () => {
		game.resetGame();
		setOutcomes([]);
		setSelectedUnitId(null);
		
		// Generate unit pools
		const p1Pool = generateUnitPool(10, 1);
		const p2Pool = generateUnitPool(10, 2);
		setPlayer1Pool(p1Pool);
		setPlayer2Pool(p2Pool);
		setPlayer1Selected([]);
		setPlayer2Selected([]);
		
		game.setPhase("draft");
		game.setCurrentPlayer(1);
		game.setChaos(50);
	};

	// Handle draft confirmation
	const handleDraftConfirm = () => {
		if (game.state.currentPlayerId === 1) {
			// Switch to player 2
			game.setCurrentPlayer(2);
		} else {
			// Both players drafted, start game
			const allUnits = [...player1Selected, ...player2Selected];
			game.setUnits(allUnits);
			game.setPhase("orders");
			game.setCurrentPlayer(1);
			
			setOutcomes([{
				id: `start-${Date.now()}`,
				icon: "⚔️",
				title: "Battle begins!",
				quote: "May the least incompetent win.",
				tags: [`Round ${game.state.round}`]
			}]);
		}
	};

	// Handle order submission
	const handleOrderSubmit = async (draft: OrderDraft) => {
		const currentPlayer = game.state.players.find(p => p.id === game.state.currentPlayerId);
		if (!currentPlayer) return;

		// Update player with order
		game.updatePlayer(game.state.currentPlayerId, {
			currentOrder: draft.text,
			hasSubmittedOrder: true
		});

		setOutcomes(prev => [{
			id: `order-${game.state.currentPlayerId}-${Date.now()}`,
			icon: "📜",
			title: `Player ${game.state.currentPlayerId} issued order`,
			quote: draft.text,
			tags: ["waiting for interpretation"]
		}, ...prev]);

		// Check if both players submitted
		const otherPlayer = game.state.players.find(p => p.id !== game.state.currentPlayerId);
		const bothSubmitted = otherPlayer?.hasSubmittedOrder;

		if (bothSubmitted) {
			// Proceed to interpretation
			await interpretOrders();
		} else {
			// Switch to other player
			game.setCurrentPlayer(game.state.currentPlayerId === 1 ? 2 : 1);
		}
	};

	// Interpret orders using Gemini
	const interpretOrders = async () => {
		setIsProcessing(true);
		game.setPhase("interpretation");

		setOutcomes(prev => [{
			id: `interpret-${Date.now()}`,
			icon: "🤔",
			title: "Units interpreting orders...",
			quote: "This should go well...",
			tags: ["AI thinking"]
		}, ...prev]);

		try {
			// Interpret for each player
			for (let playerId of [1, 2] as const) {
				const player = game.state.players.find(p => p.id === playerId);
				const playerUnits = game.state.units.filter(u => u.playerId === playerId && u.state.isAlive);
				
				if (!player?.currentOrder || playerUnits.length === 0) continue;

				const response = await fetch("/api/interpret", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						order: player.currentOrder,
						units: playerUnits,
						playerId,
						chaos: game.state.chaos
					})
				});

				if (!response.ok) throw new Error("Failed to interpret");

				const data = await response.json();
				const intents: Intent[] = data.intents;

				// Update units with intents
				intents.forEach(intent => {
					game.updateUnit(intent.unitId, { currentIntent: intent });
				});

				// Show interpretation outcomes
				intents.slice(0, 3).forEach(intent => {
					setOutcomes(prev => [{
						id: `intent-${intent.unitId}-${Date.now()}`,
						icon: "💭",
						title: `Unit ${intent.unitId} interpretation`,
						quote: intent.interpretation,
						tags: [intent.action]
					}, ...prev]);
				});
			}

			// Small delay for drama
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Start resolution
			await runResolution();

		} catch (error) {
			console.error("Interpretation error:", error);
			setOutcomes(prev => [{
				id: `error-${Date.now()}`,
				icon: "❌",
				title: "Interpretation failed!",
				quote: "Units are too confused to proceed.",
				tags: ["error"]
			}, ...prev]);
			setIsProcessing(false);
		}
	};

	// Run battle resolution
	const runResolution = async () => {
		game.setPhase("resolution");

		setOutcomes(prev => [{
			id: `resolve-${Date.now()}`,
			icon: "⚔️",
			title: "Battle simulation starting...",
			quote: "10 ticks of glorious chaos!",
			tags: ["resolution"]
		}, ...prev]);

		const finalState = await runFullSimulation(
			game.state.units,
			(state, tick) => {
				// Update units in real-time
				game.setUnits(state.units);
				game.setResolutionTick(tick);

				// Show some events
				const tickEvents = state.events.filter(e => e.tick === tick);
				tickEvents.slice(0, 2).forEach(event => {
					setOutcomes(prev => [{
						id: `event-${event.unitId}-${tick}-${Date.now()}`,
						icon: event.type === "death" ? "💀" : event.type === "attack" ? "⚔️" : "📍",
						title: `Tick ${tick + 1}`,
						quote: event.message,
						tags: [event.type]
					}, ...prev]);
				});
			}
		);

		// Update final state
		game.setUnits(finalState.units);

		// Calculate scores
		await scoreRound(finalState.units);
	};

	// Score the round
	const scoreRound = async (units: Unit[]) => {
		game.setPhase("scoring");

		const p1Score = calculateScore(units, 1);
		const p2Score = calculateScore(units, 2);

		game.updatePlayer(1, { score: game.state.players[0].score + p1Score.total });
		game.updatePlayer(2, { score: game.state.players[1].score + p2Score.total });

		setOutcomes(prev => [{
			id: `score-${Date.now()}`,
			icon: "🏆",
			title: "Round complete!",
			quote: `P1: ${p1Score.total} | P2: ${p2Score.total}`,
			tags: [`Round ${game.state.round}`]
		}, ...prev]);

		await new Promise(resolve => setTimeout(resolve, 2000));

		// Check if game should end
		if (checkRoundEnd(units, game.state.round)) {
			endGame(units);
		} else {
			// Next round
			game.setRound(game.state.round + 1);
			game.setPhase("orders");
			game.setCurrentPlayer(1);
			game.updatePlayer(1, { hasSubmittedOrder: false, currentOrder: undefined });
			game.updatePlayer(2, { hasSubmittedOrder: false, currentOrder: undefined });
			
			// Increase chaos slightly
			game.setChaos(Math.min(100, game.state.chaos + 10));
			
			setIsProcessing(false);
		}
	};

	// End game and declare winner
	const endGame = (units: Unit[]) => {
		game.setPhase("gameover");
		
		const result = determineWinner(game.state.players, units);
		
		setOutcomes(prev => [{
			id: `gameover-${Date.now()}`,
			icon: result.winnerId ? "🎉" : "💥",
			title: result.winnerId ? `Player ${result.winnerId} wins!` : "Draw!",
			quote: result.reason,
			tags: ["game over"]
		}, ...prev]);

		setIsProcessing(false);
	};

	const currentPlayerUnits = game.state.units.filter(
		u => u.playerId === game.state.currentPlayerId && u.state.isAlive
	);

	return (
		<div className="relative min-h-screen bg-zinc-900 p-4">
			{/* Game status bar */}
			<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 border border-zinc-700 rounded-lg px-4 py-2 backdrop-blur">
				<div className="flex items-center gap-6 text-sm">
					<div className="text-zinc-300">
						<span className="font-bold text-white">Phase:</span> {game.state.phase}
					</div>
					<div className="text-zinc-300">
						<span className="font-bold text-white">Round:</span> {game.state.round}
					</div>
					<div className="text-zinc-300">
						<span className="font-bold text-blue-400">P1:</span> {game.state.players[0].score}
					</div>
					<div className="text-zinc-300">
						<span className="font-bold text-red-400">P2:</span> {game.state.players[1].score}
					</div>
					<div className="text-zinc-300">
						<span className="font-bold text-orange-400">Chaos:</span> {game.state.chaos}
					</div>
					{game.state.phase === "orders" && (
						<div className="text-emerald-400 font-semibold">
							→ Player {game.state.currentPlayerId}'s turn
						</div>
					)}
				</div>
			</div>

			{/* Start game button */}
			{game.state.phase === "draft" && game.state.units.length === 0 && player1Pool.length === 0 && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center">
					<div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 text-center max-w-md">
						<h1 className="text-4xl font-bold text-white mb-4">Dominiocracy</h1>
						<p className="text-zinc-400 mb-6">
							An auto-battler where you give orders and your troops "interpret" them... poorly.
						</p>
						<button
							className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-lg"
							onClick={startNewGame}
						>
							Start New Game
						</button>
					</div>
				</div>
			)}

			{/* Draft phase */}
			{game.state.phase === "draft" && player1Pool.length > 0 && (
				<>
					{game.state.currentPlayerId === 1 && (
						<DraftPhase
							availableUnits={player1Pool}
							selectedUnits={player1Selected}
							onSelect={(unit) => setPlayer1Selected(prev => [...prev, unit])}
							onDeselect={(id) => setPlayer1Selected(prev => prev.filter(u => u.id !== id))}
							onConfirm={handleDraftConfirm}
							currentPlayer={1}
							maxUnits={6}
						/>
					)}
					{game.state.currentPlayerId === 2 && (
						<DraftPhase
							availableUnits={player2Pool}
							selectedUnits={player2Selected}
							onSelect={(unit) => setPlayer2Selected(prev => [...prev, unit])}
							onDeselect={(id) => setPlayer2Selected(prev => prev.filter(u => u.id !== id))}
							onConfirm={handleDraftConfirm}
							currentPlayer={2}
							maxUnits={6}
						/>
					)}
				</>
			)}

			{/* Game view */}
			{game.state.phase !== "draft" && game.state.units.length > 0 && (
				<>
					<div className="mx-auto w-[min(100%,900px)] mt-20">
						<Billboard3DDemo
							units={game.state.units}
							onUnitSelect={setSelectedUnitId}
							showHealthBars={game.state.phase === "resolution" || game.state.phase === "scoring"}
						/>
					</div>

					{selectedUnitId && (
						<GroupSheet
							units={[game.state.units.find(u => u.id === selectedUnitId)!].filter(Boolean).map(u => ({
								id: u.id,
								name: u.name,
								quirk: u.quirks[0]
							}))}
							onClose={() => setSelectedUnitId(null)}
						/>
					)}

					<OutcomeStream outcomes={outcomes} />

					{game.state.phase === "orders" && !isProcessing && (
						<CommandComposer
							targetLabel={`Player ${game.state.currentPlayerId}`}
							onSend={handleOrderSubmit}
						/>
					)}

					{game.state.phase === "gameover" && (
						<div className="fixed bottom-4 right-4 z-40">
							<button
								className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
								onClick={startNewGame}
							>
								Play Again
							</button>
						</div>
					)}

					{isProcessing && (
						<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-700 rounded-lg px-6 py-3 backdrop-blur">
							<div className="flex items-center gap-3">
								<div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
								<span className="text-white font-semibold">Processing...</span>
							</div>
						</div>
					)}
				</>
			)}
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

