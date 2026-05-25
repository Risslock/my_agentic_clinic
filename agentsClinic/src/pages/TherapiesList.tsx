import type { FC } from "hono/jsx";
import type { Therapy } from "../db/types";
import { Layout } from "../components/Layout";

export type TherapiesListProps = { therapies: Therapy[] };

export const TherapiesList: FC<TherapiesListProps> = ({ therapies }) => (
  <Layout>
    <h1>Therapies</h1>
    {therapies.length === 0 ? (
      <p>No therapies on record.</p>
    ) : (
      <dl>
        {therapies.map((t) => (
          <>
            <dt>
              <strong>{t.name}</strong>
            </dt>
            <dd>{t.description}</dd>
          </>
        ))}
      </dl>
    )}
  </Layout>
);
