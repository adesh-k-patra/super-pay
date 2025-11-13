import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  name: text("name"),
  email: text("email"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  pincode: text("pincode"),
  panCard: text("pan_card"),
  residenceType: text("residence_type"),
  creditScore: integer("credit_score").default(750),
  isVerified: integer("is_verified").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  loanType: text("loan_type").notNull(), // 'personal', 'vehicle', 'home'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  tenure: integer("tenure").notNull(), // months
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  emi: decimal("emi", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'active', 'rejected', 'completed'
  purpose: text("purpose"),
  applicationNumber: text("application_number").notNull().unique(),
  approvedAmount: decimal("approved_amount", { precision: 12, scale: 2 }),
  disbursedAmount: decimal("disbursed_amount", { precision: 12, scale: 2 }),
  outstandingAmount: decimal("outstanding_amount", { precision: 12, scale: 2 }),
  totalPaid: decimal("total_paid", { precision: 12, scale: 2 }).default("0"),
  nextEmiDate: timestamp("next_emi_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emiPayments = pgTable("emi_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loanApplications.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  status: text("status").notNull().default("success"), // 'success', 'failed', 'pending'
  transactionId: text("transaction_id"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'payment', 'document', 'approval', 'reminder'
  isRead: integer("is_read").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const otps = pgTable("otps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: integer("is_used").default(0),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  applicationNumber: true,
});

export const insertEmiPaymentSchema = createInsertSchema(emiPayments).omit({
  id: true,
  paymentDate: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertOtpSchema = createInsertSchema(otps).omit({
  id: true,
  createdAt: true,
});

// OTP schemas
export const otpGenerationSchema = z.object({
  phone: z.string().min(10).max(10),
});

export const otpVerificationSchema = z.object({
  phone: z.string().min(10).max(10),
  otp: z.string().length(4),
});

// Loan eligibility check schema
export const loanEligibilitySchema = z.object({
  maritalStatus: z.string(),
  residenceType: z.string(),
  dateOfBirth: z.string(),
  gender: z.string(),
  pincode: z.string(),
  panCard: z.string(),
  purpose: z.string(),
});

// New tables for marketplace features
export const loanOffers = pgTable("loan_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lenderId: varchar("lender_id").notNull(),
  lenderName: text("lender_name").notNull(),
  loanType: text("loan_type").notNull(),
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  processingFee: decimal("processing_fee", { precision: 5, scale: 2 }),
  maxTenure: integer("max_tenure").notNull(),
  trustBadge: text("trust_badge").notNull().default("bronze"), // diamond, gold, silver, bronze
  approvalSpeed: text("approval_speed").default("24 hours"),
  requiredDocs: jsonb("required_docs"),
  isSponsored: integer("is_sponsored").default(0),
  isSuperPayBacked: integer("is_superpay_backed").default(0),
  eligibilityCriteria: jsonb("eligibility_criteria"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFinancialReports = pgTable("user_financial_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("free"), // free, basic, pro
  creditScore: integer("credit_score"),
  eligibilityScore: integer("eligibility_score"),
  debtToIncomeRatio: decimal("debt_to_income_ratio", { precision: 5, scale: 2 }),
  totalDebt: decimal("total_debt", { precision: 12, scale: 2 }),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }),
  improvementActions: jsonb("improvement_actions"),
  projectedScoreChanges: jsonb("projected_score_changes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const securityScans = pgTable("security_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  scanType: text("scan_type").notNull(), // url, message, screenshot
  inputData: text("input_data").notNull(),
  authenticityScore: integer("authenticity_score").notNull(), // 0-10
  riskLevel: text("risk_level").notNull(), // safe, caution, danger
  evidenceFound: jsonb("evidence_found"),
  recommendedAction: text("recommended_action"),
  isReported: integer("is_reported").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coachInteractions = pgTable("coach_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  question: text("question").notNull(),
  response: text("response").notNull(),
  context: jsonb("context"),
  confidenceLevel: text("confidence_level").default("medium"),
  actionsSuggested: jsonb("actions_suggested"),
  isSaved: integer("is_saved").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const learningContent = pgTable("learning_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull(),
  creatorName: text("creator_name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // video, article, course
  thumbnailUrl: text("thumbnail_url"),
  contentUrl: text("content_url"),
  duration: integer("duration"), // in minutes
  tags: jsonb("tags"),
  difficulty: text("difficulty").default("beginner"),
  isSponsored: integer("is_sponsored").default(0),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fitnessActivities = pgTable("fitness_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // steps, workout, run
  value: integer("value").notNull(), // steps count, minutes, distance
  pointsEarned: integer("points_earned").default(0),
  challengeId: varchar("challenge_id"),
  deviceSource: text("device_source"), // google_fit, apple_health
  recordedAt: timestamp("recorded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPoints = pgTable("user_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalPoints: integer("total_points").default(0),
  availablePoints: integer("available_points").default(0),
  pointsEarned: integer("points_earned").default(0),
  pointsSpent: integer("points_spent").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Investment Portfolio Tables
export const investmentPortfolio = pgTable("investment_portfolio", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  investmentType: text("investment_type").notNull(), // stocks, mutual_funds, bonds, fixed_deposits, crypto
  instrumentName: text("instrument_name").notNull(),
  symbol: text("symbol"), // For stocks/crypto
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  avgPrice: decimal("avg_price", { precision: 12, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }),
  totalInvested: decimal("total_invested", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }),
  gainLoss: decimal("gain_loss", { precision: 15, scale: 2 }),
  gainLossPercentage: decimal("gain_loss_percentage", { precision: 8, scale: 4 }),
  dividendEarned: decimal("dividend_earned", { precision: 12, scale: 2 }).default("0"),
  maturityDate: timestamp("maturity_date"),
  riskLevel: text("risk_level").default("medium"), // low, medium, high
  category: text("category"), // large_cap, mid_cap, small_cap, debt, hybrid
  isActive: integer("is_active").default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Referral System Tables
export const referralProgram = pgTable("referral_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  referralCode: text("referral_code").notNull().unique(),
  totalReferrals: integer("total_referrals").default(0),
  successfulReferrals: integer("successful_referrals").default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0"),
  availableEarnings: decimal("available_earnings", { precision: 12, scale: 2 }).default("0"),
  withdrawnEarnings: decimal("withdrawn_earnings", { precision: 12, scale: 2 }).default("0"),
  referralTier: text("referral_tier").default("bronze"), // bronze, silver, gold, platinum
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userUniqueIdx: uniqueIndex("referral_program_user_unique_idx").on(table.userId),
}));

export const referralTransactions = pgTable("referral_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  refereeId: varchar("referee_id").references(() => users.id).notNull(),
  referralCode: text("referral_code").notNull(),
  bonusType: text("bonus_type").notNull(), // signup_bonus, first_transaction, loan_approval
  bonusAmount: decimal("bonus_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, paid, cancelled
  description: text("description"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Rewards & Vouchers System
export const userVouchers = pgTable("user_vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  voucherCode: text("voucher_code").notNull(),
  voucherType: text("voucher_type").notNull(), // discount, cashback, free_service
  title: text("title").notNull(),
  description: text("description"),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  category: text("category"), // shopping, travel, food, bills, loans
  merchantName: text("merchant_name"),
  merchantLogo: text("merchant_logo"),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  isUsed: integer("is_used").default(0),
  usedAt: timestamp("used_at"),
  usedFor: text("used_for"), // transaction_id or description
  termsConditions: text("terms_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userVoucherUniqueIdx: uniqueIndex("user_voucher_unique_idx").on(table.userId, table.voucherCode),
}));

export const loyaltyCoins = pgTable("loyalty_coins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalEarned: integer("total_earned").default(0),
  totalSpent: integer("total_spent").default(0),
  currentBalance: integer("current_balance").default(0),
  lifetimeCoins: integer("lifetime_coins").default(0),
  tierLevel: text("tier_level").default("bronze"), // bronze, silver, gold, platinum, diamond
  tierBenefits: jsonb("tier_benefits"),
  nextTierCoins: integer("next_tier_coins"),
  expiringCoins: integer("expiring_coins").default(0),
  expiryDate: timestamp("expiry_date"),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coinTransactions = pgTable("coin_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionType: text("transaction_type").notNull(), // earned, spent, expired, bonus
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // bill_payment, upi_transaction, referral, daily_check_in
  description: text("description").notNull(),
  referenceId: text("reference_id"), // Related transaction/activity ID
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default("1.0"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Bill Payment Analytics
export const billPaymentHistory = pgTable("bill_payment_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  serviceId: varchar("service_id").references(() => billPaymentServices.id).notNull(),
  billAccountNumber: text("bill_account_number").notNull(),
  billType: text("bill_type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  billDate: timestamp("bill_date"),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date").defaultNow(),
  status: text("status").notNull().default("success"), // success, failed, pending
  paymentMethod: text("payment_method").default("upi"),
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  billNumber: text("bill_number"),
  operatorTransactionId: text("operator_transaction_id"),
  cashbackEarned: decimal("cashback_earned", { precision: 8, scale: 2 }).default("0"),
  coinsEarned: integer("coins_earned").default(0),
  isRecurring: integer("is_recurring").default(0),
  recurringDay: integer("recurring_day"), // Day of month for auto-pay
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial Analytics Dashboard Data
export const financialAnalytics = pgTable("financial_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  monthYear: text("month_year").notNull(), // Format: "2024-01"
  totalIncome: decimal("total_income", { precision: 15, scale: 2 }).default("0"),
  totalExpenses: decimal("total_expenses", { precision: 15, scale: 2 }).default("0"),
  totalSavings: decimal("total_savings", { precision: 15, scale: 2 }).default("0"),
  totalInvestments: decimal("total_investments", { precision: 15, scale: 2 }).default("0"),
  totalLoans: decimal("total_loans", { precision: 15, scale: 2 }).default("0"),
  billPayments: decimal("bill_payments", { precision: 12, scale: 2 }).default("0"),
  upiTransactions: decimal("upi_transactions", { precision: 12, scale: 2 }).default("0"),
  emiPayments: decimal("emi_payments", { precision: 12, scale: 2 }).default("0"),
  investmentGains: decimal("investment_gains", { precision: 12, scale: 2 }).default("0"),
  cashbackEarned: decimal("cashback_earned", { precision: 10, scale: 2 }).default("0"),
  coinsEarned: integer("coins_earned").default(0),
  referralEarnings: decimal("referral_earnings", { precision: 10, scale: 2 }).default("0"),
  categoryWiseSpending: jsonb("category_wise_spending"),
  financialHealthScore: integer("financial_health_score").default(0),
  savingsRate: decimal("savings_rate", { precision: 5, scale: 2 }).default("0"),
  expenseGrowth: decimal("expense_growth", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userMonthUniqueIdx: uniqueIndex("financial_analytics_user_month_unique_idx").on(table.userId, table.monthYear),
}));

// Reward system types for enhanced reward detail page
export const rewardCategories = pgTable("reward_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pointsRequired: integer("points_required").notNull(),
  category: text("category").notNull(),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  imageUrl: text("image_url"),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until").notNull(),
  terms: jsonb("terms").notNull(), // Array of terms and conditions
  eligibilityRequirements: jsonb("eligibility_requirements"), // Object with requirements
  merchantInfo: jsonb("merchant_info"), // Merchant details
  redemptionOptions: jsonb("redemption_options"), // Redemption methods and delivery info
  analytics: jsonb("analytics"), // Popularity, satisfaction scores
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rewardRedemptions = pgTable("reward_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rewardId: varchar("reward_id").references(() => rewards.id).notNull(),
  pointsUsed: integer("points_used").notNull(),
  redemptionMethod: text("redemption_method").notNull(), // points, points_cashback, referral_bonus
  status: text("status").notNull().default("pending"), // pending, completed, failed, expired
  transactionId: text("transaction_id"),
  voucherCode: text("voucher_code"),
  deliveryMethod: text("delivery_method").default("email"), // email, sms, app_notification
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fund Management Tables
export const userWallet = pgTable("user_wallet", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalBalance: decimal("total_balance", { precision: 15, scale: 2 }).default("0"),
  availableBalance: decimal("available_balance", { precision: 15, scale: 2 }).default("0"),
  lockedBalance: decimal("locked_balance", { precision: 15, scale: 2 }).default("0"),
  currency: text("currency").default("INR"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userUniqueIdx: uniqueIndex("user_wallet_user_unique_idx").on(table.userId),
}));

export const fundTransactions = pgTable("fund_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'deposit', 'withdraw', 'investment', 'dividend', 'fee'
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 15, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed', 'cancelled'
  description: text("description").notNull(),
  referenceId: text("reference_id"), // External reference like Stripe payment intent ID
  paymentMethod: text("payment_method"), // 'upi', 'stripe', 'bank_transfer'
  paymentProvider: text("payment_provider"), // 'stripe', 'razorpay', 'paytm'
  metadata: jsonb("metadata"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stripePayments = pgTable("stripe_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("inr"),
  status: text("status").notNull(), // 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled'
  paymentMethodTypes: jsonb("payment_method_types").default('[]'),
  clientSecret: text("client_secret"),
  metadata: jsonb("metadata"),
  stripeCreatedAt: timestamp("stripe_created_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel Booking System Tables
export const travelRoutes = pgTable("travel_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceType: text("service_type").notNull(), // 'flight', 'bus', 'train', 'cab', 'metro', 'rental'
  operatorName: text("operator_name").notNull(),
  operatorLogo: text("operator_logo"),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  fromCode: text("from_code"), // Airport/station codes
  toCode: text("to_code"),
  routeNumber: text("route_number"), // Flight number, train number, bus route
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  distance: integer("distance"), // in kilometers
  amenities: jsonb("amenities"), // wifi, food, ac, etc.
  seatClasses: jsonb("seat_classes"), // economy, business, etc.
  vehicleType: text("vehicle_type"), // For cab/rental: sedan, suv, luxury, bike, etc.
  pricePerKm: decimal("price_per_km", { precision: 10, scale: 2 }), // For cab/rental
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }), // For rental
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelSchedules = pgTable("travel_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").references(() => travelRoutes.id).notNull(),
  departureTime: text("departure_time").notNull(), // Format: "HH:MM"
  arrivalTime: text("arrival_time").notNull(),
  departureDate: text("departure_date").notNull(), // Format: "YYYY-MM-DD"
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  dynamicPricing: decimal("dynamic_pricing", { precision: 5, scale: 2 }).default("1.0"), // Multiplier
  status: text("status").default("active"), // active, cancelled, delayed
  delayMinutes: integer("delay_minutes").default(0),
  boardingGate: text("boarding_gate"),
  platform: text("platform"),
  terminal: text("terminal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelBookings = pgTable("travel_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  scheduleId: varchar("schedule_id").references(() => travelSchedules.id),
  bookingReference: text("booking_reference").notNull().unique(),
  serviceType: text("service_type").notNull(), // 'flight', 'bus', 'train', 'cab', 'metro', 'rental'
  operatorName: text("operator_name").notNull(),
  routeNumber: text("route_number"),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time"),
  totalPassengers: integer("total_passengers").notNull(),
  seatClass: text("seat_class"),
  seatNumbers: text("seat_numbers").array(),
  vehicleType: text("vehicle_type"), // For cab/rental
  pickupAddress: text("pickup_address"), // For cab/rental
  dropoffAddress: text("dropoff_address"), // For cab/rental
  rentalDuration: integer("rental_duration"), // For rental in hours
  driverName: text("driver_name"), // For cab
  driverPhone: text("driver_phone"), // For cab
  vehicleNumber: text("vehicle_number"), // For cab/rental
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  baseAmount: decimal("base_amount", { precision: 12, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 10, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  discounts: decimal("discounts", { precision: 10, scale: 2 }).default("0"),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed, refunded
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method").default("upi"),
  paymentReference: text("payment_reference"),
  cancellationPolicy: jsonb("cancellation_policy"),
  specialRequests: text("special_requests"),
  contactInfo: jsonb("contact_info"),
  bookingSource: text("booking_source").default("app"),
  isRefundable: integer("is_refundable").default(1),
  checkInStatus: text("check_in_status").default("not_checked_in"), // not_checked_in, checked_in, boarding_pass_issued
  boardingGate: text("boarding_gate"),
  platform: text("platform"),
  terminal: text("terminal"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const travelPassengers = pgTable("travel_passengers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  title: text("title").notNull(), // Mr, Ms, Mrs, Dr
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality").default("Indian"),
  idType: text("id_type"), // passport, aadhar, voter_id, driving_license
  idNumber: text("id_number"),
  seatNumber: text("seat_number"),
  mealPreference: text("meal_preference"),
  specialAssistance: text("special_assistance"),
  isInfant: integer("is_infant").default(0),
  frequentFlyerNumber: text("frequent_flyer_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelPayments = pgTable("travel_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  paymentReference: text("payment_reference").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // upi, stripe, wallet
  paymentProvider: text("payment_provider"), // stripe, razorpay, paytm
  status: text("status").notNull().default("pending"), // pending, success, failed, refunded
  transactionId: text("transaction_id"),
  gatewayResponse: jsonb("gateway_response"),
  refundAmount: decimal("refund_amount", { precision: 12, scale: 2 }).default("0"),
  refundReason: text("refund_reason"),
  refundDate: timestamp("refund_date"),
  currency: text("currency").default("INR"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const travelCancellations = pgTable("travel_cancellations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cancellationReason: text("cancellation_reason").notNull(),
  cancellationCharge: decimal("cancellation_charge", { precision: 10, scale: 2 }).notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundMethod: text("refund_method").default("original_payment"),
  refundStatus: text("refund_status").default("pending"), // pending, processed, failed
  refundReference: text("refund_reference"),
  cancellationPolicy: jsonb("cancellation_policy"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel Contracts (Corporate Bookings)
export const travelContracts = pgTable("travel_contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contractNumber: text("contract_number").notNull().unique(),
  contractName: text("contract_name").notNull(),
  partnerName: text("partner_name").notNull(),
  serviceTypes: text("service_types").array(), // ['flight', 'cab', 'hotel']
  routes: jsonb("routes"), // Array of applicable routes
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).default("0"),
  negotiatedRates: jsonb("negotiated_rates"), // Custom pricing structure
  bookingLimits: jsonb("booking_limits"), // Monthly/yearly limits
  billingCycle: text("billing_cycle").default("monthly"), // monthly, quarterly, net30, net45
  invoicingTerms: text("invoicing_terms"),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  specialSkus: jsonb("special_skus"), // Corporate cab pool, special fares
  blackoutDates: text("blackout_dates").array(),
  status: text("status").default("active"), // draft, active, expired, cancelled
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  documentUrl: text("document_url"),
  signedDocumentUrl: text("signed_document_url"),
  signatoryName: text("signatory_name"),
  signatoryEmail: text("signatory_email"),
  totalBookingsUnderContract: integer("total_bookings_under_contract").default(0),
  totalAmountUnderContract: decimal("total_amount_under_contract", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel Add-ons
export const travelAddons = pgTable("travel_addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  addonType: text("addon_type").notNull(), // baggage, meal, insurance, seat, lounge, priority_boarding
  addonName: text("addon_name").notNull(),
  quantity: integer("quantity").default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("active"), // active, cancelled
  metadata: jsonb("metadata"), // Additional details like seat number, meal preference, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Live Tracking (for cabs/rides)
export const travelLiveTracking = pgTable("travel_live_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  currentLatitude: text("current_latitude"),
  currentLongitude: text("current_longitude"),
  driverLatitude: text("driver_latitude"),
  driverLongitude: text("driver_longitude"),
  eta: integer("eta"), // in minutes
  distanceRemaining: decimal("distance_remaining", { precision: 10, scale: 2 }), // in km
  status: text("status").default("assigned"), // assigned, started, enroute, arrived, completed
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Boarding Passes
export const boardingPasses = pgTable("boarding_passes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  passengerId: varchar("passenger_id").references(() => travelPassengers.id).notNull(),
  barcodeUrl: text("barcode_url"),
  qrCodeUrl: text("qr_code_url"),
  boardingGate: text("boarding_gate"),
  boardingTime: text("boarding_time"),
  seatNumber: text("seat_number"),
  pnrNumber: text("pnr_number"),
  issuedAt: timestamp("issued_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking Modifications
export const travelModifications = pgTable("travel_modifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modificationType: text("modification_type").notNull(), // date_change, seat_change, upgrade, passenger_change
  originalDetails: jsonb("original_details").notNull(),
  newDetails: jsonb("new_details").notNull(),
  modificationCharge: decimal("modification_charge", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // pending, approved, rejected, completed
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel Alerts & Delays
export const travelAlerts = pgTable("travel_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => travelBookings.id),
  scheduleId: varchar("schedule_id").references(() => travelSchedules.id),
  alertType: text("alert_type").notNull(), // delay, cancellation, gate_change, platform_change, advisory
  severity: text("severity").default("info"), // info, warning, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  delayMinutes: integer("delay_minutes"),
  newGate: text("new_gate"),
  newPlatform: text("new_platform"),
  affectedServices: text("affected_services").array(),
  isResolved: integer("is_resolved").default(0),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel & Entertainment Coupons
export const travelCoupons = pgTable("travel_coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("percentage"), // "percentage", "flat"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  minBookingAmount: decimal("min_booking_amount", { precision: 10, scale: 2 }).default("0"),
  applicableServiceTypes: jsonb("applicable_service_types").default('[]'), // ['flight', 'bus', 'train', 'cab', 'metro', 'rental', 'hotel', 'event', 'movie']
  userType: text("user_type").default("all"), // "all", "new", "existing"
  usageLimit: integer("usage_limit"), // Total uses allowed
  usageCount: integer("usage_count").default(0),
  userLimit: integer("user_limit").default(1), // Uses per user
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: integer("is_active").default(1),
  termsConditions: text("terms_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  codeIdx: uniqueIndex("travel_coupons_code_idx").on(table.code),
  validityIdx: index("travel_coupons_validity_idx").on(table.validFrom, table.validUntil),
}));

// Coupon Usage Tracking for Travel & Entertainment
export const travelCouponUsage = pgTable("travel_coupon_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponId: varchar("coupon_id").references(() => travelCoupons.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id"),
  serviceType: text("service_type").notNull(), // 'flight', 'bus', 'train', 'cab', 'metro', 'rental', 'hotel', 'event', 'movie'
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
}, (table) => ({
  couponUserIdx: index("travel_coupon_usage_coupon_user_idx").on(table.couponId, table.userId),
  bookingIdx: index("travel_coupon_usage_booking_idx").on(table.bookingId),
}));

// ========================================
// DRIVER & VEHICLE MANAGEMENT SYSTEM
// World-class Uber-like driver, vehicle, and rental system
// ========================================

// Driver Profiles - Comprehensive driver information
export const driverProfiles = pgTable("driver_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Optional link to user account
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  email: text("email"),
  profilePhotoUrl: text("profile_photo_url"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  
  // License & Verification
  licenseNumber: text("license_number").notNull().unique(),
  licenseExpiryDate: timestamp("license_expiry_date").notNull(),
  licenseIssueState: text("license_issue_state"),
  licensePhotoUrl: text("license_photo_url"),
  backgroundCheckStatus: text("background_check_status").default("pending"), // pending, verified, failed
  backgroundCheckDate: timestamp("background_check_date"),
  isVerified: integer("is_verified").default(0),
  verificationDocuments: jsonb("verification_documents"), // Array of document URLs
  
  // Professional Details
  experience: integer("experience").default(0), // years of experience
  languages: text("languages").array(), // ['English', 'Hindi', 'Tamil']
  specializations: text("specializations").array(), // ['Airport transfers', 'Long distance', 'Luxury']
  certifications: jsonb("certifications"), // Training certificates, awards
  
  // Location & Availability
  primaryCity: text("primary_city").notNull(),
  operatingArea: jsonb("operating_area"), // Geographic boundaries
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }),
  lastLocationUpdate: timestamp("last_location_update"),
  status: text("status").default("offline"), // online, offline, busy, on_trip
  isAvailable: integer("is_available").default(1),
  
  // Ratings & Performance
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalRatings: integer("total_ratings").default(0),
  totalTrips: integer("total_trips").default(0),
  completedTrips: integer("completed_trips").default(0),
  cancelledTrips: integer("cancelled_trips").default(0),
  acceptanceRate: decimal("acceptance_rate", { precision: 5, scale: 2 }).default("100"),
  cancellationRate: decimal("cancellation_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Earnings & Payouts
  totalEarnings: decimal("total_earnings", { precision: 15, scale: 2 }).default("0"),
  availableEarnings: decimal("available_earnings", { precision: 15, scale: 2 }).default("0"),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  
  // Account Status
  isActive: integer("is_active").default(1),
  isSuspended: integer("is_suspended").default(0),
  suspensionReason: text("suspension_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  statusCityIdx: index("driver_profiles_status_city_idx").on(table.status, table.primaryCity),
  locationIdx: index("driver_profiles_location_idx").on(table.currentLatitude, table.currentLongitude),
  phoneIdx: index("driver_profiles_phone_idx").on(table.phoneNumber),
  userIdIdx: index("driver_profiles_user_id_idx").on(table.userId),
  isAvailableIdx: index("driver_profiles_is_available_idx").on(table.isAvailable, table.status),
}));

// Driver Experience & Achievements
export const driverExperience = pgTable("driver_experience", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => driverProfiles.id).notNull(),
  achievementType: text("achievement_type").notNull(), // certification, award, milestone
  title: text("title").notNull(),
  description: text("description"),
  issuer: text("issuer"), // Issuing authority
  issueDate: timestamp("issue_date"),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  driverIdIdx: index("driver_experience_driver_id_idx").on(table.driverId),
}));

// Driver Schedule & Availability
export const driverSchedules = pgTable("driver_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => driverProfiles.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
  isRecurring: integer("is_recurring").default(1),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  driverIdIdx: index("driver_schedules_driver_id_idx").on(table.driverId),
  driverDayIdx: index("driver_schedules_driver_day_idx").on(table.driverId, table.dayOfWeek),
}));

// Driver Shifts & Work Sessions
export const driverShifts = pgTable("driver_shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => driverProfiles.id).notNull(),
  shiftDate: timestamp("shift_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  totalHours: decimal("total_hours", { precision: 5, scale: 2 }),
  totalDistance: decimal("total_distance", { precision: 10, scale: 2 }), // in km
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  totalTrips: integer("total_trips").default(0),
  status: text("status").default("active"), // active, completed
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  driverDateIdx: index("driver_shifts_driver_date_idx").on(table.driverId, table.shiftDate),
  statusIdx: index("driver_shifts_status_idx").on(table.status),
}));

// Vehicle Owners - Independent vehicle owners
export const vehicleOwners = pgTable("vehicle_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Optional link to user account
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  email: text("email"),
  
  // Business Details
  businessType: text("business_type").default("individual"), // individual, partnership, company
  businessRegistrationNumber: text("business_registration_number"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  
  // Address
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  
  // Fleet Information
  totalVehicles: integer("total_vehicles").default(0),
  activeVehicles: integer("active_vehicles").default(0),
  
  // Ratings & Performance
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalRatings: integer("total_ratings").default(0),
  totalBookings: integer("total_bookings").default(0),
  
  // Verification
  isVerified: integer("is_verified").default(0),
  verificationDate: timestamp("verification_date"),
  
  // Bank Details for Payouts
  bankAccountNumber: text("bank_account_number"),
  bankIfscCode: text("bank_ifsc_code"),
  bankAccountHolderName: text("bank_account_holder_name"),
  
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  cityIdx: index("vehicle_owners_city_idx").on(table.city),
}));

// Rental Companies - Enterprise rental companies
export const rentalCompanies = pgTable("rental_companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Optional link to user account
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  
  // Contact Information
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactPhone: text("primary_contact_phone").notNull().unique(),
  primaryContactEmail: text("primary_contact_email").notNull(),
  
  // Business Details
  businessRegistrationNumber: text("business_registration_number").notNull(),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  
  // Head Office Address
  headOfficeAddress: text("head_office_address").notNull(),
  headOfficeCity: text("head_office_city").notNull(),
  headOfficeState: text("head_office_state").notNull(),
  headOfficePincode: text("head_office_pincode").notNull(),
  
  // Fleet Information
  totalLocations: integer("total_locations").default(1),
  totalVehicles: integer("total_vehicles").default(0),
  activeVehicles: integer("active_vehicles").default(0),
  vehicleCategories: jsonb("vehicle_categories"), // ['Economy', 'Luxury', 'SUV']
  
  // Ratings & Performance
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalRatings: integer("total_ratings").default(0),
  totalBookings: integer("total_bookings").default(0),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("100"),
  
  // Verification
  isVerified: integer("is_verified").default(0),
  verificationDate: timestamp("verification_date"),
  trustBadge: text("trust_badge").default("bronze"), // bronze, silver, gold, platinum
  
  // Services & Features
  services: jsonb("services"), // ['24/7 Support', 'Airport Pickup', 'Self Drive', 'Chauffeur']
  amenities: jsonb("amenities"), // ['GPS', 'Child Seat', 'WiFi']
  
  // Operating Details
  operatingHours: text("operating_hours").default("24/7"),
  cancellationPolicy: jsonb("cancellation_policy"),
  insuranceCoverage: jsonb("insurance_coverage"),
  
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  cityIdx: index("rental_companies_city_idx").on(table.headOfficeCity),
}));

// Rental Company Locations - Multiple locations for rental companies
export const companyLocations = pgTable("company_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").references(() => rentalCompanies.id).notNull(),
  locationName: text("location_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  contactPhone: text("contact_phone"),
  operatingHours: text("operating_hours").default("24/7"),
  vehiclesCount: integer("vehicles_count").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  companyCityIdx: index("company_locations_company_city_idx").on(table.companyId, table.city),
  locationIdx: index("company_locations_location_idx").on(table.latitude, table.longitude),
}));

// Vehicles - Comprehensive vehicle information for cabs and rentals
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").references(() => vehicleOwners.id),
  companyId: varchar("company_id").references(() => rentalCompanies.id),
  locationId: varchar("location_id").references(() => companyLocations.id),
  driverId: varchar("driver_id").references(() => driverProfiles.id), // For cabs
  
  // Vehicle Type
  vehicleType: text("vehicle_type").notNull(), // cab, rental_car, bike
  category: text("category").notNull(), // economy, premium, luxury, suv, sedan, hatchback
  
  // Vehicle Details
  make: text("make").notNull(), // Maruti, Honda, Toyota
  model: text("model").notNull(), // Swift, City, Fortuner
  year: integer("year").notNull(),
  color: text("color").notNull(),
  registrationNumber: text("registration_number").notNull().unique(),
  registrationState: text("registration_state").notNull(),
  
  // Technical Specifications
  fuelType: text("fuel_type").notNull(), // petrol, diesel, electric, hybrid
  transmission: text("transmission").notNull(), // manual, automatic
  seatingCapacity: integer("seating_capacity").notNull(),
  engineCapacity: text("engine_capacity"), // "1500cc"
  mileage: text("mileage"), // "18 kmpl"
  
  // Condition & Status
  currentMileage: integer("current_mileage").default(0), // in km
  condition: text("condition").default("excellent"), // excellent, good, fair
  lastServiceDate: timestamp("last_service_date"),
  nextServiceDue: timestamp("next_service_due"),
  status: text("status").default("available"), // available, rented, maintenance, offline
  
  // Pricing
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }),
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }),
  pricePerKm: decimal("price_per_km", { precision: 10, scale: 2 }),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  
  // Features & Amenities
  features: jsonb("features"), // ['AC', 'Power Steering', 'ABS', 'Airbags', 'Sunroof', 'GPS', 'Bluetooth']
  amenities: jsonb("amenities"), // ['Music System', 'USB Charger', 'Aux Cable']
  
  // Insurance & Documents
  insuranceNumber: text("insurance_number"),
  insuranceProvider: text("insurance_provider"),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  rcBookUrl: text("rc_book_url"),
  insuranceCertificateUrl: text("insurance_certificate_url"),
  pollutionCertificateUrl: text("pollution_certificate_url"),
  pollutionExpiryDate: timestamp("pollution_expiry_date"),
  
  // Location (for cabs)
  currentCity: text("current_city"),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }),
  lastLocationUpdate: timestamp("last_location_update"),
  
  // Ratings & Performance
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalRatings: integer("total_ratings").default(0),
  totalTrips: integer("total_trips").default(0),
  
  // Availability
  isAvailable: integer("is_available").default(1),
  availableFrom: timestamp("available_from"),
  availableUntil: timestamp("available_until"),
  
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  typeCityIdx: index("vehicles_type_city_idx").on(table.vehicleType, table.currentCity, table.status),
  ownerIdx: index("vehicles_owner_idx").on(table.ownerId),
  companyIdx: index("vehicles_company_idx").on(table.companyId),
  driverIdx: index("vehicles_driver_idx").on(table.driverId),
  locationIdx: index("vehicles_location_idx").on(table.currentLatitude, table.currentLongitude),
  regNumberIdx: index("vehicles_reg_number_idx").on(table.registrationNumber),
  statusAvailableIdx: index("vehicles_status_available_idx").on(table.status, table.isAvailable),
  categoryStatusIdx: index("vehicles_category_status_idx").on(table.category, table.status),
}));

// Vehicle Images - Multiple images for vehicles
export const vehicleImages = pgTable("vehicle_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  imageUrl: text("image_url").notNull(),
  imageType: text("image_type").default("exterior"), // exterior, interior, dashboard, engine
  isPrimary: integer("is_primary").default(0),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  vehicleIdx: index("vehicle_images_vehicle_idx").on(table.vehicleId),
  vehiclePrimaryIdx: index("vehicle_images_vehicle_primary_idx").on(table.vehicleId, table.isPrimary),
}));

// Vehicle Availability Slots - For rental bookings
export const vehicleAvailabilitySlots = pgTable("vehicle_availability_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  startTime: text("start_time").default("00:00"),
  endTime: text("end_time").default("23:59"),
  isAvailable: integer("is_available").default(1),
  reason: text("reason"), // maintenance, booked, blocked
  bookingId: varchar("booking_id"), // Reference to booking if not available
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  vehicleDateIdx: index("vehicle_availability_vehicle_date_idx").on(table.vehicleId, table.startDate, table.endDate),
  vehicleAvailableIdx: index("vehicle_availability_is_available_idx").on(table.isAvailable, table.startDate),
}));

// Driver-Vehicle Assignment - Many-to-many relationship for cabs
export const driverVehicles = pgTable("driver_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => driverProfiles.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  unassignedAt: timestamp("unassigned_at"),
  isActive: integer("is_active").default(1),
  isPrimary: integer("is_primary").default(1), // Primary vehicle for driver
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  driverVehicleIdx: uniqueIndex("driver_vehicles_driver_vehicle_idx").on(table.driverId, table.vehicleId),
  driverIdx: index("driver_vehicles_driver_idx").on(table.driverId, table.isActive),
  vehicleIdx: index("driver_vehicles_vehicle_idx").on(table.vehicleId, table.isActive),
}));

// Reviews & Ratings - Polymorphic reviews for drivers, vehicles, companies
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bookingId: varchar("booking_id").references(() => travelBookings.id).notNull(),
  
  // Polymorphic target
  targetType: text("target_type").notNull(), // driver, vehicle, company, owner
  targetId: varchar("target_id").notNull(), // ID of driver/vehicle/company/owner
  
  // Rating & Review
  rating: integer("rating").notNull(), // 1-5 stars
  reviewTitle: text("review_title"),
  reviewText: text("review_text"),
  
  // Detailed Ratings
  cleanlinessRating: integer("cleanliness_rating"), // 1-5
  punctualityRating: integer("punctuality_rating"), // 1-5
  behaviorRating: integer("behavior_rating"), // 1-5
  vehicleConditionRating: integer("vehicle_condition_rating"), // 1-5
  valueForMoneyRating: integer("value_for_money_rating"), // 1-5
  
  // Review Metadata
  isVerifiedBooking: integer("is_verified_booking").default(1),
  hasPhotos: integer("has_photos").default(0),
  photosUrls: text("photos_urls").array(),
  
  // Engagement
  helpfulCount: integer("helpful_count").default(0),
  notHelpfulCount: integer("not_helpful_count").default(0),
  
  // Moderation
  isPublic: integer("is_public").default(1),
  isFlagged: integer("is_flagged").default(0),
  flagReason: text("flag_reason"),
  moderationStatus: text("moderation_status").default("approved"), // pending, approved, rejected
  
  // Response from service provider
  hasResponse: integer("has_response").default(0),
  responseText: text("response_text"),
  responseDate: timestamp("response_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  bookingTargetIdx: uniqueIndex("reviews_booking_target_idx").on(table.bookingId, table.targetType),
  targetIdx: index("reviews_target_idx").on(table.targetType, table.targetId),
  userIdx: index("reviews_user_idx").on(table.userId),
  ratingIdx: index("reviews_rating_idx").on(table.rating),
  moderationStatusIdx: index("reviews_moderation_status_idx").on(table.moderationStatus),
  createdAtIdx: index("reviews_created_at_idx").on(table.createdAt),
}));

// Review Votes - Track helpful/not helpful votes
export const reviewVotes = pgTable("review_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").references(() => reviews.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(), // helpful, not_helpful
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  reviewUserIdx: uniqueIndex("review_votes_review_user_idx").on(table.reviewId, table.userId),
  reviewIdIdx: index("review_votes_review_id_idx").on(table.reviewId),
}));

// Review Stats - Aggregated review statistics
export const reviewStats = pgTable("review_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  targetType: text("target_type").notNull(), // driver, vehicle, company, owner
  targetId: varchar("target_id").notNull(),
  
  // Overall Stats
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("5.0"),
  totalReviews: integer("total_reviews").default(0),
  totalRatings: integer("total_ratings").default(0),
  
  // Rating Distribution
  fiveStarCount: integer("five_star_count").default(0),
  fourStarCount: integer("four_star_count").default(0),
  threeStarCount: integer("three_star_count").default(0),
  twoStarCount: integer("two_star_count").default(0),
  oneStarCount: integer("one_star_count").default(0),
  
  // Detailed Average Ratings
  avgCleanlinessRating: decimal("avg_cleanliness_rating", { precision: 3, scale: 2 }),
  avgPunctualityRating: decimal("avg_punctuality_rating", { precision: 3, scale: 2 }),
  avgBehaviorRating: decimal("avg_behavior_rating", { precision: 3, scale: 2 }),
  avgVehicleConditionRating: decimal("avg_vehicle_condition_rating", { precision: 3, scale: 2 }),
  avgValueForMoneyRating: decimal("avg_value_for_money_rating", { precision: 3, scale: 2 }),
  
  // Response Rate
  reviewsWithResponse: integer("reviews_with_response").default(0),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("0"),
  
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  targetIdx: uniqueIndex("review_stats_target_idx").on(table.targetType, table.targetId),
}));

