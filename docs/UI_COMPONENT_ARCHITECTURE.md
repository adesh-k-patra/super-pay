# Global UI Component Architecture

## Table of Contents
1. [Overview](#overview)
2. [Design System Principles](#design-system-principles)
3. [Folder Structure](#folder-structure)
4. [Design Tokens](#design-tokens)
5. [Component Library](#component-library)
6. [Implementation Guidelines](#implementation-guidelines)
7. [Testing Strategy](#testing-strategy)
8. [Accessibility Standards](#accessibility-standards)

---

## Overview

This document outlines the complete UI component architecture for a maintainable, testable, and scalable design system. Built on Atomic Design principles with React, TypeScript, Tailwind CSS, and shadcn/ui.

### Tech Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + CSS-in-JS for design tokens
- **Component Library**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query for server state
- **Testing**: Vitest + React Testing Library
- **Documentation**: Storybook (optional)

---

## Design System Principles

### Core Principles
1. **Sharp, Professional Design**: Zero border-radius throughout (sharp corners)
2. **Dark-First Theme**: Dark mode as the primary theme
3. **Defined Edges**: Crisp shadows and clear boundaries
4. **Neumorphic Elements**: Subtle depth with modern neumorphism
5. **Glassmorphic Accents**: Strategic use of glass effects for premium feel
6. **Accessibility First**: WCAG 2.1 AA compliance minimum
7. **Mobile-First**: Responsive design from 320px upward
8. **Type Safety**: Strict TypeScript throughout

### Visual Language
- **Border Radius**: 0px (sharp corners for professional look)
- **Color Palette**: Dark background with white accents
- **Spacing Scale**: 4px base unit (0.25rem increments)
- **Typography**: Inter font family with systematic scale
- **Shadows**: Crisp, defined shadows for depth

---

## Folder Structure

```
client/src/
├── components/
│   ├── atoms/                    # Atomic components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Icon/
│   │   │   ├── Icon.tsx
│   │   │   ├── Icon.types.ts
│   │   │   └── index.ts
│   │   ├── Text/
│   │   │   ├── Text.tsx
│   │   │   ├── Text.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── TextArea/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── Switch/
│   │   ├── Badge/
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   └── Separator/
│   │
│   ├── molecules/                # Composite components
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.types.ts
│   │   │   ├── variants/
│   │   │   │   ├── InfoCard.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── TransactionCard.tsx
│   │   │   │   └── ExpandableCard.tsx
│   │   │   └── index.ts
│   │   ├── FormField/
│   │   ├── Avatar/
│   │   ├── Dropdown/
│   │   ├── SearchBar/
│   │   ├── DatePicker/
│   │   ├── TimePicker/
│   │   ├── FileUpload/
│   │   ├── ProgressBar/
│   │   └── Tooltip/
│   │
│   ├── organisms/                # Complex components
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── variants/
│   │   │   │   ├── AppHeader.tsx
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── Sidebar/
│   │   ├── Navigation/
│   │   ├── DataTable/
│   │   ├── Pagination/
│   │   ├── Breadcrumbs/
│   │   ├── Tabs/
│   │   ├── Timeline/
│   │   ├── Wizard/
│   │   ├── Calendar/
│   │   ├── Carousel/
│   │   └── Footer/
│   │
│   ├── overlays/                 # Modal & overlay components
│   │   ├── Modal/
│   │   ├── Dialog/
│   │   ├── Drawer/
│   │   ├── Toast/
│   │   ├── Popover/
│   │   └── ContextMenu/
│   │
│   ├── finance/                  # Domain-specific components
│   │   ├── LoanCalculator/
│   │   ├── PaymentCard/
│   │   ├── EMISchedule/
│   │   ├── CreditScore/
│   │   └── TransactionHistory/
│   │
│   ├── layout/                   # Layout components
│   │   ├── PageShell/
│   │   ├── Container/
│   │   ├── Grid/
│   │   ├── Stack/
│   │   └── Section/
│   │
│   └── ui/                       # shadcn/ui components (current)
│
├── hooks/
│   ├── useModal.ts
│   ├── useToast.ts
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useForm.ts
│   └── index.ts
│
├── lib/
│   ├── design-tokens.ts          # Design system tokens
│   ├── global-theme.ts           # Theme configuration
│   ├── utils.ts                  # Utility functions
│   ├── validators.ts             # Form validators
│   └── formatters.ts             # Data formatters
│
├── styles/
│   ├── index.css                 # Global styles
│   ├── tokens.css                # CSS variables
│   └── animations.css            # Custom animations
│
├── types/
│   ├── components.ts             # Component type definitions
│   ├── theme.ts                  # Theme types
│   └── global.d.ts               # Global type declarations
│
└── utils/
    ├── cn.ts                     # Class name utilities
    ├── formatCurrency.ts
    ├── formatDate.ts
    └── validators.ts
```

---

## Design Tokens

### Color System

#### Primary Palette (Dark Theme)
```typescript
// Neutral Scale
background: hsl(220 15% 8%)      // Deep dark background
foreground: hsl(0 0% 95%)        // Light text
card: hsl(220 15% 10%)           // Card background
border: hsl(220 15% 20%)         // Borders

// Semantic Colors
primary: hsl(0 0% 98%)           // White accent
secondary: hsl(220 15% 18%)      // Secondary surface
muted: hsl(220 15% 15%)          // Muted background
accent: hsl(220 15% 20%)         // Accent background
destructive: hsl(0 85% 58%)      // Error red

// State Colors
success: hsl(142 76% 52%)        // Green
warning: hsl(38 92% 50%)         // Orange
info: hsl(210 100% 55%)          // Blue
danger: hsl(0 84% 60%)           // Red
```

#### Extended Palette
```typescript
// Red Scale (Danger, Destructive)
red-50: hsl(0 86% 97%)
red-500: hsl(0 84% 60%)
red-900: hsl(0 65% 25%)

// Green Scale (Success, Approved)
green-50: hsl(142 76% 97%)
green-500: hsl(142 76% 52%)
green-900: hsl(142 76% 22%)

// Blue Scale (Info, Primary)
blue-50: hsl(210 100% 97%)
blue-500: hsl(210 100% 55%)
blue-900: hsl(210 100% 25%)

// Purple Scale (Premium)
purple-50: hsl(270 100% 98%)
purple-500: hsl(270 91% 65%)
purple-900: hsl(273 67% 39%)

// Yellow Scale (Warning)
yellow-50: hsl(48 100% 96%)
yellow-500: hsl(38 92% 50%)
yellow-900: hsl(23 83% 31%)

// Teal Scale (Financial)
teal-50: hsl(166 76% 97%)
teal-500: hsl(173 58% 39%)
teal-900: hsl(176 87% 18%)

// Gray Scale (Neutral)
gray-50: hsl(210 20% 98%)
gray-500: hsl(220 9% 46%)
gray-900: hsl(221 39% 11%)
```

### Typography Scale

```typescript
// Font Families
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  serif: ['Georgia', 'serif'],
  mono: ['Menlo', 'Monaco', 'monospace'],
}

// Font Sizes
fontSize: {
  xs: '0.75rem',      // 12px - Caption, Helper Text
  sm: '0.875rem',     // 14px - Small Body, Labels
  base: '1rem',       // 16px - Body Text
  lg: '1.125rem',     // 18px - Large Body
  xl: '1.25rem',      // 20px - Subheading
  '2xl': '1.5rem',    // 24px - Heading 3
  '3xl': '1.875rem',  // 30px - Heading 2
  '4xl': '2.25rem',   // 36px - Heading 1
  '5xl': '3rem',      // 48px - Hero Heading
  '6xl': '3.75rem',   // 60px - Display
}

// Font Weights
fontWeight: {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

// Line Heights
lineHeight: {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
}

// Letter Spacing
letterSpacing: {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}
```

### Spacing Scale

```typescript
// Base Unit: 4px (0.25rem)
spacing: {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  2: '0.5rem',        // 8px
  3: '0.75rem',       // 12px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  8: '2rem',          // 32px
  10: '2.5rem',       // 40px
  12: '3rem',         // 48px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
}
```

### Shadow Scale

```typescript
// Sharp, Defined Shadows
boxShadow: {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 2px 4px 0 rgb(0 0 0 / 0.06)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 8px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 12px 25px -5px rgb(0 0 0 / 0.12)',
  '2xl': '0 20px 40px -12px rgb(0 0 0 / 0.15)',
  sharp: '0 2px 8px 0 rgb(0 0 0 / 0.12)',
  crisp: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  
  // Neumorphic Shadows
  'neu-flat': `
    8px 8px 16px hsl(220 15% 3%),
    -8px -8px 16px hsl(220 15% 13%)
  `,
  'neu-raised': `
    12px 12px 24px hsl(220 15% 2%),
    -12px -12px 24px hsl(220 15% 14%)
  `,
  'neu-inset': `
    inset 4px 4px 8px hsl(220 15% 3%),
    inset -4px -4px 8px hsl(220 15% 13%)
  `,
}
```

### Border Radius

```typescript
// Sharp Corners Throughout
borderRadius: {
  none: '0px',
  xs: '0px',
  sm: '0px',
  md: '0px',
  lg: '0px',
  xl: '0px',
  '2xl': '0px',
  full: '0px',
  sharp: '0px',  // Explicit sharp corner utility
}
```

### Animation & Transitions

```typescript
// Durations
transition: {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
}

// Timing Functions
transitionTimingFunction: {
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

// Keyframe Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## Component Library

### Atoms (Basic Building Blocks)

#### 1. Button Component

**Variants:**
- `primary` - Main action button (white on dark)
- `secondary` - Secondary actions (dark with border)
- `ghost` - Subtle button (transparent)
- `link` - Text button with underline
- `icon` - Icon-only button
- `fab` - Floating action button
- `danger` - Destructive action (red)
- `success` - Success action (green)

**Sizes:**
- `sm` - 32px height
- `md` - 40px height (default)
- `lg` - 48px height
- `xl` - 56px height

**States:**
- `default` - Normal state
- `hover` - Mouse hover
- `active` - Pressed/clicked
- `focus` - Keyboard focus
- `disabled` - Non-interactive
- `loading` - Async operation

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'icon' | 'fab' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  'data-testid'?: string;
}
```

**Usage:**
```tsx
<Button variant="primary" size="lg" leftIcon={<PlusIcon />}>
  Create Account
</Button>

<Button variant="danger" isLoading>
  Delete
</Button>

<Button variant="icon" size="sm">
  <SearchIcon />
</Button>
```

#### 2. Text Component

**Variants:**
- `h1` - Hero heading (48px)
- `h2` - Page heading (36px)
- `h3` - Section heading (30px)
- `h4` - Sub-section heading (24px)
- `h5` - Card heading (20px)
- `h6` - Small heading (18px)
- `body` - Body text (16px)
- `caption` - Helper text (14px)
- `overline` - Small caps label (12px)

**Props:**
```typescript
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  'data-testid'?: string;
}
```

#### 3. Icon Component

**Props:**
```typescript
interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  'data-testid'?: string;
}
```

**Icon Sizes:**
- `xs` - 12px
- `sm` - 16px
- `md` - 20px
- `lg` - 24px
- `xl` - 32px

#### 4. Input Controls

**TextInput:**
```typescript
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  'data-testid'?: string;
}
```

**TextArea:**
```typescript
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  'data-testid'?: string;
}
```

**NumberInput:**
```typescript
interface NumberInputProps extends Omit<TextInputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  showStepper?: boolean;
  formatValue?: (value: number) => string;
}
```

**SearchInput:**
```typescript
interface SearchInputProps extends Omit<TextInputProps, 'type'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
}
```

#### 5. Select & Pickers

**Select:**
```typescript
interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value?: T | T[];
  onChange: (value: T | T[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  label?: string;
  error?: string;
  'data-testid'?: string;
}

interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
}
```

**AsyncSelect:**
```typescript
interface AsyncSelectProps<T = string> extends Omit<SelectProps<T>, 'options'> {
  loadOptions: (inputValue: string) => Promise<SelectOption<T>[]>;
  cacheOptions?: boolean;
  defaultOptions?: SelectOption<T>[];
}
```

**ComboBox:**
```typescript
interface ComboBoxProps<T = string> {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  emptyMessage?: string;
  'data-testid'?: string;
}
```

#### 6. Form Controls

**Checkbox:**
```typescript
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
  'data-testid'?: string;
}
```

**Radio:**
```typescript
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  'data-testid'?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  'data-testid'?: string;
}
```

**Switch:**
```typescript
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  'data-testid'?: string;
}
```

#### 7. Feedback Elements

**Badge:**
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  'data-testid'?: string;
}
```

**Spinner:**
```typescript
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  'data-testid'?: string;
}
```

**Progress:**
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  indeterminate?: boolean;
  'data-testid'?: string;
}
```

**Skeleton:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  'data-testid'?: string;
}
```

---

### Molecules (Composite Components)

#### 1. Card Component

**Base Card:**
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  'data-testid'?: string;
}
```

**Card Variants:**

**InfoCard:**
```typescript
interface InfoCardProps extends CardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
}
```

**ProductCard:**
```typescript
interface ProductCardProps extends CardProps {
  image: string;
  title: string;
  price: number;
  currency?: string;
  rating?: number;
  onAddToCart?: () => void;
}
```

**TransactionCard:**
```typescript
interface TransactionCardProps extends CardProps {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
  status?: 'pending' | 'completed' | 'failed';
}
```

**ExpandableCard:**
```typescript
interface ExpandableCardProps extends CardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}
```

#### 2. Avatar Component

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  badge?: React.ReactNode;
  'data-testid'?: string;
}
```

**Sizes:**
- `xs` - 24px
- `sm` - 32px
- `md` - 40px
- `lg` - 48px
- `xl` - 64px
- `2xl` - 96px

#### 3. FormField Component

```typescript
interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}
```

#### 4. SearchBar Component

```typescript
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
  debounceMs?: number;
  'data-testid'?: string;
}
```

#### 5. DatePicker & TimePicker

**DatePicker:**
```typescript
interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  format?: string;
  label?: string;
  error?: string;
  'data-testid'?: string;
}
```

**DateRangePicker:**
```typescript
interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onSelect: (range: { from?: Date; to?: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  'data-testid'?: string;
}
```

**TimePicker:**
```typescript
interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  format?: '12h' | '24h';
  step?: number;
  label?: string;
  error?: string;
  'data-testid'?: string;
}
```

#### 6. FileUpload Component

```typescript
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  label?: string;
  error?: string;
  'data-testid'?: string;
}
```

#### 7. Tooltip Component

```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  arrow?: boolean;
  'data-testid'?: string;
}
```

---

### Organisms (Complex Components)

#### 1. Header / AppBar

```typescript
interface HeaderProps {
  variant?: 'default' | 'transparent' | 'sticky' | 'fixed';
  logo?: React.ReactNode;
  navigation?: NavigationItem[];
  searchBar?: boolean;
  notifications?: NotificationItem[];
  userMenu?: UserMenuProps;
  actions?: React.ReactNode;
  'data-testid'?: string;
}
```

#### 2. Sidebar / Drawer

```typescript
interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  variant?: 'permanent' | 'temporary' | 'collapsible';
  position?: 'left' | 'right';
  width?: number;
  'data-testid'?: string;
}
```

#### 3. DataTable Component

```typescript
interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  selection?: SelectionConfig;
  actions?: TableAction<T>[];
  virtualization?: boolean;
  'data-testid'?: string;
}

