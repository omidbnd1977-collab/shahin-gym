import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './trainer-dashboard.css';

type Section = 'overview' | 'members' | 'training' | 'nutrition';
type ExerciseCategory = 'سینه - بالاسینه' | 'سینه - وسط سینه' | 'سینه - زیرسینه' | 'سرشانه - جلویی' | 'سرشانه - میانی' | 'سرشانه - پشتی' | 'پشت و زیربغل' | 'جلو بازو' | 'پشت بازو' | 'ساعد' | 'چهارسر ران' | 'پشت پا' | 'باسن' | 'ساق پا' | 'شکم و میان‌تنه' | 'هوازی';
type Exercise = { id: string; name: string; category: ExerciseCategory; equipment: string; custom?: boolean };
type AssignedExercise = { id: string; exerciseId: string; name: string; category: ExerciseCategory; equipment: string; sets: string; setReps?: string[]; reps: string; rest: string };
type Food = { id: string; name: string; category: string; kcal: number; protein: number; carbs: number; fat: number; fiber: number; calcium: number; iron: number; vitaminC: number; vitaminB12: number };
type FoodEntry = { id: string; foodId: string; name: string; grams: number; nutrition?: Omit<Food, 'id' | 'name' | 'category'> };
export type Member = { id: string; name: string; phone: string; email: string; accessCode: string; goal: string; weight: number; joined: string; workoutId: string; workoutExercises?: AssignedExercise[]; proteinGoal: number; carbsGoal: number; calorieGoal: number; foodLog: FoodEntry[] };
const STORAGE_KEY = 'shahin-trainer-dashboard-v1';
const EXERCISE_STORAGE_KEY = 'shahin-exercise-library-v1';
export const MEMBER_STORAGE_KEY = STORAGE_KEY;

const exerciseCategories: ExerciseCategory[] = ['سینه - بالاسینه', 'سینه - وسط سینه', 'سینه - زیرسینه', 'سرشانه - جلویی', 'سرشانه - میانی', 'سرشانه - پشتی', 'پشت و زیربغل', 'جلو بازو', 'پشت بازو', 'ساعد', 'چهارسر ران', 'پشت پا', 'باسن', 'ساق پا', 'شکم و میان‌تنه', 'هوازی'];
type ExerciseAssignmentForm = { exerciseId: string; sets: string; reps: string; rest: string; setReps: string[] };

const starterExercises: Exercise[] = [
  { id: 'incline-barbell-press', name: 'پرس بالاسینه هالتر', category: 'سینه - بالاسینه', equipment: 'هالتر و میز شیب‌دار' },
  { id: 'incline-dumbbell-press', name: 'پرس بالاسینه دمبل', category: 'سینه - بالاسینه', equipment: 'دمبل و میز شیب‌دار' },
  { id: 'incline-machine-press', name: 'پرس بالاسینه دستگاه', category: 'سینه - بالاسینه', equipment: 'دستگاه' },
  { id: 'low-to-high-cable', name: 'فلای سیم‌کش پایین به بالا', category: 'سینه - بالاسینه', equipment: 'سیم‌کش' },
  { id: 'bench-press', name: 'پرس سینه هالتر', category: 'سینه - وسط سینه', equipment: 'هالتر و میز تخت' },
  { id: 'flat-dumbbell-press', name: 'پرس سینه دمبل', category: 'سینه - وسط سینه', equipment: 'دمبل و میز تخت' },
  { id: 'chest-press-machine', name: 'پرس سینه دستگاه', category: 'سینه - وسط سینه', equipment: 'دستگاه' },
  { id: 'pec-deck', name: 'فلای دستگاه (پک‌دک)', category: 'سینه - وسط سینه', equipment: 'دستگاه پک‌دک' },
  { id: 'push-up', name: 'شنا سوئدی', category: 'سینه - وسط سینه', equipment: 'وزن بدن' },
  { id: 'decline-barbell-press', name: 'پرس زیرسینه هالتر', category: 'سینه - زیرسینه', equipment: 'هالتر و میز شیب‌منفی' },
  { id: 'decline-dumbbell-press', name: 'پرس زیرسینه دمبل', category: 'سینه - زیرسینه', equipment: 'دمبل و میز شیب‌منفی' },
  { id: 'high-to-low-cable', name: 'فلای سیم‌کش بالا به پایین', category: 'سینه - زیرسینه', equipment: 'سیم‌کش' },
  { id: 'shoulder-press', name: 'پرس سرشانه دمبل', category: 'سرشانه - جلویی', equipment: 'دمبل' },
  { id: 'barbell-overhead-press', name: 'پرس سرشانه هالتر', category: 'سرشانه - جلویی', equipment: 'هالتر' },
  { id: 'machine-shoulder-press', name: 'پرس سرشانه دستگاه', category: 'سرشانه - جلویی', equipment: 'دستگاه' },
  { id: 'front-raise', name: 'نشر جلو دمبل', category: 'سرشانه - جلویی', equipment: 'دمبل' },
  { id: 'lateral-raise', name: 'نشر جانب دمبل', category: 'سرشانه - میانی', equipment: 'دمبل' },
  { id: 'cable-lateral-raise', name: 'نشر جانب سیم‌کش تک‌دست', category: 'سرشانه - میانی', equipment: 'سیم‌کش' },
  { id: 'lateral-raise-machine', name: 'نشر جانب دستگاه', category: 'سرشانه - میانی', equipment: 'دستگاه' },
  { id: 'reverse-fly', name: 'نشر خم دمبل', category: 'سرشانه - پشتی', equipment: 'دمبل' },
  { id: 'face-pull', name: 'فیس‌پول', category: 'سرشانه - پشتی', equipment: 'سیم‌کش و طناب' },
  { id: 'reverse-pec-deck', name: 'فلای معکوس دستگاه', category: 'سرشانه - پشتی', equipment: 'دستگاه پک‌دک' },
  { id: 'lat-pulldown', name: 'لت سیم‌کش از جلو', category: 'پشت و زیربغل', equipment: 'سیم‌کش' },
  { id: 'seated-cable-row', name: 'قایقی سیم‌کش', category: 'پشت و زیربغل', equipment: 'سیم‌کش' },
  { id: 'barbell-row', name: 'پارویی هالتر خم', category: 'پشت و زیربغل', equipment: 'هالتر' },
  { id: 'one-arm-dumbbell-row', name: 'پارویی دمبل تک‌دست', category: 'پشت و زیربغل', equipment: 'دمبل' },
  { id: 'deadlift', name: 'ددلیفت', category: 'پشت و زیربغل', equipment: 'هالتر' },
  { id: 'barbell-curl', name: 'جلو بازو هالتر', category: 'جلو بازو', equipment: 'هالتر' },
  { id: 'dumbbell-curl', name: 'جلو بازو دمبل تناوبی', category: 'جلو بازو', equipment: 'دمبل' },
  { id: 'hammer-curl', name: 'جلو بازو چکشی', category: 'جلو بازو', equipment: 'دمبل' },
  { id: 'preacher-curl', name: 'جلو بازو لاری', category: 'جلو بازو', equipment: 'میز لاری' },
  { id: 'triceps-pushdown', name: 'پشت بازو سیم‌کش طنابی', category: 'پشت بازو', equipment: 'سیم‌کش و طناب' },
  { id: 'skull-crusher', name: 'پشت بازو خوابیده', category: 'پشت بازو', equipment: 'هالتر EZ' },
  { id: 'overhead-triceps', name: 'پشت بازو بالای سر', category: 'پشت بازو', equipment: 'دمبل' },
  { id: 'close-grip-bench', name: 'پرس سینه دست‌جمع', category: 'پشت بازو', equipment: 'هالتر و میز تخت' },
  { id: 'wrist-curl', name: 'مچ دمبل نشسته', category: 'ساعد', equipment: 'دمبل' },
  { id: 'reverse-wrist-curl', name: 'مچ برعکس', category: 'ساعد', equipment: 'هالتر سبک' },
  { id: 'back-squat', name: 'اسکوات هالتر', category: 'چهارسر ران', equipment: 'هالتر و رک' },
  { id: 'leg-press', name: 'پرس پا دستگاه', category: 'چهارسر ران', equipment: 'دستگاه پرس پا' },
  { id: 'leg-extension', name: 'جلو پا دستگاه', category: 'چهارسر ران', equipment: 'دستگاه' },
  { id: 'goblet-squat', name: 'اسکوات گابلت', category: 'چهارسر ران', equipment: 'دمبل' },
  { id: 'romanian-deadlift', name: 'ددلیفت رومانیایی', category: 'پشت پا', equipment: 'هالتر یا دمبل' },
  { id: 'leg-curl', name: 'پشت پا خوابیده دستگاه', category: 'پشت پا', equipment: 'دستگاه' },
  { id: 'seated-leg-curl', name: 'پشت پا نشسته دستگاه', category: 'پشت پا', equipment: 'دستگاه' },
  { id: 'hip-thrust', name: 'هیپ تراست', category: 'باسن', equipment: 'هالتر و نیمکت' },
  { id: 'cable-kickback', name: 'کیک‌بک سیم‌کش', category: 'باسن', equipment: 'سیم‌کش' },
  { id: 'glute-abduction', name: 'ابداکشن دستگاه', category: 'باسن', equipment: 'دستگاه' },
  { id: 'standing-calf-raise', name: 'ساق پا ایستاده', category: 'ساق پا', equipment: 'دستگاه یا دمبل' },
  { id: 'seated-calf-raise', name: 'ساق پا نشسته', category: 'ساق پا', equipment: 'دستگاه' },
  { id: 'calf-press', name: 'ساق پا پرس', category: 'ساق پا', equipment: 'دستگاه پرس پا' },
  { id: 'crunch', name: 'کرانچ شکم', category: 'شکم و میان‌تنه', equipment: 'وزن بدن' },
  { id: 'cable-crunch', name: 'کرانچ سیم‌کش', category: 'شکم و میان‌تنه', equipment: 'سیم‌کش و طناب' },
  { id: 'hanging-leg-raise', name: 'بالا آوردن پا از بارفیکس', category: 'شکم و میان‌تنه', equipment: 'میله بارفیکس' },
  { id: 'plank', name: 'پلانک', category: 'شکم و میان‌تنه', equipment: 'وزن بدن' },
  { id: 'russian-twist', name: 'چرخش روسی', category: 'شکم و میان‌تنه', equipment: 'وزن بدن یا صفحه' },
  { id: 'treadmill', name: 'تردمیل', category: 'هوازی', equipment: 'تردمیل' },
  { id: 'stationary-bike', name: 'دوچرخه ثابت', category: 'هوازی', equipment: 'دوچرخه ثابت' },
  { id: 'rowing-machine', name: 'دستگاه روئینگ', category: 'هوازی', equipment: 'دستگاه روئینگ' },
];

