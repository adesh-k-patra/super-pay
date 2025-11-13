# Component Implementation Guide

## Quick Start Guide for Engineers

This guide provides practical examples and patterns for implementing components using our global UI component architecture.

---

## Table of Contents

1. [Setup & Prerequisites](#setup--prerequisites)
2. [Creating a New Component](#creating-a-new-component)
3. [Component Patterns](#component-patterns)
4. [Styling Guidelines](#styling-guidelines)
5. [Testing Examples](#testing-examples)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Setup & Prerequisites

### Required Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

### Import Aliases

```typescript
// tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/src/*"],
      "@/components/*": ["./client/src/components/*"],
      "@/lib/*": ["./client/src/lib/*"],
      "@/hooks/*": ["./client/src/hooks/*"],
      "@/types/*": ["./client/src/types/*"]
    }
  }
}
```

---

## Creating a New Component

### Step 1: Create Component Structure

```bash
# For an Atom
mkdir -p client/src/components/atoms/MyComponent
cd client/src/components/atoms/MyComponent

# Create files
touch MyComponent.tsx
touch MyComponent.types.ts
touch MyComponent.test.tsx
touch index.ts
```

### Step 2: Define Types

```typescript
// MyComponent.types.ts
import { HTMLAttributes } from 'react';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  label?: string;
  'data-testid'?: string;
}
```

### Step 3: Implement Component

```typescript
// MyComponent.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { MyComponentProps } from './MyComponent.types';

const myComponentVariants = cva(
  // Base styles
  'inline-flex items-center justify-center transition-colors font-medium',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border border-border',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ 
    variant,
    size,
    isDisabled = false,
    label,
    className,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-testid={dataTestId || 'my-component'}
        className={cn(
          myComponentVariants({ variant, size }),
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {label}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### Step 4: Create Barrel Export

```typescript
// index.ts
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent.types';
```

### Step 5: Write Tests

```typescript
// MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent label="Test" />);
    expect(screen.getByTestId('my-component')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<MyComponent variant="primary" label="Test" />);
    const component = screen.getByTestId('my-component');
    expect(component).toHaveClass('bg-primary');
  });

  it('applies size styles', () => {
    render(<MyComponent size="lg" label="Test" />);
    const component = screen.getByTestId('my-component');
    expect(component).toHaveClass('h-11');
  });

  it('handles disabled state', () => {
    render(<MyComponent isDisabled label="Test" />);
    const component = screen.getByTestId('my-component');
    expect(component).toHaveClass('opacity-50');
    expect(component).toHaveClass('cursor-not-allowed');
  });
});
```

---

## Component Patterns

### Pattern 1: Compound Components

```typescript
// Card with compound pattern
export const Card = ({ children, ...props }: CardProps) => {
  return <div {...props}>{children}</div>;
};

Card.Header = ({ children, ...props }) => {
  return <div className="border-b border-border p-4" {...props}>{children}</div>;
};

Card.Body = ({ children, ...props }) => {
  return <div className="p-4" {...props}>{children}</div>;
};

Card.Footer = ({ children, ...props }) => {
  return <div className="border-t border-border p-4" {...props}>{children}</div>;
};

// Usage
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    Content here
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Pattern 2: Polymorphic Components

```typescript
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & React.ComponentPropsWithoutRef<E>;

export const Text = <E extends React.ElementType = 'p'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) => {
  const Component = as || 'p';
  return <Component {...props}>{children}</Component>;
};

// Usage
<Text as="h1" className="text-4xl">Heading</Text>
<Text as="span" className="text-sm">Small text</Text>
```

### Pattern 3: Controlled vs Uncontrolled

```typescript
export const Input = ({
  value: controlledValue,
  defaultValue,
  onChange,
  ...props
}: InputProps) => {
  // Uncontrolled mode
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  
  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(e.target.value);
    }
    onChange?.(e);
  };
  
  return (
    <input
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};
```

### Pattern 4: Render Props

```typescript
interface DataLoaderProps<T> {
  query: string;
  children: (data: T, isLoading: boolean) => React.ReactNode;
}

export const DataLoader = <T,>({ query, children }: DataLoaderProps<T>) => {
  const { data, isLoading } = useQuery<T>({ queryKey: [query] });
  return <>{children(data, isLoading)}</>;
};

// Usage
<DataLoader query="/api/users">
  {(users, isLoading) => (
    isLoading ? <Spinner /> : <UserList users={users} />
  )}
</DataLoader>
```

### Pattern 5: Headless Components

```typescript
// Headless Select Component
export const useSelect = <T,>(options: SelectOption<T>[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);
  const [search, setSearch] = useState('');
  
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );
  
  return {
    isOpen,
    selected,
    search,
    filteredOptions,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
    select: (value: T) => {
      setSelected(value);
      setIsOpen(false);
    },
    setSearch,
  };
};

// UI Component using headless logic
export const Select = <T,>({ options }: SelectProps<T>) => {
  const select = useSelect(options);
  
  return (
    <div>
      <button onClick={select.toggle}>
        {select.selected?.label || 'Select...'}
      </button>
      
      {select.isOpen && (
        <div>
          <input value={select.search} onChange={(e) => select.setSearch(e.target.value)} />
          {select.filteredOptions.map(opt => (
            <div key={opt.value} onClick={() => select.select(opt.value)}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Styling Guidelines

### Using CVA (Class Variance Authority)

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      {
        variant: 'ghost',
        size: 'sm',
        class: 'hover:bg-accent/50',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Usage
<button className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
  Click me
</button>
```

### Using Design Tokens

```typescript
import { semanticColors, spacing, shadows } from '@/lib/design-tokens';

// In component
<div
  style={{
    backgroundColor: semanticColors.card,
    color: semanticColors.foreground,
    padding: spacing.md,
    boxShadow: shadows.lg,
  }}
>
  Content
</div>

// Or with Tailwind
<div className="bg-card text-foreground p-4 shadow-lg">
  Content
</div>
```

### Dark Mode Support

```typescript
// Automatic dark mode with CSS variables
<div className="bg-background text-foreground">
  Automatically adapts to theme
</div>

// Manual dark mode classes
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Explicit dark mode styles
</div>

// Using design tokens (recommended)
<div className="bg-card text-card-foreground border border-border">
  Uses theme tokens
</div>
```

### Responsive Design

```typescript
// Tailwind responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// Custom breakpoints
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// Hide/show on breakpoints
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

---

## Testing Examples

### Unit Testing

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    render(<Button isDisabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Form Testing

```typescript
describe('ContactForm', () => {
  it('validates required fields', async () => {
    render(<ContactForm />);
    
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Hello world');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        message: 'Hello world',
      });
    });
  });
});
```

### Async Testing

```typescript
describe('DataTable', () => {
  it('loads and displays data', async () => {
    const mockData = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];
    
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json(mockData);
      })
    );
    
    render(<DataTable query="/api/users" />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.error();
      })
    );
    
    render(<DataTable query="/api/users" />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
```

---

## Common Patterns

### 1. Custom Hooks

```typescript
// useDebounce
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// useMediaQuery
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// useLocalStorage
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### 2. Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" isLoading={form.formState.isSubmitting}>
          Sign In
        </Button>
      </form>
    </Form>
  );
};
```

### 3. Data Fetching

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const useUsers = () => {
  return useQuery({
    queryKey: ['/api/users'],
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      return apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
  });
};

// Usage in component
export const UserList = () => {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <Spinner />;

  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} {...user} />
      ))}
      
      <Button 
        onClick={() => createUser.mutate({ name: 'New User' })}
        isLoading={createUser.isPending}
      >
        Add User
      </Button>
    </div>
  );
};
```

