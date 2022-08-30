import ContentBlock from "../components/ContentBlock";
import PrivacyMarkdown from "../public/mdfiles/privacy_page.md";

export default function PrivacyStatement() {
  return (
    <div>
      <ContentBlock>
        <div className="prose mt-6 flex flex-col">
          <PrivacyMarkdown />
        </div>
      </ContentBlock>
    </div>
  );
}
