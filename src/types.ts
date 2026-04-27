export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>; 
  status: 'upload' | 'loading' | 'quiz' | 'summary' | 'review';
}
