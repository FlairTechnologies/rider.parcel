import React from "react";
import { Package } from "lucide-react";

export const Loader = () => (
  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm z-50 w-full h-full">
    <div className="relative flex flex-col items-center">
      <div className="relative flex flex-col items-center animate-bounce">
        <Package className="h-16 w-16 text-yellow-500" />
      </div>
    </div>
  </div>
);