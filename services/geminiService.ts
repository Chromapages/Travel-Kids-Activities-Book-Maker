import { GoogleGenAI, Type } from "@google/genai";
import { ActivityInput, ActivityBookResponse, DestinationContent, BookPage } from '../types';

const apiKey = process.env.API_KEY;
const getClient = () => new GoogleGenAI({ apiKey: apiKey });

// This function assembles the 42-page structure defined in the spec
const assembleBookStructure = (input: ActivityInput, data: DestinationContent): BookPage[] => {
  const pages: BookPage[] = [];
  const destName = input.destinationCity ? input.destinationCity : input.destinationCountry;
  const mascot = `${data.mascot_name} the ${data.mascot_type}`;

  // Helper to push pages
  // Note: isVisual is now forced to true for all pages to satisfy "all image-generated" requirement
  const addPage = (
    section: string, 
    title: string, 
    layout: any, 
    instructions: string, 
    _ignoredIsVisual: boolean = true, 
    content: any = {}, 
    promptOverride: string = ""
  ) => {
    // If a specific prompt isn't provided, we construct one based on the layout and content
    let finalPrompt = promptOverride;
    
    if (!finalPrompt) {
        // Fallback prompt construction if not explicitly passed
        finalPrompt = `A ${layout} activity page for children about ${title}.`;
    }

    pages.push({
      pageNumber: pages.length + 1,
      section,
      title,
      layoutType: layout,
      instructions,
      isVisual: true, // ALWAYS TRUE
      content,
      imagePrompt: `Children's activity book page. ${finalPrompt}`
    });
  };

  // --- I. Front Matter (1-4) ---
  addPage("Front Matter", `Let's Go To ${destName}!`, 'title_page', "Color in your title page!", true, {}, 
    `A fun, exciting coloring book title page with large bubble letters saying "Let's Go To ${destName}!". Surrounded by travel items like suitcases, airplanes, and a camera. Line art.`);
  
  addPage("Front Matter", "Welcome, Traveler!", 'intro_text', "Read this from your guide!", true, { text: `Get your crayons ready! We are going on an adventure to ${destName}.` }, 
    `A coloring page featuring cute mascot ${mascot} holding a large sign or speech bubble that clearly says: "Welcome to ${destName}!". Fun background with clouds. Line art.`);
  
  addPage("Front Matter", "Meet Your Travel Buddy", 'coloring', `Color ${mascot}`, true, {}, 
    `A cute ${data.mascot_type} named ${data.mascot_name} wearing travel gear (backpack, hat), posing ready for adventure in ${destName}. Clear black and white line art.`);
  
  addPage("Front Matter", "My Travel Passport", 'passport', "Draw yourself and write your name", true, {}, 
    `A full-page travel passport template. A large empty rectangular frame for a drawing of the child. Lines below for writing Name, Age, and Date. Official looking stamps in the corners. Line art.`);

  // --- II. Getting Ready (5-8) ---
  addPage("Getting Ready", `Where is ${destName}?`, 'map', `Color ${data.continent} and find ${destName}`, true, { label: data.continent }, 
    `A simplified world map or globe focused on ${data.continent}. The country of ${destName} is outlined clearly. Thick lines for coloring.`);
  
  addPage("Getting Ready", "How Do We Get There?", 'drawing_prompt', "Trace the path to your destination", true, {}, 
    `A map style page showing a small house icon on the left and a destination icon (like a pagoda or tower) on the right. A dashed line flight path connecting them for the child to trace. Clouds and birds in background. Line art.`);
  
  addPage("Getting Ready", "Travel Day I-Spy", 'checklist', "Find and color these items", true, { items: ["Suitcase", "Pilot", "Ticket", "Airplane", "Backpack"] }, 
    `A busy airport terminal scene for an I-Spy game. Hidden items include a suitcase, a pilot, a ticket, an airplane, and a backpack. Clear line art for coloring.`);
  
  addPage("Getting Ready", "Travel Day Relax", 'coloring', "Color the view from the window", true, {}, 
    `A view from inside an airplane looking out the oval window. Outside are fluffy clouds and the airplane wing. Inside is the window frame. Line art.`);

  // --- III. Discovering the Destination (9-12) ---
  addPage("Discovering", `Map of ${destName}`, 'map', "Color the map of the country", true, {}, 
    `A large, simplified outline map of the country ${destName}. Mark a few major cities with stars. Cute icons representing the region inside the map. Line art.`);
  
  addPage("Discovering", "Famous Places", 'drawing_prompt', `Connect the dots to see ${data.landmarks[0]?.name}`, true, { landmark: data.landmarks[0] }, 
    `A connect-the-dots style outline of ${data.landmarks[0]?.name}. Numbered dots forming the shape of the landmark. Line art.`);
  
  addPage("Discovering", "Natural Wonders", 'coloring', `Color the ${data.natural_wonders[0]?.name}`, true, {}, 
    `A beautiful nature coloring page showing ${data.natural_wonders[0]?.name}. Detailed trees, water, or mountains appropriate to the site. Line art.`);
  
  addPage("Discovering", "Geography Fun", 'matching', "Count the mountains and lakes", true, {}, 
    `A fun landscape scene of ${destName} featuring exactly 3 mountains and 2 lakes for a counting activity. Cute style. Line art.`);

  // --- IV. Culture & Daily Life (13-16) ---
  addPage("Culture", "Local Greetings", 'matching', `Match the English to the Local word`, true, {}, 
    `A matching game worksheet. Left side has bubbles with text "Hello", "Thank You", "Goodbye". Right side has bubbles with "${data.language.hello.local}", "${data.language.thank_you.local}", "${data.language.goodbye.local}". Jumbled order. Line art.`);
  
  addPage("Culture", "Traditional Clothing", 'coloring', "Color the traditional outfit", true, {}, 
    `A happy child character wearing traditional ${destName} clothing. Full body pose. Patterned fabric details for coloring. Line art.`);
  
  addPage("Culture", "Life Then and Now", 'checklist', "Spot the differences", true, {}, 
    `A split page illustration. Top half shows a historical street scene from ${destName}. Bottom half shows the same street in modern times. 5 differences to spot. Line art.`);
  
  addPage("Culture", "Daily Life", 'drawing_prompt', `Draw yourself doing this!`, true, {}, 
    `A scene of daily life in ${destName} (e.g. a market or school) with a blank silhouette of a child so the user can draw themselves into the scene. Line art.`);

  // --- V. Food & Fun (17-20) ---
  addPage("Food & Fun", "Yummy Foods", 'matching', "Match the food to its name", true, { items: data.foods }, 
    `A food matching page. Illustrations of ${data.foods.map(f => f.name).join(', ')} arranged on the page. Next to each, a blank line or box to write the name. Line art.`);
  
  addPage("Food & Fun", "My Local Lunch", 'drawing_prompt', "Draw your delicious lunch on the plate", true, {}, 
    `A top-down view of a table setting with a large empty round plate in the center, fork and spoon on sides. Ready for drawing food. Line art.`);
  
  addPage("Food & Fun", "Sweet Treats", 'coloring', `Color these yummy treats`, true, {}, 
    `A delicious display of local desserts and snacks from ${destName}. Cupcakes, pastries, or candies. High detail for coloring. Line art.`);
  
  addPage("Food & Fun", "Food Words", 'matching', "Trace the food words", true, {}, 
    `A handwriting practice page. The words "${data.foods.map(f => f.name).slice(0,3).join(', ')}" written in dashed 'traceable' font, with a small icon of the food next to each. Line art.`);

  // --- VI. History Made Simple (21-24) ---
  addPage("History", "Warriors and Castles", 'drawing_prompt', `Design a shield for a ${data.historical_figure.role}`, true, { figure: data.historical_figure }, 
    `A historical character (${data.historical_figure.role}) standing next to a large blank shield or banner. The child should draw their own design on the shield. Line art.`);
  
  addPage("History", "Iconic Sites", 'coloring', `Color the ${data.historical_site.name}`, true, {}, 
    `A grand illustration of the historical site ${data.historical_site.name}. majestic and old. Line art.`);
  
  addPage("History", "Stories From Long Ago", 'intro_text', "Color the history scene", true, { text: data.fun_facts[0] }, 
    `An illustration depicting a fun historical fact about ${destName}: "${data.fun_facts[0]}". Cartoon style history scene. Line art.`);
  
  addPage("History", "Imagine the Past", 'drawing_prompt', "Draw yourself visiting long ago", true, {}, 
    `A decorative antique picture frame taking up the whole page. Inside is blank whitespace for drawing. The frame has historical carvings. Line art.`);

  // --- VII. Language & Symbols (25-28) ---
  addPage("Language", "Let's Learn Words", 'intro_text', "Color the speech bubbles", true, {}, 
    `A page full of comic book speech bubbles. Inside the bubbles are the words: "Hello" = "${data.language.hello.local}", "Thank You" = "${data.language.thank_you.local}". Fun background patterns. Line art.`);
  
  addPage("Language", "Writing Practice", 'drawing_prompt', `Trace the word "${data.language.hello.local}"`, true, {}, 
    `A large word tracing page. The word "${data.language.hello.local}" appears in huge dashed outline letters in the center. Decorative border. Line art.`);
  
  addPage("Language", `Symbols of ${destName}`, 'matching', "Draw a line to match", true, {}, 
    `A matching activity. Left side: Word "Animal", Word "Flower", Word "Flag". Right side: Illustration of a ${data.symbols.animal}, a ${data.symbols.flower}, and the ${destName} flag. Line art.`);
  
  addPage("Language", "Symbol Coloring", 'coloring', "Color the national patterns", true, {}, 
    `A complex mandala coloring page design incorporating the national flower (${data.symbols.flower}) and animal (${data.symbols.animal}) of ${destName}. Line art.`);

  // --- VIII. Getting Around (29-30) ---
  addPage("Getting Around", "Travel Maze", 'maze', `Help the ${data.transport[0]?.name} get to the station`, true, {}, 
    `A maze puzzle. Start point is a ${data.transport[0]?.name}. End point is a station. The path winds through a city map. Line art.`);
  
  addPage("Getting Around", "City Transport", 'checklist', "Count the vehicles", true, {}, 
    `A busy city street scene in ${destName}. Filled with cars, buses, bicycles, and pedestrians. Designed for counting vehicles. Line art.`);

  // --- IX. Travel Manners (31-32) ---
  addPage("Manners", "Be a Polite Traveler", 'checklist', "Circle the polite actions", true, {}, 
    `A page showing 4 scenes. Scene 1: Kid smiling/waving. Scene 2: Kid littering (sad face). Scene 3: Kid saying thanks. Scene 4: Kid shouting. Child should circle the good ones. Line art.`);
  
  addPage("Manners", "Do This, Not That", 'intro_text', "Color the good traveler", true, {}, 
    `A large illustration of the mascot ${mascot} being polite and bowing or shaking hands. Text at bottom: "I am a polite traveler!". Line art.`);

  // --- X. Just for Fun (33-36) ---
  addPage("Fun Time", "Word Search", 'matching', "Find the hidden letters", true, {}, 
    `A grid of random letters filling the page. Hidden inside are words like "TRAVEL", "FUN", "${destName.toUpperCase()}". (Visual representation of a word search). Line art.`);
  
  addPage("Fun Time", "I-Spy Landmarks", 'checklist', "Find all the landmarks", true, { items: data.landmarks.map(l => l.name) }, 
    `A collage of ${destName} landmarks (${data.landmarks.map(l => l.name).join(', ')}). They are overlapped and hidden for an I-Spy game. Line art.`);
  
  addPage("Fun Time", "Puzzle Time", 'maze', "Find your way through", true, {}, 
    `A challenging abstract geometric maze taking up the full page. Start and End clearly marked. Line art.`);
  
  addPage("Fun Time", "Relaxing Coloring", 'coloring', "Color and relax", true, {}, 
    `A very detailed, peaceful garden scene in ${destName} with flowers, trees, and benches. Zen coloring style. Line art.`);

  // --- XI. Memories (37-42) ---
  addPage("Memories", "My Favorite Place", 'drawing_prompt', "Draw your favorite place here", true, {}, 
    `A large Polaroid photo frame illustration. Inside is blank for drawing. Caption space at the bottom. Line art.`);
  
  addPage("Memories", "What I Learned", 'intro_text', "Write your thoughts", true, {}, 
    `An illustration of an open notebook or diary with lines on the pages. Surrounded by pens and pencils. Ready for writing. Line art.`);
  
  addPage("Memories", "Travel Journal", 'journal', "Write about your trip", true, {}, 
    `A lined page background with faint watermarks of ${destName} symbols (flag, map). Header says "My Travel Journal". Line art.`);
  
  addPage("Memories", "Travel Stamp", 'coloring', "Color your official stamp", true, {}, 
    `A giant, detailed passport stamp design in the center. Text inside says "${destName}" and "Official Traveler". Line art.`);
  
  addPage("Memories", "Where Next?", 'map', "Circle your next adventure", true, {}, 
    `A full world map with continents outlined. Text at top: "Where to next?". Clouds and airplanes around the border. Line art.`);
  
  addPage("Memories", "For Grown-Ups", 'intro_text', "Thanks for traveling!", true, {}, 
    `A thank you page featuring the mascot ${mascot} waving goodbye. Text: "See you on the next adventure!". Line art.`);

  return pages;
};

