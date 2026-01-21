
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ActivityInput, ActivityBookResponse } from './types';
import { generateActivityBook } from './services/geminiService';
import InputForm from './components/InputForm';
import ActivityPage from './components/ActivityPage';
import CoverPage from './components/CoverPage';
import { 
  Printer, RefreshCcw, ArrowLeft, Download, 
  Plane, Map, Luggage, Compass, Globe, Camera, Utensils, 
  Landmark, Mountain, Palmtree, Building2, Search, MapPin, Sparkles, Loader2, Key, ShieldCheck
} from 'lucide-react';

const LOADING_STAGES = [
  { message: "Scouting the destination...", threshold: 15, icon: Plane },
  { message: "Finding hidden local gems...", threshold: 35, icon: Search },
  { message: "Drafting the adventure map...", threshold: 55, icon: Map },
  { message: "Interviewing the local mascot...", threshold: 75, icon: Sparkles },
  { message: "Translating secret traveler codes...", threshold: 90, icon: Globe },
  { message: "Polishing all 42 magical pages...", threshold: 97, icon: Luggage },
  { message: "Ready for departure! Almost there...", threshold: 100, icon: Sparkles }
];

const LoadingState: React.FC<{ destination: string }> = ({ destination }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 40) return prev + Math.random() * 8; 
        if (prev < 80) return prev + Math.random() * 4; 
        if (prev < 95) return prev + Math.random() * 1.5; 
        if (prev < 99) return prev + 0.2; 
        return prev;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextStage = LOADING_STAGES.findIndex(s => progress < s.threshold);
    if (nextStage !== -1 && nextStage !== stageIndex) {
      setStageIndex(nextStage);
    }
  }, [progress, stageIndex]);

  const CurrentIcon = LOADING_STAGES[stageIndex]?.icon || Sparkles;

  return (
    <div className="max-w-2xl mx-auto py-12 px-8 text-center animate-fade-in bg-white rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative mb-8 flex justify-center">
        <div className="w-28 h-28 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-full flex items-center justify-center shadow-inner relative">
          <CurrentIcon className="w-14 h-14 text-indigo-600 animate-bounce" />
          <div className="absolute inset-0 border-4 border-dashed border-indigo-200 rounded-full animate-spin-slow"></div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Exploring {destination}</h3>
        <div className="flex items-center justify-center gap-2">
           <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse uppercase">AI Guide Active</span>
           <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">Searching the web...</span>
        </div>
      </div>

      <p className="mt-8 text-gray-600 text-lg font-comic font-bold min-h-[1.5rem] italic">
        "{LOADING_STAGES[stageIndex]?.message}"
      </p>

      <div className="mt-10 relative max-w-sm mx-auto">
        <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden shadow-inner border border-gray-50">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full transition-all duration-300 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-24 animate-scan"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
          <span className="flex items-center gap-1.5"><Search className="w-3 h-3"/> Research</span>
          <span className="text-indigo-600">{Math.floor(progress)}%</span>
          <span className="flex items-center gap-1.5">Creation <Sparkles className="w-3 h-3"/></span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isKeySelected, setIsKeySelected] = useState<boolean | null>(null);
  const [bookData, setBookData] = useState<ActivityBookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingDestination, setPendingDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setIsKeySelected(true);
  };

  const handleGenerate = async (input: ActivityInput) => {
    setLoading(true);
    setError(null);
    setPendingDestination(input.destinationCity ? `${input.destinationCity}, ${input.destinationCountry}` : input.destinationCountry);
    try {
      const data = await generateActivityBook(input);
      setBookData(data);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setIsKeySelected(false);
        setError("Your Pro API Key needs to be re-selected. Please check your passport!");
      } else {
        setError("Our travel guides hit a roadblock! Please check your connection or try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookData(null);
    setError(null);
  };

  const handlePrint = () => { window.print(); };

  const handleDownloadPDF = async () => {
    if (!bookRef.current || !(window as any).html2pdf) return;
    const element = bookRef.current;
    document.body.classList.add('generating-pdf');
    const opt = {
      margin: 0,
      filename: `YoungExplorersGuide_${bookData?.meta.destinationCountry}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    try { await (window as any).html2pdf().set(opt).from(element).save(); } 
    catch (e) { console.error(e); } 
    finally { document.body.classList.remove('generating-pdf'); }
  };

  if (isKeySelected === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center border border-slate-200">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Passport Check!</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            To generate high-quality activity art with Gemini 3 Pro, you'll need to select a paid API key from your traveler toolkit.
          </p>
          <button 
            onClick={handleOpenKey}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" /> Select My API Key
          </button>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 underline uppercase tracking-widest"
            >
              Learn about billing & keys
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-slate-100">
      <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8 no-print sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
             <span className="text-indigo-600"><MapPin className="w-5 h-5"/></span>
             Young Explorers Guide
          </div>
          {bookData && (
            <div className="flex gap-2">
              <button onClick={handleReset} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors">New Trip</button>
              <button onClick={handleDownloadPDF} className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-all">
                <Download className="w-3.5 h-3.5" /> Save PDF
              </button>
              <button onClick={handlePrint} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-4 text-sm font-bold shadow-sm">
             <RefreshCcw className="w-5 h-5" />
             <p>{error}</p>
          </div>
        )}

        {!bookData ? (
          <div className="py-4">
             {!loading ? <InputForm onSubmit={handleGenerate} isLoading={loading} /> : <LoadingState destination={pendingDestination} />}
          </div>
        ) : (
          <div className="max-w-[100%] mx-auto pb-24">
             <div className="no-print max-w-2xl mx-auto mb-12 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Book is Ready!</h2>
                    <p className="text-gray-500 text-xs mt-1 uppercase font-bold tracking-widest">Generate art and scroll through your pages.</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 font-black px-4 py-2 rounded-xl border border-indigo-100 uppercase tracking-widest text-xs">
                    {bookData.meta.destinationCountry}
                  </div>
             </div>

             <div className="book-container flex flex-col items-center gap-8 print:gap-0" ref={bookRef}>
                <CoverPage meta={bookData.meta} />
                
                {bookData.pages.map((page, index) => (
                  <ActivityPage 
                      key={index} 
                      activity={page} 
                      pageNumber={page.pageNumber} 
                      referenceImage={bookData.meta.styleReferenceImage}
                  />
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
