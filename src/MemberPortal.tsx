import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Member } from './TrainerDashboard';
import { MEMBER_STORAGE_KEY } from './TrainerDashboard';
import './member-portal.css';

type FoodSummary = { kcal: number; protein: number; carbs: number; fat: number; fiber: number; calcium: number; iron: number; vitaminC: number; vitaminB12: number };
const FOOD_CATALOG: Record<string, Omit<FoodSummary, 'kcal'> & { kcal: number }> = {
  egg: { kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0, calcium: 56, iron: 1.8, vitaminC: 0, vitaminB12: 1.1 },
  chicken: { kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, calcium: 15, iron: 1, vitaminC: 0, vitaminB12: 0.3 },
  'greek-yogurt': { kcal: 97, protein: 9, carbs: 3.9, fat: 5, fiber: 0, calcium: 110, iron: 0.1, vitaminC: 0, vitaminB12: 0.8 },
  oats: { kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, calcium: 54, iron: 4.7, vitaminC: 0, vitaminB12: 0 },
  rice: { kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, calcium: 10, iron: 0.2, vitaminC: 0, vitaminB12: 0 },
  banana: { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, calcium: 5, iron: 0.3, vitaminC: 8.7, vitaminB12: 0 },
  broccoli: { kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, calcium: 47, iron: 0.7, vitaminC: 89, vitaminB12: 0 },
  almond: { kcal: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, calcium: 269, iron: 3.7, vitaminC: 0, vitaminB12: 0 },
  salmon: { kcal: 206, protein: 22.1, carbs: 0, fat: 12.4, fiber: 0, calcium: 15, iron: 0.3, vitaminC: 0, vitaminB12: 3.2 },
};

function readMembers(): Member[] {
  try { return JSON.parse(localStorage.getItem(MEMBER_STORAGE_KEY) ?? '[]') as Member[]; } catch { return []; }
}
function normalizeDigits(value: string) {
  return value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/\D/g, '');
}
function getNutrition(member: Member): FoodSummary {
  return member.foodLog.reduce((sum, entry) => {
    const values = entry.nutrition ?? FOOD_CATALOG[entry.foodId];
    if (!values) return sum;
    const scale = entry.grams / 100;
    return { kcal: sum.kcal + values.kcal * scale, protein: sum.protein + values.protein * scale, carbs: sum.carbs + values.carbs * scale, fat: sum.fat + values.fat * scale, fiber: sum.fiber + values.fiber * scale, calcium: sum.calcium + values.calcium * scale, iron: sum.iron + values.iron * scale, vitaminC: sum.vitaminC + values.vitaminC * scale, vitaminB12: sum.vitaminB12 + values.vitaminB12 * scale };
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, calcium: 0, iron: 0, vitaminC: 0, vitaminB12: 0 });
}
function Icon({ name }: { name: 'shield' | 'barbell' | 'nutrition' | 'exit' | 'clock' | 'lock' | 'check' }) {
  const content = {
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    barbell: <><path d="M6.5 6.5v11m11-11v11M3 9v6m18-6v6M6.5 12h11" /></>,
    nutrition: <><path d="M12 20c4-3 7-7 7-11-4 0-7 2-8 6-1-3-3-5-6-5 0 5 2 8 7 10Z" /><path d="M12 20c0-5 2-8 6-11" /></>,
    exit: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content[name]}</svg>;
}
function Bar({ value, goal, color }: { value: number; goal: number; color: string }) {
  const percent = goal > 0 ? Math.min(100, value / goal * 100) : 0;
  return <div className="mp-bar"><span style={{ width: `${percent}%`, background: color }} /></div>;
}

