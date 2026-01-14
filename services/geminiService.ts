import { GoogleGenAI, Type } from "@google/genai";
import { ActivityInput, ActivityBookResponse } from '../types';

const apiKey = process.env.API_KEY;
// Note: We create the client instance inside functions to ensure fresh keys if managed externally, 
// though typically process.env is static.
const getClient = () => new GoogleGenAI({ apiKey: apiKey });

export const generateActivityBook = async (input: ActivityInput): Promise<ActivityBookResponse> => {
  const ai = getClient();
  
  const prompt = `
    Create a general children's travel activity book based on these details:
    Age: ${input.age}
    Destination: ${input.destinationCity ? `${input.destinationCity}, ` : ''}${input.destinationCountry}
    Language Level: ${input.languageLevel}
    Activity Mix: ${input.activityMix.join(', ')}

    Generate 6 distinct, creative, and printable activities. 
    Ensure themes are specific to the destination (culture, landmarks, food, nature) but avoid stereotypes.
    Adjust difficulty for age ${input.age}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meta: {
            type: Type.OBJECT,
            properties: {
              age: { type: Type.NUMBER },
              destinationCountry: { type: Type.STRING },
              destinationCity: { type: Type.STRING },
              languageLevel: { type: Type.STRING },
              activityMix: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                group: { type: Type.STRING, enum: ['visual_puzzles', 'language_learning', 'drawing_coloring'] },
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                destination_hook: { type: Type.STRING },
                age_band: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] },
                instructions_child_friendly: { type: Type.STRING },
                target_skill: { type: Type.STRING, nullable: true },
                layout_description: { type: Type.STRING },
                content: { 
                  type: Type.OBJECT, 
                  properties: {
                    items: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of words for word searches, items to find, or scavenger hunt targets."
                    },
                    phrases: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                original: { type: Type.STRING, description: "Word in foreign language" },
                                pronunciation: { type: Type.STRING },
                                english: { type: Type.STRING, description: "Meaning in English" }
                            }
                        },
                        description: "Vocabulary or phrases for language activities."
                    },
                    steps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Drawing steps or ordered instructions."
                    }
                  }
                },
                materials_needed_simple: { type: Type.ARRAY, items: { type: Type.STRING } },
                safety_note: { type: Type.STRING, nullable: true },
                answer_key_description: { type: Type.STRING, nullable: true }
              },
              required: ['group', 'type', 'title', 'destination_hook', 'difficulty', 'instructions_child_friendly', 'layout_description']
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response generated");
  }

  return JSON.parse(response.text) as ActivityBookResponse;
};

export const generateActivityImage = async (
  description: string, 
  style: string = 'coloring_page', 
  aspectRatio: string = '3:4'
): Promise<string> => {
  const ai = getClient();
  
  // Choose model based on style intent. 
  // 'gemini-2.5-flash-image' is the Nano Banana equivalent for this context.
  
  const visualPrompt = style === 'coloring_page' 
    ? `Create a high-contrast, black and white line art coloring page for children. ${description}. IMPORTANT: If text is specified, render it clearly and legibly in a fun font within the image. Simple, clean lines, white background, no shading.`
    : `Create a flat, illustrated visual puzzle asset for children. ${description}. IMPORTANT: If text is specified, render it clearly and legibly in a fun font within the image. Clear, vector-style art, white background, kid-friendly colors.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: visualPrompt,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio // "1:1", "3:4", "4:3", "9:16", "16:9"
      }
    }
  });

  // Extract image
  let base64Image = '';
  // Check parts for inlineData
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break;
      }
    }
  }

  if (!base64Image) {
    throw new Error("No image generated");
  }

  return `data:image/png;base64,${base64Image}`;
};