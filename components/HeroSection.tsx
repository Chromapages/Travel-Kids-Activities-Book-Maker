import React from 'react';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
    onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
    return (
        <div className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

                <div className="relative z-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium uppercase tracking-widest mb-6">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        New: AI-Powered Kids Activities
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-light text-slate-900 leading-[1.1] tracking-tight mb-6">
                        Turn Travel Time Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Adventure Time</span>
                    </h1>

                    <p className="text-xl text-slate-500 mb-8 font-medium max-w-lg leading-relaxed">
                        Create personalized, printable activity books for your kids in seconds. Puzzles, language games, and coloring pages customized for your destination.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onStart}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-medium text-lg shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            Start Creating Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-medium text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Safe for Kids
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-4 text-xs text-slate-400 font-normal">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p>Loved by 10,000+ parents worldwide</p>
                    </div>
                </div>

                <div className="relative animate-float lg:h-[600px] flex items-center justify-center">
                    {/* Abstract globe/map composition */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-[3rem] rotate-3 opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50 to-indigo-50 rounded-[3rem] -rotate-2 opacity-60"></div>

                    <div className="relative z-10 w-full max-w-lg bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 rotate-1">
                        <img
                            src="https://images.unsplash.com/photo-1596464716127-f9a8759fa229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Kids Activity Book"
                            className="rounded-2xl w-full h-auto object-cover aspect-[4/3]"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-400 uppercase">Status</div>
                                    <div className="text-sm font-medium text-slate-900">Print Ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
