import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
    );
}