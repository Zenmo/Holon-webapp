import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/outline";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative flex w-full flex-col items-end justify-end sm:flex-row">
      <div className="mx-4 flex h-8 w-8 items-center sm:hidden">
        <button id="header__toggler" onClick={handleClick} className="w-full">
          <MenuIcon></MenuIcon>
        </button>
      </div>

      <div
        id="header__menu-items"
        className={`${
          menuOpen ? "flex flex-col" : "hidden"
        } absolute top-9 items-end space-x-4 bg-white p-4 text-lg font-bold sm:static sm:mr-4 sm:flex sm:flex-row sm:p-0`}
      >
        <Link href="/wiki" target="_blank" rel="noreferrer noopener">
          <a className="w-full p-2 text-right hover:border-b-2 sm:p-0">Wiki</a>
        </Link>
        <Link href="#feedback">
          <a className="w-full p-2 text-right hover:border-b-2 sm:p-0">Contact</a>
        </Link>
      </div>
    </div>
  );
}
