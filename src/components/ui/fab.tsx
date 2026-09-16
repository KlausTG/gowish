import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, type PressableProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolIcon, type SymbolIconProps } from "./symbol-icon";

export const FAB_SIZE = 56;
export const FAB_EDGE_INSET = Spacing.three;

export type FabProps = PressableProps & {
  icon: SymbolIconProps["name"];
  accessibilityLabel: string;
};

export function Fab({ icon, accessibilityLabel, style, ...rest }: FabProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      style={(state) => [
        styles.base,
        {
          backgroundColor: theme.accent,
          bottom: insets.bottom + FAB_EDGE_INSET * 3,
          opacity: state.pressed ? 0.85 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <SymbolIcon name={icon} size={28} tintColor="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    right: FAB_EDGE_INSET,
    zIndex: 10,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.24)",
  },
});
