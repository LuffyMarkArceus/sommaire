import React from "react";
import { notFound } from "next/navigation";

import { getSummaryById } from "@/lib/summaries";
import BgGradient from "@/components/common/bg-gradient";
import SummaryHeader from "@/components/summaries/summary-header";
import SummaryViewer from "@/components/summaries/summary-viewer";
import SourceInfo from "@/components/summaries/source-info";
import { FileText } from "lucide-react";

export default async function SummaryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const summary = await getSummaryById(id);
  if (!summary) {
    notFound();
  }

  const {
    title,
    summary_text,
    created_at,
    updated_at,
    file_name,
    word_count,
    original_file_url,
  } = summary;

  // Assuming average reading speed of 200 wpm
  const reading_time = Math.ceil((word_count || 0) / 200);

  return (
    <div className="realtive isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-orange-400 to red-400" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader
              title={title}
              created_at={created_at}
              reading_time={reading_time}
            />
          </div>
          {file_name && (
            <SourceInfo
              fileName={file_name}
              created_at={created_at}
              original_file_url={original_file_url}
              title={title}
              summary_text={summary_text}
            />
          )}
          <div className="relative mt-4 sm:mt-8 lg:mt-16">
            <div className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                {word_count?.toLocaleString()} words
              </div>
              <div className="relative mt-8 sm:mt-6 flex justify-center">
                <SummaryViewer summary={summary_text} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
