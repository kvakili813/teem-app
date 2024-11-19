import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Event } from '../models/event.model';

export class EventService {
    private db = firebase.firestore();

    async createEvent(event: Omit<Event, 'id'>): Promise<string> {
        try {
            const docRef = await this.db.collection('events').add(event);
            return docRef.id;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    async joinEvent(eventId: string, userId: string): Promise<void> {
        try {
            await this.db.collection('events').doc(eventId).update({
                participants: firebase.firestore.FieldValue.arrayUnion(userId)
            });
        } catch (error) {
            console.error('Error joining event:', error);
            throw error;
        }
    }

    async getUpcomingEvents(): Promise<Event[]> {
        try {
            const snapshot = await this.db.collection('events')
                .where('status', '==', 'upcoming')
                .orderBy('date')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Event));
        } catch (error) {
            console.error('Error getting events:', error);
            throw error;
        }
    }
}