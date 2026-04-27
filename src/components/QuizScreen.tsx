import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (index: number) => void;
  onEndSession: () => void;
  accuracy: number;
}

export function QuizScreen({ questions, currentQuestionIndex, onAnswer, onEndSession, accuracy }: QuizScreenProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Auto advance after 2 seconds
    setTimeout(() => {
      onAnswer(index);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 2000);
  };

  const isCorrect = selectedOption === currentQuestion.correctOptionIndex;

  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="flex-1 flex p-4 sm:p-10 gap-6 sm:gap-10 overflow-hidden relative w-full h-full">
      <div className="flex-1 flex flex-col justify-start sm:justify-center max-w-2xl z-10 w-full mx-auto overflow-y-auto sm:overflow-visible pt-10 sm:pt-0">
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
                Question {currentQuestionIndex + 1}
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white mb-6">
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
                
                if (showFeedback) {
                  if (idx === currentQuestion.correctOptionIndex) {
                    stateClasses = "bg-emerald-500/20 border-emerald-500/50 text-white ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]";
                    letterClasses = "bg-emerald-500 text-white shadow-lg";
                  } else if (idx === selectedOption) {
                    stateClasses = "bg-red-500/20 border-red-500/50 text-white ring-1 ring-red-500/50";
                    letterClasses = "bg-red-500 text-white shadow-lg";
                  } else {
                    stateClasses = "bg-white/5 border-white/5 opacity-50";
                  }
                } else if (selectedOption === idx) {
                  stateClasses = "bg-blue-600/20 border-blue-500/50 text-white ring-1 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]";
                  letterClasses = "bg-blue-500 text-white shadow-lg";
                }

                return (
                  <motion.div 
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                    className={`group cursor-pointer p-5 rounded-2xl border transition-all flex items-center gap-4 ${stateClasses} ${showFeedback ? 'pointer-events-none' : ''}`}
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

      <div className="w-72 flex flex-col gap-6 z-10 hidden xl:flex">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Context Extraction</h3>
          <div className="aspect-[3/4] w-full bg-[#121214] border border-white/10 rounded-lg overflow-hidden flex flex-col p-3 shadow-inner">
            <div className="w-full h-3 bg-white/5 rounded-full mb-2"></div>
            <div className="w-4/5 h-3 bg-white/5 rounded-full mb-4"></div>
            <div className="w-full h-12 bg-red-900/20 border border-red-500/30 rounded flex items-center px-2 mb-2">
              <div className="w-full h-4 bg-red-400/20 rounded animate-pulse"></div>
            </div>
            <div className="w-3/4 h-3 bg-white/5 rounded-full mb-2"></div>
            <div className="w-full h-3 bg-white/5 rounded-full mb-2"></div>
            <div className="w-full h-3 bg-white/5 rounded-full mb-2"></div>
            <div className="w-2/3 h-3 bg-white/5 rounded-full mb-2"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 italic">Match identified via red font detection</p>
        </div>
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 flex-1 flex flex-col justify-end">
          <h3 className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest mb-4">Learning Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className={accuracy >= 80 ? "text-2xl font-bold font-mono text-emerald-400" : accuracy >= 50 ? "text-2xl font-bold font-mono text-blue-400" : "text-2xl font-bold font-mono text-red-400"}>
                  {Math.round(accuracy)}%
                </div>
                <div className="text-[10px] text-slate-500 uppercase">Current Accuracy</div>
              </div>
            </div>
            <div className="h-[1px] bg-white/5 w-full"></div>
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-bold font-mono text-white">{currentQuestionIndex} / {questions.length}</div>
                <div className="text-[10px] text-slate-500 uppercase">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
