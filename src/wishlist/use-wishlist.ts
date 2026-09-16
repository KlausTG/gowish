import { getItems } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { wishlistKeys } from "./keys";

export function useWishlist() {
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: getItems,
  });
}
