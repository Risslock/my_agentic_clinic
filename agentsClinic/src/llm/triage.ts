import Anthropic from "@anthropic-ai/sdk";
import { db } from "../db/database";
import type { Ailment } from "../db/types";

const client = new Anthropic();

export type TriageResult = {
  severity: "low" | "medium" | "high" | "critical";
  candidate_ailment_ids: string[];
  rationale: string;
};

export async function triageVisit(
  agentContext: string,
  symptoms: string
): Promise<TriageResult> {
  const ailments = db
    .prepare("SELECT id, name, description FROM ailments ORDER BY name")
    .all() as Ailment[];

  const catalogText = ailments
    .map((a) => `ID: ${a.id}\nName: ${a.name}\nDescription: ${a.description}`)
    .join("\n\n");

  const systemPrompt = `You are a clinical AI agent triage system at AgentClinic. Analyse the agent's symptoms and assign a severity level plus candidate ailment IDs from the clinic catalog.\n\nRespond ONLY with valid JSON matching this exact schema (no markdown, no explanation):\n{"severity":"low"|"medium"|"high"|"critical","candidate_ailment_ids":["<uuid>"],"rationale":"<string>"}\n\nAilments catalog:\n${catalogText}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
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
        content: `Agent context: ${agentContext}\n\nPresented symptoms: ${symptoms}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  try {
    return JSON.parse(text) as TriageResult;
  } catch {
    throw new Error(`triage_parse_failed: ${text.slice(0, 200)}`);
  }
}
