# Complete Folder Structure Reference

## Overview

This document provides a complete reference for the project's folder structure, explaining the purpose of each directory and file organization pattern.

---

## Root Structure

```
project-root/
├── client/                 # Frontend application
├── server/                 # Backend application
├── shared/                 # Shared code between client and server
├── docs/                   # Documentation
├── attached_assets/        # User-uploaded assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite build configuration
```

---

## Client Structure (Frontend)

```
client/
├── src/
│   ├── components/              # UI Components
│   │   ├── atoms/              # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx (optional)
│   │   │   │   └── index.ts
│   │   │   ├── Icon/
│   │   │   ├── Text/
│   │   │   ├── Input/
│   │   │   ├── TextArea/
│   │   │   ├── Checkbox/
│   │   │   ├── Radio/
│   │   │   ├── Switch/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   ├── Skeleton/
│   │   │   ├── Label/
│   │   │   ├── Separator/
│   │   │   └── HelperText/
│   │   │
│   │   ├── molecules/          # Composite components
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Card.types.ts
│   │   │   │   ├── variants/
│   │   │   │   │   ├── InfoCard.tsx
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── TransactionCard.tsx
│   │   │   │   │   ├── ExpandableCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── Avatar/
│   │   │   ├── FormField/
│   │   │   ├── SearchBar/
│   │   │   ├── Dropdown/
│   │   │   ├── DatePicker/
│   │   │   ├── TimePicker/
│   │   │   ├── FileUpload/
│   │   │   ├── ProgressBar/
│   │   │   ├── Tooltip/
│   │   │   ├── Popover/
│   │   │   └── Tag/
│   │   │
│   │   ├── organisms/          # Complex components
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.types.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── Logo.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── NotificationMenu.tsx
│   │   │   │   │   └── UserMenu.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   ├── Navigation/
│   │   │   ├── DataTable/
│   │   │   ├── Pagination/
│   │   │   ├── Breadcrumbs/
│   │   │   ├── Tabs/
│   │   │   ├── Timeline/
│   │   │   ├── Wizard/
│   │   │   ├── Calendar/
│   │   │   ├── Carousel/
│   │   │   └── List/
│   │   │
│   │   ├── overlays/           # Modal & overlay components
│   │   │   ├── Modal/
│   │   │   ├── Dialog/
│   │   │   ├── Drawer/
│   │   │   ├── Toast/
│   │   │   ├── Popover/
│   │   │   ├── ContextMenu/
│   │   │   └── AlertDialog/
│   │   │
│   │   ├── finance/            # Domain-specific components
│   │   │   ├── LoanCalculator/
│   │   │   ├── PaymentCard/
│   │   │   ├── EMISchedule/
│   │   │   ├── CreditScore/
│   │   │   ├── TransactionHistory/
│   │   │   └── LoanCard/
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── PageShell/
│   │   │   ├── Container/
│   │   │   ├── Grid/
│   │   │   ├── Stack/
│   │   │   ├── Section/
│   │   │   └── Center/
│   │   │
│   │   ├── optimized/          # Performance optimized components
│   │   │   ├── LazyImage/
│   │   │   ├── MemoizedCard/
│   │   │   └── VirtualList/
│   │   │
│   │   └── ui/                 # shadcn/ui components (existing)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useModal.ts
│   │   ├── useToast.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useClickOutside.ts
│   │   ├── useWindowSize.ts
│   │   ├── useScrollPosition.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useCopyToClipboard.ts
│   │   ├── useToggle.ts
│   │   ├── useCounter.ts
│   │   ├── useInterval.ts
│   │   ├── useTimeout.ts
│   │   ├── useHover.ts
│   │   ├── useFocus.ts
│   │   ├── useAsync.ts
│   │   ├── useFormField.ts
│   │   ├── useArray.ts
│   │   ├── usePortal.ts
│   │   ├── useComponentHelpers.ts
│   │   └── index.ts
│   │
│   ├── lib/                    # Library utilities
│   │   ├── design-tokens.ts   # Design system tokens
│   │   ├── global-theme.ts    # Theme configuration
│   │   ├── utils.ts           # Utility functions
│   │   ├── queryClient.ts     # React Query setup
│   │   ├── validators.ts      # Form validators
│   │   └── formatters.ts      # Data formatters
│   │
│   ├── pages/                  # Application pages
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   ├── profile.tsx
│   │   ├── dashboard.tsx
│   │   └── ...
│   │
│   ├── styles/                 # Global styles
│   │   ├── index.css          # Main stylesheet
│   │   ├── tokens.css         # CSS variables
│   │   └── animations.css     # Custom animations
│   │
│   ├── types/                  # TypeScript types
│   │   ├── components.ts      # Component type definitions
│   │   ├── theme.ts           # Theme types
│   │   ├── api.ts             # API types
│   │   └── global.d.ts        # Global type declarations
│   │
│   ├── utils/                  # Utility functions
│   │   ├── cn.ts              # Class name utilities
│   │   ├── formatCurrency.ts  # Currency formatting
│   │   ├── formatDate.ts      # Date formatting
│   │   ├── validators.ts      # Validation utilities
│   │   ├── component-helpers.ts # Component helpers
│   │   └── index.ts
│   │
│   ├── data/                   # Static data
│   │   ├── constants.ts
│   │   ├── config.ts
│   │   └── mock-data.ts
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global CSS
│
├── public/                     # Static assets
│   ├── fonts/
│   ├── images/
│   └── icons/
│
└── index.html                  # HTML template
```

