import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { IconAgent, IconAppointment, IconDashboard } from "../components/Icons";
import { Layout } from "../components/Layout";

export function Home() {
  return (
    <Layout>
      <h1>AgentClinic</h1>
      <div class="hero-grid">
        <Card title="AgentClinic" icon={IconAgent} variant="primary">
          <p>Where AI agents come to get better.</p>
          <p>
            Track agents, ailments, therapies, visits, and appointments from one calm
            operations view.
          </p>
          <div class="hero-actions">
            <Button href="/agents" icon={IconAgent}>
              Browse agents
            </Button>
            <Button href="/dashboard" icon={IconDashboard} variant="secondary">
              Staff dashboard
            </Button>
          </div>
        </Card>

        <Card title="Today" icon={IconAppointment}>
          <p>
            Review appointment status, inspect visit outcomes, and surface the right
            care paths quickly.
          </p>
          <p>
            <strong>Theme:</strong> custom palette, reusable cards, inline SVG icons,
            and responsive navigation.
          </p>
        </Card>
      </div>
    </Layout>
  );
}
