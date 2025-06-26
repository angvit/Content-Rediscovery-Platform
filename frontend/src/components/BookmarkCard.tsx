"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/bookmark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ExternalLink,
  Tag,
  BookmarkIcon,
  NotebookPen,
  Pen,
  Check,
} from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import NotePopup from "@/app/components/home/NotePopup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import penicon from "../../public/logo.svg";
import { boolean } from "zod";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [saved, setSaved] = useState<boolean>(true);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>(() =>
    bookmark.notes?.length > 0 ? bookmark.notes : ""
  );

  const [editNotes, setEditNotes] = useState<boolean>(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const showNotesFunc = () => {
    console.log(!showNotes);
    setShowNotes(!showNotes);
  };

  async function saveNoteToBackend(bookmarkId: string, content: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/update/notes`;
    console.log("api url", apiUrl);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: content,
          bookmarkID: bookmarkId,
        }),
      });

      const data = await response.json();

      console.log("data: ", data);
      return true;
    } catch (error) {
      console.error("Failed to save note:", error);
      return false;
    }
  }

  const tabBookmark = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/tab`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content_id: bookmark.content_id,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response body:", errorBody);
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();
      toast.message("Tab saved");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error tabing your content");
    }
  };

  const toggleSaved = async () => {
    setSaved(!saved);
    console.log(saved);

    if (!saved) {
      tabBookmark();
      return;
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/untab`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content_id: bookmark.content_id,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response body:", errorBody);
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();
      toast.message("Tab unsaved");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error untabing your tab");
    }
  };

  const setReadLink = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/content/${bookmark.content_id}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border border-black rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      {/* <Image
        src="/pen.svg"
        alt="pen"
        fill
        className="object-contain"
        quality={100}
      /> */}

      {/* Top metadata row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {bookmark.url ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`}
              alt="favicon"
              width={20}
              height={20}
              className="rounded-sm"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-100 rounded-sm flex items-center justify-center text-xs text-gray-500">
              ?
            </div>
          )}
          <span className="text-sm text-gray-600 truncate max-w-[180px]">
            {new URL(bookmark.url).hostname}
          </span>
          {/* Add NotebookPen icon here */}
        </div>
        <div className="flex items-center text-xs text-gray-800">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(bookmark.first_saved_at)}
        </div>
      </div>
      {/* Title */}
      <h3 className="font-bold text-lg mb-2">{bookmark.title || "Untitled"}</h3>

      {/* AI Summary */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {bookmark.ai_summary || "No summary available."}
      </p>

      {/* Tags */}
      {bookmark.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="relative mt-4">
        <Popover>
          <PopoverTrigger asChild>
            <NotebookPen className="text-gray-700 px-1 hover:cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={10}
            className="w-80 z-10 relative bg-gradient-to-br from-white/80 to-white/60 text-black rounded-2xl shadow-xl p-0"
          >
            <div className="h-64">
              {/* Content Area */}
              <div className="relative h-full">
                {editNotes ? (
                  <textarea
                    onChange={(e) => setNoteContent(e.target.value)}
                    value={noteContent}
                    placeholder="Start typing your note..."
                    className="w-full h-full resize-none rounded-xl p-3 bg-white/80 text-gray-800 placeholder-gray-500 text-sm leading-relaxed transition-all duration-200
            focus:outline-none focus:ring-0 focus:border-none border-none"
                  />
                ) : (
                  <div className="w-full h-full bg-white/60 backdrop-blur-sm rounded-xl p-3 overflow-y-auto">
                    {noteContent ? (
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {noteContent}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic flex items-center justify-center h-full">
                        Click the pen to add a note...
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={async () => {
                    if (editNotes) {
                      const success = await saveNoteToBackend(
                        bookmark.content_id,
                        noteContent
                      );
                      if (success) {
                        setEditNotes(false); // Exit edit mode
                      }
                    } else {
                      setEditNotes(true); // Enter edit mode
                    }
                  }}
                  className={`group overflow-hidden rounded-full w-12 h-12 flex items-center justify-center
    transition-all duration-300 hover:scale-105 active:scale-95 absolute bottom-4 right-4
    focus:outline-none focus:ring-0 focus:border-none border-none
    ${
      editNotes
        ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30"
        : "bg-gray-800 hover:bg-gray-700 shadow-lg shadow-gray-800/30"
    }`}
                  title={editNotes ? "Save note" : "Edit note"}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  {editNotes ? (
                    <Check className="text-white h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                  ) : (
                    <Pen className="text-white h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                  )}
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {showNotes && <NotePopup note={bookmark.notes} />}
        {/* Footer */}
        <div className="flex justify-between items-center mt-auto pt-1 border-t border-gray-100">
          <a
            href={bookmark.url}
            onClick={(e) => setReadLink(e)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm underline flex items-center"
          >
            Visit <ExternalLink className="h-4 w-4 ml-1" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={toggleSaved}
          >
            <BookmarkIcon
              className={`h-4 w-4 ${
                saved ? "fill-current text-blue-500" : "text-gray-400"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
