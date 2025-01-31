import React from "react";
import useSpotlightModal from "@/hooks/useSpotlightModal";
import Modal from "./Modal";
import { SpotlightData } from "../SpotlightBoard";

const SpotlightModal = () => {
  const { isOpen, onClose } = useSpotlightModal();
  const selectedItem = useSpotlightModal((state) => state.selectedItem);

  if (!selectedItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onChange={onClose}
      title="Spotlight"
      description={selectedItem.title}
    >
      <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
        {/* 動画表示エリア */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <video
            src={selectedItem.video_path}
            controls
            autoPlay
            muted
            className="w-full h-full object-contain"
          />
        </div>

        {/* 詳細情報エリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
          <div className="space-y-2">
            <p className="text-neutral-400">Artist: {selectedItem.author}</p>
            <p className="text-neutral-400">Genre: {selectedItem.genre}</p>
          </div>
          <p className="text-neutral-300 whitespace-pre-wrap">
            {selectedItem.description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SpotlightModal;
