"use client";
import * as RadixSlider from "@radix-ui/react-slider";
import React from "react";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange }) => {
  const handleChange = (value: number[]) => {
    onChange?.(value[0]);
  };

  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none h-[100px] w-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      orientation="vertical"
      aria-label="Volume"
    >
      <RadixSlider.Track className="relative bg-gray-300 rounded-full w-[6px] h-full">
        <RadixSlider.Range className="absolute bg-[#4c1d95] rounded-full w-full" />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
