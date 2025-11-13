# Application Architecture Documentation

## Overview

This is a comprehensive financial services super-app built with modern web technologies, serving multiple domains including payments, lending, investments, travel, and lifestyle services.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight SPA routing)
- **State Management**: TanStack Query v5 (server state)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: JWT-based auth with cookies
- **Validation**: Zod schemas
- **File Upload**: Multer
- **Security**: Rate limiting, CSP headers, input sanitization

### Infrastructure
- **Build Tool**: Vite
- **Package Manager**: npm
- **Database Migrations**: Drizzle Kit
- **Payment Processing**: Stripe integration

## Application Structure

```
/
├── client/                      # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (shadcn)
│   │   │   ├── layout/        # Layout components
│   │   │   ├── rewards/       # Reward-specific components
│   │   │   └── booking/       # Booking-specific components
│   │   ├── pages/             # Page components (300+ pages)
│   │   ├── lib/               # Utilities and configurations
│   │   ├── hooks/             # Custom React hooks
│   │   └── main.tsx           # Application entry point
│   ├── index.html             # HTML template
│   └── public/                # Static assets
│
├── server/                     # Backend application
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route definitions (11k+ LOC)
│   ├── storage.ts             # Data access layer (14k+ LOC)
│   ├── jwt.ts                 # JWT utilities
│   ├── middleware/            # Express middleware
│   │   └── security.ts        # Security middleware
│   └── vite.ts                # Vite dev server integration
│
├── shared/                     # Shared code between client and server
│   └── schema.ts              # Database schema & types (7.8k+ LOC)
│
├── attached_assets/           # User-uploaded and generated assets
├── docs/                      # Documentation
└── public/                    # Public static files

```

## Domain Structure

The application is organized around the following business domains:

### 1. **Authentication & User Management**
- **Pages**: `/login`, `/profile`, `/edit-profile`, `/settings`
- **Features**: Phone OTP authentication, KYC, user profiles
- **Database**: `users`, `otps`, `userProfiles`

### 2. **Lending & Credit**
- **Pages**: `/marketplace`, `/loan-application`, `/my-loans`, `/eligibility-check`, `/emi-calculator`, `/repayment-calculator`
- **Features**: Loan marketplace, applications, EMI tracking, eligibility checks
- **Database**: `loanApplications`, `loanOffers`, `emiPayments`, `creditCardOffers`, `creditCardApplications`
- **Key Flows**:
  1. Eligibility check → Marketplace browsing → Application → Approval → EMI management
  2. Credit card discovery → Application → Approval

### 3. **Payments (UPI)**
- **Pages**: `/upi-payment`, `/upi-scanner`, `/upi-qr`, `/upi-collect`, `/upi-history`, `/family-upi`, `/credit-upi`
- **Features**: P2P payments, QR code scanning, collect requests, family accounts, credit line UPI
- **Database**: `upiAccounts`, `upiTransactions`, `upiRewards`, `familyUpiAccounts`
- **Key Features**:
  - Real-time UPI payments
  - QR code generation and scanning
  - Family account management
  - Credit UPI with pre-approved limits

### 4. **Bill Payments & Recharge**
- **Pages**: `/bill-payment`, `/bills-recharge`, `/my-bills`, `/fastag`
- **Categories**: Electricity, Water, Gas, Mobile, DTH, Broadband, Municipal Tax, FASTag
- **Features**: Bill payment, auto-pay, reminders, transaction history
- **Database**: `billPaymentServices`, `billPaymentHistory`, `billPayees`, `scheduledBills`, `fastagAccounts`

### 5. **Investments**
- **Pages**: `/investment`, `/stocks-list`, `/mutual-funds-list`, `/crypto-list`, `/sip-list`, `/fixed-deposits`
- **Features**: Stocks, mutual funds, crypto, SIP, SWP, STP, FDs, gold/silver/diamonds
- **Database**: `investmentPortfolio`, `investmentOrders`, `investmentWatchlist`, `sipInvestments`, `swpInvestments`, `stpInvestments`, `fixedDeposits`, `metalInvestments`
- **Providers**: Support for multiple investment vendors with comparison features

### 6. **Travel & Booking**
- **Pages**: Travel hub at `/booking` with sub-pages for flights, buses, trains, cabs, metro, hotels, events, movies
- **Features**:
  - Flight booking with seat selection
  - Bus booking with seat selection
  - Train booking with class selection
  - Cab booking with live tracking
  - Hotel booking with room selection
  - Event and movie ticket booking
  - Metro smart cards
  - Vehicle rentals
