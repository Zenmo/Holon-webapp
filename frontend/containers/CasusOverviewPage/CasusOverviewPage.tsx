import Card from "@/components/Card/Card";
import { basePageWrap } from "@/containers/BasePage";

const CasusOverviewPage = props => {
  console.log(props);
  return (
    <div className="holonContentContainer">
      <div className="flex justify-center py-4 md:py-8 bg-holon-gray-300/70 rounded-b-3xl">
        <h1>Casussen op het gebied van nationaal</h1>
      </div>
      <div className="text-center py-4">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, provident. Natus
          cupiditate, vero nam facilis cum exercitationem. Ipsa modi delectus expedita nam, dicta
          inventore unde voluptatem consectetur, nulla mollitia error! Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Cumque, provident. Natus cupiditate, vero nam facilis cum
          exercitationem. Ipsa modi delectus expedita nam, dicta inventore unde voluptatem
          consectetur, nulla mollitia error!
        </p>
      </div>
      <div className="flex flex-row flex-wrap justify-center md:justify-start mx-[-1rem]">
        {props.childCasusses.map((casus: any, index: number) => {
          if (Object.keys(casus.connectedCasusContent).length) {
            return (
              <div
                key={index}
                className="px-[1rem] flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]">
                <Card cardItem={casus.connectedCasusContent} cardType="storylineCard" />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default basePageWrap(CasusOverviewPage);
