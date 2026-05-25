import type { Child, FC } from "hono/jsx";
import type { IconProps } from "./Icons";

export type CardVariant = "default" | "primary" | "danger";

export type CardProps = {
  title?: string;
  icon?: FC<IconProps>;
  variant?: CardVariant;
  class?: string;
  children?: Child;
};

export const Card: FC<CardProps> = ({
  title,
  icon: Icon,
  variant = "default",
  class: className,
  children,
}) => {
  const classes = ["card", variant !== "default" ? `card-${variant}` : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <article class={classes}>
      {(title || Icon) && (
        <div class="card-header">
          {Icon ? <span class="card-icon">{Icon({ class: "card-icon-svg" })}</span> : null}
          {title ? <h2>{title}</h2> : null}
        </div>
      )}
      <div class="card-body">{children}</div>
    </article>
  );
};
