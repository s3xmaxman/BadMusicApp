import Link from "next/link";
import React from "react";

interface GenreCardProps {
  genre: string;
  color: string;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, color }) => {
  return (
    <Link href={`/genre/${genre}`} className="cursor-pointer flex-shrink-0">
      <div className="relative w-80 h-40 bg-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-3/4 h-3/4 ${color}`}
            style={{
              clipPath:
                genre === "Retro Wave"
                  ? "polygon(0 100%, 20% 100%, 20% 0, 40% 0, 40% 50%, 60% 50%, 60% 100%, 100% 100%, 100% 80%, 0 80%)"
                  : genre === "Electro House"
                  ? "polygon(0 0, 80% 0, 80% 20%, 100% 20%, 100% 100%, 60% 100%, 60% 40%, 0 40%)"
                  : genre === "Nu Disco"
                  ? "polygon(0 20%, 80% 20%, 80% 0, 100% 0, 100% 100%, 80% 100%, 80% 40%, 0 40%)"
                  : genre === "City Pop"
                  ? "polygon(0 0, 100% 0, 100% 30%, 70% 30%, 70% 70%, 30% 70%, 30% 30%, 0 30%)"
                  : genre === "Tropical House"
                  ? "polygon(0 100%, 100% 100%, 100% 70%, 70% 70%, 70% 30%, 30% 30%, 30% 70%, 0 70%)"
                  : genre === "Vapor Wave"
                  ? "polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 50%, 0 50%)"
                  : genre === "Trance"
                  ? "polygon(0 100%, 30% 100%, 30% 0, 70% 0, 70% 100%, 100% 100%, 100% 70%, 0 70%)"
                  : "polygon(0 0, 30% 0, 30% 70%, 70% 70%, 70% 0, 100% 0, 100% 30%, 0 30%)",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-start pl-4">
          <h2 className="text-white text-2xl font-bold">{genre}</h2>
        </div>
      </div>
    </Link>
  );
};

export default GenreCard;