interface Column<T = any> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
}
```

#### 4. Pagination Component

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showFirstLast?: boolean;
  showPageSize?: boolean;
  'data-testid'?: string;
}
```

#### 5. Breadcrumbs Component

```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  'data-testid'?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
```

#### 6. Tabs Component

```typescript
interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  'data-testid'?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}
```

#### 7. Timeline Component

```typescript
interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternate' | 'left' | 'right';
  'data-testid'?: string;
}

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: Date;
  icon?: React.ReactNode;
  status?: 'completed' | 'active' | 'pending';
}
```

#### 8. Wizard / Stepper Component

```typescript
interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  'data-testid'?: string;
}

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isValid?: boolean;
  isOptional?: boolean;
}
```

#### 9. Calendar Component

```typescript
interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | DateRange;
  onSelect: (date: Date | Date[] | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  events?: CalendarEvent[];
  'data-testid'?: string;
}
```

#### 10. Carousel / Slider Component

```typescript
interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  loop?: boolean;
  itemsPerView?: number;
  'data-testid'?: string;
}
```

---

### Overlays (Modal & Overlay Components)

#### 1. Modal / Dialog Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  'data-testid'?: string;
}
```

#### 2. Drawer Component

```typescript
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  'data-testid'?: string;
}
```

#### 3. Toast Component

```typescript
interface ToastProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  description: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  'data-testid'?: string;
}