// Vehicle Telematics - Real-time vehicle location and metrics
export const vehicleTelematics = pgTable("vehicle_telematics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  heading: integer("heading"), // 0-360 degrees
  altitude: decimal("altitude", { precision: 10, scale: 2 }), // meters
  accuracy: decimal("accuracy", { precision: 10, scale: 2 }), // meters
  batteryLevel: integer("battery_level"), // percentage for electric vehicles
  fuelLevel: integer("fuel_level"), // percentage
  engineStatus: text("engine_status").default("off"), // on, off, idle
  isMoving: integer("is_moving").default(0),
  capturedAt: timestamp("captured_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  vehicleCapturedIdx: index("vehicle_telematics_vehicle_captured_idx").on(table.vehicleId, table.capturedAt),
  locationIdx: index("vehicle_telematics_location_idx").on(table.latitude, table.longitude),
}));

// Insert schemas for new tables
export const insertLoanOfferSchema = createInsertSchema(loanOffers).omit({
  id: true,
  createdAt: true,
});

export const insertUserFinancialReportSchema = createInsertSchema(userFinancialReports).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertSecurityScanSchema = createInsertSchema(securityScans).omit({
  id: true,
  createdAt: true,
});

export const insertCoachInteractionSchema = createInsertSchema(coachInteractions).omit({
  id: true,
  createdAt: true,
});

export const insertLearningContentSchema = createInsertSchema(learningContent).omit({
  id: true,
  createdAt: true,
});

export const insertFitnessActivitySchema = createInsertSchema(fitnessActivities).omit({
  id: true,
  createdAt: true,
  recordedAt: true,
});

export const insertUserPointsSchema = createInsertSchema(userPoints).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertInvestmentPortfolioSchema = createInsertSchema(investmentPortfolio).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertReferralProgramSchema = createInsertSchema(referralProgram).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferralTransactionSchema = createInsertSchema(referralTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertUserVoucherSchema = createInsertSchema(userVouchers).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export const insertLoyaltyCoinsSchema = createInsertSchema(loyaltyCoins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivity: true,
});

export const insertCoinTransactionSchema = createInsertSchema(coinTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertBillPaymentHistorySchema = createInsertSchema(billPaymentHistory).omit({
  id: true,
  createdAt: true,
  paidDate: true,
});

export const insertFinancialAnalyticsSchema = createInsertSchema(financialAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reward system insert schemas
export const insertRewardCategorySchema = createInsertSchema(rewardCategories).omit({
  id: true,
  createdAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRewardRedemptionSchema = createInsertSchema(rewardRedemptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Fund Management insert schemas
export const insertUserWalletSchema = createInsertSchema(userWallet).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertFundTransactionSchema = createInsertSchema(fundTransactions).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertStripePaymentSchema = createInsertSchema(stripePayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reward system types
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type RewardCategory = typeof rewardCategories.$inferSelect;
export type InsertRewardCategory = z.infer<typeof insertRewardCategorySchema>;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;
export type InsertRewardRedemption = z.infer<typeof insertRewardRedemptionSchema>;

// Fund Management types
export type UserWallet = typeof userWallet.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;
export type FundTransaction = typeof fundTransactions.$inferSelect;
export type InsertFundTransaction = z.infer<typeof insertFundTransactionSchema>;
export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = z.infer<typeof insertStripePaymentSchema>;

// Reward redemption request schema
export const rewardRedemptionRequestSchema = z.object({
  method: z.enum(["points", "points_cashback", "referral_bonus"]),
});


// Additional schemas for marketplace features
export const loanMatchRequestSchema = z.object({
  purpose: z.string(),
  amount: z.number().min(10000),
  tenure: z.number().min(6).max(360),
  useMyReport: z.boolean().default(false),
});

export const fraudScanRequestSchema = z.object({
  scanType: z.enum(["url", "message", "screenshot", "phone"]),
  inputData: z.string(),
  phoneNumber: z.string().optional(),
});

export const coachQuerySchema = z.object({
  question: z.string().min(5),
  context: z.object({}).optional(),
});

// Creator Connect Tables
export const creators = pgTable("creators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  expertise: jsonb("expertise"), // Array of expertise areas like ["Finance", "Investment", "Personal Finance"]
  credentials: jsonb("credentials"), // Array of credentials/certifications
  profileImageUrl: text("profile_image_url"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  isVerified: integer("is_verified").default(0),
  isActive: integer("is_active").default(1),
  totalSessions: integer("total_sessions").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0"),
  timezone: text("timezone").default("Asia/Kolkata"),
  languages: jsonb("languages"), // Array of languages spoken
  socialLinks: jsonb("social_links"), // LinkedIn, Twitter, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creatorSessions = pgTable("creator_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  sessionType: text("session_type").notNull(), // "consultation", "mentoring", "review"
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes (30, 60, 120, 180)
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  sessionId: varchar("session_id").references(() => creatorSessions.id).notNull(),
  bookingNumber: text("booking_number").notNull().unique(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled, rescheduled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentId: text("payment_id"), // Stripe payment intent ID
  meetingUrl: text("meeting_url"), // Video call link
  notes: text("notes"), // User's booking notes/questions
  cancelReason: text("cancel_reason"),
  rescheduledFrom: varchar("rescheduled_from"), // Reference to original booking if rescheduled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creatorReviews = pgTable("creator_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  isPublic: integer("is_public").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creatorAvailability = pgTable("creator_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creatorPayouts = pgTable("creator_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => creators.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  paymentMethod: text("payment_method"), // bank_transfer, upi
  transactionId: text("transaction_id"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Creator Connect insert schemas
export const insertCreatorSchema = createInsertSchema(creators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalSessions: true,
  averageRating: true,
  totalEarnings: true,
});

export const insertCreatorSessionSchema = createInsertSchema(creatorSessions).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  bookingNumber: true,
});

export const insertCreatorReviewSchema = createInsertSchema(creatorReviews).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorAvailabilitySchema = createInsertSchema(creatorAvailability).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorPayoutSchema = createInsertSchema(creatorPayouts).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type EmiPayment = typeof emiPayments.$inferSelect;
export type InsertEmiPayment = z.infer<typeof insertEmiPaymentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Otp = typeof otps.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type LoanOffer = typeof loanOffers.$inferSelect;
export type InsertLoanOffer = z.infer<typeof insertLoanOfferSchema>;
export type UserFinancialReport = typeof userFinancialReports.$inferSelect;
export type InsertUserFinancialReport = z.infer<typeof insertUserFinancialReportSchema>;
export type SecurityScan = typeof securityScans.$inferSelect;
export type InsertSecurityScan = z.infer<typeof insertSecurityScanSchema>;
export type CoachInteraction = typeof coachInteractions.$inferSelect;
export type InsertCoachInteraction = z.infer<typeof insertCoachInteractionSchema>;
export type LearningContent = typeof learningContent.$inferSelect;
export type InsertLearningContent = z.infer<typeof insertLearningContentSchema>;
export type FitnessActivity = typeof fitnessActivities.$inferSelect;
export type InsertFitnessActivity = z.infer<typeof insertFitnessActivitySchema>;
export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = z.infer<typeof insertUserPointsSchema>;
export type OtpVerification = z.infer<typeof otpVerificationSchema>;
export type LoanEligibility = z.infer<typeof loanEligibilitySchema>;
export type LoanMatchRequest = z.infer<typeof loanMatchRequestSchema>;
export type FraudScanRequest = z.infer<typeof fraudScanRequestSchema>;
export type CoachQuery = z.infer<typeof coachQuerySchema>;

// Creator Connect validation schemas
export const bookingRequestSchema = z.object({
  creatorId: z.string(),
  sessionId: z.string(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
});

export const creatorProfileSchema = z.object({
  displayName: z.string().min(2),
  bio: z.string().optional(),
  expertise: z.array(z.string()).min(1),
  credentials: z.array(z.string()).optional(),
  hourlyRate: z.number().min(100).max(50000),
  timezone: z.string().optional(),
  languages: z.array(z.string()).optional(),
  socialLinks: z.object({}).optional(),
});

export const sessionFilterSchema = z.object({
  expertise: z.string().optional(),
  priceRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  duration: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const reviewSubmissionSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  isPublic: z.boolean().default(true),
});

// Investment Prediction Tables
export const marketPredictions = pgTable("market_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }).notNull(),
  predictedPrice: decimal("predicted_price", { precision: 12, scale: 2 }).notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  timeframe: text("timeframe").notNull(), // "1day", "1week", "1month"
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(),
  riskLevel: text("risk_level").notNull(), // "low", "medium", "high"
  aiRating: decimal("ai_rating", { precision: 3, scale: 1 }).notNull(), // 0.0-5.0
  technicalScore: integer("technical_score").default(0), // 0-100
  fundamentalScore: integer("fundamental_score").default(0), // 0-100
  sentimentScore: integer("sentiment_score").default(0), // 0-100
  keyReasons: jsonb("key_reasons"), // array of strings
  riskFactors: jsonb("risk_factors"), // array of strings
  volume: decimal("volume", { precision: 12, scale: 2 }).default("0"),
  volatility: decimal("volatility", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sectorForecasts = pgTable("sector_forecasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectorName: text("sector_name").notNull(),
  currentIndex: decimal("current_index", { precision: 12, scale: 2 }).notNull(),
  forecastIndex: decimal("forecast_index", { precision: 12, scale: 2 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(),
  outlook: text("outlook").notNull(), // "bullish", "bearish", "neutral"
  confidence: integer("confidence").notNull(), // 0-100
  timeframe: text("timeframe").notNull(),
  keyDrivers: jsonb("key_drivers"), // array of strings
  riskFactors: jsonb("risk_factors"), // array of strings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketSentiment = pgTable("market_sentiment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  overall: text("overall").notNull(), // "bullish", "bearish", "neutral"
  score: integer("score").notNull(), // 0-100
  indicators: jsonb("indicators"), // array of sentiment indicators
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for predictions
export const insertMarketPredictionSchema = createInsertSchema(marketPredictions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSectorForecastSchema = createInsertSchema(sectorForecasts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketSentimentSchema = createInsertSchema(marketSentiment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for predictions
export type MarketPrediction = typeof marketPredictions.$inferSelect;
export type InsertMarketPrediction = z.infer<typeof insertMarketPredictionSchema>;
export type SectorForecast = typeof sectorForecasts.$inferSelect;
export type InsertSectorForecast = z.infer<typeof insertSectorForecastSchema>;
export type MarketSentimentData = typeof marketSentiment.$inferSelect;
export type InsertMarketSentiment = z.infer<typeof insertMarketSentimentSchema>;

// UPI Payment Tables
export const upiAccounts = pgTable("upi_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  upiId: text("upi_id").notNull(), // user@paytm, user@gpay, etc
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number"), // last 4 digits only for security
  ifscCode: text("ifsc_code"),
  accountHolderName: text("account_holder_name").notNull(),
  isPrimary: integer("is_primary").default(0),
  isVerified: integer("is_verified").default(0),
  upiApp: text("upi_app").notNull(), // paytm, googlepay, phonepe, bhim
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserUpiId: uniqueIndex("upi_accounts_user_upi_unique_idx").on(table.userId, table.upiId),
  userIdIdx: index("upi_accounts_user_id_idx").on(table.userId),
  isPrimaryIdx: index("upi_accounts_is_primary_idx").on(table.isPrimary),
}));

export const upiTransactions = pgTable("upi_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  externalTransactionId: text("external_transaction_id").notNull().unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  transactionType: text("transaction_type").notNull(), // payment, transfer, collect, bill_payment, emi_payment
  status: text("status").notNull().default("pending"), // pending, success, failed, cancelled
  description: text("description"),
  senderAccountId: varchar("sender_account_id").references(() => upiAccounts.id),
  recipientAccountId: varchar("recipient_account_id").references(() => upiAccounts.id),
  recipientUpiId: text("recipient_upi_id"),
  recipientName: text("recipient_name"),
  senderUpiId: text("sender_upi_id"),
  referenceNumber: text("reference_number"),
  loanId: varchar("loan_id").references(() => loanApplications.id), // for EMI payments
  billType: text("bill_type"), // mobile, dth, electricity, gas, water
  billAccountNumber: text("bill_account_number"),
  cashbackEarned: decimal("cashback_earned", { precision: 8, scale: 2 }).default("0"),
  pointsEarned: integer("points_earned").default(0),
  metadata: jsonb("metadata"), // additional transaction info
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdCreatedAtIdx: sql`INDEX idx_upi_transactions_user_created ON upi_transactions(${table.userId}, ${table.createdAt})`,
  statusIdx: sql`INDEX idx_upi_transactions_status ON upi_transactions(${table.status})`,
  loanIdIdx: sql`INDEX idx_upi_transactions_loan_id ON upi_transactions(${table.loanId})`,
}));

export const upiRewards = pgTable("upi_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  rewardType: text("reward_type").notNull(), // cashback, points, scratch_card, offer
  rewardValue: decimal("reward_value", { precision: 8, scale: 2 }).notNull(),
  rewardDescription: text("reward_description").notNull(),
  expiryDate: timestamp("expiry_date"),
  isRedeemed: integer("is_redeemed").default(0),
  redeemedAt: timestamp("redeemed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billPaymentServices = pgTable("bill_payment_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: text("service_name").notNull(),
  serviceType: text("service_type").notNull(), // mobile, dth, electricity, gas, water, insurance
  serviceProvider: text("service_provider").notNull(), // Jio, Airtel, Tata Sky, etc
  iconUrl: text("icon_url"),
  isActive: integer("is_active").default(1),
  minAmount: decimal("min_amount", { precision: 8, scale: 2 }).default("10"),
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }).default("50000"),
  processingFee: decimal("processing_fee", { precision: 5, scale: 2 }).default("0"),
  cashbackPercentage: decimal("cashback_percentage", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userUpiPreferences = pgTable("user_upi_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  defaultUpiId: varchar("default_upi_id").references(() => upiAccounts.id),
  transactionLimit: decimal("transaction_limit", { precision: 10, scale: 2 }).default("100000"),
  isDailyLimitEnabled: integer("is_daily_limit_enabled").default(1),
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }).default("100000"),
  isNotificationEnabled: integer("is_notification_enabled").default(1),
  preferredUpiApp: text("preferred_upi_app").default("gpay"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// UPI Insert schemas - Basic ones (enhanced versions defined later)
export const insertUpiRewardSchema = createInsertSchema(upiRewards).omit({
  id: true,
  createdAt: true,
  redeemedAt: true,
});

export const insertBillPaymentServiceSchema = createInsertSchema(billPaymentServices).omit({
  id: true,
  createdAt: true,
});

export const insertUserUpiPreferencesSchema = createInsertSchema(userUpiPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// UPI validation patterns
const UPI_ID_REGEX = /^[A-Za-z0-9._-]{2,}@[A-Za-z]{2,}$/;
const IFSC_CODE_REGEX = /^[A-Z]{4}0[0-9A-Z]{6}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{4}$/;

// UPI enums
const UPI_TRANSACTION_TYPES = ["payment", "transfer", "collect", "bill_payment", "emi_payment"] as const;
const UPI_TRANSACTION_STATUS = ["pending", "success", "failed", "cancelled"] as const;
const UPI_BILL_TYPES = ["mobile", "dth", "electricity", "gas", "water", "insurance"] as const;
const UPI_APPS = ["paytm", "googlepay", "phonepe", "bhim", "amazonpay"] as const;
const UPI_REWARD_TYPES = ["cashback", "points", "scratch_card", "offer"] as const;

// Enhanced UPI Account validation schema
export const insertUpiAccountSchema = createInsertSchema(upiAccounts).omit({
  id: true,
  createdAt: true,
}).extend({
  upiId: z.string().regex(UPI_ID_REGEX, "Invalid UPI ID format"),
  ifscCode: z.string().regex(IFSC_CODE_REGEX, "Invalid IFSC code").optional(),
  accountNumber: z.string().regex(ACCOUNT_NUMBER_REGEX, "Account number must be last 4 digits").optional(),
  upiApp: z.enum(UPI_APPS),
});

// UPI Payment validation schemas
export const upiPaymentSchema = z.object({
  recipientUpiId: z.string().regex(UPI_ID_REGEX, "Invalid recipient UPI ID format"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0").max(100000, "Amount cannot exceed ₹1,00,000"),
  description: z.string().optional(),
  senderUpiId: z.string().regex(UPI_ID_REGEX, "Invalid sender UPI ID format"),
  transactionType: z.enum(UPI_TRANSACTION_TYPES).default("payment"),
});

export const upiCollectRequestSchema = z.object({
  payerUpiId: z.string().regex(UPI_ID_REGEX, "Invalid payer UPI ID format"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0").max(100000, "Amount cannot exceed ₹1,00,000"),
  description: z.string().min(1, "Description is required"),
  expiryMinutes: z.number().default(15),
});

export const billPaymentSchema = z.object({
  serviceId: z.string().optional(),
  billType: z.string().min(1, "Bill type is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().optional(),
  provider: z.string().optional(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

export const emiPaymentUpiSchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  upiId: z.string().regex(UPI_ID_REGEX, "Invalid UPI ID format"),
}).refine((data) => {
  // Cross-field validation can be added here if needed
  return true;
}, {
  message: "Invalid EMI payment data"
});

// Enhanced UPI Transaction schema with validation
export const insertUpiTransactionSchema = createInsertSchema(upiTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  externalTransactionId: true,
}).extend({
  transactionType: z.enum(UPI_TRANSACTION_TYPES),
  status: z.enum(UPI_TRANSACTION_STATUS).default("pending"),
  billType: z.enum(UPI_BILL_TYPES).optional(),
  amount: z.coerce.number().min(1),
});

// Creator Connect Types
export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type CreatorSession = typeof creatorSessions.$inferSelect;
export type InsertCreatorSession = z.infer<typeof insertCreatorSessionSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type CreatorReview = typeof creatorReviews.$inferSelect;
export type InsertCreatorReview = z.infer<typeof insertCreatorReviewSchema>;
export type CreatorAvailability = typeof creatorAvailability.$inferSelect;
export type InsertCreatorAvailability = z.infer<typeof insertCreatorAvailabilitySchema>;
export type CreatorPayout = typeof creatorPayouts.$inferSelect;
export type InsertCreatorPayout = z.infer<typeof insertCreatorPayoutSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
export type SessionFilter = z.infer<typeof sessionFilterSchema>;
export type ReviewSubmission = z.infer<typeof reviewSubmissionSchema>;

// UPI Types
export type UpiAccount = typeof upiAccounts.$inferSelect;
export type InsertUpiAccount = z.infer<typeof insertUpiAccountSchema>;
export type UpiTransaction = typeof upiTransactions.$inferSelect;
export type InsertUpiTransaction = z.infer<typeof insertUpiTransactionSchema>;
export type UpiReward = typeof upiRewards.$inferSelect;
export type InsertUpiReward = z.infer<typeof insertUpiRewardSchema>;
export type BillPaymentService = typeof billPaymentServices.$inferSelect;
export type InsertBillPaymentService = z.infer<typeof insertBillPaymentServiceSchema>;
export type UserUpiPreferences = typeof userUpiPreferences.$inferSelect;
export type InsertUserUpiPreferences = z.infer<typeof insertUserUpiPreferencesSchema>;
export type UpiPayment = z.infer<typeof upiPaymentSchema>;
export type UpiCollectRequest = z.infer<typeof upiCollectRequestSchema>;
export type BillPayment = z.infer<typeof billPaymentSchema>;
export type EmiPaymentUpi = z.infer<typeof emiPaymentUpiSchema>;

// Family UPI (Shared UPI) Tables - NPCI Multi-Signatory Support
export const familyUpiAccounts = pgTable("family_upi_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(), // Account creator/owner
  familyName: text("family_name").notNull(), // "My Family", "Joint Account", etc.
  upiId: text("upi_id").notNull().unique(), // family@upi
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number"), // last 4 digits
  ifscCode: text("ifsc_code"),
  memberCount: integer("member_count").default(1),
  monthlyLimit: decimal("monthly_limit", { precision: 12, scale: 2 }).default("500000"),
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }).default("100000"),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  availableBalance: decimal("available_balance", { precision: 12, scale: 2 }).default("0"), // Linked bank account balance
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("family_upi_user_id_idx").on(table.userId),
}));

export const familyUpiMembers = pgTable("family_upi_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyAccountId: varchar("family_account_id").references(() => familyUpiAccounts.id).notNull(),
  memberId: varchar("member_id").references(() => users.id), // Null if not a registered user
  memberName: text("member_name").notNull(),
  memberPhone: text("member_phone"),
  relationship: text("relationship"), // 'spouse', 'parent', 'child', 'sibling', 'guardian'
  role: text("role").notNull().default("member"), // 'owner', 'admin', 'member'
  spendingLimit: decimal("spending_limit", { precision: 10, scale: 2 }), // Per-member limit
  canApprove: integer("can_approve").default(0), // Can approve transactions
  canView: integer("can_view").default(1), // Can view transactions
  isActive: integer("is_active").default(1),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  familyAccountIdx: index("family_upi_members_account_idx").on(table.familyAccountId),
  memberIdIdx: index("family_upi_members_member_idx").on(table.memberId),
}));

export const familyUpiTransactions = pgTable("family_upi_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyAccountId: varchar("family_account_id").references(() => familyUpiAccounts.id).notNull(),
  initiatedBy: varchar("initiated_by").references(() => familyUpiMembers.id).notNull(),
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  transactionType: text("transaction_type").notNull(), // payment, transfer, bill
  description: text("description"),
  status: text("status").notNull().default("success"), // success, failed, pending
  requiresApproval: integer("requires_approval").default(0),
  approvedBy: varchar("approved_by").references(() => familyUpiMembers.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  familyAccountIdx: index("family_upi_txn_account_idx").on(table.familyAccountId),
  initiatedByIdx: index("family_upi_txn_initiator_idx").on(table.initiatedBy),
}));

// Family UPI Insert Schemas
export const insertFamilyUpiAccountSchema = createInsertSchema(familyUpiAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalSpent: true,
  memberCount: true,
}).extend({
  upiId: z.string().regex(UPI_ID_REGEX, "Invalid UPI ID format"),
  familyName: z.string().min(1, "Family name is required").max(50, "Family name too long"),
});

export const insertFamilyUpiMemberSchema = createInsertSchema(familyUpiMembers).omit({
  id: true,
  joinedAt: true,
}).extend({
  memberName: z.string().min(1, "Member name is required"),
  role: z.enum(["owner", "admin", "member"]).default("member"),
  relationship: z.enum(["spouse", "parent", "child", "sibling", "guardian", "other"]).optional(),
});

export const insertFamilyUpiTransactionSchema = createInsertSchema(familyUpiTransactions).omit({
  id: true,
  createdAt: true,
});

// Family UPI Types
export type FamilyUpiAccount = typeof familyUpiAccounts.$inferSelect;
export type InsertFamilyUpiAccount = z.infer<typeof insertFamilyUpiAccountSchema>;
export type FamilyUpiMember = typeof familyUpiMembers.$inferSelect;
export type InsertFamilyUpiMember = z.infer<typeof insertFamilyUpiMemberSchema>;
export type FamilyUpiTransaction = typeof familyUpiTransactions.$inferSelect;
export type InsertFamilyUpiTransaction = z.infer<typeof insertFamilyUpiTransactionSchema>;

// Investment Portfolio Types
export type InvestmentPortfolio = typeof investmentPortfolio.$inferSelect;
export type InsertInvestmentPortfolio = z.infer<typeof insertInvestmentPortfolioSchema>;

// Referral System Types
export type ReferralProgram = typeof referralProgram.$inferSelect;
export type InsertReferralProgram = z.infer<typeof insertReferralProgramSchema>;
export type ReferralTransaction = typeof referralTransactions.$inferSelect;
export type InsertReferralTransaction = z.infer<typeof insertReferralTransactionSchema>;

// Rewards & Vouchers Types
export type UserVoucher = typeof userVouchers.$inferSelect;
export type InsertUserVoucher = z.infer<typeof insertUserVoucherSchema>;
export type LoyaltyCoins = typeof loyaltyCoins.$inferSelect;
export type InsertLoyaltyCoins = z.infer<typeof insertLoyaltyCoinsSchema>;
export type CoinTransaction = typeof coinTransactions.$inferSelect;
export type InsertCoinTransaction = z.infer<typeof insertCoinTransactionSchema>;

// Enhanced Bill Payment Types
export type BillPaymentHistory = typeof billPaymentHistory.$inferSelect;
export type InsertBillPaymentHistory = z.infer<typeof insertBillPaymentHistorySchema>;

// Financial Analytics Types
export type FinancialAnalytics = typeof financialAnalytics.$inferSelect;
export type InsertFinancialAnalytics = z.infer<typeof insertFinancialAnalyticsSchema>;

// Insurance Policies table
export const insurancePolicies = pgTable("insurance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  policyNumber: text("policy_number").notNull().unique(),
  policyType: text("policy_type").notNull(), // 'health', 'life', 'vehicle', 'home', 'travel'
  insuranceProvider: text("insurance_provider").notNull(),
  policyHolderName: text("policy_holder_name").notNull(),
  premiumAmount: decimal("premium_amount", { precision: 10, scale: 2 }).notNull(),
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }).notNull(),
  policyStartDate: timestamp("policy_start_date").notNull(),
  policyEndDate: timestamp("policy_end_date").notNull(),
  premiumFrequency: text("premium_frequency").notNull(), // 'monthly', 'quarterly', 'half_yearly', 'yearly'
  nextPremiumDate: timestamp("next_premium_date").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'expired', 'cancelled', 'lapsed'
  isAutoRenewal: integer("is_auto_renewal").default(0),
  beneficiaryName: text("beneficiary_name"),
  beneficiaryRelation: text("beneficiary_relation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurance Premium Payments table
export const insurancePremiumPayments = pgTable("insurance_premium_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  policyId: varchar("policy_id").references(() => insurancePolicies.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed'
  paymentMethod: text("payment_method").notNull(), // 'upi', 'card', 'netbanking'
  transactionId: text("transaction_id"),
  referenceNumber: text("reference_number"),
  upiId: text("upi_id"),
  isLatePayment: integer("is_late_payment").default(0),
  lateFee: decimal("late_fee", { precision: 8, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insurance Policies insert schema
export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insurance Premium Payment schema
export const insurancePremiumPaymentSchema = z.object({
  policyId: z.string().min(1, "Policy ID is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  upiId: z.string().min(1, "UPI ID is required"),
  paymentMethod: z.enum(["upi", "card", "netbanking"]).default("upi"),
});

// Insurance Claims table
export const insuranceClaims = pgTable("insurance_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  policyId: varchar("policy_id").references(() => insurancePolicies.id).notNull(),
  claimNumber: text("claim_number").notNull().unique(),
  claimType: text("claim_type").notNull(),
  claimAmount: decimal("claim_amount", { precision: 12, scale: 2 }).notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  description: text("description").notNull(),
  hospitalName: text("hospital_name"),
  doctorName: text("doctor_name"),
  status: text("status").notNull().default("pending"), // 'pending', 'under_review', 'approved', 'rejected', 'settled'
  settledAmount: decimal("settled_amount", { precision: 12, scale: 2 }),
  settledDate: timestamp("settled_date"),
  rejectionReason: text("rejection_reason"),
  documents: jsonb("documents").$type<string[]>(), // Array of document URLs
  filedDate: timestamp("filed_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurance Claims insert schema
export const insertInsuranceClaimSchema = createInsertSchema(insuranceClaims).omit({
  id: true,
  claimNumber: true,
  filedDate: true,
  createdAt: true,
  updatedAt: true,
});

// Insurance Claims form schema for frontend validation
export const insuranceClaimFormSchema = z.object({
  policyId: z.string().min(1, "Policy ID is required"),
  claimType: z.string().min(1, "Claim type is required"),
  incidentDate: z.string().min(1, "Incident date is required"),
  claimAmount: z.string().min(1, "Claim amount is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hospitalName: z.string().optional(),
  doctorName: z.string().optional(),
});

// Payment Details for unified payment history
export const paymentDetails = pgTable("payment_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionId: text("transaction_id").notNull().unique(),
  paymentType: text("payment_type").notNull(), // 'upi', 'bill', 'emi', 'insurance', 'investment'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  recipientName: text("recipient_name"),
  recipientUpiId: text("recipient_upi_id"),
  description: text("description"),
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed', 'cancelled'
  paymentMethod: text("payment_method").notNull(), // 'upi', 'card', 'netbanking', 'wallet'
  fees: decimal("fees", { precision: 8, scale: 2 }).default("0"),
  cashbackEarned: decimal("cashback_earned", { precision: 8, scale: 2 }).default("0"),
  referenceNumber: text("reference_number"),
  // Source linkages for hydrating details
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  billPaymentId: varchar("bill_payment_id").references(() => billPaymentHistory.id),
  emiPaymentId: varchar("emi_payment_id").references(() => emiPayments.id),
  insurancePaymentId: varchar("insurance_payment_id").references(() => insurancePremiumPayments.id),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  metadata: jsonb("metadata"), // Additional payment-specific data (no sensitive info)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bill Payees for managing recurring bills
export const billPayees = pgTable("bill_payees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  payeeName: text("payee_name").notNull(),
  billType: text("bill_type").notNull(), // 'mobile', 'dth', 'electricity', 'gas', 'water', 'internet', 'insurance'
  serviceProvider: text("service_provider").notNull(),
  accountNumber: text("account_number").notNull(),
  customerId: text("customer_id"),
  nickname: text("nickname"), // User-friendly name
  isActive: integer("is_active").default(1),
  averageAmount: decimal("average_amount", { precision: 10, scale: 2 }),
  lastPaidAmount: decimal("last_paid_amount", { precision: 10, scale: 2 }),
  lastPaidDate: timestamp("last_paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniquePayeeIdx: uniqueIndex("bill_payees_unique_idx").on(table.userId, table.billType, table.serviceProvider, table.accountNumber),
}));

// Scheduled Bills for automatic reminders and payments
export const scheduledBills = pgTable("scheduled_bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  payeeId: varchar("payee_id").references(() => billPayees.id).notNull(),
  scheduleName: text("schedule_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  scheduleType: text("schedule_type").notNull(), // 'monthly', 'quarterly', 'yearly', 'custom'
  scheduleDay: integer("schedule_day"), // Day of month for monthly bills
  scheduleDate: timestamp("schedule_date"), // Specific date for one-time bills
  isAutoPayEnabled: integer("is_auto_pay_enabled").default(0),
  reminderDays: integer("reminder_days").default(3), // Days before due date to remind
  status: text("status").notNull().default("active"), // 'active', 'paused', 'cancelled'
  nextDueDate: timestamp("next_due_date"),
  lastExecuted: timestamp("last_executed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueScheduleIdx: uniqueIndex("scheduled_bills_unique_idx").on(table.userId, table.payeeId, table.scheduleName),
}));

// Bill Reminders for upcoming payments
export const billReminders = pgTable("bill_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  scheduledBillId: varchar("scheduled_bill_id").references(() => scheduledBills.id).notNull(),
  reminderDate: timestamp("reminder_date").notNull(),
  reminderType: text("reminder_type").notNull(), // 'email', 'sms', 'push_notification'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'sent', 'read', 'acted_upon'
  isRead: integer("is_read").default(0),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueReminderIdx: uniqueIndex("bill_reminders_unique_idx").on(table.userId, table.scheduledBillId, table.reminderDate, table.reminderType),
}));

// Enhanced User Profile for better profile management
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  occupation: text("occupation"),
  employer: text("employer"),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }),
  address: jsonb("address"), // {street, city, state, pincode}
  preferences: jsonb("preferences"), // App preferences, notifications, etc.
  kycStatus: text("kyc_status").default("pending"), // 'pending', 'verified', 'rejected'
  kycDocuments: jsonb("kyc_documents"), // Document upload references
  securitySettings: jsonb("security_settings"), // Security preferences
  financialGoals: jsonb("financial_goals"), // User's financial planning goals
  riskTolerance: text("risk_tolerance").default("medium"), // 'low', 'medium', 'high'
  investmentExperience: text("investment_experience").default("beginner"), // 'beginner', 'intermediate', 'expert'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new tables with validation
export const insertPaymentDetailSchema = createInsertSchema(paymentDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  paymentType: z.enum(["upi", "bill", "emi", "insurance", "investment"]),
  status: z.enum(["pending", "success", "failed", "cancelled"]).default("pending"),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet"]),
  amount: z.coerce.number().positive("Amount must be positive"),
});

export const insertBillPayeeSchema = createInsertSchema(billPayees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  billType: z.enum(["mobile", "dth", "electricity", "gas", "water", "internet", "insurance"]),
  payeeName: z.string().min(1, "Payee name is required"),
  serviceProvider: z.string().min(1, "Service provider is required"),
  accountNumber: z.string().min(1, "Account number is required"),
});

export const insertScheduledBillSchema = createInsertSchema(scheduledBills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  scheduleType: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
  scheduleName: z.string().min(1, "Schedule name is required"),
  amount: z.coerce.number().positive("Amount must be positive").optional(),
});

export const insertBillReminderSchema = createInsertSchema(billReminders).omit({
  id: true,
  createdAt: true,
}).extend({
  reminderType: z.enum(["email", "sms", "push_notification"]),
  status: z.enum(["pending", "sent", "read", "acted_upon"]).default("pending"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  kycStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  riskTolerance: z.enum(["low", "medium", "high"]).default("medium"),
  investmentExperience: z.enum(["beginner", "intermediate", "expert"]).default("beginner"),
});

// Bill management validation schemas
export const billPayeeSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  billType: z.enum(["mobile", "dth", "electricity", "gas", "water", "internet", "insurance"]),
  serviceProvider: z.string().min(1, "Service provider is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  customerId: z.string().optional(),
  nickname: z.string().optional(),
});

export const scheduledBillSchema = z.object({
  payeeId: z.string().min(1, "Payee is required"),
  scheduleName: z.string().min(1, "Schedule name is required"),
  amount: z.coerce.number().positive("Amount must be positive").optional(),
  scheduleType: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  scheduleDay: z.number().min(1).max(31).optional(),
  scheduleDate: z.string().optional(), // ISO date string
  reminderDays: z.number().min(0).max(30).default(3),
  isAutoPayEnabled: z.boolean().default(false),
});

// Payment detail query schema
export const paymentDetailSchema = z.object({
  id: z.string().min(1, "Payment ID is required"),
});

// Enhanced profile update schema
export const userProfileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  monthlyIncome: z.coerce.number().positive().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  preferences: z.record(z.any()).optional(),
  riskTolerance: z.enum(["low", "medium", "high"]).optional(),
  investmentExperience: z.enum(["beginner", "intermediate", "expert"]).optional(),
  financialGoals: z.array(z.string()).optional(),
});

// Export types for new tables
export type PaymentDetail = typeof paymentDetails.$inferSelect;
export type InsertPaymentDetail = z.infer<typeof insertPaymentDetailSchema>;
export type BillPayee = typeof billPayees.$inferSelect;
export type InsertBillPayee = z.infer<typeof insertBillPayeeSchema>;
export type ScheduledBill = typeof scheduledBills.$inferSelect;
export type InsertScheduledBill = z.infer<typeof insertScheduledBillSchema>;
export type BillReminder = typeof billReminders.$inferSelect;
export type InsertBillReminder = z.infer<typeof insertBillReminderSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type BillPayeeData = z.infer<typeof billPayeeSchema>;
export type ScheduledBillData = z.infer<typeof scheduledBillSchema>;
export type PaymentDetailQuery = z.infer<typeof paymentDetailSchema>;
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

// Travel booking insert schemas
export const insertTravelRouteSchema = createInsertSchema(travelRoutes).omit({
  id: true,
  createdAt: true,
}).extend({
  serviceType: z.enum(["flight", "bus", "train", "cab", "metro", "rental"]),
  basePrice: z.coerce.number().positive("Base price must be positive"),
  duration: z.coerce.number().positive("Duration must be positive"),
  operatorName: z.string().min(1, "Operator name is required"),
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  vehicleType: z.string().optional(),
  pricePerKm: z.coerce.number().positive().optional(),
  pricePerHour: z.coerce.number().positive().optional(),
}).refine(data => {
  // For cab: vehicleType and pricePerKm are required
  if (data.serviceType === "cab") {
    return data.vehicleType && data.pricePerKm && data.pricePerKm > 0;
  }
  return true;
}, {
  message: "vehicleType and pricePerKm are required for cab routes"
}).refine(data => {
  // For rental: vehicleType, pricePerKm, and pricePerHour are required
  if (data.serviceType === "rental") {
    return data.vehicleType && data.pricePerKm && data.pricePerKm > 0 && data.pricePerHour && data.pricePerHour > 0;
  }
  return true;
}, {
  message: "vehicleType, pricePerKm, and pricePerHour are required for rental routes"
});

export const insertTravelScheduleSchema = createInsertSchema(travelSchedules).omit({
  id: true,
  createdAt: true,
}).extend({
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  arrivalTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  availableSeats: z.coerce.number().min(0, "Available seats cannot be negative"),
  totalSeats: z.coerce.number().positive("Total seats must be positive"),
  status: z.enum(["active", "cancelled", "delayed"]).default("active"),
});

export const insertTravelBookingSchema = createInsertSchema(travelBookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  serviceType: z.enum(["flight", "bus", "train", "cab", "metro", "rental"]),
  operatorName: z.string().min(1, "Operator name is required"),
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  totalPassengers: z.coerce.number().positive("Must have at least one passenger"),
  routeNumber: z.string().optional(),
  seatClass: z.string().optional(),
  arrivalTime: z.string().optional(),
  vehicleType: z.string().optional(),
  pickupAddress: z.string().optional(),
  dropoffAddress: z.string().optional(),
  rentalDuration: z.coerce.number().positive().optional(),
  totalAmount: z.coerce.number().positive("Total amount must be positive"),
  baseAmount: z.coerce.number().positive("Base amount must be positive"),
  taxes: z.coerce.number().min(0, "Taxes cannot be negative"),
  status: z.enum(["confirmed", "cancelled", "completed", "refunded"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  paymentMethod: z.enum(["upi", "stripe", "wallet"]).default("upi"),
  checkInStatus: z.enum(["not_checked_in", "checked_in", "boarding_pass_issued"]).default("not_checked_in"),
}).refine(data => {
  // For flight, bus, train: scheduleId, routeNumber, seatClass, and arrivalTime are required
  if (["flight", "bus", "train"].includes(data.serviceType)) {
    return data.scheduleId && data.routeNumber && data.seatClass && data.arrivalTime;
  }
  return true;
}, {
  message: "scheduleId, routeNumber, seatClass, and arrivalTime are required for flight/bus/train bookings"
}).refine(data => {
  // For cab: vehicleType and pickupAddress are required
  if (data.serviceType === "cab") {
    return data.vehicleType && data.pickupAddress;
  }
  return true;
}, {
  message: "vehicleType and pickupAddress are required for cab bookings"
}).refine(data => {
  // For rental: vehicleType, pickupAddress, and rentalDuration are required
  if (data.serviceType === "rental") {
    return data.vehicleType && data.pickupAddress && data.rentalDuration;
  }
  return true;
}, {
  message: "vehicleType, pickupAddress, and rentalDuration are required for rental bookings"
});

export const insertTravelPassengerSchema = createInsertSchema(travelPassengers).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]).optional(),
  nationality: z.string().default("Indian"),
});

export const insertTravelPaymentSchema = createInsertSchema(travelPayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["upi", "stripe", "wallet"]),
  status: z.enum(["pending", "success", "failed", "refunded"]).default("pending"),
  currency: z.string().default("INR"),
});

export const insertTravelCancellationSchema = createInsertSchema(travelCancellations).omit({
  id: true,
  createdAt: true,
}).extend({
  cancellationReason: z.string().min(1, "Cancellation reason is required"),
  cancellationCharge: z.coerce.number().min(0, "Cancellation charge cannot be negative"),
  refundAmount: z.coerce.number().min(0, "Refund amount cannot be negative"),
  refundMethod: z.enum(["original_payment", "wallet", "bank_transfer"]).default("original_payment"),
  refundStatus: z.enum(["pending", "processed", "failed"]).default("pending"),
});

export const insertTravelContractSchema = createInsertSchema(travelContracts).omit({
  id: true,
  contractNumber: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  contractName: z.string().min(1, "Contract name is required"),
  partnerName: z.string().min(1, "Partner name is required"),
  billingCycle: z.enum(["monthly", "quarterly", "net30", "net45"]).default("monthly"),
  status: z.enum(["draft", "active", "expired", "cancelled"]).default("active"),
  approvalStatus: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const insertTravelAddonSchema = createInsertSchema(travelAddons).omit({
  id: true,
  createdAt: true,
}).extend({
  addonType: z.enum(["baggage", "meal", "insurance", "seat", "lounge", "priority_boarding"]),
  addonName: z.string().min(1, "Add-on name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  status: z.enum(["active", "cancelled"]).default("active"),
});

export const insertTravelLiveTrackingSchema = createInsertSchema(travelLiveTracking).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
}).extend({
  status: z.enum(["assigned", "started", "enroute", "arrived", "completed"]).default("assigned"),
});

export const insertBoardingPassSchema = createInsertSchema(boardingPasses).omit({
  id: true,
  createdAt: true,
  issuedAt: true,
});

export const insertTravelModificationSchema = createInsertSchema(travelModifications).omit({
  id: true,
  createdAt: true,
}).extend({
  modificationType: z.enum(["date_change", "seat_change", "upgrade", "passenger_change"]),
  status: z.enum(["pending", "approved", "rejected", "completed"]).default("pending"),
});

export const insertTravelAlertSchema = createInsertSchema(travelAlerts).omit({
  id: true,
  createdAt: true,
}).extend({
  alertType: z.enum(["delay", "cancellation", "gate_change", "platform_change", "advisory"]),
  severity: z.enum(["info", "warning", "critical"]).default("info"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

export const insertTravelCouponSchema = createInsertSchema(travelCoupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
}).extend({
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["percentage", "flat"]).default("percentage"),
  discountValue: z.coerce.number().positive("Discount value must be positive"),
  validUntil: z.coerce.date(),
});

export const insertTravelCouponUsageSchema = createInsertSchema(travelCouponUsage).omit({
  id: true,
  usedAt: true,
}).extend({
  serviceType: z.enum(["flight", "bus", "train", "cab", "metro", "rental", "hotel", "event", "movie"]),
  discountAmount: z.coerce.number().nonnegative("Discount amount cannot be negative"),
});

// Driver & Vehicle Management Insert Schemas
export const insertDriverProfileSchema = createInsertSchema(driverProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalTrips: true,
  completedTrips: true,
  cancelledTrips: true,
  averageRating: true,
  totalRatings: true,
  acceptanceRate: true,
  cancellationRate: true,
  totalEarnings: true,
  availableEarnings: true,
  lastLocationUpdate: true,
}).extend({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDate: z.coerce.date(),
  primaryCity: z.string().min(1, "Primary city is required"),
  status: z.enum(["online", "offline", "busy", "on_trip"]).default("offline"),
  backgroundCheckStatus: z.enum(["pending", "verified", "failed"]).default("pending"),
  currentLatitude: z.coerce.number().optional(),
  currentLongitude: z.coerce.number().optional(),
});

export const insertDriverExperienceSchema = createInsertSchema(driverExperience).omit({
  id: true,
  createdAt: true,
}).extend({
  achievementType: z.enum(["certification", "award", "milestone"]),
  title: z.string().min(1, "Title is required"),
});

export const insertDriverScheduleSchema = createInsertSchema(driverSchedules).omit({
  id: true,
  createdAt: true,
}).extend({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

export const insertDriverShiftSchema = createInsertSchema(driverShifts).omit({
  id: true,
  createdAt: true,
}).extend({
  shiftDate: z.coerce.date(),
  status: z.enum(["active", "completed"]).default("active"),
});

export const insertVehicleOwnerSchema = createInsertSchema(vehicleOwners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalVehicles: true,
  activeVehicles: true,
  averageRating: true,
  totalRatings: true,
  totalBookings: true,
  verificationDate: true,
}).extend({
  businessName: z.string().min(1, "Business name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  businessType: z.enum(["individual", "partnership", "company"]).default("individual"),
});

export const insertRentalCompanySchema = createInsertSchema(rentalCompanies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalLocations: true,
  totalVehicles: true,
  activeVehicles: true,
  averageRating: true,
  totalRatings: true,
  totalBookings: true,
  responseRate: true,
  verificationDate: true,
}).extend({
  companyName: z.string().min(1, "Company name is required"),
  primaryContactName: z.string().min(1, "Contact name is required"),
  primaryContactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  primaryContactEmail: z.string().email("Invalid email format"),
  businessRegistrationNumber: z.string().min(1, "Registration number is required"),
  headOfficeAddress: z.string().min(1, "Address is required"),
  headOfficeCity: z.string().min(1, "City is required"),
  headOfficeState: z.string().min(1, "State is required"),
  headOfficePincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  trustBadge: z.enum(["bronze", "silver", "gold", "platinum"]).default("bronze"),
});

export const insertCompanyLocationSchema = createInsertSchema(companyLocations).omit({
  id: true,
  createdAt: true,
  vehiclesCount: true,
}).extend({
  locationName: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentMileage: true,
  averageRating: true,
  totalRatings: true,
  totalTrips: true,
  lastLocationUpdate: true,
  lastServiceDate: true,
  nextServiceDue: true,
  availableFrom: true,
  availableUntil: true,
}).extend({
  vehicleType: z.enum(["cab", "rental_car", "bike"]),
  category: z.enum(["economy", "premium", "luxury", "suv", "sedan", "hatchback"]),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  registrationState: z.string().min(1, "Registration state is required"),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  transmission: z.enum(["manual", "automatic"]),
  seatingCapacity: z.number().min(1).max(50),
  condition: z.enum(["excellent", "good", "fair"]).default("excellent"),
  status: z.enum(["available", "rented", "maintenance", "offline"]).default("available"),
  currentLatitude: z.coerce.number().optional(),
  currentLongitude: z.coerce.number().optional(),
  insuranceExpiryDate: z.coerce.date().optional(),
  pollutionExpiryDate: z.coerce.date().optional(),
});

export const insertVehicleImageSchema = createInsertSchema(vehicleImages).omit({
  id: true,
  createdAt: true,
}).extend({
  imageUrl: z.string().url("Invalid URL format"),
  imageType: z.enum(["exterior", "interior", "dashboard", "engine"]).default("exterior"),
});

export const insertVehicleAvailabilitySlotSchema = createInsertSchema(vehicleAvailabilitySlots).omit({
  id: true,
  createdAt: true,
}).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").default("00:00"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").default("23:59"),
});

export const insertDriverVehicleSchema = createInsertSchema(driverVehicles).omit({
  id: true,
  createdAt: true,
  assignedAt: true,
  unassignedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  helpfulCount: true,
  notHelpfulCount: true,
  hasResponse: true,
  responseDate: true,
}).extend({
  targetType: z.enum(["driver", "vehicle", "company", "owner"]),
  rating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  punctualityRating: z.number().min(1).max(5).optional(),
  behaviorRating: z.number().min(1).max(5).optional(),
  vehicleConditionRating: z.number().min(1).max(5).optional(),
  valueForMoneyRating: z.number().min(1).max(5).optional(),
  moderationStatus: z.enum(["pending", "approved", "rejected"]).default("approved"),
});

export const insertReviewVoteSchema = createInsertSchema(reviewVotes).omit({
  id: true,
  createdAt: true,
}).extend({
  voteType: z.enum(["helpful", "not_helpful"]),
});

export const insertReviewStatsSchema = createInsertSchema(reviewStats).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  totalReviews: true,
  totalRatings: true,
  fiveStarCount: true,
  fourStarCount: true,
  threeStarCount: true,
  twoStarCount: true,
  oneStarCount: true,
  reviewsWithResponse: true,
  responseRate: true,
  averageRating: true,
  avgCleanlinessRating: true,
  avgPunctualityRating: true,
  avgBehaviorRating: true,
  avgVehicleConditionRating: true,
  avgValueForMoneyRating: true,
}).extend({
  targetType: z.enum(["driver", "vehicle", "company", "owner"]),
});

