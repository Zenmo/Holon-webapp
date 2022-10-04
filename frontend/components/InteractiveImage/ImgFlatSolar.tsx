import FlatSolarPanels from "./FlatSolarPanels";
import Windmill from "./Windmill";

export default function ImgFlatSolar() {
  return (
    <div className="relative">
      <img
        id="background"
        data-testid="background"
        src="/imgs/Achtergrond_zonder.png"
        className="relative top-[0] left-[0] z-[-5] h-full"
        alt="achtergrond"
      />

      <FlatSolarPanels top="top-0" left="left-0" width="h-full" />

      <div className="position-static">
        <Windmill top="top-[64%]" left="left-[6%]" width="w-[16%]" dataTestId="windmill1" />
        <Windmill top="top-[69%]" left="left-[9%]" width="w-[16%]" dataTestId="windmill2" />
        <Windmill top="top-[71%]" left="left-[15.6%]" width="w-[16%]" />
      </div>
    </div>
  );
}