- **Database**: `travelRoutes`, `travelSchedules`, `travelBookings`, `hotels`, `hotelRooms`, `movies`, `theaters`, `events`, `metroStations`, `rentalVehicles`

### 7. **Insurance**
- **Pages**: `/insurance`, `/my-insurance`
- **Features**: Insurance marketplace, policy management, premium payments, claims
- **Database**: `insurancePolicies`, `insurancePremiumPayments`, `insuranceClaims`

### 8. **Rewards & Loyalty**
- **Pages**: `/rewards`, `/my-rewards`, `/referrals`, `/upi-rewards`, `/fitness-rewards`
- **Features**: Points system, vouchers, referral program, fitness rewards
- **Database**: `rewards`, `rewardRedemptions`, `userVouchers`, `loyaltyCoins`, `coinTransactions`, `referralProgram`
- **Gamification**: Interactive reward games (spin wheel, scratch cards, slots, etc.)

### 9. **Fitness & Health**
- **Pages**: `/fitness`, `/fitness-leaderboard`, `/marathon-booking`
- **Features**: Activity tracking, challenges, leaderboards, event booking
- **Database**: `fitnessActivities`, `userPoints`

### 10. **Financial Tools**
- **Pages**: `/pro-tools`, `/analytics`, `/budget-planner`, `/goal-tracker`, `/expense-tracker`, `/myreport`, `/security`
- **Features**:
  - **MyReport**: Credit score monitoring, financial health analysis
  - **Security**: Fraud detection, link scanning, transaction security
  - **Analytics**: Spending analysis, financial insights
  - **Planning**: Budget planning, goal tracking, expense tracking
- **Database**: `userFinancialReports`, `securityScans`, `financialAnalytics`, `budgets`, `financialGoals`

### 11. **Learning & Support**
- **Pages**: `/learn`, `/coach`, `/creator-connect`
- **Features**: Financial education, AI coach, creator sessions
- **Database**: `learningContent`, `coachInteractions`, `creators`, `creatorSessions`

### 12. **Marketplace Features**
- **Coupon Mart** (`/coupon-mart`): Buy/sell/trade coupons and vouchers
- **ShareWise** (`/sharewise`): Group expense splitting
- **SwapNow** (pages under `/swap-now-*`): Product exchange marketplace
- **Consultant Booking** (`/consultant-*`): Book professional consultants (doctors, lawyers, etc.)
- **Delivery Now** (`/delivery-now`): Local delivery and marketplace

### 13. **Account Management**
- **Pages**: `/funds`, `/cards`, `/bank-accounts`, `/bank-transfer`
- **Features**: Wallet management, card management, bank account linking, fund transfers
- **Database**: `userWallet`, `fundTransactions`, `savedCards`, `bankAccounts`, `stripePayments`

## Database Architecture

### Schema Organization
The database schema is defined in `shared/schema.ts` using Drizzle ORM.

**Current Structure** (7,834 lines in single file):
- All tables defined in one file
- Insert schemas generated with `createInsertSchema` from drizzle-zod
- Type exports for type safety across client and server

**Key Patterns**:
```typescript
// Table definition
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  // ...
});

// Insert schema (with omitted auto-generated fields)
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

### Common Table Patterns

1. **ID Generation**: UUIDs via `gen_random_uuid()`
2. **Timestamps**: `createdAt` and `updatedAt` where needed
3. **Soft Deletes**: `isActive` flags for soft deletion
4. **Status Tracking**: Enum-like text fields with clear states
5. **JSON Columns**: Used for flexible data (metadata, arrays of objects)
6. **Foreign Keys**: References with cascade behavior where appropriate

## API Architecture

### Route Organization
Routes are centralized in `server/routes.ts` (11k+ lines).

**Pattern**:
```typescript
// Authentication
app.post("/api/auth/send-otp", createRateLimiter('OTP_GENERATION'), async (req, res) => {
  const { phone } = otpGenerationSchema.parse(req.body);
  // ... implementation
});

// Protected routes
app.get("/api/user/profile", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  // ... implementation
});

