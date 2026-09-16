import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";

type WishImageProps = {
  imageUrl?: string;
  size: number;
};

export function WishImage({ imageUrl, size }: WishImageProps) {
  const theme = useTheme();
  const frameStyle = {
    width: size,
    height: size,
    borderRadius: Radius.md,
  };

  if (imageUrl) {
    return (
      <Image
        contentFit="cover"
        source={{ uri: imageUrl }}
        style={[styles.image, frameStyle]}
        transition={200}
      />
    );
  }

  const gradient = `linear-gradient(135deg, ${theme.accentOnSurface}, ${theme.accent})`;

  return (
    <View
      style={[
        frameStyle,
        { backgroundColor: theme.accentOnSurface },
        Platform.select({
          web: { backgroundImage: gradient },
          default: { experimental_backgroundImage: gradient },
        }),
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#E8E8EC",
  },
});