export const insertVehicleTelematicsSchema = createInsertSchema(vehicleTelematics).omit({
  id: true,
  createdAt: true,
}).extend({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  engineStatus: z.enum(["on", "off", "idle"]).default("off"),
  capturedAt: z.coerce.date(),
});

// Travel booking validation schemas
export const travelSearchSchema = z.object({
  serviceType: z.enum(["flight", "bus", "train", "cab", "metro", "rental"]),
  fromLocation: z.string().min(1, "From location is required"),
  toLocation: z.string().min(1, "To location is required"),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  passengers: z.coerce.number().positive("Must have at least one passenger").default(1),
  seatClass: z.string().optional(),
  vehicleType: z.string().optional(), // For cab/rental
  pickupAddress: z.string().optional(), // For cab
  dropoffAddress: z.string().optional(), // For cab
  rentalDuration: z.coerce.number().optional(), // For rental in hours
});

export const passengerInfoSchema = z.object({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  nationality: z.string().default("Indian"),
  idType: z.enum(["passport", "aadhar", "voter_id", "driving_license"]).optional(),
  idNumber: z.string().optional(),
  mealPreference: z.string().optional(),
  specialAssistance: z.string().optional(),
  isInfant: z.boolean().default(false),
});

export const bookingConfirmationSchema = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
  passengers: z.array(passengerInfoSchema).min(1, "At least one passenger is required"),
  seatClass: z.string().min(1, "Seat class is required"),
  contactInfo: z.object({
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
  specialRequests: z.string().optional(),
});

// Enhanced Investment System Tables
export const investmentWatchlist = pgTable("investment_watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assetType: text("asset_type").notNull(), // 'stock', 'mutual_fund', 'etf', 'bond', 'commodity'
  symbol: text("symbol").notNull(),
  instrumentName: text("instrument_name").notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }),
  priceAlert: decimal("price_alert", { precision: 12, scale: 2 }), // Alert when price reaches this
  alertEnabled: integer("alert_enabled").default(0),
  addedAt: timestamp("added_at").defaultNow(),
});

export const investmentOrders = pgTable("investment_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderType: text("order_type").notNull(), // 'buy', 'sell'
  assetType: text("asset_type").notNull(), // 'stock', 'mutual_fund', 'gold', 'silver', etc
  symbol: text("symbol").notNull(),
  instrumentName: text("instrument_name").notNull(),
  vendorId: varchar("vendor_id"), // References vendor if applicable
  vendorName: text("vendor_name"),
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  orderPrice: decimal("order_price", { precision: 12, scale: 2 }).notNull(),
  executedPrice: decimal("executed_price", { precision: 12, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  orderMode: text("order_mode").notNull().default("market"), // 'market', 'limit', 'stop_loss'
  status: text("status").notNull().default("pending"), // 'pending', 'executed', 'partially_filled', 'cancelled', 'failed'
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 10, scale: 2 }).default("0"),
  deliveryType: text("delivery_type"), // 'digital', 'physical', 'vault'
  paymentMethod: text("payment_method").default("upi"),
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'success', 'failed'
  transactionId: text("transaction_id"),
  fromAccount: text("from_account"), // Source account for payment
  toAccount: text("to_account"), // Destination for delivery (vault/custody)
  purity: text("purity"), // For commodities (24K, 22K, etc)
  unit: text("unit"), // 'grams', 'shares', 'units'
  fills: jsonb("fills"), // Array of partial fills with timestamp, price, qty
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investmentVendors = pgTable("investment_vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorName: text("vendor_name").notNull(),
  vendorType: text("vendor_type").notNull(), // 'broker', 'dealer', 'platform', 'vault'
  assetTypes: text("asset_types").array(), // Assets they deal with
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  trustBadge: text("trust_badge").default("verified"), // 'verified', 'premium', 'gold'
  verificationStatus: text("verification_status").default("verified"),
  deliveryOptions: jsonb("delivery_options"), // digital, physical, vault, etc
  feeStructure: jsonb("fee_structure"), // vendor fee, shipping, storage, etc
  buybackPolicy: jsonb("buyback_policy"),
  certifications: text("certifications").array(),
  avgDeliveryTime: integer("avg_delivery_time"), // in days
  reviewCount: integer("review_count").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  instrumentName: text("instrument_name").notNull(),
  assetType: text("asset_type").notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }).notNull(),
  openPrice: decimal("open_price", { precision: 12, scale: 2 }),
  highPrice: decimal("high_price", { precision: 12, scale: 2 }),
  lowPrice: decimal("low_price", { precision: 12, scale: 2 }),
  closePrice: decimal("close_price", { precision: 12, scale: 2 }),
  dayChange: decimal("day_change", { precision: 12, scale: 2 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 4 }),
  volume: integer("volume"),
  marketCap: text("market_cap"),
  peRatio: decimal("pe_ratio", { precision: 8, scale: 2 }),
  week52High: decimal("week_52_high", { precision: 12, scale: 2 }),
  week52Low: decimal("week_52_low", { precision: 12, scale: 2 }),
  sector: text("sector"),
  industry: text("industry"),
  priceHistory: jsonb("price_history"), // Array of { timestamp, price, volume } for charts
  purity: text("purity"), // For commodities (24K, 22K, VVS1, etc)
  unitType: text("unit_type"), // 'per_gram', 'per_share', 'nav'
  certification: text("certification"), // GIA, IGI for diamonds
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// FASTag Management Tables
export const userVehicles = pgTable("user_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleNumber: text("vehicle_number").notNull(),
  vehicleType: text("vehicle_type").notNull(), // 'car', 'bike', 'commercial'
  vehicleMake: text("vehicle_make"), // Toyota, Honda, etc
  vehicleModel: text("vehicle_model"),
  vehicleColor: text("vehicle_color"),
  registrationState: text("registration_state"),
  rcNumber: text("rc_number"),
  isPrimary: integer("is_primary").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userVehicleUniqueIdx: uniqueIndex("user_vehicles_unique_idx").on(table.userId, table.vehicleNumber),
}));

