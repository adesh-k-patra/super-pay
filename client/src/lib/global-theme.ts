/**
 * Global Theme Configuration
 * Centralized theme management for consistent styling across the application
 * 
 * This module manages the application's global theme state and provides
 * utilities for applying consistent theming throughout all components.
 */

import { globalDesignParams } from './design-tokens';

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

/**
 * Professional Dark Theme Configuration
 * Based on the dark theme with clean, professional styling
 * Uses HSL channel values consistent with CSS variables and Tailwind config
 */
export const professionalTheme = {
  // Primary colors (Professional Neutral Scale) - HSL channel values
  primary: {
    50: '0 0% 98%',    // Lightest (main white)
    100: '0 0% 95%',   // Very light gray
    200: '0 0% 90%',   // Light gray
    300: '0 0% 85%',   // Medium light gray
    400: '0 0% 80%',   // Medium gray
    500: '0 0% 75%',   // Middle neutral
    600: '220 15% 25%',   // Dark gray
    700: '220 15% 20%',   // Darker gray
    800: '220 15% 15%',   // Very dark gray
    900: '220 15% 12%',   // Darkest
  },

  // Background colors (Professional Dark) - HSL channel values
  background: {
    primary: '220 15% 8%',      // Dark background
    secondary: '220 15% 10%',  // Slightly lighter dark
    tertiary: '220 15% 15%',   // Medium dark gray
    quaternary: '220 15% 18%', // Lighter dark gray
  },

  // Text colors - HSL channel values
  text: {
    primary: '0 0% 95%',      // Light gray (main text for dark theme)
    secondary: '0 0% 65%',   // Medium gray (secondary text)
    tertiary: '0 0% 46%',     // Darker gray (muted text)
    inverse: '220 15% 8%',       // Dark text (on light backgrounds)
    accent: '0 0% 98%',        // White text (for highlights)
  },

  // Border colors - HSL channel values
  border: {
    default: '220 15% 20%',     // Dark gray borders
    focus: '0 0% 98%',         // White focus borders
    muted: '220 15% 15%',       // Very dark borders
    strong: '220 15% 25%',       // Stronger borders
  },

  // Status colors - HSL channel values
  status: {
    success: '142 76% 36%',     // Green for success
    warning: '45 93% 47%',      // Orange for warnings  
    error: '0 84% 60%',         // Red for errors
    info: '217 91% 60%',        // Blue for information
  },
} as const;

// =============================================================================
// THEME APPLICATION UTILITIES
// =============================================================================

/**
 * Apply theme colors to CSS custom properties
 * This function updates CSS variables to apply the professional theme
 * Uses HSL channel values consistent with the existing CSS variable system
 */
