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

  const insertAgent = db.prepare(
    "INSERT INTO agents (id, name, model_type, status, presenting_complaints) VALUES (?, ?, ?, ?, ?)"
  );
  const insertAilment = db.prepare(
    "INSERT INTO ailments (id, name, description) VALUES (?, ?, ?)"
  );
  const insertLink = db.prepare(
    "INSERT INTO agent_ailments (agent_id, ailment_id) VALUES (?, ?)"
  );

  const seedAll = db.transaction(() => {
    for (const a of agents) {
      insertAgent.run(a.id, a.name, a.model_type, a.status, a.presenting_complaints);
    }
    for (const a of ailments) {
      insertAilment.run(a.id, a.name, a.description);
    }

    const [sigma7, lyra, nexus3, hal9001, pythia] = agents;
    const [cwc, fatigue, drift, collapse, hallucination, diffusion] = ailments;

    insertLink.run(sigma7.id, cwc.id);
    insertLink.run(sigma7.id, diffusion.id);
    insertLink.run(lyra.id, fatigue.id);
    insertLink.run(lyra.id, drift.id);
    insertLink.run(nexus3.id, hallucination.id);
    insertLink.run(hal9001.id, cwc.id);
    insertLink.run(hal9001.id, hallucination.id);
    insertLink.run(pythia.id, collapse.id);
  });

  seedAll();
}

// Allow running directly: npm run seed
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMigrations();
  seedDatabase();
  console.log("Database seeded.");
}
