# Design Tokens System

This design tokens system provides a centralized way to manage all design decisions in the application, making it easy to maintain consistency and modify colors, spacing, and other properties.

## Quick Start

```typescript
import { 
  colorPalettes, 
  semanticColors, 
  statusColors,
  hsl,
  hslVar,
  getStatusColor,
  getColor,
  getColorVar 
} from '@/lib/design-tokens';
```

## Key Features

### 🎨 Color System
- **Complete Color Palettes**: Red, green, blue, yellow, purple, teal, and gray
- **Semantic Colors**: Primary, secondary, success, warning, danger, info
- **Status Colors**: Active, pending, completed, rejected, approved, processing

### 📏 Spacing & Sizing
- **Border Radius**: Sharp corners with thin curves (2px to 12px scale)
- **Shadows**: Consistent depth system (sm to 2xl)
- **Spacing**: Standardized spacing scale

### ⚡ Animations
- **Transitions**: Fast, default, slow presets
- **Durations**: Consistent timing for all animations

## Usage Examples

### Using Colors in Components

```typescript
// Using semantic colors (CSS variables)
const primaryColor = semanticColors.primary; // 'var(--primary)'
const backgroundColor = semanticColors.background; // 'var(--background)'

// Using palette colors with CSS variables
const successColor = hslVar('green-500'); // 'hsl(var(--green-500))'
const warningColorVar = getColorVar('yellow', '500'); // 'var(--yellow-500)'
const warningColor = hslVar('yellow-500'); // 'hsl(var(--yellow-500))' - preferred for CSS

// Using raw palette values (for calculations)
const greenValue = getColor('green', '500'); // '142 76% 52%'
const customColor = hsl(greenValue, 0.5); // 'hsl(142 76% 52% / 0.5)'

// Status-based styling (already includes hsl())
const statusConfig = getStatusColor('active');
const statusBg = statusConfig.background; // 'hsl(var(--green-500))'
```

### In CSS/Tailwind Classes

```typescript
// Using semantic colors (these automatically use CSS variables)
className="bg-primary text-primary-foreground"
className="bg-secondary text-secondary-foreground"

// Using semantic utilities for consistency
className="bg-background text-foreground border-border"

// For custom styling with semantic colors
style={{
  backgroundColor: semanticColors.primary,      // 'var(--primary)'
  color: semanticColors.primaryForeground,      // 'var(--primary-foreground)'
  borderColor: semanticColors.border,           // 'var(--border)'
}}

// For palette-based styling
style={{
  backgroundColor: hslVar('green-500'),  // 'hsl(var(--green-500))'
  borderColor: getColorVar('green', '400'), // 'var(--green-400)' (needs hsl())
}}
```

### Creating Status Indicators

```typescript
// Status colors already include hsl() wrapper
const statusConfig = getStatusColor(status);
const statusStyle = {
  backgroundColor: statusConfig.background, // 'hsl(var(--green-500))'
  color: statusConfig.foreground,          // 'hsl(0 0% 100%)'
  borderColor: statusConfig.border,        // 'hsl(var(--green-400))'
};

// For theme-aware colors
const themeStyle = {
  backgroundColor: themeColors.surface.primary, // 'var(--background)'
  color: themeColors.text.primary,             // 'var(--foreground)'
  borderColor: themeColors.border.default,     // 'var(--border)'
};
```

## Modifying the Design System

### Changing the Primary Color
```css
/* In index.css - preferred method */
:root {
  --primary: hsl(210 100% 55%); /* Changed from red to blue */
}
```

```typescript
// Or using design tokens for new variables
// Add to CSS: --my-primary: hsl(var(--blue-500))
const customPrimary = hslVar('blue-500'); // 'hsl(var(--blue-500))'
```

### Adding New Status Types
```typescript
export const statusColors = {
  // ... existing statuses
  draft: {
    background: 'hsl(var(--gray-500))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--gray-100))',
    border: 'hsl(var(--gray-400))',
  },
} as const;
```

### Modifying Border Radius
```typescript
// Change the base radius to make corners even sharper
export const borderRadius = {
  // ... existing values
  lg: '4px',    // Changed from 6px to 4px
} as const;
```

## CSS Variables Integration

The design tokens are fully integrated with the existing CSS variables in `index.css`:

```css
:root {
  --primary: hsl(0 85% 58%);     /* Referenced by semanticColors.primary */
  --red-500: 0 84% 60%;          /* Referenced by getColorVar('red', '500') */
  --radius: 6px;                 /* Referenced by borderRadius.lg */
}

.dark {
  --primary: hsl(0 85% 58%);     /* Dark mode values automatically used */
  --background: hsl(224 71.4% 4.1%);
}
```

The tokens use `var()` references, so changes to CSS variables automatically propagate throughout the application.

## Component Integration

### Button Variants
```typescript
import { semanticColors, buttonTokens } from '@/lib/design-tokens';

// Using CSS variables (preferred)
const buttonStyles = {
  primary: {
    backgroundColor: semanticColors.primary,      // 'var(--primary)'
    color: semanticColors.primaryForeground,      // 'var(--primary-foreground)'
    height: buttonTokens.heights.default,
  },
};

// Or with Tailwind classes
className="bg-primary text-primary-foreground hover:bg-primary/90"
```

### Card Components
```typescript
import { cardTokens, shadows } from '@/lib/design-tokens';

const cardStyles = {
  padding: cardTokens.padding.default,
  boxShadow: shadows.md,
  '&:hover': {
    transform: `translateY(${cardTokens.hover.translateY}) scale(${cardTokens.hover.scale})`,
  },
};
```

## Benefits

1. **Centralized Control**: Change colors, spacing, or effects in one place
2. **Type Safety**: Full TypeScript support with autocomplete
3. **Consistency**: Ensures all components use the same design values
4. **Easy Theming**: Swap color palettes or create new themes quickly
5. **Documentation**: Self-documenting with clear naming conventions
6. **Flexibility**: Works with both CSS variables and direct values

## Best Practices

1. **Use semantic colors** for UI elements (primary, secondary, success, etc.)
2. **Use palette colors** for specific branding or illustrations
3. **Use status colors** for state-dependent styling
4. **Use hslVar() for complete colors** - hslVar('green-500') for direct CSS usage
5. **Use getColorVar() for references** - getColorVar('green', '500') for CSS variable references
6. **Prefer semantic colors** for UI consistency (primary, secondary, success, etc.)
7. **Update CSS variables in index.css** for global changes
8. **Test changes across all themes** (light/dark mode) - tokens automatically adapt

## Migration Guide

When updating existing components to use design tokens:

1. **Identify hardcoded colors** and replace with semantic/palette colors
2. **Replace inline styles** with token-based styles
3. **Update CSS classes** to use consistent naming
4. **Test thoroughly** to ensure visual consistency

This design system provides:

- **Single Source of Truth**: CSS variables in index.css control all colors
- **Type Safety**: Full TypeScript support with compile-time validation
- **Theme Support**: Automatic light/dark mode adaptation
- **Performance**: CSS variables are efficiently handled by the browser
- **Maintainability**: Change colors in one place, update everywhere

The system makes it easy to maintain a consistent, professional look while remaining flexible for future design changes and theme variations.