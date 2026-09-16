import { forwardRef } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { UIText } from "./text";

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  function TextField({ label, error, hint, style, ...rest }, ref) {
    const theme = useTheme();

    return (
      <View style={styles.wrapper}>
        <UIText variant="label" style={styles.label}>
          {label}
        </UIText>
        <TextInput
          ref={ref}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.backgroundMuted,
              borderColor: error ? theme.danger : theme.border,
            },
            style,
          ]}
          {...rest}
        />
        {error ? (
          <UIText variant="caption" color="danger">
            {error}
          </UIText>
        ) : hint ? (
          <UIText variant="caption" color="textSecondary">
            {hint}
          </UIText>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  label: {
    marginBottom: Spacing.half,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
});
