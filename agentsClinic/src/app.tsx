import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { AgentsList } from "./pages/AgentsList";
import { AgentDetail } from "./pages/AgentDetail";
import { AilmentsList } from "./pages/AilmentsList";
import { AilmentDetail } from "./pages/AilmentDetail";
import { TherapiesList } from "./pages/TherapiesList";
import { AppointmentsList } from "./pages/AppointmentsList";
import { AppointmentConfirmation } from "./pages/AppointmentConfirmation";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/Layout";
import { authMiddleware } from "./middleware/auth";
import { db } from "./db/database";
import { createVisit, getVisit, getVisitsByAgent, getVisitWithAilments, updateVisit } from "./db/visits";
import { VisitDetail } from "./pages/VisitDetail";
import { createAppointment, getAppointment, listAppointments } from "./db/appointments";
import { getDashboardCounts, getDashboardAgents, getDashboardAppointments } from "./db/dashboard";
import { triageVisit } from "./llm/triage";
import { prescribeForVisit } from "./llm/prescribe";
import type { Agent, Ailment, Therapy } from "./db/types";

export const app = new Hono();

app.use("*", logger());
app.use("/static/*", serveStatic({ root: "./" }));

// ─── Pages ──────────────────────────────────────────────────────────────────

app.get("/", (c) => c.html(<Home />));

app.get("/agents", (c) => {
  const agents = db
    .prepare("SELECT id, name, model_type, status, presenting_complaints FROM agents ORDER BY name")
    .all() as Agent[];
  return c.html(<AgentsList agents={agents} />);
});

app.get("/agents/:id", (c) => {
  const agent = db
    .prepare("SELECT id, name, model_type, status, presenting_complaints FROM agents WHERE id = ?")
    .get(c.req.param("id")) as Agent | undefined;
  if (!agent) return c.notFound();

  const ailments = db
    .prepare(
      `SELECT al.id, al.name FROM ailments al
       JOIN agent_ailments aa ON aa.ailment_id = al.id
       WHERE aa.agent_id = ? ORDER BY al.name`
    )
    .all(agent.id) as Pick<Ailment, "id" | "name">[];

  const visits = getVisitsByAgent(agent.id);

  return c.html(<AgentDetail agent={agent} ailments={ailments} visits={visits} />);
});

app.get("/ailments", (c) => {
  const ailments = db
    .prepare("SELECT id, name, description FROM ailments ORDER BY name")
    .all() as Ailment[];
  return c.html(<AilmentsList ailments={ailments} />);
});

app.get("/ailments/:id", (c) => {
  const ailment = db
    .prepare("SELECT id, name, description FROM ailments WHERE id = ?")
    .get(c.req.param("id")) as Ailment | undefined;
  if (!ailment) return c.notFound();

  const therapies = db
    .prepare(
      `SELECT t.id, t.name FROM therapies t
       JOIN ailment_therapies at2 ON at2.therapy_id = t.id
       WHERE at2.ailment_id = ? ORDER BY t.name`
    )
    .all(ailment.id) as Pick<Therapy, "id" | "name">[];

  return c.html(<AilmentDetail ailment={ailment} therapies={therapies} />);
});

app.get("/therapies", (c) => {
  const therapies = db
    .prepare("SELECT id, name, description, instructions FROM therapies ORDER BY name")
    .all() as Therapy[];
  return c.html(<TherapiesList therapies={therapies} />);
});

app.get("/visits/:id", (c) => {
  const visit = getVisitWithAilments(c.req.param("id"));
  if (!visit) return c.notFound();
  return c.html(
    <VisitDetail visit={visit} diagnosedAilments={visit.diagnosed_ailments} />
  );
});

app.get("/appointments", (c) => {
  const appointments = listAppointments();
  return c.html(<AppointmentsList appointments={appointments} />);
});

app.get("/appointments/:id", (c) => {
  const appointment = getAppointment(c.req.param("id"));
  if (!appointment) return c.notFound();
  return c.html(<AppointmentConfirmation appointment={appointment} />);
});

app.post("/appointments", async (c) => {
  const body = await c.req.parseBody();
  const agent_id = ((body.agent_id as string) ?? "").trim();
  const therapist_name = ((body.therapist_name as string) ?? "").trim();
  const scheduled_at = ((body.scheduled_at as string) ?? "").trim();
  const notes = ((body.notes as string) ?? "").trim();

  const errors: Record<string, string> = {};

  if (!therapist_name) {
    errors.therapist_name = "Therapist name is required.";
  } else if (therapist_name.length > 100) {
    errors.therapist_name = "Max 100 characters.";
  }

  if (!scheduled_at) {
    errors.scheduled_at = "Date and time is required.";
  } else {
    const dt = new Date(scheduled_at);
    if (isNaN(dt.getTime())) {
      errors.scheduled_at = "Invalid date/time format.";
    } else if (dt <= new Date()) {
      errors.scheduled_at = "Must be a future date and time.";
    }
  }

  if (notes.length > 500) {
    errors.notes = "Max 500 characters.";
  }

  const agent = db
    .prepare("SELECT id, name, model_type, status, presenting_complaints FROM agents WHERE id = ?")
    .get(agent_id) as Agent | undefined;

  if (!agent) {
    return c.html(
      <Layout>
        <h1>Bad Request</h1>
        <p>Unknown agent.</p>
      </Layout>,
      400
    );
  }

  if (Object.keys(errors).length > 0) {
    const ailments = db
      .prepare(
        `SELECT al.id, al.name FROM ailments al
         JOIN agent_ailments aa ON aa.ailment_id = al.id
         WHERE aa.agent_id = ? ORDER BY al.name`
      )
      .all(agent.id) as Pick<Ailment, "id" | "name">[];

    return c.html(
      <AgentDetail
        agent={agent}
        ailments={ailments}
        errors={errors}
        formData={{ therapist_name, scheduled_at, notes }}
      />,
      400
    );
  }

  const appointment = createAppointment({
    agent_id,
    therapist_name,
    scheduled_at,
    notes: notes || null,
  });

  return c.redirect(`/appointments/${appointment.id}`, 302);
});

