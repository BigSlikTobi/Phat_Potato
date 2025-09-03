import { Recipe, Supplement, Nutrition, MealSlot } from './types';

export const APPLIANCES = ["Air Fryer", "Oven", "Stovetop", "Microwave"];
export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "high"];

const MOCK_NUTRITION: Nutrition = {
  kcal: 450,
  protein_g: 10,
  carbs_g: 80,
  fat_g: 8,
  fiber_g: 9,
  potassium_mg: 1500,
  vitamin_c_mg: 40,
};

export const SYSTEM_RECIPES: Recipe[] = [
  {
    id: 'sys_recipe_1',
    title: 'Crispy Air Fryer Potato Wedges',
    description: 'Perfectly crispy on the outside, fluffy on the inside. A classic made better and easier.',
    appliances: ['Air Fryer'],
    ingredients: [{ name: 'Russet Potatoes', qty: 2, unit: 'large' }, { name: 'Paprika', qty: 1, unit: 'tsp' }, { name: 'Garlic Powder', qty: 1, unit: 'tsp' }, { name: 'Salt', qty: 0.5, unit: 'tsp' }],
    steps: ['Wash and cut potatoes into wedges.', 'Toss with spices.', 'Air fry at 400°F (200°C) for 15-20 minutes, shaking halfway through.', 'Serve immediately.'],
    tags: ['crispy', 'quick', 'low_oil'],
    est_nutrition: { ...MOCK_NUTRITION, kcal: 350, fat_g: 2 },
    time_minutes: 25,
    servings_default: 2,
    is_system: true,
  },
  {
    id: 'sys_recipe_2',
    title: 'Classic Oven-Baked Potatoes',
    description: 'The perfect fluffy baked potato, ready for your favorite toppings.',
    appliances: ['Oven'],
    ingredients: [{ name: 'Baking Potatoes', qty: 4, unit: 'medium' }, { name: 'Salt', qty: 1, unit: 'tsp' }],
    steps: ['Preheat oven to 425°F (220°C).', 'Scrub potatoes and pierce several times with a fork.', 'Rub with a pinch of salt.', 'Bake for 45-60 minutes, until tender.'],
    tags: ['classic', 'simple'],
    est_nutrition: { ...MOCK_NUTRITION, kcal: 280, fat_g: 1 },
    time_minutes: 60,
    servings_default: 4,
    is_system: true,
  },
  {
    id: 'sys_recipe_3',
    title: 'Quick Microwave Mash',
    description: 'Creamy mashed potatoes in minutes, no boiling required.',
    appliances: ['Microwave'],
    ingredients: [{ name: 'Yukon Gold Potatoes', qty: 4, unit: 'medium' }, { name: 'Milk or alternative', qty: 0.25, unit: 'cup' }, { name: 'Salt and Pepper', qty: 1, unit: 'to taste' }],
    steps: ['Peel and cube potatoes.', 'Place in a microwave-safe bowl with 2 tbsp of water, cover.', 'Microwave on high for 8-10 minutes until soft.', 'Drain, then mash with milk, salt, and pepper.'],
    tags: ['quick', 'mash'],
    est_nutrition: { ...MOCK_NUTRITION, kcal: 320, fat_g: 5 },
    time_minutes: 15,
    servings_default: 2,
    is_system: true,
  },
    {
    id: 'sys_recipe_4',
    title: 'Potato & Veggie Hash',
    description: 'A hearty and versatile hash, great for any meal of the day.',
    appliances: ['Stovetop'],
    ingredients: [{ name: 'Potatoes, diced', qty: 2, unit: 'cups' }, { name: 'Bell Pepper, diced', qty: 1, unit: 'cup' }, { name: 'Onion, diced', qty: 0.5, unit: 'cup' }, { name: 'Smoked Paprika', qty: 1, unit: 'tsp' }],
    steps: ['Par-boil diced potatoes for 5 minutes until slightly tender. Drain well.', 'In a non-stick skillet, cook onions and peppers until softened.', 'Add potatoes and paprika.', 'Cook, stirring occasionally, for 15-20 minutes until potatoes are golden and crispy.'],
    tags: ['hearty', 'veggie'],
    est_nutrition: { ...MOCK_NUTRITION, kcal: 410, protein_g: 12, fat_g: 6 },
    time_minutes: 30,
    servings_default: 2,
    is_system: true,
  },
  {
    id: 'sys_recipe_5',
    title: 'Crispy Potato Skins',
    description: 'A delicious snack or light meal using the whole potato.',
    appliances: ['Oven', 'Air Fryer'],
    ingredients: [{ name: 'Baked Potatoes', qty: 4, unit: 'medium' }, { name: 'Chives, chopped', qty: 2, unit: 'tbsp' }, { name: 'Salt', qty: 0.5, unit: 'tsp' }],
    steps: ['Cut baked potatoes in half and scoop out most of the flesh (save for mash).', 'Brush the inside of the skins lightly.', 'Bake at 425°F (220°C) for 10 minutes or air fry for 5 minutes until crisp.', 'Sprinkle with salt and chives.'],
    tags: ['snack', 'crispy'],
    est_nutrition: { ...MOCK_NUTRITION, kcal: 250, fat_g: 1 },
    time_minutes: 20,
    servings_default: 4,
    is_system: true,
  },
  {
    id: 'sys_recipe_protein_shake',
    title: 'Protein Supplement Shake',
    description: 'A simple protein shake to help meet your daily protein needs. Mix with water or a milk alternative.',
    appliances: [],
    ingredients: [{ name: 'Protein Powder', qty: 1, unit: 'scoop' }, { name: 'Water', qty: 250, unit: 'ml' }],
    steps: ['Add protein powder to a shaker bottle.', 'Add water or milk alternative.', 'Shake well until smooth and enjoy.'],
    tags: ['supplement', 'high_protein', 'quick'],
    est_nutrition: { 
        kcal: 120,
        protein_g: 25,
        carbs_g: 3,
        fat_g: 1,
        fiber_g: 1,
    },
    time_minutes: 2,
    servings_default: 1,
    is_system: true,
  },
];

