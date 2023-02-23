import { dummyData } from "./dummyData";

export default function Table(data) {
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
    <div>
      <table>
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {convertedData.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map(val => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
  /*}
            <tr key={index}>
              {Object.values(item).map(val => (
                <td key={`cell-${val}`}>{val}</td>
              ))}
            </tr>
              */
}
