import React, { useState, useRef } from 'react';
import { ActivityInput, ActivityBookResponse } from './types';
import { generateActivityBook } from './services/geminiService';
import InputForm from './components/InputForm';
import ActivityPage from './components/ActivityPage';
import CoverPage from './components/CoverPage';
import { Printer, RefreshCcw, ArrowLeft, Download, Ban as Banana, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [bookData, setBookData] = useState<ActivityBookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (input: ActivityInput) => {
    setLoading(true);
    setError(null);
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
             <InputForm onSubmit={handleGenerate} isLoading={loading} />
             {loading && (
                 <div className="text-center mt-8 text-gray-500 text-sm">
                     <p>Gathering cultural data and planning 42 pages...</p>
                     <p className="text-xs mt-2 opacity-70">This takes a few seconds.</p>
                 </div>
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