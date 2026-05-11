import { render, screen } from "@testing-library/react";
import UserAnnotationsTab from "@/components/UserAnnotationsTab";
import { UserAnnotation } from "@/lib/api/user";

describe("UserAnnotationsTab", () => {
  const mockAnnotations: UserAnnotation[] = [
    {
      id: 1,
      content: "This is a great lyric!",
      snippet: "Some original lyrics text here",
      rating: 10,
      start_index: 0,
      end_index: 10,
      created_at: "2026-05-11T10:00:00Z",
      updated_at: "2026-05-11T10:00:00Z",
      song: {
        id: 101,
        title: "Song Title",
        cover_url: "https://example.com/cover.jpg",
        artist: {
          id: 50,
          name: "Artist Name",
        },
      },
    },
  ];

  it("renders annotations with song context and snippet", () => {
    render(<UserAnnotationsTab annotations={mockAnnotations} />);

    expect(screen.getByText("This is a great lyric!")).toBeInTheDocument();
    expect(screen.getByText(/"Some original lyrics text here"/)).toBeInTheDocument();
    expect(screen.getByText("Song Title")).toBeInTheDocument();
    expect(screen.getByText("Artist Name")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); // Rating
    
    const cover = screen.getByAltText("Song Title cover");
    expect(cover).toHaveAttribute("src");
  });

  it("renders empty state", () => {
    render(<UserAnnotationsTab annotations={[]} />);
    expect(screen.getByText(/No annotations yet/i)).toBeInTheDocument();
  });
});
