
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityInput, ActivityBookResponse, DestinationContent, BookPage } from '../types';

const assembleBookStructure = (input: ActivityInput, data: DestinationContent): BookPage[] => {
  const pages: BookPage[] = [];
  const destName = input.destinationCity ? input.destinationCity : input.destinationCountry;
  const mascot = `${data.mascot_name} the ${data.mascot_type}`;

  const addPage = (
    section: string, 
    title: string, 
    layout: any, 
    instructions: string, 
    content: any = {}, 
    promptOverride: string = ""
  ) => {
    pages.push({
      pageNumber: pages.length + 1,
      section,
      title,
      layoutType: layout,
      instructions,
      isVisual: true,
      content,
      imagePrompt: `Children's activity book page. ${promptOverride || `A ${layout} activity for ${title}.`}`
    });
  };

  // 1-4: Front Matter
  addPage("Front Matter", data.catchy_title, 'title_page', "Color your adventure cover!", {}, 
    `A fun coloring book cover with large bubble letters: "${data.catchy_title}". Surrounded by travel icons and ${mascot}. Line art.`);
  addPage("Front Matter", "Welcome to " + destName, 'intro_text', "Your guide is here!", { text: data.introduction }, 
    `Mascot ${mascot} greeting the reader with a big "Welcome!" sign. Line art.`);
  addPage("Front Matter", "Meet " + data.mascot_name, 'coloring', `Color your buddy ${data.mascot_name}`, {}, 
    `A cute ${data.mascot_type} wearing a backpack and explorer hat in a landmark setting. Line art.`);
  addPage("Front Matter", "Travel Passport", 'passport', "Draw yourself and your details", {}, 
    `A kid's passport template with space for a photo drawing and name/age/date lines. Line art.`);

  // 5-8: Getting Ready & Geography
  addPage("Getting Ready", `Where in the World?`, 'map', `Find ${destName} in ${data.continent}`, { label: data.continent }, 
    `A map of ${data.continent} with ${destName} highlighted. Simple lines. Line art.`);
  addPage("Getting Ready", "Packing Fun", 'checklist', "Check off these travel items!", { items: ["Ticket", "Map", "Snacks", "Camera"] }, 
    `A messy suitcase filled with fun items for the child to find and color. Line art.`);
  addPage("Getting Ready", "Destination Facts", 'intro_text', "Wow! Did you know?", { text: data.fun_facts.slice(0, 3).join("\n") }, 
    `Bubbles with fun fact illustrations inside them. Line art.`);
  addPage("Getting Ready", "Symbol Study", 'coloring', `Color the ${data.symbols.animal}`, {}, 
    `A detailed coloring page of the ${data.symbols.animal} and ${data.symbols.flower}. Line art.`);

  // 9-12: Landmarks & Nature
  const landmark = data.landmarks[0] || { name: 'Famous Landmark', description: 'A beautiful site' };
  addPage("Discovering", landmark.name, 'coloring', landmark.description, {}, 
    `A grand view of ${landmark.name}. Kid-friendly coloring style. Line art.`);
  addPage("Discovering", "Connect the Dots", 'drawing_prompt', `Discover ${data.landmarks[1]?.name || 'a secret place'}`, {}, 
    `A connect-the-dots puzzle forming the shape of ${data.landmarks[1]?.name || 'a landmark'}. Line art.`);
  addPage("Discovering", "Landscape Drawing", 'drawing_prompt', "Draw the natural wonders", {}, 
    `A half-finished drawing of a mountain or beach scene for the child to finish. Line art.`);
  addPage("Discovering", "I-Spy Nature", 'checklist', "Find these symbols", {}, 
    `A busy nature scene filled with local plants and hidden icons. Line art.`);

  // 13-16: Culture & Traditions
  const tradition = data.traditions[0] || { name: 'Local Tradition', description: 'A special festival' };
  addPage("Culture", tradition.name, 'coloring', tradition.description, {}, 
    `Illustration of ${tradition.name} festivities with ${mascot} joining in. Line art.`);
  addPage("Culture", "Design Challenge", 'drawing_prompt', data.traditions[1]?.activity_idea || "Draw a mask", {}, 
    `A template for a cultural mask or outfit based on ${data.traditions[1]?.name || 'local culture'}. Line art.`);
  addPage("Culture", "Tradition Match", 'matching', "Match the custom to the meaning", {}, 
    `Fun icons of different cultural customs to match with words. Line art.`);
  addPage("Culture", "Life in " + destName, 'coloring', "A day in the life", {}, 
    `A street scene showing traditional homes and friendly people. Line art.`);

  // 17-20: Food & Fun
  addPage("Food & Fun", "Yummy Dishes", 'matching', "Match the food to the plate", { items: data.foods }, 
    `Drawings of ${data.foods.map(f => f.name).join(', ')} on one side. Line art.`);
  addPage("Food & Fun", "My Local Feast", 'drawing_prompt', "Draw your favorite lunch", {}, 
    `An empty plate and utensils with ${mascot} looking hungry. Line art.`);
  addPage("Food & Fun", "Sweet Treats", 'coloring', "Color these local desserts", {}, 
    `A bakery window filled with delicious treats from ${destName}. Line art.`);
  addPage("Food & Fun", "Food Words", 'matching', "Match the names", {}, 
    `Words and food icons to connect. Line art.`);

  // 21-24: History Highlights
  const hist = data.history[0] || { event_or_symbol: 'Historical Event', summary: 'A long time ago...', activity_idea: 'Draw a castle' };
  addPage("History", "Ancient Secrets", 'coloring', hist.summary, {}, 
    `A scene showing the ${hist.event_or_symbol} from history. Friendly characters. Line art.`);
  addPage("History", "Design a Crest", 'drawing_prompt', hist.activity_idea, {}, 
    `A large blank heraldic shield or banner for the child to decorate. Line art.`);
  addPage("History", "Time Travel Maze", 'maze', "Help the explorer find the artifact", {}, 
    `A maze shaped like an ancient castle or temple. Line art.`);
  addPage("History", "Historian's Sketchbook", 'drawing_prompt', "Draw a historical figure", {}, 
    `An ornate picture frame for the child to draw ${data.history[1]?.event_or_symbol || 'a figure from the past'}. Line art.`);

  // 25-28: Language Fun
  addPage("Language", "Let's Speak!", 'intro_text', "Learn new words", { text: data.language.phrases.map(p => `${p.english}: ${p.local} (${p.phonetic})`).join("\n") }, 
    `Speech bubbles with words coming out of ${mascot}'s mouth. Line art.`);
  addPage("Language", "Alphabet Fun", 'drawing_prompt', "Trace the local greeting", {}, 
    `Large block letters for the local word for 'Hello'. Line art.`);
  addPage("Language", "Phrase Match", 'matching', data.language.game_idea, {}, 
    `Match English words to the local language equivalents. Line art.`);
  addPage("Language", "Secret Code", 'maze', "Decode the travel message", {}, 
    `A coding puzzle where symbols represent letters. Line art.`);

  // 29-32: Wildlife & Nature
  const wild = data.wildlife[0] || { name: 'Local Animal', description: 'A cute creature' };
  addPage("Wildlife", wild.name, 'coloring', wild.description, {}, 
    `A majestic drawing of the ${wild.name} in its habitat. Line art.`);
  addPage("Wildlife", "Guess the Animal", 'matching', data.wildlife[1]?.activity_idea || "Match the tracks", {}, 
    `Drawings of paws/tracks to match to the animals. Line art.`);
  addPage("Wildlife", "Under the Stars", 'coloring', "Color the night sky wildlife", {}, 
    `Animals seen at night in ${destName}. Line art.`);
  addPage("Wildlife", "Nature Guardian", 'checklist', "Find the hidden creatures", {}, 
    `A complex jungle or forest scene with hidden animals to circle. Line art.`);

  // 33-36: Travel Games
  addPage("Fun Time", "Adventure Maze", 'maze', "Get to the landmark!", {}, 
    `A maze shaped like the country outline. Line art.`);
  addPage("Fun Time", "Travel Word Search", 'matching', "Find the hidden words", {}, 
    `A grid with words like "EXPLORE", "MAP", and "${destName.toUpperCase()}". Line art.`);
  addPage("Fun Time", "I-Spy Icons", 'checklist', "Find 5 hidden items", {}, 
    `A page covered in small icons (planes, taxis, maps) to count. Line art.`);
  addPage("Fun Time", "Relaxing Mandala", 'coloring', "A pattern from the culture", {}, 
    `A circular mandala pattern based on the national flower. Line art.`);

  // 37-42: Memories & Bonus
  addPage("Memories", "My Favorite Moment", 'drawing_prompt', "Draw your favorite thing you saw", {}, 
    `A large polaroid frame with a caption line. Line art.`);
  addPage("Memories", "Travel Log", 'journal', "Write about your trip", {}, 
    `A lined page with a decorative border. Line art.`);
  addPage("Memories", "Postcard to Home", 'drawing_prompt', "Draw a postcard for a friend", {}, 
    `A postcard template with space for a stamp and address. Line art.`);
  addPage("Memories", "Passport Stamp", 'coloring', "Collect your official stamp!", {}, 
    `A giant, ornate circular stamp saying "${destName} EXPLORER". Line art.`);
  addPage("Memories", "Where Next?", 'map', "Circle your next dream trip", {}, 
    `A simplified world map for the child to circle their next goal. Line art.`);
  addPage("Memories", "For Grown-Ups", 'intro_text', "A message from Young Explorers Guide", { text: "Thank you for exploring with us! We hope this sparked curiosity and joy." }, 
    `Mascot ${mascot} waving goodbye with a "The End" sign. Line art.`);

  return pages;
};

