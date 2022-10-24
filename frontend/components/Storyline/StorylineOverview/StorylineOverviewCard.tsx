import { BoltIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import RawHtml from "../../RawHtml";
import Image from "next/image";

interface Props {
  key: number;
  index: number;
  project: {
    id: number;
    title: string;
    description: string;
    role: Array<string>;
    informationtype: string;
    sector: string;
    relativeUrl: string;
    thumbnail: {
      name: string;
      url: string;
    };
  };
}

export default function StorylineOverviewCard({ project, index, key }: Props) {
  return (
    <div className="storyline__griditem">
      <a
        href={project.relativeUrl}
        className="storyline__card flex h-full flex-col p-2 rounded gap-2 border"
        data-cardtype={project.informationtype}
        style={{ animationDelay: index + "00ms" }}
        key={key}>
        {project.thumbnail && (
          <span className="h-1/2 overflow-hidden relative">
            <Image
              objectFit="cover"
              src={process.env.NEXT_PUBLIC_BASE_URL + project.thumbnail.url}
              alt={process.env.NEXT_PUBLIC_BASE_URL + project.thumbnail.name}
              layout="fill"
            />
          </span>
        )}
        <span className="flex-col flex h-1/2">
          <strong className="mb-3 block">{project.title}</strong>
          <span className="mb-3">
            <RawHtml html={project.description} />
          </span>
          <span className="mt-auto text-right flex justify-end ">
            <span className="flex bg-white rounded items-center py-1 px-2 ">
              {project.informationtype == "Wiki" ? (
                <InformationCircleIcon className="mr-1 h-6 w-6 storyline__card__icon" />
              ) : project.informationtype == "Stories" ? (
                <DocumentTextIcon className="mr-1 h-6 w-6 storyline__card__icon" />
              ) : (
                <BoltIcon className="mr-1 h-6 w-6 storyline__card__icon" />
              )}
              {project.informationtype}
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}
