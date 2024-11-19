import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { User } from '../models/user.model';

export class MatchingService {
    private db = firebase.firestore();

    async findMatches(currentUser: User): Promise<User[]> {
        try {
            const usersRef = this.db.collection('users');
            const snapshot = await usersRef
                .where('interests', 'array-contains-any', currentUser.interests)
                .get();

            const matches = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as User))
                .filter(user => 
                    user.id !== currentUser.id && 
                    this.calculateMatchScore(currentUser, user) > 0.5
                );

            return matches;
        } catch (error) {
            console.error('Error finding matches:', error);
            throw error;
        }
    }

    private calculateMatchScore(user1: User, user2: User): number {
        const commonInterests = user1.interests.filter(interest => 
            user2.interests.includes(interest)
        );
        return commonInterests.length / Math.max(user1.interests.length, user2.interests.length);
    }
}