function readExerciseLibrary(): Exercise[] {
  try { const stored = localStorage.getItem(EXERCISE_STORAGE_KEY); return stored ? JSON.parse(stored) as Exercise[] : starterExercises; } catch { return starterExercises; }
}

const workoutPlans = [
  { id: 'upper-lower', name: 'بالا تنه / پایین تنه', level: 'متوسط', days: '۴ روز در هفته', focus: 'قدرت و عضله‌سازی', exercises: [{ name: 'اسکوات هالتر', sets: '۴', reps: '۸ تا ۱۰', rest: '۹۰ ثانیه' }, { name: 'پرس سینه', sets: '۴', reps: '۸ تا ۱۲', rest: '۹۰ ثانیه' }, { name: 'ددلیفت رومانیایی', sets: '۳', reps: '۱۰ تا ۱۲', rest: '۷۵ ثانیه' }, { name: 'پارویی سیم‌کش', sets: '۳', reps: '۱۰ تا ۱۲', rest: '۶۰ ثانیه' }] },
  { id: 'full-body', name: 'فول بادی', level: 'مبتدی', days: '۳ روز در هفته', focus: 'آمادگی عمومی', exercises: [{ name: 'پرس پا دستگاه', sets: '۳', reps: '۱۲', rest: '۶۰ ثانیه' }, { name: 'پرس سینه دستگاه', sets: '۳', reps: '۱۰ تا ۱۲', rest: '۶۰ ثانیه' }, { name: 'لت سیم‌کش', sets: '۳', reps: '۱۰ تا ۱۲', rest: '۶۰ ثانیه' }, { name: 'پلانک', sets: '۳', reps: '۳۰ تا ۴۵ ثانیه', rest: '۴۵ ثانیه' }] },
  { id: 'strength', name: 'قدرت پایه', level: 'پیشرفته', days: '۴ روز در هفته', focus: 'افزایش قدرت', exercises: [{ name: 'اسکوات پشت', sets: '۵', reps: '۵', rest: '۱۸۰ ثانیه' }, { name: 'پرس سینه هالتر', sets: '۵', reps: '۵', rest: '۱۸۰ ثانیه' }, { name: 'ددلیفت', sets: '۴', reps: '۴ تا ۶', rest: '۱۸۰ ثانیه' }, { name: 'پرس سرشانه', sets: '۳', reps: '۶ تا ۸', rest: '۱۲۰ ثانیه' }] },
  { id: 'fat-loss', name: 'چربی‌سوزی و هوازی', level: 'همه سطوح', days: '۳ تا ۵ روز در هفته', focus: 'کاهش چربی و استقامت', exercises: [{ name: 'دوچرخه ثابت', sets: '۱', reps: '۱۲ دقیقه', rest: 'بدون استراحت' }, { name: 'اسکوات وزن بدن', sets: '۳', reps: '۱۵', rest: '۴۵ ثانیه' }, { name: 'قایقی دستگاه', sets: '۳', reps: '۱۲', rest: '۴۵ ثانیه' }, { name: 'راه‌رفتن روی تردمیل', sets: '۱', reps: '۲۰ دقیقه', rest: '—' }] },
  { id: 'glutes', name: 'پایین تنه و عضلات سرینی', level: 'متوسط', days: '۲ روز در هفته', focus: 'قدرت پایین تنه', exercises: [{ name: 'هیپ تراست', sets: '۴', reps: '۸ تا ۱۲', rest: '۹۰ ثانیه' }, { name: 'اسپلیت اسکوات', sets: '۳', reps: '۱۰ هر پا', rest: '۷۵ ثانیه' }, { name: 'پشت پا دستگاه', sets: '۳', reps: '۱۲', rest: '۶۰ ثانیه' }, { name: 'کیک‌بک سیم‌کش', sets: '۳', reps: '۱۲ هر پا', rest: '۶۰ ثانیه' }] },
];

