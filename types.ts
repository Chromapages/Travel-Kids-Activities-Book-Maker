export interface ActivityInput {
  age: number;
  destinationCountry: string;
  destinationCity?: string;
  languageLevel: 'pre_reader' | 'early_reader' | 'confident_reader';
  activityMix: string[];
  styleReferenceImage?: string;
}

export interface DestinationContent {
  continent: string;
  catchy_title: string;
  introduction: string;
  fun_facts: string[];
  landmarks: { 
    name: string; 
    description: string; 
    activity_type: string;
    visual_prompt: string;
  }[];
  traditions: {
    name: string;
    description: string;
    activity_idea: string;
    visual_prompt: string;
  }[];
  foods: { 
    name: string; 
    description: string; 
    visual_prompt: string;
  }[];
  language: { 
    phrases: { local: string; english: string; phonetic: string }[];
    game_idea: string;
  };
  history: {
    event_or_symbol: string;
    summary: string;
    activity_idea: string;
    visual_prompt: string;
  }[];
  wildlife: {
    name: string;
    description: string;
    activity_idea: string;
    visual_prompt: string;
  }[];
  mascot_name: string;
  mascot_type: string;
  symbols: {
    flag_description: string;
    animal: string;
    flower: string;
  };
  transport: {
    name: string;
    type: string;
    visual_prompt: string;
  }[];
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
  content: any;
  imagePrompt?: string;
  isVisual: boolean;
}

export interface ActivityBookResponse {
  meta: ActivityInput;
  pages: BookPage[];
}