export interface ActivityInput {
  age: number;
  destinationCountry: string;
  destinationCity?: string;
  languageLevel: 'pre_reader' | 'early_reader' | 'confident_reader';
  activityMix: string[];
}

export interface ActivityItem {
  group: 'visual_puzzles' | 'language_learning' | 'drawing_coloring';
  type: string;
  title: string;
  destination_hook: string;
  age_band: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions_child_friendly: string;
  target_skill: string | null;
  layout_description: string;
  content: any; // Flexible content based on type
  materials_needed_simple: string[];
  safety_note: string | null;
  answer_key_description?: string;
}

export interface ActivityBookResponse {
  meta: ActivityInput;
  activities: ActivityItem[];
}

export interface GeneratedImage {
  activityTitle: string;
  base64: string;
}