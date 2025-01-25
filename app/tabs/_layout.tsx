import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "spotify") {
                        iconName = focused ? "musical-notes" : "musical-notes-outline";
                    } else if (route.name === "curator") {
                        iconName = focused ? "list" : "list-outline";
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#1DB954",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tabs.Screen name="spotify" />
            <Tabs.Screen name="curator" />
        </Tabs>
    );
}