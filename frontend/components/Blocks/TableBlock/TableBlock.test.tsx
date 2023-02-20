import { render, screen } from "@testing-library/react";
import TableBlock from "./TableBlock";

describe("TableBlock", () => {
  beforeEach(() => {
    render(
      <TableBlock
        data={{
          value: {
            cell: [],
            data: [
              ["a table cell", "another table cell", null],
              [null, null, null],
              ["23", "456", null],
            ],
            table_caption: "Table caption",
            first_col_is_header: false,
            first_row_is_table_header: false,
          },
          id: "a default table",
        }}
      />
    );
  });

  it("renders a table", () => {
    const text = screen.getByText("another table cell");
    expect(text).toBeInTheDocument();
  });
});
