import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

type Props = {
  data: {
    type: string;
    value: {
      block_background: {
        select_background: string;
      };
      title: string;
      text: string;
      image_selector: {
        image: {
          id: number;
          title: string;
          img: {
            src: string;
            width: number;
            height: number;
            alt: string;
          };
        };
        caption: string;
        attribution: string;
      };
    };
    id: string;
  };
};

export default function HeroBlock(props: Props) {
  let backgroundcolor = props.data.value.block_background.select_background;
  let imageDetails = props.data.value.image_selector;

  //Link in button still needs href to next section

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col mx-8">
        <div className={`flex flex-col lg:flex-row ${backgroundcolor}`}>
          <div className="flex flex-col p-8 lg:w-1/2 lg:mt-16">
            <h1 dangerouslySetInnerHTML={{ __html: props.data.value.title }} className={``}></h1>
            <div
              dangerouslySetInnerHTML={{ __html: props.data.value.text }}
              className={`text-3xl font-semibold mt-8 mr-8`}></div>
          </div>

          <div className="flex flex-col p-8 lg:w-1/2">
            <div dangerouslySetInnerHTML={{ __html: imageDetails.caption }}></div>
            <img
              src={imageDetails.image.img.src}
              alt={imageDetails.attribution}
              className={``}></img>
          </div>
        </div>

        <div className="flex flex-row justify-center relative">
          <Link href="#start">
            <a className="bg-holon-purple-100 w-12 h-12 absolute top-[-7rem] rounded-full p-2">
              <ArrowDownIcon />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
