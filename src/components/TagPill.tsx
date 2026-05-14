import { TAG_ICONS, TAG_MAP } from "@/lib/constants";
import type { TagId } from "@/types/cafe";

export function TagPill({
  tag,
  size = "sm",
}: {
  tag: TagId;
  size?: "sm" | "xs";
}) {
  const def = TAG_MAP[tag];
  const Icon = TAG_ICONS[tag];
  if (!def) return null;
  const padding =
    size === "xs" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  const iconSize = size === "xs" ? 11 : 13;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${padding}`}
      style={{
        backgroundColor: `${def.color}1a`, // ~10% opacity
        color: def.color,
        borderColor: `${def.color}33`, // ~20% opacity
      }}
    >
      {Icon && (
        <Icon size={iconSize} strokeWidth={1.75} className="shrink-0" />
      )}
      <span>{def.label}</span>
    </span>
  );
}
