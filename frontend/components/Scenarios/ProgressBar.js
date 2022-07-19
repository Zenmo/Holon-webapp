import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loader from "./Loader";

function ProgressBar({ duration, label }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progress + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  function determineProgress(i, duration) {
    var currentProgress = Math.round((i / duration) * 100);
    if (currentProgress > 100) {
      currentProgress = 100;
    }
    return currentProgress;
  }

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

ProgressBar.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
};

export default ProgressBar;
