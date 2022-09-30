export default function Paragraphs({ texts }: { texts: string }) {
  return (
    <>
      {texts.split("\n").map((str, index) => (
        <p key={index} data-testid="p" className="mt-4">
          {str}
        </p>
      ))}
    </>
  );
}