app.get("/dashboard", (c) => {
  const counts = getDashboardCounts();
  const agents = getDashboardAgents();
  const appointments = getDashboardAppointments();
  return c.html(<Dashboard counts={counts} agents={agents} appointments={appointments} />);
});

// ─── API ─────────────────────────────────────────────────────────────────────

app.use("/api/*", authMiddleware);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.post("/api/visits", async (c) => {
  const body = await c.req.json<{ agent_id?: string; symptoms?: string }>();
  const { agent_id, symptoms } = body;

  if (!agent_id || !symptoms) {
    return c.json({ error: "agent_id and symptoms are required" }, 400);
  }

  const agent = db
    .prepare("SELECT id FROM agents WHERE id = ?")
    .get(agent_id) as { id: string } | undefined;

  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const visit = createVisit(agent_id, symptoms);
  return c.json({ id: visit.id, agent_id: visit.agent_id, status: visit.status }, 201);
});

app.post("/api/visits/:id/triage", async (c) => {
  const visit = getVisit(c.req.param("id"));
  if (!visit) return c.json({ error: "Visit not found" }, 404);
  if (visit.status !== "open") {
    return c.json({ error: "Visit is not in open status" }, 400);
  }

  const agent = db
    .prepare("SELECT name, model_type, presenting_complaints FROM agents WHERE id = ?")
    .get(visit.agent_id) as Pick<Agent, "name" | "model_type" | "presenting_complaints"> | undefined;

  const agentContext = agent
    ? `Name: ${agent.name}, Model: ${agent.model_type}, Prior complaints: ${agent.presenting_complaints ?? "none"}`
    : "Unknown agent";

  try {
    const result = await triageVisit(agentContext, visit.symptoms);
    updateVisit(visit.id, {
      triage_output: JSON.stringify(result),
      severity: result.severity,
      status: "triaged",
    });
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.startsWith("triage_parse_failed")) {
      return c.json({ error: "triage_parse_failed" }, 422);
    }
    throw err;
  }
});

app.post("/api/visits/:id/diagnose", async (c) => {
  const visit = getVisit(c.req.param("id"));
  if (!visit) return c.json({ error: "Visit not found" }, 404);
  if (visit.status !== "triaged") {
    return c.json({ error: "Visit must be triaged before diagnosis" }, 400);
  }

  const triage = visit.triage_output
    ? (JSON.parse(visit.triage_output) as { candidate_ailment_ids: string[] })
    : null;

  if (!triage || !triage.candidate_ailment_ids?.length) {
    return c.json({ error: "No candidate ailments from triage" }, 400);
  }

  const placeholders = triage.candidate_ailment_ids.map(() => "?").join(",");
  const confirmed = db
    .prepare(`SELECT id, name FROM ailments WHERE id IN (${placeholders})`)
    .all(...triage.candidate_ailment_ids) as Pick<Ailment, "id" | "name">[];

  updateVisit(visit.id, {
    diagnosis_ailment_ids: JSON.stringify(confirmed.map((a) => a.id)),
    status: "diagnosed",
  });

  return c.json({ diagnosed_ailments: confirmed });
});

app.post("/api/visits/:id/prescribe", async (c) => {
  const visit = getVisit(c.req.param("id"));
  if (!visit) return c.json({ error: "Visit not found" }, 404);
  if (visit.status !== "diagnosed") {
    return c.json({ error: "Visit must be diagnosed before prescription" }, 400);
  }

  const ailmentIds: string[] = visit.diagnosis_ailment_ids
    ? JSON.parse(visit.diagnosis_ailment_ids)
    : [];

  const agent = db
    .prepare("SELECT name, model_type, presenting_complaints FROM agents WHERE id = ?")
    .get(visit.agent_id) as Pick<Agent, "name" | "model_type" | "presenting_complaints"> | undefined;

  const agentContext = agent
    ? `Name: ${agent.name}, Model: ${agent.model_type}, Prior complaints: ${agent.presenting_complaints ?? "none"}`
    : "Unknown agent";

  try {
    const result = await prescribeForVisit(ailmentIds, agentContext);
    updateVisit(visit.id, {
      prescription: JSON.stringify(result),
      status: "prescribed",
    });
    return c.json({ ...result, status: "prescribed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.startsWith("prescribe_parse_failed")) {
      return c.json({ error: "prescribe_parse_failed" }, 422);
    }
    throw err;
  }
});

// ─── Error handlers ──────────────────────────────────────────────────────────

app.notFound((c) =>
  c.html(
    <Layout>
      <h1>Page Not Found</h1>
      <p>The page you were looking for does not exist.</p>
      <p>
        <a href="/">← Back to home</a>
      </p>
    </Layout>,
    404
  )
);

app.onError((err, c) => {
  console.error(err);
  return c.html(
    <Layout>
      <h1>Something Went Wrong</h1>
      <p>An unexpected error occurred. Please try again later.</p>
    </Layout>,
    500
  );
});
