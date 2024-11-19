import { Observable } from '@nativescript/core';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Question, UserResponse } from '../../models/questionnaire.model';
import { Frame } from '@nativescript/core';

export class OnboardingViewModel extends Observable {
    private questionnaireService: QuestionnaireService;
    private questions: Question[] = [];
    private responses: UserResponse[] = [];
    private userId: string;

    public currentIndex: number = 0;
    public currentQuestion: Question;
    public sliderValue: number = 0;
    public textResponse: string = '';
    public selectedOptions: string[] = [];
    public isLastQuestion: boolean = false;

    constructor(userId: string) {
        super();
        this.questionnaireService = new QuestionnaireService();
        this.userId = userId;
        this.loadQuestionnaire();
    }

    async loadQuestionnaire() {
        try {
            const questionnaire = await this.questionnaireService.getQuestionnaire();
            this.questions = questionnaire.questions;
            this.updateCurrentQuestion();
        } catch (error) {
            console.error('Error loading questionnaire:', error);
        }
    }

    private updateCurrentQuestion() {
        this.currentQuestion = this.questions[this.currentIndex];
        this.isLastQuestion = this.currentIndex === this.questions.length - 1;
        
        // Reset response values
        this.sliderValue = this.currentQuestion.minValue || 0;
        this.textResponse = '';
        this.selectedOptions = [];
        
        this.notifyPropertyChange('currentQuestion', this.currentQuestion);
        this.notifyPropertyChange('isLastQuestion', this.isLastQuestion);
    }

    onOptionSelect(args) {
        const option = args.object.text;
        this.selectedOptions = [option];
        this.notifyPropertyChange('selectedOptions', this.selectedOptions);
    }

    onTagSelect(args) {
        const tag = args.object.text;
        const index = this.selectedOptions.indexOf(tag);
        
        if (index === -1) {
            this.selectedOptions.push(tag);
        } else {
            this.selectedOptions.splice(index, 1);
        }
        
        this.notifyPropertyChange('selectedOptions', this.selectedOptions);
    }

    isSelected(option: string): boolean {
        return this.selectedOptions.includes(option);
    }

    isTagSelected(tag: string): boolean {
        return this.selectedOptions.includes(tag);
    }

    async onNext() {
        // Save current response
        const response: UserResponse = {
            questionId: this.currentQuestion.id,
            response: this.getCurrentResponse()
        };
        this.responses.push(response);

        if (this.isLastQuestion) {
            await this.finishQuestionnaire();
        } else {
            this.currentIndex++;
            this.updateCurrentQuestion();
        }
    }

    onPrevious() {
        if (this.currentIndex > 0) {
            this.responses.pop(); // Remove last response
            this.currentIndex--;
            this.updateCurrentQuestion();
        }
    }

    private getCurrentResponse(): string | number | string[] {
        switch (this.currentQuestion.type) {
            case 'multiple_choice':
                return this.selectedOptions[0];
            case 'tags':
                return this.selectedOptions;
            case 'slider':
                return this.sliderValue;
            case 'text':
                return this.textResponse;
            default:
                return '';
        }
    }

    private async finishQuestionnaire() {
        try {
            await this.questionnaireService.submitResponses(this.userId, this.responses);
            Frame.topmost().navigate({
                moduleName: 'pages/home/home-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            alert('Failed to save your responses. Please try again.');
        }
    }
}