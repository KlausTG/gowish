import { getItems } from "@/api";

export type WishItem = Awaited<ReturnType<typeof getItems>>[number];
