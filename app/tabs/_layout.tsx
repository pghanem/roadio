import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'spotify':
                            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
                            break;
                        case 'curator':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1DB954',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tabs.Screen
                name="spotify"
                options={{
                    title: 'Spotify',
                }}
            />
            <Tabs.Screen
                name="curator"
                options={{
                    title: 'Curator',
                }}
            />
        </Tabs>
    );
}