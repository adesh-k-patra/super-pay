/**
 * Design Tokens System
 * Centralized design system configuration for consistent theming across the application.
 * 
 * This file provides:
 * - Easy-to-modify color palettes
 * - Semantic color mappings
 * - Spacing and sizing scales
 * - Animation and transition configurations
 * - Typography scale
 * - Component-specific styling configurations
 */

// =============================================================================
// GLOBAL DESIGN PARAMETERS
// =============================================================================

/**
 * Global design configuration parameters
 * These values define the core visual language of the application
 */
export const globalDesignParams = {
  // Border radius - Sharp corners throughout the application
  borderRadius: {
    none: '0px',
    small: '0px',
    medium: '0px',
    large: '0px',
    default: '0px', // Sharp corners for professional design
  },
  
  // Enhanced spacing scale - Consistent spacing system
  spacing: {
    none: '0px',
    px: '1px',
    xs: '4px',      // 0.25rem
    sm: '8px',      // 0.5rem  
    md: '12px',     // 0.75rem
    base: '16px',   // 1rem
    lg: '20px',     // 1.25rem
    xl: '24px',     // 1.5rem
    '2xl': '32px',  // 2rem
    '3xl': '48px',  // 3rem
    '4xl': '64px',  // 4rem
    '5xl': '80px',  // 5rem
    '6xl': '96px',  // 6rem
  },
  
  // Typography system
  typography: {
    fontSizes: {
      xs: '12px',    // 0.75rem
      sm: '14px',    // 0.875rem
      base: '16px',  // 1rem
      lg: '18px',    // 1.125rem
      xl: '20px',    // 1.25rem
      '2xl': '24px', // 1.5rem
      '3xl': '30px', // 1.875rem
      '4xl': '36px', // 2.25rem
      '5xl': '48px', // 3rem
      '6xl': '60px', // 3.75rem
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
    },
  },
  
  // Color system configuration
  // Note: Actual colors are defined in global-theme.ts as single source of truth
  // These serve as type definitions and fallbacks
  colors: {
    // Professional dark theme neutral scale (references global-theme.ts)
    primary: {
      50: '0 0% 98%',   // Lightest (main white)
      100: '0 0% 95%',
      200: '0 0% 90%',
      300: '0 0% 85%',
      400: '0 0% 80%',
      500: '0 0% 75%',  // Middle neutral
      600: '220 15% 25%',
      700: '220 15% 20%',
      800: '220 15% 15%',
      900: '220 15% 12%',   // Darkest
    },
    // Neutral grays for backgrounds and text (references global-theme.ts)
    neutral: {
      0: '0 0% 100%',     // Pure white
      50: '210 20% 98%',
      100: '220 14% 96%',
      200: '220 14% 96%',
      300: '220 13% 91%',
      400: '220 9% 46%',
      500: '215 16% 47%',
      600: '224 71% 4%',
      700: '215 28% 17%',
      800: '221 39% 11%',
      900: '224 71% 4%',
      1000: '0 0% 0%',   // Pure black
    },
  },
  
  // Effects and visual elements
  effects: {
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      crisp: '0 1px 3px 0 rgb(0 0 0 / 0.1)', // For defined edges
      sharp: '0 2px 8px 0 rgb(0 0 0 / 0.12)', // Professional shadow
    },
    blur: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    },
  },
  
  // Animation and timing
  animations: {
    durations: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)', // Material Design sharp
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth transitions
    },
  },
  
  // Component sizing
  sizing: {
    buttons: {
      sm: { height: '32px', padding: '6px 12px', fontSize: '14px' },
      md: { height: '40px', padding: '8px 16px', fontSize: '16px' },
      lg: { height: '48px', padding: '12px 24px', fontSize: '18px' },
    },
    inputs: {
      sm: { height: '32px', padding: '6px 12px', fontSize: '14px' },
      md: { height: '40px', padding: '8px 12px', fontSize: '16px' },
      lg: { height: '48px', padding: '12px 16px', fontSize: '18px' },
    },
  },
  
  // Design principles and guidelines
  principles: {
    sharpCorners: true,
    definedEdges: true,
    professionalTheme: true,
    minimumCardUsage: true, // 50/50 ratio target
    noGradients: true, // Clean, solid colors only
    whitespaceEmphasis: true, // Generous whitespace for clarity
    consistentSpacing: true, // Use spacing scale religiously
  },
} as const;