export const generateActivityBook = async (input: ActivityInput): Promise<ActivityBookResponse> => {
  const ai = getClient();
  
  // Prompt Strategy: Ask for the DATA to fill the skeleton.
  const prompt = `
    I am generating a 42-page travel activity book for children (Age ${input.age}) visiting ${input.destinationCity ? input.destinationCity + ", " : ""}${input.destinationCountry}.
    
    I need you to provide the CULTURAL and GEOGRAPHICAL data to fill the book templates. 
    Return a JSON object with specific details about the destination.
    
    Requirements:
    - Language Level: ${input.languageLevel}
    - Mascot: Choose a dog breed that sounds nice with a name (e.g. "Bento the Beagle").
    - Landmarks/Nature: Real, famous locations.
    - Food: Iconic local dishes appropriate for kids.
    - History: One famous historical figure and one site.
    - Language: Accurate translations for Hello, Thank You, Goodbye.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          continent: { type: Type.STRING },
          description_kid_friendly: { type: Type.STRING },
          mascot_name: { type: Type.STRING },
          mascot_type: { type: Type.STRING },
          landmarks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } } },
          natural_wonders: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } } },
          foods: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } } },
          historical_figure: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } },
          historical_site: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } },
          transport: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, visual_prompt: { type: Type.STRING } } } },
          language: { 
            type: Type.OBJECT, 
            properties: {
              hello: { type: Type.OBJECT, properties: { local: { type: Type.STRING }, phonetic: { type: Type.STRING } } },
              thank_you: { type: Type.OBJECT, properties: { local: { type: Type.STRING }, phonetic: { type: Type.STRING } } },
              goodbye: { type: Type.OBJECT, properties: { local: { type: Type.STRING }, phonetic: { type: Type.STRING } } },
            }
          },
          symbols: { type: Type.OBJECT, properties: { flag_description: { type: Type.STRING }, animal: { type: Type.STRING }, flower: { type: Type.STRING } } },
          fun_facts: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response generated");
  }

  const destinationData = JSON.parse(response.text) as DestinationContent;
  const pages = assembleBookStructure(input, destinationData);

  const result: ActivityBookResponse = {
    meta: input,
    pages: pages
  };

  if (input.styleReferenceImage) {
      result.meta.styleReferenceImage = input.styleReferenceImage;
  }
  return result;
};

export const generateActivityImage = async (
  description: string, 
  style: string = 'coloring_page', 
  aspectRatio: string = '3:4',
  referenceImageBase64?: string
): Promise<string> => {
  const ai = getClient();
  
  let visualPrompt = style === 'coloring_page' 
    ? `Create a high-contrast, black and white line art coloring page for children. ${description}. IMPORTANT: If text is specified in quotes, try to render it clearly in the image. Simple, clean lines, white background, no shading.`
    : `Create a vibrant, high-quality children's book illustration in full color. ${description}. Bright, cheerful colors, clean vector-like style.`;

  const contents = [];

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
    visualPrompt += " Use the provided image as a strict style reference for the character design and art style.";
  }

  contents.push({ text: visualPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: contents },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio 
      }
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