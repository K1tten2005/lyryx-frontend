import { render, screen } from "@testing-library/react";
import SearchCategory from "@/components/search/SearchCategory";

describe("SearchCategory", () => {
  it("renders the category title", () => {
    render(<SearchCategory title="Artists" items={[1]} renderItem={(item) => <div key={item} />} />);
    expect(screen.getByRole("heading", { name: "Artists" })).toBeInTheDocument();
  });

  it("renders up to 3 items and a 'See All' button if there are more", () => {
    const items = [1, 2, 3, 4, 5];
    render(
      <SearchCategory 
        title="Songs" 
        items={items} 
        renderItem={(item) => <div key={item} data-testid="item">{item}</div>} 
      />
    );

    expect(screen.getAllByTestId("item")).toHaveLength(3);
    expect(screen.getByRole("button", { name: /See All/i })).toBeInTheDocument();
  });

  it("does not render 'See All' if there are 3 or fewer items", () => {
    const items = [1, 2];
    render(
      <SearchCategory 
        title="Songs" 
        items={items} 
        renderItem={(item) => <div key={item} data-testid="item">{item}</div>} 
      />
    );

    expect(screen.getAllByTestId("item")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /See All/i })).not.toBeInTheDocument();
  });

  it("returns null if items array is empty", () => {
    const { container } = render(<SearchCategory title="Artists" items={[]} renderItem={() => <div />} />);
    expect(container).toBeEmptyDOMElement();
  });
});
