import React from "react";

const sizes = [2, 3, 4];

const tileImages = [
  "detailhandel",
  "distributie",
  "electriciteitscluster",
  "fabriekA",
  "fabriekB",
  "windmolenpark_zee",
];
3;

export default function FloorPlan() {
  const size = sizes[Math.floor(Math.random() * 3)];

  return (
    <React.Fragment>
      <div data-size={size} className="floorplan">
        {Array(Math.pow(size, 2))
          .fill(1)
          .map((i, index) => {
            const randomImage = tileImages[Math.floor(Math.random() * 6)];
            return (
              <div className={`floorplan__tile w-1/${size}`} key={index}>
                <img
                  alt={randomImage}
                  className="floorplan__img"
                  src={`img/tiles/${randomImage}.png`}
                />
              </div>
            );
          })}
      </div>
      <span className="w-1/1 w-1/2 w-1/3 w-1/4 h-1/1 h-1/2 h-1/3 h-1/4"></span>
    </React.Fragment>
  );
}
