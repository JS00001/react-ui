import { HTMLAttributes } from "react";
import type { ColumnAlignment } from "@/table/types";

import { styles } from "@/util";
import { TableColumnAlignment } from "@/table/const";
import { useTableThemeContext } from "@/table/context/TableThemeContext";

export type TableCellProps = HTMLAttributes<HTMLDivElement> & {
  alignment?: ColumnAlignment;
};

export default function TableCell({ alignment, style, className, children, ...props }: TableCellProps) {
  const theme = useTableThemeContext();

  const cellStyles = styles(
    { "--table-cell-hover-background-color": theme.tableCellHoverBackgroundColor },
    { "--table-cell-active-background-color": theme.tableCellActiveBackgroundColor },
    { "--table-cell-selected-background-color": theme.tableCellSelectedBackgroundColor },
    alignment && { display: "flex", alignItems: "center", textAlign: alignment },
    alignment === TableColumnAlignment.CENTER && { justifyContent: "center" },
    alignment === TableColumnAlignment.RIGHT && { justifyContent: "flex-end" },
    alignment === TableColumnAlignment.LEFT && { justifyContent: "flex-start" },
    theme.tableCellClassName,
    theme.tableCellStyles,
    className,
    style,
  );

  return (
    <div {...props} id="table-cell" className={cellStyles.className} style={cellStyles.style}>
      {typeof children === "string" ? (
        <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</p>
      ) : (
        children
      )}
    </div>
  );
}
