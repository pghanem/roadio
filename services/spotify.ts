import { SPOTIFY_CONFIG } from "../config/env";

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export const spotifyApi = {
    getAuthUrl: () => {
        const params = new URLSearchParams({
            client_id: SPOTIFY_CONFIG.CLIENT_ID,
            response_type: "code",
            redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
            scope: SCOPES.join(" "),
        });
        return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
    },

    getToken: async (code: string): Promise<SpotifyTokenResponse> => {
        const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`),
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to get access token");
        }

        return response.json();
    },

    refreshToken: async (refreshToken: string): Promise<SpotifyTokenResponse> => {
        const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`),
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        return response.json();
    },
};

const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
] as const;