// Toast Hook
const useToast = () => {
  const toast = (props: ToastProps) => void;
  const dismiss = (id: string) => void;
  return { toast, dismiss };
};
```

#### 4. Popover Component

```typescript
interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  arrow?: boolean;
  'data-testid'?: string;
}
```

#### 5. Context Menu Component

```typescript
interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  'data-testid'?: string;
}

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
  divider?: boolean;
}
```

---

## Implementation Guidelines

### 1. Component Structure

Every component should follow this structure:

```
ComponentName/
├── ComponentName.tsx          # Main component implementation
├── ComponentName.types.ts     # TypeScript interfaces and types
├── ComponentName.stories.tsx  # Storybook stories (optional)
├── ComponentName.test.tsx     # Unit tests
└── index.ts                   # Barrel export
```

### 2. Component Template

```typescript
// ComponentName.types.ts
import { HTMLAttributes } from 'react';

export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  'data-testid'?: string;
}

// ComponentName.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ComponentNameProps } from './ComponentName.types';

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ 
    variant = 'default', 
    size = 'md', 
    isDisabled = false,
    className,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-testid={dataTestId || 'component-name'}
        className={cn(
          'base-classes',
          {
            'variant-default': variant === 'default',
            'variant-primary': variant === 'primary',
            'size-sm': size === 'sm',
            'size-md': size === 'md',
            'opacity-50 cursor-not-allowed': isDisabled,
          },
          className
        )}
        {...props}
      />
    );
  }
);

