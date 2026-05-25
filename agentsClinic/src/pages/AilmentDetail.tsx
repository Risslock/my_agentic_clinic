import type { FC } from "hono/jsx";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { IconAlertTriangle, IconAilment, IconArrowLeft, IconTherapy } from "../components/Icons";
import { Layout } from "../components/Layout";
import type { Ailment, Therapy } from "../db/types";

export type AilmentDetailProps = {
  ailment: Ailment;
  therapies: Pick<Therapy, "id" | "name">[];
};

export const AilmentDetail: FC<AilmentDetailProps> = ({ ailment, therapies }) => (
  <Layout>
    <h1>{ailment.name}</h1>
    <Card title="Overview" icon={IconAilment}>
      <p>{ailment.description}</p>
      <div class="page-actions">
        <Button href="/ailments" icon={IconArrowLeft} variant="secondary">
          All ailments
        </Button>
      </div>
    </Card>

    <Card title="Recommended therapies" icon={IconTherapy}>
      {therapies.length === 0 ? (
        <EmptyState
          heading="No therapies mapped"
          description="No therapies are linked to this ailment yet."
          icon={IconAlertTriangle}
        />
      ) : (
        <div class="section-grid">
          {therapies.map((therapy) => (
            <Badge key={therapy.id} text={therapy.name} variant="info" />
          ))}
        </div>
      )}
    </Card>
  </Layout>
);
