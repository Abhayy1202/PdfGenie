import React from "react";
import { Button } from "./ui/Button.jsx";
import { Menu, MessageSquare } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export const MobileHeader = () => {
  const { setSidebarOpen, setChatOpen, sidebarOpen, chatOpen } =
    useAppContext();

  return (
    <div className="flex justify-between items-center z-20 p-4 bg-[#192c55] text-white lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold">PdfGenie</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setChatOpen(!chatOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};
