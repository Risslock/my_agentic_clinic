import { FC } from "hono/jsx";
import {
  IconAgent,
  IconAilment,
  IconAppointment,
  IconDashboard,
  IconMenu,
  IconTherapy,
  IconX,
} from "./Icons";

export const Header: FC = () => (
  <header>
    <div class="site-header">
      <div class="site-brand">
        <a href="/" class="brand-link">
          <span class="brand-mark">A</span>
          <span>AgentClinic</span>
        </a>
      </div>

      <input type="checkbox" id="nav-toggle" class="nav-toggle-input" />
      <label for="nav-toggle" class="nav-toggle-button" aria-label="Toggle navigation">
        <span class="nav-toggle-icon-open">{IconMenu({ class: "icon" })}</span>
        <span class="nav-toggle-icon-close">{IconX({ class: "icon" })}</span>
        <span class="sr-only">Toggle navigation</span>
      </label>

      <nav>
        <ul>
          <li>
            <a href="/agents">{IconAgent({ class: "icon" })}Agents</a>
          </li>
          <li>
            <a href="/ailments">{IconAilment({ class: "icon" })}Ailments</a>
          </li>
          <li>
            <a href="/therapies">{IconTherapy({ class: "icon" })}Therapies</a>
          </li>
          <li>
            <a href="/appointments">{IconAppointment({ class: "icon" })}Appointments</a>
          </li>
          <li>
            <a href="/dashboard">{IconDashboard({ class: "icon" })}Dashboard</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);
