import {
  ConflictError,
  CURRENT_USER,
  NotFoundError,
  reserveItem,
  unreserveItem,
} from "@/api";
import { reservedByLabel } from "@/utils/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { wishlistKeys } from "./keys";
import type { WishItem } from "./types";

type ReserveContext = {
  previousItems: WishItem[] | undefined;
};

function patchItem(
  items: WishItem[],
  id: string,
  patch: Partial<WishItem>
): WishItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function useReserveWish() {
  const queryClient = useQueryClient();

  const reserve = useMutation({
    mutationFn: (id: string) => reserveItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previousItems = queryClient.getQueryData<WishItem[]>(
        wishlistKeys.all
      );
      queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
        old ? patchItem(old, id, { reservedBy: CURRENT_USER }) : old
      );
      return { previousItems } satisfies ReserveContext;
    },
    onError: (error, id, context) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (context?.previousItems) {
        queryClient.setQueryData(wishlistKeys.all, context.previousItems);
      }
      if (error instanceof ConflictError) {
        queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
          old ? patchItem(old, error.item.id, error.item) : old
        );
        const who =
          reservedByLabel(error.item.reservedBy) ??
          "Someone else reserved this item";
        Alert.alert("Could not reserve", `${who}. The list has been updated.`);
        return;
      }
      if (error instanceof NotFoundError) {
        queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
          old ? old.filter((item) => item.id !== id) : old
        );
        Alert.alert("Item removed", "This wish is no longer on the list.");
        return;
      }
      Alert.alert("Could not reserve", error.message);
    },
    onSuccess: () => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });

  const unreserve = useMutation({
    mutationFn: (id: string) => unreserveItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previousItems = queryClient.getQueryData<WishItem[]>(
        wishlistKeys.all
      );
      queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
        old ? patchItem(old, id, { reservedBy: null }) : old
      );
      return { previousItems } satisfies ReserveContext;
    },
    onError: (error, id, context) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      if (context?.previousItems) {
        queryClient.setQueryData(wishlistKeys.all, context.previousItems);
      }
      if (error instanceof ConflictError) {
        queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
          old ? patchItem(old, error.item.id, error.item) : old
        );
        Alert.alert(
          "Could not release",
          "The reservation status changed. The list has been updated."
        );
        return;
      }
      if (error instanceof NotFoundError) {
        queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
          old ? old.filter((item) => item.id !== id) : old
        );
        Alert.alert("Item removed", "This wish is no longer on the list.");
        return;
      }
      Alert.alert("Could not release", error.message);
    },
    onSuccess: () => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });

  return { reserve, unreserve };
}
