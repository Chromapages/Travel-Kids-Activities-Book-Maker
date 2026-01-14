import React, { useState } from 'react';
import { ActivityInput } from '../types';
import { ArrowRight, MapPin, Globe, User, BookOpen, Layers } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: ActivityInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ActivityInput>({
    age: 5,
    destinationCountry: '',
    destinationCity: '',
    languageLevel: 'pre_reader',
    activityMix: ['visual_puzzles', 'language_learning', 'drawing_coloring'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMixChange = (value: string) => {
    setFormData(prev => {
      const current = prev.activityMix;
      if (current.includes(value)) {
        return { ...prev, activityMix: current.filter(item => item !== value) };
      } else {
        return { ...prev, activityMix: [...current, value] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Travel Activity Generator</h2>
        <p className="text-gray-500 mt-2">Create a personalized, printable activity book for your child's upcoming trip.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Destination Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-gray-500" /> Destination
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Country</label>
              <input
                type="text"
                name="destinationCountry"
                required
                value={formData.destinationCountry}
                onChange={handleChange}
                placeholder="e.g. Japan"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">City or Region (Optional)</label>
              <input
                type="text"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
                placeholder="e.g. Kyoto"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Child Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Age */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    <User className="w-4 h-4 text-gray-500" /> Child's Age
                 </div>
                 <div className="space-y-1.5">
                    <input
                    type="number"
                    name="age"
                    min="3"
                    max="12"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    />
                 </div>
            </div>

            {/* Reading Level */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-gray-500" /> Reading Level
                </div>
                <div className="relative">
                    <select
                        name="languageLevel"
                        value={formData.languageLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all cursor-pointer"
                    >
                        <option value="pre_reader">Pre-Reader (Visual only)</option>
                        <option value="early_reader">Early Reader (Simple words)</option>
                        <option value="confident_reader">Confident Reader</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                </div>
            </div>
        </div>

        <hr className="border-gray-100" />

        {/* Activity Mix */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-gray-500" /> Content Mix
            </div>
            <div className="flex flex-wrap gap-3">
                {[
                    { id: 'visual_puzzles', label: 'Visual Puzzles' },
                    { id: 'language_learning', label: 'Language & Culture' },
                    { id: 'drawing_coloring', label: 'Drawing & Coloring' }
                ].map(type => (
                    <button
                        key={type.id}
                        type="button"
                        onClick={() => handleMixChange(type.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${
                            formData.activityMix.includes(type.id)
                                ? 'bg-black border-black text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="pt-4">
            <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                isLoading 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl active:scale-[0.99]'
            }`}
            >
            {isLoading ? (
                <span className="flex items-center gap-2">Generating...</span>
            ) : (
                <>Generate Activity Book <ArrowRight className="w-4 h-4" /></>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;