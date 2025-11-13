# UI Component Architecture Documentation

## Welcome to the Component System

This documentation provides everything you need to build, maintain, and extend the UI component library following world-class engineering practices.

---

## 📚 Documentation Index

### Core Documentation

1. **[UI Component Architecture](./UI_COMPONENT_ARCHITECTURE.md)** ⭐ START HERE
   - Complete component architecture overview
   - Design system principles
   - Component library reference (Atoms, Molecules, Organisms)
   - Implementation guidelines
   - Testing strategy
   - Accessibility standards

2. **[Component Implementation Guide](./COMPONENT_IMPLEMENTATION_GUIDE.md)**
   - Quick start guide for engineers
   - Step-by-step component creation
   - Component patterns and examples
   - Styling guidelines
   - Common patterns and solutions
   - Troubleshooting guide

3. **[Design System Tokens](./DESIGN_SYSTEM_TOKENS.md)**
   - Complete token reference
   - Color palettes and semantic colors
   - Typography scale
   - Spacing and sizing
   - Shadows and effects
   - Animation and transitions

4. **[Folder Structure](./FOLDER_STRUCTURE.md)**
   - Complete folder organization
   - File naming conventions
   - Import patterns
   - Migration strategies
   - Best practices

---

## 🚀 Quick Start

### 1. Creating Your First Component

```bash
# Create a new atom component
mkdir -p client/src/components/atoms/MyButton
cd client/src/components/atoms/MyButton

# Create necessary files
touch MyButton.tsx
touch MyButton.types.ts
touch MyButton.test.tsx
touch index.ts
```

### 2. Component Template

```typescript
// MyButton.types.ts
export interface MyButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'data-testid'?: string;
}

// MyButton.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { MyButtonProps } from './MyButton.types';

export const MyButton = forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          {
            'bg-primary text-primary-foreground': variant === 'primary',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
            'h-9 px-3': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

MyButton.displayName = 'MyButton';

// index.ts
export { MyButton } from './MyButton';
export type { MyButtonProps } from './MyButton.types';
```

### 3. Using the Component

```tsx
import { MyButton } from '@/components/atoms/MyButton';

function App() {
  return (
    <MyButton variant="primary" size="lg">
      Click Me
    </MyButton>
  );
}
```

---

## 🏗️ Architecture Overview

### Atomic Design Structure

```
components/
├── atoms/           # Basic building blocks (Button, Icon, Text, Input)
├── molecules/       # Simple composites (Card, FormField, SearchBar)
├── organisms/       # Complex components (Header, Sidebar, DataTable)
├── overlays/        # Modals and overlays (Modal, Drawer, Toast)
├── finance/         # Domain-specific (LoanCalculator, PaymentCard)
├── layout/          # Layout components (Container, Grid, Stack)
└── ui/              # shadcn/ui components (existing)
```

### Component Levels

**Atoms (Basic)**
- Button, Icon, Text, Input, Checkbox, Badge, Spinner

**Molecules (Composite)**
- Card, Avatar, FormField, DatePicker, FileUpload, Tooltip

**Organisms (Complex)**
- Header, Sidebar, DataTable, Pagination, Tabs, Calendar

**Overlays**
- Modal, Drawer, Toast, Popover, AlertDialog

---

## 🎨 Design System

### Core Principles

1. **Sharp, Professional Design** - Zero border-radius (sharp corners)
2. **Dark-First Theme** - Dark mode as primary
3. **Defined Edges** - Crisp shadows and clear boundaries
4. **Neumorphic Elements** - Subtle depth with modern neumorphism
5. **Accessibility First** - WCAG 2.1 AA compliance
6. **Mobile-First** - Responsive from 320px upward
7. **Type Safety** - Strict TypeScript throughout

### Design Tokens

```typescript
// Colors
--background: hsl(220 15% 8%)
--foreground: hsl(0 0% 95%)
--primary: hsl(0 0% 98%)

// Spacing (4px base unit)
spacing: { 1: '4px', 2: '8px', 4: '16px', 8: '32px' }

// Typography
fontSize: { sm: '14px', base: '16px', lg: '18px', xl: '20px' }

// Shadows (Sharp & Crisp)
boxShadow: { sm: '...', md: '...', lg: '...', sharp: '...' }
```

---

## 📦 Available Components

### Atoms

- ✅ Button (Primary, Secondary, Ghost, Link, Icon, FAB, Danger)
- ✅ Icon (with size variants)
- ✅ Text (H1-H6, Body, Caption, Overline)
- ✅ Input (Text, Number, Password, Search)
- ✅ TextArea
- ✅ Checkbox, Radio, Switch
- ✅ Badge, Pill, Chip
- ✅ Spinner, Progress, Skeleton
- ✅ Label, HelperText, FieldError

### Molecules

- ✅ Card (Info, Product, Transaction, Expandable)
- ✅ Avatar (with status badges)
- ✅ FormField wrappers
- ✅ SearchBar with suggestions
- ✅ DatePicker, DateRangePicker, TimePicker
- ✅ FileUpload with drag & drop
- ✅ Tooltip, Popover
- ✅ Dropdown, Select, Combobox

### Organisms

- ✅ Header / AppBar
- ✅ Sidebar / Drawer
- ✅ Navigation
- ✅ DataTable (sorting, filtering, pagination)
- ✅ Pagination Controls
- ✅ Breadcrumbs
- ✅ Tabs (horizontal/vertical)
- ✅ Timeline / Stepper
- ✅ Wizard
- ✅ Calendar
- ✅ Carousel / Slider

