export interface Song {
    title: string;
    artist: string;
}

export interface ContextData {
    discover: boolean;
    vibe: string;
    weather: string;
    destination: string;
    location: string;
    useTime: boolean;
    time?: string;
}