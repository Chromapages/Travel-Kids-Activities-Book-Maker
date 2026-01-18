import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ActivityInput, ActivityBookResponse } from './types';
import { generateActivityBook } from './services/geminiService';
import InputForm from './components/InputForm';
import ActivityPage from './components/ActivityPage';
import CoverPage from './components/CoverPage';
import { 
  Printer, RefreshCcw, ArrowLeft, Download, Ban as Banana, 
  Plane, Map, Luggage, Compass, Globe, Camera, Utensils, 
  Landmark, Mountain, Palmtree, Building2, Search
} from 'lucide-react';

const LOADING_MESSAGES = [
  "Consulting the local experts...",
  "Packing our virtual suitcases...",
  "Mapping out the best landmarks...",
  "Sketching the mascot's adventure...",
  "Translating secret traveler codes...",
  "Finding the yummiest local snacks...",
  "Organizing 42 pages of fun...",
  "Almost ready for departure!"
];

// Icons to cycle through during discovery
const DISCOVERY_ICONS = [
  Plane, Globe, Camera, Utensils, Landmark, Mountain, Map, Building2, Palmtree
];

const LoadingState: React.FC<{ destination: string }> = ({ destination }) => {
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [showIcon, setShowIcon] = useState(true);

  // Pick icons that might be more relevant based on text (simple heuristic)
  const isTropical = /beach|island|hawaii|bali|caribbean|tropical/i.test(destination);
  const isMountain = /alps|mountain|ski|hiking|swiss|himalaya/i.test(destination);
  
  const CurrentIcon = useMemo(() => {
    // If we have a match, occasionally force the relevant icon
    if (isTropical && index % 3 === 0) return Palmtree;
    if (isMountain && index % 3 === 0) return Mountain;
    return DISCOVERY_ICONS[index % DISCOVERY_ICONS.length];
  }, [index, isTropical, isMountain]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + Math.random() * 3 : prev));
    }, 500);

    const stepInterval = setInterval(() => {
      setShowIcon(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        setShowIcon(true);
      }, 300);
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto py-16 px-8 text-center animate-fade-in bg-white rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative mb-10 flex justify-center">
        <div className={`w-28 h-28 bg-gradient-to-tr from-yellow-50 to-orange-50 rounded-full flex items-center justify-center shadow-inner transition-all duration-500 transform ${showIcon ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <CurrentIcon className={`w-14 h-14 text-yellow-600 ${index % 2 === 0 ? 'animate-bounce' : 'animate-pulse'}`} />
        </div>
        
        {/* Floating elements around the central icon */}
        <div className="absolute top-0 right-8 animate-float-delayed">
          <Search className="w-6 h-6 text-indigo-300" />
        </div>
        <div className="absolute bottom-2 left-10 animate-float">
          <Compass className="w-7 h-7 text-indigo-400 animate-spin-slow" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Researching {destination}</h3>
        <p className="text-indigo-500 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI Guide Active
        </p>
      </div>

      <p className={`mt-6 text-gray-500 text-sm italic transition-all duration-500 min-h-[1.5rem] ${showIcon ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        "{LOADING_MESSAGES[index % LOADING_MESSAGES.length]}"
      </p>

      <div className="mt-10 relative">
        <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden shadow-inner border border-gray-50">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            {/* Animated scanning light */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20 animate-scan"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
          <span className="flex items-center gap-1.5"><Map className="w-3.5 h-3.5"/> Analysis</span>
          <span>{Math.round(progress)}% Complete</span>
          <span className="flex items-center gap-1.5">Structure <Luggage className="w-3.5 h-3.5"/></span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-scan {
          animation: scan 2s infinite linear;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(10deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3.5s ease-in-out infinite reverse;
          animation-delay: 0.5s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [bookData, setBookData] = useState<ActivityBookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingDestination, setPendingDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (input: ActivityInput) => {
    setLoading(true);
    setError(null);
    setPendingDestination(input.destinationCity ? `${input.destinationCity}, ${input.destinationCountry}` : input.destinationCountry);
    try {
      const data = await generateActivityBook(input);
      setBookData(data);
    } catch (err) {
      console.error(err);
      setError("Unable to generate content. Please check your API configuration and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookData(null);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!bookRef.current || !(window as any).html2pdf) return;
    
    const element = bookRef.current;
    document.body.classList.add('generating-pdf');

    const opt = {
      margin: 0,
      filename: `NanoBanana_${bookData?.meta.destinationCountry}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await (window as any).html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF Generation Error:", e);
      alert("Could not generate PDF. Please try the Print button instead.");
    } finally {
      document.body.classList.remove('generating-pdf');
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 mb-12 no-print sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
               <span className="text-yellow-500"><Banana className="w-5 h-5"/></span>
               Nano Banana
             </div>
          </div>
          {bookData && (
            <div className="flex gap-3">
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> New Trip
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 flex items-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Save PDF
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm font-medium">
             <RefreshCcw className="w-4 h-4" /> {error}
          </div>
        )}

        {!bookData && (
          <div className="py-4 animate-fade-in">
             {!loading ? (
                <InputForm onSubmit={handleGenerate} isLoading={loading} />
             ) : (
                <LoadingState destination={pendingDestination} />
             )}
          </div>
        )}

        {bookData && (
          <div className="max-w-[210mm] mx-auto">
             <div className="no-print mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">Book Structure Generated</h2>
                  <p className="text-gray-500 text-sm">
                      Your {bookData.pages.length}-page book is ready. Scroll down to generate the artwork for each page individually.
                  </p>
             </div>

             <div className="print:w-full" ref={bookRef}>
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