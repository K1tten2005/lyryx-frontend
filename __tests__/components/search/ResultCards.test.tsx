import { render, screen } from "@testing-library/react";
import { ArtistCard, SongCard, UserCard } from "@/components/search/ResultCards";

describe("ResultCards", () => {
  describe("ArtistCard", () => {
    it("renders artist information correctly", () => {
      render(<ArtistCard artist={{ id: 1, name: "Queen", cover_url: "queen.jpg" }} />);
      expect(screen.getByText("Queen")).toBeInTheDocument();
      expect(screen.getByAltText("Queen")).toHaveAttribute("src", "queen.jpg");
    });
  });

  describe("SongCard", () => {
    it("renders song information correctly", () => {
      render(
        <SongCard 
          song={{ 
            id: 1, 
            title: "Bohemian Rhapsody", 
            artist_name: "Queen", 
            cover_url: "cover.jpg" 
          }} 
        />
      );
      expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
      expect(screen.getByText("Queen")).toBeInTheDocument();
      expect(screen.getByAltText("Bohemian Rhapsody")).toHaveAttribute("src", "cover.jpg");
    });
  });

  describe("UserCard", () => {
    it("renders user information correctly", () => {
      render(<UserCard user={{ id: 1, name: "Freddie", username: "freddie_m", avatar_url: "avatar.jpg" }} />);
      expect(screen.getByText("Freddie")).toBeInTheDocument();
      expect(screen.getByText("@freddie_m")).toBeInTheDocument();
      expect(screen.getByAltText("Freddie")).toHaveAttribute("src", "avatar.jpg");
    });
  });
});
