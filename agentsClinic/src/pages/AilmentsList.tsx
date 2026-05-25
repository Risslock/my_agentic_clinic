import type { FC } from "hono/jsx";
import type { Ailment } from "../db/types";
import { Layout } from "../components/Layout";

export type AilmentsListProps = { ailments: Ailment[] };

export const AilmentsList: FC<AilmentsListProps> = ({ ailments }) => (
  <Layout>
    <h1>Ailments</h1>
    <dl>
      {ailments.map((a) => (
        <>
          <dt key={a.id}>
            <strong>{a.name}</strong>
          </dt>
          <dd>{a.description}</dd>
        </>
      ))}
    </dl>
  </Layout>
);
