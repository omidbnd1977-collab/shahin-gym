import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const TrainerDashboard = lazy(() => import('./TrainerDashboard'));
const MemberPortal = lazy(() => import('./MemberPortal'));

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

const NAV_LINKS = [
  ['درباره ما', 'about'],
  ['برنامه‌ها', 'programs'],
  ['مربیان', 'coaches'],
  ['عضویت', 'membership'],
  ['تماس با ما', 'contact'],
] as const;

const programs = [
  { number: '۰۱', title: 'بدنسازی', detail: 'با برنامه‌ریزی دقیق، اضافه‌بار اصولی و همراهی مربیان حرفه‌ای، بدنی قدرتمند بسازید.', tag: 'عضله‌سازی' },
  { number: '۰۲', title: 'تمرین قدرتی', detail: 'قدرتی واقعی و کاربردی با حرکات ترکیبی، تمرینات ورزشی و ریکاوری هوشمند بسازید.', tag: 'عملکرد' },
  { number: '۰۳', title: 'مربی خصوصی', detail: 'تمرینی اختصاصی متناسب با بدن، هدف و استانداردی که برای خودتان تعیین کرده‌اید.', tag: 'مربی‌گری یک‌به‌یک' },
  { number: '۰۴', title: 'چربی‌سوزی', detail: 'سیستمی پایدار که استمرار را به نقطه قوت و اعتمادبه‌نفس را به عادت شما تبدیل می‌کند.', tag: 'آمادگی جسمانی' },
];

const coaches = [
  { initials: 'AR', name: 'آرش رحیمی', role: 'سرمربی · ۱۲ سال تجربه', focus: 'قدرت و آمادگی جسمانی', image: 'https://images.pexels.com/photos/17210046/pexels-photo-17210046.jpeg?cs=srgb&dl=pexels-dogu-tuncer-339534179-17210046.jpg&fm=jpg' },
  { initials: 'SN', name: 'سارا نوری', role: 'مربی عملکرد · ۸ سال تجربه', focus: 'تمرین بانوان و چربی‌سوزی', image: 'https://images.pexels.com/photos/35649991/pexels-photo-35649991.jpeg?cs=srgb&dl=pexels-achi-murusidze-2064615248-35649991.jpg&fm=jpg' },
  { initials: 'KM', name: 'کیان مهر', role: 'مربی بدنسازی · ۱۰ سال تجربه', focus: 'عضله‌سازی و آمادگی مسابقات', image: 'https://images.pexels.com/photos/29773579/pexels-photo-29773579.jpeg?cs=srgb&dl=pexels-foadshariyati-29773579.jpg&fm=jpg' },
];

const plans = [
  { name: 'پایه', price: '۳۹', note: 'برای شروع قدرتمند', features: ['دسترسی کامل به باشگاه', 'دسترسی به رختکن', 'سالن تمرین آزاد'], featured: false },
  { name: 'حرفه‌ای', price: '۷۹', note: 'برای کسانی که بیشتر می‌خواهند', features: ['همه امکانات پلن پایه', 'سونا و بخش ریکاوری', 'جلسه بررسی ماهانه با مربی', 'یک جلسه مهمان در ماه'], featured: true },
  { name: 'نامحدود', price: '۱۲۹', note: 'برای تحول کامل', features: ['همه امکانات پلن حرفه‌ای', '۴ جلسه مربی خصوصی', 'استراتژی تغذیه', 'رزرو اولویت‌دار کلاس‌ها'], featured: false },
];

