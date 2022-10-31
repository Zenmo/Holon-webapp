import { BoltIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import RawHtml from "../../RawHtml";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  index: number;
  project: {
    id: number;
    title: string;
    description: string;
    slug: string;
    role: [
      {
        name: string;
      }
    ];
    informationTypes: [
      {
        name: string;
      }
    ];
    sector: string;
    relativeUrl: string;
    thumbnail: {
      name: string;
      url: string;
    };
  };
}

export default function StorylineOverviewCard({ project, index }: Props) {
  const router = useRouter();
  return (
    <div className="storyline__griditem" data-x={project.slug}>
      <Link href={router.asPath + project.slug}>
        <span
          className="storyline__card flex h-full flex-col p-2 rounded gap-2 border"
          style={{ animationDelay: index + "00ms" }}>
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
            <span className="mt-auto text-right flex justify-end flex-wrap ">
              {project.informationTypes.map((informationtype, index) => (
                <span
                  key={index}
                  className="flex bg-white rounded items-center py-1 px-2 ml-2 mt-2 whitespace-nowrap ">
                  {informationtype.name == "Wiki" ? (
                    <InformationCircleIcon className="mr-1 h-6 w-6 storyline__card__icon" />
                  ) : informationtype.name == "Stories" ? (
                    <DocumentTextIcon className="mr-1 h-6 w-6 storyline__card__icon" />
                  ) : (
                    <BoltIcon className="mr-1 h-6 w-6 storyline__card__icon" />
                  )}
                  {informationtype.name}
                </span>
              ))}
            </span>
          </span>
        </span>
      </Link>
    </div>
  );
}
