require("dotenv").config();

module.exports = {
    expo: {
        name: "roadio",
        slug: "roadio",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
            SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
            SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        },
    },
};