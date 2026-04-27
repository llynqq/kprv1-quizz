import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Question } from '../types';

interface ReviewScreenProps {
  incorrectAnswers: { question: Question; selectedOptionIndex: number }[];
  onComplete: () => void;
}

export function ReviewScreen({ incorrectAnswers, onComplete }: ReviewScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (incorrectAnswers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white">To Review: 0</p>
      </div>
    );
  }

  const { question, selectedOptionIndex } = incorrectAnswers[currentIndex];
  const letterMap = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleNext = () => {
    if (currentIndex < incorrectAnswers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-10 gap-10 overflow-hidden relative w-full h-full">
      <div className="max-w-3xl w-full mx-auto flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <span className="text-xl font-medium text-slate-300">Review Mode</span>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold font-mono">
            {currentIndex + 1} / {incorrectAnswers.length}
          </span>
        </div>
        <button 
          onClick={onComplete}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl z-10 w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={question.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
          >
            <div className="mb-8 w-full">
              <h2 className="text-2xl font-semibold leading-relaxed text-white mb-2">
                {question.text}
              </h2>
            </div>

            <div className="space-y-4 w-full">
              {question.options.map((option, idx) => {
                const isSelected = idx === selectedOptionIndex;
                const isCorrect = idx === question.correctOptionIndex;
                
                let stateClasses = "bg-white/5 border-transparent text-slate-400 opacity-50";
                let letterClasses = "bg-white/10 text-slate-500";
                
                if (isCorrect) {
                  stateClasses = "bg-emerald-500/20 border-emerald-500/50 text-white ring-1 ring-emerald-500/50";
                  letterClasses = "bg-emerald-500 text-white shadow-lg";
                } else if (isSelected) {
                  stateClasses = "bg-red-500/20 border-red-500/50 text-white ring-1 ring-red-500/50";
                  letterClasses = "bg-red-500 text-white shadow-lg";
                }

                return (
                  <div 
                    key={idx}
                    className={`group p-4 rounded-2xl border flex items-center gap-4 ${stateClasses}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${letterClasses}`}>
                      {letterMap[idx] || (idx + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{option}</p>
                      {isCorrect && <p className="text-xs text-emerald-400 mt-1 uppercase tracking-wider font-bold">Correct Answer</p>}
                      {isSelected && <p className="text-xs text-red-400 mt-1 uppercase tracking-wider font-bold">Your Answer</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-3xl w-full mx-auto flex justify-between items-center z-20 pb-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors font-medium ${currentIndex === 0 ? 'text-slate-600 cursor-not-allowed hidden' : 'bg-white/10 hover:bg-white/15 text-white'}`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-white shadow-lg shadow-blue-600/30 ml-auto"
        >
          {currentIndex === incorrectAnswers.length - 1 ? 'Finish Review' : 'Next Question'}
          {currentIndex < incorrectAnswers.length - 1 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
