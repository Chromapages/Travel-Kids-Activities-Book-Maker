
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
  
  // Default Style Settings - Set to 3:4 Portrait for single page fit
  const [style, setStyle] = useState<string>('coloring_page');
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const handleGenerateImage = async () => {
    if (!activity.imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      let prompt = `${activity.title}. ${activity.imagePrompt}`;
      if (customInstructions.trim()) {
        prompt += ` IMPORTANT USER INSTRUCTION: ${customInstructions}`;
      }
      const url = await generateActivityImage(prompt, style, aspectRatio, referenceImage);
      setImageUrl(url);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 shadow-sm border border-slate-200 relative print:shadow-none print:border-0 page-break mb-8 print:mb-0 pdf-no-shadow flex flex-col overflow-hidden">
      
      {/* Top Section */}
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2 mb-2">
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activity.section}</span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{activity.title}</h3>
            </div>
            <div className="text-slate-200 print:hidden">
                {activity.layoutType === 'map' && <MapIcon />}
                {activity.layoutType === 'passport' && <Stamp />}
                {activity.layoutType === 'intro_text' && <Book />}
            </div>
        </div>

        {activity.instructions && (
             <p className="text-sm md:text-base font-comic text-slate-600 leading-snug">{activity.instructions}</p>
        )}
      </div>

      {/* Main Content Area - Maximized Full Page Image */}
      <div className="flex-grow relative flex flex-col items-center justify-center min-h-0">
         <div className="w-full h-full flex flex-col items-center justify-center group relative">
            
            {!imageUrl ? (
                <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center hover:border-slate-300 transition-colors">
                    {/* Placeholder UI */}
                    <div className="text-center w-full max-sm print:hidden pdf-hidden z-10 p-6 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                            <Camera className="w-7 h-7 text-slate-400" />
                        </div>
                        <h4 className="font-bold text-slate-700 mb-1">Generate Page</h4>
                        <p className="text-slate-400 text-xs mb-6">Create custom AI artwork for this activity.</p>
                        
                        {/* Style Selector */}
                        <div className="flex bg-slate-200/50 p-1 rounded-lg mb-4 w-full max-w-[240px]">
                            <button
                                onClick={() => setStyle('coloring_page')}
                                className={`flex-1 px-2 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${style === 'coloring_page' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                B/W Line Art
                            </button>
                            <button
                                onClick={() => setStyle('illustration')}
                                className={`flex-1 px-2 py-1.5 rounded-md text-[10px] md:text-xs font-bold transition-all ${style === 'illustration' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Full Color
                            </button>
                        </div>

                        {/* Custom Instructions */}
                        <div className="w-full max-w-[240px] mb-4">
                           <textarea
                               value={customInstructions}
                               onChange={(e) => setCustomInstructions(e.target.value)}
                               placeholder="Optional: Add specific details (e.g., 'Add a cat', 'Make it sunny')..."
                               className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white resize-none text-slate-600 placeholder:text-slate-300"
                               rows={2}
                           />
                        </div>
                        
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage}
                            className={`w-full px-6 py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm ${style === 'illustration' ? 'bg-indigo-600' : 'bg-black'}`}
                        >
                            {isGeneratingImage ? <Loader2 className="animate-spin w-4 h-4"/> : <ImageIcon className="w-4 h-4"/>}
                            Generate {style === 'illustration' ? 'Color' : 'B/W'} Art
                        </button>
                    </div>
                     
                    {/* Print Placeholder Text (if user prints without generating) */}
                     <div className="hidden print:block pdf-visible absolute inset-0 flex items-center justify-center">
                         <span className="text-slate-200 font-bold text-xl rotate-45 border-2 border-slate-200 p-4 rounded-lg">Draw Here</span>
                     </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                        src={imageUrl} 
                        alt="Activity Art" 
                        className="w-full h-full object-contain max-h-[240mm]" 
                    />
                    <div className="absolute top-2 right-2 flex gap-2 print:hidden z-20">
                         <button 
                            onClick={() => setImageUrl(null)}
                            className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200"
                            title="Regenerate Image"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* Footer */}
      <div className="flex-none mt-4 pt-2 border-t-2 border-slate-100 flex justify-between items-end">
        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Next Stop Adventure Series</div>
        <div className="font-bold text-slate-900 text-lg w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full">{pageNumber}</div>
      </div>

    </div>
  );
};

export default ActivityPage;
