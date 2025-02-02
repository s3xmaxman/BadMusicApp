import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModelProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";
import getPlaylists from "@/actions/getPlaylists";
import getSongs from "@/actions/getSongs";
import Sidebar from "@/components/Sidebar/Sidebar";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BadMusicApp",
  description: "Listen to music!",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getActiveProductsWithPrices();
  const playlists = await getPlaylists();
  const songs = await getSongs();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <Sidebar songs={songs} playlists={playlists}>
              {children}
            </Sidebar>
            <Player playlists={playlists} />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
