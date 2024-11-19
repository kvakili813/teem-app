import { Observable } from '@nativescript/core';

export class InterestSelector extends Observable {
    private selectedInterests: string[] = [];
    public availableInterests = [
        'Hiking', 'Photography', 'Cooking', 'Gaming',
        'Music', 'Art', 'Sports', 'Reading', 'Travel',
        'Technology', 'Fitness', 'Movies'
    ];

    onInterestSelect(args: any) {
        const interest = args.object.text;
        const index = this.selectedInterests.indexOf(interest);
        
        if (index === -1) {
            this.selectedInterests.push(interest);
        } else {
            this.selectedInterests.splice(index, 1);
        }
        
        this.notifyPropertyChange('selectedInterests', this.selectedInterests);
    }

    isSelected(interest: string): boolean {
        return this.selectedInterests.includes(interest);
    }

    getSelectedInterests(): string[] {
        return [...this.selectedInterests];
    }
}