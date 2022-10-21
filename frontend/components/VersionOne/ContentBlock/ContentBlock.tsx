type Props = React.PropsWithChildren<{
  colorClass?: string;
  id?: string;
}>;

export default function ContentBlock({ id, colorClass = "", children }: Props) {
  return (
    <div
      className={`min-h-screen snap-start ${colorClass} relative flex items-center justify-center`}
      id={id}
      data-testid="content-block"
    >
      {children}
    </div>
  );
}
