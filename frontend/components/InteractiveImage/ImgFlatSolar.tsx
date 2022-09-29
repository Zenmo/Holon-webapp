export default function ImgFlatSolar() {
  return (
    <div className="relative h-5/6">
      <img
        id="background"
        src="/imgs/Achtergrond_zonder.png"
        className="relative top-[0] left-[0] z-[-5] h-full"
        alt="achtergrond"
      ></img>
      <img id="flat" src="/imgs/flat.png" className="absolute top-0 left-0 h-full" alt="flat"></img>
      <img
        id="solarpanel1"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[46.5%] left-[52%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel2"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[43.8%] left-[57%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel3"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[44.3%] left-[51%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel4"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[42.9%] left-[53.5%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel5"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[43.7%] left-[47.4%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel6"
        src="/imgs/flat_solarpanels_block.png"
        className="solarpanelBlock absolute top-[40.8%] left-[52.3%] w-[10%] opacity-0"
        alt="solarpanel1"
      ></img>

      <div className="windmill absolute top-[64%] left-[5%] w-[20%] opacity-0">
        <img
          id="windmill-pole1"
          src="/imgs/flat_windmill_pole.png"
          className="windmillPole relative top-0 left-0 w-[80%]"
          alt="windmill1"
        ></img>
        <img
          id="windmill-blades1"
          src="/imgs/Picture4.png"
          className="windmillBlades animate-spinWindmil absolute top-[-47.5%] left-[9%] w-[80%]"
          alt="windmill1"
        ></img>
      </div>

      <div className="windmill absolute top-[69%] left-[7.5%] w-[20%] opacity-0">
        <img
          id="windmill-pole2"
          src="/imgs/flat_windmill_pole.png"
          className="windmillPole relative top-[] left-0 w-[80%]"
          alt="windmill2"
        ></img>
        <img
          id="windmill-blades2"
          src="/imgs/windmill_blades.png"
          className="windmillBlades absolute top-0 left-0 w-[80%]"
          alt="windmill2"
        ></img>
      </div>

      <div className="windmill absolute top-[71%] left-[13%] w-[20%] opacity-0">
        <img
          id="windmill-pole3"
          src="/imgs/flat_windmill_pole.png"
          className="windmillPole relative top-[] left-0 w-[80%]"
          alt="windmill2"
        ></img>
        <img
          id="windmill-blades3"
          src="/imgs/windmill_blades.png"
          className="windmillBlades absolute top-0 left-0 w-[80%]"
          alt="windmill2"
        ></img>
      </div>
    </div>
  );
}
