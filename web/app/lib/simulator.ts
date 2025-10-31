import type { Unit, Intent } from "../types/unit";

type SimulationState = {
	units: Unit[];
	events: BattleEvent[];
};

export type BattleEvent = {
	tick: number;
	type: "move" | "attack" | "damage" | "death" | "confusion" | "build";
	unitId: number;
	message: string;
	position?: { x: number; y: number };
	targetId?: number;
};

// Helper function to calculate distance
function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Helper function to move unit toward target
function moveToward(
	current: { x: number; y: number },
	target: { x: number; y: number },
	speed: number
): { x: number; y: number } {
	const dist = distance(current, target);
	if (dist <= speed) return { ...target };

	const ratio = speed / dist;
	return {
		x: current.x + (target.x - current.x) * ratio,
		y: current.y + (target.y - current.y) * ratio
	};
}

// Process a single tick of simulation
export function processSimulationTick(
	currentState: SimulationState,
	tick: number
): SimulationState {
	const newUnits = [...currentState.units];
	const newEvents: BattleEvent[] = [];

	// Process each alive unit
	for (let i = 0; i < newUnits.length; i++) {
		const unit = newUnits[i];
		if (!unit.state.isAlive || !unit.currentIntent) continue;

		const intent = unit.currentIntent;

		switch (intent.action) {
			case "move": {
				// Move toward target position
				const newPos = moveToward(
					unit.state.position,
					intent.targetPosition,
					unit.stats.speed / 10 // Speed per tick
				);
				unit.state.position = newPos;

				if (distance(newPos, intent.targetPosition) < 5) {
					newEvents.push({
						tick,
						type: "move",
						unitId: unit.id,
						message: `${unit.name} arrived: "${intent.interpretation}"`,
						position: newPos
					});
				}
				break;
			}

			case "attack": {
				// Find nearest enemy
				const enemies = newUnits.filter(
					u => u.state.isAlive && u.playerId !== unit.playerId
				);
				if (enemies.length > 0) {
					const nearest = enemies.reduce((closest, enemy) => {
						const d1 = distance(unit.state.position, closest.state.position);
						const d2 = distance(unit.state.position, enemy.state.position);
						return d2 < d1 ? enemy : closest;
					});

					const dist = distance(unit.state.position, nearest.state.position);

					if (dist > 50) {
						// Move toward enemy
						unit.state.position = moveToward(
							unit.state.position,
							nearest.state.position,
							unit.stats.speed / 10
						);
					} else {
						// Attack!
						const damage = Math.max(
							5,
							unit.stats.attack - nearest.stats.defense / 2 + Math.random() * 20 - 10
						);
						nearest.state.health -= damage;

						newEvents.push({
							tick,
							type: "attack",
							unitId: unit.id,
							targetId: nearest.id,
							message: `${unit.name} attacks ${nearest.name} for ${Math.round(damage)} damage!`,
							position: unit.state.position
						});

						if (nearest.state.health <= 0) {
							nearest.state.isAlive = false;
							nearest.state.health = 0;
							newEvents.push({
								tick,
								type: "death",
								unitId: nearest.id,
								message: `${nearest.name} has fallen!`,
								position: nearest.state.position
							});
						}
					}
				}
				break;
			}

			case "defend": {
				// Stay put and boost defense
				newEvents.push({
					tick,
					type: "move",
					unitId: unit.id,
					message: `${unit.name} holds position: "${intent.interpretation}"`,
					position: unit.state.position
				});
				break;
			}

			case "build": {
				// Just sit there "building"
				if (tick % 3 === 0) {
					newEvents.push({
						tick,
						type: "build",
						unitId: unit.id,
						message: `${unit.name} is constructing something: "${intent.interpretation}"`,
						position: unit.state.position
					});
				}
				break;
			}

			case "retreat": {
				// Move away from enemies
				const enemies = newUnits.filter(
					u => u.state.isAlive && u.playerId !== unit.playerId
				);
				if (enemies.length > 0) {
					// Calculate average enemy position
					const avgEnemyPos = enemies.reduce(
						(acc, e) => ({
							x: acc.x + e.state.position.x / enemies.length,
							y: acc.y + e.state.position.y / enemies.length
						}),
						{ x: 0, y: 0 }
					);

					// Move away from average
					const awayX = unit.state.position.x + (unit.state.position.x - avgEnemyPos.x) * 0.1;
					const awayY = unit.state.position.y + (unit.state.position.y - avgEnemyPos.y) * 0.1;
					
					unit.state.position = moveToward(
						unit.state.position,
						{ x: awayX, y: awayY },
						unit.stats.speed / 8
					);
				}
				break;
			}

			case "confused": {
				// Wander randomly
				if (tick % 2 === 0) {
					unit.state.position = {
						x: Math.max(0, Math.min(600, unit.state.position.x + (Math.random() * 20 - 10))),
						y: Math.max(0, Math.min(400, unit.state.position.y + (Math.random() * 20 - 10)))
					};
					if (tick === 0) {
						newEvents.push({
							tick,
							type: "confusion",
							unitId: unit.id,
							message: `${unit.name} is confused: "${intent.interpretation}"`,
							position: unit.state.position
						});
					}
				}
				break;
			}
		}
	}

	return {
		units: newUnits,
		events: [...currentState.events, ...newEvents]
	};
}

// Run full 10-tick simulation
export async function runFullSimulation(
	initialUnits: Unit[],
	onTickUpdate?: (state: SimulationState, tick: number) => void
): Promise<SimulationState> {
	let state: SimulationState = {
		units: initialUnits.map(u => ({ ...u })), // Deep copy
		events: []
	};

	for (let tick = 0; tick < 10; tick++) {
		state = processSimulationTick(state, tick);
		if (onTickUpdate) {
			onTickUpdate(state, tick);
			// Add small delay for visual effect
			await new Promise(resolve => setTimeout(resolve, 500));
		}
	}

	return state;
}

