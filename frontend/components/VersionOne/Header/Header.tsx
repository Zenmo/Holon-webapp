import Link from "next/link";

import Navbar from "./Navbar";

export default function Header() {
  return (
    <div className="sticky top-0 z-50 flex h-10 snap-start flex-row items-center bg-white opacity-90">
      <div className="mx-6 flex h-8 w-8 items-center">
        <Link href="#introVideo" title="Logo Holon linking to homepage" className="">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="favicon.ico" alt="favicon" />
        </Link>
      </div>

      <span className="ml-4 text-left text-lg font-semibold ">Holon</span>
      <Navbar />
    </div>
  );
}
