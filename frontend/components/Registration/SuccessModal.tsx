import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function SuccessModal({ onClose }) {
  const handleCloseClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div>
      <div className="z-10 overflow-y-auto bg-gray-100 w-3/4 md:w-2/3 lg:w-1/3 h-[300px] absolute top-[15%] left-1/2 translate-x-[-50%] border-2 border-gray-700 border-solid rounded">
        <div className="flex flow-row justify-end m-4  sm:p-0">
          <button type="button" className="text-gray-800" onClick={handleCloseClick}>
            X
          </button>
        </div>
        <div className="flex flex-col items-center m-8">
          <div className="mx-auto flex h-12 w-12 m-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100 border-green-400 border-2 border-solid sm:mx-0 sm:h-10 sm:w-10">
            <CheckIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
          </div>
          <p className="text-center">
            Bedankt voor je registratie! Deze is registratie succesvol verwerkt. Je kan nu inloggen
            op{" "}
            <Link href="/inloggen">
              <a className="inline underline mt-8 decoration-holon-blue-900 decoration-2 underline-offset-4 hover:underline hover:decoration-gray-300 hover:decoration-2 hover:underline-offset-4 sm:p-0">
                holontool.nl/inloggen
              </a>
            </Link>{" "}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