export const fastagAccounts = pgTable("fastag_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => userVehicles.id).notNull(),
  fastagNumber: text("fastag_number").notNull().unique(),
  bankName: text("bank_name").notNull(),
  bankLogo: text("bank_logo"),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  minBalance: decimal("min_balance", { precision: 10, scale: 2 }).default("100"),
  autoRechargeEnabled: integer("auto_recharge_enabled").default(0),
  autoRechargeAmount: decimal("auto_recharge_amount", { precision: 10, scale: 2 }),
  autoRechargeThreshold: decimal("auto_recharge_threshold", { precision: 10, scale: 2 }),
  status: text("status").default("active"), // 'active', 'inactive', 'blocked', 'expired'
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  lastRechargeDate: timestamp("last_recharge_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fastagTransactions = pgTable("fastag_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fastagAccountId: varchar("fastag_account_id").references(() => fastagAccounts.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'recharge', 'toll_payment', 'refund'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  tollPlazaName: text("toll_plaza_name"),
  tollPlazaLocation: text("toll_plaza_location"),
  vehicleNumber: text("vehicle_number"),
  status: text("status").notNull().default("success"), // 'success', 'failed', 'pending'
  paymentMethod: text("payment_method"), // for recharges: 'upi', 'card', 'wallet'
  paymentReference: text("payment_reference"),
  transactionReference: text("transaction_reference").notNull(),
  isAutoRecharge: integer("is_auto_recharge").default(0),
  metadata: jsonb("metadata"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertInvestmentWatchlistSchema = createInsertSchema(investmentWatchlist).omit({
  id: true,
  addedAt: true,
});

export const insertInvestmentOrderSchema = createInsertSchema(investmentOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  executedAt: true,
}).extend({
  orderType: z.enum(["buy", "sell"]),
  assetType: z.string().min(1, "Asset type is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  orderPrice: z.coerce.number().positive("Price must be positive"),
  totalAmount: z.coerce.number().positive("Total amount must be positive"),
  orderMode: z.enum(["market", "limit", "stop_loss"]).default("market"),
  status: z.enum(["pending", "executed", "partially_filled", "cancelled", "failed"]).default("pending"),
  fromAccount: z.string().optional(),
  toAccount: z.string().optional(),
  purity: z.string().optional(),
  unit: z.string().optional(),
  fills: z.array(z.object({
    timestamp: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).optional(),
});

export const insertInvestmentVendorSchema = createInsertSchema(investmentVendors).omit({
  id: true,
  createdAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
}).extend({
  priceHistory: z.array(z.object({
    timestamp: z.number(),
    price: z.number(),
    volume: z.number().optional(),
  })).optional(),
  purity: z.string().nullable().optional(),
  unitType: z.string().optional(),
  certification: z.string().optional(),
});

export const insertUserVehicleSchema = createInsertSchema(userVehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  vehicleType: z.enum(["car", "bike", "commercial"]),
});

export const insertFastagAccountSchema = createInsertSchema(fastagAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  fastagNumber: z.string().min(1, "FASTag number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  status: z.enum(["active", "inactive", "blocked", "expired"]).default("active"),
});

export const insertFastagTransactionSchema = createInsertSchema(fastagTransactions).omit({
  id: true,
  createdAt: true,
  transactionDate: true,
}).extend({
  transactionType: z.enum(["recharge", "toll_payment", "refund"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  status: z.enum(["success", "failed", "pending"]).default("success"),
});

// Export types for new tables
export type InvestmentWatchlist = typeof investmentWatchlist.$inferSelect;
export type InvestmentOrder = typeof investmentOrders.$inferSelect;
export type InvestmentVendor = typeof investmentVendors.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type UserVehicle = typeof userVehicles.$inferSelect;
export type FastagAccount = typeof fastagAccounts.$inferSelect;
export type FastagTransaction = typeof fastagTransactions.$inferSelect;
export type InsertInvestmentWatchlist = z.infer<typeof insertInvestmentWatchlistSchema>;
export type InsertInvestmentOrder = z.infer<typeof insertInvestmentOrderSchema>;
export type InsertInvestmentVendor = z.infer<typeof insertInvestmentVendorSchema>;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type InsertUserVehicle = z.infer<typeof insertUserVehicleSchema>;
export type InsertFastagAccount = z.infer<typeof insertFastagAccountSchema>;
export type InsertFastagTransaction = z.infer<typeof insertFastagTransactionSchema>;

// Export Travel types
export type TravelRoute = typeof travelRoutes.$inferSelect;
export type TravelSchedule = typeof travelSchedules.$inferSelect;
export type TravelBooking = typeof travelBookings.$inferSelect;
export type TravelPassenger = typeof travelPassengers.$inferSelect;
export type TravelPayment = typeof travelPayments.$inferSelect;
export type TravelCancellation = typeof travelCancellations.$inferSelect;
export type InsertTravelRoute = z.infer<typeof insertTravelRouteSchema>;
export type InsertTravelSchedule = z.infer<typeof insertTravelScheduleSchema>;
export type InsertTravelBooking = z.infer<typeof insertTravelBookingSchema>;
export type InsertTravelPassenger = z.infer<typeof insertTravelPassengerSchema>;
export type InsertTravelPayment = z.infer<typeof insertTravelPaymentSchema>;
export type InsertTravelCancellation = z.infer<typeof insertTravelCancellationSchema>;
export type TravelContract = typeof travelContracts.$inferSelect;
export type TravelAddon = typeof travelAddons.$inferSelect;
export type TravelLiveTracking = typeof travelLiveTracking.$inferSelect;
export type BoardingPass = typeof boardingPasses.$inferSelect;
export type TravelModification = typeof travelModifications.$inferSelect;
export type TravelAlert = typeof travelAlerts.$inferSelect;
export type InsertTravelContract = z.infer<typeof insertTravelContractSchema>;
export type InsertTravelAddon = z.infer<typeof insertTravelAddonSchema>;
export type InsertTravelLiveTracking = z.infer<typeof insertTravelLiveTrackingSchema>;
export type InsertBoardingPass = z.infer<typeof insertBoardingPassSchema>;
export type InsertTravelModification = z.infer<typeof insertTravelModificationSchema>;
export type InsertTravelAlert = z.infer<typeof insertTravelAlertSchema>;
export type TravelCoupon = typeof travelCoupons.$inferSelect;
export type TravelCouponUsage = typeof travelCouponUsage.$inferSelect;
export type InsertTravelCoupon = z.infer<typeof insertTravelCouponSchema>;
export type InsertTravelCouponUsage = z.infer<typeof insertTravelCouponUsageSchema>;
export type TravelSearch = z.infer<typeof travelSearchSchema>;
export type PassengerInfo = z.infer<typeof passengerInfoSchema>;
export type BookingConfirmation = z.infer<typeof bookingConfirmationSchema>;

// Export Driver & Vehicle Management types
export type DriverProfile = typeof driverProfiles.$inferSelect;
export type InsertDriverProfile = z.infer<typeof insertDriverProfileSchema>;
export type DriverExperience = typeof driverExperience.$inferSelect;
export type InsertDriverExperience = z.infer<typeof insertDriverExperienceSchema>;
export type DriverSchedule = typeof driverSchedules.$inferSelect;
export type InsertDriverSchedule = z.infer<typeof insertDriverScheduleSchema>;
export type DriverShift = typeof driverShifts.$inferSelect;
export type InsertDriverShift = z.infer<typeof insertDriverShiftSchema>;
export type VehicleOwner = typeof vehicleOwners.$inferSelect;
export type InsertVehicleOwner = z.infer<typeof insertVehicleOwnerSchema>;
export type RentalCompany = typeof rentalCompanies.$inferSelect;
export type InsertRentalCompany = z.infer<typeof insertRentalCompanySchema>;
export type CompanyLocation = typeof companyLocations.$inferSelect;
export type InsertCompanyLocation = z.infer<typeof insertCompanyLocationSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type VehicleImage = typeof vehicleImages.$inferSelect;
export type InsertVehicleImage = z.infer<typeof insertVehicleImageSchema>;
export type VehicleAvailabilitySlot = typeof vehicleAvailabilitySlots.$inferSelect;
export type InsertVehicleAvailabilitySlot = z.infer<typeof insertVehicleAvailabilitySlotSchema>;
export type DriverVehicle = typeof driverVehicles.$inferSelect;
export type InsertDriverVehicle = z.infer<typeof insertDriverVehicleSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewVote = typeof reviewVotes.$inferSelect;
export type InsertReviewVote = z.infer<typeof insertReviewVoteSchema>;
export type ReviewStats = typeof reviewStats.$inferSelect;
export type InsertReviewStats = z.infer<typeof insertReviewStatsSchema>;
export type VehicleTelematics = typeof vehicleTelematics.$inferSelect;
export type InsertVehicleTelematics = z.infer<typeof insertVehicleTelematicsSchema>;

// Export Insurance types
export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsurancePremiumPayment = typeof insurancePremiumPayments.$inferSelect;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;
export type InsurancePremiumPaymentData = z.infer<typeof insurancePremiumPaymentSchema>;
export type InsertInsuranceClaim = z.infer<typeof insertInsuranceClaimSchema>;
export type InsuranceClaimFormData = z.infer<typeof insuranceClaimFormSchema>;

// Loan Amortization Schedule Table
export const loanAmortizationSchedules = pgTable("loan_amortization_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loanApplications.id).notNull(),
  installmentNumber: integer("installment_number").notNull(),
  dueDate: timestamp("due_date").notNull(),
  principalAmount: decimal("principal_amount", { precision: 10, scale: 2 }).notNull(),
  interestAmount: decimal("interest_amount", { precision: 10, scale: 2 }).notNull(),
  totalEmi: decimal("total_emi", { precision: 10, scale: 2 }).notNull(),
  outstandingBalance: decimal("outstanding_balance", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'overdue'
  paidDate: timestamp("paid_date"),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  loanInstallmentUniqueIdx: uniqueIndex("loan_installment_unique_idx").on(table.loanId, table.installmentNumber),
  loanIdIdx: index("loan_amortization_loan_id_idx").on(table.loanId),
  statusIdx: index("loan_amortization_status_idx").on(table.status),
  dueDateIdx: index("loan_amortization_due_date_idx").on(table.dueDate),
}));

// Loan Documents Table
export const loanDocuments = pgTable("loan_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").references(() => loanApplications.id).notNull(),
  documentType: text("document_type").notNull(), // 'agreement', 'sanction_letter', 'repayment_schedule', 'closure_letter'
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url").notNull(),
  documentSize: integer("document_size"), // in bytes
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isVerified: integer("is_verified").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  loanIdIdx: index("loan_documents_loan_id_idx").on(table.loanId),
  documentTypeIdx: index("loan_documents_type_idx").on(table.documentType),
}));

// Saved Cards Table
export const savedCards = pgTable("saved_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cardToken: text("card_token").notNull(), // Tokenized card number (PCI compliant)
  cardType: text("card_type").notNull(), // 'debit', 'credit'
  cardNetwork: text("card_network").notNull(), // 'visa', 'mastercard', 'rupay', 'amex'
  last4Digits: text("last_4_digits").notNull(),
  expiryMonth: text("expiry_month").notNull(),
  expiryYear: text("expiry_year").notNull(),
  cardholderName: text("cardholder_name").notNull(),
  bankName: text("bank_name").notNull(),
  cardNickname: text("card_nickname"),
  isDefault: integer("is_default").default(0),
  isFrozen: integer("is_frozen").default(0),
  spendingLimit: decimal("spending_limit", { precision: 10, scale: 2 }),
  dailyLimit: decimal("daily_limit", { precision: 10, scale: 2 }),
  rewardsRate: decimal("rewards_rate", { precision: 5, scale: 2 }), // Cashback/rewards percentage
  billingAddress: jsonb("billing_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userCardUniqueIdx: uniqueIndex("user_card_unique_idx").on(table.userId, table.cardToken),
}));

// Card Transactions Table
export const cardTransactions = pgTable("card_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").references(() => savedCards.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'purchase', 'refund', 'emi_conversion'
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  merchantName: text("merchant_name"),
  merchantCategory: text("merchant_category"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  status: text("status").notNull().default("success"), // 'success', 'pending', 'failed', 'disputed'
  transactionReference: text("transaction_reference").notNull(),
  currency: text("currency").default("INR"),
  rewardsEarned: decimal("rewards_earned", { precision: 8, scale: 2 }).default("0"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  cardIdDateIdx: index("card_transactions_card_date_idx").on(table.cardId, table.transactionDate),
  userIdDateIdx: index("card_transactions_user_date_idx").on(table.userId, table.transactionDate),
  statusIdx: index("card_transactions_status_idx").on(table.status),
}));

// Bank Accounts Table
export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bankName: text("bank_name").notNull(),
  bankLogo: text("bank_logo"),
  accountNumber: text("account_number").notNull(), // Encrypted/last 4 digits only
  ifscCode: text("ifsc_code").notNull(),
  accountType: text("account_type").notNull(), // 'savings', 'current', 'salary'
  accountHolderName: text("account_holder_name").notNull(),
  branchName: text("branch_name"),
  isPrimary: integer("is_primary").default(0),
  isVerified: integer("is_verified").default(0),
  balance: decimal("balance", { precision: 15, scale: 2 }), // Optional: if read access granted
  linkedUpiIds: text("linked_upi_ids").array(),
  mandates: jsonb("mandates"), // Array of active auto-debit mandates
  preferredForLargePayouts: integer("preferred_for_large_payouts").default(0),
  addedAt: timestamp("added_at").defaultNow(),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userAccountUniqueIdx: uniqueIndex("user_account_unique_idx").on(table.userId, table.accountNumber),
}));

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // 'login', 'logout', 'profile_change', 'kyc_change', 'payment', 'transfer', 'password_change', 'security_setting'
  action: text("action").notNull(), // Descriptive action
  outcome: text("outcome").notNull(), // 'success', 'failed'
  ipAddress: text("ip_address"),
  deviceType: text("device_type"), // 'mobile', 'desktop', 'tablet'
  deviceInfo: text("device_info"),
  location: text("location"),
  metadata: jsonb("metadata"), // Additional context
  riskLevel: text("risk_level").default("low"), // 'low', 'medium', 'high'
  isSuspicious: integer("is_suspicious").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdTimestampIdx: index("activity_logs_user_timestamp_idx").on(table.userId, table.timestamp),
  activityTypeIdx: index("activity_logs_type_idx").on(table.activityType),
  outcomeIdx: index("activity_logs_outcome_idx").on(table.outcome),
  suspiciousIdx: index("activity_logs_suspicious_idx").on(table.isSuspicious),
}));

// Stock Trades Table (Detailed Trade History)
export const stockTrades = pgTable("stock_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(),
  companyName: text("company_name").notNull(),
  tradeType: text("trade_type").notNull(), // 'buy', 'sell', 'split', 'dividend', 'bonus'
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  buyPrice: decimal("buy_price", { precision: 12, scale: 2 }),
  sellPrice: decimal("sell_price", { precision: 12, scale: 2 }),
  executedPrice: decimal("executed_price", { precision: 12, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  brokerage: decimal("brokerage", { precision: 10, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 10, scale: 2 }).default("0"),
  otherFees: decimal("other_fees", { precision: 10, scale: 2 }).default("0"),
  netAmount: decimal("net_amount", { precision: 15, scale: 2 }).notNull(),
  profitLoss: decimal("profit_loss", { precision: 15, scale: 2 }),
  profitLossPercent: decimal("profit_loss_percent", { precision: 8, scale: 4 }),
  orderId: text("order_id").notNull(),
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  vendorName: text("vendor_name"),
  brokerName: text("broker_name"),
  settlementDate: timestamp("settlement_date"),
  settlementType: text("settlement_type").default("T+2"), // 'T+0', 'T+1', 'T+2'
  taxClassification: text("tax_classification"), // 'short_term', 'long_term'
  holdingPeriodDays: integer("holding_period_days"),
  fills: jsonb("fills"), // Array of partial fills { timestamp, price, quantity }
  tags: text("tags").array(), // User-defined tags for categorization
  notes: text("notes"),
  contractNoteUrl: text("contract_note_url"),
  invoiceUrl: text("invoice_url"),
  tradeDate: timestamp("trade_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdTradeDateIdx: index("stock_trades_user_date_idx").on(table.userId, table.tradeDate),
  symbolIdx: index("stock_trades_symbol_idx").on(table.symbol),
  tradeTypeIdx: index("stock_trades_type_idx").on(table.tradeType),
  taxClassificationIdx: index("stock_trades_tax_class_idx").on(table.taxClassification),
}));

// Financial Goals Table
export const financialGoals = pgTable("financial_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  goalName: text("goal_name").notNull(),
  goalType: text("goal_type").notNull(), // 'emergency_fund', 'home', 'wedding', 'education', 'retirement', 'vacation', 'custom'
  targetAmount: decimal("target_amount", { precision: 15, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 15, scale: 2 }).default("0"),
  monthlyContribution: decimal("monthly_contribution", { precision: 12, scale: 2 }),
  targetDate: timestamp("target_date"),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high'
  status: text("status").default("active"), // 'active', 'completed', 'paused', 'cancelled'
  linkedInvestments: text("linked_investments").array(), // IDs of linked investment accounts
  suggestedAllocation: jsonb("suggested_allocation"), // Recommended asset allocation
  progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0"),
  monthsToGoal: integer("months_to_goal"),
  projectedCompletionDate: timestamp("projected_completion_date"),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("financial_goals_user_id_idx").on(table.userId),
  statusIdx: index("financial_goals_status_idx").on(table.status),
  targetDateIdx: index("financial_goals_target_date_idx").on(table.targetDate),
}));

// Budgets Table
export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  budgetName: text("budget_name").notNull(),
  category: text("category").notNull(), // 'food', 'transport', 'entertainment', 'utilities', 'shopping', 'healthcare', 'education', 'custom'
  monthlyLimit: decimal("monthly_limit", { precision: 12, scale: 2 }).notNull(),
  currentSpend: decimal("current_spend", { precision: 12, scale: 2 }).default("0"),
  alertThreshold: decimal("alert_threshold", { precision: 5, scale: 2 }).default("80"), // Percentage
  isAlertEnabled: integer("is_alert_enabled").default(1),
  rolloverEnabled: integer("rollover_enabled").default(0), // Carry over unused budget
  rolloverAmount: decimal("rollover_amount", { precision: 12, scale: 2 }).default("0"),
  budgetPeriod: text("budget_period").default("monthly"), // 'weekly', 'monthly', 'yearly'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"), // 'active', 'exceeded', 'paused'
  spendBySubcategory: jsonb("spend_by_subcategory"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userCategoryPeriodUniqueIdx: uniqueIndex("user_category_period_unique_idx").on(table.userId, table.category, table.startDate),
  userIdIdx: index("budgets_user_id_idx").on(table.userId),
  statusIdx: index("budgets_status_idx").on(table.status),
  categoryIdx: index("budgets_category_idx").on(table.category),
  startDateIdx: index("budgets_start_date_idx").on(table.startDate),
}));

// Insert Schemas
export const insertLoanAmortizationScheduleSchema = createInsertSchema(loanAmortizationSchedules).omit({
  id: true,
  createdAt: true,
});

export const insertLoanDocumentSchema = createInsertSchema(loanDocuments).omit({
  id: true,
  createdAt: true,
  uploadedAt: true,
});

export const insertSavedCardSchema = createInsertSchema(savedCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCardTransactionSchema = createInsertSchema(cardTransactions).omit({
  id: true,
  createdAt: true,
  transactionDate: true,
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  addedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
  timestamp: true,
});

export const insertStockTradeSchema = createInsertSchema(stockTrades).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Mutual Funds Table
export const mutualFunds = pgTable("mutual_funds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fundCode: text("fund_code").notNull().unique(),
  fundName: text("fund_name").notNull(),
  fundHouse: text("fund_house").notNull(), // AMC name
  fundType: text("fund_type").notNull(), // 'equity', 'debt', 'hybrid', 'index', 'etf'
  category: text("category"), // 'large_cap', 'mid_cap', 'small_cap', 'multi_cap', etc
  nav: decimal("nav", { precision: 12, scale: 4 }).notNull(),
  previousNav: decimal("previous_nav", { precision: 12, scale: 4 }),
  dayChange: decimal("day_change", { precision: 8, scale: 4 }),
  dayChangePercent: decimal("day_change_percent", { precision: 8, scale: 4 }),
  aum: text("aum"), // Assets under management
  expenseRatio: decimal("expense_ratio", { precision: 5, scale: 2 }),
  exitLoad: decimal("exit_load", { precision: 5, scale: 2 }),
  minInvestment: decimal("min_investment", { precision: 10, scale: 2 }).default("500"),
  minSipAmount: decimal("min_sip_amount", { precision: 10, scale: 2 }).default("500"),
  riskLevel: text("risk_level").default("medium"), // 'very_high', 'high', 'medium', 'low', 'very_low'
  returns1Month: decimal("returns_1_month", { precision: 8, scale: 4 }),
  returns3Month: decimal("returns_3_month", { precision: 8, scale: 4 }),
  returns6Month: decimal("returns_6_month", { precision: 8, scale: 4 }),
  returns1Year: decimal("returns_1_year", { precision: 8, scale: 4 }),
  returns3Year: decimal("returns_3_year", { precision: 8, scale: 4 }),
  returns5Year: decimal("returns_5_year", { precision: 8, scale: 4 }),
  returnsSinceInception: decimal("returns_since_inception", { precision: 8, scale: 4 }),
  inceptionDate: timestamp("inception_date"),
  fundManager: text("fund_manager"),
  navHistory: jsonb("nav_history"), // Array of { date, nav } for charts
  topHoldings: jsonb("top_holdings"), // Array of holdings
  sectorAllocation: jsonb("sector_allocation"),
  isActive: integer("is_active").default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// SIP (Systematic Investment Plan) Table
export const sipInvestments = pgTable("sip_investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fundId: varchar("fund_id").references(() => mutualFunds.id).notNull(),
  sipAmount: decimal("sip_amount", { precision: 12, scale: 2 }).notNull(),
  frequency: text("frequency").notNull().default("monthly"), // 'daily', 'weekly', 'monthly', 'quarterly'
  sipDay: integer("sip_day"), // Day of month for monthly SIP
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // null for perpetual SIP
  endCondition: text("end_condition"), // 'until_cancelled', 'fixed_installments', 'target_amount'
  installmentsCompleted: integer("installments_completed").default(0),
  totalInstallments: integer("total_installments"),
  targetAmount: decimal("target_amount", { precision: 15, scale: 2 }),
  totalInvested: decimal("total_invested", { precision: 15, scale: 2 }).default("0"),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).default("0"),
  totalUnits: decimal("total_units", { precision: 15, scale: 6 }).default("0"),
  xirr: decimal("xirr", { precision: 8, scale: 4 }), // Extended Internal Rate of Return
  cagr: decimal("cagr", { precision: 8, scale: 4 }), // Compounded Annual Growth Rate
  nextDebitDate: timestamp("next_debit_date"),
  paymentMethod: text("payment_method").default("auto_debit"), // 'auto_debit', 'manual'
  mandateId: text("mandate_id"), // e-mandate reference
  mandateStatus: text("mandate_status").default("pending"), // 'pending', 'active', 'cancelled'
  status: text("status").notNull().default("active"), // 'active', 'paused', 'completed', 'cancelled'
  failedCount: integer("failed_count").default(0),
  lastDebitDate: timestamp("last_debit_date"),
  lastDebitStatus: text("last_debit_status"),
  autoEscalation: integer("auto_escalation").default(0), // Auto-increase SIP amount
  escalationPercent: decimal("escalation_percent", { precision: 5, scale: 2 }),
  escalationFrequency: text("escalation_frequency"), // 'yearly', 'half_yearly'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SIP Transactions Table
export const sipTransactions = pgTable("sip_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sipId: varchar("sip_id").references(() => sipInvestments.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fundId: varchar("fund_id").references(() => mutualFunds.id).notNull(),
  installmentNumber: integer("installment_number").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  nav: decimal("nav", { precision: 12, scale: 4 }).notNull(),
  units: decimal("units", { precision: 15, scale: 6 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed', 'cancelled'
  paymentMethod: text("payment_method").default("auto_debit"),
  transactionId: text("transaction_id"),
  upiTransactionId: varchar("upi_transaction_id").references(() => upiTransactions.id),
  failureReason: text("failure_reason"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  executedDate: timestamp("executed_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fixed Deposits Table
export const fixedDeposits = pgTable("fixed_deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bankName: text("bank_name").notNull(),
  bankLogo: text("bank_logo"),
  fdName: text("fd_name").notNull(),
  fdType: text("fd_type").notNull(), // 'regular', 'tax_saver', 'senior_citizen', 'cumulative', 'non_cumulative'
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  seniorCitizenRate: decimal("senior_citizen_rate", { precision: 5, scale: 2 }),
  minAmount: decimal("min_amount", { precision: 12, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 12, scale: 2 }),
  minTenure: integer("min_tenure").notNull(), // in months
  maxTenure: integer("max_tenure").notNull(), // in months
  tenureOptions: integer("tenure_options").array(), // [6, 12, 24, 36, 60] months
  compoundingFrequency: text("compounding_frequency").notNull(), // 'monthly', 'quarterly', 'half_yearly', 'yearly'
  interestPayoutFrequency: text("interest_payout_frequency"), // 'monthly', 'quarterly', 'yearly', 'at_maturity'
  prematureWithdrawalAllowed: integer("premature_withdrawal_allowed").default(1),
  prematureWithdrawalPenalty: decimal("premature_withdrawal_penalty", { precision: 5, scale: 2 }),
  loanAgainstFdAllowed: integer("loan_against_fd_allowed").default(1),
  loanPercentage: decimal("loan_percentage", { precision: 5, scale: 2 }), // e.g., 90% of FD value
  taxBenefitSection: text("tax_benefit_section"), // '80C', null
  taxBenefitAmount: decimal("tax_benefit_amount", { precision: 12, scale: 2 }),
  tdsApplicable: integer("tds_applicable").default(1),
  nomineeRequired: integer("nominee_required").default(1),
  autoRenewal: integer("auto_renewal").default(0),
  features: jsonb("features"), // Array of feature strings
  rating: decimal("rating", { precision: 3, scale: 2 }),
  popularity: integer("popularity").default(0), // For sorting
  fdCategory: text("fd_category").default("top_rated"), // 'top_rated', 'best_rates', 'senior_citizen', 'tax_saver'
  isActive: integer("is_active").default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User FD Investments Table
export const userFixedDeposits = pgTable("user_fixed_deposits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fdSchemeId: varchar("fd_scheme_id").references(() => fixedDeposits.id).notNull(),
  fdNumber: text("fd_number").notNull().unique(),
  principalAmount: decimal("principal_amount", { precision: 15, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  tenure: integer("tenure").notNull(), // in months
  interestType: text("interest_type").notNull(), // 'simple', 'compound'
  payoutFrequency: text("payout_frequency"), // 'monthly', 'quarterly', 'yearly', 'at_maturity'
  maturityAmount: decimal("maturity_amount", { precision: 15, scale: 2 }).notNull(),
  interestEarned: decimal("interest_earned", { precision: 15, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  maturityDate: timestamp("maturity_date").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'matured', 'closed', 'premature_closed'
  autoRenewal: integer("auto_renewal").default(0),
  nomineeDetails: jsonb("nominee_details"), // { name, relation, dob }
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  certificateUrl: text("certificate_url"),
  interestPaidTillDate: decimal("interest_paid_till_date", { precision: 15, scale: 2 }).default("0"),
  lastInterestPaidDate: timestamp("last_interest_paid_date"),
  tdsCertificates: jsonb("tds_certificates"), // Array of TDS certificates
  closedDate: timestamp("closed_date"),
  closureReason: text("closure_reason"), // 'maturity', 'premature_withdrawal', 'transfer'
  closureAmount: decimal("closure_amount", { precision: 15, scale: 2 }),
  penaltyAmount: decimal("penalty_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// FD Interest Payments Table
export const fdInterestPayments = pgTable("fd_interest_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userFdId: varchar("user_fd_id").references(() => userFixedDeposits.id).notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  interestAmount: decimal("interest_amount", { precision: 12, scale: 2 }).notNull(),
  tdsDeducted: decimal("tds_deducted", { precision: 10, scale: 2 }).default("0"),
  netAmount: decimal("net_amount", { precision: 12, scale: 2 }).notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  paymentStatus: text("payment_status").default("paid"), // 'paid', 'pending', 'failed'
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vendor Offers for Commodities (Gold, Silver, Diamond)
export const vendorOffers = pgTable("vendor_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => investmentVendors.id).notNull(),
  assetType: text("asset_type").notNull(), // 'gold', 'silver', 'platinum', 'diamond'
  assetName: text("asset_name").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // 'gram', 'carat', 'piece'
  purity: text("purity"), // '24K', '22K', '999', 'VVS1', etc
  spread: decimal("spread", { precision: 8, scale: 4 }), // Vendor markup percentage
  minQuantity: decimal("min_quantity", { precision: 10, scale: 4 }),
  maxQuantity: decimal("max_quantity", { precision: 10, scale: 4 }),
  deliveryType: text("delivery_type").notNull(), // 'digital', 'physical', 'vault'
  vaultFeeAnnual: decimal("vault_fee_annual", { precision: 8, scale: 2 }),
  insuranceFee: decimal("insurance_fee", { precision: 8, scale: 2 }),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }),
  gstPercent: decimal("gst_percent", { precision: 5, scale: 2 }).default("3"),
  buybackGuarantee: integer("buyback_guarantee").default(0),
  buybackPercent: decimal("buyback_percent", { precision: 5, scale: 2 }),
  buybackConditions: text("buyback_conditions"),
  certifications: text("certifications").array(), // GIA, IGI, BIS, etc
  inventoryCount: integer("inventory_count"),
  avgDeliveryDays: integer("avg_delivery_days"),
  benchmarkPrice: decimal("benchmark_price", { precision: 12, scale: 2 }), // LBMA or global benchmark
  priceHistory: jsonb("price_history"), // Array of { timestamp, price }
  specifications: jsonb("specifications"), // Diamond: cut, clarity, color, carat
  isActive: integer("is_active").default(1),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Portfolio Allocations Table
export const aiPortfolioAllocations = pgTable("ai_portfolio_allocations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planName: text("plan_name").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 15, scale: 2 }).notNull(),
  monthlySipAmount: decimal("monthly_sip_amount", { precision: 12, scale: 2 }),
  riskProfile: text("risk_profile").notNull(), // 'conservative', 'balanced', 'aggressive'
  duration: integer("duration").notNull(), // in months
  expectedReturn: decimal("expected_return", { precision: 8, scale: 4 }),
  lowReturn: decimal("low_return", { precision: 8, scale: 4 }),
  highReturn: decimal("high_return", { precision: 8, scale: 4 }),
  volatility: decimal("volatility", { precision: 8, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 8, scale: 4 }),
  allocation: jsonb("allocation").notNull(), // { stocks: 60, gold: 20, mf: 15, bonds: 5 }
  instruments: jsonb("instruments").notNull(), // Array of { type, symbol, weight, reason }
  restrictions: jsonb("restrictions"), // No crypto, ESG only, etc
  autoRebalance: integer("auto_rebalance").default(0),
  rebalanceFrequency: text("rebalance_frequency"), // 'monthly', 'quarterly', 'yearly'
  modelVersion: text("model_version").notNull(),
  modelMetadata: jsonb("model_metadata"), // Model ID, last data refresh, backtest params
  backtestResults: jsonb("backtest_results"), // 3/5/10 year backtest results
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'completed', 'cancelled'
  executionSchedule: jsonb("execution_schedule"), // Staged order execution plan
  totalDebitAmount: decimal("total_debit_amount", { precision: 15, scale: 2 }),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).default("0"),
  actualReturn: decimal("actual_return", { precision: 8, scale: 4 }),
  mandateId: text("mandate_id"), // e-mandate for auto SIP
  mandateStatus: text("mandate_status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction Confirmations for Post-Purchase Congrats Page
export const transactionConfirmations = pgTable("transaction_confirmations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: varchar("order_id").references(() => investmentOrders.id).notNull(),
  transactionType: text("transaction_type").notNull(), // 'buy', 'sell'
  assetType: text("asset_type").notNull(), // 'stock', 'mutual_fund', 'gold', 'silver', 'diamond'
  assetName: text("asset_name").notNull(),
  symbol: text("symbol"),
  vendorName: text("vendor_name"),
  quantity: decimal("quantity", { precision: 15, scale: 6 }).notNull(),
  unit: text("unit"), // 'shares', 'grams', 'units'
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }).notNull(),
  sellPrice: decimal("sell_price", { precision: 12, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 10, scale: 2 }).default("0"),
  profitLoss: decimal("profit_loss", { precision: 15, scale: 2 }),
  profitLossPercent: decimal("profit_loss_percent", { precision: 8, scale: 4 }),
  executedAt: timestamp("executed_at").notNull(),
  paymentMethod: text("payment_method"),
  upiTransactionId: text("upi_transaction_id"),
  deliveryType: text("delivery_type"), // 'digital', 'physical', 'vault'
  settlementDate: timestamp("settlement_date"),
  congratsMessage: text("congrats_message"),
  isProfitable: integer("is_profitable").default(0),
  holdingPeriodDays: integer("holding_period_days"),
  taxClassification: text("tax_classification"), // 'short_term', 'long_term'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas for new tables
export const insertMutualFundSchema = createInsertSchema(mutualFunds).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
}).extend({
  nav: z.coerce.number().positive("NAV must be positive"),
  fundType: z.enum(["equity", "debt", "hybrid", "index", "etf"]),
  riskLevel: z.enum(["very_high", "high", "medium", "low", "very_low"]).default("medium"),
});

export const insertSipInvestmentSchema = createInsertSchema(sipInvestments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  sipAmount: z.coerce.number().positive("SIP amount must be positive"),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly"]).default("monthly"),
  endCondition: z.enum(["until_cancelled", "fixed_installments", "target_amount"]).optional(),
  status: z.enum(["active", "paused", "completed", "cancelled"]).default("active"),
  mandateStatus: z.enum(["pending", "active", "cancelled"]).default("pending"),
});

export const insertSipTransactionSchema = createInsertSchema(sipTransactions).omit({
  id: true,
  createdAt: true,
}).extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  status: z.enum(["pending", "success", "failed", "cancelled"]).default("pending"),
});

export const insertVendorOfferSchema = createInsertSchema(vendorOffers).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
}).extend({
  assetType: z.enum(["gold", "silver", "platinum", "diamond"]),
  pricePerUnit: z.coerce.number().positive("Price must be positive"),
  deliveryType: z.enum(["digital", "physical", "vault"]),
});

export const insertAiPortfolioAllocationSchema = createInsertSchema(aiPortfolioAllocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  investmentAmount: z.coerce.number().positive("Investment amount must be positive"),
  riskProfile: z.enum(["conservative", "balanced", "aggressive"]),
  status: z.enum(["draft", "active", "completed", "cancelled"]).default("draft"),
  rebalanceFrequency: z.enum(["monthly", "quarterly", "yearly"]).optional(),
});

export const insertTransactionConfirmationSchema = createInsertSchema(transactionConfirmations).omit({
  id: true,
  createdAt: true,
}).extend({
  transactionType: z.enum(["buy", "sell"]),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  totalAmount: z.coerce.number().positive("Total amount must be positive"),
});

// FD Insert Schemas
export const insertFixedDepositSchema = createInsertSchema(fixedDeposits).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
}).extend({
  fdType: z.enum(["regular", "tax_saver", "senior_citizen", "cumulative", "non_cumulative"]),
  interestRate: z.coerce.number().positive("Interest rate must be positive"),
  minAmount: z.coerce.number().positive("Minimum amount must be positive"),
  compoundingFrequency: z.enum(["monthly", "quarterly", "half_yearly", "yearly"]),
  fdCategory: z.enum(["top_rated", "best_rates", "senior_citizen", "tax_saver"]).default("top_rated"),
});

export const insertUserFixedDepositSchema = createInsertSchema(userFixedDeposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  fdNumber: true,
}).extend({
  principalAmount: z.coerce.number().positive("Principal amount must be positive"),
  interestRate: z.coerce.number().positive("Interest rate must be positive"),
  tenure: z.coerce.number().int().positive("Tenure must be positive"),
  interestType: z.enum(["simple", "compound"]),
  status: z.enum(["active", "matured", "closed", "premature_closed"]).default("active"),
});

export const insertFdInterestPaymentSchema = createInsertSchema(fdInterestPayments).omit({
  id: true,
  createdAt: true,
}).extend({
  interestAmount: z.coerce.number().positive("Interest amount must be positive"),
  paymentStatus: z.enum(["paid", "pending", "failed"]).default("paid"),
});

// Select and Insert Types
export type MutualFund = typeof mutualFunds.$inferSelect;
export type InsertMutualFund = z.infer<typeof insertMutualFundSchema>;
export type SelectMutualFund = typeof mutualFunds.$inferSelect;

export type SipInvestment = typeof sipInvestments.$inferSelect;
export type InsertSipInvestment = z.infer<typeof insertSipInvestmentSchema>;
export type SelectSipInvestment = typeof sipInvestments.$inferSelect;

export type SipTransaction = typeof sipTransactions.$inferSelect;
export type InsertSipTransaction = z.infer<typeof insertSipTransactionSchema>;
export type SelectSipTransaction = typeof sipTransactions.$inferSelect;

export type VendorOffer = typeof vendorOffers.$inferSelect;
export type InsertVendorOffer = z.infer<typeof insertVendorOfferSchema>;
export type SelectVendorOffer = typeof vendorOffers.$inferSelect;

export type AiPortfolioAllocation = typeof aiPortfolioAllocations.$inferSelect;
export type InsertAiPortfolioAllocation = z.infer<typeof insertAiPortfolioAllocationSchema>;
export type SelectAiPortfolioAllocation = typeof aiPortfolioAllocations.$inferSelect;

export type TransactionConfirmation = typeof transactionConfirmations.$inferSelect;
export type InsertTransactionConfirmation = z.infer<typeof insertTransactionConfirmationSchema>;
export type SelectTransactionConfirmation = typeof transactionConfirmations.$inferSelect;

// FD Types
export type FixedDeposit = typeof fixedDeposits.$inferSelect;
export type InsertFixedDeposit = z.infer<typeof insertFixedDepositSchema>;
export type SelectFixedDeposit = typeof fixedDeposits.$inferSelect;

export type UserFixedDeposit = typeof userFixedDeposits.$inferSelect;
export type InsertUserFixedDeposit = z.infer<typeof insertUserFixedDepositSchema>;
export type SelectUserFixedDeposit = typeof userFixedDeposits.$inferSelect;

export type FdInterestPayment = typeof fdInterestPayments.$inferSelect;
export type InsertFdInterestPayment = z.infer<typeof insertFdInterestPaymentSchema>;
export type SelectFdInterestPayment = typeof fdInterestPayments.$inferSelect;

// Export Types
export type LoanAmortizationSchedule = typeof loanAmortizationSchedules.$inferSelect;
export type LoanDocument = typeof loanDocuments.$inferSelect;
export type SavedCard = typeof savedCards.$inferSelect;
export type CardTransaction = typeof cardTransactions.$inferSelect;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type StockTrade = typeof stockTrades.$inferSelect;
export type FinancialGoal = typeof financialGoals.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type InsertLoanAmortizationSchedule = z.infer<typeof insertLoanAmortizationScheduleSchema>;
export type InsertLoanDocument = z.infer<typeof insertLoanDocumentSchema>;
export type InsertSavedCard = z.infer<typeof insertSavedCardSchema>;
export type InsertCardTransaction = z.infer<typeof insertCardTransactionSchema>;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type InsertStockTrade = z.infer<typeof insertStockTradeSchema>;
export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

// Universal Transaction Success Records with Rewards
export const transactionSuccessRecords = pgTable("transaction_success_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionCategory: text("transaction_category").notNull(), // 'loan', 'emi', 'bill', 'upi', 'investment', 'stock', 'gold', 'mf', 'fd', 'diamond'
  transactionType: text("transaction_type").notNull(), // 'buy', 'sell', 'payment', 'disbursement'
  transactionId: text("transaction_id").notNull(), // Reference to source transaction
  
  // Asset/Service Details
  assetName: text("asset_name"), // Stock name, commodity name, bill type, etc.
  symbol: text("symbol"), // For stocks/MF
  vendorName: text("vendor_name"), // Broker, dealer, platform
  
  // Quantity & Pricing
  quantity: decimal("quantity", { precision: 15, scale: 6 }),
  unit: text("unit"), // 'shares', 'grams', 'units', null for payments
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  sellPrice: decimal("sell_price", { precision: 12, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 10, scale: 2 }).default("0"),
  
  // Profit/Loss (for sell transactions)
  profitLoss: decimal("profit_loss", { precision: 15, scale: 2 }),
  profitLossPercent: decimal("profit_loss_percent", { precision: 8, scale: 4 }),
  isProfitable: integer("is_profitable").default(0),
  holdingPeriodDays: integer("holding_period_days"),
  taxClassification: text("tax_classification"), // 'short_term', 'long_term'
  
  // Transaction Metadata
  executedAt: timestamp("executed_at").notNull(),
  paymentMethod: text("payment_method"), // 'upi', 'stripe', 'wallet', 'bank_transfer'
  paymentReference: text("payment_reference"),
  deliveryType: text("delivery_type"), // 'digital', 'physical', 'vault'
  settlementDate: timestamp("settlement_date"),
  loanDetails: jsonb("loan_details"), // For loan: amount, tenure, EMI
  emiDetails: jsonb("emi_details"), // For EMI: loan ID, installment number
  billDetails: jsonb("bill_details"), // For bills: operator, account number
  
  // Reward/Coupon Information
  couponCode: text("coupon_code").notNull(),
  couponBrand: text("coupon_brand").notNull(),
  couponTitle: text("coupon_title").notNull(),
  couponValue: decimal("coupon_value", { precision: 10, scale: 2 }).notNull(),
  couponDescription: text("coupon_description"),
  couponValidUntil: timestamp("coupon_valid_until").notNull(),
  couponCategory: text("coupon_category"), // 'shopping', 'food', 'travel', 'entertainment'
  couponTerms: text("coupon_terms"),
  couponBrandLogo: text("coupon_brand_logo"),
  
  // Additional rewards
  cashbackEarned: decimal("cashback_earned", { precision: 10, scale: 2 }).default("0"),
  pointsEarned: integer("points_earned").default(0),
  congratsMessage: text("congrats_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("txn_success_user_id_idx").on(table.userId),
  categoryIdx: index("txn_success_category_idx").on(table.transactionCategory),
  executedAtIdx: index("txn_success_executed_at_idx").on(table.executedAt),
}));

export const insertTransactionSuccessRecordSchema = createInsertSchema(transactionSuccessRecords).omit({
  id: true,
  createdAt: true,
}).extend({
  transactionCategory: z.enum(['loan', 'emi', 'bill', 'upi', 'investment', 'stock', 'gold', 'silver', 'mf', 'fd', 'diamond']),
  transactionType: z.enum(['buy', 'sell', 'payment', 'disbursement', 'recharge', 'transfer']),
  totalAmount: z.coerce.number().positive("Total amount must be positive"),
  couponValue: z.coerce.number().positive("Coupon value must be positive"),
});

export type TransactionSuccessRecord = typeof transactionSuccessRecords.$inferSelect;
export type InsertTransactionSuccessRecord = z.infer<typeof insertTransactionSuccessRecordSchema>;
export type SelectTransactionSuccessRecord = typeof transactionSuccessRecords.$inferSelect;

// ============================================================================
// MOVIE BOOKING SYSTEM
// ============================================================================

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
  language: text("language").notNull(), // Hindi, English, Tamil, etc.
  genre: text("genre").array(), // Action, Drama, Comedy, etc.
  duration: integer("duration").notNull(), // in minutes
  rating: text("rating").notNull(), // U, UA, A, etc.
  imdbRating: decimal("imdb_rating", { precision: 3, scale: 1 }),
  releaseDate: timestamp("release_date").notNull(),
  cast: jsonb("cast"), // [{name, role, image}]
  crew: jsonb("crew"), // [{name, role}]
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const theaters = pgTable("theaters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  area: text("area").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  amenities: text("amenities").array(), // Parking, Food Court, etc.
  screens: integer("screens").default(1),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const movieShowtimes = pgTable("movie_showtimes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  movieId: varchar("movie_id").references(() => movies.id).notNull(),
  theaterId: varchar("theater_id").references(() => theaters.id).notNull(),
  showAt: timestamp("show_at").notNull(),
  screen: text("screen").notNull(),
  format: text("format").notNull(), // 2D, 3D, IMAX, 4DX
  language: text("language").notNull(),
  availableSeats: integer("available_seats").notNull(),
  totalSeats: integer("total_seats").notNull(),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueShowtimeIdx: uniqueIndex("movie_showtimes_unique_idx").on(table.movieId, table.theaterId, table.showAt, table.screen),
}));

export const seatCategories = pgTable("seat_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showtimeId: varchar("showtime_id").references(() => movieShowtimes.id).notNull(),
  categoryName: text("category_name").notNull(), // Normal, Premium, Recliner
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seatLayout = pgTable("seat_layout", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  showtimeId: varchar("showtime_id").references(() => movieShowtimes.id).notNull(),
  seatNumber: text("seat_number").notNull(), // A1, B2, etc.
  categoryId: varchar("category_id").references(() => seatCategories.id).notNull(),
  row: text("row").notNull(),
  column: integer("column").notNull(),
  status: text("status").notNull().default("available"), // available, booked, blocked, hold
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueSeatIdx: uniqueIndex("seat_layout_unique_idx").on(table.showtimeId, table.seatNumber),
}));

