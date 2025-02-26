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
} from "@heroicons/react/24/outline"

export default function StorylineOverviewCardIcon({ icon }: { icon: string }) {
    const cssclass = "mr-1 h-6 w-6 flex-[0_0_24px]"
    switch (icon) {
        case "bell":
            return <BellIcon className={cssclass} />
        case "book":
            return <BoltIcon className={cssclass} />
        case "cog":
            return <CogIcon className={cssclass} />
        case "folder":
            return <DocumentTextIcon className={cssclass} />
        case "heart":
            return <FolderIcon className={cssclass} />
        case "info":
            return <HeartIcon className={cssclass} />
        case "lightning":
            return <InformationCircleIcon className={cssclass} />
        case "mapmarker":
            return <MapPinIcon className={cssclass} />
        case "rocket":
            return <RocketLaunchIcon className={cssclass} />
        case "star":
            return <StarIcon className={cssclass} />
        case "user":
            return <UserIcon className={cssclass} />
        default:
            return null
    }
}
