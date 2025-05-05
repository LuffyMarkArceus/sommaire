import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import DownloadSummaryButton from "./download-summary-button";

export default function SourceInfo({
  fileName,
  original_file_url,
  title,
  summary_text,
  created_at,
}: {
  fileName: string;
  original_file_url: string;
  title: string;
  summary_text: string;
  created_at: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <FileText className="w-4 h-4 text-rose-400" />
        <span> Source: {fileName}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          size={"sm"}
          asChild
          className="h-8 px-3 text-rose-600 hover:text-rose-700 hover-bg-rose-50"
        >
          <a href={original_file_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Original
          </a>
        </Button>
        <DownloadSummaryButton
          title={title}
          summary_text={summary_text}
          fileName={fileName}
          created_at={created_at}
        />
      </div>
    </div>
  );
}
