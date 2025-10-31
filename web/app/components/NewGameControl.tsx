"use client";

import React, { useState } from "react";

type Props = {
	onStart: (opts: { chaos: number }) => void;
};

export default function NewGameControl({ onStart }: Props) {
	const [open, setOpen] = useState(false);
	const [chaos, setChaos] = useState(50);

	function randomizeChaos() {
		const c = Math.floor(Math.random() * 101);
		setChaos(c);
	}

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center gap-2">
				<button
					className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm hover:bg-zinc-800"
					onClick={() => setOpen((v) => !v)}
				>
					New Game
				</button>
			</div>

			{open && (
				<div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-3 w-[min(92vw,420px)]">
					<div className="text-sm text-zinc-100 font-semibold mb-2">Initialize Game</div>
					<div className="grid gap-2">
						<label className="text-xs text-zinc-300">Chaos</label>
						<div className="flex items-center gap-3">
							<input
								type="range"
								min={0}
								max={100}
								value={chaos}
								onChange={(e) => setChaos(Number(e.target.value))}
								className="flex-1"
							/>
							<span className="text-xs text-zinc-400 w-8 text-right">{chaos}</span>
							<button
								className="px-2 py-1 text-xs rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
								onClick={randomizeChaos}
							>
								Randomize
							</button>
						</div>
					</div>
					<div className="mt-3 flex justify-end gap-2">
						<button
							className="px-3 py-1.5 text-sm rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
							onClick={() => setOpen(false)}
						>
							Cancel
						</button>
						<button
							className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
							onClick={() => {
								onStart({ chaos });
								setOpen(false);
							}}
						>
							Start
						</button>
					</div>
				</div>
			)}
		</div>
	);
}


