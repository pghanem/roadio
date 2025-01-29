import { Platform } from 'react-native';
import { SPOTIFY_CONFIG } from "../config/env";

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

let accessToken: string | null = null;

interface SpotifyGenresResponse {
    genres: string[];
}

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export const spotifyApi = {
    getAuthUrl: () => {
        const redirectUri = Platform.select({
            web: SPOTIFY_CONFIG.REDIRECT_URI_WEB,
            default: SPOTIFY_CONFIG.REDIRECT_URI_NATIVE,
        });

        const params = new URLSearchParams({
            client_id: SPOTIFY_CONFIG.CLIENT_ID,
            response_type: "code",
            redirect_uri: redirectUri,
            scope: SCOPES.join(" "),
        });
        return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
    },

    getToken: async (code: string): Promise<SpotifyTokenResponse> => {
        const redirectUri = Platform.select({
            web: SPOTIFY_CONFIG.REDIRECT_URI_WEB,
            default: SPOTIFY_CONFIG.REDIRECT_URI_NATIVE,
        });

        const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(`${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`),
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to get access token");
        }

        return response.json();
    },

    setAccessToken: (token: string) => {
        accessToken = token;
    },

    getAvailableGenres: async (): Promise<string[]> => {
        if (!accessToken) {
            throw new Error('No access token available');
        }

        const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }

        const data: SpotifyGenresResponse = await response.json();
        return data.genres;
    },
};

const SCOPES = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
] as const;
