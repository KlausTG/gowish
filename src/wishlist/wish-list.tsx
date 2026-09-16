import { EmptyStateView, ErrorStateView } from "@/components/ui/state-views";
import { UIText } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { CreateWishDialog } from "./create-wish-dialog";
import { ListFilterDialog } from "./list-filter-dialog";
import { ListSortDialog } from "./list-sort-dialog";
import type { WishItem } from "./types";
import { useWishlist } from "./use-wishlist";
import { applyViewOptions, type ViewOptions } from "./view-options";
import { WishDetailsDialog } from "./wish-details-dialog";
import { WishRow } from "./wish-row";
import { WishRowSkeleton } from "./wish-row-skeleton";

const SKELETON_ROWS = 6;
const EMPTY_WISH_ITEMS: WishItem[] = [];

type WishListProps = {
  viewOptions: ViewOptions;
  onViewOptionsChange: (options: ViewOptions) => void;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  sortOpen: boolean;
  onSortOpenChange: (open: boolean) => void;
};

export function WishList({
  viewOptions,
  onViewOptionsChange,
  createOpen,
  onCreateOpenChange,
  filterOpen,
  onFilterOpenChange,
  sortOpen,
  onSortOpenChange,
}: WishListProps) {
  const theme = useTheme();
  const { data, error, isPending, isError, isRefetching, refetch } =
    useWishlist();
  const [selectedItem, setSelectedItem] = useState<WishItem | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const allItems = data ?? EMPTY_WISH_ITEMS;
  const displayedItems = useMemo(
    () => applyViewOptions(allItems, viewOptions),
    [allItems, viewOptions]
  );

  const height = useWindowDimensions().height;
  const showStaleBanner = isError && !!data && !bannerDismissed;

  const isFilteredEmpty =
    allItems.length > 0 &&
    displayedItems.length === 0 &&
    viewOptions.onlyUnreserved;

  let content;
  if (isPending) {
    content = (
      <View style={styles.flex}>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <WishRowSkeleton key={index} />
        ))}
      </View>
    );
  } else if (isError && !data) {
    content = (
      <ErrorStateView
        message={error?.message}
        onAction={() => void refetch()}
      />
    );
  } else if (allItems.length === 0) {
    content = (
      <EmptyStateView
        actionLabel="Add your first wish"
        message="Start the shared wishlist by adding something you would love to receive."
        title="No wishes yet"
        onAction={() => onCreateOpenChange(true)}
      />
    );
  } else if (isFilteredEmpty) {
    content = (
      <EmptyStateView
        actionLabel="Show all"
        message="Try turning off the filter or check back when something opens up."
        title="Everything here is taken"
        onAction={() =>
          onViewOptionsChange({ ...viewOptions, onlyUnreserved: false })
        }
      />
    );
  } else {
    content = (
      <Animated.FlatList
        data={displayedItems}
        contentContainerStyle={{ paddingBottom: height / 3 }}
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
      />
    );
  }

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

      {content}

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
        onClose={() => onFilterOpenChange(false)}
        onChange={onViewOptionsChange}
      />
      <ListSortDialog
        options={viewOptions}
        visible={sortOpen}
        onClose={() => onSortOpenChange(false)}
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
