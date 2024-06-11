import React from "react";

interface Props {
  songs: string;
}

const GenreContent = ({ songs }: Props) => {
  return JSON.stringify(songs);
};

export default GenreContent;
