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
  status: 'start' | 'quiz' | 'summary' | 'review' | 'zkouska_setup';
  mode?: 'zapocet' | 'zkouska';
}