export const seatHolds = pgTable("seat_holds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seatId: varchar("seat_id").references(() => seatLayout.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const movieBookings = pgTable("movie_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  showtimeId: varchar("showtime_id").references(() => movieShowtimes.id).notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  movieTitle: text("movie_title").notNull(),
  theaterName: text("theater_name").notNull(),
  showAt: timestamp("show_at").notNull(),
  seatNumbers: text("seat_numbers").array().notNull(),
  seatCategories: jsonb("seat_categories"), // [{categoryId, categoryName, quantity, price}]
  totalSeats: integer("total_seats").notNull(),
  ticketAmount: decimal("ticket_amount", { precision: 10, scale: 2 }).notNull(),
  convenienceFee: decimal("convenience_fee", { precision: 8, scale: 2 }).default("0"),
  foodAmount: decimal("food_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  foodItems: jsonb("food_items"), // [{name, quantity, price}]
  qrCode: text("qr_code"),
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, used
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentId: varchar("stripe_payment_id").references(() => stripePayments.id),
  cancellationPolicy: jsonb("cancellation_policy"),
  cancellationCharge: decimal("cancellation_charge", { precision: 8, scale: 2 }),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundStatus: text("refund_status"), // pending, processed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const foodMenuItems = pgTable("food_menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theaterId: varchar("theater_id").references(() => theaters.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Combo, Snacks, Beverages
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isCombo: integer("is_combo").default(0),
  comboItems: text("combo_items").array(),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// EVENTS BOOKING SYSTEM
// ============================================================================

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Concert, Sports, Play, Exhibition, Conference
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  venueName: text("venue_name").notNull(),
  venueAddress: text("venue_address").notNull(),
  city: text("city").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  eventDate: timestamp("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  duration: integer("duration"), // in minutes
  organizer: text("organizer"),
  artistInfo: jsonb("artist_info"), // [{name, role, image}]
  tags: text("tags").array(), // Rock, Comedy, Football, etc.
  ageRestriction: text("age_restriction"), // 18+, All Ages, etc.
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventTicketTiers = pgTable("event_ticket_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  tierName: text("tier_name").notNull(), // VIP, Premium, General, Early Bird
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalTickets: integer("total_tickets").notNull(),
  availableTickets: integer("available_tickets").notNull(),
  benefits: text("benefits").array(), // Free Parking, Meet & Greet, etc.
  color: text("color").default("#6366f1"), // For UI display
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventTicketHolds = pgTable("event_ticket_holds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tierId: varchar("tier_id").references(() => eventTicketTiers.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  quantity: integer("quantity").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventBookings = pgTable("event_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  eventTitle: text("event_title").notNull(),
  venueName: text("venue_name").notNull(),
  eventAt: timestamp("event_at").notNull(),
  tickets: jsonb("tickets").notNull(), // [{tierId, tierName, quantity, price}]
  totalTickets: integer("total_tickets").notNull(),
  ticketAmount: decimal("ticket_amount", { precision: 10, scale: 2 }).notNull(),
  convenienceFee: decimal("convenience_fee", { precision: 8, scale: 2 }).default("0"),
  merchandiseAmount: decimal("merchandise_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  merchandiseItems: jsonb("merchandise_items"), // [{name, quantity, price}]
  attendeeInfo: jsonb("attendee_info"), // [{name, email, phone}] for each ticket
  qrCodes: text("qr_codes").array(), // One QR per ticket
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, attended
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentId: varchar("stripe_payment_id").references(() => stripePayments.id),
  cancellationPolicy: jsonb("cancellation_policy"),
  cancellationCharge: decimal("cancellation_charge", { precision: 8, scale: 2 }),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundStatus: text("refund_status"), // pending, processed, failed
  checkInStatus: text("check_in_status").default("not_checked_in"), // not_checked_in, checked_in
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventMerchandise = pgTable("event_merchandise", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // T-Shirt, Poster, Album, Cap, Combo
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  sizes: text("sizes").array(), // S, M, L, XL for clothing
  colors: text("colors").array(), // Available colors
  stock: integer("stock").notNull().default(0),
  isActive: integer("is_active").default(1), // Using integer for SQLite compatibility
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventFoodBeverages = pgTable("event_food_beverages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Combo, Snacks, Beverages, Meals
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isVegetarian: integer("is_vegetarian").default(0), // Using integer for SQLite compatibility
  isCombo: integer("is_combo").default(0), // Using integer for SQLite compatibility
  comboItems: text("combo_items").array(),
  isActive: integer("is_active").default(1), // Using integer for SQLite compatibility
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// HOTEL & STAY BOOKING SYSTEM
// ============================================================================

export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  propertyType: text("property_type").notNull(), // Hotel, Resort, Villa, Homestay, Apartment
  starRating: integer("star_rating").default(3), // 1-5 stars
  city: text("city").notNull(),
  area: text("area").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  landmark: text("landmark"),
  images: text("images").array(),
  amenities: text("amenities").array(), // WiFi, Parking, Pool, Gym, etc.
  checkInTime: text("check_in_time").default("14:00"),
  checkOutTime: text("check_out_time").default("11:00"),
  policies: jsonb("policies"), // Cancellation, Child, Pet policies
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.0"),
  totalReviews: integer("total_reviews").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hotelRooms = pgTable("hotel_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  roomType: text("room_type").notNull(), // Deluxe, Suite, Standard, etc.
  bedType: text("bed_type").notNull(), // King, Queen, Twin, etc.
  maxOccupancy: integer("max_occupancy").notNull().default(2),
  roomSize: text("room_size"), // 250 sq ft
  images: text("images").array(),
  amenities: text("amenities").array(), // AC, TV, Mini Bar, etc.
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  totalRooms: integer("total_rooms").notNull(),
  description: text("description"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hotelRoomInventory = pgTable("hotel_room_inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").references(() => hotelRooms.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  availableRooms: integer("available_rooms").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  minimumStay: integer("minimum_stay").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueInventoryIdx: uniqueIndex("hotel_room_inventory_unique_idx").on(table.roomId, table.date),
}));

export const hotelBookings = pgTable("hotel_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  roomId: varchar("room_id").references(() => hotelRooms.id).notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  hotelName: text("hotel_name").notNull(),
  roomType: text("room_type").notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  numberOfNights: integer("number_of_nights").notNull(),
  numberOfRooms: integer("number_of_rooms").notNull().default(1),
  numberOfGuests: integer("number_of_guests").notNull(),
  guestDetails: jsonb("guest_details").notNull(), // {primaryGuest: {name, email, phone}, additionalGuests: [{name, age}]}
  roomPrice: decimal("room_price", { precision: 10, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  specialRequests: text("special_requests"),
  mealPlan: text("meal_plan").default("room_only"), // room_only, breakfast, half_board, full_board
  cancellationPolicySnapshot: jsonb("cancellation_policy_snapshot"), // Snapshot of policy at booking time
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed, no_show
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentId: varchar("stripe_payment_id").references(() => stripePayments.id),
  payAtHotel: integer("pay_at_hotel").default(0),
  cancellationCharge: decimal("cancellation_charge", { precision: 10, scale: 2 }),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundStatus: text("refund_status"), // pending, processed, failed
  checkInStatus: text("check_in_status").default("not_checked_in"), // not_checked_in, checked_in, checked_out
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hotelReviews = pgTable("hotel_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  bookingId: varchar("booking_id").references(() => hotelBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  overallRating: integer("overall_rating").notNull(), // 1-5
  cleanlinessRating: integer("cleanliness_rating"),
  serviceRating: integer("service_rating"),
  locationRating: integer("location_rating"),
  valueRating: integer("value_rating"),
  reviewText: text("review_text"),
  images: text("images").array(),
  isVerified: integer("is_verified").default(1), // Only from confirmed bookings
  isPublic: integer("is_public").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// INSERT SCHEMAS & TYPES
// ============================================================================

// Movie Booking Schemas
export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
}).extend({
  language: z.string().min(1, "Language is required"),
  rating: z.string().min(1, "Rating is required"),
  duration: z.coerce.number().positive("Duration must be positive"),
});

export const insertTheaterSchema = createInsertSchema(theaters).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Theater name is required"),
  city: z.string().min(1, "City is required"),
});

export const insertMovieShowtimeSchema = createInsertSchema(movieShowtimes).omit({
  id: true,
  createdAt: true,
}).extend({
  format: z.enum(["2D", "3D", "IMAX", "4DX"]),
  availableSeats: z.coerce.number().min(0),
  totalSeats: z.coerce.number().positive(),
});

export const insertSeatCategorySchema = createInsertSchema(seatCategories).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.coerce.number().positive("Price must be positive"),
  totalSeats: z.coerce.number().positive(),
  availableSeats: z.coerce.number().min(0),
});

export const insertSeatLayoutSchema = createInsertSchema(seatLayout).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["available", "booked", "blocked", "hold"]).default("available"),
});

export const insertSeatHoldSchema = createInsertSchema(seatHolds).omit({
  id: true,
  createdAt: true,
});

export const insertMovieBookingSchema = createInsertSchema(movieBookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  totalSeats: z.coerce.number().positive("Must have at least one seat"),
  ticketAmount: z.coerce.number().positive(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["confirmed", "cancelled", "used"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
});

export const insertFoodMenuItemSchema = createInsertSchema(foodMenuItems).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.coerce.number().positive("Price must be positive"),
  category: z.enum(["Combo", "Snacks", "Beverages"]),
});

// Event Booking Schemas
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
}).extend({
  category: z.enum(["Concert", "Sports", "Play", "Exhibition", "Conference"]),
  title: z.string().min(1, "Title is required"),
  venueName: z.string().min(1, "Venue name is required"),
});

export const insertEventTicketTierSchema = createInsertSchema(eventTicketTiers).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.coerce.number().positive("Price must be positive"),
  totalTickets: z.coerce.number().positive(),
  availableTickets: z.coerce.number().min(0),
});

export const insertEventTicketHoldSchema = createInsertSchema(eventTicketHolds).omit({
  id: true,
  createdAt: true,
}).extend({
  quantity: z.coerce.number().positive(),
});

export const insertEventBookingSchema = createInsertSchema(eventBookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  totalTickets: z.coerce.number().positive("Must have at least one ticket"),
  ticketAmount: z.coerce.number().positive(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["confirmed", "cancelled", "attended"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
});

export const insertEventMerchandiseSchema = createInsertSchema(eventMerchandise).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.enum(["T-Shirt", "Poster", "Album", "Cap", "Combo", "Other"]),
});

export const insertEventFoodBeverageSchema = createInsertSchema(eventFoodBeverages).omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.coerce.number().positive("Price must be positive"),
  category: z.enum(["Combo", "Snacks", "Beverages", "Meals"]),
});

// Hotel Booking Schemas
export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
}).extend({
  propertyType: z.enum(["Hotel", "Resort", "Villa", "Homestay", "Apartment"]),
  name: z.string().min(1, "Hotel name is required"),
  city: z.string().min(1, "City is required"),
});

export const insertHotelRoomSchema = createInsertSchema(hotelRooms).omit({
  id: true,
  createdAt: true,
}).extend({
  basePrice: z.coerce.number().positive("Price must be positive"),
  totalRooms: z.coerce.number().positive(),
  maxOccupancy: z.coerce.number().positive(),
});

