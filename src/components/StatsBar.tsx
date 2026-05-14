import { Check, Heart } from "lucide-react";

interface Props {
  shown: number;
  total: number;
  visited: number;
  favorites: number;
}

export function StatsBar({ shown, total, visited, favorites }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
      <span>
        Showing <strong className="text-foreground">{shown}</strong> of {total}
      </span>
      <span className="text-border-strong">·</span>
      <span className="inline-flex items-center gap-1">
        <Check size={12} strokeWidth={2.25} className="text-visited" />
        {visited} visited
      </span>
      <span className="text-border-strong">·</span>
      <span className="inline-flex items-center gap-1">
        <Heart
          size={12}
          strokeWidth={2.25}
          className="text-favorite fill-favorite"
        />
        {favorites} favorites
      </span>
    </div>
  );
}
