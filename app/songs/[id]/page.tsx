import React from "react";
import SongContent from "./components/SongContent";
import getSongs from "@/actions/getSongs";

interface Props {
  params: {
    id: string;
  };
}

const SongPage = async ({ params: { id: songId } }: Props) => {
  return <SongContent songId={songId} />;
};

export default SongPage;
