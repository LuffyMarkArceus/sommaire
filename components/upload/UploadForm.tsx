"use client";

import { z } from "zod";
import UploadFormInput from "./uploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 24 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF",
    }),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error("Error occured while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: ({ file }) => {
      console.warn("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit");

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);

    if (!validatedFields.success) {
      toast.error("❌ Something went wrong", {
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid File",
      });
      return;
    }

    toast.info("📄 Processing PDF...", {
      description: `Hang Tight, AI is reading through your doc ✨`,
    });

    const resp = await startUpload([file]);
    if (!resp || resp.length === 0) {
      toast.error("❌ Something went wrong", {
        description: "Please use a different file",
      });
      return;
    }
    console.log("Uploaded Successfully", file.name);
    toast.success("📄 Uploading PDF...", {
      description: `We are uploading your doc!`,
    });

    const summary = await generatePdfSummary([resp[0]]);
    console.log(summary);
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
