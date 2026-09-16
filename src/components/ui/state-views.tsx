import { StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { Button } from "./button";
import { SymbolIcon, Symbols } from "./symbol-icon";
import { UIText } from "./text";

type StateViewProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyStateView({
  title,
  message,
  actionLabel,
  onAction,
}: StateViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.centered}>
      <SymbolIcon
        name={Symbols.gift}
        size={48}
        tintColor={theme.textSecondary}
      />
      <UIText variant="heading" style={styles.title}>
        {title}
      </UIText>
      {message ? (
        <UIText color="textSecondary" style={styles.message}>
          {message}
        </UIText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

export function ErrorStateView({
  title = "Something went wrong",
  message,
  actionLabel = "Try again",
  onAction,
}: StateViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.centered}>
      <SymbolIcon name={Symbols.error} size={48} tintColor={theme.danger} />
      <UIText variant="heading" style={styles.title}>
        {title}
      </UIText>
      {message ? (
        <UIText color="textSecondary" style={styles.message}>
          {message}
        </UIText>
      ) : null}
      {onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
  },
  action: {
    alignSelf: "stretch",
    marginTop: Spacing.two,
  },
});
