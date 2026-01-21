import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle, Twitter, Instagram, Facebook } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send data to a backend
    };

    return (
        <div className="pt-20 min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

                {/* Left Column: Contact Info */}
                <div className="bg-slate-900 p-10 md:p-12 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-bl-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-tr-full opacity-10 translate-y-1/4 -translate-x-1/4"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-medium mb-6 tracking-tight">Let's Connect!</h2>
                        <p className="text-slate-300 mb-12 leading-relaxed">
                            Have questions about creating your adventure book? We'd love to hear from you.
                            Parents, teachers, and little explorers are all welcome!
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm uppercase tracking-wider text-slate-400 mb-1">Email Us</h3>
                                    <p className="font-medium text-lg">hello@youngexplorers.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm uppercase tracking-wider text-slate-400 mb-1">HQ</h3>
                                    <p className="font-medium text-lg">123 Adventure Lane<br />Creativity City, CA 90210</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        <h3 className="font-medium text-sm uppercase tracking-wider text-slate-400 mb-4">Follow Our Journey</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="p-10 md:p-12 md:w-3/5 bg-white">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col justify-center">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wide">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800"
                                    placeholder="Captain Explorer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wide">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-slate-800 resize-none"
                                    placeholder="Tell us about your next adventure..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in-up">
                            <div className="w-20 h-20 bg-green-100/50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-medium text-slate-900 mb-2">Message Sent!</h3>
                            <p className="text-slate-500 text-lg mb-8 max-w-sm">
                                Thanks for reaching out! We'll get back to you as soon as we finish our current expedition.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-3 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wide text-xs"
                            >
                                Send Another
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
