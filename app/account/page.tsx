import Header from "@/components/Header";
import React from "react";
import AccountContent from "./components/AccountContent";

const Account = () => {
  return (
    <div className="bg-[#0d0d0d] rounded-lg h-full overflow-hidden overflow-y-auto">
      <Header logout={true}>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">アカウント設定</h1>
        </div>
      </Header>
      <AccountContent />
    </div>
  );
};

export default Account;
