/**
 * Global Parameters Utilities
 * Easy access to global design parameters throughout the application
 * 
 * This module provides utilities for consistently accessing design tokens
 * and global parameters across all components and pages.
 */

import { globalDesignParams } from './design-tokens';

// =============================================================================
// SPACING UTILITIES
// =============================================================================

/**
 * Get consistent spacing values using the global spacing scale
 * Usage: getSpacing('md') => '12px'
 */
export function getSpacing(size: keyof typeof globalDesignParams.spacing): string {
  return globalDesignParams.spacing[size];
}

/**
 * Get multiple spacing values for compound spacing (e.g., padding)
 * Usage: getSpacingMultiple(['sm', 'lg']) => '8px 20px'
 */
export function getSpacingMultiple(sizes: Array<keyof typeof globalDesignParams.spacing>): string {
  return sizes.map(size => globalDesignParams.spacing[size]).join(' ');
}

// =============================================================================
// TYPOGRAPHY UTILITIES
// =============================================================================

/**
 * Get font size from global typography system
 * Usage: getFontSize('lg') => '18px'
 */
export function getFontSize(size: keyof typeof globalDesignParams.typography.fontSizes): string {
  return globalDesignParams.typography.fontSizes[size];
}

/**
 * Get font weight from global typography system
 * Usage: getFontWeight('semibold') => '600'
 */
export function getFontWeight(weight: keyof typeof globalDesignParams.typography.fontWeights): string {
  return globalDesignParams.typography.fontWeights[weight];
}

/**
 * Get complete typography configuration for a given size
 * Usage: getTypography('lg') => { fontSize: '18px', lineHeight: '1.5', ... }
 */
export function getTypography(size: keyof typeof globalDesignParams.typography.fontSizes) {
  return {
    fontSize: globalDesignParams.typography.fontSizes[size],
    lineHeight: globalDesignParams.typography.lineHeights.normal,
    fontWeight: globalDesignParams.typography.fontWeights.normal,
  };
}

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Get professional red theme colors from CSS variables
 * Usage: getPrimaryColor(500) => 'hsl(var(--red-500))'
 */
export function getPrimaryColor(shade: keyof typeof globalDesignParams.colors.primary): string {
  return `hsl(var(--red-${shade}))`;
}

/**
 * Get neutral colors for backgrounds and text from CSS variables
 * Usage: getNeutralColor(200) => 'hsl(var(--gray-200))'
 */
export function getNeutralColor(shade: keyof typeof globalDesignParams.colors.neutral): string {
  return `hsl(var(--gray-${shade}))`;
}

// =============================================================================
// EFFECTS UTILITIES
// =============================================================================

/**
 * Get shadow values for defined edges
 * Usage: getShadow('crisp') => '0 1px 3px 0 rgb(0 0 0 / 0.1)'
 */
export function getShadow(type: keyof typeof globalDesignParams.effects.shadows): string {
  return globalDesignParams.effects.shadows[type];
}

/**
 * Get blur values for effects
 * Usage: getBlur('md') => '8px'
 */
export function getBlur(size: keyof typeof globalDesignParams.effects.blur): string {
  return globalDesignParams.effects.blur[size];
}

// =============================================================================
// ANIMATION UTILITIES
// =============================================================================

/**
 * Get animation duration
 * Usage: getAnimationDuration('normal') => '200ms'
 */
export function getAnimationDuration(speed: keyof typeof globalDesignParams.animations.durations): string {
  return globalDesignParams.animations.durations[speed];
}

/**
 * Get easing function
 * Usage: getEasing('smooth') => 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
 */
export function getEasing(type: keyof typeof globalDesignParams.animations.easings): string {
  return globalDesignParams.animations.easings[type];
}

/**
 * Create complete transition string
 * Usage: createTransition('all', 'normal', 'smooth') => 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
 */