### Overlays

- ✅ Modal / Dialog
- ✅ Drawer
- ✅ Toast / Notification
- ✅ Popover
- ✅ Context Menu
- ✅ Alert Dialog

---

## 🛠️ Utilities & Hooks

### Component Helpers

```typescript
// Utility Functions
import { 
  cn,                    // Class name merging
  generateId,            // Unique ID generation
  truncate,              // Text truncation
  formatFileSize,        // File size formatting
  getInitials,           // Name to initials
  debounce,              // Debounce function
  throttle,              // Throttle function
} from '@/utils/component-helpers';
```

### Custom Hooks

```typescript
// Hooks
import {
  useDisclosure,         // Open/close state
  useDebounce,          // Debounced value
  useMediaQuery,        // Responsive queries
  useLocalStorage,      // Local storage sync
  useClickOutside,      // Click outside detection
  useWindowSize,        // Window dimensions
  useScrollPosition,    // Scroll tracking
  useCopyToClipboard,   // Clipboard operations
  useToggle,            // Toggle state
  useCounter,           // Counter state
  useHover,             // Hover detection
  useFocus,             // Focus tracking
  useArray,             // Array state management
} from '@/hooks/useComponentHelpers';
```

---

## ✅ Testing Strategy

### Unit Testing Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyButton } from './MyButton';

describe('MyButton', () => {
  it('renders correctly', () => {
    render(<MyButton>Click me</MyButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<MyButton onClick={handleClick}>Click me</MyButton>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔍 Common Patterns

### 1. Variant-based Components (CVA)

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
    size: {
      sm: 'h-9 px-3',
      md: 'h-10 px-4',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### 2. Compound Components

```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### 3. Polymorphic Components

```typescript
<Text as="h1">Heading</Text>
<Text as="p">Paragraph</Text>
```

### 4. Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## 🎯 Best Practices

### Component Development

- ✅ Start with types (`*.types.ts`)
- ✅ Use forwardRef for ref support
- ✅ Include data-testid for testing
- ✅ Follow atomic design principles
- ✅ Use design tokens consistently
- ✅ Write comprehensive tests
- ✅ Document with JSDoc comments

### Styling

- ✅ Use Tailwind utility classes
- ✅ Leverage design tokens
- ✅ Use `cn()` for class merging
- ✅ Implement dark mode variants
- ✅ Ensure responsive design
- ✅ Maintain sharp corners (0px radius)

### Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Color contrast compliance

---

## 📖 Usage Examples

### Basic Button

```tsx
<Button variant="primary" size="lg">
  Click Me
</Button>
```

### Form with Validation

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} type="email" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Data Table

```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={{
    page: 1,
    pageSize: 10,
    totalPages: 5,
    onPageChange: (page) => console.log(page),
  }}
  sorting={{
    sortBy: 'name',
    sortOrder: 'asc',
    onSortChange: (by, order) => console.log(by, order),
  }}
/>
```

### Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-2 mt-4">
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
    <Button variant="secondary" onClick={onClose}>
      Cancel
    </Button>
  </div>
</Modal>
```

---

## 🔧 Configuration

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: ['./client/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens mapped to Tailwind
      },
      borderRadius: {
        // All 0px for sharp corners
      },
    },
  },
};
```

### TypeScript Paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/src/*"],
      "@/components/*": ["./client/src/components/*"],
      "@/hooks/*": ["./client/src/hooks/*"],
      "@/lib/*": ["./client/src/lib/*"],
      "@/types/*": ["./client/src/types/*"]
    }
  }
}
```

---

## 📚 Additional Resources

### Internal Documentation

- [UI Component Architecture](./UI_COMPONENT_ARCHITECTURE.md)
- [Implementation Guide](./COMPONENT_IMPLEMENTATION_GUIDE.md)
- [Design Tokens](./DESIGN_SYSTEM_TOKENS.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)

### External Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)

---

## 🤝 Contributing

### Adding a New Component

1. Determine atomic level (atom/molecule/organism)
2. Create component folder with proper structure
3. Implement component with TypeScript
4. Add comprehensive tests
5. Update documentation
6. Submit for review

### Modifying Existing Components

1. Review current implementation
2. Ensure backward compatibility
3. Update tests
4. Update documentation
5. Submit for review

---

## 🐛 Troubleshooting

### Common Issues

**Tailwind classes not applying?**
- Use complete class names, not dynamic strings
- Check Tailwind config content paths

**TypeScript errors with refs?**
- Use `forwardRef` with proper generic types

**Dark mode not working?**
- Ensure `darkMode: ['class']` in Tailwind config
- Use theme-aware classes or CSS variables

**Form validation issues?**
- Check field names match schema
- Use `zodResolver` for Zod schemas
- Log `form.formState.errors` to debug

---

## 📝 Changelog

### Version 1.0.0 (Current)

- ✅ Complete component architecture
- ✅ Atomic design structure
- ✅ Comprehensive type system
- ✅ Design token system
- ✅ Utility functions and hooks
- ✅ Testing infrastructure
- ✅ Documentation suite

---

## 📞 Support

For questions or issues:

1. Check the documentation first
2. Review implementation examples
3. Search existing issues
4. Consult with team lead
5. Create detailed bug report if needed

---

**Built with ❤️ by world-class engineers**

*Last Updated: Component Architecture v1.0*
