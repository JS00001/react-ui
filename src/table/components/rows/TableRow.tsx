import { Children, cloneElement, isValidElement } from "react";

import type { TableRowData } from "@/table/types";
import type { TableCellProps } from "@/table/components/cells/TableCell";
import type { HTMLAttributes, AnchorHTMLAttributes, MouseEvent, MouseEventHandler } from "react";

import { compute, styles } from "@/util";
import TableCell from "@/table/components/cells/TableCell";
import { useTableContext } from "@/table/context/TableContext";
import { useTableThemeContext } from "@/table/context/TableThemeContext";
import TableSelectionCheckbox from "@/table/components/cells/TableSelectionCheckbox";

type BaseRowProps<DataType extends TableRowData> = {
  row: DataType;
  compact?: boolean;
};

type DivRowProps<DataType extends TableRowData> = BaseRowProps<DataType> &
  Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    href?: never;
    onClick?: MouseEventHandler<HTMLDivElement>;
  };

type LinkRowProps<DataType extends TableRowData> = BaseRowProps<DataType> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
    href: string;
    onClick?: never;
  };

export type TableRowProps<DataType extends TableRowData> = DivRowProps<DataType> | LinkRowProps<DataType>;

export default function TableRow<DataType extends TableRowData>(props: TableRowProps<DataType>) {
  const table = useTableContext();
  const theme = useTableThemeContext();
  const { href, compact, style, className, children, onClick } = props;

  const isClickable = !!(href || onClick);
  const isSelected = table.selectedIds.includes(props.row.id);
  const isSelectable = !compact && table.selectionEnabled;

  const largeContainerStyles = styles(
    { display: "contents" },
    isSelected && "sencorp-table-row-selected",
    isClickable && { cursor: "pointer" },
    className,
    style,
  );

  const compactContainerStyles = styles(
    { display: "flex", flexDirection: "column" },
    "sencorp-table-row-compact",
    { "--table-cell-hover-background-color": theme.tableCellHoverBackgroundColor },
    { "--table-cell-active-background-color": theme.tableCellActiveBackgroundColor },
    isClickable && { cursor: "pointer" },
    theme.tableCellClassName,
    theme.tableCellStyles,
    className,
    style,
  );

  const containerStyles = compact ? compactContainerStyles : largeContainerStyles;

  const handleRowSelection = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    table.toggleRowSelection(props.row.id, event.shiftKey);
  };

  // Add the alignment props to each table cell, based on the index of the cell and the alignment of its column
  const alignedChildren = compute(() => {
    if (compact) return children;

    return Children.toArray(children).map((child, index) => {
      if (!isValidElement<TableCellProps>(child)) return child;

      const alignment = table.columns[index + (table.selectionEnabled ? 1 : 0)]?.alignment;
      if (!alignment) return child;

      return cloneElement(child, { alignment: child.props.alignment ?? alignment });
    });
  });

  const SelectionCheckbox = (
    <TableCell alignment="center" onClick={handleRowSelection}>
      <TableSelectionCheckbox value={isSelected} onClick={handleRowSelection} />
    </TableCell>
  );

  if (props.href !== undefined) {
    const { row, href, compact, style, className, children, onClick, ...anchorProps } = props;

    return (
      <a {...anchorProps} id="table-row" href={href} className={containerStyles.className} style={containerStyles.style}>
        {isSelectable && SelectionCheckbox}
        {alignedChildren}
      </a>
    );
  }

  const divProps = { ...props } as HTMLAttributes<HTMLDivElement>;
  const divOnClick = onClick as MouseEventHandler<HTMLDivElement> | undefined;

  return (
    <div {...divProps} id="table-row" className={containerStyles.className} style={containerStyles.style} onClick={divOnClick}>
      {isSelectable && SelectionCheckbox}
      {alignedChildren}
    </div>
  );
}
