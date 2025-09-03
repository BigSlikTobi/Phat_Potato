
export enum Screen {
  Onboarding = 'ONBOARDING',
  Home = 'HOME',
  Chat = 'CHAT',
  Plans = 'PLANS',
  Recipes = 'RECIPES',
  Settings = 'SETTINGS',
}

export enum Sex {
  Male = 'male',
  Female = 'female',
}

export enum ActivityLevel {
  Sedentary = 'sedentary',
  Light = 'light',
  Moderate = 'moderate',
  High = 'high',
}

export enum MealSlot {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snack = 'snack',
}

export interface Profile {
  age: number;
  height_cm: number;
  weight_kg: number;
  sex: Sex;
  activity_level: ActivityLevel;
  target_weight_kg?: number;
}

export interface Preferences {
  appliances: string[];
  exclusions: string[];
  kcal_target: number;
}

export interface DietWindow {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  paused: boolean;
}

export interface User {
  profile: Profile;
  preferences: Preferences;
  diet_window: DietWindow;
}

export interface Nutrition {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  potassium_mg?: number;
  vitamin_c_mg?: number;
}

export interface Ingredient {
  name: string;
  qty: number;
  unit: string;
}

export interface Recipe {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  appliances: string[];
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  est_nutrition: Nutrition;
  time_minutes: number;
  servings_default: number;
  is_system: boolean;
}

export interface PlanItem {
  date: string; // YYYY-MM-DD
  meal_slot: MealSlot;
  recipeId: string;
  servings: number;
  lock: boolean;
}

export interface Plan {
  id: string;
  userId: string;
  scope: 'daily' | 'weekly';
  date_start: string; // YYYY-MM-DD
  date_end: string; // YYYY-MM-DD
  targets: {
    daily_kcal: number;
    meals_per_day: number;
  };
  items: PlanItem[];
}

export interface LogEntry {
  type: 'meal' | 'manual_food' | 'water' | 'supplement';
  id: string;
  timestamp: number;
  details: MealLog | ManualFoodLog | WaterLog | SupplementLog;
}

export interface MealLog {
  recipeId: string;
  servings: number;
  est_kcal: number;
}

export interface ManualFoodLog {
  name: string;
  est_kcal: number;
}

export interface WaterLog {
  ml: number;
}

export interface SupplementLog {
  name: string;
  taken: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  totals: Omit<Nutrition, 'potassium_mg' | 'vitamin_c_mg'>;
}

export interface Supplement {
  id: string;
  name: string;
  guidance: string;
  default_frequency: 'daily' | 'weekly';
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    plan?: Plan;
    recipes?: Recipe[];
    cta?: string[];
}