### 4. Error Boundaries

```typescript
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Tailwind Classes Not Applying

```typescript
// ❌ Wrong - Tailwind can't parse dynamic classes
<div className={`text-${color}-500`}>Content</div>

// ✅ Correct - Use complete class names
<div className={color === 'red' ? 'text-red-500' : 'text-blue-500'}>
  Content
</div>

// ✅ Better - Use CSS variables
<div style={{ color: `var(--${color}-500)` }}>Content</div>
```

#### 2. TypeScript Errors with Ref

```typescript
// ❌ Wrong
export const MyComponent = (props: MyComponentProps, ref) => {
  // ...
};

// ✅ Correct - Use forwardRef with proper types
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  (props, ref) => {
    // ...
  }
);
```

#### 3. React Query Cache Issues

```typescript
// ❌ Wrong - String concatenation in queryKey
const { data } = useQuery({ 
  queryKey: [`/api/users/${userId}`] 
});

// ✅ Correct - Array segments for proper invalidation
const { data } = useQuery({ 
  queryKey: ['/api/users', userId] 
});

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });

// Invalidate all users
queryClient.invalidateQueries({ queryKey: ['/api/users'] });
```

#### 4. Form Validation Not Working

```typescript
// Check for errors in form state
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

// Debug form errors
useEffect(() => {
  console.log('Form errors:', form.formState.errors);
}, [form.formState.errors]);

// Ensure field names match schema
<FormField
  name="email" // Must match schema key
  control={form.control}
  render={({ field }) => <Input {...field} />}
/>
```

#### 5. Dark Mode Not Working

```typescript
// Ensure tailwind.config.ts has darkMode configured
export default {
  darkMode: ['class'], // Use class-based dark mode
  // ...
};

// Add dark class to html element
useEffect(() => {
  document.documentElement.classList.add('dark');
}, []);

// Or use theme provider
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>
```

---

## Best Practices Checklist

- [ ] Component has proper TypeScript types
- [ ] Component is properly exported (barrel export)
- [ ] data-testid attributes are added for testing
- [ ] Component has unit tests
- [ ] Accessibility attributes (ARIA) are included
- [ ] Component uses design tokens for styling
- [ ] Component is documented (JSDoc comments)
- [ ] Component handles loading and error states
- [ ] Component is responsive (mobile-first)
- [ ] Component follows naming conventions

---

## Quick Reference

### Import Patterns

```typescript
// Components
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { Header } from '@/components/organisms/Header';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';

// Utils
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';

// Types
import type { ButtonProps } from '@/types/components';
```

### Common Tailwind Patterns

```typescript
// Flexbox
'flex items-center justify-between'
'flex flex-col gap-4'

// Grid
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'

// Spacing
'p-4 m-2' // padding, margin
'px-4 py-2' // horizontal, vertical padding
'space-y-4' // vertical spacing between children

// Typography
'text-sm font-medium text-foreground'
'text-lg font-bold text-primary'

// States
'hover:bg-accent focus:ring-2 focus:ring-primary'
'disabled:opacity-50 disabled:cursor-not-allowed'

// Dark mode
'bg-white dark:bg-gray-900'
'text-black dark:text-white'
```

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)

---

*Last Updated: {{ current_date }}*
