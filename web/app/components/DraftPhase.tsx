"use client";

import React, { useState } from "react";
import type { Unit } from "../types/unit";
import UnitEditor from "./UnitEditor";

type Props = {
	availableUnits: Unit[];
	selectedUnits: Unit[];
	onSelect: (unit: Unit) => void;
	onDeselect: (unitId: number) => void;
	onConfirm: () => void;
	onUpdateUnit: (unit: Unit) => void;
	onCreateUnit: (unit: Unit) => void;
	onDeleteUnit: (unitId: number) => void;
	maxUnits?: number;
	currentPlayer: 1 | 2;
};

const CLASS_COLORS: Record<string, string> = {
	warrior: "#c53030",
	mage: "#3182ce",
	ranger: "#38a169",
	cleric: "#d69e2e",
	rogue: "#805ad5",
	bard: "#d53f8c"
};

export default function DraftPhase({
	availableUnits,
	selectedUnits,
	onSelect,
	onDeselect,
	onConfirm,
	onUpdateUnit,
	onCreateUnit,
	onDeleteUnit,
	maxUnits = 6,
	currentPlayer
}: Props) {
	const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
	const [isCreatingUnit, setIsCreatingUnit] = useState(false);
	const canConfirm = selectedUnits.length === maxUnits;

	const handleEditUnit = (unit: Unit) => {
		setEditingUnit(unit);
		setIsCreatingUnit(false);
	};

	const handleCreateNewUnit = () => {
		const newUnit: Unit = {
			id: Date.now(),
			name: "",
			class: "warrior",
			playerId: currentPlayer,
			stats: {
				attack: 70,
				defense: 70,
				speed: 60,
				discipline: 50,
				morale: 70
			},
			quirks: [],
			state: {
				health: 100,
				maxHealth: 100,
				position: currentPlayer === 1 
					? { x: 100, y: 200 }
					: { x: 500, y: 200 },
				isAlive: true
			}
		};
		setEditingUnit(newUnit);
		setIsCreatingUnit(true);
	};

	const handleSaveUnit = (unit: Unit) => {
		if (isCreatingUnit) {
			onCreateUnit(unit);
		} else {
			onUpdateUnit(unit);
		}
		setEditingUnit(null);
		setIsCreatingUnit(false);
	};

	const handleDeleteUnit = (unitId: number) => {
		if (confirm("Are you sure you want to delete this unit?")) {
			onDeleteUnit(unitId);
		}
	};

	return (
		<>
			<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-8">
				<div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
					<div className="px-6 py-4 border-b border-zinc-800">
						<div className="flex items-start justify-between">
							<div>
								<h2 className="text-2xl font-bold text-white mb-2">
									Player {currentPlayer} - Draft Your Units
								</h2>
								<p className="text-zinc-400 text-sm">
									Select {maxUnits} units for battle. Choose wisely... or not, they&apos;re all incompetent anyway.
								</p>
							</div>
							<button
								className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
								onClick={handleCreateNewUnit}
							>
								<span className="text-lg">✨</span>
								Create Unit
							</button>
						</div>
						<div className="mt-3">
							<div className="text-sm text-zinc-300">
								Selected: <span className="font-bold text-emerald-400">{selectedUnits.length}</span> / {maxUnits}
							</div>
						</div>
					</div>

				<div className="flex-1 overflow-auto p-6">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{availableUnits.map(unit => {
							const isSelected = selectedUnits.some(u => u.id === unit.id);
							const canSelect = !isSelected && selectedUnits.length < maxUnits;

							return (
								<div
									key={unit.id}
									className={`
										relative border-2 rounded-lg p-4 transition-all
										${isSelected 
											? "border-emerald-500 bg-emerald-500/10" 
											: canSelect 
												? "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500" 
												: "border-zinc-800 bg-zinc-900/50 opacity-50"
										}
									`}
								>
									{/* Selection checkbox */}
									{isSelected && (
										<div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
											✓
										</div>
									)}

									{/* Action buttons */}
									<div className="absolute top-2 left-2 flex gap-1">
										<button
											className="w-7 h-7 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center justify-center text-white text-xs transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												handleEditUnit(unit);
											}}
											title="Edit unit"
										>
											✏️
										</button>
										<button
											className="w-7 h-7 bg-red-600 hover:bg-red-500 rounded-md flex items-center justify-center text-white text-xs transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteUnit(unit.id);
											}}
											title="Delete unit"
										>
											🗑️
										</button>
									</div>

									{/* Unit card content - now clickable for selection */}
									<div
										className="cursor-pointer"
										onClick={() => {
											if (isSelected) {
												onDeselect(unit.id);
											} else if (canSelect) {
												onSelect(unit);
											}
										}}
									>

									<div className="flex items-center gap-3 mb-3">
										<div
											className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
											style={{ backgroundColor: CLASS_COLORS[unit.class] }}
										>
											👤
										</div>
										<div className="flex-1">
											<div className="font-semibold text-white text-sm">{unit.name}</div>
											<div className="text-xs text-zinc-400 capitalize">{unit.class}</div>
										</div>
									</div>

									<div className="space-y-1 text-xs text-zinc-400">
										<div className="flex justify-between">
											<span>Attack:</span>
											<span className="text-red-400">{unit.stats.attack}</span>
										</div>
										<div className="flex justify-between">
											<span>Defense:</span>
											<span className="text-blue-400">{unit.stats.defense}</span>
										</div>
										<div className="flex justify-between">
											<span>Speed:</span>
											<span className="text-green-400">{unit.stats.speed}</span>
										</div>
										<div className="flex justify-between">
											<span>Discipline:</span>
											<span className="text-yellow-400">{unit.stats.discipline}</span>
										</div>
									</div>

									<div className="mt-3 pt-3 border-t border-zinc-700">
										<div className="text-xs text-zinc-500 mb-1">Quirks:</div>
										<div className="flex flex-wrap gap-1">
											{unit.quirks.map((quirk, i) => (
												<span
													key={i}
													className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
												>
													{quirk}
												</span>
											))}
										</div>
									</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center">
					<div className="text-sm text-zinc-400">
						{canConfirm ? "Ready to battle!" : `Select ${maxUnits - selectedUnits.length} more unit(s)`}
					</div>
					<button
						className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
						disabled={!canConfirm}
						onClick={onConfirm}
					>
						Confirm Selection
					</button>
				</div>
			</div>
		</div>

		{/* Unit Editor Modal */}
		{editingUnit && (
			<UnitEditor
				unit={editingUnit}
				onSave={handleSaveUnit}
				onCancel={() => {
					setEditingUnit(null);
					setIsCreatingUnit(false);
				}}
				isNewUnit={isCreatingUnit}
			/>
		)}
		</>
	);
}

