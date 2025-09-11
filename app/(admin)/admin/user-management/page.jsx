"use client"; // Only if you're using Next.js App Router

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ClientTable from "./client-management/page";
import ArtistTable from "./artist-management/page";

export default function ManagementToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabParam || "client");

  return (
    <div className="flex flex-col items-start justify-start w-full h-full gap-4">
      <div className="self-stretch flex justify-start items-center">
        <div className="p-1 sm:p-1.5 bg-white rounded-xl flex justify-start items-center gap-1 sm:gap-3 w-full sm:w-auto">
          {/* Client Management */}
          <button
            onClick={() => {
              setActiveTab("client");
              router.push("/admin/user-management?tab=client");
            }}
            className={`flex-1 sm:w-40 lg:w-48 h-10 sm:h-12 p-2 sm:p-3 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer ${
              activeTab === "client"
                ? "bg-zinc-950 text-white"
                : "bg-white text-neutral-600"
            }`}
          >
            <span className="text-sm sm:text-base font-medium capitalize leading-tight">
              Client management
            </span>
          </button>

          {/* Artist Management */}
          <button
            onClick={() => {
              setActiveTab("artist");
              router.push("/admin/user-management?tab=artist");
            }}
            className={`flex-1 sm:w-40 lg:w-48 h-10 sm:h-12 p-2 sm:p-3 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer ${
              activeTab === "artist"
                ? "bg-zinc-950 text-white"
                : "bg-white text-neutral-600"
            }`}
          >
            <span className="text-sm sm:text-base font-medium capitalize leading-tight">
              Artist management
            </span>
          </button>
        </div>
      </div>
      {activeTab === "client" ? <ClientTable /> : <ArtistTable />}
    </div>
  );
}
