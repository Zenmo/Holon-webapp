/* eslint-disable @next/next/no-img-element */
import { BoltIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import RawHtml from "../RawHtml";

interface Props {
  key: number;
  project: {
    id: number;
    title: string;
    description: string;
    role: Array<string>;
    informationtype: string;
    sector: string;
    meta: {
      slug: string;
    };
  };
}

export default function StorylineOverviewCard({ project, key }: Props) {
  return (
    <div className="storyline__griditem">
      <a
        href={project.meta.slug}
        className="storyline__card flex h-full flex-col p-2 rounded gap-2 border"
        data-cardtype={project.informationtype}
        key={key}>
        <span className="h-1/2 overflow-hidden">
          <img
            alt="random image"
            src="https://unsplash.it/600?random"
            className="h-full w-full object-cover scale-1"
          />
        </span>
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
