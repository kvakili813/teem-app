import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Questionnaire, UserResponse } from '../models/questionnaire.model';

export class QuestionnaireService {
    private db = firebase.firestore();

    async getQuestionnaire(): Promise<Questionnaire> {
        try {
            const doc = await this.db.collection('questionnaires')
                .doc('onboarding')
                .get();
            return { id: doc.id, ...doc.data() } as Questionnaire;
        } catch (error) {
            console.error('Error getting questionnaire:', error);
            throw error;
        }
    }

    async submitResponses(userId: string, responses: UserResponse[]): Promise<void> {
        try {
            await this.db.collection('users').doc(userId).update({
                questionnaireResponses: responses,
                onboardingCompleted: true,
                interests: this.processInterests(responses)
            });
        } catch (error) {
            console.error('Error submitting responses:', error);
            throw error;
        }
    }

    private processInterests(responses: UserResponse[]): string[] {
        // Extract interests from responses based on specific questions
        return responses
            .filter(r => r.questionId === 'interests' && Array.isArray(r.response))
            .flatMap(r => r.response as string[]);
    }
}