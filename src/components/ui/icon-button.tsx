import { Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { IconSize, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { SymbolIcon, type SymbolIconProps } from "./symbol-icon";

export type IconButtonProps = PressableProps & {
  icon: SymbolIconProps["name"];
  size?: number;
  active?: boolean;
  showActiveDot?: boolean;
};

export function IconButton({
  icon,
  size = IconSize.sm,
  active,
  showActiveDot,
  style,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={12}
      style={(state) => [
        styles.base,
        {
          backgroundColor: active
            ? theme.accentOnSurface
            : theme.backgroundElement,
          opacity: state.pressed ? 0.7 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <SymbolIcon
        name={icon}
        size={size}
        tintColor={active ? theme.accent : theme.text}
      />
      {showActiveDot ? (
        <View style={[styles.dot, { backgroundColor: theme.accent }]} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    top: Spacing.one,
    right: Spacing.one,
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
});
