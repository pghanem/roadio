export interface Song {
    title: string;
    artist: string;
}

export interface ContextData {
    discover: boolean;
    vibe: string;
    weather: string;
    destination: {
        latitude: number;
        longitude: number;
    };
    location: string;
    time: string;
}