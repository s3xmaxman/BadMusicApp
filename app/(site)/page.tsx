import getSongs from "@/actions/getSongs";
import HomeContent from "./components/HomeContent";
import getSunoSongs from "@/actions/getSunoSongs";

// export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const sunoSongs = await getSunoSongs();
  return <HomeContent songs={songs} sunoSongs={sunoSongs} />;
}