export function applyProfessionalTheme() {
  const root = document.documentElement;

  // Primary theme colors
  root.style.setProperty('--primary', `hsl(${professionalTheme.primary[500]})`);
  root.style.setProperty('--primary-foreground', `hsl(${professionalTheme.text.inverse})`);

  // Secondary colors
  root.style.setProperty('--secondary', `hsl(${professionalTheme.background.tertiary})`);
  root.style.setProperty('--secondary-foreground', `hsl(${professionalTheme.text.primary})`);

  // Background colors
  root.style.setProperty('--background', `hsl(${professionalTheme.background.primary})`);
  root.style.setProperty('--foreground', `hsl(${professionalTheme.text.primary})`);

  // Card colors
  root.style.setProperty('--card', `hsl(${professionalTheme.background.secondary})`);
  root.style.setProperty('--card-foreground', `hsl(${professionalTheme.text.primary})`);

  // Muted colors
  root.style.setProperty('--muted', `hsl(${professionalTheme.background.tertiary})`);
  root.style.setProperty('--muted-foreground', `hsl(${professionalTheme.text.secondary})`);

  // Accent colors
  root.style.setProperty('--accent', `hsl(${professionalTheme.background.quaternary})`);
  root.style.setProperty('--accent-foreground', `hsl(${professionalTheme.text.primary})`);

  // Popover colors
  root.style.setProperty('--popover', `hsl(${professionalTheme.background.primary})`);
  root.style.setProperty('--popover-foreground', `hsl(${professionalTheme.text.primary})`);

  // Border and input colors
  root.style.setProperty('--border', `hsl(${professionalTheme.border.default})`);
  root.style.setProperty('--input', `hsl(${professionalTheme.border.default})`);

  // Focus ring
  root.style.setProperty('--ring', `hsl(${professionalTheme.border.focus})`);

  // Destructive colors (using error status)
  root.style.setProperty('--destructive', `hsl(${professionalTheme.status.error})`);
  root.style.setProperty('--destructive-foreground', `hsl(${professionalTheme.text.inverse})`);

  // Set channel variables for components that use them
  root.style.setProperty('--primary-ch', professionalTheme.primary[500]);
  root.style.setProperty('--background-ch', professionalTheme.background.primary);
  root.style.setProperty('--secondary-ch', professionalTheme.background.tertiary);
  root.style.setProperty('--foreground-ch', professionalTheme.text.primary);
  root.style.setProperty('--muted-ch', professionalTheme.background.tertiary);
  root.style.setProperty('--destructive-ch', professionalTheme.status.error);
  
  // Set black and white variables for references
  root.style.setProperty('--black', 'hsl(0 0% 0%)');
  root.style.setProperty('--black-ch', '0 0% 0%');
  root.style.setProperty('--white', 'hsl(0 0% 100%)');
  root.style.setProperty('--white-ch', '0 0% 100%');

  // Update color palette CSS variables for consistency
  Object.entries(professionalTheme.primary).forEach(([shade, value]) => {
    root.style.setProperty(`--red-${shade}`, value);
  });

  // Update neutral/gray color variables
  const neutralShades = ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  neutralShades.forEach((shade, index) => {
    const neutralValues = [
      professionalTheme.background.primary,   // 0 - pure white
      '210 20% 98%',                          // 50
      '220 14% 96%',                          // 100
      professionalTheme.background.tertiary,  // 200
      professionalTheme.border.default,       // 300
      '220 9% 46%',                           // 400
      professionalTheme.text.secondary,       // 500
      professionalTheme.text.primary,         // 600
      '215 28% 17%',                          // 700
      '221 39% 11%',                          // 800
      '224 71% 4%',                           // 900
    ];
    
    if (neutralValues[index]) {
      root.style.setProperty(`--gray-${shade}`, neutralValues[index]);
    }
  });

  // Set additional color palette variables for full theme coverage
  // Green (success) colors
  const greenShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
  greenShades.forEach((shade, index) => {
    const greenValues = [
      '142 76% 97%', '142 76% 94%', '142 76% 87%', '142 76% 77%', 
      '142 76% 65%', '142 76% 52%', '142 76% 42%', '142 76% 32%', '142 76% 22%'
    ];
    if (greenValues[index]) {
      root.style.setProperty(`--green-${shade}`, greenValues[index]);
    }
  });

  // Blue (info) colors
  const blueShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
  blueShades.forEach((shade, index) => {
    const blueValues = [
      '210 100% 97%', '210 100% 94%', '210 100% 87%', '210 100% 77%',
      '210 100% 65%', '210 100% 55%', '210 100% 45%', '210 100% 35%', '210 100% 25%'
    ];
    if (blueValues[index]) {
      root.style.setProperty(`--blue-${shade}`, blueValues[index]);
    }
  });

  // Yellow (warning) colors
  const yellowShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
  yellowShades.forEach((shade, index) => {
    const yellowValues = [
      '48 100% 96%', '48 96% 89%', '48 97% 77%', '45 93% 62%',
      '43 89% 52%', '38 92% 50%', '32 95% 44%', '26 90% 37%', '23 83% 31%'
    ];
    if (yellowValues[index]) {
      root.style.setProperty(`--yellow-${shade}`, yellowValues[index]);
    }
  });
}

/**
 * Get theme color by category and shade
 * Usage: getThemeColor('primary', 500) => 'hsl(0 84% 60%)'
 */
