import { NavItem } from "@/api/types"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"

export default function Header({ navigation }: { navigation: NavItem[] }) {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleClick = () => {
        setMenuOpen(!menuOpen)
    }

    const prevScrollPos = useRef(0)
    const [visible, setVisible] = useState(true)

    const handleScroll = () => {
        const currentScrollPos = window.scrollY

        setVisible(currentScrollPos < prevScrollPos.current)

        prevScrollPos.current = currentScrollPos
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    })

    return (
        <nav
            className="sticky top-0 z-50 bg-white py-4 rounded dark:bg-gray-900 shadow-sm"
            style={{
                position: visible ? "sticky" : "static",
            }}
        >
            <div className="holonContentContainer px-10 lg:px-16">
                <div className="flex flex-wrap justify-between items-center mx-auto">
                    <Link
                        href="/"
                        className="flex items-center text-left uppercase text-2xl font-bold text-holon-blue-900 dark:text-white"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/imgs/logo_homepagina.png"
                            alt="logo and link homepage Holon"
                            width={150}
                            height={150}
                            className="mr-2"
                        />
                    </Link>
                    <button
                        onClick={() => handleClick()}
                        data-collapse-toggle="navbar-default"
                        type="button"
                        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200  dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:text-white"
                        aria-controls="navbar-default"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                    <div
                        className={`${menuOpen ? "" : "hidden"} w-full md:block md:w-auto`}
                        id="navbar-default"
                    >
                        <Navbar items={navigation} />
                    </div>
                </div>
            </div>
        </nav>
    )
}
