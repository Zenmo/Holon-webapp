import Link from "next/link";
import Image from "next/image";

import faviconholon from "../../public/favicon.ico";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <div className="sticky top-0 z-50 flex h-10 snap-start flex-row items-center bg-white opacity-90">
      <div className="mx-6 flex h-8 w-8 items-center">
        <Link href="#introVideo" title="Logo Holon linking to homepage" className="">
          <Image src={faviconholon} layout="intrinsic" alt="logo and link to homepage"></Image>
        </Link>
      </div>

      <span className="ml-4 text-left text-lg font-semibold ">Holon</span>
      <Navbar />
    </div>
  );
}
