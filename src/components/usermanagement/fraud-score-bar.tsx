function getTone(score: number) {
  if (score >= 70) return { bar: "bg-red-500", text: "text-red-600" };
  if (score >= 30) return { bar: "bg-amber-500", text: "text-amber-600" };
  return { bar: "bg-green-500", text: "text-green-600" };
}

export function FraudScoreBar({ score }: { score: number }) {
  const tone = getTone(score);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-medium ${tone.text}`}>{score}</span>
    </div>
  );
}