// =============================================================================
// COLOR SYSTEM
// =============================================================================

/**
 * Base Color Palette
 * HSL channel values (used with hsl() function)
 */
export const colorPalettes = {
  // Red palette - Error and destructive states
  red: {
    50: '0 86% 97%',
    100: '0 93% 94%',
    200: '0 96% 89%',
    300: '0 94% 82%',
    400: '0 91% 71%',
    500: '0 84% 60%',  // Standard red
    600: '0 72% 51%',
    700: '0 74% 42%',
    800: '0 70% 35%',
    900: '0 65% 25%',
  },
  
  // Green palette - Success, approved loans
  green: {
    50: '142 76% 97%',
    100: '142 76% 94%',
    200: '142 76% 87%',
    300: '142 76% 77%',
    400: '142 76% 65%',
    500: '142 76% 52%',
    600: '142 76% 42%',
    700: '142 76% 32%',
    800: '142 76% 22%',
  },
  
  // Blue palette - Information, credit scores
  blue: {
    50: '210 100% 97%',
    100: '210 100% 94%',
    200: '210 100% 87%',
    300: '210 100% 77%',
    400: '210 100% 65%',
    500: '210 100% 55%',
    600: '210 100% 45%',
    700: '210 100% 35%',
    800: '210 100% 25%',
  },
  
  // Yellow palette - Warnings, pending states
  yellow: {
    50: '48 100% 96%',
    100: '48 96% 89%',
    200: '48 97% 77%',
    300: '45 93% 62%',
    400: '43 89% 52%',
    500: '38 92% 50%',
    600: '32 95% 44%',
    700: '26 90% 37%',
    800: '23 83% 31%',
  },
  
  // Purple palette - Premium features
  purple: {
    50: '270 100% 98%',
    100: '269 100% 95%',
    200: '269 100% 92%',
    300: '269 97% 85%',
    400: '270 95% 75%',
    500: '270 91% 65%',
    600: '271 81% 56%',
    700: '272 72% 47%',
    800: '273 67% 39%',
  },
  
  // Teal palette - Financial health
  teal: {
    50: '166 76% 97%',
    100: '167 85% 89%',
    200: '168 84% 78%',
    300: '171 77% 64%',
    400: '172 66% 50%',
    500: '173 58% 39%',
    600: '175 60% 30%',
    700: '175 84% 23%',
    800: '176 87% 18%',
  },
  
  // Gray palette - Neutral colors
  gray: {
    50: '210 20% 98%',
    100: '220 14% 96%',
    200: '220 13% 91%',
    300: '216 12% 84%',
    400: '218 11% 65%',
    500: '220 9% 46%',
    600: '215 14% 34%',
    700: '217 19% 27%',
    800: '215 28% 17%',
    900: '221 39% 11%',
  },
} as const;

/**
 * Semantic Color Variables
 * Maps semantic meanings to CSS variable references
 * These align with the CSS variables defined in index.css
 */
export const semanticColors = {
  // Core application colors (matches index.css --primary, etc.)
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  
  // State colors (properly wrapped for CSS usage)
  success: 'hsl(var(--green-500))',
  successForeground: 'hsl(0 0% 100%)',
  warning: 'hsl(var(--yellow-500))',
  warningForeground: 'hsl(0 0% 100%)',
  danger: 'var(--destructive)',
  dangerForeground: 'var(--destructive-foreground)',
  info: 'hsl(var(--blue-500))',
  infoForeground: 'hsl(0 0% 100%)',
  
  // Surface colors (matches index.css)
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  
  // Interactive colors (matches index.css)
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',
  
  // Border and input (matches index.css)
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
} as const;

/**
 * Status-based Color Mappings
 * Used for loan statuses, application states, etc.
 * Uses CSS variable references for consistency
 */
