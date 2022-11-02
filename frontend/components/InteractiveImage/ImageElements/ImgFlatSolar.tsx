/* eslint-disable @next/next/no-img-element */
import FlatSolarPanels from "./FlatSolarPanels";
import Windmills from "./Windmills";

export default function ImgFlatSolar() {
  return (
    <div className="relative h-full">
      <img
        id="background"
        data-testid="background"
        src="/imgs/Achtergrond_zonder.png"
        className="relative top-[0] left-[0] z-[-5] h-full"
        alt=""
      />

      <FlatSolarPanels top="0" left="0" width="100%" />

      <div className="position-static">
        <Windmills />
      </div>
    </div>
  );
}
