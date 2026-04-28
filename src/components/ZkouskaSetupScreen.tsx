import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Type, Loader2, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { Question } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ZkouskaSetupScreenProps {
  onBack: () => void;
  onStartQuiz: (questions: Question[]) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function ZkouskaSetupScreen({ onBack, onStartQuiz }: ZkouskaSetupScreenProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleGenerate = async () => {
    if (activeTab === 'text' && !textInput.trim()) {
      setError('Vložte prosím text z Quizletu nebo jiného zdroje.');
      return;
    }
    if (activeTab === 'upload' && images.length === 0) {
      setError('Vyberte prosím alespoň jeden obrázek.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contents = [];
      if (activeTab === 'text') {
        contents.push(textInput);
      } else {
        for (const img of images) {
          const base64Text = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              resolve(base64.split(',')[1]);
            };
            reader.readAsDataURL(img.file);
          });
          contents.push({
            inlineData: {
              data: base64Text,
              mimeType: img.file.type,
            }
          });
        }
      }

      contents.push("Generate a multiple choice quiz from the given content. Return only a valid JSON array of question objects where each object has: 'id' (a unique short string like q_1), 'text' (the question text), 'options' (an array of strings), 'correctOptionIndex' (the index of the correct option in the options array). Do NOT wrap in generic markdown blocks like ```json.");

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      const text = response.text;
      if (!text) throw new Error('No response from AI');
      
      let parsedQuestions: Question[];
      try {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedQuestions = JSON.parse(cleanedText);
        
        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
          throw new Error('Invalid format');
        }
      } catch (e) {
        throw new Error('Nepodařilo se zpracovat odpovědi do formátu kvízu. Zkuste prosím jiný formát.');
      }

      onStartQuiz(parsedQuestions);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Nastala chyba při generování testu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-10 relative w-full h-full z-10 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto flex flex-col">
        <button 
          onClick={onBack}
          className="self-start flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Zpět
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Příprava zkoušky
        </h1>
        <p className="text-slate-400 mb-8">
          Nahrajte obrázky z testu nebo vložte zkopírovaný text z Quizletu a my z nich vygenerujeme cvičný test.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'upload' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <span className="flex justify-center items-center gap-2">
                <ImageIcon size={18} />
                Obrázky testů
              </span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'text' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <span className="flex justify-center items-center gap-2">
                <Type size={18} />
                Vložit text
              </span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'upload' ? (
              <div className="flex flex-col gap-6">
                <label className="border-2 border-dashed border-white/20 hover:border-white/40 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Vybrat obrázky</h3>
                  <p className="text-slate-400 text-sm">Podporuje JPG, PNG, WEBP</p>
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                        <img src={img.preview} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-64">
                <textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Vložte text zkopírovaný z Quizletu nebo vašich zápisků..." 
                  className="w-full h-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Generování testu...
            </>
          ) : (
            'Vytvořit test'
          )}
        </button>
      </div>
    </div>
  );
}
