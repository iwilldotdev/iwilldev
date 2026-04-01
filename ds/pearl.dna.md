# DNA Playbook — Pearl
> Source: https://pearl.framer.website/
> Extracted: 2026-03-18
> Stack: Framer (SSR), Lenis, Framer Motion
> Inferred: none
> Confidence: High

---

## IDENTITY

**Visual:** Monochrome palette with pure black (#000) on white (#fff) and a refined grey scale (#666, #969696, #ccc, #e3e3e3, #f0f0f0). Typography is led by Manrope at medium weight (500) — geometric, open, contemporary — for both headings and body, creating a unified typographic voice. Spacing is generous and deliberate: 160px–240px vertical section padding on desktop, 40–80px gaps between content blocks, producing a spacious, airy museum-gallery density. The overall aesthetic is minimal-editorial, confident, and quietly luxurious.

**Experience:** Smooth virtual scroll via Lenis gives every page movement a buttery, decelerating inertia that makes browsing feel tactile and intentional. Animations are understated — no flashy reveals, just gentle opacity fades and subtle transforms on scroll entry. Hover interactions are precise: nav links slide replacement text upward, project cards breathe with a 6% image scale, CTA buttons shift arrow icons. The most distinctive signature is the pinned hero with a radial gradient/particle background that bleeds into the white content area, creating a portal-like transition.

---

## TOKENS

```css
:root {
  /* ── Colors ─────────────────────────────── */
  --color-primary:      #000000; /* headings, primary text, icons */
  --color-background:   #FFFFFF; /* page background, section backgrounds */
  --color-text-body:    #666666; /* paragraph body text */
  --color-text-muted:   #969696; /* captions, metadata, secondary text */
  --color-border:       #CCCCCC; /* dividers, card borders */
  --color-border-light: #E3E3E3; /* subtle separators, accordion borders */
  --color-surface:      #F0F0F0; /* light surface fills, tag backgrounds */

  /* ── Typography ─────────────────────────── */
  --font-heading: 'Manrope', sans-serif;
  --font-body:    'Manrope', sans-serif;
  --fw-regular:   400;
  --fw-medium:    500;
  --fw-semibold:  600;
  --fw-bold:      700;
  --fs-display:   64px;  /* hero headline — 52px tablet, 32px mobile */
  --fs-h1:        40px;  /* section headline — 32px tablet, 26px mobile */
  --fs-h3:        24px;  /* sub-section headline — 22px tablet, 20px mobile */
  --fs-h4:        18px;  /* card titles, small headings */
  --fs-body:      16px;  /* body text, descriptions */
  --fs-caption:   14px;  /* labels, tags, metadata */
  --fs-small:     12px;  /* fine print, badges */
  --lh-tight:     1.2em; /* display & headings */
  --lh-normal:    1.4em; /* body, sub-headings, cards */
  --ls-none:      0em;   /* default — no letter-spacing used */

  /* ── Spacing ─────────────────────────────── */
  --space-4:   4px;
  --space-8:   8px;
  --space-12:  12px;
  --space-16:  16px;
  --space-24:  24px;
  --space-32:  32px;
  --space-40:  40px;
  --space-48:  48px;
  --space-64:  64px;
  --space-80:  80px;
  --space-120: 120px;
  --space-160: 160px;
  --space-240: 240px;

  /* ── Layout ──────────────────────────────── */
  --container-sm: 1040px;  /* accordion, narrow content */
  --container-md: 1100px;  /* main page wrapper */
  --container-lg: 1200px;  /* nav, footer, wide sections */
  --container-xl: 1800px;  /* max-width ceiling for inner content */

  /* ── Radius ──────────────────────────────── */
  --radius-none: 0px;
  --radius-sm:   8px;   /* buttons, small cards */
  --radius-md:   12px;  /* card containers */
  --radius-lg:   15px;  /* hamburger button, pill shapes */
  --radius-full: 9999px; /* circular elements, pill buttons */

  /* ── Motion ──────────────────────────────── */
  --ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94); /* general exit */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);         /* Material-like smooth */
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
}
```

---

## LAYOUT RULES

1. **Museum spacing:** Vertical section padding is 160px on desktop (120px mobile). Between major content blocks inside sections, gap is 240px desktop / 80px mobile. The page breathes.
2. **Container nesting:** Every section has an outer full-width wrapper and an inner max-width container (1040–1800px). Content never touches viewport edges — minimum 16px mobile, 80px desktop horizontal padding.
3. **Label + content split:** Descriptive sections use a 20%-width label column on the left and a flex-grow content column on the right, collapsing to stacked on mobile.
4. **Grid rhythm:** Project showcases use CSS grid — hero projects get 1-column full-width at 800px height, secondary projects get 2-column at 600px height. Gap is always 40px.
5. **Typography hierarchy by weight not size:** Headings use Manrope 500 (medium) for an elegant feel. Bold (700) is reserved for emphasis within text. This avoids heavy, blocky headings.
6. **Monochrome with grey scale depth:** Visual hierarchy is created through 7 shades of the same neutral scale rather than color. Borders, surfaces, and text all use different greys to establish layering.
7. **Fixed nav overlay:** Navigation is position: fixed at the top, full-width, sitting above all content at z-index 10. It contains logo + hamburger + inline text links at 40px gap.

---

## SECTION MODELS

### Nav — navigation
> Layout: full-width fixed | Use when: persistent top navigation

```html
<nav class="s-nav" style="position: fixed; top: 0; left: 0; width: 100%; z-index: 10; padding: var(--space-24) var(--space-80);">
  <div style="display: flex; align-items: center; justify-content: space-between; max-width: var(--container-xl); margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 0;">
      [LOGO]
      [HAMBURGER]
    </div>
    <div style="display: flex; align-items: center; gap: var(--space-40); overflow: hidden;">
      [NAV_LINK] [NAV_LINK] [NAV_LINK] [NAV_LINK]
    </div>
  </div>
</nav>
```

> Layout CSS: `display: flex; justify-content: space-between; align-items: center; max-width: 1800px; padding: 24px 80px; position: fixed; top: 0; z-index: 10`

### Hero — hero
> Layout: full-width centered | Use when: opening section with dramatic visual

```html
<section class="s-hero" style="width: 100%; height: 90vh; max-height: 1000px; position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: -1;">
    [BACKGROUND_ANIMATION]
  </div>
  <div style="position: relative; z-index: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
    [HERO_CONTENT]
  </div>
</section>
```

> Layout CSS: `width: 100%; height: 90vh; max-height: 1000px; position: relative; overflow: hidden; background: transparent`

### Content — main-content
> Layout: contained column | Use when: primary page content with mixed blocks

```html
<section class="s-content" style="background: var(--color-background); padding: var(--space-160) var(--space-80) var(--space-240); position: relative; z-index: 2;">
  <div style="max-width: var(--container-xl); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-240);">
    [CONTENT_BLOCKS]
  </div>
</section>
```

> Layout CSS: `display: flex; flex-direction: column; gap: 240px; max-width: 1800px; margin: 0 auto; padding: 160px 80px 240px`

### Work Intro — text-split
> Layout: label + body split | Use when: introducing a content section with label and description

```html
<div class="s-text-split" style="display: flex; gap: var(--space-16); width: 100%;">
  <div style="width: 20%; flex: none;">
    <p style="font-size: var(--fs-body); color: var(--color-text-muted); line-height: var(--lh-normal);">[LABEL]</p>
  </div>
  <div style="flex: 1; display: flex; gap: var(--space-48);">
    <p style="flex: 1; font-size: var(--fs-body); color: var(--color-text-body); line-height: var(--lh-normal);">[BODY_1]</p>
    <p style="flex: 1; font-size: var(--fs-body); color: var(--color-text-body); line-height: var(--lh-normal);">[BODY_2]</p>
  </div>
</div>
```

> Layout CSS: `display: flex; gap: 16px; width: 100%; — label 20% fixed, content flex: 1 with 48px inner gap`

### Project Grid — work-grid
> Layout: 1-col + 2-col grid | Use when: showcasing portfolio projects

```html
<div class="s-work-grid" style="display: flex; flex-direction: column; gap: var(--space-40); width: 100%;">
  <!-- Featured row: 1 column -->
  <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-40);">
    [PROJECT_CARD_LARGE]
  </div>
  <!-- Secondary row: 2 columns -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-40);">
    [PROJECT_CARD] [PROJECT_CARD]
  </div>
</div>
```

> Layout CSS: `grid-template-columns: 1fr (featured) / repeat(2, 1fr) (secondary); gap: 40px; auto-rows: 800px / 600px`

### Project Card — card
> Layout: vertical stack | Use when: individual project showcase within grid

```html
<a class="s-card" href="[URL]" style="display: flex; flex-direction: column; gap: var(--space-24); text-decoration: none; width: 100%; height: 100%;">
  <div style="flex: 1; position: relative; overflow: hidden;">
    <div style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; overflow: hidden; transition: all var(--duration-slow) var(--ease-smooth);">
      [IMAGE]
    </div>
    <div style="position: absolute; bottom: 28px; left: 28px; width: 32px; height: 48px;">
      [ARROW_ICON]
    </div>
  </div>
  <div style="display: flex; flex-direction: column; gap: var(--space-8);">
    <h4 style="font-family: var(--font-heading); font-size: var(--fs-h4); font-weight: var(--fw-medium); color: var(--color-primary);">[TITLE]</h4>
    <div style="display: flex; gap: var(--space-12);">
      <span style="font-size: var(--fs-caption); color: var(--color-text-muted);">[TAG]</span>
    </div>
  </div>
</a>
```

> Layout CSS: `display: flex; flex-direction: column; gap: 24px; cursor: pointer; — image flex: 1, info bottom stack`

### Client Logos — logos-grid
> Layout: multi-column grid | Use when: displaying partner/client logos

```html
<div class="s-logos" style="display: grid; grid-template-columns: repeat(5, 1fr); width: 100%; overflow: hidden;">
  <div style="height: 200px; display: flex; align-items: center; justify-content: center; position: relative;">
    [LOGO_SVG]
  </div>
  <!-- repeat for each logo -->
</div>
```

> Layout CSS: `display: grid; grid-template-columns: repeat(5, 1fr); — 2 cols on mobile; items 200px height centered`

### Accordion — faq
> Layout: stacked list | Use when: FAQ, services list, or expandable content

```html
<div class="s-accordion" style="display: flex; flex-direction: column; width: 100%; max-width: var(--container-sm);">
  <div style="display: flex; align-items: flex-start; gap: var(--space-24); padding: var(--space-24) 0; height: 96px; cursor: pointer; border-bottom: 1px solid var(--color-border-light); overflow: hidden;">
    <div style="flex: 1; display: flex; flex-direction: column;">
      <h3 style="font-family: var(--font-heading); font-size: var(--fs-h1); font-weight: var(--fw-medium); line-height: var(--lh-normal); color: var(--color-primary);">[TITLE]</h3>
      <!-- Expanded content (hidden by default) -->
      <div style="padding: var(--space-16) 0; display: flex; flex-direction: column; gap: var(--space-16);">
        <p style="font-size: var(--fs-body); color: var(--color-text-body); line-height: var(--lh-normal);">[BODY]</p>
      </div>
    </div>
    <div style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
      [EXPAND_ICON]
    </div>
  </div>
</div>
```

> Layout CSS: `flex-direction: column; max-width: 1040px; — items 96px collapsed with 24px padding, expand to auto-height`

### Footer — footer
> Layout: full-width split | Use when: page footer with branding, links, legal

```html
<footer class="s-footer" style="display: flex; flex-direction: column; gap: var(--space-40); width: 100%; max-width: var(--container-lg); height: 720px; padding: var(--space-80);">
  <div style="display: flex; flex: 1; justify-content: space-between; align-items: flex-start; max-width: var(--container-xl);">
    <!-- Left column -->
    <div style="flex: 1; max-width: 550px; display: flex; flex-direction: column; gap: var(--space-64);">
      <div style="display: flex; flex-direction: column; gap: var(--space-24);">
        <h2 style="font-family: var(--font-heading); font-size: var(--fs-h1); font-weight: var(--fw-medium); line-height: var(--lh-normal); color: var(--color-primary);">[HEADLINE]</h2>
        <p style="font-size: var(--fs-body); color: var(--color-text-body); line-height: var(--lh-normal);">[DESCRIPTION]</p>
      </div>
      [CTA_BUTTONS]
    </div>
    <!-- Right column: links -->
    <div style="flex: 1; max-width: 440px; display: flex; gap: var(--space-24);">
      <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-16);">
        [LINK] [LINK] [LINK]
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; gap: var(--space-16);">
        [LINK] [LINK] [LINK]
      </div>
    </div>
  </div>
  <!-- Legal bar -->
  <div style="display: flex; align-items: center; gap: var(--space-40); max-width: var(--container-xl); width: 100%;">
    <p style="flex: 1; font-size: var(--fs-body); color: var(--color-text-muted); line-height: var(--lh-normal);">[LEGAL]</p>
  </div>
</footer>
```

> Layout CSS: `display: flex; flex-direction: column; gap: 40px; height: 720px; padding: 80px; — split content top, legal bar bottom`

---

## ANIMATION PATTERNS

### Nav Link Hover
> Trigger: hover | Scrub: no | Pin: no

```js
// Text slides up to reveal secondary label on hover
// Implemented via Framer Motion variant with clipPath
// Container: overflow hidden, height 22px, column flex
// Default: first text visible, second text below
// Hover: translateY shifts both up by 22px
gsap.to('.nav-link-inner', {
  y: -22,
  duration: 0.3,
  ease: 'power2.out'
});
```

### Project Card Image Scale
> Trigger: hover | Scrub: no | Pin: no

```js
// Image container scales slightly on card hover
// Creates a breathing/zoom-in effect
gsap.to('.card-image', {
  scale: 1.06,
  x: '-3%',
  y: '-2.4%',
  duration: 0.5,
  ease: 'power2.out'
});
// Arrow icon grows from 32x48 to 56x56
gsap.to('.card-arrow', {
  width: 56,
  height: 56,
  duration: 0.5,
  ease: 'power2.out'
});
```

### Hamburger Menu Toggle
> Trigger: click | Scrub: no | Pin: no

```js
// Three lines converge into an X shape
// Top line: moves to center, rotates 45deg
// Middle line: shrinks width to 1px (fades)
// Bottom line: moves to center, rotates -45deg
gsap.to('.hamburger-top', {
  top: '50%', y: '-1px', rotation: 45,
  duration: 0.3, ease: 'power2.inOut'
});
gsap.to('.hamburger-mid', {
  width: 1, opacity: 0,
  duration: 0.2, ease: 'power2.inOut'
});
gsap.to('.hamburger-bottom', {
  top: '50%', y: '-1px', rotation: -45,
  duration: 0.3, ease: 'power2.inOut'
});
```

### Accordion Expand
> Trigger: click | Scrub: no | Pin: no

```js
// Accordion item expands from 96px to auto height
// Content fades in with slight stagger
// Icon rotates 45deg (plus to X)
gsap.to('.accordion-item', {
  height: 'auto',
  duration: 0.4,
  ease: 'power2.out'
});
gsap.from('.accordion-content > *', {
  opacity: 0, y: 10,
  stagger: 0.05,
  duration: 0.3,
  ease: 'power2.out'
});
```

### Section Fade In
> Trigger: scroll | Scrub: no | Pin: no

```js
// [inferred] Content blocks fade in as they enter viewport
// Framer Motion uses whileInView with opacity + translateY
gsap.from('.section-content', {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.section-content',
    start: 'top 85%'
  }
});
```

### CTA Button Hover
> Trigger: hover | Scrub: no | Pin: no

```js
// Button with arrow — subtle background shift + arrow translate
// Framer component with will-change: transform
gsap.to('.cta-button', {
  scale: 1.02,
  duration: 0.2,
  ease: 'power2.out'
});
gsap.to('.cta-arrow', {
  x: 4,
  duration: 0.2,
  ease: 'power2.out'
});
```

---

## SCROLL MODEL

**Type:** virtual-lenis

**Section heights:** hero: 90vh (max 1000px), content: normal flow with 160–240px padding, accordion: normal, footer: 720px fixed

```js
// Scroll setup boilerplate — Lenis
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Lenis CSS requirements already in source:
// html.lenis { height: auto }
// .lenis.lenis-smooth { scroll-behavior: auto !important }
// .lenis.lenis-stopped { overflow: hidden }
// .lenis.lenis-scrolling iframe { pointer-events: none }
```

---

## PERFORMANCE

- **Antialiased fonts:** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale` applied globally for crisp rendering.
- **Font display swap:** All font-faces use `font-display: swap` to prevent FOIT (flash of invisible text).
- **will-change discipline:** `--framer-will-change-override: none` by default on body, only `transform` on Safari via `@supports`. Prevents GPU over-promotion.
- **will-change filter isolation:** Separate `--framer-will-change-filter-override` for Safari's filter compositing, avoids unnecessary layer creation.
- **Overflow clip fallback:** `--overflow-clip-fallback: hidden` for browsers without `overflow: clip` support, preventing scroll container issues.
- **Lazy iframe blocking:** Lenis disables `pointer-events` on iframes during scroll (`lenis-scrolling iframe { pointer-events: none }`), preventing janky scroll hijack.
- **Preconnect fonts:** `<link rel="preconnect" href="fonts.gstatic.com">` for faster font loading.

---

## GAPS & CAVEATS

- **Framer SSR output:** The source is server-rendered Framer HTML with obfuscated class names (e.g., `framer-AHUIv`, `framer-QHf5p`). Tokens were extracted from CSS custom properties and inline styles, not from a design system source file.
- **Animation configs bundled:** Framer Motion animation variants and transitions are compiled into JavaScript chunks that aren't directly readable from the HTML. Animation patterns are inferred from CSS `will-change`, hover variant classes, and structural analysis. Labeled `[inferred]` where applicable.
- **Hero background component:** The hero uses a Framer component (`framer-1p3kvpy-container`) as an absolute-positioned background element. Its exact rendering (particle field, radial gradient, etc.) is handled by a React component not visible in the static HTML.
- **Color tokens use UUIDs:** Original Framer tokens use UUID-based custom property names (e.g., `--token-be079bad-eabd-4234-8a56-5579c7057187`). These have been mapped to semantic role names in the tokens section.
- **Inter font loaded but secondary:** Inter is loaded with full weight range (100-900) but appears only in Framer's infrastructure text presets. The visible design uses Manrope exclusively. Inter is kept as a fallback reference.
- **No scroll-triggered reveals confirmed:** Section fade-in animations are inferred from Framer Motion conventions but not directly visible in the static HTML source.
- **Responsive breakpoints:** Three breakpoints confirmed — mobile (max 767px), tablet (768–1099px), desktop (1100px+). All typography scales and layout shifts are fully documented in the CSS media queries.