export const generateActivityBook = async (input: ActivityInput): Promise<ActivityBookResponse> => {
  // Always create fresh instance right before call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    MASTER ROLE: You are an expert educator and travel guide for kids aged 4–10.
    TASK: Generate cultural and geographical data for a children's activity book about ${input.destinationCity ? input.destinationCity + ", " : ""}${input.destinationCountry}.
    RESEARCH: Use Google Search to find current, exciting, kid-friendly details.
    TONE: Cheerful, simple, and educational (Reading Level: ${input.languageLevel}).
    OUTPUT: A valid JSON object following the required schema. Be creative and culturally respectful.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          continent: { type: Type.STRING },
          catchy_title: { type: Type.STRING },
          introduction: { type: Type.STRING },
          fun_facts: { type: Type.ARRAY, items: { type: Type.STRING } },
          landmarks: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                name: { type: Type.STRING }, 
                description: { type: Type.STRING }, 
                activity_type: { type: Type.STRING },
                visual_prompt: { type: Type.STRING } 
              },
              required: ["name", "description"]
            } 
          },
          traditions: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                name: { type: Type.STRING }, 
                description: { type: Type.STRING }, 
                activity_idea: { type: Type.STRING },
                visual_prompt: { type: Type.STRING } 
              },
              required: ["name", "description"]
            } 
          },
          foods: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                name: { type: Type.STRING }, 
                description: { type: Type.STRING }, 
                visual_prompt: { type: Type.STRING } 
              },
              required: ["name"]
            } 
          },
          language: { 
            type: Type.OBJECT, 
            properties: {
              phrases: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    local: { type: Type.STRING }, 
                    english: { type: Type.STRING }, 
                    phonetic: { type: Type.STRING } 
                  } 
                } 
              },
              game_idea: { type: Type.STRING }
            }
          },
          history: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                event_or_symbol: { type: Type.STRING }, 
                summary: { type: Type.STRING }, 
                activity_idea: { type: Type.STRING },
                visual_prompt: { type: Type.STRING } 
              } 
            } 
          },
          wildlife: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                name: { type: Type.STRING }, 
                description: { type: Type.STRING }, 
                activity_idea: { type: Type.STRING },
                visual_prompt: { type: Type.STRING } 
              } 
            } 
          },
          mascot_name: { type: Type.STRING },
          mascot_type: { type: Type.STRING },
          symbols: { 
            type: Type.OBJECT, 
            properties: { 
              flag_description: { type: Type.STRING }, 
              animal: { type: Type.STRING }, 
              flower: { type: Type.STRING } 
            } 
          },
          transport: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                name: { type: Type.STRING }, 
                type: { type: Type.STRING }, 
                visual_prompt: { type: Type.STRING } 
              } 
            } 
          }
        },
        required: ["continent", "catchy_title", "introduction", "fun_facts", "landmarks", "traditions", "foods", "language", "history", "wildlife", "mascot_name", "mascot_type", "symbols", "transport"]
      }
    }
  });

  if (!response.text) throw new Error("No response generated");

  const destinationData = JSON.parse(response.text) as DestinationContent;
  const pages = assembleBookStructure(input, destinationData);

  const result: ActivityBookResponse = {
    meta: input,
    pages: pages
  };

  if (input.styleReferenceImage) result.meta.styleReferenceImage = input.styleReferenceImage;
  return result;
};

export const generateActivityImage = async (
  description: string, 
  style: string = 'coloring_page', 
  aspectRatio: string = '3:4',
  referenceImageBase64?: string
): Promise<string> => {
  // Always create fresh instance right before call for Gemini 3 Pro Pro usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let visualPrompt = style === 'coloring_page' 
    ? `Generate a BRAND NEW, unique high-contrast black and white line art coloring page. SUBJECT: ${description}. Clean lines, white background, no shading.`
    : `Generate a BRAND NEW, unique vibrant children's book illustration. SUBJECT: ${description}. Bright cheerful colors, clean vector style.`;

  const contents: any[] = [];

  if (referenceImageBase64) {
    const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeMatch = referenceImageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
    visualPrompt += " Use the provided image ONLY as a style reference for artistic technique and mascot appearance. Create a completely new composition for the subject.";
  }

  contents.push({ text: visualPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: contents },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: "1K"
      },
      tools: [{googleSearch: {}}]
    }
  });

  let base64Image = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break;
      }
    }
  }

  if (!base64Image) throw new Error("No image generated");
  return `data:image/png;base64,${base64Image}`;
};
