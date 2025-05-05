import Link from "next/link";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, ClockIcon, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

export default function SummaryHeader({
  title,
  created_at,
  reading_time,
}: {
  title?: string;
  created_at: string;
  reading_time: number;
}) {
  return (
    <div className="flex gap-4 mb-4 justify-between">
      <div className="space-y-6">
        <div className="flex flex-wrap itmes-center gap-4">
          <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm font-medium bg-white/90 backdrop-blur-xs rounded-full hover:bg-white/100 transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-rose-500" />
            AI Summary
          </Badge>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-rose-400" />
            {new Date(created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4 text-rose-400" />
            {reading_time} min read
          </div>
        </div>
        <h1 className="text-2xl lg:text-4xl font-bold lg:tracking-tight">
          <span className="bg-linear-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            {" "}
            {title}
          </span>
        </h1>
      </div>
      <div className="self-start">
        <Link href={"/dashboard"}>
          <Button
            variant={"link"}
            size={"sm"}
            className="group flex items-center gap-1 sm:gap-2 hover:bg-white/80 backdrop-blur-xs rounded-full transition-all duration-200 shadow-xs hover:shadow-md border border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 transition-all group-hover:rotate-180" />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Back <span className="hidden sm:inline">to Dashboard</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
