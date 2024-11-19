export interface Question {
    id: string;
    text: string;
    type: 'multiple_choice' | 'slider' | 'text' | 'tags';
    options?: string[];
    minValue?: number;
    maxValue?: number;
}

export interface UserResponse {
    questionId: string;
    response: string | number | string[];
}

export interface Questionnaire {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}