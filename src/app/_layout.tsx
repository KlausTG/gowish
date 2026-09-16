import "@/lib/polyfills";
import { QueryProvider } from "@/lib/query-provider";
import { useTheme } from "@/hooks/use-theme";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              contentStyle: {
                backgroundColor: theme.background,
              },
              title: "Wishlist",
              headerLargeTitle: true,
              headerShadowVisible: false,
              headerLargeTitleShadowVisible: false,
              headerStyle: {
                backgroundColor: theme.backgroundMuted,
              },
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
