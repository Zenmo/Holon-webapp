export default function ImgFlatSolar() {
  return (
    <div className="relative">
      <img
        id="background"
        src="/imgs/Achtergrond_zonder.png"
        className="relative top-[0] left-[0] z-[-5] h-full"
        alt="achtergrond"
      />
      <img id="flat" src="/imgs/flat.png" className="absolute top-0 left-0 h-full" alt="flat"></img>
      <div className="position-static">
        <img
          id="solarpanel1"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[46.5%] left-[62.4%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel2"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[43.8%] left-[68.4%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel3"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[44.3%] left-[61.2%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel4"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[42.9%] left-[64.2%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel5"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[43.7%] left-[56.88%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel6"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[40.8%] left-[62.76%] w-[12%]"
          alt="solarpanel1"
        ></img>
      </div>
      <div className="position-static">
        <div className="windmill absolute top-[64%] left-[6%] w-[20%]">
          <img
            id="windmill-pole1"
            src="/imgs/flat_windmill_pole.png"
            className="windmillPole relative top-0 left-0 w-[80%]"
            alt="windmill1"
          ></img>
          <img
            id="windmill-blades1"
            src="/imgs/flat_windmill_blades.png"
            className={`windmillBlades absolute top-[-40%] left-[0%] w-[80%] `}
            alt="windmill1"
          ></img>
        </div>
        <div className="windmill absolute top-[69%] left-[9%] w-[20%]">
          <img
            id="windmill-pole2"
            src="/imgs/flat_windmill_pole.png"
            className="windmillPole relative top-[] left-0 w-[80%]"
            alt="windmill2"
          ></img>
          <img
            id="windmill-blades2"
            src="/imgs/flat_windmill_blades.png"
            className={`windmillBlades absolute top-[-40%] left-[0%] w-[80%] `}
            alt="windmill2"
          ></img>
        </div>

        <div className="windmill absolute top-[71%] left-[15.6%] w-[20%]">
          <img
            id="windmill-pole3"
            src="/imgs/flat_windmill_pole.png"
            className="windmillPole relative top-[] left-0 w-[80%]"
            alt="windmill2"
          ></img>
          <img
            id="windmill-blades3"
            src="/imgs/flat_windmill_blades.png"
            className={`windmillBlades absolute top-[-40%] left-[0%] w-[80%] `}
            alt="windmill2"
          ></img>
        </div>
      </div>
    </div>
  );
}
