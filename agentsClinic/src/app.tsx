import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";
import { AgentsList } from "./pages/AgentsList";
import { AgentDetail } from "./pages/AgentDetail";
import { AilmentsList } from "./pages/AilmentsList";
import { db } from "./db/database";
import type { Agent, Ailment } from "./db/types";

export const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(<Home />);
});

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
      `SELECT al.name FROM ailments al
       JOIN agent_ailments aa ON aa.ailment_id = al.id
       WHERE aa.agent_id = ?
       ORDER BY al.name`
    )
    .all(agent.id) as Pick<Ailment, "name">[];

  return c.html(<AgentDetail agent={agent} ailments={ailments} />);
});

app.get("/ailments", (c) => {
  const ailments = db
    .prepare("SELECT id, name, description FROM ailments ORDER BY name")
    .all() as Ailment[];
  return c.html(<AilmentsList ailments={ailments} />);
});
