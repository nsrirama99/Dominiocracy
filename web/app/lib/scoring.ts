import type { Unit, Player } from "../types/unit";

export type ScoreBreakdown = {
	unitsAlive: number;
	totalHealth: number;
	territoryControl: number;
	total: number;
};

export function calculateScore(units: Unit[], playerId: 1 | 2): ScoreBreakdown {
	const playerUnits = units.filter(u => u.playerId === playerId);
	const aliveUnits = playerUnits.filter(u => u.state.isAlive);

	// Units alive (20 points each)
	const unitsAlive = aliveUnits.length * 20;

	// Total health remaining
	const totalHealth = Math.round(
		aliveUnits.reduce((sum, u) => sum + u.state.health, 0) / 2
	);

	// Territory control (based on average position)
	// Player 1 gets points for being on right side, Player 2 for left side
	let territoryControl = 0;
	if (aliveUnits.length > 0) {
		const avgX = aliveUnits.reduce((sum, u) => sum + u.state.position.x, 0) / aliveUnits.length;
		if (playerId === 1) {
			// Player 1 wants to be on the right (enemy territory)
			territoryControl = Math.round((avgX / 600) * 50);
		} else {
			// Player 2 wants to be on the left (enemy territory)
			territoryControl = Math.round(((600 - avgX) / 600) * 50);
		}
	}

	return {
		unitsAlive,
		totalHealth,
		territoryControl,
		total: unitsAlive + totalHealth + territoryControl
	};
}

export function determineWinner(
	players: Player[],
	units: Unit[]
): { winnerId: 1 | 2 | null; reason: string } {
	const p1Score = calculateScore(units, 1);
	const p2Score = calculateScore(units, 2);

	const p1Alive = units.filter(u => u.playerId === 1 && u.state.isAlive).length;
	const p2Alive = units.filter(u => u.playerId === 2 && u.state.isAlive).length;

	// Check for total elimination
	if (p1Alive === 0 && p2Alive === 0) {
		return { winnerId: null, reason: "Mutual destruction! It's a draw." };
	}
	if (p1Alive === 0) {
		return { winnerId: 2, reason: "Player 1 eliminated!" };
	}
	if (p2Alive === 0) {
		return { winnerId: 1, reason: "Player 2 eliminated!" };
	}

	// Otherwise, check scores
	if (p1Score.total > p2Score.total) {
		return { winnerId: 1, reason: `Victory by score: ${p1Score.total} vs ${p2Score.total}` };
	} else if (p2Score.total > p1Score.total) {
		return { winnerId: 2, reason: `Victory by score: ${p2Score.total} vs ${p1Score.total}` };
	}

	return { winnerId: null, reason: "It's a tie!" };
}

export function checkRoundEnd(units: Unit[], round: number): boolean {
	const p1Alive = units.filter(u => u.playerId === 1 && u.state.isAlive).length;
	const p2Alive = units.filter(u => u.playerId === 2 && u.state.isAlive).length;

	// End if one side is eliminated
	if (p1Alive === 0 || p2Alive === 0) return true;

	// End after 5 rounds
	if (round >= 5) return true;

	return false;
}

