import { FC } from "hono/jsx";

export const Header: FC = () => (
  <header>
    <a href="/">AgentClinic</a>
    <nav>
      <ul>
        <li><a href="/agents">Agents</a></li>
        <li><a href="/ailments">Ailments</a></li>
      </ul>
    </nav>
  </header>
);
