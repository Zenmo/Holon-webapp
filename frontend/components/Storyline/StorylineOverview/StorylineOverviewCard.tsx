import {
  BoltIcon,
  BellIcon,
  CogIcon,
  FolderIcon,
  HeartIcon,
  MapPinIcon,
  RocketLaunchIcon,
  StarIcon,
  UserIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import RawHtml from "../../RawHtml";
import Link from "next/link";
import { useRouter } from "next/router";

import s from "./Storyline.module.css";
import { StoryLineItem as StoryLineItemData } from "./types";

interface Props {
  index: number;
  project: StoryLineItemData;
}

function StorylineOverviewCardIcon({ icon }: { icon: string }) {
  const cssclass = "mr-1 h-6 w-6";
  switch (icon) {
    case "bell":
      return <BellIcon className={cssclass} />;
    case "book":
      return <BoltIcon className={cssclass} />;
    case "cog":
      return <CogIcon className={cssclass} />;
    case "folder":
      return <DocumentTextIcon className={cssclass} />;
    case "heart":
      return <FolderIcon className={cssclass} />;
    case "info":
      return <HeartIcon className={cssclass} />;
    case "lightning":
      return <InformationCircleIcon className={cssclass} />;
    case "mapmarker":
      return <MapPinIcon className={cssclass} />;
    case "rocket":
      return <RocketLaunchIcon className={cssclass} />;
    case "star":
      return <StarIcon className={cssclass} />;
    case "user":
      return <UserIcon className={cssclass} />;
    default:
      return null;
  }
}

export default function StorylineOverviewCard({ project, index }: Props) {
  const router = useRouter();
  const cssClass = index === 0 ? ` lg:w-2/4 xl:w-2/5 ` : ` lg:w-1/4 xl:w-1/5`;

  return (
    <div className={`storyline__griditem w-1/2 p-4 ${cssClass} `}>
      <Link href={router.asPath + project.slug}>
        <a
          className={`${project.cardColor} ${s.storyline__card} flex h-full flex-col p-2 rounded gap-2 border min-h-[400px] opacity-0 hover:opacity-1`}
          style={{ animationDelay: index + "00ms" }}>
          {project.thumbnail && (
            <span className="h-1/2 overflow-hidden relative">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={project.thumbnail.url}
                alt={`storyline ${project.title}`}
                width="725"
                height="380"
                className="object-cover object-center h-full w-full object-pos max-w-none max-h-none"
              />
            </span>
          )}
          <span className="flex-col flex h-1/2">
            <strong className="mb-3 block">{project.title}</strong>
            <span className="mb-3">
              <RawHtml html={project.description} />
            </span>
            <span className="mt-auto text-right flex justify-end flex-wrap ">
              {project.informationTypes.map((informationtype, index) => (
                <span
                  key={index}
                  className="flex bg-white rounded items-center py-1 px-2 ml-2 mt-2 whitespace-nowrap ">
                  {informationtype.icon && (
                    <StorylineOverviewCardIcon icon={informationtype.icon} />
                  )}
                  {informationtype.name}
                </span>
              ))}
            </span>
          </span>
        </a>
      </Link>
    </div>
  );
}