export const statusColors = {
  active: {
    background: 'hsl(var(--green-500))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--green-100))',
    border: 'hsl(var(--green-400))',
  },
  pending: {
    background: 'hsl(var(--yellow-500))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--yellow-100))',
    border: 'hsl(var(--yellow-400))',
  },
  completed: {
    background: 'hsl(var(--purple-500))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--purple-100))',
    border: 'hsl(var(--purple-400))',
  },
  rejected: {
    background: 'hsl(var(--red-600))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--red-100))',
    border: 'hsl(var(--red-400))',
  },
  approved: {
    background: 'hsl(var(--green-600))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--green-100))',
    border: 'hsl(var(--green-500))',
  },
  processing: {
    background: 'hsl(var(--blue-500))',
    foreground: 'hsl(0 0% 100%)',
    light: 'hsl(var(--blue-100))',
    border: 'hsl(var(--blue-400))',
  },
} as const;

/**
 * Theme Utility Functions
 * Helper functions for easy theme management and color application
 */

// Generate color utility with opacity support (expects channel variables)
export const withOpacity = (channelVar: string, opacity?: number) => {
  if (opacity !== undefined) {
    return `hsl(var(${channelVar}) / ${opacity})`;
  }
  return `hsl(var(${channelVar}))`;
};

// Semantic color mappings for common UI patterns
export const uiColors = {
  // Status colors
  success: {
    bg: 'hsl(var(--green-500))',
    bgLight: 'hsl(var(--green-100))',
    text: 'hsl(var(--green-700))',
    border: 'hsl(var(--green-300))',
  },
  warning: {
    bg: 'hsl(var(--yellow-500))',
    bgLight: 'hsl(var(--yellow-100))',
    text: 'hsl(var(--yellow-700))',
    border: 'hsl(var(--yellow-300))',
  },
  error: {
    bg: 'hsl(var(--red-500))',
    bgLight: 'hsl(var(--red-100))',
    text: 'hsl(var(--red-700))',
    border: 'hsl(var(--red-300))',
  },
  info: {
    bg: 'hsl(var(--blue-500))',
    bgLight: 'hsl(var(--blue-100))',
    text: 'hsl(var(--blue-700))',
    border: 'hsl(var(--blue-300))',
  },
  // Interactive states
  interactive: {
    default: 'var(--primary)',
    hover: 'hsl(var(--primary-ch) / 0.9)',
    active: 'hsl(var(--primary-ch) / 0.8)',
    disabled: 'hsl(var(--gray-300))',
  },
  // Surface colors for easy theming
  surface: {
    primary: 'var(--background)',
    secondary: 'var(--card)',
    elevated: 'hsl(var(--background-ch) / 0.8)',
    overlay: 'hsl(var(--black) / 0.8)',
  },
} as const;

/**
 * Color Theme Presets
 * Pre-defined color combinations for quick theming
 */
export const colorThemes = {
  default: {
    primary: 'hsl(0 0% 98%)',
    accent: 'hsl(var(--blue-500))',
    success: 'hsl(var(--green-500))',
    warning: 'hsl(var(--yellow-500))',
  },
  professional: {
    primary: 'hsl(var(--blue-600))',
    accent: 'hsl(var(--gray-600))',
    success: 'hsl(var(--green-600))',
    warning: 'hsl(var(--yellow-600))',
  },
  vibrant: {
    primary: 'hsl(var(--purple-500))',
    accent: 'hsl(var(--teal-500))',
    success: 'hsl(var(--green-500))',
    warning: 'hsl(var(--yellow-500))',
  },
} as const;

// =============================================================================
// SPACING & SIZING SYSTEM
// =============================================================================

/**
 * Border Radius Scale
 * Sharp corners throughout the application for defined edges
 * Professional design with crisp, sharp geometric forms
 */
export const borderRadius = {
  none: '0px',     // Completely sharp edges (default)
  xs: '0px',       // Sharp corners for inputs and small elements
  sm: '0px',       // Sharp corners for buttons and controls
  md: '0px',       // Sharp corners for cards and containers 
  lg: '0px',       // Sharp corners for panels and larger elements
  xl: '0px',       // Sharp corners for modals and major containers
  '2xl': '0px',    // Sharp corners for large panels
  '3xl': '0px',    // Sharp corners for hero sections
  sharp: '0px',    // Explicit sharp corner utility
} as const;

