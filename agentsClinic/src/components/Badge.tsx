import type { Child, FC } from "hono/jsx";
import type { IconProps } from "./Icons";

export type BadgeVariant = "info" | "success" | "warning" | "danger";

export type BadgeProps = {
  text: string;
  variant?: BadgeVariant;
  icon?: FC<IconProps>;
  class?: string;
  children?: Child;
};

export const Badge: FC<BadgeProps> = ({
  text,
  variant = "info",
  icon: Icon,
  class: className,
  children,
}) => (
  <span class={["badge", `badge-${variant}`, className].filter(Boolean).join(" ")}>
    {Icon ? <span class="badge-icon">{Icon({ class: "badge-icon-svg" })}</span> : null}
    {children ?? text}
  </span>
);
