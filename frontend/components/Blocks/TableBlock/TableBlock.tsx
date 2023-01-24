import React from "react";

type Props = {
  data: {
    id: string;
    type: string;
    value: {
      cell?: Array<string>;
      data?: [string | object];
      columnOrder?: string;
      firstColIsHeader?: boolean;
      firstRowIsTableHeader?: boolean;
      tableCaption?: string;
      table?: {
        cell: Array<string>;
        data: [string | object];
        columnOrder: string;
        firstColIsHeader: boolean;
        firstRowIsTableHeader: boolean;
        tableCaption: string;
      };
    };
  };
};

export default function Table({ data }: Props) {
  if (!data.value) {
    console.warn("empty table");
    return null;
  }

  const tableData = data.value.table ? data.value.table : data.value;

  const tablebody = tableData.firstRowIsTableHeader ? tableData.data.slice(1) : tableData.data;

  return (
    <div className="prose mx-auto max-w-full">
      <table className="mx-auto w-auto">
        {tableData.firstRowIsTableHeader && (
          <thead>
            <tr>
              {tableData.data[0].map((tabledata: string, tabledataIndex) => (
                <th key={tabledataIndex}>{typeof tabledata !== "object" && tabledata}</th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {tablebody.map((tablerow, tablerowindex) => (
            <tr key={tablerowindex}>
              {tablerow.map((tabledata: string | object, tabledataIndex: number) => (
                <React.Fragment key={tabledataIndex}>
                  {tabledataIndex === 0 && data.value.firstColIsHeader ? (
                    <th>{typeof tabledata !== "object" && tabledata}</th>
                  ) : (
                    <td>{typeof tabledata !== "object" && tabledata}</td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
        {data.value.tableCaption && <caption>{data.value.tableCaption}</caption>}
      </table>
    </div>
  );
}
