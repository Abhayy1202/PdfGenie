import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAppContext } from "./context/AppContext.jsx";
import { MobileHeader } from "./components/MobileHeader.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { PDFViewer } from "./components/PDFViewer.jsx";
import { ChatInterface } from "./components/ChatInterface.jsx";
import { DragHandle } from "./components/DragHandle.jsx";
import "./App.css";

function App() {
  const IP = String(import.meta.env.VITE_AWS_IP);

  const {
    setQuery,
    input,
    setInput,
    file,
    setLoading,
    setShowDetailsForm,
    userDetails,
    setUserDetails,
    setSidebarWidth,
    setChatWidth,
  } = useAppContext();

  const draggingSidebarRef = useRef(false);
  const draggingChatRef = useRef(false);

  const clearChat = async () => {
    try {
      const response = await axios.post(`https://${IP}/clear`, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });
      console.log(response.data);
      setQuery([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handlePDF = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          `https://${IP}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("File uploaded:", response);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    if (file) {
      handlePDF();
    }
  }, [file]);

  const handleSend = async () => {
    if (!input.trim() && !file) {
      console.log("No input or file to send.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
      image:
        file?.type !== "application/pdf" ? URL.createObjectURL(file) : null,
    };

    setQuery((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let assistantMessage;

      if (file.type !== "application/pdf") {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          `https://${IP}/process-image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 10000,
          }
        );

        assistantMessage = response.data;
      } else {
        const response = await axios.post(`https://${IP}/chat-bot`,
          { query: input },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 20000,
          }
        );

        assistantMessage = response.data.data
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        if (input.includes("quotation" || "quotations")) {
          setShowDetailsForm(true);
        }
      }

      setQuery((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
      setQuery((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Error occurred: ${
            error.response ? error.response.data.error : error.message
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `https://${IP}/quotation`,
        userDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = response.data.data;
      setQuery((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: responseData },
      ]);

      setShowDetailsForm(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setQuery((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Error occurred: ${
            error.response ? error.response.data.error : error.message
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (draggingSidebarRef.current) {
        const newWidth = e.clientX;
        setSidebarWidth(
          Math.max(200, Math.min(newWidth, window.innerWidth - 400))
        );
      } else if (draggingChatRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        setChatWidth(
          Math.max(200, Math.min(newWidth, window.innerWidth - 400))
        );
      }
    },
    [setSidebarWidth, setChatWidth]
  );

  const handleMouseUp = useCallback(() => {
    draggingSidebarRef.current = false;
    draggingChatRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-dvh lg:flex-row">
      <div className="flex flex-col w-full">
        <MobileHeader />
        <div className="flex flex-grow">
          <Sidebar />
          <DragHandle onMouseDown={() => (draggingSidebarRef.current = true)} />
          <div className="flex-1 flex flex-row overflow-hidden">
            <PDFViewer />
            <DragHandle onMouseDown={() => (draggingChatRef.current = true)} />
            <ChatInterface
              clearChat={clearChat}
              handleSend={handleSend}
              handleDetailsChange={handleDetailsChange}
              handleDetailsSubmit={handleDetailsSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
