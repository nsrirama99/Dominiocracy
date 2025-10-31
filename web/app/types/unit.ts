export type Unit = {
	id: number;
	name: string;
	stats: {
		discipline: number;
		morale: number;
		speed: number;
	};
	traits: string[]; // up to 2
	state: {
		health: number;
		position: { x: number; y: number };
	};
};


