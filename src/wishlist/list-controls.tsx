import { IconButton } from "@/components/ui/icon-button";
import { Symbols } from "@/components/ui/symbol-icon";
import { UIText } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

import type { WishItem } from "./types";
import { type ViewOptions } from "./view-options";

type ListControlsProps = {
  items: WishItem[];
  options: ViewOptions;
  onOpenFilter: () => void;
  onOpenSort: () => void;
};

export function ListControls({
  items,
  options,
  onOpenFilter,
  onOpenSort,
}: ListControlsProps) {
  const theme = useTheme();
  const available = items.filter((item) => item.reservedBy === null).length;
  const filterActive = options.onlyUnreserved;
  const sortActive = options.sortOrder !== "default";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <UIText variant="caption" color="textSecondary">
        {items.length} {items.length === 1 ? "wish" : "wishes"} · {available}{" "}
        available
      </UIText>
      <View style={styles.actions}>
        <IconButton
          accessibilityLabel="Filter list"
          active={filterActive}
          icon={Symbols.filter}
          onPress={onOpenFilter}
          showActiveDot={filterActive}
        />
        <IconButton
          accessibilityLabel="Sort list"
          active={sortActive}
          icon={Symbols.sort}
          onPress={onOpenSort}
          showActiveDot={sortActive}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
});
