import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { ContextData, Song } from "../../constants/types";
import { OPENAI_CONFIG } from "../../config/env";
import { useState } from "react";

export default function CuratorScreen() {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const mockContextData: ContextData = {
        discover: true,
        vibe: "EDM",
        weather: "dark rainy evening",
        temperature: 50,
        location: "powell river british columbia canada",
        time: "19:00",
    };

    const weights = {
        vibe: 30,
        weather: 25,
        temperature: 15,
        location: 20,
        time: 10,
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
                            content: `Given the following context and weights, suggest 3 songs that would be appropriate:
                                Context:
                                Discover: ${mockContextData.discover} - when discover is true, favour non-mainstream music.
                                Vibe: ${mockContextData.vibe} (${weights.vibe}%)
                                Weather: ${mockContextData.weather} (${weights.weather}%)
                                Temperature: ${mockContextData.temperature}°F (${weights.temperature}%)
                                Location: ${mockContextData.location} (${weights.location}%)
                                Time: ${mockContextData.time} (${weights.time}%)

                                Use these weights to prioritize the importance of each property when selecting the songs.

                                Return the response as a JSON array of objects with 'title', 'artist', and 'reason' properties. Each 'reason' should briefly explain why the song was selected, referencing the context and weights.
                                Example format: [{"title": "Song Name", "artist": "Artist Name", "reason": "Explanation of why this song fits."}]`,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const rawContent = data.choices[0].message.content;
            const jsonMatch = rawContent.match(/\[.*\]/s);

            if (!jsonMatch) {
                throw new Error("Could not find valid JSON in the response.");
            }

            const sanitizedJSON = jsonMatch[0];
            const parsedData = JSON.parse(sanitizedJSON);

            setSuggestions(parsedData.map((item: any) => ({ title: item.title, artist: item.artist })));
            setExplanations(parsedData.map((item: any) => item.reason));
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

            <ScrollView style={styles.suggestionsContainer}>
                {suggestions.map((song, index) => (
                    <View key={index} style={styles.songItem}>
                        <Text style={styles.songText}>
                            {song.title} - {song.artist}
                        </Text>
                        <Text style={styles.reasonText}>{explanations[index]}</Text>
                    </View>
                ))}
            </ScrollView>
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
        fontWeight: "bold",
    },
    reasonText: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
});
