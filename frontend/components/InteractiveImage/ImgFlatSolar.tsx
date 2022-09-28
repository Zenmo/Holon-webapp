export default function ImgFlatSolar() {
  return (
    <div className="relative ">
      <img
        id="grond"
        src="/imgs/Achtergrond_zonder.png"
        className="relative top-[0] left-[0]"
        alt="grond"
      ></img>
      <img
        id="flat"
        src="/imgs/FLAT_TEST_ZONDER_ZONNENPANELEN.png"
        className="absolute top-[45%] left-[45%] w-[48%]"
        alt="grond"
      ></img>
      <img
        id="solarpanel1"
        src="/imgs/zonnepanelen_blok.png"
        className="solarpanelBlock absolute top-0 left-0 opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel2"
        src="/imgs/zonnepanelen_blok_bijgesneden.png"
        className="solarpanelBlock absolute top-[11.5%] left-[56.45%] w-[10.1052632%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel3"
        src="/imgs/zonnepanelen_blok_bijgesneden.png"
        className="solarpanelBlock absolute top-[16%] left-[43%] w-[10.1052632%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel4"
        src="/imgs/zonnepanelen_blok_bijgesneden.png"
        className="solarpanelBlock absolute top-[11%] left-[47%] w-[10.1052632%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel5"
        src="/imgs/zonnepanelen_blok_bijgesneden.png"
        className="solarpanelBlock absolute top-[16%] left-[34%] w-[10.1052632%] opacity-0"
        alt="solarpanel1"
      ></img>
      <img
        id="solarpanel6"
        src="/imgs/zonnepanelen_blok_bijgesneden.png"
        className="solarpanelBlock absolute top-[6%] left-[42%] w-[10.1052632%] opacity-0"
        alt="solarpanel1"
      ></img>

      <div className="windmill absolute top-[64%] left-[5%] z-[100] w-[20%] opacity-0">
        <img
          id="windmill-pole1"
          src="/imgs/PicturePole.png"
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

      <div className="windmill absolute top-4 left-4 opacity-0">
        <img
          id="windmill-pole2"
          src="/imgs/windmill_pole.png"
          className="windmillPole relative top-[] left-0"
          alt="windmill2"
        ></img>
        <img
          id="windmill-blades2"
          src="/imgs/windmill_blades.png"
          className="windmillBlades absolute top-0 left-0"
          alt="windmill2"
        ></img>
      </div>
    </div>
  );
}
