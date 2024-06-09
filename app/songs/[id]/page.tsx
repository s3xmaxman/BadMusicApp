import React from "react";
import SongContent from "./components/SongContent";

interface Props {
  params: {
    id: string;
  };
}

const SongPage = ({ params: { id: songId } }: Props) => {
  return <SongContent songId={songId} />;
};

export default SongPage;
