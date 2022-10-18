import React from "react";
import Windmill from "./Windmill";

export default function Windmills() {
  return (
    <React.Fragment>
      <Windmill top="64%" left="6%" width="16%" />
      <Windmill top="69%" left="9%" width="16%" />
      <Windmill top="71%" left="15.6%" width="16%" />
    </React.Fragment>
  );
}
