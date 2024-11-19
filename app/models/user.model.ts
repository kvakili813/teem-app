export interface User {
    id: string;
    name: string;
    email: string;
    interests: string[];
    groups: string[];
    matches: string[];
    bio: string;
    location: {
        latitude: number;
        longitude: number;
    };
}