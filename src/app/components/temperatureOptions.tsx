"use client";

import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface PromptOptionProps {
  onTemperatureSelected: (temperature: number) => void;
}

export default function TemperatureOptions({
  onTemperatureSelected,
}: PromptOptionProps) {
  const handleTemperatureSelected = (temperature: number) => {
    onTemperatureSelected(temperature);
  };

  return (
    <div className="space-y-4">
      <Label>Temperature</Label>

      <Slider
        min={0}
        max={1}
        step={0.1}
        defaultValue={[0.5]}
        onValueChange={(value) => handleTemperatureSelected(value[0])}
      />

      <span className="block text-sm text-muted-foreground italic leading-relaxed">
        Higher values will increase the creativity and with possible errors
      </span>
    </div>
  );
}
