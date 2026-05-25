import type { FC } from "hono/jsx";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { IconAlertTriangle, IconTherapy } from "../components/Icons";
import { Layout } from "../components/Layout";
import type { Therapy } from "../db/types";

export type TherapiesListProps = { therapies: Therapy[] };

export const TherapiesList: FC<TherapiesListProps> = ({ therapies }) => (
  <Layout>
    <h1>Therapies</h1>
    <Card title="Therapy catalogue" icon={IconTherapy}>
      {therapies.length === 0 ? (
        <EmptyState
          heading="No therapies yet"
          description="No therapies are available in the current catalog."
          icon={IconAlertTriangle}
        />
      ) : (
        <div class="section-grid">
          {therapies.map((therapy) => (
            <Card key={therapy.id} title={therapy.name} icon={IconTherapy}>
              <p>{therapy.description}</p>
              {therapy.instructions ? <p>{therapy.instructions}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </Card>
  </Layout>
);
