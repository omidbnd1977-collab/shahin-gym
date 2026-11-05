# Design System Master File

# Shahin Gym — Performance Club Editorial

> This file is the visual source of truth for the public-facing Shahin Gym website. Page-specific overrides belong in `design-system/shahin-gym/pages/`. Keep the member portal, trainer dashboard, authentication, API, and training-program logic functionally unchanged when applying this system.

**Product:** Premium fitness club website, Persian-first and RTL
**Stack:** React + TypeScript + Vite; custom CSS
**Direction:** Performance Club Editorial
**Design dials:** Variance 6/10, motion 3/10, density 4/10

## Brand Principles

- Communicate serious training, high standards, and a real club community.
- Let authentic photography and strong Persian typography carry the identity; avoid synthetic gym imagery and decorative effects that compete with the subject.
- Keep the page editorial and asymmetric in composition, but disciplined in alignment, spacing, and information hierarchy.
- Preserve existing Persian copy, names, prices, services, contact information, and claims. Do not invent credentials, amenities, prices, or performance statistics.
- Treat desktop and mobile as equally intentional layouts. Use RTL-aware layout and alignment rather than mirroring icons or embedded Latin content blindly.

## Color Tokens

| Role | Hex | CSS variable | Use |
|---|---|---|---|
| Primary surface | `#101214` | `--color-surface` | Main content surface |
| Deep surface | `#070809` | `--color-ink` | Hero, footer, dark bands |
| Warm foreground | `#F5F3EF` | `--color-text` | Primary text on dark |
| Muted foreground | `#A7A9A8` | `--color-muted` | Supporting text on dark |
| Shahin red | `#DE1702` | `--color-accent` | Primary action, active state, small editorial marks only |
| Light surface | `#F5F3EF` | `--color-paper` | Deliberate light editorial sections |
| Light text | `#17191A` | `--color-text-on-paper` | Text on light surface |
| Light muted | `#64696B` | `--color-muted-on-paper` | Supporting text on light surface |
| Dark divider | `rgba(245,243,239,.14)` | `--color-line` | Hairlines and separators |

Red is a signal, not a background theme. Do not reintroduce lime, generic energy orange, green success accents, purple gradients, or multiple competing accent colors. Verify text contrast for each actual foreground/background pairing; use a lighter red tint for small text if the brand red does not meet contrast requirements.

## Typography

- **Persian UI and body:** Vazirmatn, with a robust Persian sans-serif fallback. Use for all Persian paragraphs, navigation, controls, and form labels.
- **Display numerals and Latin emphasis:** Barlow Condensed, weights 500–800. Restrict it to Latin text, short numeric statistics, and compact athletic identifiers; never use it as the Persian body face.
- **Hierarchy:** Large Persian headlines use a controlled 700–800 weight and comfortable line-height. Body copy uses 400–500 weight, at least 1.7 line-height, and readable measure. Labels must remain legible on mobile and must not rely on wide tracking.
- Keep Persian punctuation, digits, mixed-script prices, and phone numbers directionally stable with local `dir`/`bdi` where needed.

## Layout and Spacing

| Token | Value | Typical use |
|---|---:|---|
| `--space-1` | `4px` | Tight icon/text gap |
| `--space-2` | `8px` | Compact control spacing |
| `--space-3` | `12px` | Labels and small groups |
| `--space-4` | `16px` | Standard component gap |
| `--space-6` | `24px` | Component padding |
| `--space-8` | `32px` | Content grouping |
| `--space-12` | `48px` | Section sub-spacing |
| `--space-16` | `64px` | Compact section spacing |
| `--space-24` | `96px` | Desktop section spacing |

- Use a centered content width around 1200–1240px with fluid side gutters.
- Use asymmetric grids selectively for editorial hierarchy; collapse to a deliberate single-column order at mobile widths.
- Keep repeated cards square or with a restrained radius no greater than 6px. Avoid nested cards and generic pill-shaped controls.
- Give buttons and icon controls stable dimensions and visible hover, focus, active, and disabled states.
- Keep the header/navigation readable over both hero and page content, and ensure mobile navigation does not cover or trap the page unexpectedly.

