import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView, TextInput, Switch, useColorScheme } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { ContextData, Song } from "../../constants/types";
import { OPENAI_CONFIG } from "../../config/env";
import { useState } from "react";

export default function CuratorScreen() {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [explanations, setExplanations] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const themeColors = {
        background: isDarkMode ? '#1a1a1a' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#000000',
        card: isDarkMode ? '#2d2d2d' : '#f5f5f5',
        border: isDarkMode ? '#404040' : '#cccccc',
    };

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
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.themeToggle}>
                <Text style={[styles.themeText, { color: themeColors.text }]}>
                    {isDarkMode ? '🌙' : '☀️'} Theme
                </Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                />
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.switchContainer}>
                    <Text style={{ color: themeColors.text }}>Discover Mode:</Text>
                    <Switch
                        value={contextData.discover}
                        onValueChange={(value) => updateContextData('discover', value)}
                    />
                </View>

                <View style={styles.inputField}>
                    <Text style={{ color: themeColors.text }}>Vibe:</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text }]}
                        value={contextData.vibe}
                        onChangeText={(text) => updateContextData('vibe', text)}
                        placeholder="Enter vibe (e.g., EDM, Chill, Rock)"
                        placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    />
                </View>

                <View style={styles.inputField}>
                    <Text style={{ color: themeColors.text }}>Weather:</Text>
                    <View style={[styles.pickerContainer, { backgroundColor: themeColors.card }]}>
                        <Picker
                            selectedValue={contextData.weather}
                            onValueChange={(value) => updateContextData('weather', value)}
                            style={[styles.picker, {  backgroundColor: themeColors.card, color: themeColors.text }]}
                        >
                            {weatherOptions.map((weather) => (
                                <Picker.Item
                                    key={weather}
                                    label={weather.charAt(0).toUpperCase() + weather.slice(1)}
                                    value={weather}
                                    color={themeColors.text}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputField}>
                    <Text style={{ color: themeColors.text }}>Destination:</Text>
                    <TextInput
                        style={[styles.input, styles.coordinateInput, { backgroundColor: themeColors.card, color: themeColors.text }]}
                        value={contextData.destination.toString()}
                        onChangeText={(text) => updateContextData('destination', text)}
                        placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    />
                </View>

                <View style={styles.inputField}>
                    <Text style={{ color: themeColors.text }}>Location:</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text }]}
                        value={contextData.location}
                        onChangeText={(text) => updateContextData('location', text)}
                        placeholder="Enter location"
                        placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text style={{ color: themeColors.text }}>Use Current Time:</Text>
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
                    <View style={[styles.timeDisplay, { backgroundColor: themeColors.card }]}>
                        <Text style={{ color: themeColors.text }}>Current Time: {contextData.time}</Text>
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
                    <ActivityIndicator size="large" color={isDarkMode ? '#ffffff' : '#0000ff'} />
                </View>
            )}

            {error && <Text style={styles.errorText}>Error: {error}</Text>}

            <View style={styles.suggestionsContainer}>
                {suggestions.map((song, index) => (
                    <View key={index} style={[styles.songItem, { backgroundColor: themeColors.card }]}>
                        <Text style={[styles.songText, { color: themeColors.text }]}>
                            {song.title} - {song.artist}
                        </Text>
                        <Text style={[styles.reasonText, { color: isDarkMode ? '#bbbbbb' : '#555555' }]}>
                            {explanations[index]}
                        </Text>
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
    themeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
    },
    themeText: {
        fontSize: 16,
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
        marginBottom: 10,
        borderRadius: 8,
    },
    songText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    reasonText: {
        fontSize: 14,
        marginTop: 5,
    },
    timeDisplay: {
        marginTop: 5,
        marginBottom: 15,
        padding: 8,
        borderRadius: 5,
    },
});