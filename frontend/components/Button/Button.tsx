import Link from "next/link";

type Button = {
  props: {
    style: string;
    text: string;
    href: string;
    align: string;
    key: number;
  };
};

export default function Button({ props }: Button) {
  return (
    <div>
      <Link
        href={props.href}
        className={`relative inline-flex items-center py-2 px-3 font-medium leading-5 shadow-sm outline-none transition focus-visible:ring-2 active:shadow-inner`}>
        {props.text}
      </Link>
    </div>
  );
}
