import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type IconName = 'arrow' | 'play' | 'menu' | 'close' | 'instagram' | 'facebook' | 'check' | 'quote';

const Icon = ({ name, size = 20 }: { name: IconName; size?: number }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (name === 'arrow') return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
  if (name === 'play') return <svg {...common} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7V5Z" /></svg>;
  if (name === 'menu') return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'instagram') return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="12" cy="12" r="4" /><path d="M17.4 6.6h.01" /></svg>;
  if (name === 'facebook') return <svg {...common}><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3.2l.8-4H13V9c0-.7.3-1 1-1Z" /></svg>;
  if (name === 'check') return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...common}><path d="M4 12h4M16 12h4M12 4v4M12 16v4" /><circle cx="12" cy="12" r="6" /></svg>;
};

const programs = [
  { number: '۰۱', title: 'بدنسازی', detail: 'با برنامه‌ریزی دقیق، اضافه‌بار اصولی و همراهی مربیان حرفه‌ای، بدنی قدرتمند بسازید.', tag: 'عضله‌سازی' },
  { number: '۰۲', title: 'تمرین قدرتی', detail: 'قدرتی واقعی و کاربردی با حرکات ترکیبی، تمرینات ورزشی و ریکاوری هوشمند بسازید.', tag: 'عملکرد' },
  { number: '۰۳', title: 'مربی خصوصی', detail: 'تمرینی اختصاصی متناسب با بدن، هدف و استانداردی که برای خودتان تعیین کرده‌اید.', tag: 'مربی‌گری یک‌به‌یک' },
  { number: '۰۴', title: 'چربی‌سوزی', detail: 'سیستمی پایدار که استمرار را به نقطه قوت و اعتمادبه‌نفس را به عادت شما تبدیل می‌کند.', tag: 'آمادگی جسمانی' },
];

const coaches = [
  { initials: 'AR', name: 'آرش رحیمی', role: 'سرمربی · ۱۲ سال تجربه', focus: 'قدرت و آمادگی جسمانی' },
  { initials: 'SN', name: 'سارا نوری', role: 'مربی عملکرد · ۸ سال تجربه', focus: 'تمرین بانوان و چربی‌سوزی' },
  { initials: 'KM', name: 'کیان مهر', role: 'مربی بدنسازی · ۱۰ سال تجربه', focus: 'عضله‌سازی و آمادگی مسابقات' },
];

