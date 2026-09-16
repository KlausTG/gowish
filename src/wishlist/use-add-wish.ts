import { addItem } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Alert } from "react-native";
import { wishlistKeys } from "./keys";
import type { WishItem } from "./types";

export type AddWishInput = {
  title: string;
  priceMinor: number;
  url?: string;
};

type AddWishContext = {
  previousItems: WishItem[] | undefined;
  optimisticId: string;
};

export function useAddWish() {
  const queryClient = useQueryClient();
  const retryRef = useRef<(input: AddWishInput) => void>(() => {});

  const mutation = useMutation({
    mutationFn: (input: AddWishInput) => addItem(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
      const previousItems = queryClient.getQueryData<WishItem[]>(
        wishlistKeys.all
      );
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticItem: WishItem = {
        id: optimisticId,
        title: input.title,
        priceMinor: input.priceMinor,
        currency: "DKK",
        url: input.url,
        reservedBy: null,
      };
      queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
        old ? [...old, optimisticItem] : [optimisticItem]
      );
      return { previousItems, optimisticId } satisfies AddWishContext;
    },
    onSuccess: (item, _input, context) => {
      if (!context?.optimisticId) return;
      queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
        old
          ? old.map((row) => (row.id === context.optimisticId ? item : row))
          : [item]
      );
    },
    onError: (error, input, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(wishlistKeys.all, context.previousItems);
      } else if (context?.optimisticId) {
        queryClient.setQueryData<WishItem[]>(wishlistKeys.all, (old) =>
          old ? old.filter((row) => row.id !== context.optimisticId) : old
        );
      }
      Alert.alert("Could not add wish", error.message, [
        { text: "Discard", style: "cancel" },
        { text: "Retry", onPress: () => retryRef.current(input) },
      ]);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });

  retryRef.current = mutation.mutate;

  return mutation;
}
