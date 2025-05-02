import { FileText } from "lucide-react";
import { Card } from "../ui/card";
import DeleteButton from "./delete-button";
import Link from "next/link";
import { add, formatDistanceToNow } from "date-fns";
import { formatFilenameAsTitle } from "@/utils/format-uitls";

const SummaryHeader = ({
  fileUrl,
  title,
  created_at,
}: {
  fileUrl: string;
  title: string | null;
  created_at: string;
}) => {
  return (
    <div className="flex items-start gap-2 sm:gap-4">
      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 mt-1" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
          {formatFilenameAsTitle(title || "NULL")}
        </h3>
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({
  status,
}: {
  status: "completed" | "pending" | "error";
}) => {
  const statusClasses = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
        ${statusClasses[status] || "bg-gray-100 text-gray-800"}
      `}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function SummaryCard({ summary }: { summary: any }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <Card className="relative h-full">
        <div className="absolute top-2 right-2">
          <DeleteButton summaryId={summary.id} />
        </div>
        <Link
          href={`/summaries/${summary.id}`} // Fallback to "#" if no ID is provided
          className="block p-4 sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <SummaryHeader
              title={summary.title}
              fileUrl={summary.fileUrl}
              created_at={summary.created_at}
            />
            <p className="text-gray-600 line-clamp-2 text-sm sm:text-base pl-2">
              {summary.summary_text}
            </p>
            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <StatusBadge status={summary.status} />
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
