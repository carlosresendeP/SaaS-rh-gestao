---
name: The Design System
colors:
  surface: '#f8faf3'
  surface-dim: '#d9dbd4'
  surface-bright: '#f8faf3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4ed'
  surface-container: '#edefe8'
  surface-container-high: '#e7e9e2'
  surface-container-highest: '#e1e3dc'
  on-surface: '#191c18'
  on-surface-variant: '#434936'
  inverse-surface: '#2e312d'
  inverse-on-surface: '#eff2eb'
  outline: '#737a64'
  outline-variant: '#c3c9b0'
  surface-tint: '#486800'
  primary: '#486800'
  on-primary: '#ffffff'
  primary-container: '#c4ff57'
  on-primary-container: '#527500'
  inverse-primary: '#a0d832'
  secondary: '#4e653e'
  on-secondary: '#ffffff'
  secondary-container: '#d0ebb9'
  on-secondary-container: '#546b43'
  tertiary: '#745a37'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffe9d2'
  on-tertiary-container: '#816642'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bbf54e'
  primary-fixed-dim: '#a0d832'
  on-primary-fixed: '#131f00'
  on-primary-fixed-variant: '#354e00'
  secondary-fixed: '#d0ebb9'
  secondary-fixed-dim: '#b5cf9f'
  on-secondary-fixed: '#0d2003'
  on-secondary-fixed-variant: '#374d28'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#e4c197'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#5a4222'
  background: '#f8faf3'
  on-background: '#191c18'
  surface-variant: '#e1e3dc'
typography:
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 40px
  gutter: 20px
---

## Brand & Style

This design system establishes a "Nature-Tech" aesthetic tailored for the Brazilian recruitment market. It balances the high-energy, forward-thinking vibrancy of the tech sector with the grounded warmth and interpersonal trust essential to human resources. 

The style is **Corporate Modern** with **Organic Tactile** influences. It avoids the sterile coldness of traditional enterprise software by utilizing an off-white and kraft-tinted foundation, while maintaining professional authority through deep forest greens and sharp, neon accents. The visual narrative emphasizes growth, clarity, and the professional journey (jornada profissional).

## Colors

The palette is designed for high legibility and clear categorization of the recruitment funnel.

- **Core Palette:** The "Brand Dark" (Forest Green) provides the primary structural container, specifically for navigation elements. The "Primary Action" (Neon Green) is reserved strictly for high-priority calls to action and active states.
- **Surface & Background:** Surfaces use pure white to pop against the "Off White" background, creating a soft but discernible layered effect.
- **Status Indicators:** These colors are used for candidate tracking. Labels must always be in Portuguese. For example, "TESTE PSICOMÉTRICO" uses the primary neon green to signal a high-engagement phase, while "APROVADO" utilizes the brand's darkest green for a sense of finality and success.
- **Typography Colors:** Use "Dark Text" for all primary readings. "Muted Text" is reserved for metadata and secondary descriptions.

## Typography

The design system relies on **Inter** to provide a systematic, utilitarian feel that ensures readability across high-density candidate data.

- **Headlines:** Must be bold (Weight 700) to create a strong visual anchor. Use slight negative letter spacing on larger headings to maintain a modern, "tight" editorial look.
- **Body Text:** Use regular weight (400) for all descriptive content and candidate bios.
- **Localization:** Ensure line heights account for Portuguese diacritics (acentos), preventing any vertical clipping in tight UI elements like table rows or tags.

## Layout & Spacing

The layout utilizes a **fixed-fluid hybrid grid**. 

- **Sidebar:** A fixed-width sidebar (280px) in "Brand Dark" houses the primary navigation. It uses 16px internal padding for menu items.
- **Main Content:** A fluid 12-column grid for the dashboard area with a maximum container width of 1440px. 
- **Spacing Rhythm:** Based on a 4px scale. Components like cards should use "lg" (24px) padding to create a spacious, professional feel that prevents the "cluttered" look often found in HR tools.

## Elevation & Depth

Hierarchy is achieved through a combination of tonal layering and subtle shadows:

- **Level 0 (Background):** Off-White (#F5F7F0).
- **Level 1 (Cards/Surfaces):** White (#FFFFFF) with a 1px solid Kraft (#D6B48B) border. This "framed" look provides a tactile, organized appearance.
- **Shadows:** Use a single, very soft shadow for cards: `0px 4px 12px rgba(74, 84, 82, 0.08)`. The shadow color is derived from "Dark Text" to keep the elevation feeling natural rather than synthetic.
- **Sidebar:** No shadow; it relies on its deep color contrast (#597048) to define its position in the stack.

## Shapes

The shape language is intentional, using varying degrees of roundness to signify the "strength" and "permanence" of UI elements:

- **Cards (12px):** The most rounded elements, used for candidate profiles and job postings to feel welcoming and distinct.
- **Buttons (8px):** Medium roundness for actionable items.
- **Inputs (6px):** Sharper corners for data entry fields to suggest precision and formal documentation.

## Components

- **Buttons:** Primary buttons use the Neon Green background with Dark Text for maximum contrast. Secondary buttons use the Kraft border with Dark Text.
- **Sidebar:** Background is Forest Green. Hover states and the active indicator (a 4px vertical bar on the left) use the Neon Green. Icons should be white at 80% opacity, turning 100% on active.
- **Cards:** Must feature the 1px Kraft border. Header sections within cards should use the "label-caps" style for section titles (e.g., "EXPERIÊNCIA", "RESUMO").
- **Status Badges:** Rounded "pill" style (full radius). Text should be Dark Text except on the "APROVADO" status, which uses white text for legibility against the Forest Green.
- **Input Fields:** Off-white background (#F5F7F0) when inactive, switching to a white background with a 2px Neon Green border on focus.
- **Candidate Lists:** Use subtle 1px Kraft horizontal dividers between list items rather than full boxes to maintain vertical flow.