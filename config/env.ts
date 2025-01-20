import Constants from "expo-constants";

export const SPOTIFY_CONFIG = {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
    REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI!,
} as const;
