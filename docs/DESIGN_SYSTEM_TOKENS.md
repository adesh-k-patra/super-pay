# Design System Tokens Reference

Complete reference guide for all design tokens in the system.

---

## Color Tokens

### Base Colors (CSS Variables)

```css
/* Dark Theme (Default) */
--background: hsl(220 15% 8%);        /* #13151A */
--foreground: hsl(0 0% 95%);          /* #F2F2F2 */
--card: hsl(220 15% 10%);             /* #16181E */
--card-foreground: hsl(0 0% 95%);     /* #F2F2F2 */
--primary: hsl(0 0% 98%);             /* #FAFAFA */
--primary-foreground: hsl(220 15% 8%); /* #13151A */
--secondary: hsl(220 15% 18%);        /* #252831 */
--muted: hsl(220 15% 15%);            /* #1E2127 */
--border: hsl(220 15% 20%);           /* #282B35 */
--destructive: hsl(0 85% 58%);        /* #ED4747 */
```

### Color Palettes

#### Red (Danger, Destructive)
```typescript
red-50:  hsl(0 86% 97%)   // #FEF2F2
red-100: hsl(0 93% 94%)   // #FEE2E2
red-200: hsl(0 96% 89%)   // #FECACA
red-300: hsl(0 94% 82%)   // #FCA5A5
red-400: hsl(0 91% 71%)   // #F87171
red-500: hsl(0 84% 60%)   // #EF4444 ← Primary red
red-600: hsl(0 72% 51%)   // #DC2626
red-700: hsl(0 74% 42%)   // #B91C1C
red-800: hsl(0 70% 35%)   // #991B1B
red-900: hsl(0 65% 25%)   // #7F1D1D
```

#### Green (Success, Approved)
```typescript
green-50:  hsl(142 76% 97%)  // #F0FDF4
green-100: hsl(142 76% 94%)  // #DCFCE7
green-200: hsl(142 76% 87%)  // #BBF7D0
green-300: hsl(142 76% 77%)  // #86EFAC
green-400: hsl(142 76% 65%)  // #4ADE80
green-500: hsl(142 76% 52%)  // #22C55E ← Primary green
green-600: hsl(142 76% 42%)  // #16A34A
green-700: hsl(142 76% 32%)  // #15803D
green-800: hsl(142 76% 22%)  // #166534
```

#### Blue (Info, Primary)
```typescript
blue-50:  hsl(210 100% 97%)  // #EFF6FF
blue-100: hsl(210 100% 94%)  // #DBEAFE
blue-200: hsl(210 100% 87%)  // #BFDBFE
blue-300: hsl(210 100% 77%)  // #93C5FD
blue-400: hsl(210 100% 65%)  // #60A5FA
blue-500: hsl(210 100% 55%)  // #3B82F6 ← Primary blue
blue-600: hsl(210 100% 45%)  // #2563EB
blue-700: hsl(210 100% 35%)  // #1D4ED8
blue-800: hsl(210 100% 25%)  // #1E40AF
```

#### Purple (Premium)
```typescript
purple-50:  hsl(270 100% 98%)  // #FAF5FF
purple-100: hsl(269 100% 95%)  // #F3E8FF
purple-200: hsl(269 100% 92%)  // #E9D5FF
purple-300: hsl(269 97% 85%)   // #D8B4FE
purple-400: hsl(270 95% 75%)   // #C084FC
purple-500: hsl(270 91% 65%)   // #A855F7 ← Primary purple
purple-600: hsl(271 81% 56%)   // #9333EA
purple-700: hsl(272 72% 47%)   // #7E22CE
purple-800: hsl(273 67% 39%)   // #6B21A8
```

#### Yellow (Warning)
```typescript
yellow-50:  hsl(48 100% 96%)  // #FEFCE8
yellow-100: hsl(48 96% 89%)   // #FEF9C3
yellow-200: hsl(48 97% 77%)   // #FEF08A
yellow-300: hsl(45 93% 62%)   // #FDE047
yellow-400: hsl(43 89% 52%)   // #FACC15
yellow-500: hsl(38 92% 50%)   // #EAB308 ← Primary yellow
yellow-600: hsl(32 95% 44%)   // #CA8A04
yellow-700: hsl(26 90% 37%)   // #A16207
yellow-800: hsl(23 83% 31%)   // #854D0E
```

#### Teal (Financial)
```typescript
teal-50:  hsl(166 76% 97%)  // #F0FDFA
teal-100: hsl(167 85% 89%)  // #CCFBF1
teal-200: hsl(168 84% 78%)  // #99F6E4
teal-300: hsl(171 77% 64%)  // #5EEAD4
teal-400: hsl(172 66% 50%)  // #2DD4BF
teal-500: hsl(173 58% 39%)  // #14B8A6 ← Primary teal
teal-600: hsl(175 60% 30%)  // #0D9488
teal-700: hsl(175 84% 23%)  // #0F766E
teal-800: hsl(176 87% 18%)  // #115E59
```

