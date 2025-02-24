import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import LikedContent from "./components/LikedContent";

const Liked = async () => {
  const songs = await getLikedSongs();

  return (
    <div className="bg-[#0d0d0d] rounded-lg h-full w-full overflow-hidden overflow-y-auto custom-scrollbar">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                お気に入り
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;
