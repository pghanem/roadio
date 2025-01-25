import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { ContextData, Song } from "../../constants/types";
import { OPENAI_CONFIG } from "../../config/env";
import { useState } from "react";

export default function CuratorScreen() {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const mockContextData: ContextData = {
        vibe: "EDM",
        weather: "dark rainy evening",
        temperature: 50,
        location: "powell river british columbia canada",
        time: "19:00",
    };

    const getSongSuggestions = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_CONFIG.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `Given the following context, suggest 3 songs that would be appropriate:
              Vibe: ${mockContextData.vibe}
              Weather: ${mockContextData.weather}
              Temperature: ${mockContextData.temperature}°F
              Location: ${mockContextData.location}
              Time: ${mockContextData.time}
              
              Return the response as a JSON array with song objects containing 'title' and 'artist' properties only.
              Example format: [{"title": "Song Name", "artist": "Artist Name"}]`,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const suggestedSongs: Song[] = JSON.parse(data.choices[0].message.content);
            setSuggestions(suggestedSongs);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error getting suggestions:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Get Song Suggestions" onPress={getSongSuggestions} disabled={loading} />

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            {error && <Text style={styles.errorText}>Error: {error}</Text>}

            <View style={styles.suggestionsContainer}>
                {suggestions.map((song, index) => (
                    <View key={index} style={styles.songItem}>
                        <Text style={styles.songText}>
                            {song.title} - {song.artist}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    loadingContainer: {
        marginVertical: 20,
    },
    errorText: {
        color: "red",
        marginVertical: 10,
    },
    suggestionsContainer: {
        marginTop: 20,
    },
    songItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    songText: {
        fontSize: 16,
    },
});