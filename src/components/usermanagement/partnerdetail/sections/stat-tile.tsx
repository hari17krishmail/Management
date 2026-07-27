type Tone = "green" | "blue" | "amber" | "red";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

type StatTileProps = {
  label: string;
  value: string;
  tone: Tone;
  className?: string;
};

export function StatTile({ label, value, tone, className = "" }: StatTileProps) {
  return (
    <div className={`rounded-lg px-3.5 py-3 ${TONE_CLASSES[tone]} ${className}`}>
      <p className="text-xs font-medium opacity-80">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