#### Gray (Neutral)
```typescript
gray-50:  hsl(210 20% 98%)  // #F9FAFB
gray-100: hsl(220 14% 96%)  // #F3F4F6
gray-200: hsl(220 13% 91%)  // #E5E7EB
gray-300: hsl(216 12% 84%)  // #D1D5DB
gray-400: hsl(218 11% 65%)  // #9CA3AF
gray-500: hsl(220 9% 46%)   // #6B7280 ← Mid gray
gray-600: hsl(215 14% 34%)  // #4B5563
gray-700: hsl(217 19% 27%)  // #374151
gray-800: hsl(215 28% 17%)  // #1F2937
gray-900: hsl(221 39% 11%)  // #111827
```

### Semantic Color Usage

```typescript
// Status Colors
status: {
  active:     green-500,
  pending:    yellow-500,
  completed:  purple-500,
  rejected:   red-600,
  approved:   green-600,
  processing: blue-500,
}

// UI States
states: {
  success:    green-500,
  warning:    yellow-500,
  danger:     red-500,
  info:       blue-500,
}

// Financial Context
financial: {
  profit:     green-500,
  loss:       red-500,
  neutral:    gray-500,
  premium:    purple-500,
}
```

---

## Typography Tokens

### Font Families

```typescript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  serif: ['Georgia', 'serif'],
  mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
}
```

### Font Sizes

```typescript
fontSize: {
  xs:    '0.75rem',   // 12px - Caption, Helper Text
  sm:    '0.875rem',  // 14px - Small Body, Labels
  base:  '1rem',      // 16px - Body Text
  lg:    '1.125rem',  // 18px - Large Body
  xl:    '1.25rem',   // 20px - Subheading
  '2xl': '1.5rem',    // 24px - H3, Card Titles
  '3xl': '1.875rem',  // 30px - H2
  '4xl': '2.25rem',   // 36px - H1
  '5xl': '3rem',      // 48px - Hero Heading
  '6xl': '3.75rem',   // 60px - Display Text
}
```

### Font Weights

```typescript
fontWeight: {
  light:     300,
  normal:    400,
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
}
```

### Line Heights

```typescript
lineHeight: {
  tight:   1.25,    // Headings
  normal:  1.5,     // Body text
  relaxed: 1.625,   // Comfortable reading
  loose:   2,       // Very spacious
}
```

### Letter Spacing

```typescript
letterSpacing: {
  tight:   '-0.025em',  // Tight headings
  normal:  '0em',       // Default
  wide:    '0.025em',   // Slightly spaced
  wider:   '0.05em',    // Labels
  widest:  '0.1em',     // All caps labels
}
```

---

## Spacing Tokens

### Base Spacing Scale (4px base unit)

```typescript
spacing: {
  0:    '0px',
  px:   '1px',
  0.5:  '0.125rem',  // 2px
  1:    '0.25rem',   // 4px
  1.5:  '0.375rem',  // 6px
  2:    '0.5rem',    // 8px
  2.5:  '0.625rem',  // 10px
  3:    '0.75rem',   // 12px
  3.5:  '0.875rem',  // 14px
  4:    '1rem',      // 16px
  5:    '1.25rem',   // 20px
  6:    '1.5rem',    // 24px
  7:    '1.75rem',   // 28px
  8:    '2rem',      // 32px
  9:    '2.25rem',   // 36px
  10:   '2.5rem',    // 40px
  11:   '2.75rem',   // 44px
  12:   '3rem',      // 48px
  14:   '3.5rem',    // 56px
  16:   '4rem',      // 64px
  20:   '5rem',      // 80px
  24:   '6rem',      // 96px
  28:   '7rem',      // 112px
  32:   '8rem',      // 128px
}
```

### Component-Specific Spacing

```typescript
// Button Padding
button: {
  sm: { px: '0.75rem', py: '0.375rem' },  // 12px x 6px
  md: { px: '1rem', py: '0.5rem' },        // 16px x 8px
  lg: { px: '2rem', py: '0.75rem' },       // 32px x 12px
}

// Card Padding
card: {
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
}

// Section Padding
section: {
  sm: { py: '2rem' },   // 32px vertical
  md: { py: '3rem' },   // 48px vertical
  lg: { py: '4rem' },   // 64px vertical
  xl: { py: '6rem' },   // 96px vertical
}
```

---

## Shadow Tokens

### Shadow Scale

