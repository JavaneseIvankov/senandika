import { Button } from "@/shared/components/ui/button";

type TimeRange = 7 | 30 | 90;

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: 7, label: "7 Hari" },
    { value: 30, label: "30 Hari" },
    { value: 90, label: "90 Hari" },
  ];

  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selected === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(range.value)}
          className="transition-all"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
