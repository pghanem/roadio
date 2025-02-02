import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, TextInput, Switch } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { ContextData, Song } from "../../constants/types";
import { OPENAI_CONFIG } from "../../config/env";
import { useState } from "react";

export default function CuratorScreen() {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [contextData, setContextData] = useState<ContextData>({
        discover: true,
        vibe: "EDM",
        weather: "sunny",
        destination: "whistler",
        location: "powell river british columbia canada",
        useTime: false,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
    });

    const weatherOptions = [
        "sunny",
        "partly cloudy",
        "cloudy",
        "raining",
        "thunderstorm",
        "snowing",
        "foggy",
        "clear skies"
    ];

    const weights = {
        vibe: 30,
        weather: 30,
        location: 25,
        time: 15,
    };

    const updateContextData = (field: keyof ContextData, value: any) => {
        setContextData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getSongSuggestions = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            if (contextData.useTime) {
                setContextData(prev => ({
                    ...prev,
                    time: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                }));
            }

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
                                Discover: ${contextData.discover} - when discover is true, favour non-mainstream music.
                                Vibe: ${contextData.vibe} (${weights.vibe}%)
                                Weather: ${contextData.weather} (${weights.weather}%)
                                Destination: ${contextData.destination} (${weights.location}%)
                                Location: ${contextData.location} (${weights.location}%)
                                ${contextData.useTime ? `Time: ${contextData.time} (${weights.time}%)` : ''}

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
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.switchContainer}>
                    <Text>Discover Mode:</Text>
                    <Switch
                        value={contextData.discover}
                        onValueChange={(value) => updateContextData('discover', value)}
                    />
                </View>

                <View style={styles.inputField}>
                    <Text>Vibe:</Text>
                    <TextInput
                        style={styles.input}
                        value={contextData.vibe}
                        onChangeText={(text) => updateContextData('vibe', text)}
                        placeholder="Enter vibe (e.g., EDM, Chill, Rock)"
                    />
                </View>

                <View style={styles.inputField}>
                    <Text>Weather:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={contextData.weather}
                            onValueChange={(value) => updateContextData('weather', value)}
                            style={styles.picker}
                        >
                            {weatherOptions.map((weather) => (
                                <Picker.Item
                                    key={weather}
                                    label={weather.charAt(0).toUpperCase() + weather.slice(1)}
                                    value={weather}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputField}>
                    <Text>Destination:</Text>
                    <TextInput
                        style={[styles.input, styles.coordinateInput]}
                        value={contextData.destination.toString()}
                        onChangeText={(text) =>
                            updateContextData('destination', text)
                        }
                    />
                </View>

                <View style={styles.inputField}>
                    <Text>Location:</Text>
                    <TextInput
                        style={styles.input}
                        value={contextData.location}
                        onChangeText={(text) => updateContextData('location', text)}
                        placeholder="Enter location"
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text>Use Current Time:</Text>
                    <Switch
                        value={contextData.useTime}
                        onValueChange={(value) => {
                            updateContextData('useTime', value);
                            if (value) {
                                updateContextData('time', new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }));
                            }
                        }}
                    />
                </View>
                {contextData.useTime && (
                    <View style={styles.timeDisplay}>
                        <Text>Current Time: {contextData.time}</Text>
                    </View>
                )}
            </View>

            <Button
                title="Get Song Suggestions"
                onPress={getSongSuggestions}
                disabled={loading}
            />

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
                        <Text style={styles.reasonText}>{explanations[index]}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputField: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginTop: 5,
        backgroundColor: 'white',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
    },
    picker: {
        height: 50,
    },
    coordinatesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    coordinateInput: {
        flex: 0.48,
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
    timeDisplay: {
        marginTop: 5,
        marginBottom: 15,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});