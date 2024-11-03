import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  disabled,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-40 
            bg-black/90
            data-[state=open]:animate-in 
            data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 
            data-[state=open]:fade-in-0
            duration-300
          "
        />
        <Dialog.Content
          className="
            fixed left-[50%] top-[50%] z-50 
            w-full max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px]
            translate-x-[-50%] translate-y-[-50%] 
            bg-black
            p-8 md:p-10
            shadow-2xl 
            duration-500 
            data-[state=open]:animate-in 
            data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 
            data-[state=open]:fade-in-0 
            data-[state=closed]:zoom-out-95 
            data-[state=open]:zoom-in-95 
            data-[state=closed]:slide-out-to-left-1/2 
            data-[state=closed]:slide-out-to-top-[48%] 
            data-[state=open]:slide-in-from-left-1/2 
            data-[state=open]:slide-in-from-top-[48%] 
            rounded-2xl
            border border-zinc-700/50
            overflow-y-auto
            custom-scrollbar
            max-h-[90vh]
          "
        >
          <div className="flex flex-col space-y-4 mb-8">
            <Dialog.Title
              className="
              text-3xl md:text-4xl 
              font-bold 
              tracking-tight 
              text-white
              text-center
              bg-clip-text text-transparent
              bg-gradient-to-r from-white to-gray-200
            "
            >
              {title}
            </Dialog.Title>
            <Dialog.Description
              className="
              text-base md:text-lg
              text-zinc-300
              text-center
              max-w-2xl
              mx-auto
            "
            >
              {description}
            </Dialog.Description>
          </div>
          <div className="relative">{children}</div>
          <Dialog.Close asChild disabled={disabled}>
            <button
              className="
                absolute right-6 top-6
                rounded-full
                p-2
                opacity-70
                bg-black
                border border-zinc-700/50
                transition-all
                duration-200
                hover:opacity-100
                hover:bg-zinc-900
                hover:scale-110
                focus:outline-none
                focus:ring-2
                focus:ring-white/40
                focus:ring-offset-2
                disabled:pointer-events-none
              "
              aria-label="Close"
            >
              <IoMdClose className="h-5 w-5 text-zinc-300" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
