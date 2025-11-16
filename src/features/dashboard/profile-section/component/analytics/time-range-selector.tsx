import { Button } from "@/shared/components/ui/button";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

type TimeRange = 7 | 30 | 90;

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string; icon: React.ReactNode }[] = [
    { value: 7, label: "7 Hari", icon: <Calendar className="h-3.5 w-3.5" /> },
    { value: 30, label: "30 Hari", icon: <CalendarDays className="h-3.5 w-3.5" /> },
    { value: 90, label: "90 Hari", icon: <CalendarRange className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selected === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(range.value)}
          className={`
            transition-all hover:shadow-md
            ${selected === range.value 
              ? "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0" 
              : "border-purple-200 bg-white hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 text-gray-700"
            }
          `}
        >
          <span className="flex items-center gap-1.5">
            {range.icon}
            {range.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
