import React from "react";
import { ChevronsLeftRightEllipsis } from "lucide-react";

export const DragHandle = ({ onMouseDown }) => (
  <div
    className="hidden lg:flex w-1 cursor-col-resize items-center justify-center hover:bg-gray-300"
    onMouseDownCapture={onMouseDown}
  >
    <span className="rounded-full h-6 w-6 bg-gray-300 flex items-center justify-center cursor-col-resize z-50">
      <ChevronsLeftRightEllipsis className="h-6 w-6 overflow-visible z-50 " />
    </span>
    
  </div>
);
