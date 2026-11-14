"use client";

import React from "react";
import { Capabilities3DMatrix } from "@/components/cinematic/Capabilities3DMatrix";
import { ProductionMetricsStack } from "./ProductionMetricsStack";
import { DEFAULT_SERVICES_CONTENT, type ServicesStageProps } from "./types";

export const ServicesStage = React.memo(function ServicesStage({
  content = DEFAULT_SERVICES_CONTENT,
}: ServicesStageProps) {
  return (
    <div className="w-full max-w-[1500px] mx-auto pt-1 pb-4 flex flex-col justify-start">
      <Capabilities3DMatrix content={content} />
      <ProductionMetricsStack />
    </div>
  );
});
