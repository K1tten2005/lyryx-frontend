import { render, screen, fireEvent } from "@testing-library/react";
import SeeAllModal from "@/components/search/SeeAllModal";

describe("SeeAllModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Category",
    items: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }],
    renderItem: (item: any) => <div key={item.id} data-testid="modal-item">{item.name}</div>,
    isLoadingMore: false,
    hasMore: false,
    onLoadMore: vi.fn(),
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = render(<SeeAllModal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title and items when open", () => {
    render(<SeeAllModal {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "All Test Category" })).toBeInTheDocument();
    expect(screen.getAllByTestId("modal-item")).toHaveLength(2);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<SeeAllModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
