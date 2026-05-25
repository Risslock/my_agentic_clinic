import type { FC } from "hono/jsx";
import type { Agent } from "../db/types";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { IconAgent } from "../components/Icons";
import { Layout } from "../components/Layout";
import { Table } from "../components/Table";

export type AgentsListProps = { agents: Agent[] };

const statusVariant = (status: Agent["status"]) => {
  if (status === "active") return "success";
  if (status === "in-treatment") return "warning";
  return "info";
};

export const AgentsList: FC<AgentsListProps> = ({ agents }) => (
  <Layout>
    <h1>Agents</h1>
    <Card title="Current agents" icon={IconAgent}>
      <Table
        columns={["Name", "Model", "Status"]}
        rows={agents.map((agent) => ({
          Name: <a href={`/agents/${agent.id}`}>{agent.name}</a>,
          Model: agent.model_type,
          Status: <Badge text={agent.status} variant={statusVariant(agent.status)} />,
        }))}
        emptyMessage="No agents are currently registered."
      />
    </Card>
  </Layout>
);
