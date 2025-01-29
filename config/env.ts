import Constants from 'expo-constants';

export const OPENAI_CONFIG = {
    OPENAI_API_KEY: Constants.expoConfig?.extra?.OPENAI_API_KEY as string
};

export const SPOTIFY_CONFIG = {
    CLIENT_ID: Constants.expoConfig?.extra?.SPOTIFY_CLIENT_ID as string,
    CLIENT_SECRET: Constants.expoConfig?.extra?.SPOTIFY_CLIENT_SECRET as string,
    REDIRECT_URI_WEB: Constants.expoConfig?.extra?.SPOTIFY_REDIRECT_URI_WEB as string,
    REDIRECT_URI_NATIVE: Constants.expoConfig?.extra?.SPOTIFY_REDIRECT_URI_NATIVE as string,
};