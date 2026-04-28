import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  answers: Record<string, number>;
  currentQuestionIndex: number;
  onAnswer: (index: number) => void;
  onJumpToQuestion: (index: number) => void;
  onEndSession: () => void;
  accuracy: number;
}

export function QuizScreen({ questions, answers, currentQuestionIndex, onAnswer, onJumpToQuestion, onEndSession, accuracy }: QuizScreenProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Sync selectedOption with answers if revisiting an answered question
  React.useEffect(() => {
    const answeredIndex = answers[currentQuestion.id];
    if (answeredIndex !== undefined) {
      setSelectedOption(answeredIndex);
    } else {
      setSelectedOption(null);
    }
    setShowFeedback(false);
  }, [currentQuestion.id, answers]);

  const handleSelect = (index: number) => {
    if (showFeedback || answers[currentQuestion.id] !== undefined) return;
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Auto advance after 1.5 seconds
    setTimeout(() => {
      onAnswer(index);
      setShowFeedback(false);
    }, 1500);
  };

  const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="flex-1 flex p-4 sm:p-10 gap-6 sm:gap-10 overflow-hidden relative w-full h-full">
      <div className="flex-1 flex flex-col justify-start sm:justify-center max-w-2xl z-10 w-full mx-auto overflow-y-auto sm:overflow-visible pt-10 sm:pt-0 pb-20">
        
        {/* Mobile Navigation */}
        <div className="xl:hidden w-full overflow-x-auto pb-4 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => onJumpToQuestion(idx)}
                  className={`shrink-0 w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : isAnswered 
                        ? 'bg-white/20 text-white hover:bg-white/30' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="mb-10 w-full">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4 border border-blue-500/20">
                Question {currentQuestionIndex + 1} / {questions.length}
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-white mb-6">
                {currentQuestion.text}
              </h1>
              <p className="text-slate-400 leading-relaxed text-lg">
                Choose the best answer from the options below.
              </p>
            </div>

            <div className="space-y-4 w-full">
              {currentQuestion.options.map((option, idx) => {
                let stateClasses = "bg-white/5 border-white/5 hover:border-white/20 text-slate-300";
                let letterClasses = "bg-white/10 text-slate-400 group-hover:bg-white/20";
                
                const hasAnswered = answers[currentQuestion.id] !== undefined;
                const isCurrentlySelected = selectedOption === idx;
                const isActualCorrect = idx === currentQuestion.correctOptionIndex;

                if (showFeedback || hasAnswered) {
                  if (isActualCorrect && (hasAnswered || showFeedback)) {
                    stateClasses = "bg-emerald-500/20 border-emerald-500/50 text-white ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]";
                    letterClasses = "bg-emerald-500 text-white shadow-lg";
                  } else if (isCurrentlySelected) {
                    stateClasses = "bg-red-500/20 border-red-500/50 text-white ring-1 ring-red-500/50";
                    letterClasses = "bg-red-500 text-white shadow-lg";
                  } else {
                    stateClasses = "bg-white/5 border-white/5 opacity-50";
                  }
                } else if (isCurrentlySelected) {
                  stateClasses = "bg-blue-600/20 border-blue-500/50 text-white ring-1 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]";
                  letterClasses = "bg-blue-500 text-white shadow-lg";
                }

                return (
                  <motion.div 
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    whileTap={{ scale: (showFeedback || hasAnswered) ? 1 : 0.98 }}
                    className={`group cursor-pointer p-5 rounded-2xl border transition-all flex items-center gap-4 ${stateClasses} ${(showFeedback || hasAnswered) ? 'pointer-events-none' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors shrink-0 ${letterClasses}`}>
                      {letterMap[idx] || (idx + 1)}
                    </div>
                    <p className="font-medium flex-1">{option}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-72 flex flex-col gap-6 z-10 hidden xl:flex overflow-hidden">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => onJumpToQuestion(idx)}
                  className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : isAnswered 
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 ring-1 ring-emerald-500/30' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 shrink-0">
          <h3 className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mb-4">Session Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className={Object.keys(answers).length === questions.length ? "text-2xl font-bold font-mono text-emerald-400" : "text-2xl font-bold font-mono text-blue-400"}>
                  {Math.round((Object.keys(answers).length / questions.length) * 100)}%
                </div>
                <div className="text-[10px] text-slate-500 uppercase">Completion</div>
              </div>
            </div>
            <div className="h-[1px] bg-white/5 w-full"></div>
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-bold font-mono text-white">{Object.keys(answers).length} / {questions.length}</div>
                <div className="text-[10px] text-slate-500 uppercase">Answered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
