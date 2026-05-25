import type { FC } from "hono/jsx";

export type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  value?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  class?: string;
};

export const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value = "",
  error,
  textarea = false,
  rows = 4,
  placeholder,
  required = false,
  class: className,
}) => {
  const fieldId = `field-${name}`;
  const describedBy = error ? `${fieldId}-error` : undefined;

  return (
    <div class={["form-field", className].filter(Boolean).join(" ")}>
      <label for={fieldId}>{label}</label>
      {textarea ? (
        <textarea
          id={fieldId}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
        >
          {value}
        </textarea>
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
        />
      )}
      {error ? (
        <small id={describedBy} class="field-error">
          {error}
        </small>
      ) : null}
    </div>
  );
};
