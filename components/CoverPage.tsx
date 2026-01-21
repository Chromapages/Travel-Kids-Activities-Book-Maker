import React from 'react';
import { ActivityInput } from '../types';
import { Map, MapPin, Sparkles } from 'lucide-react';

interface CoverPageProps {
  meta: ActivityInput;
}

const CoverPage: React.FC<CoverPageProps> = ({ meta }) => {
  return (
    <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-12 text-center shadow-2xl page-break print:mb-0 print:shadow-none relative overflow-hidden flex flex-col border border-slate-100">
      
      {/* Rich Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50"></div>
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="relative z-10 border-[12px] border-double border-slate-900 flex-grow rounded-[2.5rem] p-12 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md shadow-inner">
        
        <div className="space-y-8 w-full">
            <div className="relative inline-flex items-center justify-center w-32 h-32 bg-slate-900 rounded-[2rem] text-white mb-6 rotate-3 shadow-2xl">
                <MapPin className="w-16 h-16" />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-8 h-8 animate-bounce" />
            </div>
            
            <div className="space-y-4">
                <h1 className="text-4xl font-black text-slate-400 uppercase tracking-[0.4em] leading-tight">Young Explorers</h1>
                <h2 className="text-7xl font-comic font-black text-slate-900 leading-none tracking-tighter mb-4">
                    GUIDE
                </h2>
            </div>
            
            <div className="py-10">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-yellow-400 -rotate-2 scale-110 opacity-20 rounded-2xl"></div>
                    <div className="relative text-5xl md:text-6xl font-comic font-black text-indigo-600 p-4 transform rotate-1">
                        {meta.destinationCity ? `${meta.destinationCity}` : meta.destinationCountry}
                    </div>
                </div>
                {meta.destinationCity && (
                   <div className="text-2xl font-black text-slate-400 mt-2 uppercase tracking-widest">{meta.destinationCountry}</div>
                )}
            </div>
        </div>

        <div className="mt-auto w-full">
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-slate-200 flex-grow"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <div className="h-px bg-slate-200 flex-grow"></div>
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.5em]">Global Traveler Edition</p>
        </div>

      </div>
    </div>
  );
};

export default CoverPage;