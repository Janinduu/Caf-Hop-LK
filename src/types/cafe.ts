export type TagId =
  | "laptop-work"
  | "coffee"
  | "dessert"
  | "friends-meetup"
  | "date-spot"
  | "family-outing"
  | "good-view"
  | "calm-place"
  | "brunch"
  | "pizza"
  | "fine-dining"
  | "bar-vibes"
  | "beach-side"
  | "instagram-worthy";

export interface Cafe {
  id: string;
  name: string;
  district: string;
  area: string;
  tags: TagId[];
  description: string;
  googleMapsUrl: string;
}

export interface TagDefinition {
  id: TagId;
  label: string;
  emoji: string;
  color: string;
}

export type CafeStatus = "visited" | "want-to-visit" | null;

export interface CafeUserData {
  status: CafeStatus;
  isFavorite: boolean;
  updatedAt: string;
}

export type UserCafeData = Record<string, CafeUserData>;

export type StatusFilter = "all" | "favorites" | "visited" | "want-to-visit" | "not-visited";
export type SortOption = "name" | "district" | "recent";
