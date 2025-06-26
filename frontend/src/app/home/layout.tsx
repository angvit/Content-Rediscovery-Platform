import React from "react";
import UnreadButton from "../components/home/UnreadButton";
import LatestButton from "../components/home/LatestButton";
export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="w-full">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1 overflow-visible relative z-0">
            <div className="flex items-center justify-between mb-6 z-10 relative">
              <h1 className="md:text-2xl text-lg font-bold">Your Bookmarks</h1>
              <div className="flex items-center gap-2">
                <LatestButton />
                <UnreadButton />
              </div>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
