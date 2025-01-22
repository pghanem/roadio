import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SpotifyScreen from "@/tabs/spotify";
import CuratorScreen from "@/tabs/curator";
import { Ionicons } from "@expo/vector-icons";

type RootTabParamList = {
    Spotify: undefined;
    Curator: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Spotify") {
                            iconName = focused ? "musical-notes" : "musical-notes-outline";
                        } else if (route.name === "Curator") {
                            iconName = focused ? "list" : "list-outline";
                        }

                        return <Ionicons name={iconName as any} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "#1DB954",
                    tabBarInactiveTintColor: "gray",
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Spotify" component={SpotifyScreen} />
                <Tab.Screen name="Curator" component={CuratorScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
