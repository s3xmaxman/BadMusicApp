import React from "react";
import SunoSongContent from "./components/SunoSongContent";

interface SunoSongPageProps {
  params: {
    id: string;
  };
}

const SunoSongPage = ({ params: { id: songId } }: SunoSongPageProps) => {
  return (
    <div className="bg-[#0d0d0d] rounded-lg w-full h-full overflow-hidden overflow-y-auto custom-scrollbar">
      <SunoSongContent sunoSongId={songId} />
    </div>
  );
};

export default SunoSongPage;
