import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import type { Unit, Intent } from "@/app/types/unit";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

type InterpretRequest = {
    order: string;
    units: Unit[];
    playerId: 1 | 2;
    chaos: number;
};

export async function POST(req: NextRequest) {
    try {
        const { order, units, playerId, chaos }: InterpretRequest = await req.json();

        if (!order || !units || units.length === 0) {
            return NextResponse.json(
                { error: "Missing order or units" },
                { status: 400 }
            );
        }

        // Build the prompt for Gemini
        const unitDescriptions = units.map(u =>
            `Unit ${u.id}: ${u.name} (${u.class}) - Quirks: ${u.quirks.join(", ")} - Stats: Discipline ${u.stats.discipline}, Morale ${u.stats.morale}`
        ).join("\n");

        const prompt = `You are interpreting military orders for incompetent soldiers in a comedic strategy game called "Dominiocracy".

GAME CONTEXT:
- Chaos Level: ${chaos}/100 (higher = more misinterpretation)
- Player ${playerId} just gave this order: "${order}"

UNITS RECEIVING THE ORDER:
${unitDescriptions}

YOUR TASK:
Each unit will interpret the order through their own quirks and incompetence. Generate a JSON array with one interpretation per unit. Each interpretation should include:
1. "unitId": the unit's ID
2. "interpretation": A 1-2 sentence description of what THIS SPECIFIC UNIT thinks they should do (often hilariously wrong, influenced by their quirks)
3. "targetPosition": Where they think they should go {x: 0-600, y: 0-400}
4. "action": one of: "move", "attack", "defend", "build", "retreat", "confused"
5. "priority": 0-100 how urgent they think this is

IMPORTANT RULES:
- Units with "coffee-curious" quirk might interpret orders to involve coffee somehow
- Units with "fire-enthusiast" quirk want to set things on fire
- "easily-distracted" units might get sidetracked
- "overly-literal" units take everything literally
- "rebel" units might do the opposite
- "kiss-ass" units over-comply
- "paranoid" units see threats everywhere
- Low discipline units misunderstand more
- High chaos increases misinterpretation
- Make it funny but still somewhat related to the original order
- targetPosition should vary between units (don't send everyone to the same spot)

Respond with ONLY a valid JSON array, no other text.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
        });

        const text = response.text?.trim() || "";

        // Try to extract JSON if wrapped in markdown
        let jsonText = text;
        if (text.includes("```json")) {
            const match = text.match(/```json\n([\s\S]*?)\n```/);
            if (match) jsonText = match[1];
        } else if (text.includes("```")) {
            const match = text.match(/```\n([\s\S]*?)\n```/);
            if (match) jsonText = match[1];
        }

        const intents: Intent[] = JSON.parse(jsonText);

        return NextResponse.json({ intents });
    } catch (error: any) {
        console.error("Gemini interpretation error:", error);
        return NextResponse.json(
            { error: "Failed to interpret order", details: error.message },
            { status: 500 }
        );
    }
}