export const insertHotelRoomInventorySchema = createInsertSchema(hotelRoomInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  availableRooms: z.coerce.number().min(0),
  price: z.coerce.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const insertHotelBookingSchema = createInsertSchema(hotelBookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  numberOfNights: z.coerce.number().positive(),
  numberOfRooms: z.coerce.number().positive(),
  numberOfGuests: z.coerce.number().positive(),
  roomPrice: z.coerce.number().positive(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["confirmed", "cancelled", "completed", "no_show"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  mealPlan: z.enum(["room_only", "breakfast", "half_board", "full_board"]).default("room_only"),
});

export const insertHotelReviewSchema = createInsertSchema(hotelReviews).omit({
  id: true,
  createdAt: true,
}).extend({
  overallRating: z.number().int().min(1).max(5),
});

// Types
export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Theater = typeof theaters.$inferSelect;
export type InsertTheater = z.infer<typeof insertTheaterSchema>;
export type MovieShowtime = typeof movieShowtimes.$inferSelect;
export type InsertMovieShowtime = z.infer<typeof insertMovieShowtimeSchema>;
export type SeatCategory = typeof seatCategories.$inferSelect;
export type InsertSeatCategory = z.infer<typeof insertSeatCategorySchema>;
export type SeatLayout = typeof seatLayout.$inferSelect;
export type InsertSeatLayout = z.infer<typeof insertSeatLayoutSchema>;
export type SeatHold = typeof seatHolds.$inferSelect;
export type InsertSeatHold = z.infer<typeof insertSeatHoldSchema>;
export type MovieBooking = typeof movieBookings.$inferSelect;
export type InsertMovieBooking = z.infer<typeof insertMovieBookingSchema>;
export type FoodMenuItem = typeof foodMenuItems.$inferSelect;
export type InsertFoodMenuItem = z.infer<typeof insertFoodMenuItemSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventTicketTier = typeof eventTicketTiers.$inferSelect;
export type InsertEventTicketTier = z.infer<typeof insertEventTicketTierSchema>;
export type EventTicketHold = typeof eventTicketHolds.$inferSelect;
export type InsertEventTicketHold = z.infer<typeof insertEventTicketHoldSchema>;
export type EventBooking = typeof eventBookings.$inferSelect;
export type InsertEventBooking = z.infer<typeof insertEventBookingSchema>;
export type EventMerchandise = typeof eventMerchandise.$inferSelect;
export type InsertEventMerchandise = z.infer<typeof insertEventMerchandiseSchema>;
export type EventFoodBeverage = typeof eventFoodBeverages.$inferSelect;
export type InsertEventFoodBeverage = z.infer<typeof insertEventFoodBeverageSchema>;

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type HotelRoom = typeof hotelRooms.$inferSelect;
export type InsertHotelRoom = z.infer<typeof insertHotelRoomSchema>;
export type HotelRoomInventory = typeof hotelRoomInventory.$inferSelect;
export type InsertHotelRoomInventory = z.infer<typeof insertHotelRoomInventorySchema>;
export type HotelBooking = typeof hotelBookings.$inferSelect;
export type InsertHotelBooking = z.infer<typeof insertHotelBookingSchema>;
export type HotelReview = typeof hotelReviews.$inferSelect;
export type InsertHotelReview = z.infer<typeof insertHotelReviewSchema>;

// ============================================================================
// METRO TICKET BOOKING SYSTEM
// ============================================================================

export const metroStations = pgTable("metro_stations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stationName: text("station_name").notNull(),
  stationCode: text("station_code").notNull().unique(),
  metroLine: text("metro_line").notNull(), // Red, Blue, Yellow, Green, etc.
  city: text("city").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  facilities: text("facilities").array(), // Parking, Elevator, Washroom, WiFi
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metroRoutes = pgTable("metro_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromStationId: varchar("from_station_id").references(() => metroStations.id).notNull(),
  toStationId: varchar("to_station_id").references(() => metroStations.id).notNull(),
  metroLine: text("metro_line").notNull(),
  distance: decimal("distance", { precision: 5, scale: 2 }).notNull(), // in km
  duration: integer("duration").notNull(), // in minutes
  intermediateStations: jsonb("intermediate_stations"), // [{stationId, stationName, arrivalTime}]
  fare: decimal("fare", { precision: 8, scale: 2 }).notNull(),
  peakHourFare: decimal("peak_hour_fare", { precision: 8, scale: 2 }),
  firstMetro: text("first_metro").notNull(), // 05:00
  lastMetro: text("last_metro").notNull(), // 23:00
  frequency: integer("frequency").default(5), // minutes between trains
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metroSmartCards = pgTable("metro_smart_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cardNumber: text("card_number").notNull().unique(),
  cardType: text("card_type").notNull(), // metro_card, tourist_card, student_card
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  city: text("city").notNull(),
  expiryDate: timestamp("expiry_date"),
  status: text("status").notNull().default("active"), // active, blocked, expired
  lastRechargeDate: timestamp("last_recharge_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metroTickets = pgTable("metro_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ticketReference: text("ticket_reference").notNull().unique(),
  ticketType: text("ticket_type").notNull(), // single_journey, return_journey, qr_ticket, smart_card_recharge
  fromStationId: varchar("from_station_id").references(() => metroStations.id),
  toStationId: varchar("to_station_id").references(() => metroStations.id),
  fromStationName: text("from_station_name"),
  toStationName: text("to_station_name"),
  metroLine: text("metro_line"),
  travelDate: timestamp("travel_date").notNull(),
  numberOfPassengers: integer("number_of_passengers").notNull().default(1),
  fare: decimal("fare", { precision: 8, scale: 2 }).notNull(),
  convenienceFee: decimal("convenience_fee", { precision: 5, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 8, scale: 2 }).notNull(),
  qrCode: text("qr_code"), // For digital ticket entry
  validUntil: timestamp("valid_until").notNull(),
  status: text("status").notNull().default("active"), // active, used, expired, cancelled
  usedAt: timestamp("used_at"),
  smartCardId: varchar("smart_card_id").references(() => metroSmartCards.id),
  rechargeAmount: decimal("recharge_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentId: varchar("stripe_payment_id").references(() => stripePayments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const metroTravelHistory = pgTable("metro_travel_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  ticketId: varchar("ticket_id").references(() => metroTickets.id),
  smartCardId: varchar("smart_card_id").references(() => metroSmartCards.id),
  entryStationId: varchar("entry_station_id").references(() => metroStations.id).notNull(),
  exitStationId: varchar("exit_station_id").references(() => metroStations.id),
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time"),
  fareDeducted: decimal("fare_deducted", { precision: 8, scale: 2 }).notNull(),
  distance: decimal("distance", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// RENTAL VEHICLE BOOKING SYSTEM (Cars & Bikes)
// ============================================================================

export const rentalVehicles = pgTable("rental_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleType: text("vehicle_type").notNull(), // car, bike, scooter
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  category: text("category").notNull(), // Sedan, SUV, Hatchback, Sport Bike, Cruiser, etc.
  fuelType: text("fuel_type").notNull(), // Petrol, Diesel, Electric, Hybrid
  transmission: text("transmission").notNull(), // Manual, Automatic
  seatingCapacity: integer("seating_capacity").notNull(),
  city: text("city").notNull(),
  registrationNumber: text("registration_number").notNull().unique(),
  color: text("color"),
  images: text("images").array(),
  features: text("features").array(), // GPS, Bluetooth, AC, USB Charger, etc.
  mileageLimit: integer("mileage_limit").default(150), // km per day
  extraMileageCharge: decimal("extra_mileage_charge", { precision: 5, scale: 2 }).default("8"), // per km
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  dailyRate: decimal("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: decimal("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: decimal("monthly_rate", { precision: 12, scale: 2 }),
  insuranceIncluded: integer("insurance_included").default(1),
  minimumAge: integer("minimum_age").default(21),
  licenseDuration: integer("license_duration").default(12), // months minimum
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.5"),
  totalBookings: integer("total_bookings").default(0),
  status: text("status").notNull().default("available"), // available, booked, maintenance, inactive
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rentalLocations = pgTable("rental_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  landmark: text("landmark"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  operatingHours: jsonb("operating_hours"), // {monday: {open: "09:00", close: "20:00"}, ...}
  contactPhone: text("contact_phone"),
  isPickupPoint: integer("is_pickup_point").default(1),
  isDropoffPoint: integer("is_dropoff_point").default(1),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rentalBookings = pgTable("rental_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => rentalVehicles.id).notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleName: text("vehicle_name").notNull(), // Brand + Model
  registrationNumber: text("registration_number").notNull(),
  rentalType: text("rental_type").notNull(), // hourly, daily, weekly, monthly
  pickupLocationId: varchar("pickup_location_id").references(() => rentalLocations.id).notNull(),
  dropoffLocationId: varchar("dropoff_location_id").references(() => rentalLocations.id).notNull(),
  pickupLocationName: text("pickup_location_name").notNull(),
  dropoffLocationName: text("dropoff_location_name").notNull(),
  pickupDateTime: timestamp("pickup_date_time").notNull(),
  dropoffDateTime: timestamp("dropoff_date_time").notNull(),
  duration: integer("duration").notNull(), // in hours
  rentalAmount: decimal("rental_amount", { precision: 10, scale: 2 }).notNull(),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }).notNull(),
  extraCharges: decimal("extra_charges", { precision: 8, scale: 2 }).default("0"), // Extra mileage, fuel, damages
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).default("0"),
  depositRefundStatus: text("deposit_refund_status").default("pending"), // pending, refunded, adjusted
  depositRefundAmount: decimal("deposit_refund_amount", { precision: 10, scale: 2 }),
  driverInfo: jsonb("driver_info").notNull(), // {name, licenseNumber, licenseExpiry, address, phone}
  licenseVerificationStatus: text("license_verification_status").default("pending"), // pending, verified, rejected
  licenseImages: text("license_images").array(),
  additionalDrivers: jsonb("additional_drivers"), // [{name, licenseNumber, licenseExpiry}]
  insuranceOption: text("insurance_option").default("basic"), // basic, comprehensive, premium
  insuranceAmount: decimal("insurance_amount", { precision: 8, scale: 2 }).default("0"),
  addons: jsonb("addons"), // [{name: "GPS", price: 100}, {name: "Child Seat", price: 50}]
  addonAmount: decimal("addon_amount", { precision: 8, scale: 2 }).default("0"),
  fuelLevel: text("fuel_level"), // Full, 3/4, Half, Quarter
  preInspectionImages: text("pre_inspection_images").array(),
  postInspectionImages: text("post_inspection_images").array(),
  preInspectionNotes: text("pre_inspection_notes"),
  postInspectionNotes: text("post_inspection_notes"),
  mileageStart: integer("mileage_start"),
  mileageEnd: integer("mileage_end"),
  totalMileage: integer("total_mileage"),
  extraMileageCharge: decimal("extra_mileage_charge", { precision: 8, scale: 2 }).default("0"),
  status: text("status").notNull().default("confirmed"), // confirmed, ongoing, completed, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, partial, refunded
  paymentMethod: text("payment_method"),
  fundTransactionId: varchar("fund_transaction_id").references(() => fundTransactions.id),
  stripePaymentId: varchar("stripe_payment_id").references(() => stripePayments.id),
  actualPickupTime: timestamp("actual_pickup_time"),
  actualDropoffTime: timestamp("actual_dropoff_time"),
  cancellationReason: text("cancellation_reason"),
  cancellationCharge: decimal("cancellation_charge", { precision: 8, scale: 2 }),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundStatus: text("refund_status"), // pending, processed, failed
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rentalReviews = pgTable("rental_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => rentalBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => rentalVehicles.id).notNull(),
  overallRating: integer("overall_rating").notNull(), // 1-5
  vehicleConditionRating: integer("vehicle_condition_rating"),
  cleanlinessRating: integer("cleanliness_rating"),
  serviceRating: integer("service_rating"),
  valueRating: integer("value_rating"),
  reviewText: text("review_text"),
  images: text("images").array(),
  isVerified: integer("is_verified").default(1),
  isPublic: integer("is_public").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rentalTrips = pgTable("rental_trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => rentalBookings.id).notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => rentalVehicles.id).notNull(),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed, cancelled
  digitalKeyStatus: text("digital_key_status").default("locked"), // locked, unlocked, disabled
  digitalKeyCode: text("digital_key_code"), // 6-digit code for keyless entry
  tripStartTime: timestamp("trip_start_time"),
  tripEndTime: timestamp("trip_end_time"),
  currentLatitude: text("current_latitude"),
  currentLongitude: text("current_longitude"),
  currentFuelLevel: integer("current_fuel_level"), // percentage 0-100
  currentMileage: integer("current_mileage"),
  distanceTraveled: decimal("distance_traveled", { precision: 8, scale: 2 }).default("0"), // in km
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  sosActivated: integer("sos_activated").default(0),
  sosTimestamp: timestamp("sos_timestamp"),
  sosLocation: jsonb("sos_location"), // {lat, lon, address}
  lastCheckpointTime: timestamp("last_checkpoint_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rentalTripCheckpoints = pgTable("rental_trip_checkpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").references(() => rentalTrips.id).notNull(),
  bookingId: varchar("booking_id").references(() => rentalBookings.id).notNull(),
  checkpointType: text("checkpoint_type").notNull(), // location_update, fuel_update, mileage_update, sos_alert, key_unlock, key_lock
  latitude: text("latitude"),
  longitude: text("longitude"),
  address: text("address"),
  fuelLevel: integer("fuel_level"), // percentage
  mileage: integer("mileage"),
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  notes: text("notes"),
  metadata: jsonb("metadata"), // additional data like weather, traffic, etc.
  timestamp: timestamp("timestamp").defaultNow(),
});

export const rentalDocuments = pgTable("rental_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => rentalBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // license_front, license_back, id_proof, selfie, additional_id
  documentUrl: text("document_url").notNull(),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verificationNotes: text("verification_notes"),
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  expiryDate: timestamp("expiry_date"),
  metadata: jsonb("metadata"), // extracted data like license number, name, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const rentalVehicleInspections = pgTable("rental_vehicle_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => rentalBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vehicleId: varchar("vehicle_id").references(() => rentalVehicles.id).notNull(),
  inspectionType: text("inspection_type").notNull(), // pre_trip, post_trip
  fuelLevel: text("fuel_level"), // Full, 3/4, Half, Quarter, Empty
  mileage: integer("mileage"),
  exteriorCondition: jsonb("exterior_condition"), // {front: "good", rear: "good", left: "scratch", right: "good"}
  interiorCondition: jsonb("interior_condition"), // {seats: "clean", dashboard: "good", floor: "clean"}
  tiresCondition: jsonb("tires_condition"), // {front_left: "good", front_right: "good", rear_left: "good", rear_right: "good"}
  documents: jsonb("documents"), // {rc: true, insurance: true, pollution: true}
  issues: text("issues").array(), // ["Scratch on left door", "Low windshield washer fluid"]
  images: text("images").array(),
  notes: text("notes"),
  signature: text("signature"), // base64 signature image
  location: jsonb("location"), // {lat, lon}
  inspectedAt: timestamp("inspected_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// INSERT SCHEMAS FOR METRO
// ============================================================================

export const insertMetroStationSchema = createInsertSchema(metroStations).omit({
  id: true,
  createdAt: true,
}).extend({
  stationName: z.string().min(1, "Station name is required"),
  stationCode: z.string().min(1, "Station code is required"),
  city: z.string().min(1, "City is required"),
});

export const insertMetroRouteSchema = createInsertSchema(metroRoutes).omit({
  id: true,
  createdAt: true,
}).extend({
  distance: z.coerce.number().positive(),
  duration: z.coerce.number().positive(),
  fare: z.coerce.number().positive(),
});

export const insertMetroSmartCardSchema = createInsertSchema(metroSmartCards).omit({
  id: true,
  createdAt: true,
}).extend({
  cardNumber: z.string().min(1, "Card number is required"),
  cardType: z.enum(["metro_card", "tourist_card", "student_card"]),
  status: z.enum(["active", "blocked", "expired"]).default("active"),
});

export const insertMetroTicketSchema = createInsertSchema(metroTickets).omit({
  id: true,
  ticketReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  ticketType: z.enum(["single_journey", "return_journey", "qr_ticket", "smart_card_recharge"]),
  numberOfPassengers: z.coerce.number().positive().default(1),
  fare: z.coerce.number().positive(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["active", "used", "expired", "cancelled"]).default("active"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
});

export const insertMetroTravelHistorySchema = createInsertSchema(metroTravelHistory).omit({
  id: true,
  createdAt: true,
}).extend({
  fareDeducted: z.coerce.number().positive(),
});

// ============================================================================
// INSERT SCHEMAS FOR RENTAL
// ============================================================================

export const insertRentalVehicleSchema = createInsertSchema(rentalVehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  vehicleType: z.enum(["car", "bike", "scooter"]),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"]),
  transmission: z.enum(["Manual", "Automatic"]),
  dailyRate: z.coerce.number().positive(),
  securityDeposit: z.coerce.number().positive(),
  seatingCapacity: z.coerce.number().positive(),
  status: z.enum(["available", "booked", "maintenance", "inactive"]).default("available"),
});

export const insertRentalLocationSchema = createInsertSchema(rentalLocations).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "Location name is required"),
  city: z.string().min(1, "City is required"),
});

export const insertRentalBookingSchema = createInsertSchema(rentalBookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rentalType: z.enum(["hourly", "daily", "weekly", "monthly"]),
  duration: z.coerce.number().positive(),
  rentalAmount: z.coerce.number().positive(),
  securityDeposit: z.coerce.number().positive(),
  totalAmount: z.coerce.number().positive(),
  status: z.enum(["confirmed", "ongoing", "completed", "cancelled"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "partial", "refunded"]).default("pending"),
  licenseVerificationStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  depositRefundStatus: z.enum(["pending", "refunded", "adjusted"]).default("pending"),
});

export const insertRentalReviewSchema = createInsertSchema(rentalReviews).omit({
  id: true,
  createdAt: true,
}).extend({
  overallRating: z.number().int().min(1).max(5),
});

export const insertRentalTripSchema = createInsertSchema(rentalTrips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["not_started", "in_progress", "completed", "cancelled"]).default("not_started"),
  digitalKeyStatus: z.enum(["locked", "unlocked", "disabled"]).default("locked"),
});

export const insertRentalTripCheckpointSchema = createInsertSchema(rentalTripCheckpoints).omit({
  id: true,
  timestamp: true,
}).extend({
  checkpointType: z.enum(["location_update", "fuel_update", "mileage_update", "sos_alert", "key_unlock", "key_lock"]),
});

export const insertRentalDocumentSchema = createInsertSchema(rentalDocuments).omit({
  id: true,
  createdAt: true,
}).extend({
  documentType: z.enum(["license_front", "license_back", "id_proof", "selfie", "additional_id"]),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
});

export const insertRentalVehicleInspectionSchema = createInsertSchema(rentalVehicleInspections).omit({
  id: true,
  createdAt: true,
  inspectedAt: true,
}).extend({
  inspectionType: z.enum(["pre_trip", "post_trip"]),
});

// ============================================================================
// TYPES FOR METRO
// ============================================================================

export type MetroStation = typeof metroStations.$inferSelect;
export type InsertMetroStation = z.infer<typeof insertMetroStationSchema>;
export type MetroRoute = typeof metroRoutes.$inferSelect;
export type InsertMetroRoute = z.infer<typeof insertMetroRouteSchema>;
export type MetroSmartCard = typeof metroSmartCards.$inferSelect;
export type InsertMetroSmartCard = z.infer<typeof insertMetroSmartCardSchema>;
export type MetroTicket = typeof metroTickets.$inferSelect;
export type InsertMetroTicket = z.infer<typeof insertMetroTicketSchema>;
export type MetroTravelHistory = typeof metroTravelHistory.$inferSelect;
export type InsertMetroTravelHistory = z.infer<typeof insertMetroTravelHistorySchema>;

// ============================================================================
// TYPES FOR RENTAL
// ============================================================================

export type RentalVehicle = typeof rentalVehicles.$inferSelect;
export type InsertRentalVehicle = z.infer<typeof insertRentalVehicleSchema>;
export type RentalLocation = typeof rentalLocations.$inferSelect;
export type InsertRentalLocation = z.infer<typeof insertRentalLocationSchema>;
export type RentalBooking = typeof rentalBookings.$inferSelect;
export type InsertRentalBooking = z.infer<typeof insertRentalBookingSchema>;
export type RentalReview = typeof rentalReviews.$inferSelect;
export type InsertRentalReview = z.infer<typeof insertRentalReviewSchema>;
export type RentalTrip = typeof rentalTrips.$inferSelect;
export type InsertRentalTrip = z.infer<typeof insertRentalTripSchema>;
export type RentalTripCheckpoint = typeof rentalTripCheckpoints.$inferSelect;
export type InsertRentalTripCheckpoint = z.infer<typeof insertRentalTripCheckpointSchema>;
export type RentalDocument = typeof rentalDocuments.$inferSelect;
export type InsertRentalDocument = z.infer<typeof insertRentalDocumentSchema>;
export type RentalVehicleInspection = typeof rentalVehicleInspections.$inferSelect;
export type InsertRentalVehicleInspection = z.infer<typeof insertRentalVehicleInspectionSchema>;

// ============================================================================
// CAB BOOKING TABLES (UBER-STYLE)
// ============================================================================

export const cabDrivers = pgTable("cab_drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  photo: text("photo"),
  age: integer("age"),
  gender: text("gender"),
  licenseNumber: text("license_number").notNull().unique(),
  licenseExpiry: timestamp("license_expiry"),
  
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalRides: integer("total_rides").default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("100.00"),
  acceptanceRate: decimal("acceptance_rate", { precision: 5, scale: 2 }).default("100.00"),
  
  status: text("status").notNull().default("active"), // active, offline, on_ride, suspended
  isVerified: integer("is_verified").default(0),
  isOnline: integer("is_online").default(0),
  
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("last_location_update"),
  
  badges: text("badges").array().default(sql`ARRAY[]::text[]`),
  languages: text("languages").array().default(sql`ARRAY[]::text[]`),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cabVehicles = pgTable("cab_vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => cabDrivers.id).notNull(),
  
  vehicleType: text("vehicle_type").notNull(), // auto, bike, mini, sedan, suv, luxury
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  
  capacity: integer("capacity").notNull(),
  acAvailable: integer("ac_available").default(1),
  features: jsonb("features"),
  
  registrationNumber: text("registration_number").notNull(),
  registrationExpiry: timestamp("registration_expiry"),
  insuranceExpiry: timestamp("insurance_expiry"),
  lastServiceDate: timestamp("last_service_date"),
  
  isActive: integer("is_active").default(1),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cabLocations = pgTable("cab_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  area: text("area"),
  city: text("city").notNull().default("Delhi"),
  state: text("state").notNull().default("Delhi"),
  country: text("country").notNull().default("India"),
  
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  
  placeType: text("place_type"), // airport, railway_station, metro_station, landmark, residential, commercial
  isPopular: integer("is_popular").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const cabBookings = pgTable("cab_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  driverId: varchar("driver_id").references(() => cabDrivers.id),
  vehicleId: varchar("vehicle_id").references(() => cabVehicles.id),
  
  bookingNumber: text("booking_number").notNull().unique(),
  
  pickupLocationId: varchar("pickup_location_id").references(() => cabLocations.id),
  dropLocationId: varchar("drop_location_id").references(() => cabLocations.id),
  pickupAddress: text("pickup_address").notNull(),
  dropAddress: text("drop_address").notNull(),
  pickupLatitude: decimal("pickup_latitude", { precision: 10, scale: 8 }).notNull(),
  pickupLongitude: decimal("pickup_longitude", { precision: 11, scale: 8 }).notNull(),
  dropLatitude: decimal("drop_latitude", { precision: 10, scale: 8 }).notNull(),
  dropLongitude: decimal("drop_longitude", { precision: 11, scale: 8 }).notNull(),
  
  vehicleType: text("vehicle_type").notNull(),
  rideType: text("ride_type").notNull().default("now"), // now, scheduled
  scheduledAt: timestamp("scheduled_at"),
  
  estimatedDistance: decimal("estimated_distance", { precision: 8, scale: 2 }), // in km
  estimatedDuration: integer("estimated_duration"), // in minutes
  estimatedFare: decimal("estimated_fare", { precision: 10, scale: 2 }).notNull(),
  
  actualDistance: decimal("actual_distance", { precision: 8, scale: 2 }),
  actualDuration: integer("actual_duration"),
  baseFare: decimal("base_fare", { precision: 10, scale: 2 }),
  distanceFare: decimal("distance_fare", { precision: 10, scale: 2 }),
  timeFare: decimal("time_fare", { precision: 10, scale: 2 }),
  surgeMultiplier: decimal("surge_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  gst: decimal("gst", { precision: 10, scale: 2 }),
  totalFare: decimal("total_fare", { precision: 10, scale: 2 }),
  
  paymentMethod: text("payment_method"), // cash, upi, card, wallet
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
  
  status: text("status").notNull().default("searching"), // searching, driver_assigned, driver_arriving, arrived, ongoing, completed, cancelled
  
  driverAssignedAt: timestamp("driver_assigned_at"),
  driverArrivedAt: timestamp("driver_arrived_at"),
  rideStartedAt: timestamp("ride_started_at"),
  rideCompletedAt: timestamp("ride_completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancelledBy: text("cancelled_by"), // user, driver, system
  cancellationReason: text("cancellation_reason"),
  
  specialRequests: text("special_requests"),
  
  sharingEnabled: integer("sharing_enabled").default(0),
  sosTriggered: integer("sos_triggered").default(0),
  emergencyContacts: jsonb("emergency_contacts"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const driverReviews = pgTable("driver_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => cabBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  driverId: varchar("driver_id").references(() => cabDrivers.id).notNull(),
  
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  
  drivingRating: integer("driving_rating"), // 1-5
  vehicleConditionRating: integer("vehicle_condition_rating"), // 1-5
  behaviourRating: integer("behaviour_rating"), // 1-5
  
  tags: text("tags").array().default(sql`ARRAY[]::text[]`), // clean_vehicle, polite, safe_driving, on_time, etc.
  
  isPublic: integer("is_public").default(1),
  isVerified: integer("is_verified").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const cabRideTracking = pgTable("cab_ride_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => cabBookings.id).notNull(),
  
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  speed: decimal("speed", { precision: 5, scale: 2 }), // in km/h
  heading: decimal("heading", { precision: 5, scale: 2 }), // compass direction 0-360
  
  eventType: text("event_type"), // location_update, pickup_reached, ride_started, waypoint, destination_reached
  
  timestamp: timestamp("timestamp").defaultNow(),
});

// CAB BOOKING INSERT SCHEMAS

export const insertCabDriverSchema = createInsertSchema(cabDrivers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalRides: true,
  totalEarnings: true,
  totalReviews: true,
  rating: true,
});

export const insertCabVehicleSchema = createInsertSchema(cabVehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCabLocationSchema = createInsertSchema(cabLocations).omit({
  id: true,
  createdAt: true,
});

export const insertCabBookingSchema = createInsertSchema(cabBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  bookingNumber: true,
});

export const insertDriverReviewSchema = createInsertSchema(driverReviews).omit({
  id: true,
  createdAt: true,
});

export const insertCabRideTrackingSchema = createInsertSchema(cabRideTracking).omit({
  id: true,
  timestamp: true,
});

// CAB BOOKING TYPES

export type CabDriver = typeof cabDrivers.$inferSelect;
export type InsertCabDriver = z.infer<typeof insertCabDriverSchema>;
export type CabVehicle = typeof cabVehicles.$inferSelect;
export type InsertCabVehicle = z.infer<typeof insertCabVehicleSchema>;
export type CabLocation = typeof cabLocations.$inferSelect;
export type InsertCabLocation = z.infer<typeof insertCabLocationSchema>;
export type CabBooking = typeof cabBookings.$inferSelect;
export type InsertCabBooking = z.infer<typeof insertCabBookingSchema>;
export type DriverReview = typeof driverReviews.$inferSelect;
export type InsertDriverReview = z.infer<typeof insertDriverReviewSchema>;
export type CabRideTracking = typeof cabRideTracking.$inferSelect;
export type InsertCabRideTracking = z.infer<typeof insertCabRideTrackingSchema>;

// CAB BOOKING VALIDATION SCHEMAS

export const cabBookingRequestSchema = z.object({
  pickupAddress: z.string().min(5),
  dropAddress: z.string().min(5),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
  dropLatitude: z.number(),
  dropLongitude: z.number(),
  vehicleType: z.enum(["auto", "bike", "mini", "sedan", "suv", "luxury"]),
  rideType: z.enum(["now", "scheduled"]).default("now"),
  scheduledAt: z.string().datetime().optional(),
  paymentMethod: z.enum(["cash", "upi", "card", "wallet"]),
  specialRequests: z.string().optional(),
});

export const driverReviewSubmissionSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  drivingRating: z.number().min(1).max(5).optional(),
  vehicleConditionRating: z.number().min(1).max(5).optional(),
  behaviourRating: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

// ============================================================================
// KYC APPLICATION TABLES
// ============================================================================

export const kycApplications = pgTable("kyc_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  applicationNumber: text("application_number").notNull().unique(),
  applicationType: text("application_type").notNull(), // 'full_kyc', 'basic_kyc', 'upgrade_kyc'
  status: text("status").notNull().default("pending"), // 'pending', 'documents_uploaded', 'under_review', 'approved', 'rejected', 'additional_info_required'
  currentStage: integer("current_stage").default(0), // Stage tracker for multi-step process
  totalStages: integer("total_stages").default(5),
  completedStages: jsonb("completed_stages").default('[]'),
  
  // Personal Information
  fullName: text("full_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  fatherName: text("father_name"),
  motherName: text("mother_name"),
  maritalStatus: text("marital_status"),
  nationality: text("nationality").default("Indian"),
  
  // Contact Information
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  alternatePhone: text("alternate_phone"),
  
  // Address Information
  currentAddress: text("current_address").notNull(),
  currentCity: text("current_city").notNull(),
  currentState: text("current_state").notNull(),
  currentPincode: text("current_pincode").notNull(),
  currentAddressType: text("current_address_type"), // 'owned', 'rented', 'family_owned', 'company_provided'
  currentAddressDuration: text("current_address_duration"), // Duration at current address in months
  
  permanentAddress: text("permanent_address"),
  permanentCity: text("permanent_city"),
  permanentState: text("permanent_state"),
  permanentPincode: text("permanent_pincode"),
  addressSameAsCurrent: integer("address_same_as_current").default(0),
  
  // Identity Documents
  panNumber: text("pan_number").notNull(),
  panName: text("pan_name"), // Name as per PAN
  panVerified: integer("pan_verified").default(0),
  panVerifiedAt: timestamp("pan_verified_at"),
  
  aadharNumber: text("aadhar_number"),
  aadharName: text("aadhar_name"), // Name as per Aadhar
  aadharVerified: integer("aadhar_verified").default(0),
  aadharVerifiedAt: timestamp("aadhar_verified_at"),
  aadharMasked: text("aadhar_masked"), // Last 4 digits for display
  
  // Additional Documents
  passportNumber: text("passport_number"),
  drivingLicenseNumber: text("driving_license_number"),
  voterIdNumber: text("voter_id_number"),
  
  // Financial Information
  occupation: text("occupation"),
  employmentType: text("employment_type"), // 'salaried', 'self_employed', 'business', 'retired', 'student'
  companyName: text("company_name"),
  monthlyIncome: text("monthly_income"),
  annualIncome: text("annual_income"),
  sourceOfIncome: text("source_of_income").array(),
  
  // Bank Account Information
  primaryBankName: text("primary_bank_name"),
  primaryAccountNumber: text("primary_account_number"),
  primaryIfscCode: text("primary_ifsc_code"),
  primaryAccountType: text("primary_account_type"), // 'savings', 'current'
  bankAccountVerified: integer("bank_account_verified").default(0),
  
  // KYC Level & Purpose
  kycLevel: text("kyc_level").default("basic"), // 'basic', 'intermediate', 'full'
  purpose: text("purpose").array(), // ['investment', 'loans', 'payments', 'trading']
  
  // Verification Details
  ipinVerified: integer("ipin_verified").default(0),
  videoCipher: integer("video_cipher_completed").default(0),
  livenessCheck: integer("liveness_check_completed").default(0),
  
  // Review & Approval
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  additionalInfoRequired: text("additional_info_required"),
  
  // Metadata
  applicationSource: text("application_source").default("app"), // 'app', 'web', 'agent_assisted'
  referenceNumber: text("reference_number"),
  expiryDate: timestamp("expiry_date"), // KYC validity expiry
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const kycDocuments = pgTable("kyc_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => kycApplications.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // 'pan_card', 'aadhar_front', 'aadhar_back', 'photo', 'signature', 'address_proof', 'income_proof', 'bank_statement'
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url").notNull(),
  documentSize: integer("document_size"), // in bytes
  documentFormat: text("document_format"), // 'pdf', 'jpg', 'png'
  isVerified: integer("is_verified").default(0),
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),
  ocrData: jsonb("ocr_data"), // Extracted data from document
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kycVerificationHistory = pgTable("kyc_verification_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").references(() => kycApplications.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  verificationStep: text("verification_step").notNull(), // 'document_upload', 'pan_verification', 'aadhar_verification', 'bank_verification', 'video_kyc', 'final_approval'
  status: text("status").notNull(), // 'success', 'failed', 'pending', 'skipped'
  attemptNumber: integer("attempt_number").default(1),
  verificationData: jsonb("verification_data"),
  verificationResponse: jsonb("verification_response"),
  errorMessage: text("error_message"),
  verifiedBy: varchar("verified_by"), // System or admin user ID
  verifiedAt: timestamp("verified_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// KYC Insert Schemas
export const insertKycApplicationSchema = createInsertSchema(kycApplications).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
  approvedAt: true,
  applicationNumber: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  createdAt: true,
  uploadedAt: true,
  verifiedAt: true,
});

export const insertKycVerificationHistorySchema = createInsertSchema(kycVerificationHistory).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
});

// KYC Types
export type KycApplication = typeof kycApplications.$inferSelect;
export type InsertKycApplication = z.infer<typeof insertKycApplicationSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type KycVerificationHistory = typeof kycVerificationHistory.$inferSelect;
export type InsertKycVerificationHistory = z.infer<typeof insertKycVerificationHistorySchema>;

// KYC Application Request Schema
export const kycApplicationRequestSchema = z.object({
  applicationType: z.enum(['full_kyc', 'basic_kyc', 'upgrade_kyc']),
  fullName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  currentAddress: z.string().min(10),
  currentCity: z.string(),
  currentState: z.string(),
  currentPincode: z.string().length(6),
  panNumber: z.string().length(10),
  occupation: z.string().optional(),
  monthlyIncome: z.string().optional(),
  purpose: z.array(z.string()).optional(),
});

// TravelVIP Premium Membership Tables
export const travelVipMemberships = pgTable("travel_vip_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").notNull(), // 'monthly', 'quarterly', 'annual'
  status: text("status").notNull().default("active"), // 'active', 'expired', 'cancelled'
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  autoRenewal: integer("auto_renewal").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const travelVipBenefitsUsage = pgTable("travel_vip_benefits_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  membershipId: varchar("membership_id").references(() => travelVipMemberships.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  benefitType: text("benefit_type").notNull(), // 'flight', 'train', 'bus', 'hotel', 'car_rental', 'cab', 'metro', 'event', 'movie'
  benefitCategory: text("benefit_category").notNull(), // 'discount', 'lounge_access', 'priority_boarding', 'insurance', etc.
  bookingId: text("booking_id"),
  savingsAmount: decimal("savings_amount", { precision: 10, scale: 2 }).default("0"),
  usedAt: timestamp("used_at").defaultNow(),
  metadata: jsonb("metadata"), // Additional benefit details
});

export const travelVipTransactions = pgTable("travel_vip_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  membershipId: varchar("membership_id").references(() => travelVipMemberships.id),
  transactionType: text("transaction_type").notNull(), // 'subscription', 'renewal', 'refund'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("success"), // 'success', 'failed', 'pending', 'refunded'
  paymentMethod: text("payment_method"), // 'upi', 'card', 'netbanking'
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// TravelVIP Insert Schemas
export const insertTravelVipMembershipSchema = createInsertSchema(travelVipMemberships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTravelVipBenefitsUsageSchema = createInsertSchema(travelVipBenefitsUsage).omit({
  id: true,
  usedAt: true,
});

export const insertTravelVipTransactionSchema = createInsertSchema(travelVipTransactions).omit({
  id: true,
  createdAt: true,
});

// TravelVIP Types
export type TravelVipMembership = typeof travelVipMemberships.$inferSelect;
export type InsertTravelVipMembership = z.infer<typeof insertTravelVipMembershipSchema>;
export type TravelVipBenefitsUsage = typeof travelVipBenefitsUsage.$inferSelect;
export type InsertTravelVipBenefitsUsage = z.infer<typeof insertTravelVipBenefitsUsageSchema>;
export type TravelVipTransaction = typeof travelVipTransactions.$inferSelect;
export type InsertTravelVipTransaction = z.infer<typeof insertTravelVipTransactionSchema>;

// TravelVIP Subscription Request Schema
export const travelVipSubscriptionSchema = z.object({
  planType: z.enum(['monthly', 'quarterly', 'annual']),
  autoRenewal: z.boolean().optional().default(true),
});

// Trip Now - End-to-end trip packages
export const tripPackages = pgTable("trip_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  travelers: jsonb("travelers").notNull(), // { adults: number, children: { age: number }[] }
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  timezone: text("timezone").default("Asia/Kolkata"),
  status: text("status").notNull().default("draft"), // 'draft', 'confirmed', 'paid', 'cancelled', 'completed'
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 10, scale: 2 }).default("0"),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  discounts: decimal("discounts", { precision: 10, scale: 2 }).default("0"),
  addonsTotal: decimal("addons_total", { precision: 10, scale: 2 }).default("0"),
  totalPayable: decimal("total_payable", { precision: 12, scale: 2 }).notNull(),
  travelPolicy: text("travel_policy"), // VIP tier or policy reference
  metadata: jsonb("metadata"), // Additional package details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tripComponents = pgTable("trip_components", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").references(() => tripPackages.id).notNull(),
  componentType: text("component_type").notNull(), // 'flight', 'hotel', 'transfer', 'activity', 'airport_service'
  componentData: jsonb("component_data").notNull(), // Type-specific data
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time"),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  provider: text("provider"),
  bookingStatus: text("booking_status").default("pending"), // 'pending', 'confirmed', 'cancelled'
  bookingReference: text("booking_reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tripTimeline = pgTable("trip_timeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").references(() => tripPackages.id).notNull(),
  componentId: varchar("component_id").references(() => tripComponents.id),
  day: integer("day").notNull(), // Day number in the trip (1, 2, 3...)
  sortOrder: integer("sort_order").notNull(), // Order within the day
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time"), // Time in HH:mm format
  endTime: text("end_time"),
  location: text("location"),
  icon: text("icon"), // Icon identifier for UI
  createdAt: timestamp("created_at").defaultNow(),
});

export const tripAddons = pgTable("trip_addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").references(() => tripPackages.id).notNull(),
  addonType: text("addon_type").notNull(), // 'child_seat', 'stroller', 'sim_card', 'lounge_access', 'insurance', 'porter'
  addonName: text("addon_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  componentId: varchar("component_id").references(() => tripComponents.id), // Optional link to specific component
  createdAt: timestamp("created_at").defaultNow(),
});

export const tripModifications = pgTable("trip_modifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").references(() => tripPackages.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  modificationType: text("modification_type").notNull(), // 'swap_activity', 'add_transfer', 'upgrade_seats', 'change_hotel', etc.
  componentId: varchar("component_id").references(() => tripComponents.id),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  priceDifference: decimal("price_difference", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trip Now Insert Schemas
export const insertTripPackageSchema = createInsertSchema(tripPackages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTripComponentSchema = createInsertSchema(tripComponents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTripTimelineSchema = createInsertSchema(tripTimeline).omit({
  id: true,
  createdAt: true,
});

export const insertTripAddonSchema = createInsertSchema(tripAddons).omit({
  id: true,
  createdAt: true,
});

export const insertTripModificationSchema = createInsertSchema(tripModifications).omit({
  id: true,
  createdAt: true,
});

// Trip Now Types
export type TripPackage = typeof tripPackages.$inferSelect;
export type InsertTripPackage = z.infer<typeof insertTripPackageSchema>;
export type TripComponent = typeof tripComponents.$inferSelect;
export type InsertTripComponent = z.infer<typeof insertTripComponentSchema>;
export type TripTimeline = typeof tripTimeline.$inferSelect;
export type InsertTripTimeline = z.infer<typeof insertTripTimelineSchema>;
export type TripAddon = typeof tripAddons.$inferSelect;
export type InsertTripAddon = z.infer<typeof insertTripAddonSchema>;
export type TripModification = typeof tripModifications.$inferSelect;
export type InsertTripModification = z.infer<typeof insertTripModificationSchema>;

// Trip Now Request Schemas
export const createTripPackageSchema = z.object({
  name: z.string().min(1),
  travelers: z.object({
    adults: z.number().min(1),
    children: z.array(z.object({ age: z.number().min(0).max(17) })).optional(),
  }),
  startDate: z.string(),
  endDate: z.string(),
  destinations: z.array(z.string()).min(1),
  travelGoal: z.enum(['family', 'relaxation', 'adventure', 'business', 'custom']).optional(),
});

export const tripComponentDataSchemas = {
  flight: z.object({
    airline: z.string(),
    flightNo: z.string(),
    from: z.string(),
    to: z.string(),
    depTime: z.string(),
    arrTime: z.string(),
    cabin: z.string().optional(),
    fareClass: z.string().optional(),
    refundable: z.boolean().optional(),
  }),
  hotel: z.object({
    name: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    star: z.number().optional(),
    roomType: z.string().optional(),
    breakfastIncluded: z.boolean().optional(),
    pax: z.number(),
  }),
  transfer: z.object({
    type: z.enum(['private', 'shared']),
    pickupPoint: z.string(),
    dropPoint: z.string(),
    vehicle: z.string().optional(),
    pax: z.number(),
    provider: z.string().optional(),
  }),
  activity: z.object({
    title: z.string(),
    date: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    duration: z.string().optional(),
    pickupIncluded: z.boolean().optional(),
    ageSuitability: z.string().optional(),
  }),
  airport_service: z.object({
    serviceType: z.enum(['lounge', 'meet_greet', 'fast_track', 'baggage_insurance', 'porter']),
    airport: z.string(),
    terminal: z.string().optional(),
    pax: z.number().optional(),
  }),
};

// Credit UPI System Tables
export const creditUpiAccounts = pgTable("credit_upi_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  upiId: text("upi_id").notNull().unique(),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).notNull().default("0"),
  availableLimit: decimal("available_limit", { precision: 12, scale: 2 }).notNull().default("0"),
  usedLimit: decimal("used_limit", { precision: 12, scale: 2 }).notNull().default("0"),
  outstandingAmount: decimal("outstanding_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull().default("24.00"),
  annualFee: decimal("annual_fee", { precision: 10, scale: 2 }).default("499"),
  processingFee: decimal("processing_fee", { precision: 5, scale: 2 }).default("1.5"),
  latePaymentPenalty: decimal("late_payment_penalty", { precision: 5, scale: 2 }).default("3.0"),
  billingDate: integer("billing_date").default(1),
  dueDate: integer("due_date").default(16),
  upiPin: text("upi_pin"),
  status: text("status").notNull().default("active"),
  isActivated: integer("is_activated").default(0),
  activatedAt: timestamp("activated_at"),
  lastBillingDate: timestamp("last_billing_date"),
  nextBillingDate: timestamp("next_billing_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userUniqueIdx: uniqueIndex("credit_upi_accounts_user_unique_idx").on(table.userId),
}));

export const creditUpiTransactions = pgTable("credit_upi_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").references(() => creditUpiAccounts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionType: text("transaction_type").notNull().default("payment"),
  merchantName: text("merchant_name").notNull(),
  merchantUpi: text("merchant_upi"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("success"),
  transactionId: text("transaction_id").notNull().unique(),
  description: text("description"),
  category: text("category").default("shopping"),
  emiConverted: integer("emi_converted").default(0),
  emiMonths: integer("emi_months"),
  balanceBefore: decimal("balance_before", { precision: 12, scale: 2 }),
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  accountIdx: index("credit_upi_transactions_account_idx").on(table.accountId),
  userIdx: index("credit_upi_transactions_user_idx").on(table.userId),
}));

export const creditUpiRepayments = pgTable("credit_upi_repayments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").references(() => creditUpiAccounts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  repaymentType: text("repayment_type").notNull().default("full"),
  paymentMethod: text("payment_method").default("upi"),
  transactionId: text("transaction_id").notNull().unique(),
  billId: varchar("bill_id").references(() => creditUpiBills.id),
  status: text("status").notNull().default("success"),
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }).default("0"),
  interestAmount: decimal("interest_amount", { precision: 12, scale: 2 }).default("0"),
  latePaymentCharges: decimal("late_payment_charges", { precision: 12, scale: 2 }).default("0"),
  description: text("description"),
  processedAt: timestamp("processed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  accountIdx: index("credit_upi_repayments_account_idx").on(table.accountId),
  userIdx: index("credit_upi_repayments_user_idx").on(table.userId),
}));

export const creditUpiBills = pgTable("credit_upi_bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").references(() => creditUpiAccounts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  billNumber: text("bill_number").notNull().unique(),
  billingPeriod: text("billing_period").notNull(),
  billDate: timestamp("bill_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }).notNull(),
  interestAmount: decimal("interest_amount", { precision: 12, scale: 2 }).default("0"),
  latePaymentCharges: decimal("late_payment_charges", { precision: 12, scale: 2 }).default("0"),
  minimumDue: decimal("minimum_due", { precision: 12, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 12, scale: 2 }).default("0"),
  outstandingAmount: decimal("outstanding_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("unpaid"),
  isPaid: integer("is_paid").default(0),
  paidAt: timestamp("paid_at"),
  transactionCount: integer("transaction_count").default(0),
  gracePeriodDays: integer("grace_period_days").default(15),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  accountIdx: index("credit_upi_bills_account_idx").on(table.accountId),
  userIdx: index("credit_upi_bills_user_idx").on(table.userId),
}));

// Insert schemas for Credit UPI
export const insertCreditUpiAccountSchema = createInsertSchema(creditUpiAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditUpiTransactionSchema = createInsertSchema(creditUpiTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertCreditUpiRepaymentSchema = createInsertSchema(creditUpiRepayments).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertCreditUpiBillSchema = createInsertSchema(creditUpiBills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Select types for Credit UPI
export type CreditUpiAccount = typeof creditUpiAccounts.$inferSelect;
export type CreditUpiTransaction = typeof creditUpiTransactions.$inferSelect;
export type CreditUpiRepayment = typeof creditUpiRepayments.$inferSelect;
export type CreditUpiBill = typeof creditUpiBills.$inferSelect;

export type InsertCreditUpiAccount = z.infer<typeof insertCreditUpiAccountSchema>;
export type InsertCreditUpiTransaction = z.infer<typeof insertCreditUpiTransactionSchema>;
export type InsertCreditUpiRepayment = z.infer<typeof insertCreditUpiRepaymentSchema>;
export type InsertCreditUpiBill = z.infer<typeof insertCreditUpiBillSchema>;

// Credit UPI validation schemas
export const creditUpiActivationSchema = z.object({
  upiPin: z.string().length(6),
});

export const creditUpiPaymentSchema = z.object({
  merchantName: z.string().min(1),
  merchantUpi: z.string().optional(),
  amount: z.number().positive(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const creditUpiRepaymentSchema = z.object({
  amount: z.number().positive(),
  repaymentType: z.enum(['full', 'minimum', 'partial', 'emi']),
  paymentMethod: z.string().default('upi'),
});

// Cash Park Tables
export const cashParkAccounts = pgTable("cash_park_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  isActive: integer("is_active").default(0),
  sweepThreshold: decimal("sweep_threshold", { precision: 15, scale: 2 }),
  fdIncrementAmount: decimal("fd_increment_amount", { precision: 15, scale: 2 }),
  currentInterestRate: decimal("current_interest_rate", { precision: 5, scale: 2 }).default("7.25"),
  totalParkedAmount: decimal("total_parked_amount", { precision: 15, scale: 2 }).default("0"),
  totalInterestEarned: decimal("total_interest_earned", { precision: 15, scale: 2 }).default("0"),
  totalJarBalance: decimal("total_jar_balance", { precision: 15, scale: 2 }).default("0"),
  activeFdCount: integer("active_fd_count").default(0),
  lastSweepDate: timestamp("last_sweep_date"),
  lastManualTransfer: timestamp("last_manual_transfer"),
  minimumTenureDays: integer("minimum_tenure_days").default(7),
  autoSweepEnabled: integer("auto_sweep_enabled").default(0),
  notificationsEnabled: integer("notifications_enabled").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userUniqueIdx: uniqueIndex("cash_park_account_user_unique_idx").on(table.userId),
}));

export const cashParkJars = pgTable("cash_park_jars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  accountId: varchar("account_id").references(() => cashParkAccounts.id),
  name: text("name").notNull(),
  goalAmount: decimal("goal_amount", { precision: 15, scale: 2 }),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).default("0"),
  color: text("color"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userNameUniqueIdx: uniqueIndex("cash_park_jar_user_name_unique_idx").on(table.userId, table.name),
  userIdx: index("cash_park_jars_user_idx").on(table.userId),
}));

export const cashParkFdUnits = pgTable("cash_park_fd_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").references(() => cashParkAccounts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jarId: varchar("jar_id").references(() => cashParkJars.id),
  fdNumber: text("fd_number").notNull().unique(),
  principalAmount: decimal("principal_amount", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).notNull(),
  accruedInterest: decimal("accrued_interest", { precision: 15, scale: 2 }).default("0"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  tenureDays: integer("tenure_days").default(365),
  creationDate: timestamp("creation_date").notNull().defaultNow(),
  maturityDate: timestamp("maturity_date").notNull(),
  status: text("status").notNull().default("legacy"),
  isBroken: integer("is_broken").default(0),
  brokenDate: timestamp("broken_date"),
  actualInterestEarned: decimal("actual_interest_earned", { precision: 12, scale: 2 }).default("0"),
  penaltyAmount: decimal("penalty_amount", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  accountIdx: index("cash_park_fd_units_account_idx").on(table.accountId),
  userIdx: index("cash_park_fd_units_user_idx").on(table.userId),
  statusIdx: index("cash_park_fd_units_status_idx").on(table.status),
}));

export const cashParkTransactions = pgTable("cash_park_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").references(() => cashParkAccounts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jarId: varchar("jar_id").references(() => cashParkJars.id),
  transactionType: text("transaction_type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  fdUnitId: varchar("fd_unit_id").references(() => cashParkFdUnits.id),
  postBalance: decimal("post_balance", { precision: 15, scale: 2 }).notNull(),
  mainAccountDelta: decimal("main_account_delta", { precision: 15, scale: 2 }),
  description: text("description"),
  sweepMethod: text("sweep_method"),
  interestEarned: decimal("interest_earned", { precision: 12, scale: 2 }).default("0"),
  transactionId: text("transaction_id"),
  status: text("status").notNull().default("success"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  accountIdx: index("cash_park_transactions_account_idx").on(table.accountId),
  userIdx: index("cash_park_transactions_user_idx").on(table.userId),
  jarIdx: index("cash_park_transactions_jar_idx").on(table.jarId),
  typeIdx: index("cash_park_transactions_type_idx").on(table.transactionType),
}));

// Insert schemas for Cash Park
export const insertCashParkAccountSchema = createInsertSchema(cashParkAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCashParkJarSchema = createInsertSchema(cashParkJars).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCashParkFdUnitSchema = createInsertSchema(cashParkFdUnits).omit({
  id: true,
  createdAt: true,
  fdNumber: true,
});

export const insertCashParkTransactionSchema = createInsertSchema(cashParkTransactions).omit({
  id: true,
  createdAt: true,
});

// Select types for Cash Park
export type CashParkAccount = typeof cashParkAccounts.$inferSelect;
export type CashParkJar = typeof cashParkJars.$inferSelect;
export type CashParkFdUnit = typeof cashParkFdUnits.$inferSelect;
export type CashParkTransaction = typeof cashParkTransactions.$inferSelect;

export type InsertCashParkAccount = z.infer<typeof insertCashParkAccountSchema>;
export type InsertCashParkJar = z.infer<typeof insertCashParkJarSchema>;
export type InsertCashParkFdUnit = z.infer<typeof insertCashParkFdUnitSchema>;
export type InsertCashParkTransaction = z.infer<typeof insertCashParkTransactionSchema>;

// Cash Park validation schemas
export const cashParkActivationSchema = z.object({
  initialJarName: z.string().min(1).max(50).default("My Savings"),
});

export const cashParkJarCreateSchema = z.object({
  name: z.string().min(1).max(50),
  goalAmount: z.number().positive().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const cashParkDepositSchema = z.object({
  jarId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.string().default('upi'),
  description: z.string().optional(),
});

export const cashParkWithdrawSchema = z.object({
  jarId: z.string().uuid(),
  amount: z.number().positive(),
  withdrawalMethod: z.string().default('upi'),
  description: z.string().optional(),
});

// News tables
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  sourceUrl: text("source_url"),
  sourceName: text("source_name").notNull(),
  postedBy: text("posted_by").notNull(),
  ticker: text("ticker"),
  percentageChange: decimal("percentage_change", { precision: 5, scale: 2 }),
  isLive: integer("is_live").default(0),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("news_articles_category_idx").on(table.category),
  publishedIdx: index("news_articles_published_idx").on(table.publishedAt),
}));

// Insert schemas for News
export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

// Select types for News
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

// Credit Card Marketplace Tables
export const creditCardOffers = pgTable("credit_card_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerName: text("provider_name").notNull(),
  providerLogo: text("provider_logo"),
  cardName: text("card_name").notNull(),
  cardType: text("card_type").notNull(), // 'credit', 'secured', 'premium', 'platinum'
  category: text("category").notNull(), // 'rewards', 'cashback', 'travel', 'fuel', 'shopping', 'lifestyle'
  joiningFee: decimal("joining_fee", { precision: 10, scale: 2 }).default("0"),
  annualFee: decimal("annual_fee", { precision: 10, scale: 2 }).default("0"),
  feeWaiver: text("fee_waiver"),
  creditLimit: text("credit_limit").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  rewardRate: text("reward_rate"),
  welcomeBonus: text("welcome_bonus"),
  keyFeatures: jsonb("key_features").notNull(),
  benefits: jsonb("benefits").notNull(),
  eligibilityCriteria: jsonb("eligibility_criteria").notNull(),
  documentsRequired: jsonb("documents_required").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  views: integer("views").default(0),
  applications: integer("applications").default(0),
  approvalRate: decimal("approval_rate", { precision: 5, scale: 2 }),
  tags: jsonb("tags"),
  isPremium: integer("is_premium").default(0),
  isPopular: integer("is_popular").default(0),
  processingTime: text("processing_time").default("3-5 days"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("credit_card_offers_category_idx").on(table.category),
  providerIdx: index("credit_card_offers_provider_idx").on(table.providerName),
  ratingIdx: index("credit_card_offers_rating_idx").on(table.rating),
}));

export const creditCardApplications = pgTable("credit_card_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  cardOfferId: varchar("card_offer_id").references(() => creditCardOffers.id).notNull(),
  applicationNumber: text("application_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  panCard: text("pan_card").notNull(),
  employmentType: text("employment_type").notNull(),
  company: text("company"),
  monthlyIncome: decimal("monthly_income", { precision: 12, scale: 2 }).notNull(),
  creditScore: integer("credit_score"),
  currentAddress: text("current_address").notNull(),
  residenceType: text("residence_type").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'under_review', 'approved', 'rejected', 'active', 'cancelled'
  approvedLimit: decimal("approved_limit", { precision: 12, scale: 2 }),
  rejectionReason: text("rejection_reason"),
  applicationMetadata: jsonb("application_metadata"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  activatedAt: timestamp("activated_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("credit_card_applications_user_idx").on(table.userId),
  statusIdx: index("credit_card_applications_status_idx").on(table.status),
  applicationNumberIdx: uniqueIndex("credit_card_applications_app_num_idx").on(table.applicationNumber),
}));

// Insert schemas for Credit Cards
export const insertCreditCardOfferSchema = createInsertSchema(creditCardOffers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  applications: true,
});

export const insertCreditCardApplicationSchema = createInsertSchema(creditCardApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  applicationNumber: true,
  submittedAt: true,
  reviewedAt: true,
  approvedAt: true,
  activatedAt: true,
});

// Select types for Credit Cards
export type CreditCardOffer = typeof creditCardOffers.$inferSelect;
export type CreditCardApplication = typeof creditCardApplications.$inferSelect;
export type InsertCreditCardOffer = z.infer<typeof insertCreditCardOfferSchema>;
export type InsertCreditCardApplication = z.infer<typeof insertCreditCardApplicationSchema>;

// Credit card application validation schema
export const creditCardApplicationFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  panCard: z.string().min(10, "Valid PAN card is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  company: z.string().optional(),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  currentAddress: z.string().min(10, "Valid address is required"),
  residenceType: z.string().min(1, "Residence type is required"),
});

// ShareWise - Expense Splitting Tables
export const sharewiseGroups = pgTable("sharewise_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  groupType: text("group_type").default("other"), // 'trip', 'housemates', 'couple', 'event', 'business', 'other'
  groupPhoto: text("group_photo"), // URL or base64 image
  groupColor: text("group_color").default("#8B5CF6"), // Hex color code for visual identification
  currency: text("currency").default("INR"),
  inviteCode: text("invite_code").notNull().unique(), // Unique code for joining group via link/QR
  isArchived: integer("is_archived").default(0),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  createdByIdx: index("sharewise_groups_created_by_idx").on(table.createdBy),
  inviteCodeIdx: uniqueIndex("sharewise_groups_invite_code_idx").on(table.inviteCode),
}));

export const sharewiseGroupMembers = pgTable("sharewise_group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => sharewiseGroups.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // 'owner', 'admin', 'member'
  status: text("status").default("active"), // 'active', 'removed', 'left'
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  groupUserIdx: uniqueIndex("sharewise_group_members_group_user_idx").on(table.groupId, table.userId),
  groupIdx: index("sharewise_group_members_group_idx").on(table.groupId),
  userIdx: index("sharewise_group_members_user_idx").on(table.userId),
}));

export const sharewiseExpenses = pgTable("sharewise_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => sharewiseGroups.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  category: text("category").notNull(), // 'groceries', 'utilities', 'rent', 'transport', 'food', 'entertainment', 'other'
  notes: text("notes"),
  splitType: text("split_type").default("equal"), // 'equal', 'exact', 'percentage', 'shares', 'itemized'
  paidBy: varchar("paid_by").references(() => users.id).notNull(),
  attachmentUrl: text("attachment_url"), // Receipt/bill image URL
  attachmentType: text("attachment_type"), // 'image', 'pdf'
  ocrData: jsonb("ocr_data"), // OCR extracted data
  isRecurring: integer("is_recurring").default(0),
  recurringFrequency: text("recurring_frequency"), // 'daily', 'weekly', 'monthly', 'yearly'
  recurringEndDate: timestamp("recurring_end_date"),
  parentExpenseId: varchar("parent_expense_id"), // For recurring expenses
  occurredAt: timestamp("occurred_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  groupIdx: index("sharewise_expenses_group_idx").on(table.groupId),
  paidByIdx: index("sharewise_expenses_paid_by_idx").on(table.paidBy),
}));

export const sharewiseExpenseSplits = pgTable("sharewise_expense_splits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseId: varchar("expense_id").references(() => sharewiseExpenses.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  shareAmount: decimal("share_amount", { precision: 12, scale: 2 }).notNull(),
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }),
  shareUnits: integer("share_units"), // For 'shares' split type
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0"),
  owesAmount: decimal("owes_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  expenseIdx: index("sharewise_expense_splits_expense_idx").on(table.expenseId),
  userIdx: index("sharewise_expense_splits_user_idx").on(table.userId),
}));

// For itemized split support
export const sharewiseExpenseItems = pgTable("sharewise_expense_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseId: varchar("expense_id").references(() => sharewiseExpenses.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  assignedTo: jsonb("assigned_to").notNull(), // Array of user IDs
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  expenseIdx: index("sharewise_expense_items_expense_idx").on(table.expenseId),
}));

