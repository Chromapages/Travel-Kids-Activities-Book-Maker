
import React, { useState } from 'react';
import { BookPage } from '../types';
import { generateActivityImage } from '../services/geminiService';
import { 
  Image as ImageIcon, Loader2, RefreshCw, 
  Map as MapIcon, Book, Stamp, Camera, Palette
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

  return (
    <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 md:p-12 shadow-lg border border-slate-200 relative print:shadow-none print:border-0 page-break print:mb-0 pdf-no-shadow flex flex-col transition-all duration-500 rounded-none">
      
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 mb-2">
            <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{activity.section}</span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{activity.title}</h3>
            </div>
            <div className="text-slate-300 print:hidden opacity-50">
                {activity.layoutType === 'map' && <MapIcon className="w-6 h-6"/>}
                {activity.layoutType === 'passport' && <Stamp className="w-6 h-6"/>}
                {activity.layoutType === 'intro_text' && <Book className="w-6 h-6"/>}
            </div>
        </div>

        {activity.instructions && (
             <p className="text-sm font-comic font-bold text-slate-500 leading-relaxed bg-slate-50/50 p-2 rounded-none border-l-4 border-indigo-200 italic">{activity.instructions}</p>
        )}
      </div>

      {/* 
          Image Area:
          Container and Image both match 3:4 aspect ratio for a perfect vertical fit.
          All rounded corners removed for a sharp, clean appearance.
      */}
      <div className="flex-grow relative flex flex-col items-center justify-center min-h-0">
         <div className="w-full flex flex-col items-center justify-center group relative">
            {!imageUrl ? (
                <div className="w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-none bg-slate-50/30 flex flex-col items-center justify-center hover:border-indigo-200 hover:bg-indigo-50/10 transition-all duration-300">
                    <div className="text-center w-full max-w-xs print:hidden pdf-hidden z-10 p-6 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center shadow-lg mb-6 border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                            <Camera className="w-7 h-7 text-indigo-500" />
                        </div>
                        <h4 className="font-black text-slate-800 mb-2 uppercase tracking-[0.2em] text-[10px]">Create Page Art</h4>
                        
                        <div className="flex bg-slate-200/50 p-1 rounded-none mb-4 w-full">
                            <button
                                onClick={() => setStyle('coloring_page')}
                                className={`flex-1 px-3 py-2 rounded-none text-[10px] font-black uppercase transition-all ${style === 'coloring_page' ? 'bg-black text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Line Art
                            </button>
                            <button
                                onClick={() => setStyle('illustration')}
                                className={`flex-1 px-3 py-2 rounded-none text-[10px] font-black uppercase transition-all ${style === 'illustration' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Full Color
                            </button>
                        </div>

                        <textarea
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="Personalize the drawing..."
                            className="w-full px-4 py-3 text-xs border border-slate-200 rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none text-slate-600 mb-4 h-16 shadow-inner font-medium"
                        />
                        
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className={`w-full py-4 text-white rounded-none font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 ${style === 'illustration' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-slate-900 shadow-slate-200'} shadow-2xl`}
                        >
                            {isGeneratingImage ? <Loader2 className="animate-spin w-4 h-4"/> : <Palette className="w-4 h-4"/>}
                            {isGeneratingImage ? 'Drawing...' : `Generate Page Art`}
                        </button>
                    </div>
                     <div className="hidden print:block pdf-visible absolute inset-0 flex items-center justify-center">
                         <div className="border-4 border-slate-100 border-dashed rounded-none w-[80%] h-[80%] flex items-center justify-center">
                            <span className="text-slate-100 font-black text-5xl rotate-12 opacity-40 tracking-tighter uppercase">Activity Area</span>
                         </div>
                     </div>
                </div>
            ) : (
                <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden shadow-2xl group/img border border-slate-100 bg-white">
                    <img 
                        src={imageUrl} 
                        alt="Activity Art" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center no-print backdrop-blur-sm">
                        <button 
                            onClick={() => setImageUrl(null)} 
                            className="p-5 bg-white rounded-full shadow-2xl text-slate-900 hover:text-red-500 transition-all border border-slate-100 hover:scale-110 active:scale-90"
                        >
                            <RefreshCw className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>

      <div className="flex-none mt-4 pt-4 border-t-2 border-slate-100 flex justify-between items-center">
        <div className="text-[10px] text-slate-300 font-black uppercase tracking-[0.4em] font-sans">Next Stop Adventure</div>
        <div className="font-black text-slate-800 text-xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-none shadow-inner border border-slate-100">{pageNumber}</div>
      </div>
    </div>
  );
};

export default ActivityPage;
