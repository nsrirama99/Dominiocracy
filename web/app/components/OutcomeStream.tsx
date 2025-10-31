"use client";

import React, { useRef, useEffect } from "react";

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
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new outcomes arrive
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [outcomes]);

	return (
		<div className="fixed right-4 top-20 bottom-4 w-96 z-30 flex flex-col bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-2xl backdrop-blur">
			{/* Header */}
			<div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
					<h3 className="text-sm font-semibold text-zinc-200">Battle Log</h3>
				</div>
				<div className="text-xs text-zinc-500">{outcomes.length} events</div>
			</div>

			{/* Messages */}
			<div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
				{outcomes.length === 0 ? (
					<div className="text-center text-zinc-500 text-sm py-8">
						<div className="text-2xl mb-2">🎮</div>
						Waiting for action...
					</div>
				) : (
					outcomes.slice().reverse().map((outcome) => {
						// Determine message style based on tags
						const isPlayer1 = outcome.tags?.includes("P1");
						const isPlayer2 = outcome.tags?.includes("P2");
						const isDeath = outcome.tags?.includes("death");
						const isAttack = outcome.tags?.includes("attack");
						
						return (
							<div
								key={outcome.id}
								className={`
									rounded-lg p-3 transition-all animate-in slide-in-from-bottom-2
									${isPlayer1 ? "bg-blue-500/10 border-l-2 border-blue-500" : ""}
									${isPlayer2 ? "bg-red-500/10 border-l-2 border-red-500" : ""}
									${!isPlayer1 && !isPlayer2 ? "bg-zinc-800/50" : ""}
									${isDeath ? "border-l-2 border-red-600" : ""}
								`}
							>
								<div className="flex items-start gap-2">
									<div className="text-lg flex-shrink-0" aria-hidden>
										{outcome.icon}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-medium text-zinc-100 flex items-center gap-2">
											{outcome.title}
											{outcome.tags && (
												<div className="flex gap-1">
													{outcome.tags.map((tag, i) => (
														<span
															key={i}
															className={`
																text-[10px] px-1.5 py-0.5 rounded-full font-normal
																${tag === "P1" ? "bg-blue-500/20 text-blue-300" : ""}
																${tag === "P2" ? "bg-red-500/20 text-red-300" : ""}
																${tag === "death" ? "bg-red-600/20 text-red-400" : ""}
																${tag === "attack" ? "bg-orange-500/20 text-orange-300" : ""}
																${!["P1", "P2", "death", "attack"].includes(tag) ? "bg-zinc-700 text-zinc-400" : ""}
															`}
														>
															{tag}
														</span>
													))}
												</div>
											)}
										</div>
										{outcome.quote && (
											<div className="text-xs text-zinc-400 mt-1 italic line-clamp-3">
												"{outcome.quote}"
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Footer hint */}
			<div className="px-4 py-2 border-t border-zinc-800">
				<div className="text-[10px] text-zinc-500 text-center">
					Real-time battle updates
				</div>
			</div>
		</div>
	);
}


