import { SymbolIcon, Symbols } from "@/components/ui/symbol-icon";
import { UIText } from "@/components/ui/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice, reservedByLabel } from "@/utils/format";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import type { WishItem } from "./types";
import { WishImage } from "./wish-image";

export const WishRowMetrics = {
  minHeight: 96,
  thumbSize: 64,
  gap: Spacing.three,
  paddingVertical: Spacing.three,
} as const;

type WishRowProps = {
  item: WishItem;
  onPress?: (item: WishItem) => void;
  dimmed?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function WishRow({
  item,
  onPress,
  dimmed,
  disabled,
  style,
}: WishRowProps) {
  const theme = useTheme();
  const reserved = item.reservedBy !== null;
  const status = reservedByLabel(item.reservedBy);

  return (
    <Pressable
      accessibilityRole={disabled ? "none" : "button"}
      android_ripple={
        disabled ? undefined : { color: theme.backgroundSelected }
      }
      disabled={disabled}
      hitSlop={disabled ? undefined : 8}
      onPress={disabled ? undefined : () => onPress?.(item)}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: disabled ? 1 : dimmed || reserved ? 0.55 : pressed ? 0.6 : 1,
          transform: [{ scale: disabled || !pressed ? 1 : 0.985 }],
          borderBottomColor: theme.border,
        },
        style,
      ]}
    >
      <WishImage imageUrl={item.imageUrl} size={WishRowMetrics.thumbSize} />
      <View style={styles.content}>
        <UIText variant="bodyStrong" numberOfLines={2}>
          {item.title}
        </UIText>
        <UIText variant="label" color="textSecondary">
          {formatPrice(item.priceMinor, item.currency)}
        </UIText>
        {status ? (
          <View
            style={[styles.pill, { backgroundColor: theme.backgroundMuted }]}
          >
            <UIText variant="caption" color="textSecondary">
              {status}
            </UIText>
          </View>
        ) : null}
      </View>
      <SymbolIcon name={Symbols.chevronRight} tintColor={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: WishRowMetrics.gap,
    paddingVertical: WishRowMetrics.paddingVertical,
    paddingHorizontal: Spacing.three,
    minHeight: WishRowMetrics.minHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
  },
});
