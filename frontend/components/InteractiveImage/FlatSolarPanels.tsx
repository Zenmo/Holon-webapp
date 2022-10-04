interface Props {
  top?: string;
  left?: string;
  width?: string;
  dataTestId?: string;
}

export default function FlatSolarPanels({ top, left, width, dataTestId }: Props) {
  return (
    <div
      className={`flatSolarpanels ${top ? top : ""} ${left ? left : ""} ${width ? width : ""}`}
      data-testid={dataTestId ? dataTestId : ""}
    >
      <img id="flat" src="/imgs/flat.png" className="absolute top-0 left-0 h-full" alt="flat"></img>
      <div className="position-static">
        <img
          id="solarpanel1"
          data-testid="solarpanel1"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[46.5%] left-[62.4%] w-[12%]"
          alt="solarpanel1"
        ></img>
        <img
          id="solarpanel2"
          data-testid="solarpanel2"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[43.8%] left-[68.4%] w-[12%]"
          alt="solarpanel2"
        ></img>
        <img
          id="solarpanel3"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[44.3%] left-[61.2%] w-[12%]"
          alt="solarpanel3"
        ></img>
        <img
          id="solarpanel4"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[42.9%] left-[64.2%] w-[12%]"
          alt="solarpanel4"
        ></img>
        <img
          id="solarpanel5"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[43.7%] left-[56.88%] w-[12%]"
          alt="solarpanel5"
        ></img>
        <img
          id="solarpanel6"
          src="/imgs/flat_solarpanels_block.png"
          className="solarpanelBlock absolute top-[40.8%] left-[62.76%] w-[12%]"
          alt="solarpanel6"
        ></img>
      </div>
    </div>
  );
}
