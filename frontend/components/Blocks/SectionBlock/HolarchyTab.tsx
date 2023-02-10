type HolarchyTabProps = {};

export default function HolarchyTab(images) {
  return (
    <div className="bg-white h-screen w-screen mt-16 grid grid-cols-3 grid-rows-3 py-12 px-10 lg:px-16 lg:pt-16 ">
      {/*National level*/}
      <div className="">
        <p>Nationaal interactive input</p>
      </div>
      <div>
        {/* eslint-disable @next/next/no-img-element */}
        <img src={images} alt="holarchy_test" width="1600" height="900"></img>
      </div>
      <div>
        <p>Nationale KPI's</p>
      </div>

      {/*Middle level*/}
      <div className="bg-holon-gray-100">
        <p>Midden interactive input</p>
      </div>
      <div className="bg-holon-gray-100">
        <p></p>
      </div>
      <div className="bg-holon-gray-100">
        <p>Tussen KPI's</p>
      </div>

      {/*Local level*/}
      <div className="bg-holon-gray-300">
        <p>Lokaal interactive input</p>
      </div>
      <div className="bg-holon-gray-300">
        <p></p>
      </div>
      <div className="bg-holon-gray-300">
        <p>Lokale KPI's</p>
      </div>
    </div>
  );
}
