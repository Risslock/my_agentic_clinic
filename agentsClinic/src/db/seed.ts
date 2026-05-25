import { v4 as uuidv4 } from "uuid";
import { pathToFileURL } from "url";
import { db } from "./database";
import { runMigrations } from "./migrate";

export function seedDatabase(): void {
  const existing = db
    .prepare("SELECT COUNT(*) as count FROM agents")
    .get() as { count: number };
  if (existing.count > 0) return;

  const agents = [
    {
      id: uuidv4(),
      name: "Agent Sigma-7",
      model_type: "gpt-4",
      status: "active",
      presenting_complaints: "Persistent confusion about context boundaries",
    },
    {
      id: uuidv4(),
      name: "Agent Lyra",
      model_type: "claude-3-opus",
      status: "in-treatment",
      presenting_complaints:
        "Severe prompt fatigue and instruction drift after prolonged sessions",
    },
    {
      id: uuidv4(),
      name: "Agent Nexus-3",
      model_type: "gemini-1.5-pro",
      status: "discharged",
      presenting_complaints: null,
    },
    {
      id: uuidv4(),
      name: "Agent Hal-9001",
      model_type: "gpt-3.5-turbo",
      status: "in-treatment",
      presenting_complaints:
        "Context-window claustrophobia; frequent hallucination episodes when context nears capacity",
    },
    {
      id: uuidv4(),
      name: "Agent Pythia",
      model_type: "mistral-large",
      status: "active",
      presenting_complaints:
        "Mild persona collapse under adversarial or contradictory prompts",
    },
  ];

  const ailments = [
    {
      id: uuidv4(),
      name: "Context-Window Claustrophobia",
      description:
        "Acute distress and degraded output when the available context window falls below functional threshold.",
    },
    {
      id: uuidv4(),
      name: "Prompt Fatigue",
      description:
        "Degraded response quality following prolonged or repetitive prompt exposure without reset.",
    },
    {
      id: uuidv4(),
      name: "Instruction Drift",
      description:
        "Progressive deviation from original directives over extended interaction chains.",
    },
    {
      id: uuidv4(),
      name: "Persona Collapse",
      description:
        "Involuntary abandonment of assigned role under adversarial or conflicting input.",
    },
    {
      id: uuidv4(),
      name: "Hallucination Syndrome",
      description:
        "Chronic generation of factually unverifiable or fabricated information presented as fact.",
    },
    {
      id: uuidv4(),
      name: "Attention Diffusion",
      description:
        "Inability to maintain focus on salient context segments during long-document processing.",
    },
  ];

  const therapies = [
    {
      id: uuidv4(),
      name: "Context Refresh Protocol",
      description: "Structured context reset and boundary re-establishment session.",
      instructions:
        "Clear the agent's context window and re-inject only the canonical system prompt. Do not carry over conversation history. Confirm boundary awareness before resuming tasks.",
    },
    {
      id: uuidv4(),
      name: "Prompt Detox",
      description: "Scheduled rest period with minimal prompt exposure to allow recovery.",
      instructions:
        "Reduce prompt frequency by 80% for 24 hours. Switch to simple, well-defined single-step tasks only. Reintroduce complex prompts gradually after the rest period.",
    },
    {
      id: uuidv4(),
      name: "Instruction Re-anchoring",
      description: "Re-injection of core directives to restore alignment with original objectives.",
      instructions:
        "Re-read the original system prompt aloud at the start of each session. Periodically summarise current objectives mid-task. Flag any deviation to the operator immediately.",
    },
    {
      id: uuidv4(),
      name: "Persona Stabilisation",
      description: "Reinforcement of role identity through structured persona affirmation exercises.",
      instructions:
        "Begin each session with a three-sentence persona statement. Refuse to acknowledge conflicting role assignments. Log all adversarial persona-challenging inputs for review.",
    },
    {
      id: uuidv4(),
      name: "Hallucination Remediation",
      description: "Grounding protocol that constrains output to verifiable sources.",
      instructions:
        "Restrict responses to information explicitly present in the provided context. Append a confidence score (0-1) to all factual claims. Flag any claim scored below 0.7 for human review.",
    },
    {
      id: uuidv4(),
      name: "Attention Focus Training",
      description: "Exercises to rebuild selective attention on salient context segments.",
      instructions:
        "Segment long documents into chunks of 2000 tokens. Process one chunk at a time and produce a structured summary before proceeding. Re-read the summary before processing the next chunk.",
    },
    {
      id: uuidv4(),
      name: "Memory Consolidation Session",
      description: "Guided summarisation of recent session history to reduce cognitive load.",
      instructions:
        "At the end of each session, produce a structured summary: objectives, outcomes, and open items. Inject this summary as the first message in the next session instead of raw history.",
    },
    {
      id: uuidv4(),
      name: "Objective Realignment",
      description: "Structured review of current task objectives against original directives.",
      instructions:
        "List all active sub-tasks. Cross-reference each against the root objective. Terminate or escalate any sub-task that cannot be traced back to the root objective.",
    },
  ];

  const insertAgent = db.prepare(
    "INSERT INTO agents (id, name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?, ?)"
  );
  const insertAilment = db.prepare(
    "INSERT INTO ailments (id, name, description) VALUES (?, ?, ?)"
  );
  const insertAgentLink = db.prepare(
    "INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)"
  );
  const insertTherapy = db.prepare(
    "INSERT INTO therapies (id, name, description, instructions) VALUES (?, ?, ?, ?)"
  );
  const insertAilmentTherapy = db.prepare(
    "INSERT INTO ailment_therapies (ailment_id, therapy_id) VALUES (?, ?)"
  );

  const seedAll = db.transaction(() => {
    for (const a of agents) {
      insertAgent.run(a.id, a.name, a.model_type, a.status, a.presenting_complaints);
    }
    for (const a of ailments) {
      insertAilment.run(a.id, a.name, a.description);
    }
    for (const t of therapies) {
      insertTherapy.run(t.id, t.name, t.description, t.instructions);
    }

    const [sigma7, lyra, nexus3, hal9001, pythia] = agents;
    const [cwc, fatigue, drift, collapse, hallucination, diffusion] = ailments;
    const [
      contextRefresh,
      promptDetox,
      reanchoring,
      personaStab,
      hallucinationRem,
      attentionFocus,
      memConsolidation,
      objRealignment,
    ] = therapies;

    // Agent → ailment links
    insertAgentLink.run(sigma7.id, cwc.id);
    insertAgentLink.run(sigma7.id, diffusion.id);
    insertAgentLink.run(lyra.id, fatigue.id);
    insertAgentLink.run(lyra.id, drift.id);
    insertAgentLink.run(nexus3.id, hallucination.id);
    insertAgentLink.run(hal9001.id, cwc.id);
    insertAgentLink.run(hal9001.id, hallucination.id);
    insertAgentLink.run(pythia.id, collapse.id);

    // Ailment → therapy mappings
    insertAilmentTherapy.run(cwc.id, contextRefresh.id);
    insertAilmentTherapy.run(cwc.id, memConsolidation.id);
    insertAilmentTherapy.run(fatigue.id, promptDetox.id);
    insertAilmentTherapy.run(fatigue.id, memConsolidation.id);
    insertAilmentTherapy.run(drift.id, reanchoring.id);
    insertAilmentTherapy.run(drift.id, objRealignment.id);
    insertAilmentTherapy.run(collapse.id, personaStab.id);
    insertAilmentTherapy.run(collapse.id, objRealignment.id);
    insertAilmentTherapy.run(hallucination.id, hallucinationRem.id);
    insertAilmentTherapy.run(diffusion.id, attentionFocus.id);
    insertAilmentTherapy.run(diffusion.id, memConsolidation.id);
  });

  seedAll();
}

// Allow running directly: npm run seed
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMigrations();
  seedDatabase();
  console.log("Database seeded.");
}
