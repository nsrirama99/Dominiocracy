"use client";

import React from "react";

export type Outcome = {
	id: string;
	icon: string; // emoji for now
	title: string;
	quote?: string;
	tags?: string[];
};

type Props = {
	outcomes: Outcome[];
};

export default function OutcomeStream({ outcomes }: Props) {
	return (
		<div className="fixed left-4 bottom-4 z-30 grid gap-2 w-80">
			{outcomes.map((o) => (
				<div key={o.id} className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 shadow-xl">
					<div className="flex items-start gap-2">
						<div className="text-lg" aria-hidden>{o.icon}</div>
						<div className="flex-1">
							<div className="text-sm text-zinc-100">{o.title}</div>
							{o.quote && <div className="text-[11px] text-zinc-400 mt-1">“{o.quote}”</div>}
							{o.tags && (
								<div className="mt-2 flex flex-wrap gap-1">
									{o.tags.map((t, i) => (
										<span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">{t}</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}


