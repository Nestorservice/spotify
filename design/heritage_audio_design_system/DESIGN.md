---
name: Heritage Audio Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9cbb9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849584'
  outline-variant: '#3b4b3d'
  surface-tint: '#00e476'
  primary: '#f0ffee'
  on-primary: '#003919'
  primary-container: '#00ff85'
  on-primary-container: '#007137'
  inverse-primary: '#006d35'
  secondary: '#ffb4a4'
  on-secondary: '#640d00'
  secondary-container: '#a71c00'
  on-secondary-container: '#ffb9aa'
  tertiary: '#fffaf7'
  on-tertiary: '#3f2e00'
  tertiary-container: '#ffda89'
  on-tertiary-container: '#7c5d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#61ff97'
  primary-fixed-dim: '#00e476'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#8d1600'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f7be1d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 24px
  margin-desktop: 48px
---

## Brand & Style
The brand personality is rooted in "Ethno-Minimalism"—a fusion of high-end technology and deep African cultural heritage. The UI is designed to feel like a premium, dark-gallery experience where the music is the artifact. The target audience consists of discerning listeners and cultural connoisseurs who value artistic depth over commercial noise.

The design style leverages **Minimalism** with a **Tactile** twist. We use absolute black surfaces to create an infinite canvas, allowing vibrant album art and the rhythmic, geometric tribal motifs to provide a sense of place. The emotional response is one of reverence, sophistication, and rhythmic energy. There are no distracting monetization prompts; the focus remains entirely on the sonic journey through genres like Amapiano and Afrobeats.

## Colors
The palette is built on a "Deep Dark" foundation to prioritize battery efficiency on OLED screens and visual focus on content.

*   **Primary (Emerald Green):** Used for active states, play buttons, and primary progress indicators. It represents vitality and growth.
*   **Secondary (Ochre Red):** Reserved for secondary actions, "Liked" states, and accenting cultural motifs. It represents the earth and tradition.
*   **Tertiary (Saffron Yellow):** Used for highlights, curated badges, and premium status elements. It represents the sun and energy.
*   **Neutrals:** Absolute Black (#000000) serves as the primary canvas, while Dark Charcoal (#121212) defines surface layers and containers.

## Typography
This design system utilizes **Plus Jakarta Sans** for its contemporary, clean proportions and subtle geometric character that complements the tribal motifs. 

The hierarchy is strict. Large display titles are used for artist names and playlist headers. Labels use increased letter-spacing and uppercase styling to denote metadata (e.g., GENRE, DURATION) without competing with primary content. All body text maintains a high contrast ratio against the black background for maximum legibility.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px rhythmic unit. 

*   **Mobile:** 4-column grid with 24px side margins. Horizontal scrolling carousels are used for album lists to maintain a clean vertical scan.
*   **Desktop:** 12-column grid with 48px side margins and a fixed left-hand navigation rail.
*   **Spacing Philosophy:** Generous whitespace (the "lg" and "xl" units) is used between sections to evoke a gallery-like feeling. Content groups should be clearly separated by at least 40px to prevent visual clutter.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** rather than heavy shadows. 

1.  **Level 0 (Background):** Absolute Black (#000000).
2.  **Level 1 (Cards/Containers):** Dark Charcoal (#121212) with a 1px subtle stroke (#FFFFFF at 5% opacity). This is where the geometric tribal motifs are applied at 5-10% opacity as a background texture.
3.  **Level 2 (Floating Elements/Modals):** Dark Charcoal (#1C1C1C) with a very soft, diffused ambient shadow (Color: #000000, Blur: 20px, Spread: 0).

Glassmorphism is used sparingly for the bottom "Now Playing" bar, featuring a heavy backdrop blur (20px) to show hints of the tribal patterns moving beneath it as the user scrolls.

## Shapes
The shape language is "Rounded" to provide a soft, modern contrast to the sharp geometric patterns in the background.

*   **Album Art:** 1rem (rounded-lg) for a modern feel.
*   **Buttons:** 0.5rem (base) or fully pill-shaped for play controls.
*   **Input Fields:** 0.5rem.
*   **Motifs:** The tribal patterns themselves remain sharp and geometric to preserve their cultural authenticity, creating a tension between the "organic" rounded UI and the "structured" background art.

## Components

*   **Buttons:** Primary play buttons are pill-shaped with an Emerald Green fill and black icons. Secondary buttons use a "Ghost" style: 1.5px Emerald or Saffron stroke with no fill.
*   **Iconography:** All icons are custom-designed 1.5px vector lines. They are minimalist and never filled, ensuring they feel light and integrated into the typography.
*   **Cards:** Music cards use the #121212 surface. The tribal motif is anchored to the bottom-right corner of the card at 7% opacity.
*   **Chips/Tags:** Used for genres (e.g., "Amapiano"). These are small, uppercase labels with a 1px border and 0.5rem corner radius.
*   **Input Fields:** Bottom-border only or very subtle #121212 fill. Focus state is indicated by a 1.5px Emerald Green bottom border.
*   **Progress Bars:** The track seeker is a thin 2px line. The "played" portion is Emerald Green, while the "remaining" portion is #121212 with a subtle 1px white stroke.
*   **Playback Controls:** The "Play" button is the largest element, often floating or centered, using a Saffron Yellow accent for high-energy interaction points.