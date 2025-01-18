import { useMutation } from "@tanstack/react-query";
import { spotifyApi } from "../services/spotify";

export function useSpotifyAuth() {
    return useMutation({
        mutationFn: spotifyApi.getToken,
        onSuccess: (data) => {
            console.log("Login successful:", data);
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });
}
