/* global module */

import React from "react";
import WordCountPage from "./WordCountPage";
import data from "./WordCountPage.data";

export default {
  title: "Containers/WordCountPage",
  component: WordCountPage,
};

export const WordCountPageWithoutData = () => <WordCountPage />;
export const WordCountPageWithData = () => <WordCountPage {...data} />;
