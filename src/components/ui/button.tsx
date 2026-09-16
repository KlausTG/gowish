import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { UIText } from "./text";

export type ButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "destructive";
};

export function Button({
  label,
  loading,
  variant = "primary",
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "primary"
      ? theme.accent
      : variant === "destructive"
      ? theme.danger
      : theme.backgroundElement;

  const labelColor =
    variant === "secondary"
      ? theme.text
      : variant === "destructive"
      ? "#fff"
      : "#fff";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      hitSlop={8}
      style={(state) => [
        styles.base,
        {
          backgroundColor,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <UIText
          variant="label"
          style={{ color: labelColor, textAlign: "center" }}
        >
          {label}
        </UIText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
});
