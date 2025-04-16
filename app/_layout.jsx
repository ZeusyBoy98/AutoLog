import { Appearance } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/data/colors"

const colorScheme = Appearance.getColorScheme();
let theme = colors[colorScheme]

global.theme = theme;

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
