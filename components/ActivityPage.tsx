import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { generateActivityImage } from '../services/geminiService';
import { 
  Pencil, Scissors, Brain, Eye, Sparkles, Loader2, Image as ImageIcon, 
  RefreshCw, Settings2, RectangleVertical, RectangleHorizontal, Palette 
} from 'lucide-react';

interface ActivityPageProps {
  activity: ActivityItem;
  pageNumber: number;
}

const ActivityPage: React.FC<ActivityPageProps> = ({ activity, pageNumber }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Image Generation Settings
  const [style, setStyle] = useState<string>(activity.group === 'drawing_coloring' ? 'coloring_page' : 'illustration');
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      // Include instructions in the prompt so the text appears in the image
      const prompt = `${activity.layout_description}. ${activity.destination_hook}. The image must include the text: "${activity.instructions_child_friendly}"`;
      const url = await generateActivityImage(prompt, style, aspectRatio);
      setImageUrl(url);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerate = () => {
    setImageUrl(null); // Clear image to show controls again
  };

  const getIcon = () => {
    switch (activity.group) {
      case 'drawing_coloring': return <Pencil className="w-6 h-6" />;
      case 'visual_puzzles': return <Eye className="w-6 h-6" />;
      case 'language_learning': return <Brain className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getColorClass = () => {
    switch (activity.group) {
      case 'drawing_coloring': return 'border-pink-300 bg-pink-50 text-pink-700';
      case 'visual_puzzles': return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'language_learning': return 'border-green-300 bg-green-50 text-green-700';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const renderContent = () => {
    if (!activity.content) return null;
    const { items, phrases, steps } = activity.content;

    // Language Phrases
    if (phrases && Array.isArray(phrases) && phrases.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6">
          {phrases.map((p: any, i: number) => (
            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-slate-100 shadow-sm print:border-slate-200 pdf-no-shadow">
              <div>
                <div className="font-bold text-lg text-slate-800">{p.original}</div>
                <div className="text-xs text-slate-500 italic">{p.pronunciation}</div>
              </div>
              <div className="text-indigo-600 font-bold ml-2">{p.english}</div>
            </div>
          ))}
        </div>
      );
    }

    // List of Items (Word Search, Scavenger Hunt)
    if (items && Array.isArray(items) && items.length > 0) {
      return (
        <div className="w-full mt-6">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Find these!</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {items.map((item: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-slate-50 rounded-full border-2 border-slate-200 text-slate-700 font-comic font-bold print:border-slate-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Drawing Steps
    if (steps && Array.isArray(steps) && steps.length > 0) {
        return (
            <div className="w-full mt-6 space-y-2">
                 {steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{i+1}</span>
                        <p className="font-comic text-slate-700">{step}</p>
                    </div>
                 ))}
            </div>
        )
    }

    // Fallback for simple object dump if schema doesn't match above but is object
    if (typeof activity.content === 'object' && Object.keys(activity.content).length > 0) {
       return (
         <div className="w-full mt-4">
             <pre className="whitespace-pre-wrap font-comic text-sm text-center text-slate-500">
                 {JSON.stringify(activity.content, null, 2).replace(/[\{\}"]/g, '')}
             </pre>
         </div>
       );
    }

    return null;
  };

  return (
    <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 md:p-12 shadow-sm border border-slate-200 relative print:shadow-none print:border-0 page-break mb-8 print:mb-0 pdf-no-shadow flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className={`flex items-center justify-between border-b-4 pb-4 mb-6 ${getColorClass().split(' ')[0]}`}>
            <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${getColorClass()}`}>
                {getIcon()}
            </div>
            <div>
                <h3 className="text-2xl font-comic font-bold text-slate-800">{activity.title}</h3>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{activity.type}</p>
            </div>
            </div>
            <div className="text-right hidden print:block pdf-visible">
                <span className="text-xs text-slate-400">Nano Banana Travel</span>
            </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-lg font-comic text-slate-700 leading-relaxed">
            {activity.instructions_child_friendly}
            </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow min-h-[400px] border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center bg-white relative group">
        
        {/* Placeholder & Controls (Visible if no image) */}
        {!imageUrl && (
          <div className="text-center w-full max-w-md print:hidden pdf-hidden z-10">
            <p className="text-slate-400 mb-6 italic">
              "{activity.layout_description}"
            </p>
            
            {/* Image Controls */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-left shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Settings2 className="w-4 h-4" /> Image Settings
                </div>
                
                <div className="space-y-3">
                    {/* Style Selector */}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Style</label>
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                            <button 
                                onClick={() => setStyle('coloring_page')}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-bold transition-colors ${style === 'coloring_page' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Pencil className="w-3 h-3" /> Line Art
                            </button>
                            <button 
                                onClick={() => setStyle('illustration')}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-bold transition-colors ${style === 'illustration' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Palette className="w-3 h-3" /> Color
                            </button>
                        </div>
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Shape</label>
                        <div className="flex gap-2">
                             {[
                                 { id: '3:4', icon: RectangleVertical, label: 'Portrait' },
                                 { id: '4:3', icon: RectangleHorizontal, label: 'Landscape' }
                             ].map((opt) => (
                                 <button
                                    key={opt.id}
                                    onClick={() => setAspectRatio(opt.id)}
                                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all ${aspectRatio === opt.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
                                    title={opt.label}
                                 >
                                     <opt.icon className="w-4 h-4 mb-1" />
                                     <span className="text-[10px] font-bold">{opt.id}</span>
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            <button 
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? <Loader2 className="animate-spin w-5 h-5"/> : <ImageIcon className="w-5 h-5"/>}
              Generate Picture
            </button>
            <p className="text-xs text-slate-400 mt-2">Uses Nano Banana (Gemini) to draw.</p>
          </div>
        )}

        {/* Generated Image */}
        {imageUrl && (
          <div className="w-full flex flex-col items-center mb-6 relative group">
             <img 
                src={imageUrl} 
                alt="Activity" 
                className="max-w-full max-h-[150mm] object-contain border-2 border-black shadow-sm" 
            />
            
            <button 
                onClick={handleRegenerate}
                className="mt-3 px-4 py-2 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-full text-xs font-bold flex items-center gap-2 transition-all print:hidden pdf-hidden shadow-sm"
            >
                <RefreshCw className="w-3 h-3" /> Regenerate Image
            </button>
          </div>
        )}

        {/* Structured Content Render */}
        {renderContent()}

        {/* Fallback layout description for print if image wasn't generated */}
        <div className="hidden print:block pdf-visible absolute bottom-2 left-0 w-full text-center text-xs text-slate-300">
           {activity.layout_description}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t-2 border-slate-100 flex justify-between items-end text-sm text-slate-500">
        <div>
          {activity.materials_needed_simple.length > 0 && (
            <div className="flex gap-2 items-center mb-1">
               <span className="font-bold">You need:</span>
               {activity.materials_needed_simple.join(', ')}
            </div>
          )}
          {activity.safety_note && (
             <div className="flex gap-1 items-center text-orange-500 font-bold text-xs">
                <Scissors className="w-3 h-3" /> Note: {activity.safety_note}
             </div>
          )}
        </div>
        <div className="font-comic font-bold text-slate-300 text-xl">
           Page {pageNumber}
        </div>
      </div>
      
      {/* Fun Fact Badge */}
      <div className="absolute top-4 right-8 transform rotate-12 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md print:shadow-none print:border print:border-yellow-600 pdf-no-shadow">
        {activity.destination_hook}
      </div>

    </div>
  );
};

export default ActivityPage;