const foods: Food[] = [
  { id: 'egg', name: 'تخم‌مرغ کامل', category: 'پروتئین', kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, calcium: 56, iron: 1.8, vitaminC: 0, vitaminB12: 1.1 },
  { id: 'chicken', name: 'سینه مرغ پخته', category: 'پروتئین', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, calcium: 15, iron: 1, vitaminC: 0, vitaminB12: 0.3 },
  { id: 'greek-yogurt', name: 'ماست یونانی', category: 'لبنیات', kcal: 97, protein: 9, carbs: 3.9, fat: 5, fiber: 0, calcium: 110, iron: 0.1, vitaminC: 0, vitaminB12: 0.8 },
  { id: 'oats', name: 'جو دوسر خشک', category: 'غلات', kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, calcium: 54, iron: 4.7, vitaminC: 0, vitaminB12: 0 },
  { id: 'rice', name: 'برنج پخته', category: 'غلات', kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, calcium: 10, iron: 0.2, vitaminC: 0, vitaminB12: 0 },
  { id: 'banana', name: 'موز', category: 'میوه', kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, calcium: 5, iron: 0.3, vitaminC: 8.7, vitaminB12: 0 },
  { id: 'broccoli', name: 'بروکلی', category: 'سبزیجات', kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, calcium: 47, iron: 0.7, vitaminC: 89, vitaminB12: 0 },
  { id: 'almond', name: 'بادام', category: 'مغزها', kcal: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, calcium: 269, iron: 3.7, vitaminC: 0, vitaminB12: 0 },
  { id: 'salmon', name: 'ماهی سالمون پخته', category: 'پروتئین', kcal: 206, protein: 22.1, carbs: 0, fat: 12.4, fiber: 0, calcium: 15, iron: 0.3, vitaminC: 0, vitaminB12: 3.2 },
];

const starterMembers: Member[] = [
  { id: 'sample-1', name: 'آرمان رضایی', phone: '۰۹۱۲ ۳۴۵ ۶۷۸۹', email: 'arman@example.com', accessCode: '2580', goal: 'عضله‌سازی', weight: 78, joined: '۱۴۰۵/۰۷/۲۲', workoutId: 'upper-lower', workoutExercises: [], proteinGoal: 150, carbsGoal: 240, calorieGoal: 2300, foodLog: [{ id: 'sample-food-1', foodId: 'egg', name: 'تخم‌مرغ کامل', grams: 150 }, { id: 'sample-food-2', foodId: 'oats', name: 'جو دوسر خشک', grams: 60 }] },
  { id: 'sample-2', name: 'سارا محمدی', phone: '۰۹۳۵ ۷۸۹ ۱۲۳۴', email: 'sara@example.com', accessCode: '3690', goal: 'افزایش قدرت', weight: 64, joined: '۱۴۰۵/۰۷/۲۵', workoutId: 'strength', workoutExercises: [], proteinGoal: 125, carbsGoal: 210, calorieGoal: 2050, foodLog: [{ id: 'sample-food-3', foodId: 'greek-yogurt', name: 'ماست یونانی', grams: 200 }, { id: 'sample-food-4', foodId: 'banana', name: 'موز', grams: 120 }] },
  { id: 'sample-3', name: 'کیان احمدی', phone: '۰۹۱۰ ۵۵۵ ۸۸۱۱', email: 'kian@example.com', accessCode: '1470', goal: 'کاهش چربی', weight: 91, joined: '۱۴۰۵/۰۷/۲۸', workoutId: 'fat-loss', workoutExercises: [], proteinGoal: 175, carbsGoal: 190, calorieGoal: 2200, foodLog: [] },
];

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'نمای کلی', icon: 'grid' }, { id: 'members', label: 'اعضای باشگاه', icon: 'users' }, { id: 'training', label: 'برنامه تمرین', icon: 'barbell' }, { id: 'nutrition', label: 'تغذیه و مواد مغذی', icon: 'nutrition' },
];

function readMembers(): Member[] {
  try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) as Member[] : starterMembers; } catch { return starterMembers; }
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    barbell: <><path d="M6.5 6.5v11m11-11v11M3 9v6m18-6v6M6.5 12h11" /></>, nutrition: <><path d="M12 20c4-3 7-7 7-11-4 0-7 2-8 6-1-3-3-5-6-5 0 5 2 8 7 10Z" /><path d="M12 20c0-5 2-8 6-11" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>, search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    chevron: <path d="m8 10 4 4 4-4" />, close: <path d="m6 6 12 12M18 6 6 18" />, trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    check: <path d="m5 12 4 4L19 6" />, arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>, clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, flame: <path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-2 4-2 4 0-5-4-8-4-8 1 5-4 7-4 12 0 3 3 6 7 6Z" />, scale: <><path d="M4 5h16l2 15H2L4 5Z" /><path d="m12 9 2 3m-2-3-2 3" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.grid}</svg>;
}

function getFoodTotals(log: FoodEntry[]) {
  return log.reduce((sum, entry) => {
    const food = entry.nutrition ?? foods.find((item) => item.id === entry.foodId);
    if (!food) return sum;
    const factor = entry.grams / 100;
    return { kcal: sum.kcal + food.kcal * factor, protein: sum.protein + food.protein * factor, carbs: sum.carbs + food.carbs * factor, fat: sum.fat + food.fat * factor, fiber: sum.fiber + food.fiber * factor, calcium: sum.calcium + food.calcium * factor, iron: sum.iron + food.iron * factor, vitaminC: sum.vitaminC + food.vitaminC * factor, vitaminB12: sum.vitaminB12 + food.vitaminB12 * factor };
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, calcium: 0, iron: 0, vitaminC: 0, vitaminB12: 0 });
}

function ProgressBar({ value, goal, tone = 'green' }: { value: number; goal: number; tone?: string }) {
  const percent = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  return <div className={`td-progress td-progress-${tone}`} role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div>;
}

