"use client";

import React from "react";
import { Capabilities3DMatrix } from "@/components/cinematic/Capabilities3DMatrix";

export const ServicesStage = React.memo(function ServicesStage() {
  return (
    <div className="w-full max-w-[1500px] mx-auto pt-1 pb-4 flex flex-col justify-start">
      <Capabilities3DMatrix />
    </div>
  );
});
