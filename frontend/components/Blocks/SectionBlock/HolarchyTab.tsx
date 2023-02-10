import tile from "../../../public/img/tiles/distributie.png";
type HolarchyTabProps = {};

export default function HolarchyTab(images) {
  return (
    <div className="h-screen">
      <div className="bg-white fixed top-24 h-screen w-screen z-10 mt-14 grid grid-cols-3 grid-rows-3 py-12 px-10 lg:px-16 lg:pt-16">
        {/*National level*/}
        {/*National interactive input */}
        <div className="overflow-auto">
          <p>Nationaal interactive input</p>
        </div>

        {/*image */}
        <div>
          {/* eslint-disable @next/next/no-img-element */}
          {tile}
        </div>

        {/*National KPIs */}
        <div>
          <p>Nationale KPI's</p>
        </div>

        {/*Middle level*/}
        {/*Middle interactive input */}
        <div className="bg-holon-gray-100 overflow-auto ">
          <p>Midden interactive input </p>
        </div>

        {/*image */}
        <div className="bg-holon-gray-100">
          <p></p>
        </div>

        {/*Middle KPIs */}
        <div className="bg-holon-gray-100">
          <p>Tussen KPI's</p>
        </div>

        {/*Local level*/}
        {/*Local interactive input */}
        <div className="bg-holon-gray-300 overflow-auto ">
          <p>Lokaal interactive input</p>
        </div>

        {/*image */}
        <div className="bg-holon-gray-300">
          <p></p>
        </div>

        {/*Local KPIs */}
        <div className="bg-holon-gray-300 ">
          <p>Lokale KPI's</p>
        </div>
      </div>
    </div>
  );
}
