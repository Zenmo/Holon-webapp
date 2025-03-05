import { NavItem } from "@/api/types"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Navbar({ items }: { items: NavItem[] }) {
    const router = useRouter()

    return (
        <ul className="flex flex-col md:flex-row md:space-x-8 md:mt-0">
            {items?.map((item: NavItem, index) => {
                return (
                    <li key={index}>
                        <Link
                            href={`/${item.slug}`}
                            className={`w-full cursor-pointer px-2 py-3 md:py-2 text-xl text-holon-blue-900 dark:text-white hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0 ${
                                router.asPath === `/${item.slug}/`
                                && "underline decoration-holon-blue-900 decoration-2 underline-offset-4"
                            }`}
                        >
                            {item.title}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
