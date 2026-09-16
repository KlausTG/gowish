import { SymbolIcon, Symbols } from "@/components/ui/symbol-icon";
import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type WishImageProps = {
  imageUrl?: string;
  size: number;
};

export function WishImage({ imageUrl, size }: WishImageProps) {
  const theme = useTheme();

  if (imageUrl) {
    return (
      <Image
        contentFit="cover"
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: Radius.md },
        ]}
        transition={200}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: Radius.md,
          backgroundColor: theme.backgroundElement,
        },
      ]}
    >
      <SymbolIcon
        name={Symbols.gift}
        size={size * 0.4}
        tintColor={theme.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#E8E8EC",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
