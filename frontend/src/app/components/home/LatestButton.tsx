"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function LatestButton() {
  return (
    <Link href="/home">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-500"
      >
        Latest
      </Button>
    </Link>
  );
}

export default LatestButton;
