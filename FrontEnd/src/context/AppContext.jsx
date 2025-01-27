import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [query, setQuery] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [chatWidth, setChatWidth] = useState(384);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  return (
    <AppContext.Provider
      value={{
        query,
        setQuery,
        input,
        setInput,
        file,
        setFile,
        loading,
        setLoading,
        showDetailsForm,
        setShowDetailsForm,
        userDetails,
        setUserDetails,
        sidebarOpen,
        setSidebarOpen,
        chatOpen,
        setChatOpen,
        sidebarWidth,
        setSidebarWidth,
        chatWidth,
        setChatWidth,
        isDraggingSidebar,
        setIsDraggingSidebar,
        isDraggingChat,
        setIsDraggingChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
