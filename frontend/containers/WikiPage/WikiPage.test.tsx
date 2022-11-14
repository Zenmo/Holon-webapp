import { render, screen } from "@testing-library/react";
import WikiPage from "./";
// import data from './WikiPage.data';

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { path: "wiki" },
  }),
}));

describe("WikiPage with simple text", () => {
  it("renders the content", () => {
    render(
      <WikiPage
        richText="Hello world"
        wikiMenu={{
          items: [{ relativeUrl: "/test/", title: "Test page", children: [] }],
          meta: { totalCount: 1 },
        }}
      />
    );

    expect(screen.getByText("Test page")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
