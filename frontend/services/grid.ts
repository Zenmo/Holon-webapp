export function getGrid(gridData: string) {
    let left = "",
      right = "";

    if (gridData === "33_66") {
      (left = "lg:w-1/3"), (right = "lg:w-2/3");
    } else if (gridData == "50_50") {
      (left = "lg:w-1/2"), (right = "lg:w-1/2");
    } else if (gridData == "66_33") {
      (left = "lg:w-2/3"), (right = "lg:w-1/3");
    }

    return {
      left: left,
      right: right,
    };
  }