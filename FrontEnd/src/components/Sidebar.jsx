import React from "react";
import { Button } from "./ui/button.jsx";
import { NewChatButton } from "./NewChatBtn.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { X, FileText } from "lucide-react";

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, sidebarWidth, setFile, file } =
    useAppContext();

  return (
    <div
      className={`${
        sidebarOpen ? "block" : "hidden"
      } flex flex-col lg:block bg-[#192c55] text-white p-2 h-full sm:h-[100%] top-0 left-0 z-50 overflow-y-auto transition-all duration-300 ease-in-out font-mono`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="flex justify-between items-center lg:hidden mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex flex-col h-full">
        <div className={`hidden lg:flex justify-start p-6 pb-8`}>
          <span className="text-2xl font-bold">PdfGenie</span>
        </div>

        <div className="flex-grow">
          <NewChatButton setFile={setFile} />

          <div className="flex-auto">
            {file && (
              <Button variant="ghost" className="w-full justify-start mb-1">
                <FileText className="mr-2 h-4 w-4" /> {file.name}
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center flex-grow">
          <img
            src="/SignInChatsIcon.3b07e5f0.svg"
            alt="signInChatIcon"
            loading="lazy"
          />
          <span className="text-sm font-medium font-onest text-center mt-[-8px] max-w-[180px] leading-[22px] text-white/50">
            Sign in for free to save your chat history
          </span>
          <button
            className="mt-4 text-[14px] font-onest font-semibold text-center px-3 py-[14px] bg-[#2563eb] rounded-lg"
            onClick={() => alert("Upcoming Feature")}
          >
            Sign In
          </button>
        </div>
        <div className="mt-auto">
          <div className="text-[14px] my-2 mx-3 flex flex-wrap justify-evenly whitespace-nowrap">
            <a href="/">Home</a>
            <a href="/">Account</a>
            <a href="/">FAQ</a>
            <a href="/">Feedback</a>
          </div>
        </div>
      </div>
    </div>
  );
};
