import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';

export default function SpotifyAuth() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const loginMutation = useSpotifyAuth();

    useEffect(() => {
        const extractCode = (url: string) => {
            // Remove the #_=_ fragment and extract the code
            const cleanUrl = url.replace('#_=_', '');
            const codeMatch = cleanUrl.match(/code=([^&]*)/);
            return codeMatch ? decodeURIComponent(codeMatch[1]) : null;
        };

        const getCode = () => {
            if (Platform.OS === 'web') {
                // For web, check if code is in params or in URL
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('code') || params.code;
            }

            const codeParam = params.code;
            const urlParam = params.url;

            if (typeof urlParam === 'string') {
                return codeParam || extractCode(urlParam);
            }
            return codeParam;
        };

        const code = getCode();

        if (code) {
            console.log('Attempting authentication with code:', code);
            loginMutation.mutate(code as string, {
                onSuccess: () => {
                    console.log('Authentication successful, navigating to spotify tab');
                    router.replace('/tabs/spotify');
                },
                onError: (error) => {
                    console.error('Authentication error:', error);
                    router.replace('/');
                },
            });
        } else {
            console.warn('No authentication code found in params:', params);
        }
    }, [params.code, params.url]);

    if (loginMutation.isError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ marginBottom: 10 }}>Failed to connect to Spotify</Text>
                <Text style={{ color: 'red', textAlign: 'center' }}>
                    {loginMutation.error instanceof Error
                        ? loginMutation.error.message
                        : 'An unknown error occurred'}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginBottom: 10 }}>Connecting to Spotify...</Text>
            {loginMutation.isPending && (
                <Text style={{ color: '#666' }}>Processing authentication...</Text>
            )}
        </View>
    );
}