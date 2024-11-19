import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class SignUpViewModel extends Observable {
    private authService: AuthService;
    public email: string = '';
    public password: string = '';
    public name: string = '';

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async onSignUp() {
        try {
            const user = await this.authService.signUp(this.email, this.password);
            
            // Create initial user profile
            await firebase.firestore().collection('users').doc(user.uid).set({
                name: this.name,
                email: this.email,
                interests: [],
                groups: [],
                matches: [],
                bio: '',
                onboardingCompleted: false,
                createdAt: new Date()
            });

            // Navigate to onboarding
            Frame.topmost().navigate({
                moduleName: 'pages/onboarding/onboarding-page',
                context: { userId: user.uid }
            });
        } catch (error) {
            console.error('Sign up error:', error);
            alert('Failed to create account. Please try again.');
        }
    }
}