"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  AiFillHome,
  AiOutlinePlusCircle,
  AiOutlineBars,
  AiOutlineSearch,
} from "react-icons/ai";

const MobileTabs = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70px] bg-black flex items-center justify-center z-50">
      <div className="flex space-x-20">
        <button
          onClick={() => handleTabClick("home")}
          className={`flex flex-col items-center text-white ${
            activeTab === "home" ? "text-[#4c1d95]" : ""
          }`}
        >
          <Link href="/">
            <AiFillHome size={24} />
          </Link>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => handleTabClick("add")}
          className={`flex flex-col items-center text-white ${
            activeTab === "add" ? "text-[#4c1d95]" : ""
          }`}
        >
          <Link href="/search">
            <AiOutlineSearch size={28} />
          </Link>
          <span className="text-xs mt-1">Search</span>
        </button>
        <button
          onClick={() => handleTabClick("menu")}
          className={`flex flex-col items-center text-white ${
            activeTab === "menu" ? "text-[#4c1d95]" : ""
          }`}
        >
          <AiOutlineBars size={24} />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default MobileTabs;
