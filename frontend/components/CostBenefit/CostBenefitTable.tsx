import { ArrowDownIcon } from "@heroicons/react/24/outline";
import styles from "./CostBenefit.module.css";
import React from "react";

export default function CostBenefitTable({ tableData }: { tableData: Array<object> }) {
  const backgroundCell = {
    pos: "bg-holon-light-green",
    neg: "bg-holon-light-red",
    neutral: "",
  };

  const createBackgroundCell = (value: number) => {
    if (value > 0) {
      return backgroundCell.pos;
    } else if (value < 0) {
      return backgroundCell.neg;
    } else {
      return backgroundCell.neutral;
    }
  };

  const getHeadings = data => {
    return Object.keys(data);
  };

  const headings = getHeadings(tableData);

  //when there are a lot of columns, show all columns more compact
  const CompactTable = headings.length > 9 ? true : false;

  function valueCheck(value: number | undefined) {
    if (!value) {
      return "-";
    } else if (value >= 0) {
      return "€ " + value;
    } else if (value < 0) {
      return "-€ " + Math.abs(value);
    }
  }

  const popUp = (labelText: number, innerText: string) => {
    return (
      <div className="relative cursor-help">
        <abbr title={innerText}>{valueCheck(labelText)}</abbr>
        <span className="text-left left-[50%] translate-x-[-50%] top-full absolute p-2 z-10 bg-holon-blue-900 border-2 border-solid text-white rounded-md border-holon-gray-300 ">
          {innerText}
        </span>
      </div>
    );
  };

  const tableCell = (titleItem: string) => {
    return (
      <>
        <td
          colSpan={CompactTable ? 2 : 1}
          className={`border-r-2 border-holon-gray-300 text-left ${
            titleItem == "Netto kosten" && ` border-t-4 `
          }`}>
          {titleItem == "Netto kosten" ? `Totaal` : titleItem}
        </td>
        {headings.map((heading, index) => {
          const tableCellValue =
            tableData[headings[index]] && tableData[headings[index]][titleItem];
          return (
            <td
              className={`border-r-2 border-holon-gray-300 text-right ${createBackgroundCell(
                tableCellValue
              )}`}
              key={index}>
              {!tableCellValue || tableCellValue == 0 || titleItem == "Netto kosten"
                ? valueCheck(tableCellValue)
                : tableCellValue < 0
                ? popUp(
                    tableCellValue,
                    ` ${heading} betaalt ${valueCheck(Math.abs(tableCellValue))} aan ${titleItem}`
                  )
                : popUp(
                    tableCellValue,
                    `${heading} ontvangt ${valueCheck(Math.abs(tableCellValue))} van ${titleItem}`
                  )}
            </td>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex justify-center flex-1 overflow-auto">
      <table
        className={`table-fixed w-full max-w-full h-full ${styles.Table} ${
          CompactTable && styles.CompactTable
        }`}>
        <thead className="border-b-4 border-holon-gray-300">
          <tr className="bg-holon-gray-100 text-left">
            <th colSpan={CompactTable ? 2 : 1} className="border-r-2 border-holon-gray-300">
              <span className="flex align-items-center gap-2">
                Transactie met
                <span className="flex-[0_0_20px]">
                  <ArrowDownIcon />
                </span>
              </span>
            </th>
            {headings.map((heading, index) => (
              <th key={index} className="border-r-2 border-holon-gray-300">
                <span>{heading}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>{tableCell("Afschrijving")}</tr>
          {headings.map((heading, index) => (
            <tr key={index}>{tableCell(heading)}</tr>
          ))}
        </tbody>
        <tfoot>
          <tr>{tableCell("Netto kosten")}</tr>
        </tfoot>
      </table>
    </div>
  );
}
