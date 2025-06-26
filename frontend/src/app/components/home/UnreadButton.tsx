"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function UnreadButton() {
  return (
    <Link href="/home/unread">
      {" "}
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-500"
      >
        Unread
      </Button>
    </Link>
  );
}

export default UnreadButton;
