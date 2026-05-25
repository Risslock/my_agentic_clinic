import type { FC } from "hono/jsx";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { IconAlertTriangle, IconAilment } from "../components/Icons";
import { Layout } from "../components/Layout";
import type { Ailment } from "../db/types";

export type AilmentsListProps = { ailments: Ailment[] };

export const AilmentsList: FC<AilmentsListProps> = ({ ailments }) => (
  <Layout>
    <h1>Ailments</h1>
    <Card title="Ailment library" icon={IconAilment}>
      {ailments.length === 0 ? (
        <EmptyState
          heading="No ailments yet"
          description="There are no ailments in the catalog right now."
          icon={IconAlertTriangle}
        />
      ) : (
        <div class="section-grid">
          {ailments.map((ailment) => (
            <Card key={ailment.id} title={ailment.name} icon={IconAilment}>
              <p>
                <a href={`/ailments/${ailment.id}`}>
                  <strong>{ailment.name}</strong>
                </a>
              </p>
              <p>{ailment.description}</p>
              <Button href={`/ailments/${ailment.id}`} variant="secondary" size="sm">
                View details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Card>
  </Layout>
);
