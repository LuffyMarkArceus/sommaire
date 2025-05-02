"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteSummaryAction } from "@/actions/summary-actions";
import { toast } from "sonner";

interface DeleteButtonProps {
  summaryId: string;
}

export default function DeleteButton({ summaryId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteSummaryAction({ summaryId });
      if (!result.success) {
        console.error("Failed to delete summary:", result.message);
        toast.error("Failed to delete summary", {
          description:
            result.message || "An error occurred while deleting the summary.",
        });
        return;
      }
      console.log("Summary deleted");
      toast.success("Summary deleted successfully", {
        description: "The summary has been deleted.",
      });
      setOpen(false);
    });
  };
  // Add your delete logic here

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary?</DialogTitle>
          <DialogDescription>
            Are you sure, you want to delete this summary? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            className="bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-gray-900 border border-gray-200 hover:bg-gray-600"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