ComponentName.displayName = 'ComponentName';

// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### 3. Styling Guidelines

#### Use Tailwind Classes with cn() Utility
```typescript
import { cn } from '@/lib/utils';

const classes = cn(
  'base-class',
  condition && 'conditional-class',
  {
    'variant-a': variant === 'a',
    'variant-b': variant === 'b',
  },
  className // Allow className override
);
```

#### Design Token Usage
```typescript
// Use CSS variables from design tokens
<div style={{ 
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
}} />

// Or use Tailwind classes
<div className="bg-background text-foreground" />
```

#### Component Variants with CVA
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

### 4. State Management

```typescript
// Local state with useState
const [value, setValue] = useState<string>('');

// Form state with react-hook-form
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

// Server state with React Query
const { data, isLoading } = useQuery({
  queryKey: ['/api/data'],
});
```

### 5. Accessibility (a11y)

```typescript
// Always include ARIA attributes
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
  role="button"
  tabIndex={0}
/>

// Keyboard navigation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick?.();
  }
};

// Focus management
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  if (isOpen) {
    ref.current?.focus();
  }
}, [isOpen]);
```

### 6. Error Handling

```typescript
// Error boundaries for component errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>

// Async error handling
const { data, error, isError } = useQuery({
  queryKey: ['/api/data'],
  onError: (error) => {
    toast.error('Failed to load data');
  },
});

if (isError) {
  return <ErrorState error={error} />;
}
```

