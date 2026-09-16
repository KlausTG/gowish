import { Linking, Pressable, StyleSheet, View } from "react-native";

import { CURRENT_USER } from "@/api";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice, reservedByLabel } from "@/utils/format";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { SymbolIcon, Symbols } from "@/components/ui/symbol-icon";
import { UIText } from "@/components/ui/text";

import type { WishItem } from "./types";
import { useReserveWish } from "./use-reserve-wish";
import { WishImage } from "./wish-image";

type WishDetailsDialogProps = {
  item: WishItem | null;
  visible: boolean;
  onClose: () => void;
};

export function WishDetailsDialog({
  item,
  visible,
  onClose,
}: WishDetailsDialogProps) {
  const theme = useTheme();
  const { reserve, unreserve } = useReserveWish();

  if (!item) return null;

  const isMine = item.reservedBy === CURRENT_USER;
  const isTakenByOther = item.reservedBy !== null && !isMine;
  const status = reservedByLabel(item.reservedBy);

  const handlePrimaryAction = () => {
    onClose();
    if (isMine) {
      unreserve.mutate(item.id);
      return;
    }
    if (!item.reservedBy) {
      reserve.mutate(item.id);
    }
  };

  const primaryLabel = isMine
    ? "Release reservation"
    : isTakenByOther
    ? status ?? "Reserved"
    : "Reserve";

  return (
    <Dialog visible={visible} title="Wish details" onClose={onClose}>
      <WishImage imageUrl={item.imageUrl} size={120} />
      <UIText variant="heading">{item.title}</UIText>
      <UIText variant="bodyStrong">
        {formatPrice(item.priceMinor, item.currency)}
      </UIText>
      {status ? (
        <UIText color="textSecondary">{status}</UIText>
      ) : (
        <UIText color="success">Available</UIText>
      )}
      {item.url ? (
        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => void Linking.openURL(item.url!)}
          style={({ pressed }) => [
            styles.linkRow,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <SymbolIcon name={Symbols.link} tintColor={theme.accent} />
          <UIText color="accent" numberOfLines={1} style={styles.linkText}>
            {item.url}
          </UIText>
        </Pressable>
      ) : null}
      <View style={styles.actions}>
        <Button
          disabled={isTakenByOther}
          label={primaryLabel}
          onPress={handlePrimaryAction}
          variant={isMine ? "destructive" : "primary"}
        />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.sm,
  },
  linkText: {
    flex: 1,
  },
  actions: {
    marginTop: Spacing.two,
  },
});
