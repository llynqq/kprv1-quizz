import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

interface StartScreenProps {
  onSelectMode: (mode: 'zapocet' | 'zkouska') => void;
}

export function StartScreen({ onSelectMode }: StartScreenProps) {
  return (
    <div className="flex-1 flex p-6 sm:p-10 items-center justify-center relative w-full h-full z-10">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Zvolte typ přípravy
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Vyberte si režim studia. Zápočet obsahuje předdefinované otázky, zatímco zkouška umožňuje importovat vlastní materiály.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onSelectMode('zapocet')}
            className="group relative p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 transition-all text-left overflow-hidden h-full flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150"></div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20">
              <BookOpen size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Zápočet</h2>
            <p className="text-slate-400 text-lg leading-relaxed flex-1">
              Procvičte si předdefinované otázky (z PDF). Správné odpovědi jsou již zahrnuty. Ideální pro rychlé opakování.
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelectMode('zkouska')}
            className="group relative p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 transition-all text-left overflow-hidden h-full flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150"></div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Zkouška</h2>
            <p className="text-slate-400 text-lg leading-relaxed flex-1">
              Test z předtermínu a z flashkard Quizlet. Spuštění s předem stanovenými otázkami z podkladů.
            </p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
