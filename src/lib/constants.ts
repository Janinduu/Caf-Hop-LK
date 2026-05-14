import {
  Coffee,
  LaptopMinimal,
  Croissant,
  Cake,
  Pizza,
  UtensilsCrossed,
  Martini,
  Users,
  Heart,
  UsersRound,
  Sunrise,
  Leaf,
  Palmtree,
  Camera,
  Sun,
  Moon,
  Waves,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import type { TagDefinition, TagId } from "@/types/cafe";

export const TAG_DEFINITIONS: TagDefinition[] = [
  { id: "coffee", label: "Coffee", emoji: "", color: "#6b4423" },
  { id: "laptop-work", label: "Calm Workspace", emoji: "", color: "#3a5e72" },
  { id: "brunch", label: "Brunch", emoji: "", color: "#a87534" },
  { id: "dessert", label: "Dessert", emoji: "", color: "#a85e7a" },
  { id: "pizza", label: "Pizza", emoji: "", color: "#b04522" },
  { id: "fine-dining", label: "Fine Dining", emoji: "", color: "#553050" },
  { id: "bar-vibes", label: "Bar Vibes", emoji: "", color: "#732f4f" },
  { id: "friends-meetup", label: "Friends Meetup", emoji: "", color: "#b8503e" },
  { id: "date-spot", label: "Date Spot", emoji: "", color: "#8a3858" },
  { id: "family-outing", label: "Family Outing", emoji: "", color: "#5a7a4a" },
  { id: "good-view", label: "Good View", emoji: "", color: "#3a6f85" },
  { id: "calm-place", label: "Calm Place", emoji: "", color: "#5f7a5a" },
  { id: "beach-side", label: "Beach Side", emoji: "", color: "#2f7a7a" },
  { id: "instagram-worthy", label: "Instagram Worthy", emoji: "", color: "#94681f" },
];

export const TAG_ICONS: Record<TagId, LucideIcon> = {
  coffee: Coffee,
  "laptop-work": LaptopMinimal,
  brunch: Croissant,
  dessert: Cake,
  pizza: Pizza,
  "fine-dining": UtensilsCrossed,
  "bar-vibes": Martini,
  "friends-meetup": Users,
  "date-spot": Heart,
  "family-outing": UsersRound,
  "good-view": Sunrise,
  "calm-place": Leaf,
  "beach-side": Palmtree,
  "instagram-worthy": Camera,
};

export const TAG_MAP: Record<TagId, TagDefinition> = TAG_DEFINITIONS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<TagId, TagDefinition>,
);

export const LOCAL_STORAGE_KEY = "cafe-finder-user-data-v1";

export interface MoodPreset {
  id: string;
  label: string;
  Icon: LucideIcon;
  tags: TagId[];
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: "morning-coffee",
    label: "Morning Coffee",
    Icon: Sun,
    tags: ["coffee", "brunch"],
  },
  {
    id: "date-night",
    label: "Date Night",
    Icon: Moon,
    tags: ["date-spot", "fine-dining", "bar-vibes"],
  },
  {
    id: "beach-day",
    label: "Beach Day",
    Icon: Waves,
    tags: ["beach-side", "good-view"],
  },
  {
    id: "quiet-work",
    label: "Quiet Work",
    Icon: BookOpen,
    tags: ["laptop-work", "calm-place"],
  },
  {
    id: "family-brunch",
    label: "Family Brunch",
    Icon: Croissant,
    tags: ["family-outing", "brunch"],
  },
];
