import type { GameState } from "../game/GameContext";
import type { OrderDraft } from "../components/CommandComposer";

export type UnitLite = {
	id: number;
	stats?: { speed?: number; discipline?: number; morale?: number };
	traits?: string[];
};

export type DerivedOrder = {
	urgency: "low" | "med" | "high";
	resources: "conserve" | "standard" | "excess";
};

function clamp(v: number, min: number, max: number) {
	return Math.max(min, Math.min(max, v));
}

export function deriveOrderParams(
	order: OrderDraft,
	units: UnitLite[],
    game: GameState,
	context?: { distance?: number; enemyThreat?: number; deadline?: number }
): DerivedOrder {
    const groupDiscipline = average(units.map((u) => u.stats?.discipline ?? 50));
    const groupSpeed = average(units.map((u) => u.stats?.speed ?? 50));
    const groupMorale = average(units.map((u) => u.stats?.morale ?? 60));

	const distance = context?.distance ?? 50; // 0-100 abstract
	const threat = context?.enemyThreat ?? 50; // 0-100 abstract
	const deadline = context?.deadline ?? 50; // 0-100 earlier is tighter

	// Base urgency: closer to deadline, higher threat, faster units, lower discipline -> higher urgency
	let urgencyScore = 0.4 * (100 - deadline) + 0.3 * threat + 0.2 * groupSpeed + 0.1 * (70 - groupDiscipline);
    // Base resources: low global supplies + high threat -> conserve; fortify bias via text keywords increases resource use
    const fortifyBias = /hold|fortif|defend|build/i.test(order.text) ? 15 : 0;
    let resourcesScore = 0.5 * (100 - game.supplies) + 0.35 * threat + 0.15 * fortifyBias;

	// Chaos introduces variance (0-12 pts swing at chaos 100)
	const chaosSigma = game.chaos / 100 * 12;
	urgencyScore = clamp(urgencyScore + noise(chaosSigma), 0, 100);
	resourcesScore = clamp(resourcesScore + noise(chaosSigma), 0, 100);

	const urgency: DerivedOrder["urgency"] = urgencyScore < 34 ? "low" : urgencyScore < 67 ? "med" : "high";
	const resources: DerivedOrder["resources"] = resourcesScore < 34 ? "conserve" : resourcesScore < 67 ? "standard" : "excess";

	return { urgency, resources };
}

function average(nums: number[]): number {
	if (!nums.length) return 0;
	return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function noise(sigma: number) {
	// simple symmetric noise
	return (Math.random() * 2 - 1) * sigma;
}


