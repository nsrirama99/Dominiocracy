"use client";

import React from "react";

type UnitSummary = { id: number; name: string; quirk?: string };

type Props = {
	units: UnitSummary[];
	morale?: number; // 0-100
	onClose?: () => void;
};

export default function GroupSheet({ units, morale = 70, onClose }: Props) {
	return (
		<div className="fixed right-4 top-20 w-80 z-30">
			<div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
					<div className="text-sm text-zinc-200 font-semibold">Selected Group</div>
					<button className="text-zinc-400 text-xs hover:text-zinc-200" onClick={onClose}>Close</button>
				</div>
				<div className="px-4 py-3">
					<div className="text-xs text-zinc-400 mb-2">Morale</div>
					<div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
						<div className="h-full bg-emerald-500" style={{ width: `${morale}%` }} />
					</div>
				</div>
				<div className="px-4 pb-4 grid gap-2 max-h-64 overflow-auto">
					{units.map((u) => (
						<div key={u.id} className="flex items-center justify-between bg-zinc-800/60 border border-zinc-700 rounded-md px-3 py-2">
							<div>
								<div className="text-sm text-zinc-200">{u.name}</div>
								<div className="text-[11px] text-zinc-400">{u.quirk || "eager"}</div>
							</div>
							<div className="text-[10px] text-zinc-500">ID {u.id}</div>
						</div>
					))}
				</div>
				<div className="px-4 pb-4">
					<div className="text-xs text-zinc-300 mb-1">Rules</div>
					<div className="flex items-center gap-3 text-[11px] text-zinc-300">
						<label className="flex items-center gap-1">
							<input type="checkbox" defaultChecked className="accent-zinc-200" />
							<span>Allow improvisation</span>
						</label>
						<label className="flex items-center gap-1">
							<input type="checkbox" className="accent-zinc-200" />
							<span>Avoid civilian structures</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}


