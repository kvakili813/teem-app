import { Observable } from '@nativescript/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Frame } from '@nativescript/core';

export class EventsViewModel extends Observable {
    private eventService: EventService;
    public events: Event[] = [];
    public currentUser: any;

    constructor() {
        super();
        this.eventService = new EventService();
        this.loadEvents();
    }

    async loadEvents() {
        try {
            this.events = await this.eventService.getUpcomingEvents();
            this.notifyPropertyChange('events', this.events);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    async onJoinEvent(args: any) {
        const event = args.object.bindingContext as Event;
        try {
            await this.eventService.joinEvent(event.id, this.currentUser.id);
            await this.loadEvents();
            alert(event.participants.includes(this.currentUser.id) ? 
                'Successfully left the event' : 
                'Successfully joined the event');
        } catch (error) {
            console.error('Error joining/leaving event:', error);
            alert('Failed to update event participation. Please try again.');
        }
    }

    createEvent() {
        Frame.topmost().navigate('pages/events/create-event-page');
    }
}