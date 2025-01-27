import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import getAnalytics from "./AnalyticReport.js";
import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/Theme.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>
);
getAnalytics();