// Activity/Timeline tracking
export const sharewiseActivity = pgTable("sharewise_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => sharewiseGroups.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // 'expense_added', 'expense_edited', 'expense_deleted', 'settlement_added', 'member_added', 'member_removed'
  entityId: varchar("entity_id"), // ID of the related expense/settlement/member
  details: jsonb("details"), // Additional details about the activity
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  groupIdx: index("sharewise_activity_group_idx").on(table.groupId),
  userIdx: index("sharewise_activity_user_idx").on(table.userId),
}));

export const sharewiseSettlements = pgTable("sharewise_settlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => sharewiseGroups.id, { onDelete: 'cascade' }).notNull(),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  method: text("method").default("cash"), // 'cash', 'upi', 'bank', 'other'
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  settledAt: timestamp("settled_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  groupIdx: index("sharewise_settlements_group_idx").on(table.groupId),
  fromUserIdx: index("sharewise_settlements_from_user_idx").on(table.fromUserId),
  toUserIdx: index("sharewise_settlements_to_user_idx").on(table.toUserId),
}));

// Insert schemas for ShareWise
export const insertSharewiseGroupSchema = createInsertSchema(sharewiseGroups).omit({
  id: true,
  inviteCode: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSharewiseGroupMemberSchema = createInsertSchema(sharewiseGroupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertSharewiseExpenseSchema = createInsertSchema(sharewiseExpenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSharewiseExpenseSplitSchema = createInsertSchema(sharewiseExpenseSplits).omit({
  id: true,
  createdAt: true,
});

export const insertSharewiseExpenseItemSchema = createInsertSchema(sharewiseExpenseItems).omit({
  id: true,
  createdAt: true,
});

export const insertSharewiseActivitySchema = createInsertSchema(sharewiseActivity).omit({
  id: true,
  createdAt: true,
});

export const insertSharewiseSettlementSchema = createInsertSchema(sharewiseSettlements).omit({
  id: true,
  createdAt: true,
  settledAt: true,
});

// Select types for ShareWise
export type SharewiseGroup = typeof sharewiseGroups.$inferSelect;
export type SharewiseGroupMember = typeof sharewiseGroupMembers.$inferSelect;
export type SharewiseExpense = typeof sharewiseExpenses.$inferSelect;
export type SharewiseExpenseSplit = typeof sharewiseExpenseSplits.$inferSelect;
export type SharewiseExpenseItem = typeof sharewiseExpenseItems.$inferSelect;
export type SharewiseActivity = typeof sharewiseActivity.$inferSelect;
export type SharewiseSettlement = typeof sharewiseSettlements.$inferSelect;
export type InsertSharewiseGroup = z.infer<typeof insertSharewiseGroupSchema>;
export type InsertSharewiseGroupMember = z.infer<typeof insertSharewiseGroupMemberSchema>;
export type InsertSharewiseExpense = z.infer<typeof insertSharewiseExpenseSchema>;
export type InsertSharewiseExpenseSplit = z.infer<typeof insertSharewiseExpenseSplitSchema>;
export type InsertSharewiseExpenseItem = z.infer<typeof insertSharewiseExpenseItemSchema>;
export type InsertSharewiseActivity = z.infer<typeof insertSharewiseActivitySchema>;
export type InsertSharewiseSettlement = z.infer<typeof insertSharewiseSettlementSchema>;

// Validation schemas for ShareWise forms
export const sharewiseGroupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  groupType: z.enum(["trip", "housemates", "couple", "event", "business", "other"]).default("other"),
  groupPhoto: z.string().optional(),
  groupColor: z.string().default("#8B5CF6"),
  currency: z.string().default("INR"),
});

export const sharewiseExpenseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.enum(["groceries", "utilities", "rent", "housing", "transport", "food", "entertainment", "accommodation", "other"]),
  notes: z.string().optional(),
  splitType: z.enum(["equal", "exact", "percentage", "shares", "itemized"]).default("equal"),
  paidBy: z.string().min(1, "Payer is required"),
  occurredAt: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  recurringEndDate: z.string().optional(),
  attachmentUrl: z.string().optional(),
  attachmentType: z.enum(["image", "pdf"]).optional(),
  splits: z.array(z.object({
    userId: z.string(),
    shareAmount: z.string().optional(),
    sharePercentage: z.string().optional(),
    shareUnits: z.number().optional(),
  })),
  items: z.array(z.object({
    name: z.string(),
    amount: z.string(),
    quantity: z.number().default(1),
    assignedTo: z.array(z.string()),
  })).optional(),
});

export const sharewiseSettlementFormSchema = z.object({
  fromUserId: z.string().min(1, "Payer is required"),
  toUserId: z.string().min(1, "Recipient is required"),
  amount: z.string().min(1, "Amount is required"),
  method: z.enum(["cash", "upi", "bank", "other"]).default("cash"),
  notes: z.string().optional(),
});

// Schema for updating an expense (only editable fields)
export const updateSharewiseExpenseSchema = z.object({
  title: z.string().min(1).optional(),
  amount: z.string().min(1).optional(),
  category: z.enum(["groceries", "utilities", "rent", "transport", "food", "entertainment", "other"]).optional(),
  notes: z.string().optional(),
  occurredAt: z.string().optional(),
});

// ===================================================================
// FOOD DELIVER NOW - Complete Quick Commerce & Food Delivery System
// ===================================================================

// Food Categories (Hotel Food, Supermart, Medicine, Electronics, Beauty, Pet, Home & Kitchen)
export const foodCategories = pgTable("food_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Hotel Food", "Supermart", "Medicine", etc.
  slug: text("slug").notNull().unique(), // "hotel-food", "supermart", etc.
  icon: text("icon").notNull(), // Icon name from lucide-react
  description: text("description"),
  image: text("image"),
  isActive: integer("is_active").default(1),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Restaurants & Stores
export const foodVendors = pgTable("food_vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => foodCategories.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  cuisineTypes: jsonb("cuisine_types").default('[]'), // For restaurants: ["North Indian", "Chinese"]
  address: text("address").notNull(),
  area: text("area").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  phone: text("phone"),
  email: text("email"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  totalOrders: integer("total_orders").default(0),
  deliveryTime: text("delivery_time").default("30-40 min"), // "15-20 min", "10 min"
  deliveryFee: decimal("delivery_fee", { precision: 6, scale: 2 }).default("0"),
  minOrderAmount: decimal("min_order_amount", { precision: 8, scale: 2 }).default("0"),
  isVeg: integer("is_veg").default(0), // 1 = pure veg
  hasBothVegNonVeg: integer("has_both_veg_non_veg").default(1),
  isOpen: integer("is_open").default(1),
  openingTime: text("opening_time").default("09:00"),
  closingTime: text("closing_time").default("23:00"),
  costForTwo: decimal("cost_for_two", { precision: 8, scale: 2 }),
  offers: jsonb("offers").default('[]'), // Array of active offers
  tags: jsonb("tags").default('[]'), // ["Fast Delivery", "Trending", "New"]
  isPremium: integer("is_premium").default(0),
  isPartner: integer("is_partner").default(1),
  licenseNumber: text("license_number"),
  fssaiNumber: text("fssai_number"), // For food vendors
  gstNumber: text("gst_number"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("food_vendors_category_idx").on(table.categoryId),
  cityIdx: index("food_vendors_city_idx").on(table.city),
  pincodeIdx: index("food_vendors_pincode_idx").on(table.pincode),
  ratingIdx: index("food_vendors_rating_idx").on(table.rating),
}));

// Product Categories within each vendor
export const foodProductCategories = pgTable("food_product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => foodVendors.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(), // "Starters", "Main Course", "Dairy", "Vegetables"
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  vendorIdx: index("food_product_categories_vendor_idx").on(table.vendorId),
}));

// Products / Food Items
export const foodProducts = pgTable("food_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => foodVendors.id, { onDelete: 'cascade' }).notNull(),
  categoryId: varchar("category_id").references(() => foodProductCategories.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  images: jsonb("images").default('[]'), // Multiple images
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  isVeg: integer("is_veg").default(1), // 1 = veg, 0 = non-veg
  isAvailable: integer("is_available").default(1),
  stockQuantity: integer("stock_quantity"),
  unit: text("unit"), // "piece", "kg", "gm", "ltr", "ml"
  tags: jsonb("tags").default('[]'), // ["Bestseller", "Spicy", "Chef's Special"]
  nutritionInfo: jsonb("nutrition_info"), // Calories, proteins, etc.
  ingredients: text("ingredients"),
  customizations: jsonb("customizations").default('[]'), // Size, add-ons, etc.
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  totalOrders: integer("total_orders").default(0),
  expiryDate: timestamp("expiry_date"), // For medicines, groceries
  manufacturer: text("manufacturer"),
  brand: text("brand"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  vendorIdx: index("food_products_vendor_idx").on(table.vendorId),
  categoryIdx: index("food_products_category_idx").on(table.categoryId),
  isVegIdx: index("food_products_is_veg_idx").on(table.isVeg),
  ratingIdx: index("food_products_rating_idx").on(table.rating),
}));

// Delivery Addresses
export const deliveryAddresses = pgTable("delivery_addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull().default("home"), // "home", "work", "other"
  label: text("label"), // Custom label
  fullAddress: text("full_address").notNull(),
  landmark: text("landmark"),
  area: text("area").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  isDefault: integer("is_default").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("delivery_addresses_user_idx").on(table.userId),
  defaultIdx: index("delivery_addresses_default_idx").on(table.userId, table.isDefault),
}));

// Food Orders
export const foodOrders = pgTable("food_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vendorId: varchar("vendor_id").references(() => foodVendors.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "preparing", "ready", "picked_up", "out_for_delivery", "delivered", "cancelled"
  orderType: text("order_type").notNull().default("delivery"), // "delivery", "pickup"
  
  // Items & Pricing
  itemsSubtotal: decimal("items_subtotal", { precision: 12, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 8, scale: 2 }).default("0"),
  platformFee: decimal("platform_fee", { precision: 8, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 8, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 8, scale: 2 }).default("0"),
  couponDiscount: decimal("coupon_discount", { precision: 8, scale: 2 }).default("0"),
  tip: decimal("tip", { precision: 8, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Address
  deliveryAddressId: varchar("delivery_address_id").references(() => deliveryAddresses.id),
  deliveryAddress: jsonb("delivery_address"), // Snapshot of address
  
  // Coupon
  couponCode: text("coupon_code"),
  couponId: varchar("coupon_id"),
  
  // Payment
  paymentMethod: text("payment_method").default("online"), // "online", "cod", "upi"
  paymentStatus: text("payment_status").default("pending"), // "pending", "completed", "failed", "refunded"
  paymentId: text("payment_id"),
  
  // Delivery Tracking
  deliveryPartnerId: varchar("delivery_partner_id"),
  deliveryPartnerName: text("delivery_partner_name"),
  deliveryPartnerPhone: text("delivery_partner_phone"),
  deliveryPartnerPhoto: text("delivery_partner_photo"),
  deliveryPartnerRating: decimal("delivery_partner_rating", { precision: 3, scale: 2 }),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  
  // Instructions & Notes
  cookingInstructions: text("cooking_instructions"),
  deliveryInstructions: text("delivery_instructions"),
  cancellationReason: text("cancellation_reason"),
  
  // Ratings & Reviews
  vendorRating: decimal("vendor_rating", { precision: 3, scale: 2 }),
  deliveryRating: decimal("delivery_rating", { precision: 3, scale: 2 }),
  reviewText: text("review_text"),
  reviewImages: jsonb("review_images").default('[]'),
  
  // Timestamps
  orderedAt: timestamp("ordered_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  preparingAt: timestamp("preparing_at"),
  readyAt: timestamp("ready_at"),
  pickedUpAt: timestamp("picked_up_at"),
  outForDeliveryAt: timestamp("out_for_delivery_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("food_orders_user_idx").on(table.userId),
  vendorIdx: index("food_orders_vendor_idx").on(table.vendorId),
  statusIdx: index("food_orders_status_idx").on(table.status),
  orderNumberIdx: uniqueIndex("food_orders_order_number_idx").on(table.orderNumber),
}));

// Order Items
export const foodOrderItems = pgTable("food_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => foodOrders.id, { onDelete: 'cascade' }).notNull(),
  productId: varchar("product_id").references(() => foodProducts.id).notNull(),
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  customizations: jsonb("customizations").default('[]'), // Selected customizations
  specialInstructions: text("special_instructions"),
  isVeg: integer("is_veg"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orderIdx: index("food_order_items_order_idx").on(table.orderId),
  productIdx: index("food_order_items_product_idx").on(table.productId),
}));

// Coupons & Offers
export const foodCoupons = pgTable("food_coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("percentage"), // "percentage", "flat", "free_delivery"
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).default("0"),
  applicableCategories: jsonb("applicable_categories").default('[]'), // Array of category IDs
  applicableVendors: jsonb("applicable_vendors").default('[]'), // Array of vendor IDs
  userType: text("user_type").default("all"), // "all", "new", "existing"
  usageLimit: integer("usage_limit"), // Total uses allowed
  usageCount: integer("usage_count").default(0),
  userLimit: integer("user_limit").default(1), // Uses per user
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: integer("is_active").default(1),
  termsConditions: text("terms_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  codeIdx: uniqueIndex("food_coupons_code_idx").on(table.code),
  validityIdx: index("food_coupons_validity_idx").on(table.validFrom, table.validUntil),
}));

// Coupon Usage Tracking
export const foodCouponUsage = pgTable("food_coupon_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponId: varchar("coupon_id").references(() => foodCoupons.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: varchar("order_id").references(() => foodOrders.id).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
}, (table) => ({
  couponUserIdx: index("food_coupon_usage_coupon_user_idx").on(table.couponId, table.userId),
  orderIdx: index("food_coupon_usage_order_idx").on(table.orderId),
}));

// Live Delivery Tracking
export const foodDeliveryTracking = pgTable("food_delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => foodOrders.id, { onDelete: 'cascade' }).notNull().unique(),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }),
  locationHistory: jsonb("location_history").default('[]'), // Array of {lat, lng, timestamp}
  estimatedTimeMinutes: integer("estimated_time_minutes"),
  distanceRemainingKm: decimal("distance_remaining_km", { precision: 8, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  orderIdx: uniqueIndex("food_delivery_tracking_order_idx").on(table.orderId),
}));

// Vendor Reviews & Ratings
export const foodVendorReviews = pgTable("food_vendor_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => foodVendors.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: varchar("order_id").references(() => foodOrders.id).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull(),
  reviewText: text("review_text"),
  reviewImages: jsonb("review_images").default('[]'),
  foodQualityRating: decimal("food_quality_rating", { precision: 3, scale: 2 }),
  packagingRating: decimal("packaging_rating", { precision: 3, scale: 2 }),
  deliveryRating: decimal("delivery_rating", { precision: 3, scale: 2 }),
  likes: integer("likes").default(0),
  vendorResponse: text("vendor_response"),
  vendorRespondedAt: timestamp("vendor_responded_at"),
  isVerified: integer("is_verified").default(1), // 1 if order is verified
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  vendorIdx: index("food_vendor_reviews_vendor_idx").on(table.vendorId),
  userIdx: index("food_vendor_reviews_user_idx").on(table.userId),
  orderIdx: uniqueIndex("food_vendor_reviews_order_idx").on(table.orderId),
}));

// Cart (for persistent cart across sessions)
export const foodCart = pgTable("food_cart", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  vendorId: varchar("vendor_id").references(() => foodVendors.id).notNull(),
  items: jsonb("items").notNull(), // Array of cart items
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userVendorIdx: uniqueIndex("food_cart_user_vendor_idx").on(table.userId, table.vendorId),
}));

// Insert Schemas for Food Delivery
export const insertFoodCategorySchema = createInsertSchema(foodCategories).omit({
  id: true,
  createdAt: true,
});

export const insertFoodVendorSchema = createInsertSchema(foodVendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodProductCategorySchema = createInsertSchema(foodProductCategories).omit({
  id: true,
  createdAt: true,
});

export const insertFoodProductSchema = createInsertSchema(foodProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryAddressSchema = createInsertSchema(deliveryAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodOrderSchema = createInsertSchema(foodOrders).omit({
  id: true,
  orderNumber: true,
  orderedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodOrderItemSchema = createInsertSchema(foodOrderItems).omit({
  id: true,
  createdAt: true,
});

export const insertFoodCouponSchema = createInsertSchema(foodCoupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodCouponUsageSchema = createInsertSchema(foodCouponUsage).omit({
  id: true,
  usedAt: true,
});

export const insertFoodDeliveryTrackingSchema = createInsertSchema(foodDeliveryTracking).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertFoodVendorReviewSchema = createInsertSchema(foodVendorReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodCartSchema = createInsertSchema(foodCart).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// Select Types
export type FoodCategory = typeof foodCategories.$inferSelect;
export type FoodVendor = typeof foodVendors.$inferSelect;
export type FoodProductCategory = typeof foodProductCategories.$inferSelect;
export type FoodProduct = typeof foodProducts.$inferSelect;
export type DeliveryAddress = typeof deliveryAddresses.$inferSelect;
export type FoodOrder = typeof foodOrders.$inferSelect;
export type FoodOrderItem = typeof foodOrderItems.$inferSelect;
export type FoodCoupon = typeof foodCoupons.$inferSelect;
export type FoodCouponUsage = typeof foodCouponUsage.$inferSelect;
export type FoodDeliveryTracking = typeof foodDeliveryTracking.$inferSelect;
export type FoodVendorReview = typeof foodVendorReviews.$inferSelect;
export type FoodCart = typeof foodCart.$inferSelect;

export type InsertFoodCategory = z.infer<typeof insertFoodCategorySchema>;
export type InsertFoodVendor = z.infer<typeof insertFoodVendorSchema>;
export type InsertFoodProductCategory = z.infer<typeof insertFoodProductCategorySchema>;
export type InsertFoodProduct = z.infer<typeof insertFoodProductSchema>;
export type InsertDeliveryAddress = z.infer<typeof insertDeliveryAddressSchema>;
export type InsertFoodOrder = z.infer<typeof insertFoodOrderSchema>;
export type InsertFoodOrderItem = z.infer<typeof insertFoodOrderItemSchema>;
export type InsertFoodCoupon = z.infer<typeof insertFoodCouponSchema>;
export type InsertFoodCouponUsage = z.infer<typeof insertFoodCouponUsageSchema>;
export type InsertFoodDeliveryTracking = z.infer<typeof insertFoodDeliveryTrackingSchema>;
export type InsertFoodVendorReview = z.infer<typeof insertFoodVendorReviewSchema>;
export type InsertFoodCart = z.infer<typeof insertFoodCartSchema>;

// Form Validation Schemas
export const deliveryAddressFormSchema = z.object({
  type: z.enum(["home", "work", "other"]).default("home"),
  label: z.string().optional(),
  fullAddress: z.string().min(10, "Please enter a complete address"),
  landmark: z.string().optional(),
  area: z.string().min(2, "Area is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const foodOrderFormSchema = z.object({
  vendorId: z.string().min(1, "Vendor is required"),
  orderType: z.enum(["delivery", "pickup"]).default("delivery"),
  deliveryAddressId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    customizations: z.array(z.any()).optional(),
    specialInstructions: z.string().optional(),
  })).min(1, "At least one item is required"),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["online", "cod", "upi"]).default("online"),
  cookingInstructions: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  tip: z.number().default(0),
});

export const foodVendorReviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().optional(),
  foodQualityRating: z.number().min(1).max(5).optional(),
  packagingRating: z.number().min(1).max(5).optional(),
  deliveryRating: z.number().min(1).max(5).optional(),
});

// ===================================================================
// COURIER PICK & DROP DELIVERY SYSTEM (Porter/Lalamove/Dunzo-like)
// ===================================================================

// Courier Bookings - Main delivery bookings table
export const courierBookings = pgTable("courier_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bookingNumber: text("booking_number").notNull().unique(),
  bookingType: text("booking_type").notNull().default("ondemand"), // 'ondemand', 'scheduled'
  
  // Vehicle & Pricing
  vehicleType: text("vehicle_type").notNull(), // 'bike', 'auto', 'mini_truck', 'truck_2ton'
  vehicleDetails: jsonb("vehicle_details"), // Snapshot of vehicle specs
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  pricePerKm: decimal("price_per_km", { precision: 10, scale: 2 }).notNull(),
  distanceKm: decimal("distance_km", { precision: 10, scale: 2 }).notNull(),
  distanceCharge: decimal("distance_charge", { precision: 10, scale: 2 }).notNull(),
  
  // Package Details
  itemType: text("item_type").notNull(), // 'documents', 'parcels', 'groceries', 'furniture', 'appliances', 'heavy_items'
  packageDescription: text("package_description"),
  weightKg: decimal("weight_kg", { precision: 8, scale: 2 }),
  dimensionsLCm: decimal("dimensions_l_cm", { precision: 6, scale: 2 }),
  dimensionsWCm: decimal("dimensions_w_cm", { precision: 6, scale: 2 }),
  dimensionsHCm: decimal("dimensions_h_cm", { precision: 6, scale: 2 }),
  quantity: integer("quantity").default(1),
  
  // Insurance & COD
  insuranceRequired: integer("insurance_required").default(0),
  insuranceValue: decimal("insurance_value", { precision: 12, scale: 2 }).default("0"),
  insuranceCharge: decimal("insurance_charge", { precision: 8, scale: 2 }).default("0"),
  codRequired: integer("cod_required").default(0),
  codAmount: decimal("cod_amount", { precision: 12, scale: 2 }).default("0"),
  codCharge: decimal("cod_charge", { precision: 8, scale: 2 }).default("0"),
  
  // Pricing Breakdown
  platformFee: decimal("platform_fee", { precision: 8, scale: 2 }).default("0"),
  gst: decimal("gst", { precision: 8, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 8, scale: 2 }).default("0"),
  couponDiscount: decimal("coupon_discount", { precision: 8, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Scheduling
  scheduledDate: timestamp("scheduled_date"),
  scheduledTime: text("scheduled_time"),
  
  // Driver & Status
  driverId: varchar("driver_id").references(() => driverProfiles.id),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  driverPhoto: text("driver_photo"),
  driverRating: decimal("driver_rating", { precision: 3, scale: 2 }),
  vehicleNumber: text("vehicle_number"),
  
  status: text("status").notNull().default("pending"), // 'pending', 'driver_assigned', 'pickup_started', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed'
  
  // Tracking & Proof of Delivery
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 7 }),
  currentLongitude: decimal("current_longitude", { precision: 10, scale: 7 }),
  estimatedPickupTime: timestamp("estimated_pickup_time"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualPickupTime: timestamp("actual_pickup_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  
  // Proof of Delivery
  podType: text("pod_type"), // 'photo', 'otp', 'signature'
  podPhotoUrl: text("pod_photo_url"),
  podOtp: text("pod_otp"),
  podOtpVerified: integer("pod_otp_verified").default(0),
  podSignatureUrl: text("pod_signature_url"),
  podReceiverName: text("pod_receiver_name"),
  
  // Special Instructions
  pickupInstructions: text("pickup_instructions"),
  deliveryInstructions: text("delivery_instructions"),
  specialHandlingNotes: text("special_handling_notes"),
  
  // Payment
  paymentMethod: text("payment_method").default("online"), // 'online', 'cod', 'wallet'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  paymentId: text("payment_id"),
  
  // Cancellation
  cancellationReason: text("cancellation_reason"),
  cancellationCharge: decimal("cancellation_charge", { precision: 8, scale: 2 }).default("0"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0"),
  
  // Ratings & Reviews
  userRating: decimal("user_rating", { precision: 3, scale: 2 }),
  userReview: text("user_review"),
  driverFeedback: text("driver_feedback"),
  
  // Corporate/Bulk
  isB2B: integer("is_b2b").default(0),
  contractId: varchar("contract_id"),
  batchId: varchar("batch_id"), // For bulk uploads
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  driverAssignedAt: timestamp("driver_assigned_at"),
  pickupStartedAt: timestamp("pickup_started_at"),
  pickedUpAt: timestamp("picked_up_at"),
  inTransitAt: timestamp("in_transit_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
}, (table) => ({
  userIdx: index("courier_bookings_user_idx").on(table.userId),
  statusIdx: index("courier_bookings_status_idx").on(table.status),
  driverIdx: index("courier_bookings_driver_idx").on(table.driverId),
  bookingNumberIdx: uniqueIndex("courier_bookings_booking_number_idx").on(table.bookingNumber),
  scheduledIdx: index("courier_bookings_scheduled_idx").on(table.scheduledDate),
}));

// Courier Locations - Multiple pickup/drop locations for a single booking
export const courierLocations = pgTable("courier_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => courierBookings.id, { onDelete: 'cascade' }).notNull(),
  locationType: text("location_type").notNull(), // 'pickup', 'drop'
  sequence: integer("sequence").notNull(), // Order of stops (1, 2, 3...)
  
  // Address Details
  address: text("address").notNull(),
  landmark: text("landmark"),
  area: text("area").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  // Contact Details
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  alternatePhone: text("alternate_phone"),
  
  // Status & Tracking
  status: text("status").default("pending"), // 'pending', 'reached', 'completed', 'failed'
  reachedAt: timestamp("reached_at"),
  completedAt: timestamp("completed_at"),
  failureReason: text("failure_reason"),
  
  // Instructions
  instructions: text("instructions"),
  accessCode: text("access_code"), // Building/gate access code
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  bookingIdx: index("courier_locations_booking_idx").on(table.bookingId),
  sequenceIdx: index("courier_locations_sequence_idx").on(table.bookingId, table.sequence),
}));

// Courier Tracking History - Real-time location updates
export const courierTrackingHistory = pgTable("courier_tracking_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => courierBookings.id, { onDelete: 'cascade' }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  speed: decimal("speed", { precision: 6, scale: 2 }), // km/h
  heading: decimal("heading", { precision: 5, scale: 2 }), // 0-360 degrees
  accuracy: decimal("accuracy", { precision: 6, scale: 2 }), // meters
  status: text("status").notNull(),
  eta: integer("eta"), // minutes
  distanceRemaining: decimal("distance_remaining", { precision: 10, scale: 2 }), // km
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  bookingIdx: index("courier_tracking_history_booking_idx").on(table.bookingId),
  recordedIdx: index("courier_tracking_history_recorded_idx").on(table.recordedAt),
}));

// Courier Vehicle Types - Vehicle specifications and pricing
export const courierVehicleTypes = pgTable("courier_vehicle_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // 'bike', 'auto', 'mini_truck', 'truck_2ton'
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  
  // Capacity Specifications
  maxWeightKg: decimal("max_weight_kg", { precision: 8, scale: 2 }).notNull(),
  maxDimensionsLCm: decimal("max_dimensions_l_cm", { precision: 6, scale: 2 }),
  maxDimensionsWCm: decimal("max_dimensions_w_cm", { precision: 6, scale: 2 }),
  maxDimensionsHCm: decimal("max_dimensions_h_cm", { precision: 6, scale: 2 }),
  
  // Pricing
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  pricePerKm: decimal("price_per_km", { precision: 10, scale: 2 }).notNull(),
  minDistance: decimal("min_distance", { precision: 6, scale: 2 }).default("0"),
  
  // Availability
  eta: text("eta").default("15-20 mins"),
  isActive: integer("is_active").default(1),
  sortOrder: integer("sort_order").default(0),
  
  // Features
  features: jsonb("features").default('[]'), // ['GPS Tracking', 'Insured', '24/7']
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  codeIdx: uniqueIndex("courier_vehicle_types_code_idx").on(table.code),
}));

