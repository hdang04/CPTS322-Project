import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function MenuStack() {
    return <Stack>
        <Stack.Screen name="index" options={{ title: 'Menu', 
        headerRight: () => (
            <Link href="/(admin)/menu/addItem" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <FontAwesome
                        name="upload"
                        size={25}
                        color="black"
                        style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                        />
                    )}
                </Pressable>
            </Link>
        )}} />
    </Stack>;
}