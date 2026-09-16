import "@/lib/polyfills";

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

import { QueryProvider } from "@/lib/query-provider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Wishlist",
              headerLargeTitle: true,
              headerShadowVisible: false,
              headerLargeTitleShadowVisible: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
