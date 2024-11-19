import { Observable } from '@nativescript/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';

export class ChatViewModel extends Observable {
    private chatService: ChatService;
    public messages: Message[] = [];
    public messageText: string = '';
    public chatPartner: User;
    public currentUser: User;

    constructor(chatPartner: User, currentUser: User) {
        super();
        this.chatService = new ChatService();
        this.chatPartner = chatPartner;
        this.currentUser = currentUser;
        this.subscribeToMessages();
    }

    private subscribeToMessages() {
        this.chatService.subscribeToMessages(this.currentUser.id, (messages) => {
            this.messages = messages.filter(msg => 
                msg.senderId === this.chatPartner.id || 
                msg.receiverId === this.chatPartner.id
            );
            this.notifyPropertyChange('messages', this.messages);
        });
    }

    async sendMessage() {
        if (!this.messageText.trim()) return;

        try {
            await this.chatService.sendMessage({
                senderId: this.currentUser.id,
                receiverId: this.chatPartner.id,
                content: this.messageText,
                timestamp: new Date(),
                read: false,
                type: 'text'
            });
            this.messageText = '';
            this.notifyPropertyChange('messageText', this.messageText);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}