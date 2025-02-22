"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-900/10 opacity-0 group-focus-within:opacity-100 transition-all duration-300 -z-10" />
        <input
          type={type}
          className={twMerge(
            `
          w-full
          rounded-xl
          bg-neutral-900/60
          border
          border-white/[0.02]
          px-4
          py-3
          text-sm
          backdrop-blur-sm
          text-white
          placeholder:text-neutral-400
          disabled:cursor-not-allowed
          disabled:opacity-50
          focus:outline-none
          group-hover:border-purple-500/20
          focus:border-purple-500/30
          transition-all
          duration-300
          `,
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
