import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnnotationBubble } from "@/components/song/AnnotationBubble";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import * as api from "@/lib/api/song";

vi.mock("@/lib/api/song", async () => {
  const actual = await vi.importActual("@/lib/api/song");
  return {
    ...actual,
    updateAnnotation: vi.fn(),
    deleteAnnotation: vi.fn(),
    voteAnnotation: vi.fn(),
    deleteVote: vi.fn(),
  };
});

describe("AnnotationBubble", () => {
  const mockAnnotation = {
    id: 1,
    content: "This is a test annotation",
    start_index: 0,
    end_index: 10,
    rating: 5,
    my_vote: null,
    created_at: "2026-05-12T12:00:00Z",
    user: {
      user_id: 1,
      username: "tester",
      reputation_score: 100,
      avatar_url: "http://example.com/avatar.jpg"
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useAuth as any).mockReturnValue({
      user: null,
      token: null,
    });
    // Mock window.confirm
    vi.spyOn(window, "confirm").mockImplementation(() => true);
  });

  it("should render nothing if annotation is null and not create mode", () => {
    const { container } = render(<AnnotationBubble annotation={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render annotation content and user info", () => {
    render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    
    expect(screen.getByText("This is a test annotation")).toBeInTheDocument();
    expect(screen.getByText("tester")).toBeInTheDocument();
    expect(screen.getByText(/100\s+RS/i)).toBeInTheDocument();
  });

  it("should apply Frutiger Aero design classes", () => {
    const { container } = render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    expect(container.firstChild).toHaveClass("bg-white/60");
    expect(container.firstChild).toHaveClass("backdrop-blur-xl");
  });

  it("should render create mode with textarea and submit button", () => {
    render(
      <AnnotationBubble 
        annotation={null} 
        isCreateMode={true} 
        onClose={() => {}} 
        onSubmit={async () => {}} 
      />
    );
    
    expect(screen.getByPlaceholderText(/Объясните этот текст/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /сохранить аннотацию/i })).toBeInTheDocument();
  });

  it("should not show edit and delete buttons for non-authors", () => {
    (useAuth as any).mockReturnValue({
      user: { user_id: 2, role: "user" },
    });
    render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    expect(screen.queryByTitle("Редактировать")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Удалить")).not.toBeInTheDocument();
  });

  it("should show edit and delete buttons for the author", () => {
    (useAuth as any).mockReturnValue({
      user: { user_id: 1, role: "user" },
    });
    render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    expect(screen.getByTitle("Редактировать")).toBeInTheDocument();
    expect(screen.getByTitle("Удалить")).toBeInTheDocument();
  });

  it("should show delete button for moderators even if not author", () => {
    (useAuth as any).mockReturnValue({
      user: { user_id: 99, role: "moderator" },
    });
    render(<AnnotationBubble annotation={mockAnnotation} onClose={() => {}} />);
    expect(screen.queryByTitle("Редактировать")).not.toBeInTheDocument();
    expect(screen.getByTitle("Удалить")).toBeInTheDocument();
  });
});

