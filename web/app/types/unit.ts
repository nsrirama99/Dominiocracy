export type UnitClass = "warrior" | "mage" | "ranger" | "cleric" | "rogue" | "bard";

export type Quirk = 
	| "coffee-curious" 
	| "fire-enthusiast" 
	| "easily-distracted"
	| "overly-literal"
	| "rebel"
	| "kiss-ass"
	| "paranoid"
	| "optimist"
	| "pessimist"
	| "creative";

export type Intent = {
	unitId: number;
	interpretation: string; // What the unit thinks they should do
	targetPosition: { x: number; y: number };
	action: "move" | "attack" | "defend" | "build" | "retreat" | "confused";
	priority: number; // 0-100
};

export type Unit = {
	id: number;
	name: string;
	class: UnitClass;
	playerId: 1 | 2;
	stats: {
		discipline: number;
		morale: number;
		speed: number;
		attack: number;
		defense: number;
	};
	quirks: Quirk[];
	state: {
		health: number;
		maxHealth: number;
		position: { x: number; y: number };
		isAlive: boolean;
	};
	currentIntent?: Intent;
};

export type GamePhase = "draft" | "orders" | "interpretation" | "resolution" | "scoring" | "gameover";

export type Player = {
	id: 1 | 2;
	name: string;
	score: number;
	hasSubmittedOrder: boolean;
	currentOrder?: string;
};

