import React, { useState, useRef } from 'react';
import { ActivityInput } from '../types';
import { ArrowRight, Globe, BookOpen, Layers, ImagePlus, X, MapPin, Loader2, Sparkles } from 'lucide-react';

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
    <div className="w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-indigo-50/50 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-10 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-tr-[50px] -z-10 opacity-50"></div>

      <div className="mb-8 relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-100 rounded-full blur-xl opacity-60"></div>
        <h2 className="text-3xl font-light text-slate-900 tracking-tight flex items-center gap-3">
          <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-indigo-200">
            <BookOpen className="w-5 h-5" />
          </span>
          Create Your Guide
        </h2>
        <p className="text-slate-500 mt-3 text-lg font-medium max-w-lg">
          Generate a personalized 14-page activity book for your kid's next adventure in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Destination Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-3 py-1 rounded-full">
            <Globe className="w-3.5 h-3.5" /> Destination Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block ml-1">Where to?</label>
              <div className="relative">
                <input
                  type="text"
                  name="destinationCountry"
                  required
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  placeholder="e.g. Japan"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-normal placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block ml-1">Specific City (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleChange}
                  placeholder="e.g. Kyoto"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-normal placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reading Level Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-widest bg-white shadow-sm w-fit px-3 py-1 rounded-full border border-indigo-50">
              <BookOpen className="w-3.5 h-3.5" /> Traveler Experience
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Reading Level</label>
              <p className="text-xs text-slate-500 font-medium">Adapts vocabulary and puzzle complexity.</p>
            </div>
            <div className="relative">
              <select
                name="languageLevel"
                value={formData.languageLevel}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium appearance-none focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm hover:border-slate-300"
              >
                <option value="pre_reader">Pre-Reader (Visual & Simple)</option>
                <option value="early_reader">Early Reader (Basic Words)</option>
                <option value="confident_reader">Confident (Story & Trivia)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Style Reference */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-3 py-1 rounded-full">
            <ImagePlus className="w-3.5 h-3.5" /> Visual Style
          </div>

          {!formData.styleReferenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-50 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-indigo-500">
                <ImagePlus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Upload reference image (Optional)</span>
              <span className="text-xs text-slate-400 font-medium mt-1">For consistent character or art style</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative w-full h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 group shadow-inner">
              <img
                src={formData.styleReferenceImage}
                alt="Style Reference"
                className="w-full h-full object-contain p-4"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-4 py-2 bg-white rounded-full shadow-lg text-red-600 font-medium text-xs hover:bg-red-50 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <X className="w-3 h-3" /> Remove Image
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-medium shadow-md uppercase tracking-wider flex items-center gap-1.5 border border-indigo-400/50">
                <Sparkles className="w-3 h-3 text-yellow-300" /> Reference Active
              </div>
            </div>
          )}
        </div>

        {/* Activity Mix */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-widest bg-indigo-50 w-fit px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" /> Activity Mix
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'visual_puzzles', label: '🧩 Visual Puzzles' },
              { id: 'language_learning', label: '🗣️ Language' },
              { id: 'drawing_coloring', label: '🎨 Coloring' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleMixChange(type.id)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 select-none active:scale-95 ${formData.activityMix.includes(type.id)
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
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
            className={`w-full py-5 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 transition-all transform duration-300 ${isLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0.5 border border-indigo-500/50'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="tracking-tight">Preparing Adventure...</span>
              </>
            ) : (
              <>
                Generate Activity Book
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 font-normal mt-4">
            Powered by Gemini 3.0 Pro • Generates 14 printable pages
          </p>
        </div>
      </form>
    </div>
  );
};


export default InputForm;