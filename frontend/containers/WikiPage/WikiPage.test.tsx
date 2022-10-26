import { render } from "@testing-library/react";
import WikiPage from "./";
import { useRouter } from "next/router";
// import data from './WikiPage.data';

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { path: "wiki" },
  }),
}));

describe("<WikiPage />", () => {
  it("Renders an empty WikiPage", () => {
    render(<WikiPage />);
  });

  // it('Renders WikiPage with data', () => {
  //     const { container } = render(<WikiPage {...data} />);
  //     expect(container).toMatchSnapshot();
  // });
});
