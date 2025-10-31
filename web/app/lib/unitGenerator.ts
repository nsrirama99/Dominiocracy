import type { Unit, UnitClass, Quirk } from "../types/unit";

const UNIT_NAMES = [
	"Bob", "Alice", "Charlie", "Dave", "Eve", "Frank", "Grace", "Hank",
	"Ivy", "Jack", "Karen", "Larry", "Marge", "Nancy", "Oscar", "Pam",
	"Quinn", "Ralph", "Sally", "Tom", "Uma", "Vince", "Wanda", "Xander"
];

const CLASS_STATS: Record<UnitClass, { attack: number; defense: number; speed: number }> = {
	warrior: { attack: 75, defense: 80, speed: 50 },
	mage: { attack: 90, defense: 40, speed: 60 },
	ranger: { attack: 70, defense: 50, speed: 80 },
	cleric: { attack: 40, defense: 70, speed: 55 },
	rogue: { attack: 85, defense: 45, speed: 90 },
	bard: { attack: 50, defense: 55, speed: 65 }
};

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
	"creative"
];

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomQuirks(count: number): Quirk[] {
	const shuffled = [...ALL_QUIRKS].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export function generateUnit(id: number, playerId: 1 | 2, position: { x: number; y: number }): Unit {
	const unitClass = randomChoice<UnitClass>(["warrior", "mage", "ranger", "cleric", "rogue", "bard"]);
	const baseStats = CLASS_STATS[unitClass];
	const name = randomChoice(UNIT_NAMES);
	
	const maxHealth = randomInt(80, 120);
	
	return {
		id,
		name: `${name} the ${unitClass}`,
		class: unitClass,
		playerId,
		stats: {
			discipline: randomInt(30, 80),
			morale: randomInt(40, 90),
			speed: baseStats.speed + randomInt(-10, 10),
			attack: baseStats.attack + randomInt(-10, 10),
			defense: baseStats.defense + randomInt(-10, 10)
		},
		quirks: randomQuirks(2),
		state: {
			health: maxHealth,
			maxHealth,
			position,
			isAlive: true
		}
	};
}

export function generateUnitPool(count: number, playerId: 1 | 2): Unit[] {
	const units: Unit[] = [];
	// Generate units at random positions (will be placed properly during draft)
	for (let i = 0; i < count; i++) {
		const position = playerId === 1 
			? { x: randomInt(50, 250), y: randomInt(100, 300) }
			: { x: randomInt(350, 550), y: randomInt(100, 300) };
		
		units.push(generateUnit(i + playerId * 1000, playerId, position));
	}
	return units;
}