// Optional auth
app.get("/api/loans/offers", optionalAuth, async (req, res) => {
  // ... implementation  
});
```

### Middleware Stack

1. **Security Middleware** (`securityHeaders`):
   - CSP headers
   - XSS protection
   - CORS configuration
   - Frame options

2. **Rate Limiting** (`createRateLimiter`):
   - Per-endpoint rate limits
   - IP + User-Agent based identification
   - Configurable windows and limits

3. **Authentication**:
   - `requireAuth`: Enforces JWT authentication
   - `optionalAuth`: Populates user if authenticated, allows anonymous
   - JWT stored in HTTP-only cookies

4. **Input Sanitization** (`sanitizeInput`):
   - XSS prevention
   - Script tag removal
   - Event handler removal

5. **Error Handling** (`enhancedErrorHandler`):
   - Consistent error responses
   - Request ID tracking
   - Error logging
   - Sanitized client responses

### API Response Patterns

**Success Response**:
```typescript
res.json({ 
  success: true, 
  data: result,
  message: "Optional success message"
});
```

**Error Response**:
```typescript
res.status(400).json({ 
  success: false, 
  message: "User-friendly error message",
  timestamp: new Date().toISOString(),
  requestId: req.headers['x-request-id']
});
```

## Frontend Architecture

### Page Structure

**Standard Page Pattern**:
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function ExamplePage() {
  const { toast } = useToast();
  
  // Data fetching
  const { data, isLoading } = useQuery({
    queryKey: ['/api/endpoint'],
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ... }
  });
  
  // Mutations
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest('POST', '/api/endpoint', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
      toast({ title: "Success" });
    }
  });
  
  return (
    // ... JSX with data-testid attributes
  );
}
```

### Key Frontend Patterns

1. **Routing**: Lazy-loaded pages with `lazy()` and `<Suspense>`
2. **State Management**: Server state via TanStack Query, local state via `useState`
3. **Forms**: React Hook Form with Zod validation
4. **Styling**: Tailwind utility classes with custom design tokens
5. **Loading States**: Skeleton screens and loading spinners
6. **Error Handling**: Error boundaries for graceful degradation
7. **Navigation**: Bottom navigation for mobile-first design

### Design System

**Color Tokens** (defined in `client/src/index.css`):
- Primary: Red/Rose tones
- Backgrounds: Black/dark grays
- Text: White/gray tones
- Accent colors for different services

**Component Library**:
- Base components from Radix UI
- Customized shadcn/ui components
- Domain-specific components (booking, rewards, etc.)

### Data Flow

```
User Action → Form Submission → React Hook Form + Zod Validation 
  → TanStack Query Mutation → apiRequest → Backend API
  → Server Validation (Zod) → Storage Layer → Database
  → Response → Query Cache Invalidation → UI Update
```

## Storage Layer

### Current Implementation
The storage layer (`server/storage.ts`) provides an abstraction over data access.

**Pattern**:
```typescript
export interface IStorage {
  // User operations
  getUserByPhone(phone: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  
  // Loan operations
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  // ... more operations
}
```

### Mock vs Production

**Development**: Uses in-memory storage with mock data
**Production**: Should use database-backed implementation

The current implementation uses maps and arrays to simulate database operations, which should be replaced with actual database queries for production deployment.

## Security Architecture

### Authentication Flow

1. User enters phone number
2. OTP sent (mock in development)
3. OTP verified
4. JWT token generated and set in HTTP-only cookie
5. Subsequent requests include JWT cookie
6. Server validates JWT and populates `req.user`

### Rate Limiting

**Configuration** (per endpoint type):
- OTP Generation: 3 per 15 minutes
- OTP Verification: 5 per 15 minutes
- Loan Applications: 3 per hour
- General API: 100 per 15 minutes
- UPI Payments: 20 per 15 minutes
- Bill Payments: 15 per 15 minutes

**Storage**: Currently in-memory (Map) - should use Redis for production

### Content Security Policy

**Development**:
- Allows inline scripts and eval for hot reload
- Allows unsafe-inline styles

**Production** (recommended):
- Strict CSP without inline scripts
- Whitelist only necessary domains
- Frame protection

### Input Sanitization

All request bodies are sanitized to remove:
- Script tags
- JavaScript protocols
- Event handlers
- Potentially malicious content

## Performance Optimizations

### Frontend

1. **Code Splitting**: Lazy loading all page components
2. **Route-based Splitting**: Each page is its own chunk
3. **Component Memoization**: Used where appropriate for expensive computations
4. **Query Caching**: TanStack Query with 5-minute stale time
5. **Image Optimization**: Lazy loading images with placeholder states

### Backend

1. **Database Indexes**: Defined on frequently queried fields
2. **Connection Pooling**: Configured via Drizzle
3. **Response Compression**: Should be enabled in production
4. **Static Asset Caching**: Configured via Express static

## Testing Strategy

### Required Test IDs

All interactive elements and important data displays must have `data-testid` attributes:

**Pattern**:
- Interactive: `{action}-{target}` (e.g., `button-submit`, `input-email`)
- Display: `{type}-{content}` (e.g., `text-balance`, `status-payment`)
- Dynamic: `{type}-{description}-{id}` (e.g., `card-loan-${loanId}`)

### Testing Layers

