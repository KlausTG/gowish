import type { WishItem } from "./types";

export type SortOrder = "default" | "price-asc" | "price-desc";

export type ViewOptions = {
  onlyUnreserved: boolean;
  sortOrder: SortOrder;
};

export const defaultViewOptions: ViewOptions = {
  onlyUnreserved: false,
  sortOrder: "default",
};

export function isViewOptionsActive(options: ViewOptions): boolean {
  return options.onlyUnreserved || options.sortOrder !== "default";
}

export function applyViewOptions(
  items: WishItem[],
  options: ViewOptions
): WishItem[] {
  let result = items;

  if (options.onlyUnreserved) {
    result = result.filter((item) => item.reservedBy === null);
  }

  if (options.sortOrder === "price-asc") {
    result = [...result].sort((a, b) => a.priceMinor - b.priceMinor);
  } else if (options.sortOrder === "price-desc") {
    result = [...result].sort((a, b) => b.priceMinor - a.priceMinor);
  }

  return result;
}
