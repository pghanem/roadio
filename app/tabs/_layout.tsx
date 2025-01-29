import { Tabs } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "spotify") {
                        iconName = "spotify";
                    } else if (route.name === "curator") {
                        iconName = "brain";
                    }

                    return <FontAwesome name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#1DB954",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tabs.Screen
                name="spotify"
                options={{
                    title: "Spotify"
                }}
            />
            <Tabs.Screen
                name="curator"
                options={{
                    title: "Curator"
                }}
            />
        </Tabs>
    );
}
