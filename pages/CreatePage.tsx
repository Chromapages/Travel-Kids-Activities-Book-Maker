import React, { useState, useRef, useEffect } from 'react';
import {
    Printer, RefreshCcw, Download,
    Plane, Map, Luggage, Globe, Search, MapPin, Sparkles
} from 'lucide-react';
import { generateActivityBook } from '../services/geminiService';
import { ActivityInput, ActivityBookResponse } from '../types';
import InputForm from '../components/InputForm';
import ActivityPage from '../components/ActivityPage';
import CoverPage from '../components/CoverPage';

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

    const CurrentIcon = LOADING_STAGES[stageIndex].icon;

    return (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto p-8 text-center">
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center animate-pulse">
                    <CurrentIcon className="w-10 h-10 text-indigo-600 animate-bounce" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full shadow-lg border border-indigo-100 text-xs font-black text-indigo-600">
                    {Math.round(progress)}%
                </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Creating Guide for {destination}</h3>
            <p className="text-slate-500 font-medium h-6">{LOADING_STAGES[stageIndex].message}</p>

            <div className="w-full h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
                <div
                    className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const CreatePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookData, setBookData] = useState<ActivityBookResponse | null>(null);
    const [pendingDestination, setPendingDestination] = useState<string>("");
    const bookRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async (input: ActivityInput) => {
        setLoading(true);
        setError(null);
        setPendingDestination(input.destination);

        try {
            const data = await generateActivityBook(input);
            setBookData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate book');
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

    const handleDownloadPDF = () => {
        const element = bookRef.current;
        if (!element) return;

        // @ts-ignore
        if (typeof window.html2pdf === 'undefined') {
            alert('PDF generator library not loaded. Please try printing to PDF instead.');
            return;
        }

        const opt = {
            margin: 0,
            filename: `Young-Explorers-Guide-${bookData?.meta.destinationCountry}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // @ts-ignore
        window.html2pdf().set(opt).from(element).save();
    };


    return (
        <div className="pt-20 min-h-screen">
            {error && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce-in max-w-lg w-full px-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-center gap-4 text-sm font-bold shadow-xl">
                        <RefreshCcw className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {!bookData ? (
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {!loading ? (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Create Your Adventure Guide</h1>
                                <p className="text-lg text-slate-500 max-w-xl mx-auto">Fill in the details below to generate a personalized activity book for your trip.</p>
                            </div>
                            <InputForm onSubmit={handleGenerate} isLoading={loading} />
                        </>
                    ) : (
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <LoadingState destination={pendingDestination} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-[100%] mx-auto py-12 px-4 bg-slate-100 min-h-screen relative">
                    {/* Floating Controls */}
                    <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col gap-3 items-end">
                        {/* Context Info */}
                        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-indigo-100 shadow-xl flex items-center gap-3 mb-2">
                            <div className="bg-indigo-600 text-white font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                {bookData.meta.destinationCountry}
                            </div>
                            <span className="text-slate-400 text-xs font-bold">{bookData.pages.length} pages</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button onClick={handleReset} className="px-4 py-3 bg-white text-slate-600 rounded-xl font-bold shadow-lg hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-2">
                                <RefreshCcw className="w-4 h-4" /> New Guide
                            </button>
                            <button onClick={handleDownloadPDF} className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center gap-2">
                                <Download className="w-4 h-4" /> Save PDF
                            </button>
                        </div>
                    </div>

                    <div className="book-container flex flex-col items-center gap-12 print:gap-0" ref={bookRef}>
                        {/* CoverPage removed per request */}
                        {bookData.pages.map((page, index) => (
                            <ActivityPage
                                key={index}
                                activity={page}
                                pageNumber={page.pageNumber}
                                referenceImage={bookData.meta.styleReferenceImage}
                            />
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto mt-24 text-center pb-12 no-print">
                        <p className="text-slate-400 font-medium mb-4">Hope you have a safe trip!</p>
                        <button onClick={handleReset} className="text-indigo-600 font-bold hover:underline">Make another book</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePage;
