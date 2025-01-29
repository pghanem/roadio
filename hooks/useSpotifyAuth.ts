import { useMutation } from "@tanstack/react-query";
import { spotifyApi } from "../services/spotify";

export function useSpotifyAuth() {
    return useMutation({
        mutationFn: async (code: string) => {
            console.log('Starting token exchange with code:', code);
            try {
                const response = await spotifyApi.getToken(code);
                console.log('Token exchange response:', response);
                return response;
            } catch (error) {
                console.error("Token exchange error:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            spotifyApi.setAccessToken(data.access_token);
            console.log("Login successful, access token set");
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });
}