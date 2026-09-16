import { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { IconButton } from "./icon-button";
import { Symbols } from "./symbol-icon";
import { UIText } from "./text";

export type DialogProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ visible, title, onClose, children }: DialogProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[
          styles.overlay,
          {
            backgroundColor: theme.overlay,
            justifyContent: Platform.OS === "web" ? "center" : "flex-end",
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Animated.View
          entering={FadeInDown.springify()
            .damping(60)
            .mass(4)
            .stiffness(1200)
            .withInitialValues({ opacity: 1 })}
          style={[
            styles.card,
            {
              backgroundColor: theme.background,
              paddingBottom: Math.max(insets.bottom, Spacing.three),
              maxWidth: MaxContentWidth,
            },
          ]}
        >
          <View style={styles.header}>
            <UIText variant="heading" style={styles.title}>
              {title}
            </UIText>
            <IconButton
              accessibilityLabel="Close"
              icon={Symbols.add}
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: Spacing.three,
  },
  card: {
    width: "100%",
    alignSelf: "center",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    maxHeight: "92%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  title: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  closeButton: {
    transform: [{ rotate: "45deg" }],
  },
  body: {
    gap: Spacing.three,
  },
});