/**
 * Shadow Scale
 * Crisp shadows for defined edges and modern depth
 * Enhanced for sharp corner design
 */
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 12px 25px -5px rgb(0 0 0 / 0.12), 0 6px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 20px 40px -12px rgb(0 0 0 / 0.15)',
  sharp: '0 2px 8px 0 rgb(0 0 0 / 0.12)', // Crisp shadow for sharp elements
  crisp: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)', // Clean defined shadow
} as const;

/**
 * Spacing Scale
 * Consistent spacing system
 */
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;

// =============================================================================
// ANIMATION & TRANSITIONS
// =============================================================================

/**
 * Transition Configurations
 */
export const transitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.15s ease-in-out',
  slow: 'all 0.3s ease-in-out',
  colors: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  transform: 'transform 0.2s ease-in-out',
} as const;

/**
 * Animation Durations
 */
export const animations = {
  fadeIn: '0.3s ease-in-out',
  slideUp: '0.3s ease-out',
  bounceSubtle: '0.6s ease-in-out',
  hover: '0.2s ease-in-out',
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

/**
 * Font Families
 */
export const fonts = {
  sans: ['Inter', 'sans-serif'],
  serif: ['Georgia', 'serif'],
  mono: ['Menlo', 'monospace'],
} as const;

/**
 * Font Sizes
 */
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

/**
 * Button Configurations
 */
export const buttonTokens = {
  heights: {
    sm: '2.25rem',    // h-9
    default: '2.5rem', // h-10
    lg: '2.75rem',    // h-11
  },
  padding: {
    sm: '0.75rem',    // px-3
    default: '1rem',  // px-4
    lg: '2rem',       // px-8
  },
} as const;

/**
 * Card Configurations  
 */
export const cardTokens = {
  padding: {
    sm: '1rem',       // p-4
    default: '1.5rem', // p-6
    lg: '2rem',       // p-8
  },
  hover: {
    translateY: '-2px',
    scale: '1.02',
  },
} as const;

/**
 * Glassmorphic Effect Configurations
 */
export const glassmorphicTokens = {
  backdrop: 'blur(10px)',
  backdropStrong: 'blur(15px)',
  opacity: {
    light: '0.1',
    medium: '0.15',
    strong: '0.25',
  },
  border: {
    light: '0.2',
    medium: '0.3',
    strong: '0.4',
  },
  
  // Dark glassmorphic patterns (for dark-themed app)
  darkGlass: {
    section: "border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl",
    sectionDark: "border border-white/20 bg-black/40 backdrop-blur-sm",
    sectionGradient: "border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl",
    header: "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10",
    card: "bg-white/5 border border-white/20 backdrop-blur-sm",
    button: "bg-white/10 hover:bg-white/20 border-white/20",
  },

  // Typography for dark glass theme
  darkText: {
    label: "text-xs uppercase tracking-widest text-white/60 font-light",
    heading: "text-lg font-bold tracking-wider",
    subheading: "text-[10px] text-white/50 uppercase tracking-widest font-light",
    value: "text-xl font-light text-white",
    description: "text-xs text-white/60 font-light",
  },

  // Buttons for dark glass theme
  darkButtons: {
    primary: "bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider",
    secondary: "bg-white/10 text-white hover:bg-white/20 rounded-none font-light tracking-wider",
    ghost: "text-white/60 hover:text-white hover:bg-white/10 rounded-none font-light",
    icon: "bg-white/10 text-white hover:bg-white/20 rounded-none",
  },

  // 3D Icon colors & shadows for dark glass theme
  iconStyles: {
    blue: { color: "bg-blue-400", shadow: "shadow-[0_8px_32px_rgba(59,130,246,0.3)]" },
    purple: { color: "bg-purple-400", shadow: "shadow-[0_8px_32px_rgba(168,85,247,0.3)]" },
    green: { color: "bg-green-400", shadow: "shadow-[0_8px_32px_rgba(52,211,153,0.3)]" },
    orange: { color: "bg-orange-400", shadow: "shadow-[0_8px_32px_rgba(251,146,60,0.3)]" },
    red: { color: "bg-red-400", shadow: "shadow-[0_8px_32px_rgba(239,68,68,0.3)]" },
    yellow: { color: "bg-yellow-400", shadow: "shadow-[0_8px_32px_rgba(250,204,21,0.3)]" },
    cyan: { color: "bg-cyan-400", shadow: "shadow-[0_8px_32px_rgba(34,211,238,0.3)]" },
    indigo: { color: "bg-indigo-400", shadow: "shadow-[0_8px_32px_rgba(99,102,241,0.3)]" },
    teal: { color: "bg-teal-400", shadow: "shadow-[0_8px_32px_rgba(45,212,191,0.3)]" },
    pink: { color: "bg-pink-400", shadow: "shadow-[0_8px_32px_rgba(244,114,182,0.3)]" },
    violet: { color: "bg-violet-400", shadow: "shadow-[0_8px_32px_rgba(167,139,250,0.3)]" },
    sky: { color: "bg-sky-400", shadow: "shadow-[0_8px_32px_rgba(56,189,248,0.3)]" },
    amber: { color: "bg-amber-400", shadow: "shadow-[0_8px_32px_rgba(251,191,36,0.3)]" },
    emerald: { color: "bg-emerald-400", shadow: "shadow-[0_8px_32px_rgba(52,211,153,0.3)]" },
    rose: { color: "bg-rose-400", shadow: "shadow-[0_8px_32px_rgba(244,63,94,0.3)]" },
    lime: { color: "bg-lime-400", shadow: "shadow-[0_8px_32px_rgba(163,230,53,0.3)]" },
    gray: { color: "bg-gray-300", shadow: "shadow-[0_8px_32px_rgba(203,213,225,0.3)]" },
  },
} as const;

// Helper function to get icon style
export function getIconStyle(color: keyof typeof glassmorphicTokens.iconStyles) {
  return glassmorphicTokens.iconStyles[color];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate HSL color string from CSS variable
 */
export function hslVar(variableName: string, alpha?: number): string {
  if (alpha !== undefined) {
    return `hsl(var(--${variableName}) / ${alpha})`;
  }
  return `hsl(var(--${variableName}))`;
}

/**
 * Generate HSL color string from channel values
 */
export function hsl(colorValue: string, alpha?: number): string {
  if (alpha !== undefined) {
    return `hsl(${colorValue} / ${alpha})`;
  }
  return `hsl(${colorValue})`;
}

/**
 * Generate CSS variable reference
 */
export function cssVar(variableName: string): string {
  return `var(--${variableName})`;
}

/**
 * Get CSS variable for a palette color (type-safe)
 */
export function paletteVar<P extends keyof typeof colorPalettes>(
  palette: P, 
  shade: keyof (typeof colorPalettes)[P]
): string {
  return `var(--${palette}-${String(shade)})`;
}

/**
 * Get status color configuration
 */
export function getStatusColor(status: keyof typeof statusColors) {
  return statusColors[status];
}

/**
 * Get color from palette (type-safe)
 */
export function getColor<P extends keyof typeof colorPalettes>(
  palette: P, 
  shade: keyof (typeof colorPalettes)[P]
): string {
  return colorPalettes[palette][shade] as string;
}

/**
 * Get color CSS variable (type-safe)
 */
export function getColorVar<P extends keyof typeof colorPalettes>(
  palette: P, 
  shade: keyof (typeof colorPalettes)[P]
): string {
  return `var(--${palette}-${String(shade)})`;
}

// =============================================================================
// DARK MODE SUPPORT
// =============================================================================

/**
 * Theme-aware color utilities
 * Automatically uses appropriate colors for light/dark themes
 */
export const themeColors = {
  // These automatically adapt based on CSS variables and .dark class
  text: {
    primary: 'var(--foreground)',
    secondary: 'var(--muted-foreground)',
    inverse: 'var(--background)',
  },
  surface: {
    primary: 'var(--background)',
    secondary: 'var(--card)',
    muted: 'var(--muted)',
  },
  border: {
    default: 'var(--border)',
    muted: 'var(--input)',
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorPalette = keyof typeof colorPalettes;
export type StatusType = keyof typeof statusColors;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Spacing = keyof typeof spacing;
export type FontSize = keyof typeof fontSizes;

// Type-safe palette access
export type PaletteShades<P extends ColorPalette> = keyof (typeof colorPalettes)[P];