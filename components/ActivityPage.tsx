
import React, { useState } from 'react';
import { BookPage } from '../types';
import { generateActivityImage } from '../services/geminiService';
import {
  Image as ImageIcon, Loader2, RefreshCw,
  Map as MapIcon, Book, Stamp, Camera, Palette, Sparkles
} from 'lucide-react';

interface ActivityPageProps {
  activity: BookPage;
  pageNumber: number;
  referenceImage?: string;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ activity, pageNumber, referenceImage }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [style, setStyle] = useState<string>('coloring_page');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const handleGenerateImage = async () => {
    if (!activity.imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      let prompt = `${activity.title}. ${activity.imagePrompt}`;
      if (customInstructions.trim()) {
        prompt += ` IMPORTANT USER INSTRUCTION: ${customInstructions}`;
      }
      // Request 3:4 aspect ratio to fill a significant portion of the A4 page vertically.
      const url = await generateActivityImage(prompt, style, '3:4', referenceImage);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const styleButtonClass = (buttonStyle: string) => `
    flex-1 px-4 py-2.5 rounded-xl text-xs font-medium uppercase transition-all duration-200 select-none
    ${style === buttonStyle
      ? (buttonStyle === 'illustration' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-white shadow-md')
      : 'text-slate-500 hover:text-slate-900 hover:bg-white'}
  `;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative print:shadow-none print:border-none print:max-w-[210mm] print:min-h-[297mm] print:rounded-none page-break">

      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-slate-100 print:border-none">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="inline-block px-3 py-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-full uppercase tracking-widest mb-2 border border-indigo-100 print:bg-white print:border-slate-200">
              {activity.section}
            </span>
            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 leading-tight tracking-tight">{activity.title}</h3>
          </div>
          <div className="text-slate-300 shrink-0 no-print opacity-50">
            {activity.layoutType === 'map' && <MapIcon className="w-6 h-6" />}
            {activity.layoutType === 'passport' && <Stamp className="w-6 h-6" />}
            {activity.layoutType === 'intro_text' && <Book className="w-6 h-6" />}
          </div>
        </div>

        {activity.instructions && (
          <div className="bg-indigo-50/50 rounded-xl p-4 border-l-4 border-indigo-300 print:bg-transparent print:p-0 print:border-l-4 print:border-slate-300">
            <p className="text-sm font-comic font-medium text-slate-600 leading-relaxed italic">{activity.instructions}</p>
          </div>
        )}
      </div>

      {/* Image Area */}
      <div className="p-6 md:p-8 pt-0 min-h-[400px] flex flex-col justify-center">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center group relative">

          {/* Loading State */}
          {isGeneratingImage && (
            <div className="w-full aspect-[4/3] md:aspect-[3/4] bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-4 animate-pulse border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
              <div className="text-center px-4">
                <p className="font-medium text-slate-700 mb-1">Creating your masterpiece...</p>
                <p className="text-xs text-slate-400 font-medium">Mixing colors and drawing shapes</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!imageUrl && !isGeneratingImage && (
            <div className="w-full aspect-[4/3] md:aspect-[3/4] bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6 p-6 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-300 cursor-default group/empty print:hidden">

              <div className="text-center w-full max-w-[280px]">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 border border-slate-100 mx-auto group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-transform duration-300">
                  <Palette className="w-10 h-10 text-indigo-500" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2 text-lg">Create Activity Art</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Customize the style and generate a unique illustration for this page.</p>
              </div>

              {/* Controls */}
              <div className="w-full max-w-xs space-y-4">
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setStyle('coloring_page')}
                    className={styleButtonClass('coloring_page')}
                  >
                    Line Art
                  </button>
                  <button
                    onClick={() => setStyle('illustration')}
                    className={styleButtonClass('illustration')}
                  >
                    Full Color
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Add custom details (e.g. 'with a cute cat')"
                    className="w-full px-4 py-3 text-sm border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 bg-white resize-none text-slate-700 min-h-[80px] font-medium transition-all"
                  />
                </div>

                <button
                  onClick={handleGenerateImage}
                  className={`w-full py-4 text-white rounded-2xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group-hover/empty:shadow-xl ${style === 'illustration' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
                >
                  <Sparkles className="w-4 h-4" /> Generate Art
                </button>
              </div>
            </div>
          )}

          {/* Print Placeholder for Empty State */}
          {!imageUrl && !isGeneratingImage && (
            <div className="hidden print:flex w-full aspect-[3/4] border-4 border-slate-100 border-dashed rounded-none items-center justify-center">
              <span className="text-slate-200 font-medium text-4xl -rotate-12 uppercase tracking-tight select-none">Draw Here</span>
            </div>
          )}

          {/* Generated Image State */}
          {imageUrl && !isGeneratingImage && (
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group/img print:shadow-none print:border-none print:rounded-none">
              <img
                src={imageUrl}
                alt="Activity Art"
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay Toolbar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-end p-6 no-print">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-xs font-medium uppercase tracking-widest bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {style === 'coloring_page' ? 'Line Art' : 'Full Color'}
                  </span>
                  <button
                    onClick={() => setImageUrl(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium text-sm transition-all border border-white/20 hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Page Number */}
      <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center print:bg-transparent print:border-none">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] hidden md:inline-block">Page</span>
          <span className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-medium text-slate-700 text-sm shadow-sm print:border-none print:bg-transparent print:shadow-none print:text-lg">{pageNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
