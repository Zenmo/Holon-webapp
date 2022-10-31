import { useState } from "react";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { NavItem } from "@/api/types";

export default function Navbar({ items }: { items: NavItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative flex w-full flex-col items-end justify-end sm:flex-row">
      <div className="mx-4 flex h-8 w-8 items-center sm:hidden">
        <button id="header__toggler" onClick={handleClick} className="w-full">
          <Bars3Icon />
        </button>
      </div>

      <div
        id="header__menu-items"
        className={`${
          menuOpen ? "flex flex-col" : "hidden"
        } absolute top-9 items-end space-x-4 bg-white p-4 text-lg font-bold sm:static sm:mr-4 sm:flex sm:flex-row sm:p-0`}>
        {items.map((item: NavItem, index) => {
          return (
            <Link key={index} href={`/${item.slug}`} rel="noreferrer noopener">
              <a className="w-full p-2 text-right hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
                {item.title}
              </a>
            </Link>
          );
        })}
        <Link href="/wiki" target="_blank" rel="noreferrer noopener">
          <a className="w-full p-2 text-right hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
            Wiki
          </a>
        </Link>
        <Link href="#feedback">
          <a className="w-full p-2 text-right hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
            Contact
          </a>
        </Link>
      </div>
    </div>
  );
}