## Public Page Structure

1. **Hero:** retain the current Shahin eagle video, scroll-scrub behavior, timing, media source, and interaction exactly. Style only surrounding layout and text treatment; keep the primary membership CTA clear.
2. **Brand image and discipline strip:** retain existing real brand imagery and training labels; avoid adding unsupported service claims.
3. **Club introduction and metrics:** preserve current source content; visually distinguish verified facts from promotional copy.
4. **Training programs:** keep the existing program data and behavior; make the service hierarchy scannable without changing program definitions.
5. **Coaches:** use the existing coach images and supplied names/roles/focus. Do not fabricate biographies or credentials.
6. **Facilities gallery:** use existing club/training photos with legible captions; do not imply amenities not represented in source content.
7. **Membership:** preserve current plan data and click behavior. Do not change currencies, price values, features, or eligibility without an explicit content decision.
8. **Testimonial:** preserve the existing testimonial and attribution; do not add unverified social proof.
9. **Contact and inquiry:** retain current address, phone, hours, fields, and submission behavior.
10. **Footer and access choice:** keep all current navigation and the member/trainer access flow intact.

## Components and Interaction

- **Primary button:** Shahin red fill, warm white label, compact directional icon; use a restrained darkened red hover. Secondary actions are transparent with a clear border or text treatment.
- **Program/plan items:** use typographic hierarchy, thin dividers, and clear action placement rather than identical floating cards. Preserve all data and event handlers.
- **Photography:** prioritize the current real photos. Use consistent crops and aspect ratios; apply overlays only where text needs contrast. Keep image meaning available through useful alt text.
- **Forms:** preserve current validation and submission behavior. Keep labels visible, focus rings clear, and controls usable by keyboard and touch.
- **Dialogs and navigation:** preserve all existing routes/state transitions. Keep focus visible and avoid introducing decorative interaction that changes behavior.
- Use the project's existing inline SVG icon pattern; do not add emoji icons or a new icon dependency as part of visual styling.

## Motion and Accessibility

- Motion dial: 3/10. Use brief 160–240ms transitions for user-triggered color, border, and opacity changes. Avoid continuous decorative motion, parallax, scroll snapping, or large hover transforms.
- Preserve the current Hero scroll/video behavior exactly; do not alter its height, scroll mapping, preload, media source, event handlers, or reduced-motion behavior while restyling other sections.
- Honor `prefers-reduced-motion: reduce`: remove nonessential reveals, marquee movement, and transitions while leaving all content visible and functionality available.
- Content must remain visible if JavaScript animation or `IntersectionObserver` is unavailable; never require a reveal animation to read the page.
- Support keyboard navigation, visible `:focus-visible`, semantic headings/landmarks, accessible names, and contrast of at least 4.5:1 for normal text.
- Verify text reflow, touch targets, focus visibility, and no horizontal overflow at 375px, 768px, 1024px, and 1440px.

## Avoid

- Generic neon gym aesthetics, multiple saturated accents, heavy glow, arbitrary gradients, abstract CSS art replacing real club photography, and decorative animation on every section.
- Repeating all-caps English labels or tiny tracked-out labels around Persian content.
- Unverified claims, invented testimonials, changed pricing, or fake coach credentials.
- Rewriting the Hero video behavior, member/trainer portals, login flow, APIs, program logic, or existing form behavior during a visual-only pass.

## Delivery Checklist

- [ ] Public landing page retains all original sections, copy, links, and interactions.
- [ ] Hero video and scroll-scrub implementation are unchanged.
- [ ] Trainer/member portals, access choice, API, and program logic are unchanged.
- [ ] No factual content, coach details, price, or service has been invented or silently edited.
- [ ] Persian RTL layout and mixed-script content are checked at desktop and mobile sizes.
- [ ] Images are existing assets, correctly cropped, and have meaningful alt text.
- [ ] Reduced-motion, keyboard focus, contrast, and content-without-animation are verified.
- [ ] Production build succeeds and browser review includes the public page and both portal entry flows.
- [ ] No commit, push, or deployment is performed without explicit approval.
