"use client";

import React, { useRef, useEffect, useState } from "react";
import { Camera, Flame, Coffee, MessageCircle } from "lucide-react";

type Unit = {
	id: number;
	name: string;
	x: number;
	y: number;
	class: "warrior" | "mage" | "ranger" | "cleric" | "rogue" | string;
	hasFire: boolean;
	hasCoffee: boolean;
};

export type MapClick = { x: number; y: number };

type Props = {
	onMapClick?: (pos: MapClick) => void;
	onUnitSelect?: (unitId: number) => void;
};

export default function Billboard3DDemo({ onMapClick, onUnitSelect }: Props) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
	const [hoveredUnit, setHoveredUnit] = useState<number | null>(null);

	const units: Unit[] = [
		{ id: 1, name: "Knight", x: 150, y: 200, class: "warrior", hasFire: true, hasCoffee: false },
		{ id: 2, name: "Mage", x: 300, y: 180, class: "mage", hasFire: false, hasCoffee: true },
		{ id: 3, name: "Archer", x: 450, y: 220, class: "ranger", hasFire: false, hasCoffee: false },
		{ id: 4, name: "Healer", x: 250, y: 300, class: "cleric", hasFire: false, hasCoffee: true },
		{ id: 5, name: "Rogue", x: 400, y: 320, class: "rogue", hasFire: true, hasCoffee: false },
	];

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.fillStyle = "#2d5016";
		ctx.fillRect(0, 0, 600, 400);

		ctx.fillStyle = "#3d6026";
		ctx.beginPath();
		ctx.moveTo(0, 250);
		ctx.lineTo(150, 220);
		ctx.lineTo(300, 240);
		ctx.lineTo(450, 200);
		ctx.lineTo(600, 230);
		ctx.lineTo(600, 400);
		ctx.lineTo(0, 400);
		ctx.fill();

		ctx.fillStyle = "#4d7036";
		ctx.beginPath();
		ctx.moveTo(0, 280);
		ctx.lineTo(200, 260);
		ctx.lineTo(400, 280);
		ctx.lineTo(600, 250);
		ctx.lineTo(600, 400);
		ctx.lineTo(0, 400);
		ctx.fill();

		ctx.strokeStyle = "rgba(0,0,0,0.1)";
		ctx.lineWidth = 1;
		for (let i = 0; i < 600; i += 50) {
			ctx.beginPath();
			ctx.moveTo(i, 0);
			ctx.lineTo(i, 400);
			ctx.stroke();
		}
		for (let i = 0; i < 400; i += 50) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(600, i);
			ctx.stroke();
		}
	}, []);

	const getClassColor = (className: Unit["class"]): string => {
		const colors: Record<string, string> = {
			warrior: "#c53030",
			mage: "#3182ce",
			ranger: "#38a169",
			cleric: "#d69e2e",
			rogue: "#805ad5",
		};
		return colors[className] || "#718096";
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-white mb-2">Billboard 3D Visualization</h2>
				<p className="text-gray-300 text-sm">
					Interactive demo showing the architecture: Low-poly terrain + Face-card units + Sprite FX + HTML overlays
				</p>
			</div>

			<div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
				<canvas
					ref={canvasRef}
					width={600}
					height={400}
					className="w-full"
					onClick={(e) => {
						if (!onMapClick) return;
						const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
						const x = Math.round(e.clientX - rect.left);
						const y = Math.round(e.clientY - rect.top);
						onMapClick({ x, y });
					}}
				/>

				{units.map((unit) => (
					<div
						key={unit.id}
						className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
						style={{ left: `${unit.x}px`, top: `${unit.y}px` }}
						onMouseEnter={() => setHoveredUnit(unit.id)}
						onMouseLeave={() => setHoveredUnit(null)}
						onClick={() => {
							const next = unit.id === selectedUnit ? null : unit.id;
							setSelectedUnit(next);
							if (next && onUnitSelect) onUnitSelect(next);
						}}
					>
						<div className="relative">
							<div
								className="w-12 h-16 rounded-lg shadow-lg flex items-center justify-center text-2xl relative overflow-hidden"
								style={{
									background: `linear-gradient(135deg, ${getClassColor(unit.class)}, ${getClassColor(unit.class)}dd)`,
									border: hoveredUnit === unit.id ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
								}}
							>
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
								<span className="relative z-10">👤</span>
							</div>

							<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-full px-2 py-0.5 text-xs text-white whitespace-nowrap shadow-lg border border-gray-700">
								{unit.class}
							</div>

							{unit.hasFire && (
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
									<Flame className="w-6 h-6 text-orange-500 drop-shadow-lg" fill="currentColor" />
								</div>
							)}

							{unit.hasCoffee && (
								<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-pulse">
									<Coffee className="w-5 h-5 text-amber-700 drop-shadow-lg" fill="currentColor" />
								</div>
							)}
						</div>

						{selectedUnit === unit.id && (
							<div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
								<div className="text-xs font-semibold text-gray-800">{unit.name}</div>
								<div className="text-xs text-gray-600">Ready for action!</div>
								<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
							</div>
						)}

						{hoveredUnit === unit.id && (
							<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap bg-black/70 px-2 py-1 rounded">
								{unit.name}
							</div>
						)}
					</div>
				))}

				<div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-lg px-3 py-2 text-white text-xs flex items-center gap-2">
					<Camera className="w-4 h-4" />
					<span>3D Camera View</span>
				</div>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4">
				<div className="bg-gray-800 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<h3 className="text-white font-semibold text-sm">Low-Poly Terrain</h3>
					</div>
					<p className="text-gray-400 text-xs">Single glTF file with simple geometry. Rendered as base layer in Three.js scene.</p>
				</div>

				<div className="bg-gray-800 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-3 h-3 rounded-full bg-blue-500" />
						<h3 className="text-white font-semibold text-sm">Billboard Units</h3>
					</div>
					<p className="text-gray-400 text-xs">Face-card planes that always face camera. Uses texture atlas for efficiency.</p>
				</div>

				<div className="bg-gray-800 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-3 h-3 rounded-full bg-orange-500" />
						<h3 className="text-white font-semibold text-sm">Sprite FX</h3>
					</div>
					<p className="text-gray-400 text-xs">Simple animated sprites (fire, coffee aura) as textured planes above units.</p>
				</div>

				<div className="bg-gray-800 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-3 h-3 rounded-full bg-purple-500" />
						<h3 className="text-white font-semibold text-sm">HTML Overlays</h3>
					</div>
					<p className="text-gray-400 text-xs">Speech bubbles and UI rendered as HTML/CSS positioned over 3D scene.</p>
				</div>
			</div>

			<div className="mt-4 bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
					<div>
						<h4 className="text-blue-300 font-semibold text-sm mb-1">How it works:</h4>
						<ul className="text-blue-200 text-xs space-y-1">
							<li>• <strong>Hover</strong> over units to see names</li>
							<li>• <strong>Click</strong> units to toggle speech bubbles (HTML overlays)</li>
							<li>• Fire and coffee icons are sprite FX</li>
							<li>• Class badges are props attached to billboards</li>
							<li>• All units are flat planes that would face the camera in 3D</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-4 bg-gray-800 rounded-lg p-4">
				<h3 className="text-white font-semibold text-sm mb-2">Next.js Starter Components:</h3>
				<div className="text-xs text-gray-300 space-y-1 font-mono">
					<div>📦 <span className="text-green-400">ThreeCanvas</span> - Camera + lights + terrain loader</div>
					<div>📦 <span className="text-blue-400">BillboardUnit</span> - Face-card rendering utility</div>
					<div>📦 <span className="text-purple-400">FaceAtlas</span> - Texture atlas builder for headshots</div>
					<div>📦 <span className="text-orange-400">SpriteFX</span> - Coffee aura + fire effects</div>
				</div>
			</div>
		</div>
	);
}


