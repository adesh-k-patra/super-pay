# Coding Standards & Best Practices

## Overview

This document defines the coding standards and best practices for maintaining a world-class codebase across 300+ pages and features. Following these standards ensures consistency, maintainability, and quality across the entire application.

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React Component Standards](#react-component-standards)
4. [API Development Standards](#api-development-standards)
5. [Database Standards](#database-standards)
6. [Form Standards](#form-standards)
7. [State Management Standards](#state-management-standards)
8. [Styling Standards](#styling-standards)
9. [Testing Standards](#testing-standards)
10. [Security Standards](#security-standards)
11. [Performance Standards](#performance-standards)
12. [Documentation Standards](#documentation-standards)

---

## General Principles

### Code Quality Principles

1. **DRY (Don't Repeat Yourself)**: Extract reusable logic into functions, hooks, or components
2. **KISS (Keep It Simple, Stupid)**: Prefer simple, readable solutions over complex ones
3. **YAGNI (You Aren't Gonna Need It)**: Don't build features until they're needed
4. **Single Responsibility**: Each function/component should do one thing well
5. **Separation of Concerns**: Keep business logic, UI, and data access separated

### File Organization

```
client/src/
├── components/
│   ├── ui/                    # Base UI components (Button, Input, etc.)
│   ├── layout/                # Layout components (Headers, Shells, etc.)
│   └── [domain]/              # Domain-specific components
├── pages/
│   ├── [domain]/              # Grouped by feature domain
│   └── [page-name].tsx        # Individual pages (kebab-case)
├── hooks/
│   └── use-[hook-name].ts     # Custom hooks (kebab-case with 'use-' prefix)
├── lib/
│   └── [utility-name].ts      # Utility functions and configurations
└── types/
    └── [domain].ts            # Type definitions (if needed beyond schema)
```

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-profile.tsx`, `loan-calculator.ts` |
| Components | PascalCase | `UserProfile`, `LoanCard` |
| Functions | camelCase | `calculateEmi`, `formatCurrency` |
| Variables | camelCase | `userData`, `totalAmount` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOAN_AMOUNT`, `DEFAULT_TENURE` |
| Types/Interfaces | PascalCase | `User`, `LoanApplication` |
| Enums | PascalCase | `LoanStatus`, `PaymentMethod` |
| CSS Classes | kebab-case | `loan-card`, `payment-button` |

---

## TypeScript Standards

### Type Safety

**✅ DO:**
```typescript
// Explicit return types for exported functions
export function calculateEmi(
  principal: number,
  rate: number,
  tenure: number
): number {
  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

// Use proper typing from schema
import type { User, LoanApplication } from "@shared/schema";

// Use discriminated unions for state
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

**❌ DON'T:**
```typescript
// Avoid 'any' type
function process(data: any) { // ❌
  return data.value;
}

// Don't omit return types for exported functions
export function calculate(x, y) { // ❌
  return x + y;
}

// Don't use optional chaining excessively
const value = data?.user?.profile?.address?.street?.name; // ❌
```

### Type Imports

```typescript
// Separate type imports from value imports
import { useState } from "react";
import type { FC } from "react";
import type { User, InsertUser } from "@shared/schema";
```

### Utility Types

```typescript
// Use built-in utility types
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;
type UserWithoutId = Omit<User, 'id'>;
type UserIdAndName = Pick<User, 'id' | 'name'>;
```

---

## React Component Standards

### Component Structure

```typescript
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { User } from "@shared/schema";

/**
 * Brief description of what this component does
 */
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. Queries and Mutations
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users', userId],
  });
  
  // 3. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // 4. Render logic
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!user) {
    return <ErrorState message="User not found" />;
  }
  
  // 5. Main return
  return (
    <Card data-testid="card-user-profile">
      <h2 data-testid="text-username">{user.name}</h2>
      <Button 
        onClick={handleEdit}
        data-testid="button-edit-profile"
      >
        Edit Profile
      </Button>
    </Card>
  );
}
```

### Component Best Practices

**✅ DO:**
```typescript
// Small, focused components
export function UserAvatar({ user }: { user: User }) {
  return (
    <img 
      src={user.avatar} 
      alt={user.name}
      data-testid="img-avatar"
    />
  );
}

// Extract complex logic to custom hooks
function useUserProfile(userId: string) {
  const query = useQuery({
    queryKey: ['/api/users', userId],
  });
  
  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

// Use proper TypeScript for props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

**❌ DON'T:**
```typescript
// Don't create massive components (> 300 lines)
// Don't inline complex logic in JSX
// Don't forget data-testid attributes
// Don't use inline styles (use Tailwind classes)
// Don't mutate props or state directly
```

### Conditional Rendering

```typescript
// ✅ Good: Early returns for loading/error states
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorState error={error} />;

// ✅ Good: Ternary for simple conditions
<div>{isActive ? 'Active' : 'Inactive'}</div>

// ✅ Good: Logical AND for optional rendering
{user && <UserProfile user={user} />}

// ❌ Avoid: Nested ternaries
{condition1 ? (
  condition2 ? <A /> : <B />
) : (
  condition3 ? <C /> : <D />
)} // Too complex!
```

---

## API Development Standards

### Route Structure

```typescript
// Group related routes
// POST /api/loans/apply
// GET /api/loans/:id
// PUT /api/loans/:id
// DELETE /api/loans/:id
// GET /api/loans/user/:userId

// Always validate input with Zod
app.post("/api/loans/apply", requireAuth, createRateLimiter('LOAN_APPLICATION'), async (req, res) => {
  try {
    // 1. Validate input
    const data = insertLoanApplicationSchema.parse(req.body);
    
    // 2. Authorization check
    if (req.user!.id !== data.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
    
    // 3. Business logic
    const application = await storage.createLoanApplication(data);
    
    // 4. Success response
    return res.json({
      success: true,
      data: application
    });
  } catch (error) {
    // 5. Error handling
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: error.errors
      });
    }
    
    console.error("Loan application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
```

### Response Format

**Success Response:**
```typescript
{
  "success": true,
  "data": { ... },           // The actual data
  "message"?: "Optional success message",
  "pagination"?: {           // For paginated responses
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**
```typescript
{
  "success": false,
  "message": "User-friendly error message",
  "errors"?: [ ... ],        // Validation errors
  "timestamp": "2025-01-15T...",
  "requestId": "abc123"
}
```

### API Best Practices

**✅ DO:**
- Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Apply rate limiting to sensitive endpoints
- Validate all inputs with Zod schemas
- Use requireAuth or optionalAuth appropriately
- Return consistent response formats
- Log errors without exposing sensitive data
- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)

**❌ DON'T:**
- Expose sensitive data in error messages
- Skip input validation
- Return different response structures
- Log sensitive information (passwords, tokens)
- Use 200 for errors

---

## Database Standards

### Schema Design

```typescript
// ✅ Good table design
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  email: text("email"),
  creditScore: integer("credit_score").default(750),
  isActive: integer("is_active").default(1), // Soft delete flag
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  phoneIdx: index("users_phone_idx").on(table.phone),
  emailIdx: index("users_email_idx").on(table.email),
}));

// Foreign keys with proper references
export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  // ...
});
```

### Index Strategy

```typescript
// Add indexes on:
// 1. Foreign keys
// 2. Frequently queried fields
// 3. Fields used in WHERE clauses
// 4. Fields used in ORDER BY

(table) => ({
  userIdIdx: index("loans_user_id_idx").on(table.userId),
  statusIdx: index("loans_status_idx").on(table.status),
  userStatusIdx: index("loans_user_status_idx").on(table.userId, table.status),
})
```

### Query Patterns

```typescript
// ✅ Use parameterized queries (Drizzle handles this)
const user = await db.select()
  .from(users)
  .where(eq(users.phone, phone))
  .limit(1);

// ✅ Use transactions for multi-step operations
await db.transaction(async (tx) => {
  const user = await tx.insert(users).values(userData).returning();
  await tx.insert(userProfiles).values({ userId: user[0].id, ...profileData });
});

// ✅ Select only needed fields
const userNames = await db.select({
  id: users.id,
  name: users.name
}).from(users);
```

---

## Form Standards

### Form Implementation

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Extend schema for additional validation
const formSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function UserRegistrationForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest('POST', '/api/users', data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Account created successfully" });
      form.reset();
    },
  });
  
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  data-testid="input-name"
                  placeholder="Enter your name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* More fields... */}
        
        <Button 
          type="submit" 
          disabled={mutation.isPending}
          data-testid="button-submit"
        >
          {mutation.isPending ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
```

### Form Best Practices

**✅ DO:**
- Always use React Hook Form with Zod validation
- Provide clear, helpful error messages
- Show loading states during submission
- Disable submit button while loading
- Clear form on successful submission
- Show success feedback (toast/notification)
- Use appropriate input types (email, tel, number)
- Add data-testid to all form elements

**❌ DON'T:**
- Skip validation
- Allow multiple submissions
- Show generic error messages
- Forget to handle errors
- Leave form data after submission

---

## State Management Standards

### Server State (TanStack Query)

```typescript
// ✅ Good query setup
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/loans', userId],  // Hierarchical keys
  staleTime: 1000 * 60 * 5,          // 5 minutes
  gcTime: 1000 * 60 * 60,            // 1 hour
});

// ✅ Good mutation setup
const mutation = useMutation({
  mutationFn: async (data: InsertLoan) => {
    const res = await apiRequest('POST', '/api/loans', data);
    return res.json();
  },
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
    queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});
```

### Local State (useState, useReducer)

```typescript
// ✅ Use useState for simple state
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

// ✅ Use useReducer for complex state
type State = {
  step: number;
  formData: Partial<LoanApplication>;
  errors: Record<string, string>;
};

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(0, state.step - 1) };
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value }
      };
    default:
      return state;
  }
}
```

### Context (Rare Cases Only)

```typescript
// ✅ Use context only for truly global state
// (theme, auth status, feature flags)
// DON'T use context for data that could be in TanStack Query
```

---

## Styling Standards

### Tailwind Best Practices

```typescript
// ✅ Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-black text-white rounded-lg">
  <h2 className="text-2xl font-bold">Title</h2>
  <Button variant="outline" size="sm">Action</Button>
</div>

// ✅ Use clsx/cn for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-green-500",
  isError && "bg-red-500 text-white",
  className // Allow prop override
)}>
```

### Design Tokens

```css
/* Use CSS custom properties for theming */
:root {
  --background: 0 0% 0%;          /* Black */
  --foreground: 0 0% 100%;        /* White */
  --primary: 346 77% 50%;         /* Rose */
  --destructive: 0 84% 60%;       /* Red */
  --border: 240 6% 10%;           /* Dark gray */
  --radius: 0.5rem;               /* Border radius */
}
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="
  w-full           // Mobile
  md:w-1/2         // Tablet
  lg:w-1/3         // Desktop
  p-4              // Mobile
  md:p-6           // Tablet
  lg:p-8           // Desktop
">
```

---

## Testing Standards

### Test ID Naming

```typescript
// Interactive elements
<Button data-testid="button-submit">Submit</Button>
<Input data-testid="input-email" />
<Link data-testid="link-profile" />

// Display elements
<span data-testid="text-balance">{balance}</span>
<div data-testid="status-payment">{status}</div>
<img data-testid="img-avatar" />

// Dynamic elements
<Card data-testid={`card-loan-${loan.id}`}>
<Row data-testid={`row-transaction-${index}`}>
```

### Test Coverage Goals

- **Critical Paths**: 100% (authentication, payments, bookings)
- **Business Logic**: 80%
- **UI Components**: 60%
- **Utilities**: 90%

---

## Security Standards

### Input Validation

```typescript
// ✅ Always validate on server
const data = insertUserSchema.parse(req.body);

// ✅ Sanitize inputs (middleware does this automatically)
// ✅ Use parameterized queries (Drizzle does this)
// ✅ Validate file uploads
```

### Authentication

```typescript
// ✅ Protected routes
app.get("/api/user/profile", requireAuth, async (req, res) => {
  const userId = req.user!.id; // TypeScript knows user exists
  // ...
});

// ✅ Optional auth (user may or may not be logged in)
app.get("/api/loans/offers", optionalAuth, async (req, res) => {
  const userId = req.user?.id; // May be undefined
  // ...
});
```

### Sensitive Data

```typescript
// ❌ DON'T log sensitive data
console.log(user.password); // NO!
console.log(paymentDetails); // NO!

// ✅ DO sanitize logs
console.log({ userId: user.id, action: 'login' });

// ❌ DON'T expose in errors
throw new Error(`Password ${password} is invalid`); // NO!

// ✅ DO use generic messages
throw new Error("Invalid credentials");
```

---

## Performance Standards

### Code Splitting

```typescript
// ✅ Lazy load pages
const HomePage = lazy(() => import("@/pages/home"));
const ProfilePage = lazy(() => import("@/pages/profile"));

// ✅ Use Suspense
<Suspense fallback={<LoadingLogo />}>
  <Route path="/home" component={HomePage} />
</Suspense>
```

### Optimization Techniques

```typescript
// ✅ Memoize expensive computations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// ✅ Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// ✅ Use proper dependencies
useEffect(() => {
  fetchData();
}, [dependency1, dependency2]); // Only re-run when these change
```

### Image Optimization

```typescript
// ✅ Lazy load images
<img 
  loading="lazy"
  src={imageUrl}
  alt="Description"
/>

// ✅ Use appropriate formats (WebP, AVIF)
// ✅ Provide width/height to prevent layout shift
```

---

## Documentation Standards

### Code Comments

```typescript
// ✅ Good comments explain WHY, not WHAT
// Calculate EMI using reducing balance method
// Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
function calculateEmi(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12 / 100;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
}

// ❌ Bad comments state the obvious
// Set the name variable
const name = user.name; // We can see that!
```

### JSDoc

```typescript
/**
 * Calculates the monthly EMI for a loan.
 * 
 * @param principal - The loan amount in INR
 * @param rate - Annual interest rate (e.g., 12 for 12%)
 * @param tenure - Loan tenure in months
 * @returns The monthly EMI amount rounded to nearest integer
 * 
 * @example
 * ```typescript
 * const emi = calculateEmi(100000, 12, 24);
 * // Returns 4707
 * ```
 */
export function calculateEmi(
  principal: number,
  rate: number,
  tenure: number
): number {
  // Implementation...
}
```

---

## Error Handling Standards

### Frontend Error Handling

```typescript
// ✅ Handle query errors
const { data, error, isError } = useQuery({
  queryKey: ['/api/user/profile'],
});

if (isError) {
  return <ErrorState error={error} />;
}

// ✅ Handle mutation errors
const mutation = useMutation({
  mutationFn: ...,
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});

// ✅ Use Error Boundaries for component errors
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

### Backend Error Handling

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof z.ZodError) {
    // Validation error
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: error.errors,
    });
  }
  
  if (error instanceof AuthenticationError) {
    // Custom error
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
  
  // Unknown error - log and return generic message
  console.error("Unexpected error:", error);
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
}
```

---

## Code Review Checklist

### Before Submitting Code

- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings addressed
- [ ] Code follows naming conventions
- [ ] Functions have appropriate return types
- [ ] Components have proper TypeScript interfaces
- [ ] All interactive elements have data-testid
- [ ] Forms use React Hook Form + Zod
- [ ] API calls use TanStack Query
- [ ] Proper error handling in place
- [ ] Loading states implemented
- [ ] Success feedback provided
- [ ] Code is properly formatted
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] No hardcoded values (use constants)
- [ ] Security best practices followed
- [ ] Performance optimizations applied
- [ ] Documentation updated if needed

---

## Summary

Following these coding standards ensures:

1. **Consistency**: All code looks like it was written by one person
2. **Maintainability**: Future developers can easily understand and modify code
3. **Quality**: High standards prevent bugs and technical debt
4. **Performance**: Best practices ensure optimal app performance
5. **Security**: Security standards protect users and data
6. **Scalability**: Well-structured code scales better

**Remember**: These standards exist to make development faster and better, not slower. When in doubt, follow the patterns already established in the codebase!
