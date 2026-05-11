import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SeeAllModal from "@/components/search/SeeAllModal";
import { vi } from "vitest";

// Mock intersection observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("renders loading spinner when isLoadingMore is true", () => {
    render(<SeeAllModal {...defaultProps} isLoadingMore={true} hasMore={true} />);
    expect(screen.getByTestId("modal-loading-spinner")).toBeInTheDocument();
  });
  
  it("renders intersection observer sentinel when hasMore is true", () => {
    render(<SeeAllModal {...defaultProps} hasMore={true} />);
    expect(screen.getByTestId("scroll-sentinel")).toBeInTheDocument();
  });
});

