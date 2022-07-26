import React, { Component, useEffect } from "react";

function Inbreng() {
  useEffect(() => {
    window.location.href = "https://nl.surveymonkey.com/r/RYK7SRL";
  }, []);

  return (
    <div>
      <h1>This page is not available</h1>
      <p>You are redirecting to Surveymonkey</p>
    </div>
  );
}

export default Inbreng;
