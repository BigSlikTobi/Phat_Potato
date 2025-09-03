
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { User, Plan, Recipe, MealSlot, ChatMessage } from '../types';
import { SYSTEM_PROMPT } from '../constants';

// This is a MOCK service. In a real application, you would initialize and use the Gemini API here.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_NUTRITION = {
  kcal: 500,
  protein_g: 15,
  carbs_g: 90,
  fat_g: 10,
  fiber_g: 12,
};

// --- MOCK API ---
export const getCoachResponse = async (
    prompt: string, 
    user: User, 
    chatHistory: ChatMessage[]
): Promise<ChatMessage> => {
    console.log("Simulating Gemini call with prompt:", prompt);
    console.log("User context:", user);

    // Simulate network delay
    await new Promise(res => setTimeout(res, 1500));

    // Simple keyword-based mock responses
    if (prompt.toLowerCase().includes("plan my day")) {
        const newPlan: Plan = {
            id: `plan_${Date.now()}`,
            userId: 'user_1',
            scope: 'daily',
            date_start: new Date().toISOString().split('T')[0],
            date_end: new Date().toISOString().split('T')[0],
            targets: { daily_kcal: user.preferences.kcal_target, meals_per_day: 4 },
            items: [
                { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Breakfast, recipeId: "__NEW__", servings: 1, lock: false },
                { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Lunch, recipeId: "__NEW__", servings: 1, lock: false },
                { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Dinner, recipeId: "__NEW__", servings: 1, lock: false },
                { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Snack, recipeId: "__NEW__", servings: 1, lock: false },
            ],
        };
        const newRecipes: Recipe[] = [
            { id: `recipe_${Date.now()}_1`, title: 'AI Breakfast Hash', description: 'Generated for you.', appliances: user.preferences.appliances, ingredients: [], steps: [], tags: [], est_nutrition: {...MOCK_NUTRITION, kcal: 450}, time_minutes: 20, servings_default: 1, is_system: false },
            { id: `recipe_${Date.now()}_2`, title: 'AI Lunch Bowl', description: 'Generated for you.', appliances: user.preferences.appliances, ingredients: [], steps: [], tags: [], est_nutrition: {...MOCK_NUTRITION, kcal: 650}, time_minutes: 30, servings_default: 1, is_system: false },
            { id: `recipe_${Date.now()}_3`, title: 'AI Dinner Plate', description: 'Generated for you.', appliances: user.preferences.appliances, ingredients: [], steps: [], tags: [], est_nutrition: {...MOCK_NUTRITION, kcal: 600}, time_minutes: 40, servings_default: 1, is_system: false },
            { id: `recipe_${Date.now()}_4`, title: 'AI Quick Snack', description: 'Generated for you.', appliances: user.preferences.appliances, ingredients: [], steps: [], tags: [], est_nutrition: {...MOCK_NUTRITION, kcal: 100}, time_minutes: 10, servings_default: 1, is_system: false },
        ]

        return {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: `I've created a new daily plan for you with ${user.preferences.kcal_target} kcal, using your preferred appliances. Here are some new recipe ideas.`,
            plan: newPlan,
            recipes: newRecipes,
            cta: ['Save Plan', 'Swap Lunch', 'Log Breakfast'],
        }
    }

    if (prompt.toLowerCase().includes("swap")) {
         const newRecipe: Recipe = { id: `recipe_${Date.now()}`, title: 'AI Swapped Meal', description: 'A great alternative.', appliances: user.preferences.appliances, ingredients: [], steps: [], tags: [], est_nutrition: MOCK_NUTRITION, time_minutes: 30, servings_default: 1, is_system: false }
        return {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: "Sure, here is a swap suggestion for you.",
            recipes: [newRecipe],
            cta: ['Accept Swap', 'Log Meal'],
        }
    }

    return {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: "I'm your Potato Diet Coach! How can I help you today? You can ask me to plan your day, suggest a recipe, or swap a meal.",
    };
};


/*
// --- REAL GEMINI API IMPLEMENTATION (for reference) ---

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        appliances: { type: Type.ARRAY, items: { type: Type.STRING } },
        ingredients: { 
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: { name: {type: Type.STRING}, qty: {type: Type.NUMBER}, unit: {type: Type.STRING} } 
            }
        },
        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        est_nutrition: {
            type: Type.OBJECT,
            properties: {
                kcal: { type: Type.NUMBER },
                protein_g: { type: Type.NUMBER },
                carbs_g: { type: Type.NUMBER },
                fat_g: { type: Type.NUMBER },
            }
        },
        time_minutes: { type: Type.NUMBER },
    }
};

const planSchema = {
    type: Type.OBJECT,
    properties: {
        scope: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    meal_slot: { type: Type.STRING },
                    recipe: recipeSchema, // Nested recipe
                }
            }
        }
    }
}


export const getRealCoachResponse = async (prompt: string, user: User) => {
    try {
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Profile: ${JSON.stringify(user.profile)}\nUser Preferences: ${JSON.stringify(user.preferences)}\n\nUser query: "${prompt}"`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        response_text: { type: Type.STRING },
                        plan: planSchema,
                        recipes: { type: Type.ARRAY, items: recipeSchema },
                        ui_cta: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        
        const responseText = response.text;
        const parsedResponse = JSON.parse(responseText);
        
        // Process and return parsedResponse to match ChatMessage type
        
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            id: `err_${Date.now()}`,
            sender: 'ai',
            text: "Sorry, I encountered an error. Please try again."
        }
    }
}
*/