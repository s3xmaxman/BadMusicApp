"use client";

import AuthModal from "@/components/Modals/AuthModal";
import PlaylistModal from "@/components/Modals/PlaylistModal";
import SubscribeModal from "@/components/Modals/SubscribeModal";
import UploadModal from "@/components/Modals/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <PlaylistModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
