import { keyBy } from "lodash";
import { dummyData } from "./dummyData";

export default function Table(data) {
  const backgroundCell = {
    pos: "bg-holon-light-green",
    neg: "bg-holon-light-red",
    neutral: "",
  };

  const createBackgroundCell = value => {
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

  const headings = getHeadings(dummyData);

  const convertGraphData = (data: Record<string, unknown>) => {
    const returnArr: unknown[] = [];
    Object.entries(data).map(value => {
      const constructObj = { ...value[1] };
      constructObj.name = value[0].replace(/['"]+/g, "");
      returnArr.push(constructObj);
    });

    return returnArr;
  };

  const convertedData = convertGraphData(dummyData);

  function valueCheck(value: number | undefined) {
    if (!value) {
      return "-";
    } else if (value >= 0) {
      return "€ " + value;
    } else if (value < 0) {
      return "-€ " + Math.abs(value);
    }
  }

  const checkData = data => {
    const firstObject = data[0];
    const keys = Object.keys(firstObject);

    const newArray = [];

    keys.forEach(key => {
      newArray.push(data.map(a => a[key]));
    });

    return newArray;
  };
  const x = checkData(convertedData);
  console.log("final data should be " + x);

  return (
    <div className="flex justify-center flex-1">
      <table className="m-4 table-fixed w-full h-full">
        <thead className="border-b-4 border-holon-gray-300">
          <tr className="bg-holon-gray-100 text-center">
            {headings.map((heading, index) => (
              <th key={index} className="py-4  border-r-2 border-holon-gray-300">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {convertedData.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map(val => (
                <td
                  key={index}
                  className={`py-4 border-r-2 border-holon-gray-300 text-center ${createBackgroundCell(
                    val
                  )}`}>
                  {valueCheck(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
