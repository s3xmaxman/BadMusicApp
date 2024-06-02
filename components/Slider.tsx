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
      className=" relative flex items-center select-none touch-none w-full h-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="Volume"
    >
      <RadixSlider.Track className=" relative grow rounded-full h-[6px] bg-gray-300">
        <RadixSlider.Range className=" absolute rounded-full h-full bg-purple-500" />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
