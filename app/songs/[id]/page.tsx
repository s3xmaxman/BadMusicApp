import React from "react";
import SongContent from "./components/SongContent";
import { Song } from "@/types";

interface Props {
  params: {
    id: string;
  };
}

const SongPage = async ({ params: { id: songId } }: Props) => {
  return <SongContent songId={songId} />;
};

export default SongPage;
