import Link from "next/link";
import { useRouter } from "next/router";
import { NavItem } from "@/api/types";

export default function Navbar({
  items,
  status,
  nameUser,
}: {
  items: NavItem[];
  status: string;
  nameUser: string;
}) {
  const router = useRouter();
  const styleButton =
    "border-holon-blue-900 text-white bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50";

  const handleLogOut = () => {
    console.log("uitgelogd");
  };

  const statusButton = (status: string) => {
    if (status === "register") {
      return (
        <Link href="/registratie">
          <a className={styleButton}>Registreer nu</a>
        </Link>
      );
    } else if (status === "loggedIn") {
      return (
        <button onClick={handleLogOut} className={styleButton}>
          Uitloggen
        </button>
      );
    } else if (status === "loggedOut") {
      return (
        <Link href="/inloggen">
          <a className={styleButton}>Inloggen</a>
        </Link>
      );
    }
  };

  return (
    <ul className="flex flex-col md:flex-row md:space-x-8 md:mt-0">
      {items?.map((item: NavItem, index) => {
        return (
          <li key={index}>
            <Link href={`/${item.slug}`}>
              <a
                className={`w-full cursor-pointer px-2 py-3 md:py-2 text-xl text-holon-blue-900 dark:text-white hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0 ${
                  router.asPath === `/${item.slug}/` &&
                  "underline decoration-holon-blue-900 decoration-2 underline-offset-4"
                }`}>
                {item.title}
              </a>
            </Link>
          </li>
        );
      })}

      {status === "loggedIn" && nameUser ? (
        <li className="px-2 py-3 md:py-2 text-xl text-holon-blue-900 dark:text-white sm:p-0">
          {nameUser}
        </li>
      ) : (
        ""
      )}

      <li>{statusButton(status)}</li>
    </ul>
  );
}
