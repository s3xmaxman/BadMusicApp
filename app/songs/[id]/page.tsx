import React from "react";

interface Props {
  params: {
    id: string;
  };
}

const SongPage = ({ params: { id: songId } }: Props) => {
  return <div>SongPage</div>;
};

export default SongPage;