export default function MemberPortal({ onExit }: { onExit: () => void }) {
  const [member, setMember] = useState<Member | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const [showLogin, setShowLogin] = useState(false);
  const nutrition = useMemo(() => member ? getNutrition(member) : null, [member]);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = normalizeDigits(phone);
    const normalizedCode = normalizeDigits(code);
    const found = readMembers().find((item) => item.phone && normalizeDigits(item.phone) === normalizedPhone && item.accessCode && normalizeDigits(item.accessCode) === normalizedCode);
    if (!found) { setError('شمارهٔ تماس یا کد دسترسی درست نیست.'); return; }
    setMember(found);
    setError('');
    setShowLogin(false);
  };

  if (!member) return <div className="member-portal" dir="rtl">
    <header className="mp-header"><a className="mp-brand" href="#member" onClick={(event) => event.preventDefault()}><span>ش</span><b>شاهین<small>پرتال اعضا</small></b></a><button className="mp-back" onClick={onExit}><Icon name="exit" /> بازگشت به سایت</button></header>
    <main className="mp-login-shell"><section className="mp-login-visual"><div className="mp-visual-kicker"><Icon name="shield" /> فضای اختصاصی اعضا</div><h1>تمرینت را<br /><em>ادامه بده.</em></h1><p>برنامهٔ تمرین و تغذیه‌ات همیشه همراه توست.</p><div className="mp-visual-stats"><span><b>تمرین</b><small>برنامهٔ شخصی</small></span><i /><span><b>تغذیه</b><small>پایش روزانه</small></span><i /><span><b>پیشرفت</b><small>مسیر تو</small></span></div></section><section className="mp-login-panel"><div className="mp-login-icon"><Icon name="lock" /></div><p className="mp-eyebrow">ورود اعضا</p><h2>به برنامهٔ خودت وارد شو</h2><p className="mp-login-description">با شمارهٔ ثبت‌شده در باشگاه و کد دسترسی که مربی در اختیارت گذاشته وارد شو.</p><form onSubmit={login}><label>شمارهٔ تماس<input autoComplete="username" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="مثال: ۰۹۱۲۱۲۳۴۵۶۷" /></label><label>کد دسترسی<input autoComplete="current-password" inputMode="numeric" type="password" value={code} onChange={(event) => setCode(event.target.value)} placeholder="کد ۴ تا ۸ رقمی" /></label>{error && <p className="mp-error" role="alert">{error}</p>}<button className="mp-submit" type="submit">ورود به حساب <span>←</span></button></form><div className="mp-login-foot"><Icon name="shield" /> فقط اطلاعات حساب خودت را مشاهده می‌کنی.</div></section></main>
    {showLogin && <div className="mp-toast" role="status">برای ساخت یا بازیابی کد ورود، با مربی باشگاه تماس بگیر.</div>}
  </div>;

  return <div className="member-portal" dir="rtl">
    <header className="mp-header"><a className="mp-brand" href="#member" onClick={(event) => event.preventDefault()}><span>ش</span><b>شاهین<small>پرتال اعضا</small></b></a><div className="mp-header-member"><span className="mp-avatar">{member.name.slice(0, 1)}</span><span><b>{member.name}</b><small>عضو باشگاه شاهین</small></span></div><button className="mp-back" onClick={() => setMember(null)}><Icon name="exit" /> خروج از حساب</button></header>
    <main className="mp-dashboard"><div className="mp-welcome"><div><p className="mp-eyebrow">باشگاه شاهین</p><h1>سلام {member.name.split(' ')[0]}، آماده‌ای؟</h1><p>این برنامه فقط برای حساب تو نمایش داده می‌شود.</p></div><span className="mp-member-goal">هدف تمرین <b>{member.goal}</b></span></div>
      <nav className="mp-tabs" aria-label="بخش‌های برنامهٔ عضو"><button className={activeTab === 'workout' ? 'active' : ''} onClick={() => setActiveTab('workout')}><Icon name="barbell" /> برنامهٔ تمرینی</button><button className={activeTab === 'nutrition' ? 'active' : ''} onClick={() => setActiveTab('nutrition')}><Icon name="nutrition" /> برنامهٔ تغذیه</button></nav>
      {activeTab === 'workout' && <section className="mp-workout"><div className="mp-section-heading"><div><h2>برنامهٔ تمرینی تو</h2><p>{member.workoutExercises?.length ? 'حرکت‌ها و تکرارهای هر ست را طبق برنامه پیش ببر.' : 'هنوز برنامه‌ای توسط مربی برایت ثبت نشده است.'}</p></div><span className="mp-plan-pill">{member.workoutExercises?.length ?? 0} حرکت</span></div>{member.workoutExercises?.length ? <div className="mp-exercise-list">{member.workoutExercises.map((exercise, index) => <article className="mp-exercise" key={exercise.id}><div className="mp-exercise-title"><span className="mp-exercise-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{exercise.name}</h3><p>{exercise.category} · {exercise.equipment}</p></div></div><div className="mp-set-list">{Array.from({ length: Math.max(1, Number(exercise.sets) || 1) }, (_, setIndex) => <div className="mp-set" key={setIndex}><span>ست {setIndex + 1}</span><b>{exercise.setReps?.[setIndex] ?? exercise.reps} تکرار</b></div>)}</div><div className="mp-rest"><Icon name="clock" /> استراحت بین ست‌ها: {exercise.rest}</div></article>)}</div> : <div className="mp-empty"><span><Icon name="barbell" /></span><b>برنامه در راه است</b><p>مربی پس از ثبت برنامه، حرکت‌ها و تعداد تکرار هر ست را همین‌جا برایت قرار می‌دهد.</p></div>}</section>}
      {activeTab === 'nutrition' && <section className="mp-nutrition"><div className="mp-section-heading"><div><h2>تغذیهٔ امروز</h2><p>فهرست خوراک‌هایی که مربی برایت ثبت کرده است.</p></div><span className="mp-plan-pill">{member.foodLog.length} مورد</span></div><div className="mp-nutrition-grid"><div className="mp-food-panel"><h3>خوراک‌های ثبت‌شده</h3>{member.foodLog.length ? member.foodLog.map((entry) => <div className="mp-food-row" key={entry.id}><span><b>{entry.name}</b><small>{entry.grams} گرم</small></span><b>{Math.round(((entry.nutrition ?? FOOD_CATALOG[entry.foodId])?.kcal ?? 0) * entry.grams / 100)} کیلوکالری</b></div>) : <div className="mp-empty compact"><p>هنوز خوراکی برای امروز ثبت نشده است.</p></div>}</div><div className="mp-macro-panel"><h3>دریافتی / هدف روزانه</h3>{nutrition && <><MemberMacro label="انرژی" value={nutrition.kcal} goal={member.calorieGoal} unit="کیلوکالری" color="#b78a34" /><MemberMacro label="پروتئین" value={nutrition.protein} goal={member.proteinGoal} unit="گرم" color="#32804e" /><MemberMacro label="کربوهیدرات" value={nutrition.carbs} goal={member.carbsGoal} unit="گرم" color="#547eab" /><MemberMacro label="چربی" value={nutrition.fat} goal={Math.max(1, member.calorieGoal * 0.3 / 9)} unit="گرم" color="#8671a4" /><div className="mp-micros"><h4>ریزمغذی‌ها</h4><span>فیبر <b>{nutrition.fiber.toFixed(1)} گرم</b></span><span>کلسیم <b>{Math.round(nutrition.calcium)} میلی‌گرم</b></span><span>آهن <b>{nutrition.iron.toFixed(1)} میلی‌گرم</b></span><span>ویتامین C <b>{Math.round(nutrition.vitaminC)} میلی‌گرم</b></span><span>ویتامین B۱۲ <b>{nutrition.vitaminB12.toFixed(1)} میکروگرم</b></span></div></>}</div></div><p className="mp-disclaimer">مقادیر غذایی تخمینی‌اند و جایگزین توصیهٔ متخصص تغذیه نیستند.</p></section>}
    </main>
  </div>;
}

function MemberMacro({ label, value, goal, unit, color }: { label: string; value: number; goal: number; unit: string; color: string }) {
  const percent = goal > 0 ? Math.min(100, value / goal * 100) : 0;
  return <div className="mp-macro"><div><span>{label}</span><b>{Math.round(value)} <small>/ {Math.round(goal)} {unit}</small></b></div><div className="mp-bar"><span style={{ width: `${percent}%`, background: color }} /></div></div>;
}