// Courier Coupons - Specific to courier service
export const courierCoupons = pgTable("courier_coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default("percentage"), // 'percentage', 'flat', 'free_delivery'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).default("0"),
  
  // Restrictions
  applicableVehicleTypes: jsonb("applicable_vehicle_types").default('[]'), // ['bike', 'auto']
  applicableItemTypes: jsonb("applicable_item_types").default('[]'), // ['documents', 'parcels']
  userType: text("user_type").default("all"), // 'all', 'new', 'existing', 'b2b'
  
  // Usage Limits
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  userLimit: integer("user_limit").default(1),
  
  // Validity
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: integer("is_active").default(1),
  
  termsConditions: text("terms_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  codeIdx: uniqueIndex("courier_coupons_code_idx").on(table.code),
}));

// Courier B2B Batches - For bulk/corporate bookings
export const courierB2BBatches = pgTable("courier_b2b_batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  batchNumber: text("batch_number").notNull().unique(),
  uploadMethod: text("upload_method").notNull(), // 'csv', 'api', 'manual'
  totalBookings: integer("total_bookings").notNull(),
  successfulBookings: integer("successful_bookings").default(0),
  failedBookings: integer("failed_bookings").default(0),
  
  // File Details
  csvFileName: text("csv_file_name"),
  csvFileUrl: text("csv_file_url"),
  
  // Processing Status
  status: text("status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  processedAt: timestamp("processed_at"),
  
  // Pricing Summary
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdx: index("courier_b2b_batches_user_idx").on(table.userId),
  batchNumberIdx: uniqueIndex("courier_b2b_batches_batch_number_idx").on(table.batchNumber),
}));

// Insert Schemas
export const insertCourierBookingSchema = createInsertSchema(courierBookings).omit({
  id: true,
  bookingNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourierLocationSchema = createInsertSchema(courierLocations).omit({
  id: true,
  createdAt: true,
});

export const insertCourierTrackingHistorySchema = createInsertSchema(courierTrackingHistory).omit({
  id: true,
  createdAt: true,
});

export const insertCourierVehicleTypeSchema = createInsertSchema(courierVehicleTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourierCouponSchema = createInsertSchema(courierCoupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourierB2BBatchSchema = createInsertSchema(courierB2BBatches).omit({
  id: true,
  batchNumber: true,
  createdAt: true,
});

// Select Types
export type CourierBooking = typeof courierBookings.$inferSelect;
export type CourierLocation = typeof courierLocations.$inferSelect;
export type CourierTrackingHistory = typeof courierTrackingHistory.$inferSelect;
export type CourierVehicleType = typeof courierVehicleTypes.$inferSelect;
export type CourierCoupon = typeof courierCoupons.$inferSelect;
export type CourierB2BBatch = typeof courierB2BBatches.$inferSelect;

export type InsertCourierBooking = z.infer<typeof insertCourierBookingSchema>;
export type InsertCourierLocation = z.infer<typeof insertCourierLocationSchema>;
export type InsertCourierTrackingHistory = z.infer<typeof insertCourierTrackingHistorySchema>;
export type InsertCourierVehicleType = z.infer<typeof insertCourierVehicleTypeSchema>;
export type InsertCourierCoupon = z.infer<typeof insertCourierCouponSchema>;
export type InsertCourierB2BBatch = z.infer<typeof insertCourierB2BBatchSchema>;

// Form Validation Schemas
export const courierSearchFormSchema = z.object({
  pickupLocation: z.string().min(5, "Pickup location is required"),
  dropLocation: z.string().min(5, "Drop location is required"),
  bookingType: z.enum(["ondemand", "scheduled"]).default("ondemand"),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

export const courierPackageDetailsFormSchema = z.object({
  itemType: z.enum(["documents", "parcels", "groceries", "furniture", "appliances", "heavy_items"]),
  packageDescription: z.string().min(5, "Package description is required"),
  weightKg: z.number().min(0.1, "Weight must be at least 0.1 kg"),
  dimensionsLCm: z.number().optional(),
  dimensionsWCm: z.number().optional(),
  dimensionsHCm: z.number().optional(),
  quantity: z.number().min(1).default(1),
  insuranceRequired: z.boolean().default(false),
  insuranceValue: z.number().optional(),
  codRequired: z.boolean().default(false),
  codAmount: z.number().optional(),
  pickupInstructions: z.string().optional(),
  deliveryInstructions: z.string().optional(),
});

export const courierLocationFormSchema = z.object({
  locationType: z.enum(["pickup", "drop"]),
  address: z.string().min(10, "Complete address is required"),
  landmark: z.string().optional(),
  area: z.string().min(2, "Area is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  alternatePhone: z.string().optional(),
  instructions: z.string().optional(),
  accessCode: z.string().optional(),
});

// Coupon Mart - Coupon Selling, Trading & Exchange Marketplace
export const couponMartListings = pgTable("coupon_mart_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Multiple Coupons Support (1-5 coupons per listing)
  coupons: jsonb("coupons").notNull(), // Array of coupon objects
  totalCouponCount: integer("total_coupon_count").notNull().default(1),
  totalFaceValue: decimal("total_face_value", { precision: 12, scale: 2 }), // Sum of all coupon values
  
  // Listing Metadata (for filtering/display)
  primaryCategory: text("primary_category").notNull(), // Category from first/primary coupon
  listingNote: text("listing_note"), // Additional note about the listing
  
  // Listing Details
  listingType: text("listing_type").notNull(), // 'sell', 'trade'
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }), // Total price for all coupons
  tradePreference: text("trade_preference"), // If trading: brand/category preferences
  tradeNote: text("trade_note"), // Additional notes for trade
  
  // Trade Requirements (for trade listings)
  tradeCategory: text("trade_category"), // Preferred category for trade
  tradeCouponsRequired: integer("trade_coupons_required").default(1), // Number of coupons required
  tradeMinValueScore: decimal("trade_min_value_score", { precision: 3, scale: 1 }), // Minimum value score required
  tradeMaxValueScore: decimal("trade_max_value_score", { precision: 3, scale: 1 }), // Maximum value score required
  tradeCouponRequirements: jsonb("trade_coupon_requirements"), // Array of detailed requirements: [{ category, brands: [], minRating, maxRating, isRequired }]
  
  // Status
  status: text("status").default("active"), // 'active', 'sold', 'traded', 'cancelled', 'expired'
  visibility: text("visibility").default("public"), // 'public', 'private'
  
  // Metadata
  views: integer("views").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("coupon_mart_listings_user_idx").on(table.userId),
  statusIdx: index("coupon_mart_listings_status_idx").on(table.status),
  categoryIdx: index("coupon_mart_listings_category_idx").on(table.primaryCategory),
}));

export const couponMartTransactions = pgTable("coupon_mart_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").references(() => couponMartListings.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  
  transactionType: text("transaction_type").notNull(), // 'purchase', 'trade'
  amount: decimal("amount", { precision: 10, scale: 2 }), // Purchase amount
  
  // Payment Details
  paymentMethod: text("payment_method").default("upi"), // 'upi', 'stripe', 'wallet'
  paymentTransactionId: text("payment_transaction_id"), // External payment ID
  
  // Coupon codes revealed after purchase (array for multiple coupons)
  revealedCodes: jsonb("revealed_codes").notNull(), // Array of revealed coupon codes
  
  status: text("status").default("completed"), // 'pending', 'completed', 'disputed', 'refunded'
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  listingIdx: index("coupon_mart_transactions_listing_idx").on(table.listingId),
  buyerIdx: index("coupon_mart_transactions_buyer_idx").on(table.buyerId),
  sellerIdx: index("coupon_mart_transactions_seller_idx").on(table.sellerId),
}));

export const couponMartTradeOffers = pgTable("coupon_mart_trade_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").references(() => couponMartListings.id).notNull(),
  offererId: varchar("offerer_id").references(() => users.id).notNull(),
  listingOwnerId: varchar("listing_owner_id").references(() => users.id).notNull(),
  
  // Multiple Offered Coupons (1-5 coupons)
  offeredCoupons: jsonb("offered_coupons").notNull(), // Array of { code, title, brand, value, expiry, status: 'pending'|'accepted'|'rejected' }
  
  offerNote: text("offer_note"),
  
  // Overall status: 'pending', 'partially_accepted', 'all_accepted', 'rejected', 'cancelled'
  status: text("status").default("pending"),
  responseNote: text("response_note"), // Seller's feedback when accepting/rejecting
  
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
}, (table) => ({
  listingIdx: index("coupon_mart_trade_offers_listing_idx").on(table.listingId),
  offererIdx: index("coupon_mart_trade_offers_offerer_idx").on(table.offererId),
  ownerIdx: index("coupon_mart_trade_offers_owner_idx").on(table.listingOwnerId),
}));

// Insert Schemas
export const insertCouponMartListingSchema = createInsertSchema(couponMartListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertCouponMartTransactionSchema = createInsertSchema(couponMartTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertCouponMartTradeOfferSchema = createInsertSchema(couponMartTradeOffers).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
  responseNote: true,
});

// Select Types
export type CouponMartListing = typeof couponMartListings.$inferSelect;
export type CouponMartTransaction = typeof couponMartTransactions.$inferSelect;
export type CouponMartTradeOffer = typeof couponMartTradeOffers.$inferSelect;

export type InsertCouponMartListing = z.infer<typeof insertCouponMartListingSchema>;
export type InsertCouponMartTransaction = z.infer<typeof insertCouponMartTransactionSchema>;
export type InsertCouponMartTradeOffer = z.infer<typeof insertCouponMartTradeOfferSchema>;
export type CouponMartCoupon = z.infer<typeof couponMartCouponSchema>;

export interface TradeCouponRequirement {
  couponNumber: number;
  isRequired: boolean;
  category: string;
  brands: string[];
  minRating: number;
  maxRating: number;
}

// Form Validation Schemas
export const couponMartCouponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  title: z.string().min(5, "Coupon title is required"),
  brand: z.string().min(2, "Brand name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().default("discount"),
  value: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
  valueType: z.string().min(1, "Value type is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  expiryDate: z.string().min(1, "Expiry date is required"),
  minAmount: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? (typeof val === 'string' ? parseFloat(val) : val) : null),
  maxDiscount: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? (typeof val === 'string' ? parseFloat(val) : val) : null),
  termsConditions: z.string().optional(),
  valueScore: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
});

export const couponMartListingFormSchema = z.object({
  coupons: z.array(couponMartCouponSchema).min(1, "At least one coupon is required").max(5, "Maximum 5 coupons allowed"),
  listingNote: z.string().optional(),
  listingType: z.enum(["sell", "trade"]),
  sellingPrice: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? (typeof val === 'string' ? parseFloat(val) : val) : null),
  tradePreference: z.string().optional(),
  tradeNote: z.string().optional(),
});

// Schema for individual offered coupon in a trade
export const offeredCouponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  title: z.string().min(5, "Coupon title is required"),
  brand: z.string().min(2, "Brand name is required"),
  value: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
  expiry: z.string().min(1, "Expiry date is required"),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});

export const couponMartTradeOfferFormSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  offeredCoupons: z.array(offeredCouponSchema).min(1, "At least one coupon is required").max(5, "Maximum 5 coupons allowed"),
  offerNote: z.string().optional(),
});

export type OfferedCoupon = z.infer<typeof offeredCouponSchema>;

// BookSure Consultant Booking System Tables
export const consultantCategories = pgTable("consultant_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  tagline: text("tagline"),
  subcategories: jsonb("subcategories").default('[]'),
  isPopular: integer("is_popular").default(0),
  displayOrder: integer("display_order").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultantProviders = pgTable("consultant_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  categoryId: varchar("category_id").references(() => consultantCategories.id).notNull(),
  categoryName: text("category_name").notNull(),
  subcategory: text("subcategory"),
  phone: text("phone").notNull(),
  email: text("email"),
  profileImage: text("profile_image"),
  designation: text("designation"),
  experience: integer("experience").default(0),
  languages: jsonb("languages").default('[]'),
  gender: text("gender"),
  
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  totalBookings: integer("total_bookings").default(0),
  startingPrice: decimal("starting_price", { precision: 10, scale: 2 }).default("0"),
  
  verified: integer("verified").default(0),
  verificationBadge: text("verification_badge"),
  licenseNumber: text("license_number"),
  certifications: jsonb("certifications").default('[]'),
  
  bio: text("bio"),
  gallery: jsonb("gallery").default('[]'),
  specialties: jsonb("specialties").default('[]'),
  
  address: text("address"),
  city: text("city"),
  pincode: text("pincode"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  serviceRadius: integer("service_radius").default(10),
  virtualAvailable: integer("virtual_available").default(0),
  inPersonAvailable: integer("in_person_available").default(1),
  
  isActive: integer("is_active").default(1),
  isOnline: integer("is_online").default(0),
  lastSeen: timestamp("last_seen"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("consultant_providers_category_idx").on(table.categoryId),
  locationIdx: index("consultant_providers_location_idx").on(table.latitude, table.longitude),
  ratingIdx: index("consultant_providers_rating_idx").on(table.rating),
}));

export const consultantServices = pgTable("consultant_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").references(() => consultantProviders.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  pricingType: text("pricing_type").default("fixed"),
  duration: integer("duration").default(60),
  
  inclusions: jsonb("inclusions").default('[]'),
  exclusions: jsonb("exclusions").default('[]'),
  addOns: jsonb("add_ons").default('[]'),
  
  prepRequired: text("prep_required"),
  equipmentNeeded: jsonb("equipment_needed").default('[]'),
  documentsRequired: jsonb("documents_required").default('[]'),
  
  maxParticipants: integer("max_participants").default(1),
  virtualAvailable: integer("virtual_available").default(0),
  inPersonAvailable: integer("in_person_available").default(1),
  
  cancellationPolicy: text("cancellation_policy"),
  refundPolicy: text("refund_policy"),
  
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  providerIdx: index("consultant_services_provider_idx").on(table.providerId),
  categoryIdx: index("consultant_services_category_idx").on(table.category),
}));

export const consultantBookings = pgTable("consultant_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingNumber: text("booking_number").notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  providerId: varchar("provider_id").references(() => consultantProviders.id).notNull(),
  serviceId: varchar("service_id").references(() => consultantServices.id).notNull(),
  
  serviceType: text("service_type").notNull(),
  bookingType: text("booking_type").notNull(),
  
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  duration: integer("duration").default(60),
  
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  
  address: text("address"),
  landmark: text("landmark"),
  city: text("city"),
  pincode: text("pincode"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  accessInstructions: text("access_instructions"),
  
  attachments: jsonb("attachments").default('[]'),
  specialRequests: text("special_requests"),
  
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  travelFee: decimal("travel_fee", { precision: 10, scale: 2 }).default("0"),
  addOnCharges: decimal("add_on_charges", { precision: 10, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  surgeCharge: decimal("surge_charge", { precision: 10, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  paymentMode: text("payment_mode").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  paymentTransactionId: text("payment_transaction_id"),
  
  promoCode: text("promo_code"),
  
  status: text("status").notNull().default("pending"),
  providerAssigned: integer("provider_assigned").default(0),
  providerEnroute: integer("provider_enroute").default(0),
  providerArrived: integer("provider_arrived").default(0),
  serviceStarted: integer("service_started").default(0),
  serviceCompleted: integer("service_completed").default(0),
  
  providerLatitude: decimal("provider_latitude", { precision: 10, scale: 7 }),
  providerLongitude: decimal("provider_longitude", { precision: 10, scale: 7 }),
  estimatedArrival: timestamp("estimated_arrival"),
  actualArrival: timestamp("actual_arrival"),
  
  videoCallLink: text("video_call_link"),
  maskedPhoneNumber: text("masked_phone_number"),
  
  proofOfDelivery: jsonb("proof_of_delivery"),
  serviceNotes: text("service_notes"),
  extraQuote: jsonb("extra_quote"),
  
  cancellationReason: text("cancellation_reason"),
  cancelledBy: text("cancelled_by"),
  cancelledAt: timestamp("cancelled_at"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  
  rescheduledFrom: varchar("rescheduled_from"),
  rescheduledTo: varchar("rescheduled_to"),
  
  reviewId: varchar("review_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  userIdx: index("consultant_bookings_user_idx").on(table.userId),
  providerIdx: index("consultant_bookings_provider_idx").on(table.providerId),
  statusIdx: index("consultant_bookings_status_idx").on(table.status),
  dateIdx: index("consultant_bookings_date_idx").on(table.scheduledDate),
}));

export const consultantReviews = pgTable("consultant_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => consultantBookings.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  providerId: varchar("provider_id").references(() => consultantProviders.id).notNull(),
  
  rating: integer("rating").notNull(),
  review: text("review"),
  
  onTimeBehavior: integer("on_time_behavior"),
  professionalism: integer("professionalism"),
  serviceQuality: integer("service_quality"),
  valueForMoney: integer("value_for_money"),
  
  photos: jsonb("photos").default('[]'),
  
  tags: jsonb("tags").default('[]'),
  
  providerResponse: text("provider_response"),
  respondedAt: timestamp("responded_at"),
  
  isVerified: integer("is_verified").default(1),
  helpfulCount: integer("helpful_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  bookingIdx: uniqueIndex("consultant_reviews_booking_idx").on(table.bookingId),
  providerIdx: index("consultant_reviews_provider_idx").on(table.providerId),
  ratingIdx: index("consultant_reviews_rating_idx").on(table.rating),
}));

export const consultantAvailability = pgTable("consultant_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").references(() => consultantProviders.id).notNull(),
  
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  
  slotDuration: integer("slot_duration").default(60),
  isRecurring: integer("is_recurring").default(1),
  specificDate: timestamp("specific_date"),
  
  maxBookings: integer("max_bookings").default(1),
  
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  providerIdx: index("consultant_availability_provider_idx").on(table.providerId),
  dayIdx: index("consultant_availability_day_idx").on(table.dayOfWeek),
}));

// Insert Schemas
export const insertConsultantCategorySchema = createInsertSchema(consultantCategories).omit({
  id: true,
  createdAt: true,
});

export const insertConsultantProviderSchema = createInsertSchema(consultantProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultantServiceSchema = createInsertSchema(consultantServices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConsultantBookingSchema = createInsertSchema(consultantBookings).omit({
  id: true,
  bookingNumber: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertConsultantReviewSchema = createInsertSchema(consultantReviews).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export const insertConsultantAvailabilitySchema = createInsertSchema(consultantAvailability).omit({
  id: true,
  createdAt: true,
});

// Select Types
export type ConsultantCategory = typeof consultantCategories.$inferSelect;
export type ConsultantProvider = typeof consultantProviders.$inferSelect;
export type ConsultantService = typeof consultantServices.$inferSelect;
export type ConsultantBooking = typeof consultantBookings.$inferSelect;
export type ConsultantReview = typeof consultantReviews.$inferSelect;
export type ConsultantAvailability = typeof consultantAvailability.$inferSelect;

export type InsertConsultantCategory = z.infer<typeof insertConsultantCategorySchema>;
export type InsertConsultantProvider = z.infer<typeof insertConsultantProviderSchema>;
export type InsertConsultantService = z.infer<typeof insertConsultantServiceSchema>;
export type InsertConsultantBooking = z.infer<typeof insertConsultantBookingSchema>;
export type InsertConsultantReview = z.infer<typeof insertConsultantReviewSchema>;
export type InsertConsultantAvailability = z.infer<typeof insertConsultantAvailabilitySchema>;

// Form Validation Schemas
export const consultantBookingFormSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  bookingType: z.enum(["in_person", "virtual"]),
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.string().min(1, "Time is required"),
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  accessInstructions: z.string().optional(),
  specialRequests: z.string().optional(),
  paymentMode: z.enum(["prepaid", "pay_at_service"]),
  promoCode: z.string().optional(),
});

export const consultantReviewFormSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
  onTimeBehavior: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  serviceQuality: z.number().min(1).max(5).optional(),
  valueForMoney: z.number().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
});

// SwapNow - Used Goods Marketplace (Buy & Sell)
export const swapNowListings = pgTable("swap_now_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Product Details
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'electronics', 'furniture', 'vehicles', 'fashion', 'books', 'sports', 'home', 'real_estate_land', 'real_estate_rent', 'real_estate_buy', 'others'
  subCategory: text("sub_category"),
  condition: text("condition").notNull(), // 'new', 'like_new', 'good', 'fair', 'poor'
  
  // Pricing
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }),
  isNegotiable: integer("is_negotiable").default(1),
  
  // Images (array of image URLs)
  images: text("images").array(),
  coverImageIndex: integer("cover_image_index").default(0),
  
  // Location
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  pincode: text("pincode"),
  
  // Additional Details
  brand: text("brand"),
  age: text("age"), // '< 6 months', '6-12 months', '1-2 years', '2-5 years', '> 5 years'
  warranty: text("warranty"),
  accessories: text("accessories"),
  
  // Real Estate / Home specific
  totalSquareFeet: text("total_square_feet"),
  usableSquareFeet: text("usable_square_feet"),
  facilities: text("facilities").array(), // ['two_wheel_parking', 'four_wheel_parking', 'balcony', etc.]
  nearbyLocations: text("nearby_locations"),
  furnishingLevel: text("furnishing_level"), // 'furnished', 'semi_furnished', 'unfurnished'
  usageLevel: text("usage_level"), // 'new', 'semi_used', 'well_used'
  
  // Electronics specific
  productUsageLevel: text("product_usage_level"), // 'brand_new', 'unused', 'semi_used', 'heavy_used'
  buyDate: text("buy_date"),
  billAvailability: text("bill_availability"), // 'yes', 'no'
  issues: text("issues"),
  
  // Dynamic subcategory-specific attributes (JSON object for flexible fields)
  attributes: jsonb("attributes"),
  
  // Status & Visibility
  status: text("status").default("active"), // 'active', 'sold', 'reserved', 'cancelled', 'expired'
  isFeatured: integer("is_featured").default(0),
  
  // Engagement Metrics
  views: integer("views").default(0),
  favoriteCount: integer("favorite_count").default(0),
  
  // Sale Info
  soldAt: timestamp("sold_at"),
  soldPrice: decimal("sold_price", { precision: 12, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("swap_now_listings_user_idx").on(table.userId),
  categoryIdx: index("swap_now_listings_category_idx").on(table.category),
  statusIdx: index("swap_now_listings_status_idx").on(table.status),
  cityIdx: index("swap_now_listings_city_idx").on(table.city),
}));

export const swapNowConversations = pgTable("swap_now_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").references(() => swapNowListings.id).notNull(),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  status: text("status").default("active"), // 'active', 'archived', 'blocked'
  
  // Read status
  buyerUnreadCount: integer("buyer_unread_count").default(0),
  sellerUnreadCount: integer("seller_unread_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  listingIdx: index("swap_now_conversations_listing_idx").on(table.listingId),
  buyerIdx: index("swap_now_conversations_buyer_idx").on(table.buyerId),
  sellerIdx: index("swap_now_conversations_seller_idx").on(table.sellerId),
}));

export const swapNowMessages = pgTable("swap_now_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => swapNowConversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  
  messageType: text("message_type").notNull().default("text"), // 'text', 'offer', 'image', 'system'
  content: text("content").notNull(),
  
  // For offer messages
  offerAmount: decimal("offer_amount", { precision: 12, scale: 2 }),
  offerStatus: text("offer_status"), // 'pending', 'accepted', 'rejected', 'countered'
  
  // Read status
  isRead: integer("is_read").default(0),
  readAt: timestamp("read_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversationIdx: index("swap_now_messages_conversation_idx").on(table.conversationId),
  senderIdx: index("swap_now_messages_sender_idx").on(table.senderId),
}));

export const swapNowOffers = pgTable("swap_now_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").references(() => swapNowListings.id).notNull(),
  conversationId: varchar("conversation_id").references(() => swapNowConversations.id),
  messageId: varchar("message_id").references(() => swapNowMessages.id),
  buyerId: varchar("buyer_id").references(() => users.id).notNull(),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  
  offerAmount: decimal("offer_amount", { precision: 12, scale: 2 }).notNull(),
  note: text("note"),
  
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected', 'countered', 'expired'
  
  // Counter offer
  counterAmount: decimal("counter_amount", { precision: 12, scale: 2 }),
  counterNote: text("counter_note"),
  
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  listingIdx: index("swap_now_offers_listing_idx").on(table.listingId),
  buyerIdx: index("swap_now_offers_buyer_idx").on(table.buyerId),
  sellerIdx: index("swap_now_offers_seller_idx").on(table.sellerId),
  statusIdx: index("swap_now_offers_status_idx").on(table.status),
}));

export const swapNowFavorites = pgTable("swap_now_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  listingId: varchar("listing_id").references(() => swapNowListings.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userListingUniqueIdx: uniqueIndex("swap_now_favorites_user_listing_idx").on(table.userId, table.listingId),
}));

// Insert Schemas
export const insertSwapNowListingSchema = createInsertSchema(swapNowListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  favoriteCount: true,
  soldAt: true,
  soldPrice: true,
});

export const insertSwapNowConversationSchema = createInsertSchema(swapNowConversations).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
  buyerUnreadCount: true,
  sellerUnreadCount: true,
});

export const insertSwapNowMessageSchema = createInsertSchema(swapNowMessages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertSwapNowOfferSchema = createInsertSchema(swapNowOffers).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
  counterAmount: true,
  counterNote: true,
});

export const insertSwapNowFavoriteSchema = createInsertSchema(swapNowFavorites).omit({
  id: true,
  createdAt: true,
});

// Select Types
export type SwapNowListing = typeof swapNowListings.$inferSelect;
export type SwapNowConversation = typeof swapNowConversations.$inferSelect;
export type SwapNowMessage = typeof swapNowMessages.$inferSelect;
export type SwapNowOffer = typeof swapNowOffers.$inferSelect;
export type SwapNowFavorite = typeof swapNowFavorites.$inferSelect;

export type InsertSwapNowListing = z.infer<typeof insertSwapNowListingSchema>;
export type InsertSwapNowConversation = z.infer<typeof insertSwapNowConversationSchema>;
export type InsertSwapNowMessage = z.infer<typeof insertSwapNowMessageSchema>;
export type InsertSwapNowOffer = z.infer<typeof insertSwapNowOfferSchema>;
export type InsertSwapNowFavorite = z.infer<typeof insertSwapNowFavoriteSchema>;

// Form Validation Schemas
export const swapNowListingFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["electronics", "furniture", "vehicles", "fashion", "books", "sports", "home", "real_estate_land", "real_estate_rent", "real_estate_buy", "others"]),
  subCategory: z.string().optional(),
  condition: z.enum(["new", "like_new", "good", "fair", "poor"]),
  price: z.number().min(0, "Price must be a positive number"),
  originalPrice: z.number().optional(),
  isNegotiable: z.number().default(1),
  images: z.array(z.string()).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
  coverImageIndex: z.number().default(0),
  location: z.string().min(3, "Location is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  pincode: z.string().optional(),
  brand: z.string().optional(),
  age: z.string().optional(),
  warranty: z.string().optional(),
  accessories: z.string().optional(),
  // Real Estate / Home specific
  totalSquareFeet: z.string().optional(),
  usableSquareFeet: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  nearbyLocations: z.string().optional(),
  furnishingLevel: z.string().optional(),
  usageLevel: z.string().optional(),
  // Electronics specific
  productUsageLevel: z.string().optional(),
  buyDate: z.string().optional(),
  billAvailability: z.string().optional(),
  issues: z.string().optional(),
  attributes: z.record(z.string()).optional(),
});

export const swapNowMessageFormSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  messageType: z.enum(["text", "offer", "image", "system"]).default("text"),
  offerAmount: z.number().optional(),
});

export const swapNowOfferFormSchema = z.object({
  offerAmount: z.number().min(0, "Offer amount must be positive"),
  note: z.string().optional(),
});
