import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AnnotationHighlight } from "@/components/song/AnnotationHighlight";

describe("AnnotationHighlight", () => {
  it("should render children", () => {
    render(<AnnotationHighlight id={1} onClick={() => {}}>Highlighted Text</AnnotationHighlight>);
    expect(screen.getByText("Highlighted Text")).toBeInTheDocument();
  });

  it("should have correct Genius-style highlighting class", () => {
    render(<AnnotationHighlight id={1} onClick={() => {}}>Text</AnnotationHighlight>);
    const highlight = screen.getByText("Text");
    expect(highlight).toHaveClass("bg-gray-200");
    expect(highlight).toHaveClass("cursor-pointer");
  });

  it("should call onClick with id when clicked", () => {
    const handleClick = vi.fn();
    render(<AnnotationHighlight id={42} onClick={handleClick}>Text</AnnotationHighlight>);
    
    fireEvent.click(screen.getByText("Text"));
    expect(handleClick).toHaveBeenCalledWith(42);
  });

  it("should add active styling when isActive is true", () => {
    render(<AnnotationHighlight id={1} onClick={() => {}} isActive>Text</AnnotationHighlight>);
    const highlight = screen.getByText("Text");
    expect(highlight).toHaveClass("bg-yellow-200"); // Genius active style
  });
});
