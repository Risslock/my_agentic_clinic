import type { Child, FC } from "hono/jsx";

export type TableCell = Child;
export type TableRow = Record<string, TableCell>;

export type TableProps = {
  columns: string[];
  rows: TableRow[];
  emptyMessage?: string;
  class?: string;
};

export const Table: FC<TableProps> = ({
  columns,
  rows,
  emptyMessage = "No records.",
  class: className,
}) => {
  const classes = ["table-wrap", className].filter(Boolean).join(" ");

  return (
    <div class={classes}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>{row[column] ?? "—"}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
