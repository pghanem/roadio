import { useEffect } from "react";
import { Linking } from "react-native";
import { Container, Main, Subtitle, Title, LoginButton, LoginButtonText } from "../styles/App.styles";
import { spotifyApi } from "../services/spotify";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";

export default function App() {
    const loginMutation = useSpotifyAuth();
    const isLoading = loginMutation.isPending;

    useEffect(() => {
        const subscription = Linking.addEventListener("url", (event) => {
            const url = event.url;
            const code = url.match(/code=([^&]*)/);

            if (code) {
                loginMutation.mutate(code[1]);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleSpotifyLogin = () => {
        const authUrl = spotifyApi.getAuthUrl();
        Linking.openURL(authUrl);
    };

    return (
        <Container>
            <Main>
                <Title>Welcome to Roadio</Title>
                <Subtitle>This is the first page of your app.</Subtitle>
                <Subtitle>Connect your Spotify account to get started</Subtitle>
                <LoginButton onPress={handleSpotifyLogin} disabled={isLoading}>
                    <LoginButtonText>{isLoading ? "Connecting..." : "Connect with Spotify"}</LoginButtonText>
                </LoginButton>
                {loginMutation.isError && (
                    <Subtitle style={{ color: "red" }}>Failed to connect. Please try again.</Subtitle>
                )}
            </Main>
        </Container>
    );
}
