"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex justify-end items-center gap-1">
          <Input
            id="file"
            name="file"
            accept="application/pdf"
            required
            type="file"
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
            disabled={isLoading}
            aria-label="Upload PDF file"
          />
          <Button disabled={isLoading}>
            {isLoading ? "Loading..." : "Upload your PDF"}
          </Button>
        </div>
      </form>
    );
  }
);

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;
