import getSunoSongsByTags from "@/actions/getSunoSongsByTags";
import Header from "@/components/Header";
import React from "react";
import TagContent from "./components/TagContent";

interface Props {
  params: {
    tag: string;
  };
}

const page = async ({ params: { tag } }: Props) => {
  const decodedTag = decodeURIComponent(tag);
  const sunoSongs = await getSunoSongsByTags(decodedTag);
  return (
    <div className="bg-[#0d0d0d] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">{decodedTag}</h1>
        </div>
      </Header>
      <TagContent sunoSongs={sunoSongs} />
    </div>
  );
};

export default page;
