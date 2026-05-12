import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AnnotationBubble } from "@/components/song/AnnotationBubble";

describe("AnnotationBubble", () => {
  const mockAnnotation = {
    id: 1,
    content: "This is a test annotation",
    start_index: 0,
    end_index: 10,
    rating: 5,
    created_at: "2026-05-12T12:00:00Z",
    user: {
      user_id: 1,
      username: "tester",
      reputation_score: 100,
      avatar_url: "http://example.com/avatar.jpg"
    }
  };

  it("should render nothing if annotation is null", () => {
    const { container } = render(<AnnotationBubble annotation={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render annotation content and user info", () => {
    render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    
    expect(screen.getByText("This is a test annotation")).toBeInTheDocument();
    expect(screen.getByText("tester")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should apply Frutiger Aero design classes", () => {
    const { container } = render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    // Checking for glassmorphism classes typical of Frutiger Aero
    expect(container.firstChild).toHaveClass("bg-white/40");
    expect(container.firstChild).toHaveClass("backdrop-blur-md");
  });
});
