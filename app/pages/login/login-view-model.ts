import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
    private authService: AuthService;
    public email: string = '';
    public password: string = '';

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async onSignIn() {
        try {
            await this.authService.signIn(this.email, this.password);
            Frame.topmost().navigate({
                moduleName: 'pages/home/home-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Invalid credentials. Please try again.');
        }
    }

    async onSignUp() {
        Frame.topmost().navigate('pages/signup/signup-page');
    }
}