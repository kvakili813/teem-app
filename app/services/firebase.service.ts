import { firebase } from '@nativescript/firebase-core';

export function initializeFirebase() {
    firebase.initializeApp({
        // Firebase config will be auto-injected in preview
    }).then(() => {
        console.log('Firebase initialized successfully');
    }).catch(error => {
        console.error('Firebase initialization error:', error);
    });
}