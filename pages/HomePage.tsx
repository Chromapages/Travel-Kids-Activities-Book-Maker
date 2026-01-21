import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import StatsStrip from '../components/StatsStrip';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import { Globe, Map, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative pt-20">
            <HeroSection onStart={() => navigate('/create')} />

            <div className="max-w-7xl mx-auto px-6 mb-24">
                <StatsStrip />
            </div>

            <div className="bg-slate-900 py-24 -skew-y-2 relative overflow-hidden mb-24">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 skew-y-2">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-medium text-white tracking-tight">Everything they need to learn</h2>
                        <p className="text-slate-400 mt-4 text-lg">Educational content disguised as fun activities</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Globe}
                            title="Cultural Discovery"
                            description="Learn basic phrases, fun facts, and food items from the local culture."
                            color="bg-indigo-500"
                        />
                        <FeatureCard
                            icon={Map}
                            title="Geography Skills"
                            description="Map reading activities and landmark spotting challenges."
                            color="bg-purple-500"
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Creative Play"
                            description="Drawing prompts and coloring pages inspired by the destination."
                            color="bg-pink-500"
                        />
                    </div>
                </div>
            </div>

            <HowItWorks />
            <Footer />
        </div>
    );
};

export default HomePage;
