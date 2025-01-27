import React, { useEffect } from "react";
import { Button } from "./ui/button.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { X } from "lucide-react";
import { DetailsForm } from "./DetailsForm.jsx";
import { useAppContext } from "../context/AppContext.jsx";

export const ChatInterface = ({
  handleDetailsChange,
  handleDetailsSubmit,
  handleSend,
}) => {
  const {
    chatOpen,
    setChatOpen,
    chatWidth,
    query,
    loading,
    input,
    setInput,
    showDetailsForm,
    setShowDetailsForm,
    userDetails,
    file,
  } = useAppContext();

  useEffect(() => {
    if (file) {
      setChatOpen(true);
    }
  }, [file]);

  return (
    <div
      className={`${
        chatOpen ? "block" : "hidden"
      } bg-white border-t lg:border-l border-gray-200 flex flex-col h-full lg:h-auto  lg:static bottom-0 right-0 z-40 transition-all duration-300 ease-in-out`}
      style={{ width: `${chatWidth}px` }}
    >
      <div className="flex flex-col h-dvh">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setChatOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4 ">
          {query.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === "user" ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              {msg.image && (
                <div className="image-preview">
                  <img
                    src={msg.image}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                </div>
              )}
              {msg.content && !msg.image && (
                <p dangerouslySetInnerHTML={{ __html: msg.content }} />
              )}
            </div>
          ))}
          {loading && (
            <div className="bg-blue-100 p-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Textarea
            placeholder="Type your message here..."
            className="mb-2 resize-none"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button className="w-full" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>

      {showDetailsForm && (
        <DetailsForm
          userDetails={userDetails}
          handleDetailsChange={handleDetailsChange}
          handleDetailsSubmit={handleDetailsSubmit}
          setShowDetailsForm={setShowDetailsForm}
          loading={loading}
        />
      )}
    </div>
  );
};
