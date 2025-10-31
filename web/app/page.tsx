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
import type { Unit, Intent, Player } from "./types/unit";

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

      setOutcomes([
        {
          id: `start-${Date.now()}`,
          icon: "⚔️",
          title: "Battle begins!",
          quote: "May the least incompetent win.",
          tags: [`Round ${game.state.round}`],
        },
      ]);
    }
  };

  // Handle unit creation
  const handleCreateUnit = (unit: Unit) => {
    const currentPlayerId = game.state.currentPlayerId;
    if (currentPlayerId === 1) {
      setPlayer1Pool((prev) => [...prev, unit]);
    } else {
      setPlayer2Pool((prev) => [...prev, unit]);
    }
  };

  // Handle unit update
  const handleUpdateUnit = (updatedUnit: Unit) => {
    const currentPlayerId = game.state.currentPlayerId;
    if (currentPlayerId === 1) {
      setPlayer1Pool((prev) =>
        prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
      );
      setPlayer1Selected((prev) =>
        prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
      );
    } else {
      setPlayer2Pool((prev) =>
        prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
      );
      setPlayer2Selected((prev) =>
        prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
      );
    }
  };

  // Handle unit deletion
  const handleDeleteUnit = (unitId: number) => {
    const currentPlayerId = game.state.currentPlayerId;
    if (currentPlayerId === 1) {
      setPlayer1Pool((prev) => prev.filter((u) => u.id !== unitId));
      setPlayer1Selected((prev) => prev.filter((u) => u.id !== unitId));
    } else {
      setPlayer2Pool((prev) => prev.filter((u) => u.id !== unitId));
      setPlayer2Selected((prev) => prev.filter((u) => u.id !== unitId));
    }
  };

  // Handle order submission
  const handleOrderSubmit = async (draft: OrderDraft) => {
    const currentPlayer = game.state.players.find(
      (p) => p.id === game.state.currentPlayerId
    );
    if (!currentPlayer) return;

    console.log(`\n📝 ORDER SUBMISSION - Player ${game.state.currentPlayerId}`);
    console.log("Order text:", draft.text);
    console.log("Current player state:", currentPlayer);

    // Update player with order
    game.updatePlayer(game.state.currentPlayerId, {
      currentOrder: draft.text,
      hasSubmittedOrder: true,
    });

    setOutcomes((prev) => [
      {
        id: `order-${game.state.currentPlayerId}-${Date.now()}`,
        icon: "📜",
        title: `Player ${game.state.currentPlayerId} issued order`,
        quote: draft.text,
        tags: [`P${game.state.currentPlayerId}`, "order"],
      },
      ...prev,
    ]);

    // Evaluate submission status immediately (predicting next state)
    const playersPredicted = game.state.players.map((p) =>
      p.id === game.state.currentPlayerId
        ? { ...p, currentOrder: draft.text, hasSubmittedOrder: true }
        : p
    );

    const p1Submitted = playersPredicted.find(
      (p) => p.id === 1
    )?.hasSubmittedOrder;
    const p2Submitted = playersPredicted.find(
      (p) => p.id === 2
    )?.hasSubmittedOrder;

    console.log("📊 Submission status check (predicted):");
    console.log(
      "  P1 submitted:",
      p1Submitted,
      "order:",
      playersPredicted.find((p) => p.id === 1)?.currentOrder
    );
    console.log(
      "  P2 submitted:",
      p2Submitted,
      "order:",
      playersPredicted.find((p) => p.id === 2)?.currentOrder
    );

    if (p1Submitted && p2Submitted) {
      console.log("✅ Both players submitted! Starting interpretation...");
      interpretOrders(playersPredicted);
    } else {
      console.log("⏳ Waiting for other player. Switching turn...");
      const nextPlayer = game.state.currentPlayerId === 1 ? 2 : 1;
      game.setCurrentPlayer(nextPlayer);

      setOutcomes((prev) => [
        {
          id: `switch-${Date.now()}`,
          icon: "🔄",
          title: `Player ${nextPlayer}'s turn`,
          quote: "Waiting for order...",
          tags: [`P${nextPlayer}`, "waiting"],
        },
        ...prev,
      ]);
    }
  };

  // Interpret orders using Gemini
  const interpretOrders = async (predictedPlayers?: Player[]) => {
    setIsProcessing(true);
    game.setPhase("interpretation");

    console.log("🎯 INTERPRETATION PHASE START");
    const playersList = predictedPlayers ?? game.state.players;
    console.log("Players:", playersList);
    console.log(
      "Units:",
      game.state.units.map((u) => ({
        id: u.id,
        playerId: u.playerId,
        alive: u.state.isAlive,
      }))
    );

    setOutcomes((prev) => [
      {
        id: `interpret-${Date.now()}`,
        icon: "🤔",
        title: "Units interpreting orders...",
        quote: "This should go well...",
        tags: ["AI thinking"],
      },
      ...prev,
    ]);

    try {
      // Interpret for each player
      for (let playerId of [1, 2] as const) {
        console.log(`\n📝 Processing Player ${playerId}`);
        const player = playersList.find((p) => p.id === playerId);
        const playerUnits = game.state.units.filter(
          (u) => u.playerId === playerId && u.state.isAlive
        );

        console.log(`Player ${playerId} order:`, player?.currentOrder);
        console.log(
          `Player ${playerId} units:`,
          playerUnits.length,
          playerUnits.map((u) => u.id)
        );

        if (!player?.currentOrder || playerUnits.length === 0) {
          console.warn(`⚠️ Skipping Player ${playerId} - no order or no units`);
          continue;
        }

        console.log(`🌐 Calling API for Player ${playerId}...`);
        const response = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: player.currentOrder,
            units: playerUnits,
            playerId,
            chaos: game.state.chaos,
          }),
        });

        if (!response.ok) {
          console.error(
            `❌ API failed for Player ${playerId}:`,
            response.status
          );
          throw new Error("Failed to interpret");
        }

        const data = await response.json();
        const intents: Intent[] = data.intents;

        console.log(
          `✅ Received ${intents.length} intents for Player ${playerId}:`,
          intents.map((i) => ({ unitId: i.unitId, action: i.action }))
        );

        // Update units with intents
        intents.forEach((intent) => {
          console.log(
            `  → Updating unit ${intent.unitId} with intent:`,
            intent.action
          );
          game.updateUnit(intent.unitId, { currentIntent: intent });
        });

        // Show ALL interpretation outcomes for this player
        console.log(
          `📢 Adding ${intents.length} outcomes to chat for Player ${playerId}`
        );
        intents.forEach((intent, index) => {
          setOutcomes((prev) => [
            {
              id: `intent-${intent.unitId}-${Date.now()}-${index}`,
              icon: "💭",
              title: `Unit ${intent.unitId} interpretation`,
              quote: intent.interpretation,
              tags: [intent.action, `P${playerId}`],
            },
            ...prev,
          ]);
        });
      }

      console.log("\n✅ All interpretations complete. Starting resolution...");

      // Small delay for drama
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Start resolution
      await runResolution();
    } catch (error) {
      console.error("❌ Interpretation error:", error);
      setOutcomes((prev) => [
        {
          id: `error-${Date.now()}`,
          icon: "❌",
          title: "Interpretation failed!",
          quote: "Units are too confused to proceed.",
          tags: ["error"],
        },
        ...prev,
      ]);
      setIsProcessing(false);
    }
  };

  // Run battle resolution
  const runResolution = async () => {
    game.setPhase("resolution");

    console.log("\n⚔️ RESOLUTION PHASE START");
    console.log(
      "Units with intents:",
      game.state.units
        .filter((u) => u.state.isAlive)
        .map((u) => ({
          id: u.id,
          playerId: u.playerId,
          hasIntent: !!u.currentIntent,
          action: u.currentIntent?.action,
        }))
    );

    setOutcomes((prev) => [
      {
        id: `resolve-${Date.now()}`,
        icon: "⚔️",
        title: "Battle simulation starting...",
        quote: "10 ticks of glorious chaos!",
        tags: ["resolution"],
      },
      ...prev,
    ]);

    const finalState = await runFullSimulation(
      game.state.units,
      (state, tick) => {
        console.log(`\n⏱️ Tick ${tick + 1}`);

        // Update units in real-time
        game.setUnits(state.units);
        game.setResolutionTick(tick);

        // Show MORE events per tick (up to 8)
        const tickEvents = state.events.filter((e) => e.tick === tick);
        console.log(
          `  Events this tick: ${tickEvents.length}`,
          tickEvents.map((e) => ({ unitId: e.unitId, type: e.type }))
        );

        tickEvents.slice(0, 8).forEach((event, index) => {
          const unitOwner = state.units.find(
            (u) => u.id === event.unitId
          )?.playerId;
          console.log(
            `  📢 Adding event to chat: Unit ${event.unitId} (P${unitOwner}) - ${event.type}`
          );
          setOutcomes((prev) => [
            {
              id: `event-${event.unitId}-${tick}-${Date.now()}-${index}`,
              icon:
                event.type === "death"
                  ? "💀"
                  : event.type === "attack"
                  ? "⚔️"
                  : event.type === "move"
                  ? "📍"
                  : "🔧",
              title: `Tick ${tick + 1}`,
              quote: event.message,
              tags: unitOwner ? [event.type, `P${unitOwner}`] : [event.type],
            },
            ...prev,
          ]);
        });
      }
    );

    console.log("\n✅ Resolution complete. Final state:", {
      p1Alive: finalState.units.filter(
        (u) => u.playerId === 1 && u.state.isAlive
      ).length,
      p2Alive: finalState.units.filter(
        (u) => u.playerId === 2 && u.state.isAlive
      ).length,
      totalEvents: finalState.events.length,
    });

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

    game.updatePlayer(1, {
      score: game.state.players[0].score + p1Score.total,
    });
    game.updatePlayer(2, {
      score: game.state.players[1].score + p2Score.total,
    });

    setOutcomes((prev) => [
      {
        id: `score-${Date.now()}`,
        icon: "🏆",
        title: "Round complete!",
        quote: `P1: ${p1Score.total} | P2: ${p2Score.total}`,
        tags: [`Round ${game.state.round}`],
      },
      ...prev,
    ]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if game should end
    if (checkRoundEnd(units, game.state.round)) {
      endGame(units);
    } else {
      // Next round
      game.setRound(game.state.round + 1);
      game.setPhase("orders");
      game.setCurrentPlayer(1);
      game.updatePlayer(1, {
        hasSubmittedOrder: false,
        currentOrder: undefined,
      });
      game.updatePlayer(2, {
        hasSubmittedOrder: false,
        currentOrder: undefined,
      });

      // Increase chaos slightly
      game.setChaos(Math.min(100, game.state.chaos + 10));

      setIsProcessing(false);
    }
  };

  // End game and declare winner
  const endGame = (units: Unit[]) => {
    game.setPhase("gameover");

    const result = determineWinner(game.state.players, units);

    setOutcomes((prev) => [
      {
        id: `gameover-${Date.now()}`,
        icon: result.winnerId ? "🎉" : "💥",
        title: result.winnerId ? `Player ${result.winnerId} wins!` : "Draw!",
        quote: result.reason,
        tags: ["game over"],
      },
      ...prev,
    ]);

    setIsProcessing(false);
  };

  const currentPlayerUnits = game.state.units.filter(
    (u) => u.playerId === game.state.currentPlayerId && u.state.isAlive
  );

  return (
    <div className="relative min-h-screen bg-zinc-900 p-4">
      {/* Game status bar */}
      <div className="fixed top-4 left-4 z-50 bg-zinc-900/95 border border-zinc-700 rounded-xl px-4 py-2 backdrop-blur shadow-xl animate-in fade-in">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="text-zinc-500">Phase:</div>
          <div className="text-zinc-200 font-semibold">{game.state.phase}</div>

          <div className="text-zinc-500">Round:</div>
          <div className="text-zinc-200 font-semibold">{game.state.round}</div>

          <div className="text-blue-400 font-semibold">P1 Score:</div>
          <div className="text-blue-200 font-bold">
            {game.state.players[0].score}
          </div>

          <div className="text-red-400 font-semibold">P2 Score:</div>
          <div className="text-red-200 font-bold">
            {game.state.players[1].score}
          </div>

          <div className="text-orange-400 font-semibold">Chaos:</div>
          <div className="text-orange-200 font-bold">{game.state.chaos}</div>
        </div>
      </div>

      {/* Start game button */}
      {game.state.phase === "draft" &&
        game.state.units.length === 0 &&
        player1Pool.length === 0 && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 text-center max-w-md">
              <h1 className="text-4xl font-bold text-white mb-4">
                Dominiocracy
              </h1>
              <p className="text-zinc-400 mb-6">
                An auto-battler where you give orders and your troops
                &ldquo;interpret&rdquo; them... poorly.
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
              onSelect={(unit) => setPlayer1Selected((prev) => [...prev, unit])}
              onDeselect={(id) =>
                setPlayer1Selected((prev) => prev.filter((u) => u.id !== id))
              }
              onConfirm={handleDraftConfirm}
              onUpdateUnit={handleUpdateUnit}
              onCreateUnit={handleCreateUnit}
              onDeleteUnit={handleDeleteUnit}
              currentPlayer={1}
              maxUnits={6}
            />
          )}
          {game.state.currentPlayerId === 2 && (
            <DraftPhase
              availableUnits={player2Pool}
              selectedUnits={player2Selected}
              onSelect={(unit) => setPlayer2Selected((prev) => [...prev, unit])}
              onDeselect={(id) =>
                setPlayer2Selected((prev) => prev.filter((u) => u.id !== id))
              }
              onConfirm={handleDraftConfirm}
              onUpdateUnit={handleUpdateUnit}
              onCreateUnit={handleCreateUnit}
              onDeleteUnit={handleDeleteUnit}
              currentPlayer={2}
              maxUnits={6}
            />
          )}
        </>
      )}

      {/* Game view */}
      {game.state.phase !== "draft" && game.state.units.length > 0 && (
        <>
          {/* Phase indicator with animation */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl px-6 py-3 shadow-2xl backdrop-blur animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-3 h-3 rounded-full transition-all duration-500
                  ${
                    game.state.phase === "orders"
                      ? "bg-blue-500 animate-pulse"
                      : ""
                  }
                  ${
                    game.state.phase === "interpretation"
                      ? "bg-yellow-500 animate-pulse"
                      : ""
                  }
                  ${
                    game.state.phase === "resolution"
                      ? "bg-red-500 animate-pulse"
                      : ""
                  }
                  ${
                    game.state.phase === "scoring"
                      ? "bg-emerald-500 animate-pulse"
                      : ""
                  }
                  ${game.state.phase === "gameover" ? "bg-gray-500" : ""}
                `}
                />
                <div className="text-sm text-zinc-200 font-semibold uppercase tracking-wider">
                  {game.state.phase === "orders" && "📜 Orders Phase"}
                  {game.state.phase === "interpretation" &&
                    "🤔 Interpreting..."}
                  {game.state.phase === "resolution" && "⚔️ Battle!"}
                  {game.state.phase === "scoring" && "🏆 Scoring"}
                  {game.state.phase === "gameover" && "🎮 Game Over"}
                </div>
                {game.state.phase !== "gameover" && (
                  <div className="text-xs text-zinc-400 ml-2 px-2 py-1 bg-zinc-800 rounded-md">
                    Round {game.state.round}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto w-[min(100%,900px)] mt-20 mr-[420px]">
            <Billboard3DDemo
              units={game.state.units}
              onUnitSelect={setSelectedUnitId}
              showHealthBars={
                game.state.phase === "resolution" ||
                game.state.phase === "scoring"
              }
            />
          </div>

          {selectedUnitId && (
            <GroupSheet
              units={[
                game.state.units.find((u) => u.id === selectedUnitId),
              ].filter((u): u is Unit => u !== undefined)}
              onClose={() => setSelectedUnitId(null)}
            />
          )}

          <OutcomeStream outcomes={outcomes} />

          {game.state.phase === "orders" && !isProcessing && (
            <>
              <CommandComposer
                targetLabel={`Player ${game.state.currentPlayerId}`}
                onSend={handleOrderSubmit}
              />

              {/* Turn indicator - moved to top left to avoid chat */}
              <div className="fixed bottom-20 left-4 z-50 bg-zinc-800/95 border border-zinc-600 rounded-lg px-4 py-2 backdrop-blur shadow-lg animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      game.state.currentPlayerId === 1
                        ? "bg-blue-500"
                        : "bg-red-500"
                    } animate-pulse`}
                  />
                  <span className="text-zinc-200 font-semibold">
                    Player {game.state.currentPlayerId}&apos;s Turn
                  </span>
                  {game.state.players.find(
                    (p) => p.id !== game.state.currentPlayerId
                  )?.hasSubmittedOrder && (
                    <span className="text-emerald-400 text-xs ml-2 animate-in fade-in">
                      ✓ Other player ready
                    </span>
                  )}
                </div>
              </div>
            </>
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
