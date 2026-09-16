import type { AndroidSymbol } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { type ColorValue, View } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

import { IconSize } from "@/constants/theme";

type CrossPlatformSymbol = {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
};

export type SymbolIconProps = {
  name: CrossPlatformSymbol;
  size?: number;
  tintColor?: ColorValue;
};

export function SymbolIcon({
  name,
  size = IconSize.sm,
  tintColor,
}: SymbolIconProps) {
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.android, web: name.web }}
      size={size}
      tintColor={tintColor}
      fallback={<View style={{ width: size, height: size }} />}
    />
  );
}

export const Symbols = {
  add: {
    ios: "plus",
    android: "add",
    web: "add",
  },
  filter: {
    ios: "line.3.horizontal.decrease.circle",
    android: "filter_list",
    web: "filter_list",
  },
  sort: {
    ios: "arrow.up.arrow.down",
    android: "swap_vert",
    web: "swap_vert",
  },
  chevronRight: {
    ios: "chevron.right",
    android: "arrow_forward_ios",
    web: "arrow_forward_ios",
  },
  gift: {
    ios: "gift",
    android: "card_giftcard",
    web: "card_giftcard",
  },
  radioOn: {
    ios: "checkmark.circle.fill",
    android: "radio_button_checked",
    web: "radio_button_checked",
  },
  radioOff: {
    ios: "circle",
    android: "radio_button_unchecked",
    web: "radio_button_unchecked",
  },
  error: {
    ios: "exclamationmark.triangle.fill",
    android: "warning",
    web: "warning",
  },
  refresh: {
    ios: "arrow.clockwise",
    android: "refresh",
    web: "refresh",
  },
  link: {
    ios: "link",
    android: "link",
    web: "link",
  },
} as const satisfies Record<string, CrossPlatformSymbol>;
