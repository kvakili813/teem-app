import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Message } from '../models/message.model';

export class ChatService {
    private db = firebase.firestore();

    async sendMessage(message: Omit<Message, 'id'>): Promise<string> {
        try {
            const docRef = await this.db.collection('messages').add({
                ...message,
                timestamp: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    subscribeToMessages(userId: string, callback: (messages: Message[]) => void) {
        return this.db.collection('messages')
            .where('receiverId', '==', userId)
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Message));
                callback(messages);
            });
    }

    async markAsRead(messageId: string): Promise<void> {
        try {
            await this.db.collection('messages').doc(messageId).update({
                read: true
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }
}