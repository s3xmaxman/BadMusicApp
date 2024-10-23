import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-40 bg-black/80 
            backdrop-blur-sm 
            data-[state=open]:animate-in 
            data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 
            data-[state=open]:fade-in-0
          "
        />
        <Dialog.Content
          className="
            fixed left-[50%] top-[50%] z-50 
            grid w-full max-w-3xl translate-x-[-50%] 
            translate-y-[-50%] gap-4 
            bg-zinc-900 
            p-8 
            shadow-lg 
            duration-200 
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
            rounded-lg
            border border-zinc-800
            sm:max-w-lg
          "
        >
          <div className="flex flex-col space-y-2 text-center">
            <Dialog.Title className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-400">
              {description}
            </Dialog.Description>
          </div>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button
              className="
                absolute right-4 top-4 
                rounded-sm 
                opacity-70 
                ring-offset-zinc-900 
                transition-opacity 
                hover:opacity-100 
                focus:outline-none 
                focus:ring-2 
                focus:ring-zinc-400 
                focus:ring-offset-2
                disabled:pointer-events-none
                data-[state=open]:bg-zinc-800
              "
              aria-label="Close"
            >
              <IoMdClose className="h-4 w-4 text-zinc-400" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
