"use client";

import { useState } from "react";
import type { BodyPartHeatmap } from "@/lib/types";
import BodyDiagram from "./BodyDiagram";
import InjuryForm from "./InjuryForm";

interface InjuriesClientSectionProps {
  heatmap: BodyPartHeatmap[];
}

export default function InjuriesClientSection({
  heatmap,
}: InjuriesClientSectionProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BodyDiagram
        heatmap={heatmap}
        onSelectBodyPart={setSelectedBodyPart}
      />
      <InjuryForm preselectedBodyPart={selectedBodyPart} />
    </div>
  );
}