const plans = [
  { name: 'پایه', price: '۳۹', note: 'برای شروع قدرتمند', features: ['دسترسی کامل به باشگاه', 'دسترسی به رختکن', 'سالن تمرین آزاد'], featured: false },
  { name: 'حرفه‌ای', price: '۷۹', note: 'برای کسانی که بیشتر می‌خواهند', features: ['همه امکانات پلن پایه', 'سونا و بخش ریکاوری', 'جلسه بررسی ماهانه با مربی', 'یک جلسه مهمان در ماه'], featured: true },
  { name: 'نامحدود', price: '۱۲۹', note: 'برای تحول کامل', features: ['همه امکانات پلن حرفه‌ای', '۴ جلسه مربی خصوصی', 'استراتژی تغذیه', 'رزرو اولویت‌دار کلاس‌ها'], featured: false },
];

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showFlightHint, setShowFlightHint] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    const onMetadata = () => setVideoReady(true);
    if (video.readyState >= 1) setVideoReady(true);
    video.addEventListener('loadedmetadata', onMetadata);
    return () => video.removeEventListener('loadedmetadata', onMetadata);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      const startY = hero.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - startY) / travel));
      if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
        const target = Math.min(video.duration - 0.04, Math.max(0, progress * video.duration));
        // Avoid stacking seek requests while the browser is still decoding a frame.
        if (!video.seeking && Math.abs(video.currentTime - target) > 0.08) {
          video.currentTime = target;
        }
      }
      setShowFlightHint(progress < 0.08);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(sync); };
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('loadeddata', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('loadeddata', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => setMouse({ x: (event.clientX / window.innerWidth - .5) * 2, y: (event.clientY / window.innerHeight - .5) * 2 });
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return <div className="site-shell">
    <header className={`nav ${menuOpen ? 'nav-open' : ''}`}>
      <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}><span className="brand-mark">ش</span><span>باشگاه<small>شاهین</small></span></a>
      <nav className="desktop-links" aria-label="ناوبری اصلی">
        {[['درباره ما', 'about'], ['برنامه‌ها', 'programs'], ['مربیان', 'coaches'], ['عضویت', 'membership'], ['تماس با ما', 'contact']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>)}
      </nav>
      <a className="nav-cta" href="#membership" onClick={(e) => { e.preventDefault(); scrollTo('membership'); }}>عضویت <Icon name="arrow" size={16} /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      {menuOpen && <nav className="mobile-links">{[['درباره ما', 'about'], ['برنامه‌ها', 'programs'], ['مربیان', 'coaches'], ['عضویت', 'membership'], ['تماس با ما', 'contact']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>)}</nav>}
    </header>

    <main id="top">
      <section className="eagle-stage" ref={heroRef} aria-label="معرفی سینمایی باشگاه شاهین">
        <div className="eagle-sticky">
          <div className="grain" />
          <div className="hero-vignette" />
          <div className="eagle-copy">
            <p className="eyebrow"><span /> تأسیس ۱۳۹۳ · ایران</p>
            <h1>باشگاه<br /><em>بدنسازی</em><br />شاهین<span>.</span></h1>
            <p className="hero-sub">قدرت. انضباط.<br />تحول.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo('contact')}>عضویت در باشگاه <Icon name="arrow" size={18} /></button><button className="button button-ghost" onClick={() => scrollTo('programs')}><span className="play-icon"><Icon name="play" size={12} /></span> برنامه‌های ما</button></div>
          </div>
          <div className="flight-layer" aria-hidden="true"><video ref={videoRef} className="flight-video" src={`${import.meta.env.BASE_URL}shaheen-flight.mp4`} muted playsInline preload="auto" /></div>
          <div className="perched-eagle" style={{ transform: `translate3d(${mouse.x * 7}px, ${mouse.y * 4}px, 0)` }} aria-hidden="true" />
          <div className="hero-meta"><span>برای ورود اسکرول کنید</span><span className="scroll-line"><i /></span><span>۰۱ / ۰۶</span></div>
          {showFlightHint && <div className="flight-note"><span className="pulse-dot" /> شاهین را بیدار کنید</div>}
          <div className="hero-corner hero-corner-left">شاهین / ۰۰۱</div><div className="hero-corner hero-corner-right">بدون بهانه</div>
        </div>
      </section>

      <section className="reference-header" aria-label="هدر تصویری باشگاه شاهین">
        <img src={`${import.meta.env.BASE_URL}gymx-header.png`} alt="هدر تصویری باشگاه بدنسازی شاهین" />
      </section>

      <section className="manifesto" id="about"><div className="section-wrap two-col"><div><p className="eyebrow dark">استاندارد شاهین</p><h2>برای<br /><em>بی‌رقم‌ها.</em></h2></div><div className="manifesto-copy"><p className="lead">اینجا فقط یک باشگاه نیست؛ میدان اثبات آدم‌هایی است که نمی‌خواهند مثل قبل بمانند.</p><p>باشگاه بدنسازی شاهین، تمرین حرفه‌ای، جامعه‌ای قدرتمند و استانداردی بی‌رقیب را زیر یک سقف جمع کرده است. هر تکرار هدفی دارد و هر جلسه شما را یک قدم جلوتر می‌برد.</p><a className="text-link" href="#programs" onClick={(e) => { e.preventDefault(); scrollTo('programs'); }}>فلسفه ما <Icon name="arrow" size={16} /></a></div></div><div className="stats section-wrap"><div><strong>۱۲</strong><span>سال<br />تجربه</span></div><div><strong>۴.۹</strong><span>امتیاز<br />اعضا</span></div><div><strong>۲.۴k</strong><span>زندگی<br />متفاوت</span></div><div><strong>۲۴/۷</strong><span>دسترسی<br />اعضا</span></div></div></section>

      <section className="programs section-wrap" id="programs"><div className="section-heading"><div><p className="eyebrow dark">خدمات ما</p><h2>با <em>هدف</em> تمرین کنید.</h2></div><p>برنامه‌هایی طراحی‌شده برای رسیدن به نقطه‌ای که هستید و عبور از چیزی که فکر می‌کردید ممکن است.</p></div><div className="program-grid">{programs.map((p) => <article className="program-card" key={p.number}><div className="program-number">{p.number}</div><div><p className="card-tag">{p.tag}</p><h3>{p.title}</h3><p>{p.detail}</p><a className="round-arrow" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}><Icon name="arrow" size={18} /></a></div></article>)}</div></section>

      <section className="coaches dark-section" id="coaches"><div className="section-wrap"><div className="section-heading light"><div><p className="eyebrow">تیم مربیان</p><h2>برتری خود را <em>بسازید.</em></h2></div><p>مربیانی که مسیر را رفته‌اند و می‌دانند چطور بهترین نسخه شما را بیرون بکشند.</p></div><div className="coach-grid">{coaches.map((coach, i) => <article className="coach-card" key={coach.name}><div className={`coach-photo coach-${i + 1}`}><span>{coach.initials}</span></div><div className="coach-info"><h3>{coach.name}</h3><p>{coach.role}</p><small>{coach.focus}</small></div></article>)}</div></div></section>

      <section className="facilities section-wrap"><div className="facilities-head"><div><p className="eyebrow dark">زمین بازی جدید شما</p><h2>بیشتر از<br /><em>تجهیزات.</em></h2></div><p>۴۰۰۰ مترمربع فضای حرفه‌ای، تجهیزات ممتاز و جایی برای تبدیل شدن به کسی که برایش آمده‌اید.</p></div><div className="facility-gallery"><div className="facility-tile tile-large"><span className="tile-label">۰۱ · سالن اصلی</span><div className="abstract-bars" /></div><div className="facility-tile tile-tall"><span className="tile-label">۰۲ · ریکاوری</span><div className="abstract-ring" /></div><div className="facility-tile tile-small"><span className="tile-label">۰۳ · منطقه تمرین</span><div className="abstract-grid" /></div></div></section>

      <section className="membership dark-section" id="membership"><div className="section-wrap"><div className="section-heading light"><div><p className="eyebrow">انتخاب استاندارد شما</p><h2>روی <em>خودتان</em> سرمایه‌گذاری کنید.</h2></div><p>بدون قراردادهای محدودکننده و هزینه‌های پنهان؛ فقط هر آنچه برای تمرین در بالاترین سطح نیاز دارید.</p></div><div className="plan-grid">{plans.map((plan) => <article className={`plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>{plan.featured && <div className="popular">محبوب‌ترین</div>}<p className="card-tag">{plan.name}</p><h3><sup>$</sup>{plan.price}<small>/ ماه</small></h3><p className="plan-note">{plan.note}</p><ul>{plan.features.map((feature) => <li key={feature}><Icon name="check" size={15} />{feature}</li>)}</ul><button className={`button ${plan.featured ? 'button-primary' : 'button-outline'}`} onClick={() => scrollTo('contact')}>شروع کنید <Icon name="arrow" size={16} /></button></article>)}</div></div></section>

      <section className="testimonial section-wrap"><div className="quote-mark">“</div><blockquote>«اینجا جایی بود که قول دادن به خودم را متوقف کردم و به عمل کردن شروع کردم.»</blockquote><div className="quote-person"><span className="avatar">ا‍م</span><span><strong>آرمان م.</strong><small>عضو از سال ۱۴۰۰ · ۲۸ کیلو تغییر</small></span></div></section>

      <section className="contact" id="contact"><div className="section-wrap contact-grid"><div><p className="eyebrow">وقتش که رسید</p><h2>اولین قدم<br /><em>را بردارید.</em></h2><p className="contact-lead">قوی‌ترین فصل زندگی شما با یک گفت‌وگو شروع می‌شود. فضا را ببینید، با تیم آشنا شوید و تفاوت را احساس کنید.</p><div className="contact-details"><p><span>آدرس</span>خیابان ولیعصر، پلاک ۲۴۱۲<br />تهران، ایران</p><p><span>تماس</span><a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a></p><p><span>ساعات کاری</span>هر روز هفته · ۲۴ ساعته</p></div></div><form className="inquiry-form" onSubmit={(e) => { e.preventDefault(); alert('ممنونیم — تیم شاهین به‌زودی با شما تماس می‌گیرد.'); }}><p className="eyebrow">از اینجا شروع کنید</p><label>نام شما<input required type="text" placeholder="علی رضایی" /></label><label>ایمیل<input required type="email" placeholder="ali@example.com" /></label><label>برای چه هدفی تمرین می‌کنید؟<select defaultValue=""><option value="" disabled>هدف خود را انتخاب کنید</option><option>افزایش قدرت</option><option>عضله‌سازی</option><option>چربی‌سوزی</option><option>مربی خصوصی</option></select></label><button className="button button-primary" type="submit">رزرو بازدید <Icon name="arrow" size={18} /></button></form></div></section>
    </main>

    <footer className="footer"><div className="section-wrap footer-top"><a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}><span className="brand-mark">ش</span><span>باشگاه<small>شاهین</small></span></a><p>قدرت. انضباط.<br />تحول.</p><div className="socials"><a href="https://instagram.com" aria-label="اینستاگرام"><Icon name="instagram" /></a><a href="https://facebook.com" aria-label="فیسبوک"><Icon name="facebook" /></a></div></div><div className="section-wrap footer-bottom"><span>© ۱۴۰۳ باشگاه بدنسازی شاهین. تمام حقوق محفوظ است.</span><span>برای بی‌رقم‌ها.</span></div></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
