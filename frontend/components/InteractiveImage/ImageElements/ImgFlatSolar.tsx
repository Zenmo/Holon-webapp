import FlatSolarPanels from "./FlatSolarPanels";
import Windmill from "./Windmill";

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
        <Windmill top="64%" left="6%" width="16%" dataTestId="windmill1" />
        <Windmill top="69%" left="9%" width="16%" dataTestId="windmill2" />
        <Windmill top="71%" left="15.6%" width="16%" />
      </div>
    </div>
  );
}
