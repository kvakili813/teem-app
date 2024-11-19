import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';

export class AuthService {
    async signUp(email: string, password: string) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    async signIn(email: string, password: string) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }
}