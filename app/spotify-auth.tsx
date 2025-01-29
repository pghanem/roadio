import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';

export default function SpotifyAuth() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const loginMutation = useSpotifyAuth();

    useEffect(() => {
        const code = Platform.select({
            web: params.code,
            default: (() => {
                const codeParam = params.code;
                const urlParam = params.url;
                if (typeof urlParam === 'string') {
                    return codeParam || urlParam.match(/code=([^&]*)/)?.[1];
                }
                return codeParam;
            })(),
        });

        if (code) {
            loginMutation.mutate(code as string, {
                onSuccess: () => {
                    router.replace('/tabs/spotify');
                },
                onError: () => {
                    router.replace('/');
                },
            });
        }
    }, [params.code, params.url]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Connecting to Spotify...</Text>
        </View>
    );
}