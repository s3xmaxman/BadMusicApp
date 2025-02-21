"use client";

import Image from "next/image";
import Header from "@/components/Header";
import LikedContent from "@/app/liked/components/LikedContent";
import DeletePlaylistButton from "@/components/DeletePlaylistButton";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface PlaylistPageContentProps {
  playlistId: string;
  playlistTitle: string;
  imageUrl: string;
  songs: any;
}

const PlaylistPageContent: React.FC<PlaylistPageContentProps> = ({
  playlistId,
  playlistTitle,
  songs,
  imageUrl,
}) => {
  const supabaseClient = useSupabaseClient();
  const defaultImage = "/images/playlist.png";
  const [image, setImage] = useState<string>(defaultImage);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageUrl) {
        setImage(defaultImage);
        return;
      }

      try {
        const { data: mediaData } = await supabaseClient.storage
          .from("images")
          .getPublicUrl(imageUrl);

        if (mediaData?.publicUrl) {
          setImage(mediaData.publicUrl);
        } else {
          setImage(defaultImage);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImage(defaultImage);
      }
    };

    loadImage();
  }, [imageUrl, supabaseClient]);

  return (
    <div className="bg-[#0d0d0d] rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src={image || defaultImage}
                alt="Playlist"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm"></p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {playlistTitle}
              </h1>
            </div>
            <div className="absolute right-4">
              <DeletePlaylistButton playlistId={playlistId} />
            </div>
          </div>
        </div>
      </Header>
      <div>
        {songs.length ? (
          <LikedContent songs={songs} playlistId={playlistId} />
        ) : (
          <p className="text-white">No songs</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistPageContent;
