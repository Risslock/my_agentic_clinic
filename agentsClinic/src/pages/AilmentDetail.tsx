import type { FC } from "hono/jsx";
import type { Ailment, Therapy } from "../db/types";
import { Layout } from "../components/Layout";

export type AilmentDetailProps = {
  ailment: Ailment;
  therapies: Pick<Therapy, "id" | "name">[];
};

export const AilmentDetail: FC<AilmentDetailProps> = ({ ailment, therapies }) => (
  <Layout>
    <h1>{ailment.name}</h1>
    <p>{ailment.description}</p>
    <h2>Recommended Therapies</h2>
    {therapies.length === 0 ? (
      <p>No therapies mapped to this ailment.</p>
    ) : (
      <ul>
        {therapies.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    )}
    <p>
      <a href="/ailments">← All Ailments</a>
    </p>
  </Layout>
);
