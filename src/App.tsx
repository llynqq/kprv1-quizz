import React, { useState, useEffect } from 'react';
import { QuizScreen } from './components/QuizScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { AuroraBackground } from './components/AuroraBackground';
import { predefinedQuestions } from './data/questions';
import { QuizState, Question } from './types';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleOptionsForQuestion(question: Question): Question {
  const optionsWithIndex = question.options.map((opt, i) => ({ text: opt, originalIndex: i }));
  const shuffledOptions = shuffleArray(optionsWithIndex);
  const newCorrectIndex = shuffledOptions.findIndex(opt => opt.originalIndex === question.correctOptionIndex);
  
  return {
    ...question,
    options: shuffledOptions.map(opt => opt.text),
    correctOptionIndex: newCorrectIndex,
  };
}

export default function App() {
  const [state, setState] = useState<QuizState>({
    questions: predefinedQuestions,
    currentQuestionIndex: 0,
    answers: {},
    status: 'quiz'
  });
  
  const [error, setError] = useState<string | undefined>();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.status === 'quiz') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.status]);

  const currentQuestion = state.questions[state.currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    setState(prev => {
      const newAnswers = { ...prev.answers, [currentQuestion.id]: optionIndex };
      const isComplete = prev.currentQuestionIndex >= prev.questions.length - 1;
      
      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: isComplete ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
        status: isComplete ? 'summary' : 'quiz'
      };
    });
  };

  const handleEndSession = () => {
    setState(prev => ({ ...prev, status: 'summary' }));
  };

  const handleRetake = (randomizeQuestions: boolean, randomizeAnswers: boolean) => {
    let newQuestions = [...predefinedQuestions];
    
    if (randomizeAnswers) {
      newQuestions = newQuestions.map(shuffleOptionsForQuestion);
    }
    
    if (randomizeQuestions) {
      newQuestions = shuffleArray(newQuestions);
    }

    setState(prev => ({
      ...prev,
      questions: newQuestions,
      currentQuestionIndex: 0,
      answers: {},
      status: 'quiz'
    }));
    setSessionTime(0);
  };

  const handleRestart = () => {
    setState({
      questions: predefinedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      status: 'quiz'
    });
    setSessionTime(0);
    setError(undefined);
  };

  const handleReview = () => {
    setState(prev => ({ ...prev, status: 'review' }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = Object.keys(state.answers).length > 0
    ? (Object.keys(state.answers).filter(qId => {
        const q = state.questions.find(x => x.id === qId);
        return q && q.correctOptionIndex === state.answers[qId];
      }).length / Object.keys(state.answers).length) * 100
    : 0;

  const getIncorrectAnswers = () => {
    return state.questions
      .filter(q => state.answers[q.id] !== undefined && state.answers[q.id] !== q.correctOptionIndex)
      .map(q => ({ question: q, selectedOptionIndex: state.answers[q.id] }));
  };

  return (
    <div className="bg-[#09090B] text-slate-100 w-full min-h-screen overflow-hidden flex flex-col relative font-sans selection:bg-blue-500/30">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${state.questions.length > 0 ? (Object.keys(state.answers).length / state.questions.length) * 100 : 0}%` }}
        ></div>
      </div>

      <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 px-4 sm:px-10 py-4 sm:py-6 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 shadow-sm">KPRV1</span>
          </div>
          
          <div className="sm:hidden flex gap-2">
            {state.status === 'quiz' && (
              <button 
                onClick={handleEndSession}
                className="px-4 py-2 rounded-full bg-white text-black hover:bg-slate-200 transition-colors text-xs font-bold shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap"
              >
                End Session
              </button>
            )}
            {(state.status === 'summary' || state.status === 'review') && (
              <button 
                onClick={handleRestart}
                className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium whitespace-nowrap"
              >
                Restart Session
              </button>
            )}
          </div>
        </div>

        {state.status === 'quiz' && (
          <div className="flex items-center justify-center gap-6 sm:gap-8 w-full sm:w-auto">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">Time</div>
              <div className="text-lg font-medium font-mono tracking-wider">{formatTime(sessionTime)}</div>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1">Accuracy</div>
              <div className="text-lg font-medium text-emerald-400 font-mono tracking-wider">{Math.round(accuracy)}%</div>
            </div>
          </div>
        )}

        <div className="hidden sm:flex gap-3">
          {state.status === 'quiz' && (
            <button 
              onClick={handleEndSession}
              className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-slate-200 transition-colors text-sm font-bold shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap"
            >
              End Session
            </button>
          )}
          {(state.status === 'summary' || state.status === 'review') && (
            <button 
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Restart Session
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative w-full h-[calc(100vh-88px)]">
        <AuroraBackground />
        
        {state.status === 'quiz' && (
          <QuizScreen 
            questions={state.questions} 
            currentQuestionIndex={state.currentQuestionIndex} 
            onAnswer={handleAnswer} 
            onEndSession={handleEndSession} 
            accuracy={accuracy}
          />
        )}
        {state.status === 'summary' && (
          <SummaryScreen 
            quizState={state} 
            onRetake={handleRetake} 
            onReview={handleReview}
          />
        )}
        {state.status === 'review' && (
          <ReviewScreen 
            incorrectAnswers={getIncorrectAnswers()} 
            onComplete={() => setState(prev => ({ ...prev, status: 'summary' }))} 
          />
        )}
      </main>
    </div>
  );
}
