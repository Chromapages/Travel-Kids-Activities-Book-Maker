import React from 'react';
import { Users, Globe, Book } from 'lucide-react';

const StatsStrip: React.FC = () => {
    return (
        <div className="w-full bg-slate-900 text-white py-12 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
                <div className="px-4">
                    <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-medium tracking-tight mb-1">10,000+</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">Happy Explorers</div>
                </div>
                <div className="px-4 pt-8 md:pt-0">
                    <div className="flex items-center justify-center gap-2 mb-2 text-purple-400">
                        <Book className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-medium tracking-tight mb-1">150,000+</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">Pages Generated</div>
                </div>
                <div className="px-4 pt-8 md:pt-0">
                    <div className="flex items-center justify-center gap-2 mb-2 text-emerald-400">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-medium tracking-tight mb-1">195</div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">Countries Supported</div>
                </div>
            </div>
        </div>
    );
};

export default StatsStrip;
