import React from 'react';
import { Globe, Compass, Book, Plane, Briefcase, Map as MapIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CharactersPage: React.FC = () => {
    const characters = [
        {
            id: 1,
            name: 'Buddy the Globe',
            role: 'World Guide',
            tagline: 'Exploring the world, one spin at a time!',
            color: 'bg-blue-100 text-blue-600',
            icon: <Globe className="w-24 h-24" />,
            description: "Buddy knows every corner of the planet and loves sharing fun facts about the places you'll visit."
        },
        {
            id: 2,
            name: 'Charlie Compass',
            role: 'Navigator',
            tagline: 'Guiding your way to fun!',
            color: 'bg-emerald-100 text-emerald-600',
            icon: <Compass className="w-24 h-24" />,
            description: "With Charlie, you'll never get lost! He always points towards the next exciting adventure."
        },
        {
            id: 3,
            name: 'Penny Passport',
            role: 'Collector',
            tagline: 'Collecting stamps on every journey!',
            color: 'bg-purple-100 text-purple-600',
            icon: <Book className="w-24 h-24" />,
            description: "Penny loves keeping memories safe. She's ready to fill her pages with stamps from your travels."
        },
        {
            id: 4,
            name: 'Andy Airplane',
            role: 'Traveler',
            tagline: 'Flying high to new places!',
            color: 'bg-sky-100 text-sky-600',
            icon: <Plane className="w-24 h-24" />,
            description: "Andy is fast, friendly, and loves the view from the clouds. He's always ready for takeoff!"
        },
        {
            id: 5,
            name: 'Sammy Suitcase',
            role: 'Packer',
            tagline: 'Packing memories for the road!',
            color: 'bg-amber-100 text-amber-600',
            icon: <Briefcase className="w-24 h-24" />,
            description: "Sammy might be square, but he's full of surprises! He carries everything you need for the trip."
        },
        {
            id: 6,
            name: 'Matty Map',
            role: 'Explorer',
            tagline: 'Charting a course for discovery!',
            color: 'bg-orange-100 text-orange-600',
            icon: <MapIcon className="w-24 h-24" />,
            description: "Matty loves to unfold new paths and show you the hidden treasures in every city."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-mediumight text-slate-900 mb-6">
                    Meet Your Adventure Crew
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    These friendly pals are here to guide you through every page of your activity book!
                </p>
            </div>

            {/* Character Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden relative"
                    >
                        {/* Decorative background blob */}
                        <div className={`absolute top-0 w-full h-32 opacity-20 ${char.color.split(' ')[0]} rounded-b-[50%] scale-150 transform -translate-y-16 group-hover:scale-175 transition-transform duration-500`}></div>

                        <div className={`relative z-10 w-40 h-40 rounded-full ${char.color} flex items-center justify-center mb-6 shadow-inner transform group-hover:scale-110 transition-transform duration-300`}>
                            {char.icon}
                        </div>

                        <h3 className="text-2xl font-medium text-slate-900 mb-1">{char.name}</h3>
                        <span className="text-xs font-medium uppercase tracking-wider text-indigo-500 mb-4 bg-indigo-50 px-3 py-1 rounded-full">
                            {char.role}
                        </span>

                        <p className="text-lg font-medium text-slate-800 italic mb-4">"{char.tagline}"</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{char.description}</p>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto text-center bg-indigo-600 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to start your journey?</h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-lg mx-auto">
                        Create a personalized activity book featuring these characters and your child's favorite destinations.
                    </p>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Create Your Book
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Background decorations */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
        </div>
    );
};

export default CharactersPage;