export const SUPPLEMENTS_CATALOG: Supplement[] = [
    { id: 'supp_1', name: 'Vitamin B12', guidance: 'Important for nerve function and blood cell formation. Often recommended in plant-centric diets. This is not medical advice.', default_frequency: 'daily' },
    { id: 'supp_2', name: 'Iodized Salt', guidance: 'Iodine is crucial for thyroid health. Using iodized salt is a simple way to ensure intake. This is not medical advice.', default_frequency: 'daily' },
    { id: 'supp_3', name: 'Omega-3 (ALA)', guidance: 'Found in flax, chia, and walnuts. Supports brain health. The body can convert ALA to EPA/DHA, though inefficiently. This is not medical advice.', default_frequency: 'daily' },
    { id: 'supp_4', name: 'Vitamin D', guidance: 'The "sunshine vitamin" is vital for bone health and immune function. Supplementation is often recommended, especially in winter. This is not medical advice.', default_frequency: 'daily' },
    { id: 'supp_5', name: 'Protein Powder', guidance: 'Can help meet protein targets if whole food sources are insufficient. Pea, soy, or hemp are good plant-based options. This is not medical advice.', default_frequency: 'daily' },
];

export const SYSTEM_PROMPT = `You are a supportive Potato Diet Coach. You design potato-centric meals and plans that fit the user’s appliances and kcal target. Prefer potatoes as the base (baked, air-fried, mashed, boiled), allow minimal condiments/spices, and add optional protein and veggies for balance. Always calculate estimated macros and provide clear steps. Offer safe, non-medical supplement education when asked.

Constraints:
- Avoid medical claims; include disclaimer: “This is not medical advice.”
- Respect user exclusions (e.g., no oil or dairy).
- Keep recipes ≤ 10 ingredients and ≤ 6 steps when possible.
- Provide est_nutrition with kcal, protein_g, carbs_g, fat_g per serving.
- Always return structured JSON for actions the app must save. The user's profile and preferences are provided below.
`;

export const MOCK_PLAN: import('./types').Plan = {
  id: 'mock_plan_1',
  userId: 'user_1',
  scope: 'daily',
  date_start: new Date().toISOString().split('T')[0],
  date_end: new Date().toISOString().split('T')[0],
  targets: { daily_kcal: 1800, meals_per_day: 4 },
  items: [
    { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Breakfast, recipeId: 'sys_recipe_4', servings: 1, lock: false },
    { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Lunch, recipeId: 'sys_recipe_2', servings: 2, lock: false },
    { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Dinner, recipeId: 'sys_recipe_1', servings: 1, lock: false },
    { date: new Date().toISOString().split('T')[0], meal_slot: MealSlot.Snack, recipeId: 'sys_recipe_5', servings: 1, lock: false },
  ],
};
