"use client";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillHome, AiOutlineBars, AiOutlineSearch } from "react-icons/ai";
import { FaHeart } from "react-icons/fa6";

const MobileTabs = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-black flex items-center justify-center z-50">
      <div className="flex space-x-12">
        <button
          onClick={() => handleTabClick("home")}
          className={`flex flex-col items-center text-white ${
            activeTab === "home" ? "active-tab" : ""
          }`}
        >
          <Link href="/">
            <AiFillHome size={22} />
          </Link>
        </button>
        <button
          onClick={() => handleTabClick("add")}
          className={`flex flex-col items-center text-white ${
            activeTab === "add" ? "active-tab" : ""
          }`}
        >
          <Link href="/search">
            <AiOutlineSearch size={24} />
          </Link>
        </button>
        <button
          onClick={() => handleTabClick("playlist")}
          className={`flex flex-col items-center text-white ${
            activeTab === "playlist" ? "active-tab" : ""
          }`}
        >
          <Link href="/playlists">
            <AiOutlineBars size={22} />
          </Link>
        </button>
        <button
          onClick={() => handleTabClick("liked")}
          className={`flex flex-col items-center text-white ${
            activeTab === "liked" ? "active-tab" : ""
          }`}
        >
          <Link href="/liked">
            <FaHeart size={22} />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default MobileTabs;
