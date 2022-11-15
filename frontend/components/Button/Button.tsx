import React, { createContext, useContext } from "react";

type ButtonVariant = keyof typeof variants;

type Props<T extends React.ElementType> = {
  children: React.ReactNode;
  className?: string;
  tag?: React.ElementType;
  variant?: ButtonVariant;
} & React.ComponentPropsWithoutRef<T>;

const variants = {
  dark: "border-white text-white bg-holon-blue-900 hover:bg-holon-blue-500 ",
  light: "bg-holon-gold-200 border-holon-blue-900  hover:bg-holon-gold-600",
};

const ButtonContext = createContext<ButtonVariant | undefined>(undefined);

export default function Button<T extends React.ElementType>({
  children,
  className,
  tag: Tag = "button",
  variant = "dark",
  details,
  ...rest
}: Props<T>) {
  const colorClasses = variants[variant] || variants.dark;

  let externLinkProps:
    | boolean
    | {
        target: string;
        rel: string;
      } = {
    target: "_blank",
    rel: "noopener noreferrer",
  };

  function createLink(detail) {
    if (detail.buttonLink[0].type === "intern") {
      externLinkProps = false;
    }
  }

  createLink(details);

  return (
    <Tag
      className={`${className} ${colorClasses} relative rounded border-2 px-4 py-3 mr-4 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50`.trim()}
      {...rest}
      href={details.buttonLink[0].value}
      {...externLinkProps}>
      <ButtonContext.Provider value={variant}>{children}</ButtonContext.Provider>
    </Tag>
  );
}

/**
 * Hook which provides access to the button variant.
 */
export function useButtonContext() {
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error("useButtonContext must be used within a Button");
  }

  return context;
}
