import getSongs from "@/actions/getSongs";
import HomeContent from "./components/HomeContent";

// export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  return <HomeContent songs={songs} />;
}
