import { Observable } from '@nativescript/core';
import { MatchingService } from '../../services/matching.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Group } from '../../models/group.model';
import { Frame } from '@nativescript/core';

export class HomeViewModel extends Observable {
    private matchingService: MatchingService;
    private groupService: GroupService;
    private authService: AuthService;

    public matches: User[] = [];
    public groups: Group[] = [];
    public currentUser: User;

    constructor() {
        super();
        this.matchingService = new MatchingService();
        this.groupService = new GroupService();
        this.authService = new AuthService();
        this.loadData();
    }

    async loadData() {
        try {
            // Simulated current user - in real app, get from Firebase Auth
            this.currentUser = {
                id: 'current-user-id',
                name: 'John Doe',
                email: 'john@example.com',
                interests: ['hiking', 'photography', 'cooking'],
                groups: [],
                matches: [],
                bio: 'Love outdoor activities and meeting new people!',
                location: {
                    latitude: 0,
                    longitude: 0
                }
            };

            this.matches = await this.matchingService.findMatches(this.currentUser);
            this.notifyPropertyChange('matches', this.matches);

            // Load groups based on user's interests
            const groups = await Promise.all(
                this.currentUser.interests.map(interest => 
                    this.groupService.getGroupsByActivity(interest)
                )
            );
            this.groups = groups.flat();
            this.notifyPropertyChange('groups', this.groups);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async onJoinGroup(args) {
        const group = args.object.bindingContext as Group;
        try {
            await this.groupService.joinGroup(group.id, this.currentUser.id);
            alert(`Successfully joined ${group.name}!`);
        } catch (error) {
            console.error('Error joining group:', error);
            alert('Failed to join group. Please try again.');
        }
    }

    async onSignOut() {
        try {
            await this.authService.signOut();
            Frame.topmost().navigate({
                moduleName: 'pages/login/login-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    onEditProfile() {
        Frame.topmost().navigate('pages/profile/profile-page');
    }
}