import { Pressable, StyleSheet, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { SymbolIcon, Symbols } from "./symbol-icon";
import { UIText } from "./text";

export type RadioGroupProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: RadioGroupProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            hitSlop={4}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: selected ? theme.accent : theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <SymbolIcon
              name={selected ? Symbols.radioOn : Symbols.radioOff}
              tintColor={selected ? theme.accent : theme.textSecondary}
            />
            <UIText variant="body">{option.label}</UIText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
});