export function createTransition(
  property: string = 'all',
  duration: keyof typeof globalDesignParams.animations.durations = 'normal',
  easing: keyof typeof globalDesignParams.animations.easings = 'easeInOut'
): string {
  return `${property} ${getAnimationDuration(duration)} ${getEasing(easing)}`;
}

// =============================================================================
// COMPONENT SIZING UTILITIES
// =============================================================================

/**
 * Get button sizing configuration
 * Usage: getButtonSize('md') => { height: '40px', padding: '8px 16px', fontSize: '16px' }
 */
export function getButtonSize(size: keyof typeof globalDesignParams.sizing.buttons) {
  return globalDesignParams.sizing.buttons[size];
}

/**
 * Get input sizing configuration
 * Usage: getInputSize('lg') => { height: '48px', padding: '12px 16px', fontSize: '18px' }
 */
export function getInputSize(size: keyof typeof globalDesignParams.sizing.inputs) {
  return globalDesignParams.sizing.inputs[size];
}

// =============================================================================
// DESIGN PRINCIPLES ACCESS
// =============================================================================

/**
 * Check if design principle is enabled
 * Usage: isDesignPrincipleEnabled('sharpCorners') => true
 */
export function isDesignPrincipleEnabled(principle: keyof typeof globalDesignParams.principles): boolean {
  return globalDesignParams.principles[principle];
}

/**
 * Get all design principles
 * Usage: getDesignPrinciples() => { sharpCorners: true, ... }
 */
export function getDesignPrinciples() {
  return globalDesignParams.principles;
}

// =============================================================================
// CSS-IN-JS HELPERS
// =============================================================================

/**
 * Generate CSS object for component styling using global parameters
 * Usage: generateComponentStyles({ spacing: 'md', shadow: 'crisp' })
 */
export function generateComponentStyles(config: {
  spacing?: keyof typeof globalDesignParams.spacing;
  fontSize?: keyof typeof globalDesignParams.typography.fontSizes;
  fontWeight?: keyof typeof globalDesignParams.typography.fontWeights;
  shadow?: keyof typeof globalDesignParams.effects.shadows;
  borderRadius?: keyof typeof globalDesignParams.borderRadius;
}) {
  const styles: Record<string, string> = {};

  if (config.spacing) {
    styles.padding = getSpacing(config.spacing);
  }
  
  if (config.fontSize) {
    styles.fontSize = getFontSize(config.fontSize);
  }
  
  if (config.fontWeight) {
    styles.fontWeight = getFontWeight(config.fontWeight);
  }
  
  if (config.shadow) {
    styles.boxShadow = getShadow(config.shadow);
  }
  
  if (config.borderRadius) {
    styles.borderRadius = globalDesignParams.borderRadius[config.borderRadius];
  }

  return styles;
}

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

/**
 * Get spacing for different screen sizes
 * Usage: getResponsiveSpacing({ mobile: 'sm', desktop: 'lg' })
 */
export function getResponsiveSpacing(config: {
  mobile?: keyof typeof globalDesignParams.spacing;
  tablet?: keyof typeof globalDesignParams.spacing;
  desktop?: keyof typeof globalDesignParams.spacing;
}) {
  return {
    mobile: config.mobile ? getSpacing(config.mobile) : undefined,
    tablet: config.tablet ? getSpacing(config.tablet) : undefined,
    desktop: config.desktop ? getSpacing(config.desktop) : undefined,
  };
}

// =============================================================================
// EXPORT GLOBAL PARAMETERS FOR DIRECT ACCESS
// =============================================================================

export { globalDesignParams };

// Export commonly used constants for easy access
export const SPACING = globalDesignParams.spacing;
export const TYPOGRAPHY = globalDesignParams.typography;
export const COLORS = globalDesignParams.colors;
export const EFFECTS = globalDesignParams.effects;
export const ANIMATIONS = globalDesignParams.animations;
export const SIZING = globalDesignParams.sizing;
export const PRINCIPLES = globalDesignParams.principles;