import type { Child, FC } from "hono/jsx";
import type { IconProps } from "./Icons";

export type EmptyStateProps = {
  heading: string;
  description: string;
  icon: FC<IconProps>;
  action?: Child;
  class?: string;
};

export const EmptyState: FC<EmptyStateProps> = ({
  heading,
  description,
  icon: Icon,
  action,
  class: className,
}) => (
  <div class={["empty-state", className].filter(Boolean).join(" ")}>
    <div class="empty-state-icon">{Icon({ class: "empty-state-icon-svg" })}</div>
    <h2>{heading}</h2>
    <p>{description}</p>
    {action ? <div class="empty-state-action">{action}</div> : null}
  </div>
);
