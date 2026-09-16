import "@/global.css";
import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#c2ddff",
    textSecondary: "#60646C",
    accent: "#4397FF", // Brand color
    accentOnSurface: "#E6F4FE",
    border: "#D8D9E0",
    danger: "#E5484D",
    dangerSurface: "#FEEBEC",
    success: "#30A46C",
    overlay: "rgba(0, 0, 0, 0.45)",
    skeleton: "#E8E8EC",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#002e66",
    textSecondary: "#B0B4BA",
    accent: "#4397FF",
    accentOnSurface: "#0D2847",
    border: "#3A3F44",
    danger: "#F2555A",
    dangerSurface: "#3B1219",
    success: "#3DD68C",
    overlay: "rgba(0, 0, 0, 0.6)",
    skeleton: "#2E3135",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const IconSize = {
  sm: 22,
  md: 28,
  xl: 48,
} as const;

export const Typography = {
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "600" as const,
    fontFamily: Fonts?.sans,
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600" as const,
    fontFamily: Fonts?.sans,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
    fontFamily: Fonts?.sans,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700" as const,
    fontFamily: Fonts?.sans,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    fontFamily: Fonts?.sans,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    fontFamily: Fonts?.sans,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
