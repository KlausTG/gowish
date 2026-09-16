import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { EmptyStateView, ErrorStateView } from "@/components/ui/state-views";
import { UIText } from "@/components/ui/text";

import { CreateWishDialog } from "./create-wish-dialog";
import { ListControls } from "./list-controls";
import { ListFilterDialog } from "./list-filter-dialog";
import { ListSortDialog } from "./list-sort-dialog";
import type { WishItem } from "./types";
import { useWishlist } from "./use-wishlist";
import { applyViewOptions, type ViewOptions } from "./view-options";
import { WishDetailsDialog } from "./wish-details-dialog";
import { WishRow } from "./wish-row";
import { WishRowSkeleton } from "./wish-row-skeleton";

const SKELETON_ROWS = 6;

type WishListProps = {
  viewOptions: ViewOptions;
  onViewOptionsChange: (options: ViewOptions) => void;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
};

export function WishList({
  viewOptions,
  onViewOptionsChange,
  createOpen,
  onCreateOpenChange,
}: WishListProps) {
  const theme = useTheme();
  const { data, error, isPending, isError, isRefetching, refetch } =
    useWishlist();
  const [selectedItem, setSelectedItem] = useState<WishItem | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const allItems = data ?? [];
  const displayedItems = useMemo(
    () => applyViewOptions(allItems, viewOptions),
    [allItems, viewOptions]
  );

  const showStaleBanner = isError && !!data && !bannerDismissed;

  if (isPending) {
    return (
      <View style={styles.flex}>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <WishRowSkeleton key={index} />
        ))}
      </View>
    );
  }

  if (isError && !data) {
    return (
      <ErrorStateView
        message={error?.message}
        onAction={() => void refetch()}
      />
    );
  }

  const isFilteredEmpty =
    allItems.length > 0 &&
    displayedItems.length === 0 &&
    viewOptions.onlyUnreserved;

  return (
    <View style={styles.flex}>
      {showStaleBanner ? (
        <View style={[styles.banner, { backgroundColor: theme.dangerSurface }]}>
          <UIText variant="caption" style={styles.bannerText}>
            Could not refresh. Showing the last loaded list.
          </UIText>
          <Pressable hitSlop={8} onPress={() => setBannerDismissed(true)}>
            <UIText variant="label" color="danger">
              Dismiss
            </UIText>
          </Pressable>
        </View>
      ) : null}

      <ListControls
        items={allItems}
        options={viewOptions}
        onOpenFilter={() => setFilterOpen(true)}
        onOpenSort={() => setSortOpen(true)}
      />

      {allItems.length === 0 ? (
        <EmptyStateView
          actionLabel="Add your first wish"
          message="Start the shared wishlist by adding something you would love to receive."
          title="No wishes yet"
          onAction={() => onCreateOpenChange(true)}
        />
      ) : isFilteredEmpty ? (
        <EmptyStateView
          actionLabel="Show all"
          message="Try turning off the filter or check back when something opens up."
          title="Everything here is taken"
          onAction={() =>
            onViewOptionsChange({ ...viewOptions, onlyUnreserved: false })
          }
        />
      ) : (
        <Animated.FlatList
          data={displayedItems}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isPending}
              onRefresh={() => {
                setBannerDismissed(false);
                void refetch();
              }}
            />
          }
          renderItem={({ item }) => (
            <WishRow
              dimmed={item.id.startsWith("optimistic-")}
              item={item}
              onPress={setSelectedItem}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <WishDetailsDialog
        item={selectedItem}
        visible={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
      <CreateWishDialog
        visible={createOpen}
        onClose={() => onCreateOpenChange(false)}
      />
      <ListFilterDialog
        options={viewOptions}
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        onChange={onViewOptionsChange}
      />
      <ListSortDialog
        options={viewOptions}
        visible={sortOpen}
        onClose={() => setSortOpen(false)}
        onChange={onViewOptionsChange}
      />

      {isRefetching && !isPending && displayedItems.length > 0 ? (
        <View style={styles.refetchIndicator} pointerEvents="none">
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.five,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  bannerText: {
    flex: 1,
  },
  refetchIndicator: {
    position: "absolute",
    top: Spacing.two,
    alignSelf: "center",
  },
});
