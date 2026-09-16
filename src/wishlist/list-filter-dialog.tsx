import { Dialog } from "@/components/ui/dialog";
import { UIText } from "@/components/ui/text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { showToast } from "@/utils/toast";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { defaultViewOptions, type ViewOptions } from "./view-options";

function toastFilter(onlyUnreserved: boolean) {
  showToast(
    onlyUnreserved ? "Only showing unreserved wishes" : "Showing all wishes"
  );
}

type ListFilterDialogProps = {
  visible: boolean;
  options: ViewOptions;
  onClose: () => void;
  onChange: (options: ViewOptions) => void;
};

export function ListFilterDialog({
  visible,
  options,
  onClose,
  onChange,
}: ListFilterDialogProps) {
  const theme = useTheme();

  return (
    <Dialog visible={visible} title="Filter" onClose={onClose}>
      <View style={styles.row}>
        <UIText variant="body" style={styles.label}>
          Only show available
        </UIText>
        <Switch
          trackColor={{ false: theme.border, true: theme.accent }}
          thumbColor={theme.background}
          value={options.onlyUnreserved}
          onValueChange={(onlyUnreserved) => {
            toastFilter(onlyUnreserved);
            onChange({ ...options, onlyUnreserved });
            onClose();
          }}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => {
          const onlyUnreserved = defaultViewOptions.onlyUnreserved;
          if (options.onlyUnreserved !== onlyUnreserved) {
            toastFilter(onlyUnreserved);
          }
          onChange({
            ...options,
            onlyUnreserved,
          });
          onClose();
        }}
      >
        <UIText color="accent" variant="label">
          Reset filter
        </UIText>
      </Pressable>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  label: {
    flex: 1,
  },
});
