import { Text, type TextProps, type TextStyle } from "react-native";

import {
  type ThemeColor,
  Typography,
  type TypographyVariant,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type UITextProps = TextProps & {
  variant?: TypographyVariant;
  color?: ThemeColor;
};

export function UIText({
  style,
  variant = "body",
  color = "text",
  ...rest
}: UITextProps) {
  const theme = useTheme();
  const typography = Typography[variant] as TextStyle;

  return (
    <Text style={[{ color: theme[color] }, typography, style]} {...rest} />
  );
}
