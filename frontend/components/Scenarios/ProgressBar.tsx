import { useEffect, useState } from "react";
import Loader from "./Loader";

const determineProgress = (progress: number, duration: number) =>
  Math.max(Math.round((progress / duration) * 100), 100);

export default function ProgressBar({ duration, label }: { duration: number; label: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progress + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="rounded-lg border border-holon-blue-900 bg-white p-4 shadow-holon-blue">
      <div className="flex w-full justify-center">
        <Loader />
      </div>
      <div className="mb-1 flex w-60 justify-between">
        <span className="text-base font-light text-black">{label}</span>
        <span className="text-sm font-light text-black">
          {determineProgress(progress, duration)} %
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-holon-slated-blue-300">
        <div
          className="h-2.5 rounded-full bg-holon-gold-600"
          style={{ width: `${determineProgress(progress, duration)}%` }}
        ></div>
      </div>
    </div>
  );
}
