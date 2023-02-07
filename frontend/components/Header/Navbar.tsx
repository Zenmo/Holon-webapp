import Link from "next/link";
import { useRouter } from "next/router";
import { NavItem } from "@/api/types";
import TokenService from "@/services/token";

export default function Navbar({
  items,
  loggedIn,
  nameUser,
  mutateUser,
}: {
  items: NavItem[];
  loggedIn: boolean;
  nameUser: string;
  mutateUser: () => void;
}) {
  const router = useRouter();

  function handleLogOut() {
    mutateUser(TokenService.removeAccessToken());
    router.push("/inloggen");
  }

  const statusButton = (status: boolean) => {
    if (status === true) {
      return (
        <button onClick={handleLogOut} className="buttonDark">
          Uitloggen
        </button>
      );
    } else {
      return (
        <Link href="/inloggen">
          <a className="buttonDark">Inloggen</a>
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

      {loggedIn && nameUser ? (
        <li className="px-2 py-3 md:py-2 text-xl text-holon-blue-900 dark:text-white sm:p-0">
          {nameUser}
        </li>
      ) : (
        ""
      )}

      <li>{statusButton(loggedIn)}</li>
    </ul>
  );
}
