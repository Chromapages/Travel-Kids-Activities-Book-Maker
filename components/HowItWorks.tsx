import React from 'react';
import { MapPin, Sparkles, Printer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: MapPin,
            title: "Pick a Destination",
            description: "Simply tell us where your little explorer is headed—a country, a city, or even a dream destination.",
            gradient: "from-indigo-500 to-indigo-600",
            bg: "bg-indigo-50",
            shadow: "shadow-indigo-200",
            badge: "bg-indigo-600"
        },
        {
            icon: Sparkles,
            title: "AI Generates Magic",
            description: "Our AI instantly creates puzzles, coloring pages, and stories customized to that specific location.",
            gradient: "from-purple-500 to-purple-600",
            bg: "bg-purple-50",
            shadow: "shadow-purple-200",
            badge: "bg-purple-600"
        },
        {
            icon: Printer,
            title: "Print & Explore",
            description: "Download the beautiful PDF, print it out, and watch your child's imagination take flight on the plane!",
            gradient: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50",
            shadow: "shadow-emerald-200",
            badge: "bg-emerald-600"
        }
    ];

    return (
        <div className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <div className="absolute top-40 left-10 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-40"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">
                        Create a book in minutes, <br />
                        <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">cherish it for years</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-light leading-relaxed">
                        No design skills needed. Just enter a destination and let our magical engine handle the rest.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-24 left-10 right-10 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`
                                    relative bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 
                                    shadow-xl ${step.shadow} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
                                    group flex flex-col items-center text-center lg:items-start lg:text-left
                                `}
                            >
                                {/* Step Number Badge */}
                                <div className={`
                                    absolute -top-6 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0
                                    w-12 h-12 rounded-2xl ${step.badge} text-white font-bold text-xl flex items-center justify-center
                                    shadow-lg border-4 border-white z-20
                                `}>
                                    {index + 1}
                                </div>

                                {/* Icon Container */}
                                <div className={`
                                    w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient}
                                    flex items-center justify-center text-white shadow-lg mb-8 mt-4
                                    transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out
                                `}>
                                    <step.icon className="w-10 h-10" />
                                </div>

                                <h3 className="text-2xl font-medium text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-light">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-2xl font-medium text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200"
                    >
                        Start Creating Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
