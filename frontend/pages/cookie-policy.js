import React from "react";

import ContentBlock from "../components/ContentBlock";
import CookiePolicyMarkdown from "../public/mdfiles/cookie_page.md";

export default function CookiePolicy() {
  return (
    <div>
      <ContentBlock>
        <div className="prose mt-6 flex flex-col">
          <CookiePolicyMarkdown />
        </div>
      </ContentBlock>
    </div>
  );
}
