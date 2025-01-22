import Constants from "expo-constants";

if (!Constants.expoConfig?.extra?.SPOTIFY_CLIENT_ID) {
    throw new Error("SPOTIFY_CLIENT_ID is not defined in app config");
}

export const SPOTIFY_CONFIG = {
    CLIENT_ID: Constants.expoConfig?.extra?.SPOTIFY_CLIENT_ID ?? "",
    CLIENT_SECRET: Constants.expoConfig?.extra?.SPOTIFY_CLIENT_SECRET ?? "",
    REDIRECT_URI: Constants.expoConfig?.extra?.SPOTIFY_REDIRECT_URI ?? "",
} as const;

export const OPENAI_CONFIG = {
    OPENAI_ID: Constants.expoConfig?.extra?.OPENAI_ID ?? "",
} as const;
