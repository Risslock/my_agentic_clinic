import type { Child, FC } from "hono/jsx";
import type { IconProps } from "./Icons";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children?: Child;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: FC<IconProps>;
  type?: "button" | "submit" | "reset";
  class?: string;
};

export const Button: FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  class: className,
}) => {
  const classes = ["button", `button-${variant}`, `button-${size}`, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon ? <span class="button-icon">{Icon({ class: "button-icon-svg" })}</span> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} class={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} class={classes}>
      {content}
    </button>
  );
};