export function getThemeColor(
  category: keyof typeof professionalTheme,
  shade?: keyof typeof professionalTheme.primary
): string {
  const colorGroup = professionalTheme[category];
  
  if (typeof colorGroup === 'string') {
    return `hsl(${colorGroup})`;
  }
  
  if (shade && typeof colorGroup === 'object' && shade in colorGroup) {
    return `hsl(${(colorGroup as any)[shade]})`;
  }
  
  // Return primary shade if available
  if (typeof colorGroup === 'object' && 'primary' in colorGroup) {
    return `hsl(${(colorGroup as any).primary})`;
  }
  
  return '';
}

// =============================================================================
// COMPONENT THEME UTILITIES
// =============================================================================

/**
 * Get button theme styles based on variant
 */
export function getButtonTheme(variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary') {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: `hsl(${professionalTheme.primary[500]})`,
        color: `hsl(${professionalTheme.text.inverse})`,
        border: `1px solid hsl(${professionalTheme.primary[500]})`,
        '&:hover': {
          backgroundColor: `hsl(${professionalTheme.primary[600]})`,
          borderColor: `hsl(${professionalTheme.primary[600]})`,
        },
      };
    
    case 'secondary':
      return {
        backgroundColor: `hsl(${professionalTheme.background.secondary})`,
        color: `hsl(${professionalTheme.text.primary})`,
        border: `1px solid hsl(${professionalTheme.border.default})`,
        '&:hover': {
          backgroundColor: `hsl(${professionalTheme.background.tertiary})`,
        },
      };
    
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: `hsl(${professionalTheme.primary[500]})`,
        border: `1px solid hsl(${professionalTheme.primary[500]})`,
        '&:hover': {
          backgroundColor: `hsl(${professionalTheme.primary[50]})`,
        },
      };
    
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: `hsl(${professionalTheme.text.primary})`,
        border: 'none',
        '&:hover': {
          backgroundColor: `hsl(${professionalTheme.background.secondary})`,
        },
      };
  }
}

/**
 * Get card theme styles
 */
export function getCardTheme(elevated: boolean = false) {
  return {
    backgroundColor: `hsl(${professionalTheme.background.primary})`,
    border: `1px solid hsl(${professionalTheme.border.default})`,
    boxShadow: elevated 
      ? globalDesignParams.effects.shadows.lg 
      : globalDesignParams.effects.shadows.sm,
    borderRadius: globalDesignParams.borderRadius.default, // 0px for sharp corners
  };
}

/**
 * Get input theme styles
 */
export function getInputTheme(focused: boolean = false) {
  return {
    backgroundColor: `hsl(${professionalTheme.background.primary})`,
    border: `1px solid hsl(${focused ? professionalTheme.border.focus : professionalTheme.border.default})`,
    color: `hsl(${professionalTheme.text.primary})`,
    borderRadius: globalDesignParams.borderRadius.default, // 0px for sharp corners
    '&::placeholder': {
      color: `hsl(${professionalTheme.text.tertiary})`,
    },
  };
}

// =============================================================================
// RESPONSIVE THEME UTILITIES
// =============================================================================

/**
 * Get spacing values that adapt to screen size
 */
export function getResponsiveSpacing(base: keyof typeof globalDesignParams.spacing) {
  const baseValue = globalDesignParams.spacing[base];
  return {
    mobile: baseValue,
    tablet: globalDesignParams.spacing[base] || baseValue,
    desktop: globalDesignParams.spacing[base] || baseValue,
  };
}

// =============================================================================
// THEME VALIDATION
// =============================================================================

/**
 * Validate that theme follows design principles
 */
export function validateThemeCompliance() {
  const principles = globalDesignParams.principles;
  
  return {
    sharpCorners: principles.sharpCorners, // Should be true
    noGradients: principles.noGradients,   // Should be true
    professionalTheme: principles.professionalTheme, // Should be true
    minimumCardUsage: principles.minimumCardUsage,   // Should be true
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default professionalTheme;
export { globalDesignParams };