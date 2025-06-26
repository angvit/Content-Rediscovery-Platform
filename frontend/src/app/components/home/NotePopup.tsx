import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Note {
  noteContent: string;
}

function NotePopup({ note }: { note: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Trigger the popover to open once the component mounts
    setOpen(true);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hidden" />{" "}
      {/* Hidden since we open it programmatically */}
      <PopoverContent>{note}</PopoverContent>
    </Popover>
  );
}

export default NotePopup;
