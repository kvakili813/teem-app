export interface Group {
    id: string;
    name: string;
    activity: string;
    members: string[];
    createdAt: Date;
    description: string;
    meetupLocation?: {
        latitude: number;
        longitude: number;
    };
}