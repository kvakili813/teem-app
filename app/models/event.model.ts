export interface Event {
    id: string;
    title: string;
    description: string;
    activity: string;
    date: Date;
    location: {
        name: string;
        latitude: number;
        longitude: number;
    };
    organizer: string;
    participants: string[];
    maxParticipants?: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}