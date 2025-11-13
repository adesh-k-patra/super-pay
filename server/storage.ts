import { 
  type User, 
  type InsertUser, 
  type LoanApplication, 
  type InsertLoanApplication,
  type EmiPayment,
  type InsertEmiPayment,
  type Notification,
  type InsertNotification,
  type Otp,
  type InsertOtp,
  type LoanOffer,
  type InsertLoanOffer,
  type UserFinancialReport,
  type InsertUserFinancialReport,
  type SecurityScan,
  type InsertSecurityScan,
  type CoachInteraction,
  type InsertCoachInteraction,
  type LearningContent,
  type InsertLearningContent,
  type FitnessActivity,
  type InsertFitnessActivity,
  type UserPoints,
  type InsertUserPoints,
  type Creator,
  type InsertCreator,
  type CreatorSession,
  type InsertCreatorSession,
  type Booking,
  type InsertBooking,
  type CreatorReview,
  type InsertCreatorReview,
  type CreatorAvailability,
  type InsertCreatorAvailability,
  type CreatorPayout,
  type InsertCreatorPayout,
  type UpiAccount,
  type InsertUpiAccount,
  type UpiTransaction,
  type InsertUpiTransaction,
  type UpiReward,
  type InsertUpiReward,
  type BillPaymentService,
  type InsertBillPaymentService,
  type InvestmentPortfolio,
  type InsertInvestmentPortfolio,
  type InsurancePolicy,
  type InsertInsurancePolicy,
  type InsurancePremiumPayment,
  type InsurancePremiumPaymentData,
  type InsuranceClaim,
  type InsertInsuranceClaim,
  type Reward,
  type InsertReward,
  type RewardCategory,
  type InsertRewardCategory,
  type RewardRedemption,
  type InsertRewardRedemption,
  type UserWallet,
  type InsertUserWallet,
  type FundTransaction,
  type InsertFundTransaction,
  type StripePayment,
  type InsertStripePayment,
  // New types for financial app redesign
  type PaymentDetail,
  type InsertPaymentDetail,
  type BillPayee,
  type InsertBillPayee,
  type ScheduledBill,
  type InsertScheduledBill,
  type BillReminder,
  type InsertBillReminder,
  type UserProfile,
  type InsertUserProfile,
  type ReferralProgram,
  type InsertReferralProgram,
  type ReferralTransaction,
  type InsertReferralTransaction,
  type BillPaymentHistory,
  type InsertBillPaymentHistory,
  // Travel booking types
  type TravelRoute,
  type InsertTravelRoute,
  type TravelSchedule,
  type InsertTravelSchedule,
  type TravelBooking,
  type InsertTravelBooking,
  type TravelPassenger,
  type InsertTravelPassenger,
  type TravelPayment,
  type InsertTravelPayment,
  type TravelCancellation,
  type InsertTravelCancellation,
  type TravelContract,
  type InsertTravelContract,
  type TravelAddon,
  type InsertTravelAddon,
  type TravelLiveTracking,
  type InsertTravelLiveTracking,
  type BoardingPass,
  type InsertBoardingPass,
  type TravelModification,
  type InsertTravelModification,
  type TravelAlert,
  type InsertTravelAlert,
  type TravelCoupon,
  type InsertTravelCoupon,
  type TravelCouponUsage,
  type InsertTravelCouponUsage,
  // Investment types
  type InvestmentWatchlist,
  type InsertInvestmentWatchlist,
  type InvestmentOrder,
  type InsertInvestmentOrder,
  type InvestmentVendor,
  type InsertInvestmentVendor,
  type MarketData,
  type InsertMarketData,
  // FASTag types
  type UserVehicle,
  type InsertUserVehicle,
  type FastagAccount,
  type InsertFastagAccount,
  type FastagTransaction,
  type InsertFastagTransaction,
  // Profile-related types
  type LoanAmortizationSchedule,
  type InsertLoanAmortizationSchedule,
  type LoanDocument,
  type InsertLoanDocument,
  type SavedCard,
  type InsertSavedCard,
  type CardTransaction,
  type InsertCardTransaction,
  type BankAccount,
  type InsertBankAccount,
  type ActivityLog,
  type InsertActivityLog,
  type StockTrade,
  type InsertStockTrade,
  type FinancialGoal,
  type InsertFinancialGoal,
  type Budget,
  type InsertBudget,
  // New investment types
  type MutualFund,
  type InsertMutualFund,
  type SipInvestment,
  type InsertSipInvestment,
  type SipTransaction,
  type InsertSipTransaction,
  type VendorOffer,
  type InsertVendorOffer,
  type AiPortfolioAllocation,
  type InsertAiPortfolioAllocation,
  type TransactionConfirmation,
  type InsertTransactionConfirmation,
  type TransactionSuccessRecord,
  type InsertTransactionSuccessRecord,
  // Movie booking types
  type Movie,
  type InsertMovie,
  type Theater,
  type InsertTheater,
  type MovieShowtime,
  type InsertMovieShowtime,
  type SeatCategory,
  type InsertSeatCategory,
  type SeatLayout,
  type InsertSeatLayout,
  type SeatHold,
  type InsertSeatHold,
  type MovieBooking,
  type InsertMovieBooking,
  type FoodMenuItem,
  type InsertFoodMenuItem,
  // Event booking types
  type Event,
  type InsertEvent,
  type EventTicketTier,
  type InsertEventTicketTier,
  type EventTicketHold,
  type InsertEventTicketHold,
  type EventBooking,
  type InsertEventBooking,
  // Hotel booking types
  type Hotel,
  type InsertHotel,
  type HotelRoom,
  type InsertHotelRoom,
  type HotelRoomInventory,
  type InsertHotelRoomInventory,
  type HotelBooking,
  type InsertHotelBooking,
  type HotelReview,
  type InsertHotelReview,
  // Metro booking types
  type MetroStation,
  type InsertMetroStation,
  type MetroRoute,
  type InsertMetroRoute,
  type MetroSmartCard,
  type InsertMetroSmartCard,
  type MetroTicket,
  type InsertMetroTicket,
  type MetroTravelHistory,
  type InsertMetroTravelHistory,
  // Rental booking types
  type RentalVehicle,
  type InsertRentalVehicle,
  type RentalLocation,
  type InsertRentalLocation,
  type RentalBooking,
  type InsertRentalBooking,
  type RentalReview,
  type InsertRentalReview,
  type RentalTrip,
  type InsertRentalTrip,
  type RentalTripCheckpoint,
  type InsertRentalTripCheckpoint,
  type RentalDocument,
  type InsertRentalDocument,
  type RentalVehicleInspection,
  type InsertRentalVehicleInspection,
  // TravelVIP types
  type TravelVipMembership,
  type InsertTravelVipMembership,
  type TravelVipBenefitsUsage,
  type InsertTravelVipBenefitsUsage,
  // Credit UPI types
  type CreditUpiAccount,
  type InsertCreditUpiAccount,
  type CreditUpiTransaction,
  type InsertCreditUpiTransaction,
  type CreditUpiRepayment,
  type InsertCreditUpiRepayment,
  type CreditUpiBill,
  type InsertCreditUpiBill,
  // Cash Park types
  type CashParkAccount,
  type InsertCashParkAccount,
  type CashParkJar,
  type InsertCashParkJar,
  type CashParkFdUnit,
  type InsertCashParkFdUnit,
  type CashParkTransaction,
  type InsertCashParkTransaction,
  type TravelVipTransaction,
  type InsertTravelVipTransaction,
  // Family UPI types
  type FamilyUpiAccount,
  type InsertFamilyUpiAccount,
  type FamilyUpiMember,
  type InsertFamilyUpiMember,
  type FamilyUpiTransaction,
  type InsertFamilyUpiTransaction,
  // Credit Card types
  type CreditCardOffer,
  type InsertCreditCardOffer,
  type CreditCardApplication,
  type InsertCreditCardApplication,
  // ShareWise types
  type SharewiseGroup,
  type SharewiseGroupMember,
  type SharewiseExpense,
  type SharewiseExpenseSplit,
  type SharewiseActivity,
  type SharewiseSettlement,
  type InsertSharewiseGroup,
  type InsertSharewiseGroupMember,
  type InsertSharewiseExpense,
  type InsertSharewiseExpenseSplit,
  type InsertSharewiseActivity,
  type InsertSharewiseSettlement,
  // Coupon Mart types
  type CouponMartListing,
  type InsertCouponMartListing,
  type CouponMartTransaction,
  type InsertCouponMartTransaction,
  type CouponMartTradeOffer,
  type InsertCouponMartTradeOffer,
  // SwapNow Marketplace types
  type SwapNowListing,
  type InsertSwapNowListing,
  type SwapNowConversation,
  type InsertSwapNowConversation,
  type SwapNowMessage,
  type InsertSwapNowMessage,
  type SwapNowOffer,
  type InsertSwapNowOffer,
  type SwapNowFavorite,
  type InsertSwapNowFavorite,
  // BookSure Consultant Booking types
  type ConsultantCategory,
  type InsertConsultantCategory,
  type ConsultantProvider,
  type InsertConsultantProvider,
  type ConsultantService,
  type InsertConsultantService,
  type ConsultantBooking,
  type InsertConsultantBooking,
  type ConsultantReview,
  type InsertConsultantReview,
  type ConsultantAvailability,
  type InsertConsultantAvailability
} from "@shared/schema";
import { randomUUID } from "crypto";
import { 
  ShareWiseStorage, 
  type MemberBalance, 
  type SettlementSuggestion, 
  type GroupWithMembers, 
  type ExpenseWithSplits 
} from "./storage/sharewise";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Loan application operations
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  updateLoanApplication(id: string, application: Partial<LoanApplication>): Promise<LoanApplication | undefined>;
  
  // EMI payment operations
  getEmiPaymentsByLoan(loanId: string): Promise<EmiPayment[]>;
  createEmiPayment(payment: InsertEmiPayment): Promise<EmiPayment>;
  
  // Notification operations
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // OTP operations
  createOtp(otp: InsertOtp): Promise<Otp>;
  getOtpByPhone(phone: string): Promise<Otp | undefined>;
  getValidOtpByPhoneAndCode(phone: string, code: string): Promise<Otp | undefined>;
  markOtpAsUsed(id: string): Promise<void>;
  incrementOtpAttempts(id: string): Promise<void>;
  cleanupExpiredOtps(): Promise<void>;
  
  // Loan marketplace operations
  getLoanOffers(filters?: { loanType?: string; minAmount?: number; maxAmount?: number }): Promise<LoanOffer[]>;
  getLoanOffer(id: string): Promise<LoanOffer | undefined>;
  createLoanOffer(offer: InsertLoanOffer): Promise<LoanOffer>;
  
  // Financial report operations
  getUserFinancialReport(userId: string): Promise<UserFinancialReport | undefined>;
  createUserFinancialReport(report: InsertUserFinancialReport): Promise<UserFinancialReport>;
  updateUserFinancialReport(userId: string, report: Partial<UserFinancialReport>): Promise<UserFinancialReport | undefined>;
  
  // Security scan operations
  getSecurityScansByUser(userId: string): Promise<SecurityScan[]>;
  createSecurityScan(scan: InsertSecurityScan): Promise<SecurityScan>;
  
  // Coach interaction operations
  getCoachInteractionsByUser(userId: string): Promise<CoachInteraction[]>;
  createCoachInteraction(interaction: InsertCoachInteraction): Promise<CoachInteraction>;
  
  // Learning content operations
  getLearningContent(filters?: { contentType?: string; tags?: string[] }): Promise<LearningContent[]>;
  getLearningContentById(id: string): Promise<LearningContent | undefined>;
  
  // Fitness and points operations
  getUserPoints(userId: string): Promise<UserPoints | undefined>;
  createUserPoints(points: InsertUserPoints): Promise<UserPoints>;
  updateUserPoints(userId: string, points: Partial<UserPoints>): Promise<UserPoints | undefined>;
  getFitnessActivitiesByUser(userId: string): Promise<FitnessActivity[]>;
  createFitnessActivity(activity: InsertFitnessActivity): Promise<FitnessActivity>;
  
  // Creator Connect operations
  getCreators(filters?: { expertise?: string; isVerified?: boolean; isActive?: boolean }): Promise<Creator[]>;
  getCreator(id: string): Promise<Creator | undefined>;
  getCreatorByUserId(userId: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  updateCreator(id: string, creator: Partial<Creator>): Promise<Creator | undefined>;
  
  // Creator sessions operations
  getCreatorSessions(creatorId: string): Promise<CreatorSession[]>;
  getCreatorSession(id: string): Promise<CreatorSession | undefined>;
  createCreatorSession(session: InsertCreatorSession): Promise<CreatorSession>;
  updateCreatorSession(id: string, session: Partial<CreatorSession>): Promise<CreatorSession | undefined>;
  
  // Booking operations
  getBookings(filters?: { userId?: string; creatorId?: string; status?: string }): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByCreator(creatorId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
  
  // Creator reviews operations
  getCreatorReviews(creatorId: string): Promise<CreatorReview[]>;
  getCreatorReview(id: string): Promise<CreatorReview | undefined>;
  createCreatorReview(review: InsertCreatorReview): Promise<CreatorReview>;
  
  // Creator availability operations
  getCreatorAvailability(creatorId: string): Promise<CreatorAvailability[]>;
  createCreatorAvailability(availability: InsertCreatorAvailability): Promise<CreatorAvailability>;
  updateCreatorAvailability(id: string, availability: Partial<CreatorAvailability>): Promise<CreatorAvailability | undefined>;
  deleteCreatorAvailability(id: string): Promise<void>;
  
  // Creator payout operations
  getCreatorPayouts(creatorId: string): Promise<CreatorPayout[]>;
  createCreatorPayout(payout: InsertCreatorPayout): Promise<CreatorPayout>;
  updateCreatorPayout(id: string, payout: Partial<CreatorPayout>): Promise<CreatorPayout | undefined>;
  
  // UPI Account operations
  getUpiAccountsByUser(userId: string): Promise<UpiAccount[]>;
  getUpiAccount(id: string): Promise<UpiAccount | undefined>;
  getUpiAccountByUpiId(upiId: string): Promise<UpiAccount | undefined>;
  createUpiAccount(account: InsertUpiAccount): Promise<UpiAccount>;
  updateUpiAccount(id: string, account: Partial<UpiAccount>): Promise<UpiAccount | undefined>;
  
  // UPI Transaction operations
  getUpiTransactionsByUser(userId: string): Promise<UpiTransaction[]>;
  getUpiTransaction(id: string): Promise<UpiTransaction | undefined>;
  createUpiTransaction(transaction: InsertUpiTransaction): Promise<UpiTransaction>;
  updateUpiTransaction(id: string, transaction: Partial<UpiTransaction>): Promise<UpiTransaction | undefined>;
  
  // UPI Reward operations
  getUpiRewardsByUser(userId: string): Promise<UpiReward[]>;
  createUpiReward(reward: InsertUpiReward): Promise<UpiReward>;
  
  // Family UPI (Shared UPI) operations
  getFamilyUpiAccountsByUser(userId: string): Promise<FamilyUpiAccount[]>;
  getFamilyUpiAccount(id: string): Promise<FamilyUpiAccount | undefined>;
  createFamilyUpiAccount(account: InsertFamilyUpiAccount): Promise<FamilyUpiAccount>;
  updateFamilyUpiAccount(id: string, account: Partial<FamilyUpiAccount>): Promise<FamilyUpiAccount | undefined>;
  deleteFamilyUpiAccount(id: string): Promise<void>;
  
  // Family UPI Members operations
  getFamilyUpiMembersByAccount(familyAccountId: string): Promise<FamilyUpiMember[]>;
  getFamilyUpiMember(id: string): Promise<FamilyUpiMember | undefined>;
  createFamilyUpiMember(member: InsertFamilyUpiMember): Promise<FamilyUpiMember>;
  updateFamilyUpiMember(id: string, member: Partial<FamilyUpiMember>): Promise<FamilyUpiMember | undefined>;
  deleteFamilyUpiMember(id: string): Promise<void>;
  
  // Family UPI Transaction operations
  getFamilyUpiTransactionsByAccount(familyAccountId: string): Promise<FamilyUpiTransaction[]>;
  getFamilyUpiTransaction(id: string): Promise<FamilyUpiTransaction | undefined>;
  createFamilyUpiTransaction(transaction: InsertFamilyUpiTransaction): Promise<FamilyUpiTransaction>;
  
  // Family UPI Detail & Analytics operations
  getFamilyUpiAccountDetails(accountId: string): Promise<{
    account: FamilyUpiAccount;
    stats: {
      totalTransactions: number;
      successfulTransactions: number;
      failedTransactions: number;
      totalSpent: string;
      dailySpent: string;
      monthlySpent: string;
      limitUtilization: number;
    };
    recentTransactions: Array<FamilyUpiTransaction & { memberName: string }>;
  } | undefined>;
  getFamilyUpiTransactionsWithMembers(accountId: string): Promise<Array<FamilyUpiTransaction & { memberName: string; approverName?: string }>>;
  getFamilyUpiMemberAnalytics(accountId: string): Promise<Array<{
    member: FamilyUpiMember;
    stats: {
      totalTransactions: number;
      totalSpent: string;
      avgTransactionAmount: string;
      todayTransactions: number;
      todaySpent: string;
      last7DaysTransactions: number;
      last7DaysSpent: string;
      transactionsByDay: Array<{ date: string; count: number; amount: string }>;
    };
  }>>;
  
  // Bill Payment Service operations
  getBillPaymentServices(serviceType?: string): Promise<BillPaymentService[]>;
  getBillPaymentService(id: string): Promise<BillPaymentService | undefined>;
  
  // Investment Portfolio operations
  getInvestmentPortfolioByUser(userId: string): Promise<InvestmentPortfolio[]>;
  getInvestmentPortfolio(id: string): Promise<InvestmentPortfolio | undefined>;
  createInvestmentPortfolio(investment: InsertInvestmentPortfolio): Promise<InvestmentPortfolio>;
  updateInvestmentPortfolio(id: string, investment: Partial<InvestmentPortfolio>): Promise<InvestmentPortfolio | undefined>;

  // Insurance operations
  getInsurancePoliciesByUser(userId: string): Promise<InsurancePolicy[]>;
  getInsurancePolicy(id: string): Promise<InsurancePolicy | undefined>;
  createInsurancePolicy(policy: InsertInsurancePolicy): Promise<InsurancePolicy>;
  updateInsurancePolicy(id: string, policy: Partial<InsurancePolicy>): Promise<InsurancePolicy | undefined>;
  
  // Insurance Premium Payment operations
  getInsurancePremiumPaymentsByUser(userId: string): Promise<InsurancePremiumPayment[]>;
  getInsurancePremiumPaymentsByPolicy(policyId: string): Promise<InsurancePremiumPayment[]>;
  createInsurancePremiumPayment(paymentData: InsurancePremiumPaymentData & { userId: string; policyId: string }): Promise<InsurancePremiumPayment>;
  
  // Insurance Claims operations
  getInsuranceClaimsByUser(userId: string): Promise<InsuranceClaim[]>;
  getInsuranceClaimsByPolicy(policyId: string): Promise<InsuranceClaim[]>;
  getInsuranceClaim(id: string): Promise<InsuranceClaim | undefined>;
  createInsuranceClaim(claim: InsertInsuranceClaim & { userId: string }): Promise<InsuranceClaim>;
  updateInsuranceClaim(id: string, claim: Partial<InsuranceClaim>): Promise<InsuranceClaim | undefined>;
  
  // Reward operations
  getRewards(filters?: { category?: string; isActive?: boolean }): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateReward(id: string, reward: Partial<Reward>): Promise<Reward | undefined>;
  
  // Reward category operations
  getRewardCategories(): Promise<RewardCategory[]>;
  getRewardCategory(id: string): Promise<RewardCategory | undefined>;
  createRewardCategory(category: InsertRewardCategory): Promise<RewardCategory>;
  
  // Reward redemption operations
  getRewardRedemptionsByUser(userId: string): Promise<RewardRedemption[]>;
  getRewardRedemption(id: string): Promise<RewardRedemption | undefined>;
  createRewardRedemption(redemption: InsertRewardRedemption): Promise<RewardRedemption>;
  updateRewardRedemption(id: string, redemption: Partial<RewardRedemption>): Promise<RewardRedemption | undefined>;
  
  // Fund Management operations
  getUserWallet(userId: string): Promise<UserWallet | undefined>;
  createUserWallet(wallet: InsertUserWallet): Promise<UserWallet>;
  updateUserWallet(userId: string, wallet: Partial<UserWallet>): Promise<UserWallet | undefined>;
  
  // Fund Transaction operations
  getFundTransactionsByUser(userId: string): Promise<FundTransaction[]>;
  getFundTransaction(id: string): Promise<FundTransaction | undefined>;
  createFundTransaction(transaction: InsertFundTransaction): Promise<FundTransaction>;
  updateFundTransaction(id: string, transaction: Partial<FundTransaction>): Promise<FundTransaction | undefined>;
  
  // Stripe Payment operations
  getStripePaymentsByUser(userId: string): Promise<StripePayment[]>;
  getStripePayment(id: string): Promise<StripePayment | undefined>;
  getStripePaymentByIntentId(intentId: string): Promise<StripePayment | undefined>;
  createStripePayment(payment: InsertStripePayment): Promise<StripePayment>;
  updateStripePayment(id: string, payment: Partial<StripePayment>): Promise<StripePayment | undefined>;
  
  // Payment Detail operations (unified payment history)
  getPaymentDetailsByUser(userId: string): Promise<PaymentDetail[]>;
  getPaymentDetail(id: string): Promise<PaymentDetail | undefined>;
  getPaymentDetailByTransactionId(transactionId: string): Promise<PaymentDetail | undefined>;
  createPaymentDetail(payment: InsertPaymentDetail): Promise<PaymentDetail>;
  updatePaymentDetail(id: string, payment: Partial<PaymentDetail>): Promise<PaymentDetail | undefined>;
  
  // Bill Payee operations
  getBillPayeesByUser(userId: string): Promise<BillPayee[]>;
  getBillPayee(id: string): Promise<BillPayee | undefined>;
  createBillPayee(payee: InsertBillPayee): Promise<BillPayee>;
  updateBillPayee(id: string, payee: Partial<BillPayee>): Promise<BillPayee | undefined>;
  deleteBillPayee(id: string): Promise<void>;
  
  // Scheduled Bill operations
  getScheduledBillsByUser(userId: string): Promise<ScheduledBill[]>;
  getScheduledBill(id: string): Promise<ScheduledBill | undefined>;
  getScheduledBillsByPayee(payeeId: string): Promise<ScheduledBill[]>;
  createScheduledBill(scheduledBill: InsertScheduledBill): Promise<ScheduledBill>;
  updateScheduledBill(id: string, scheduledBill: Partial<ScheduledBill>): Promise<ScheduledBill | undefined>;
  deleteScheduledBill(id: string): Promise<void>;
  
  // Bill Reminder operations
  getBillRemindersByUser(userId: string): Promise<BillReminder[]>;
  getBillReminder(id: string): Promise<BillReminder | undefined>;
  getBillRemindersByScheduledBill(scheduledBillId: string): Promise<BillReminder[]>;
  createBillReminder(reminder: InsertBillReminder): Promise<BillReminder>;
  updateBillReminder(id: string, reminder: Partial<BillReminder>): Promise<BillReminder | undefined>;
  markBillReminderAsRead(id: string): Promise<void>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | undefined>;
  
  // Referral Program operations
  getReferralProgramByUser(userId: string): Promise<ReferralProgram | undefined>;
  getReferralProgram(id: string): Promise<ReferralProgram | undefined>;
  createReferralProgram(program: InsertReferralProgram): Promise<ReferralProgram>;
  updateReferralProgram(userId: string, program: Partial<ReferralProgram>): Promise<ReferralProgram | undefined>;
  
  // Referral Transaction operations
  getReferralTransactionsByUser(userId: string): Promise<ReferralTransaction[]>;
  getReferralTransactionsByReferrer(referrerId: string): Promise<ReferralTransaction[]>;
  createReferralTransaction(transaction: InsertReferralTransaction): Promise<ReferralTransaction>;
  updateReferralTransaction(id: string, transaction: Partial<ReferralTransaction>): Promise<ReferralTransaction | undefined>;
  
  // Bill Payment History operations (already exists but ensuring it's here)
  getBillPaymentHistoryByUser(userId: string): Promise<BillPaymentHistory[]>;
  getBillPaymentHistory(id: string): Promise<BillPaymentHistory | undefined>;
  createBillPaymentHistory(payment: InsertBillPaymentHistory): Promise<BillPaymentHistory>;
  updateBillPaymentHistory(id: string, payment: Partial<BillPaymentHistory>): Promise<BillPaymentHistory | undefined>;
  
  // Travel Routes operations
  getTravelRoutes(filters?: { serviceType?: string; fromLocation?: string; toLocation?: string }): Promise<TravelRoute[]>;
  getTravelRoute(id: string): Promise<TravelRoute | undefined>;
  createTravelRoute(route: InsertTravelRoute): Promise<TravelRoute>;
  
  // Travel Schedules operations
  getTravelSchedules(routeId: string): Promise<TravelSchedule[]>;
  getTravelSchedule(id: string): Promise<TravelSchedule | undefined>;
  createTravelSchedule(schedule: InsertTravelSchedule): Promise<TravelSchedule>;
  searchTravelSchedules(filters: { serviceType: string; fromLocation: string; toLocation: string; departureDate: string }): Promise<TravelSchedule[]>;
  
  // Travel Bookings operations
  getTravelBookingsByUser(userId: string): Promise<TravelBooking[]>;
  getTravelBooking(id: string): Promise<TravelBooking | undefined>;
  createTravelBooking(booking: InsertTravelBooking): Promise<TravelBooking>;
  updateTravelBooking(id: string, booking: Partial<TravelBooking>): Promise<TravelBooking | undefined>;
  
  // Travel Passengers operations
  getTravelPassengersByBooking(bookingId: string): Promise<TravelPassenger[]>;
  createTravelPassenger(passenger: InsertTravelPassenger): Promise<TravelPassenger>;
  
  // Travel Payments operations
  getTravelPaymentsByBooking(bookingId: string): Promise<TravelPayment[]>;
  createTravelPayment(payment: InsertTravelPayment): Promise<TravelPayment>;
  
  // Travel Contracts operations
  getTravelContractsByUser(userId: string): Promise<TravelContract[]>;
  getTravelContract(id: string): Promise<TravelContract | undefined>;
  createTravelContract(contract: InsertTravelContract): Promise<TravelContract>;
  updateTravelContract(id: string, contract: Partial<TravelContract>): Promise<TravelContract | undefined>;
  deleteTravelContract(id: string): Promise<void>;
  
  // Travel Add-ons operations
  getTravelAddonsByBooking(bookingId: string): Promise<TravelAddon[]>;
  createTravelAddon(addon: InsertTravelAddon): Promise<TravelAddon>;
  updateTravelAddon(id: string, addon: Partial<TravelAddon>): Promise<TravelAddon | undefined>;
  deleteTravelAddon(id: string): Promise<void>;
  
  // Travel Live Tracking operations
  getTravelLiveTrackingByBooking(bookingId: string): Promise<TravelLiveTracking | undefined>;
  createTravelLiveTracking(tracking: InsertTravelLiveTracking): Promise<TravelLiveTracking>;
  updateTravelLiveTracking(id: string, tracking: Partial<TravelLiveTracking>): Promise<TravelLiveTracking | undefined>;
  deleteTravelLiveTracking(id: string): Promise<void>;
  
  // Boarding Pass operations
  getBoardingPassesByBooking(bookingId: string): Promise<BoardingPass[]>;
  getBoardingPassByPassenger(passengerId: string): Promise<BoardingPass | undefined>;
  createBoardingPass(pass: InsertBoardingPass): Promise<BoardingPass>;
  updateBoardingPass(id: string, pass: Partial<BoardingPass>): Promise<BoardingPass | undefined>;
  deleteBoardingPass(id: string): Promise<void>;
  
  // Travel Modifications operations
  getTravelModificationsByBooking(bookingId: string): Promise<TravelModification[]>;
  getTravelModification(id: string): Promise<TravelModification | undefined>;
  createTravelModification(modification: InsertTravelModification): Promise<TravelModification>;
  updateTravelModification(id: string, modification: Partial<TravelModification>): Promise<TravelModification | undefined>;
  deleteTravelModification(id: string): Promise<void>;
  
  // Travel Alerts operations
  getTravelAlertsByBooking(bookingId: string): Promise<TravelAlert[]>;
  getTravelAlertsBySchedule(scheduleId: string): Promise<TravelAlert[]>;
  getActiveTravelAlerts(): Promise<TravelAlert[]>;
  createTravelAlert(alert: InsertTravelAlert): Promise<TravelAlert>;
  updateTravelAlert(id: string, alert: Partial<TravelAlert>): Promise<TravelAlert | undefined>;
  deleteTravelAlert(id: string): Promise<void>;
  
  // Travel Coupon operations
  getTravelCouponByCode(code: string): Promise<TravelCoupon | undefined>;
  getActiveTravelCoupons(serviceType: string): Promise<TravelCoupon[]>;
  createTravelCoupon(coupon: InsertTravelCoupon): Promise<TravelCoupon>;
  incrementTravelCouponUsage(couponId: string): Promise<void>;
  
  // Travel Coupon Usage operations
  createTravelCouponUsage(usage: InsertTravelCouponUsage): Promise<TravelCouponUsage>;
  getUserTravelCouponUsage(userId: string): Promise<TravelCouponUsage[]>;
  getUserTravelCouponUsageCount(couponId: string, userId: string): Promise<number>;
  
  // Investment Watchlist operations
  getWatchlistByUser(userId: string): Promise<InvestmentWatchlist[]>;
  getWatchlistItem(id: string): Promise<InvestmentWatchlist | undefined>;
  addToWatchlist(item: InsertInvestmentWatchlist): Promise<InvestmentWatchlist>;
  removeFromWatchlist(id: string): Promise<void>;
  updateWatchlistItem(id: string, item: Partial<InvestmentWatchlist>): Promise<InvestmentWatchlist | undefined>;
  
  // Investment Order operations
  getOrdersByUser(userId: string): Promise<InvestmentOrder[]>;
  getOrder(id: string): Promise<InvestmentOrder | undefined>;
  createOrder(order: InsertInvestmentOrder): Promise<InvestmentOrder>;
  updateOrder(id: string, order: Partial<InvestmentOrder>): Promise<InvestmentOrder | undefined>;
  
  // Investment Vendor operations
  getVendors(filters?: { assetType?: string; isActive?: number }): Promise<InvestmentVendor[]>;
  getVendor(id: string): Promise<InvestmentVendor | undefined>;
  createVendor(vendor: InsertInvestmentVendor): Promise<InvestmentVendor>;
  updateVendor(id: string, vendor: Partial<InvestmentVendor>): Promise<InvestmentVendor | undefined>;
  
  // Market Data operations
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  getAllMarketData(filters?: { assetType?: string }): Promise<MarketData[]>;
  upsertMarketData(data: InsertMarketData): Promise<MarketData>;
  
  // User Vehicle operations
  getVehiclesByUser(userId: string): Promise<UserVehicle[]>;
  getVehicle(id: string): Promise<UserVehicle | undefined>;
  createVehicle(vehicle: InsertUserVehicle): Promise<UserVehicle>;
  updateVehicle(id: string, vehicle: Partial<UserVehicle>): Promise<UserVehicle | undefined>;
  deleteVehicle(id: string): Promise<void>;
  
  // FASTag Account operations
  getFastagAccountsByUser(userId: string): Promise<FastagAccount[]>;
  getFastagAccount(id: string): Promise<FastagAccount | undefined>;
  getFastagAccountByVehicle(vehicleId: string): Promise<FastagAccount | undefined>;
  createFastagAccount(account: InsertFastagAccount): Promise<FastagAccount>;
  updateFastagAccount(id: string, account: Partial<FastagAccount>): Promise<FastagAccount | undefined>;
  
  // FASTag Transaction operations
  getFastagTransactionsByUser(userId: string): Promise<FastagTransaction[]>;
  getFastagTransactionsByAccount(accountId: string): Promise<FastagTransaction[]>;
  createFastagTransaction(transaction: InsertFastagTransaction): Promise<FastagTransaction>;
  
  // Loan Amortization Schedule operations
  getAmortizationScheduleByLoan(loanId: string): Promise<LoanAmortizationSchedule[]>;
  getAmortizationScheduleItem(id: string): Promise<LoanAmortizationSchedule | undefined>;
  createAmortizationSchedule(schedule: InsertLoanAmortizationSchedule): Promise<LoanAmortizationSchedule>;
  updateAmortizationSchedule(id: string, schedule: Partial<LoanAmortizationSchedule>): Promise<LoanAmortizationSchedule | undefined>;
  
  // Loan Document operations
  getLoanDocumentsByLoan(loanId: string): Promise<LoanDocument[]>;
  getLoanDocument(id: string): Promise<LoanDocument | undefined>;
  createLoanDocument(document: InsertLoanDocument): Promise<LoanDocument>;
  updateLoanDocument(id: string, document: Partial<LoanDocument>): Promise<LoanDocument | undefined>;
  deleteLoanDocument(id: string): Promise<void>;
  
  // Saved Card operations
  getSavedCardsByUser(userId: string): Promise<SavedCard[]>;
  getSavedCard(id: string): Promise<SavedCard | undefined>;
  createSavedCard(card: InsertSavedCard): Promise<SavedCard>;
  updateSavedCard(id: string, card: Partial<SavedCard>): Promise<SavedCard | undefined>;
  deleteSavedCard(id: string): Promise<void>;
  
  // Card Transaction operations
  getCardTransactionsByCard(cardId: string): Promise<CardTransaction[]>;
  getCardTransactionsByUser(userId: string): Promise<CardTransaction[]>;
  getCardTransaction(id: string): Promise<CardTransaction | undefined>;
  createCardTransaction(transaction: InsertCardTransaction): Promise<CardTransaction>;
  updateCardTransaction(id: string, transaction: Partial<CardTransaction>): Promise<CardTransaction | undefined>;
  
  // Bank Account operations
  getBankAccountsByUser(userId: string): Promise<BankAccount[]>;
  getBankAccount(id: string): Promise<BankAccount | undefined>;
  createBankAccount(account: InsertBankAccount): Promise<BankAccount>;
  updateBankAccount(id: string, account: Partial<BankAccount>): Promise<BankAccount | undefined>;
  deleteBankAccount(id: string): Promise<void>;
  
  // Activity Log operations
  getActivityLogsByUser(userId: string): Promise<ActivityLog[]>;
  getActivityLog(id: string): Promise<ActivityLog | undefined>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivityByUser(userId: string, limit: number): Promise<ActivityLog[]>;
  getSuspiciousActivityByUser(userId: string): Promise<ActivityLog[]>;
  
  // Stock Trade operations
  getStockTradesByUser(userId: string): Promise<StockTrade[]>;
  getStockTradesBySymbol(userId: string, symbol: string): Promise<StockTrade[]>;
  getStockTrade(id: string): Promise<StockTrade | undefined>;
  createStockTrade(trade: InsertStockTrade): Promise<StockTrade>;
  updateStockTrade(id: string, trade: Partial<StockTrade>): Promise<StockTrade | undefined>;
  
  // Financial Goal operations
  getFinancialGoalsByUser(userId: string): Promise<FinancialGoal[]>;
  getFinancialGoal(id: string): Promise<FinancialGoal | undefined>;
  createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal>;
  updateFinancialGoal(id: string, goal: Partial<FinancialGoal>): Promise<FinancialGoal | undefined>;
  deleteFinancialGoal(id: string): Promise<void>;
  
  // Budget operations
  getBudgetsByUser(userId: string): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | undefined>;
  getBudgetsByCategory(userId: string, category: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<Budget>): Promise<Budget | undefined>;
  deleteBudget(id: string): Promise<void>;

  // Mutual Fund operations
  getMutualFunds(filters?: { fundType?: string; category?: string; isActive?: number }): Promise<MutualFund[]>;
  getMutualFund(id: string): Promise<MutualFund | undefined>;
  getMutualFundByCode(fundCode: string): Promise<MutualFund | undefined>;
  createMutualFund(fund: InsertMutualFund): Promise<MutualFund>;
  updateMutualFund(id: string, fund: Partial<MutualFund>): Promise<MutualFund | undefined>;

  // SIP Investment operations
  getSipInvestmentsByUser(userId: string): Promise<SipInvestment[]>;
  getSipInvestmentsByFund(fundId: string): Promise<SipInvestment[]>;
  getSipInvestment(id: string): Promise<SipInvestment | undefined>;
  createSipInvestment(sip: InsertSipInvestment): Promise<SipInvestment>;
  updateSipInvestment(id: string, sip: Partial<SipInvestment>): Promise<SipInvestment | undefined>;

  // SIP Transaction operations
  getSipTransactionsBySip(sipId: string): Promise<SipTransaction[]>;
  getSipTransactionsByUser(userId: string): Promise<SipTransaction[]>;
  getSipTransaction(id: string): Promise<SipTransaction | undefined>;
  createSipTransaction(transaction: InsertSipTransaction): Promise<SipTransaction>;
  updateSipTransaction(id: string, transaction: Partial<SipTransaction>): Promise<SipTransaction | undefined>;

  // Vendor Offer operations
  getVendorOffers(filters?: { assetType?: string; vendorId?: string; isActive?: number }): Promise<VendorOffer[]>;
  getVendorOffer(id: string): Promise<VendorOffer | undefined>;
  createVendorOffer(offer: InsertVendorOffer): Promise<VendorOffer>;
  updateVendorOffer(id: string, offer: Partial<VendorOffer>): Promise<VendorOffer | undefined>;

  // AI Portfolio Allocation operations
  getAiPortfolioAllocationsByUser(userId: string): Promise<AiPortfolioAllocation[]>;
  getAiPortfolioAllocation(id: string): Promise<AiPortfolioAllocation | undefined>;
  createAiPortfolioAllocation(allocation: InsertAiPortfolioAllocation): Promise<AiPortfolioAllocation>;
  updateAiPortfolioAllocation(id: string, allocation: Partial<AiPortfolioAllocation>): Promise<AiPortfolioAllocation | undefined>;

  // Transaction Confirmation operations
  getTransactionConfirmationsByUser(userId: string): Promise<TransactionConfirmation[]>;
  getTransactionConfirmation(id: string): Promise<TransactionConfirmation | undefined>;
  getTransactionConfirmationByOrder(orderId: string): Promise<TransactionConfirmation | undefined>;
  createTransactionConfirmation(confirmation: InsertTransactionConfirmation): Promise<TransactionConfirmation>;
  
  // Transaction Success Records operations
  getTransactionSuccessRecordsByUser(userId: string): Promise<TransactionSuccessRecord[]>;
  getTransactionSuccessRecord(id: string): Promise<TransactionSuccessRecord | undefined>;
  createTransactionSuccessRecord(record: InsertTransactionSuccessRecord): Promise<TransactionSuccessRecord>;

  // Movie Booking operations
  getMovies(filters?: { genre?: string; language?: string; city?: string }): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  getTheaters(filters?: { city?: string; movieId?: string }): Promise<Theater[]>;
  getTheater(id: string): Promise<Theater | undefined>;
  createTheater(theater: InsertTheater): Promise<Theater>;
  
  getMovieShowtimes(filters?: { movieId?: string; theaterId?: string; date?: string }): Promise<(MovieShowtime & { theater: Theater })[]>;
  getMovieShowtime(id: string): Promise<MovieShowtime | undefined>;
  createMovieShowtime(showtime: InsertMovieShowtime): Promise<MovieShowtime>;
  updateMovieShowtime(id: string, showtime: Partial<MovieShowtime>): Promise<MovieShowtime | undefined>;
  
  getSeatCategoriesByShowtime(showtimeId: string): Promise<SeatCategory[]>;
  getSeatCategory(id: string): Promise<SeatCategory | undefined>;
  createSeatCategory(category: InsertSeatCategory): Promise<SeatCategory>;
  updateSeatCategory(id: string, category: Partial<SeatCategory>): Promise<SeatCategory | undefined>;
  
  getSeatLayoutByShowtime(showtimeId: string): Promise<SeatLayout[]>;
  getSeatLayout(id: string): Promise<SeatLayout | undefined>;
  createSeatLayout(seat: InsertSeatLayout): Promise<SeatLayout>;
  updateSeatLayout(id: string, seat: Partial<SeatLayout>): Promise<SeatLayout | undefined>;
  
  getSeatHoldsByUser(userId: string): Promise<SeatHold[]>;
  getSeatHold(id: string): Promise<SeatHold | undefined>;
  createSeatHold(hold: InsertSeatHold): Promise<SeatHold>;
  deleteSeatHold(id: string): Promise<void>;
  deleteExpiredSeatHolds(): Promise<void>;
  
  getMovieBookingsByUser(userId: string): Promise<MovieBooking[]>;
  getMovieBooking(id: string): Promise<MovieBooking | undefined>;
  getMovieBookingByReference(bookingReference: string): Promise<MovieBooking | undefined>;
  createMovieBooking(booking: InsertMovieBooking): Promise<MovieBooking>;
  updateMovieBooking(id: string, booking: Partial<MovieBooking>): Promise<MovieBooking | undefined>;
  
  getFoodMenuByTheater(theaterId: string): Promise<FoodMenuItem[]>;
  getFoodMenuItem(id: string): Promise<FoodMenuItem | undefined>;
  createFoodMenuItem(item: InsertFoodMenuItem): Promise<FoodMenuItem>;

  // Event Booking operations
  getEvents(filters?: { category?: string; city?: string; date?: string }): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined>;
  
  getEventTicketTiersByEvent(eventId: string): Promise<EventTicketTier[]>;
  getEventTicketTier(id: string): Promise<EventTicketTier | undefined>;
  createEventTicketTier(tier: InsertEventTicketTier): Promise<EventTicketTier>;
  updateEventTicketTier(id: string, tier: Partial<EventTicketTier>): Promise<EventTicketTier | undefined>;
  
  getEventTicketHoldsByUser(userId: string): Promise<EventTicketHold[]>;
  createEventTicketHold(hold: InsertEventTicketHold): Promise<EventTicketHold>;
  deleteEventTicketHold(id: string): Promise<void>;
  deleteExpiredEventTicketHolds(): Promise<void>;
  
  getEventBookingsByUser(userId: string): Promise<EventBooking[]>;
  getEventBooking(id: string): Promise<EventBooking | undefined>;
  getEventBookingByReference(bookingReference: string): Promise<EventBooking | undefined>;
  createEventBooking(booking: InsertEventBooking): Promise<EventBooking>;
  updateEventBooking(id: string, booking: Partial<EventBooking>): Promise<EventBooking | undefined>;

  // Hotel Booking operations
  getHotels(filters?: { city?: string; propertyType?: string; minPrice?: number; maxPrice?: number }): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: string, hotel: Partial<Hotel>): Promise<Hotel | undefined>;
  
  getHotelRoomsByHotel(hotelId: string): Promise<HotelRoom[]>;
  getHotelRoom(id: string): Promise<HotelRoom | undefined>;
  createHotelRoom(room: InsertHotelRoom): Promise<HotelRoom>;
  updateHotelRoom(id: string, room: Partial<HotelRoom>): Promise<HotelRoom | undefined>;
  
  getHotelRoomInventory(roomId: string, date: string): Promise<HotelRoomInventory | undefined>;
  getHotelRoomInventoryRange(roomId: string, startDate: string, endDate: string): Promise<HotelRoomInventory[]>;
  createHotelRoomInventory(inventory: InsertHotelRoomInventory): Promise<HotelRoomInventory>;
  updateHotelRoomInventory(id: string, inventory: Partial<HotelRoomInventory>): Promise<HotelRoomInventory | undefined>;
  
  getHotelBookingsByUser(userId: string): Promise<HotelBooking[]>;
  getHotelBooking(id: string): Promise<HotelBooking | undefined>;
  getHotelBookingByReference(bookingReference: string): Promise<HotelBooking | undefined>;
  createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking>;
  updateHotelBooking(id: string, booking: Partial<HotelBooking>): Promise<HotelBooking | undefined>;
  
  getHotelReviewsByHotel(hotelId: string): Promise<HotelReview[]>;
  getHotelReviewsByUser(userId: string): Promise<HotelReview[]>;
  createHotelReview(review: InsertHotelReview): Promise<HotelReview>;

  // Metro Booking operations
  getMetroStations(filters?: { city?: string; metroLine?: string }): Promise<MetroStation[]>;
  getMetroStation(id: string): Promise<MetroStation | undefined>;
  getMetroStationByCode(stationCode: string): Promise<MetroStation | undefined>;
  createMetroStation(station: InsertMetroStation): Promise<MetroStation>;
  updateMetroStation(id: string, station: Partial<MetroStation>): Promise<MetroStation | undefined>;

  getMetroRoutes(filters?: { fromStationId?: string; toStationId?: string; metroLine?: string }): Promise<MetroRoute[]>;
  getMetroRoute(id: string): Promise<MetroRoute | undefined>;
  searchMetroRoutes(fromStationId: string, toStationId: string): Promise<MetroRoute[]>;
  createMetroRoute(route: InsertMetroRoute): Promise<MetroRoute>;
  updateMetroRoute(id: string, route: Partial<MetroRoute>): Promise<MetroRoute | undefined>;

  getMetroSmartCardsByUser(userId: string): Promise<MetroSmartCard[]>;
  getMetroSmartCard(id: string): Promise<MetroSmartCard | undefined>;
  getMetroSmartCardByNumber(cardNumber: string): Promise<MetroSmartCard | undefined>;
  createMetroSmartCard(card: InsertMetroSmartCard): Promise<MetroSmartCard>;
  updateMetroSmartCard(id: string, card: Partial<MetroSmartCard>): Promise<MetroSmartCard | undefined>;

  getMetroTicketsByUser(userId: string): Promise<MetroTicket[]>;
  getMetroTicket(id: string): Promise<MetroTicket | undefined>;
  getMetroTicketByReference(ticketReference: string): Promise<MetroTicket | undefined>;
  createMetroTicket(ticket: InsertMetroTicket): Promise<MetroTicket>;
  updateMetroTicket(id: string, ticket: Partial<MetroTicket>): Promise<MetroTicket | undefined>;

  getMetroTravelHistoryByUser(userId: string): Promise<MetroTravelHistory[]>;
  getMetroTravelHistoryByTicket(ticketId: string): Promise<MetroTravelHistory[]>;
  getMetroTravelHistoryBySmartCard(smartCardId: string): Promise<MetroTravelHistory[]>;
  createMetroTravelHistory(history: InsertMetroTravelHistory): Promise<MetroTravelHistory>;

  // Rental Booking operations
  getRentalVehicles(filters?: { vehicleType?: string; city?: string; category?: string; status?: string }): Promise<RentalVehicle[]>;
  getRentalVehicle(id: string): Promise<RentalVehicle | undefined>;
  createRentalVehicle(vehicle: InsertRentalVehicle): Promise<RentalVehicle>;
  updateRentalVehicle(id: string, vehicle: Partial<RentalVehicle>): Promise<RentalVehicle | undefined>;

  getRentalLocations(filters?: { city?: string; isPickupPoint?: number; isDropoffPoint?: number }): Promise<RentalLocation[]>;
  getRentalLocation(id: string): Promise<RentalLocation | undefined>;
  createRentalLocation(location: InsertRentalLocation): Promise<RentalLocation>;
  updateRentalLocation(id: string, location: Partial<RentalLocation>): Promise<RentalLocation | undefined>;

  getRentalBookingsByUser(userId: string): Promise<RentalBooking[]>;
  getRentalBooking(id: string): Promise<RentalBooking | undefined>;
  getRentalBookingByReference(bookingReference: string): Promise<RentalBooking | undefined>;
  createRentalBooking(booking: InsertRentalBooking): Promise<RentalBooking>;
  updateRentalBooking(id: string, booking: Partial<RentalBooking>): Promise<RentalBooking | undefined>;

  getRentalReviewsByVehicle(vehicleId: string): Promise<RentalReview[]>;
  getRentalReviewsByUser(userId: string): Promise<RentalReview[]>;
  createRentalReview(review: InsertRentalReview): Promise<RentalReview>;

  getRentalTripByBooking(bookingId: string): Promise<RentalTrip | undefined>;
  getRentalTrip(id: string): Promise<RentalTrip | undefined>;
  createRentalTrip(trip: InsertRentalTrip): Promise<RentalTrip>;
  updateRentalTrip(id: string, trip: Partial<RentalTrip>): Promise<RentalTrip | undefined>;

  getRentalTripCheckpoints(tripId: string): Promise<RentalTripCheckpoint[]>;
  createRentalTripCheckpoint(checkpoint: InsertRentalTripCheckpoint): Promise<RentalTripCheckpoint>;

  getRentalDocumentsByBooking(bookingId: string): Promise<RentalDocument[]>;
  getRentalDocument(id: string): Promise<RentalDocument | undefined>;
  createRentalDocument(document: InsertRentalDocument): Promise<RentalDocument>;
  updateRentalDocument(id: string, document: Partial<RentalDocument>): Promise<RentalDocument | undefined>;

  getRentalInspectionsByBooking(bookingId: string): Promise<RentalVehicleInspection[]>;
  getRentalInspection(id: string): Promise<RentalVehicleInspection | undefined>;
  createRentalInspection(inspection: InsertRentalVehicleInspection): Promise<RentalVehicleInspection>;

  // TravelVIP operations
  getTravelVipMembershipByUser(userId: string): Promise<TravelVipMembership | undefined>;
  createTravelVipMembership(membership: InsertTravelVipMembership): Promise<TravelVipMembership>;
  updateTravelVipMembership(id: string, membership: Partial<TravelVipMembership>): Promise<TravelVipMembership | undefined>;
  getTravelVipBenefitsByUser(userId: string): Promise<TravelVipBenefitsUsage[]>;
  createTravelVipBenefitUsage(usage: InsertTravelVipBenefitsUsage): Promise<TravelVipBenefitsUsage>;
  getTravelVipTransactionsByUser(userId: string): Promise<TravelVipTransaction[]>;
  createTravelVipTransaction(transaction: InsertTravelVipTransaction): Promise<TravelVipTransaction>;

  // Credit UPI operations
  getCreditUpiAccountByUser(userId: string): Promise<CreditUpiAccount | undefined>;
  getCreditUpiAccount(id: string): Promise<CreditUpiAccount | undefined>;
  createCreditUpiAccount(account: InsertCreditUpiAccount): Promise<CreditUpiAccount>;
  updateCreditUpiAccount(id: string, account: Partial<CreditUpiAccount>): Promise<CreditUpiAccount | undefined>;
  
  getCreditUpiTransactionsByAccount(accountId: string): Promise<CreditUpiTransaction[]>;
  getCreditUpiTransactionsByUser(userId: string): Promise<CreditUpiTransaction[]>;
  getCreditUpiTransaction(id: string): Promise<CreditUpiTransaction | undefined>;
  createCreditUpiTransaction(transaction: InsertCreditUpiTransaction): Promise<CreditUpiTransaction>;
  
  getCreditUpiRepaymentsByAccount(accountId: string): Promise<CreditUpiRepayment[]>;
  getCreditUpiRepaymentsByUser(userId: string): Promise<CreditUpiRepayment[]>;
  getCreditUpiRepayment(id: string): Promise<CreditUpiRepayment | undefined>;
  createCreditUpiRepayment(repayment: InsertCreditUpiRepayment): Promise<CreditUpiRepayment>;
  
  getCreditUpiBillsByAccount(accountId: string): Promise<CreditUpiBill[]>;
  getCreditUpiBillsByUser(userId: string): Promise<CreditUpiBill[]>;
  getCreditUpiBill(id: string): Promise<CreditUpiBill | undefined>;
  getCurrentCreditUpiBill(accountId: string): Promise<CreditUpiBill | undefined>;
  createCreditUpiBill(bill: InsertCreditUpiBill): Promise<CreditUpiBill>;
  updateCreditUpiBill(id: string, bill: Partial<CreditUpiBill>): Promise<CreditUpiBill | undefined>;

  // Cash Park operations
  getCashParkAccountByUser(userId: string): Promise<CashParkAccount | undefined>;
  getCashParkAccount(id: string): Promise<CashParkAccount | undefined>;
  createCashParkAccount(account: InsertCashParkAccount): Promise<CashParkAccount>;
  updateCashParkAccount(id: string, account: Partial<CashParkAccount>): Promise<CashParkAccount | undefined>;
  
  getCashParkFdUnitsByAccount(accountId: string): Promise<CashParkFdUnit[]>;
  getCashParkFdUnitsByUser(userId: string): Promise<CashParkFdUnit[]>;
  getCashParkFdUnit(id: string): Promise<CashParkFdUnit | undefined>;
  createCashParkFdUnit(fdUnit: InsertCashParkFdUnit): Promise<CashParkFdUnit>;
  updateCashParkFdUnit(id: string, fdUnit: Partial<CashParkFdUnit>): Promise<CashParkFdUnit | undefined>;
  
  getCashParkTransactionsByAccount(accountId: string): Promise<CashParkTransaction[]>;
  getCashParkTransactionsByUser(userId: string): Promise<CashParkTransaction[]>;
  getCashParkTransaction(id: string): Promise<CashParkTransaction | undefined>;
  createCashParkTransaction(transaction: InsertCashParkTransaction): Promise<CashParkTransaction>;
  
  getCashParkJarsByUser(userId: string): Promise<CashParkJar[]>;
  getCashParkJarById(id: string): Promise<CashParkJar | undefined>;
  createCashParkJar(jar: InsertCashParkJar): Promise<CashParkJar>;
  deleteCashParkJar(id: string): Promise<boolean>;
  getCashParkTransactionsByJar(jarId: string): Promise<CashParkTransaction[]>;

  // Credit Card operations
  getCreditCardOffers(filters?: { category?: string; providerName?: string }): Promise<CreditCardOffer[]>;
  getCreditCardOffer(id: string): Promise<CreditCardOffer | undefined>;
  createCreditCardOffer(offer: InsertCreditCardOffer): Promise<CreditCardOffer>;
  
  getCreditCardApplicationsByUser(userId: string): Promise<CreditCardApplication[]>;
  getCreditCardApplication(id: string): Promise<CreditCardApplication | undefined>;
  createCreditCardApplication(application: InsertCreditCardApplication): Promise<CreditCardApplication>;
  updateCreditCardApplication(id: string, application: Partial<CreditCardApplication>): Promise<CreditCardApplication | undefined>;

  // ShareWise operations
  listSharewiseGroupsByUser(userId: string): Promise<GroupWithMembers[]>;
  getSharewiseGroup(id: string): Promise<SharewiseGroup | undefined>;
  getSharewiseGroupWithMembers(id: string): Promise<GroupWithMembers | undefined>;
  createSharewiseGroup(group: InsertSharewiseGroup): Promise<SharewiseGroup>;
  updateSharewiseGroup(id: string, updates: Partial<SharewiseGroup>): Promise<SharewiseGroup | undefined>;
  deleteSharewiseGroup(id: string): Promise<boolean>;
  
  getSharewiseGroupMembers(groupId: string): Promise<SharewiseGroupMember[]>;
  addSharewiseGroupMember(member: InsertSharewiseGroupMember): Promise<SharewiseGroupMember>;
  removeSharewiseGroupMember(groupId: string, userId: string): Promise<boolean>;
  updateSharewiseMemberRole(groupId: string, userId: string, role: string): Promise<SharewiseGroupMember | undefined>;
  
  listSharewiseExpensesByGroup(groupId: string): Promise<ExpenseWithSplits[]>;
  getSharewiseExpense(id: string): Promise<SharewiseExpense | undefined>;
  getSharewiseExpenseWithSplits(id: string): Promise<ExpenseWithSplits | undefined>;
  createSharewiseExpense(expense: InsertSharewiseExpense, splits: InsertSharewiseExpenseSplit[]): Promise<ExpenseWithSplits>;
  updateSharewiseExpense(id: string, updates: Partial<SharewiseExpense>): Promise<SharewiseExpense | undefined>;
  deleteSharewiseExpense(id: string): Promise<boolean>;
  
  listSharewiseSettlementsByGroup(groupId: string): Promise<SharewiseSettlement[]>;
  createSharewiseSettlement(settlement: InsertSharewiseSettlement): Promise<SharewiseSettlement>;
  
  computeSharewiseGroupBalances(groupId: string): Promise<MemberBalance[]>;
  generateSharewiseSettlementSuggestions(groupId: string): Promise<SettlementSuggestion[]>;
  getSharewiseGroupAnalytics(groupId: string): Promise<any>;
  listSharewiseActivityByGroup(groupId: string): Promise<SharewiseActivity[]>;
  
  // Coupon Mart operations
  getCouponMartListings(filters?: { category?: string; listingType?: string; status?: string }): Promise<CouponMartListing[]>;
  getCouponMartListing(id: string): Promise<CouponMartListing | undefined>;
  getCouponMartListingsByUser(userId: string): Promise<CouponMartListing[]>;
  createCouponMartListing(listing: InsertCouponMartListing): Promise<CouponMartListing>;
  updateCouponMartListing(id: string, listing: Partial<CouponMartListing>): Promise<CouponMartListing | undefined>;
  deleteCouponMartListing(id: string): Promise<boolean>;
  incrementCouponMartListingViews(id: string): Promise<void>;
  
  getCouponMartTransactionsByBuyer(buyerId: string): Promise<CouponMartTransaction[]>;
  getCouponMartTransactionsBySeller(sellerId: string): Promise<CouponMartTransaction[]>;
  createCouponMartTransaction(transaction: InsertCouponMartTransaction): Promise<CouponMartTransaction>;
  
  getCouponMartTradeOffersByListing(listingId: string): Promise<CouponMartTradeOffer[]>;
  getCouponMartTradeOffersByUser(userId: string): Promise<CouponMartTradeOffer[]>;
  getCouponMartTradeOffer(id: string): Promise<CouponMartTradeOffer | undefined>;
  createCouponMartTradeOffer(offer: InsertCouponMartTradeOffer): Promise<CouponMartTradeOffer>;
  updateCouponMartTradeOffer(id: string, status: string, responseNote?: string): Promise<CouponMartTradeOffer | undefined>;
  ensureUserHasSampleCouponData(userId: string): Promise<void>;

  // SwapNow Marketplace operations
  getSwapNowListings(filters?: { category?: string; status?: string; city?: string; condition?: string }): Promise<SwapNowListing[]>;
  getSwapNowListing(id: string): Promise<SwapNowListing | undefined>;
  getSwapNowListingsByUser(userId: string): Promise<SwapNowListing[]>;
  createSwapNowListing(listing: InsertSwapNowListing): Promise<SwapNowListing>;
  updateSwapNowListing(id: string, listing: Partial<SwapNowListing>): Promise<SwapNowListing | undefined>;
  deleteSwapNowListing(id: string): Promise<boolean>;
  incrementSwapNowListingViews(id: string): Promise<void>;
  markSwapNowListingAsSold(id: string, soldPrice?: number): Promise<SwapNowListing | undefined>;
  
  getSwapNowConversationsByUser(userId: string): Promise<SwapNowConversation[]>;
  getSwapNowConversation(id: string): Promise<SwapNowConversation | undefined>;
  getSwapNowConversationByListingAndBuyer(listingId: string, buyerId: string): Promise<SwapNowConversation | undefined>;
  createSwapNowConversation(conversation: InsertSwapNowConversation): Promise<SwapNowConversation>;
  updateSwapNowConversation(id: string, conversation: Partial<SwapNowConversation>): Promise<SwapNowConversation | undefined>;
  
  getSwapNowMessagesByConversation(conversationId: string): Promise<SwapNowMessage[]>;
  getSwapNowMessage(id: string): Promise<SwapNowMessage | undefined>;
  createSwapNowMessage(message: InsertSwapNowMessage): Promise<SwapNowMessage>;
  updateSwapNowMessage(id: string, message: Partial<SwapNowMessage>): Promise<SwapNowMessage | undefined>;
  markSwapNowMessageAsRead(id: string): Promise<void>;
  
  getSwapNowOffersByListing(listingId: string): Promise<SwapNowOffer[]>;
  getSwapNowOffersByBuyer(buyerId: string): Promise<SwapNowOffer[]>;
  getSwapNowOffersBySeller(sellerId: string): Promise<SwapNowOffer[]>;
  createSwapNowOffer(offer: InsertSwapNowOffer): Promise<SwapNowOffer>;
  updateSwapNowOffer(id: string, offer: Partial<SwapNowOffer>): Promise<SwapNowOffer | undefined>;
  
  getSwapNowFavoritesByUser(userId: string): Promise<SwapNowFavorite[]>;
  createSwapNowFavorite(favorite: InsertSwapNowFavorite): Promise<SwapNowFavorite>;
  deleteSwapNowFavorite(userId: string, listingId: string): Promise<boolean>;

  // BookSure Consultant Booking operations
  getConsultantCategories(): Promise<ConsultantCategory[]>;
  getConsultantCategory(id: string): Promise<ConsultantCategory | undefined>;
  getConsultantCategoryBySlug(slug: string): Promise<ConsultantCategory | undefined>;
  createConsultantCategory(category: InsertConsultantCategory): Promise<ConsultantCategory>;
  
  getConsultantProviders(filters?: { categoryId?: string; city?: string; verified?: boolean; rating?: number }): Promise<ConsultantProvider[]>;
  getConsultantProvider(id: string): Promise<ConsultantProvider | undefined>;
  searchConsultantProviders(query: string, categoryId?: string): Promise<ConsultantProvider[]>;
  createConsultantProvider(provider: InsertConsultantProvider): Promise<ConsultantProvider>;
  updateConsultantProvider(id: string, provider: Partial<ConsultantProvider>): Promise<ConsultantProvider | undefined>;
  
  getConsultantServicesByProvider(providerId: string): Promise<ConsultantService[]>;
  getConsultantService(id: string): Promise<ConsultantService | undefined>;
  createConsultantService(service: InsertConsultantService): Promise<ConsultantService>;
  updateConsultantService(id: string, service: Partial<ConsultantService>): Promise<ConsultantService | undefined>;
  
  getConsultantBookingsByUser(userId: string): Promise<ConsultantBooking[]>;
  getConsultantBooking(id: string): Promise<ConsultantBooking | undefined>;
  getConsultantBookingByNumber(bookingNumber: string): Promise<ConsultantBooking | undefined>;
  createConsultantBooking(booking: InsertConsultantBooking): Promise<ConsultantBooking>;
  updateConsultantBooking(id: string, booking: Partial<ConsultantBooking>): Promise<ConsultantBooking | undefined>;
  
  getConsultantReviewsByProvider(providerId: string): Promise<ConsultantReview[]>;
  getConsultantReviewByBooking(bookingId: string): Promise<ConsultantReview | undefined>;
  createConsultantReview(review: InsertConsultantReview): Promise<ConsultantReview>;
  
  getConsultantAvailabilityByProvider(providerId: string): Promise<ConsultantAvailability[]>;
  createConsultantAvailability(availability: InsertConsultantAvailability): Promise<ConsultantAvailability>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private loanApplications: Map<string, LoanApplication>;
  private emiPayments: Map<string, EmiPayment>;
  private notifications: Map<string, Notification>;
  private otps: Map<string, Otp>;
  private loanOffers: Map<string, LoanOffer>;
  private userFinancialReports: Map<string, UserFinancialReport>;
  private securityScans: Map<string, SecurityScan>;
  private coachInteractions: Map<string, CoachInteraction>;
  private learningContent: Map<string, LearningContent>;
  private fitnessActivities: Map<string, FitnessActivity>;
  private userPoints: Map<string, UserPoints>;
  private creators: Map<string, Creator>;
  private creatorSessions: Map<string, CreatorSession>;
  private bookings: Map<string, Booking>;
  private creatorReviews: Map<string, CreatorReview>;
  private creatorAvailability: Map<string, CreatorAvailability>;
  private creatorPayouts: Map<string, CreatorPayout>;
  private upiAccounts: Map<string, UpiAccount>;
  private upiTransactions: Map<string, UpiTransaction>;
  private upiRewards: Map<string, UpiReward>;
  private billPaymentServices: Map<string, BillPaymentService>;
  private investmentPortfolio: Map<string, InvestmentPortfolio>;
  private insurancePolicies: Map<string, InsurancePolicy>;
  private insurancePremiumPayments: Map<string, InsurancePremiumPayment>;
  private insuranceClaims: Map<string, InsuranceClaim>;
  private rewards: Map<string, Reward>;
  private rewardCategories: Map<string, RewardCategory>;
  private rewardRedemptions: Map<string, RewardRedemption>;
  private userWallets: Map<string, UserWallet>;
  private fundTransactions: Map<string, FundTransaction>;
  private stripePayments: Map<string, StripePayment>;
  // New maps for financial app redesign
  private paymentDetails: Map<string, PaymentDetail>;
  private billPayees: Map<string, BillPayee>;
  private scheduledBills: Map<string, ScheduledBill>;
  private billReminders: Map<string, BillReminder>;
  private userProfiles: Map<string, UserProfile>;
  private referralPrograms: Map<string, ReferralProgram>;
  private referralTransactions: Map<string, ReferralTransaction>;
  private billPaymentHistory: Map<string, BillPaymentHistory>;
  // Travel booking maps
  private travelRoutes: Map<string, TravelRoute>;
  private travelSchedules: Map<string, TravelSchedule>;
  private travelBookings: Map<string, TravelBooking>;
  private travelPassengers: Map<string, TravelPassenger>;
  private travelPayments: Map<string, TravelPayment>;
  private travelCancellations: Map<string, TravelCancellation>;
  private travelContracts: Map<string, TravelContract>;
  private travelAddons: Map<string, TravelAddon>;
  private travelLiveTracking: Map<string, TravelLiveTracking>;
  private boardingPasses: Map<string, BoardingPass>;
  private travelModifications: Map<string, TravelModification>;
  private travelAlerts: Map<string, TravelAlert>;
  private travelCoupons: Map<string, TravelCoupon>;
  private travelCouponUsage: Map<string, TravelCouponUsage>;
  // Investment maps
  private investmentWatchlist: Map<string, InvestmentWatchlist>;
  private investmentOrders: Map<string, InvestmentOrder>;
  private investmentVendors: Map<string, InvestmentVendor>;
  private marketData: Map<string, MarketData>;
  // FASTag maps
  private userVehicles: Map<string, UserVehicle>;
  private fastagAccounts: Map<string, FastagAccount>;
  private fastagTransactions: Map<string, FastagTransaction>;
  // Profile-related maps
  private loanAmortizationSchedules: Map<string, LoanAmortizationSchedule>;
  private loanDocuments: Map<string, LoanDocument>;
  private savedCards: Map<string, SavedCard>;
  private cardTransactions: Map<string, CardTransaction>;
  private bankAccounts: Map<string, BankAccount>;
  private activityLogs: Map<string, ActivityLog>;
  private stockTrades: Map<string, StockTrade>;
  private financialGoals: Map<string, FinancialGoal>;
  private budgets: Map<string, Budget>;
  // New investment maps
  private mutualFunds: Map<string, MutualFund>;
  private sipInvestments: Map<string, SipInvestment>;
  private sipTransactions: Map<string, SipTransaction>;
  private vendorOffers: Map<string, VendorOffer>;
  private aiPortfolioAllocations: Map<string, AiPortfolioAllocation>;
  private transactionConfirmations: Map<string, TransactionConfirmation>;
  private transactionSuccessRecords: Map<string, TransactionSuccessRecord>;
  // Movie booking maps
  private movies: Map<string, Movie>;
  private theaters: Map<string, Theater>;
  private movieShowtimes: Map<string, MovieShowtime>;
  private seatCategories: Map<string, SeatCategory>;
  private seatLayouts: Map<string, SeatLayout>;
  private seatHolds: Map<string, SeatHold>;
  private movieBookings: Map<string, MovieBooking>;
  private foodMenuItems: Map<string, FoodMenuItem>;
  // Event booking maps
  private events: Map<string, Event>;
  private eventTicketTiers: Map<string, EventTicketTier>;
  private eventTicketHolds: Map<string, EventTicketHold>;
  private eventBookings: Map<string, EventBooking>;
  // Hotel booking maps
  private hotels: Map<string, Hotel>;
  private hotelRooms: Map<string, HotelRoom>;
  private hotelRoomInventory: Map<string, HotelRoomInventory>;
  private hotelBookings: Map<string, HotelBooking>;
  private hotelReviews: Map<string, HotelReview>;
  // Metro booking maps
  private metroStations: Map<string, MetroStation>;
  private metroRoutes: Map<string, MetroRoute>;
  private metroSmartCards: Map<string, MetroSmartCard>;
  private metroTickets: Map<string, MetroTicket>;
  private metroTravelHistory: Map<string, MetroTravelHistory>;
  // Rental booking maps
  private rentalVehicles: Map<string, RentalVehicle>;
  private rentalLocations: Map<string, RentalLocation>;
  private rentalBookings: Map<string, RentalBooking>;
  private rentalReviews: Map<string, RentalReview>;
  private rentalTrips: Map<string, RentalTrip>;
  private rentalTripCheckpoints: Map<string, RentalTripCheckpoint>;
  private rentalDocuments: Map<string, RentalDocument>;
  private rentalInspections: Map<string, RentalVehicleInspection>;
  // TravelVIP maps
  private travelVipMemberships: Map<string, TravelVipMembership>;
  private travelVipBenefitsUsage: Map<string, TravelVipBenefitsUsage>;
  private travelVipTransactions: Map<string, TravelVipTransaction>;
  // Credit UPI maps
  private creditUpiAccounts: Map<string, CreditUpiAccount>;
  private creditUpiTransactions: Map<string, CreditUpiTransaction>;
  private creditUpiRepayments: Map<string, CreditUpiRepayment>;
  private creditUpiBills: Map<string, CreditUpiBill>;
  private cashParkAccounts: Map<string, CashParkAccount>;
  private cashParkFdUnits: Map<string, CashParkFdUnit>;
  private cashParkTransactions: Map<string, CashParkTransaction>;
  private cashParkJars: Map<string, CashParkJar>;
  // Family UPI maps
  private familyUpiAccounts: Map<string, FamilyUpiAccount>;
  private familyUpiMembers: Map<string, FamilyUpiMember>;
  private familyUpiTransactions: Map<string, FamilyUpiTransaction>;
  // Credit Card maps
  private creditCardOffers: Map<string, CreditCardOffer>;
  private creditCardApplications: Map<string, CreditCardApplication>;
  // Coupon Mart storage
  private couponMartListings: Map<string, CouponMartListing>;
  private couponMartTransactions: Map<string, CouponMartTransaction>;
  private couponMartTradeOffers: Map<string, CouponMartTradeOffer>;
  // SwapNow Marketplace storage
  private swapNowListings: Map<string, SwapNowListing>;
  private swapNowConversations: Map<string, SwapNowConversation>;
  private swapNowMessages: Map<string, SwapNowMessage>;
  private swapNowOffers: Map<string, SwapNowOffer>;
  private swapNowFavorites: Map<string, SwapNowFavorite>;
  // BookSure Consultant Booking storage
  private consultantCategories: Map<string, ConsultantCategory>;
  private consultantProviders: Map<string, ConsultantProvider>;
  private consultantServices: Map<string, ConsultantService>;
  private consultantBookings: Map<string, ConsultantBooking>;
  private consultantReviews: Map<string, ConsultantReview>;
  private consultantAvailability: Map<string, ConsultantAvailability>;
  // ShareWise storage
  private sharewiseStorage: ShareWiseStorage;

  constructor() {
    this.users = new Map();
    this.loanApplications = new Map();
    this.emiPayments = new Map();
    this.notifications = new Map();
    this.otps = new Map();
    this.loanOffers = new Map();
    this.userFinancialReports = new Map();
    this.securityScans = new Map();
    this.coachInteractions = new Map();
    this.learningContent = new Map();
    this.fitnessActivities = new Map();
    this.userPoints = new Map();
    this.creators = new Map();
    this.creatorSessions = new Map();
    this.bookings = new Map();
    this.creatorReviews = new Map();
    this.creatorAvailability = new Map();
    this.creatorPayouts = new Map();
    this.upiAccounts = new Map();
    this.upiTransactions = new Map();
    this.upiRewards = new Map();
    this.billPaymentServices = new Map();
    this.investmentPortfolio = new Map();
    this.insurancePolicies = new Map();
    this.insurancePremiumPayments = new Map();
    this.insuranceClaims = new Map();
    this.rewards = new Map();
    this.rewardCategories = new Map();
    this.rewardRedemptions = new Map();
    this.userWallets = new Map();
    this.fundTransactions = new Map();
    this.stripePayments = new Map();
    // Initialize new maps
    this.paymentDetails = new Map();
    this.billPayees = new Map();
    this.scheduledBills = new Map();
    this.billReminders = new Map();
    this.userProfiles = new Map();
    this.referralPrograms = new Map();
    this.referralTransactions = new Map();
    this.billPaymentHistory = new Map();
    // Initialize travel booking maps
    this.travelRoutes = new Map();
    this.travelSchedules = new Map();
    this.travelBookings = new Map();
    this.travelPassengers = new Map();
    this.travelPayments = new Map();
    this.travelCancellations = new Map();
    this.travelContracts = new Map();
    this.travelAddons = new Map();
    this.travelLiveTracking = new Map();
    this.boardingPasses = new Map();
    this.travelModifications = new Map();
    this.travelAlerts = new Map();
    this.travelCoupons = new Map();
    this.travelCouponUsage = new Map();
    // Initialize investment maps
    this.investmentWatchlist = new Map();
    this.investmentOrders = new Map();
    this.investmentVendors = new Map();
    this.marketData = new Map();
    // Initialize FASTag maps
    this.userVehicles = new Map();
    this.fastagAccounts = new Map();
    this.fastagTransactions = new Map();
    // Initialize profile-related maps
    this.loanAmortizationSchedules = new Map();
    this.loanDocuments = new Map();
    this.savedCards = new Map();
    this.cardTransactions = new Map();
    this.bankAccounts = new Map();
    this.activityLogs = new Map();
    this.stockTrades = new Map();
    this.financialGoals = new Map();
    this.budgets = new Map();
    // Initialize new investment maps
    this.mutualFunds = new Map();
    this.sipInvestments = new Map();
    this.sipTransactions = new Map();
    this.vendorOffers = new Map();
    this.aiPortfolioAllocations = new Map();
    this.transactionConfirmations = new Map();
    this.transactionSuccessRecords = new Map();
    // Initialize booking maps
    this.movies = new Map();
    this.theaters = new Map();
    this.movieShowtimes = new Map();
    this.seatCategories = new Map();
    this.seatLayouts = new Map();
    this.seatHolds = new Map();
    this.movieBookings = new Map();
    this.foodMenuItems = new Map();
    this.events = new Map();
    this.eventTicketTiers = new Map();
    this.eventTicketHolds = new Map();
    this.eventBookings = new Map();
    this.hotels = new Map();
    this.hotelRooms = new Map();
    this.hotelRoomInventory = new Map();
    this.hotelBookings = new Map();
    this.hotelReviews = new Map();
    // Metro booking maps
    this.metroStations = new Map();
    this.metroRoutes = new Map();
    this.metroSmartCards = new Map();
    this.metroTickets = new Map();
    this.metroTravelHistory = new Map();
    // Rental booking maps
    this.rentalVehicles = new Map();
    this.rentalLocations = new Map();
    this.rentalBookings = new Map();
    this.rentalReviews = new Map();
    this.rentalTrips = new Map();
    this.rentalTripCheckpoints = new Map();
    this.rentalDocuments = new Map();
    this.rentalInspections = new Map();
    // Initialize TravelVIP maps
    this.travelVipMemberships = new Map();
    this.travelVipBenefitsUsage = new Map();
    this.travelVipTransactions = new Map();
    // Initialize Credit UPI maps
    this.creditUpiAccounts = new Map();
    this.creditUpiTransactions = new Map();
    this.creditUpiRepayments = new Map();
    this.creditUpiBills = new Map();
    // Initialize Cash Park maps
    this.cashParkAccounts = new Map();
    this.cashParkFdUnits = new Map();
    this.cashParkTransactions = new Map();
    this.cashParkJars = new Map();
    // Initialize Family UPI maps
    this.familyUpiAccounts = new Map();
    this.familyUpiMembers = new Map();
    this.familyUpiTransactions = new Map();
    // Initialize Credit Card maps
    this.creditCardOffers = new Map();
    this.creditCardApplications = new Map();
    // Initialize Coupon Mart maps
    this.couponMartListings = new Map();
    this.couponMartTransactions = new Map();
    this.couponMartTradeOffers = new Map();
    // Initialize SwapNow Marketplace maps
    this.swapNowListings = new Map();
    this.swapNowConversations = new Map();
    this.swapNowMessages = new Map();
    this.swapNowOffers = new Map();
    this.swapNowFavorites = new Map();
    // Initialize BookSure Consultant Booking maps
    this.consultantCategories = new Map();
    this.consultantProviders = new Map();
    this.consultantServices = new Map();
    this.consultantBookings = new Map();
    this.consultantReviews = new Map();
    this.consultantAvailability = new Map();
    // Initialize ShareWise storage
    this.sharewiseStorage = new ShareWiseStorage();
    
    // Initialize with sample data
    this.initializeSampleData();
    this.initializeSampleCoupons();
    this.initializeCouponMartSampleData();
    this.initializeConsultantSampleData();
    this.initializeSwapNowSampleData();
  }
  
  private initializeSampleCoupons() {
    // Sample travel coupons
    const coupon1: TravelCoupon = {
      id: "coupon-1",
      code: "TRAVEL50",
      title: "₹50 Off on Travel",
      description: "Get ₹50 off on all travel bookings",
      type: "flat",
      discountValue: "50.00",
      maxDiscount: "50.00",
      minBookingAmount: "200.00",
      applicableServiceTypes: ["flight", "bus", "train", "cab", "metro", "rental"],
      userType: "all",
      usageLimit: null,
      usageCount: 0,
      userLimit: 1,
      validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: 1,
      termsConditions: "Valid on all travel services. Cannot be combined with other offers.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const coupon2: TravelCoupon = {
      id: "coupon-2",
      code: "FLIGHT100",
      title: "₹100 Off on Flights",
      description: "Save ₹100 on flight bookings above ₹1000",
      type: "flat",
      discountValue: "100.00",
      maxDiscount: "100.00",
      minBookingAmount: "1000.00",
      applicableServiceTypes: ["flight"],
      userType: "all",
      usageLimit: null,
      usageCount: 0,
      userLimit: 2,
      validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: 1,
      termsConditions: "Valid on domestic and international flights.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const coupon3: TravelCoupon = {
      id: "coupon-3",
      code: "MOVIE20",
      title: "20% Off on Movies",
      description: "Get 20% off on movie tickets up to ₹150",
      type: "percentage",
      discountValue: "20.00",
      maxDiscount: "150.00",
      minBookingAmount: "300.00",
      applicableServiceTypes: ["movie"],
      userType: "all",
      usageLimit: 100,
      usageCount: 0,
      userLimit: 1,
      validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      isActive: 1,
      termsConditions: "Valid on all movie bookings. Max discount ₹150.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const coupon4: TravelCoupon = {
      id: "coupon-4",
      code: "EVENT15",
      title: "15% Off on Events",
      description: "Save 15% on event tickets up to ₹200",
      type: "percentage",
      discountValue: "15.00",
      maxDiscount: "200.00",
      minBookingAmount: "500.00",
      applicableServiceTypes: ["event"],
      userType: "all",
      usageLimit: null,
      usageCount: 0,
      userLimit: 1,
      validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: 1,
      termsConditions: "Valid on concerts, sports, and theater events.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const coupon5: TravelCoupon = {
      id: "coupon-5",
      code: "HOTEL200",
      title: "₹200 Off on Hotels",
      description: "Get ₹200 off on hotel bookings above ₹2000",
      type: "flat",
      discountValue: "200.00",
      maxDiscount: "200.00",
      minBookingAmount: "2000.00",
      applicableServiceTypes: ["hotel"],
      userType: "all",
      usageLimit: null,
      usageCount: 0,
      userLimit: 1,
      validFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: 1,
      termsConditions: "Valid on all hotel bookings nationwide.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.travelCoupons.set(coupon1.id, coupon1);
    this.travelCoupons.set(coupon2.id, coupon2);
    this.travelCoupons.set(coupon3.id, coupon3);
    this.travelCoupons.set(coupon4.id, coupon4);
    this.travelCoupons.set(coupon5.id, coupon5);
  }

  private initializeCouponMartSampleData() {
    const now = new Date();
    const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Sample CoupEx listings with new multi-coupon schema
    const listing1: CouponMartListing = {
      id: "coupon-mart-1",
      userId: "demo-user-1",
      coupons: [{
        code: "SWIGGY500",
        title: "₹500 Off on Food Orders",
        brand: "Swiggy",
        category: "food",
        type: "discount",
        value: 500,
        valueType: "fixed",
        description: "Get ₹500 off on orders above ₹1000",
        expiryDate: futureDate(30).toISOString(),
        minAmount: 1000,
        maxDiscount: 500,
        termsConditions: "Valid for new users only",
        valueScore: 7.5,
      }],
      totalCouponCount: 1,
      totalFaceValue: "500",
      primaryCategory: "food",
      listingNote: "Unused coupon from a promotion",
      listingType: "sell",
      sellingPrice: "350",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 45,
      createdAt: now,
      updatedAt: now,
    };

    const listing2: CouponMartListing = {
      id: "coupon-mart-2",
      userId: "demo-user-2",
      coupons: [{
        code: "FITLIFE300",
        title: "₹300 Off on Gym Membership",
        brand: "FitLife Gym",
        category: "fitness",
        type: "discount",
        value: 300,
        valueType: "fixed",
        description: "Save ₹300 on 3-month gym membership",
        expiryDate: futureDate(20).toISOString(),
        minAmount: 1500,
        maxDiscount: 300,
        termsConditions: "Valid for new members only",
        valueScore: 8.0,
      }],
      totalCouponCount: 1,
      totalFaceValue: "300",
      primaryCategory: "fitness",
      listingNote: "Got two coupons, selling one",
      listingType: "sell",
      sellingPrice: "250",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 32,
      createdAt: now,
      updatedAt: now,
    };

    const listing3: CouponMartListing = {
      id: "coupon-mart-3",
      userId: "demo-user-3",
      coupons: [{
        code: "HEALTHPLUS200",
        title: "₹200 Off on Health Checkup",
        brand: "HealthPlus Diagnostics",
        category: "medical",
        type: "discount",
        value: 200,
        valueType: "fixed",
        description: "₹200 discount on full body checkup",
        expiryDate: futureDate(45).toISOString(),
        minAmount: 1000,
        maxDiscount: 200,
        termsConditions: "Valid on weekdays only",
        valueScore: 7.0,
      }],
      totalCouponCount: 1,
      totalFaceValue: "200",
      primaryCategory: "medical",
      listingNote: "Prefer to trade for shopping coupons",
      listingType: "trade",
      sellingPrice: null,
      tradeCouponRequirements: [
        {
          couponNumber: 1,
          isRequired: true,
          category: "shopping",
          brands: ["Nykaa", "Myntra", "Flipkart"],
          minRating: 0,
          maxRating: 3.5
        }
      ],
      tradePreference: "Shopping coupons preferred",
      tradeNote: "Looking for shopping coupons from popular brands",
      tradeCategory: "shopping",
      tradeCouponsRequired: 1,
      tradeMinValueScore: "6.0",
      tradeMaxValueScore: "9.0",
      status: "active",
      visibility: "public",
      views: 28,
      createdAt: now,
      updatedAt: now,
    };

    const listing4: CouponMartListing = {
      id: "coupon-mart-4",
      userId: "demo-user-4",
      coupons: [{
        code: "EDULEARN150",
        title: "₹150 Off on Online Courses",
        brand: "EduLearn",
        category: "education",
        type: "discount",
        value: 150,
        valueType: "fixed",
        description: "Save ₹150 on premium courses",
        expiryDate: futureDate(60).toISOString(),
        minAmount: 500,
        maxDiscount: 150,
        termsConditions: "Valid on all courses",
        valueScore: 6.5,
      }],
      totalCouponCount: 1,
      totalFaceValue: "150",
      primaryCategory: "education",
      listingNote: "Already completed the course",
      listingType: "sell",
      sellingPrice: "100",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 18,
      createdAt: now,
      updatedAt: now,
    };

    const listing5: CouponMartListing = {
      id: "coupon-mart-5",
      userId: "demo-user-5",
      coupons: [{
        code: "CINEMAX250",
        title: "₹250 Off on Movie Tickets",
        brand: "CineMax",
        category: "entertainment",
        type: "discount",
        value: 250,
        valueType: "fixed",
        description: "Get ₹250 off on movie bookings",
        expiryDate: futureDate(15).toISOString(),
        minAmount: 500,
        maxDiscount: 250,
        termsConditions: "Valid on weekends only",
        valueScore: 7.8,
      }],
      totalCouponCount: 1,
      totalFaceValue: "250",
      primaryCategory: "entertainment",
      listingNote: "Last minute sale",
      listingType: "sell",
      sellingPrice: "180",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 52,
      createdAt: now,
      updatedAt: now,
    };

    const listing6: CouponMartListing = {
      id: "coupon-mart-6",
      userId: "demo-user-6",
      coupons: [{
        code: "AMAZON1000",
        title: "₹1000 Amazon Gift Card",
        brand: "Amazon",
        category: "shopping",
        type: "gift_card",
        value: 1000,
        valueType: "fixed",
        description: "Amazon gift card worth ₹1000",
        expiryDate: futureDate(90).toISOString(),
        minAmount: null,
        maxDiscount: null,
        termsConditions: "Valid on Amazon.in only",
        valueScore: 8.5,
      }],
      totalCouponCount: 1,
      totalFaceValue: "1000",
      primaryCategory: "shopping",
      listingNote: "Genuine Amazon gift card",
      listingType: "sell",
      sellingPrice: "900",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 78,
      createdAt: now,
      updatedAt: now,
    };

    const listing7: CouponMartListing = {
      id: "coupon-mart-7",
      userId: "demo-user-7",
      coupons: [{
        code: "MYNTRA400",
        title: "₹400 Off on Fashion",
        brand: "Myntra",
        category: "shopping",
        type: "discount",
        value: 400,
        valueType: "fixed",
        description: "Save ₹400 on fashion purchases",
        expiryDate: futureDate(25).toISOString(),
        minAmount: 1500,
        maxDiscount: 400,
        termsConditions: "Valid on all fashion items",
        valueScore: 7.2,
      }],
      totalCouponCount: 1,
      totalFaceValue: "400",
      primaryCategory: "shopping",
      listingNote: "Urgent sale needed",
      listingType: "sell",
      sellingPrice: "320",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 41,
      createdAt: now,
      updatedAt: now,
    };

    const listing8: CouponMartListing = {
      id: "coupon-mart-8",
      userId: "demo-user-8",
      coupons: [{
        code: "ZOMATO300",
        title: "₹300 Off on Food Delivery",
        brand: "Zomato",
        category: "food",
        type: "discount",
        value: 300,
        valueType: "fixed",
        description: "₹300 off on orders above ₹500",
        expiryDate: futureDate(35).toISOString(),
        minAmount: 500,
        maxDiscount: 300,
        termsConditions: "Valid on all restaurants",
        valueScore: 7.5,
      }],
      totalCouponCount: 1,
      totalFaceValue: "300",
      primaryCategory: "food",
      listingNote: "Good value coupon",
      listingType: "sell",
      sellingPrice: "220",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 38,
      createdAt: now,
      updatedAt: now,
    };

    // Combo Listings (Multiple Coupons)
    const comboListing1: CouponMartListing = {
      id: "coupon-mart-combo-1",
      userId: "demo-user-9",
      coupons: [
        {
          code: "SWIGGY400",
          title: "₹400 Off on Food Orders",
          brand: "Swiggy",
          category: "food",
          type: "discount",
          value: 400,
          valueType: "fixed",
          description: "Get ₹400 off on orders above ₹800",
          expiryDate: futureDate(25).toISOString(),
          minAmount: 800,
          maxDiscount: 400,
          termsConditions: "Valid for all users",
          valueScore: 7.8,
        },
        {
          code: "ZOMATO350",
          title: "₹350 Off on Food Delivery",
          brand: "Zomato",
          category: "food",
          type: "discount",
          value: 350,
          valueType: "fixed",
          description: "₹350 off on orders above ₹700",
          expiryDate: futureDate(28).toISOString(),
          minAmount: 700,
          maxDiscount: 350,
          termsConditions: "Valid on all restaurants",
          valueScore: 7.5,
        },
        {
          code: "DINEOUT200",
          title: "₹200 Off on Dining",
          brand: "Dineout",
          category: "food",
          type: "discount",
          value: 200,
          valueType: "fixed",
          description: "Save ₹200 on restaurant bills",
          expiryDate: futureDate(30).toISOString(),
          minAmount: 500,
          maxDiscount: 200,
          termsConditions: "Valid at partner restaurants",
          valueScore: 7.2,
        }
      ],
      totalCouponCount: 3,
      totalFaceValue: "950",
      primaryCategory: "combo",
      listingNote: "Premium food combo - 3 different food delivery coupons",
      listingType: "sell",
      sellingPrice: "750",
      tradePreference: null,
      tradeNote: null,
      tradeCategory: null,
      tradeCouponsRequired: null,
      tradeMinValueScore: null,
      tradeMaxValueScore: null,
      tradeCouponRequirements: null,
      status: "active",
      visibility: "public",
      views: 95,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing2: CouponMartListing = {
      id: "coupon-mart-combo-2",
      userId: "demo-user-10",
      coupons: [
        {
          code: "MYNTRA500",
          title: "₹500 Off on Fashion",
          brand: "Myntra",
          category: "shopping",
          type: "discount",
          value: 500,
          valueType: "fixed",
          description: "Save ₹500 on fashion purchases",
          expiryDate: futureDate(40).toISOString(),
          minAmount: 1500,
          maxDiscount: 500,
          termsConditions: "Valid on all fashion items",
          valueScore: 8.0,
        },
        {
          code: "AJIO400",
          title: "₹400 Off on Clothing",
          brand: "Ajio",
          category: "shopping",
          type: "discount",
          value: 400,
          valueType: "fixed",
          description: "Get ₹400 off on clothing and accessories",
          expiryDate: futureDate(35).toISOString(),
          minAmount: 1200,
          maxDiscount: 400,
          termsConditions: "Valid on all items",
          valueScore: 7.8,
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "900",
      primaryCategory: "combo",
      listingNote: "Fashion combo - Myntra + Ajio coupons",
      listingType: "sell",
      sellingPrice: "720",
      tradePreference: null,
      tradeNote: null,
      tradeCategory: null,
      tradeCouponsRequired: null,
      tradeMinValueScore: null,
      tradeMaxValueScore: null,
      tradeCouponRequirements: null,
      status: "active",
      visibility: "public",
      views: 67,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing3: CouponMartListing = {
      id: "coupon-mart-combo-3",
      userId: "demo-user-11",
      coupons: [
        {
          code: "MAKEMYTRIP1000",
          title: "₹1000 Off on Flights",
          brand: "MakeMyTrip",
          category: "travel",
          type: "discount",
          value: 1000,
          valueType: "fixed",
          description: "Flat ₹1000 off on domestic flights",
          expiryDate: futureDate(50).toISOString(),
          minAmount: 3000,
          maxDiscount: 1000,
          termsConditions: "Valid on domestic flights only",
          valueScore: 8.5,
        },
        {
          code: "GOIBIBO800",
          title: "₹800 Off on Hotels",
          brand: "Goibibo",
          category: "travel",
          type: "discount",
          value: 800,
          valueType: "fixed",
          description: "Save ₹800 on hotel bookings",
          expiryDate: futureDate(45).toISOString(),
          minAmount: 2500,
          maxDiscount: 800,
          termsConditions: "Valid on all hotels",
          valueScore: 8.2,
        },
        {
          code: "OLA150",
          title: "₹150 Off on Cab Rides",
          brand: "Ola",
          category: "travel",
          type: "discount",
          value: 150,
          valueType: "fixed",
          description: "Get ₹150 off on your next ride",
          expiryDate: futureDate(20).toISOString(),
          minAmount: 300,
          maxDiscount: 150,
          termsConditions: "Valid on all cab types",
          valueScore: 7.5,
        }
      ],
      totalCouponCount: 3,
      totalFaceValue: "1950",
      primaryCategory: "combo",
      listingNote: "Ultimate travel combo - Flights, Hotels & Cabs",
      listingType: "sell",
      sellingPrice: "1550",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 120,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing4: CouponMartListing = {
      id: "coupon-mart-combo-4",
      userId: "demo-user-12",
      coupons: [
        {
          code: "CINEMAX300",
          title: "₹300 Off on Movie Tickets",
          brand: "CineMax",
          category: "entertainment",
          type: "discount",
          value: 300,
          valueType: "fixed",
          description: "Get ₹300 off on movie bookings",
          expiryDate: futureDate(18).toISOString(),
          minAmount: 600,
          maxDiscount: 300,
          termsConditions: "Valid on all shows",
          valueScore: 7.9,
        },
        {
          code: "BOOKMYSHOW250",
          title: "₹250 Off on Events",
          brand: "BookMyShow",
          category: "entertainment",
          type: "discount",
          value: 250,
          valueType: "fixed",
          description: "Save ₹250 on concerts and events",
          expiryDate: futureDate(22).toISOString(),
          minAmount: 800,
          maxDiscount: 250,
          termsConditions: "Valid on select events",
          valueScore: 7.6,
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "550",
      primaryCategory: "combo",
      listingNote: "Entertainment combo - Movies + Events",
      listingType: "sell",
      sellingPrice: "440",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 55,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing5: CouponMartListing = {
      id: "coupon-mart-combo-5",
      userId: "demo-user-13",
      coupons: [
        {
          code: "CULT500",
          title: "₹500 Off on Fitness Classes",
          brand: "Cult.fit",
          category: "fitness",
          type: "discount",
          value: 500,
          valueType: "fixed",
          description: "Save ₹500 on fitness membership",
          expiryDate: futureDate(40).toISOString(),
          minAmount: 2000,
          maxDiscount: 500,
          termsConditions: "Valid on all memberships",
          valueScore: 8.3,
        },
        {
          code: "HEALTHIFY300",
          title: "₹300 Off on Nutrition Plan",
          brand: "HealthifyMe",
          category: "fitness",
          type: "discount",
          value: 300,
          valueType: "fixed",
          description: "Get ₹300 off on premium nutrition plans",
          expiryDate: futureDate(35).toISOString(),
          minAmount: 1000,
          maxDiscount: 300,
          termsConditions: "Valid for premium plans",
          valueScore: 7.9,
        },
        {
          code: "1MG200",
          title: "₹200 Off on Supplements",
          brand: "1mg",
          category: "medical",
          type: "discount",
          value: 200,
          valueType: "fixed",
          description: "₹200 off on health supplements",
          expiryDate: futureDate(60).toISOString(),
          minAmount: 500,
          maxDiscount: 200,
          termsConditions: "Valid on all supplements",
          valueScore: 7.4,
        },
        {
          code: "PHYSIO150",
          title: "₹150 Off on Physiotherapy",
          brand: "Portea",
          category: "medical",
          type: "discount",
          value: 150,
          valueType: "fixed",
          description: "Save ₹150 on physiotherapy sessions",
          expiryDate: futureDate(30).toISOString(),
          minAmount: 800,
          maxDiscount: 150,
          termsConditions: "Valid on all services",
          valueScore: 7.2,
        }
      ],
      totalCouponCount: 4,
      totalFaceValue: "1150",
      primaryCategory: "combo",
      listingNote: "Health & Fitness mega combo - 4 premium coupons",
      listingType: "sell",
      sellingPrice: "920",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 88,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing6: CouponMartListing = {
      id: "coupon-mart-combo-6",
      userId: "demo-user-14",
      coupons: [
        {
          code: "UDEMY600",
          title: "₹600 Off on Online Courses",
          brand: "Udemy",
          category: "education",
          type: "discount",
          value: 600,
          valueType: "fixed",
          description: "Get ₹600 off on premium courses",
          expiryDate: futureDate(70).toISOString(),
          minAmount: 1500,
          maxDiscount: 600,
          termsConditions: "Valid on all courses",
          valueScore: 8.1,
        },
        {
          code: "COURSERA400",
          title: "₹400 Off on Certifications",
          brand: "Coursera",
          category: "education",
          type: "discount",
          value: 400,
          valueType: "fixed",
          description: "Save ₹400 on professional certifications",
          expiryDate: futureDate(65).toISOString(),
          minAmount: 2000,
          maxDiscount: 400,
          termsConditions: "Valid on certificate programs",
          valueScore: 7.9,
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "1000",
      primaryCategory: "combo",
      listingNote: "Education combo - Udemy + Coursera",
      listingType: "sell",
      sellingPrice: "800",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 72,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing7: CouponMartListing = {
      id: "coupon-mart-combo-7",
      userId: "demo-user-15",
      coupons: [
        {
          code: "AIRTEL250",
          title: "₹250 Off on Recharge",
          brand: "Airtel",
          category: "bills",
          type: "discount",
          value: 250,
          valueType: "fixed",
          description: "Get ₹250 cashback on recharge",
          expiryDate: futureDate(15).toISOString(),
          minAmount: 500,
          maxDiscount: 250,
          termsConditions: "Valid on prepaid recharges",
          valueScore: 7.7,
        },
        {
          code: "PAYTM200",
          title: "₹200 Cashback on Bills",
          brand: "Paytm",
          category: "bills",
          type: "cashback",
          value: 200,
          valueType: "fixed",
          description: "₹200 cashback on utility bill payments",
          expiryDate: futureDate(12).toISOString(),
          minAmount: 1000,
          maxDiscount: 200,
          termsConditions: "Valid on electricity and gas bills",
          valueScore: 7.5,
        },
        {
          code: "JIO180",
          title: "₹180 Off on Plans",
          brand: "Jio",
          category: "bills",
          type: "discount",
          value: 180,
          valueType: "fixed",
          description: "Save ₹180 on prepaid plans",
          expiryDate: futureDate(20).toISOString(),
          minAmount: 400,
          maxDiscount: 180,
          termsConditions: "Valid on all plans",
          valueScore: 7.3,
        }
      ],
      totalCouponCount: 3,
      totalFaceValue: "630",
      primaryCategory: "combo",
      listingNote: "Bills & Recharge combo - Save on utilities",
      listingType: "sell",
      sellingPrice: "500",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 63,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing8: CouponMartListing = {
      id: "coupon-mart-combo-8",
      userId: "demo-user-16",
      coupons: [
        {
          code: "AMAZON800",
          title: "₹800 Amazon Gift Voucher",
          brand: "Amazon",
          category: "shopping",
          type: "gift_card",
          value: 800,
          valueType: "fixed",
          description: "Amazon gift card worth ₹800",
          expiryDate: futureDate(90).toISOString(),
          minAmount: null,
          maxDiscount: null,
          termsConditions: "Valid on Amazon.in only",
          valueScore: 8.4,
        },
        {
          code: "FLIPKART600",
          title: "₹600 Flipkart Voucher",
          brand: "Flipkart",
          category: "shopping",
          type: "gift_card",
          value: 600,
          valueType: "fixed",
          description: "Flipkart gift voucher worth ₹600",
          expiryDate: futureDate(85).toISOString(),
          minAmount: null,
          maxDiscount: null,
          termsConditions: "Valid on all products",
          valueScore: 8.2,
        },
        {
          code: "BIGBAZAR400",
          title: "₹400 Off on Groceries",
          brand: "Big Bazaar",
          category: "shopping",
          type: "discount",
          value: 400,
          valueType: "fixed",
          description: "Save ₹400 on grocery shopping",
          expiryDate: futureDate(25).toISOString(),
          minAmount: 1000,
          maxDiscount: 400,
          termsConditions: "Valid on all items",
          valueScore: 7.6,
        }
      ],
      totalCouponCount: 3,
      totalFaceValue: "1800",
      primaryCategory: "combo",
      listingNote: "Ultimate shopping combo - Amazon, Flipkart & Big Bazaar",
      listingType: "sell",
      sellingPrice: "1450",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 105,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing9: CouponMartListing = {
      id: "coupon-mart-combo-9",
      userId: "demo-user-17",
      coupons: [
        {
          code: "SWIGGY600",
          title: "₹600 Off on Food Orders",
          brand: "Swiggy",
          category: "food",
          type: "discount",
          value: 600,
          valueType: "fixed",
          description: "Get ₹600 off on orders above ₹1200",
          expiryDate: futureDate(35).toISOString(),
          minAmount: 1200,
          maxDiscount: 600,
          termsConditions: "Valid for all users",
          valueScore: 8.0,
        },
        {
          code: "UBER250",
          title: "₹250 Off on Rides",
          brand: "Uber",
          category: "travel",
          type: "discount",
          value: 250,
          valueType: "fixed",
          description: "Flat ₹250 off on cab rides",
          expiryDate: futureDate(30).toISOString(),
          minAmount: 400,
          maxDiscount: 250,
          termsConditions: "Valid on all rides",
          valueScore: 7.8,
        },
        {
          code: "AMAZON500",
          title: "₹500 Amazon Voucher",
          brand: "Amazon",
          category: "shopping",
          type: "gift_card",
          value: 500,
          valueType: "fixed",
          description: "Amazon gift card worth ₹500",
          expiryDate: futureDate(90).toISOString(),
          minAmount: null,
          maxDiscount: null,
          termsConditions: "Valid on Amazon.in only",
          valueScore: 8.2,
        },
        {
          code: "NETFLIX350",
          title: "₹350 Off on Subscription",
          brand: "Netflix",
          category: "entertainment",
          type: "discount",
          value: 350,
          valueType: "fixed",
          description: "Save ₹350 on 3-month subscription",
          expiryDate: futureDate(25).toISOString(),
          minAmount: 1000,
          maxDiscount: 350,
          termsConditions: "Valid on premium plans",
          valueScore: 7.7,
        },
        {
          code: "GYM400",
          title: "₹400 Off on Membership",
          brand: "Gold's Gym",
          category: "fitness",
          type: "discount",
          value: 400,
          valueType: "fixed",
          description: "Get ₹400 off on 6-month membership",
          expiryDate: futureDate(40).toISOString(),
          minAmount: 3000,
          maxDiscount: 400,
          termsConditions: "Valid for new members",
          valueScore: 7.9,
        }
      ],
      totalCouponCount: 5,
      totalFaceValue: "2100",
      primaryCategory: "combo",
      listingNote: "Premium lifestyle combo - 5 amazing coupons across categories",
      listingType: "sell",
      sellingPrice: "1680",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 142,
      createdAt: now,
      updatedAt: now,
    };

    const comboListing10: CouponMartListing = {
      id: "coupon-mart-combo-10",
      userId: "demo-user-18",
      coupons: [
        {
          code: "ZOMATO450",
          title: "₹450 Off on Food Delivery",
          brand: "Zomato",
          category: "food",
          type: "discount",
          value: 450,
          valueType: "fixed",
          description: "₹450 off on orders above ₹900",
          expiryDate: futureDate(28).toISOString(),
          minAmount: 900,
          maxDiscount: 450,
          termsConditions: "Valid on all restaurants",
          valueScore: 7.9,
        },
        {
          code: "BOOKMYSHOW300",
          title: "₹300 Off on Movies",
          brand: "BookMyShow",
          category: "entertainment",
          type: "discount",
          value: 300,
          valueType: "fixed",
          description: "Save ₹300 on movie tickets",
          expiryDate: futureDate(20).toISOString(),
          minAmount: 700,
          maxDiscount: 300,
          termsConditions: "Valid on all shows",
          valueScore: 7.7,
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "750",
      primaryCategory: "combo",
      listingNote: "Weekend combo - Food + Movies",
      listingType: "trade",
      tradePreference: "Fitness or Travel coupons",
      tradeNote: "Looking for fitness gym memberships or flight coupons",
      tradeCategory: "fitness",
      tradeCouponsRequired: 1,
      tradeMinValueScore: "6.0",
      tradeMaxValueScore: "9.0",
      tradeCouponRequirements: null,
      sellingPrice: null,
      status: "active",
      visibility: "public",
      views: 58,
      createdAt: now,
      updatedAt: now,
    };

    // Add all listings to storage
    this.couponMartListings.set(listing1.id, listing1);
    this.couponMartListings.set(listing2.id, listing2);
    this.couponMartListings.set(listing3.id, listing3);
    this.couponMartListings.set(listing4.id, listing4);
    this.couponMartListings.set(listing5.id, listing5);
    this.couponMartListings.set(listing6.id, listing6);
    this.couponMartListings.set(listing7.id, listing7);
    this.couponMartListings.set(listing8.id, listing8);
    this.couponMartListings.set(comboListing1.id, comboListing1);
    this.couponMartListings.set(comboListing2.id, comboListing2);
    this.couponMartListings.set(comboListing3.id, comboListing3);
    this.couponMartListings.set(comboListing4.id, comboListing4);
    this.couponMartListings.set(comboListing5.id, comboListing5);
    this.couponMartListings.set(comboListing6.id, comboListing6);
    this.couponMartListings.set(comboListing7.id, comboListing7);
    this.couponMartListings.set(comboListing8.id, comboListing8);
    this.couponMartListings.set(comboListing9.id, comboListing9);
    this.couponMartListings.set(comboListing10.id, comboListing10);

    // Add sample trade offers
    const tradeOffer1: CouponMartTradeOffer = {
      id: "trade-offer-1",
      listingId: listing3.id,
      offererId: "demo-user-10",
      listingOwnerId: listing3.userId,
      offeredCoupons: [
        {
          code: "SWIGGY400",
          title: "₹400 Off on Food Orders",
          brand: "Swiggy",
          value: "400",
          expiry: futureDate(25).toISOString(),
          status: "pending"
        },
        {
          code: "ZOMATO350",
          title: "₹350 Off on Zomato Orders",
          brand: "Zomato",
          value: "350",
          expiry: futureDate(30).toISOString(),
          status: "pending"
        }
      ],
      offerNote: "I have 2 food delivery coupons that I'd like to trade for your health coupon",
      status: "pending",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      respondedAt: null,
      responseNote: null,
    };

    const tradeOffer2: CouponMartTradeOffer = {
      id: "trade-offer-2",
      listingId: comboListing10.id,
      offererId: "demo-user-5",
      listingOwnerId: comboListing10.userId,
      offeredCoupons: [
        {
          code: "CULT500",
          title: "₹500 Off on Fitness Classes",
          brand: "Cult.fit",
          value: "500",
          expiry: futureDate(35).toISOString(),
          status: "pending"
        },
        {
          code: "GOLDSGYM400",
          title: "₹400 Off on Gym Membership",
          brand: "Gold's Gym",
          value: "400",
          expiry: futureDate(40).toISOString(),
          status: "pending"
        },
        {
          code: "FITPASS300",
          title: "₹300 Off on Fitness Pass",
          brand: "FITPASS",
          value: "300",
          expiry: futureDate(28).toISOString(),
          status: "pending"
        }
      ],
      offerNote: "Would love to trade my 3 fitness coupons for your weekend combo",
      status: "pending",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      respondedAt: null,
      responseNote: null,
    };

    const tradeOffer3: CouponMartTradeOffer = {
      id: "trade-offer-3",
      listingId: listing6.id,
      offererId: "demo-user-2",
      listingOwnerId: listing6.userId,
      offeredCoupons: [
        {
          code: "BOOKMYSHOW350",
          title: "₹350 Off on Movie Tickets",
          brand: "BookMyShow",
          value: "350",
          expiry: futureDate(20).toISOString(),
          status: "accepted"
        },
        {
          code: "NETFLIX300",
          title: "₹300 Off on Subscription",
          brand: "Netflix",
          value: "300",
          expiry: futureDate(25).toISOString(),
          status: "accepted"
        }
      ],
      offerNote: "Interested in your Amazon gift card, offering 2 entertainment coupons",
      status: "all_accepted",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      responseNote: "Great! Let's exchange",
    };

    const tradeOffer4: CouponMartTradeOffer = {
      id: "trade-offer-4",
      listingId: listing7.id,
      offererId: "demo-user-11",
      listingOwnerId: listing7.userId,
      offeredCoupons: [
        {
          code: "UBER150",
          title: "₹150 Off on Rides",
          brand: "Uber",
          value: "150",
          expiry: futureDate(15).toISOString(),
          status: "rejected"
        }
      ],
      offerNote: "Would like to trade for fashion coupon",
      status: "rejected",
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      responseNote: "Sorry, looking for higher value coupons",
    };

    this.couponMartTradeOffers.set(tradeOffer1.id, tradeOffer1);
    this.couponMartTradeOffers.set(tradeOffer2.id, tradeOffer2);
    this.couponMartTradeOffers.set(tradeOffer3.id, tradeOffer3);
    this.couponMartTradeOffers.set(tradeOffer4.id, tradeOffer4);
  }

  // OLD SCHEMA FUNCTION REMOVED - All CouponMart data now uses new multi-coupon schema with coupons[] array
  
  // Sample transaction data initialization removed - Transactions now added via initializeCouponMartSampleData()
  // which defines transactions that reference the new listing schema

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: "user-1",
      phone: "9797997799",
      name: "Joshua J Kanatt",
      email: "joshua@example.com",
      dateOfBirth: "03/09/1997",
      gender: "Male",
      maritalStatus: "Single",
      pincode: "678004",
      panCard: "ABCDE1234F",
      residenceType: "Owned by parents",
      creditScore: 750,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Additional test users for ShareWise
    const testUser2: User = {
      id: "user-2",
      phone: "9876543210",
      name: "Priya Sharma",
      email: "priya@example.com",
      dateOfBirth: "15/06/1995",
      gender: "Female",
      maritalStatus: "Single",
      pincode: "110001",
      panCard: "BCDEF2345G",
      residenceType: "Rented",
      creditScore: 780,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.users.set(testUser2.id, testUser2);

    const testUser3: User = {
      id: "user-3",
      phone: "9123456789",
      name: "Rahul Verma",
      email: "rahul@example.com",
      dateOfBirth: "22/03/1992",
      gender: "Male",
      maritalStatus: "Married",
      pincode: "400001",
      panCard: "CDEFG3456H",
      residenceType: "Owned",
      creditScore: 720,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.users.set(testUser3.id, testUser3);

    const testUser4: User = {
      id: "user-4",
      phone: "9988776655",
      name: "Anjali Reddy",
      email: "anjali@example.com",
      dateOfBirth: "10/11/1998",
      gender: "Female",
      maritalStatus: "Single",
      pincode: "500001",
      panCard: "DEFGH4567I",
      residenceType: "Rented",
      creditScore: 690,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.users.set(testUser4.id, testUser4);

    const testUser5: User = {
      id: "user-5",
      phone: "9012345678",
      name: "Vikram Singh",
      email: "vikram@example.com",
      dateOfBirth: "05/08/1990",
      gender: "Male",
      maritalStatus: "Married",
      pincode: "600001",
      panCard: "EFGHI5678J",
      residenceType: "Owned",
      creditScore: 760,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.users.set(testUser5.id, testUser5);

    // Sample active loan
    const sampleLoan: LoanApplication = {
      id: "loan-1",
      userId: "user-1",
      loanType: "personal",
      amount: "500000",
      tenure: 36,
      interestRate: "12.00",
      emi: "15420",
      status: "active",
      purpose: "General Purpose",
      applicationNumber: "PL-2024-001",
      approvedAmount: "500000",
      disbursedAmount: "500000",
      outstandingAmount: "325000",
      totalPaid: "175000",
      nextEmiDate: new Date("2025-01-15"),
      createdAt: new Date("2024-12-28"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan.id, sampleLoan);
    
    // Add the same loan with numeric ID for easier access
    const sampleLoanNumeric: LoanApplication = {
      ...sampleLoan,
      id: "1"
    };
    this.loanApplications.set(sampleLoanNumeric.id, sampleLoanNumeric);

    // Sample processing loan
    const sampleLoan2: LoanApplication = {
      id: "loan-2",
      userId: "user-1",
      loanType: "vehicle",
      amount: "800000",
      tenure: 60,
      interestRate: "10.50",
      emi: "17200",
      status: "pending",
      purpose: "Vehicle Purchase",
      applicationNumber: "VL-2024-002",
      approvedAmount: null,
      disbursedAmount: null,
      outstandingAmount: null,
      totalPaid: "0",
      nextEmiDate: null,
      createdAt: new Date("2025-01-20"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan2.id, sampleLoan2);
    
    // Add loan 2 with numeric ID for easier access
    const sampleLoanNumeric2: LoanApplication = {
      ...sampleLoan2,
      id: "2"
    };
    this.loanApplications.set(sampleLoanNumeric2.id, sampleLoanNumeric2);

    // Sample completed loan
    const sampleLoan3: LoanApplication = {
      id: "loan-3",
      userId: "user-1",
      loanType: "home",
      amount: "2500000",
      tenure: 240,
      interestRate: "8.50",
      emi: "21800",
      status: "completed",
      purpose: "Home Purchase",
      applicationNumber: "HL-2023-001",
      approvedAmount: "2500000",
      disbursedAmount: "2500000",
      outstandingAmount: "0",
      totalPaid: "2500000",
      nextEmiDate: null,
      createdAt: new Date("2023-03-15"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan3.id, sampleLoan3);

    // Add loan 3 with numeric ID for easier access
    const sampleLoanNumeric3: LoanApplication = {
      ...sampleLoan3,
      id: "3"
    };
    this.loanApplications.set(sampleLoanNumeric3.id, sampleLoanNumeric3);

    // Sample rejected loan
    const sampleLoan4: LoanApplication = {
      id: "loan-4",
      userId: "user-1",
      loanType: "personal",
      amount: "1000000",
      tenure: 48,
      interestRate: "14.00",
      emi: "27500",
      status: "rejected",
      purpose: "Business Expansion",
      applicationNumber: "PL-2024-003",
      approvedAmount: null,
      disbursedAmount: null,
      outstandingAmount: null,
      totalPaid: "0",
      nextEmiDate: null,
      createdAt: new Date("2024-11-20"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan4.id, sampleLoan4);

    // Sample approved loan (not disbursed yet)
    const sampleLoan5: LoanApplication = {
      id: "loan-5",
      userId: "user-1",
      loanType: "vehicle",
      amount: "650000",
      tenure: 48,
      interestRate: "9.75",
      emi: "16800",
      status: "approved",
      purpose: "Car Purchase",
      applicationNumber: "VL-2025-001",
      approvedAmount: "650000",
      disbursedAmount: null,
      outstandingAmount: "650000",
      totalPaid: "0",
      nextEmiDate: new Date("2025-02-15"),
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan5.id, sampleLoan5);

    // Additional active loan for variety
    const sampleLoan6: LoanApplication = {
      id: "loan-6",
      userId: "user-1",
      loanType: "home",
      amount: "3500000",
      tenure: 240,
      interestRate: "8.75",
      emi: "31200",
      status: "active",
      purpose: "Home Purchase",
      applicationNumber: "HL-2024-006",
      approvedAmount: "3500000",
      disbursedAmount: "3500000",
      outstandingAmount: "3200000",
      totalPaid: "300000",
      nextEmiDate: new Date("2025-02-12"),
      createdAt: new Date("2024-10-15"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan6.id, sampleLoan6);

    // Additional pending loan
    const sampleLoan7: LoanApplication = {
      id: "loan-7",
      userId: "user-1",
      loanType: "personal",
      amount: "250000",
      tenure: 24,
      interestRate: "13.25",
      emi: "12100",
      status: "pending",
      purpose: "Education",
      applicationNumber: "PL-2025-007",
      approvedAmount: null,
      disbursedAmount: null,
      outstandingAmount: null,
      totalPaid: "0",
      nextEmiDate: null,
      createdAt: new Date("2025-01-28"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan7.id, sampleLoan7);

    // Additional completed loan
    const sampleLoan8: LoanApplication = {
      id: "loan-8",
      userId: "user-1",
      loanType: "vehicle",
      amount: "900000",
      tenure: 36,
      interestRate: "10.25",
      emi: "29200",
      status: "completed",
      purpose: "Motorcycle Purchase",
      applicationNumber: "VL-2022-008",
      approvedAmount: "900000",
      disbursedAmount: "900000",
      outstandingAmount: "0",
      totalPaid: "1051200",
      nextEmiDate: null,
      createdAt: new Date("2022-05-20"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan8.id, sampleLoan8);

    // Additional rejected loan
    const sampleLoan9: LoanApplication = {
      id: "loan-9",
      userId: "user-1",
      loanType: "personal",
      amount: "750000",
      tenure: 60,
      interestRate: "16.50",
      emi: "18900",
      status: "rejected",
      purpose: "Debt Consolidation",
      applicationNumber: "PL-2024-009",
      approvedAmount: null,
      disbursedAmount: null,
      outstandingAmount: null,
      totalPaid: "0",
      nextEmiDate: null,
      createdAt: new Date("2024-12-05"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan9.id, sampleLoan9);

    // Sample UPI Accounts
    const sampleUpiAccounts = [
      {
        id: "upi-1",
        userId: "user-1",
        upiId: "joshua@paytm",
        bankName: "HDFC Bank",
        accountNumber: "****1234",
        ifscCode: "HDFC0001234",
        accountHolderName: "Joshua J Kanatt",
        isPrimary: 1,
        isVerified: 1,
        upiApp: "paytm",
        createdAt: new Date(),
      },
      {
        id: "upi-2",
        userId: "user-1",
        upiId: "joshua@gpay",
        bankName: "ICICI Bank",
        accountNumber: "****5678",
        ifscCode: "ICIC0005678",
        accountHolderName: "Joshua J Kanatt",
        isPrimary: 0,
        isVerified: 1,
        upiApp: "googlepay",
        createdAt: new Date(),
      }
    ];
    sampleUpiAccounts.forEach(account => this.upiAccounts.set(account.id, account));

    // Sample UPI Transactions
    const sampleUpiTransactions = [
      {
        id: "txn-1",
        userId: "user-1",
        externalTransactionId: "UPI1704067200123",
        amount: "500.00",
        transactionType: "payment",
        status: "success",
        description: "Coffee payment",
        senderAccountId: "upi-1",
        recipientAccountId: null,
        recipientUpiId: "coffee@paytm",
        recipientName: "Coffee Shop",
        senderUpiId: "joshua@paytm",
        referenceNumber: "403993715518",
        loanId: null,
        billType: null,
        billAccountNumber: null,
        cashbackEarned: "5.00",
        pointsEarned: 10,
        metadata: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "txn-2",
        userId: "user-1",
        externalTransactionId: "UPI1704067200124",
        amount: "11250.00",
        transactionType: "emi_payment",
        status: "success",
        description: "EMI Payment - PL-2024-004",
        senderAccountId: "upi-1",
        recipientAccountId: null,
        recipientUpiId: null,
        recipientName: null,
        senderUpiId: "joshua@paytm",
        referenceNumber: "403993715519",
        loanId: "4",
        billType: null,
        billAccountNumber: null,
        cashbackEarned: "0.00",
        pointsEarned: 0,
        metadata: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "txn-3",
        userId: "user-1",
        externalTransactionId: "UPI1704067200125",
        amount: "399.00",
        transactionType: "bill_payment",
        status: "success",
        description: "Jio Mobile Recharge",
        senderAccountId: "upi-1",
        recipientAccountId: null,
        recipientUpiId: null,
        recipientName: null,
        senderUpiId: "joshua@paytm",
        referenceNumber: "403993715520",
        loanId: null,
        billType: "mobile",
        billAccountNumber: "9876543210",
        cashbackEarned: "2.00",
        pointsEarned: 5,
        metadata: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleUpiTransactions.forEach(txn => this.upiTransactions.set(txn.id, txn));

    // Sample Bill Payment Services
    const sampleBillServices = [
      {
        id: "service-1",
        serviceName: "Jio Prepaid",
        serviceType: "mobile",
        serviceProvider: "Jio",
        iconUrl: "/icons/jio.png",
        isActive: 1,
        minAmount: "10.00",
        maxAmount: "5000.00",
        processingFee: "0.00",
        cashbackPercentage: "0.50",
        createdAt: new Date(),
      },
      {
        id: "service-2",
        serviceName: "Airtel Prepaid",
        serviceType: "mobile",
        serviceProvider: "Airtel",
        iconUrl: "/icons/airtel.png",
        isActive: 1,
        minAmount: "10.00",
        maxAmount: "5000.00",
        processingFee: "0.00",
        cashbackPercentage: "0.30",
        createdAt: new Date(),
      },
      {
        id: "service-3",
        serviceName: "Tata Sky DTH",
        serviceType: "dth",
        serviceProvider: "Tata Sky",
        iconUrl: "/icons/tatasky.png",
        isActive: 1,
        minAmount: "100.00",
        maxAmount: "10000.00",
        processingFee: "0.00",
        cashbackPercentage: "0.25",
        createdAt: new Date(),
      }
    ];
    sampleBillServices.forEach(service => this.billPaymentServices.set(service.id, service));

    // Sample Investment Portfolio
    const sampleInvestments: InvestmentPortfolio[] = [
      {
        id: "inv-1",
        userId: "user-1",
        investmentType: "stocks",
        instrumentName: "Reliance Industries",
        symbol: "RELIANCE",
        quantity: "10.000000",
        avgPrice: "2450.00",
        currentPrice: "2680.00",
        totalInvested: "24500.00",
        currentValue: "26800.00",
        gainLoss: "2300.00",
        gainLossPercentage: "9.39",
        dividendEarned: "150.00",
        maturityDate: null,
        riskLevel: "medium",
        category: "large_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-2",
        userId: "user-1",
        investmentType: "mutual_funds",
        instrumentName: "SBI Blue Chip Fund",
        symbol: "SBIBCF",
        quantity: "500.000000",
        avgPrice: "45.20",
        currentPrice: "52.80",
        totalInvested: "22600.00",
        currentValue: "26400.00",
        gainLoss: "3800.00",
        gainLossPercentage: "16.81",
        dividendEarned: "0.00",
        maturityDate: null,
        riskLevel: "medium",
        category: "large_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-3",
        userId: "user-1",
        investmentType: "fixed_deposits",
        instrumentName: "HDFC Fixed Deposit",
        symbol: null,
        quantity: "1.000000",
        avgPrice: "100000.00",
        currentPrice: "108500.00",
        totalInvested: "100000.00",
        currentValue: "108500.00",
        gainLoss: "8500.00",
        gainLossPercentage: "8.50",
        dividendEarned: "0.00",
        maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        riskLevel: "low",
        category: "debt",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-4",
        userId: "user-1",
        investmentType: "stocks",
        instrumentName: "Infosys Limited",
        symbol: "INFY",
        quantity: "15.000000",
        avgPrice: "1520.00",
        currentPrice: "1680.00",
        totalInvested: "22800.00",
        currentValue: "25200.00",
        gainLoss: "2400.00",
        gainLossPercentage: "10.53",
        dividendEarned: "300.00",
        maturityDate: null,
        riskLevel: "medium",
        category: "large_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-5",
        userId: "user-1",
        investmentType: "SIP",
        instrumentName: "HDFC Mid-Cap Opportunities SIP",
        symbol: "HDFCMIDCAP",
        quantity: "850.000000",
        avgPrice: "42.50",
        currentPrice: "48.20",
        totalInvested: "36125.00",
        currentValue: "40970.00",
        gainLoss: "4845.00",
        gainLossPercentage: "13.41",
        dividendEarned: "0.00",
        maturityDate: null,
        riskLevel: "high",
        category: "mid_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-6",
        userId: "user-1",
        investmentType: "FD",
        instrumentName: "ICICI Bank Fixed Deposit",
        symbol: null,
        quantity: "1.000000",
        avgPrice: "50000.00",
        currentPrice: "53250.00",
        totalInvested: "50000.00",
        currentValue: "53250.00",
        gainLoss: "3250.00",
        gainLossPercentage: "6.50",
        dividendEarned: "0.00",
        maturityDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        riskLevel: "low",
        category: "debt",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-7",
        userId: "user-1",
        investmentType: "STP",
        instrumentName: "Axis Bluechip to Mid-Cap STP",
        symbol: "AXISSTP",
        quantity: "320.000000",
        avgPrice: "55.80",
        currentPrice: "61.20",
        totalInvested: "17856.00",
        currentValue: "19584.00",
        gainLoss: "1728.00",
        gainLossPercentage: "9.68",
        dividendEarned: "0.00",
        maturityDate: null,
        riskLevel: "medium",
        category: "mid_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-8",
        userId: "user-1",
        investmentType: "SWP",
        instrumentName: "Franklin India Balanced SWP",
        symbol: "FRANKSWP",
        quantity: "1200.000000",
        avgPrice: "38.50",
        currentPrice: "41.80",
        totalInvested: "46200.00",
        currentValue: "50160.00",
        gainLoss: "3960.00",
        gainLossPercentage: "8.57",
        dividendEarned: "1200.00",
        maturityDate: null,
        riskLevel: "medium",
        category: "balanced",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      },
      {
        id: "inv-9",
        userId: "user-1",
        investmentType: "Mutual Fund",
        instrumentName: "Kotak Emerging Equity Fund",
        symbol: "KOTEQF",
        quantity: "600.000000",
        avgPrice: "65.20",
        currentPrice: "72.50",
        totalInvested: "39120.00",
        currentValue: "43500.00",
        gainLoss: "4380.00",
        gainLossPercentage: "11.20",
        dividendEarned: "0.00",
        maturityDate: null,
        riskLevel: "high",
        category: "mid_cap",
        isActive: 1,
        lastUpdated: new Date(),
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleInvestments.forEach(investment => this.investmentPortfolio.set(investment.id, investment));

    // Add active loan with ID "4" for loan detail page
    const sampleLoan4Numeric: LoanApplication = {
      id: "4",
      userId: "user-1",
      loanType: "personal",
      amount: "300000",
      tenure: 30,
      interestRate: "11.5",
      emi: "11250",
      status: "active",
      purpose: "Home Improvement",
      applicationNumber: "PL-2024-004",
      approvedAmount: "300000",
      disbursedAmount: "300000",
      outstandingAmount: "225000",
      totalPaid: "75000",
      nextEmiDate: new Date("2025-02-15"),
      createdAt: new Date("2024-08-15"),
      updatedAt: new Date(),
    };
    this.loanApplications.set(sampleLoan4Numeric.id, sampleLoan4Numeric);

    // Sample EMI Payments for loan history
    const emiPayments = [
      {
        id: "emi-1",
        loanId: "loan-1",
        amount: "15420.00",
        paymentDate: new Date("2024-12-14"),
        status: "success",
        transactionId: "TXN123456789",
      },
      {
        id: "emi-2",
        loanId: "loan-1", 
        amount: "15420.00",
        paymentDate: new Date("2024-11-14"),
        status: "success",
        transactionId: "TXN123456788",
      },
      {
        id: "emi-3",
        loanId: "loan-1",
        amount: "15420.00", 
        paymentDate: new Date("2024-10-14"),
        status: "success",
        transactionId: "TXN123456787",
      },
      {
        id: "emi-4",
        loanId: "loan-3",
        amount: "21800.00",
        paymentDate: new Date("2023-04-15"),
        status: "success",
        transactionId: "TXN987654321",
      },
      {
        id: "emi-5",
        loanId: "loan-3",
        amount: "21800.00",
        paymentDate: new Date("2023-03-15"),
        status: "success",
        transactionId: "TXN987654320",
      },
      // EMI payments for loan with ID "4"
      {
        id: "emi-6",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2025-01-15"),
        status: "success",
        transactionId: "TXN456789123",
      },
      {
        id: "emi-7",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2024-12-15"),
        status: "success",
        transactionId: "TXN456789122",
      },
      {
        id: "emi-8",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2024-11-15"),
        status: "success",
        transactionId: "TXN456789121",
      },
      {
        id: "emi-9",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2024-10-15"),
        status: "success",
        transactionId: "TXN456789120",
      },
      {
        id: "emi-10",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2024-09-15"),
        status: "success",
        transactionId: "TXN456789119",
      },
      {
        id: "emi-11",
        loanId: "4",
        amount: "11250.00",
        paymentDate: new Date("2024-08-15"),
        status: "success",
        transactionId: "TXN456789118",
      }
    ];

    emiPayments.forEach(payment => {
      this.emiPayments.set(payment.id, payment);
    });

    // Sample notifications
    const notifications: Notification[] = [
      {
        id: "notif-1",
        userId: "user-1",
        title: "EMI Payment Successful",
        message: "Your EMI of ₹15,420 has been successfully processed for loan PL-2024-001",
        type: "payment",
        isRead: 0,
        metadata: { loanId: "loan-1", amount: "15420" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "notif-2",
        userId: "user-1",
        title: "Document Verification",
        message: "Your documents for vehicle loan application have been verified successfully",
        type: "document",
        isRead: 0,
        metadata: { loanId: "loan-2" },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "notif-3",
        userId: "user-1",
        title: "EMI Due Reminder",
        message: "Your next EMI of ₹15,420 is due on January 15, 2025",
        type: "reminder",
        isRead: 0,
        metadata: { loanId: "loan-1", dueDate: "2025-01-15" },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    notifications.forEach(notif => this.notifications.set(notif.id, notif));

    // Sample loan offers
    const sampleOffers: LoanOffer[] = [
      {
        id: "offer-1",
        lenderId: "lender-1",
        lenderName: "HDFC Bank",
        loanType: "personal",
        minAmount: "50000",
        maxAmount: "5000000",
        interestRate: "10.50",
        processingFee: "2.50",
        maxTenure: 60,
        trustBadge: "diamond",
        approvalSpeed: "2 hours",
        requiredDocs: ["pan", "aadhaar", "salary_slip"],
        isSponsored: 1,
        isSuperPayBacked: 1,
        eligibilityCriteria: { minSalary: 25000, minAge: 21 },
        createdAt: new Date(),
      },
      {
        id: "offer-2", 
        lenderId: "lender-2",
        lenderName: "ICICI Bank",
        loanType: "personal",
        minAmount: "30000",
        maxAmount: "3000000", 
        interestRate: "12.00",
        processingFee: "1.50",
        maxTenure: 48,
        trustBadge: "gold",
        approvalSpeed: "24 hours",
        requiredDocs: ["pan", "aadhaar", "bank_statement"],
        isSponsored: 0,
        isSuperPayBacked: 1,
        eligibilityCriteria: { minSalary: 20000, minAge: 23 },
        createdAt: new Date(),
      },
    ];
    sampleOffers.forEach(offer => this.loanOffers.set(offer.id, offer));

    // Sample credit card offers
    const sampleCreditCards: CreditCardOffer[] = [
      {
        id: "cc-1",
        providerName: "HDFC Bank",
        providerLogo: null,
        cardName: "HDFC Regalia Gold",
        cardType: "premium",
        category: "lifestyle",
        joiningFee: "2500",
        annualFee: "2500",
        feeWaiver: "Fee waived on annual spends above ₹3 lakhs",
        creditLimit: "₹2,00,000 - ₹10,00,000",
        interestRate: "3.49",
        rewardRate: "4 points per ₹150 spent",
        welcomeBonus: "10,000 reward points",
        keyFeatures: ["Contactless payments", "Global acceptance", "EMI conversion", "Add-on cards"],
        benefits: ["Airport lounge access", "Complimentary golf games", "Travel insurance", "Fuel surcharge waiver"],
        eligibilityCriteria: { minAge: 21, maxAge: 60, minIncome: "60000", minCreditScore: 750, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip", "Bank Statement"],
        rating: "4.5",
        views: 12450,
        applications: 523,
        approvalRate: "72.5",
        tags: ["Premium", "Lifestyle", "Travel"],
        isPremium: 1,
        isPopular: 1,
        processingTime: "5-7 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-2",
        providerName: "SBI Card",
        providerLogo: null,
        cardName: "SBI SimplyCLICK",
        cardType: "credit",
        category: "cashback",
        joiningFee: "499",
        annualFee: "499",
        feeWaiver: "First year free on card issuance",
        creditLimit: "₹50,000 - ₹5,00,000",
        interestRate: "3.50",
        rewardRate: "10X rewards on online spends",
        welcomeBonus: "₹500 Amazon voucher",
        keyFeatures: ["Contactless", "Virtual card", "Auto-pay", "Reward catalog"],
        benefits: ["Online shopping rewards", "Movie ticket offers", "Dining privileges", "Fuel surcharge waiver"],
        eligibilityCriteria: { minAge: 21, maxAge: 65, minIncome: "20000", minCreditScore: 700, employmentType: "Salaried/Self-employed/Student" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof"],
        rating: "4.3",
        views: 18200,
        applications: 892,
        approvalRate: "68.0",
        tags: ["Cashback", "Shopping"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "7-10 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-3",
        providerName: "ICICI Bank",
        providerLogo: null,
        cardName: "ICICI Amazon Pay",
        cardType: "credit",
        category: "cashback",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹1,00,000 - ₹8,00,000",
        interestRate: "3.50",
        rewardRate: "5% cashback on Amazon",
        welcomeBonus: "₹500 Amazon gift card",
        keyFeatures: ["Lifetime free", "Contactless", "Instant approval", "Virtual card"],
        benefits: ["Unlimited cashback", "Amazon Prime benefits", "Fuel surcharge waiver", "Lounge access (milestone)"],
        eligibilityCriteria: { minAge: 23, maxAge: 65, minIncome: "25000", minCreditScore: 650, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Bank Statement"],
        rating: "4.6",
        views: 25600,
        applications: 1245,
        approvalRate: "75.0",
        tags: ["Lifetime Free", "Cashback", "Amazon"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "3-5 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-4",
        providerName: "Axis Bank",
        providerLogo: null,
        cardName: "Axis Flipkart",
        cardType: "credit",
        category: "shopping",
        joiningFee: "500",
        annualFee: "500",
        feeWaiver: "Fee waived on minimum spends",
        creditLimit: "₹75,000 - ₹6,00,000",
        interestRate: "3.40",
        rewardRate: "4% cashback on Flipkart",
        welcomeBonus: "Flipkart gift voucher",
        keyFeatures: ["Contactless", "EMI options", "Reward points", "Mobile app"],
        benefits: ["E-commerce cashback", "Dining offers", "Fuel surcharge waiver", "Movie discounts"],
        eligibilityCriteria: { minAge: 18, maxAge: 70, minIncome: "30000", minCreditScore: 700, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip"],
        rating: "4.2",
        views: 14800,
        applications: 678,
        approvalRate: "70.0",
        tags: ["Shopping", "Flipkart", "Cashback"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "5-7 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-5",
        providerName: "American Express",
        providerLogo: null,
        cardName: "Amex Platinum Travel",
        cardType: "platinum",
        category: "travel",
        joiningFee: "5000",
        annualFee: "5000",
        feeWaiver: "Fee waived on annual spends above ₹4 lakhs",
        creditLimit: "₹5,00,000 - ₹25,00,000",
        interestRate: "3.49",
        rewardRate: "1000 points per ₹50 spent on travel",
        welcomeBonus: "50,000 bonus points",
        keyFeatures: ["Global acceptance", "Premium metal card", "No forex markup", "Priority customer service"],
        benefits: ["Unlimited lounge access", "Travel insurance", "Hotel upgrades", "Concierge service"],
        eligibilityCriteria: { minAge: 21, maxAge: 60, minIncome: "100000", minCreditScore: 800, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "ITR", "Bank Statement"],
        rating: "4.7",
        views: 9500,
        applications: 234,
        approvalRate: "45.0",
        tags: ["Platinum", "Travel", "Premium"],
        isPremium: 1,
        isPopular: 1,
        processingTime: "7-10 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-6",
        providerName: "Kotak Mahindra",
        providerLogo: null,
        cardName: "Kotak 811 #DreamDifferent",
        cardType: "credit",
        category: "rewards",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹40,000 - ₹3,00,000",
        interestRate: "3.50",
        rewardRate: "4 points per ₹150",
        welcomeBonus: "1,000 bonus points",
        keyFeatures: ["Lifetime free", "Instant digital card", "Contactless", "Auto-pay"],
        benefits: ["Zero annual fee", "Fuel surcharge waiver", "Movie tickets", "Dining offers"],
        eligibilityCriteria: { minAge: 18, maxAge: 65, minIncome: "15000", minCreditScore: 600, employmentType: "Salaried/Self-employed/Student" },
        documentsRequired: ["PAN Card", "Aadhaar Card"],
        rating: "4.1",
        views: 22400,
        applications: 1567,
        approvalRate: "82.0",
        tags: ["Lifetime Free", "Entry Level"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "3-5 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-7",
        providerName: "Slice",
        providerLogo: null,
        cardName: "Slice Super Card",
        cardType: "credit",
        category: "rewards",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹2,000 - ₹10,00,000",
        interestRate: "3.00",
        rewardRate: "2% rewards on all spends",
        welcomeBonus: null,
        keyFeatures: ["100% digital", "No hidden charges", "Build credit score", "Track expenses"],
        benefits: ["No credit score needed", "Instant approval", "Flexible repayment", "Rewards on every transaction"],
        eligibilityCriteria: { minAge: 18, maxAge: 65, minIncome: "0", minCreditScore: 0, employmentType: "Any" },
        documentsRequired: ["PAN Card", "Basic KYC"],
        rating: "4.4",
        views: 28900,
        applications: 2134,
        approvalRate: "95.0",
        tags: ["No Credit Score", "Digital", "Instant"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "Instant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-8",
        providerName: "Jupiter",
        providerLogo: null,
        cardName: "Jupiter Edge CSB Bank",
        cardType: "credit",
        category: "rewards",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹20,000 - ₹5,00,000",
        interestRate: "3.00",
        rewardRate: "2X rewards on UPI",
        welcomeBonus: "₹250 cashback",
        keyFeatures: ["Digital-first", "App-based control", "Freeze/unfreeze instantly", "Real-time notifications"],
        benefits: ["UPI rewards", "Instant card", "Flexible credit", "No joining fee"],
        eligibilityCriteria: { minAge: 21, maxAge: 60, minIncome: "10000", minCreditScore: 550, employmentType: "Any" },
        documentsRequired: ["PAN Card", "Aadhaar Card"],
        rating: "4.0",
        views: 17600,
        applications: 892,
        approvalRate: "78.0",
        tags: ["UPI", "Digital", "Instant"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "1-2 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-9",
        providerName: "Navi",
        providerLogo: null,
        cardName: "Navi Credit Card",
        cardType: "credit",
        category: "cashback",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹50,000 - ₹4,00,000",
        interestRate: "2.95",
        rewardRate: "5% on bill payments",
        welcomeBonus: "₹100 cashback",
        keyFeatures: ["Digital application", "Low interest rate", "Mobile app", "Contactless"],
        benefits: ["High cashback on bills", "Zero annual fee", "Instant approval", "Flexible EMI"],
        eligibilityCriteria: { minAge: 21, maxAge: 58, minIncome: "15000", minCreditScore: 600, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof"],
        rating: "4.2",
        views: 13200,
        applications: 567,
        approvalRate: "72.0",
        tags: ["Low Interest", "Bill Payments", "Instant"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "2-3 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-10",
        providerName: "AU Small Finance",
        providerLogo: null,
        cardName: "AU Lit Credit Card",
        cardType: "credit",
        category: "lifestyle",
        joiningFee: "0",
        annualFee: "499",
        feeWaiver: "Fee waived on minimum spends",
        creditLimit: "₹60,000 - ₹5,00,000",
        interestRate: "3.49",
        rewardRate: "5% on dining",
        welcomeBonus: "₹500 cashback",
        keyFeatures: ["Instant approval", "Contactless", "EMI conversion", "Mobile wallet integration"],
        benefits: ["Food & dining cashback", "Entertainment offers", "Fuel surcharge waiver", "Airport lounge (milestone)"],
        eligibilityCriteria: { minAge: 21, maxAge: 65, minIncome: "20000", minCreditScore: 650, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Salary Slip"],
        rating: "4.1",
        views: 11800,
        applications: 445,
        approvalRate: "65.0",
        tags: ["Dining", "Entertainment", "Lifestyle"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "5-7 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-11",
        providerName: "IndusInd Bank",
        providerLogo: null,
        cardName: "IndusInd Platinum Aura Edge",
        cardType: "platinum",
        category: "lifestyle",
        joiningFee: "3000",
        annualFee: "3000",
        feeWaiver: "Fee reversed on annual spends",
        creditLimit: "₹2,50,000 - ₹15,00,000",
        interestRate: "3.49",
        rewardRate: "2 points per ₹100",
        welcomeBonus: "5,000 reward points",
        keyFeatures: ["Contactless", "Global acceptance", "Travel insurance", "Concierge service"],
        benefits: ["Airport lounge access", "Golf privileges", "Movie tickets", "Dining discounts"],
        eligibilityCriteria: { minAge: 21, maxAge: 65, minIncome: "50000", minCreditScore: 750, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof", "Bank Statement"],
        rating: "4.4",
        views: 8900,
        applications: 321,
        approvalRate: "58.0",
        tags: ["Platinum", "Premium", "Lifestyle"],
        isPremium: 1,
        isPopular: 1,
        processingTime: "7-10 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-12",
        providerName: "RBL Bank",
        providerLogo: null,
        cardName: "RBL Shoprite",
        cardType: "credit",
        category: "shopping",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹45,000 - ₹4,00,000",
        interestRate: "3.50",
        rewardRate: "2.5% on retail",
        welcomeBonus: "₹250 cashback",
        keyFeatures: ["Lifetime free", "Instant digital card", "Contactless", "EMI facility"],
        benefits: ["Retail cashback", "Fuel surcharge waiver", "Dining offers", "Movie discounts"],
        eligibilityCriteria: { minAge: 21, maxAge: 60, minIncome: "18000", minCreditScore: 650, employmentType: "Salaried/Self-employed" },
        documentsRequired: ["PAN Card", "Aadhaar Card", "Income Proof"],
        rating: "3.9",
        views: 15400,
        applications: 789,
        approvalRate: "74.0",
        tags: ["Shopping", "Retail", "Lifetime Free"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "5-7 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "cc-13",
        providerName: "Evencred",
        providerLogo: null,
        cardName: "Evencred OneCard",
        cardType: "credit",
        category: "rewards",
        joiningFee: "0",
        annualFee: "0",
        feeWaiver: "Lifetime free",
        creditLimit: "₹10,000 - ₹10,00,000",
        interestRate: "2.49",
        rewardRate: "5X rewards",
        welcomeBonus: "1,000 bonus points",
        keyFeatures: ["100% digital", "Instant approval", "No hidden fees", "Build credit history"],
        benefits: ["No credit history needed", "Metal card", "Lifetime free", "High reward rate"],
        eligibilityCriteria: { minAge: 18, maxAge: 65, minIncome: "0", minCreditScore: 0, employmentType: "Any" },
        documentsRequired: ["PAN Card", "Basic KYC"],
        rating: "4.3",
        views: 32100,
        applications: 2567,
        approvalRate: "92.0",
        tags: ["No Credit History", "Metal Card", "Digital"],
        isPremium: 0,
        isPopular: 1,
        processingTime: "Instant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    sampleCreditCards.forEach(card => this.creditCardOffers.set(card.id, card));

    // Sample financial report
    const sampleReport: UserFinancialReport = {
      id: "report-1",
      userId: "user-1", 
      subscriptionTier: "pro",
      creditScore: 750,
      eligibilityScore: 85,
      debtToIncomeRatio: "0.35",
      totalDebt: "200000",
      monthlyIncome: "75000",
      improvementActions: [
        { action: "Reduce credit utilization to below 30%", impact: "+15 points", timeframe: "2 months" },
        { action: "Pay off personal loan", impact: "+25 points", timeframe: "6 months" }
      ],
      projectedScoreChanges: { sixMonths: 780, oneYear: 810 },
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    this.userFinancialReports.set("user-1", sampleReport);

    // Sample learning content  
    const sampleContent: LearningContent[] = [
      {
        id: "content-1",
        creatorId: "creator-1",
        creatorName: "Rahul Jain",
        title: "Understanding Credit Score - Basics",
        description: "Learn how credit scores work in India",
        contentType: "course",
        thumbnailUrl: "/thumbnails/credit-basics.jpg",
        contentUrl: "/videos/credit-basics.mp4",
        duration: 12,
        tags: ["credit", "beginner", "finance"],
        difficulty: "beginner",
        isSponsored: 0,
        price: "0",
        rating: "4.5",
        viewCount: 1250,
        createdAt: new Date(),
      },
      {
        id: "content-2",
        creatorId: "creator-2",
        creatorName: "Priya Sharma",
        title: "Smart Loan Selection Guide",
        description: "Complete guide to choosing the right loan for your needs",
        contentType: "course",
        thumbnailUrl: "/thumbnails/loan-guide.jpg",
        contentUrl: "/videos/loan-guide.mp4",
        duration: 25,
        tags: ["loans", "intermediate", "finance"],
        difficulty: "intermediate",
        isSponsored: 0,
        price: "199",
        rating: "4.7",
        viewCount: 2150,
        createdAt: new Date(),
      },
      {
        id: "content-3",
        creatorId: "creator-3",
        creatorName: "Arjun Malhotra",
        title: "Investment Basics for Beginners",
        description: "Start your investment journey with confidence",
        contentType: "course",
        thumbnailUrl: "/thumbnails/investment-basics.jpg",
        contentUrl: "/videos/investment-basics.mp4",
        duration: 18,
        tags: ["investment", "beginner", "finance"],
        difficulty: "beginner",
        isSponsored: 0,
        price: "299",
        rating: "4.6",
        viewCount: 3200,
        createdAt: new Date(),
      },
    ];
    sampleContent.forEach(content => this.learningContent.set(content.id, content));

    // Sample user points
    const samplePoints: UserPoints = {
      id: "points-1",
      userId: "user-1",
      totalPoints: 1250,
      availablePoints: 850,
      pointsEarned: 1250,
      pointsSpent: 400,
      lastActivity: new Date(),
      createdAt: new Date(),
    };
    this.userPoints.set("user-1", samplePoints);

    // Sample creators
    const sampleCreators: Creator[] = [
      {
        id: "creator-1",
        userId: "user-2",
        displayName: "Raghav Agarwal",
        bio: "Certified Financial Planner with 8+ years experience in personal finance, investment planning and debt management. Helped 500+ individuals achieve their financial goals.",
        expertise: ["Personal Finance", "Investment Planning", "Debt Management", "Tax Planning"],
        credentials: ["CFP", "CFA Level 2", "NISM Certified"],
        profileImageUrl: null,
        hourlyRate: "2500.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 127,
        averageRating: "4.8",
        totalEarnings: "317500",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi"],
        socialLinks: { linkedin: "https://linkedin.com/in/raghav-agarwal", twitter: "@raghav_finance" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "creator-2",
        userId: "user-3",
        displayName: "Dr. Priya Sharma",
        bio: "Investment Advisor and Portfolio Manager with expertise in equity markets, mutual funds and retirement planning. PhD in Finance from IIM Bangalore.",
        expertise: ["Investment Advisory", "Equity Research", "Mutual Funds", "Retirement Planning"],
        credentials: ["PhD Finance", "SEBI Investment Advisor", "AMFI Certified"],
        profileImageUrl: null,
        hourlyRate: "3000.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 89,
        averageRating: "4.9",
        totalEarnings: "267000",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi", "Tamil"],
        socialLinks: { linkedin: "https://linkedin.com/in/priya-sharma-finance" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "creator-3",
        userId: "user-4",
        displayName: "Amit Kumar",
        bio: "Credit Score Expert and Loan Consultant specializing in credit repair, loan approvals and financial wellness. Former banker with 12 years experience.",
        expertise: ["Credit Score Improvement", "Loan Consultation", "Banking", "Financial Planning"],
        credentials: ["CIBIL Certified", "JAIIB", "CAIIB"],
        profileImageUrl: null,
        hourlyRate: "1800.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 203,
        averageRating: "4.7",
        totalEarnings: "365400",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi", "Bengali"],
        socialLinks: { linkedin: "https://linkedin.com/in/amit-kumar-banking" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "creator-4",
        userId: "user-5",
        displayName: "Sneha Patel",
        bio: "Tax Planning Specialist and CA with focus on income tax optimization, GST compliance and business finance. Helping individuals and businesses save taxes legally.",
        expertise: ["Tax Planning", "GST Compliance", "Business Finance", "Accounting"],
        credentials: ["CA", "CS", "Tax Expert"],
        profileImageUrl: null,
        hourlyRate: "2200.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 156,
        averageRating: "4.6",
        totalEarnings: "343200",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi", "Gujarati"],
        socialLinks: { linkedin: "https://linkedin.com/in/sneha-patel-ca" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "creator-5",
        userId: "user-6",
        displayName: "Vikram Singh",
        bio: "Real Estate Investment Consultant and Property Advisor with expertise in residential and commercial real estate investments across India.",
        expertise: ["Real Estate Investment", "Property Valuation", "REIT Advisory", "Commercial Real Estate"],
        credentials: ["RERA Certified", "Property Valuer", "Real Estate Expert"],
        profileImageUrl: null,
        hourlyRate: "2800.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 78,
        averageRating: "4.5",
        totalEarnings: "218400",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi", "Punjabi"],
        socialLinks: { linkedin: "https://linkedin.com/in/vikram-singh-realestate" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "creator-6",
        userId: "user-7",
        displayName: "Kavitha Menon",
        bio: "Insurance Advisor and Risk Management Expert specializing in life insurance, health insurance and comprehensive financial protection planning.",
        expertise: ["Life Insurance", "Health Insurance", "Risk Management", "Financial Protection"],
        credentials: ["IRDA Licensed", "Risk Management Certified", "Insurance Expert"],
        profileImageUrl: null,
        hourlyRate: "1500.00",
        isVerified: 1,
        isActive: 1,
        totalSessions: 234,
        averageRating: "4.4",
        totalEarnings: "351000",
        timezone: "Asia/Kolkata",
        languages: ["English", "Hindi", "Malayalam"],
        socialLinks: { linkedin: "https://linkedin.com/in/kavitha-menon-insurance" },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    sampleCreators.forEach(creator => this.creators.set(creator.id, creator));

    // Sample creator sessions
    const sampleSessions: CreatorSession[] = [
      // Raghav Agarwal's sessions
      {
        id: "session-1",
        creatorId: "creator-1",
        sessionType: "consultation",
        title: "Personal Finance Review",
        description: "Comprehensive review of your financial situation with personalized recommendations",
        duration: 60,
        price: "2500.00",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "session-2",
        creatorId: "creator-1",
        sessionType: "mentoring",
        title: "Investment Strategy Planning",
        description: "Deep-dive session to create your personalized investment strategy",
        duration: 90,
        price: "3750.00",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "session-3",
        creatorId: "creator-1",
        sessionType: "consultation",
        title: "Debt Management Plan",
        description: "Create an effective plan to manage and eliminate your debts",
        duration: 45,
        price: "1875.00",
        isActive: 1,
        createdAt: new Date(),
      },

      // Dr. Priya Sharma's sessions
      {
        id: "session-4",
        creatorId: "creator-2",
        sessionType: "consultation",
        title: "Portfolio Review & Analysis",
        description: "Professional analysis of your investment portfolio with optimization suggestions",
        duration: 60,
        price: "3000.00",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "session-5",
        creatorId: "creator-2",
        sessionType: "mentoring",
        title: "Retirement Planning Session",
        description: "Comprehensive retirement planning with calculation and strategy",
        duration: 120,
        price: "6000.00",
        isActive: 1,
        createdAt: new Date(),
      },

      // Amit Kumar's sessions
      {
        id: "session-6",
        creatorId: "creator-3",
        sessionType: "consultation",
        title: "Credit Score Improvement",
        description: "Analyze your credit report and create improvement plan",
        duration: 45,
        price: "1350.00",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "session-7",
        creatorId: "creator-3",
        sessionType: "consultation",
        title: "Loan Application Guidance",
        description: "End-to-end guidance for loan application and approval",
        duration: 60,
        price: "1800.00",
        isActive: 1,
        createdAt: new Date(),
      },

      // Sneha Patel's sessions
      {
        id: "session-8",
        creatorId: "creator-4",
        sessionType: "consultation",
        title: "Tax Planning Consultation",
        description: "Optimize your tax strategy and save money legally",
        duration: 60,
        price: "2200.00",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "session-9",
        creatorId: "creator-4",
        sessionType: "review",
        title: "ITR Filing Review",
        description: "Review your income tax return before filing",
        duration: 30,
        price: "1100.00",
        isActive: 1,
        createdAt: new Date(),
      },

      // Vikram Singh's sessions
      {
        id: "session-10",
        creatorId: "creator-5",
        sessionType: "consultation",
        title: "Real Estate Investment Analysis",
        description: "Evaluate real estate investment opportunities",
        duration: 90,
        price: "4200.00",
        isActive: 1,
        createdAt: new Date(),
      },

      // Kavitha Menon's sessions
      {
        id: "session-11",
        creatorId: "creator-6",
        sessionType: "consultation",
        title: "Insurance Planning",
        description: "Comprehensive insurance needs analysis and planning",
        duration: 60,
        price: "1500.00",
        isActive: 1,
        createdAt: new Date(),
      }
    ];
    sampleSessions.forEach(session => this.creatorSessions.set(session.id, session));

    // Sample creator availability (Monday=1, Sunday=0)
    const sampleAvailability: CreatorAvailability[] = [
      // Raghav Agarwal - Monday to Friday, 9 AM to 6 PM
      { id: "avail-1", creatorId: "creator-1", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-2", creatorId: "creator-1", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-3", creatorId: "creator-1", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-4", creatorId: "creator-1", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-5", creatorId: "creator-1", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isActive: 1, createdAt: new Date() },

      // Dr. Priya Sharma - Tuesday to Saturday, 10 AM to 7 PM
      { id: "avail-6", creatorId: "creator-2", dayOfWeek: 2, startTime: "10:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-7", creatorId: "creator-2", dayOfWeek: 3, startTime: "10:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-8", creatorId: "creator-2", dayOfWeek: 4, startTime: "10:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-9", creatorId: "creator-2", dayOfWeek: 5, startTime: "10:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-10", creatorId: "creator-2", dayOfWeek: 6, startTime: "10:00", endTime: "19:00", isActive: 1, createdAt: new Date() },

      // Amit Kumar - Monday to Saturday, 8 AM to 8 PM
      { id: "avail-11", creatorId: "creator-3", dayOfWeek: 1, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },
      { id: "avail-12", creatorId: "creator-3", dayOfWeek: 2, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },
      { id: "avail-13", creatorId: "creator-3", dayOfWeek: 3, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },
      { id: "avail-14", creatorId: "creator-3", dayOfWeek: 4, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },
      { id: "avail-15", creatorId: "creator-3", dayOfWeek: 5, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },
      { id: "avail-16", creatorId: "creator-3", dayOfWeek: 6, startTime: "08:00", endTime: "20:00", isActive: 1, createdAt: new Date() },

      // Sneha Patel - Monday to Friday, 10 AM to 6 PM
      { id: "avail-17", creatorId: "creator-4", dayOfWeek: 1, startTime: "10:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-18", creatorId: "creator-4", dayOfWeek: 2, startTime: "10:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-19", creatorId: "creator-4", dayOfWeek: 3, startTime: "10:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-20", creatorId: "creator-4", dayOfWeek: 4, startTime: "10:00", endTime: "18:00", isActive: 1, createdAt: new Date() },
      { id: "avail-21", creatorId: "creator-4", dayOfWeek: 5, startTime: "10:00", endTime: "18:00", isActive: 1, createdAt: new Date() },

      // Vikram Singh - Monday to Friday, 11 AM to 7 PM
      { id: "avail-22", creatorId: "creator-5", dayOfWeek: 1, startTime: "11:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-23", creatorId: "creator-5", dayOfWeek: 2, startTime: "11:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-24", creatorId: "creator-5", dayOfWeek: 3, startTime: "11:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-25", creatorId: "creator-5", dayOfWeek: 4, startTime: "11:00", endTime: "19:00", isActive: 1, createdAt: new Date() },
      { id: "avail-26", creatorId: "creator-5", dayOfWeek: 5, startTime: "11:00", endTime: "19:00", isActive: 1, createdAt: new Date() },

      // Kavitha Menon - All days, 9 AM to 9 PM
      { id: "avail-27", creatorId: "creator-6", dayOfWeek: 0, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-28", creatorId: "creator-6", dayOfWeek: 1, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-29", creatorId: "creator-6", dayOfWeek: 2, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-30", creatorId: "creator-6", dayOfWeek: 3, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-31", creatorId: "creator-6", dayOfWeek: 4, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-32", creatorId: "creator-6", dayOfWeek: 5, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
      { id: "avail-33", creatorId: "creator-6", dayOfWeek: 6, startTime: "09:00", endTime: "21:00", isActive: 1, createdAt: new Date() },
    ];
    sampleAvailability.forEach(avail => this.creatorAvailability.set(avail.id, avail));

    // Sample creator reviews
    const sampleReviews: CreatorReview[] = [
      {
        id: "review-1",
        bookingId: "booking-1",
        userId: "user-1",
        creatorId: "creator-1",
        rating: 5,
        review: "Excellent session! Raghav provided clear insights on my investment strategy and helped me understand complex financial concepts easily.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-2",
        bookingId: "booking-2",
        userId: "user-1",
        creatorId: "creator-1",
        rating: 5,
        review: "Very knowledgeable and patient. The debt management plan was exactly what I needed.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-3",
        bookingId: "booking-3",
        userId: "user-1",
        creatorId: "creator-2",
        rating: 5,
        review: "Dr. Priya's portfolio analysis was thorough and professional. Great recommendations for optimization.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-4",
        bookingId: "booking-4",
        userId: "user-1",
        creatorId: "creator-3",
        rating: 4,
        review: "Amit helped improve my credit score significantly. Very practical advice and follow-up support.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-5",
        bookingId: "booking-5",
        userId: "user-1",
        creatorId: "creator-4",
        rating: 5,
        review: "Tax planning session was very informative. Sneha explained complex tax rules in simple terms.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-6",
        bookingId: "booking-6",
        userId: "user-1",
        creatorId: "creator-5",
        rating: 4,
        review: "Good insights on real estate investment. Vikram provided market analysis and property suggestions.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-7",
        bookingId: "booking-7",
        userId: "user-1",
        creatorId: "creator-6",
        rating: 4,
        review: "Comprehensive insurance planning session. Kavitha helped choose the right policies for my family.",
        isPublic: 1,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleReviews.forEach(review => this.creatorReviews.set(review.id, review));

    // Sample bookings (past and upcoming)
    const sampleBookings: Booking[] = [
      {
        id: "booking-1",
        userId: "user-1",
        creatorId: "creator-1",
        sessionId: "session-1",
        bookingNumber: "BK-1704067200001",
        scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 60,
        price: "2500.00",
        status: "completed",
        paymentStatus: "paid",
        paymentId: "pi_1234567890",
        meetingUrl: "https://meet.google.com/abc-defg-hij",
        notes: "Want to discuss investment strategy for next year",
        cancelReason: null,
        rescheduledFrom: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "booking-2",
        userId: "user-1",
        creatorId: "creator-1",
        sessionId: "session-3",
        bookingNumber: "BK-1703203200001",
        scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        duration: 45,
        price: "1875.00",
        status: "completed",
        paymentStatus: "paid",
        paymentId: "pi_1234567891",
        meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
        notes: "Need help with credit card debt management",
        cancelReason: null,
        rescheduledFrom: null,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "booking-upcoming-1",
        userId: "user-1",
        creatorId: "creator-2",
        sessionId: "session-4",
        bookingNumber: "BK-1704240000001",
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 60,
        price: "3000.00",
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: "pi_1234567892",
        meetingUrl: "https://meet.google.com/upcoming-session-1",
        notes: "Portfolio review and optimization suggestions",
        cancelReason: null,
        rescheduledFrom: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "booking-upcoming-2",
        userId: "user-1",
        creatorId: "creator-3",
        sessionId: "session-6",
        bookingNumber: "BK-1704326400001",
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 45,
        price: "1350.00",
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: "pi_1234567893",
        meetingUrl: "https://meet.google.com/upcoming-session-2",
        notes: "Want to improve credit score before applying for home loan",
        cancelReason: null,
        rescheduledFrom: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    sampleBookings.forEach(booking => this.bookings.set(booking.id, booking));

    // Sample insurance policies
    const sampleInsurancePolicies: InsurancePolicy[] = [
      {
        id: "policy-1",
        userId: "user-1",
        policyNumber: "HEALTH001234",
        policyType: "health",
        insuranceProvider: "Star Health Insurance",
        policyHolderName: "Joshua J Kanatt",
        premiumAmount: "12000.00",
        coverageAmount: "500000.00",
        policyStartDate: new Date("2024-01-01"),
        policyEndDate: new Date("2024-12-31"),
        premiumFrequency: "yearly",
        nextPremiumDate: new Date("2025-01-01"),
        status: "active",
        isAutoRenewal: 1,
        beneficiaryName: "Jane Doe",
        beneficiaryRelation: "Spouse",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "policy-2", 
        userId: "user-1",
        policyNumber: "VEHICLE5678",
        policyType: "vehicle",
        insuranceProvider: "HDFC ERGO",
        policyHolderName: "Joshua J Kanatt",
        premiumAmount: "8500.00",
        coverageAmount: "200000.00",
        policyStartDate: new Date("2024-03-15"),
        policyEndDate: new Date("2025-03-14"),
        premiumFrequency: "yearly",
        nextPremiumDate: new Date("2025-03-15"),
        status: "active",
        isAutoRenewal: 0,
        beneficiaryName: null,
        beneficiaryRelation: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "policy-3",
        userId: "user-1",
        policyNumber: "LIFE009876",
        policyType: "life",
        insuranceProvider: "LIC of India",
        policyHolderName: "Joshua J Kanatt",
        premiumAmount: "24000.00",
        coverageAmount: "1000000.00",
        policyStartDate: new Date("2023-06-01"),
        policyEndDate: new Date("2043-06-01"),
        premiumFrequency: "yearly",
        nextPremiumDate: new Date("2025-06-01"),
        status: "active",
        isAutoRenewal: 1,
        beneficiaryName: "Jane Doe",
        beneficiaryRelation: "Spouse",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    sampleInsurancePolicies.forEach(policy => this.insurancePolicies.set(policy.id, policy));

    // Sample insurance premium payments
    const sampleInsurancePremiumPayments: InsurancePremiumPayment[] = [
      {
        id: "payment-1",
        userId: "user-1",
        policyId: "policy-1",
        amount: "12000.00",
        paymentDate: new Date("2024-01-01"),
        dueDate: new Date("2024-01-01"),
        status: "success",
        paymentMethod: "upi",
        transactionId: "INS123456789",
        referenceNumber: "REF001234",
        upiId: "user@paytm",
        isLatePayment: 0,
        lateFee: "0.00",
        createdAt: new Date("2024-01-01")
      },
      {
        id: "payment-2",
        userId: "user-1",
        policyId: "policy-2",
        amount: "8500.00",
        paymentDate: new Date("2024-03-15"),
        dueDate: new Date("2024-03-15"),
        status: "success",
        paymentMethod: "upi",
        transactionId: "INS987654321",
        referenceNumber: "REF005678",
        upiId: "user@paytm",
        isLatePayment: 0,
        lateFee: "0.00",
        createdAt: new Date("2024-03-15")
      },
      {
        id: "payment-3",
        userId: "user-1",
        policyId: "policy-3",
        amount: "24000.00",
        paymentDate: new Date("2024-06-01"),
        dueDate: new Date("2024-06-01"),
        status: "success",
        paymentMethod: "upi",
        transactionId: "INS456789123",
        referenceNumber: "REF009876",
        upiId: "user@paytm",
        isLatePayment: 0,
        lateFee: "0.00",
        createdAt: new Date("2024-06-01")
      }
    ];
    sampleInsurancePremiumPayments.forEach(payment => this.insurancePremiumPayments.set(payment.id, payment));

    // Sample FASTag vehicles
    const sampleVehicles: UserVehicle[] = [
      {
        id: "vehicle-1",
        userId: "user-1",
        vehicleNumber: "DL 3C AB 1234",
        vehicleType: "car",
        vehicleMake: "Honda",
        vehicleModel: "City",
        vehicleColor: "White",
        registrationState: "Delhi",
        rcNumber: "DL3CAB1234RC",
        isPrimary: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "vehicle-2",
        userId: "user-1",
        vehicleNumber: "MH 02 CD 5678",
        vehicleType: "bike",
        vehicleMake: "Royal Enfield",
        vehicleModel: "Classic 350",
        vehicleColor: "Black",
        registrationState: "Maharashtra",
        rcNumber: "MH02CD5678RC",
        isPrimary: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "vehicle-3",
        userId: "user-1",
        vehicleNumber: "KA 03 EF 9012",
        vehicleType: "car",
        vehicleMake: "Maruti",
        vehicleModel: "Swift",
        vehicleColor: "Red",
        registrationState: "Karnataka",
        rcNumber: "KA03EF9012RC",
        isPrimary: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    sampleVehicles.forEach(vehicle => this.userVehicles.set(vehicle.id, vehicle));

    // Sample FASTag accounts
    const sampleFastagAccounts: FastagAccount[] = [
      {
        id: "fastag-1",
        userId: "user-1",
        vehicleId: "vehicle-1",
        fastagNumber: "1234 5678 9012 3456",
        bankName: "ICICI Bank",
        bankLogo: "/api/placeholder/40/40",
        balance: "850.00",
        minBalance: "100.00",
        status: "active",
        issueDate: new Date("2020-07-01"),
        expiryDate: new Date("2025-07-01"),
        lastRechargeDate: new Date("2024-09-15"),
        autoRechargeEnabled: 1,
        autoRechargeAmount: "500.00",
        autoRechargeThreshold: "200.00",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "fastag-2",
        userId: "user-1",
        vehicleId: "vehicle-2",
        fastagNumber: "9876 5432 1098 7654",
        bankName: "HDFC Bank",
        bankLogo: "/api/placeholder/40/40",
        balance: "420.00",
        minBalance: "50.00",
        status: "active",
        issueDate: new Date("2021-04-15"),
        expiryDate: new Date("2026-04-15"),
        lastRechargeDate: new Date("2024-09-10"),
        autoRechargeEnabled: 0,
        autoRechargeAmount: null,
        autoRechargeThreshold: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "fastag-3",
        userId: "user-1",
        vehicleId: "vehicle-3",
        fastagNumber: "5678 1234 9876 5432",
        bankName: "Paytm Payments Bank",
        bankLogo: "/api/placeholder/40/40",
        balance: "1250.00",
        minBalance: "100.00",
        status: "active",
        issueDate: new Date("2020-01-10"),
        expiryDate: new Date("2025-01-10"),
        lastRechargeDate: new Date("2024-09-01"),
        autoRechargeEnabled: 1,
        autoRechargeAmount: "1000.00",
        autoRechargeThreshold: "300.00",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    sampleFastagAccounts.forEach(account => this.fastagAccounts.set(account.id, account));

    // Sample FASTag transactions
    const sampleFastagTransactions: FastagTransaction[] = [
      // Recharge transactions
      {
        id: "txn-1",
        userId: "user-1",
        fastagAccountId: "fastag-1",
        transactionType: "recharge",
        amount: "500.00",
        balanceBefore: "350.00",
        balanceAfter: "850.00",
        transactionDate: new Date("2024-09-15T10:30:00"),
        status: "success",
        paymentMethod: "upi",
        paymentReference: "UPI123456789",
        transactionReference: "FASTAG-RECH-001",
        tollPlazaName: null,
        tollPlazaLocation: null,
        vehicleNumber: null,
        isAutoRecharge: 0,
        metadata: null,
        createdAt: new Date("2024-09-15T10:30:00")
      },
      {
        id: "txn-2",
        userId: "user-1",
        fastagAccountId: "fastag-2",
        transactionType: "recharge",
        amount: "300.00",
        balanceBefore: "120.00",
        balanceAfter: "420.00",
        transactionDate: new Date("2024-09-10T14:20:00"),
        status: "success",
        paymentMethod: "debit_card",
        paymentReference: "DC987654321",
        transactionReference: "FASTAG-RECH-002",
        tollPlazaName: null,
        tollPlazaLocation: null,
        vehicleNumber: null,
        isAutoRecharge: 0,
        metadata: null,
        createdAt: new Date("2024-09-10T14:20:00")
      },
      {
        id: "txn-3",
        userId: "user-1",
        fastagAccountId: "fastag-3",
        transactionType: "recharge",
        amount: "1000.00",
        balanceBefore: "250.00",
        balanceAfter: "1250.00",
        transactionDate: new Date("2024-09-05T09:15:00"),
        status: "success",
        paymentMethod: "upi",
        paymentReference: "UPI456789123",
        transactionReference: "FASTAG-RECH-003",
        tollPlazaName: null,
        tollPlazaLocation: null,
        vehicleNumber: null,
        isAutoRecharge: 0,
        metadata: null,
        createdAt: new Date("2024-09-05T09:15:00")
      },
      {
        id: "txn-4",
        userId: "user-1",
        fastagAccountId: "fastag-1",
        transactionType: "recharge",
        amount: "500.00",
        balanceBefore: "850.00",
        balanceAfter: "1350.00",
        transactionDate: new Date("2024-08-20T11:45:00"),
        status: "success",
        paymentMethod: "upi",
        paymentReference: "UPI789456123",
        transactionReference: "FASTAG-RECH-004",
        tollPlazaName: null,
        tollPlazaLocation: null,
        vehicleNumber: null,
        isAutoRecharge: 1,
        metadata: null,
        createdAt: new Date("2024-08-20T11:45:00")
      },
      {
        id: "txn-5",
        userId: "user-1",
        fastagAccountId: "fastag-3",
        transactionType: "recharge",
        amount: "1000.00",
        balanceBefore: "1250.00",
        balanceAfter: "2250.00",
        transactionDate: new Date("2024-08-15T16:30:00"),
        status: "success",
        paymentMethod: "net_banking",
        paymentReference: "NB123789456",
        transactionReference: "FASTAG-RECH-005",
        tollPlazaName: null,
        tollPlazaLocation: null,
        vehicleNumber: null,
        isAutoRecharge: 1,
        metadata: null,
        createdAt: new Date("2024-08-15T16:30:00")
      },
      // Toll payment transactions
      {
        id: "txn-6",
        userId: "user-1",
        fastagAccountId: "fastag-1",
        transactionType: "toll_payment",
        amount: "75.00",
        balanceBefore: "925.00",
        balanceAfter: "850.00",
        transactionDate: new Date("2024-09-25T08:30:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL123456",
        tollPlazaName: "Delhi-Gurgaon Toll Plaza",
        tollPlazaLocation: "NH-8, Delhi-Haryana Border",
        vehicleNumber: "DL 3C AB 1234",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Car/Jeep/Van" },
        createdAt: new Date("2024-09-25T08:30:00")
      },
      {
        id: "txn-7",
        userId: "user-1",
        fastagAccountId: "fastag-1",
        transactionType: "toll_payment",
        amount: "65.00",
        balanceBefore: "990.00",
        balanceAfter: "925.00",
        transactionDate: new Date("2024-09-24T18:15:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL234567",
        tollPlazaName: "KMP Expressway Toll Plaza",
        tollPlazaLocation: "KMP Expressway, Kundli",
        vehicleNumber: "DL 3C AB 1234",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Car/Jeep/Van" },
        createdAt: new Date("2024-09-24T18:15:00")
      },
      {
        id: "txn-8",
        userId: "user-1",
        fastagAccountId: "fastag-2",
        transactionType: "toll_payment",
        amount: "30.00",
        balanceBefore: "450.00",
        balanceAfter: "420.00",
        transactionDate: new Date("2024-09-23T12:45:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL345678",
        tollPlazaName: "Mumbai-Pune Expressway Toll",
        tollPlazaLocation: "Khandala Entry, Maharashtra",
        vehicleNumber: "MH 02 CD 5678",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Two Wheeler" },
        createdAt: new Date("2024-09-23T12:45:00")
      },
      {
        id: "txn-9",
        userId: "user-1",
        fastagAccountId: "fastag-3",
        transactionType: "toll_payment",
        amount: "80.00",
        balanceBefore: "1330.00",
        balanceAfter: "1250.00",
        transactionDate: new Date("2024-09-22T10:20:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL456789",
        tollPlazaName: "Bangalore-Mysore Toll Plaza",
        tollPlazaLocation: "NICE Road, Bangalore",
        vehicleNumber: "KA 03 EF 9012",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Car/Jeep/Van" },
        createdAt: new Date("2024-09-22T10:20:00")
      },
      {
        id: "txn-10",
        userId: "user-1",
        fastagAccountId: "fastag-1",
        transactionType: "toll_payment",
        amount: "70.00",
        balanceBefore: "1060.00",
        balanceAfter: "990.00",
        transactionDate: new Date("2024-09-21T14:50:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL567890",
        tollPlazaName: "Yamuna Expressway Toll Plaza",
        tollPlazaLocation: "Greater Noida, UP",
        vehicleNumber: "DL 3C AB 1234",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Car/Jeep/Van" },
        createdAt: new Date("2024-09-21T14:50:00")
      },
      {
        id: "txn-11",
        userId: "user-1",
        fastagAccountId: "fastag-2",
        transactionType: "toll_payment",
        amount: "25.00",
        balanceBefore: "475.00",
        balanceAfter: "450.00",
        transactionDate: new Date("2024-09-20T09:30:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL678901",
        tollPlazaName: "Eastern Expressway Toll",
        tollPlazaLocation: "Mumbai, Maharashtra",
        vehicleNumber: "MH 02 CD 5678",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Two Wheeler" },
        createdAt: new Date("2024-09-20T09:30:00")
      },
      {
        id: "txn-12",
        userId: "user-1",
        fastagAccountId: "fastag-3",
        transactionType: "toll_payment",
        amount: "90.00",
        balanceBefore: "1420.00",
        balanceAfter: "1330.00",
        transactionDate: new Date("2024-09-19T16:00:00"),
        status: "success",
        paymentMethod: null,
        paymentReference: null,
        transactionReference: "TOLL789012",
        tollPlazaName: "Chennai-Bangalore Highway Toll",
        tollPlazaLocation: "Hosur, Tamil Nadu",
        vehicleNumber: "KA 03 EF 9012",
        isAutoRecharge: 0,
        metadata: { vehicleClass: "Car/Jeep/Van" },
        createdAt: new Date("2024-09-19T16:00:00")
      }
    ];
    sampleFastagTransactions.forEach(txn => this.fastagTransactions.set(txn.id, txn));

    // ============================================================================
    // MOVIE BOOKING SAMPLE DATA
    // ============================================================================

    // Sample Movies
    const sampleMovies: Movie[] = [
      {
        id: "pathaan",
        title: "Pathaan",
        description: "India's first aerial action thriller featuring high-octane dogfights and patriotic fervor. An elite air force pilot takes on a dangerous mission to protect the nation's skies.",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600",
        bannerUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=400",
        trailerUrl: "https://www.youtube.com/watch?v=example1",
        language: "Hindi",
        genre: ["Action", "Thriller", "Drama"],
        duration: 166,
        rating: "UA",
        imdbRating: "8.2",
        releaseDate: new Date("2024-10-15"),
        cast: [
          { name: "Shah Rukh Khan", role: "Pathaan", image: "" },
          { name: "Deepika Padukone", role: "Rubina Mohsin", image: "" },
          { name: "John Abraham", role: "Jim", image: "" }
        ],
        crew: [
          { name: "Siddharth Anand", role: "Director" },
          { name: "Shridhar Raghavan", role: "Writer" }
        ],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "jawan",
        title: "Jawan",
        description: "A high-octane action thriller that outlines the emotional journey of a man set out to rectify the wrongs in society by taking on the system with a series of heists.",
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600",
        bannerUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=400",
        trailerUrl: "https://www.youtube.com/watch?v=example5",
        language: "Hindi",
        genre: ["Action", "Thriller", "Drama"],
        duration: 169,
        rating: "UA",
        imdbRating: "8.3",
        releaseDate: new Date("2024-11-01"),
        cast: [
          { name: "Shah Rukh Khan", role: "Azad / Vikram Rathore", image: "" },
          { name: "Nayanthara", role: "Narmada Rai", image: "" },
          { name: "Vijay Sethupathi", role: "Kaali Gaikwad", image: "" },
          { name: "Deepika Padukone", role: "Aishwarya Rathore", image: "" }
        ],
        crew: [
          { name: "Atlee", role: "Director" },
          { name: "Sumit Arora", role: "Writer" }
        ],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "animal",
        title: "Animal",
        description: "A troubled father-son relationship takes a dark turn as the son seeks to prove his loyalty through a path of violence and vengeance.",
        posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600",
        bannerUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=400",
        trailerUrl: "https://www.youtube.com/watch?v=example3",
        language: "Hindi",
        genre: ["Action", "Drama", "Thriller"],
        duration: 147,
        rating: "A",
        imdbRating: "8.5",
        releaseDate: new Date("2024-09-10"),
        cast: [
          { name: "Ranbir Kapoor", role: "Ranvijay Singh", image: "" },
          { name: "Rashmika Mandanna", role: "Geetanjali", image: "" },
          { name: "Anil Kapoor", role: "Balbir Singh", image: "" },
          { name: "Bobby Deol", role: "Abrar Haque", image: "" }
        ],
        crew: [
          { name: "Sandeep Reddy Vanga", role: "Director" },
          { name: "Sandeep Reddy Vanga", role: "Writer" }
        ],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "tiger3",
        title: "Tiger 3",
        description: "Tiger and Zoya are back for their most dangerous mission yet. As Pakistan seeks revenge against India, the duo must stop a deadly conspiracy.",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600",
        bannerUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&h=400",
        trailerUrl: "https://www.youtube.com/watch?v=example4",
        language: "Hindi",
        genre: ["Action", "Thriller", "Drama"],
        duration: 161,
        rating: "UA",
        imdbRating: "7.9",
        releaseDate: new Date("2024-10-20"),
        cast: [
          { name: "Salman Khan", role: "Avinash Singh Rathore (Tiger)", image: "" },
          { name: "Katrina Kaif", role: "Zoya", image: "" },
          { name: "Emraan Hashmi", role: "Aatish Rehman", image: "" }
        ],
        crew: [
          { name: "Maneesh Sharma", role: "Director" },
          { name: "Aditya Chopra", role: "Writer" }
        ],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "sam-bahadur",
        title: "Sam Bahadur",
        description: "The story of India's first Field Marshal Sam Manekshaw, his illustrious military career, and his role in the 1971 Indo-Pak war.",
        posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600",
        bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=400",
        trailerUrl: "https://www.youtube.com/watch?v=example2",
        language: "Hindi",
        genre: ["Biography", "Drama", "War"],
        duration: 132,
        rating: "UA",
        imdbRating: "7.8",
        releaseDate: new Date("2024-08-05"),
        cast: [
          { name: "Vicky Kaushal", role: "Sam Manekshaw", image: "" },
          { name: "Sanya Malhotra", role: "Silloo Manekshaw", image: "" },
          { name: "Fatima Sana Shaikh", role: "Indira Gandhi", image: "" }
        ],
        crew: [
          { name: "Meghna Gulzar", role: "Director" },
          { name: "Bhavani Iyer", role: "Writer" }
        ],
        isActive: 1,
        createdAt: new Date()
      }
    ];
    sampleMovies.forEach(movie => this.movies.set(movie.id, movie));

    // Sample Theaters
    const sampleTheaters: Theater[] = [
      {
        id: "theater-1",
        name: "PVR Inox: Phoenix Marketcity",
        city: "Mumbai",
        area: "Kurla",
        address: "Phoenix Marketcity, Kurla, Mumbai, Maharashtra 400070",
        latitude: "19.0874",
        longitude: "72.8912",
        amenities: ["Parking", "Food Court", "Wheelchair Access", "M-Ticket", "Dolby Atmos", "4DX"],
        screens: 8,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "theater-2",
        name: "Cinepolis: Andheri",
        city: "Mumbai",
        area: "Andheri West",
        address: "Fun Republic Mall, Andheri West, Mumbai, Maharashtra 400053",
        latitude: "19.1352",
        longitude: "72.8308",
        amenities: ["Parking", "Food Court", "Wheelchair Access", "Premium Seats", "IMAX"],
        screens: 6,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "theater-3",
        name: "INOX: R City Mall",
        city: "Mumbai",
        area: "Ghatkopar",
        address: "R City Mall, Ghatkopar West, Mumbai, Maharashtra 400086",
        latitude: "19.0860",
        longitude: "72.9081",
        amenities: ["Parking", "Food Court", "M-Ticket", "Dolby Atmos", "Recliner Seats"],
        screens: 7,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "theater-4",
        name: "PVR: Select Citywalk",
        city: "Delhi",
        area: "Saket",
        address: "Select Citywalk, Saket, New Delhi, Delhi 110017",
        latitude: "28.5272",
        longitude: "77.2175",
        amenities: ["Parking", "Food Court", "Wheelchair Access", "M-Ticket", "IMAX", "Gold Class"],
        screens: 11,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "theater-5",
        name: "Cinepolis: DLF Avenue",
        city: "Delhi",
        area: "Saket",
        address: "DLF Avenue, Saket, New Delhi, Delhi 110017",
        latitude: "28.5240",
        longitude: "77.2110",
        amenities: ["Parking", "Food Court", "Premium Seats", "4DX", "VIP Lounge"],
        screens: 5,
        isActive: 1,
        createdAt: new Date()
      }
    ];
    sampleTheaters.forEach(theater => this.theaters.set(theater.id, theater));

    // Helper function to generate showtimes for next 7 days
    const generateShowtimes = (movieId: string, theaterId: string, startDate: Date, formats: string[], languages: string[]) => {
      const showtimes: MovieShowtime[] = [];
      const times = ["10:00", "13:30", "16:45", "20:00", "22:30"];
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        
        times.forEach((time, idx) => {
          const [hours, minutes] = time.split(":").map(Number);
          const showAt = new Date(date);
          showAt.setHours(hours, minutes, 0, 0);
          
          const format = formats[idx % formats.length];
          const language = languages[idx % languages.length];
          const showtimeId = `showtime-${movieId}-${theaterId}-${day}-${idx}`;
          
          showtimes.push({
            id: showtimeId,
            movieId,
            theaterId,
            showAt,
            screen: `Screen ${(idx % 4) + 1}`,
            format,
            language,
            availableSeats: 120,
            totalSeats: 150,
            isActive: 1,
            createdAt: new Date()
          });
        });
      }
      
      return showtimes;
    };

    // Generate showtimes for popular movies in Mumbai theaters
    const allShowtimes: MovieShowtime[] = [
      ...generateShowtimes("pathaan", "theater-1", new Date(), ["2D", "3D", "IMAX"], ["Hindi", "English"]),
      ...generateShowtimes("pathaan", "theater-2", new Date(), ["2D", "IMAX"], ["Hindi"]),
      ...generateShowtimes("jawan", "theater-1", new Date(), ["2D"], ["Hindi"]),
      ...generateShowtimes("jawan", "theater-3", new Date(), ["2D"], ["Hindi"]),
      ...generateShowtimes("animal", "theater-1", new Date(), ["2D"], ["Hindi"]),
      ...generateShowtimes("animal", "theater-2", new Date(), ["2D", "4DX"], ["Hindi"]),
      ...generateShowtimes("animal", "theater-3", new Date(), ["2D"], ["Hindi"]),
      ...generateShowtimes("tiger3", "theater-4", new Date(), ["2D"], ["Hindi"]),
      ...generateShowtimes("tiger3", "theater-5", new Date(), ["2D", "4DX"], ["Hindi"]),
      ...generateShowtimes("sam-bahadur", "theater-4", new Date(), ["2D", "IMAX"], ["Hindi", "Tamil"]),
      ...generateShowtimes("sam-bahadur", "theater-5", new Date(), ["2D"], ["Hindi"])
    ];
    allShowtimes.forEach(showtime => this.movieShowtimes.set(showtime.id, showtime));

    // Generate seat categories and layouts for all showtimes
    allShowtimes.forEach(showtime => {
      // Create seat categories
      const categories = [
        {
          id: `cat-${showtime.id}-normal`,
          showtimeId: showtime.id,
          categoryName: "Normal",
          price: showtime.format === "IMAX" ? "350.00" : showtime.format === "4DX" ? "450.00" : "250.00",
          totalSeats: 80,
          availableSeats: 60,
          createdAt: new Date()
        },
        {
          id: `cat-${showtime.id}-premium`,
          showtimeId: showtime.id,
          categoryName: "Premium",
          price: showtime.format === "IMAX" ? "500.00" : showtime.format === "4DX" ? "600.00" : "400.00",
          totalSeats: 50,
          availableSeats: 40,
          createdAt: new Date()
        },
        {
          id: `cat-${showtime.id}-recliner`,
          showtimeId: showtime.id,
          categoryName: "Recliner",
          price: showtime.format === "IMAX" ? "800.00" : showtime.format === "4DX" ? "900.00" : "650.00",
          totalSeats: 20,
          availableSeats: 15,
          createdAt: new Date()
        }
      ];
      categories.forEach(cat => this.seatCategories.set(cat.id, cat));

      // Create seat layout - Normal (rows A-H)
      for (let row = 65; row <= 72; row++) { // A-H
        for (let col = 1; col <= 10; col++) {
          const seatNumber = `${String.fromCharCode(row)}${col}`;
          const isBooked = Math.random() > 0.7; // 30% chance of being booked
          this.seatLayouts.set(`seat-${showtime.id}-${seatNumber}`, {
            id: `seat-${showtime.id}-${seatNumber}`,
            showtimeId: showtime.id,
            seatNumber,
            categoryId: `cat-${showtime.id}-normal`,
            row: String.fromCharCode(row),
            column: col,
            status: isBooked ? "booked" : "available",
            createdAt: new Date()
          });
        }
      }

      // Create seat layout - Premium (rows I-M)
      for (let row = 73; row <= 77; row++) { // I-M
        for (let col = 1; col <= 10; col++) {
          const seatNumber = `${String.fromCharCode(row)}${col}`;
          const isBooked = Math.random() > 0.8; // 20% chance of being booked
          this.seatLayouts.set(`seat-${showtime.id}-${seatNumber}`, {
            id: `seat-${showtime.id}-${seatNumber}`,
            showtimeId: showtime.id,
            seatNumber,
            categoryId: `cat-${showtime.id}-premium`,
            row: String.fromCharCode(row),
            column: col,
            status: isBooked ? "booked" : "available",
            createdAt: new Date()
          });
        }
      }

      // Create seat layout - Recliner (rows N-O)
      for (let row = 78; row <= 79; row++) { // N-O
        for (let col = 1; col <= 10; col++) {
          const seatNumber = `${String.fromCharCode(row)}${col}`;
          const isBooked = Math.random() > 0.85; // 15% chance of being booked
          this.seatLayouts.set(`seat-${showtime.id}-${seatNumber}`, {
            id: `seat-${showtime.id}-${seatNumber}`,
            showtimeId: showtime.id,
            seatNumber,
            categoryId: `cat-${showtime.id}-recliner`,
            row: String.fromCharCode(row),
            column: col,
            status: isBooked ? "booked" : "available",
            createdAt: new Date()
          });
        }
      }
    });

    // Sample Food Menu Items for theaters
    const sampleFoodItems: FoodMenuItem[] = [
      // PVR Inox Phoenix
      {
        id: "food-1",
        theaterId: "theater-1",
        name: "Classic Popcorn Combo",
        description: "Large popcorn + 2 Pepsi (600ml)",
        category: "Combo",
        price: "550.00",
        imageUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300",
        isCombo: 1,
        comboItems: ["Popcorn Large", "Pepsi 600ml x2"],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-2",
        theaterId: "theater-1",
        name: "Movie Meal Deal",
        description: "Medium popcorn + Nachos + 2 Coke (500ml)",
        category: "Combo",
        price: "650.00",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300",
        isCombo: 1,
        comboItems: ["Popcorn Medium", "Nachos", "Coke 500ml x2"],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-3",
        theaterId: "theater-1",
        name: "Butter Popcorn",
        description: "Freshly made butter popcorn",
        category: "Snacks",
        price: "200.00",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300",
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-4",
        theaterId: "theater-1",
        name: "Caramel Popcorn",
        description: "Sweet caramel coated popcorn",
        category: "Snacks",
        price: "250.00",
        imageUrl: null,
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-5",
        theaterId: "theater-1",
        name: "Cheese Nachos",
        description: "Crispy nachos with cheese dip",
        category: "Snacks",
        price: "280.00",
        imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300",
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-6",
        theaterId: "theater-1",
        name: "Pepsi",
        description: "Chilled Pepsi",
        category: "Beverages",
        price: "150.00",
        imageUrl: null,
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-7",
        theaterId: "theater-1",
        name: "Coca Cola",
        description: "Chilled Coke",
        category: "Beverages",
        price: "150.00",
        imageUrl: null,
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-8",
        theaterId: "theater-1",
        name: "Mineral Water",
        description: "Packaged drinking water",
        category: "Beverages",
        price: "50.00",
        imageUrl: null,
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      // Similar items for other theaters
      {
        id: "food-9",
        theaterId: "theater-2",
        name: "Premium Combo",
        description: "Large popcorn + Hot dog + 2 Drinks",
        category: "Combo",
        price: "700.00",
        imageUrl: null,
        isCombo: 1,
        comboItems: ["Popcorn Large", "Hot Dog", "Drinks x2"],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-10",
        theaterId: "theater-2",
        name: "Samosa",
        description: "Crispy samosa with chutney",
        category: "Snacks",
        price: "80.00",
        imageUrl: null,
        isCombo: 0,
        comboItems: null,
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-11",
        theaterId: "theater-3",
        name: "Family Combo",
        description: "2 Large popcorn + 4 Drinks + Nachos",
        category: "Combo",
        price: "950.00",
        imageUrl: null,
        isCombo: 1,
        comboItems: ["Popcorn Large x2", "Drinks x4", "Nachos"],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-12",
        theaterId: "theater-4",
        name: "Deluxe Combo",
        description: "Large popcorn + Pizza slice + 2 Drinks",
        category: "Combo",
        price: "800.00",
        imageUrl: null,
        isCombo: 1,
        comboItems: ["Popcorn Large", "Pizza Slice", "Drinks x2"],
        isActive: 1,
        createdAt: new Date()
      },
      {
        id: "food-13",
        theaterId: "theater-5",
        name: "Couples Combo",
        description: "Medium popcorn + 2 Coffee + Brownie",
        category: "Combo",
        price: "600.00",
        imageUrl: null,
        isCombo: 1,
        comboItems: ["Popcorn Medium", "Coffee x2", "Brownie"],
        isActive: 1,
        createdAt: new Date()
      }
    ];
    sampleFoodItems.forEach(item => this.foodMenuItems.set(item.id, item));

    // Sample Cash Park Account
    const sampleCashParkAccount: CashParkAccount = {
      id: "cash-park-1",
      userId: "user-1",
      totalParkedAmount: "200000",
      totalJarBalance: "125000",
      totalInterestEarned: "2150.50",
      sweepThreshold: "20000",
      autoSweepEnabled: 1,
      fdIncrementAmount: "1000",
      currentInterestRate: "7.25",
      activeFdCount: 3,
      lastSweepDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastManualTransfer: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      minimumTenureDays: 7,
      notificationsEnabled: 1,
      isActive: 1,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    };
    this.cashParkAccounts.set(sampleCashParkAccount.id, sampleCashParkAccount);

    // Sample Cash Park Jars
    const sampleJars: CashParkJar[] = [
      {
        id: "jar-1",
        accountId: "cash-park-1",
        userId: "user-1",
        name: "Emergency Fund",
        currentBalance: "50000",
        goalAmount: "100000",
        color: "#FF6B6B",
        icon: "shield",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "jar-2",
        accountId: "cash-park-1",
        userId: "user-1",
        name: "Vacation Fund",
        currentBalance: "35000",
        goalAmount: "80000",
        color: "#4ECDC4",
        icon: "plane",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "jar-3",
        accountId: "cash-park-1",
        userId: "user-1",
        name: "New Laptop",
        currentBalance: "25000",
        goalAmount: "60000",
        color: "#95E1D3",
        icon: "laptop",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "jar-4",
        accountId: "cash-park-1",
        userId: "user-1",
        name: "Wedding Gift",
        currentBalance: "15000",
        goalAmount: "40000",
        color: "#F38181",
        icon: "gift",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "jar-5",
        accountId: "cash-park-1",
        userId: "user-1",
        name: "Car Down Payment",
        currentBalance: "0",
        goalAmount: "150000",
        color: "#AA96DA",
        icon: "car",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    sampleJars.forEach(jar => this.cashParkJars.set(jar.id, jar));

    // Sample Credit UPI Accounts
    const sampleCreditUpiAccounts: CreditUpiAccount[] = [
      {
        id: "credit-upi-1",
        userId: "user-1",
        upiId: "joshua.credit@paytm",
        creditLimit: "100000.00",
        availableLimit: "65000.00",
        usedLimit: "35000.00",
        outstandingAmount: "35000.00",
        interestRate: "24.00",
        annualFee: "499.00",
        processingFee: "1.50",
        latePaymentPenalty: "3.00",
        billingDate: 1,
        dueDate: 16,
        upiPin: "encrypted-pin",
        status: "active",
        isActivated: 1,
        activatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastBillingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "credit-upi-2",
        userId: "user-1",
        upiId: "joshua.credit@gpay",
        creditLimit: "50000.00",
        availableLimit: "42500.00",
        usedLimit: "7500.00",
        outstandingAmount: "7500.00",
        interestRate: "24.00",
        annualFee: "299.00",
        processingFee: "1.50",
        latePaymentPenalty: "3.00",
        billingDate: 5,
        dueDate: 20,
        upiPin: "encrypted-pin",
        status: "active",
        isActivated: 1,
        activatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        lastBillingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }
    ];
    sampleCreditUpiAccounts.forEach(account => this.creditUpiAccounts.set(account.id, account));

    // Sample Credit UPI Transactions
    const sampleCreditUpiTransactions: CreditUpiTransaction[] = [
      {
        id: "credit-txn-1",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Amazon India",
        merchantUpi: "amazon@paytm",
        amount: "15000.00",
        status: "success",
        transactionId: `CUPI${Date.now()}001`,
        description: "Shopping - Electronics",
        category: "shopping",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "100000.00",
        balanceAfter: "85000.00",
        metadata: null,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-2",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Swiggy",
        merchantUpi: "swiggy@paytm",
        amount: "850.00",
        status: "success",
        transactionId: `CUPI${Date.now()}002`,
        description: "Food delivery",
        category: "food",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "85000.00",
        balanceAfter: "84150.00",
        metadata: null,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-3",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "BookMyShow",
        merchantUpi: "bookmyshow@paytm",
        amount: "1200.00",
        status: "success",
        transactionId: `CUPI${Date.now()}003`,
        description: "Movie tickets - 2 tickets",
        category: "entertainment",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "84150.00",
        balanceAfter: "82950.00",
        metadata: null,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-4",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Big Bazaar",
        merchantUpi: "bigbazaar@paytm",
        amount: "4500.00",
        status: "success",
        transactionId: `CUPI${Date.now()}004`,
        description: "Grocery shopping",
        category: "grocery",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "82950.00",
        balanceAfter: "78450.00",
        metadata: null,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-5",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Myntra",
        merchantUpi: "myntra@paytm",
        amount: "3450.00",
        status: "success",
        transactionId: `CUPI${Date.now()}005`,
        description: "Clothing purchase",
        category: "shopping",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "78450.00",
        balanceAfter: "75000.00",
        metadata: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-6",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Uber",
        merchantUpi: "uber@paytm",
        amount: "650.00",
        status: "success",
        transactionId: `CUPI${Date.now()}006`,
        description: "Cab ride",
        category: "transport",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "75000.00",
        balanceAfter: "74350.00",
        metadata: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-7",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Zomato",
        merchantUpi: "zomato@paytm",
        amount: "1350.00",
        status: "success",
        transactionId: `CUPI${Date.now()}007`,
        description: "Food delivery",
        category: "food",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "74350.00",
        balanceAfter: "73000.00",
        metadata: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-8",
        accountId: "credit-upi-1",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "MakeMyTrip",
        merchantUpi: "makemytrip@paytm",
        amount: "8000.00",
        status: "success",
        transactionId: `CUPI${Date.now()}008`,
        description: "Flight booking - Advance payment",
        category: "travel",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "73000.00",
        balanceAfter: "65000.00",
        metadata: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-9",
        accountId: "credit-upi-2",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Flipkart",
        merchantUpi: "flipkart@gpay",
        amount: "4500.00",
        status: "success",
        transactionId: `CUPI${Date.now()}009`,
        description: "Shopping - Books",
        category: "shopping",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "50000.00",
        balanceAfter: "45500.00",
        metadata: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-10",
        accountId: "credit-upi-2",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Starbucks",
        merchantUpi: "starbucks@gpay",
        amount: "850.00",
        status: "success",
        transactionId: `CUPI${Date.now()}010`,
        description: "Coffee and snacks",
        category: "food",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "45500.00",
        balanceAfter: "44650.00",
        metadata: null,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-11",
        accountId: "credit-upi-2",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Ola",
        merchantUpi: "ola@gpay",
        amount: "350.00",
        status: "success",
        transactionId: `CUPI${Date.now()}011`,
        description: "Auto ride",
        category: "transport",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "44650.00",
        balanceAfter: "44300.00",
        metadata: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-12",
        accountId: "credit-upi-2",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Netflix",
        merchantUpi: "netflix@gpay",
        amount: "799.00",
        status: "success",
        transactionId: `CUPI${Date.now()}012`,
        description: "Monthly subscription",
        category: "entertainment",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "44300.00",
        balanceAfter: "43501.00",
        metadata: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "credit-txn-13",
        accountId: "credit-upi-2",
        userId: "user-1",
        transactionType: "payment",
        merchantName: "Dominos",
        merchantUpi: "dominos@gpay",
        amount: "1001.00",
        status: "success",
        transactionId: `CUPI${Date.now()}013`,
        description: "Pizza delivery",
        category: "food",
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: "43501.00",
        balanceAfter: "42500.00",
        metadata: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleCreditUpiTransactions.forEach(txn => this.creditUpiTransactions.set(txn.id, txn));

    // Sample Family UPI Accounts
    const sampleFamilyUpiAccounts: FamilyUpiAccount[] = [
      {
        id: "family-upi-1",
        userId: "user-1",
        familyName: "Kanatt Family Account",
        upiId: "kanattfamily@paytm",
        bankName: "HDFC Bank",
        accountNumber: "****1234",
        ifscCode: "HDFC0001234",
        memberCount: 4,
        monthlyLimit: "500000.00",
        dailyLimit: "100000.00",
        totalSpent: "45500.00",
        availableBalance: "350000.00",
        isActive: 1,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "family-upi-2",
        userId: "user-1",
        familyName: "Joint Savings Account",
        upiId: "jointaccount@gpay",
        bankName: "ICICI Bank",
        accountNumber: "****5678",
        ifscCode: "ICIC0005678",
        memberCount: 3,
        monthlyLimit: "300000.00",
        dailyLimit: "50000.00",
        totalSpent: "28750.00",
        availableBalance: "220000.00",
        isActive: 1,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }
    ];
    sampleFamilyUpiAccounts.forEach(account => this.familyUpiAccounts.set(account.id, account));

    // Sample Family UPI Members
    const sampleFamilyUpiMembers: FamilyUpiMember[] = [
      {
        id: "family-member-1",
        familyAccountId: "family-upi-1",
        memberId: "user-1",
        memberName: "Joshua J Kanatt",
        memberPhone: "8547258015",
        relationship: "owner",
        role: "owner",
        spendingLimit: "100000.00",
        canApprove: 1,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-2",
        familyAccountId: "family-upi-1",
        memberId: null,
        memberName: "Sarah Kanatt",
        memberPhone: "9876543210",
        relationship: "spouse",
        role: "admin",
        spendingLimit: "80000.00",
        canApprove: 1,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-3",
        familyAccountId: "family-upi-1",
        memberId: null,
        memberName: "David Kanatt",
        memberPhone: "9988776655",
        relationship: "child",
        role: "member",
        spendingLimit: "20000.00",
        canApprove: 0,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-4",
        familyAccountId: "family-upi-1",
        memberId: null,
        memberName: "Emma Kanatt",
        memberPhone: "8899001122",
        relationship: "child",
        role: "member",
        spendingLimit: "15000.00",
        canApprove: 0,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-5",
        familyAccountId: "family-upi-2",
        memberId: "user-1",
        memberName: "Joshua J Kanatt",
        memberPhone: "8547258015",
        relationship: "owner",
        role: "owner",
        spendingLimit: "50000.00",
        canApprove: 1,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-6",
        familyAccountId: "family-upi-2",
        memberId: null,
        memberName: "Michael Johnson",
        memberPhone: "7766554433",
        relationship: "sibling",
        role: "admin",
        spendingLimit: "40000.00",
        canApprove: 1,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-member-7",
        familyAccountId: "family-upi-2",
        memberId: null,
        memberName: "Lisa Brown",
        memberPhone: "6655443322",
        relationship: "other",
        role: "member",
        spendingLimit: "25000.00",
        canApprove: 0,
        canView: 1,
        isActive: 1,
        joinedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleFamilyUpiMembers.forEach(member => this.familyUpiMembers.set(member.id, member));

    // Sample Family UPI Transactions
    const sampleFamilyUpiTransactions: FamilyUpiTransaction[] = [
      {
        id: "family-txn-1",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-1",
        upiTransactionId: null,
        amount: "5000.00",
        transactionType: "payment",
        description: "Monthly groceries",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-2",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-2",
        upiTransactionId: null,
        amount: "3500.00",
        transactionType: "payment",
        description: "Electricity bill payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-3",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-3",
        upiTransactionId: null,
        amount: "1200.00",
        transactionType: "payment",
        description: "School supplies",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-1",
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-4",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-4",
        upiTransactionId: null,
        amount: "850.00",
        transactionType: "payment",
        description: "Art supplies",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-2",
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-5",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-1",
        upiTransactionId: null,
        amount: "12000.00",
        transactionType: "transfer",
        description: "House rent payment",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-6",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-2",
        upiTransactionId: null,
        amount: "2500.00",
        transactionType: "payment",
        description: "Internet bill",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-7",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-3",
        upiTransactionId: null,
        amount: "1800.00",
        transactionType: "payment",
        description: "Sports equipment",
        status: "success",
        requiresApproval: 1,
        approvedBy: "family-member-1",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-8",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-2",
        upiTransactionId: null,
        amount: "6500.00",
        transactionType: "bill",
        description: "Monthly medical expenses",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-9",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-4",
        upiTransactionId: null,
        amount: "950.00",
        transactionType: "payment",
        description: "Music lessons",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-2",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-10",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-1",
        upiTransactionId: null,
        amount: "8500.00",
        transactionType: "payment",
        description: "Family dinner - Restaurant",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-11",
        familyAccountId: "family-upi-1",
        initiatedBy: "family-member-3",
        upiTransactionId: null,
        amount: "1700.00",
        transactionType: "payment",
        description: "Movie tickets - Family",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-1",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-12",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-5",
        upiTransactionId: null,
        amount: "8000.00",
        transactionType: "payment",
        description: "Investment contribution",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-13",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-6",
        upiTransactionId: null,
        amount: "6500.00",
        transactionType: "payment",
        description: "Emergency fund transfer",
        status: "success",
        requiresApproval: 1,
        approvedBy: "family-member-5",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-14",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-7",
        upiTransactionId: null,
        amount: "3250.00",
        transactionType: "payment",
        description: "Shared house maintenance",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-5",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-15",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-5",
        upiTransactionId: null,
        amount: "5500.00",
        transactionType: "bill",
        description: "Shared utility bills",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-16",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-6",
        upiTransactionId: null,
        amount: "2750.00",
        transactionType: "payment",
        description: "Insurance premium split",
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "family-txn-17",
        familyAccountId: "family-upi-2",
        initiatedBy: "family-member-7",
        upiTransactionId: null,
        amount: "2750.00",
        transactionType: "payment",
        description: "Shared subscription services",
        status: "success",
        requiresApproval: 0,
        approvedBy: "family-member-6",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ];
    sampleFamilyUpiTransactions.forEach(txn => this.familyUpiTransactions.set(txn.id, txn));

    // ========== COMPREHENSIVE TRAVEL & BOOKING DATA ==========

    // 50+ Flight Routes and Schedules
    const flightRoutes = [
      { id: "flt-route-1", from: "Delhi", to: "Mumbai", fromCode: "DEL", toCode: "BOM", serviceType: "flight", distance: 1400 },
      { id: "flt-route-2", from: "Mumbai", to: "Bangalore", fromCode: "BOM", toCode: "BLR", serviceType: "flight", distance: 840 },
      { id: "flt-route-3", from: "Delhi", to: "Bangalore", fromCode: "DEL", toCode: "BLR", serviceType: "flight", distance: 1740 },
      { id: "flt-route-4", from: "Bangalore", to: "Hyderabad", fromCode: "BLR", toCode: "HYD", serviceType: "flight", distance: 575 },
      { id: "flt-route-5", from: "Mumbai", to: "Hyderabad", fromCode: "BOM", toCode: "HYD", serviceType: "flight", distance: 710 },
      { id: "flt-route-6", from: "Kolkata", to: "Delhi", fromCode: "CCU", toCode: "DEL", serviceType: "flight", distance: 1470 },
      { id: "flt-route-7", from: "Delhi", to: "Chennai", fromCode: "DEL", toCode: "MAA", serviceType: "flight", distance: 1760 },
      { id: "flt-route-8", from: "Mumbai", to: "Chennai", fromCode: "BOM", toCode: "MAA", serviceType: "flight", distance: 1030 },
      { id: "flt-route-9", from: "Bangalore", to: "Chennai", fromCode: "BLR", toCode: "MAA", serviceType: "flight", distance: 290 },
      { id: "flt-route-10", from: "Delhi", to: "Kolkata", fromCode: "DEL", toCode: "CCU", serviceType: "flight", distance: 1470 },
      { id: "flt-route-11", from: "Mumbai", to: "Kolkata", fromCode: "BOM", toCode: "CCU", serviceType: "flight", distance: 1655 },
      { id: "flt-route-12", from: "Pune", to: "Bangalore", fromCode: "PNQ", toCode: "BLR", serviceType: "flight", distance: 730 },
      { id: "flt-route-13", from: "Delhi", to: "Goa", fromCode: "DEL", toCode: "GOI", serviceType: "flight", distance: 1870 },
      { id: "flt-route-14", from: "Mumbai", to: "Goa", fromCode: "BOM", toCode: "GOI", serviceType: "flight", distance: 440 },
      { id: "flt-route-15", from: "Bangalore", to: "Goa", fromCode: "BLR", toCode: "GOI", serviceType: "flight", distance: 490 },
    ];

    flightRoutes.forEach(route => {
      const travelRoute: TravelRoute = {
        ...route,
        operatorName: "Multiple Airlines",
        serviceClass: "Economy, Business",
        amenities: ["WiFi", "Meals", "Entertainment"],
        status: "active",
        createdAt: new Date(),
      };
      this.travelRoutes.set(route.id, travelRoute);
    });

    // Airlines and timings for comprehensive flight schedules
    const airlines = ["Air India", "IndiGo", "Vistara", "SpiceJet", "Go First", "AirAsia India"];
    const flightTimes = ["06:00", "08:30", "11:00", "13:30", "16:00", "18:30", "21:00", "23:30"];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let flightScheduleId = 1;
    flightRoutes.forEach((route, routeIdx) => {
      airlines.forEach((airline, airlineIdx) => {
        const randomTimes = [flightTimes[Math.floor(Math.random() * flightTimes.length)], flightTimes[Math.floor(Math.random() * flightTimes.length)]];
        randomTimes.forEach((time, timeIdx) => {
          const arrivalTime = `${String(parseInt(time.split(':')[0]) + 2).padStart(2, '0')}:${time.split(':')[1]}`;
          const basePrice = 3000 + routeIdx * 500 + airlineIdx * 200;
          const flightSchedule: TravelSchedule = {
            id: `flt-sched-${flightScheduleId++}`,
            routeId: route.id,
            operatorName: airline,
            vehicleNumber: `${airline.slice(0,2).toUpperCase()}-${100 + routeIdx}${airlineIdx}`,
            departureTime: time,
            arrivalTime: arrivalTime,
            duration: "02:00",
            departureDate: tomorrowStr,
            availableSeats: 120 - Math.floor(Math.random() * 50),
            totalSeats: 120,
            fare: `${basePrice + Math.floor(Math.random() * 2000)}.00`,
            currency: "INR",
            serviceClass: airlineIdx % 2 === 0 ? "Economy" : "Business",
            amenities: ["WiFi", "Meals", "Baggage Allowance"],
            status: "active",
            createdAt: new Date(),
          };
          this.travelSchedules.set(flightSchedule.id, flightSchedule);
        });
      });
    });

    // 30+ Train Routes and Schedules  
    const trainRoutes = [
      { id: "trn-route-1", from: "Delhi", to: "Mumbai", fromCode: "NDLS", toCode: "CSTM", serviceType: "train", distance: 1384 },
      { id: "trn-route-2", from: "Mumbai", to: "Bangalore", fromCode: "CSTM", toCode: "SBC", serviceType: "train", distance: 1146 },
      { id: "trn-route-3", from: "Delhi", to: "Bangalore", fromCode: "NDLS", toCode: "SBC", serviceType: "train", distance: 2150 },
      { id: "trn-route-4", from: "Delhi", to: "Chennai", fromCode: "NDLS", toCode: "MAS", serviceType: "train", distance: 2180 },
      { id: "trn-route-5", from: "Mumbai", to: "Chennai", fromCode: "CSTM", toCode: "MAS", serviceType: "train", distance: 1279 },
      { id: "trn-route-6", from: "Delhi", to: "Kolkata", fromCode: "NDLS", toCode: "HWH", serviceType: "train", distance: 1441 },
      { id: "trn-route-7", from: "Mumbai", to: "Kolkata", fromCode: "CSTM", toCode: "HWH", serviceType: "train", distance: 2014 },
      { id: "trn-route-8", from: "Delhi", to: "Hyderabad", fromCode: "NDLS", toCode: "SC", serviceType: "train", distance: 1570 },
      { id: "trn-route-9", from: "Bangalore", to: "Hyderabad", fromCode: "SBC", toCode: "SC", serviceType: "train", distance: 575 },
      { id: "trn-route-10", from: "Chennai", to: "Hyderabad", fromCode: "MAS", toCode: "SC", serviceType: "train", distance: 626 },
    ];

    trainRoutes.forEach(route => {
      const travelRoute: TravelRoute = {
        ...route,
        operatorName: "Indian Railways",
        serviceClass: "Sleeper, 3AC, 2AC, 1AC",
        amenities: ["Meals", "Bedding", "Charging Points"],
        status: "active",
        createdAt: new Date(),
      };
      this.travelRoutes.set(route.id, travelRoute);
    });

    const trains = ["Rajdhani Express", "Shatabdi Express", "Duronto Express", "Express", "Superfast Express"];
    const trainTimes = ["05:00", "09:00", "14:00", "18:00", "22:00"];
    let trainScheduleId = 1;
    trainRoutes.forEach((route, routeIdx) => {
      trains.forEach((train, trainIdx) => {
        trainTimes.forEach((time) => {
          const duration = `${12 + routeIdx}:${30 + trainIdx * 10}`;
          const arrivalHour = (parseInt(time.split(':')[0]) + 12 + routeIdx) % 24;
          const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${time.split(':')[1]}`;
          const basePrice = 500 + routeIdx * 100;
          const trainSchedule: TravelSchedule = {
            id: `trn-sched-${trainScheduleId++}`,
            routeId: route.id,
            operatorName: `${train} ${12000 + trainScheduleId}`,
            vehicleNumber: `${12000 + trainScheduleId}`,
            departureTime: time,
            arrivalTime: arrivalTime,
            duration: duration,
            departureDate: tomorrowStr,
            availableSeats: 200 - Math.floor(Math.random() * 80),
            totalSeats: 200,
            fare: `${basePrice + trainIdx * 200}.00`,
            currency: "INR",
            serviceClass: trainIdx % 3 === 0 ? "Sleeper" : trainIdx % 3 === 1 ? "3AC" : "2AC",
            amenities: ["Meals", "Bedding", "Charging"],
            status: "active",
            createdAt: new Date(),
          };
          this.travelSchedules.set(trainSchedule.id, trainSchedule);
        });
      });
    });

    // 30+ Bus Routes and Schedules
    const busRoutes = [
      { id: "bus-route-1", from: "Delhi", to: "Jaipur", fromCode: "DEL", toCode: "JAI", serviceType: "bus", distance: 280 },
      { id: "bus-route-2", from: "Mumbai", to: "Pune", fromCode: "BOM", toCode: "PNQ", serviceType: "bus", distance: 150 },
      { id: "bus-route-3", from: "Bangalore", to: "Mysore", fromCode: "BLR", toCode: "MYS", serviceType: "bus", distance: 145 },
      { id: "bus-route-4", from: "Delhi", to: "Chandigarh", fromCode: "DEL", toCode: "CHD", serviceType: "bus", distance: 243 },
      { id: "bus-route-5", from: "Mumbai", to: "Goa", fromCode: "BOM", toCode: "GOI", serviceType: "bus", distance: 470 },
      { id: "bus-route-6", from: "Bangalore", to: "Chennai", fromCode: "BLR", toCode: "MAA", serviceType: "bus", distance: 345 },
      { id: "bus-route-7", from: "Hyderabad", to: "Vijayawada", fromCode: "HYD", toCode: "BZA", serviceType: "bus", distance: 275 },
      { id: "bus-route-8", from: "Chennai", to: "Coimbatore", fromCode: "MAA", toCode: "CJB", serviceType: "bus", distance: 505 },
      { id: "bus-route-9", from: "Delhi", to: "Agra", fromCode: "DEL", toCode: "AGR", serviceType: "bus", distance: 230 },
      { id: "bus-route-10", from: "Kolkata", to: "Siliguri", fromCode: "CCU", toCode: "SLG", serviceType: "bus", distance: 560 },
    ];

    busRoutes.forEach(route => {
      const travelRoute: TravelRoute = {
        ...route,
        operatorName: "Multiple Operators",
        serviceClass: "Volvo, Sleeper, Semi-Sleeper",
        amenities: ["AC", "WiFi", "Water", "Charging Points"],
        status: "active",
        createdAt: new Date(),
      };
      this.travelRoutes.set(route.id, travelRoute);
    });

    const busOperators = ["RedBus Travels", "VRL Travels", "Orange Travels", "SRS Travels", "Kaveri Travels", "Parveen Travels"];
    const busTimes = ["06:00", "10:00", "14:00", "18:00", "22:00", "23:30"];
    const busTypes = ["Volvo AC", "Sleeper AC", "Semi-Sleeper AC", "Seater AC"];
    let busScheduleId = 1;
    busRoutes.forEach((route, routeIdx) => {
      busOperators.forEach((operator, opIdx) => {
        busTimes.slice(0, 3).forEach((time) => {
          const duration = `${4 + Math.floor(route.distance / 80)}:30`;
          const arrivalHour = (parseInt(time.split(':')[0]) + 4 + Math.floor(route.distance / 80)) % 24;
          const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:30`;
          const basePrice = 300 + Math.floor(route.distance / 10);
          const busSchedule: TravelSchedule = {
            id: `bus-sched-${busScheduleId++}`,
            routeId: route.id,
            operatorName: operator,
            vehicleNumber: `${operator.slice(0,3).toUpperCase()}-${1000 + busScheduleId}`,
            departureTime: time,
            arrivalTime: arrivalTime,
            duration: duration,
            departureDate: tomorrowStr,
            availableSeats: 40 - Math.floor(Math.random() * 15),
            totalSeats: 40,
            fare: `${basePrice + opIdx * 100}.00`,
            currency: "INR",
            serviceClass: busTypes[opIdx % busTypes.length],
            amenities: ["AC", "WiFi", "Water"],
            status: "active",
            createdAt: new Date(),
          };
          this.travelSchedules.set(busSchedule.id, busSchedule);
        });
      });
    });

    // 20+ Hotels with rooms
    const hotelsData = [
      { name: "The Taj Mahal Palace", city: "Mumbai", stars: 5, basePrice: 15000 },
      { name: "The Oberoi", city: "Delhi", stars: 5, basePrice: 12000 },
      { name: "ITC Grand Chola", city: "Chennai", stars: 5, basePrice: 10000 },
      { name: "The Leela Palace", city: "Bangalore", stars: 5, basePrice: 11000 },
      { name: "Taj Falaknuma Palace", city: "Hyderabad", stars: 5, basePrice: 13000 },
      { name: "Trident Hotel", city: "Mumbai", stars: 4, basePrice: 7000 },
      { name: "Radisson Blu", city: "Delhi", stars: 4, basePrice: 6500 },
      { name: "The Park", city: "Chennai", stars: 4, basePrice: 6000 },
      { name: "JW Marriott", city: "Bangalore", stars: 4, basePrice: 7500 },
      { name: "Novotel", city: "Hyderabad", stars: 4, basePrice: 6200 },
      { name: "Lemon Tree Hotel", city: "Mumbai", stars: 3, basePrice: 3500 },
      { name: "The Hans", city: "Delhi", stars: 3, basePrice: 3200 },
      { name: "Residency Hotel", city: "Chennai", stars: 3, basePrice: 3000 },
      { name: "Royal Orchid", city: "Bangalore", stars: 3, basePrice: 3400 },
      { name: "Fortune Hotel", city: "Hyderabad", stars: 3, basePrice: 3100 },
      { name: "Ginger Hotel", city: "Mumbai", stars: 2, basePrice: 1800 },
      { name: "FabHotel", city: "Delhi", stars: 2, basePrice: 1600 },
      { name: "Treebo Trend", city: "Chennai", stars: 2, basePrice: 1500 },
      { name: "OYO Rooms", city: "Bangalore", stars: 2, basePrice: 1700 },
      { name: "Hotel Sai Plaza", city: "Hyderabad", stars: 2, basePrice: 1550 },
      { name: "The Grand Bhagwati", city: "Mumbai", stars: 4, basePrice: 6800 },
      { name: "Pride Plaza", city: "Kolkata", stars: 4, basePrice: 6400 },
      { name: "The Gateway Hotel", city: "Pune", stars: 4, basePrice: 6600 },
      { name: "Vivanta by Taj", city: "Goa", stars: 5, basePrice: 12500 },
      { name: "Hyatt Regency", city: "Chennai", stars: 5, basePrice: 11500 },
    ];

    hotelsData.forEach((hotelData, idx) => {
      const hotelId = `hotel-${idx + 1}`;
      const hotel: Hotel = {
        id: hotelId,
        name: hotelData.name,
        location: hotelData.city,
        city: hotelData.city,
        address: `${hotelData.name}, ${hotelData.city}, India`,
        latitude: "0.0",
        longitude: "0.0",
        starRating: hotelData.stars,
        rating: (4.0 + Math.random()).toFixed(1),
        totalReviews: 100 + Math.floor(Math.random() * 500),
        description: `Experience luxury and comfort at ${hotelData.name}, one of ${hotelData.city}'s finest ${hotelData.stars}-star hotels.`,
        amenities: hotelData.stars >= 4 ? ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Parking"] : ["WiFi", "Restaurant", "Room Service", "Parking"],
        checkInTime: "14:00",
        checkOutTime: "11:00",
        images: [`/hotels/${hotelId}-1.jpg`, `/hotels/${hotelId}-2.jpg`],
        phone: `+91-${9000000000 + idx}`,
        email: `contact@${hotelData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://www.${hotelData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        policies: "Free cancellation up to 24 hours before check-in",
        isActive: 1,
        createdAt: new Date(),
      };
      this.hotels.set(hotel.id, hotel);

      // Add rooms for each hotel
      const roomTypes = [
        { type: "Deluxe Room", capacity: 2, priceMultiplier: 1.0 },
        { type: "Executive Room", capacity: 2, priceMultiplier: 1.3 },
        { type: "Suite", capacity: 3, priceMultiplier: 1.8 },
        { type: "Presidential Suite", capacity: 4, priceMultiplier: 2.5 },
      ];

      roomTypes.forEach((roomType, roomIdx) => {
        const roomId = `room-${idx}-${roomIdx}`;
        const room: HotelRoom = {
          id: roomId,
          hotelId: hotelId,
          roomType: roomType.type,
          description: `Spacious ${roomType.type} with modern amenities`,
          maxOccupancy: roomType.capacity,
          bedType: roomType.capacity > 2 ? "King + Twin" : "King",
          size: (250 + roomIdx * 100).toString(),
          amenities: ["AC", "TV", "Mini Bar", "Safe", "Bathrobes"],
          images: [`/rooms/${roomId}-1.jpg`],
          basePrice: `${Math.floor(hotelData.basePrice * roomType.priceMultiplier)}.00`,
          currency: "INR",
          isActive: 1,
          createdAt: new Date(),
        };
        this.hotelRooms.set(room.id, room);
      });
    });

    // 30+ Events across categories
    const eventsData = [
      { name: "Sunburn Music Festival", category: "Concert", venue: "Goa", price: 3000, date: 30 },
      { name: "NH7 Weekender", category: "Concert", venue: "Pune", price: 2500, date: 45 },
      { name: "Arijit Singh Live", category: "Concert", venue: "Mumbai", price: 2000, date: 20 },
      { name: "AR Rahman Concert", category: "Concert", venue: "Chennai", price: 2200, date: 35 },
      { name: "Coldplay India Tour", category: "Concert", venue: "Delhi", price: 5000, date: 60 },
      { name: "IPL Mumbai vs Delhi", category: "Sports", venue: "Mumbai", price: 1500, date: 15 },
      { name: "IPL Bangalore vs Chennai", category: "Sports", venue: "Bangalore", price: 1400, date: 18 },
      { name: "India vs Australia Test", category: "Sports", venue: "Delhi", price: 800, date: 40 },
      { name: "Kabaddi Pro League", category: "Sports", venue: "Hyderabad", price: 600, date: 25 },
      { name: "ISL Football Match", category: "Sports", venue: "Kolkata", price: 500, date: 22 },
      { name: "Zakir Khan Comedy Show", category: "Comedy", venue: "Mumbai", price: 800, date: 12 },
      { name: "Kapil Sharma Live", category: "Comedy", venue: "Delhi", price: 1000, date: 18 },
      { name: "Vir Das Stand-up", category: "Comedy", venue: "Bangalore", price: 900, date: 28 },
      { name: "Kunal Kamra Live", category: "Comedy", venue: "Pune", price: 700, date: 32 },
      { name: "Kenny Sebastian Show", category: "Comedy", venue: "Chennai", price: 750, date: 38 },
      { name: "India Art Fair", category: "Exhibition", venue: "Delhi", price: 500, date: 50 },
      { name: "Comic Con India", category: "Exhibition", venue: "Mumbai", price: 600, date: 55 },
      { name: "Auto Expo", category: "Exhibition", venue: "Delhi", price: 400, date: 70 },
      { name: "Tech Summit India", category: "Conference", venue: "Bangalore", price: 1500, date: 42 },
      { name: "Startup Conclave", category: "Conference", venue: "Hyderabad", price: 1200, date: 48 },
      { name: "India Gaming Show", category: "Exhibition", venue: "Mumbai", price: 700, date: 35 },
      { name: "Food Fest Mumbai", category: "Festival", venue: "Mumbai", price: 300, date: 10 },
      { name: "Lit Fest Jaipur", category: "Festival", venue: "Jaipur", price: 400, date: 65 },
      { name: "Wine & Dine Festival", category: "Festival", venue: "Bangalore", price: 800, date: 22 },
      { name: "Classical Music Night", category: "Concert", venue: "Chennai", price: 1200, date: 30 },
      { name: "DJ Night with Nucleya", category: "Concert", venue: "Goa", price: 1500, date: 28 },
      { name: "Rock Concert - Parikrama", category: "Concert", venue: "Delhi", price: 1000, date: 33 },
      { name: "Sufi Night", category: "Concert", venue: "Mumbai", price: 1100, date: 40 },
      { name: "Fashion Week India", category: "Exhibition", venue: "Mumbai", price: 2000, date: 75 },
      { name: "Marathon Mumbai", category: "Sports", venue: "Mumbai", price: 500, date: 90 },
      { name: "Cycling Championship", category: "Sports", venue: "Pune", price: 300, date: 45 },
    ];

    eventsData.forEach((eventData, idx) => {
      const eventId = `event-${idx + 1}`;
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + eventData.date);
      const event: Event = {
        id: eventId,
        name: eventData.name,
        category: eventData.category,
        description: `Join us for an unforgettable experience at ${eventData.name}`,
        venue: eventData.venue,
        venueName: `${eventData.venue} Stadium`,
        city: eventData.venue,
        address: `${eventData.venue} Main Road, ${eventData.venue}, India`,
        latitude: "0.0",
        longitude: "0.0",
        eventDate: eventDate.toISOString().split('T')[0],
        startTime: idx % 2 === 0 ? "18:00" : "20:00",
        endTime: idx % 2 === 0 ? "22:00" : "23:00",
        duration: "4 hours",
        images: [`/events/${eventId}-1.jpg`, `/events/${eventId}-2.jpg`],
        organizer: `${eventData.name} Productions`,
        contactEmail: `info@${eventData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        contactPhone: `+91-${8000000000 + idx}`,
        ageRestriction: eventData.category === "Concert" ? "18+" : "All Ages",
        languages: ["English", "Hindi"],
        tags: [eventData.category, eventData.venue],
        rating: (4.0 + Math.random()).toFixed(1),
        totalReviews: 50 + Math.floor(Math.random() * 200),
        status: "active",
        isActive: 1,
        createdAt: new Date(),
      };
      this.events.set(event.id, event);

      // Add ticket tiers for each event
      const tiers = [
        { name: "General", multiplier: 1.0, capacity: 500 },
        { name: "Premium", multiplier: 1.5, capacity: 200 },
        { name: "VIP", multiplier: 2.5, capacity: 50 },
      ];

      tiers.forEach((tier, tierIdx) => {
        const tierId = `tier-${idx}-${tierIdx}`;
        const eventTier: EventTicketTier = {
          id: tierId,
          eventId: eventId,
          tierName: tier.name,
          description: `${tier.name} seating for ${eventData.name}`,
          price: `${Math.floor(eventData.price * tier.multiplier)}.00`,
          currency: "INR",
          totalTickets: tier.capacity,
          availableTickets: tier.capacity - Math.floor(Math.random() * tier.capacity / 2),
          benefits: tier.name === "VIP" ? ["Meet & Greet", "Backstage Access", "Priority Entry"] : tier.name === "Premium" ? ["Priority Entry", "Complimentary Drinks"] : ["Standard Entry"],
          seatType: tier.name === "VIP" ? "Reserved" : "General",
          isActive: 1,
          createdAt: new Date(),
        };
        this.eventTicketTiers.set(tierId, eventTier);
      });
    });

    // 10+ Metro Routes and Stations
    const metroData = [
      { city: "Delhi", name: "Delhi Metro", routes: ["Red Line", "Blue Line", "Yellow Line", "Green Line"], stations: ["Rajiv Chowk", "Kashmere Gate", "Central Secretariat", "Hauz Khas", "Dwarka"] },
      { city: "Bangalore", name: "Namma Metro", routes: ["Purple Line", "Green Line"], stations: ["MG Road", "Indiranagar", "Majestic", "Yeshwanthpur", "Baiyappanahalli"] },
      { city: "Mumbai", name: "Mumbai Metro", routes: ["Line 1", "Line 2A"], stations: ["Andheri", "Ghatkopar", "Versova", "DN Nagar", "Dahisar"] },
      { city: "Chennai", name: "Chennai Metro", routes: ["Blue Line", "Green Line"], stations: ["Chennai Central", "Koyambedu", "Alandur", "Airport", "St. Thomas Mount"] },
      { city: "Hyderabad", name: "Hyderabad Metro", routes: ["Red Line", "Blue Line", "Green Line"], stations: ["Ameerpet", "Miyapur", "LB Nagar", "MGBS", "Nagole"] },
    ];

    metroData.forEach((metro, metroIdx) => {
      metro.stations.forEach((stationName, stationIdx) => {
        const stationId = `metro-station-${metroIdx}-${stationIdx}`;
        const station: MetroStation = {
          id: stationId,
          name: stationName,
          city: metro.city,
          metroLine: metro.routes[Math.floor(Math.random() * metro.routes.length)],
          stationCode: `${metro.city.slice(0,3).toUpperCase()}${100 + stationIdx}`,
          latitude: "0.0",
          longitude: "0.0",
          address: `${stationName}, ${metro.city}`,
          facilities: ["Escalator", "Elevator", "Parking", "WiFi"],
          isActive: 1,
          createdAt: new Date(),
        };
        this.metroStations.set(station.id, station);
      });

      metro.routes.forEach((routeName, routeIdx) => {
        const routeId = `metro-route-${metroIdx}-${routeIdx}`;
        const metroRoute: MetroRoute = {
          id: routeId,
          name: routeName,
          city: metro.city,
          startStation: metro.stations[0],
          endStation: metro.stations[metro.stations.length - 1],
          totalStations: metro.stations.length,
          distance: `${15 + routeIdx * 5}.0`,
          fareRange: "10-60",
          operatingHours: "06:00-23:00",
          frequency: "5-10 minutes",
          isActive: 1,
          createdAt: new Date(),
        };
        this.metroRoutes.set(metroRoute.id, metroRoute);
      });
    });

    // 20+ Rental Vehicles
    const rentalVehiclesData = [
      { type: "car", brand: "Maruti Suzuki", model: "Swift", price: 1500, vendor: "Zoomcar" },
      { type: "car", brand: "Hyundai", model: "i20", price: 1600, vendor: "Zoomcar" },
      { type: "car", brand: "Honda", model: "City", price: 2000, vendor: "Myles" },
      { type: "car", brand: "Tata", model: "Nexon", price: 1800, vendor: "Revv" },
      { type: "car", brand: "Mahindra", model: "XUV300", price: 1900, vendor: "Zoomcar" },
      { type: "car", brand: "Toyota", model: "Innova Crysta", price: 2500, vendor: "Myles" },
      { type: "car", brand: "Ford", model: "EcoSport", price: 1700, vendor: "Revv" },
      { type: "car", brand: "Volkswagen", model: "Polo", price: 1650, vendor: "Zoomcar" },
      { type: "bike", brand: "Honda", model: "Activa", price: 500, vendor: "Bounce" },
      { type: "bike", brand: "TVS", model: "Jupiter", price: 480, vendor: "Vogo" },
      { type: "bike", brand: "Hero", model: "Splendor", price: 450, vendor: "Bounce" },
      { type: "bike", brand: "Yamaha", model: "FZ", price: 600, vendor: "Royal Brothers" },
      { type: "bike", brand: "Bajaj", model: "Pulsar", price: 550, vendor: "Royal Brothers" },
      { type: "bike", brand: "KTM", model: "Duke 200", price: 800, vendor: "Wicked Ride" },
      { type: "scooter", brand: "Honda", model: "Dio", price: 400, vendor: "Bounce" },
      { type: "scooter", brand: "TVS", model: "Ntorq", price: 420, vendor: "Vogo" },
      { type: "scooter", brand: "Suzuki", model: "Access", price: 390, vendor: "Bounce" },
      { type: "bike", brand: "Royal Enfield", model: "Classic 350", price: 1000, vendor: "Royal Brothers" },
      { type: "bike", brand: "Royal Enfield", model: "Himalayan", price: 1200, vendor: "Wicked Ride" },
      { type: "car", brand: "Renault", model: "Duster", price: 1750, vendor: "Myles" },
      { type: "car", brand: "Kia", model: "Seltos", price: 2100, vendor: "Revv" },
      { type: "car", brand: "MG", model: "Hector", price: 2200, vendor: "Zoomcar" },
    ];

    rentalVehiclesData.forEach((vehicle, idx) => {
      const vehicleId = `rental-${idx + 1}`;
      const rentalVehicle: RentalVehicle = {
        id: vehicleId,
        vendorName: vehicle.vendor,
        vehicleType: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        registrationNumber: `MH-${12 + idx}-AB-${1000 + idx}`,
        year: 2020 + Math.floor(Math.random() * 4),
        fuelType: vehicle.type === "bike" || vehicle.type === "scooter" ? "Petrol" : Math.random() > 0.5 ? "Petrol" : "Diesel",
        transmission: vehicle.type === "car" ? (Math.random() > 0.5 ? "Manual" : "Automatic") : "Manual",
        seatingCapacity: vehicle.type === "car" ? (vehicle.model.includes("Innova") ? 7 : 5) : 2,
        color: ["White", "Silver", "Black", "Red"][Math.floor(Math.random() * 4)],
        mileage: `${15 + Math.floor(Math.random() * 10)}.0`,
        features: vehicle.type === "car" ? ["AC", "GPS", "Music System", "Power Windows"] : ["Helmet Provided", "USB Charging"],
        images: [`/rentals/${vehicleId}.jpg`],
        pricePerDay: `${vehicle.price}.00`,
        pricePerHour: `${Math.floor(vehicle.price / 10)}.00`,
        pricePerKm: vehicle.type === "car" ? "12.00" : "5.00",
        securityDeposit: `${vehicle.type === "car" ? 5000 : 1000}.00`,
        availableLocation: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"][idx % 5],
        isAvailable: 1,
        rating: (4.0 + Math.random()).toFixed(1),
        totalReviews: 20 + Math.floor(Math.random() * 100),
        isActive: 1,
        createdAt: new Date(),
      };
      this.rentalVehicles.set(rentalVehicle.id, rentalVehicle);
    });

    // ========== MOVIES, THEATERS & SHOWTIMES ==========

    const moviesData = [
      { name: "Jawan", genre: "Action", lang: "Hindi", duration: "169", rating: "4.5", year: 2023 },
      { name: "Pathaan", genre: "Action", lang: "Hindi", duration: "146", rating: "4.3", year: 2023 },
      { name: "Dunki", genre: "Comedy", lang: "Hindi", duration: "161", rating: "4.1", year: 2023 },
      { name: "Animal", genre: "Action", lang: "Hindi", duration: "201", rating: "4.0", year: 2023 },
      { name: "12th Fail", genre: "Drama", lang: "Hindi", duration: "147", rating: "4.8", year: 2023 },
      { name: "Salaar", genre: "Action", lang: "Telugu", duration: "175", rating: "4.2", year: 2023 },
      { name: "Leo", genre: "Action", lang: "Tamil", duration: "164", rating: "4.0", year: 2023 },
      { name: "Jailer", genre: "Action", lang: "Tamil", duration: "168", rating: "4.4", year: 2023 },
      { name: "Gadar 2", genre: "Action", lang: "Hindi", duration: "170", rating: "3.8", year: 2023 },
      { name: "OMG 2", genre: "Drama", lang: "Hindi", duration: "156", rating: "4.2", year: 2023 },
      { name: "Rocky Aur Rani", genre: "Romance", lang: "Hindi", duration: "168", rating: "4.0", year: 2023 },
      { name: "Oppenheimer", genre: "Drama", lang: "English", duration: "180", rating: "4.7", year: 2023 },
      { name: "Barbie", genre: "Comedy", lang: "English", duration: "114", rating: "4.2", year: 2023 },
      { name: "Mission Impossible 7", genre: "Action", lang: "English", duration: "163", rating: "4.5", year: 2023 },
      { name: "Fast X", genre: "Action", lang: "English", duration: "141", rating: "3.9", year: 2023 },
      { name: "Guardians Galaxy 3", genre: "Sci-Fi", lang: "English", duration: "150", rating: "4.6", year: 2023 },
      { name: "Spider-Man Across", genre: "Sci-Fi", lang: "English", duration: "140", rating: "4.7", year: 2023 },
      { name: "Bholaa", genre: "Action", lang: "Hindi", duration: "144", rating: "3.7", year: 2023 },
      { name: "Tu Jhoothi Main Makkaar", genre: "Romance", lang: "Hindi", duration: "159", rating: "3.5", year: 2023 },
      { name: "Shehzada", genre: "Action", lang: "Hindi", duration: "142", rating: "3.2", year: 2023 },
      { name: "Mrs Chatterjee vs Norway", genre: "Drama", lang: "Hindi", duration: "133", rating: "4.1", year: 2023 },
      { name: "Zara Hatke Zara Bachke", genre: "Comedy", lang: "Hindi", duration: "132", rating: "3.8", year: 2023 },
      { name: "Adipurush", genre: "Action", lang: "Hindi", duration: "179", rating: "2.9", year: 2023 },
      { name: "The Kerala Story", genre: "Drama", lang: "Hindi", duration: "138", rating: "4.0", year: 2023 },
      { name: "Bawaal", genre: "Romance", lang: "Hindi", duration: "132", rating: "3.7", year: 2023 },
      { name: "The Nun II", genre: "Horror", lang: "English", duration: "110", rating: "3.8", year: 2023 },
      { name: "Equalizer 3", genre: "Action", lang: "English", duration: "109", rating: "4.1", year: 2023 },
      { name: "Fukrey 3", genre: "Comedy", lang: "Hindi", duration: "147", rating: "3.6", year: 2023 },
      { name: "Tiger 3", genre: "Action", lang: "Hindi", duration: "155", rating: "4.0", year: 2023 },
      { name: "Sam Bahadur", genre: "Drama", lang: "Hindi", duration: "150", rating: "4.3", year: 2023 },
      { name: "Aquaman 2", genre: "Sci-Fi", lang: "English", duration: "124", rating: "3.9", year: 2023 },
    ];

    moviesData.forEach((movie, idx) => {
      const movieId = `movie-${idx + 1}`;
      const releaseDate = new Date();
      releaseDate.setDate(releaseDate.getDate() - Math.floor(Math.random() * 60));
      const movieData: Movie = {
        id: movieId,
        title: movie.name,
        description: `${movie.name} is an exciting ${movie.genre.toLowerCase()} film that will keep you on the edge of your seat.`,
        genre: movie.genre,
        language: movie.lang,
        duration: movie.duration,
        releaseDate: releaseDate.toISOString().split('T')[0],
        rating: movie.rating,
        censorRating: movie.genre === "Horror" ? "A" : "UA",
        cast: ["Actor 1", "Actor 2", "Actor 3"],
        director: "Director Name",
        trailer: `https://youtube.com/trailer-${idx}`,
        poster: `/movies/${movieId}-poster.jpg`,
        images: [`/movies/${movieId}-1.jpg`, `/movies/${movieId}-2.jpg`],
        isActive: 1,
        createdAt: new Date(),
      };
      this.movies.set(movieData.id, movieData);
    });

    // Theaters
    const theatersData = [
      { name: "PVR Phoenix", city: "Mumbai", screens: 8 },
      { name: "INOX R City", city: "Mumbai", screens: 6 },
      { name: "Cinepolis Viviana", city: "Mumbai", screens: 7 },
      { name: "PVR Select City", city: "Delhi", screens: 11 },
      { name: "INOX Nehru Place", city: "Delhi", screens: 4 },
      { name: "Cinepolis DLF Place", city: "Delhi", screens: 9 },
      { name: "PVR Forum Mall", city: "Bangalore", screens: 7 },
      { name: "INOX Garuda Mall", city: "Bangalore", screens: 5 },
      { name: "Cinepolis Mantri Square", city: "Bangalore", screens: 6 },
      { name: "PVR Express Avenue", city: "Chennai", screens: 8 },
      { name: "INOX Citi Centre", city: "Chennai", screens: 5 },
      { name: "AGS Cinemas", city: "Chennai", screens: 4 },
      { name: "PVR Inorbit", city: "Hyderabad", screens: 7 },
      { name: "INOX GVK One", city: "Hyderabad", screens: 6 },
      { name: "Asian GPR", city: "Hyderabad", screens: 5 },
    ];

    theatersData.forEach((theater, idx) => {
      const theaterId = `theater-${idx + 1}`;
      const theaterData: Theater = {
        id: theaterId,
        name: theater.name,
        location: theater.city,
        city: theater.city,
        address: `${theater.name}, ${theater.city}, India`,
        latitude: "0.0",
        longitude: "0.0",
        totalScreens: theater.screens,
        amenities: ["Parking", "Food Court", "Wheelchair Access", "3D"],
        phone: `+91-${7000000000 + idx}`,
        email: `info@${theater.name.toLowerCase().replace(/\s+/g, '')}.com`,
        isActive: 1,
        createdAt: new Date(),
      };
      this.theaters.set(theaterData.id, theaterData);

      // Add showtimes for each theater-movie combination
      const movieSample = moviesData.slice(idx * 2, idx * 2 + 5);
      movieSample.forEach((movie, movieIdx) => {
        const showDate = new Date();
        showDate.setDate(showDate.getDate() + 1);
        const times = ["10:00", "13:30", "17:00", "20:30"];
        times.forEach((time, timeIdx) => {
          const showtimeId = `showtime-${idx}-${movieIdx}-${timeIdx}`;
          const showtime: MovieShowtime = {
            id: showtimeId,
            movieId: `movie-${idx * 2 + movieIdx + 1}`,
            theaterId: theaterId,
            screenNumber: (timeIdx % theater.screens) + 1,
            showDate: showDate.toISOString().split('T')[0],
            showTime: time,
            language: movie.lang,
            format: timeIdx % 2 === 0 ? "2D" : "3D",
            pricing: JSON.stringify({
              normal: timeIdx % 2 === 0 ? 200 : 350,
              premium: timeIdx % 2 === 0 ? 350 : 500,
              recliner: 600
            }),
            availableSeats: 150 - Math.floor(Math.random() * 80),
            totalSeats: 150,
            isActive: 1,
            createdAt: new Date(),
          };
          this.movieShowtimes.set(showtimeId, showtime);
        });
      });
    });

    // ========== MARKET DATA (INVESTMENTS) ==========

    // 50+ Stocks (NIFTY 50 + popular stocks)
    const stocksData = [
      { symbol: "RELIANCE", name: "Reliance Industries", price: 2680, change: 2.3, sector: "Energy" },
      { symbol: "TCS", name: "Tata Consultancy Services", price: 3750, change: 1.2, sector: "IT" },
      { symbol: "INFY", name: "Infosys", price: 1680, change: -0.5, sector: "IT" },
      { symbol: "HDFCBANK", name: "HDFC Bank", price: 1650, change: 0.8, sector: "Banking" },
      { symbol: "ICICIBANK", name: "ICICI Bank", price: 980, change: 1.5, sector: "Banking" },
      { symbol: "SBIN", name: "State Bank of India", price: 620, change: 2.1, sector: "Banking" },
      { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1150, change: 0.9, sector: "Telecom" },
      { symbol: "ITC", name: "ITC Limited", price: 465, change: -0.3, sector: "FMCG" },
      { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2450, change: 0.5, sector: "FMCG" },
      { symbol: "LT", name: "Larsen & Toubro", price: 3380, change: 1.8, sector: "Infrastructure" },
      { symbol: "WIPRO", name: "Wipro", price: 450, change: -0.8, sector: "IT" },
      { symbol: "HCLTECH", name: "HCL Technologies", price: 1520, change: 0.6, sector: "IT" },
      { symbol: "MARUTI", name: "Maruti Suzuki", price: 11200, change: 1.4, sector: "Auto" },
      { symbol: "TATAMOTORS", name: "Tata Motors", price: 780, change: 2.5, sector: "Auto" },
      { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7100, change: 1.1, sector: "Finance" },
      { symbol: "AXISBANK", name: "Axis Bank", price: 1080, change: 0.7, sector: "Banking" },
      { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1820, change: 0.4, sector: "Banking" },
      { symbol: "ASIANPAINT", name: "Asian Paints", price: 3280, change: -0.2, sector: "Paints" },
      { symbol: "SUNPHARMA", name: "Sun Pharma", price: 1450, change: 0.9, sector: "Pharma" },
      { symbol: "TITAN", name: "Titan Company", price: 3420, change: 1.6, sector: "Retail" },
      { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 9200, change: 0.8, sector: "Cement" },
      { symbol: "NESTLEIND", name: "Nestle India", price: 24500, change: 0.3, sector: "FMCG" },
      { symbol: "ADANIENT", name: "Adani Enterprises", price: 2850, change: 3.2, sector: "Diversified" },
      { symbol: "ADANIPORTS", name: "Adani Ports", price: 1280, change: 2.1, sector: "Infrastructure" },
      { symbol: "ONGC", name: "Oil and Natural Gas Corp", price: 245, change: 1.2, sector: "Energy" },
      { symbol: "NTPC", name: "NTPC", price: 335, change: 0.6, sector: "Power" },
      { symbol: "POWERGRID", name: "Power Grid Corp", price: 285, change: 0.4, sector: "Power" },
      { symbol: "M&M", name: "Mahindra & Mahindra", price: 1850, change: 1.9, sector: "Auto" },
      { symbol: "TECHM", name: "Tech Mahindra", price: 1280, change: -0.4, sector: "IT" },
      { symbol: "DRREDDY", name: "Dr Reddy's Labs", price: 5680, change: 0.7, sector: "Pharma" },
      { symbol: "CIPLA", name: "Cipla", price: 1420, change: 0.5, sector: "Pharma" },
      { symbol: "DIVISLAB", name: "Divi's Laboratories", price: 3880, change: -0.3, sector: "Pharma" },
      { symbol: "BRITANNIA", name: "Britannia Industries", price: 4920, change: 0.6, sector: "FMCG" },
      { symbol: "EICHERMOT", name: "Eicher Motors", price: 4150, change: 1.3, sector: "Auto" },
      { symbol: "HEROMOTOCO", name: "Hero MotoCorp", price: 4380, change: 0.8, sector: "Auto" },
      { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", price: 8650, change: 1.1, sector: "Auto" },
      { symbol: "GRASIM", name: "Grasim Industries", price: 2150, change: 0.9, sector: "Cement" },
      { symbol: "BPCL", name: "Bharat Petroleum", price: 595, change: 1.5, sector: "Energy" },
      { symbol: "HINDALCO", name: "Hindalco Industries", price: 645, change: 2.0, sector: "Metals" },
      { symbol: "TATASTEEL", name: "Tata Steel", price: 145, change: 1.8, sector: "Metals" },
      { symbol: "JSWSTEEL", name: "JSW Steel", price: 880, change: 1.4, sector: "Metals" },
      { symbol: "INDUSINDBK", name: "IndusInd Bank", price: 1450, change: 0.7, sector: "Banking" },
      { symbol: "COALINDIA", name: "Coal India", price: 425, change: 0.5, sector: "Mining" },
      { symbol: "APOLLOHOSP", name: "Apollo Hospitals", price: 6280, change: 0.9, sector: "Healthcare" },
      { symbol: "SHREECEM", name: "Shree Cement", price: 27500, change: 0.3, sector: "Cement" },
      { symbol: "TATACONSUM", name: "Tata Consumer Products", price: 1080, change: 0.6, sector: "FMCG" },
      { symbol: "VEDL", name: "Vedanta", price: 385, change: 2.2, sector: "Mining" },
      { symbol: "SBILIFE", name: "SBI Life Insurance", price: 1580, change: 1.0, sector: "Insurance" },
      { symbol: "HDFCLIFE", name: "HDFC Life Insurance", price: 650, change: 0.8, sector: "Insurance" },
      { symbol: "BAJAJFINSV", name: "Bajaj Finserv", price: 1650, change: 1.2, sector: "Finance" },
      { symbol: "ZOMATO", name: "Zomato", price: 185, change: 3.5, sector: "Tech" },
    ];

    stocksData.forEach((stock, idx) => {
      const stockId = `stock-${idx + 1}`;
      const high = stock.price + Math.floor(Math.random() * 50);
      const low = stock.price - Math.floor(Math.random() * 50);
      const marketData: MarketData = {
        id: stockId,
        symbol: stock.symbol,
        name: stock.name,
        assetType: "stock",
        currentPrice: `${stock.price}.00`,
        openPrice: `${stock.price - 10}.00`,
        closePrice: `${stock.price - 5}.00`,
        highPrice: `${high}.00`,
        lowPrice: `${low}.00`,
        change: `${stock.change}.00`,
        changePercent: `${stock.change}`,
        volume: `${100000 + Math.floor(Math.random() * 500000)}`,
        marketCap: `${stock.price * 100000000}`,
        sector: stock.sector,
        exchange: "NSE",
        currency: "INR",
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      this.marketData.set(stockId, marketData);
    });

    // 30+ Mutual Funds
    const mutualFundsData = [
      { name: "SBI Bluechip Fund", nav: 68.50, returns1Y: 12.5, returns3Y: 15.2, risk: "medium", category: "Large Cap" },
      { name: "HDFC Top 100 Fund", nav: 825.30, returns1Y: 13.8, returns3Y: 16.1, risk: "medium", category: "Large Cap" },
      { name: "ICICI Prudential Bluechip", nav: 92.40, returns1Y: 12.9, returns3Y: 15.8, risk: "medium", category: "Large Cap" },
      { name: "Axis Bluechip Fund", nav: 52.80, returns1Y: 14.2, returns3Y: 16.5, risk: "medium", category: "Large Cap" },
      { name: "Mirae Asset Large Cap", nav: 86.70, returns1Y: 13.5, returns3Y: 16.3, risk: "medium", category: "Large Cap" },
      { name: "HDFC Mid Cap Opportunities", nav: 142.60, returns1Y: 18.5, returns3Y: 20.2, risk: "high", category: "Mid Cap" },
      { name: "Kotak Emerging Equity", nav: 72.50, returns1Y: 17.2, returns3Y: 19.5, risk: "high", category: "Mid Cap" },
      { name: "Axis Midcap Fund", nav: 68.90, returns1Y: 16.8, returns3Y: 18.9, risk: "high", category: "Mid Cap" },
      { name: "DSP Midcap Fund", nav: 95.30, returns1Y: 17.5, returns3Y: 19.8, risk: "high", category: "Mid Cap" },
      { name: "Nippon India Small Cap", nav: 108.20, returns1Y: 22.5, returns3Y: 24.8, risk: "high", category: "Small Cap" },
      { name: "SBI Small Cap Fund", nav: 145.80, returns1Y: 21.2, returns3Y: 23.5, risk: "high", category: "Small Cap" },
      { name: "Axis Small Cap Fund", nav: 78.40, returns1Y: 23.1, returns3Y: 25.2, risk: "high", category: "Small Cap" },
      { name: "HDFC Balanced Advantage", nav: 425.60, returns1Y: 11.2, returns3Y: 13.5, risk: "medium", category: "Hybrid" },
      { name: "ICICI Prudential Balanced Advantage", nav: 52.30, returns1Y: 10.8, returns3Y: 13.2, risk: "medium", category: "Hybrid" },
      { name: "SBI Equity Hybrid Fund", nav: 198.50, returns1Y: 11.5, returns3Y: 13.8, risk: "medium", category: "Hybrid" },
      { name: "HDFC Flexi Cap Fund", nav: 98.70, returns1Y: 15.2, returns3Y: 17.5, risk: "medium", category: "Flexi Cap" },
      { name: "Parag Parikh Flexi Cap", nav: 68.90, returns1Y: 16.8, returns3Y: 18.9, risk: "medium", category: "Flexi Cap" },
      { name: "UTI Flexi Cap Fund", nav: 245.30, returns1Y: 14.5, returns3Y: 16.8, risk: "medium", category: "Flexi Cap" },
      { name: "Franklin India Focused Equity", nav: 128.60, returns1Y: 15.8, returns3Y: 17.2, risk: "medium", category: "Focused" },
      { name: "SBI Focused Equity Fund", nav: 245.90, returns1Y: 16.2, returns3Y: 18.1, risk: "medium", category: "Focused" },
      { name: "HDFC Tax Saver (ELSS)", nav: 1250.40, returns1Y: 13.5, returns3Y: 15.8, risk: "medium", category: "ELSS" },
      { name: "Axis Long Term Equity (ELSS)", nav: 88.70, returns1Y: 14.2, returns3Y: 16.5, risk: "medium", category: "ELSS" },
      { name: "Mirae Asset Tax Saver (ELSS)", nav: 32.50, returns1Y: 15.1, returns3Y: 17.2, risk: "medium", category: "ELSS" },
      { name: "ICICI Prudential Technology", nav: 145.30, returns1Y: 20.5, returns3Y: 22.8, risk: "high", category: "Sector" },
      { name: "SBI Banking & Financial Services", nav: 28.60, returns1Y: 18.2, returns3Y: 20.5, risk: "high", category: "Sector" },
      { name: "HDFC Pharma & Healthcare", nav: 485.70, returns1Y: 16.8, returns3Y: 18.2, risk: "medium", category: "Sector" },
      { name: "Nippon India Index Nifty 50", nav: 325.80, returns1Y: 12.8, returns3Y: 15.2, risk: "low", category: "Index" },
      { name: "UTI Nifty Index Fund", nav: 142.50, returns1Y: 12.5, returns3Y: 15.0, risk: "low", category: "Index" },
      { name: "HDFC Index Sensex", nav: 825.60, returns1Y: 12.9, returns3Y: 15.3, risk: "low", category: "Index" },
      { name: "Franklin India Debt Hybrid", nav: 68.30, returns1Y: 8.5, returns3Y: 9.2, risk: "low", category: "Debt Hybrid" },
      { name: "ICICI Prudential Short Term", nav: 52.80, returns1Y: 7.2, returns3Y: 7.8, risk: "low", category: "Debt" },
    ];

    mutualFundsData.forEach((mf, idx) => {
      const mfId = `mf-${idx + 1}`;
      const fundCode = `MF${100 + idx}${mf.name.slice(0,3).toUpperCase()}`;
      const mutualFund: MutualFund = {
        id: mfId,
        fundCode: fundCode,
        fundName: mf.name,
        fundHouse: mf.name.split(' ')[0],
        fundType: "Growth",
        category: mf.category,
        nav: `${mf.nav}`,
        minInvestment: `${mf.category === "Small Cap" ? 5000 : 1000}.00`,
        sipMinAmount: `${mf.category === "Small Cap" ? 1000 : 500}.00`,
        exitLoad: "1.00",
        expenseRatio: `${0.5 + Math.random()}`,
        returns1Y: `${mf.returns1Y}`,
        returns3Y: `${mf.returns3Y}`,
        returns5Y: `${mf.returns3Y + 2}`,
        riskLevel: mf.risk,
        description: `${mf.name} aims to provide long-term capital appreciation`,
        isActive: 1,
        createdAt: new Date(),
      };
      this.mutualFunds.set(mutualFund.id, mutualFund);
    });

    // 20+ SIP Plans
    const sipPlansData = [
      { fundName: "SBI Bluechip Fund", amount: 1000, frequency: "monthly" },
      { fundName: "HDFC Top 100 Fund", amount: 1500, frequency: "monthly" },
      { fundName: "ICICI Prudential Bluechip", amount: 2000, frequency: "monthly" },
      { fundName: "Axis Bluechip Fund", amount: 1000, frequency: "monthly" },
      { fundName: "HDFC Mid Cap Opportunities", amount: 2500, frequency: "monthly" },
      { fundName: "Kotak Emerging Equity", amount: 2000, frequency: "monthly" },
      { fundName: "Axis Midcap Fund", amount: 3000, frequency: "monthly" },
      { fundName: "Nippon India Small Cap", amount: 3500, frequency: "monthly" },
      { fundName: "SBI Small Cap Fund", amount: 2000, frequency: "quarterly" },
      { fundName: "HDFC Balanced Advantage", amount: 1500, frequency: "monthly" },
      { fundName: "ICICI Prudential Balanced Advantage", amount: 1000, frequency: "monthly" },
      { fundName: "HDFC Flexi Cap Fund", amount: 2000, frequency: "monthly" },
      { fundName: "Parag Parikh Flexi Cap", amount: 2500, frequency: "monthly" },
      { fundName: "HDFC Tax Saver (ELSS)", amount: 1500, frequency: "monthly" },
      { fundName: "Axis Long Term Equity (ELSS)", amount: 2000, frequency: "monthly" },
      { fundName: "Mirae Asset Tax Saver (ELSS)", amount: 1000, frequency: "monthly" },
      { fundName: "ICICI Prudential Technology", amount: 3000, frequency: "monthly" },
      { fundName: "SBI Banking & Financial Services", amount: 2000, frequency: "monthly" },
      { fundName: "Nippon India Index Nifty 50", amount: 1000, frequency: "monthly" },
      { fundName: "UTI Nifty Index Fund", amount: 500, frequency: "weekly" },
    ];

    sipPlansData.forEach((sip, idx) => {
      const sipId = `sip-${idx + 1}`;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      const sipInvestment: SipInvestment = {
        id: sipId,
        userId: "user-1",
        fundId: `mf-${idx + 1}`,
        amount: `${sip.amount}.00`,
        frequency: sip.frequency,
        startDate: startDate.toISOString().split('T')[0],
        endDate: null,
        autoDebit: 1,
        bankAccountId: "bank-1",
        status: "active",
        nextInstallmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalInvested: `${sip.amount * 6}.00`,
        currentValue: `${Math.floor(sip.amount * 6 * 1.15)}.00`,
        createdAt: new Date(),
      };
      this.sipInvestments.set(sipInvestment.id, sipInvestment);
    });

    // 10+ Fixed Deposits
    const fdProvidersData = [
      { bank: "HDFC Bank", rate: 7.5, tenure: 12 },
      { bank: "ICICI Bank", rate: 7.3, tenure: 12 },
      { bank: "SBI", rate: 7.1, tenure: 12 },
      { bank: "Axis Bank", rate: 7.4, tenure: 12 },
      { bank: "Kotak Mahindra Bank", rate: 7.2, tenure: 12 },
      { bank: "Yes Bank", rate: 7.8, tenure: 12 },
      { bank: "IDFC First Bank", rate: 7.6, tenure: 12 },
      { bank: "IndusInd Bank", rate: 7.7, tenure: 12 },
      { bank: "Bajaj Finance FD", rate: 8.0, tenure: 12 },
      { bank: "Mahindra Finance FD", rate: 7.9, tenure: 12 },
      { bank: "HDFC Bank", rate: 7.8, tenure: 24 },
      { bank: "SBI", rate: 7.5, tenure: 36 },
    ];

    fdProvidersData.forEach((fd, idx) => {
      const fdId = `fd-${idx + 1}`;
      const marketData: MarketData = {
        id: fdId,
        symbol: `FD-${fd.bank.replace(/\s+/g, '').toUpperCase()}-${fd.tenure}M`,
        name: `${fd.bank} Fixed Deposit ${fd.tenure} Months`,
        assetType: "fixed_deposit",
        currentPrice: `${fd.rate}`,
        openPrice: `${fd.rate}`,
        closePrice: `${fd.rate}`,
        highPrice: `${fd.rate}`,
        lowPrice: `${fd.rate}`,
        change: "0.00",
        changePercent: "0.00",
        volume: "0",
        marketCap: null,
        sector: "Banking",
        exchange: fd.bank,
        currency: "INR",
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      this.marketData.set(fdId, marketData);
    });

    // Crypto, Gold, Silver
    const otherAssets = [
      { symbol: "BTC", name: "Bitcoin", price: 4200000, change: 3.5, type: "crypto" },
      { symbol: "ETH", name: "Ethereum", price: 185000, change: 2.8, type: "crypto" },
      { symbol: "USDT", name: "Tether", price: 83, change: 0.1, type: "crypto" },
      { symbol: "BNB", name: "Binance Coin", price: 35000, change: 1.9, type: "crypto" },
      { symbol: "XRP", name: "Ripple", price: 45, change: -1.2, type: "crypto" },
      { symbol: "GOLD", name: "Gold (per 10g)", price: 62500, change: 0.5, type: "commodity" },
      { symbol: "SILVER", name: "Silver (per kg)", price: 74000, change: 1.2, type: "commodity" },
    ];

    otherAssets.forEach((asset, idx) => {
      const assetId = `asset-${idx + 1}`;
      const marketData: MarketData = {
        id: assetId,
        symbol: asset.symbol,
        name: asset.name,
        assetType: asset.type,
        currentPrice: `${asset.price}.00`,
        openPrice: `${asset.price - 100}.00`,
        closePrice: `${asset.price - 50}.00`,
        highPrice: `${asset.price + 200}.00`,
        lowPrice: `${asset.price - 200}.00`,
        change: `${asset.change}`,
        changePercent: `${asset.change}`,
        volume: `${1000000 + Math.floor(Math.random() * 5000000)}`,
        marketCap: asset.type === "crypto" ? `${asset.price * 10000000}` : null,
        sector: asset.type === "crypto" ? "Cryptocurrency" : "Commodity",
        exchange: asset.type === "crypto" ? "Binance" : "MCX",
        currency: "INR",
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      this.marketData.set(assetId, marketData);
    });

    // ========== INSURANCE POLICIES ==========

    const insurancePoliciesData = [
      { type: "health", provider: "Star Health", name: "Family Floater", premium: 18000, coverage: 500000 },
      { type: "health", provider: "HDFC Ergo", name: "Health Optima", premium: 15000, coverage: 400000 },
      { type: "health", provider: "ICICI Lombard", name: "Complete Health Insurance", premium: 20000, coverage: 600000 },
      { type: "health", provider: "Care Health", name: "Care Advantage", premium: 12000, coverage: 300000 },
      { type: "life", provider: "LIC", name: "Jeevan Anand", premium: 25000, coverage: 2000000 },
      { type: "life", provider: "HDFC Life", name: "Click 2 Protect Plus", premium: 22000, coverage: 1500000 },
      { type: "life", provider: "ICICI Prudential", name: "iProtect Smart", premium: 18000, coverage: 1000000 },
      { type: "life", provider: "SBI Life", name: "eShield", premium: 15000, coverage: 1200000 },
      { type: "motor", provider: "ICICI Lombard", name: "Car Insurance", premium: 8500, coverage: 1000000 },
      { type: "motor", provider: "Bajaj Allianz", name: "Motor Insurance", premium: 9000, coverage: 1200000 },
      { type: "motor", provider: "HDFC Ergo", name: "Two Wheeler Insurance", premium: 2500, coverage: 100000 },
      { type: "motor", provider: "New India Assurance", name: "Motor Insurance", premium: 7500, coverage: 800000 },
      { type: "travel", provider: "HDFC Ergo", name: "Travel Insurance", premium: 1500, coverage: 100000 },
      { type: "travel", provider: "ICICI Lombard", name: "International Travel", premium: 2000, coverage: 200000 },
      { type: "travel", provider: "Bajaj Allianz", name: "Travel Guard", premium: 1800, coverage: 150000 },
    ];

    insurancePoliciesData.forEach((policy, idx) => {
      const policyId = `ins-${idx + 1}`;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      const insurancePolicy: InsurancePolicy = {
        id: policyId,
        userId: "user-1",
        policyType: policy.type,
        provider: policy.provider,
        policyNumber: `POL${1000000 + idx}`,
        policyName: policy.name,
        coverageAmount: `${policy.coverage}.00`,
        premiumAmount: `${policy.premium}.00`,
        premiumFrequency: "annual",
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        nextPremiumDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "active",
        beneficiaries: ["Joshua J Kanatt"],
        documents: [`/documents/${policyId}-policy.pdf`],
        createdAt: new Date(),
      };
      this.insurancePolicies.set(insurancePolicy.id, insurancePolicy);
    });

    // ========== REWARDS ==========

    const rewardsData = [
      { name: "₹100 Cashback on UPI", category: "cashback", points: 500, value: "100" },
      { name: "₹250 Swiggy Voucher", category: "food", points: 1000, value: "250" },
      { name: "₹500 Amazon Gift Card", category: "shopping", points: 2000, value: "500" },
      { name: "₹200 Movie Ticket", category: "entertainment", points: 800, value: "200" },
      { name: "₹300 Flipkart Voucher", category: "shopping", points: 1200, value: "300" },
      { name: "₹150 Zomato Voucher", category: "food", points: 600, value: "150" },
      { name: "₹500 Myntra Gift Card", category: "shopping", points: 2000, value: "500" },
      { name: "₹100 Uber Rides", category: "travel", points: 500, value: "100" },
      { name: "₹200 BookMyShow Voucher", category: "entertainment", points: 800, value: "200" },
      { name: "Free Netflix 1 Month", category: "entertainment", points: 1500, value: "500" },
      { name: "₹1000 Make My Trip", category: "travel", points: 4000, value: "1000" },
      { name: "₹50 Paytm Cashback", category: "cashback", points: 250, value: "50" },
      { name: "₹300 Dominos Voucher", category: "food", points: 1200, value: "300" },
      { name: "₹400 Big Basket Voucher", category: "shopping", points: 1600, value: "400" },
      { name: "₹150 PhonePe Cashback", category: "cashback", points: 600, value: "150" },
      { name: "₹500 Nykaa Gift Card", category: "shopping", points: 2000, value: "500" },
      { name: "₹200 Fassos Voucher", category: "food", points: 800, value: "200" },
      { name: "₹100 Ola Rides", category: "travel", points: 500, value: "100" },
      { name: "₹250 Spotify Premium", category: "entertainment", points: 1000, value: "250" },
      { name: "₹1500 Holiday Package", category: "travel", points: 6000, value: "1500" },
    ];

    rewardsData.forEach((reward, idx) => {
      const rewardId = `reward-${idx + 1}`;
      const rewardData: Reward = {
        id: rewardId,
        name: reward.name,
        description: `Redeem ${reward.name} with your reward points`,
        category: reward.category,
        pointsRequired: reward.points,
        value: reward.value,
        imageUrl: `/rewards/${rewardId}.jpg`,
        termsAndConditions: "Valid for 6 months from redemption date",
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: 1,
        stock: 100 - Math.floor(Math.random() * 50),
        createdAt: new Date(),
      };
      this.rewards.set(rewardData.id, rewardData);
    });

    // ========== BILL PAYMENT SAVED ACCOUNTS ==========

    const billAccountsData = [
      { type: "electricity", provider: "Adani Electricity", number: "123456789012", nickname: "Home Electricity" },
      { type: "electricity", provider: "BSES", number: "987654321098", nickname: "Office Electricity" },
      { type: "water", provider: "Mumbai Municipal Corporation", number: "WTR123456", nickname: "Home Water" },
      { type: "gas", provider: "Indraprastha Gas", number: "GAS987654", nickname: "Home Gas" },
      { type: "gas", provider: "Mahanagar Gas", number: "MGL456789", nickname: "Kitchen Gas" },
      { type: "broadband", provider: "Jio Fiber", number: "JIO123456789", nickname: "Home Internet" },
      { type: "broadband", provider: "Airtel Broadband", number: "AIR987654321", nickname: "Office Internet" },
      { type: "dth", provider: "Tata Sky", number: "TS123456789", nickname: "Living Room DTH" },
      { type: "dth", provider: "Airtel Digital TV", number: "ADT987654321", nickname: "Bedroom DTH" },
      { type: "mobile", provider: "Jio", number: "9876543210", nickname: "Personal Mobile" },
      { type: "mobile", provider: "Airtel", number: "9123456789", nickname: "Work Mobile" },
      { type: "fastag", provider: "ICICI Bank", number: "34161234567890", nickname: "Car FASTag" },
    ];

    billAccountsData.forEach((account, idx) => {
      const accountId = `bill-account-${idx + 1}`;
      const billPayee: BillPayee = {
        id: accountId,
        userId: "user-1",
        serviceType: account.type,
        serviceProvider: account.provider,
        accountNumber: account.number,
        accountHolderName: "Joshua J Kanatt",
        nickname: account.nickname,
        billingCycle: "monthly",
        lastBillAmount: `${500 + Math.floor(Math.random() * 2000)}.00`,
        lastBillDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextBillDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: 1,
        createdAt: new Date(),
      };
      this.billPayees.set(billPayee.id, billPayee);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      name: null,
      email: null,
      dateOfBirth: null,
      gender: null,
      maritalStatus: null,
      pincode: null,
      panCard: null,
      residenceType: null,
      ...insertUser, 
      id, 
      creditScore: 750,
      isVerified: 1,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Auto-create sample Credit UPI accounts for new user
    this.createSampleCreditUpiData(id, insertUser.phone);
    
    // Auto-create sample Family UPI accounts for new user
    this.createSampleFamilyUpiData(id, insertUser.phone, user.name);
    
    return user;
  }
  
  private createSampleCreditUpiData(userId: string, userPhone: string) {
    // Credit UPI Account 1
    const creditAccount1Id = randomUUID();
    const creditAccount1: CreditUpiAccount = {
      id: creditAccount1Id,
      userId,
      upiId: `${userId.slice(0, 8)}.credit@paytm`,
      creditLimit: "100000.00",
      availableLimit: "65000.00",
      usedLimit: "35000.00",
      outstandingAmount: "35000.00",
      interestRate: "24.00",
      annualFee: "499.00",
      processingFee: "1.50",
      latePaymentPenalty: "3.00",
      billingDate: 1,
      dueDate: 16,
      upiPin: "encrypted-pin",
      status: "active",
      isActivated: 1,
      activatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastBillingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.creditUpiAccounts.set(creditAccount1Id, creditAccount1);
    
    // Credit UPI Account 2
    const creditAccount2Id = randomUUID();
    const creditAccount2: CreditUpiAccount = {
      id: creditAccount2Id,
      userId,
      upiId: `${userId.slice(0, 8)}.credit@gpay`,
      creditLimit: "50000.00",
      availableLimit: "42500.00",
      usedLimit: "7500.00",
      outstandingAmount: "7500.00",
      interestRate: "24.00",
      annualFee: "299.00",
      processingFee: "1.50",
      latePaymentPenalty: "3.00",
      billingDate: 5,
      dueDate: 20,
      upiPin: "encrypted-pin",
      status: "active",
      isActivated: 1,
      activatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastBillingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.creditUpiAccounts.set(creditAccount2Id, creditAccount2);
    
    // Sample transactions for account 1
    const transactions1 = [
      { merchant: "Amazon India", upi: "amazon@paytm", amount: "15000.00", category: "shopping", desc: "Shopping - Electronics", days: 20 },
      { merchant: "Swiggy", upi: "swiggy@paytm", amount: "850.00", category: "food", desc: "Food delivery", days: 15 },
      { merchant: "BookMyShow", upi: "bookmyshow@paytm", amount: "1200.00", category: "entertainment", desc: "Movie tickets - 2 tickets", days: 12 },
      { merchant: "Big Bazaar", upi: "bigbazaar@paytm", amount: "4500.00", category: "grocery", desc: "Grocery shopping", days: 8 },
      { merchant: "Myntra", upi: "myntra@paytm", amount: "3450.00", category: "shopping", desc: "Clothing purchase", days: 5 },
      { merchant: "Uber", upi: "uber@paytm", amount: "650.00", category: "transport", desc: "Cab ride", days: 3 },
      { merchant: "Zomato", upi: "zomato@paytm", amount: "1350.00", category: "food", desc: "Food delivery", days: 2 },
      { merchant: "MakeMyTrip", upi: "makemytrip@paytm", amount: "8000.00", category: "travel", desc: "Flight booking - Advance payment", days: 1 },
    ];
    
    let balance = 100000;
    transactions1.forEach((txn, idx) => {
      const balBefore = balance;
      balance -= parseFloat(txn.amount);
      const txnId = randomUUID();
      this.creditUpiTransactions.set(txnId, {
        id: txnId,
        accountId: creditAccount1Id,
        userId,
        transactionType: "payment",
        merchantName: txn.merchant,
        merchantUpi: txn.upi,
        amount: txn.amount,
        status: "success",
        transactionId: `CUPI${Date.now()}${idx}`,
        description: txn.desc,
        category: txn.category,
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: balBefore.toFixed(2),
        balanceAfter: balance.toFixed(2),
        metadata: null,
        createdAt: new Date(Date.now() - txn.days * 24 * 60 * 60 * 1000),
      });
    });
    
    // Sample transactions for account 2
    const transactions2 = [
      { merchant: "Flipkart", upi: "flipkart@gpay", amount: "4500.00", category: "shopping", desc: "Shopping - Books", days: 7 },
      { merchant: "Starbucks", upi: "starbucks@gpay", amount: "850.00", category: "food", desc: "Coffee and snacks", days: 4 },
      { merchant: "Ola", upi: "ola@gpay", amount: "350.00", category: "transport", desc: "Auto ride", days: 3 },
      { merchant: "Netflix", upi: "netflix@gpay", amount: "799.00", category: "entertainment", desc: "Monthly subscription", days: 2 },
      { merchant: "Dominos", upi: "dominos@gpay", amount: "1001.00", category: "food", desc: "Pizza delivery", days: 1 },
    ];
    
    let balance2 = 50000;
    transactions2.forEach((txn, idx) => {
      const balBefore = balance2;
      balance2 -= parseFloat(txn.amount);
      const txnId = randomUUID();
      this.creditUpiTransactions.set(txnId, {
        id: txnId,
        accountId: creditAccount2Id,
        userId,
        transactionType: "payment",
        merchantName: txn.merchant,
        merchantUpi: txn.upi,
        amount: txn.amount,
        status: "success",
        transactionId: `CUPI${Date.now()}${idx + 100}`,
        description: txn.desc,
        category: txn.category,
        emiConverted: 0,
        emiMonths: null,
        balanceBefore: balBefore.toFixed(2),
        balanceAfter: balance2.toFixed(2),
        metadata: null,
        createdAt: new Date(Date.now() - txn.days * 24 * 60 * 60 * 1000),
      });
    });
  }
  
  private createSampleFamilyUpiData(userId: string, userPhone: string, userName: string | null) {
    // Family UPI Account 1
    const familyAccount1Id = randomUUID();
    const familyAccount1: FamilyUpiAccount = {
      id: familyAccount1Id,
      userId,
      familyName: "My Family Account",
      upiId: `family${userId.slice(0, 6)}@paytm`,
      bankName: "HDFC Bank",
      accountNumber: "****1234",
      ifscCode: "HDFC0001234",
      memberCount: 4,
      monthlyLimit: "500000.00",
      dailyLimit: "100000.00",
      totalSpent: "45500.00",
      availableBalance: "350000.00",
      isActive: 1,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.familyUpiAccounts.set(familyAccount1Id, familyAccount1);
    
    // Family UPI Account 2
    const familyAccount2Id = randomUUID();
    const familyAccount2: FamilyUpiAccount = {
      id: familyAccount2Id,
      userId,
      familyName: "Joint Savings Account",
      upiId: `joint${userId.slice(0, 6)}@gpay`,
      bankName: "ICICI Bank",
      accountNumber: "****5678",
      ifscCode: "ICIC0005678",
      memberCount: 3,
      monthlyLimit: "300000.00",
      dailyLimit: "50000.00",
      totalSpent: "28750.00",
      availableBalance: "220000.00",
      isActive: 1,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.familyUpiAccounts.set(familyAccount2Id, familyAccount2);
    
    // Create members for Family Account 1
    const member1Id = randomUUID();
    const member1: FamilyUpiMember = {
      id: member1Id,
      familyAccountId: familyAccount1Id,
      memberId: userId,
      memberName: userName || "You",
      memberPhone: userPhone,
      relationship: "owner",
      role: "owner",
      spendingLimit: "100000.00",
      canApprove: 1,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member1Id, member1);
    
    const member2Id = randomUUID();
    const member2: FamilyUpiMember = {
      id: member2Id,
      familyAccountId: familyAccount1Id,
      memberId: null,
      memberName: "Sarah",
      memberPhone: "9876543210",
      relationship: "spouse",
      role: "admin",
      spendingLimit: "80000.00",
      canApprove: 1,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member2Id, member2);
    
    const member3Id = randomUUID();
    const member3: FamilyUpiMember = {
      id: member3Id,
      familyAccountId: familyAccount1Id,
      memberId: null,
      memberName: "David",
      memberPhone: "9988776655",
      relationship: "child",
      role: "member",
      spendingLimit: "20000.00",
      canApprove: 0,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member3Id, member3);
    
    const member4Id = randomUUID();
    const member4: FamilyUpiMember = {
      id: member4Id,
      familyAccountId: familyAccount1Id,
      memberId: null,
      memberName: "Emma",
      memberPhone: "8899001122",
      relationship: "child",
      role: "member",
      spendingLimit: "15000.00",
      canApprove: 0,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member4Id, member4);
    
    // Create members for Family Account 2
    const member5Id = randomUUID();
    const member5: FamilyUpiMember = {
      id: member5Id,
      familyAccountId: familyAccount2Id,
      memberId: userId,
      memberName: userName || "You",
      memberPhone: userPhone,
      relationship: "owner",
      role: "owner",
      spendingLimit: "50000.00",
      canApprove: 1,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member5Id, member5);
    
    const member6Id = randomUUID();
    const member6: FamilyUpiMember = {
      id: member6Id,
      familyAccountId: familyAccount2Id,
      memberId: null,
      memberName: "Michael",
      memberPhone: "7766554433",
      relationship: "sibling",
      role: "admin",
      spendingLimit: "40000.00",
      canApprove: 1,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member6Id, member6);
    
    const member7Id = randomUUID();
    const member7: FamilyUpiMember = {
      id: member7Id,
      familyAccountId: familyAccount2Id,
      memberId: null,
      memberName: "Lisa",
      memberPhone: "6655443322",
      relationship: "other",
      role: "member",
      spendingLimit: "25000.00",
      canApprove: 0,
      canView: 1,
      isActive: 1,
      joinedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    };
    this.familyUpiMembers.set(member7Id, member7);
    
    // Create transactions for Family Account 1
    const familyTxns1 = [
      { initiator: member1Id, amount: "5000.00", type: "payment", desc: "Monthly groceries", days: 25 },
      { initiator: member2Id, amount: "3500.00", type: "payment", desc: "Electricity bill payment", days: 22 },
      { initiator: member3Id, amount: "1200.00", type: "payment", desc: "School supplies", days: 20 },
      { initiator: member4Id, amount: "850.00", type: "payment", desc: "Art supplies", days: 18 },
      { initiator: member1Id, amount: "12000.00", type: "transfer", desc: "House rent payment", days: 15 },
      { initiator: member2Id, amount: "2500.00", type: "payment", desc: "Internet bill", days: 12 },
      { initiator: member3Id, amount: "1800.00", type: "payment", desc: "Sports equipment", days: 10 },
      { initiator: member2Id, amount: "6500.00", type: "bill", desc: "Monthly medical expenses", days: 8 },
      { initiator: member4Id, amount: "950.00", type: "payment", desc: "Music lessons", days: 6 },
      { initiator: member1Id, amount: "8500.00", type: "payment", desc: "Family dinner - Restaurant", days: 4 },
      { initiator: member3Id, amount: "1700.00", type: "payment", desc: "Movie tickets - Family", days: 3 },
    ];
    
    familyTxns1.forEach((txn, idx) => {
      const txnId = randomUUID();
      this.familyUpiTransactions.set(txnId, {
        id: txnId,
        familyAccountId: familyAccount1Id,
        initiatedBy: txn.initiator,
        upiTransactionId: null,
        amount: txn.amount,
        transactionType: txn.type,
        description: txn.desc,
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - txn.days * 24 * 60 * 60 * 1000),
      });
    });
    
    // Create transactions for Family Account 2
    const familyTxns2 = [
      { initiator: member5Id, amount: "8000.00", type: "payment", desc: "Investment contribution", days: 20 },
      { initiator: member6Id, amount: "6500.00", type: "payment", desc: "Emergency fund transfer", days: 15 },
      { initiator: member7Id, amount: "3250.00", type: "payment", desc: "Shared house maintenance", days: 12 },
      { initiator: member5Id, amount: "5500.00", type: "bill", desc: "Shared utility bills", days: 8 },
      { initiator: member6Id, amount: "2750.00", type: "payment", desc: "Insurance premium split", days: 5 },
      { initiator: member7Id, amount: "2750.00", type: "payment", desc: "Shared subscription services", days: 2 },
    ];
    
    familyTxns2.forEach((txn, idx) => {
      const txnId = randomUUID();
      this.familyUpiTransactions.set(txnId, {
        id: txnId,
        familyAccountId: familyAccount2Id,
        initiatedBy: txn.initiator,
        upiTransactionId: null,
        amount: txn.amount,
        transactionType: txn.type,
        description: txn.desc,
        status: "success",
        requiresApproval: 0,
        approvedBy: null,
        createdAt: new Date(Date.now() - txn.days * 24 * 60 * 60 * 1000),
      });
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLoanApplication(id: string): Promise<LoanApplication | undefined> {
    return this.loanApplications.get(id);
  }

  async getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values())
      .filter(loan => loan.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const id = randomUUID();
    const applicationNumber = `PL-${Date.now()}`;
    const application: LoanApplication = {
      purpose: null,
      approvedAmount: null,
      disbursedAmount: null,
      outstandingAmount: null,
      nextEmiDate: null,
      ...insertApplication,
      id,
      applicationNumber,
      status: "pending",
      totalPaid: "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.loanApplications.set(id, application);
    return application;
  }

  async updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined> {
    const existing = this.loanApplications.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.loanApplications.set(id, updated);
    return updated;
  }

  async getEmiPaymentsByLoan(loanId: string): Promise<EmiPayment[]> {
    return Array.from(this.emiPayments.values())
      .filter(payment => payment.loanId === loanId)
      .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime());
  }

  async createEmiPayment(insertPayment: InsertEmiPayment): Promise<EmiPayment> {
    const id = randomUUID();
    const payment: EmiPayment = {
      status: "completed",
      ...insertPayment,
      id,
      paymentDate: new Date(),
      transactionId: `TXN${Date.now()}`,
    };
    this.emiPayments.set(id, payment);
    return payment;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      metadata: {},
      ...insertNotification,
      id,
      isRead: 0,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = 1;
      this.notifications.set(id, notification);
    }
  }

  // OTP operations
  async createOtp(otp: InsertOtp): Promise<Otp> {
    const id = randomUUID();
    const newOtp: Otp = {
      id,
      phone: otp.phone,
      code: otp.code,
      expiresAt: otp.expiresAt,
      isUsed: otp.isUsed || 0,
      attempts: otp.attempts || 0,
      createdAt: new Date(),
    };
    this.otps.set(id, newOtp);
    return newOtp;
  }

  async getOtpByPhone(phone: string): Promise<Otp | undefined> {
    // Get the most recent non-expired, non-used OTP for this phone
    const phoneOtps = Array.from(this.otps.values())
      .filter(otp => otp.phone === phone && otp.isUsed === 0 && otp.expiresAt > new Date())
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
    
    return phoneOtps[0];
  }

  async getValidOtpByPhoneAndCode(phone: string, code: string): Promise<Otp | undefined> {
    const otp = Array.from(this.otps.values())
      .find(otp => 
        otp.phone === phone && 
        otp.code === code && 
        otp.isUsed === 0 && 
        otp.expiresAt > new Date() &&
        (otp.attempts || 0) < 3
      );
    
    return otp;
  }

  async markOtpAsUsed(id: string): Promise<void> {
    const otp = this.otps.get(id);
    if (otp) {
      otp.isUsed = 1;
      this.otps.set(id, otp);
    }
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    const otp = this.otps.get(id);
    if (otp) {
      otp.attempts = (otp.attempts || 0) + 1;
      this.otps.set(id, otp);
    }
  }

  async cleanupExpiredOtps(): Promise<void> {
    const now = new Date();
    const expiredIds: string[] = [];
    
    for (const [id, otp] of Array.from(this.otps.entries())) {
      if (otp.expiresAt <= now) {
        expiredIds.push(id);
      }
    }
    
    for (const id of expiredIds) {
      this.otps.delete(id);
    }
  }

  // Loan marketplace operations
  async getLoanOffers(filters?: { loanType?: string; minAmount?: number; maxAmount?: number }): Promise<LoanOffer[]> {
    let offers = Array.from(this.loanOffers.values());
    
    if (filters?.loanType) {
      offers = offers.filter(offer => offer.loanType === filters.loanType);
    }
    if (filters?.minAmount) {
      offers = offers.filter(offer => parseFloat(offer.maxAmount) >= filters.minAmount!);
    }
    if (filters?.maxAmount) {
      offers = offers.filter(offer => parseFloat(offer.minAmount) <= filters.maxAmount!);
    }

    // Sort by trust badge priority (diamond > gold > silver > bronze), then by interest rate
    const badgePriority = { diamond: 4, gold: 3, silver: 2, bronze: 1 };
    return offers.sort((a, b) => {
      const priorityDiff = (badgePriority[b.trustBadge as keyof typeof badgePriority] || 0) - 
                          (badgePriority[a.trustBadge as keyof typeof badgePriority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return parseFloat(a.interestRate) - parseFloat(b.interestRate);
    });
  }

  async getLoanOffer(id: string): Promise<LoanOffer | undefined> {
    return this.loanOffers.get(id);
  }

  async createLoanOffer(insertOffer: InsertLoanOffer): Promise<LoanOffer> {
    const id = randomUUID();
    const offer: LoanOffer = {
      processingFee: null,
      approvalSpeed: "24 hours",
      requiredDocs: null,
      eligibilityCriteria: null,
      trustBadge: "bronze",
      isSponsored: 0,
      isSuperPayBacked: 0,
      ...insertOffer,
      id,
      createdAt: new Date(),
    };
    this.loanOffers.set(id, offer);
    return offer;
  }

  // Financial report operations
  async getUserFinancialReport(userId: string): Promise<UserFinancialReport | undefined> {
    return Array.from(this.userFinancialReports.values()).find(report => report.userId === userId);
  }

  async createUserFinancialReport(insertReport: InsertUserFinancialReport): Promise<UserFinancialReport> {
    const id = randomUUID();
    const report: UserFinancialReport = {
      subscriptionTier: "free",
      creditScore: null,
      eligibilityScore: null,
      debtToIncomeRatio: null,
      totalDebt: null,
      monthlyIncome: null,
      improvementActions: null,
      projectedScoreChanges: null,
      ...insertReport,
      id,
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    this.userFinancialReports.set(insertReport.userId, report);
    return report;
  }

  async updateUserFinancialReport(userId: string, updates: Partial<UserFinancialReport>): Promise<UserFinancialReport | undefined> {
    const existing = Array.from(this.userFinancialReports.values()).find(report => report.userId === userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.userFinancialReports.set(userId, updated);
    return updated;
  }

  // Security scan operations
  async getSecurityScansByUser(userId: string): Promise<SecurityScan[]> {
    return Array.from(this.securityScans.values())
      .filter(scan => scan.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createSecurityScan(insertScan: InsertSecurityScan): Promise<SecurityScan> {
    const id = randomUUID();
    const scan: SecurityScan = {
      evidenceFound: null,
      recommendedAction: null,
      isReported: 0,
      ...insertScan,
      id,
      createdAt: new Date(),
    };
    this.securityScans.set(id, scan);
    return scan;
  }

  // Coach interaction operations
  async getCoachInteractionsByUser(userId: string): Promise<CoachInteraction[]> {
    return Array.from(this.coachInteractions.values())
      .filter(interaction => interaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createCoachInteraction(insertInteraction: InsertCoachInteraction): Promise<CoachInteraction> {
    const id = randomUUID();
    const interaction: CoachInteraction = {
      context: null,
      confidenceLevel: "medium",
      actionsSuggested: null,
      isSaved: 0,
      ...insertInteraction,
      id,
      createdAt: new Date(),
    };
    this.coachInteractions.set(id, interaction);
    return interaction;
  }

  // Learning content operations
  async getLearningContent(filters?: { contentType?: string; tags?: string[] }): Promise<LearningContent[]> {
    let content = Array.from(this.learningContent.values());
    
    if (filters?.contentType) {
      content = content.filter(item => item.contentType === filters.contentType);
    }
    if (filters?.tags && filters.tags.length > 0) {
      content = content.filter(item => {
        const itemTags = item.tags as string[] || [];
        return filters.tags!.some(tag => itemTags.includes(tag));
      });
    }

    return content.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getLearningContentById(id: string): Promise<LearningContent | undefined> {
    return this.learningContent.get(id);
  }

  // Fitness and points operations
  async getUserPoints(userId: string): Promise<UserPoints | undefined> {
    return Array.from(this.userPoints.values()).find(points => points.userId === userId);
  }

  async createUserPoints(insertPoints: InsertUserPoints): Promise<UserPoints> {
    const id = randomUUID();
    const points: UserPoints = {
      totalPoints: 0,
      availablePoints: 0,
      pointsEarned: 0,
      pointsSpent: 0,
      ...insertPoints,
      id,
      lastActivity: new Date(),
      createdAt: new Date(),
    };
    this.userPoints.set(insertPoints.userId, points);
    return points;
  }

  async updateUserPoints(userId: string, updates: Partial<UserPoints>): Promise<UserPoints | undefined> {
    const existing = Array.from(this.userPoints.values()).find(points => points.userId === userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastActivity: new Date() };
    this.userPoints.set(userId, updated);
    return updated;
  }

  async getFitnessActivitiesByUser(userId: string): Promise<FitnessActivity[]> {
    return Array.from(this.fitnessActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.recordedAt!).getTime() - new Date(a.recordedAt!).getTime());
  }

  async createFitnessActivity(insertActivity: InsertFitnessActivity): Promise<FitnessActivity> {
    const id = randomUUID();
    const activity: FitnessActivity = {
      pointsEarned: 0,
      challengeId: null,
      deviceSource: null,
      ...insertActivity,
      id,
      recordedAt: new Date(),
      createdAt: new Date(),
    };
    this.fitnessActivities.set(id, activity);
    return activity;
  }

  // Creator Connect operations
  async getCreators(filters?: { expertise?: string; isVerified?: boolean; isActive?: boolean }): Promise<Creator[]> {
    let creators = Array.from(this.creators.values());
    
    if (filters?.expertise) {
      creators = creators.filter(creator => 
        creator.expertise && (creator.expertise as string[]).includes(filters.expertise!)
      );
    }
    if (filters?.isVerified !== undefined) {
      creators = creators.filter(creator => creator.isVerified === (filters.isVerified ? 1 : 0));
    }
    if (filters?.isActive !== undefined) {
      creators = creators.filter(creator => creator.isActive === (filters.isActive ? 1 : 0));
    }

    return creators.sort((a, b) => parseFloat(b.averageRating || "0") - parseFloat(a.averageRating || "0"));
  }

  async getCreator(id: string): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async getCreatorByUserId(userId: string): Promise<Creator | undefined> {
    return Array.from(this.creators.values()).find(creator => creator.userId === userId);
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const id = randomUUID();
    const creator: Creator = {
      bio: null,
      expertise: null,
      credentials: null,
      profileImageUrl: null,
      languages: null,
      socialLinks: null,
      timezone: "Asia/Kolkata",
      ...insertCreator,
      id,
      isVerified: 0,
      isActive: 1,
      totalSessions: 0,
      averageRating: "0",
      totalEarnings: "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.creators.set(id, creator);
    return creator;
  }

  async updateCreator(id: string, updates: Partial<Creator>): Promise<Creator | undefined> {
    const existing = this.creators.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.creators.set(id, updated);
    return updated;
  }

  // Creator sessions operations
  async getCreatorSessions(creatorId: string): Promise<CreatorSession[]> {
    return Array.from(this.creatorSessions.values())
      .filter(session => session.creatorId === creatorId && session.isActive === 1)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getCreatorSession(id: string): Promise<CreatorSession | undefined> {
    return this.creatorSessions.get(id);
  }

  async createCreatorSession(insertSession: InsertCreatorSession): Promise<CreatorSession> {
    const id = randomUUID();
    const session: CreatorSession = {
      description: null,
      ...insertSession,
      id,
      isActive: 1,
      createdAt: new Date(),
    };
    this.creatorSessions.set(id, session);
    return session;
  }

  async updateCreatorSession(id: string, updates: Partial<CreatorSession>): Promise<CreatorSession | undefined> {
    const existing = this.creatorSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.creatorSessions.set(id, updated);
    return updated;
  }

  // Booking operations
  async getBookings(filters?: { userId?: string; creatorId?: string; status?: string }): Promise<Booking[]> {
    let bookings = Array.from(this.bookings.values());
    
    if (filters?.userId) {
      bookings = bookings.filter(booking => booking.userId === filters.userId);
    }
    if (filters?.creatorId) {
      bookings = bookings.filter(booking => booking.creatorId === filters.creatorId);
    }
    if (filters?.status) {
      bookings = bookings.filter(booking => booking.status === filters.status);
    }

    return bookings.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return this.getBookings({ userId });
  }

  async getBookingsByCreator(creatorId: string): Promise<Booking[]> {
    return this.getBookings({ creatorId });
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const bookingNumber = `BK-${Date.now()}`;
    const booking: Booking = {
      paymentId: null,
      meetingUrl: null,
      notes: null,
      cancelReason: null,
      rescheduledFrom: null,
      ...insertBooking,
      id,
      bookingNumber,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const existing = this.bookings.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  // Creator reviews operations
  async getCreatorReviews(creatorId: string): Promise<CreatorReview[]> {
    return Array.from(this.creatorReviews.values())
      .filter(review => review.creatorId === creatorId && review.isPublic === 1)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getCreatorReview(id: string): Promise<CreatorReview | undefined> {
    return this.creatorReviews.get(id);
  }

  async createCreatorReview(insertReview: InsertCreatorReview): Promise<CreatorReview> {
    const id = randomUUID();
    const review: CreatorReview = {
      review: null,
      ...insertReview,
      id,
      isPublic: 1,
      createdAt: new Date(),
    };
    this.creatorReviews.set(id, review);
    
    // Update creator's average rating
    await this.updateCreatorRating(insertReview.creatorId);
    
    return review;
  }

  private async updateCreatorRating(creatorId: string): Promise<void> {
    const reviews = await this.getCreatorReviews(creatorId);
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(2);
    
    await this.updateCreator(creatorId, { averageRating });
  }

  // Creator availability operations
  async getCreatorAvailability(creatorId: string): Promise<CreatorAvailability[]> {
    return Array.from(this.creatorAvailability.values())
      .filter(availability => availability.creatorId === creatorId && availability.isActive === 1)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  async createCreatorAvailability(insertAvailability: InsertCreatorAvailability): Promise<CreatorAvailability> {
    const id = randomUUID();
    const availability: CreatorAvailability = {
      ...insertAvailability,
      id,
      isActive: 1,
      createdAt: new Date(),
    };
    this.creatorAvailability.set(id, availability);
    return availability;
  }

  async updateCreatorAvailability(id: string, updates: Partial<CreatorAvailability>): Promise<CreatorAvailability | undefined> {
    const existing = this.creatorAvailability.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.creatorAvailability.set(id, updated);
    return updated;
  }

  async deleteCreatorAvailability(id: string): Promise<void> {
    const existing = this.creatorAvailability.get(id);
    if (existing) {
      existing.isActive = 0;
      this.creatorAvailability.set(id, existing);
    }
  }

  // Creator payout operations
  async getCreatorPayouts(creatorId: string): Promise<CreatorPayout[]> {
    return Array.from(this.creatorPayouts.values())
      .filter(payout => payout.creatorId === creatorId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createCreatorPayout(insertPayout: InsertCreatorPayout): Promise<CreatorPayout> {
    const id = randomUUID();
    const payout: CreatorPayout = {
      paymentMethod: null,
      transactionId: null,
      processedAt: null,
      ...insertPayout,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.creatorPayouts.set(id, payout);
    return payout;
  }

  async updateCreatorPayout(id: string, updates: Partial<CreatorPayout>): Promise<CreatorPayout | undefined> {
    const existing = this.creatorPayouts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    if (updates.status === "completed" && !updated.processedAt) {
      updated.processedAt = new Date();
    }
    this.creatorPayouts.set(id, updated);
    return updated;
  }

  // UPI Account operations
  async getUpiAccountsByUser(userId: string): Promise<UpiAccount[]> {
    return Array.from(this.upiAccounts.values())
      .filter(account => account.userId === userId)
      .sort((a, b) => (b.isPrimary || 0) - (a.isPrimary || 0));
  }

  async getUpiAccount(id: string): Promise<UpiAccount | undefined> {
    return this.upiAccounts.get(id);
  }

  async getUpiAccountByUpiId(upiId: string): Promise<UpiAccount | undefined> {
    return Array.from(this.upiAccounts.values())
      .find(account => account.upiId === upiId);
  }

  async createUpiAccount(insertAccount: InsertUpiAccount): Promise<UpiAccount> {
    const id = randomUUID();
    const account: UpiAccount = {
      accountNumber: null,
      ifscCode: null,
      ...insertAccount,
      id,
      isPrimary: 0,
      isVerified: 1,
      createdAt: new Date(),
    };
    this.upiAccounts.set(id, account);
    return account;
  }

  async updateUpiAccount(id: string, updates: Partial<UpiAccount>): Promise<UpiAccount | undefined> {
    const existing = this.upiAccounts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.upiAccounts.set(id, updated);
    return updated;
  }

  // UPI Transaction operations
  async getUpiTransactionsByUser(userId: string): Promise<UpiTransaction[]> {
    return Array.from(this.upiTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getUpiTransaction(id: string): Promise<UpiTransaction | undefined> {
    return this.upiTransactions.get(id);
  }

  async createUpiTransaction(insertTransaction: InsertUpiTransaction): Promise<UpiTransaction> {
    const id = randomUUID();
    const externalTransactionId = `UPI${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const transaction: UpiTransaction = {
      senderAccountId: null,
      recipientAccountId: null,
      recipientUpiId: null,
      recipientName: null,
      senderUpiId: null,
      referenceNumber: null,
      loanId: null,
      billType: null,
      billAccountNumber: null,
      metadata: null,
      ...insertTransaction,
      id,
      externalTransactionId,
      amount: insertTransaction.amount.toString(),
      description: insertTransaction.description || null,
      status: "pending",
      cashbackEarned: "0",
      pointsEarned: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.upiTransactions.set(id, transaction);
    return transaction;
  }

  async updateUpiTransaction(id: string, updates: Partial<UpiTransaction>): Promise<UpiTransaction | undefined> {
    const existing = this.upiTransactions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.upiTransactions.set(id, updated);
    return updated;
  }

  // UPI Reward operations
  async getUpiRewardsByUser(userId: string): Promise<UpiReward[]> {
    return Array.from(this.upiRewards.values())
      .filter(reward => reward.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createUpiReward(insertReward: InsertUpiReward): Promise<UpiReward> {
    const id = randomUUID();
    const reward: UpiReward = {
      upiTransactionId: null,
      expiryDate: null,
      redeemedAt: null,
      ...insertReward,
      id,
      isRedeemed: 0,
      createdAt: new Date(),
    };
    this.upiRewards.set(id, reward);
    return reward;
  }

  // Bill Payment Service operations
  async getBillPaymentServices(serviceType?: string): Promise<BillPaymentService[]> {
    const services = Array.from(this.billPaymentServices.values())
      .filter(service => service.isActive === 1);
    
    if (serviceType) {
      return services.filter(service => service.serviceType === serviceType);
    }
    
    return services.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
  }

  async getBillPaymentService(id: string): Promise<BillPaymentService | undefined> {
    return this.billPaymentServices.get(id);
  }

  // Investment Portfolio operations
  async getInvestmentPortfolioByUser(userId: string): Promise<InvestmentPortfolio[]> {
    return Array.from(this.investmentPortfolio.values())
      .filter(investment => investment.userId === userId && investment.isActive === 1)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getInvestmentPortfolio(id: string): Promise<InvestmentPortfolio | undefined> {
    return this.investmentPortfolio.get(id);
  }

  async createInvestmentPortfolio(insertInvestment: InsertInvestmentPortfolio): Promise<InvestmentPortfolio> {
    const id = randomUUID();
    const investment: InvestmentPortfolio = {
      symbol: null,
      currentPrice: null,
      currentValue: null,
      gainLoss: null,
      gainLossPercentage: null,
      dividendEarned: "0",
      maturityDate: null,
      riskLevel: "medium",
      category: null,
      isActive: 1,
      lastUpdated: new Date(),
      createdAt: new Date(),
      ...insertInvestment,
      id,
    };
    this.investmentPortfolio.set(id, investment);
    return investment;
  }

  async updateInvestmentPortfolio(id: string, updates: Partial<InvestmentPortfolio>): Promise<InvestmentPortfolio | undefined> {
    const existing = this.investmentPortfolio.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.investmentPortfolio.set(id, updated);
    return updated;
  }

  // Insurance operations
  async getInsurancePoliciesByUser(userId: string): Promise<InsurancePolicy[]> {
    return Array.from(this.insurancePolicies.values())
      .filter(policy => policy.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getInsurancePolicy(id: string): Promise<InsurancePolicy | undefined> {
    return this.insurancePolicies.get(id);
  }

  async createInsurancePolicy(insertPolicy: InsertInsurancePolicy): Promise<InsurancePolicy> {
    const id = randomUUID();
    const policy: InsurancePolicy = {
      beneficiaryName: null,
      beneficiaryRelation: null,
      isAutoRenewal: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      ...insertPolicy,
      id,
    };
    this.insurancePolicies.set(id, policy);
    return policy;
  }

  async updateInsurancePolicy(id: string, updates: Partial<InsurancePolicy>): Promise<InsurancePolicy | undefined> {
    const existing = this.insurancePolicies.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.insurancePolicies.set(id, updated);
    return updated;
  }

  // Insurance Premium Payment operations
  async getInsurancePremiumPaymentsByUser(userId: string): Promise<InsurancePremiumPayment[]> {
    return Array.from(this.insurancePremiumPayments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getInsurancePremiumPaymentsByPolicy(policyId: string): Promise<InsurancePremiumPayment[]> {
    return Array.from(this.insurancePremiumPayments.values())
      .filter(payment => payment.policyId === policyId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createInsurancePremiumPayment(paymentData: InsurancePremiumPaymentData & { userId: string; policyId: string }): Promise<InsurancePremiumPayment> {
    const id = randomUUID();
    const transactionId = `INS${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const referenceNumber = `REF${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
    
    // Calculate due date (assume monthly if not specified)
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    const payment: InsurancePremiumPayment = {
      dueDate,
      paymentDate: new Date(),
      status: "success",
      transactionId,
      referenceNumber: referenceNumber,
      isLatePayment: 0,
      lateFee: "0.00",
      createdAt: new Date(),
      ...paymentData,
      id,
      amount: paymentData.amount.toString(),
      upiId: paymentData.upiId || null,
    };
    
    this.insurancePremiumPayments.set(id, payment);
    return payment;
  }

  // Insurance Claims operations
  async getInsuranceClaimsByUser(userId: string): Promise<InsuranceClaim[]> {
    return Array.from(this.insuranceClaims.values())
      .filter(claim => claim.userId === userId)
      .sort((a, b) => new Date(b.filedDate!).getTime() - new Date(a.filedDate!).getTime());
  }

  async getInsuranceClaimsByPolicy(policyId: string): Promise<InsuranceClaim[]> {
    return Array.from(this.insuranceClaims.values())
      .filter(claim => claim.policyId === policyId)
      .sort((a, b) => new Date(b.filedDate!).getTime() - new Date(a.filedDate!).getTime());
  }

  async getInsuranceClaim(id: string): Promise<InsuranceClaim | undefined> {
    return this.insuranceClaims.get(id);
  }

  async createInsuranceClaim(insertClaim: InsertInsuranceClaim & { userId: string }): Promise<InsuranceClaim> {
    const id = randomUUID();
    const claimNumber = `CLM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const claim: InsuranceClaim = {
      id,
      claimNumber,
      status: "pending",
      hospitalName: null,
      doctorName: null,
      settledAmount: null,
      settledDate: null,
      rejectionReason: null,
      documents: null,
      filedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...insertClaim,
      claimAmount: insertClaim.claimAmount.toString(),
    };
    
    this.insuranceClaims.set(id, claim);
    return claim;
  }

  async updateInsuranceClaim(id: string, updates: Partial<InsuranceClaim>): Promise<InsuranceClaim | undefined> {
    const existing = this.insuranceClaims.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.insuranceClaims.set(id, updated);
    return updated;
  }

  // Missing Reward system and Fund Management operations
  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = {
      isActive: 1,
      rarity: "common",
      imageUrl: null,
      eligibilityRequirements: null,
      merchantInfo: null,
      redemptionOptions: null,
      analytics: null,
      ...insertReward,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward | undefined> {
    const existing = this.rewards.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.rewards.set(id, updated);
    return updated;
  }

  async getRewardCategories(): Promise<RewardCategory[]> {
    return Array.from(this.rewardCategories.values());
  }

  async getRewardCategory(id: string): Promise<RewardCategory | undefined> {
    return this.rewardCategories.get(id);
  }

  async createRewardCategory(insertCategory: InsertRewardCategory): Promise<RewardCategory> {
    const id = randomUUID();
    const category: RewardCategory = {
      description: null,
      isActive: 1,
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.rewardCategories.set(id, category);
    return category;
  }

  async getRewardRedemptionsByUser(userId: string): Promise<RewardRedemption[]> {
    return Array.from(this.rewardRedemptions.values())
      .filter(redemption => redemption.userId === userId);
  }

  async getRewardRedemption(id: string): Promise<RewardRedemption | undefined> {
    return this.rewardRedemptions.get(id);
  }

  async createRewardRedemption(insertRedemption: InsertRewardRedemption): Promise<RewardRedemption> {
    const id = randomUUID();
    const redemption: RewardRedemption = {
      status: "pending",
      transactionId: null,
      voucherCode: null,
      deliveryMethod: "email",
      metadata: {},
      ...insertRedemption,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rewardRedemptions.set(id, redemption);
    return redemption;
  }

  async updateRewardRedemption(id: string, updates: Partial<RewardRedemption>): Promise<RewardRedemption | undefined> {
    const existing = this.rewardRedemptions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.rewardRedemptions.set(id, updated);
    return updated;
  }

  // Fund Management operations
  async getUserWallet(userId: string): Promise<UserWallet | undefined> {
    return Array.from(this.userWallets.values()).find(wallet => wallet.userId === userId);
  }

  async createUserWallet(insertWallet: InsertUserWallet): Promise<UserWallet> {
    const id = randomUUID();
    const wallet: UserWallet = {
      totalBalance: "0",
      availableBalance: "0",
      lockedBalance: "0",
      currency: "INR",
      ...insertWallet,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.userWallets.set(id, wallet);
    return wallet;
  }

  async updateUserWallet(userId: string, updates: Partial<UserWallet>): Promise<UserWallet | undefined> {
    const existing = Array.from(this.userWallets.values()).find(wallet => wallet.userId === userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.userWallets.set(existing.id, updated);
    return updated;
  }

  async getFundTransactionsByUser(userId: string): Promise<FundTransaction[]> {
    return Array.from(this.fundTransactions.values())
      .filter(transaction => transaction.userId === userId);
  }

  async getFundTransaction(id: string): Promise<FundTransaction | undefined> {
    return this.fundTransactions.get(id);
  }

  async createFundTransaction(insertTransaction: InsertFundTransaction): Promise<FundTransaction> {
    const id = randomUUID();
    const transaction: FundTransaction = {
      status: "pending",
      processedAt: null,
      metadata: {},
      referenceId: null,
      paymentMethod: null,
      paymentProvider: null,
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.fundTransactions.set(id, transaction);
    return transaction;
  }

  async updateFundTransaction(id: string, updates: Partial<FundTransaction>): Promise<FundTransaction | undefined> {
    const existing = this.fundTransactions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.fundTransactions.set(id, updated);
    return updated;
  }

  async getStripePaymentsByUser(userId: string): Promise<StripePayment[]> {
    return Array.from(this.stripePayments.values())
      .filter(payment => payment.userId === userId);
  }

  async getStripePayment(id: string): Promise<StripePayment | undefined> {
    return this.stripePayments.get(id);
  }

  async getStripePaymentByIntentId(intentId: string): Promise<StripePayment | undefined> {
    return Array.from(this.stripePayments.values())
      .find(payment => payment.stripePaymentIntentId === intentId);
  }

  async createStripePayment(insertPayment: InsertStripePayment): Promise<StripePayment> {
    const id = randomUUID();
    const payment: StripePayment = {
      metadata: {},
      currency: "inr",
      fundTransactionId: null,
      stripeCustomerId: null,
      paymentMethodTypes: [],
      clientSecret: null,
      stripeCreatedAt: null,
      ...insertPayment,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stripePayments.set(id, payment);
    return payment;
  }

  async updateStripePayment(id: string, updates: Partial<StripePayment>): Promise<StripePayment | undefined> {
    const existing = this.stripePayments.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.stripePayments.set(id, updated);
    return updated;
  }

  // Payment Detail operations (unified payment history)
  async getPaymentDetailsByUser(userId: string): Promise<PaymentDetail[]> {
    return Array.from(this.paymentDetails.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPaymentDetail(id: string): Promise<PaymentDetail | undefined> {
    return this.paymentDetails.get(id);
  }

  async getPaymentDetailByTransactionId(transactionId: string): Promise<PaymentDetail | undefined> {
    return Array.from(this.paymentDetails.values())
      .find(payment => payment.transactionId === transactionId);
  }

  async createPaymentDetail(insertPayment: InsertPaymentDetail): Promise<PaymentDetail> {
    const id = randomUUID();
    const payment: PaymentDetail = {
      fees: "0",
      cashbackEarned: "0",
      recipientName: null,
      recipientUpiId: null,
      description: null,
      referenceNumber: null,
      upiTransactionId: null,
      billPaymentId: null,
      emiPaymentId: null,
      insurancePaymentId: null,
      fundTransactionId: null,
      metadata: {},
      ...insertPayment,
      amount: insertPayment.amount.toString(),
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.paymentDetails.set(id, payment);
    return payment;
  }

  async updatePaymentDetail(id: string, updates: Partial<PaymentDetail>): Promise<PaymentDetail | undefined> {
    const existing = this.paymentDetails.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.paymentDetails.set(id, updated);
    return updated;
  }

  // Bill Payee operations
  async getBillPayeesByUser(userId: string): Promise<BillPayee[]> {
    return Array.from(this.billPayees.values())
      .filter(payee => payee.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBillPayee(id: string): Promise<BillPayee | undefined> {
    return this.billPayees.get(id);
  }

  async createBillPayee(insertPayee: InsertBillPayee): Promise<BillPayee> {
    const id = randomUUID();
    const payee: BillPayee = {
      customerId: null,
      nickname: null,
      isActive: 1,
      averageAmount: null,
      lastPaidAmount: null,
      lastPaidDate: null,
      ...insertPayee,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.billPayees.set(id, payee);
    return payee;
  }

  async updateBillPayee(id: string, updates: Partial<BillPayee>): Promise<BillPayee | undefined> {
    const existing = this.billPayees.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.billPayees.set(id, updated);
    return updated;
  }

  async deleteBillPayee(id: string): Promise<void> {
    this.billPayees.delete(id);
  }

  // Scheduled Bill operations
  async getScheduledBillsByUser(userId: string): Promise<ScheduledBill[]> {
    return Array.from(this.scheduledBills.values())
      .filter(bill => bill.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getScheduledBill(id: string): Promise<ScheduledBill | undefined> {
    return this.scheduledBills.get(id);
  }

  async getScheduledBillsByPayee(payeeId: string): Promise<ScheduledBill[]> {
    return Array.from(this.scheduledBills.values())
      .filter(bill => bill.payeeId === payeeId);
  }

  async createScheduledBill(insertBill: InsertScheduledBill): Promise<ScheduledBill> {
    const id = randomUUID();
    const bill: ScheduledBill = {
      scheduleDay: null,
      scheduleDate: null,
      isAutoPayEnabled: 0,
      reminderDays: 3,
      nextDueDate: null,
      lastExecuted: null,
      ...insertBill,
      amount: insertBill.amount ? insertBill.amount.toString() : null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scheduledBills.set(id, bill);
    return bill;
  }

  async updateScheduledBill(id: string, updates: Partial<ScheduledBill>): Promise<ScheduledBill | undefined> {
    const existing = this.scheduledBills.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.scheduledBills.set(id, updated);
    return updated;
  }

  async deleteScheduledBill(id: string): Promise<void> {
    this.scheduledBills.delete(id);
  }

  // Bill Reminder operations
  async getBillRemindersByUser(userId: string): Promise<BillReminder[]> {
    return Array.from(this.billReminders.values())
      .filter(reminder => reminder.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBillReminder(id: string): Promise<BillReminder | undefined> {
    return this.billReminders.get(id);
  }

  async getBillRemindersByScheduledBill(scheduledBillId: string): Promise<BillReminder[]> {
    return Array.from(this.billReminders.values())
      .filter(reminder => reminder.scheduledBillId === scheduledBillId);
  }

  async createBillReminder(insertReminder: InsertBillReminder): Promise<BillReminder> {
    const id = randomUUID();
    const reminder: BillReminder = {
      isRead: 0,
      sentAt: null,
      ...insertReminder,
      amount: insertReminder.amount.toString(),
      id,
      createdAt: new Date(),
    };
    this.billReminders.set(id, reminder);
    return reminder;
  }

  async updateBillReminder(id: string, updates: Partial<BillReminder>): Promise<BillReminder | undefined> {
    const existing = this.billReminders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.billReminders.set(id, updated);
    return updated;
  }

  async markBillReminderAsRead(id: string): Promise<void> {
    const existing = this.billReminders.get(id);
    if (existing) {
      existing.isRead = 1;
      this.billReminders.set(id, existing);
    }
  }

  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = {
      firstName: null,
      lastName: null,
      displayName: null,
      profilePicture: null,
      occupation: null,
      employer: null,
      monthlyIncome: null,
      address: null,
      preferences: null,
      kycDocuments: null,
      securitySettings: null,
      financialGoals: null,
      ...insertProfile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const existing = Array.from(this.userProfiles.values()).find(profile => profile.userId === userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.userProfiles.set(existing.id, updated);
    return updated;
  }

  // Referral Program operations
  async getReferralProgramByUser(userId: string): Promise<ReferralProgram | undefined> {
    return Array.from(this.referralPrograms.values()).find(program => program.userId === userId);
  }

  async getReferralProgram(id: string): Promise<ReferralProgram | undefined> {
    return this.referralPrograms.get(id);
  }

  async createReferralProgram(insertProgram: InsertReferralProgram): Promise<ReferralProgram> {
    const id = randomUUID();
    const program: ReferralProgram = {
      totalReferrals: 0,
      successfulReferrals: 0,
      totalEarnings: "0",
      availableEarnings: "0",
      withdrawnEarnings: "0",
      referralTier: "bronze",
      isActive: 1,
      ...insertProgram,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.referralPrograms.set(id, program);
    return program;
  }

  async updateReferralProgram(userId: string, updates: Partial<ReferralProgram>): Promise<ReferralProgram | undefined> {
    const existing = Array.from(this.referralPrograms.values()).find(program => program.userId === userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.referralPrograms.set(existing.id, updated);
    return updated;
  }

  // Referral Transaction operations
  async getReferralTransactionsByUser(userId: string): Promise<ReferralTransaction[]> {
    return Array.from(this.referralTransactions.values())
      .filter(transaction => transaction.referrerId === userId || transaction.refereeId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getReferralTransactionsByReferrer(referrerId: string): Promise<ReferralTransaction[]> {
    return Array.from(this.referralTransactions.values())
      .filter(transaction => transaction.referrerId === referrerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createReferralTransaction(insertTransaction: InsertReferralTransaction): Promise<ReferralTransaction> {
    const id = randomUUID();
    const transaction: ReferralTransaction = {
      status: "pending",
      description: null,
      completedAt: null,
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.referralTransactions.set(id, transaction);
    return transaction;
  }

  async updateReferralTransaction(id: string, updates: Partial<ReferralTransaction>): Promise<ReferralTransaction | undefined> {
    const existing = this.referralTransactions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.referralTransactions.set(id, updated);
    return updated;
  }

  // Bill Payment History operations
  async getBillPaymentHistoryByUser(userId: string): Promise<BillPaymentHistory[]> {
    return Array.from(this.billPaymentHistory.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBillPaymentHistory(id: string): Promise<BillPaymentHistory | undefined> {
    return this.billPaymentHistory.get(id);
  }

  async createBillPaymentHistory(insertPayment: InsertBillPaymentHistory): Promise<BillPaymentHistory> {
    const id = randomUUID();
    const payment: BillPaymentHistory = {
      billDate: null,
      dueDate: null,
      paidDate: new Date(),
      status: "success",
      paymentMethod: "upi",
      upiTransactionId: null,
      billNumber: null,
      operatorTransactionId: null,
      cashbackEarned: "0",
      coinsEarned: 0,
      isRecurring: 0,
      recurringDay: null,
      notes: null,
      metadata: null,
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.billPaymentHistory.set(id, payment);
    return payment;
  }

  async updateBillPaymentHistory(id: string, updates: Partial<BillPaymentHistory>): Promise<BillPaymentHistory | undefined> {
    const existing = this.billPaymentHistory.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.billPaymentHistory.set(id, updated);
    return updated;
  }

  // Travel Routes operations
  async getTravelRoutes(filters?: { serviceType?: string; fromLocation?: string; toLocation?: string }): Promise<TravelRoute[]> {
    let routes = Array.from(this.travelRoutes.values());
    
    if (filters?.serviceType) {
      routes = routes.filter(route => route.serviceType === filters.serviceType);
    }
    if (filters?.fromLocation) {
      routes = routes.filter(route => route.fromLocation.toLowerCase().includes(filters.fromLocation!.toLowerCase()));
    }
    if (filters?.toLocation) {
      routes = routes.filter(route => route.toLocation.toLowerCase().includes(filters.toLocation!.toLowerCase()));
    }
    
    return routes.filter(route => route.isActive === 1);
  }

  async getTravelRoute(id: string): Promise<TravelRoute | undefined> {
    return this.travelRoutes.get(id);
  }

  async createTravelRoute(insertRoute: InsertTravelRoute): Promise<TravelRoute> {
    const id = randomUUID();
    const route: TravelRoute = {
      rating: "4.0",
      isActive: 1,
      operatorLogo: null,
      fromCode: null,
      toCode: null,
      routeNumber: null,
      distance: null,
      amenities: null,
      seatClasses: null,
      ...insertRoute,
      pricePerKm: insertRoute.pricePerKm ? String(insertRoute.pricePerKm) : null,
      pricePerHour: insertRoute.pricePerHour ? String(insertRoute.pricePerHour) : null,
      id,
      createdAt: new Date(),
    };
    this.travelRoutes.set(id, route);
    return route;
  }

  // Travel Schedules operations
  async getTravelSchedules(routeId: string): Promise<TravelSchedule[]> {
    return Array.from(this.travelSchedules.values())
      .filter(schedule => schedule.routeId === routeId && schedule.status === 'active');
  }

  async getTravelSchedule(id: string): Promise<TravelSchedule | undefined> {
    return this.travelSchedules.get(id);
  }

  async createTravelSchedule(insertSchedule: InsertTravelSchedule): Promise<TravelSchedule> {
    const id = randomUUID();
    const schedule: TravelSchedule = {
      dynamicPricing: "1.0",
      delayMinutes: 0,
      boardingGate: null,
      platform: null,
      terminal: null,
      ...insertSchedule,
      id,
      createdAt: new Date(),
    };
    this.travelSchedules.set(id, schedule);
    return schedule;
  }

  async searchTravelSchedules(filters: { serviceType: string; fromLocation: string; toLocation: string; departureDate: string }): Promise<TravelSchedule[]> {
    // First get matching routes
    const routes = await this.getTravelRoutes({
      serviceType: filters.serviceType,
      fromLocation: filters.fromLocation,
      toLocation: filters.toLocation
    });
    
    const routeIds = routes.map(route => route.id);
    
    // Then get schedules for those routes on the specified date
    return Array.from(this.travelSchedules.values())
      .filter(schedule => 
        routeIds.includes(schedule.routeId) &&
        schedule.departureDate === filters.departureDate &&
        schedule.status === 'active' &&
        schedule.availableSeats > 0
      )
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  // Travel Bookings operations
  async getTravelBookingsByUser(userId: string): Promise<TravelBooking[]> {
    return Array.from(this.travelBookings.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());
  }

  async getTravelBooking(id: string): Promise<TravelBooking | undefined> {
    return this.travelBookings.get(id);
  }

  async createTravelBooking(insertBooking: InsertTravelBooking): Promise<TravelBooking> {
    const id = randomUUID();
    const bookingReference = `TRV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const booking: TravelBooking = {
      seatNumbers: null,
      fees: "0",
      discounts: "0",
      paymentReference: null,
      cancellationPolicy: null,
      specialRequests: null,
      contactInfo: null,
      bookingSource: "app",
      isRefundable: 1,
      boardingGate: null,
      platform: null,
      terminal: null,
      routeNumber: insertBooking.routeNumber || null,
      vehicleType: insertBooking.vehicleType || null,
      scheduleId: insertBooking.scheduleId || null,
      arrivalTime: insertBooking.arrivalTime || null,
      seatClass: insertBooking.seatClass || null,
      ...insertBooking,
      id,
      bookingReference,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelBookings.set(id, booking);
    return booking;
  }

  async updateTravelBooking(id: string, updateBooking: Partial<TravelBooking>): Promise<TravelBooking | undefined> {
    const existing = this.travelBookings.get(id);
    if (!existing) return undefined;
    
    const updated: TravelBooking = {
      ...existing,
      ...updateBooking,
      updatedAt: new Date(),
    };
    this.travelBookings.set(id, updated);
    return updated;
  }

  // Travel Passengers operations
  async getTravelPassengersByBooking(bookingId: string): Promise<TravelPassenger[]> {
    return Array.from(this.travelPassengers.values())
      .filter(passenger => passenger.bookingId === bookingId);
  }

  async createTravelPassenger(insertPassenger: InsertTravelPassenger): Promise<TravelPassenger> {
    const id = randomUUID();
    const passenger: TravelPassenger = {
      dateOfBirth: null,
      gender: null,
      idType: null,
      idNumber: null,
      seatNumber: null,
      mealPreference: null,
      specialAssistance: null,
      isInfant: 0,
      frequentFlyerNumber: null,
      ...insertPassenger,
      id,
      createdAt: new Date(),
    };
    this.travelPassengers.set(id, passenger);
    return passenger;
  }

  // Travel Payments operations
  async getTravelPaymentsByBooking(bookingId: string): Promise<TravelPayment[]> {
    return Array.from(this.travelPayments.values())
      .filter(payment => payment.bookingId === bookingId);
  }

  async createTravelPayment(insertPayment: InsertTravelPayment): Promise<TravelPayment> {
    const id = randomUUID();
    const payment: TravelPayment = {
      transactionId: null,
      gatewayResponse: null,
      refundAmount: "0",
      refundReason: null,
      refundDate: null,
      paymentProvider: null,
      ...insertPayment,
      amount: insertPayment.amount.toString(),
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelPayments.set(id, payment);
    return payment;
  }

  // Travel Contracts operations
  async getTravelContractsByUser(userId: string): Promise<TravelContract[]> {
    return Array.from(this.travelContracts.values())
      .filter(contract => contract.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getTravelContract(id: string): Promise<TravelContract | undefined> {
    return this.travelContracts.get(id);
  }

  async createTravelContract(insertContract: InsertTravelContract): Promise<TravelContract> {
    const id = randomUUID();
    const contractNumber = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const contract: TravelContract = {
      serviceTypes: null,
      routes: null,
      discountPercent: "0",
      negotiatedRates: null,
      bookingLimits: null,
      invoicingTerms: null,
      specialSkus: null,
      blackoutDates: null,
      documentUrl: null,
      signedDocumentUrl: null,
      signatoryName: null,
      signatoryEmail: null,
      totalBookingsUnderContract: 0,
      totalAmountUnderContract: "0",
      ...insertContract,
      id,
      contractNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelContracts.set(id, contract);
    return contract;
  }

  async updateTravelContract(id: string, updates: Partial<TravelContract>): Promise<TravelContract | undefined> {
    const existing = this.travelContracts.get(id);
    if (!existing) return undefined;
    
    const updated: TravelContract = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.travelContracts.set(id, updated);
    return updated;
  }

  async deleteTravelContract(id: string): Promise<void> {
    this.travelContracts.delete(id);
  }

  // Travel Add-ons operations
  async getTravelAddonsByBooking(bookingId: string): Promise<TravelAddon[]> {
    return Array.from(this.travelAddons.values())
      .filter(addon => addon.bookingId === bookingId);
  }

  async createTravelAddon(insertAddon: InsertTravelAddon): Promise<TravelAddon> {
    const id = randomUUID();
    const addon: TravelAddon = {
      quantity: 1,
      metadata: null,
      ...insertAddon,
      price: insertAddon.price.toString(),
      id,
      createdAt: new Date(),
    };
    this.travelAddons.set(id, addon);
    return addon;
  }

  async updateTravelAddon(id: string, updates: Partial<TravelAddon>): Promise<TravelAddon | undefined> {
    const existing = this.travelAddons.get(id);
    if (!existing) return undefined;
    
    const updated: TravelAddon = { ...existing, ...updates };
    this.travelAddons.set(id, updated);
    return updated;
  }

  async deleteTravelAddon(id: string): Promise<void> {
    this.travelAddons.delete(id);
  }

  // Travel Live Tracking operations
  async getTravelLiveTrackingByBooking(bookingId: string): Promise<TravelLiveTracking | undefined> {
    return Array.from(this.travelLiveTracking.values())
      .find(tracking => tracking.bookingId === bookingId);
  }

  async createTravelLiveTracking(insertTracking: InsertTravelLiveTracking): Promise<TravelLiveTracking> {
    const id = randomUUID();
    const tracking: TravelLiveTracking = {
      currentLatitude: null,
      currentLongitude: null,
      driverLatitude: null,
      driverLongitude: null,
      eta: null,
      distanceRemaining: null,
      ...insertTracking,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.travelLiveTracking.set(id, tracking);
    return tracking;
  }

  async updateTravelLiveTracking(id: string, updates: Partial<TravelLiveTracking>): Promise<TravelLiveTracking | undefined> {
    const existing = this.travelLiveTracking.get(id);
    if (!existing) return undefined;
    
    const updated: TravelLiveTracking = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    };
    this.travelLiveTracking.set(id, updated);
    return updated;
  }

  async deleteTravelLiveTracking(id: string): Promise<void> {
    this.travelLiveTracking.delete(id);
  }

  // Boarding Pass operations
  async getBoardingPassesByBooking(bookingId: string): Promise<BoardingPass[]> {
    return Array.from(this.boardingPasses.values())
      .filter(pass => pass.bookingId === bookingId);
  }

  async getBoardingPassByPassenger(passengerId: string): Promise<BoardingPass | undefined> {
    return Array.from(this.boardingPasses.values())
      .find(pass => pass.passengerId === passengerId);
  }

  async createBoardingPass(insertPass: InsertBoardingPass): Promise<BoardingPass> {
    const id = randomUUID();
    const pass: BoardingPass = {
      id,
      createdAt: new Date(),
      issuedAt: new Date(),
      barcodeUrl: null,
      qrCodeUrl: null,
      boardingGate: null,
      boardingTime: null,
      seatNumber: null,
      pnrNumber: null,
      ...insertPass,
    };
    this.boardingPasses.set(id, pass);
    return pass;
  }

  async updateBoardingPass(id: string, updates: Partial<BoardingPass>): Promise<BoardingPass | undefined> {
    const existing = this.boardingPasses.get(id);
    if (!existing) return undefined;
    
    const updated: BoardingPass = { ...existing, ...updates };
    this.boardingPasses.set(id, updated);
    return updated;
  }

  async deleteBoardingPass(id: string): Promise<void> {
    this.boardingPasses.delete(id);
  }

  // Travel Modifications operations
  async getTravelModificationsByBooking(bookingId: string): Promise<TravelModification[]> {
    return Array.from(this.travelModifications.values())
      .filter(mod => mod.bookingId === bookingId)
      .sort((a, b) => {
        const dateA = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
        const dateB = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getTravelModification(id: string): Promise<TravelModification | undefined> {
    return this.travelModifications.get(id);
  }

  async createTravelModification(insertMod: InsertTravelModification): Promise<TravelModification> {
    const id = randomUUID();
    const modification: TravelModification = {
      processedAt: null,
      modificationCharge: "0",
      ...insertMod,
      id,
      createdAt: new Date(),
      requestedAt: new Date(),
    };
    this.travelModifications.set(id, modification);
    return modification;
  }

  async updateTravelModification(id: string, updates: Partial<TravelModification>): Promise<TravelModification | undefined> {
    const existing = this.travelModifications.get(id);
    if (!existing) return undefined;
    
    const updated: TravelModification = { ...existing, ...updates };
    this.travelModifications.set(id, updated);
    return updated;
  }

  async deleteTravelModification(id: string): Promise<void> {
    this.travelModifications.delete(id);
  }

  // Travel Alerts operations
  async getTravelAlertsByBooking(bookingId: string): Promise<TravelAlert[]> {
    return Array.from(this.travelAlerts.values())
      .filter(alert => alert.bookingId === bookingId);
  }

  async getTravelAlertsBySchedule(scheduleId: string): Promise<TravelAlert[]> {
    return Array.from(this.travelAlerts.values())
      .filter(alert => alert.scheduleId === scheduleId);
  }

  async getActiveTravelAlerts(): Promise<TravelAlert[]> {
    return Array.from(this.travelAlerts.values())
      .filter(alert => alert.isResolved === 0)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createTravelAlert(insertAlert: InsertTravelAlert): Promise<TravelAlert> {
    const id = randomUUID();
    const alert: TravelAlert = {
      bookingId: null,
      scheduleId: null,
      delayMinutes: null,
      newGate: null,
      newPlatform: null,
      affectedServices: null,
      isResolved: 0,
      resolvedAt: null,
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.travelAlerts.set(id, alert);
    return alert;
  }

  async updateTravelAlert(id: string, updates: Partial<TravelAlert>): Promise<TravelAlert | undefined> {
    const existing = this.travelAlerts.get(id);
    if (!existing) return undefined;
    
    const updated: TravelAlert = { ...existing, ...updates };
    this.travelAlerts.set(id, updated);
    return updated;
  }

  async deleteTravelAlert(id: string): Promise<void> {
    this.travelAlerts.delete(id);
  }

  // Travel Coupon operations
  async getTravelCouponByCode(code: string): Promise<TravelCoupon | undefined> {
    return Array.from(this.travelCoupons.values())
      .find(coupon => coupon.code.toUpperCase() === code.toUpperCase());
  }

  async getActiveTravelCoupons(serviceType: string): Promise<TravelCoupon[]> {
    const now = new Date();
    return Array.from(this.travelCoupons.values())
      .filter(coupon => {
        if (!coupon.isActive) return false;
        
        const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
        const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;
        if (!validFrom || !validUntil || now < validFrom || now > validUntil) return false;
        
        const applicableServices = coupon.applicableServiceTypes as string[];
        if (!applicableServices || !applicableServices.includes(serviceType)) return false;
        
        if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) return false;
        
        return true;
      })
      .sort((a, b) => {
        const discountA = Number(a.discountValue);
        const discountB = Number(b.discountValue);
        return discountB - discountA;
      });
  }

  async createTravelCoupon(insertCoupon: InsertTravelCoupon): Promise<TravelCoupon> {
    const id = randomUUID();
    const coupon: TravelCoupon = {
      usageCount: 0,
      isActive: 1,
      description: insertCoupon.description || null,
      maxDiscount: insertCoupon.maxDiscount || null,
      ...insertCoupon,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelCoupons.set(id, coupon);
    return coupon;
  }

  async incrementTravelCouponUsage(couponId: string): Promise<void> {
    const coupon = this.travelCoupons.get(couponId);
    if (coupon) {
      coupon.usageCount = (coupon.usageCount || 0) + 1;
      coupon.updatedAt = new Date();
      this.travelCoupons.set(couponId, coupon);
    }
  }

  // Travel Coupon Usage operations
  async createTravelCouponUsage(insertUsage: InsertTravelCouponUsage): Promise<TravelCouponUsage> {
    const id = randomUUID();
    const usage: TravelCouponUsage = {
      bookingId: null,
      ...insertUsage,
      discountAmount: insertUsage.discountAmount.toString(),
      id,
      usedAt: new Date(),
    };
    this.travelCouponUsage.set(id, usage);
    return usage;
  }

  async getUserTravelCouponUsage(userId: string): Promise<TravelCouponUsage[]> {
    return Array.from(this.travelCouponUsage.values())
      .filter(usage => usage.userId === userId)
      .sort((a, b) => {
        const dateA = a.usedAt ? new Date(a.usedAt).getTime() : 0;
        const dateB = b.usedAt ? new Date(b.usedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getUserTravelCouponUsageCount(couponId: string, userId: string): Promise<number> {
    return Array.from(this.travelCouponUsage.values())
      .filter(usage => usage.couponId === couponId && usage.userId === userId)
      .length;
  }

  // Investment Watchlist operations
  async getWatchlistByUser(userId: string): Promise<InvestmentWatchlist[]> {
    return Array.from(this.investmentWatchlist.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getWatchlistItem(id: string): Promise<InvestmentWatchlist | undefined> {
    return this.investmentWatchlist.get(id);
  }

  async addToWatchlist(item: InsertInvestmentWatchlist): Promise<InvestmentWatchlist> {
    const id = randomUUID();
    const watchlistItem: InvestmentWatchlist = {
      id,
      addedAt: new Date(),
      currentPrice: null,
      priceAlert: null,
      alertEnabled: 0,
      ...item,
    };
    this.investmentWatchlist.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(id: string): Promise<void> {
    this.investmentWatchlist.delete(id);
  }

  async updateWatchlistItem(id: string, item: Partial<InvestmentWatchlist>): Promise<InvestmentWatchlist | undefined> {
    const existing = this.investmentWatchlist.get(id);
    if (!existing) return undefined;
    
    const updated: InvestmentWatchlist = { ...existing, ...item };
    this.investmentWatchlist.set(id, updated);
    return updated;
  }

  // Investment Order operations
  async getOrdersByUser(userId: string): Promise<InvestmentOrder[]> {
    return Array.from(this.investmentOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getOrder(id: string): Promise<InvestmentOrder | undefined> {
    return this.investmentOrders.get(id);
  }

  async createOrder(order: InsertInvestmentOrder): Promise<InvestmentOrder> {
    const id = randomUUID();
    const newOrder: InvestmentOrder = {
      vendorId: null,
      vendorName: null,
      executedPrice: null,
      fees: "0",
      gst: "0",
      deliveryType: null,
      paymentMethod: "upi",
      paymentStatus: "pending",
      transactionId: null,
      executedAt: null,
      ...order,
      quantity: order.quantity.toString(),
      totalAmount: order.totalAmount.toString(),
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.investmentOrders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: string, order: Partial<InvestmentOrder>): Promise<InvestmentOrder | undefined> {
    const existing = this.investmentOrders.get(id);
    if (!existing) return undefined;
    
    const updated: InvestmentOrder = {
      ...existing,
      ...order,
      updatedAt: new Date(),
    };
    this.investmentOrders.set(id, updated);
    return updated;
  }

  // Investment Vendor operations
  async getVendors(filters?: { assetType?: string; isActive?: number }): Promise<InvestmentVendor[]> {
    let vendors = Array.from(this.investmentVendors.values());
    
    if (filters?.assetType) {
      vendors = vendors.filter(v => v.assetTypes?.includes(filters.assetType!));
    }
    
    if (filters?.isActive !== undefined) {
      vendors = vendors.filter(v => v.isActive === filters.isActive);
    }
    
    return vendors.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
  }

  async getVendor(id: string): Promise<InvestmentVendor | undefined> {
    return this.investmentVendors.get(id);
  }

  async createVendor(vendor: InsertInvestmentVendor): Promise<InvestmentVendor> {
    const id = randomUUID();
    const newVendor: InvestmentVendor = {
      id,
      createdAt: new Date(),
      assetTypes: null,
      rating: "4.0",
      trustBadge: "verified",
      verificationStatus: "verified",
      deliveryOptions: null,
      feeStructure: null,
      buybackPolicy: null,
      certifications: null,
      avgDeliveryTime: null,
      reviewCount: 0,
      isActive: 1,
      ...vendor,
    };
    this.investmentVendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: string, vendor: Partial<InvestmentVendor>): Promise<InvestmentVendor | undefined> {
    const existing = this.investmentVendors.get(id);
    if (!existing) return undefined;
    
    const updated: InvestmentVendor = { ...existing, ...vendor };
    this.investmentVendors.set(id, updated);
    return updated;
  }

  // Market Data operations
  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    return Array.from(this.marketData.values())
      .find(data => data.symbol === symbol);
  }

  async getAllMarketData(filters?: { assetType?: string }): Promise<MarketData[]> {
    let data = Array.from(this.marketData.values());
    
    if (filters?.assetType) {
      data = data.filter(d => d.assetType === filters.assetType);
    }
    
    return data;
  }

  async upsertMarketData(data: InsertMarketData): Promise<MarketData> {
    const existing = Array.from(this.marketData.values())
      .find(d => d.symbol === data.symbol);
    
    if (existing) {
      const updated: MarketData = {
        ...existing,
        ...data,
        lastUpdated: new Date(),
      };
      this.marketData.set(existing.id, updated);
      return updated;
    }
    
    const id = randomUUID();
    const newData: MarketData = {
      openPrice: null,
      highPrice: null,
      lowPrice: null,
      closePrice: null,
      dayChange: null,
      dayChangePercent: null,
      volume: null,
      marketCap: null,
      peRatio: null,
      week52High: null,
      week52Low: null,
      sector: null,
      industry: null,
      purity: null,
      certification: null,
      priceHistory: data.priceHistory || null,
      ...data,
      unitType: data.unitType ?? null,
      id,
      lastUpdated: new Date(),
    };
    this.marketData.set(id, newData);
    return newData;
  }

  // User Vehicle operations
  async getVehiclesByUser(userId: string): Promise<UserVehicle[]> {
    return Array.from(this.userVehicles.values())
      .filter(vehicle => vehicle.userId === userId)
      .sort((a, b) => (b.isPrimary || 0) - (a.isPrimary || 0));
  }

  async getVehicle(id: string): Promise<UserVehicle | undefined> {
    return this.userVehicles.get(id);
  }

  async createVehicle(vehicle: InsertUserVehicle): Promise<UserVehicle> {
    const id = randomUUID();
    const newVehicle: UserVehicle = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      vehicleMake: null,
      vehicleModel: null,
      vehicleColor: null,
      registrationState: null,
      rcNumber: null,
      isPrimary: 0,
      ...vehicle,
    };
    this.userVehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: string, vehicle: Partial<UserVehicle>): Promise<UserVehicle | undefined> {
    const existing = this.userVehicles.get(id);
    if (!existing) return undefined;
    
    const updated: UserVehicle = {
      ...existing,
      ...vehicle,
      updatedAt: new Date(),
    };
    this.userVehicles.set(id, updated);
    return updated;
  }

  async deleteVehicle(id: string): Promise<void> {
    this.userVehicles.delete(id);
  }

  // FASTag Account operations
  async getFastagAccountsByUser(userId: string): Promise<FastagAccount[]> {
    return Array.from(this.fastagAccounts.values())
      .filter(account => account.userId === userId);
  }

  async getFastagAccount(id: string): Promise<FastagAccount | undefined> {
    return this.fastagAccounts.get(id);
  }

  async getFastagAccountByVehicle(vehicleId: string): Promise<FastagAccount | undefined> {
    return Array.from(this.fastagAccounts.values())
      .find(account => account.vehicleId === vehicleId);
  }

  async createFastagAccount(account: InsertFastagAccount): Promise<FastagAccount> {
    const id = randomUUID();
    const newAccount: FastagAccount = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      bankLogo: null,
      balance: "0",
      minBalance: "100",
      autoRechargeEnabled: 0,
      autoRechargeAmount: null,
      autoRechargeThreshold: null,
      issueDate: null,
      expiryDate: null,
      lastRechargeDate: null,
      ...account,
    };
    this.fastagAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateFastagAccount(id: string, account: Partial<FastagAccount>): Promise<FastagAccount | undefined> {
    const existing = this.fastagAccounts.get(id);
    if (!existing) return undefined;
    
    const updated: FastagAccount = {
      ...existing,
      ...account,
      updatedAt: new Date(),
    };
    this.fastagAccounts.set(id, updated);
    return updated;
  }

  // FASTag Transaction operations
  async getFastagTransactionsByUser(userId: string): Promise<FastagTransaction[]> {
    return Array.from(this.fastagTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getFastagTransactionsByAccount(accountId: string): Promise<FastagTransaction[]> {
    return Array.from(this.fastagTransactions.values())
      .filter(transaction => transaction.fastagAccountId === accountId)
      .sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createFastagTransaction(transaction: InsertFastagTransaction): Promise<FastagTransaction> {
    const id = randomUUID();
    const newTransaction: FastagTransaction = {
      id,
      createdAt: new Date(),
      transactionDate: new Date(),
      tollPlazaName: null,
      tollPlazaLocation: null,
      vehicleNumber: null,
      paymentMethod: null,
      paymentReference: null,
      isAutoRecharge: 0,
      metadata: null,
      ...transaction,
      amount: String(transaction.amount),
    };
    this.fastagTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Loan Amortization Schedule operations
  async getAmortizationScheduleByLoan(loanId: string): Promise<LoanAmortizationSchedule[]> {
    return Array.from(this.loanAmortizationSchedules.values())
      .filter(schedule => schedule.loanId === loanId)
      .sort((a, b) => a.installmentNumber - b.installmentNumber);
  }

  async getAmortizationScheduleItem(id: string): Promise<LoanAmortizationSchedule | undefined> {
    return this.loanAmortizationSchedules.get(id);
  }

  async createAmortizationSchedule(schedule: InsertLoanAmortizationSchedule): Promise<LoanAmortizationSchedule> {
    const id = randomUUID();
    const newSchedule: LoanAmortizationSchedule = {
      paidDate: null,
      paidAmount: null,
      status: schedule.status || "pending",
      ...schedule,
      id,
      createdAt: new Date(),
    };
    this.loanAmortizationSchedules.set(id, newSchedule);
    return newSchedule;
  }

  async updateAmortizationSchedule(id: string, schedule: Partial<LoanAmortizationSchedule>): Promise<LoanAmortizationSchedule | undefined> {
    const existing = this.loanAmortizationSchedules.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...schedule };
    this.loanAmortizationSchedules.set(id, updated);
    return updated;
  }

  // Loan Document operations
  async getLoanDocumentsByLoan(loanId: string): Promise<LoanDocument[]> {
    return Array.from(this.loanDocuments.values())
      .filter(doc => doc.loanId === loanId)
      .sort((a, b) => {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getLoanDocument(id: string): Promise<LoanDocument | undefined> {
    return this.loanDocuments.get(id);
  }

  async createLoanDocument(document: InsertLoanDocument): Promise<LoanDocument> {
    const id = randomUUID();
    const newDocument: LoanDocument = {
      id,
      createdAt: new Date(),
      uploadedAt: new Date(),
      documentSize: null,
      isVerified: 0,
      ...document,
    };
    this.loanDocuments.set(id, newDocument);
    return newDocument;
  }

  async updateLoanDocument(id: string, document: Partial<LoanDocument>): Promise<LoanDocument | undefined> {
    const existing = this.loanDocuments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...document };
    this.loanDocuments.set(id, updated);
    return updated;
  }

  async deleteLoanDocument(id: string): Promise<void> {
    this.loanDocuments.delete(id);
  }

  // Saved Card operations
  async getSavedCardsByUser(userId: string): Promise<SavedCard[]> {
    return Array.from(this.savedCards.values())
      .filter(card => card.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSavedCard(id: string): Promise<SavedCard | undefined> {
    return this.savedCards.get(id);
  }

  async createSavedCard(card: InsertSavedCard): Promise<SavedCard> {
    const id = randomUUID();
    const newCard: SavedCard = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      cardNickname: null,
      isDefault: 0,
      isFrozen: 0,
      spendingLimit: null,
      dailyLimit: null,
      rewardsRate: null,
      billingAddress: null,
      ...card,
    };
    this.savedCards.set(id, newCard);
    return newCard;
  }

  async updateSavedCard(id: string, card: Partial<SavedCard>): Promise<SavedCard | undefined> {
    const existing = this.savedCards.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...card, updatedAt: new Date() };
    this.savedCards.set(id, updated);
    return updated;
  }

  async deleteSavedCard(id: string): Promise<void> {
    this.savedCards.delete(id);
  }

  // Card Transaction operations
  async getCardTransactionsByCard(cardId: string): Promise<CardTransaction[]> {
    return Array.from(this.cardTransactions.values())
      .filter(txn => txn.cardId === cardId)
      .sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getCardTransactionsByUser(userId: string): Promise<CardTransaction[]> {
    return Array.from(this.cardTransactions.values())
      .filter(txn => txn.userId === userId)
      .sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getCardTransaction(id: string): Promise<CardTransaction | undefined> {
    return this.cardTransactions.get(id);
  }

  async createCardTransaction(transaction: InsertCardTransaction): Promise<CardTransaction> {
    const id = randomUUID();
    const newTransaction: CardTransaction = {
      merchantName: null,
      merchantCategory: null,
      currency: "INR",
      rewardsEarned: "0",
      metadata: null,
      status: transaction.status || "completed",
      ...transaction,
      id,
      createdAt: new Date(),
      transactionDate: new Date(),
    };
    this.cardTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateCardTransaction(id: string, transaction: Partial<CardTransaction>): Promise<CardTransaction | undefined> {
    const existing = this.cardTransactions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...transaction };
    this.cardTransactions.set(id, updated);
    return updated;
  }

  // Bank Account operations
  async getBankAccountsByUser(userId: string): Promise<BankAccount[]> {
    return Array.from(this.bankAccounts.values())
      .filter(account => account.userId === userId)
      .sort((a, b) => {
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getBankAccount(id: string): Promise<BankAccount | undefined> {
    return this.bankAccounts.get(id);
  }

  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const id = randomUUID();
    const newAccount: BankAccount = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      addedAt: new Date(),
      bankLogo: null,
      branchName: null,
      isPrimary: 0,
      isVerified: 0,
      balance: null,
      linkedUpiIds: null,
      mandates: null,
      preferredForLargePayouts: 0,
      lastSyncedAt: null,
      ...account,
    };
    this.bankAccounts.set(id, newAccount);
    return newAccount;
  }

  async updateBankAccount(id: string, account: Partial<BankAccount>): Promise<BankAccount | undefined> {
    const existing = this.bankAccounts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...account, updatedAt: new Date() };
    this.bankAccounts.set(id, updated);
    return updated;
  }

  async deleteBankAccount(id: string): Promise<void> {
    this.bankAccounts.delete(id);
  }

  // Activity Log operations
  async getActivityLogsByUser(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getActivityLog(id: string): Promise<ActivityLog | undefined> {
    return this.activityLogs.get(id);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const newLog: ActivityLog = {
      id,
      createdAt: new Date(),
      timestamp: new Date(),
      ipAddress: null,
      deviceType: null,
      deviceInfo: null,
      location: null,
      metadata: null,
      riskLevel: "low",
      isSuspicious: 0,
      ...log,
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  async getRecentActivityByUser(userId: string, limit: number): Promise<ActivityLog[]> {
    const logs = await this.getActivityLogsByUser(userId);
    return logs.slice(0, limit);
  }

  async getSuspiciousActivityByUser(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId && log.isSuspicious === 1)
      .sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return dateB - dateA;
      });
  }

  // Stock Trade operations
  async getStockTradesByUser(userId: string): Promise<StockTrade[]> {
    return Array.from(this.stockTrades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => {
        const dateA = a.tradeDate ? new Date(a.tradeDate).getTime() : 0;
        const dateB = b.tradeDate ? new Date(b.tradeDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getStockTradesBySymbol(userId: string, symbol: string): Promise<StockTrade[]> {
    return Array.from(this.stockTrades.values())
      .filter(trade => trade.userId === userId && trade.symbol === symbol)
      .sort((a, b) => {
        const dateA = a.tradeDate ? new Date(a.tradeDate).getTime() : 0;
        const dateB = b.tradeDate ? new Date(b.tradeDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getStockTrade(id: string): Promise<StockTrade | undefined> {
    return this.stockTrades.get(id);
  }

  async createStockTrade(trade: InsertStockTrade): Promise<StockTrade> {
    const id = randomUUID();
    const newTrade: StockTrade = {
      id,
      createdAt: new Date(),
      buyPrice: null,
      sellPrice: null,
      brokerage: "0",
      gst: "0",
      otherFees: "0",
      profitLoss: null,
      profitLossPercent: null,
      upiTransactionId: null,
      vendorName: null,
      brokerName: null,
      settlementDate: null,
      settlementType: "T+2",
      taxClassification: null,
      holdingPeriodDays: null,
      fills: null,
      tags: null,
      notes: null,
      contractNoteUrl: null,
      invoiceUrl: null,
      ...trade,
    };
    this.stockTrades.set(id, newTrade);
    return newTrade;
  }

  async updateStockTrade(id: string, trade: Partial<StockTrade>): Promise<StockTrade | undefined> {
    const existing = this.stockTrades.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...trade };
    this.stockTrades.set(id, updated);
    return updated;
  }

  // Financial Goal operations
  async getFinancialGoalsByUser(userId: string): Promise<FinancialGoal[]> {
    return Array.from(this.financialGoals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getFinancialGoal(id: string): Promise<FinancialGoal | undefined> {
    return this.financialGoals.get(id);
  }

  async createFinancialGoal(goal: InsertFinancialGoal): Promise<FinancialGoal> {
    const id = randomUUID();
    const newGoal: FinancialGoal = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentAmount: "0",
      monthlyContribution: null,
      targetDate: null,
      priority: "medium",
      status: "active",
      linkedInvestments: null,
      suggestedAllocation: null,
      progressPercentage: "0",
      monthsToGoal: null,
      projectedCompletionDate: null,
      description: null,
      icon: null,
      ...goal,
    };
    this.financialGoals.set(id, newGoal);
    return newGoal;
  }

  async updateFinancialGoal(id: string, goal: Partial<FinancialGoal>): Promise<FinancialGoal | undefined> {
    const existing = this.financialGoals.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...goal, updatedAt: new Date() };
    this.financialGoals.set(id, updated);
    return updated;
  }

  async deleteFinancialGoal(id: string): Promise<void> {
    this.financialGoals.delete(id);
  }

  // Budget operations
  async getBudgetsByUser(userId: string): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter(budget => budget.userId === userId)
      .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getBudget(id: string): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }

  async getBudgetsByCategory(userId: string, category: string): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter(budget => budget.userId === userId && budget.category === category)
      .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const newBudget: Budget = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentSpend: "0",
      alertThreshold: "80",
      isAlertEnabled: 1,
      rolloverEnabled: 0,
      rolloverAmount: "0",
      budgetPeriod: "monthly",
      status: "active",
      spendBySubcategory: null,
      ...budget,
    };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget | undefined> {
    const existing = this.budgets.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...budget, updatedAt: new Date() };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string): Promise<void> {
    this.budgets.delete(id);
  }

  // Mutual Fund operations
  async getMutualFunds(filters?: { fundType?: string; category?: string; isActive?: number }): Promise<MutualFund[]> {
    let funds = Array.from(this.mutualFunds.values());
    
    if (filters?.fundType) {
      funds = funds.filter(fund => fund.fundType === filters.fundType);
    }
    if (filters?.category) {
      funds = funds.filter(fund => fund.category === filters.category);
    }
    if (filters?.isActive !== undefined) {
      funds = funds.filter(fund => fund.isActive === filters.isActive);
    }
    
    return funds.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getMutualFund(id: string): Promise<MutualFund | undefined> {
    return this.mutualFunds.get(id);
  }

  async getMutualFundByCode(fundCode: string): Promise<MutualFund | undefined> {
    return Array.from(this.mutualFunds.values()).find(fund => fund.fundCode === fundCode);
  }

  async createMutualFund(fund: InsertMutualFund): Promise<MutualFund> {
    const id = randomUUID();
    const newFund: MutualFund = {
      previousNav: null,
      dayChange: null,
      dayChangePercent: null,
      aum: null,
      expenseRatio: null,
      exitLoad: null,
      minInvestment: "500",
      minSipAmount: "500",
      returns1Month: null,
      returns3Month: null,
      returns6Month: null,
      returns1Year: null,
      returns3Year: null,
      returns5Year: null,
      returnsSinceInception: null,
      fundManager: null,
      navHistory: null,
      inceptionDate: null,
      topHoldings: null,
      sectorAllocation: null,
      isActive: 1,
      ...fund,
      nav: fund.nav.toString(),
      category: fund.category ?? null,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.mutualFunds.set(id, newFund);
    return newFund;
  }

  async updateMutualFund(id: string, fund: Partial<MutualFund>): Promise<MutualFund | undefined> {
    const existing = this.mutualFunds.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...fund, updatedAt: new Date() };
    this.mutualFunds.set(id, updated);
    return updated;
  }

  // SIP Investment operations
  async getSipInvestmentsByUser(userId: string): Promise<SipInvestment[]> {
    return Array.from(this.sipInvestments.values())
      .filter(sip => sip.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSipInvestmentsByFund(fundId: string): Promise<SipInvestment[]> {
    return Array.from(this.sipInvestments.values())
      .filter(sip => sip.fundId === fundId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSipInvestment(id: string): Promise<SipInvestment | undefined> {
    return this.sipInvestments.get(id);
  }

  async createSipInvestment(sip: InsertSipInvestment): Promise<SipInvestment> {
    const id = randomUUID();
    const newSip: SipInvestment = {
      sipDay: null,
      endDate: null,
      endCondition: null,
      installmentsCompleted: 0,
      totalInstallments: null,
      targetAmount: null,
      totalInvested: "0",
      currentValue: "0",
      totalUnits: "0",
      xirr: null,
      cagr: null,
      nextDebitDate: null,
      paymentMethod: "auto_debit",
      mandateId: null,
      escalationFrequency: null,
      ...sip,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sipInvestments.set(id, newSip);
    return newSip;
  }

  async updateSipInvestment(id: string, sip: Partial<SipInvestment>): Promise<SipInvestment | undefined> {
    const existing = this.sipInvestments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...sip, updatedAt: new Date() };
    this.sipInvestments.set(id, updated);
    return updated;
  }

  // SIP Transaction operations
  async getSipTransactionsBySip(sipId: string): Promise<SipTransaction[]> {
    return Array.from(this.sipTransactions.values())
      .filter(txn => txn.sipId === sipId)
      .sort((a, b) => {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSipTransactionsByUser(userId: string): Promise<SipTransaction[]> {
    return Array.from(this.sipTransactions.values())
      .filter(txn => txn.userId === userId)
      .sort((a, b) => {
        const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSipTransaction(id: string): Promise<SipTransaction | undefined> {
    return this.sipTransactions.get(id);
  }

  async createSipTransaction(transaction: InsertSipTransaction): Promise<SipTransaction> {
    const id = randomUUID();
    const newTransaction: SipTransaction = {
      paymentMethod: "auto_debit",
      transactionId: null,
      upiTransactionId: null,
      failureReason: null,
      executedDate: null,
      ...transaction,
      amount: transaction.amount.toString(),
      id,
      createdAt: new Date(),
    };
    this.sipTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateSipTransaction(id: string, transaction: Partial<SipTransaction>): Promise<SipTransaction | undefined> {
    const existing = this.sipTransactions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...transaction, updatedAt: new Date() };
    this.sipTransactions.set(id, updated);
    return updated;
  }

  // Vendor Offer operations
  async getVendorOffers(filters?: { assetType?: string; vendorId?: string; isActive?: number }): Promise<VendorOffer[]> {
    let offers = Array.from(this.vendorOffers.values());
    
    if (filters?.assetType) {
      offers = offers.filter(offer => offer.assetType === filters.assetType);
    }
    if (filters?.vendorId) {
      offers = offers.filter(offer => offer.vendorId === filters.vendorId);
    }
    if (filters?.isActive !== undefined) {
      offers = offers.filter(offer => offer.isActive === filters.isActive);
    }
    
    return offers.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getVendorOffer(id: string): Promise<VendorOffer | undefined> {
    return this.vendorOffers.get(id);
  }

  async createVendorOffer(offer: InsertVendorOffer): Promise<VendorOffer> {
    const id = randomUUID();
    const newOffer: VendorOffer = {
      purity: null,
      spread: null,
      minQuantity: null,
      maxQuantity: null,
      vaultFeeAnnual: null,
      insuranceFee: null,
      shippingFee: null,
      gstPercent: "3",
      certifications: null,
      grade: null,
      description: null,
      imageUrl: null,
      stockAvailable: null,
      minAge: null,
      specifications: null,
      isActive: 1,
      isPremium: 0,
      ...offer,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.vendorOffers.set(id, newOffer);
    return newOffer;
  }

  async updateVendorOffer(id: string, offer: Partial<VendorOffer>): Promise<VendorOffer | undefined> {
    const existing = this.vendorOffers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...offer, updatedAt: new Date() };
    this.vendorOffers.set(id, updated);
    return updated;
  }

  // AI Portfolio Allocation operations
  async getAiPortfolioAllocationsByUser(userId: string): Promise<AiPortfolioAllocation[]> {
    return Array.from(this.aiPortfolioAllocations.values())
      .filter(allocation => allocation.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getAiPortfolioAllocation(id: string): Promise<AiPortfolioAllocation | undefined> {
    return this.aiPortfolioAllocations.get(id);
  }

  async createAiPortfolioAllocation(allocation: InsertAiPortfolioAllocation): Promise<AiPortfolioAllocation> {
    const id = randomUUID();
    const newAllocation: AiPortfolioAllocation = {
      restrictions: null,
      autoRebalance: 0,
      rebalanceFrequency: null,
      backtestResults: null,
      executionSchedule: null,
      totalDebitAmount: null,
      currentValue: null,
      actualReturn: null,
      mandateId: null,
      mandateStatus: null,
      volatility: allocation.volatility || null,
      ...allocation,
      investmentAmount: allocation.investmentAmount.toString(),
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.aiPortfolioAllocations.set(id, newAllocation);
    return newAllocation;
  }

  async updateAiPortfolioAllocation(id: string, allocation: Partial<AiPortfolioAllocation>): Promise<AiPortfolioAllocation | undefined> {
    const existing = this.aiPortfolioAllocations.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...allocation, updatedAt: new Date() };
    this.aiPortfolioAllocations.set(id, updated);
    return updated;
  }

  // Transaction Confirmation operations
  async getTransactionConfirmationsByUser(userId: string): Promise<TransactionConfirmation[]> {
    return Array.from(this.transactionConfirmations.values())
      .filter(confirmation => confirmation.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getTransactionConfirmation(id: string): Promise<TransactionConfirmation | undefined> {
    return this.transactionConfirmations.get(id);
  }

  async getTransactionConfirmationByOrder(orderId: string): Promise<TransactionConfirmation | undefined> {
    return Array.from(this.transactionConfirmations.values()).find(confirmation => confirmation.orderId === orderId);
  }

  async createTransactionConfirmation(confirmation: InsertTransactionConfirmation): Promise<TransactionConfirmation> {
    const id = randomUUID();
    const newConfirmation: TransactionConfirmation = {
      symbol: null,
      vendorName: null,
      unit: null,
      sellPrice: null,
      fees: "0",
      gst: "0",
      profitLoss: null,
      profitLossPercent: null,
      paymentMethod: null,
      upiTransactionId: null,
      deliveryType: null,
      settlementDate: null,
      congratsMessage: null,
      isProfitable: null,
      holdingPeriodDays: null,
      taxClassification: null,
      buyPrice: null,
      pnl: null,
      pnlPercent: null,
      paymentStatus: "pending",
      ...confirmation,
      id,
      createdAt: new Date(),
    };
    this.transactionConfirmations.set(id, newConfirmation);
    return newConfirmation;
  }

  async getTransactionSuccessRecordsByUser(userId: string): Promise<TransactionSuccessRecord[]> {
    return Array.from(this.transactionSuccessRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getTransactionSuccessRecord(id: string): Promise<TransactionSuccessRecord | undefined> {
    return this.transactionSuccessRecords.get(id);
  }

  async createTransactionSuccessRecord(record: InsertTransactionSuccessRecord): Promise<TransactionSuccessRecord> {
    const id = randomUUID();
    const newRecord: TransactionSuccessRecord = {
      assetName: null,
      symbol: null,
      vendorName: null,
      quantity: null,
      unit: null,
      purchasePrice: null,
      sellPrice: null,
      fees: "0",
      gst: "0",
      profitLoss: null,
      profitLossPercent: null,
      isProfitable: 0,
      holdingPeriodDays: null,
      taxClassification: null,
      paymentMethod: null,
      paymentReference: null,
      deliveryType: null,
      settlementDate: null,
      loanDetails: null,
      emiDetails: null,
      billDetails: null,
      couponDescription: null,
      couponCategory: null,
      couponTerms: null,
      couponBrandLogo: null,
      cashbackEarned: "0",
      pointsEarned: 0,
      congratsMessage: null,
      couponValue: record.couponValue ? record.couponValue.toString() : null,
      ...record,
      totalAmount: record.totalAmount.toString(),
      id,
      createdAt: new Date(),
    };
    this.transactionSuccessRecords.set(id, newRecord);
    return newRecord;
  }

  // ============================================================================
  // MOVIE BOOKING OPERATIONS
  // ============================================================================

  // Movies operations
  async getMovies(filters?: { language?: string; genre?: string; isActive?: number }): Promise<Movie[]> {
    let movies = Array.from(this.movies.values());
    
    if (filters?.language) {
      movies = movies.filter(m => m.language === filters.language);
    }
    if (filters?.genre) {
      movies = movies.filter(m => m.genre?.includes(filters.genre!));
    }
    if (filters?.isActive !== undefined) {
      movies = movies.filter(m => m.isActive === filters.isActive);
    }
    
    return movies.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const newMovie: Movie = {
      description: null,
      posterUrl: null,
      bannerUrl: null,
      trailerUrl: null,
      genre: null,
      imdbRating: null,
      cast: null,
      crew: null,
      isActive: 1,
      ...movie,
      id,
      createdAt: new Date(),
    };
    this.movies.set(id, newMovie);
    return newMovie;
  }

  // Theaters operations
  async getTheaters(filters?: { city?: string; area?: string; isActive?: number }): Promise<Theater[]> {
    let theaters = Array.from(this.theaters.values());
    
    if (filters?.city) {
      theaters = theaters.filter(t => t.city === filters.city);
    }
    if (filters?.area) {
      theaters = theaters.filter(t => t.area === filters.area);
    }
    if (filters?.isActive !== undefined) {
      theaters = theaters.filter(t => t.isActive === filters.isActive);
    }
    
    return theaters;
  }

  async getTheater(id: string): Promise<Theater | undefined> {
    return this.theaters.get(id);
  }

  async createTheater(theater: InsertTheater): Promise<Theater> {
    const id = randomUUID();
    const newTheater: Theater = {
      latitude: null,
      longitude: null,
      amenities: null,
      screens: 1,
      isActive: 1,
      ...theater,
      id,
      createdAt: new Date(),
    };
    this.theaters.set(id, newTheater);
    return newTheater;
  }

  // Movie Showtimes operations
  async getMovieShowtimes(filters?: { movieId?: string; theaterId?: string; date?: string }): Promise<(MovieShowtime & { theater: Theater })[]> {
    let showtimes = Array.from(this.movieShowtimes.values());
    
    if (filters?.movieId) {
      showtimes = showtimes.filter(s => s.movieId === filters.movieId);
    }
    if (filters?.theaterId) {
      showtimes = showtimes.filter(s => s.theaterId === filters.theaterId);
    }
    if (filters?.date) {
      const targetDate = new Date(filters.date).toDateString();
      showtimes = showtimes.filter(s => new Date(s.showAt).toDateString() === targetDate);
    }
    
    const sortedShowtimes = showtimes.sort((a, b) => new Date(a.showAt).getTime() - new Date(b.showAt).getTime());
    
    // Include theater information with each showtime
    return sortedShowtimes.map(showtime => {
      const theater = this.theaters.get(showtime.theaterId);
      return { ...showtime, theater: theater! };
    }).filter(s => s.theater);
  }

  async getMovieShowtime(id: string): Promise<MovieShowtime | undefined> {
    return this.movieShowtimes.get(id);
  }

  async createMovieShowtime(showtime: InsertMovieShowtime): Promise<MovieShowtime> {
    const id = randomUUID();
    const newShowtime: MovieShowtime = {
      isActive: 1,
      ...showtime,
      id,
      createdAt: new Date(),
    };
    this.movieShowtimes.set(id, newShowtime);
    return newShowtime;
  }

  async updateMovieShowtime(id: string, showtime: Partial<MovieShowtime>): Promise<MovieShowtime | undefined> {
    const existing = this.movieShowtimes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...showtime };
    this.movieShowtimes.set(id, updated);
    return updated;
  }

  // Seat Categories operations
  async getSeatCategoriesByShowtime(showtimeId: string): Promise<SeatCategory[]> {
    return Array.from(this.seatCategories.values()).filter(c => c.showtimeId === showtimeId);
  }

  async getSeatCategory(id: string): Promise<SeatCategory | undefined> {
    return this.seatCategories.get(id);
  }

  async createSeatCategory(category: InsertSeatCategory): Promise<SeatCategory> {
    const id = randomUUID();
    const newCategory: SeatCategory = {
      ...category,
      price: category.price.toString(),
      id,
      createdAt: new Date(),
    };
    this.seatCategories.set(id, newCategory);
    return newCategory;
  }

  async updateSeatCategory(id: string, category: Partial<SeatCategory>): Promise<SeatCategory | undefined> {
    const existing = this.seatCategories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...category };
    this.seatCategories.set(id, updated);
    return updated;
  }

  // Seat Layout operations
  async getSeatLayoutByShowtime(showtimeId: string): Promise<SeatLayout[]> {
    return Array.from(this.seatLayouts.values())
      .filter(s => s.showtimeId === showtimeId)
      .sort((a, b) => {
        if (a.row !== b.row) return a.row.localeCompare(b.row);
        return a.column - b.column;
      });
  }

  async getSeatLayout(id: string): Promise<SeatLayout | undefined> {
    return this.seatLayouts.get(id);
  }

  async createSeatLayout(seat: InsertSeatLayout): Promise<SeatLayout> {
    const id = randomUUID();
    const newSeat: SeatLayout = {
      ...seat,
      id,
      createdAt: new Date(),
    };
    this.seatLayouts.set(id, newSeat);
    return newSeat;
  }

  async updateSeatLayout(id: string, seat: Partial<SeatLayout>): Promise<SeatLayout | undefined> {
    const existing = this.seatLayouts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...seat };
    this.seatLayouts.set(id, updated);
    return updated;
  }

  // Seat Holds operations
  async getSeatHoldsByUser(userId: string): Promise<SeatHold[]> {
    return Array.from(this.seatHolds.values())
      .filter(h => h.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getSeatHold(id: string): Promise<SeatHold | undefined> {
    return this.seatHolds.get(id);
  }

  async createSeatHold(hold: InsertSeatHold): Promise<SeatHold> {
    const id = randomUUID();
    const newHold: SeatHold = {
      sessionId: null,
      ...hold,
      id,
      createdAt: new Date(),
    };
    this.seatHolds.set(id, newHold);
    return newHold;
  }

  async deleteSeatHold(id: string): Promise<void> {
    this.seatHolds.delete(id);
  }

  async deleteExpiredSeatHolds(): Promise<void> {
    const now = new Date();
    for (const [id, hold] of this.seatHolds.entries()) {
      if (new Date(hold.expiresAt) < now) {
        this.seatHolds.delete(id);
      }
    }
  }

  // Movie Bookings operations
  async getMovieBookingsByUser(userId: string): Promise<MovieBooking[]> {
    return Array.from(this.movieBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getMovieBooking(id: string): Promise<MovieBooking | undefined> {
    return this.movieBookings.get(id);
  }

  async getMovieBookingByReference(bookingReference: string): Promise<MovieBooking | undefined> {
    return Array.from(this.movieBookings.values()).find(b => b.bookingReference === bookingReference);
  }

  async createMovieBooking(booking: InsertMovieBooking): Promise<MovieBooking> {
    const id = randomUUID();
    const newBooking: MovieBooking = {
      seatCategories: null,
      convenienceFee: "0",
      foodAmount: "0",
      foodItems: null,
      qrCode: null,
      paymentMethod: null,
      fundTransactionId: null,
      cancelReason: null,
      refundAmount: null,
      refundStatus: null,
      ...booking,
      id,
      createdAt: new Date(),
    };
    this.movieBookings.set(id, newBooking);
    return newBooking;
  }

  async updateMovieBooking(id: string, booking: Partial<MovieBooking>): Promise<MovieBooking | undefined> {
    const existing = this.movieBookings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...booking };
    this.movieBookings.set(id, updated);
    return updated;
  }

  // Food Menu Items operations
  async getFoodMenuByTheater(theaterId: string): Promise<FoodMenuItem[]> {
    return Array.from(this.foodMenuItems.values())
      .filter(f => f.theaterId === theaterId && f.isActive === 1)
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  async getFoodMenuItem(id: string): Promise<FoodMenuItem | undefined> {
    return this.foodMenuItems.get(id);
  }

  async createFoodMenuItem(item: InsertFoodMenuItem): Promise<FoodMenuItem> {
    const id = randomUUID();
    const newItem: FoodMenuItem = {
      description: null,
      imageUrl: null,
      isCombo: 0,
      comboItems: null,
      isActive: 1,
      ...item,
      price: item.price.toString(),
      id,
      createdAt: new Date(),
    };
    this.foodMenuItems.set(id, newItem);
    return newItem;
  }

  // ============================================================================
  // EVENT BOOKING OPERATIONS
  // ============================================================================

  // Events operations
  async getEvents(filters?: { category?: string; city?: string; isActive?: number }): Promise<Event[]> {
    let events = Array.from(this.events.values());
    
    if (filters?.category) {
      events = events.filter(e => e.category === filters.category);
    }
    if (filters?.city) {
      events = events.filter(e => e.city === filters.city);
    }
    if (filters?.isActive !== undefined) {
      events = events.filter(e => e.isActive === filters.isActive);
    }
    
    return events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = {
      posterUrl: null,
      bannerUrl: null,
      latitude: null,
      longitude: null,
      duration: null,
      organizer: null,
      tags: null,
      ageRestriction: null,
      isActive: 1,
      ...event,
      artistInfo: event.artistInfo || null,
      id,
      createdAt: new Date(),
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined> {
    const existing = this.events.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event };
    this.events.set(id, updated);
    return updated;
  }

  // Event Ticket Tiers operations
  async getEventTicketTiersByEvent(eventId: string): Promise<EventTicketTier[]> {
    return Array.from(this.eventTicketTiers.values())
      .filter(t => t.eventId === eventId && t.isActive === 1)
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  async getEventTicketTier(id: string): Promise<EventTicketTier | undefined> {
    return this.eventTicketTiers.get(id);
  }

  async createEventTicketTier(tier: InsertEventTicketTier): Promise<EventTicketTier> {
    const id = randomUUID();
    const newTier: EventTicketTier = {
      benefits: null,
      color: "#6366f1",
      isActive: 1,
      ...tier,
      price: tier.price.toString(),
      id,
      createdAt: new Date(),
    };
    this.eventTicketTiers.set(id, newTier);
    return newTier;
  }

  async updateEventTicketTier(id: string, tier: Partial<EventTicketTier>): Promise<EventTicketTier | undefined> {
    const existing = this.eventTicketTiers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...tier };
    this.eventTicketTiers.set(id, updated);
    return updated;
  }

  // Event Ticket Holds operations
  async getEventTicketHoldsByUser(userId: string): Promise<EventTicketHold[]> {
    return Array.from(this.eventTicketHolds.values())
      .filter(h => h.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createEventTicketHold(hold: InsertEventTicketHold): Promise<EventTicketHold> {
    const id = randomUUID();
    const newHold: EventTicketHold = {
      sessionId: null,
      ...hold,
      id,
      createdAt: new Date(),
    };
    this.eventTicketHolds.set(id, newHold);
    return newHold;
  }

  async deleteEventTicketHold(id: string): Promise<void> {
    this.eventTicketHolds.delete(id);
  }

  async deleteExpiredEventTicketHolds(): Promise<void> {
    const now = new Date();
    for (const [id, hold] of this.eventTicketHolds.entries()) {
      if (new Date(hold.expiresAt) < now) {
        this.eventTicketHolds.delete(id);
      }
    }
  }

  // Event Bookings operations
  async getEventBookingsByUser(userId: string): Promise<EventBooking[]> {
    return Array.from(this.eventBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getEventBooking(id: string): Promise<EventBooking | undefined> {
    return this.eventBookings.get(id);
  }

  async getEventBookingByReference(bookingReference: string): Promise<EventBooking | undefined> {
    return Array.from(this.eventBookings.values()).find(b => b.bookingReference === bookingReference);
  }

  async createEventBooking(booking: InsertEventBooking): Promise<EventBooking> {
    const id = randomUUID();
    const newBooking: EventBooking = {
      convenienceFee: "0",
      merchandiseAmount: "0",
      merchandiseItems: null,
      attendeeInfo: null,
      qrCodes: null,
      status: "confirmed",
      paymentStatus: "pending",
      paymentMethod: null,
      fundTransactionId: null,
      cancelledAt: null,
      cancelReason: null,
      refundAmount: null,
      refundStatus: null,
      ...booking,
      id,
      createdAt: new Date(),
    };
    this.eventBookings.set(id, newBooking);
    return newBooking;
  }

  async updateEventBooking(id: string, booking: Partial<EventBooking>): Promise<EventBooking | undefined> {
    const existing = this.eventBookings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...booking };
    this.eventBookings.set(id, updated);
    return updated;
  }

  // ============================================================================
  // HOTEL BOOKING OPERATIONS
  // ============================================================================

  // Hotels operations
  async getHotels(filters?: { city?: string; propertyType?: string; minPrice?: number; maxPrice?: number }): Promise<Hotel[]> {
    let hotels = Array.from(this.hotels.values()).filter(h => h.isActive === 1);
    
    if (filters?.city) {
      hotels = hotels.filter(h => h.city === filters.city);
    }
    if (filters?.propertyType) {
      hotels = hotels.filter(h => h.propertyType === filters.propertyType);
    }
    
    return hotels;
  }

  async getHotel(id: string): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async createHotel(hotel: InsertHotel): Promise<Hotel> {
    const id = randomUUID();
    const newHotel: Hotel = {
      description: null,
      images: null,
      amenities: null,
      latitude: null,
      longitude: null,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      starRating: 3,
      reviewRating: null,
      totalReviews: 0,
      cancellationPolicy: null,
      isActive: 1,
      ...hotel,
      id,
      createdAt: new Date(),
    };
    this.hotels.set(id, newHotel);
    return newHotel;
  }

  async updateHotel(id: string, hotel: Partial<Hotel>): Promise<Hotel | undefined> {
    const existing = this.hotels.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...hotel, updatedAt: new Date() };
    this.hotels.set(id, updated);
    return updated;
  }

  // Hotel Rooms operations
  async getHotelRoomsByHotel(hotelId: string): Promise<HotelRoom[]> {
    return Array.from(this.hotelRooms.values())
      .filter(r => r.hotelId === hotelId && r.isActive === 1)
      .sort((a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice));
  }

  async getHotelRoom(id: string): Promise<HotelRoom | undefined> {
    return this.hotelRooms.get(id);
  }

  async createHotelRoom(room: InsertHotelRoom): Promise<HotelRoom> {
    const id = randomUUID();
    const newRoom: HotelRoom = {
      description: null,
      images: null,
      amenities: null,
      bedType: "Double Bed",
      maxOccupancy: 2,
      roomSize: null,
      view: null,
      smokingAllowed: 0,
      isActive: 1,
      ...room,
      basePrice: room.basePrice.toString(),
      id,
      createdAt: new Date(),
    };
    this.hotelRooms.set(id, newRoom);
    return newRoom;
  }

  async updateHotelRoom(id: string, room: Partial<HotelRoom>): Promise<HotelRoom | undefined> {
    const existing = this.hotelRooms.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...room, updatedAt: new Date() };
    this.hotelRooms.set(id, updated);
    return updated;
  }

  // Hotel Room Inventory operations
  async getHotelRoomInventory(roomId: string, date: string): Promise<HotelRoomInventory | undefined> {
    return Array.from(this.hotelRoomInventory.values()).find(
      i => i.roomId === roomId && i.date === date
    );
  }

  async getHotelRoomInventoryRange(roomId: string, startDate: string, endDate: string): Promise<HotelRoomInventory[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.hotelRoomInventory.values())
      .filter(i => {
        if (i.roomId !== roomId) return false;
        const invDate = new Date(i.date);
        return invDate >= start && invDate <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createHotelRoomInventory(inventory: InsertHotelRoomInventory): Promise<HotelRoomInventory> {
    const id = randomUUID();
    const newInventory: HotelRoomInventory = {
      minimumStay: 1,
      ...inventory,
      price: inventory.price ? inventory.price.toString() : null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.hotelRoomInventory.set(id, newInventory);
    return newInventory;
  }

  async updateHotelRoomInventory(id: string, inventory: Partial<HotelRoomInventory>): Promise<HotelRoomInventory | undefined> {
    const existing = this.hotelRoomInventory.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...inventory, updatedAt: new Date() };
    this.hotelRoomInventory.set(id, updated);
    return updated;
  }

  // Hotel Bookings operations
  async getHotelBookingsByUser(userId: string): Promise<HotelBooking[]> {
    return Array.from(this.hotelBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getHotelBooking(id: string): Promise<HotelBooking | undefined> {
    return this.hotelBookings.get(id);
  }

  async getHotelBookingByReference(bookingReference: string): Promise<HotelBooking | undefined> {
    return Array.from(this.hotelBookings.values()).find(b => b.bookingReference === bookingReference);
  }

  async createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking> {
    const id = randomUUID();
    const newBooking: HotelBooking = {
      numberOfRooms: 1,
      specialRequests: null,
      mealPlan: "room_only",
      cancellationPolicySnapshot: null,
      status: "confirmed",
      paymentStatus: "pending",
      paymentMethod: null,
      fundTransactionId: null,
      checkInStatus: null,
      checkOutStatus: null,
      actualCheckIn: null,
      actualCheckOut: null,
      earlyCheckIn: 0,
      lateCheckOut: 0,
      additionalCharges: "0",
      cancelledAt: null,
      cancelReason: null,
      refundAmount: null,
      refundStatus: null,
      ...booking,
      id,
      createdAt: new Date(),
    };
    this.hotelBookings.set(id, newBooking);
    return newBooking;
  }

  async updateHotelBooking(id: string, booking: Partial<HotelBooking>): Promise<HotelBooking | undefined> {
    const existing = this.hotelBookings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...booking };
    this.hotelBookings.set(id, updated);
    return updated;
  }

  // Hotel Reviews operations
  async getHotelReviewsByHotel(hotelId: string): Promise<HotelReview[]> {
    return Array.from(this.hotelReviews.values())
      .filter(r => r.hotelId === hotelId && r.isPublic === 1)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getHotelReviewsByUser(userId: string): Promise<HotelReview[]> {
    return Array.from(this.hotelReviews.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createHotelReview(review: InsertHotelReview): Promise<HotelReview> {
    const id = randomUUID();
    const newReview: HotelReview = {
      cleanlinessRating: null,
      serviceRating: null,
      locationRating: null,
      valueRating: null,
      reviewText: null,
      images: null,
      isVerified: 1,
      isPublic: 1,
      ...review,
      id,
      createdAt: new Date(),
    };
    this.hotelReviews.set(id, newReview);
    return newReview;
  }

  // ============================================================================
  // Metro Booking Operations
  // ============================================================================

  async getMetroStations(filters?: { city?: string; metroLine?: string }): Promise<MetroStation[]> {
    let stations = Array.from(this.metroStations.values());
    
    if (filters?.city) {
      stations = stations.filter(s => s.city.toLowerCase() === filters.city!.toLowerCase());
    }
    
    if (filters?.metroLine) {
      stations = stations.filter(s => s.metroLine === filters.metroLine);
    }
    
    return stations.sort((a, b) => a.stationName.localeCompare(b.stationName));
  }

  async getMetroStation(id: string): Promise<MetroStation | undefined> {
    return this.metroStations.get(id);
  }

  async getMetroStationByCode(stationCode: string): Promise<MetroStation | undefined> {
    return Array.from(this.metroStations.values()).find(s => s.stationCode === stationCode);
  }

  async createMetroStation(station: InsertMetroStation): Promise<MetroStation> {
    const id = randomUUID();
    const newStation: MetroStation = {
      latitude: null,
      longitude: null,
      facilities: null,
      isActive: 1,
      ...station,
      id,
      createdAt: new Date(),
    };
    this.metroStations.set(id, newStation);
    return newStation;
  }

  async updateMetroStation(id: string, station: Partial<MetroStation>): Promise<MetroStation | undefined> {
    const existing = this.metroStations.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...station };
    this.metroStations.set(id, updated);
    return updated;
  }

  async getMetroRoutes(filters?: { fromStationId?: string; toStationId?: string; metroLine?: string }): Promise<MetroRoute[]> {
    let routes = Array.from(this.metroRoutes.values());
    
    if (filters?.fromStationId) {
      routes = routes.filter(r => r.fromStationId === filters.fromStationId);
    }
    
    if (filters?.toStationId) {
      routes = routes.filter(r => r.toStationId === filters.toStationId);
    }
    
    if (filters?.metroLine) {
      routes = routes.filter(r => r.metroLine === filters.metroLine);
    }
    
    return routes;
  }

  async getMetroRoute(id: string): Promise<MetroRoute | undefined> {
    return this.metroRoutes.get(id);
  }

  async searchMetroRoutes(fromStationId: string, toStationId: string): Promise<MetroRoute[]> {
    return Array.from(this.metroRoutes.values()).filter(
      r => r.fromStationId === fromStationId && r.toStationId === toStationId
    );
  }

  async createMetroRoute(route: InsertMetroRoute): Promise<MetroRoute> {
    const id = randomUUID();
    const newRoute: MetroRoute = {
      intermediateStations: null,
      peakHourFare: null,
      frequency: 5,
      isActive: 1,
      ...route,
      id,
      createdAt: new Date(),
    };
    this.metroRoutes.set(id, newRoute);
    return newRoute;
  }

  async updateMetroRoute(id: string, route: Partial<MetroRoute>): Promise<MetroRoute | undefined> {
    const existing = this.metroRoutes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...route };
    this.metroRoutes.set(id, updated);
    return updated;
  }

  async getMetroSmartCardsByUser(userId: string): Promise<MetroSmartCard[]> {
    return Array.from(this.metroSmartCards.values()).filter(c => c.userId === userId);
  }

  async getMetroSmartCard(id: string): Promise<MetroSmartCard | undefined> {
    return this.metroSmartCards.get(id);
  }

  async getMetroSmartCardByNumber(cardNumber: string): Promise<MetroSmartCard | undefined> {
    return Array.from(this.metroSmartCards.values()).find(c => c.cardNumber === cardNumber);
  }

  async createMetroSmartCard(card: InsertMetroSmartCard): Promise<MetroSmartCard> {
    const id = randomUUID();
    const newCard: MetroSmartCard = {
      balance: "0",
      expiryDate: null,
      status: "active",
      lastRechargeDate: null,
      ...card,
      id,
      createdAt: new Date(),
    };
    this.metroSmartCards.set(id, newCard);
    return newCard;
  }

  async updateMetroSmartCard(id: string, card: Partial<MetroSmartCard>): Promise<MetroSmartCard | undefined> {
    const existing = this.metroSmartCards.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...card };
    this.metroSmartCards.set(id, updated);
    return updated;
  }

  async getMetroTicketsByUser(userId: string): Promise<MetroTicket[]> {
    return Array.from(this.metroTickets.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMetroTicket(id: string): Promise<MetroTicket | undefined> {
    return this.metroTickets.get(id);
  }

  async getMetroTicketByReference(ticketReference: string): Promise<MetroTicket | undefined> {
    return Array.from(this.metroTickets.values()).find(t => t.ticketReference === ticketReference);
  }

  async createMetroTicket(ticket: InsertMetroTicket): Promise<MetroTicket> {
    const id = randomUUID();
    const ticketReference = `MET${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newTicket: MetroTicket = {
      fromStationId: null,
      toStationId: null,
      fromStationName: null,
      toStationName: null,
      metroLine: null,
      numberOfPassengers: 1,
      convenienceFee: "0",
      qrCode: null,
      status: "active",
      usedAt: null,
      smartCardId: null,
      rechargeAmount: null,
      paymentStatus: "pending",
      paymentMethod: null,
      fundTransactionId: null,
      stripePaymentId: null,
      ...ticket,
      id,
      ticketReference,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.metroTickets.set(id, newTicket);
    return newTicket;
  }

  async updateMetroTicket(id: string, ticket: Partial<MetroTicket>): Promise<MetroTicket | undefined> {
    const existing = this.metroTickets.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...ticket, updatedAt: new Date() };
    this.metroTickets.set(id, updated);
    return updated;
  }

  async getMetroTravelHistoryByUser(userId: string): Promise<MetroTravelHistory[]> {
    return Array.from(this.metroTravelHistory.values())
      .filter(h => h.userId === userId)
      .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
  }

  async getMetroTravelHistoryByTicket(ticketId: string): Promise<MetroTravelHistory[]> {
    return Array.from(this.metroTravelHistory.values())
      .filter(h => h.ticketId === ticketId)
      .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
  }

  async getMetroTravelHistoryBySmartCard(smartCardId: string): Promise<MetroTravelHistory[]> {
    return Array.from(this.metroTravelHistory.values())
      .filter(h => h.smartCardId === smartCardId)
      .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
  }

  async createMetroTravelHistory(history: InsertMetroTravelHistory): Promise<MetroTravelHistory> {
    const id = randomUUID();
    const newHistory: MetroTravelHistory = {
      ticketId: null,
      smartCardId: null,
      exitStationId: null,
      exitTime: null,
      distance: null,
      ...history,
      id,
      createdAt: new Date(),
    };
    this.metroTravelHistory.set(id, newHistory);
    return newHistory;
  }

  // ============================================================================
  // Rental Booking Operations
  // ============================================================================

  async getRentalVehicles(filters?: { vehicleType?: string; city?: string; category?: string; status?: string }): Promise<RentalVehicle[]> {
    let vehicles = Array.from(this.rentalVehicles.values());
    
    if (filters?.vehicleType) {
      vehicles = vehicles.filter(v => v.vehicleType === filters.vehicleType);
    }
    
    if (filters?.city) {
      vehicles = vehicles.filter(v => v.city.toLowerCase() === filters.city!.toLowerCase());
    }
    
    if (filters?.category) {
      vehicles = vehicles.filter(v => v.category === filters.category);
    }
    
    if (filters?.status) {
      vehicles = vehicles.filter(v => v.status === filters.status);
    }
    
    return vehicles.filter(v => v.isActive === 1);
  }

  async getRentalVehicle(id: string): Promise<RentalVehicle | undefined> {
    return this.rentalVehicles.get(id);
  }

  async createRentalVehicle(vehicle: InsertRentalVehicle): Promise<RentalVehicle> {
    const id = randomUUID();
    const newVehicle: RentalVehicle = {
      color: null,
      images: null,
      features: null,
      mileageLimit: 150,
      extraMileageCharge: "8",
      hourlyRate: null,
      weeklyRate: null,
      monthlyRate: null,
      insuranceIncluded: 1,
      minimumAge: 21,
      licenseDuration: 12,
      rating: "4.5",
      totalBookings: 0,
      status: "available",
      isActive: 1,
      ...vehicle,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rentalVehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateRentalVehicle(id: string, vehicle: Partial<RentalVehicle>): Promise<RentalVehicle | undefined> {
    const existing = this.rentalVehicles.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...vehicle, updatedAt: new Date() };
    this.rentalVehicles.set(id, updated);
    return updated;
  }

  async getRentalLocations(filters?: { city?: string; isPickupPoint?: number; isDropoffPoint?: number }): Promise<RentalLocation[]> {
    let locations = Array.from(this.rentalLocations.values());
    
    if (filters?.city) {
      locations = locations.filter(l => l.city.toLowerCase() === filters.city!.toLowerCase());
    }
    
    if (filters?.isPickupPoint !== undefined) {
      locations = locations.filter(l => l.isPickupPoint === filters.isPickupPoint);
    }
    
    if (filters?.isDropoffPoint !== undefined) {
      locations = locations.filter(l => l.isDropoffPoint === filters.isDropoffPoint);
    }
    
    return locations.filter(l => l.isActive === 1);
  }

  async getRentalLocation(id: string): Promise<RentalLocation | undefined> {
    return this.rentalLocations.get(id);
  }

  async createRentalLocation(location: InsertRentalLocation): Promise<RentalLocation> {
    const id = randomUUID();
    const newLocation: RentalLocation = {
      landmark: null,
      latitude: null,
      longitude: null,
      operatingHours: null,
      contactPhone: null,
      isPickupPoint: 1,
      isDropoffPoint: 1,
      isActive: 1,
      ...location,
      id,
      createdAt: new Date(),
    };
    this.rentalLocations.set(id, newLocation);
    return newLocation;
  }

  async updateRentalLocation(id: string, location: Partial<RentalLocation>): Promise<RentalLocation | undefined> {
    const existing = this.rentalLocations.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...location };
    this.rentalLocations.set(id, updated);
    return updated;
  }

  async getRentalBookingsByUser(userId: string): Promise<RentalBooking[]> {
    return Array.from(this.rentalBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRentalBooking(id: string): Promise<RentalBooking | undefined> {
    return this.rentalBookings.get(id);
  }

  async getRentalBookingByReference(bookingReference: string): Promise<RentalBooking | undefined> {
    return Array.from(this.rentalBookings.values()).find(b => b.bookingReference === bookingReference);
  }

  async createRentalBooking(booking: InsertRentalBooking): Promise<RentalBooking> {
    const id = randomUUID();
    const bookingReference = `REN${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newBooking: RentalBooking = {
      extraCharges: "0",
      amountPaid: "0",
      depositRefundStatus: "pending",
      depositRefundAmount: null,
      licenseVerificationStatus: "pending",
      licenseImages: null,
      additionalDrivers: null,
      insuranceOption: "basic",
      insuranceAmount: "0",
      addons: null,
      addonAmount: "0",
      fuelLevel: null,
      preInspectionImages: null,
      postInspectionImages: null,
      preInspectionNotes: null,
      postInspectionNotes: null,
      mileageStart: null,
      mileageEnd: null,
      totalMileage: null,
      extraMileageCharge: "0",
      status: "confirmed",
      paymentStatus: "pending",
      paymentMethod: null,
      fundTransactionId: null,
      stripePaymentId: null,
      actualPickupTime: null,
      actualDropoffTime: null,
      cancellationReason: null,
      cancellationCharge: null,
      refundAmount: null,
      refundStatus: null,
      specialRequests: null,
      ...booking,
      id,
      bookingReference,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rentalBookings.set(id, newBooking);
    return newBooking;
  }

  async updateRentalBooking(id: string, booking: Partial<RentalBooking>): Promise<RentalBooking | undefined> {
    const existing = this.rentalBookings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...booking, updatedAt: new Date() };
    this.rentalBookings.set(id, updated);
    return updated;
  }

  async getRentalReviewsByVehicle(vehicleId: string): Promise<RentalReview[]> {
    return Array.from(this.rentalReviews.values())
      .filter(r => r.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRentalReviewsByUser(userId: string): Promise<RentalReview[]> {
    return Array.from(this.rentalReviews.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRentalTripByBooking(bookingId: string): Promise<RentalTrip | undefined> {
    return Array.from(this.rentalTrips.values())
      .find(t => t.bookingId === bookingId);
  }

  async getRentalTrip(id: string): Promise<RentalTrip | undefined> {
    return this.rentalTrips.get(id);
  }

  async createRentalTrip(trip: InsertRentalTrip): Promise<RentalTrip> {
    const id = randomUUID();
    const newTrip: RentalTrip = {
      ...trip,
      id,
      status: trip.status || "not_started",
      digitalKeyStatus: trip.digitalKeyStatus || "locked",
      digitalKeyCode: trip.digitalKeyCode || null,
      tripStartTime: trip.tripStartTime || null,
      tripEndTime: trip.tripEndTime || null,
      currentLatitude: trip.currentLatitude || null,
      currentLongitude: trip.currentLongitude || null,
      currentFuelLevel: trip.currentFuelLevel || null,
      currentMileage: trip.currentMileage || null,
      distanceTraveled: trip.distanceTraveled || "0",
      emergencyContactName: trip.emergencyContactName || null,
      emergencyContactPhone: trip.emergencyContactPhone || null,
      emergencyContactRelation: trip.emergencyContactRelation || null,
      sosActivated: trip.sosActivated || 0,
      sosTimestamp: trip.sosTimestamp || null,
      sosLocation: trip.sosLocation || null,
      lastCheckpointTime: trip.lastCheckpointTime || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rentalTrips.set(id, newTrip);
    return newTrip;
  }

  async updateRentalTrip(id: string, trip: Partial<RentalTrip>): Promise<RentalTrip | undefined> {
    const existing = this.rentalTrips.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...trip, updatedAt: new Date() };
    this.rentalTrips.set(id, updated);
    return updated;
  }

  async getRentalTripCheckpoints(tripId: string): Promise<RentalTripCheckpoint[]> {
    return Array.from(this.rentalTripCheckpoints.values())
      .filter(c => c.tripId === tripId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createRentalTripCheckpoint(checkpoint: InsertRentalTripCheckpoint): Promise<RentalTripCheckpoint> {
    const id = randomUUID();
    const newCheckpoint: RentalTripCheckpoint = {
      ...checkpoint,
      id,
      latitude: checkpoint.latitude || null,
      longitude: checkpoint.longitude || null,
      address: checkpoint.address || null,
      fuelLevel: checkpoint.fuelLevel || null,
      mileage: checkpoint.mileage || null,
      speed: checkpoint.speed || null,
      notes: checkpoint.notes || null,
      metadata: checkpoint.metadata || null,
      timestamp: new Date(),
    };
    this.rentalTripCheckpoints.set(id, newCheckpoint);
    return newCheckpoint;
  }

  async getRentalDocumentsByBooking(bookingId: string): Promise<RentalDocument[]> {
    return Array.from(this.rentalDocuments.values())
      .filter(d => d.bookingId === bookingId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRentalDocument(id: string): Promise<RentalDocument | undefined> {
    return this.rentalDocuments.get(id);
  }

  async createRentalDocument(document: InsertRentalDocument): Promise<RentalDocument> {
    const id = randomUUID();
    const newDocument: RentalDocument = {
      ...document,
      id,
      verificationStatus: document.verificationStatus || "pending",
      verificationNotes: document.verificationNotes || null,
      verifiedBy: document.verifiedBy || null,
      verifiedAt: document.verifiedAt || null,
      expiryDate: document.expiryDate || null,
      metadata: document.metadata || null,
      createdAt: new Date(),
    };
    this.rentalDocuments.set(id, newDocument);
    return newDocument;
  }

  async updateRentalDocument(id: string, document: Partial<RentalDocument>): Promise<RentalDocument | undefined> {
    const existing = this.rentalDocuments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...document };
    this.rentalDocuments.set(id, updated);
    return updated;
  }

  async getRentalInspectionsByBooking(bookingId: string): Promise<RentalVehicleInspection[]> {
    return Array.from(this.rentalInspections.values())
      .filter(i => i.bookingId === bookingId)
      .sort((a, b) => b.inspectedAt.getTime() - a.inspectedAt.getTime());
  }

  async getRentalInspection(id: string): Promise<RentalVehicleInspection | undefined> {
    return this.rentalInspections.get(id);
  }

  async createRentalInspection(inspection: InsertRentalVehicleInspection): Promise<RentalVehicleInspection> {
    const id = randomUUID();
    const newInspection: RentalVehicleInspection = {
      ...inspection,
      id,
      fuelLevel: inspection.fuelLevel || null,
      mileage: inspection.mileage || null,
      exteriorCondition: inspection.exteriorCondition || null,
      interiorCondition: inspection.interiorCondition || null,
      tiresCondition: inspection.tiresCondition || null,
      documents: inspection.documents || null,
      issues: inspection.issues || null,
      images: inspection.images || null,
      notes: inspection.notes || null,
      signature: inspection.signature || null,
      location: inspection.location || null,
      inspectedAt: new Date(),
      createdAt: new Date(),
    };
    this.rentalInspections.set(id, newInspection);
    return newInspection;
  }

  async getTravelVipMembershipByUser(userId: string): Promise<TravelVipMembership | undefined> {
    return Array.from(this.travelVipMemberships.values())
      .find(membership => membership.userId === userId);
  }

  async createTravelVipMembership(insertMembership: InsertTravelVipMembership): Promise<TravelVipMembership> {
    const id = randomUUID();
    const membership: TravelVipMembership = {
      ...insertMembership,
      id,
      tier: insertMembership.tier || 'silver',
      status: insertMembership.status || 'active',
      joinedAt: insertMembership.joinedAt || new Date(),
      expiresAt: insertMembership.expiresAt || null,
      autoRenew: insertMembership.autoRenew ?? 1,
      benefitsRemaining: insertMembership.benefitsRemaining || null,
      totalBenefitsUsed: insertMembership.totalBenefitsUsed || 0,
      totalSavings: insertMembership.totalSavings || "0",
      membershipNumber: insertMembership.membershipNumber || null,
      referralCode: insertMembership.referralCode || null,
      referralCount: insertMembership.referralCount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.travelVipMemberships.set(id, membership);
    return membership;
  }

  async updateTravelVipMembership(id: string, updates: Partial<TravelVipMembership>): Promise<TravelVipMembership | undefined> {
    const existing = this.travelVipMemberships.get(id);
    if (!existing) return undefined;
    
    const updated: TravelVipMembership = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.travelVipMemberships.set(id, updated);
    return updated;
  }

  async getTravelVipBenefitsByUser(userId: string): Promise<TravelVipBenefitsUsage[]> {
    return Array.from(this.travelVipBenefitsUsage.values())
      .filter(usage => usage.userId === userId)
      .sort((a, b) => {
        const dateA = a.usedAt ? new Date(a.usedAt).getTime() : 0;
        const dateB = b.usedAt ? new Date(b.usedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createTravelVipBenefitUsage(insertUsage: InsertTravelVipBenefitsUsage): Promise<TravelVipBenefitsUsage> {
    const id = randomUUID();
    const usage: TravelVipBenefitsUsage = {
      ...insertUsage,
      id,
      benefitType: insertUsage.benefitType || null,
      benefitValue: insertUsage.benefitValue || null,
      bookingReference: insertUsage.bookingReference || null,
      serviceType: insertUsage.serviceType || null,
      savingsAmount: insertUsage.savingsAmount || null,
      usedAt: insertUsage.usedAt || new Date(),
      createdAt: new Date(),
    };
    this.travelVipBenefitsUsage.set(id, usage);
    return usage;
  }

  async getTravelVipTransactionsByUser(userId: string): Promise<TravelVipTransaction[]> {
    return Array.from(this.travelVipTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => {
        const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
        const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createTravelVipTransaction(insertTransaction: InsertTravelVipTransaction): Promise<TravelVipTransaction> {
    const id = randomUUID();
    const transaction: TravelVipTransaction = {
      ...insertTransaction,
      id,
      transactionType: insertTransaction.transactionType || null,
      amount: insertTransaction.amount || "0",
      description: insertTransaction.description || null,
      paymentMethod: insertTransaction.paymentMethod || null,
      paymentStatus: insertTransaction.paymentStatus || 'pending',
      invoiceUrl: insertTransaction.invoiceUrl || null,
      transactionDate: insertTransaction.transactionDate || new Date(),
      createdAt: new Date(),
    };
    this.travelVipTransactions.set(id, transaction);
    return transaction;
  }

  async createRentalReview(review: InsertRentalReview): Promise<RentalReview> {
    const id = randomUUID();
    const newReview: RentalReview = {
      vehicleConditionRating: null,
      cleanlinessRating: null,
      serviceRating: null,
      valueRating: null,
      reviewText: null,
      images: null,
      isVerified: 1,
      isPublic: 1,
      ...review,
      id,
      createdAt: new Date(),
    };
    this.rentalReviews.set(id, newReview);
    return newReview;
  }

  // Credit UPI operations
  async getCreditUpiAccountByUser(userId: string): Promise<CreditUpiAccount | undefined> {
    return Array.from(this.creditUpiAccounts.values())
      .find(account => account.userId === userId);
  }

  async getCreditUpiAccount(id: string): Promise<CreditUpiAccount | undefined> {
    return this.creditUpiAccounts.get(id);
  }

  async createCreditUpiAccount(insertAccount: InsertCreditUpiAccount): Promise<CreditUpiAccount> {
    const id = randomUUID();
    const account: CreditUpiAccount = {
      ...insertAccount,
      id,
      creditLimit: insertAccount.creditLimit || "0",
      availableLimit: insertAccount.availableLimit || insertAccount.creditLimit || "0",
      usedLimit: insertAccount.usedLimit || "0",
      outstandingAmount: insertAccount.outstandingAmount || "0",
      interestRate: insertAccount.interestRate || "24.00",
      annualFee: insertAccount.annualFee || "499",
      processingFee: insertAccount.processingFee || "1.5",
      latePaymentPenalty: insertAccount.latePaymentPenalty || "3.0",
      billingDate: insertAccount.billingDate || 1,
      dueDate: insertAccount.dueDate || 16,
      upiPin: insertAccount.upiPin || null,
      status: insertAccount.status || 'active',
      isActivated: insertAccount.isActivated || 0,
      activatedAt: insertAccount.activatedAt || null,
      lastBillingDate: insertAccount.lastBillingDate || null,
      nextBillingDate: insertAccount.nextBillingDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.creditUpiAccounts.set(id, account);
    return account;
  }

  async updateCreditUpiAccount(id: string, updates: Partial<CreditUpiAccount>): Promise<CreditUpiAccount | undefined> {
    const existing = this.creditUpiAccounts.get(id);
    if (!existing) return undefined;
    
    const updated: CreditUpiAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.creditUpiAccounts.set(id, updated);
    return updated;
  }

  async getCreditUpiTransactionsByAccount(accountId: string): Promise<CreditUpiTransaction[]> {
    return Array.from(this.creditUpiTransactions.values())
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCreditUpiTransactionsByUser(userId: string): Promise<CreditUpiTransaction[]> {
    return Array.from(this.creditUpiTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCreditUpiTransaction(id: string): Promise<CreditUpiTransaction | undefined> {
    return this.creditUpiTransactions.get(id);
  }

  async createCreditUpiTransaction(insertTransaction: InsertCreditUpiTransaction): Promise<CreditUpiTransaction> {
    const id = randomUUID();
    const transaction: CreditUpiTransaction = {
      ...insertTransaction,
      id,
      transactionType: insertTransaction.transactionType || 'payment',
      merchantUpi: insertTransaction.merchantUpi || null,
      status: insertTransaction.status || 'success',
      description: insertTransaction.description || null,
      category: insertTransaction.category || 'shopping',
      emiConverted: insertTransaction.emiConverted || 0,
      emiMonths: insertTransaction.emiMonths || null,
      balanceBefore: insertTransaction.balanceBefore || null,
      balanceAfter: insertTransaction.balanceAfter || null,
      metadata: insertTransaction.metadata || null,
      createdAt: new Date(),
    };
    this.creditUpiTransactions.set(id, transaction);
    return transaction;
  }

  async getCreditUpiRepaymentsByAccount(accountId: string): Promise<CreditUpiRepayment[]> {
    return Array.from(this.creditUpiRepayments.values())
      .filter(repayment => repayment.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCreditUpiRepaymentsByUser(userId: string): Promise<CreditUpiRepayment[]> {
    return Array.from(this.creditUpiRepayments.values())
      .filter(repayment => repayment.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCreditUpiRepayment(id: string): Promise<CreditUpiRepayment | undefined> {
    return this.creditUpiRepayments.get(id);
  }

  async createCreditUpiRepayment(insertRepayment: InsertCreditUpiRepayment): Promise<CreditUpiRepayment> {
    const id = randomUUID();
    const repayment: CreditUpiRepayment = {
      ...insertRepayment,
      id,
      repaymentType: insertRepayment.repaymentType || 'full',
      paymentMethod: insertRepayment.paymentMethod || 'upi',
      billId: insertRepayment.billId || null,
      status: insertRepayment.status || 'success',
      principalAmount: insertRepayment.principalAmount || "0",
      interestAmount: insertRepayment.interestAmount || "0",
      latePaymentCharges: insertRepayment.latePaymentCharges || "0",
      description: insertRepayment.description || null,
      processedAt: new Date(),
      createdAt: new Date(),
    };
    this.creditUpiRepayments.set(id, repayment);
    return repayment;
  }

  async getCreditUpiBillsByAccount(accountId: string): Promise<CreditUpiBill[]> {
    return Array.from(this.creditUpiBills.values())
      .filter(bill => bill.accountId === accountId)
      .sort((a, b) => new Date(b.billDate || 0).getTime() - new Date(a.billDate || 0).getTime());
  }

  async getCreditUpiBillsByUser(userId: string): Promise<CreditUpiBill[]> {
    return Array.from(this.creditUpiBills.values())
      .filter(bill => bill.userId === userId)
      .sort((a, b) => new Date(b.billDate || 0).getTime() - new Date(a.billDate || 0).getTime());
  }

  async getCreditUpiBill(id: string): Promise<CreditUpiBill | undefined> {
    return this.creditUpiBills.get(id);
  }

  async getCurrentCreditUpiBill(accountId: string): Promise<CreditUpiBill | undefined> {
    const bills = Array.from(this.creditUpiBills.values())
      .filter(bill => bill.accountId === accountId && bill.isPaid === 0)
      .sort((a, b) => new Date(b.billDate || 0).getTime() - new Date(a.billDate || 0).getTime());
    
    return bills[0];
  }

  async createCreditUpiBill(insertBill: InsertCreditUpiBill): Promise<CreditUpiBill> {
    const id = randomUUID();
    const bill: CreditUpiBill = {
      ...insertBill,
      id,
      interestAmount: insertBill.interestAmount || "0",
      latePaymentCharges: insertBill.latePaymentCharges || "0",
      amountPaid: insertBill.amountPaid || "0",
      status: insertBill.status || 'unpaid',
      isPaid: insertBill.isPaid || 0,
      paidAt: insertBill.paidAt || null,
      transactionCount: insertBill.transactionCount || 0,
      gracePeriodDays: insertBill.gracePeriodDays || 15,
      metadata: insertBill.metadata || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.creditUpiBills.set(id, bill);
    return bill;
  }

  async updateCreditUpiBill(id: string, updates: Partial<CreditUpiBill>): Promise<CreditUpiBill | undefined> {
    const existing = this.creditUpiBills.get(id);
    if (!existing) return undefined;
    
    const updated: CreditUpiBill = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.creditUpiBills.set(id, updated);
    return updated;
  }

  // Family UPI operations
  async getFamilyUpiAccountsByUser(userId: string): Promise<FamilyUpiAccount[]> {
    return Array.from(this.familyUpiAccounts.values())
      .filter(account => account.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getFamilyUpiAccount(id: string): Promise<FamilyUpiAccount | undefined> {
    return this.familyUpiAccounts.get(id);
  }

  async createFamilyUpiAccount(insertAccount: InsertFamilyUpiAccount): Promise<FamilyUpiAccount> {
    const id = randomUUID();
    const now = new Date();
    const account: FamilyUpiAccount = {
      id,
      ...insertAccount,
      memberCount: 1,
      totalSpent: "0",
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.familyUpiAccounts.set(id, account);
    return account;
  }

  async updateFamilyUpiAccount(id: string, updates: Partial<FamilyUpiAccount>): Promise<FamilyUpiAccount | undefined> {
    const account = this.familyUpiAccounts.get(id);
    if (!account) return undefined;
    
    const updated: FamilyUpiAccount = {
      ...account,
      ...updates,
      updatedAt: new Date(),
    };
    this.familyUpiAccounts.set(id, updated);
    return updated;
  }

  async deleteFamilyUpiAccount(id: string): Promise<void> {
    // Also delete all members of this account
    const members = Array.from(this.familyUpiMembers.values())
      .filter(member => member.familyAccountId === id);
    members.forEach(member => this.familyUpiMembers.delete(member.id));
    
    // Delete all transactions
    const transactions = Array.from(this.familyUpiTransactions.values())
      .filter(txn => txn.familyAccountId === id);
    transactions.forEach(txn => this.familyUpiTransactions.delete(txn.id));
    
    this.familyUpiAccounts.delete(id);
  }

  async getFamilyUpiMembersByAccount(familyAccountId: string): Promise<FamilyUpiMember[]> {
    return Array.from(this.familyUpiMembers.values())
      .filter(member => member.familyAccountId === familyAccountId && member.isActive === 1)
      .sort((a, b) => {
        // Owner first, then admin, then members
        const roleOrder = { owner: 0, admin: 1, member: 2 };
        return (roleOrder[a.role as keyof typeof roleOrder] || 2) - (roleOrder[b.role as keyof typeof roleOrder] || 2);
      });
  }

  async getFamilyUpiMember(id: string): Promise<FamilyUpiMember | undefined> {
    return this.familyUpiMembers.get(id);
  }

  async createFamilyUpiMember(insertMember: InsertFamilyUpiMember): Promise<FamilyUpiMember> {
    const id = randomUUID();
    const now = new Date();
    const member: FamilyUpiMember = {
      id,
      ...insertMember,
      isActive: 1,
      joinedAt: now,
    };
    this.familyUpiMembers.set(id, member);
    return member;
  }

  async updateFamilyUpiMember(id: string, updates: Partial<FamilyUpiMember>): Promise<FamilyUpiMember | undefined> {
    const member = this.familyUpiMembers.get(id);
    if (!member) return undefined;
    
    const updated: FamilyUpiMember = {
      ...member,
      ...updates,
    };
    this.familyUpiMembers.set(id, updated);
    return updated;
  }

  async deleteFamilyUpiMember(id: string): Promise<void> {
    this.familyUpiMembers.delete(id);
  }

  async getFamilyUpiTransactionsByAccount(familyAccountId: string): Promise<FamilyUpiTransaction[]> {
    return Array.from(this.familyUpiTransactions.values())
      .filter(txn => txn.familyAccountId === familyAccountId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getFamilyUpiTransaction(id: string): Promise<FamilyUpiTransaction | undefined> {
    return this.familyUpiTransactions.get(id);
  }

  async createFamilyUpiTransaction(insertTransaction: InsertFamilyUpiTransaction): Promise<FamilyUpiTransaction> {
    const id = randomUUID();
    const now = new Date();
    const transaction: FamilyUpiTransaction = {
      id,
      ...insertTransaction,
      createdAt: now,
    };
    this.familyUpiTransactions.set(id, transaction);
    return transaction;
  }

  // Family UPI Detail & Analytics operations
  async getFamilyUpiAccountDetails(accountId: string) {
    const account = await this.getFamilyUpiAccount(accountId);
    if (!account) return undefined;

    const transactions = await this.getFamilyUpiTransactionsByAccount(accountId);
    const members = await this.getFamilyUpiMembersByAccount(accountId);

    // Calculate stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const successfulTransactions = transactions.filter(t => t.status === 'success');
    const failedTransactions = transactions.filter(t => t.status === 'failed');
    
    const totalSpent = successfulTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0).toFixed(2);
    
    const dailySpent = successfulTransactions
      .filter(t => new Date(t.createdAt || 0) >= today)
      .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)
      .toFixed(2);

    const monthlySpent = successfulTransactions
      .filter(t => new Date(t.createdAt || 0) >= monthStart)
      .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)
      .toFixed(2);

    const limitUtilization = parseFloat(account.monthlyLimit || '0') > 0
      ? (parseFloat(monthlySpent) / parseFloat(account.monthlyLimit || '1')) * 100
      : 0;

    // Get recent transactions with member names (already sorted by getFamilyUpiTransactionsByAccount)
    const recentTransactions = transactions.slice(0, 10).map(txn => {
      const member = members.find(m => m.id === txn.initiatedBy);
      return {
        ...txn,
        memberName: member?.memberName || 'Unknown'
      };
    });

    return {
      account,
      stats: {
        totalTransactions: transactions.length,
        successfulTransactions: successfulTransactions.length,
        failedTransactions: failedTransactions.length,
        totalSpent,
        dailySpent,
        monthlySpent,
        limitUtilization: Math.round(limitUtilization * 100) / 100,
      },
      recentTransactions,
    };
  }

  async getFamilyUpiTransactionsWithMembers(accountId: string) {
    const transactions = await this.getFamilyUpiTransactionsByAccount(accountId);
    const members = await this.getFamilyUpiMembersByAccount(accountId);

    return transactions.map(txn => {
      const member = members.find(m => m.id === txn.initiatedBy);
      const approver = txn.approvedBy ? members.find(m => m.id === txn.approvedBy) : undefined;
      
      return {
        ...txn,
        memberName: member?.memberName || 'Unknown',
        approverName: approver?.memberName,
      };
    });
  }

  async getFamilyUpiMemberAnalytics(accountId: string) {
    const members = await this.getFamilyUpiMembersByAccount(accountId);
    const transactions = await this.getFamilyUpiTransactionsByAccount(accountId);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return members.map(member => {
      const memberTransactions = transactions.filter(t => t.initiatedBy === member.id && t.status === 'success');
      
      const totalSpent = memberTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0).toFixed(2);
      const avgTransactionAmount = memberTransactions.length > 0 
        ? (parseFloat(totalSpent) / memberTransactions.length).toFixed(2)
        : '0';

      const todayTransactions = memberTransactions.filter(t => new Date(t.createdAt || 0) >= today);
      const todaySpent = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0).toFixed(2);

      const last7DaysTransactions = memberTransactions.filter(t => new Date(t.createdAt || 0) >= last7Days);
      const last7DaysSpent = last7DaysTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0).toFixed(2);

      // Group transactions by day for the last 7 days
      const transactionsByDay: { [key: string]: { count: number; amount: number } } = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        transactionsByDay[dateStr] = { count: 0, amount: 0 };
      }

      memberTransactions.forEach(txn => {
        const txnDate = new Date(txn.createdAt || 0);
        const dateStr = txnDate.toISOString().split('T')[0];
        if (transactionsByDay[dateStr] !== undefined) {
          transactionsByDay[dateStr].count++;
          transactionsByDay[dateStr].amount += parseFloat(txn.amount || '0');
        }
      });

      const transactionsByDayArray = Object.entries(transactionsByDay)
        .map(([date, data]) => ({
          date,
          count: data.count,
          amount: data.amount.toFixed(2),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        member,
        stats: {
          totalTransactions: memberTransactions.length,
          totalSpent,
          avgTransactionAmount,
          todayTransactions: todayTransactions.length,
          todaySpent,
          last7DaysTransactions: last7DaysTransactions.length,
          last7DaysSpent,
          transactionsByDay: transactionsByDayArray,
        },
      };
    });
  }

  // Cash Park operations
  async getCashParkAccountByUser(userId: string): Promise<CashParkAccount | undefined> {
    return Array.from(this.cashParkAccounts.values())
      .find(account => account.userId === userId);
  }

  async getCashParkAccount(id: string): Promise<CashParkAccount | undefined> {
    return this.cashParkAccounts.get(id);
  }

  async createCashParkAccount(insertAccount: InsertCashParkAccount): Promise<CashParkAccount> {
    const id = randomUUID();
    const account: CashParkAccount = {
      ...insertAccount,
      id,
      isActive: insertAccount.isActive || 0,
      fdIncrementAmount: insertAccount.fdIncrementAmount || "1000",
      currentInterestRate: insertAccount.currentInterestRate || "7.25",
      totalParkedAmount: insertAccount.totalParkedAmount || "0",
      totalInterestEarned: insertAccount.totalInterestEarned || "0",
      activeFdCount: insertAccount.activeFdCount || 0,
      lastSweepDate: insertAccount.lastSweepDate || null,
      minimumTenureDays: insertAccount.minimumTenureDays || 7,
      autoSweepEnabled: insertAccount.autoSweepEnabled || 1,
      notificationsEnabled: insertAccount.notificationsEnabled || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cashParkAccounts.set(id, account);
    return account;
  }

  async updateCashParkAccount(id: string, updates: Partial<CashParkAccount>): Promise<CashParkAccount | undefined> {
    const existing = this.cashParkAccounts.get(id);
    if (!existing) return undefined;
    
    const updated: CashParkAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.cashParkAccounts.set(id, updated);
    return updated;
  }

  async getCashParkFdUnitsByAccount(accountId: string): Promise<CashParkFdUnit[]> {
    return Array.from(this.cashParkFdUnits.values())
      .filter(fd => fd.accountId === accountId)
      .sort((a, b) => new Date(b.creationDate || 0).getTime() - new Date(a.creationDate || 0).getTime());
  }

  async getCashParkFdUnitsByUser(userId: string): Promise<CashParkFdUnit[]> {
    return Array.from(this.cashParkFdUnits.values())
      .filter(fd => fd.userId === userId)
      .sort((a, b) => new Date(b.creationDate || 0).getTime() - new Date(a.creationDate || 0).getTime());
  }

  async getCashParkFdUnit(id: string): Promise<CashParkFdUnit | undefined> {
    return this.cashParkFdUnits.get(id);
  }

  async createCashParkFdUnit(insertFd: InsertCashParkFdUnit): Promise<CashParkFdUnit> {
    const id = randomUUID();
    const fdNumber = `CPFD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const fd: CashParkFdUnit = {
      ...insertFd,
      id,
      fdNumber,
      accruedInterest: insertFd.accruedInterest || "0",
      tenureDays: insertFd.tenureDays || 365,
      status: insertFd.status || 'active',
      isBroken: insertFd.isBroken || 0,
      brokenDate: insertFd.brokenDate || null,
      actualInterestEarned: insertFd.actualInterestEarned || "0",
      penaltyAmount: insertFd.penaltyAmount || "0",
      createdAt: new Date(),
    };
    this.cashParkFdUnits.set(id, fd);
    return fd;
  }

  async updateCashParkFdUnit(id: string, updates: Partial<CashParkFdUnit>): Promise<CashParkFdUnit | undefined> {
    const existing = this.cashParkFdUnits.get(id);
    if (!existing) return undefined;
    
    const updated: CashParkFdUnit = {
      ...existing,
      ...updates,
    };
    this.cashParkFdUnits.set(id, updated);
    return updated;
  }

  async getCashParkTransactionsByAccount(accountId: string): Promise<CashParkTransaction[]> {
    return Array.from(this.cashParkTransactions.values())
      .filter(txn => txn.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCashParkTransactionsByUser(userId: string): Promise<CashParkTransaction[]> {
    return Array.from(this.cashParkTransactions.values())
      .filter(txn => txn.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCashParkTransaction(id: string): Promise<CashParkTransaction | undefined> {
    return this.cashParkTransactions.get(id);
  }

  async createCashParkTransaction(insertTxn: InsertCashParkTransaction): Promise<CashParkTransaction> {
    const id = randomUUID();
    const transaction: CashParkTransaction = {
      ...insertTxn,
      id,
      fdUnitId: insertTxn.fdUnitId || null,
      description: insertTxn.description || null,
      sweepMethod: insertTxn.sweepMethod || null,
      interestEarned: insertTxn.interestEarned || "0",
      transactionId: insertTxn.transactionId || null,
      status: insertTxn.status || 'success',
      metadata: insertTxn.metadata || null,
      createdAt: new Date(),
    };
    this.cashParkTransactions.set(id, transaction);
    return transaction;
  }

  // Cash Park Jar operations
  async getCashParkJarsByUser(userId: string): Promise<CashParkJar[]> {
    return Array.from(this.cashParkJars.values())
      .filter(jar => jar.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCashParkJarById(id: string): Promise<CashParkJar | undefined> {
    return this.cashParkJars.get(id);
  }

  async createCashParkJar(insertJar: InsertCashParkJar): Promise<CashParkJar> {
    const id = randomUUID();
    const jar: CashParkJar = {
      ...insertJar,
      id,
      currentBalance: insertJar.currentBalance || "0",
      goalAmount: insertJar.goalAmount || null,
      interestEarned: insertJar.interestEarned || "0",
      lastInterestCreditDate: insertJar.lastInterestCreditDate || null,
      createdAt: new Date(),
    };
    this.cashParkJars.set(id, jar);
    return jar;
  }

  async deleteCashParkJar(id: string): Promise<boolean> {
    const jar = this.cashParkJars.get(id);
    if (!jar) return false;
    
    // Only allow deletion if balance is 0
    if (parseFloat(jar.currentBalance || "0") > 0) {
      return false;
    }
    
    this.cashParkJars.delete(id);
    return true;
  }

  async getCashParkTransactionsByJar(jarId: string): Promise<CashParkTransaction[]> {
    return Array.from(this.cashParkTransactions.values())
      .filter(txn => txn.jarId === jarId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Credit Card operations
  async getCreditCardOffers(filters?: { category?: string; providerName?: string }): Promise<CreditCardOffer[]> {
    let offers = Array.from(this.creditCardOffers.values());
    
    if (filters?.category) {
      offers = offers.filter(offer => offer.category === filters.category);
    }
    
    if (filters?.providerName) {
      offers = offers.filter(offer => offer.providerName === filters.providerName);
    }
    
    return offers;
  }

  async getCreditCardOffer(id: string): Promise<CreditCardOffer | undefined> {
    return this.creditCardOffers.get(id);
  }

  async createCreditCardOffer(insertOffer: InsertCreditCardOffer): Promise<CreditCardOffer> {
    const id = randomUUID();
    const offer: CreditCardOffer = {
      ...insertOffer,
      id,
      createdAt: new Date(),
    };
    this.creditCardOffers.set(id, offer);
    return offer;
  }

  async getCreditCardApplicationsByUser(userId: string): Promise<CreditCardApplication[]> {
    return Array.from(this.creditCardApplications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getCreditCardApplication(id: string): Promise<CreditCardApplication | undefined> {
    return this.creditCardApplications.get(id);
  }

  async createCreditCardApplication(insertApplication: InsertCreditCardApplication): Promise<CreditCardApplication> {
    const id = randomUUID();
    const application: CreditCardApplication = {
      ...insertApplication,
      id,
      status: insertApplication.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.creditCardApplications.set(id, application);
    return application;
  }

  async updateCreditCardApplication(id: string, update: Partial<CreditCardApplication>): Promise<CreditCardApplication | undefined> {
    const application = this.creditCardApplications.get(id);
    if (!application) return undefined;
    
    const updated: CreditCardApplication = {
      ...application,
      ...update,
      updatedAt: new Date(),
    };
    this.creditCardApplications.set(id, updated);
    return updated;
  }

  // ShareWise operations - delegate to ShareWiseStorage
  async listSharewiseGroupsByUser(userId: string): Promise<GroupWithMembers[]> {
    return this.sharewiseStorage.listGroupsByUser(userId);
  }

  async getSharewiseGroup(id: string): Promise<SharewiseGroup | undefined> {
    return this.sharewiseStorage.getGroup(id);
  }

  async getSharewiseGroupWithMembers(id: string): Promise<GroupWithMembers | undefined> {
    return this.sharewiseStorage.getGroupWithMembers(id);
  }

  async createSharewiseGroup(group: InsertSharewiseGroup): Promise<SharewiseGroup> {
    return this.sharewiseStorage.createGroup(group);
  }

  async updateSharewiseGroup(id: string, updates: Partial<SharewiseGroup>): Promise<SharewiseGroup | undefined> {
    return this.sharewiseStorage.updateGroup(id, updates);
  }

  async deleteSharewiseGroup(id: string): Promise<boolean> {
    return this.sharewiseStorage.deleteGroup(id);
  }

  async getSharewiseGroupMembers(groupId: string): Promise<SharewiseGroupMember[]> {
    return this.sharewiseStorage.getGroupMembers(groupId);
  }

  async addSharewiseGroupMember(member: InsertSharewiseGroupMember): Promise<SharewiseGroupMember> {
    return this.sharewiseStorage.addGroupMember(member);
  }

  async removeSharewiseGroupMember(groupId: string, userId: string): Promise<boolean> {
    return this.sharewiseStorage.removeGroupMember(groupId, userId);
  }

  async updateSharewiseMemberRole(groupId: string, userId: string, role: string): Promise<SharewiseGroupMember | undefined> {
    return this.sharewiseStorage.updateMemberRole(groupId, userId, role);
  }

  async listSharewiseExpensesByGroup(groupId: string): Promise<ExpenseWithSplits[]> {
    return this.sharewiseStorage.listExpensesByGroup(groupId);
  }

  async getSharewiseExpense(id: string): Promise<SharewiseExpense | undefined> {
    return this.sharewiseStorage.getExpense(id);
  }

  async getSharewiseExpenseWithSplits(id: string): Promise<ExpenseWithSplits | undefined> {
    return this.sharewiseStorage.getExpenseWithSplits(id);
  }

  async createSharewiseExpense(expense: InsertSharewiseExpense, splits: InsertSharewiseExpenseSplit[]): Promise<ExpenseWithSplits> {
    return this.sharewiseStorage.createExpense(expense, splits);
  }

  async updateSharewiseExpense(id: string, updates: Partial<SharewiseExpense>): Promise<SharewiseExpense | undefined> {
    return this.sharewiseStorage.updateExpense(id, updates);
  }

  async deleteSharewiseExpense(id: string): Promise<boolean> {
    return this.sharewiseStorage.deleteExpense(id);
  }

  async listSharewiseSettlementsByGroup(groupId: string): Promise<SharewiseSettlement[]> {
    return this.sharewiseStorage.listSettlementsByGroup(groupId);
  }

  async createSharewiseSettlement(settlement: InsertSharewiseSettlement): Promise<SharewiseSettlement> {
    return this.sharewiseStorage.createSettlement(settlement);
  }

  async computeSharewiseGroupBalances(groupId: string): Promise<MemberBalance[]> {
    return this.sharewiseStorage.computeGroupBalances(groupId);
  }

  async generateSharewiseSettlementSuggestions(groupId: string): Promise<SettlementSuggestion[]> {
    return this.sharewiseStorage.generateSettlementSuggestions(groupId);
  }

  async getSharewiseGroupAnalytics(groupId: string): Promise<any> {
    return this.sharewiseStorage.getGroupAnalytics(groupId);
  }

  async listSharewiseActivityByGroup(groupId: string): Promise<SharewiseActivity[]> {
    return this.sharewiseStorage.listActivityByGroup(groupId);
  }

  async getSharewiseGroupByInviteCode(inviteCode: string): Promise<SharewiseGroup | undefined> {
    return this.sharewiseStorage.getGroupByInviteCode(inviteCode);
  }

  async getCouponMartListings(filters?: { category?: string; listingType?: string; status?: string }): Promise<CouponMartListing[]> {
    let listings = Array.from(this.couponMartListings.values());
    
    if (filters?.category) {
      listings = listings.filter(l => l.primaryCategory === filters.category);
    }
    if (filters?.listingType) {
      listings = listings.filter(l => l.listingType === filters.listingType);
    }
    if (filters?.status) {
      listings = listings.filter(l => l.status === filters.status);
    }
    
    return listings.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCouponMartListing(id: string): Promise<CouponMartListing | undefined> {
    return this.couponMartListings.get(id);
  }

  async getCouponMartListingsByUser(userId: string): Promise<CouponMartListing[]> {
    return Array.from(this.couponMartListings.values())
      .filter(l => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createCouponMartListing(listing: InsertCouponMartListing): Promise<CouponMartListing> {
    const id = randomUUID();
    const now = new Date();
    const newListing: CouponMartListing = {
      id,
      ...listing,
      status: listing.status || "active",
      visibility: listing.visibility || "public",
      views: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.couponMartListings.set(id, newListing);
    return newListing;
  }

  async updateCouponMartListing(id: string, listing: Partial<CouponMartListing>): Promise<CouponMartListing | undefined> {
    const existing = this.couponMartListings.get(id);
    if (!existing) return undefined;
    
    const updated: CouponMartListing = {
      ...existing,
      ...listing,
      updatedAt: new Date(),
    };
    this.couponMartListings.set(id, updated);
    return updated;
  }

  async deleteCouponMartListing(id: string): Promise<boolean> {
    return this.couponMartListings.delete(id);
  }

  async incrementCouponMartListingViews(id: string): Promise<void> {
    const listing = this.couponMartListings.get(id);
    if (listing) {
      listing.views = (listing.views || 0) + 1;
      this.couponMartListings.set(id, listing);
    }
  }

  async getCouponMartTransactionsByBuyer(buyerId: string): Promise<CouponMartTransaction[]> {
    return Array.from(this.couponMartTransactions.values())
      .filter(t => t.buyerId === buyerId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCouponMartTransactionsBySeller(sellerId: string): Promise<CouponMartTransaction[]> {
    return Array.from(this.couponMartTransactions.values())
      .filter(t => t.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createCouponMartTransaction(transaction: InsertCouponMartTransaction): Promise<CouponMartTransaction> {
    const id = randomUUID();
    const newTransaction: CouponMartTransaction = {
      id,
      ...transaction,
      status: transaction.status || "completed",
      createdAt: new Date(),
    };
    this.couponMartTransactions.set(id, newTransaction);
    
    // Update listing status
    await this.updateCouponMartListing(transaction.listingId, { 
      status: transaction.transactionType === "purchase" ? "sold" : "traded" 
    });
    
    return newTransaction;
  }

  async getCouponMartTradeOffersByListing(listingId: string): Promise<CouponMartTradeOffer[]> {
    return Array.from(this.couponMartTradeOffers.values())
      .filter(o => o.listingId === listingId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getCouponMartTradeOffersByUser(userId: string): Promise<CouponMartTradeOffer[]> {
    return Array.from(this.couponMartTradeOffers.values())
      .filter(o => o.offererId === userId || o.listingOwnerId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createCouponMartTradeOffer(offer: InsertCouponMartTradeOffer): Promise<CouponMartTradeOffer> {
    const id = randomUUID();
    const newOffer: CouponMartTradeOffer = {
      id,
      ...offer,
      status: offer.status || "pending",
      createdAt: new Date(),
      respondedAt: null,
    };
    this.couponMartTradeOffers.set(id, newOffer);
    return newOffer;
  }

  async getCouponMartTradeOffer(id: string): Promise<CouponMartTradeOffer | undefined> {
    return this.couponMartTradeOffers.get(id);
  }

  async updateCouponMartTradeOffer(id: string, status: string, responseNote?: string): Promise<CouponMartTradeOffer | undefined> {
    const offer = this.couponMartTradeOffers.get(id);
    if (!offer) return undefined;
    
    const updated: CouponMartTradeOffer = {
      ...offer,
      status,
      responseNote: responseNote || offer.responseNote || null,
      respondedAt: new Date(),
    };
    this.couponMartTradeOffers.set(id, updated);
    
    // If accepted, create transaction and update listing
    if (status === "accepted") {
      await this.createCouponMartTransaction({
        listingId: offer.listingId,
        sellerId: offer.listingOwnerId,
        buyerId: offer.offererId,
        transactionType: "trade",
        amount: "0",
        revealedCodes: offer.offeredCoupons,
        status: "completed",
      });
    }
    
    return updated;
  }

  async ensureUserHasSampleCouponData(userId: string): Promise<void> {
    // Check if user already has listings
    const existingListings = await this.getCouponMartListingsByUser(userId);
    if (existingListings.length > 0) {
      return; // User already has data
    }

    const now = new Date();
    const futureDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Create sample listings for this user
    const myListing1: CouponMartListing = {
      id: `${userId}-listing-1`,
      userId,
      coupons: [{
        code: "MYSWIGGY500",
        title: "₹500 Off on Food Orders",
        brand: "Swiggy",
        category: "food",
        type: "discount",
        value: 500,
        valueType: "fixed",
        description: "Get ₹500 off on orders above ₹1000",
        expiryDate: futureDate(30).toISOString(),
        minAmount: 1000,
        maxDiscount: 500,
        termsConditions: "Valid for all users",
        valueScore: 7.5,
      }],
      totalCouponCount: 1,
      totalFaceValue: "500",
      primaryCategory: "food",
      listingNote: "My personal Swiggy coupon",
      listingType: "sell",
      sellingPrice: "350",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 12,
      createdAt: now,
      updatedAt: now,
    };

    const myListing2: CouponMartListing = {
      id: `${userId}-listing-2`,
      userId,
      coupons: [{
        code: "MYGYM300",
        title: "₹300 Off on Gym Membership",
        brand: "FitLife Gym",
        category: "fitness",
        type: "discount",
        value: 300,
        valueType: "fixed",
        description: "Save ₹300 on 3-month gym membership",
        expiryDate: futureDate(45).toISOString(),
        minAmount: 1500,
        maxDiscount: 300,
        termsConditions: "Valid for new members only",
        valueScore: 8.0,
      }],
      totalCouponCount: 1,
      totalFaceValue: "300",
      primaryCategory: "fitness",
      listingNote: "Extra gym coupon",
      listingType: "trade",
      tradePreference: "food, shopping",
      tradeNote: "Looking for food delivery or shopping coupons",
      status: "active",
      visibility: "public",
      views: 8,
      createdAt: now,
      updatedAt: now,
    };

    const myListing3: CouponMartListing = {
      id: `${userId}-listing-3`,
      userId,
      coupons: [
        {
          code: "MYAMAZON600",
          title: "₹600 Amazon Gift Card",
          brand: "Amazon",
          category: "shopping",
          type: "gift_card",
          value: 600,
          valueType: "fixed",
          description: "Amazon gift card worth ₹600",
          expiryDate: futureDate(90).toISOString(),
          minAmount: null,
          maxDiscount: null,
          termsConditions: "Valid on Amazon.in only",
          valueScore: 8.5,
        },
        {
          code: "MYFLIPART400",
          title: "₹400 Flipkart Voucher",
          brand: "Flipkart",
          category: "shopping",
          type: "gift_card",
          value: 400,
          valueType: "fixed",
          description: "Flipkart gift voucher worth ₹400",
          expiryDate: futureDate(85).toISOString(),
          minAmount: null,
          maxDiscount: null,
          termsConditions: "Valid on all products",
          valueScore: 8.0,
        }
      ],
      totalCouponCount: 2,
      totalFaceValue: "1000",
      primaryCategory: "combo",
      listingNote: "Shopping combo - Amazon & Flipkart",
      listingType: "sell",
      sellingPrice: "850",
      tradePreference: "",
      tradeNote: "",
      tradeCategory: "",
      tradeCouponsRequired: 0,
      tradeMinValueScore: "0",
      tradeMaxValueScore: "0",
      tradeCouponRequirements: [],
      status: "active",
      visibility: "public",
      views: 25,
      createdAt: now,
      updatedAt: now,
    };

    // Add listings to storage
    this.couponMartListings.set(myListing1.id, myListing1);
    this.couponMartListings.set(myListing2.id, myListing2);
    this.couponMartListings.set(myListing3.id, myListing3);

    // Create sample trade offers received by this user
    const receivedOffer1: CouponMartTradeOffer = {
      id: `${userId}-offer-received-1`,
      listingId: myListing2.id, // Someone is offering for user's listing
      offererId: "demo-user-5",
      listingOwnerId: userId,
      offeredCoupons: [
        {
          code: "ZOMATO400",
          title: "₹400 Off on Food Delivery",
          brand: "Zomato",
          value: "400",
          expiry: futureDate(28).toISOString(),
          status: "pending"
        },
        {
          code: "SWIGGY350",
          title: "₹350 Off on Swiggy Orders",
          brand: "Swiggy",
          value: "350",
          expiry: futureDate(35).toISOString(),
          status: "pending"
        },
        {
          code: "UBEREATS250",
          title: "₹250 Off on Uber Eats",
          brand: "Uber Eats",
          value: "250",
          expiry: futureDate(22).toISOString(),
          status: "pending"
        }
      ],
      offerNote: "I'd love to trade my food delivery coupons for your gym membership coupon! Offering 3 great deals.",
      status: "pending",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      respondedAt: null,
      responseNote: null,
    };

    const receivedOffer2: CouponMartTradeOffer = {
      id: `${userId}-offer-received-2`,
      listingId: myListing3.id,
      offererId: "demo-user-7",
      listingOwnerId: userId,
      offeredCoupons: [
        {
          code: "NETFLIX350",
          title: "₹350 Off on Subscription",
          brand: "Netflix",
          value: "350",
          expiry: futureDate(25).toISOString(),
          status: "pending"
        },
        {
          code: "PRIMEVIDEO300",
          title: "₹300 Prime Video Voucher",
          brand: "Prime Video",
          value: "300",
          expiry: futureDate(30).toISOString(),
          status: "pending"
        }
      ],
      offerNote: "Interested in your shopping combo! Offering 2 entertainment coupons.",
      status: "pending",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      respondedAt: null,
      responseNote: null,
    };

    // Create sample trade offers sent by this user
    const sentOffer1: CouponMartTradeOffer = {
      id: `${userId}-offer-sent-1`,
      listingId: "coupon-mart-1", // User made offer on another listing
      offererId: userId,
      listingOwnerId: "demo-user-1",
      offeredCoupons: [
        {
          code: "MYCULTFIT400",
          title: "₹400 Off on Fitness Classes",
          brand: "Cult.fit",
          value: "400",
          expiry: futureDate(30).toISOString(),
          status: "pending"
        },
        {
          code: "GOLDSGYM500",
          title: "₹500 Off on Gym Membership",
          brand: "Gold's Gym",
          value: "500",
          expiry: futureDate(40).toISOString(),
          status: "pending"
        },
        {
          code: "FITPASS300",
          title: "₹300 Off on Fitness Pass",
          brand: "FITPASS",
          value: "300",
          expiry: futureDate(25).toISOString(),
          status: "pending"
        }
      ],
      offerNote: "Would like to trade my 3 fitness coupons for your food coupons. Great fitness combo!",
      status: "pending",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      respondedAt: null,
      responseNote: null,
    };

    // Add trade offers to storage
    this.couponMartTradeOffers.set(receivedOffer1.id, receivedOffer1);
    this.couponMartTradeOffers.set(receivedOffer2.id, receivedOffer2);
    this.couponMartTradeOffers.set(sentOffer1.id, sentOffer1);
  }

  // BookSure Consultant Booking methods
  private initializeConsultantSampleData() {
    // Initialize 9 main categories with subcategories
    const categories = [
      { 
        name: "Medical", 
        slug: "medical", 
        icon: "Stethoscope", 
        tagline: "Clinical & licensed healthcare", 
        description: "Diagnosis, treatment, therapy and in-home medical support",
        subcategories: [
          "Clinic Booking", "Lab Test Booking / Pathology", "Hospital Appointment Booking",
          "General Physician", "Specialist (Cardio, Derm, Ortho, ENT, Neuro)",
          "Home Nursing / Caregiver", "Telemedicine / Remote Consult",
          "Rehab / Physiotherapy", "Mental Health / Psychologist / Counselor"
        ],
        isPopular: 1, 
        displayOrder: 1 
      },
      { 
        name: "Health & Wellness", 
        slug: "health-wellness", 
        icon: "Dumbbell", 
        tagline: "Fitness & preventive health",
        description: "Preventive health, fitness coaching, diet & wellness programs",
        subcategories: [
          "Personal Trainer (HIIT, Strength, Cardio)", "Group Classes (Bootcamp, Pilates, Zumba)",
          "Nutritionist / Diet Plans", "Yoga (Hatha, Vinyasa, Ashtanga, Restorative)",
          "Wellness Coaching / Lifestyle Programs", "Rehab & Mobility Programs"
        ],
        isPopular: 1, 
        displayOrder: 2 
      },
      { 
        name: "Personal Care & Beauty", 
        slug: "personal-care-beauty", 
        icon: "Scissors", 
        tagline: "Grooming, beauty & style",
        description: "Grooming, beauty and style services at salons or home visits",
        subcategories: [
          "Haircut & Styling", "Bridal / Event Makeup", "Skincare & Facials",
          "Manicure / Pedicure", "Mobile / Home-service Beauty",
          "Beauty Packages (bridal, party, corporate)"
        ],
        isPopular: 1, 
        displayOrder: 3 
      },
      { 
        name: "Home, Repair & Electronics", 
        slug: "home-repair-electronics", 
        icon: "Wrench", 
        tagline: "Maintenance & repair services",
        description: "On-site household maintenance, repairs, cleaning and electronics service",
        subcategories: [
          "Emergency Repairs (Electrician / Plumber)", "Renovation / Carpentry / Joinery",
          "Deep Cleaning / Recurring Maid Services", "Pest Control (One-time / Contract)",
          "Laundry / Dry-clean Pickup & Drop", "Appliance Repair (AC, Fridge, Washing Machine, Oven)",
          "Gadget Repair (Phones, Laptops, Tablets)", "Electronics Service (TVs, Audio systems, Home appliances)"
        ],
        isPopular: 1, 
        displayOrder: 4 
      },
      { 
        name: "Automotive & Mobility", 
        slug: "automotive-mobility", 
        icon: "Car", 
        tagline: "Vehicle service & lessons",
        description: "Car & bike servicing, roadside assistance, detailing and driving lessons",
        subcategories: [
          "Scheduled Car Service (Insurance / Major / Minor)", "Scheduled Bike Service (2W maintenance)",
          "Mobile Mechanic / On-site Service", "Emergency Roadside Assistance / Towing",
          "Vehicle Detailing / Cleaning", "Fleet / Commercial Vehicle Service",
          "Driving Lessons / Instructor"
        ],
        isPopular: 1, 
        displayOrder: 5 
      },
      { 
        name: "Professional & Business Services", 
        slug: "professional-business", 
        icon: "Monitor", 
        tagline: "Expert professional consulting",
        description: "Skilled professional services for individuals and businesses",
        subcategories: [
          "Legal Consultation / Lawyer Services", "Accounting & Bookkeeping / Tax Filing",
          "IT Support / On-site Technician / Network Setup", "Corporate Photography / Product Shoots",
          "Corporate Event Management / Planning", "AV / Lighting Technical Crew / Stage Setup"
        ],
        isPopular: 1, 
        displayOrder: 6 
      },
      { 
        name: "Food & Hospitality", 
        slug: "food-hospitality", 
        icon: "ChefHat", 
        tagline: "Chefs & catering services",
        description: "In-home chefs, personal cooks and catering for events or daily meals",
        subcategories: [
          "Personal Chef (Weekly / Subscription Meal Plans)", "Event Catering (Small / Large scale)",
          "Special-diet Chefs (Vegan, Keto, Allergy-friendly)", "Short-term Cook Hire (Daily / Weekly)",
          "Meal Tasting / Trial Sessions"
        ],
        isPopular: 1, 
        displayOrder: 7 
      },
      { 
        name: "Education & Training", 
        slug: "education-training", 
        icon: "BookOpen", 
        tagline: "Learning & skill development",
        description: "Teaching & skill development including academics and vocational training",
        subcategories: [
          "School Tutors (By Subject & Grade)", "Test Prep & Exam Coaching (SAT, IIT-JEE, NEET, Boards)",
          "Skill Courses / Vocational Training (coding, design, trades)", "Driving Instructor / Driving Lessons",
          "Certification Training (professional certificates)"
        ],
        isPopular: 1, 
        displayOrder: 8 
      },
      { 
        name: "Entertainment & Events", 
        slug: "entertainment-events", 
        icon: "PartyPopper", 
        tagline: "Events & creative services",
        description: "Live entertainment, performance and event creatives for gatherings",
        subcategories: [
          "DJs (Genre-based, Wedding, Club)", "Live Bands & Solo Artists (Acoustic, Cover, Original)",
          "Event Production (Lighting, Sound, Stage)", "Photo & Video Coverage (Event, Wedding, Corporate)",
          "Stage / AV Crew & Technicians", "Makeup Artist (Event / Bridal)"
        ],
        isPopular: 1, 
        displayOrder: 9 
      }
    ];

    categories.forEach((cat, i) => {
      const category: ConsultantCategory = {
        id: `cat-${i + 1}`,
        ...cat,
        isActive: 1,
        createdAt: new Date(),
      };
      this.consultantCategories.set(category.id, category);
    });

    // Initialize sample providers mapped to new 9 categories
    const providers = [
      // Medical (cat-1)
      { name: "Dr. Rajesh Kumar", designation: "General Physician", subcategory: "General Physician", categoryId: "cat-1", categoryName: "Medical", city: "Mumbai", rating: "4.8", experience: 15, totalBookings: 482, startingPrice: "500", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Experienced general physician with 15+ years in family medicine. MBBS, MD. Specialized in preventive care and chronic disease management.", phone: "+91 98765 43210", email: "dr.rajesh@example.com", licenseNumber: "MH-GP-12345" },
      { name: "Dr. Priya Sharma", designation: "Pediatrician", subcategory: "Specialist (Cardio, Derm, Ortho, ENT, Neuro)", categoryId: "cat-1", categoryName: "Medical", city: "Delhi", rating: "4.9", experience: 12, totalBookings: 356, startingPrice: "600", verified: 1, isOnline: 0, virtualAvailable: 1, inPersonAvailable: 1, bio: "Pediatric specialist focused on child health and development. MBBS, MD Pediatrics. Expert in newborn care and vaccinations.", phone: "+91 98765 43211", email: "dr.priya@example.com", licenseNumber: "DL-PED-23456" },
      { name: "Sister Mary Thomas", designation: "Registered Nurse", subcategory: "Home Nursing / Caregiver", categoryId: "cat-1", categoryName: "Medical", city: "Kochi", rating: "4.8", experience: 18, totalBookings: 321, startingPrice: "400", verified: 1, isOnline: 0, virtualAvailable: 0, inPersonAvailable: 1, bio: "Registered nurse with extensive experience in elderly care, post-operative care, and chronic disease management.", phone: "+91 98765 43215", email: "mary.thomas@example.com", licenseNumber: "KL-RN-67890" },
      { name: "LabCare Services", designation: "Lab Technician", subcategory: "Lab Test Booking / Pathology", categoryId: "cat-1", categoryName: "Medical", city: "Pune", rating: "4.7", experience: 6, totalBookings: 892, startingPrice: "250", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional home sample collection service. All types of blood tests, diagnostic tests with quick reports.", phone: "+91 98765 43216", email: "info@labcare.com" },
      
      // Health & Wellness (cat-2)
      { name: "Fitness by Rohan", designation: "Personal Trainer", subcategory: "Personal Trainer (HIIT, Strength, Cardio)", categoryId: "cat-2", categoryName: "Health & Wellness", city: "Mumbai", rating: "4.7", experience: 7, totalBookings: 445, startingPrice: "800", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Certified personal trainer and yoga instructor. Specialized in weight loss, muscle building, and functional fitness.", phone: "+91 98765 43221", email: "rohan.fitness@example.com" },
      { name: "Yoga with Priya", designation: "Yoga Instructor", subcategory: "Yoga (Hatha, Vinyasa, Ashtanga, Restorative)", categoryId: "cat-2", categoryName: "Health & Wellness", city: "Bangalore", rating: "4.9", experience: 10, totalBookings: 289, startingPrice: "600", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Certified yoga instructor specializing in Hatha, Vinyasa and Ashtanga styles. Holistic wellness approach.", phone: "+91 98765 43222", email: "priya.yoga@example.com" },
      
      // Personal Care & Beauty (cat-3)
      { name: "Amit Singh", designation: "Master Stylist", subcategory: "Haircut & Styling", categoryId: "cat-3", categoryName: "Personal Care & Beauty", city: "Bangalore", rating: "4.7", experience: 8, totalBookings: 623, startingPrice: "300", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional hair stylist and barber. Specialized in modern cuts, coloring, and styling for men and women.", phone: "+91 98765 43212", email: "amit.singh@example.com" },
      { name: "Glamour by Neha", designation: "Makeup Artist", subcategory: "Bridal / Event Makeup", categoryId: "cat-3", categoryName: "Personal Care & Beauty", city: "Delhi", rating: "4.8", experience: 6, totalBookings: 412, startingPrice: "2500", verified: 1, isOnline: 0, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional makeup artist specializing in bridal and event makeup. Portfolio of 500+ satisfied brides.", phone: "+91 98765 43223", email: "neha.makeup@example.com" },
      
      // Home, Repair & Electronics (cat-4)
      { name: "Vijay Electricals", designation: "Licensed Electrician", subcategory: "Emergency Repairs (Electrician / Plumber)", categoryId: "cat-4", categoryName: "Home, Repair & Electronics", city: "Hyderabad", rating: "4.5", experience: 12, totalBookings: 734, startingPrice: "350", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Licensed electrician for all electrical repairs, installations, and maintenance. Emergency services available.", phone: "+91 98765 43217", email: "vijay.elect@example.com", licenseNumber: "TS-EL-12345" },
      { name: "Ravi Kumar", designation: "Master Plumber", subcategory: "Emergency Repairs (Electrician / Plumber)", categoryId: "cat-4", categoryName: "Home, Repair & Electronics", city: "Mumbai", rating: "4.6", experience: 15, totalBookings: 567, startingPrice: "400", verified: 1, isOnline: 0, virtualAvailable: 0, inPersonAvailable: 1, bio: "Expert plumber for all plumbing needs. Leakage repairs, pipe installations, bathroom fittings, and more.", phone: "+91 98765 43218", email: "ravi.plumb@example.com" },
      { name: "Clean Home Services", designation: "Cleaning Specialist", subcategory: "Deep Cleaning / Recurring Maid Services", categoryId: "cat-4", categoryName: "Home, Repair & Electronics", city: "Bangalore", rating: "4.4", experience: 5, totalBookings: 1123, startingPrice: "500", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional home cleaning and housekeeping services. Deep cleaning, regular maintenance, and more.", phone: "+91 98765 43219", email: "info@cleanhome.com" },
      { name: "TechFix Solutions", designation: "Tech Repair Specialist", subcategory: "Gadget Repair (Phones, Laptops, Tablets)", categoryId: "cat-4", categoryName: "Home, Repair & Electronics", city: "Pune", rating: "4.6", experience: 8, totalBookings: 678, startingPrice: "450", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Expert in mobile phone, laptop and tablet repairs. Quick turnaround with genuine parts warranty.", phone: "+91 98765 43224", email: "info@techfix.com" },
      
      // Automotive & Mobility (cat-5)
      { name: "Rahul Verma", designation: "Professional Driver", subcategory: "Driving Lessons / Instructor", categoryId: "cat-5", categoryName: "Automotive & Mobility", city: "Mumbai", rating: "4.6", experience: 10, totalBookings: 1245, startingPrice: "350", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Experienced professional driver with clean driving record. Licensed for all vehicle types. Punctual and reliable.", phone: "+91 98765 43213", email: "rahul.verma@example.com", licenseNumber: "MH-DL-45678" },
      { name: "AutoCare Pro", designation: "Service Center", subcategory: "Scheduled Car Service (Insurance / Major / Minor)", categoryId: "cat-5", categoryName: "Automotive & Mobility", city: "Bangalore", rating: "4.7", experience: 12, totalBookings: 890, startingPrice: "1500", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Complete car servicing and maintenance. Insurance-approved service center with certified mechanics.", phone: "+91 98765 43225", email: "info@autocarepro.com" },
      
      // Professional & Business Services (cat-6)
      { name: "Adv. Suresh Mehta", designation: "Senior Advocate", subcategory: "Legal Consultation / Lawyer Services", categoryId: "cat-6", categoryName: "Professional & Business Services", city: "Mumbai", rating: "4.8", experience: 20, totalBookings: 234, startingPrice: "1200", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Senior advocate with expertise in corporate law, property disputes and family law. Bar Council certified.", phone: "+91 98765 43226", email: "adv.mehta@example.com", licenseNumber: "MH-BAR-12345" },
      { name: "CA Ramesh Gupta", designation: "Chartered Accountant", subcategory: "Accounting & Bookkeeping / Tax Filing", categoryId: "cat-6", categoryName: "Professional & Business Services", city: "Delhi", rating: "4.9", experience: 15, totalBookings: 456, startingPrice: "1000", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Chartered Accountant specializing in tax filing, GST compliance and financial consulting for businesses.", phone: "+91 98765 43227", email: "ca.ramesh@example.com", licenseNumber: "ICAI-123456" },
      { name: "TechSupport Plus", designation: "IT Technician", subcategory: "IT Support / On-site Technician / Network Setup", categoryId: "cat-6", categoryName: "Professional & Business Services", city: "Bangalore", rating: "4.6", experience: 8, totalBookings: 345, startingPrice: "600", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "IT support and network setup for homes and small businesses. Quick troubleshooting and solutions.", phone: "+91 98765 43228", email: "info@techsupport.com" },
      
      // Food & Hospitality (cat-7)
      { name: "Chef Meena Iyer", designation: "Home Chef", subcategory: "Personal Chef (Weekly / Subscription Meal Plans)", categoryId: "cat-7", categoryName: "Food & Hospitality", city: "Chennai", rating: "4.9", experience: 14, totalBookings: 489, startingPrice: "800", verified: 1, isOnline: 0, virtualAvailable: 0, inPersonAvailable: 1, bio: "Expert in South Indian, North Indian and Continental cuisines. Specialized in party catering and tiffin services.", phone: "+91 98765 43214", email: "chef.meena@example.com" },
      { name: "Royal Caterers", designation: "Event Caterer", subcategory: "Event Catering (Small / Large scale)", categoryId: "cat-7", categoryName: "Food & Hospitality", city: "Mumbai", rating: "4.7", experience: 10, totalBookings: 567, startingPrice: "5000", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional catering service for weddings, corporate events and parties. Customized menus available.", phone: "+91 98765 43229", email: "info@royalcaterers.com" },
      
      // Education & Training (cat-8)
      { name: "Prof. Anil Gupta", designation: "Mathematics Tutor", subcategory: "School Tutors (By Subject & Grade)", categoryId: "cat-8", categoryName: "Education & Training", city: "Delhi", rating: "4.9", experience: 20, totalBookings: 234, startingPrice: "700", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Experienced mathematics tutor for grades 8-12 and competitive exams. IIT graduate with proven track record.", phone: "+91 98765 43220", email: "anil.gupta@example.com" },
      { name: "Learn & Excel Academy", designation: "Coaching Institute", subcategory: "Test Prep & Exam Coaching (SAT, IIT-JEE, NEET, Boards)", categoryId: "cat-8", categoryName: "Education & Training", city: "Bangalore", rating: "4.8", experience: 12, totalBookings: 345, startingPrice: "1500", verified: 1, isOnline: 1, virtualAvailable: 1, inPersonAvailable: 1, bio: "Specialized coaching for competitive exams with experienced faculty. High success rate in IIT-JEE and NEET.", phone: "+91 98765 43230", email: "info@learnexcel.com" },
      
      // Entertainment & Events (cat-9)
      { name: "DJ Akash", designation: "Professional DJ", subcategory: "DJs (Genre-based, Wedding, Club)", categoryId: "cat-9", categoryName: "Entertainment & Events", city: "Mumbai", rating: "4.8", experience: 10, totalBookings: 678, startingPrice: "3000", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional DJ for weddings, parties and club events. Extensive music library covering all genres.", phone: "+91 98765 43231", email: "dj.akash@example.com" },
      { name: "Capture Moments", designation: "Photographer & Videographer", subcategory: "Photo & Video Coverage (Event, Wedding, Corporate)", categoryId: "cat-9", categoryName: "Entertainment & Events", city: "Bangalore", rating: "4.9", experience: 8, totalBookings: 456, startingPrice: "4000", verified: 1, isOnline: 1, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional photography and videography for weddings, events and corporate functions. Cinematic style.", phone: "+91 98765 43232", email: "info@capturemoments.com" },
      { name: "Glamour Makeup Studio", designation: "Event Makeup Artist", subcategory: "Makeup Artist (Event / Bridal)", categoryId: "cat-9", categoryName: "Entertainment & Events", city: "Delhi", rating: "4.7", experience: 7, totalBookings: 389, startingPrice: "2000", verified: 1, isOnline: 0, virtualAvailable: 0, inPersonAvailable: 1, bio: "Professional bridal and event makeup artist. Airbrush makeup specialist with premium products.", phone: "+91 98765 43233", email: "info@glamourstudio.com" },
    ];

    providers.forEach((prov, i) => {
      const provider: ConsultantProvider = {
        id: `prov-${i + 1}`,
        ...prov,
        isActive: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.consultantProviders.set(provider.id, provider);

      // Add services for each provider
      const serviceTemplates = [
        { title: "Consultation", description: "Initial consultation and assessment", duration: 60, price: "500" },
        { title: "Follow-up Visit", description: "Follow-up consultation", duration: 30, price: "300" },
        { title: "Premium Service", description: "Comprehensive premium service package", duration: 90, price: "1500" },
      ];

      serviceTemplates.forEach((srv, j) => {
        const service: ConsultantService = {
          id: `srv-${i * 3 + j + 1}`,
          providerId: provider.id,
          ...srv,
          isActive: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.consultantServices.set(service.id, service);
      });

      // Add reviews for each provider
      const reviewTemplates = [
        { rating: 5, review: "Excellent service! Very professional and knowledgeable. Highly recommended." },
        { rating: 4, review: "Good experience overall. Professional and on time." },
        { rating: 5, review: "Outstanding! Best service I've received. Will definitely book again." },
      ];

      reviewTemplates.forEach((rev, k) => {
        const review: ConsultantReview = {
          id: `rev-${i * 3 + k + 1}`,
          bookingId: `booking-${i * 3 + k + 1}`,
          providerId: provider.id,
          userId: `user-${k + 1}`,
          rating: rev.rating,
          review: rev.review,
          onTimeBehavior: rev.rating,
          professionalism: rev.rating,
          serviceQuality: rev.rating,
          valueForMoney: rev.rating,
          photos: [],
          tags: [],
          isVerified: 1,
          helpfulCount: Math.floor(Math.random() * 10),
          providerResponse: k === 0 ? "Thank you for your kind words!" : null,
          respondedAt: k === 0 ? new Date() : null,
          createdAt: new Date(Date.now() - (k + 1) * 7 * 24 * 60 * 60 * 1000),
        };
        this.consultantReviews.set(review.id, review);
      });

      // Add availability for each provider (recurring weekly slots)
      const days = [1, 2, 3, 4, 5];
      days.forEach((day) => {
        const morningSlot: ConsultantAvailability = {
          id: `avail-morning-${i * 5 + day}`,
          providerId: provider.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "12:00",
          isRecurring: 1,
          isActive: 1,
          createdAt: new Date(),
        };
        this.consultantAvailability.set(morningSlot.id, morningSlot);

        const eveningSlot: ConsultantAvailability = {
          id: `avail-evening-${i * 5 + day}`,
          providerId: provider.id,
          dayOfWeek: day,
          startTime: "14:00",
          endTime: "18:00",
          isRecurring: 1,
          isActive: 1,
          createdAt: new Date(),
        };
        this.consultantAvailability.set(eveningSlot.id, eveningSlot);
      });
    });

    // Add sample bookings
    const sampleBookings = [
      {
        userId: "user-1",
        providerId: "prov-1",
        serviceId: "srv-1",
        serviceType: "Pediatrician Consultation",
        bookingType: "virtual",
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        scheduledTime: "10:00",
        duration: 60,
        totalAmount: "500.00",
        status: "confirmed",
        notes: "Regular checkup for my child"
      },
      {
        userId: "user-1",
        providerId: "prov-3",
        serviceId: "srv-7",
        serviceType: "Legal Consultation",
        bookingType: "in_person",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        scheduledTime: "14:00",
        duration: 90,
        totalAmount: "1500.00",
        status: "pending",
        notes: "Property dispute consultation"
      },
      {
        userId: "user-1",
        providerId: "prov-5",
        serviceId: "srv-13",
        serviceType: "Tax Filing Service",
        bookingType: "virtual",
        scheduledDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        scheduledTime: "11:00",
        duration: 60,
        totalAmount: "500.00",
        status: "completed",
        notes: "Annual tax return filing"
      },
      {
        userId: "user-1",
        providerId: "prov-8",
        serviceId: "srv-22",
        serviceType: "Plumbing Repair",
        bookingType: "in_person",
        scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        scheduledTime: "09:00",
        duration: 120,
        totalAmount: "800.00",
        status: "completed",
        notes: "Kitchen sink repair"
      },
      {
        userId: "user-1",
        providerId: "prov-11",
        serviceId: "srv-31",
        serviceType: "Personal Training Session",
        bookingType: "in_person",
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        scheduledTime: "06:00",
        duration: 60,
        totalAmount: "500.00",
        status: "confirmed",
        notes: "Morning workout session"
      }
    ];

    sampleBookings.forEach((booking, i) => {
      const bookingNumber = `BKS${Date.now() + i}${Math.floor(Math.random() * 1000)}`;
      const consultantBooking: ConsultantBooking = {
        id: `booking-sample-${i + 1}`,
        bookingNumber,
        ...booking,
        paymentMethod: "upi",
        paymentStatus: booking.status === "completed" ? "paid" : "pending",
        cancellationReason: null,
        cancelledBy: null,
        cancelledAt: null,
        createdAt: new Date(Date.now() - (sampleBookings.length - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.consultantBookings.set(consultantBooking.id, consultantBooking);
    });
  }

  private initializeSwapNowSampleData() {
    // Sample SwapNow listings
    const sampleListings: Partial<SwapNowListing>[] = [
      {
        id: "1",
        userId: "user-1",
        title: "iPhone 13 Pro Max 256GB Pacific Blue - Excellent Condition",
        description: "Selling my iPhone 13 Pro Max in excellent condition with barely any signs of use. Minor scratches on the back from daily use, but screen is completely scratch-free with tempered glass protector. Battery health at 92%. Comes with original box, charger cable, and protective case. All accessories included. Phone was purchased in September 2022 and has been well maintained. No repairs or water damage. All features working perfectly including Face ID, cameras, and speakers. Reason for selling: Upgrading to newer model. Serious buyers only please.",
        category: "electronics",
        subCategory: "mobile_phones",
        condition: "like_new",
        price: "65000.00",
        originalPrice: "89900.00",
        isNegotiable: 1,
        images: [
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1611330041735-a6c958f47e8c?w=800&h=800&fit=crop"
        ],
        location: "Sector 62, Noida",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        brand: "Apple",
        age: "1-2 years",
        warranty: "Apple Care+ valid till Sep 2024",
        accessories: "Original box, charger cable, protective case, tempered glass protector",
        status: "active",
        isFeatured: 1,
        views: 234,
        favoriteCount: 12,
        soldAt: null,
        soldPrice: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "2",
        userId: "user-2",
        title: "Royal Enfield Classic 350 - 2021 Model Black Beauty",
        description: "Well maintained Royal Enfield Classic 350 in stunning black color. Single owner, all papers clear and up to date. Bike has been regularly serviced at authorized Royal Enfield service center. Full service history available. New tyres fitted 2 months ago. Engine in perfect condition with smooth performance. No accidents or major repairs. Clean ownership transfer. Insurance valid till December 2024. Reason for selling: Moving abroad. Test drive available for serious buyers only. Price slightly negotiable for immediate sale.",
        category: "vehicles",
        subCategory: "motorcycles",
        condition: "good",
        price: "145000.00",
        originalPrice: "195000.00",
        isNegotiable: 1,
        images: [
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1558980394-4c7c9f8fa2b6?w=800&h=800&fit=crop"
        ],
        location: "Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        brand: "Royal Enfield",
        age: "2-5 years",
        warranty: "Extended warranty available",
        accessories: "Crash guard, saddlebags, phone mount, engine guard",
        status: "active",
        isFeatured: 0,
        views: 567,
        favoriteCount: 28,
        soldAt: null,
        soldPrice: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "3",
        userId: "user-3",
        title: "Premium L-Shaped Sofa Set (6 Seater) with Center Table - Grey Fabric",
        description: "Gorgeous grey fabric L-shaped sofa in excellent, almost new condition. Bought just 6 months ago from premium furniture store. Moving to new city for job, need urgent sale. Sofa is super comfortable with high-density foam cushions. Stain-resistant fabric that's easy to clean. Comes with matching center table in walnut finish. Original price was ₹45,000, selling at huge discount. No tears, stains, or defects. Professionally cleaned last month. Buyer will need to arrange transportation. Can help with disassembly if needed. Dimensions: L-shaped portion 220cm x 160cm, center table 90cm x 60cm.",
        category: "furniture",
        subCategory: "living_room",
        condition: "like_new",
        price: "28000.00",
        originalPrice: "45000.00",
        isNegotiable: 1,
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop"
        ],
        location: "Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        brand: "HomeTown",
        age: "< 6 months",
        warranty: "Manufacturer warranty valid till June 2024",
        accessories: "4 decorative cushions, center table, furniture protector pads",
        status: "active",
        isFeatured: 0,
        views: 189,
        favoriteCount: 15,
        soldAt: null,
        soldPrice: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "4",
        userId: "user-1",
        title: "Sony PlayStation 5 Console with 2 Controllers & 5 Games",
        description: "Sony PS5 Disc Edition in mint condition. Barely used as I don't get much time to play. Comes with 2 DualSense wireless controllers (one white, one black), 5 popular games (FIFA 23, Spider-Man Miles Morales, God of War Ragnarok, Gran Turismo 7, and Horizon Forbidden West). All games are physical discs in perfect condition. Console has no scratches or issues, works flawlessly. Original box and all accessories included. HDMI cable, power cable, charging station for controllers also included. Amazing deal for someone looking to get into PS5 gaming with a complete setup.",
        category: "electronics",
        subCategory: "gaming",
        condition: "like_new",
        price: "52000.00",
        originalPrice: "75000.00",
        isNegotiable: 1,
        images: [
          "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&h=800&fit=crop"
        ],
        location: "Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        brand: "Sony",
        age: "6-12 months",
        warranty: "Warranty valid till March 2025",
        accessories: "2 controllers, charging station, 5 games, HDMI cable, original box",
        status: "active",
        isFeatured: 1,
        views: 412,
        favoriteCount: 35,
        soldAt: null,
        soldPrice: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }
    ];

    sampleListings.forEach((listing) => {
      const swapNowListing: SwapNowListing = listing as SwapNowListing;
      this.swapNowListings.set(swapNowListing.id, swapNowListing);
    });
  }

  // SwapNow Marketplace Methods
  async getSwapNowListings(filters?: { category?: string; status?: string; city?: string; condition?: string }): Promise<SwapNowListing[]> {
    let listings = Array.from(this.swapNowListings.values());
    
    if (filters?.category) {
      listings = listings.filter(l => l.category === filters.category);
    }
    if (filters?.status) {
      listings = listings.filter(l => l.status === filters.status);
    }
    if (filters?.city) {
      listings = listings.filter(l => l.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.condition) {
      listings = listings.filter(l => l.condition === filters.condition);
    }
    
    return listings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSwapNowListing(id: string): Promise<SwapNowListing | undefined> {
    return this.swapNowListings.get(id);
  }

  async getSwapNowListingsByUser(userId: string): Promise<SwapNowListing[]> {
    return Array.from(this.swapNowListings.values())
      .filter(l => l.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSwapNowListing(listing: InsertSwapNowListing): Promise<SwapNowListing> {
    const id = randomUUID();
    const newListing: SwapNowListing = {
      id,
      ...listing,
      status: listing.status || "active",
      isFeatured: listing.isFeatured || 0,
      views: 0,
      favoriteCount: 0,
      soldAt: null,
      soldPrice: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.swapNowListings.set(id, newListing);
    return newListing;
  }

  async updateSwapNowListing(id: string, listing: Partial<SwapNowListing>): Promise<SwapNowListing | undefined> {
    const existing = this.swapNowListings.get(id);
    if (!existing) return undefined;

    const updated: SwapNowListing = {
      ...existing,
      ...listing,
      updatedAt: new Date(),
    };
    this.swapNowListings.set(id, updated);
    return updated;
  }

  async deleteSwapNowListing(id: string): Promise<boolean> {
    return this.swapNowListings.delete(id);
  }

  async incrementSwapNowListingViews(id: string): Promise<void> {
    const listing = this.swapNowListings.get(id);
    if (listing) {
      listing.views = (listing.views || 0) + 1;
      this.swapNowListings.set(id, listing);
    }
  }

  async markSwapNowListingAsSold(id: string, soldPrice?: number): Promise<SwapNowListing | undefined> {
    const listing = this.swapNowListings.get(id);
    if (!listing) return undefined;

    const updated: SwapNowListing = {
      ...listing,
      status: "sold",
      soldAt: new Date(),
      soldPrice: soldPrice ? soldPrice.toString() : listing.price,
      updatedAt: new Date(),
    };
    this.swapNowListings.set(id, updated);
    return updated;
  }

  async getSwapNowConversationsByUser(userId: string): Promise<SwapNowConversation[]> {
    return Array.from(this.swapNowConversations.values())
      .filter(c => c.buyerId === userId || c.sellerId === userId)
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  async getSwapNowConversation(id: string): Promise<SwapNowConversation | undefined> {
    return this.swapNowConversations.get(id);
  }

  async getSwapNowConversationByListingAndBuyer(listingId: string, buyerId: string): Promise<SwapNowConversation | undefined> {
    return Array.from(this.swapNowConversations.values()).find(
      c => c.listingId === listingId && c.buyerId === buyerId
    );
  }

  async createSwapNowConversation(conversation: InsertSwapNowConversation): Promise<SwapNowConversation> {
    const id = randomUUID();
    const newConversation: SwapNowConversation = {
      id,
      ...conversation,
      lastMessageAt: new Date(),
      status: conversation.status || "active",
      buyerUnreadCount: 0,
      sellerUnreadCount: 0,
      createdAt: new Date(),
    };
    this.swapNowConversations.set(id, newConversation);
    return newConversation;
  }

  async updateSwapNowConversation(id: string, conversation: Partial<SwapNowConversation>): Promise<SwapNowConversation | undefined> {
    const existing = this.swapNowConversations.get(id);
    if (!existing) return undefined;

    const updated: SwapNowConversation = {
      ...existing,
      ...conversation,
    };
    this.swapNowConversations.set(id, updated);
    return updated;
  }

  async getSwapNowMessagesByConversation(conversationId: string): Promise<SwapNowMessage[]> {
    return Array.from(this.swapNowMessages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getSwapNowMessage(id: string): Promise<SwapNowMessage | undefined> {
    return this.swapNowMessages.get(id);
  }

  async createSwapNowMessage(message: InsertSwapNowMessage): Promise<SwapNowMessage> {
    const id = randomUUID();
    const newMessage: SwapNowMessage = {
      id,
      ...message,
      isRead: 0,
      readAt: null,
      createdAt: new Date(),
    };
    this.swapNowMessages.set(id, newMessage);

    // Update conversation's last message time and unread count
    const conversation = await this.getSwapNowConversation(message.conversationId);
    if (conversation) {
      const isBuyer = message.senderId === conversation.buyerId;
      await this.updateSwapNowConversation(message.conversationId, {
        lastMessageAt: new Date(),
        buyerUnreadCount: isBuyer ? conversation.buyerUnreadCount : (conversation.buyerUnreadCount || 0) + 1,
        sellerUnreadCount: isBuyer ? (conversation.sellerUnreadCount || 0) + 1 : conversation.sellerUnreadCount,
      });
    }

    return newMessage;
  }

  async updateSwapNowMessage(id: string, message: Partial<SwapNowMessage>): Promise<SwapNowMessage | undefined> {
    const existing = this.swapNowMessages.get(id);
    if (!existing) return undefined;

    const updated: SwapNowMessage = {
      ...existing,
      ...message,
    };
    this.swapNowMessages.set(id, updated);
    return updated;
  }

  async markSwapNowMessageAsRead(id: string): Promise<void> {
    const message = this.swapNowMessages.get(id);
    if (message && message.isRead === 0) {
      message.isRead = 1;
      message.readAt = new Date();
      this.swapNowMessages.set(id, message);
    }
  }

  async getSwapNowOffersByListing(listingId: string): Promise<SwapNowOffer[]> {
    return Array.from(this.swapNowOffers.values())
      .filter(o => o.listingId === listingId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSwapNowOffersByBuyer(buyerId: string): Promise<SwapNowOffer[]> {
    return Array.from(this.swapNowOffers.values())
      .filter(o => o.buyerId === buyerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSwapNowOffersBySeller(sellerId: string): Promise<SwapNowOffer[]> {
    return Array.from(this.swapNowOffers.values())
      .filter(o => o.sellerId === sellerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSwapNowOffer(offer: InsertSwapNowOffer): Promise<SwapNowOffer> {
    const id = randomUUID();
    const newOffer: SwapNowOffer = {
      id,
      ...offer,
      status: offer.status || "pending",
      counterAmount: null,
      counterNote: null,
      respondedAt: null,
      createdAt: new Date(),
    };
    this.swapNowOffers.set(id, newOffer);
    return newOffer;
  }

  async updateSwapNowOffer(id: string, offer: Partial<SwapNowOffer>): Promise<SwapNowOffer | undefined> {
    const existing = this.swapNowOffers.get(id);
    if (!existing) return undefined;

    const updated: SwapNowOffer = {
      ...existing,
      ...offer,
      respondedAt: offer.status && offer.status !== "pending" ? new Date() : existing.respondedAt,
    };
    this.swapNowOffers.set(id, updated);
    return updated;
  }

  async getSwapNowFavoritesByUser(userId: string): Promise<SwapNowFavorite[]> {
    return Array.from(this.swapNowFavorites.values())
      .filter(f => f.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createSwapNowFavorite(favorite: InsertSwapNowFavorite): Promise<SwapNowFavorite> {
    const id = randomUUID();
    const newFavorite: SwapNowFavorite = {
      id,
      ...favorite,
      createdAt: new Date(),
    };
    this.swapNowFavorites.set(id, newFavorite);

    // Increment favorite count on listing
    const listing = await this.getSwapNowListing(favorite.listingId);
    if (listing) {
      await this.updateSwapNowListing(favorite.listingId, {
        favoriteCount: (listing.favoriteCount || 0) + 1,
      });
    }

    return newFavorite;
  }

  async deleteSwapNowFavorite(userId: string, listingId: string): Promise<boolean> {
    const favorites = Array.from(this.swapNowFavorites.values());
    const favorite = favorites.find(f => f.userId === userId && f.listingId === listingId);
    
    if (favorite) {
      this.swapNowFavorites.delete(favorite.id);
      
      // Decrement favorite count on listing
      const listing = await this.getSwapNowListing(listingId);
      if (listing && listing.favoriteCount && listing.favoriteCount > 0) {
        await this.updateSwapNowListing(listingId, {
          favoriteCount: listing.favoriteCount - 1,
        });
      }
      
      return true;
    }
    return false;
  }

  async getConsultantCategories(): Promise<ConsultantCategory[]> {
    return Array.from(this.consultantCategories.values())
      .filter(c => c.isActive === 1)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  async getConsultantCategory(id: string): Promise<ConsultantCategory | undefined> {
    return this.consultantCategories.get(id);
  }

  async getConsultantCategoryBySlug(slug: string): Promise<ConsultantCategory | undefined> {
    return Array.from(this.consultantCategories.values()).find(c => c.slug === slug);
  }

  async createConsultantCategory(category: InsertConsultantCategory): Promise<ConsultantCategory> {
    const id = randomUUID();
    const newCategory: ConsultantCategory = {
      id,
      ...category,
      createdAt: new Date(),
    };
    this.consultantCategories.set(id, newCategory);
    return newCategory;
  }

  async getConsultantProviders(filters?: { categoryId?: string; city?: string; verified?: boolean; rating?: number }): Promise<ConsultantProvider[]> {
    let providers = Array.from(this.consultantProviders.values()).filter(p => p.isActive === 1);
    
    if (filters?.categoryId) {
      providers = providers.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.city) {
      providers = providers.filter(p => p.city === filters.city);
    }
    if (filters?.verified !== undefined) {
      providers = providers.filter(p => p.verified === (filters.verified ? 1 : 0));
    }
    if (filters?.rating) {
      providers = providers.filter(p => parseFloat(p.rating || "0") >= filters.rating!);
    }
    
    return providers.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
  }

  async getConsultantProvider(id: string): Promise<ConsultantProvider | undefined> {
    return this.consultantProviders.get(id);
  }

  async searchConsultantProviders(query: string, categoryId?: string): Promise<ConsultantProvider[]> {
    const lowerQuery = query.toLowerCase();
    let providers = Array.from(this.consultantProviders.values()).filter(p => 
      p.isActive === 1 && (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.designation?.toLowerCase().includes(lowerQuery) ||
        p.bio?.toLowerCase().includes(lowerQuery)
      )
    );
    
    if (categoryId) {
      providers = providers.filter(p => p.categoryId === categoryId);
    }
    
    return providers;
  }

  async createConsultantProvider(provider: InsertConsultantProvider): Promise<ConsultantProvider> {
    const id = randomUUID();
    const newProvider: ConsultantProvider = {
      id,
      ...provider,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.consultantProviders.set(id, newProvider);
    return newProvider;
  }

  async updateConsultantProvider(id: string, provider: Partial<ConsultantProvider>): Promise<ConsultantProvider | undefined> {
    const existing = this.consultantProviders.get(id);
    if (!existing) return undefined;
    
    const updated: ConsultantProvider = {
      ...existing,
      ...provider,
      updatedAt: new Date(),
    };
    this.consultantProviders.set(id, updated);
    return updated;
  }

  async getConsultantServicesByProvider(providerId: string): Promise<ConsultantService[]> {
    return Array.from(this.consultantServices.values())
      .filter(s => s.providerId === providerId && s.isActive === 1);
  }

  async getConsultantService(id: string): Promise<ConsultantService | undefined> {
    return this.consultantServices.get(id);
  }

  async createConsultantService(service: InsertConsultantService): Promise<ConsultantService> {
    const id = randomUUID();
    const newService: ConsultantService = {
      id,
      ...service,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.consultantServices.set(id, newService);
    return newService;
  }

  async updateConsultantService(id: string, service: Partial<ConsultantService>): Promise<ConsultantService | undefined> {
    const existing = this.consultantServices.get(id);
    if (!existing) return undefined;
    
    const updated: ConsultantService = {
      ...existing,
      ...service,
      updatedAt: new Date(),
    };
    this.consultantServices.set(id, updated);
    return updated;
  }

  async getConsultantBookingsByUser(userId: string): Promise<ConsultantBooking[]> {
    return Array.from(this.consultantBookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getConsultantBooking(id: string): Promise<ConsultantBooking | undefined> {
    return this.consultantBookings.get(id);
  }

  async getConsultantBookingByNumber(bookingNumber: string): Promise<ConsultantBooking | undefined> {
    return Array.from(this.consultantBookings.values()).find(b => b.bookingNumber === bookingNumber);
  }

  async createConsultantBooking(booking: InsertConsultantBooking): Promise<ConsultantBooking> {
    const id = randomUUID();
    const bookingNumber = `BKS${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newBooking: ConsultantBooking = {
      id,
      bookingNumber,
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    };
    this.consultantBookings.set(id, newBooking);
    return newBooking;
  }

  async updateConsultantBooking(id: string, booking: Partial<ConsultantBooking>): Promise<ConsultantBooking | undefined> {
    const existing = this.consultantBookings.get(id);
    if (!existing) return undefined;
    
    const updated: ConsultantBooking = {
      ...existing,
      ...booking,
      updatedAt: new Date(),
    };
    this.consultantBookings.set(id, updated);
    return updated;
  }

  async getConsultantReviewsByProvider(providerId: string): Promise<ConsultantReview[]> {
    return Array.from(this.consultantReviews.values())
      .filter(r => r.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getConsultantReviewByBooking(bookingId: string): Promise<ConsultantReview | undefined> {
    return Array.from(this.consultantReviews.values()).find(r => r.bookingId === bookingId);
  }

  async createConsultantReview(review: InsertConsultantReview): Promise<ConsultantReview> {
    const id = randomUUID();
    const newReview: ConsultantReview = {
      id,
      ...review,
      createdAt: new Date(),
      respondedAt: null,
    };
    this.consultantReviews.set(id, newReview);
    
    // Update provider rating
    const provider = await this.getConsultantProvider(review.providerId);
    if (provider) {
      const reviews = await this.getConsultantReviewsByProvider(review.providerId);
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / reviews.length;
      
      await this.updateConsultantProvider(review.providerId, {
        rating: avgRating.toFixed(2),
        totalReviews: reviews.length,
      });
    }
    
    return newReview;
  }

  async getConsultantAvailabilityByProvider(providerId: string): Promise<ConsultantAvailability[]> {
    return Array.from(this.consultantAvailability.values())
      .filter(a => a.providerId === providerId && a.isActive === 1);
  }

  async createConsultantAvailability(availability: InsertConsultantAvailability): Promise<ConsultantAvailability> {
    const id = randomUUID();
    const newAvailability: ConsultantAvailability = {
      id,
      ...availability,
      createdAt: new Date(),
    };
    this.consultantAvailability.set(id, newAvailability);
    return newAvailability;
  }
}

export const storage = new MemStorage();