export default function TrainerDashboard({ onExit }: { onExit: () => void }) {
  const [members, setMembers] = useState<Member[]>(readMembers);
  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>(readExerciseLibrary);
  const [selectedId, setSelectedId] = useState(members[0]?.id ?? '');
  const [section, setSection] = useState<Section>('overview');
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [resetCodeMemberId, setResetCodeMemberId] = useState('');
  const [formError, setFormError] = useState('');
  const [memberForm, setMemberForm] = useState({ name: '', phone: '', email: '', accessCode: '', goal: 'عضله‌سازی', weight: '', proteinGoal: '140', carbsGoal: '220', calorieGoal: '2200' });
  const [foodId, setFoodId] = useState(foods[0].id);
  const [foodGrams, setFoodGrams] = useState('100');
  const [foodEntryMode, setFoodEntryMode] = useState<'catalog' | 'custom'>('catalog');
  const [customFood, setCustomFood] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '', fiber: '', calcium: '', iron: '', vitaminC: '', vitaminB12: '' });
  const [notice, setNotice] = useState('');
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState<ExerciseCategory | 'همهٔ گروه‌ها'>('همهٔ گروه‌ها');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseFormError, setExerciseFormError] = useState('');
  const [exerciseForm, setExerciseForm] = useState({ name: '', category: exerciseCategories[0], equipment: '' as string });
  const [exerciseAssignment, setExerciseAssignment] = useState<ExerciseAssignmentForm>({ exerciseId: '', sets: '3', reps: '۱۰ تا ۱۲', rest: '۶۰ ثانیه', setReps: ['۱۰ تا ۱۲', '۱۰ تا ۱۲', '۱۰ تا ۱۲'] });
  const selectedMember = members.find((member) => member.id === selectedId) ?? members[0];
  const selectedWorkout = workoutPlans.find((plan) => plan.id === selectedMember?.workoutId) ?? workoutPlans[0];
  const totals = useMemo(() => getFoodTotals(selectedMember?.foodLog ?? []), [selectedMember?.foodLog]);
  const visibleMembers = members.filter((member) => `${member.name} ${member.phone} ${member.goal}`.toLowerCase().includes(memberSearch.toLowerCase()));
  const visibleExercises = exerciseLibrary.filter((exercise) => (exerciseCategoryFilter === 'همهٔ گروه‌ها' || exercise.category === exerciseCategoryFilter) && `${exercise.name} ${exercise.category} ${exercise.equipment}`.toLowerCase().includes(exerciseSearch.toLowerCase()));
  const assignedExercises = selectedMember?.workoutExercises ?? [];

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(exerciseLibrary)); }, [exerciseLibrary]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 2800); return () => window.clearTimeout(timer); }, [notice]);

  const updateMember = (id: string, changes: Partial<Member>) => setMembers((current) => current.map((member) => member.id === id ? { ...member, ...changes } : member));
  const revealOrCreateAccessCode = (member: Member) => {
    setResetCodeMemberId(member.id);
    if (member.accessCode) { setNotice(`کد ورود ${member.name}: ${member.accessCode}`); return; }
    const accessCode = String(Math.floor(100000 + Math.random() * 900000));
    updateMember(member.id, { accessCode });
    setNotice(`کد ورود جدید ${member.name}: ${accessCode}`);
  };
  const addExerciseToLibrary = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exerciseForm.name.trim() || !exerciseForm.equipment.trim()) { setExerciseFormError('نام حرکت و وسیله یا نوع اجرای آن را وارد کنید.'); return; }
    const duplicate = exerciseLibrary.some((exercise) => exercise.name.trim().toLocaleLowerCase() === exerciseForm.name.trim().toLocaleLowerCase() && exercise.category === exerciseForm.category);
    if (duplicate) { setExerciseFormError('این حرکت از قبل در همین گروه وجود دارد.'); return; }
    const exercise: Exercise = { id: `exercise-${Date.now()}`, name: exerciseForm.name.trim(), category: exerciseForm.category, equipment: exerciseForm.equipment.trim(), custom: true };
    setExerciseLibrary((current) => [...current, exercise]);
    setExerciseCategoryFilter(exercise.category);
    setExerciseSearch('');
    setExerciseAssignment((current) => ({ ...current, exerciseId: exercise.id }));
    setExerciseForm({ name: '', category: exerciseCategories[0], equipment: '' });
    setExerciseFormError('');
    setShowExerciseForm(false);
    setNotice(`حرکت «${exercise.name}» به کتابخانه اضافه شد و در فهرست انتخاب‌ها قرار گرفت.`);
  };
  const addAssignedExercise = () => {
    if (!selectedMember) { setNotice('ابتدا یک عضو انتخاب کنید.'); return; }
    const exercise = exerciseLibrary.find((item) => item.id === exerciseAssignment.exerciseId);
    if (!exercise) { setNotice('ابتدا یک حرکت از فهرست انتخاب کنید.'); return; }
    if (assignedExercises.some((item) => item.exerciseId === exercise.id)) { setNotice('این حرکت از قبل در برنامهٔ عضو وجود دارد.'); return; }
    const setCount = Math.max(1, Math.min(20, Number(exerciseAssignment.sets) || 1));
    const setReps = Array.from({ length: setCount }, () => exerciseAssignment.reps);
    const assignment: AssignedExercise = { id: `assigned-${Date.now()}`, exerciseId: exercise.id, name: exercise.name, category: exercise.category, equipment: exercise.equipment, sets: String(setCount), setReps, reps: exerciseAssignment.reps, rest: exerciseAssignment.rest };
    updateMember(selectedMember.id, { workoutExercises: [...assignedExercises, assignment] });
    setNotice(`حرکت «${exercise.name}» به برنامهٔ ${selectedMember.name} اضافه شد.`);
  };
  const setExerciseSetCount = (value: string) => {
    const setCount = Math.max(1, Math.min(20, Number(value) || 1));
    setExerciseAssignment({ ...exerciseAssignment, sets: value, setReps: Array.from({ length: setCount }, (_, index) => exerciseAssignment.setReps?.[index] ?? exerciseAssignment.reps) });
  };
  const updateAssignedExercise = (assignmentId: string, changes: Partial<AssignedExercise>) => {
    if (!selectedMember) return;
    updateMember(selectedMember.id, { workoutExercises: assignedExercises.map((item) => item.id === assignmentId ? { ...item, ...changes } : item) });
  };
  const removeAssignedExercise = (assignmentId: string) => {
    if (!selectedMember) return;
    updateMember(selectedMember.id, { workoutExercises: assignedExercises.filter((item) => item.id !== assignmentId) });
  };
  const addMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memberForm.name.trim() || !memberForm.phone.trim()) { setFormError('نام و شماره تماس عضو را وارد کنید.'); return; }
    if (!/^\d{4,8}$/.test(memberForm.accessCode)) { setFormError('کد ورود عضو باید ۴ تا ۸ رقم باشد.'); return; }
    const newMember: Member = { id: `member-${Date.now()}`, name: memberForm.name.trim(), phone: memberForm.phone.trim(), email: memberForm.email.trim(), accessCode: memberForm.accessCode, goal: memberForm.goal, weight: Number(memberForm.weight) || 70, joined: new Intl.DateTimeFormat('fa-IR').format(new Date()), workoutId: workoutPlans[0].id, workoutExercises: [], proteinGoal: Number(memberForm.proteinGoal) || 140, carbsGoal: Number(memberForm.carbsGoal) || 220, calorieGoal: Number(memberForm.calorieGoal) || 2200, foodLog: [] };
    setMembers((current) => [newMember, ...current]); setSelectedId(newMember.id); setMemberForm({ name: '', phone: '', email: '', accessCode: '', goal: 'عضله‌سازی', weight: '', proteinGoal: '140', carbsGoal: '220', calorieGoal: '2200' }); setFormError(''); setShowMemberForm(false); setSection('members'); setNotice('عضو ثبت شد؛ کد دسترسی را به او تحویل دهید.');
  };
  const addFood = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!selectedMember) return;
    const grams = Number(foodGrams); if (!grams || grams < 1 || grams > 3000) { setNotice('مقدار خوراک باید بین ۱ تا ۳۰۰۰ گرم باشد.'); return; }
    const food = foods.find((item) => item.id === foodId);
    if (foodEntryMode === 'catalog' && food) {
      updateMember(selectedMember.id, { foodLog: [...selectedMember.foodLog, { id: `food-${Date.now()}`, foodId: food.id, name: food.name, grams }] }); setNotice(`${food.name} به برنامهٔ غذایی ${selectedMember.name} اضافه شد.`); return;
    }
    if (foodEntryMode === 'custom') {
      if (!customFood.name.trim() || customFood.protein === '' || customFood.carbs === '') { setNotice('نام خوراک، پروتئین و کربوهیدرات را وارد کنید.'); return; }
      const numberValue = (value: string) => Math.max(0, Number(value) || 0);
      const nutrition = { kcal: numberValue(customFood.kcal), protein: numberValue(customFood.protein), carbs: numberValue(customFood.carbs), fat: numberValue(customFood.fat), fiber: numberValue(customFood.fiber), calcium: numberValue(customFood.calcium), iron: numberValue(customFood.iron), vitaminC: numberValue(customFood.vitaminC), vitaminB12: numberValue(customFood.vitaminB12) };
      updateMember(selectedMember.id, { foodLog: [...selectedMember.foodLog, { id: `food-${Date.now()}`, foodId: 'custom', name: customFood.name.trim(), grams, nutrition }] });
      setCustomFood({ name: '', kcal: '', protein: '', carbs: '', fat: '', fiber: '', calcium: '', iron: '', vitaminC: '', vitaminB12: '' }); setNotice(`${customFood.name.trim()} به برنامهٔ غذایی ${selectedMember.name} اضافه شد.`);
    }
  };
  const changeSection = (next: Section) => { setSection(next); setShowMemberForm(false); };
  const selectMember = (id: string) => { setSelectedId(id); setShowMemberForm(false); };

  return <div className="trainer-app" dir="rtl">
    <aside className="td-sidebar"><a className="td-brand" href="#dashboard" onClick={(event) => event.preventDefault()}><span className="td-brand-mark">ش</span><span>شاهین<small>پنل مربی</small></span></a><div className="td-side-caption">مدیریت باشگاه</div><nav className="td-side-nav" aria-label="بخش‌های پنل مربی">{navItems.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => changeSection(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'members' && <b>{members.length}</b>}</button>)}</nav><div className="td-sidebar-bottom"><div className="td-online"><i /> پنل مربی فعال است</div><button className="td-exit" onClick={onExit}><Icon name="arrow" /> بازگشت به سایت</button></div></aside>
    <div className="td-main-shell"><header className="td-topbar"><div className="td-breadcrumb"><span>باشگاه شاهین</span><i>/</i><strong>{navItems.find((item) => item.id === section)?.label}</strong></div><div className="td-top-actions"><button className="td-mobile-exit" onClick={onExit}><Icon name="arrow" /> بازگشت</button><span className="td-date"><Icon name="clock" />{new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><button className="td-icon-button" aria-label="اعلان‌ها"><Icon name="bell" /><i /></button><div className="td-trainer"><span className="td-avatar">م</span><span><b>مربی شاهین</b><small>مدیر باشگاه</small></span></div></div></header>
      <main className="td-content"><div className="td-page-heading"><div><p className="td-eyebrow">پنل مدیریت و پایش</p><h1>{section === 'overview' ? 'روز بخیر، مربی' : navItems.find((item) => item.id === section)?.label}</h1><p>{section === 'overview' ? 'وضعیت اعضا، تمرین‌ها و تغذیهٔ امروز را یک‌جا ببینید.' : 'اطلاعات و برنامه‌های اعضای باشگاه شاهین را مدیریت کنید.'}</p></div><button className="td-primary-button" onClick={() => { setShowMemberForm(true); setSection('members'); }}><Icon name="plus" /> ثبت عضو جدید</button></div>
        {section === 'overview' && <><section className="td-stat-grid" aria-label="آمار باشگاه"><StatCard icon="users" tone="green" label="کل اعضا" value={members.length} detail="عضو ثبت‌شده" badge="فعال" /><StatCard icon="barbell" tone="blue" label="برنامه‌های تمرینی" value={workoutPlans.length} detail="برنامهٔ آماده" badge="قابل انتخاب" /><StatCard icon="nutrition" tone="amber" label="خوراکی‌های پایش‌شده" value={foods.length} detail="با اطلاعات تغذیهٔ امروز" badge="امروز" /><StatCard icon="flame" tone="violet" label="برنامه‌های تخصیص‌یافته" value={members.filter((member) => member.workoutId).length} detail="برای اعضا" badge="تمرین" /></section>
          <div className="td-overview-grid"><section className="td-panel td-member-panel"><PanelHeading title="اعضای باشگاه" detail="برای مشاهده و ویرایش برنامهٔ عضو انتخاب کنید." action="همهٔ اعضا" onAction={() => changeSection('members')} /><div className="td-table-wrap"><table className="td-table"><thead><tr><th>نام عضو</th><th>هدف تمرینی</th><th>وزن</th><th>برنامه</th><th>وضعیت</th></tr></thead><tbody>{members.slice(0, 5).map((member, index) => <tr key={member.id} className={selectedId === member.id ? 'selected' : ''} onClick={() => { selectMember(member.id); changeSection('members'); }}><td><span className={`td-member-avatar tone-${index % 4}`}>{member.name.slice(0, 1)}</span><span className="td-name-cell"><b>{member.name}</b><small>{member.phone}</small></span></td><td>{member.goal}</td><td>{member.weight.toLocaleString('fa-IR')} کیلو</td><td>{workoutPlans.find((plan) => plan.id === member.workoutId)?.name ?? 'تخصیص نشده'}</td><td><span className="td-status"><i /> فعال</span></td></tr>)}</tbody></table></div></section>
            <section className="td-panel td-workout-summary"><PanelHeading title="برنامهٔ عضو منتخب" detail={selectedMember?.name ?? 'هنوز عضوی ثبت نشده'} />{selectedMember ? <><div className="td-plan-summary"><div><span>برنامهٔ تمرین</span><strong>{selectedWorkout.name}</strong></div><div><span>تعداد جلسات</span><strong>{selectedWorkout.days}</strong></div><div><span>تمرکز برنامه</span><strong>{selectedWorkout.focus}</strong></div></div><button className="td-secondary-button" onClick={() => changeSection('training')}>مشاهدهٔ جزئیات تمرین <Icon name="arrow" /></button></> : <EmptyState text="برای شروع یک عضو ثبت کنید." />}</section>
            <section className="td-panel td-nutrition-summary"><PanelHeading title="پایش تغذیهٔ امروز" detail={selectedMember?.name ?? 'عضو منتخب'} action="ثبت خوراک" onAction={() => changeSection('nutrition')} />{selectedMember ? <div className="td-macro-stack"><MacroProgress label="پروتئین" value={totals.protein} goal={selectedMember.proteinGoal} unit="گرم" tone="green" /><MacroProgress label="کربوهیدرات" value={totals.carbs} goal={selectedMember.carbsGoal} unit="گرم" tone="blue" /><MacroProgress label="انرژی" value={totals.kcal} goal={selectedMember.calorieGoal} unit="کیلوکالری" tone="amber" /></div> : <EmptyState text="یک عضو انتخاب کنید." />}</section>
            <section className="td-panel td-shortcuts"><PanelHeading title="دسترسی سریع" detail="کارهای پرتکرار مربی" /><div className="td-shortcut-grid"><button onClick={() => { setShowMemberForm(true); setSection('members'); }}><span className="td-shortcut-icon green"><Icon name="plus" /></span><b>ثبت عضو</b><small>ساخت پروندهٔ جدید</small></button><button onClick={() => changeSection('training')}><span className="td-shortcut-icon blue"><Icon name="barbell" /></span><b>تخصیص تمرین</b><small>انتخاب برنامهٔ آماده</small></button><button onClick={() => changeSection('nutrition')}><span className="td-shortcut-icon amber"><Icon name="nutrition" /></span><b>ثبت تغذیه</b><small>محاسبهٔ مواد مغذی</small></button></div></section></div></>}

        {section === 'members' && <section className="td-members-layout"><div className="td-panel td-members-list"><div className="td-panel-heading"><div><h2>فهرست اعضا</h2><p>{members.length.toLocaleString('fa-IR')} پروندهٔ ثبت‌شده</p></div><button className="td-primary-button compact" onClick={() => setShowMemberForm(true)}><Icon name="plus" /> افزودن عضو</button></div><label className="td-search"><Icon name="search" /><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="جست‌وجوی نام، تلفن یا هدف" /></label><div className="td-member-list-items">{visibleMembers.map((member, index) => <button key={member.id} className={`td-member-list-item ${selectedMember?.id === member.id ? 'active' : ''}`} onClick={() => selectMember(member.id)}><span className={`td-member-avatar tone-${index % 4}`}>{member.name.slice(0, 1)}</span><span><b>{member.name}</b><small>{member.goal} · {member.weight} کیلو</small></span><i className="td-member-indicator" /></button>)}{visibleMembers.length === 0 && <EmptyState text="عضوی با این مشخصات پیدا نشد." />}</div></div>
          {selectedMember ? <div className="td-panel td-member-detail"><div className="td-member-profile"><span className="td-profile-avatar">{selectedMember.name.slice(0, 1)}</span><div><h2>{selectedMember.name}</h2><p>{selectedMember.goal} <span>•</span> عضویت از {selectedMember.joined}</p></div><span className="td-status"><i /> فعال</span></div><div className="td-profile-facts"><div><span>شماره تماس</span><b>{selectedMember.phone}</b></div><div><span>ایمیل</span><b>{selectedMember.email || 'ثبت نشده'}</b></div><div><span>وزن فعلی</span><b>{selectedMember.weight.toLocaleString('fa-IR')} کیلوگرم</b></div><div><span>کد ورود عضو</span><b className="td-access-code">{resetCodeMemberId === selectedMember.id ? selectedMember.accessCode : '••••••'}</b><button className="td-code-action" onClick={() => revealOrCreateAccessCode(selectedMember)}>نمایش / بازیابی کد</button></div></div><div className="td-detail-actions"><button onClick={() => changeSection('training')}><Icon name="barbell" /> برنامهٔ تمرین</button><button onClick={() => changeSection('nutrition')}><Icon name="nutrition" /> برنامهٔ تغذیه</button><button className="danger" onClick={() => { const remaining = members.filter((member) => member.id !== selectedMember.id); setMembers(remaining); setSelectedId(remaining[0]?.id ?? ''); setNotice('پروندهٔ عضو حذف شد.'); }}><Icon name="trash" /> حذف عضو</button></div><div className="td-detail-note"><Icon name="check" /><span>اطلاعات این عضو به‌صورت خودکار در همین مرورگر ذخیره می‌شود.</span></div></div> : <div className="td-panel"><EmptyState text="برای مشاهدهٔ پرونده، عضو انتخاب کنید." /></div>}</section>}

        {section === 'training' && <section className="td-training-workspace">
          <div className="td-panel td-training-controls">
            <PanelHeading title="سازندهٔ برنامهٔ تمرینی" detail="عضو را انتخاب کنید و حرکت را به برنامهٔ این عضو اضافه کنید." icon="barbell" />
            {selectedMember ? <>
              <label className="td-field-label">عضو موردنظر<select value={selectedMember.id} onChange={(event) => selectMember(event.target.value)}>{members.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.goal}</option>)}</select></label>
              <div className="td-workout-target"><span className="td-round-icon"><Icon name="barbell" /></span><span><small>برنامهٔ فعال</small><b>{selectedWorkout.name}</b></span><span className="td-plan-count">{assignedExercises.length.toLocaleString('fa-IR')} حرکت</span></div>
              <label className="td-field-label">شروع سریع با برنامهٔ آماده<select value={selectedMember.workoutId} onChange={(event) => { updateMember(selectedMember.id, { workoutId: event.target.value }); setNotice(`برنامهٔ ${workoutPlans.find((plan) => plan.id === event.target.value)?.name} انتخاب شد.`); }}>{workoutPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} · {plan.level}</option>)}</select></label>
              <div className="td-plan-meta"><span><Icon name="clock" />{selectedWorkout.days}</span><span><Icon name="scale" />{selectedWorkout.focus}</span></div>
            </> : <EmptyState text="ابتدا یک عضو ثبت کنید." />}
          </div>
          <div className="td-panel td-exercise-picker">
            <div className="td-panel-heading"><div><h2>کتابخانهٔ حرکات</h2><p>{exerciseLibrary.length.toLocaleString('fa-IR')} حرکت · بر اساس عضله و ناحیه دسته‌بندی شده</p></div><button className="td-primary-button compact" onClick={() => { setShowExerciseForm(true); setExerciseFormError(''); }}><Icon name="plus" /> افزودن حرکت</button></div>
            <div className="td-exercise-filters"><label className="td-field-label">گروه عضلانی<select value={exerciseCategoryFilter} onChange={(event) => setExerciseCategoryFilter(event.target.value as ExerciseCategory | 'همهٔ گروه‌ها')}><option>همهٔ گروه‌ها</option>{exerciseCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="td-search"><Icon name="search" /><input value={exerciseSearch} onChange={(event) => setExerciseSearch(event.target.value)} placeholder="جست‌وجوی نام حرکت یا وسیله" /></label></div>
            <div className="td-exercise-library-list">{visibleExercises.map((exercise) => <button key={exercise.id} className={`td-library-exercise ${exerciseAssignment.exerciseId === exercise.id ? 'active' : ''}`} onClick={() => setExerciseAssignment({ ...exerciseAssignment, exerciseId: exercise.id })}><span className="td-exercise-index"><Icon name="barbell" size={14} /></span><span><b>{exercise.name}</b><small>{exercise.category} · {exercise.equipment}</small></span>{exercise.custom && <i>دست‌ساز</i>}<span className="td-exercise-select">{exerciseAssignment.exerciseId === exercise.id ? 'انتخاب شد' : 'انتخاب'}</span></button>)}{visibleExercises.length === 0 && <EmptyState text="حرکتی پیدا نشد؛ می‌توانید آن را به کتابخانه اضافه کنید." />}</div>
            {selectedMember && <div className="td-assignment-editor"><strong>جزئیات حرکت انتخاب‌شده</strong><div className="td-assignment-fields"><label className="td-field-label td-exercise-combobox">حرکت از فهرست<select value={exerciseAssignment.exerciseId} onChange={(event) => setExerciseAssignment({ ...exerciseAssignment, exerciseId: event.target.value })}><option value="">یک حرکت انتخاب کنید</option>{visibleExercises.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name} · {exercise.category}</option>)}</select></label><label className="td-field-label">تعداد ست<select value={String(Math.max(1, Number(exerciseAssignment.sets) || 1))} onChange={(event) => setExerciseSetCount(event.target.value)}>{Array.from({ length: 20 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} ست</option>)}</select></label><label className="td-field-label">تکرار پیش‌فرض<input value={exerciseAssignment.reps} onChange={(event) => { const reps = event.target.value; setExerciseAssignment((current) => ({ ...current, reps, setReps: (current.setReps ?? []).map(() => reps) })); }} placeholder="مثال: ۱۰" /></label><label className="td-field-label">استراحت<input value={exerciseAssignment.rest} onChange={(event) => setExerciseAssignment({ ...exerciseAssignment, rest: event.target.value })} /></label><button className="td-primary-button" onClick={addAssignedExercise}><Icon name="plus" /> افزودن به برنامهٔ عضو</button></div>{exerciseAssignment.setReps && <div className="td-set-preview"><span>تکرار هر ست</span>{exerciseAssignment.setReps.map((reps, index) => <label key={index}>ست {index + 1}<input value={reps} onChange={(event) => setExerciseAssignment((current) => ({ ...current, setReps: (current.setReps ?? []).map((value, setIndex) => setIndex === index ? event.target.value : value) }))} /></label>)}</div>}</div>}
          </div>
          <div className="td-panel td-assigned-workout"><PanelHeading title={`برنامهٔ اختصاصی ${selectedMember?.name ?? 'عضو'}`} detail="ست‌ها و تکرارهای هر حرکت را برای این عضو تنظیم کنید." badge={`${assignedExercises.length.toLocaleString('fa-IR')} حرکت`} />{assignedExercises.length ? <div className="td-assigned-exercise-list">{assignedExercises.map((exercise, index) => <article className="td-assigned-exercise" key={exercise.id}><div className="td-assigned-exercise-heading"><span className="td-exercise-index">{String(index + 1).padStart(2, '0')}</span><div><h3>{exercise.name}</h3><p>{exercise.category} · {exercise.equipment}</p></div><button className="td-remove-exercise" aria-label={`حذف ${exercise.name} از برنامه`} onClick={() => removeAssignedExercise(exercise.id)}><Icon name="trash" size={15} /></button></div><div className="td-member-set-list">{Array.from({ length: Math.max(1, Number(exercise.sets) || 1) }, (_, setIndex) => <label key={setIndex}><span>ست {setIndex + 1}</span><input aria-label={`تکرار ست ${setIndex + 1} ${exercise.name}`} value={exercise.setReps?.[setIndex] ?? exercise.reps} onChange={(event) => updateAssignedExercise(exercise.id, { setReps: Array.from({ length: Math.max(1, Number(exercise.sets) || 1) }, (_, index) => index === setIndex ? event.target.value : exercise.setReps?.[index] ?? exercise.reps) })} /></label>)}<label><span>استراحت</span><input aria-label={`استراحت ${exercise.name}`} value={exercise.rest} onChange={(event) => updateAssignedExercise(exercise.id, { rest: event.target.value })} /></label><label><span>تعداد ست</span><input aria-label={`تعداد ست ${exercise.name}`} type="number" min="1" max="20" value={exercise.sets} onChange={(event) => { const count = Math.max(1, Math.min(20, Number(event.target.value) || 1)); updateAssignedExercise(exercise.id, { sets: event.target.value, setReps: Array.from({ length: count }, (_, setIndex) => exercise.setReps?.[setIndex] ?? exercise.reps) }); }} /></label></div></article>)}</div> : <EmptyState text="هنوز حرکتی به برنامهٔ این عضو اضافه نشده؛ از کتابخانه حرکت انتخاب کنید." />}<p className="td-disclaimer">برنامهٔ ذخیره‌شده در پنل عضو با همین ست‌ها و تکرارها نمایش داده می‌شود. حرکت و شدت را متناسب با شرایط عضو تنظیم کنید.</p></div>
        </section>}

        {section === 'nutrition' && <section className="td-nutrition-layout">{selectedMember ? <><div className="td-panel td-nutrition-member"><div className="td-member-profile"><span className="td-profile-avatar">{selectedMember.name.slice(0, 1)}</span><div><h2>برنامهٔ تغذیهٔ {selectedMember.name}</h2><p>هدف روزانه را تنظیم کنید و خوراک‌های مصرف‌شده را ثبت کنید.</p></div></div><label className="td-field-label">عضو<select value={selectedMember.id} onChange={(event) => selectMember(event.target.value)}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><div className="td-goals-grid"><label className="td-field-label">هدف پروتئین (گرم)<input type="number" min="1" value={selectedMember.proteinGoal} onChange={(event) => updateMember(selectedMember.id, { proteinGoal: Number(event.target.value) })} /></label><label className="td-field-label">هدف کربوهیدرات (گرم)<input type="number" min="1" value={selectedMember.carbsGoal} onChange={(event) => updateMember(selectedMember.id, { carbsGoal: Number(event.target.value) })} /></label><label className="td-field-label">هدف انرژی (کیلوکالری)<input type="number" min="1" value={selectedMember.calorieGoal} onChange={(event) => updateMember(selectedMember.id, { calorieGoal: Number(event.target.value) })} /></label></div></div>
          <div className="td-nutrition-columns"><div className="td-panel td-food-panel"><PanelHeading title="ثبت خوراک" detail="مادهٔ آماده انتخاب کنید یا مقادیر خوراک دلخواه را وارد کنید." /><div className="td-segmented"><button className={foodEntryMode === 'catalog' ? 'active' : ''} onClick={() => setFoodEntryMode('catalog')}>فهرست خوراک</button><button className={foodEntryMode === 'custom' ? 'active' : ''} onClick={() => setFoodEntryMode('custom')}>ثبت خوراک دلخواه</button></div><form className="td-food-form" onSubmit={addFood}><label className="td-field-label">{foodEntryMode === 'catalog' ? 'مادهٔ غذایی' : 'نام خوراک'}{foodEntryMode === 'catalog' ? <select value={foodId} onChange={(event) => setFoodId(event.target.value)}>{foods.map((food) => <option key={food.id} value={food.id}>{food.name} · {food.category}</option>)}</select> : <input required value={customFood.name} onChange={(event) => setCustomFood({ ...customFood, name: event.target.value })} placeholder="مثال: نان سنگک" />}</label><label className="td-field-label">مقدار (گرم)<input type="number" min="1" max="3000" value={foodGrams} onChange={(event) => setFoodGrams(event.target.value)} /></label>{foodEntryMode === 'custom' && <div className="td-custom-nutrients"><label className="td-field-label">انرژی (کیلوکالری / ۱۰۰ گرم)<input type="number" min="0" value={customFood.kcal} onChange={(event) => setCustomFood({ ...customFood, kcal: event.target.value })} /></label><label className="td-field-label">پروتئین (گرم / ۱۰۰ گرم)<input required type="number" min="0" step="0.1" value={customFood.protein} onChange={(event) => setCustomFood({ ...customFood, protein: event.target.value })} /></label><label className="td-field-label">کربوهیدرات (گرم / ۱۰۰ گرم)<input required type="number" min="0" step="0.1" value={customFood.carbs} onChange={(event) => setCustomFood({ ...customFood, carbs: event.target.value })} /></label><label className="td-field-label">چربی (گرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.fat} onChange={(event) => setCustomFood({ ...customFood, fat: event.target.value })} /></label><label className="td-field-label">فیبر (گرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.fiber} onChange={(event) => setCustomFood({ ...customFood, fiber: event.target.value })} /></label><label className="td-field-label">کلسیم (میلی‌گرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.calcium} onChange={(event) => setCustomFood({ ...customFood, calcium: event.target.value })} /></label><label className="td-field-label">آهن (میلی‌گرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.iron} onChange={(event) => setCustomFood({ ...customFood, iron: event.target.value })} /></label><label className="td-field-label">ویتامین C (میلی‌گرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.vitaminC} onChange={(event) => setCustomFood({ ...customFood, vitaminC: event.target.value })} /></label><label className="td-field-label">ویتامین B۱۲ (میکروگرم / ۱۰۰ گرم)<input type="number" min="0" step="0.1" value={customFood.vitaminB12} onChange={(event) => setCustomFood({ ...customFood, vitaminB12: event.target.value })} /></label></div>}<button className="td-primary-button" type="submit"><Icon name="plus" /> افزودن به فهرست امروز</button></form><div className="td-food-log-heading"><b>خوراک‌های ثبت‌شده</b><span>{selectedMember.foodLog.length.toLocaleString('fa-IR')} مورد</span></div>{selectedMember.foodLog.length ? <div className="td-food-list">{selectedMember.foodLog.map((entry) => { const food = entry.nutrition ?? foods.find((item) => item.id === entry.foodId); const kcal = food ? Math.round((food.kcal * entry.grams) / 100) : 0; return <div className="td-food-row" key={entry.id}><span className="td-food-dot"><Icon name="nutrition" size={17} /></span><span className="td-food-name"><b>{entry.name}</b><small>{entry.grams.toLocaleString('fa-IR')} گرم · {kcal.toLocaleString('fa-IR')} کیلوکالری</small></span><button aria-label={`حذف ${entry.name}`} onClick={() => { updateMember(selectedMember.id, { foodLog: selectedMember.foodLog.filter((item) => item.id !== entry.id) }); }}><Icon name="trash" size={16} /></button></div>; })}</div> : <EmptyState text="برای شروع، یک مادهٔ غذایی اضافه کنید." />}</div>
            <div className="td-panel td-nutrient-panel"><PanelHeading title="دریافتی امروز" detail="جمع مواد غذایی ثبت‌شده" icon="flame" /><div className="td-calorie-total"><strong>{Math.round(totals.kcal).toLocaleString('fa-IR')}</strong><span>از {selectedMember.calorieGoal.toLocaleString('fa-IR')} کیلوکالری</span></div><ProgressBar value={totals.kcal} goal={selectedMember.calorieGoal} tone="amber" /><div className="td-macro-stack"><MacroProgress label="پروتئین" value={totals.protein} goal={selectedMember.proteinGoal} unit="گرم" tone="green" /><MacroProgress label="کربوهیدرات" value={totals.carbs} goal={selectedMember.carbsGoal} unit="گرم" tone="blue" /><MacroProgress label="چربی" value={totals.fat} goal={Math.max(1, selectedMember.calorieGoal * 0.3 / 9)} unit="گرم" tone="violet" /><MacroProgress label="فیبر" value={totals.fiber} goal={25} unit="گرم" tone="teal" /></div><div className="td-micros"><h3>ریزمغذی‌های ثبت‌شده</h3><div><span>کلسیم</span><b>{Math.round(totals.calcium).toLocaleString('fa-IR')} <small>میلی‌گرم</small></b></div><div><span>آهن</span><b>{Number(totals.iron.toFixed(1)).toLocaleString('fa-IR')} <small>میلی‌گرم</small></b></div><div><span>ویتامین C</span><b>{Math.round(totals.vitaminC).toLocaleString('fa-IR')} <small>میلی‌گرم</small></b></div><div><span>ویتامین B۱۲</span><b>{Number(totals.vitaminB12.toFixed(1)).toLocaleString('fa-IR')} <small>میکروگرم</small></b></div></div></div></div>
          <p className="td-nutrition-disclaimer">مقادیر غذایی تقریبی و بر اساس دادهٔ هر ۱۰۰ گرم هستند؛ برای نسخهٔ درمانی یا نیاز پزشکی با متخصص تغذیه مشورت شود.</p></> : <div className="td-panel"><EmptyState text="برای ساخت برنامهٔ تغذیه، ابتدا یک عضو ثبت کنید." /></div>}</section>}
      </main>
    </div>

    {showMemberForm && <div className="td-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowMemberForm(false); }}><section className="td-modal" role="dialog" aria-modal="true" aria-labelledby="td-modal-title"><div className="td-modal-heading"><div><p className="td-eyebrow">پروندهٔ جدید</p><h2 id="td-modal-title">ثبت عضو باشگاه</h2></div><button className="td-icon-button" aria-label="بستن" onClick={() => setShowMemberForm(false)}><Icon name="close" /></button></div><form onSubmit={addMember}><div className="td-modal-fields"><label className="td-field-label">نام و نام خانوادگی<input autoFocus value={memberForm.name} onChange={(event) => setMemberForm({ ...memberForm, name: event.target.value })} placeholder="مثال: نگار احمدی" /></label><label className="td-field-label">شماره تماس<input type="tel" value={memberForm.phone} onChange={(event) => setMemberForm({ ...memberForm, phone: event.target.value })} placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" /></label><label className="td-field-label">ایمیل (اختیاری)<input type="email" value={memberForm.email} onChange={(event) => setMemberForm({ ...memberForm, email: event.target.value })} placeholder="name@example.com" /></label><label className="td-field-label">کد دسترسی عضو<input required inputMode="numeric" minLength={4} maxLength={8} value={memberForm.accessCode} onChange={(event) => setMemberForm({ ...memberForm, accessCode: event.target.value.replace(/\D/g, '').slice(0, 8) })} placeholder="۴ تا ۸ رقم" /></label><label className="td-field-label">هدف اصلی<select value={memberForm.goal} onChange={(event) => setMemberForm({ ...memberForm, goal: event.target.value })}>
        <option>عضله‌سازی</option>
        <option>کاهش چربی</option>
        <option>افزایش قدرت</option>
        <option>افزایش آمادگی جسمانی</option>
      </select></label><label className="td-field-label">وزن فعلی (کیلوگرم)<input type="number" min="1" value={memberForm.weight} onChange={(event) => setMemberForm({ ...memberForm, weight: event.target.value })} placeholder="۷۰" /></label><label className="td-field-label">هدف پروتئین روزانه (گرم)<input type="number" min="1" value={memberForm.proteinGoal} onChange={(event) => setMemberForm({ ...memberForm, proteinGoal: event.target.value })} /></label><label className="td-field-label">هدف کربوهیدرات (گرم)<input type="number" min="1" value={memberForm.carbsGoal} onChange={(event) => setMemberForm({ ...memberForm, carbsGoal: event.target.value })} /></label><label className="td-field-label">هدف انرژی (کیلوکالری)<input type="number" min="1" value={memberForm.calorieGoal} onChange={(event) => setMemberForm({ ...memberForm, calorieGoal: event.target.value })} /></label></div>{formError && <p className="td-form-error" role="alert">{formError}</p>}<div className="td-modal-actions"><button className="td-secondary-button" type="button" onClick={() => setShowMemberForm(false)}>انصراف</button><button className="td-primary-button" type="submit"><Icon name="check" /> ذخیرهٔ پرونده</button></div></form></section></div>}
    {showExerciseForm && <div className="td-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowExerciseForm(false); }}><section className="td-modal td-exercise-modal" role="dialog" aria-modal="true" aria-labelledby="td-exercise-modal-title"><div className="td-modal-heading"><div><p className="td-eyebrow">کتابخانهٔ حرکات</p><h2 id="td-exercise-modal-title">افزودن حرکت جدید</h2></div><button className="td-icon-button" aria-label="بستن" onClick={() => setShowExerciseForm(false)}><Icon name="close" /></button></div><form onSubmit={addExerciseToLibrary}><div className="td-modal-fields"><label className="td-field-label">نام حرکت<input autoFocus value={exerciseForm.name} onChange={(event) => setExerciseForm({ ...exerciseForm, name: event.target.value })} placeholder="مثال: فلای سیم‌کش تک‌دست" /></label><label className="td-field-label">گروه عضلانی<select value={exerciseForm.category} onChange={(event) => setExerciseForm({ ...exerciseForm, category: event.target.value as ExerciseCategory })}>{exerciseCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="td-field-label td-exercise-equipment-field">وسیله یا نوع اجرا<input value={exerciseForm.equipment} onChange={(event) => setExerciseForm({ ...exerciseForm, equipment: event.target.value })} placeholder="مثال: سیم‌کش" /></label></div>{exerciseFormError && <p className="td-form-error" role="alert">{exerciseFormError}</p>}<div className="td-modal-actions"><button className="td-secondary-button" type="button" onClick={() => setShowExerciseForm(false)}>انصراف</button><button className="td-primary-button" type="submit"><Icon name="check" /> ذخیره در کتابخانه</button></div></form></section></div>}
    {notice && <div className="td-toast" role="status"><Icon name="check" />{notice}</div>}
  </div>;
}

