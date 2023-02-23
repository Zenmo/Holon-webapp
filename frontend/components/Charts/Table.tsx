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
  console.log(convertedData);

  const createFirstColumn = data => {
    return Object.keys(data[0]);
  };

  const firstColumn = createFirstColumn(convertedData);
  console.log(firstColumn);

  const headings = getHeadings(dummyData);

  const dataForTable = (data, column) => {
    const newArrayData = [];
    data.map(item => {
      Object.entries(item).forEach(([key, value]) => {
        if (key === column[0]) {
          newArrayData.push(value);
        }
      });
    });
  };

  const checkData = dataForTable(convertedData, firstColumn);
  console.log(checkData);

  return (
    <div className="flex justify-center flex-1">
      <table className="m-4 table-fixed w-full h-full">
        <thead className="border-b-2 border-holon-gray-300">
          <tr className="bg-holon-gray-100 border-r-[1px] border-holon-gray-300 text-center">
            {headings.map((heading, index) => (
              <th key={index} className="py-4">
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
                  className={`py-4 border-r-[1px] border-holon-gray-300 text-center ${createBackgroundCell(
                    val
                  )}`}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