1. **Unit Tests**: Business logic, utilities, hooks
2. **Integration Tests**: API endpoints, database operations
3. **E2E Tests**: Critical user flows (authentication, payments, bookings)

## Deployment Considerations

### Environment Variables

**Required**:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `STRIPE_SECRET_KEY`: Stripe API key (if using payments)
- `NODE_ENV`: production | development

**Optional**:
- `OTP_MODE`: mock | real (for testing)
- `OPENAI_API_KEY`: For AI features

### Database Migrations

```bash
# Push schema changes
npm run db:push

# Generate migrations (recommended for production)
npx drizzle-kit generate:pg
```

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Production start
npm start
```

### Production Checklist

- [ ] Switch from in-memory to Redis for rate limiting
- [ ] Switch from mock storage to database storage
- [ ] Enable database migrations instead of db:push
- [ ] Configure production-grade CSP
- [ ] Set up proper logging service
- [ ] Configure HTTPS/TLS
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit
- [ ] Load testing
- [ ] Set up error tracking (Sentry, etc.)

## Feature Domain Mapping

### Payments Domain
- **Frontend**: `/upi-*`, `/bill-payment*`, `/bank-transfer*`
- **Backend**: Routes under `/api/upi/*`, `/api/bills/*`
- **Database**: `upiTransactions`, `billPaymentHistory`, `fundTransactions`
- **Key Services**: UPI processing, bill payment integration

### Lending Domain
- **Frontend**: `/loan-*`, `/emi-*`, `/marketplace`, `/credit-card-*`
- **Backend**: Routes under `/api/loans/*`, `/api/credit-cards/*`
- **Database**: `loanApplications`, `emiPayments`, `loanOffers`, `creditCardOffers`
- **Key Services**: Eligibility calculation, EMI calculation, offer matching

### Investment Domain
- **Frontend**: `/investment`, `/stocks-*`, `/mutual-funds-*`, `/sip-*`, `/fd-*`
- **Backend**: Routes under `/api/investments/*`, `/api/market/*`
- **Database**: `investmentPortfolio`, `investmentOrders`, `sipInvestments`, `fixedDeposits`
- **Key Services**: Market data integration, order execution, portfolio tracking

### Travel Domain
- **Frontend**: `/booking/*`, `/flight-*`, `/bus-*`, `/train-*`, `/hotel-*`, `/cab-*`
- **Backend**: Routes under `/api/travel/*`, `/api/bookings/*`
- **Database**: `travelRoutes`, `travelSchedules`, `travelBookings`, `hotels`, `movies`
- **Key Services**: Seat allocation, booking management, payment integration

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` type - prefer `unknown` or proper typing
- Use type inference where obvious
- Export types for reusability
- Use discriminated unions for state management

### React

- Functional components only
- Use hooks for state and side effects
- Keep components focused and single-purpose
- Extract complex logic into custom hooks
- Use `data-testid` for all testable elements

### API Design

- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Zod validation for all inputs
- Rate limiting on sensitive endpoints

### Database

- Use transactions for multi-step operations
- Add indexes for frequently queried fields
- Use proper foreign key constraints
- Implement soft deletes where appropriate
- Add timestamps for audit trails

## Architecture Improvements (Future)

### Recommended Refactoring

1. **Domain-Driven Design**:
   - Split `schema.ts` into domain modules (payments, lending, travel, etc.)
   - Create domain-specific storage interfaces
   - Split routes into domain routers

2. **Production Infrastructure**:
   - Redis for rate limiting and session storage
   - Database connection pooling
   - CDN for static assets
   - Load balancing for horizontal scaling

3. **Observability**:
   - Structured logging with log levels
   - Performance monitoring (APM)
   - Error tracking and alerting
   - User analytics

4. **Testing**:
   - Unit test coverage for business logic
   - Integration tests for API endpoints
   - E2E tests for critical flows
   - Performance testing

5. **Documentation**:
   - API documentation (OpenAPI/Swagger)
   - Component storybook
   - Developer onboarding guide
   - Deployment runbooks

## Conclusion

This application is a comprehensive financial super-app with extensive features across multiple domains. The architecture is functional but optimized for rapid development. For production deployment, focus on:

1. **Security**: Harden CSP, implement Redis for sessions, add comprehensive audit logging
2. **Scalability**: Database optimization, caching strategy, horizontal scaling
3. **Reliability**: Error handling, monitoring, automated testing
4. **Maintainability**: Refactor into domain modules, enforce coding standards, improve documentation

The codebase demonstrates good use of modern technologies and patterns but requires production hardening and architectural refactoring for long-term maintainability at scale.
