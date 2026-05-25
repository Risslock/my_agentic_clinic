import type { FC } from "hono/jsx";

export type IconProps = {
  class?: string;
  title?: string;
};

const iconClass = (className?: string) => className ?? "icon";

const commonProps = (className?: string) => ({
  class: iconClass(className),
  fill: "none",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const IconAgent: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);

export const IconAilment: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 3 6 8.5v7L12 21l6-5.5v-7Z" />
    <path d="M9 11h6" />
  </svg>
);

export const IconTherapy: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 21c4.5-4.5 7-7.5 7-10.5A7 7 0 0 0 5 10.5C5 13.5 7.5 16.5 12 21Z" />
  </svg>
);

export const IconAppointment: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M7 12h10" />
    <path d="M7 16h6" />
  </svg>
);

export const IconDashboard: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="3" rx="1" />
    <rect x="13" y="9" width="7" height="11" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
  </svg>
);

export const IconCalendar: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M4 10h16" />
  </svg>
);

export const IconSeverityLow: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <circle cx="12" cy="12" r="8" />
  </svg>
);

export const IconSeverityMedium: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

export const IconSeverityHigh: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 4 4 18h16Z" />
  </svg>
);

export const IconSeverityCritical: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 4 4 18h16Z" />
    <path d="M12 9v4" />
    <path d="M12 16h.01" />
  </svg>
);

export const IconArrowLeft: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="m12 19-7-7 7-7" />
    <path d="M5 12h14" />
  </svg>
);

export const IconMenu: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
);

export const IconX: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export const IconCheck: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const IconAlertTriangle: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="m10.5 3.5 10 17.5H.5L10.5 3.5Z" />
    <path d="M10.5 9v4" />
    <path d="M10.5 16h.01" />
  </svg>
);

export const IconSearch: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconPlus: FC<IconProps> = ({ class: className }) => (
  <svg {...commonProps(className)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export type IconName =
  | "agent"
  | "ailment"
  | "therapy"
  | "appointment"
  | "dashboard"
  | "calendar"
  | "severity-low"
  | "severity-medium"
  | "severity-high"
  | "severity-critical"
  | "arrow-left"
  | "menu"
  | "x"
  | "check"
  | "alert-triangle"
  | "search"
  | "plus";

const iconMap: Record<IconName, FC<IconProps>> = {
  agent: IconAgent,
  ailment: IconAilment,
  therapy: IconTherapy,
  appointment: IconAppointment,
  dashboard: IconDashboard,
  calendar: IconCalendar,
  "severity-low": IconSeverityLow,
  "severity-medium": IconSeverityMedium,
  "severity-high": IconSeverityHigh,
  "severity-critical": IconSeverityCritical,
  "arrow-left": IconArrowLeft,
  menu: IconMenu,
  x: IconX,
  check: IconCheck,
  "alert-triangle": IconAlertTriangle,
  search: IconSearch,
  plus: IconPlus,
};

export function icon(name: IconName, props?: IconProps) {
  return iconMap[name](props ?? {});
}
