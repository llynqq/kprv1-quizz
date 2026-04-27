import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, BookOpen, CheckCircle } from 'lucide-react';
import { QuizState } from '../types';

interface SummaryScreenProps {
  quizState: QuizState;
  onRetake: (randomizeQuestions: boolean, randomizeAnswers: boolean) => void;
  onReview: () => void;
}

export function SummaryScreen({ quizState, onRetake, onReview }: SummaryScreenProps) {
  const [randomize, setRandomize] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const totalQuestions = quizState.questions.length;
  // Recalculate correctly from answers
  let correctCount = 0;
  Object.keys(quizState.answers).forEach(qId => {
    const q = quizState.questions.find(x => x.id === qId);
    if (q && q.correctOptionIndex === quizState.answers[qId]) {
      correctCount++;
    }
  });

  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const incorrectCount = totalQuestions - correctCount;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 relative z-10 w-full h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl backdrop-blur-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
        <p className="text-slate-400 mb-10">Here's how you performed on this material.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-10">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <div className="text-4xl font-mono font-bold text-emerald-400 mb-1">{Math.round(accuracy)}%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Accuracy</div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <div className="text-4xl font-mono font-bold text-white mb-1">{correctCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Correct</div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center">
            <div className="text-4xl font-mono font-bold text-red-400 mb-1">{incorrectCount}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Incorrect</div>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-center mb-10 gap-4 sm:gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={randomize}
                onChange={() => setRandomize(!randomize)}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors ${randomize ? 'bg-blue-600' : 'bg-white/10'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${randomize ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-slate-300 font-medium text-sm group-hover:text-white transition-colors">Randomize questions order</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={shuffleAnswers}
                onChange={() => setShuffleAnswers(!shuffleAnswers)}
              />
              <div className={`block w-12 h-6 rounded-full transition-colors ${shuffleAnswers ? 'bg-blue-600' : 'bg-white/10'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${shuffleAnswers ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-slate-300 font-medium text-sm group-hover:text-white transition-colors">Shuffle option answers</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => onRetake(randomize, shuffleAnswers)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-white font-medium"
          >
            <RefreshCw size={18} />
            Retake Quiz
          </button>
          
          {incorrectCount > 0 && (
            <button 
              onClick={onReview}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 transition-colors text-blue-400 font-medium"
            >
              <BookOpen size={18} />
              Review Incorrect
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
