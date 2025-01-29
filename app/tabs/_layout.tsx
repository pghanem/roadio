import { Tabs } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconColor = color;

                    if (route.name === "spotify") {
                        iconName = "spotify";
                        iconColor = "#1DB954";
                    } else if (route.name === "curator") {
                        iconName = "music";
                    }

                    return <FontAwesome name={iconName} size={size} color={iconColor} />;
                },
                tabBarActiveTintColor: "#1E90FF",
                tabBarInactiveTintColor: "#B0B0B0",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopColor: "#E0E0E0",
                    paddingVertical: 8,
                    height: 60,
                },
            })}
        >
            <Tabs.Screen
                name="spotify"
                options={{
                    title: "Spotify",
                    tabBarStyle: {
                        backgroundColor: "#E6F0FF",
                        borderRadius: 15,
                        marginHorizontal: 10,
                        height: 60,
                    },
                }}
            />
            <Tabs.Screen
                name="curator"
                options={{
                    title: "Curator",
                    tabBarStyle: {
                        backgroundColor: "#E6F0FF",
                        borderRadius: 15,
                        marginHorizontal: 10,
                        height: 60,
                    },
                }}
            />
        </Tabs>
    );
}
