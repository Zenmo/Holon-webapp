import Link from "next/link";

export default function UserProfileShow({ name, email }: { name: string; email: string }) {
  return (
    <div className="">
      <div className="flex flex-row text-gray-700 text-lg mb-6 font-bold">
        <p className="w-24">Naam: </p>
        <p>{name}</p>
      </div>

      <div className="flex flex-row text-gray-700 mb-6 text-lg font-bold">
        <p className="w-24">E-mail: </p>
        <p>{email}</p>
      </div>
    </div>
  );
}