### 7. Performance Optimization

```typescript
// Memoization
const MemoizedComponent = memo(Component);

// Callback memoization
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// Value memoization
const computedValue = useMemo(() => {
  return expensiveComputation(data);
}, [data]);

// Code splitting
const LazyComponent = lazy(() => import('./Component'));

// Virtualization for large lists
<VirtualList
  items={largeDataset}
  itemHeight={50}
  renderItem={(item) => <ListItem {...item} />}
/>
```

---

## Testing Strategy

### 1. Unit Testing

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByTestId('component-name')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByTestId('component-name'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    render(<ComponentName variant="primary" />);
    expect(screen.getByTestId('component-name')).toHaveClass('variant-primary');
  });

  it('is accessible', () => {
    const { container } = render(<ComponentName />);
    // Add accessibility assertions
  });
});
```

### 2. Integration Testing

```typescript
describe('Form Integration', () => {
  it('submits form with valid data', async () => {
    render(<ContactForm />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello world');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

### 3. Visual Testing (Storybook)

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Atoms/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### 1. Color Contrast
- Text contrast ratio: minimum 4.5:1
- Large text (18pt+): minimum 3:1
- UI components: minimum 3:1

#### 2. Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visual focus indicators
- Skip links for navigation

#### 3. Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Image alt text

#### 4. Responsive Design
- Mobile-first approach
- Touch targets minimum 44x44px
- Zoom support up to 200%
- Text reflow at different viewport sizes

### Implementation Checklist

```typescript
// ✅ Semantic HTML
<button> instead of <div onClick>
<nav> for navigation
<main> for main content
<article> for articles

// ✅ ARIA attributes
aria-label="Descriptive label"
aria-describedby="description-id"
aria-live="polite"
role="button"

// ✅ Keyboard support
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
}}

// ✅ Focus management
const firstFocusable = useRef<HTMLElement>(null);
useEffect(() => {
  firstFocusable.current?.focus();
}, []);

// ✅ Color contrast
// Use design tokens that meet WCAG standards
```

---

## Best Practices

### 1. Component Design
- Single Responsibility Principle
- Composable and reusable
- Props over configuration
- Controlled vs Uncontrolled components

### 2. TypeScript Usage
- Strict type checking
- Generic components where appropriate
- Avoid `any` type
- Export all public types

### 3. Performance
- Lazy load heavy components
- Memoize expensive computations
- Virtualize long lists
- Optimize re-renders

### 4. Documentation
- JSDoc comments for complex logic
- README for each major component
- Storybook stories for visual documentation
- Examples in documentation

### 5. Code Organization
- Atomic design structure
- Co-locate related files
- Barrel exports for clean imports
- Consistent naming conventions

---

## Migration Guide

### Migrating from ui/ to Atomic Structure

1. **Identify Component Type**
   - Atom: Single-purpose, no dependencies
   - Molecule: Combines multiple atoms
   - Organism: Complex, business logic

2. **Create New Structure**
   ```bash
   mkdir -p client/src/components/atoms/Button
   touch client/src/components/atoms/Button/{Button.tsx,Button.types.ts,index.ts}
   ```

3. **Move and Refactor**
   - Extract types to `.types.ts`
   - Add proper TypeScript interfaces
   - Include data-testid attributes
   - Update imports

4. **Update Imports**
   ```typescript
   // Old
   import { Button } from '@/components/ui/button';
   
   // New
   import { Button } from '@/components/atoms/Button';
   ```

---

## Conclusion

This component architecture provides a solid foundation for building maintainable, testable, and accessible UI components. Follow the guidelines, use the design tokens, and maintain consistency across the application.

For questions or contributions, refer to the team documentation or create a pull request with your proposed changes.
