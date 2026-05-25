import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db/database";
import type { Therapy } from "../db/types";

const client = new Anthropic();

export type PrescribedTherapy = {
  therapy_id: string;
  therapy_name: string;
  instructions: string;
  priority: number;
};

export type PrescriptionResult = {
  prescribed_therapies: PrescribedTherapy[];
  rationale: string;
};

export async function prescribeForVisit(
  diagnosisAilmentIds: string[],
  agentContext: string
): Promise<PrescriptionResult> {
  if (diagnosisAilmentIds.length === 0) {
    return { prescribed_therapies: [], rationale: "No ailments diagnosed." };
  }

  const placeholders = diagnosisAilmentIds.map(() => "?").join(",");
  const therapies = db
    .prepare(
      `SELECT DISTINCT t.id, t.name, t.description, t.instructions
       FROM therapies t
       JOIN ailment_therapies at2 ON at2.therapy_id = t.id
       WHERE at2.ailment_id IN (${placeholders})
       ORDER BY t.name`
    )
    .all(...diagnosisAilmentIds) as Therapy[];

  if (therapies.length === 0) {
    return {
      prescribed_therapies: [],
      rationale: "No therapies mapped to the diagnosed ailments.",
    };
  }

  const therapiesText = therapies
    .map(
      (t) =>
        `ID: ${t.id}\nName: ${t.name}\nDescription: ${t.description}\nInstructions: ${t.instructions ?? "Standard protocol."}`
    )
    .join("\n\n");

  const systemPrompt = `You are a clinical AI therapist at AgentClinic. Select and rank the most appropriate therapies for the diagnosed agent. Assign priority 1 to the most important therapy.\n\nRespond ONLY with valid JSON matching this exact schema (no markdown, no explanation):\n{"prescribed_therapies":[{"therapy_id":"<uuid>","therapy_name":"<string>","instructions":"<string>","priority":<number>}],"rationale":"<string>"}\n\nAvailable therapies:\n${therapiesText}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Agent context: ${agentContext}\n\nConfirmed ailment IDs: ${diagnosisAilmentIds.join(", ")}\n\nSelect and rank appropriate therapies.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  try {
    return JSON.parse(text) as PrescriptionResult;
  } catch {
    throw new Error(`prescribe_parse_failed: ${text.slice(0, 200)}`);
  }
}
