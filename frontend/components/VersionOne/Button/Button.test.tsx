import { render /* screen */ } from "@testing-library/react";
import Button from ".";
// import data from './Button.data';

describe("<Button />", () => {
  it("Renders an empty Button", () => {
    render(<Button />);
  });

  // it('Renders Button with data', () => {
  //     const { container } = render(<Button {...data} />);
  //     expect(container).toMatchSnapshot();
  // });
});
