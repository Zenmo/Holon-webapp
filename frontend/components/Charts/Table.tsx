import { Popover } from "@headlessui/react";
import { dummyData } from "./dummyData";

export default function Table(data) {
  const backgroundCell = {
    pos: "bg-holon-light-green",
    neg: "bg-holon-light-red",
    neutral: "",
    tfoot: "border-t-4",
  };

  const createBackgroundCell = (value, titleItem) => {
    if (titleItem == "Netto kosten") {
      return backgroundCell.tfoot;
    } else if (value > 0 || titleItem == "Netto kosten") {
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

  const headings = getHeadings(dummyData);

  function valueCheck(value: number | undefined) {
    if (!value) {
      return "-";
    } else if (value >= 0) {
      return "€ " + value;
    } else if (value < 0) {
      return "-€ " + Math.abs(value);
    }
  }

  const tableCell = titleItem => {
    return (
      <>
        <td
          className={`p-4 border-r-2 border-holon-gray-300 text-left ${
            titleItem == "Netto kosten" && ` border-t-4 `
          }`}>
          {titleItem}
        </td>
        {headings.map((heading, index) => {
          const tableCellValue =
            dummyData[headings[index]] && dummyData[headings[index]][titleItem];
          return (
            <td
              className={`p-4 border-r-2 border-holon-gray-300 text-right ${createBackgroundCell(
                tableCellValue,
                titleItem
              )}`}
              key={index}>
              {!tableCellValue || tableCellValue == 0 || titleItem == "Netto kosten" ? (
                valueCheck(tableCellValue)
              ) : (
                <Popover className="relative inline">
                  <Popover.Button>{valueCheck(tableCellValue)}</Popover.Button>
                  <Popover.Panel className="text-left left-[50%] translate-x-[-50%] absolute p-2 z-10 bg-white border-2 border-solid rounded-md border-holon-gray-300 ">
                    {tableCellValue < 0 ? (
                      <span>
                        {heading} betaalt {valueCheck(Math.abs(tableCellValue))} aan {titleItem}
                      </span>
                    ) : (
                      <span>
                        {heading} ontvangt {valueCheck(Math.abs(tableCellValue))} van {titleItem}
                      </span>
                    )}
                  </Popover.Panel>
                </Popover>
              )}
            </td>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex justify-center flex-1">
      <table className="m-4 table-fixed w-full h-full">
        <thead className="border-b-4 border-holon-gray-300">
          <tr className="bg-holon-gray-100 text-left">
            <th className="p-4 border-r-2 border-holon-gray-300">Transactie met ↓</th>
            {headings.map((heading, index) => (
              <th key={index} className="px-4 border-r-2 border-holon-gray-300">
                {heading}
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
