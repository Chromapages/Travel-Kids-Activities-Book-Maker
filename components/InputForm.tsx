import React, { useState, useRef } from 'react';
import { ActivityInput } from '../types';
import { ArrowRight, Globe, BookOpen, Layers, ImagePlus, X } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: ActivityInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ActivityInput>({
    age: 7, // Hardcoded default since field is removed
    destinationCountry: '',
    destinationCity: '',
    languageLevel: 'early_reader', // Updated default
    activityMix: ['visual_puzzles', 'language_learning', 'drawing_coloring'],
    styleReferenceImage: undefined
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, styleReferenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, styleReferenceImage: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Travel Activity Generator</h2>
        <p className="text-gray-500 mt-2">Create a personalized, printable activity book for your upcoming trip.</p>
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

        {/* Style Reference */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                <ImagePlus className="w-4 h-4 text-gray-500" /> Visual Style Reference (Optional)
            </div>
            <div className="space-y-1.5">
                <p className="text-xs text-gray-500 mb-2">Upload a photo to define the character style, art style, or color palette for the activity pages.</p>
                
                {!formData.styleReferenceImage ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group"
                    >
                        <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-black mb-2" />
                        <span className="text-sm font-medium text-gray-500 group-hover:text-black">Click to upload reference image</span>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                        <img 
                            src={formData.styleReferenceImage} 
                            alt="Style Reference" 
                            className="w-full h-full object-contain"
                        />
                        <button 
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-center text-white text-xs font-medium">
                            Style Reference Active
                        </div>
                    </div>
                )}
            </div>
        </div>

        <hr className="border-gray-100" />

        {/* Reading Level Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-gray-500" /> Reading Level
            </div>
            <div className="relative max-w-md">
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