```typescript
boxShadow: {
  none: 'none',
  
  // Subtle shadows
  xs:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm:   '0 2px 4px 0 rgb(0 0 0 / 0.06)',
  md:   '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  
  // Medium shadows
  lg:   '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:   '0 12px 25px -5px rgb(0 0 0 / 0.12), 0 6px 10px -6px rgb(0 0 0 / 0.1)',
  
  // Large shadows
  '2xl': '0 20px 40px -12px rgb(0 0 0 / 0.15)',
  
  // Special shadows
  sharp: '0 2px 8px 0 rgb(0 0 0 / 0.12)',
  crisp: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
  
  // Neumorphic shadows (for dark theme)
  'neu-flat': `
    8px 8px 16px hsl(220 15% 3%),
    -8px -8px 16px hsl(220 15% 13%),
    inset 1px 1px 2px hsl(0 0% 100% / 0.03)
  `,
  
  'neu-raised': `
    12px 12px 24px hsl(220 15% 2%),
    -12px -12px 24px hsl(220 15% 14%),
    inset 1px 1px 2px hsl(0 0% 100% / 0.05)
  `,
  
  'neu-inset': `
    inset 4px 4px 8px hsl(220 15% 3%),
    inset -4px -4px 8px hsl(220 15% 13%)
  `,
}
```

### Component Shadow Usage

```typescript
components: {
  card:     'shadow-lg',
  button:   'shadow-md',
  dropdown: 'shadow-xl',
  modal:    'shadow-2xl',
  tooltip:  'shadow-sm',
}
```

---

## Border Radius Tokens

### Sharp Corner System (All 0px)

```typescript
borderRadius: {
  none:  '0px',
  xs:    '0px',
  sm:    '0px',
  md:    '0px',
  lg:    '0px',
  xl:    '0px',
  '2xl': '0px',
  '3xl': '0px',
  full:  '0px',
  sharp: '0px',  // Explicit sharp corner utility
}
```

**Note:** The design system uses sharp corners (0px border-radius) throughout for a professional, defined edge aesthetic.

---

## Animation & Transition Tokens

### Duration

```typescript
duration: {
  fast:   '150ms',
  normal: '200ms',
  slow:   '300ms',
  slower: '500ms',
}
```

### Timing Functions

```typescript
ease: {
  linear:  'linear',
  in:      'cubic-bezier(0.4, 0, 1, 1)',
  out:     'cubic-bezier(0, 0, 0.2, 1)',
  inOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp:   'cubic-bezier(0.4, 0, 0.6, 1)',
  smooth:  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce:  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

### Keyframe Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Slide Down */
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Breakpoint Tokens

### Screen Sizes

```typescript
screens: {
  xs:      '475px',
  sm:      '640px',
  md:      '768px',
  lg:      '1024px',
  xl:      '1280px',
  '2xl':   '1536px',
  
  // Custom breakpoints
  mobile:  { max: '767px' },
  tablet:  { min: '768px', max: '1023px' },
  desktop: { min: '1024px' },
}
```

### Container Max Widths

```typescript
container: {
  xs:   '20rem',    // 320px
  sm:   '24rem',    // 384px
  md:   '28rem',    // 448px
  lg:   '32rem',    // 512px
  xl:   '36rem',    // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px
  full:  '100%',
}
```

---

## Z-Index Scale

```typescript
zIndex: {
  0:       0,
  10:      10,
  20:      20,
  30:      30,
  40:      40,
  50:      50,
  auto:    'auto',
  
  // Component specific
  dropdown:  1000,
  sticky:    1020,
  fixed:     1030,
  modal:     1040,
  popover:   1050,
  tooltip:   1060,
  toast:     1070,
}
```

---

## Opacity Scale

```typescript
opacity: {
  0:    '0',
  5:    '0.05',
  10:   '0.1',
  20:   '0.2',
  25:   '0.25',
  30:   '0.3',
  40:   '0.4',
  50:   '0.5',
  60:   '0.6',
  70:   '0.7',
  75:   '0.75',
  80:   '0.8',
  90:   '0.9',
  95:   '0.95',
  100:  '1',
}
```

---

## Usage Examples

### In TypeScript

```typescript
import { 
  colorPalettes, 
  spacing, 
  shadows, 
  fontSizes 
} from '@/lib/design-tokens';

// Using tokens
const styles = {
  color: colorPalettes.blue[500],
  padding: spacing.md,
  boxShadow: shadows.lg,
  fontSize: fontSizes.xl,
};
```

### In Tailwind Classes

```tsx
// Color
<div className="bg-blue-500 text-white">

// Spacing
<div className="p-4 m-2 space-y-4">

// Typography
<h1 className="text-4xl font-bold">

// Shadow
<div className="shadow-lg">

// Responsive
<div className="text-sm md:text-base lg:text-lg">
```

### In CSS Variables

```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-lg);
}
```

---

## Token Naming Convention

### Format

```
{category}-{property}-{value}
```

### Examples

```typescript
color-red-500        // Color palette
spacing-4            // Spacing scale
shadow-lg            // Shadow scale
text-xl              // Font size
font-bold            // Font weight
border-radius-md     // Border radius
duration-normal      // Animation duration
ease-inOut          // Timing function
```

---

*Last Updated: Reference for all design tokens used throughout the application*