const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/2c2c7a27-589b-44ab-8e34-f417b4d747a5-853912ad-4f35-47a8-84e4-0d0553d1bf9e.mp4`;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const flightHintRef = useRef<HTMLDivElement>(null);
  const perchedRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [trainerDashboardOpen, setTrainerDashboardOpen] = useState(false);
  const [memberPortalOpen, setMemberPortalOpen] = useState(false);
  const [accessChoiceOpen, setAccessChoiceOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;

    // Let the page paint first; then prioritize the full hero video for scroll scrubbing.
    let idleId = 0;
    let timeoutId = 0;
    const prioritizeVideo = () => {
      video.preload = 'auto';
    };
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(prioritizeVideo, { timeout: 1600 });
    } else {
      timeoutId = window.setTimeout(prioritizeVideo, 1000);
    }
    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      video.pause();
      return;
    }

    let raf = 0;
    let seekInFlight = false;
    let desiredTime = 0;
    let hintVisible = true;
    let cachedTravel = 1;
    let cachedStartY = 0;

    const measure = () => {
      cachedStartY = hero.getBoundingClientRect().top + window.scrollY;
      cachedTravel = Math.max(1, hero.offsetHeight - window.innerHeight);
    };

    video.pause();
    measure();

    const applyLatestSeek = () => {
      if (seekInFlight || !Number.isFinite(video.duration) || video.duration <= 0 || video.readyState < 2) return;
      const frameDuration = 1 / 24;
      const target = Math.min(desiredTime, Math.max(0, video.duration - 0.001));
      if (Math.abs(video.currentTime - target) < frameDuration * 0.65) return;
      seekInFlight = true;
      video.currentTime = target;
    };

    const sync = () => {
      raf = 0;
      const progress = Math.min(1, Math.max(0, (window.scrollY - cachedStartY) / cachedTravel));
      if (Number.isFinite(video.duration) && video.duration > 0) {
        desiredTime = progress * video.duration;
        applyLatestSeek();
      }
      const nextHint = progress < 0.04;
      if (nextHint !== hintVisible) {
        hintVisible = nextHint;
        flightHintRef.current?.classList.toggle('is-hidden', !nextHint);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    const onSeeked = () => {
      seekInFlight = false;
      if (Math.abs(video.currentTime - desiredTime) > 0.65 / 24) schedule();
    };

    const onResize = () => {
      measure();
      schedule();
    };

    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('loadeddata', schedule);
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    schedule();

    return () => {
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('loadeddata', schedule);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      video.pause();
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        nav.classList.toggle('nav-scrolled', window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const perched = perchedRef.current;
    if (!perched) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reduced.matches || !finePointer.matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const paint = () => {
      raf = 0;
      perched.style.transform = `translate3d(${targetX * 10}px, ${targetY * 6}px, 0)`;
    };

    const onMove = (event: MouseEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      'main > section:not(.eagle-stage), .gymx-marquee'
    ));
    sections.forEach((section) => section.classList.add('scroll-reveal'));
    const items = Array.from(document.querySelectorAll<HTMLElement>(
      '.program-card, .coach-card, .facility-tile, .plan-card, .stats > div, .contact-grid > *'
    ));
    items.forEach((item, index) => {
      item.classList.add('scroll-reveal-item');
      item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    [...sections, ...items].forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mobileNavRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      menuToggleRef.current?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accessChoiceOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccessChoiceOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [accessChoiceOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (trainerDashboardOpen) {
    return (
      <Suspense fallback={<div className="panel-fallback" role="status">در حال بارگذاری پنل مربی…</div>}>
        <TrainerDashboard onExit={() => setTrainerDashboardOpen(false)} />
      </Suspense>
    );
  }
  if (memberPortalOpen) {
    return (
      <Suspense fallback={<div className="panel-fallback" role="status">در حال بارگذاری پنل اعضا…</div>}>
        <MemberPortal onExit={() => setMemberPortalOpen(false)} />
      </Suspense>
    );
  }

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">رفتن به محتوا</a>
    <header ref={navRef} className={`nav ${menuOpen ? 'nav-open' : ''}`}>
      <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
        <span className="brand-mark">ش</span>
        <span className="brand-text">باشگاه<small>شاهین</small></span>
      </a>
      <nav className="desktop-links" aria-label="ناوبری اصلی">
        {NAV_LINKS.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <button type="button" className="nav-member-link" onClick={() => { setMenuOpen(false); setTrainerDashboardOpen(true); }}>پنل مربی</button>
        <button type="button" className="nav-member-link" onClick={() => { setMenuOpen(false); setMemberPortalOpen(true); }}>پنل اعضا</button>
        <button type="button" className="nav-cta" onClick={() => { setMenuOpen(false); setAccessChoiceOpen(true); }}>ورود به پنل <Icon name="arrow" size={16} /></button>
      </div>
      <button
        ref={menuToggleRef}
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>
      {menuOpen && (
        <nav ref={mobileNavRef} id="mobile-nav" className="mobile-links" aria-label="منوی موبایل">
          {NAV_LINKS.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
          ))}
          <button type="button" className="nav-member-link" onClick={() => { setMenuOpen(false); setTrainerDashboardOpen(true); }}>پنل مربی</button>
          <button type="button" className="nav-member-link" onClick={() => { setMenuOpen(false); setMemberPortalOpen(true); }}>پنل اعضا</button>
          <button type="button" className="mobile-cta" onClick={() => { setMenuOpen(false); setAccessChoiceOpen(true); }}>ورود به پنل <Icon name="arrow" size={16} /></button>
        </nav>
      )}
    </header>

    <main id="top">
      <section className="eagle-stage" ref={heroRef} aria-label="معرفی سینمایی باشگاه شاهین">
        <div className="eagle-sticky">
          <div className="hero-atmosphere" aria-hidden="true">
            <span className="hero-glow hero-glow-a" />
            <span className="hero-glow hero-glow-b" />
            <span className="hero-grid" />
          </div>
          <div className="grain" aria-hidden="true" />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="flight-stage" aria-hidden="true">
            <div className="flight-frame">
              <div className="flight-layer">
                <video
                  ref={videoRef}
                  className="flight-video"
                  src={HERO_VIDEO_SRC}
                  muted
                  playsInline
                  preload="metadata"
                  disableRemotePlayback
                />
              </div>
              <div ref={perchedRef} className="perched-eagle" />
            </div>
          </div>
          <div className="eagle-copy">
            <p className="eyebrow hero-enter hero-enter-1"><span /> تأسیس ۱۳۹۳ · ایران</p>
            <p className="hero-brand hero-enter hero-enter-2">شاهین</p>
            <h1 className="hero-enter hero-enter-3">باشگاه <em>بدنسازی</em><span>.</span></h1>
            <p className="hero-sub hero-enter hero-enter-4">قدرت. انضباط. تحول.</p>
            <div className="hero-actions hero-enter hero-enter-5">
              <button type="button" className="button button-primary" onClick={() => scrollTo('contact')}>عضویت در باشگاه <Icon name="arrow" size={18} /></button>
              <button type="button" className="button button-ghost" onClick={() => scrollTo('programs')}><span className="play-icon"><Icon name="play" size={12} /></span> برنامه‌های ما</button>
            </div>
          </div>
          <div className="hero-meta hero-enter hero-enter-6">
            <span>برای ورود اسکرول کنید</span>
            <span className="scroll-line"><i /></span>
            <span>۰۱ / ۰۶</span>
          </div>
          <div ref={flightHintRef} className="flight-note hero-enter hero-enter-6"><span className="pulse-dot" /> شاهین را بیدار کنید</div>
          <div className="hero-corner hero-corner-left">شاهین / ۰۰۱</div>
          <div className="hero-corner hero-corner-right">بدون بهانه</div>
        </div>
      </section>

      <section className="reference-header" id="main-content" aria-label="هدر تصویری باشگاه شاهین">
        <div className="reference-frame">
          <img
            src={`${import.meta.env.BASE_URL}gymx-header-final.png?user=20261101`}
            alt="تمرین قدرتی بانوان و آقایان در باشگاه شاهین"
            width={752}
            height={600}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </div>
      </section>

      <div className="gymx-marquee" aria-label="رشته‌های تمرینی باشگاه">
        <div className="gymx-marquee-track" aria-hidden="true">
          <span>بدنسازی</span><b>✳</b><span>تمرین قدرتی</span><b>✳</b><span>کراس‌فیت</span><b>✳</b><span>مربی خصوصی</span><b>✳</b><span>فیتنس</span><b>✳</b>
          <span>بدنسازی</span><b>✳</b><span>تمرین قدرتی</span><b>✳</b><span>کراس‌فیت</span><b>✳</b><span>مربی خصوصی</span><b>✳</b><span>فیتنس</span><b>✳</b>
        </div>
      </div>

      <section className="manifesto" id="about">
        <div className="section-wrap two-col">
          <div className="manifesto-title">
            <p className="eyebrow dark">استاندارد شاهین</p>
            <h2>برای<br /><em>بی‌رقم‌ها.</em></h2>
          </div>
          <div className="manifesto-copy">
            <p className="lead">اینجا فقط یک باشگاه نیست؛ میدان اثبات آدم‌هایی است که نمی‌خواهند مثل قبل بمانند.</p>
            <p>باشگاه بدنسازی شاهین، تمرین حرفه‌ای، جامعه‌ای قدرتمند و استانداردی بی‌رقیب را زیر یک سقف جمع کرده است. هر تکرار هدفی دارد و هر جلسه شما را یک قدم جلوتر می‌برد.</p>
            <a className="text-link" href="#programs" onClick={(e) => { e.preventDefault(); scrollTo('programs'); }}>فلسفه ما <Icon name="arrow" size={16} /></a>
          </div>
        </div>
        <div className="stats section-wrap">
          <div><strong>۱۲</strong><span>سال<br />تجربه</span></div>
          <div><strong>۴.۹</strong><span>امتیاز<br />اعضا</span></div>
          <div><strong>۲.۴k</strong><span>زندگی<br />متفاوت</span></div>
          <div><strong>۲۴/۷</strong><span>دسترسی<br />اعضا</span></div>
        </div>
      </section>

      <section className="programs section-wrap" id="programs">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">خدمات ما</p>
            <h2>با <em>هدف</em> تمرین کنید.</h2>
          </div>
          <p>برنامه‌هایی طراحی‌شده برای رسیدن به نقطه‌ای که هستید و عبور از چیزی که فکر می‌کردید ممکن است.</p>
        </div>
        <div className="program-grid">
          {programs.map((p) => (
            <article className="program-card" key={p.number}>
              <div className="program-number">{p.number}</div>
              <div>
                <p className="card-tag">{p.tag}</p>
                <h3>{p.title}</h3>
                <p>{p.detail}</p>
                <a className="round-arrow" href="#contact" aria-label={`درخواست ${p.title}`} onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}><Icon name="arrow" size={18} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="coaches dark-section" id="coaches">
        <div className="section-wrap">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">تیم مربیان</p>
              <h2>برتری خود را <em>بسازید.</em></h2>
            </div>
            <p>مربیانی که مسیر را رفته‌اند و می‌دانند چطور بهترین نسخه شما را بیرون بکشند.</p>
          </div>
          <div className="coach-grid">
            {coaches.map((coach, i) => (
              <article className={`coach-card coach-card-${i + 1}`} key={coach.name}>
                <div className={`coach-photo coach-${i + 1}`}>
                  <img src={coach.image} alt={`تصویر نمونه مربی در فضای باشگاه؛ تخصص ${coach.focus}`} width={640} height={800} loading="lazy" decoding="async" />
                  <span>{coach.initials}</span>
                  <i className="coach-photo-index">۰{i + 1}</i>
                </div>
                <div className="coach-info">
                  <h3>{coach.name}</h3>
                  <p>{coach.role}</p>
                  <small>{coach.focus}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="facilities section-wrap" id="facilities">
        <div className="facilities-head">
          <div>
            <p className="eyebrow dark">فضای تمرین شاهین</p>
            <h2>جایی برای<br /><em>قوی‌تر شدن.</em></h2>
          </div>
          <p>از سالن وزنه تا لحظهٔ آخر هر ست؛ فضای واقعی تمرین را از نزدیک ببینید.</p>
        </div>
        <div className="facility-gallery">
          <figure className="facility-tile tile-large">
            <img src={`${import.meta.env.BASE_URL}assets/gym-floor.jpg`} alt="نمای سالن بدنسازی و ردیف دمبل‌ها" width={1200} height={900} loading="lazy" decoding="async" />
            <figcaption className="tile-label">سالن اصلی و وزنه‌های آزاد</figcaption>
          </figure>
          <figure className="facility-tile tile-tall">
            <img src={`${import.meta.env.BASE_URL}assets/free-weights.jpg`} alt="ورزشکار در حال تمرین با دمبل در باشگاه" width={800} height={1000} loading="lazy" decoding="async" />
            <figcaption className="tile-label">تمرین قدرتی با دمبل</figcaption>
          </figure>
          <figure className="facility-tile tile-small">
            <img src={`${import.meta.env.BASE_URL}assets/training-session.jpg`} alt="تمرین اسکوات با هالتر در باشگاه" width={800} height={600} loading="lazy" decoding="async" />
            <figcaption className="tile-label">تمرین با هالتر</figcaption>
          </figure>
        </div>
      </section>

      <section className="membership dark-section" id="membership">
        <div className="section-wrap">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">انتخاب استاندارد شما</p>
              <h2>روی <em>خودتان</em> سرمایه‌گذاری کنید.</h2>
            </div>
            <p>بدون قراردادهای محدودکننده و هزینه‌های پنهان؛ فقط هر آنچه برای تمرین در بالاترین سطح نیاز دارید.</p>
          </div>
          <div className="plan-grid">
            {plans.map((plan) => (
              <article className={`plan-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                {plan.featured && <div className="popular">محبوب‌ترین</div>}
                <p className="card-tag">{plan.name}</p>
                <h3><sup>$</sup>{plan.price}<small>/ ماه</small></h3>
                <p className="plan-note">{plan.note}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><Icon name="check" size={15} />{feature}</li>
                  ))}
                </ul>
                <button type="button" className={`button ${plan.featured ? 'button-primary' : 'button-outline'}`} onClick={() => scrollTo('contact')}>شروع کنید <Icon name="arrow" size={16} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial section-wrap">
        <div className="quote-mark" aria-hidden="true">“</div>
        <blockquote>«اینجا جایی بود که قول دادن به خودم را متوقف کردم و به عمل کردن شروع کردم.»</blockquote>
        <div className="quote-person">
          <span className="avatar">ا‍م</span>
          <span><strong>آرمان م.</strong><small>عضو از سال ۱۴۰۰ · ۲۸ کیلو تغییر</small></span>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section-wrap contact-grid">
          <div>
            <p className="eyebrow">وقتش که رسید</p>
            <h2>اولین قدم<br /><em>را بردارید.</em></h2>
            <p className="contact-lead">قوی‌ترین فصل زندگی شما با یک گفت‌وگو شروع می‌شود. فضا را ببینید، با تیم آشنا شوید و تفاوت را احساس کنید.</p>
            <div className="contact-details">
              <p><span>آدرس</span>خیابان ولیعصر، پلاک ۲۴۱۲<br />تهران، ایران</p>
              <p><span>تماس</span><a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a></p>
              <p><span>ساعات کاری</span>هر روز هفته · ۲۴ ساعته</p>
            </div>
          </div>
          <form className="inquiry-form" onSubmit={(e) => { e.preventDefault(); alert('ممنونیم — تیم شاهین به‌زودی با شما تماس می‌گیرد.'); }}>
            <p className="eyebrow">از اینجا شروع کنید</p>
            <label>نام شما<input required name="name" type="text" autoComplete="name" placeholder="علی رضایی" /></label>
            <label>ایمیل<input required name="email" type="email" autoComplete="email" placeholder="ali@example.com" /></label>
            <label>برای چه هدفی تمرین می‌کنید؟
              <select name="goal" defaultValue="" required>
                <option value="" disabled>هدف خود را انتخاب کنید</option>
                <option>افزایش قدرت</option>
                <option>عضله‌سازی</option>
                <option>چربی‌سوزی</option>
                <option>مربی خصوصی</option>
              </select>
            </label>
            <button className="button button-primary" type="submit">رزرو بازدید <Icon name="arrow" size={18} /></button>
          </form>
        </div>
      </section>
    </main>

    <footer className="footer" id="footer">
      <div className="footer-accent" aria-hidden="true" />
      <div className="section-wrap footer-main">
        <div className="footer-brand">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>
            <span className="brand-mark">ش</span>
            <span className="brand-text">باشگاه<small>شاهین</small></span>
          </a>
          <p>قدرتی که می‌سازید،<br />فراتر از باشگاه با شما می‌ماند.</p>
          <div className="socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام"><Icon name="instagram" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="فیسبوک"><Icon name="facebook" /></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>دسترسی سریع</h3>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>درباره باشگاه</a>
          <a href="#programs" onClick={(e) => { e.preventDefault(); scrollTo('programs'); }}>برنامه‌های تمرینی</a>
          <a href="#coaches" onClick={(e) => { e.preventDefault(); scrollTo('coaches'); }}>مربیان</a>
          <a href="#membership" onClick={(e) => { e.preventDefault(); scrollTo('membership'); }}>تعرفه عضویت</a>
        </div>
        <div className="footer-column footer-contact">
          <h3>به ما سر بزنید</h3>
          <p>تهران، خیابان ولیعصر<br />پلاک ۲۴۱۲</p>
          <a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a>
          <span>هر روز هفته، شبانه‌روزی</span>
          <a className="footer-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>رزرو بازدید <Icon name="arrow" size={15} /></a>
        </div>
      </div>
      <div className="section-wrap footer-bottom">
        <span>© ۱۴۰۵ باشگاه بدنسازی شاهین. تمام حقوق محفوظ است.</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('top'); }}>ساخته‌شده برای قوی‌تر شدن</a>
      </div>
    </footer>

    {accessChoiceOpen && (
      <div
        className="access-choice-backdrop"
        role="presentation"
        onMouseDown={(event) => { if (event.target === event.currentTarget) setAccessChoiceOpen(false); }}
      >
        <section className="access-choice" role="dialog" aria-modal="true" aria-labelledby="access-choice-title">
          <button type="button" className="access-choice-close" aria-label="بستن" onClick={() => setAccessChoiceOpen(false)}><Icon name="close" /></button>
          <p className="eyebrow dark">باشگاه شاهین</p>
          <h2 id="access-choice-title">ورود به پنل</h2>
          <p className="access-choice-description">نوع حساب خود را انتخاب کنید.</p>
          <div className="access-choice-options">
            <button type="button" onClick={() => { setAccessChoiceOpen(false); setTrainerDashboardOpen(true); }}>
              <span className="access-choice-icon"><Icon name="quote" /></span>
              <span><b>ورود مربی</b><small>مدیریت اعضا، تمرین و تغذیه</small></span>
              <Icon name="arrow" size={16} />
            </button>
            <button type="button" onClick={() => { setAccessChoiceOpen(false); setMemberPortalOpen(true); }}>
              <span className="access-choice-icon"><Icon name="check" /></span>
              <span><b>ورود عضو</b><small>مشاهدهٔ برنامهٔ تمرین و تغذیهٔ شخصی</small></span>
              <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="access-choice-note">اعضا برای ورود به شمارهٔ ثبت‌شده و کد دسترسی نیاز دارند.</div>
        </section>
      </div>
    )}
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
