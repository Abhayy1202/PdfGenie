import { Moon, Sun } from "lucide-react";
import React from "react";
import useTheme from "../context/Theme.jsx";

function ThemeBtn() {
  const { themeMode, lightmode, darkmode } = useTheme();
  const onChangeBtn = () => {
    if (themeMode === "dark") lightmode();
    else darkmode();
  };

  return (
    <button
      className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
      onClick={onChangeBtn}
    >
      {themeMode === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-600 transition-transform duration-300 ease-in-out" />
      ) : (
        <Moon className="h-6 w-6 transition-transform duration-300 ease-in-out " />
      )}
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}

export default ThemeBtn;
