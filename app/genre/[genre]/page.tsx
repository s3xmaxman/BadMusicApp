import React from "react";
import getSongsByGenre from "@/actions/getSongsByGenre";
import Header from "@/components/Header";
import GenreContent from "./components/GenreContent";

interface Props {
  params: {
    genre: string;
  };
}

const page = async ({ params: { genre } }: Props) => {
  const decodedGenre = decodeURIComponent(genre);
  const songs = await getSongsByGenre(decodedGenre);
  return <GenreContent songs={songs} />;
};

export default page;
