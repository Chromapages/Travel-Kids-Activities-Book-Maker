export interface ActivityInput {
  age: number;
  destinationCountry: string;
  destinationCity?: string;
  languageLevel: 'pre_reader' | 'early_reader' | 'confident_reader';
  activityMix: string[]; // Kept for compatibility, though spec overrides mostly
  styleReferenceImage?: string;
}

// Data returned from Gemini to fill the templates
export interface DestinationContent {
  continent: string;
  description_kid_friendly: string;
  mascot_name: string; // e.g., Bento
  mascot_type: string; // e.g., Beagle
  landmarks: { name: string; description: string; visual_prompt: string }[];
  natural_wonders: { name: string; description: string; visual_prompt: string }[];
  foods: { name: string; description: string; visual_prompt: string }[];
  historical_figure: { name: string; role: string; visual_prompt: string };
  historical_site: { name: string; description: string; visual_prompt: string };
  transport: { name: string; type: string; visual_prompt: string }[];
  language: { 
    hello: { local: string; phonetic: string };
    thank_you: { local: string; phonetic: string };
    goodbye: { local: string; phonetic: string };
  };
  symbols: { flag_description: string; animal: string; flower: string };
  fun_facts: string[];
}

export type PageLayoutType = 
  | 'title_page' 
  | 'intro_text' 
  | 'passport' 
  | 'map' 
  | 'coloring' 
  | 'maze' 
  | 'matching' 
  | 'drawing_prompt' 
  | 'checklist' 
  | 'journal';

export interface BookPage {
  pageNumber: number;
  section: string;
  title: string;
  layoutType: PageLayoutType;
  instructions: string;
  content: any; // Flexible content payload
  imagePrompt?: string; // The prompt we will send to Image Gen
  isVisual: boolean; // Does this page need an image generated?
}

export interface ActivityBookResponse {
  meta: ActivityInput;
  pages: BookPage[];
}