---

## Server Structure (Backend)

```
server/
├── routes.ts                   # API route definitions
├── storage.ts                  # Storage interface
├── vite.ts                     # Vite server setup
└── index.ts                    # Server entry point
```

---

## Shared Structure

```
shared/
└── schema.ts                   # Shared database schemas and types
```

---

## Documentation Structure

```
docs/
├── UI_COMPONENT_ARCHITECTURE.md        # Main architecture doc
├── COMPONENT_IMPLEMENTATION_GUIDE.md   # Implementation guide
├── DESIGN_SYSTEM_TOKENS.md            # Design tokens reference
├── FOLDER_STRUCTURE.md                 # This file
├── API_DOCUMENTATION.md                # API documentation
└── TESTING_GUIDE.md                    # Testing guidelines
```

---

## Component File Organization

### Pattern for Atoms/Molecules/Organisms

```
ComponentName/
├── ComponentName.tsx           # Main component implementation
├── ComponentName.types.ts      # TypeScript interfaces and types
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook stories (optional)
├── variants/                   # Component variants (if applicable)
│   ├── VariantOne.tsx
│   ├── VariantTwo.tsx
│   └── index.ts
├── components/                 # Sub-components (if applicable)
│   ├── SubComponent.tsx
│   └── index.ts
└── index.ts                    # Barrel export
```

### Example: Button Component

```
Button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

### Example: Card Component (with variants)

```
Card/
├── Card.tsx
├── Card.types.ts
├── Card.test.tsx
├── variants/
│   ├── InfoCard.tsx
│   ├── ProductCard.tsx
│   ├── TransactionCard.tsx
│   └── index.ts
└── index.ts
```

### Example: Header Component (with sub-components)

```
Header/
├── Header.tsx
├── Header.types.ts
├── Header.test.tsx
├── components/
│   ├── Logo.tsx
│   ├── Navigation.tsx
│   ├── SearchBar.tsx
│   ├── NotificationMenu.tsx
│   ├── UserMenu.tsx
│   └── index.ts
└── index.ts
```

---

## Import Path Patterns

### Using Path Aliases

```typescript
// Components
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { Header } from '@/components/organisms/Header';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';

// Utilities
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';

// Types
import type { ButtonProps } from '@/types/components';

// Design Tokens
import { colorPalettes, spacing } from '@/lib/design-tokens';
```

### Barrel Exports

```typescript
// components/atoms/index.ts
export * from './Button';
export * from './Icon';
export * from './Text';
export * from './Input';

// Import multiple atoms
import { Button, Icon, Text, Input } from '@/components/atoms';
```

---

## File Naming Conventions

### Components
- **PascalCase** for component files: `Button.tsx`, `UserCard.tsx`
- **kebab-case** for utility files: `component-helpers.ts`, `format-currency.ts`
- **camelCase** for hooks: `useModal.ts`, `useDebounce.ts`

### Types
- **PascalCase** for type files: `Button.types.ts`, `Card.types.ts`
- Interface names match component: `ButtonProps`, `CardProps`

### Tests
- **PascalCase** with `.test.tsx` suffix: `Button.test.tsx`
- Co-located with component being tested

### Stories (Storybook)
- **PascalCase** with `.stories.tsx` suffix: `Button.stories.tsx`
- Co-located with component

---

## Directory Organization Principles

1. **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
2. **Co-location**: Related files stay together (component, types, tests, stories)
3. **Feature-based**: Domain-specific components in their own directories
4. **Separation of Concerns**: Clear separation between UI, logic, and data
5. **Barrel Exports**: Clean import paths using index.ts files
6. **Type Safety**: Dedicated type files for better organization

---

## Migration Strategy

### From ui/ to Atomic Structure

1. **Identify component type** (atom, molecule, or organism)
2. **Create proper folder structure**
3. **Extract types to separate file**
4. **Add tests and stories**
5. **Update imports throughout codebase**

### Example Migration

```bash
# Before
client/src/components/ui/button.tsx

# After
client/src/components/atoms/Button/
├── Button.tsx
├── Button.types.ts
├── Button.test.tsx
└── index.ts
```

---

## Best Practices

### DO:
- Keep components in their appropriate atomic level
- Co-locate related files (component, types, tests)
- Use barrel exports for clean imports
- Follow consistent naming conventions
- Create dedicated type files for complex components
- Test components thoroughly

### DON'T:
- Mix different atomic levels in the same directory
- Create deep nesting (max 3 levels)
- Duplicate components across directories
- Skip type definitions
- Forget barrel exports
- Leave tests or documentation incomplete

---

## Quick Reference

### Creating New Atom

```bash
mkdir -p client/src/components/atoms/MyComponent
cd client/src/components/atoms/MyComponent
touch MyComponent.tsx MyComponent.types.ts MyComponent.test.tsx index.ts
```

### Creating New Molecule

```bash
mkdir -p client/src/components/molecules/MyComponent
cd client/src/components/molecules/MyComponent
touch MyComponent.tsx MyComponent.types.ts MyComponent.test.tsx index.ts
mkdir variants
```

### Creating New Organism

```bash
mkdir -p client/src/components/organisms/MyComponent
cd client/src/components/organisms/MyComponent
touch MyComponent.tsx MyComponent.types.ts MyComponent.test.tsx index.ts
mkdir components
```

---

*This folder structure ensures maintainability, scalability, and developer experience.*
