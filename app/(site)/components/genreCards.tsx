import GenreCard from "@/components/GenreCard";
import { genreCards as genres } from "@/constants";

interface GenreCardsProps {
  genres: { id: number; name: string; color: string }[];
}

const GenreCards: React.FC<GenreCardsProps> = ({ genres }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {genres.map((genre) => (
        <GenreCard key={genre.id} genre={genre.name} color={genre.color} />
      ))}
    </div>
  );
};

export default GenreCards;
