import { StyleSheet, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { Skeleton } from "@/components/ui/skeleton";

import { WishRowMetrics } from "./wish-row";

export function WishRowSkeleton() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          minHeight: WishRowMetrics.minHeight,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <Skeleton
        style={{
          width: WishRowMetrics.thumbSize,
          height: WishRowMetrics.thumbSize,
          borderRadius: Radius.md,
        }}
      />
      <View style={styles.content}>
        <Skeleton style={styles.titleLine} />
        <Skeleton style={styles.priceLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: WishRowMetrics.gap,
    paddingVertical: WishRowMetrics.paddingVertical,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    gap: Spacing.two,
  },
  titleLine: {
    height: 18,
    width: "75%",
    borderRadius: Radius.sm,
  },
  priceLine: {
    height: 14,
    width: "40%",
    borderRadius: Radius.sm,
  },
});