function StatCard({ icon, tone, label, value, detail, badge }: { icon: string; tone: string; label: string; value: number; detail: string; badge: string }) {
  return <article className="td-stat-card"><span className={`td-stat-icon ${tone}`}><Icon name={icon} /></span><div><small>{label}</small><strong>{value.toLocaleString('fa-IR')}</strong><span>{detail}</span></div><b className="td-stat-trend">{badge}</b></article>;
}
function PanelHeading({ title, detail, action, onAction, badge, icon }: { title: string; detail: string; action?: string; onAction?: () => void; badge?: string; icon?: string }) {
  return <div className="td-panel-heading"><div><h2>{title}</h2><p>{detail}</p></div>{action && onAction ? <button className="td-text-button" onClick={onAction}>{action}<Icon name="arrow" /></button> : badge ? <span className="td-plan-count">{badge}</span> : icon ? <span className="td-round-icon"><Icon name={icon} /></span> : null}</div>;
}
function MacroProgress({ label, value, goal, unit, tone }: { label: string; value: number; goal: number; unit: string; tone: string }) {
  return <div className="td-macro-row"><div className="td-macro-label"><span><i className={`td-dot ${tone}`} />{label}</span><b>{Math.round(value).toLocaleString('fa-IR')} <small>/ {Math.round(goal).toLocaleString('fa-IR')} {unit}</small></b></div><ProgressBar value={value} goal={goal} tone={tone} /></div>;
}
function EmptyState({ text }: { text: string }) {
  return <div className="td-empty"><span><Icon name="grid" size={21} /></span><p>{text}</p></div>;
}