import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-20 no-print">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-slate-400 text-sm font-medium">
                    &copy; {new Date().getFullYear()} Young Explorers Guide. All rights reserved.
                </div>

                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for little travelers
                </div>

                <div className="flex gap-6">
                    <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-normal transition-colors">Privacy</a>
                    <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-normal transition-colors">Terms</a>
                    <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-normal transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
