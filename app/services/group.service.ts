import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Group } from '../models/group.model';

export class GroupService {
    private db = firebase.firestore();

    async createGroup(group: Omit<Group, 'id'>): Promise<string> {
        try {
            const docRef = await this.db.collection('groups').add(group);
            return docRef.id;
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    }

    async joinGroup(groupId: string, userId: string): Promise<void> {
        try {
            await this.db.collection('groups').doc(groupId).update({
                members: firebase.firestore.FieldValue.arrayUnion(userId)
            });
        } catch (error) {
            console.error('Error joining group:', error);
            throw error;
        }
    }

    async getGroupsByActivity(activity: string): Promise<Group[]> {
        try {
            const snapshot = await this.db.collection('groups')
                .where('activity', '==', activity)
                .get();
            
            return snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as Group));
        } catch (error) {
            console.error('Error getting groups:', error);
            throw error;
        }
    }
}