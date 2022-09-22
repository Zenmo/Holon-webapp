
interface Props {
  src: any;
  top: string;
  left: string;
  width: string;
  classes: string;
}

export default function ImageLayer({ src, top, left, width, classes }: Props) {
  return (
    <img
      className={`animate-fallDown absolute top-[${top}] left-[${left}] w-[${width}] ${classes}`}
    ></img>
  );
}
