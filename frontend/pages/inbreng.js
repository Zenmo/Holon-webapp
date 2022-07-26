import React, { Component, useEffect } from "react";
import Link from "next/link";

function Inbreng() {
  return (
    <div className="prose mt-6 ml-6">
      <h1>Je wordt doorgestuurd naar de enquête</h1>
      <p>
        Indien je niet automatisch wordt doorgestuurd klik dan op deze{""}
        <Link href="https://nl.surveymonkey.com/r/RYK7SRL">
          <a>link naar de enquête</a>
        </Link>
      </p>
    </div>
  );
}

export default Inbreng;
