import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createRateLimiter, requireAuth, optionalAuth } from "./middleware/security";
import { 
  otpGenerationSchema,
  otpVerificationSchema, 
  loanEligibilitySchema,
  insertLoanApplicationSchema,
  loanMatchRequestSchema,
  fraudScanRequestSchema,
  coachQuerySchema,
  insertSecurityScanSchema,
  insertCoachInteractionSchema,
  insertCreatorSchema,
  insertCreatorSessionSchema,
  insertBookingSchema,
  insertCreatorReviewSchema,
  insertCreatorAvailabilitySchema,
  bookingRequestSchema,
  creatorProfileSchema,
  sessionFilterSchema,
  reviewSubmissionSchema,
  insertUpiAccountSchema,
  insertUpiTransactionSchema,
  insertUpiRewardSchema,
  upiPaymentSchema,
  upiCollectRequestSchema,
  billPaymentSchema,
  emiPaymentUpiSchema,
  insertInsurancePolicySchema,
  insurancePremiumPaymentSchema,
  insuranceClaimFormSchema,
  // Travel booking schemas
  travelSearchSchema,
  bookingConfirmationSchema,
  insertTravelRouteSchema,
  insertTravelScheduleSchema,
  insertTravelBookingSchema,
  // Investment schemas
  insertInvestmentWatchlistSchema,
  insertInvestmentOrderSchema,
  insertInvestmentVendorSchema,
  insertMarketDataSchema,
  insertTransactionConfirmationSchema,
  insertTransactionSuccessRecordSchema,
  // FASTag schemas
  insertUserVehicleSchema,
  insertFastagAccountSchema,
  insertFastagTransactionSchema,
  // Profile-related schemas
  insertLoanAmortizationScheduleSchema,
  insertLoanDocumentSchema,
  insertSavedCardSchema,
  insertCardTransactionSchema,
  insertBankAccountSchema,
  insertActivityLogSchema,
  insertStockTradeSchema,
  insertFinancialGoalSchema,
  insertBudgetSchema,
  // Movie booking schemas
  insertMovieSchema,
  insertTheaterSchema,
  insertMovieShowtimeSchema,
  insertSeatCategorySchema,
  insertSeatLayoutSchema,
  insertSeatHoldSchema,
  insertMovieBookingSchema,
  insertFoodMenuItemSchema,
  // Event booking schemas
  insertEventSchema,
  insertEventTicketTierSchema,
  insertEventTicketHoldSchema,
  insertEventBookingSchema,
  // Hotel booking schemas
  insertHotelSchema,
  insertHotelRoomSchema,
  insertHotelRoomInventorySchema,
  insertHotelBookingSchema,
  insertHotelReviewSchema,
  // Metro booking schemas
  insertMetroStationSchema,
  insertMetroRouteSchema,
  insertMetroSmartCardSchema,
  insertMetroTicketSchema,
  insertMetroTravelHistorySchema,
  // Rental booking schemas
  insertRentalVehicleSchema,
  insertRentalLocationSchema,
  insertRentalBookingSchema,
  insertRentalReviewSchema,
  insertRentalTripSchema,
  insertRentalTripCheckpointSchema,
  insertRentalDocumentSchema,
  insertRentalVehicleInspectionSchema,
  // Credit Card schemas
  insertCreditCardOfferSchema,
  insertCreditCardApplicationSchema,
  // ShareWise schemas
  insertSharewiseGroupSchema,
  insertSharewiseGroupMemberSchema,
  insertSharewiseExpenseSchema,
  insertSharewiseExpenseSplitSchema,
  insertSharewiseSettlementSchema,
  // Travel Coupon schemas
  insertTravelCouponSchema,
  insertTravelCouponUsageSchema,
  // Coupon Mart schemas
  insertCouponMartListingSchema,
  insertCouponMartTransactionSchema,
  insertCouponMartTradeOfferSchema,
  // BookSure Consultant Booking schemas
  insertConsultantCategorySchema,
  insertConsultantProviderSchema,
  insertConsultantServiceSchema,
  insertConsultantBookingSchema,
  consultantBookingFormSchema,
  insertConsultantReviewSchema,
  consultantReviewFormSchema,
  insertConsultantAvailabilitySchema,
  // SwapNow Marketplace schemas
  insertSwapNowListingSchema,
  insertSwapNowConversationSchema,
  insertSwapNowMessageSchema,
  insertSwapNowOfferSchema,
  insertSwapNowFavoriteSchema
} from "@shared/schema";
import { z } from "zod";
import { generateToken, getCookieOptions } from "./jwt";
import { travelApiService } from "./services/travelApiService";
import { financialApiService } from "./services/financialApiService";

// Validation schemas for params and query
const idParamsSchema = z.object({
  id: z.string().min(1, "ID is required")
});

const movieFiltersSchema = z.object({
  genre: z.string().optional(),
  language: z.string().optional(),
  city: z.string().optional()
});

const theaterFiltersSchema = z.object({
  city: z.string().optional(),
  movieId: z.string().optional()
});

const eventFiltersSchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional()
});

const hotelFiltersSchema = z.object({
  city: z.string().optional(),
  propertyType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional()
});

const roomInventoryQuerySchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required")
});

const showtimeFiltersSchema = z.object({
  movieId: z.string().optional(),
  theaterId: z.string().optional(),
  date: z.string().optional()
});

// Utility function to generate a secure 4-digit OTP
function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Configuration helper to check if mock OTP mode is enabled
function isMockOtpEnabled(): boolean {
  const isMock = process.env.OTP_MODE === 'mock' && process.env.NODE_ENV !== 'production';
  
  // Log warning on first check if mock mode is enabled
  if (isMock && !process.env.MOCK_OTP_WARNING_SHOWN) {
    console.warn('⚠️  WARNING: Mock OTP mode is ENABLED! Any 10-digit phone and any 4-digit OTP will work.');
    console.warn('⚠️  This is for development/testing only. Set OTP_MODE to something other than "mock" to disable.');
    process.env.MOCK_OTP_WARNING_SHOWN = 'true';
  }
  
  return isMock;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // OTP generation endpoint with rate limiting - SECURE IMPLEMENTATION
  app.post("/api/auth/send-otp", createRateLimiter('OTP_GENERATION'), async (req, res) => {
    try {
      const { phone } = otpGenerationSchema.parse(req.body);
      
      // Validate phone number format
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be exactly 10 digits"
        });
      }
      
      // Check if mock OTP mode is enabled
      if (isMockOtpEnabled()) {
        // Mock mode: skip OTP storage and return success immediately
        console.log(`Mock OTP: Any 4-digit code will work for ${phone}`);
        
        res.json({
          success: true,
          message: "OTP sent successfully",
          expiresIn: 600 // 10 minutes in seconds
        });
        return;
      }
      
      // SECURE MODE: Regular OTP flow
      // Clean up any existing OTPs for this phone to prevent attempt counter bypass
      await storage.cleanupExpiredOtps();
      const existingOtp = await storage.getOtpByPhone(phone);
      if (existingOtp) {
        await storage.markOtpAsUsed(existingOtp.id);
      }
      
      // Generate actual secure OTP
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      
      // Store OTP securely in database
      await storage.createOtp({
        phone,
        code: otp,
        expiresAt,
        isUsed: 0
      });
      
      // In production, integrate with SMS provider (Twilio, etc.)
      // For now, log the OTP for development/testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`OTP for ${phone}: ${otp} (expires at ${expiresAt.toISOString()})`);
      }
      
      res.json({
        success: true,
        message: "OTP sent successfully",
        expiresIn: 600 // 10 minutes in seconds
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid phone number format" 
          : "Failed to send OTP. Please try again."
      });
    }
  });
  
  // Session validation endpoint
  app.get("/api/auth/session", requireAuth, async (req, res) => {
    try {
      // If we reach here, the token is valid (requireAuth middleware passed)
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Invalid session"
        });
      }
      
      // Get current user data
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }
      
      res.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name || `User ${user.phone}`,
          isVerified: user.isVerified || 1
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Session validation failed"
      });
    }
  });
  
  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    // Clear the authentication cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
  
  // OTP verification with rate limiting - SECURE IMPLEMENTATION
  app.post("/api/auth/verify-otp", createRateLimiter('OTP_VERIFICATION'), async (req, res) => {
    try {
      const { phone, otp } = otpVerificationSchema.parse(req.body);
      
      // Validate input format
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be exactly 10 digits"
        });
      }
      
      if (!/^\d{4}$/.test(otp)) {
        return res.status(400).json({
          success: false,
          message: "OTP must be exactly 4 digits"
        });
      }
      
      // Check if mock OTP mode is enabled
      if (isMockOtpEnabled()) {
        // Mock mode: accept any 4-digit OTP, find or create user
        console.log(`Mock OTP: Accepting OTP ${otp} for ${phone}`);
        
        // Find or create user with better error handling
        let user = await storage.getUserByPhone(phone);
        if (!user) {
          try {
            user = await storage.createUser({ 
              phone,
              name: `User ${phone}`,
              isVerified: 1 
            });
          } catch (createError) {
            // Log error for debugging without exposing details
            return res.status(500).json({ 
              success: false, 
              message: "Failed to create user account. Please try again." 
            });
          }
        }

        // Ensure user object is complete before returning
        if (!user || !user.id || !user.phone) {
          return res.status(500).json({ 
            success: false, 
            message: "User data incomplete. Please try again." 
          });
        }

        // Generate JWT token
        const token = generateToken(user);
        
        // Set httpOnly cookie with the token
        res.cookie('auth_token', token, getCookieOptions());
        
        res.json({ 
          success: true, 
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name || `User ${phone}`,
            isVerified: user.isVerified || 1
          }
          // Note: We don't return the token in the response body for security
        });
        return;
      }
      
      // SECURE MODE: Regular OTP verification flow
      // Get the active OTP for this phone to properly track attempts
      const activeOtp = await storage.getOtpByPhone(phone);
      
      if (!activeOtp || activeOtp.isUsed === 1 || new Date() > new Date(activeOtp.expiresAt)) {
        return res.status(400).json({
          success: false,
          message: "No valid OTP found. Please request a new one."
        });
      }
      
      // Check if already locked out due to too many attempts
      if ((activeOtp.attempts || 0) >= 3) {
        return res.status(429).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP."
        });
      }
      
      // Verify the OTP code
      if (activeOtp.code !== otp) {
        // Increment attempt counter for the active OTP
        await storage.incrementOtpAttempts(activeOtp.id);
        
        // Check if this was the 3rd failed attempt
        if ((activeOtp.attempts || 0) + 1 >= 3) {
          await storage.markOtpAsUsed(activeOtp.id);
          return res.status(429).json({
            success: false,
            message: "Too many failed attempts. Please request a new OTP."
          });
        }
        
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please try again."
        });
      }
      
      // OTP is valid - use the activeOtp
      const validOtp = activeOtp;
      
      // Mark OTP as used to prevent reuse
      await storage.markOtpAsUsed(validOtp.id);
      
      // Find or create user with better error handling
      let user = await storage.getUserByPhone(phone);
      if (!user) {
        try {
          user = await storage.createUser({ 
            phone,
            name: `User ${phone}`,
            isVerified: 1 
          });
        } catch (createError) {
          // Log error for debugging without exposing details
          return res.status(500).json({ 
            success: false, 
            message: "Failed to create user account. Please try again." 
          });
        }
      }

      // Ensure user object is complete before returning
      if (!user || !user.id || !user.phone) {
        return res.status(500).json({ 
          success: false, 
          message: "User data incomplete. Please try again." 
        });
      }

      // Generate JWT token
      const token = generateToken(user);
      
      // Set httpOnly cookie with the token
      res.cookie('auth_token', token, getCookieOptions());
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name || `User ${phone}`,
          isVerified: user.isVerified || 1
        }
        // Note: We don't return the token in the response body for security
      });
    } catch (error) {
      // Enhanced error handling without exposing internal details
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid phone number or OTP format" 
          : "Verification failed. Please try again."
      });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });

  // Update user profile (requires authentication)
  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Ensure user can only update their own profile
      if (req.user?.id !== id) {
        return res.status(403).json({ 
          success: false, 
          message: "You can only update your own profile" 
        });
      }
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Get user financial report (requires authentication)
  app.get("/api/myreport", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Comprehensive financial report data - in real app would come from credit bureaus
    const reportData = {
      subscriptionTier: "premium",
      creditScore: 750,
      lastUpdated: "2024-01-15",
      userId: userId,
      overallHealth: 85,
      improvements: {
        thisMonth: 12,
        lastMonth: 8
      },
      profile: {
        name: user.name || "User",
        phone: user.phone,
        email: user.email || "",
        panNumber: user.panCard || "ABCDE1234F",
        address: "Mumbai, Maharashtra",
        employmentType: "Salaried",
        monthlyIncome: 75000,
        isVerified: true
      },
      // Enhanced Credit Usage Details
      creditUsage: {
        used: 135000,
        limit: 480000,
        utilization: 28,
        available: 345000,
        status: "Excellent"
      },
      // Enhanced Payment History
      paymentHistorySummary: {
        onTimeRate: 98,
        streak: 11,
        last12Months: "11/12 On-Time",
        missedPayments: 1,
        status: "Excellent"
      },
      // Credit Inquiries Details
      inquiries: {
        last24Months: 2,
        last6Months: 1,
        thisYear: 2,
        impact: "Low",
        recentDate: "2024-01-05"
      },
      // Credit Age and Timeline
      creditAge: {
        average: "4 years 2 months",
        oldest: "12 years 6 months",
        newest: "2 years 1 month",
        timeline: {
          new: 25,        // 0-2 years
          established: 40, // 2-7 years
          mature: 35      // 7+ years
        }
      },
      // Account Mix Details
      accountMix: {
        revolving: 40,      // Credit cards
        installment: 25,    // Personal/auto loans
        mortgage: 20,       // Home loans
        other: 15,         // Other types
        diversity: "Good"
      },
      // Alerts and Notifications
      alerts: {
        urgentCount: 0,
        warningCount: 1,
        infoCount: 2,
        upcoming: "No urgent alerts"
      },
      // Upcoming EMI Information
      upcomingEmi: {
        count: 3,
        next7Days: 0,
        nextAmount: 14000,
        nextDate: "2024-01-15",
        status: "All up to date"
      },
      creditSummary: {
        totalAccounts: 8,
        activeLoans: 3,
        creditCards: 2,
        totalCreditLimit: 480000,
        usedCredit: 135000,
        creditUtilization: 28,
        paymentHistory: 98,
        creditAge: "4 years 2 months",
        hardInquiries: 2
      },
      recommendations: [
        {
          id: "rec1",
          type: "improvement",
          title: "Reduce Credit Utilization",
          description: "Lower your credit card usage to below 30% for better score",
          impact: "+15 points",
          actionRequired: "Pay down credit cards"
        },
        {
          id: "rec2",
          type: "warning",
          title: "Missed EMI Alert",
          description: "Upcoming EMI payment due in 3 days",
          impact: "Avoid penalties",
          actionRequired: "Make payment"
        },
        {
          id: "rec3",
          type: "critical",
          title: "High Debt-to-Income Ratio",
          description: "Consider consolidating loans for better management",
          impact: "Reduce stress",
          actionRequired: "Review loan options"
        },
        {
          id: "rec4",
          type: "improvement",
          title: "Build Emergency Fund",
          description: "Create 6-month expense buffer for financial security",
          impact: "Financial safety",
          actionRequired: "Start saving"
        }
      ],
      // Extended 12-Month Score History for Bar Chart
      scoreHistory: [
        { month: "Feb", score: 685, change: -8 },
        { month: "Mar", score: 692, change: 7 },
        { month: "Apr", score: 705, change: 13 },
        { month: "May", score: 710, change: 5 },
        { month: "Jun", score: 718, change: 8 },
        { month: "Jul", score: 715, change: -3 },
        { month: "Aug", score: 720, change: 5 },
        { month: "Sep", score: 735, change: 15 },
        { month: "Oct", score: 742, change: 7 },
        { month: "Nov", score: 750, change: 8 },
        { month: "Dec", score: 748, change: -2 },
        { month: "Jan", score: 750, change: 2 }
      ],
      loans: [
        {
          id: "1",
          lenderName: "HDFC Bank",
          loanType: "home",
          principalAmount: 2500000,
          currentBalance: 2100000,
          interestRate: 8.5,
          emiAmount: 23000,
          startDate: "2021-03-15",
          nextDueDate: "2024-01-15",
          totalInterestPaid: 180000,
          totalInstallments: 240,
          missedInstallments: 0,
          tenure: 20,
          paymentHistory: []
        },
        {
          id: "2",
          lenderName: "ICICI Bank",
          loanType: "personal",
          principalAmount: 500000,
          currentBalance: 320000,
          interestRate: 11.5,
          emiAmount: 14000,
          startDate: "2022-06-10",
          nextDueDate: "2024-01-10",
          totalInterestPaid: 75000,
          totalInstallments: 48,
          missedInstallments: 1,
          tenure: 4,
          paymentHistory: []
        }
      ]
    };

    res.json(reportData);
  });

  // Check loan eligibility
  app.post("/api/loans/eligibility", requireAuth, async (req, res) => {
    try {
      const eligibilityData = loanEligibilitySchema.parse(req.body);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Update user with eligibility data
      await storage.updateUser(userId, {
        dateOfBirth: eligibilityData.dateOfBirth,
        gender: eligibilityData.gender,
        maritalStatus: eligibilityData.maritalStatus,
        pincode: eligibilityData.pincode,
        panCard: eligibilityData.panCard,
        residenceType: eligibilityData.residenceType,
      });

      // Mock eligibility response
      res.json({
        eligible: true,
        maxAmount: 1000000,
        minInterestRate: 10.5,
        maxTenure: 84,
        creditScore: 750,
        message: "You are eligible for a personal loan"
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid eligibility data" });
    }
  });

  // Create loan application (requires authentication)
  app.post("/api/loans/apply", requireAuth, createRateLimiter('LOAN_APPLICATION'), async (req, res) => {
    try {
      // Parse request without userId - it will be added from session
      const loanRequestSchema = insertLoanApplicationSchema.omit({ userId: true });
      const applicationData = loanRequestSchema.parse(req.body);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const application = await storage.createLoanApplication({
        ...applicationData,
        userId,
      });

      // Create notification
      await storage.createNotification({
        userId,
        title: "Loan Application Submitted",
        message: `Your ${applicationData.loanType} loan application for ₹${applicationData.amount} has been submitted successfully.`,
        type: "approval",
        metadata: { loanId: application.id }
      });

      res.json(application);
    } catch (error) {
      console.error('Loan application error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // Get user's loan applications (requires authentication)
  app.get("/api/loans", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Return comprehensive demo data with active, pending, and completed loans
    const mockLoanData = [
      // ACTIVE LOANS (10)
      {
        id: "1",
        userId: userId,
        loanType: "personal",
        amount: "250000",
        tenure: 24,
        interestRate: "11.5",
        purpose: "Home Improvement",
        status: "active",
        applicationNumber: "PL-2024-001",
        emi: "11250",
        totalPaid: "67500",
        approvedAmount: "250000",
        disbursedAmount: "250000",
        outstandingAmount: "182500",
        nextEmiDate: new Date(2024, 1, 15),
        createdAt: new Date(2023, 10, 15),
        updatedAt: new Date(2023, 10, 15),
      },
      {
        id: "2", 
        userId: userId,
        loanType: "business",
        amount: "500000", 
        tenure: 36,
        interestRate: "13.2",
        purpose: "Business Expansion",
        status: "active",
        applicationNumber: "BL-2024-002", 
        emi: "17800",
        totalPaid: "213600",
        approvedAmount: "500000",
        disbursedAmount: "500000",
        outstandingAmount: "286400",
        nextEmiDate: new Date(2024, 1, 20),
        createdAt: new Date(2023, 8, 10),
        updatedAt: new Date(2023, 8, 10),
      },
      {
        id: "6",
        userId: userId,
        loanType: "vehicle",
        amount: "180000",
        tenure: 18,
        interestRate: "10.8",
        purpose: "Car Purchase",
        status: "active",
        applicationNumber: "VL-2024-006",
        emi: "10800",
        totalPaid: "43200",
        approvedAmount: "180000",
        disbursedAmount: "180000",
        outstandingAmount: "136800",
        nextEmiDate: new Date(2024, 1, 25),
        createdAt: new Date(2023, 11, 5),
        updatedAt: new Date(2023, 11, 5),
      },
      {
        id: "11",
        userId: userId,
        loanType: "home",
        amount: "1500000",
        tenure: 60,
        interestRate: "8.5",
        purpose: "Home Renovation",
        status: "active",
        applicationNumber: "HL-2024-011",
        emi: "31200",
        totalPaid: "124800",
        approvedAmount: "1500000",
        disbursedAmount: "1500000",
        outstandingAmount: "1375200",
        nextEmiDate: new Date(2024, 1, 28),
        createdAt: new Date(2023, 9, 20),
        updatedAt: new Date(2023, 9, 20),
      },
      {
        id: "12",
        userId: userId,
        loanType: "education",
        amount: "400000",
        tenure: 48,
        interestRate: "9.8",
        purpose: "MBA Program",
        status: "active",
        applicationNumber: "EL-2024-012",
        emi: "9800",
        totalPaid: "29400",
        approvedAmount: "400000",
        disbursedAmount: "400000",
        outstandingAmount: "370600",
        nextEmiDate: new Date(2024, 2, 5),
        createdAt: new Date(2023, 11, 10),
        updatedAt: new Date(2023, 11, 10),
      },
      {
        id: "17",
        userId: userId,
        loanType: "personal",
        amount: "75000",
        tenure: 12,
        interestRate: "12.5",
        purpose: "Travel & Vacation",
        status: "active",
        applicationNumber: "PL-2024-017",
        emi: "6800",
        totalPaid: "13600",
        approvedAmount: "75000",
        disbursedAmount: "75000",
        outstandingAmount: "61400",
        nextEmiDate: new Date(2024, 2, 10),
        createdAt: new Date(2023, 11, 20),
        updatedAt: new Date(2023, 11, 20),
      },
      {
        id: "25",
        userId: userId,
        loanType: "vehicle",
        amount: "800000",
        tenure: 36,
        interestRate: "11.2",
        purpose: "SUV Purchase",
        status: "active",
        applicationNumber: "VL-2024-025",
        emi: "26500",
        totalPaid: "79500",
        approvedAmount: "800000",
        disbursedAmount: "800000",
        outstandingAmount: "720500",
        nextEmiDate: new Date(2024, 2, 18),
        createdAt: new Date(2023, 11, 25),
        updatedAt: new Date(2023, 11, 25),
      },
      {
        id: "101",
        userId: userId,
        loanType: "home",
        amount: "2500000",
        tenure: 84,
        interestRate: "8.2",
        purpose: "Home Purchase",
        status: "active",
        applicationNumber: "HL-2024-101",
        emi: "35600",
        totalPaid: "142400",
        approvedAmount: "2500000",
        disbursedAmount: "2500000",
        outstandingAmount: "2357600",
        nextEmiDate: new Date(2024, 2, 25),
        createdAt: new Date(2023, 12, 1),
        updatedAt: new Date(2023, 12, 1),
      },
      {
        id: "102",
        userId: userId,
        loanType: "education",
        amount: "600000",
        tenure: 60,
        interestRate: "9.2",
        purpose: "International Studies",
        status: "active",
        applicationNumber: "EL-2024-102",
        emi: "12500",
        totalPaid: "37500",
        approvedAmount: "600000",
        disbursedAmount: "600000",
        outstandingAmount: "562500",
        nextEmiDate: new Date(2024, 2, 28),
        createdAt: new Date(2023, 12, 5),
        updatedAt: new Date(2023, 12, 5),
      },
      {
        id: "104",
        userId: userId,
        loanType: "business",
        amount: "1800000",
        tenure: 72,
        interestRate: "12.5",
        purpose: "Franchise Investment",
        status: "active",
        applicationNumber: "BL-2024-104",
        emi: "32500",
        totalPaid: "97500",
        approvedAmount: "1800000",
        disbursedAmount: "1800000",
        outstandingAmount: "1702500",
        nextEmiDate: new Date(2024, 3, 5),
        createdAt: new Date(2023, 12, 15),
        updatedAt: new Date(2023, 12, 15),
      },

      // PENDING LOANS (8)
      {
        id: "4",
        userId: userId,
        loanType: "education", 
        amount: "300000",
        tenure: 30,
        interestRate: "10.5",
        purpose: "Higher Education",
        status: "pending",
        applicationNumber: "EL-2024-004",
        emi: "10000",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 0, 10),
        updatedAt: new Date(2024, 0, 10),
      },
      {
        id: "7",
        userId: userId,
        loanType: "personal",
        amount: "100000",
        tenure: 12,
        interestRate: "14.5",
        purpose: "Wedding Expenses",
        status: "pending",
        applicationNumber: "PL-2024-007",
        emi: "9200",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 1, 5),
        updatedAt: new Date(2024, 1, 5),
      },
      {
        id: "8",
        userId: userId,
        loanType: "business",
        amount: "750000",
        tenure: 48,
        interestRate: "12.8",
        purpose: "Equipment Purchase",
        status: "pending",
        applicationNumber: "BL-2024-008",
        emi: "20500",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 1, 12),
        updatedAt: new Date(2024, 1, 12),
      },
      {
        id: "13",
        userId: userId,
        loanType: "vehicle",
        amount: "350000",
        tenure: 24,
        interestRate: "11.5",
        purpose: "Commercial Vehicle",
        status: "pending",
        applicationNumber: "VL-2024-013",
        emi: "16800",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 1, 18),
        updatedAt: new Date(2024, 1, 18),
      },
      {
        id: "19",
        userId: userId,
        loanType: "personal",
        amount: "150000",
        tenure: 18,
        interestRate: "13.8",
        purpose: "Home Appliances",
        status: "pending",
        applicationNumber: "PL-2024-019",
        emi: "9400",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 2, 1),
        updatedAt: new Date(2024, 2, 1),
      },
      {
        id: "21",
        userId: userId,
        loanType: "home",
        amount: "3500000",
        tenure: 84,
        interestRate: "8.0",
        purpose: "New Home Purchase",
        status: "pending",
        applicationNumber: "HL-2024-021",
        emi: "55000",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 2, 8),
        updatedAt: new Date(2024, 2, 8),
      },
      {
        id: "201",
        userId: userId,
        loanType: "business",
        amount: "600000",
        tenure: 48,
        interestRate: "12.2",
        purpose: "Technology Upgrade",
        status: "pending",
        applicationNumber: "BL-2024-201",
        emi: "16800",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 2, 12),
        updatedAt: new Date(2024, 2, 12),
      },
      {
        id: "203",
        userId: userId,
        loanType: "personal",
        amount: "200000",
        tenure: 36,
        interestRate: "14.2",
        purpose: "Debt Consolidation",
        status: "pending",
        applicationNumber: "PL-2024-203",
        emi: "6800",
        totalPaid: "0",
        approvedAmount: null,
        disbursedAmount: null,
        outstandingAmount: null,
        nextEmiDate: null,
        createdAt: new Date(2024, 2, 18),
        updatedAt: new Date(2024, 2, 18),
      },

      // COMPLETED/CLOSED LOANS (12)
      {
        id: "3",
        userId: userId, 
        loanType: "personal",
        amount: "150000",
        tenure: 18,
        interestRate: "12.8",
        purpose: "Medical Emergency",
        status: "completed",
        applicationNumber: "PL-2023-003",
        emi: "9500",
        totalPaid: "171000",
        approvedAmount: "150000",
        disbursedAmount: "150000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2022, 5, 12),
        updatedAt: new Date(2023, 11, 20),
      },
      {
        id: "5",
        userId: userId,
        loanType: "home",
        amount: "200000",
        tenure: 24,
        interestRate: "9.5",
        purpose: "Home Purchase",
        status: "completed",
        applicationNumber: "HL-2023-005",
        emi: "9500",
        totalPaid: "228000",
        approvedAmount: "200000",
        disbursedAmount: "200000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2023, 0, 5),
        updatedAt: new Date(2024, 0, 5),
      },
      {
        id: "9",
        userId: userId,
        loanType: "personal",
        amount: "80000",
        tenure: 12,
        interestRate: "13.5",
        purpose: "Debt Consolidation",
        status: "completed",
        applicationNumber: "PL-2022-009",
        emi: "7200",
        totalPaid: "86400",
        approvedAmount: "80000",
        disbursedAmount: "80000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2022, 2, 15),
        updatedAt: new Date(2023, 2, 15),
      },
      {
        id: "10",
        userId: userId,
        loanType: "vehicle",
        amount: "120000",
        tenure: 15,
        interestRate: "11.2",
        purpose: "Two Wheeler",
        status: "completed",
        applicationNumber: "VL-2022-010",
        emi: "8500",
        totalPaid: "127500",
        approvedAmount: "120000",
        disbursedAmount: "120000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2022, 0, 20),
        updatedAt: new Date(2023, 3, 20),
      },
      {
        id: "15",
        userId: userId,
        loanType: "business",
        amount: "300000",
        tenure: 20,
        interestRate: "12.5",
        purpose: "Inventory Purchase",
        status: "completed",
        applicationNumber: "BL-2021-015",
        emi: "17200",
        totalPaid: "344000",
        approvedAmount: "300000",
        disbursedAmount: "300000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2021, 8, 10),
        updatedAt: new Date(2023, 4, 10),
      },
      {
        id: "16",
        userId: userId,
        loanType: "education",
        amount: "220000",
        tenure: 30,
        interestRate: "10.2",
        purpose: "Professional Course",
        status: "completed",
        applicationNumber: "EL-2021-016",
        emi: "7400",
        totalPaid: "222000",
        approvedAmount: "220000",
        disbursedAmount: "220000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2021, 4, 5),
        updatedAt: new Date(2023, 10, 5),
      },
      {
        id: "22",
        userId: userId,
        loanType: "personal",
        amount: "60000",
        tenure: 10,
        interestRate: "14.2",
        purpose: "Festival Expenses",
        status: "completed",
        applicationNumber: "PL-2021-022",
        emi: "6500",
        totalPaid: "65000",
        approvedAmount: "60000",
        disbursedAmount: "60000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2021, 1, 10),
        updatedAt: new Date(2022, 11, 10),
      },
      {
        id: "23",
        userId: userId,
        loanType: "vehicle",
        amount: "250000",
        tenure: 24,
        interestRate: "10.5",
        purpose: "Motorcycle Purchase",
        status: "completed",
        applicationNumber: "VL-2020-023",
        emi: "11800",
        totalPaid: "283200",
        approvedAmount: "250000",
        disbursedAmount: "250000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2020, 6, 15),
        updatedAt: new Date(2022, 6, 15),
      },
      {
        id: "301",
        userId: userId,
        loanType: "business",
        amount: "450000",
        tenure: 36,
        interestRate: "11.8",
        purpose: "Office Space Renovation",
        status: "completed",
        applicationNumber: "BL-2020-301",
        emi: "14500",
        totalPaid: "522000",
        approvedAmount: "450000",
        disbursedAmount: "450000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2020, 1, 15),
        updatedAt: new Date(2023, 1, 15),
      },
      {
        id: "302",
        userId: userId,
        loanType: "vehicle",
        amount: "320000",
        tenure: 30,
        interestRate: "10.2",
        purpose: "Luxury Car Purchase",
        status: "completed",
        applicationNumber: "VL-2019-302",
        emi: "11200",
        totalPaid: "336000",
        approvedAmount: "320000",
        disbursedAmount: "320000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2019, 4, 10),
        updatedAt: new Date(2022, 10, 10),
      },
      {
        id: "304",
        userId: userId,
        loanType: "home",
        amount: "850000",
        tenure: 48,
        interestRate: "8.5",
        purpose: "Home Renovation",
        status: "completed",
        applicationNumber: "HL-2018-304",
        emi: "21500",
        totalPaid: "1032000",
        approvedAmount: "850000",
        disbursedAmount: "850000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2018, 3, 15),
        updatedAt: new Date(2022, 3, 15),
      },
      {
        id: "306",
        userId: userId,
        loanType: "education",
        amount: "125000",
        tenure: 18,
        interestRate: "9.5",
        purpose: "Certification Course",
        status: "completed",
        applicationNumber: "EL-2017-306",
        emi: "7600",
        totalPaid: "136800",
        approvedAmount: "125000",
        disbursedAmount: "125000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2017, 9, 10),
        updatedAt: new Date(2019, 3, 10),
      }
    ];

    res.json(mockLoanData);
  });

  // Marketplace loans with comprehensive data
  app.get("/api/marketplace/loans", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { category, minAmount, maxAmount, sortBy } = req.query;

    const allLoans = [
      {
        id: "loan-1",
        lenderName: "HDFC Bank",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Personal Loan",
        interestRate: 10.5,
        maxAmount: 4000000,
        minAmount: 50000,
        tenure: "12-84 months",
        processingFee: "0.5% to 2%",
        rating: 4.5,
        reviews: 12450,
        features: ["Quick approval", "No collateral", "Flexible tenure"],
        eligibility: {
          minAge: 21,
          maxAge: 60,
          minSalary: 25000,
          employmentType: "Salaried/Self-employed"
        },
        benefits: ["24-hour approval", "Zero pre-payment charges", "Doorstep service"],
        tags: ["popular", "quickApproval"],
        category: "personal",
        emi: 9567,
        approvalTime: "24 hours",
        documentsRequired: ["PAN", "Aadhar", "Salary slips"],
        lenderUrl: "https://hdfc.com/loans/personal-loan"
      },
      {
        id: "loan-2",
        lenderName: "SBI",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Home Loan",
        interestRate: 8.5,
        maxAmount: 10000000,
        minAmount: 100000,
        tenure: "5-30 years",
        processingFee: "0.35% to 1%",
        rating: 4.3,
        reviews: 8920,
        features: ["Low interest rate", "Long tenure", "Tax benefits"],
        eligibility: {
          minAge: 18,
          maxAge: 65,
          minSalary: 35000,
          employmentType: "Salaried/Self-employed"
        },
        benefits: ["Lowest rates", "Quick processing", "Online application"],
        tags: ["bestRate", "homeLoan"],
        category: "home",
        emi: 7648,
        approvalTime: "7-10 days",
        documentsRequired: ["Income proof", "Property papers", "Bank statements"],
        lenderUrl: "https://sbi.co.in/web/personal-banking/loans/home-loans"
      },
      {
        id: "loan-3",
        lenderName: "ICICI Bank",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Business Loan",
        interestRate: 12.0,
        maxAmount: 5000000,
        minAmount: 100000,
        tenure: "12-60 months",
        processingFee: "1% to 3%",
        rating: 4.2,
        reviews: 6780,
        features: ["Collateral-free", "Quick disbursement", "Flexible repayment"],
        eligibility: {
          minAge: 25,
          maxAge: 65,
          minSalary: 50000,
          employmentType: "Self-employed/Business"
        },
        benefits: ["No collateral up to ₹50L", "Same-day approval", "Minimal documentation"],
        tags: ["business", "collateralFree"],
        category: "business",
        emi: 12789,
        approvalTime: "48 hours",
        documentsRequired: ["Business registration", "ITR", "Bank statements"],
        lenderUrl: "https://icicibank.com/business-banking/loans"
      },
      {
        id: "loan-4",
        lenderName: "Axis Bank",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Car Loan",
        interestRate: 9.5,
        maxAmount: 2000000,
        minAmount: 100000,
        tenure: "12-84 months",
        processingFee: "0.5% to 2.5%",
        rating: 4.4,
        reviews: 5670,
        features: ["Up to 100% financing", "Quick approval", "Attractive rates"],
        eligibility: {
          minAge: 21,
          maxAge: 65,
          minSalary: 20000,
          employmentType: "Salaried/Self-employed"
        },
        benefits: ["100% financing", "Zero down payment", "Insurance coverage"],
        tags: ["autoLoan", "zeroDownPayment"],
        category: "auto",
        emi: 8956,
        approvalTime: "2-3 days",
        documentsRequired: ["Income proof", "Vehicle registration", "Insurance"],
        lenderUrl: "https://axisbank.com/retail/loans/car-loan"
      },
      {
        id: "loan-5",
        lenderName: "HexTech Financial",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Education Loan",
        interestRate: 11.5,
        maxAmount: 2000000,
        minAmount: 50000,
        tenure: "5-15 years",
        processingFee: "0% to 1%",
        rating: 4.1,
        reviews: 3450,
        features: ["Study abroad support", "Moratorium period", "Co-applicant allowed"],
        eligibility: {
          minAge: 18,
          maxAge: 35,
          minSalary: 0,
          employmentType: "Student"
        },
        benefits: ["Tax benefits", "Flexible repayment", "Covers all expenses"],
        tags: ["education", "studyAbroad"],
        category: "education",
        emi: 6789,
        approvalTime: "5-7 days",
        documentsRequired: ["Admission letter", "Course fee structure", "Guarantor documents"],
        lenderUrl: "https://superpay.com/education-loans"
      },
      {
        id: "loan-6",
        lenderName: "Yes Bank",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Gold Loan",
        interestRate: 7.5,
        maxAmount: 1000000,
        minAmount: 10000,
        tenure: "6-36 months",
        processingFee: "0% to 1%",
        rating: 4.0,
        reviews: 2890,
        features: ["Against gold jewelry", "Quick disbursement", "Flexible tenure"],
        eligibility: {
          minAge: 18,
          maxAge: 75,
          minSalary: 0,
          employmentType: "Any"
        },
        benefits: ["Instant approval", "Lowest rates", "Part payment allowed"],
        tags: ["goldLoan", "instantApproval"],
        category: "gold",
        emi: 5234,
        approvalTime: "30 minutes",
        documentsRequired: ["Gold jewelry", "ID proof", "Address proof"],
        lenderUrl: "https://yesbank.in/personal-banking/yes-individual/borrow/gold-loan"
      },
      {
        id: "loan-7",
        lenderName: "IndusInd Bank",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Instant Personal Loan",
        interestRate: 11.49,
        maxAmount: 3000000,
        minAmount: 30000,
        tenure: "12-60 months",
        processingFee: "0% to 3%",
        rating: 4.3,
        reviews: 7820,
        features: ["Instant approval", "Digital process", "No physical documents"],
        eligibility: {
          minAge: 23,
          maxAge: 58,
          minSalary: 30000,
          employmentType: "Salaried"
        },
        benefits: ["2-minute approval", "Digital KYC", "Instant disbursement"],
        tags: ["instant", "digital"],
        category: "personal",
        emi: 9234,
        approvalTime: "2 minutes",
        documentsRequired: ["PAN", "Aadhar", "Selfie"],
        lenderUrl: "https://indusind.com/in/en/personal/loans/personal-loan.html"
      },
      {
        id: "loan-8",
        lenderName: "Bajaj Finserv",
        lenderLogo: "/api/placeholder/80/40",
        productName: "Business Term Loan",
        interestRate: 13.0,
        maxAmount: 8000000,
        minAmount: 100000,
        tenure: "12-96 months",
        processingFee: "1% to 4%",
        rating: 4.2,
        reviews: 4560,
        features: ["High loan amount", "Flexible tenure", "Working capital support"],
        eligibility: {
          minAge: 25,
          maxAge: 65,
          minSalary: 40000,
          employmentType: "Business owner"
        },
        benefits: ["High approval rate", "Quick processing", "Relationship benefits"],
        tags: ["business", "highAmount"],
        category: "business",
        emi: 14567,
        approvalTime: "3-5 days",
        documentsRequired: ["Business registration", "Financial statements", "Tax returns"],
        lenderUrl: "https://bajajfinserv.in/business-loans"
      }
    ];

    // Apply filters
    let filteredLoans = allLoans;
    
    if (category && category !== 'all') {
      filteredLoans = filteredLoans.filter(loan => loan.category === category);
    }
    
    if (minAmount) {
      filteredLoans = filteredLoans.filter(loan => loan.maxAmount >= parseInt(minAmount as string));
    }
    
    if (maxAmount) {
      filteredLoans = filteredLoans.filter(loan => loan.minAmount <= parseInt(maxAmount as string));
    }
    
    // Apply sorting
    if (sortBy === 'interestRate') {
      filteredLoans.sort((a, b) => a.interestRate - b.interestRate);
    } else if (sortBy === 'rating') {
      filteredLoans.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      filteredLoans.sort((a, b) => b.reviews - a.reviews);
    }

    res.json(filteredLoans);
  });

  // Get specific loan application with full details
  app.get("/api/loans/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mock loan data that matches frontend mockLoanData
    const mockLoanData = [
      // ACTIVE LOANS
      {
        id: "1",
        userId: "user-1",
        loanType: "personal",
        amount: "250000",
        tenure: 24,
        interestRate: "11.5",
        purpose: "Home Improvement",
        status: "active",
        applicationNumber: "PL-2024-001",
        emi: "11250",
        totalPaid: "67500",
        approvedAmount: "250000",
        disbursedAmount: "250000",
        outstandingAmount: "182500",
        nextEmiDate: new Date(2024, 1, 15),
        createdAt: new Date(2023, 10, 15),
        updatedAt: new Date(2023, 10, 15),
      },
      {
        id: "2",
        userId: "user-1",
        loanType: "business",
        amount: "500000",
        tenure: 36,
        interestRate: "13.2",
        purpose: "Business Expansion",
        status: "active",
        applicationNumber: "BL-2024-002",
        emi: "17800",
        totalPaid: "213600",
        approvedAmount: "500000",
        disbursedAmount: "500000",
        outstandingAmount: "286400",
        nextEmiDate: new Date(2024, 1, 20),
        createdAt: new Date(2023, 8, 10),
        updatedAt: new Date(2023, 8, 10),
      },
      // CLOSED LOANS
      {
        id: "3",
        userId: "user-1", 
        loanType: "personal",
        amount: "150000",
        tenure: 18,
        interestRate: "12.8",
        purpose: "Medical Emergency",
        status: "completed",
        applicationNumber: "PL-2023-003",
        emi: "9500",
        totalPaid: "171000",
        approvedAmount: "150000",
        disbursedAmount: "150000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2022, 5, 12),
        updatedAt: new Date(2023, 11, 20),
      },
      {
        id: "5",
        userId: "user-1",
        loanType: "home",
        amount: "200000",
        tenure: 24,
        interestRate: "9.5",
        purpose: "Home Purchase",
        status: "completed",
        applicationNumber: "HL-2023-005",
        emi: "9500",
        totalPaid: "228000",
        approvedAmount: "200000",
        disbursedAmount: "200000",
        outstandingAmount: "0",
        nextEmiDate: null,
        createdAt: new Date(2023, 0, 5),
        updatedAt: new Date(2024, 0, 5),
      }
    ];

    const loan = mockLoanData.find(l => l.id === id);
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Generate mock EMI payments based on loan data
    const generateEmiPayments = (loan: any) => {
      const payments = [];
      const paidEmis = loan.totalPaid ? Math.floor(parseFloat(loan.totalPaid) / parseFloat(loan.emi)) : 0;
      
      for (let i = 0; i < paidEmis; i++) {
        const paymentDate = new Date(loan.createdAt);
        paymentDate.setMonth(paymentDate.getMonth() + i + 1);
        
        payments.push({
          id: `emi-${loan.id}-${i + 1}`,
          loanId: loan.id,
          emiNumber: i + 1,
          amount: parseFloat(loan.emi),
          dueDate: paymentDate,
          paymentDate: paymentDate,
          status: 'success',
          principalAmount: Math.floor(parseFloat(loan.emi) * 0.7),
          interestAmount: Math.floor(parseFloat(loan.emi) * 0.3),
          createdAt: paymentDate
        });
      }
      
      return payments;
    };

    const emiPayments = generateEmiPayments(loan);

    // Calculate KPIs
    const onTimePayments = emiPayments.filter(p => p.status === 'success').length;
    const totalPayments = emiPayments.length;
    const onTimePaymentRate = totalPayments > 0 ? Math.round((onTimePayments / totalPayments) * 100) : 100;
    
    // Mock lender information
    const lenderInfo = {
      name: loan.loanType === 'personal' ? 'HDFC Bank' : 
            loan.loanType === 'vehicle' ? 'ICICI Bank' : 
            loan.loanType === 'business' ? 'Axis Bank' : 'SBI Bank',
      phone: '1800-266-4332',
      email: 'support@hdfc.com',
      address: 'MG Road, Kochi, Kerala 682001',
      certifications: ['RBI Licensed', 'ISO 27001', 'PCI DSS', 'NBFC Registered']
    };

    // Calculate KPIs based on loan performance
    const kpis = {
      creditScoreImpact: onTimePaymentRate >= 95 ? 25 : onTimePaymentRate >= 85 ? 15 : onTimePaymentRate >= 70 ? 5 : -10,
      onTimePaymentRate,
      totalInterestSaved: Math.max(0, Math.round(parseFloat(loan.amount) * 0.02)), // 2% savings estimate
      creditUtilization: Math.round(Math.random() * 30) + 15 // Mock credit utilization 15-45%
    };

    const responseData = {
      loan,
      emiPayments,
      lenderInfo,
      kpis
    };
    
    res.json(responseData);
  });

  // Process EMI payment
  app.post("/api/loans/:id/pay-emi", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const loan = await storage.getLoanApplication(id);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found" });
      }

      // Create EMI payment record
      const payment = await storage.createEmiPayment({
        loanId: id,
        amount: amount.toString(),
        status: "success"
      });

      // Update loan totals
      const currentTotalPaid = parseFloat(loan.totalPaid || "0");
      const currentOutstanding = parseFloat(loan.outstandingAmount || "0");
      const newTotalPaid = currentTotalPaid + parseFloat(amount);
      const newOutstanding = Math.max(0, currentOutstanding - parseFloat(amount));

      // Calculate next EMI date (add 30 days)
      const nextEmiDate = new Date();
      nextEmiDate.setDate(nextEmiDate.getDate() + 30);

      await storage.updateLoanApplication(id, {
        totalPaid: newTotalPaid.toString(),
        outstandingAmount: newOutstanding.toString(),
        nextEmiDate,
        status: newOutstanding <= 0 ? "completed" : "active"
      });

      // Create notification
      await storage.createNotification({
        userId,
        title: "EMI Payment Successful",
        message: `Your EMI of ₹${amount} has been successfully processed for loan ${loan.applicationNumber}`,
        type: "payment",
        metadata: { loanId: id, amount }
      });

      res.json({ success: true, payment });
    } catch (error) {
      res.status(400).json({ message: "Payment processing failed" });
    }
  });

  // Get notifications
  app.get("/api/notifications", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await storage.getNotificationsByUser(userId);
    res.json(notifications);
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    const { id } = req.params;
    await storage.markNotificationAsRead(id);
    res.json({ success: true });
  });

  // EMI Calculator
  app.post("/api/calculate-emi", async (req, res) => {
    try {
      const { amount, interestRate, tenure } = req.body;
      
      const principal = parseFloat(amount);
      const rate = parseFloat(interestRate) / 100 / 12;
      const months = parseInt(tenure);
      
      const emi = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
      const totalAmount = emi * months;
      const totalInterest = totalAmount - principal;
      
      res.json({
        emi: Math.round(emi),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        principal
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation parameters" });
    }
  });

  // ============ NEW MARKETPLACE FEATURES API ROUTES ============
  
  // Find Your Loan - Marketplace Routes
  app.post("/api/marketplace/find-loans", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { purpose, amount, tenure, useMyReport } = loanMatchRequestSchema.parse(req.body);
      
      // Get personalized offers based on user profile
      const offers = await storage.getLoanOffers({
        loanType: "personal", // Infer from purpose
        minAmount: amount,
        maxAmount: amount * 1.5
      });

      // Simulate personalization with MyReport data if requested
      let personalizedOffers = offers;
      if (useMyReport) {
        const report = await storage.getUserFinancialReport(userId);
        if (report && report.creditScore) {
          // Better offers for higher credit scores
          personalizedOffers = offers.map(offer => ({
            ...offer,
            interestRate: report.creditScore! > 750 
              ? (parseFloat(offer.interestRate) - 0.5).toString()
              : offer.interestRate,
            approvalProbability: report.creditScore! > 700 ? 95 : 75,
            bestForYouReason: report.creditScore! > 750 
              ? "Excellent credit score - premium rate eligible"
              : "Good fit based on your profile"
          }));
        }
      }

      res.json(personalizedOffers.slice(0, 10)); // Return array directly
    } catch (error) {
      res.status(400).json({ message: "Invalid loan search parameters" });
    }
  });

  app.get("/api/marketplace/offers/:id", async (req, res) => {
    const { id } = req.params;
    const offer = await storage.getLoanOffer(id);
    
    if (!offer) {
      return res.status(404).json({ message: "Loan offer not found" });
    }
    
    res.json(offer);
  });

  // Get individual marketplace loan details
  app.get("/api/marketplace/loans/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // For marketplace loans, we need to fetch from sample data or loan offers
    // Since we're using the loan offers as marketplace loans
    const offer = await storage.getLoanOffer(id);
    
    if (!offer) {
      return res.status(404).json({ message: "Marketplace loan not found" });
    }
    
    // Transform loan offer to marketplace loan format with additional fields
    const marketplaceLoan = {
      id: offer.id,
      lenderName: offer.lenderName,
      productName: `${offer.loanType.charAt(0).toUpperCase() + offer.loanType.slice(1)} Loan`,
      interestRate: parseFloat(offer.interestRate),
      maxAmount: parseFloat(offer.maxAmount),
      minAmount: parseFloat(offer.minAmount),
      tenure: `${offer.maxTenure} months`,
      processingFee: offer.processingFee ? `${offer.processingFee}%` : "1.5%",
      rating: 4.2 + Math.random() * 0.6, // Random rating between 4.2-4.8
      reviews: Math.floor(Math.random() * 5000) + 1000, // Random reviews 1000-6000
      features: [
        "Quick approval",
        "No collateral required", 
        "Flexible repayment",
        "Online application",
        "Minimal documentation"
      ],
      eligibility: {
        minAge: 21,
        maxAge: 65,
        minSalary: 25000,
        employmentType: "Salaried / Self-employed"
      },
      benefits: [
        "No prepayment penalty",
        "Easy EMI options",
        "Doorstep service available",
        "24/7 customer support"
      ],
      tags: [offer.trustBadge, "Featured"],
      category: offer.loanType,
      emi: Math.round((parseFloat(offer.minAmount) * 0.045)), // Rough EMI calculation
      approvalTime: offer.approvalSpeed || "24 hours",
      documentsRequired: ["pan_card", "aadhaar_card", "salary_slip", "bank_statement"],
      lenderUrl: `https://${offer.lenderName.toLowerCase().replace(' ', '')}.com`
    };
    
    res.json(marketplaceLoan);
  });

  // Credit Card Marketplace Routes
  app.get("/api/credit-cards", async (req, res) => {
    try {
      const { category, providerName } = req.query;
      
      const filters: { category?: string; providerName?: string } = {};
      if (category && typeof category === 'string') {
        filters.category = category;
      }
      if (providerName && typeof providerName === 'string') {
        filters.providerName = providerName;
      }
      
      const offers = await storage.getCreditCardOffers(filters);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit card offers" });
    }
  });

  app.get("/api/credit-cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const offer = await storage.getCreditCardOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Credit card offer not found" });
      }
      
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit card offer" });
    }
  });

  app.post("/api/credit-cards/applications", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const applicationData = insertCreditCardApplicationSchema.parse({
        ...req.body,
        userId
      });

      const application = await storage.createCreditCardApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credit card application" });
    }
  });

  app.get("/api/credit-cards/applications", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const applications = await storage.getCreditCardApplicationsByUser(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit card applications" });
    }
  });

  // MyReport - Premium Financial Roadmap Routes
  app.get("/api/myreport", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await storage.getUser(userId);
    const userLoans = await storage.getLoanApplicationsByUser(userId);
    
    // Generate comprehensive MyCredit Report data
    const comprehensiveReport = {
      subscriptionTier: "premium",
      creditScore: user?.creditScore || 750,
      lastUpdated: new Date().toISOString(),
      userId,
      overallHealth: 85,
      improvements: {
        thisMonth: 12,
        lastMonth: 8
      },
      profile: {
        name: user?.name || "Rajesh Kumar",
        phone: user?.phone || "+91 9876543210",
        email: user?.email || "rajesh.kumar@email.com",
        panNumber: user?.panCard || "ABCDE1234F",
        address: "123 MG Road, Bangalore, Karnataka 560001",
        employmentType: "Salaried",
        monthlyIncome: 85000,
        isVerified: true
      },
      creditSummary: {
        totalAccounts: 8,
        activeLoans: userLoans.filter(loan => loan.status === 'active').length,
        creditCards: 3,
        totalCreditLimit: 450000,
        usedCredit: 135000,
        creditUtilization: 30,
        paymentHistory: 95,
        creditAge: "4.2 years",
        hardInquiries: 3
      },
      spending: {
        thisMonth: 45600,
        lastMonth: 42300,
        categories: [
          { name: "Food & Dining", amount: 12500, percentage: 27, color: "bg-red-500" },
          { name: "Shopping", amount: 9800, percentage: 22, color: "bg-blue-500" },
          { name: "Transportation", amount: 8200, percentage: 18, color: "bg-green-500" },
          { name: "Bills & Utilities", amount: 7600, percentage: 17, color: "bg-red-500" },
          { name: "Entertainment", amount: 4200, percentage: 9, color: "bg-purple-500" },
          { name: "Others", amount: 3300, percentage: 7, color: "bg-gray-500" }
        ]
      },
      recommendations: [
        {
          id: "1",
          type: "critical",
          title: "Reduce Credit Utilization",
          description: "Your credit utilization is at 30%. Reduce it below 20% for better score.",
          impact: "+15 to +25 points",
          actionRequired: "Pay down ₹45,000 on credit cards"
        },
        {
          id: "2",
          type: "warning",
          title: "Recent Hard Inquiry",
          description: "You have 3 hard inquiries in the last 6 months. Avoid new applications.",
          impact: "Prevent -5 to -10 points",
          actionRequired: "Wait 6 months before next application"
        },
        {
          id: "3",
          type: "improvement",
          title: "Set Up Auto-Pay",
          description: "Enable auto-pay for all bills to maintain perfect payment history.",
          impact: "+5 to +10 points",
          actionRequired: "Enable auto-pay in bank accounts"
        }
      ],
      scoreHistory: [
        { month: "Jan", score: 720, change: 0 },
        { month: "Feb", score: 725, change: 5 },
        { month: "Mar", score: 735, change: 10 },
        { month: "Apr", score: 742, change: 7 },
        { month: "May", score: 745, change: 3 },
        { month: "Jun", score: 750, change: 5 }
      ],
      detailedScoreTimeline: [
        {
          date: "2024-01-15",
          score: 720,
          change: -5,
          reason: "Hard inquiry from new credit card application",
          category: "inquiry",
          impact: "negative",
          details: "Applied for HDFC Millennia Credit Card - temporary impact"
        },
        {
          date: "2024-02-28",
          score: 725,
          change: +5,
          reason: "Reduced credit utilization",
          category: "utilization",
          impact: "positive",
          details: "Paid down credit card balances, utilization dropped to 28%"
        },
        {
          date: "2024-03-31",
          score: 735,
          change: +10,
          reason: "Perfect payment history maintained",
          category: "payment",
          impact: "positive",
          details: "All EMIs and credit card bills paid on time for 6 months"
        }
      ],
      loansList: userLoans.map(loan => ({
        id: loan.id,
        lenderName: "HDFC Bank", // Default for demo
        loanType: loan.loanType,
        principalAmount: parseFloat(loan.amount || "0"),
        currentBalance: parseFloat(loan.outstandingAmount || loan.amount || "0"),
        interestRate: parseFloat(loan.interestRate || "12.5"),
        tenure: loan.tenure,
        emiAmount: parseFloat(loan.emi || "0"),
        startDate: loan.createdAt?.toISOString() || new Date().toISOString(),
        nextDueDate: loan.nextEmiDate?.toISOString() || new Date().toISOString(),
        totalInterestPaid: parseFloat(loan.totalPaid || "0") - (parseFloat(loan.amount || "0") - parseFloat(loan.outstandingAmount || "0")),
        totalInstallments: loan.tenure,
        missedInstallments: 0,
        paymentHistory: [
          {
            date: "2024-05-15",
            amount: parseFloat(loan.emi || "0"),
            status: "paid",
            daysLate: 0
          },
          {
            date: "2024-04-15", 
            amount: parseFloat(loan.emi || "0"),
            status: "paid",
            daysLate: 0
          }
        ]
      })),
      futurePredictions: [
        {
          month: "Jul 2024",
          predictedScore: 755,
          confidence: 85,
          basedOnActions: ["Continue low utilization", "Maintain payment history"]
        },
        {
          month: "Aug 2024",
          predictedScore: 762,
          confidence: 80,
          basedOnActions: ["Pay off small loan", "Increase credit limit"]
        },
        {
          month: "Sep 2024",
          predictedScore: 770,
          confidence: 75,
          basedOnActions: ["Complete debt consolidation", "Reduce inquiries"]
        }
      ],
      loans: userLoans.map(loan => ({
        id: loan.id,
        lenderName: loan.loanType === 'personal' ? 'HDFC Bank' : loan.loanType === 'vehicle' ? 'Bajaj Finance' : 'SBI Bank',
        loanType: loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1) + ' Loan',
        principalAmount: parseFloat(loan.amount),
        currentBalance: parseFloat(loan.outstandingAmount || loan.amount),
        interestRate: parseFloat(loan.interestRate),
        tenure: loan.tenure,
        emiAmount: parseFloat(loan.emi),
        startDate: loan.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        nextDueDate: loan.nextEmiDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        totalInterestPaid: parseFloat(loan.totalPaid || '0') * 0.2, // Estimate 20% of total paid as interest
        totalInstallments: loan.tenure,
        missedInstallments: 0,
        paymentHistory: [
          { date: new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0], amount: parseFloat(loan.emi), status: "paid" },
          { date: new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0], amount: parseFloat(loan.emi), status: "paid" },
          { date: new Date(Date.now() - 90*24*60*60*1000).toISOString().split('T')[0], amount: parseFloat(loan.emi), status: "paid" }
        ]
      })),
      eligibilityProjections: [
        {
          loanType: "Home Loan",
          currentEligibility: 3500000,
          projectedEligibility: 4200000,
          timeframe: "6 months"
        },
        {
          loanType: "Personal Loan",
          currentEligibility: 800000,
          projectedEligibility: 1200000,
          timeframe: "3 months"
        },
        {
          loanType: "Credit Card",
          currentEligibility: 250000,
          projectedEligibility: 400000,
          timeframe: "4 months"
        }
      ]
    };
    
    res.json(comprehensiveReport);
  });

  app.post("/api/myreport/subscribe", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { tier } = req.body; // basic or pro
    
    const updated = await storage.updateUserFinancialReport(userId, {
      subscriptionTier: tier,
      improvementActions: [
        { action: "Reduce credit utilization to below 30%", impact: "+15 points", timeframe: "2 months" },
        { action: "Pay off personal loan", impact: "+25 points", timeframe: "6 months" },
        { action: "Add new credit account", impact: "+10 points", timeframe: "3 months" }
      ],
      projectedScoreChanges: { sixMonths: 780, oneYear: 810 }
    });

    res.json(updated);
  });

  app.post("/api/myreport/simulate", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { action, amount } = req.body;
    
    // Simulate score impact
    let scoreImpact = 0;
    let timeframe = "3 months";
    
    switch (action) {
      case "pay_debt":
        scoreImpact = Math.min(30, Math.floor(amount / 10000) * 5);
        timeframe = "2 months";
        break;
      case "reduce_utilization":
        scoreImpact = 15;
        timeframe = "1 month";
        break;
      case "close_account":
        scoreImpact = -5;
        timeframe = "3 months";
        break;
      default:
        scoreImpact = 5;
    }

    res.json({
      action,
      amount,
      scoreImpact,
      timeframe,
      confidence: "medium"
    });
  });

  // HexSecure - Fraud Detection Routes
  app.post("/api/security/scan", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { scanType, inputData, phoneNumber } = fraudScanRequestSchema.parse(req.body);
      
      // Simulate fraud detection logic
      let authenticityScore = 8; // Default safe score
      let riskLevel = "safe";
      let evidenceFound: string[] = [];
      let recommendedAction = "Safe to proceed";

      // Enhanced loan spam detection patterns
      const loanSpamPatterns = [
        /instant.loan|quick.loan|guaranteed.approval/i,
        /no.credit.check|bad.credit.ok|pre.approved/i,
        /urgent.loan|emergency.cash|money.now/i,
        /100%.approval|loan.without.documents/i,
        /loan.in.5.minutes|fastest.loan|immediate.money/i,
        /personal.loan.rs|loan.rs.\d+|cash.rs.\d+/i,
        /whatsapp.for.loan|call.for.loan|sms.for.loan/i
      ];

      const suspiciousLoanUrls = [
        /bit\.ly|tinyurl|t\.co|goo\.gl/,
        /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/, // IP addresses
        /loan[0-9]+\.com|quickloan.*\.in|instantcash.*\.com/i,
        /[a-z]+-loan-[a-z]+\.com/ // Suspicious loan domain patterns
      ];

      // Phone number spam patterns (for known scam numbers)
      const spamPhonePatterns = [
        /^(\+91)?[6-9]\d{9}$/, // Valid Indian mobile format check
        /^(\+91)?(99|98|97|96|95|94|93|92|91|90|89|88|87|86|85|84|83|82|81|80|79|78|77|76|75|74|73|72|71|70|69|68|67|66|65|64|63|62|61|60)\d{8}$/ // Indian mobile ranges
      ];

      // Enhanced loan spam detection logic
      let loaner = null;
      let kpis = null;
      
      if (scanType === "phone") {
        // Phone number verification
        const isValidFormat = /^(\+91)?[6-9]\d{9}$/.test(inputData.replace(/\s+/g, ''));
        const phoneDigits = inputData.replace(/\D/g, '');
        
        if (!isValidFormat || phoneDigits.length !== 10) {
          authenticityScore = 2;
          riskLevel = "danger";
          evidenceFound = ["Invalid phone number format", "Potential fake number"];
          recommendedAction = "Do not proceed - invalid phone number";
        } else {
          // Simulate phone verification results
          const isSpamNumber = Math.random() < 0.3; // 30% chance of spam
          if (isSpamNumber) {
            authenticityScore = 4;
            riskLevel = "caution";
            evidenceFound = ["Reported by multiple users", "Associated with loan spam"];
            recommendedAction = "Exercise caution - verify through official channels";
          }
        }
        
        // Generate mock loaner details for phone verification
        loaner = {
          name: isValidFormat ? "Verified Lender" : "Unknown Caller",
          company: isValidFormat ? "Licensed Finance Company" : "Unverified Source",
          location: isValidFormat ? "Mumbai, Maharashtra" : "Unknown Location",
          verified: isValidFormat && authenticityScore >= 6
        };
      } else if (scanType === "url" || scanType === "message") {
        const hasSuspiciousLoanText = loanSpamPatterns.some(pattern => pattern.test(inputData));
        const hasSuspiciousUrl = suspiciousLoanUrls.some(pattern => pattern.test(inputData));
        
        if (hasSuspiciousLoanText || hasSuspiciousUrl) {
          authenticityScore = Math.floor(Math.random() * 3) + 2; // 2-4 score for suspicious content
          riskLevel = "danger";
          evidenceFound = [
            "Loan spam patterns detected",
            "Unrealistic loan promises",
            "Suspicious domain/language"
          ];
          recommendedAction = "Block and report - likely loan scam";
        } else {
          // Check for legitimate loan indicators
          const legitimatePatterns = /rbi.licensed|nbfc.registered|official.website|bank/i;
          if (legitimatePatterns.test(inputData)) {
            authenticityScore = 8;
            evidenceFound = ["Licensed financial institution", "Regulatory compliance indicators"];
            recommendedAction = "Appears legitimate - verify through official channels";
          }
        }
        
        // Generate mock loaner details based on content analysis
        loaner = {
          name: authenticityScore >= 7 ? "Legitimate Lender Ltd" : "Quick Loan Provider",
          company: authenticityScore >= 7 ? "RBI Licensed NBFC" : "Unregistered Entity",
          location: authenticityScore >= 7 ? "New Delhi, India" : "Location Unverified",
          verified: authenticityScore >= 7
        };
      }
      
      // Generate KPIs for all scan types
      kpis = {
        trustScore: Math.max(10, Math.min(95, authenticityScore * 10 + Math.floor(Math.random() * 10))),
        popularity: Math.floor(Math.random() * 40) + 60,
        threatLevel: riskLevel === "safe" ? "low" : riskLevel === "danger" ? "high" : "medium",
        reportCount: riskLevel === "danger" ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 5)
      };

      const scan = await storage.createSecurityScan({
        userId,
        scanType,
        inputData,
        authenticityScore,
        riskLevel,
        evidenceFound,
        recommendedAction
      });
      
      // Return enhanced response with loan spam details
      const enhancedResponse = {
        ...scan,
        loaner,
        kpis
      };

      res.json(enhancedResponse);
    } catch (error) {
      res.status(400).json({ message: "Invalid scan request" });
    }
  });

  app.get("/api/security/history", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const scans = await storage.getSecurityScansByUser(userId);
    res.json(scans);
  });

  // Hex Coach - AI Assistant Routes  
  app.post("/api/coach/ask", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { question, context } = coachQuerySchema.parse(req.body);
      
      // Simulate AI coach responses based on question patterns
      let response = "I understand your question about finances. Let me help you with that.";
      let actionsSuggested: any[] = [];
      let confidenceLevel = "medium";

      if (/credit.score|cibil/i.test(question)) {
        response = "Your credit score is influenced by payment history, credit utilization, length of credit history, and types of credit accounts. Based on your current score of 750, you're in good standing. To improve further, focus on keeping utilization below 30% and making all payments on time.";
        actionsSuggested = [
          { action: "Check credit utilization", link: "/myreport" },
          { action: "View improvement plan", link: "/mypath" }
        ];
        confidenceLevel = "high";
      } else if (/loan|borrow|interest/i.test(question)) {
        response = "For your financial profile, personal loans at 10-12% APR would be suitable. Consider your debt-to-income ratio before taking additional loans. I can help you find the best offers.";
        actionsSuggested = [
          { action: "Find loan offers", link: "/marketplace" },
          { action: "Calculate EMI", link: "/calculator" }
        ];
        confidenceLevel = "high";
      } else if (/budget|expense|saving/i.test(question)) {
        response = "Budgeting is key to financial health. Follow the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment. Track your expenses to identify areas for improvement.";
        actionsSuggested = [
          { action: "View financial insights", link: "/myreport" },
          { action: "Learn budgeting", link: "/learn" }
        ];
      }

      const interaction = await storage.createCoachInteraction({
        userId,
        question,
        response,
        context,
        confidenceLevel,
        actionsSuggested
      });

      res.json(interaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid coach query" });
    }
  });

  app.get("/api/coach/history", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const interactions = await storage.getCoachInteractionsByUser(userId);
    res.json(interactions);
  });

  // Learning Platform Routes
  app.get("/api/learn/content", async (req, res) => {
    const { category } = req.query;
    
    // Mock learning content - in real app would come from database
    const allContent = [
      {
        id: "content-1",
        title: "Understanding Credit Scores",
        description: "Learn how credit scores work and what factors affect them",
        contentType: "video",
        category: "credit",
        duration: "15 minutes",
        creator: "Finance Expert",
        thumbnail: "/api/placeholder/300/200",
        isPremium: false,
        views: 1245,
        rating: 4.8
      },
      {
        id: "content-2", 
        title: "Smart Loan Selection Guide",
        description: "How to choose the right loan for your needs",
        contentType: "article",
        category: "loans",
        duration: "8 minutes",
        creator: "Loan Advisor",
        thumbnail: "/api/placeholder/300/200",
        isPremium: false,
        views: 892,
        rating: 4.6
      },
      {
        id: "content-3",
        title: "Investment Basics for Beginners",
        description: "Start your investment journey with these fundamentals",
        contentType: "course",
        category: "investment",
        duration: "45 minutes",
        creator: "Investment Guru",
        thumbnail: "/api/placeholder/300/200",
        isPremium: true,
        views: 2156,
        rating: 4.9
      },
      {
        id: "content-4",
        title: "Budgeting Made Simple",
        description: "Practical tips for managing your monthly budget",
        contentType: "video",
        category: "budget",
        duration: "12 minutes",
        creator: "Budget Coach",
        thumbnail: "/api/placeholder/300/200",
        isPremium: false,
        views: 756,
        rating: 4.5
      },
      {
        id: "content-5",
        title: "Building Emergency Fund",
        description: "Why you need an emergency fund and how to build one",
        contentType: "article",
        category: "savings",
        duration: "6 minutes",
        creator: "Savings Expert",
        thumbnail: "/api/placeholder/300/200",
        isPremium: false,
        views: 1089,
        rating: 4.7
      }
    ];
    
    let content = allContent;
    if (category && category !== 'all') {
      content = allContent.filter(item => item.category === category);
    }
    
    res.json(content);
  });

  app.get("/api/learn/content/:id", async (req, res) => {
    const { id } = req.params;
    const content = await storage.getLearningContentById(id);
    
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    
    res.json(content);
  });

  // Fitness and Points Routes
  app.get("/api/points", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let points = await storage.getUserPoints(userId);
    if (!points) {
      points = await storage.createUserPoints({ userId });
    }
    
    res.json(points);
  });

  app.post("/api/fitness/activity", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { activityType, value, deviceSource } = req.body;
    
    // Calculate points based on activity
    let pointsEarned = 0;
    switch (activityType) {
      case "steps":
        pointsEarned = Math.floor(value / 1000); // 1 point per 1000 steps
        break;
      case "workout":
        pointsEarned = value * 2; // 2 points per minute
        break;
      case "run":
        pointsEarned = value * 5; // 5 points per km
        break;
    }

    const activity = await storage.createFitnessActivity({
      userId,
      activityType,
      value,
      pointsEarned,
      deviceSource
    });

    // Update user points
    const currentPoints = await storage.getUserPoints(userId);
    if (currentPoints) {
      await storage.updateUserPoints(userId, {
        totalPoints: (currentPoints.totalPoints || 0) + pointsEarned,
        availablePoints: (currentPoints.availablePoints || 0) + pointsEarned,
        pointsEarned: (currentPoints.pointsEarned || 0) + pointsEarned
      });
    }

    res.json(activity);
  });

  app.get("/api/fitness/activities", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const activities = await storage.getFitnessActivitiesByUser(userId);
    res.json(activities);
  });

  // MyPath main endpoint
  app.get("/api/mypath", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const pathData = {
      recentRejection: false, // Mock data - in real app would check for recent loan rejections
      readinessScore: 78,
      lastUpdated: new Date(),
      overallProgress: 65,
      targetScore: 750,
      currentScore: 682,
      recommendedActions: [
        {
          id: "action-1",
          title: "Pay down credit cards",
          description: "Focus on cards with high utilization",
          priority: "high",
          estimatedImpact: "+25 points"
        },
        {
          id: "action-2", 
          title: "Check credit report",
          description: "Look for errors or inaccuracies",
          priority: "medium",
          estimatedImpact: "+10 points"
        }
      ]
    };
    
    res.json(pathData);
  });

  // MyPath improvements endpoint
  app.get("/api/mypath/improvements", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const improvements = [
      {
        id: "improve-1",
        title: "Reduce Credit Utilization",
        description: "Lower your credit card usage to below 30% of the limit",
        impact: "high",
        estimatedPoints: 25,
        timeframe: "2 months",
        status: "pending",
        steps: [
          { title: "Calculate current utilization", description: "Review all credit card balances", completed: false },
          { title: "Pay down high balances", description: "Focus on cards above 30% usage", completed: false },
          { title: "Monitor monthly usage", description: "Keep utilization low going forward", completed: false }
        ]
      },
      {
        id: "improve-2", 
        title: "Add Credit History",
        description: "Open a new credit account to diversify your credit mix",
        impact: "medium",
        estimatedPoints: 15,
        timeframe: "3 months",
        status: "pending",
        steps: [
          { title: "Research credit options", description: "Compare secured vs unsecured cards", completed: false },
          { title: "Apply for new account", description: "Choose best option for your profile", completed: false },
          { title: "Use new account responsibly", description: "Make small purchases and pay on time", completed: false }
        ]
      }
    ];
    res.json(improvements);
  });

  app.get("/api/mypath/milestones", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const milestones = [
      {
        id: "milestone-1",
        title: "Credit Score 780+",
        description: "Achieve excellent credit score range",
        targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        progress: 65,
        rewards: ["Lower interest rates", "Premium credit cards", "Better loan terms"]
      },
      {
        id: "milestone-2",
        title: "Debt-Free Journey",
        description: "Pay off all high-interest debt",
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 12 months
        progress: 30,
        rewards: ["Improved cash flow", "Higher savings rate", "Financial freedom"]
      }
    ];
    res.json(milestones);
  });

  // Missing route for Coach chat
  app.post("/api/coach/chat", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { message } = req.body;
      
      // Simulate AI coach responses 
      let response = "I understand your question. Let me help you with personalized financial advice.";
      
      if (/hello|hi|start/i.test(message)) {
        response = "Hello! I'm your AI Financial Coach. I can help with budgeting, credit improvement, loan advice, and investment planning. What would you like to discuss today?";
      } else if (/credit.score|improve.credit/i.test(message)) {
        response = "Based on your current credit score of 750, you're in good standing! To improve further: 1) Keep credit utilization below 30%, 2) Pay all bills on time, 3) Don't close old accounts. Would you like a personalized improvement plan?";
      } else if (/loan|borrow|personal.loan/i.test(message)) {
        response = "For your profile, I recommend personal loans in the 10-12% APR range. Your good credit score qualifies you for competitive rates. Shall I show you pre-approved offers from our partner lenders?";
      } else if (/budget|expenses|saving/i.test(message)) {
        response = "Great question! I recommend the 50/30/20 budgeting rule: 50% needs, 30% wants, 20% savings. Based on your spending patterns, you could save ₹5,000 more monthly by optimizing discretionary expenses.";
      }

      res.json({ response, timestamp: new Date() });
    } catch (error) {
      res.status(400).json({ message: "Invalid chat message" });
    }
  });

  // Missing routes for Fitness challenges
  app.get("/api/fitness", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const fitnessData = {
      totalPoints: 1250,
      currentStreak: 7,
      weeklyGoal: 10000,
      currentSteps: 7500,
      rank: 23,
      activeChallenges: 2
    };
    res.json(fitnessData);
  });

  app.get("/api/fitness/challenges", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const challenges = [
      {
        id: "challenge-1",
        title: "10K Steps Daily",
        description: "Walk 10,000 steps every day for a week",
        target: 70000,
        current: 45000,
        unit: "steps",
        duration: "7 days",
        reward: 100,
        type: "steps",
        status: "active"
      },
      {
        id: "challenge-2", 
        title: "Workout Warrior",
        description: "Complete 5 workouts this week",
        target: 5,
        current: 3,
        unit: "workouts",
        duration: "7 days", 
        reward: 150,
        type: "workout",
        status: "active"
      }
    ];
    res.json(challenges);
  });

  app.get("/api/fitness/leaderboard", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Generate top 30 performers with realistic data
    const topPerformers = [];
    const names = [
      "Fitness Pro", "Health Hero", "Step Master", "Marathon Runner", "Wellness Warrior",
      "Active Angel", "Cardio King", "Running Queen", "Gym Guru", "Fitness Fanatic",
      "Health Expert", "Step Champion", "Active Ace", "Wellness Wizard", "Cardio Captain",
      "Running Rockstar", "Fitness Legend", "Health Hawk", "Step Soldier", "Active Athlete",
      "Wellness Winner", "Cardio Crusher", "Running Ruler", "Fitness Force", "Health Hunter",
      "Step Superstar", "Active Admiral", "Wellness Wolf", "Cardio Chief"
    ];

    // Generate top 29 performers
    for (let i = 0; i < 29; i++) {
      topPerformers.push({
        rank: i + 1,
        name: names[i] || `Performer ${i + 1}`,
        steps: Math.floor(Math.random() * 5000) + 15000 - (i * 200), // Decreasing steps
        streak: Math.floor(Math.random() * 20) + 30 - i, // Decreasing streak
        isCurrentUser: false
      });
    }

    // Add current user at position 23
    topPerformers[22] = {
      rank: 23,
      name: "You",
      steps: 12500,
      streak: 7,
      isCurrentUser: true
    };

    res.json(topPerformers);
  });

  app.post("/api/fitness/challenges/join", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { challengeId } = req.body;
    
    res.json({ 
      success: true, 
      message: "Successfully joined challenge!",
      challengeId,
      startDate: new Date()
    });
  });

  app.post("/api/fitness/connect", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { appType } = req.body;
    
    res.json({
      success: true,
      message: `Successfully connected to ${appType}`,
      appType,
      connectedAt: new Date()
    });
  });

  // Missing route for Learn sessions
  app.get("/api/learn/sessions", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const sessions = [
      {
        id: "session-1",
        title: "Credit Score Masterclass",
        creator: "Finance Expert",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        duration: "60 minutes",
        participants: 45,
        maxParticipants: 100,
        isPremium: false
      },
      {
        id: "session-2",
        title: "Investment Strategies for Beginners", 
        creator: "Investment Advisor",
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        duration: "90 minutes",
        participants: 25,
        maxParticipants: 50,
        isPremium: true
      }
    ];
    res.json(sessions);
  });

  // Creator Connect API Routes
  
  // Get all creators with filtering
  app.get("/api/creators", async (req, res) => {
    try {
      const { expertise, isVerified, isActive } = req.query;
      const filters: any = {};
      
      if (expertise) filters.expertise = expertise as string;
      if (isVerified !== undefined) filters.isVerified = isVerified === 'true';
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      
      const creators = await storage.getCreators(filters);
      res.json(creators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creators" });
    }
  });

  // Get specific creator by ID
  app.get("/api/creators/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const creator = await storage.getCreator(id);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      // Get creator's sessions and reviews
      const sessions = await storage.getCreatorSessions(id);
      const reviews = await storage.getCreatorReviews(id);
      const availability = await storage.getCreatorAvailability(id);
      
      res.json({
        ...creator,
        sessions,
        reviews,
        availability
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creator details" });
    }
  });

  // Create creator profile
  app.post("/api/creators", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const creatorData = insertCreatorSchema.parse(req.body);
      
      // Check if user already has a creator profile
      const existingCreator = await storage.getCreatorByUserId(userId);
      if (existingCreator) {
        return res.status(400).json({ message: "Creator profile already exists" });
      }

      const creator = await storage.createCreator({
        ...creatorData,
        userId
      });

      res.status(201).json(creator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid creator data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create creator profile" });
    }
  });

  // Update creator profile
  app.patch("/api/creators/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { id } = req.params;
      const creator = await storage.getCreator(id);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }

      const updates = insertCreatorSchema.partial().parse(req.body);
      const updatedCreator = await storage.updateCreator(id, updates);

      res.json(updatedCreator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update creator profile" });
    }
  });

  // Get creator sessions
  app.get("/api/creators/:creatorId/sessions", async (req, res) => {
    try {
      const { creatorId } = req.params;
      const sessions = await storage.getCreatorSessions(creatorId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creator sessions" });
    }
  });

  // Create creator session
  app.post("/api/creators/:creatorId/sessions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to create sessions for this creator" });
      }

      const sessionData = insertCreatorSessionSchema.parse(req.body);
      const session = await storage.createCreatorSession({
        ...sessionData,
        creatorId
      });

      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Update creator session
  app.patch("/api/creators/:creatorId/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId, sessionId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update sessions for this creator" });
      }

      const session = await storage.getCreatorSession(sessionId);
      if (!session || session.creatorId !== creatorId) {
        return res.status(404).json({ message: "Session not found" });
      }

      const updates = insertCreatorSessionSchema.partial().parse(req.body);
      const updatedSession = await storage.updateCreatorSession(sessionId, updates);

      res.json(updatedSession);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Get user's bookings
  app.get("/api/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { status, creatorId } = req.query;
      const filters: any = { userId };
      
      if (status) filters.status = status as string;
      if (creatorId) filters.creatorId = creatorId as string;
      
      const bookings = await storage.getBookings(filters);
      
      // Enrich bookings with creator and session details
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const creator = await storage.getCreator(booking.creatorId);
          const session = await storage.getCreatorSession(booking.sessionId);
          return {
            ...booking,
            creator,
            session
          };
        })
      );

      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Create booking
  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const bookingData = bookingRequestSchema.parse(req.body);
      
      // Validate creator and session exist
      const creator = await storage.getCreator(bookingData.creatorId);
      const session = await storage.getCreatorSession(bookingData.sessionId);
      
      if (!creator || !session) {
        return res.status(404).json({ message: "Creator or session not found" });
      }
      
      // Check for scheduling conflicts (basic validation)
      const scheduledAt = new Date(bookingData.scheduledAt);
      if (scheduledAt <= new Date()) {
        return res.status(400).json({ message: "Cannot book sessions in the past" });
      }

      const booking = await storage.createBooking({
        userId,
        creatorId: bookingData.creatorId,
        sessionId: bookingData.sessionId,
        scheduledAt,
        duration: session.duration,
        price: session.price,
        notes: bookingData.notes
      });

      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user's bookings with creator and session details
  app.get("/api/bookings/user", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const bookings = await storage.getBookingsByUser(userId);
      
      // Enrich bookings with creator and session data
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const creator = await storage.getCreator(booking.creatorId);
          const session = await storage.getCreatorSession(booking.sessionId);
          
          return {
            ...booking,
            creator: creator ? {
              id: creator.id,
              displayName: creator.displayName,
              profileImageUrl: creator.profileImageUrl,
              averageRating: creator.averageRating,
              isVerified: creator.isVerified
            } : null,
            session: session ? {
              id: session.id,
              title: session.title,
              sessionType: session.sessionType
            } : null
          };
        })
      );

      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });

  // Update booking (reschedule, cancel, etc.)
  app.patch("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { id } = req.params;
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }

      const updates = req.body;
      const updatedBooking = await storage.updateBooking(id, updates);

      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Get creator reviews
  app.get("/api/creators/:creatorId/reviews", async (req, res) => {
    try {
      const { creatorId } = req.params;
      const reviews = await storage.getCreatorReviews(creatorId);
      
      // Enrich reviews with user details
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? { name: user.name, id: user.id } : null
          };
        })
      );

      res.json(enrichedReviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Create review
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const reviewData = reviewSubmissionSchema.parse(req.body);
      
      // Validate booking exists and belongs to user
      const booking = await storage.getBooking(reviewData.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to review this booking" });
      }
      
      if (booking.status !== "completed") {
        return res.status(400).json({ message: "Can only review completed sessions" });
      }

      const review = await storage.createCreatorReview({
        userId,
        creatorId: booking.creatorId,
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        review: reviewData.review,
        isPublic: reviewData.isPublic ? 1 : 0
      });

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Get creator availability
  app.get("/api/creators/:creatorId/availability", async (req, res) => {
    try {
      const { creatorId } = req.params;
      const availability = await storage.getCreatorAvailability(creatorId);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Create creator availability
  app.post("/api/creators/:creatorId/availability", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to set availability for this creator" });
      }

      const availabilityData = insertCreatorAvailabilitySchema.parse(req.body);
      const availability = await storage.createCreatorAvailability({
        ...availabilityData,
        creatorId
      });

      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid availability data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create availability" });
    }
  });

  // Delete creator availability
  app.delete("/api/creators/:creatorId/availability/:availabilityId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId, availabilityId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete availability for this creator" });
      }

      await storage.deleteCreatorAvailability(availabilityId);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete availability" });
    }
  });

  // Get creator payouts (for creators only)
  app.get("/api/creators/:creatorId/payouts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to view payouts for this creator" });
      }

      const payouts = await storage.getCreatorPayouts(creatorId);
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payouts" });
    }
  });

  // Process creator payout
  app.post("/api/creators/:creatorId/payouts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to process payouts for this creator" });
      }

      const { amount, paymentMethod } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid payout amount" });
      }

      const platformFee = (amount * 0.1).toString(); // 10% platform fee
      const netAmount = (amount * 0.9).toString();

      const payout = await storage.createCreatorPayout({
        creatorId,
        amount: amount.toString(),
        platformFee,
        netAmount,
        paymentMethod
      });

      res.status(201).json(payout);
    } catch (error) {
      res.status(500).json({ message: "Failed to process payout" });
    }
  });

  // Update payout status (e.g., mark as processed)
  app.patch("/api/creators/:creatorId/payouts/:payoutId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const { creatorId, payoutId } = req.params;
      const creator = await storage.getCreator(creatorId);
      
      if (!creator) {
        return res.status(404).json({ message: "Creator not found" });
      }
      
      if (creator.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update payouts for this creator" });
      }

      const updates = req.body;
      const updatedPayout = await storage.updateCreatorPayout(payoutId, updates);
      
      if (!updatedPayout) {
        return res.status(404).json({ message: "Payout not found" });
      }

      res.json(updatedPayout);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payout" });
    }
  });

  // =====================================
  // UPI PAYMENT ROUTES
  // =====================================
  
  // Get user's UPI accounts
  app.get("/api/upi/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;

      const accounts = await storage.getUpiAccountsByUser(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UPI accounts" });
    }
  });

  // Add new UPI account
  app.post("/api/upi/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;

      const accountData = insertUpiAccountSchema.parse(req.body);
      const account = await storage.createUpiAccount({
        ...accountData,
        userId
      });

      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid UPI account data" });
    }
  });

  // Get UPI transactions
  app.get("/api/upi/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;

      const transactions = await storage.getUpiTransactionsByUser(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UPI transactions" });
    }
  });

  // Create UPI payment
  app.post("/api/upi/payment", requireAuth, createRateLimiter('UPI_PAYMENT'), async (req, res) => {
    try {
      const userId = req.user!.id;

      const paymentData = upiPaymentSchema.parse(req.body);
      
      // Create transaction
      const transaction = await storage.createUpiTransaction({
        userId,
        amount: paymentData.amount,
        transactionType: "payment",
        description: paymentData.description,
        status: "pending"
      });

      // Simulate payment processing
      setTimeout(async () => {
        await storage.updateUpiTransaction(transaction.id, {
          status: "success",
          referenceNumber: `403993${Date.now().toString().slice(-6)}`
        });
      }, 2000);

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  // Create UPI collect request
  app.post("/api/upi/collect", requireAuth, createRateLimiter('UPI_COLLECT'), async (req, res) => {
    try {
      const userId = req.user!.id;

      const collectData = upiCollectRequestSchema.parse(req.body);
      
      const transaction = await storage.createUpiTransaction({
        userId,
        amount: collectData.amount,
        transactionType: "collect",
        description: collectData.description,
        status: "pending"
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid collect request data" });
    }
  });

  // Process bill payment
  app.post("/api/upi/bill-payment", requireAuth, createRateLimiter('UPI_BILL_PAYMENT'), async (req, res) => {
    try {
      const userId = req.user!.id;

      const billData = billPaymentSchema.parse(req.body);
      
      const transaction = await storage.createUpiTransaction({
        userId,
        amount: billData.amount,
        transactionType: "bill_payment",
        description: `Bill Payment - ${billData.accountNumber}`,
        status: "pending"
      });

      // Create bill payment history record
      const billPaymentHistory = await storage.createBillPaymentHistory({
        userId,
        serviceId: billData.serviceId || "default-service",
        billAccountNumber: billData.accountNumber,
        billType: billData.billType,
        amount: billData.amount.toString(),
        status: "pending",
        paymentMethod: "upi",
        upiTransactionId: transaction.id,
        metadata: {
          accountName: billData.accountName,
          provider: billData.provider
        }
      });

      // Simulate payment processing with cashback
      setTimeout(async () => {
        const cashback = (parseFloat(billData.amount.toString()) * 0.005).toFixed(2); // 0.5% cashback
        await storage.updateUpiTransaction(transaction.id, {
          status: "success",
          referenceNumber: `403993${Date.now().toString().slice(-6)}`,
          cashbackEarned: cashback,
          pointsEarned: Math.floor(parseFloat(billData.amount.toString()) / 100)
        });
        
        // Update bill payment history status
        await storage.updateBillPaymentHistory(billPaymentHistory.id, {
          status: "success",
          cashbackEarned: cashback,
          coinsEarned: Math.floor(parseFloat(billData.amount.toString()) / 100)
        });
      }, 2000);

      res.status(201).json({ transaction, billPaymentHistory });
    } catch (error) {
      res.status(400).json({ message: "Invalid bill payment data" });
    }
  });

  // Process EMI payment via UPI
  app.post("/api/upi/emi-payment", requireAuth, createRateLimiter('UPI_EMI_PAYMENT'), async (req, res) => {
    try {
      const userId = req.user!.id;

      const emiData = emiPaymentUpiSchema.parse(req.body);
      
      // Get loan details and verify ownership
      const loan = await storage.getLoanApplication(emiData.loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found or not authorized" });
      }

      // Server-side EMI amount computation - ignore client amount
      const serverEmiAmount = parseFloat(loan.emi || '0');
      if (serverEmiAmount <= 0) {
        return res.status(400).json({ message: "Invalid EMI amount for this loan" });
      }

      // Create UPI transaction with server-computed amount
      const transaction = await storage.createUpiTransaction({
        userId,
        amount: serverEmiAmount,
        transactionType: "emi_payment",
        description: `EMI Payment - ${loan.applicationNumber}`,
        status: "pending"
      });

      // Also create EMI payment record with server amount
      await storage.createEmiPayment({
        loanId: emiData.loanId,
        amount: serverEmiAmount.toString(),
        transactionId: transaction.externalTransactionId
      });

      // Simulate payment processing
      setTimeout(async () => {
        await storage.updateUpiTransaction(transaction.id, {
          status: "success",
          referenceNumber: `403993${Date.now().toString().slice(-6)}`
        });
      }, 2000);

      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid EMI payment data" });
    }
  });

  // Get bill payment services
  app.get("/api/upi/bill-services", async (req, res) => {
    try {
      const { type } = req.query;
      const services = await storage.getBillPaymentServices(type as string);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bill payment services" });
    }
  });

  // Get UPI rewards
  app.get("/api/upi/rewards", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;

      const rewards = await storage.getUpiRewardsByUser(userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UPI rewards" });
    }
  });

  // Get bill payment services by category
  app.get("/api/bill-payment/:category", async (req, res) => {
    try {
      const { category } = req.params;
      
      // Enhanced dummy data for better experience
      const dummyServices = {
        mobile: [
          { id: "jio", serviceName: "Jio", serviceProvider: "Reliance Jio", iconUrl: "/icons/jio.png", cashbackPercentage: "1.5" },
          { id: "airtel", serviceName: "Airtel", serviceProvider: "Bharti Airtel", iconUrl: "/icons/airtel.png", cashbackPercentage: "1.2" },
          { id: "vi", serviceName: "Vi (Vodafone Idea)", serviceProvider: "Vodafone Idea", iconUrl: "/icons/vi.png", cashbackPercentage: "1.0" },
          { id: "bsnl", serviceName: "BSNL", serviceProvider: "Bharat Sanchar Nigam", iconUrl: "/icons/bsnl.png", cashbackPercentage: "0.8" }
        ],
        dth: [
          { id: "tatasky", serviceName: "Tata Play", serviceProvider: "Tata Play", iconUrl: "/icons/tataplay.png", cashbackPercentage: "2.0" },
          { id: "dish", serviceName: "Dish TV", serviceProvider: "Dish TV", iconUrl: "/icons/dish.png", cashbackPercentage: "1.8" },
          { id: "airtel-dth", serviceName: "Airtel Digital TV", serviceProvider: "Airtel Digital", iconUrl: "/icons/airtel.png", cashbackPercentage: "1.5" },
          { id: "sun", serviceName: "Sun Direct", serviceProvider: "Sun TV Network", iconUrl: "/icons/sun.png", cashbackPercentage: "1.3" }
        ],
        electricity: [
          { id: "mseb", serviceName: "MSEB", serviceProvider: "Maharashtra State Electricity Board", iconUrl: "/icons/mseb.png", cashbackPercentage: "0.5" },
          { id: "best", serviceName: "BEST", serviceProvider: "Brihanmumbai Electric Supply", iconUrl: "/icons/best.png", cashbackPercentage: "0.6" },
          { id: "bses", serviceName: "BSES", serviceProvider: "BSES Rajdhani Power", iconUrl: "/icons/bses.png", cashbackPercentage: "0.4" },
          { id: "adani", serviceName: "Adani Electricity", serviceProvider: "Adani Power", iconUrl: "/icons/adani.png", cashbackPercentage: "0.7" }
        ]
      };

      const services = dummyServices[category as keyof typeof dummyServices] || [];
      res.json({ category, services });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bill payment services" });
    }
  });

  // Get bill payment history
  app.get("/api/bill-payment/history", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Generate dummy bill payment history data
      const currentDate = new Date();
      const dummyHistory = [
        {
          id: "bp_001",
          serviceProvider: "Jio",
          billType: "mobile",
          accountNumber: "9876543210",
          amount: "399.00",
          status: "success",
          paidDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          transactionId: "UPI403993789456",
          cashbackEarned: "5.99",
          referenceNumber: "REF123456789"
        },
        {
          id: "bp_002",
          serviceProvider: "MSEB",
          billType: "electricity",
          accountNumber: "12345678901",
          amount: "1250.00",
          status: "success",
          paidDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          transactionId: "UPI403993789457",
          cashbackEarned: "6.25",
          referenceNumber: "REF123456790"
        },
        {
          id: "bp_003",
          serviceProvider: "Tata Play",
          billType: "dth",
          accountNumber: "567890123",
          amount: "450.00",
          status: "success",
          paidDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          transactionId: "UPI403993789458",
          cashbackEarned: "9.00",
          referenceNumber: "REF123456791"
        },
        {
          id: "bp_004",
          serviceProvider: "Airtel",
          billType: "mobile",
          accountNumber: "9123456789",
          amount: "299.00",
          status: "success",
          paidDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          transactionId: "UPI403993789459",
          cashbackEarned: "3.59",
          referenceNumber: "REF123456792"
        },
        {
          id: "bp_005",
          serviceProvider: "BEST",
          billType: "electricity",
          accountNumber: "98765432101",
          amount: "890.00",
          status: "success",
          paidDate: new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          transactionId: "UPI403993789460",
          cashbackEarned: "5.34",
          referenceNumber: "REF123456793"
        }
      ];

      res.json(dummyHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bill payment history" });
    }
  });

  // Get bill payment details by ID
  app.get("/api/bill-payment/history/:paymentId", requireAuth, async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      // Return detailed payment information
      const dummyPaymentDetail = {
        id: paymentId,
        serviceProvider: "Jio",
        billType: "mobile",
        accountNumber: "9876543210",
        customerName: "John Doe",
        amount: "399.00",
        convenienceFee: "0.00",
        totalAmount: "399.00",
        status: "success",
        paidDate: new Date().toISOString(),
        billDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: "UPI403993789456",
        referenceNumber: "REF123456789",
        cashbackEarned: "5.99",
        pointsEarned: 39,
        paymentMethod: "UPI",
        billDetails: {
          planName: "Unlimited 4G Plan",
          validity: "28 days",
          dataLimit: "1.5GB/day",
          smsLimit: "100/day",
          callsLimit: "Unlimited"
        }
      };

      res.json(dummyPaymentDetail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bill payment details" });
    }
  });

  // Investment Portfolio endpoints
  app.get("/api/investment/portfolio", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const portfolio = await storage.getInvestmentPortfolioByUser(userId);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment portfolio" });
    }
  });

  // Investment options endpoint
  app.get("/api/investment/options", async (req, res) => {
    try {
      const investmentOptions = [
        {
          id: "opt-1",
          name: "HDFC Equity Fund",
          category: "Mutual Funds",
          description: "Large-cap mutual fund with consistent growth track record",
          expectedReturn: 12.5,
          minInvestment: 500,
          riskLevel: "medium",
          rating: 4.2,
          icon: "/icons/hdfc.png"
        },
        {
          id: "opt-2",
          name: "Tata Steel",
          category: "Stocks",
          description: "Leading steel manufacturer with strong fundamentals",
          expectedReturn: 15.8,
          minInvestment: 1000,
          riskLevel: "high",
          rating: 3.8,
          icon: "/icons/tata.png"
        },
        {
          id: "opt-3",
          name: "SBI Fixed Deposit",
          category: "Fixed Deposits",
          description: "Safe investment option with guaranteed returns",
          expectedReturn: 6.5,
          minInvestment: 10000,
          riskLevel: "low",
          rating: 4.5,
          icon: "/icons/sbi.png"
        },
        {
          id: "opt-4",
          name: "ICICI Prudential Bluechip",
          category: "Mutual Funds",
          description: "Diversified equity fund focusing on large-cap stocks",
          expectedReturn: 11.8,
          minInvestment: 1000,
          riskLevel: "medium",
          rating: 4.1,
          icon: "/icons/icici.png"
        },
        {
          id: "opt-5",
          name: "Infosys",
          category: "Stocks",
          description: "Leading IT services company with global presence",
          expectedReturn: 14.2,
          minInvestment: 1500,
          riskLevel: "medium",
          rating: 4.3,
          icon: "/icons/infy.png"
        },
        {
          id: "opt-6",
          name: "PPF Account",
          category: "Tax Saving",
          description: "15-year tax-saving investment with EEE benefit",
          expectedReturn: 7.1,
          minInvestment: 500,
          riskLevel: "low",
          rating: 4.7,
          icon: "/icons/ppf.png"
        }
      ];
      
      res.json(investmentOptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment options" });
    }
  });

  // Market insights endpoint
  app.get("/api/investment/market-insights", async (req, res) => {
    try {
      const marketInsights = {
        overview: [
          { name: "Nifty 50", value: "23,550.45", change: 1.24 },
          { name: "Sensex", value: "77,125.30", change: 0.89 },
          { name: "Bank Nifty", value: "50,245.60", change: -0.45 },
          { name: "Gold (₹/10g)", value: "72,450", change: 0.32 }
        ],
        topPerformers: [
          { symbol: "RELIANCE", price: "2,680.50", change: 3.45 },
          { symbol: "TCS", price: "4,125.75", change: 2.89 },
          { symbol: "INFY", price: "1,680.30", change: 2.56 },
          { symbol: "HDFC BANK", price: "1,745.90", change: 1.98 },
          { symbol: "ITC", price: "456.20", change: 1.75 }
        ],
        news: [
          {
            title: "Market rallies on positive GDP data",
            summary: "Indian equity markets gained momentum following better-than-expected GDP growth numbers.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            title: "RBI maintains repo rate at 6.5%",
            summary: "Reserve Bank of India keeps key policy rates unchanged in latest monetary policy review.",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ]
      };
      
      res.json(marketInsights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market insights" });
    }
  });

  // Create investment endpoint
  app.post("/api/investment/portfolio", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      const investmentData = {
        userId,
        ...req.body
      };
      
      const investment = await storage.createInvestmentPortfolio(investmentData);
      res.status(201).json(investment);
    } catch (error) {
      res.status(400).json({ message: "Failed to create investment" });
    }
  });

  // Rewards endpoints
  app.get("/api/rewards/overview", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get user rewards data from UPI rewards and calculate stats
      const upiRewards = await storage.getUpiRewardsByUser(userId);
      const totalCashback = upiRewards.reduce((sum, reward) => sum + parseFloat(reward.rewardValue || "0"), 0);
      
      const rewardsOverview = {
        availablePoints: 2850,
        totalCashback: totalCashback,
        monthlyEarnings: 245,
        currentTier: "Silver",
        nextTier: "Gold",
        tierProgress: 65,
        pointsEarnedThisMonth: 420,
        rewardsRedeemedCount: 3,
        referralCount: 2,
        streakDays: 7
      };
      
      res.json(rewardsOverview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rewards overview" });
    }
  });

  // Get available reward options
  app.get("/api/rewards/options", async (req, res) => {
    try {
      const rewardOptions = [
        {
          id: "reward-1",
          title: "Amazon Gift Card ₹500",
          category: "Gift Cards",
          description: "Redeem your points for Amazon shopping voucher",
          requiredPoints: 2000,
          image: "/icons/amazon.png",
          featured: true
        },
        {
          id: "reward-2", 
          title: "Flipkart Voucher ₹250",
          category: "Gift Cards",
          description: "Shop your favorite products on Flipkart",
          requiredPoints: 1000,
          image: "/icons/flipkart.png",
          featured: false
        },
        {
          id: "reward-3",
          title: "Mobile Recharge ₹100",
          category: "Recharge",
          description: "Instant mobile recharge for any operator",
          requiredPoints: 400,
          image: "/icons/mobile.png",
          featured: true
        },
        {
          id: "reward-4",
          title: "PayTM Cash ₹200",
          category: "Cash",
          description: "Direct cash transfer to your PayTM wallet",
          requiredPoints: 800,
          image: "/icons/paytm.png",
          featured: false
        },
        {
          id: "reward-5",
          title: "Google Play Gift Card ₹300",
          category: "Gift Cards", 
          description: "Purchase apps, games, and content on Google Play",
          requiredPoints: 1200,
          image: "/icons/googleplay.png",
          featured: false
        },
        {
          id: "reward-6",
          title: "Starbucks Coffee Voucher",
          category: "Food & Beverages",
          description: "Enjoy premium coffee at any Starbucks outlet",
          requiredPoints: 1500,
          image: "/icons/starbucks.png",
          featured: true
        }
      ];
      
      res.json(rewardOptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reward options" });
    }
  });

  // Get rewards history
  app.get("/api/rewards/history", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      const rewardsHistory = [
        {
          id: "hist-1",
          type: "earned",
          title: "UPI Payment Cashback",
          description: "Earned from bill payment to Jio",
          points: 25,
          status: "completed",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "hist-2", 
          type: "redeemed",
          title: "Amazon Gift Card Redeemed",
          description: "₹500 Amazon voucher redeemed",
          points: 2000,
          status: "completed",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "hist-3",
          type: "earned",
          title: "Daily Check-in Bonus",
          description: "Streak day 7 bonus points",
          points: 50,
          status: "completed",
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "hist-4",
          type: "earned",
          title: "Referral Bonus",
          description: "Friend joined using your referral code",
          points: 500,
          status: "completed",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "hist-5",
          type: "redeemed",
          title: "Mobile Recharge",
          description: "₹100 recharge for 9876543210",
          points: 400,
          status: "pending",
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(rewardsHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rewards history" });
    }
  });

  // Redeem reward
  app.post("/api/rewards/redeem", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { rewardId } = req.body;
      
      if (!rewardId) {
        return res.status(400).json({ message: "Reward ID is required" });
      }
      
      // In a real app, we would:
      // 1. Check user's available points
      // 2. Validate the reward
      // 3. Deduct points from user
      // 4. Process the redemption
      // 5. Add to history
      
      const redemption = {
        id: `redemption-${Date.now()}`,
        userId,
        rewardId,
        status: "success",
        redeemedAt: new Date().toISOString()
      };
      
      res.status(201).json(redemption);
    } catch (error) {
      res.status(400).json({ message: "Failed to redeem reward" });
    }
  });

  // ================================
  // Insurance API Routes
  // ================================

  // Get user's insurance policies
  app.get("/api/insurance/policies", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const policies = await storage.getInsurancePoliciesByUser(userId);
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance policies" });
    }
  });

  // Get premium payment history
  app.get("/api/insurance/payment-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const paymentHistory = await storage.getInsurancePremiumPaymentsByUser(userId);
      res.json(paymentHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch premium payment history" });
    }
  });

  // Pay insurance premium
  app.post("/api/insurance/pay-premium", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const paymentData = insurancePremiumPaymentSchema.parse(req.body);
      
      // Validate that the policy belongs to the user
      const policy = await storage.getInsurancePolicy(paymentData.policyId);
      if (!policy || policy.userId !== userId) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }

      // Validate UPI account
      const upiAccount = await storage.getUpiAccountByUpiId(paymentData.upiId);
      if (!upiAccount || upiAccount.userId !== userId) {
        return res.status(400).json({ message: "Invalid UPI account" });
      }

      // Create the premium payment
      const payment = await storage.createInsurancePremiumPayment({
        ...paymentData,
        userId,
        policyId: paymentData.policyId
      });

      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid payment data" 
          : "Failed to process premium payment" 
      });
    }
  });

  // Create new insurance policy
  app.post("/api/insurance/policies", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const policyData = insertInsurancePolicySchema.parse(req.body);
      
      const policy = await storage.createInsurancePolicy({
        ...policyData,
        userId
      });

      res.status(201).json(policy);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid policy data" 
          : "Failed to create insurance policy" 
      });
    }
  });

  // Get specific insurance policy
  app.get("/api/insurance/policies/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      const policy = await storage.getInsurancePolicy(id);
      if (!policy || policy.userId !== userId) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }

      res.json(policy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance policy" });
    }
  });

  // Update insurance policy
  app.patch("/api/insurance/policies/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      // Validate that the policy belongs to the user
      const existingPolicy = await storage.getInsurancePolicy(id);
      if (!existingPolicy || existingPolicy.userId !== userId) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }

      // Parse and validate the update data
      const updateData = insertInsurancePolicySchema.partial().parse(req.body);
      
      const updatedPolicy = await storage.updateInsurancePolicy(id, updateData);
      
      if (!updatedPolicy) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }

      res.json(updatedPolicy);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid policy data" 
          : "Failed to update insurance policy" 
      });
    }
  });

  // Insurance Claims Routes

  // Get all claims for a user
  app.get("/api/insurance/claims", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const claims = await storage.getInsuranceClaimsByUser(userId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance claims" });
    }
  });

  // Get claims for a specific policy
  app.get("/api/insurance/policies/:policyId/claims", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { policyId } = req.params;
      
      // Validate that the policy belongs to the user
      const policy = await storage.getInsurancePolicy(policyId);
      if (!policy || policy.userId !== userId) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }
      
      const claims = await storage.getInsuranceClaimsByPolicy(policyId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch policy claims" });
    }
  });

  // Get specific claim
  app.get("/api/insurance/claims/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      const claim = await storage.getInsuranceClaim(id);
      if (!claim || claim.userId !== userId) {
        return res.status(404).json({ message: "Insurance claim not found" });
      }
      
      res.json(claim);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance claim" });
    }
  });

  // Create new insurance claim
  app.post("/api/insurance/claims", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const claimData = insuranceClaimFormSchema.parse(req.body);
      
      // Validate that the policy belongs to the user
      const policy = await storage.getInsurancePolicy(claimData.policyId);
      if (!policy || policy.userId !== userId) {
        return res.status(404).json({ message: "Insurance policy not found" });
      }
      
      // Create claim
      const claim = await storage.createInsuranceClaim({
        userId,
        policyId: claimData.policyId,
        claimType: claimData.claimType,
        claimAmount: claimData.claimAmount,
        incidentDate: new Date(claimData.incidentDate),
        description: claimData.description,
        hospitalName: claimData.hospitalName || null,
        doctorName: claimData.doctorName || null,
      });
      
      res.status(201).json(claim);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error && error.message.includes("parse") 
          ? "Invalid claim data" 
          : "Failed to create insurance claim" 
      });
    }
  });

  // Update insurance claim (for status updates, settlements, etc.)
  app.patch("/api/insurance/claims/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      
      // Validate that the claim belongs to the user
      const existingClaim = await storage.getInsuranceClaim(id);
      if (!existingClaim || existingClaim.userId !== userId) {
        return res.status(404).json({ message: "Insurance claim not found" });
      }
      
      const updateData = req.body;
      const updatedClaim = await storage.updateInsuranceClaim(id, updateData);
      
      if (!updatedClaim) {
        return res.status(404).json({ message: "Insurance claim not found" });
      }
      
      res.json(updatedClaim);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to update insurance claim" 
      });
    }
  });

  // Get transaction details for payment detail page
  app.get("/api/transactions/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      
      // Handle mock transaction for demo purposes - no auth required for mock data
      if (transactionId === "mock-4" || transactionId.startsWith("mock-")) {
        const mockPaymentDetail = {
          id: transactionId,
          transactionId: `TXN${transactionId.toUpperCase().replace("MOCK-", "")}03993004`,
          referenceNumber: "REF403993004",
          amount: 2500,
          fee: 5,
          totalAmount: 2505,
          status: "success",
          paymentMethod: {
            type: "upi",
            details: "user@paytm",
            provider: "Paytm"
          },
          recipient: {
            name: "Amazon Pay",
            upiId: "amazon@axisbank"
          },
          sender: {
            name: "John Doe",
            upiId: "user@paytm"
          },
          description: "Online Shopping Payment",
          category: "shopping",
          timestamp: "2024-01-15T10:30:00Z",
          completedAt: "2024-01-15T10:30:15Z",
          cashbackEarned: 25,
          rewardsEarned: 10,
          breakdown: {
            baseAmount: 2500,
            taxes: 0,
            discount: 0,
            convenience_fee: 5,
            total: 2505
          },
          merchantDetails: {
            name: "Amazon Pay",
            category: "E-commerce",
            mcc: "5999"
          },
          securityInfo: {
            encrypted: true,
            location: "Mumbai, Maharashtra",
            deviceId: "DEV-12345"
          }
        };
        
        return res.json(mockPaymentDetail);
      }
      
      // For real transactions, require authentication
      const token = req.cookies?.auth_token;
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required for real transaction data" 
        });
      }
      
      // Verify token for real transactions
      const { verifyToken } = await import('./jwt');
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid or expired token" 
        });
      }
      
      const userId = payload.userId;
      
      // Try to fetch actual transaction
      const transaction = await storage.getUpiTransaction(transactionId);
      
      if (!transaction || transaction.userId !== userId) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Map UPI transaction to PaymentDetail interface
      const paymentDetail = {
        id: transaction.id,
        transactionId: transaction.externalTransactionId,
        referenceNumber: transaction.referenceNumber,
        amount: parseFloat(transaction.amount),
        totalAmount: parseFloat(transaction.amount),
        status: transaction.status,
        paymentMethod: {
          type: "upi" as const,
          details: transaction.senderUpiId || "UPI Payment",
          provider: "UPI"
        },
        recipient: {
          name: transaction.recipientName || "Recipient",
          upiId: transaction.recipientUpiId
        },
        sender: {
          name: "User",
          upiId: transaction.senderUpiId
        },
        description: transaction.description || "UPI Transaction",
        category: transaction.transactionType,
        timestamp: transaction.createdAt?.toISOString() || new Date().toISOString(),
        completedAt: transaction.updatedAt?.toISOString(),
        cashbackEarned: parseFloat(transaction.cashbackEarned || "0"),
        rewardsEarned: transaction.pointsEarned || 0,
        breakdown: {
          baseAmount: parseFloat(transaction.amount),
          total: parseFloat(transaction.amount)
        }
      };

      res.json(paymentDetail);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction details" });
    }
  });

  // Travel Booking Routes
  
  // Search travel options
  app.post("/api/travel/search", requireAuth, async (req, res) => {
    try {
      const searchData = travelSearchSchema.parse(req.body);
      const { serviceType, fromLocation, toLocation, departureDate, passengers } = searchData;
      
      let results = [];
      
      switch (serviceType) {
        case 'flight':
          results = await travelApiService.searchFlights(fromLocation, toLocation, departureDate, passengers);
          break;
        case 'train':
          results = await travelApiService.searchTrains(fromLocation, toLocation, departureDate, passengers);
          break;
        case 'bus':
          results = await travelApiService.searchBuses(fromLocation, toLocation, departureDate, passengers);
          break;
        default:
          return res.status(400).json({ message: "Invalid service type" });
      }
      
      res.json({ results, searchParams: searchData });
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Get popular cities for a service type
  app.get("/api/travel/cities/:serviceType", async (req, res) => {
    try {
      const { serviceType } = req.params;
      const cities = await travelApiService.getPopularCities(serviceType);
      res.json({ cities });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  // Create travel booking
  app.post("/api/travel/booking", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const bookingData = bookingConfirmationSchema.parse(req.body);
      
      // In a real implementation, you'd:
      // 1. Validate schedule availability
      // 2. Calculate pricing
      // 3. Process payment
      // 4. Create booking with all related data
      
      // For now, create a mock booking
      const booking = await storage.createTravelBooking({
        userId,
        scheduleId: bookingData.scheduleId,
        serviceType: "flight", // This would come from the schedule
        operatorName: "Mock Operator",
        routeNumber: "MK-001",
        fromLocation: "Mumbai",
        toLocation: "Delhi",
        departureDate: new Date(),
        departureTime: "06:00",
        arrivalTime: "08:30",
        totalPassengers: bookingData.passengers.length,
        seatClass: bookingData.seatClass,
        seatNumbers: null,
        totalAmount: 4500.00,
        baseAmount: 4000.00,
        taxes: 450.00,
        fees: "50.00",
        discounts: "0.00",
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "upi",
        contactInfo: bookingData.contactInfo,
        specialRequests: bookingData.specialRequests || null,
        checkInStatus: "not_checked_in"
      });

      // Create passengers
      const passengers = await Promise.all(
        bookingData.passengers.map(passenger => 
          storage.createTravelPassenger({
            bookingId: booking.id,
            title: "Mr", // Default, would be in passenger data
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            dateOfBirth: passenger.dateOfBirth || null,
            gender: passenger.gender,
            nationality: passenger.nationality,
            idType: passenger.idType || null,
            idNumber: passenger.idNumber || null,
            mealPreference: passenger.mealPreference || null,
            specialAssistance: passenger.specialAssistance || null,
            isInfant: passenger.isInfant ? 1 : 0
          })
        )
      );

      res.json({ booking, passengers });
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  // Get user's travel bookings
  app.get("/api/travel/my-bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const bookings = await storage.getTravelBookingsByUser(userId);
      
      // Enrich bookings with passenger data
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const passengers = await storage.getTravelPassengersByBooking(booking.id);
          return { ...booking, passengers };
        })
      );

      res.json({ bookings: bookingsWithDetails });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get specific travel booking
  app.get("/api/travel/booking/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking || booking.userId !== userId) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const passengers = await storage.getTravelPassengersByBooking(booking.id);
      const payments = await storage.getTravelPaymentsByBooking(booking.id);

      res.json({ booking: { ...booking, passengers, payments } });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking details" });
    }
  });

  // Cancel travel booking
  app.patch("/api/travel/booking/:id/cancel", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking || booking.userId !== userId) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: "Booking is already cancelled" });
      }

      if (booking.status === 'completed') {
        return res.status(400).json({ message: "Cannot cancel completed booking" });
      }

      const cancellationFee = parseFloat(booking.baseAmount) * 0.1;
      const refundAmount = parseFloat(booking.totalAmount) - cancellationFee;

      const updatedBooking = await storage.updateTravelBooking(id, {
        status: 'cancelled',
        paymentStatus: 'refunded'
      });

      res.json({ 
        booking: updatedBooking, 
        refundAmount,
        cancellationFee 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Search schedules by service type
  app.get("/api/travel/schedules/search", async (req, res) => {
    try {
      const { serviceType, fromLocation, toLocation, departureDate } = req.query;
      
      if (!serviceType || !fromLocation || !toLocation) {
        return res.status(400).json({ 
          message: "serviceType, fromLocation, and toLocation are required" 
        });
      }

      const filters: any = {
        serviceType: serviceType as string,
        fromLocation: fromLocation as string,
        toLocation: toLocation as string
      };
      
      if (departureDate) {
        filters.departureDate = departureDate as string;
      }

      const schedules = await storage.searchTravelSchedules(filters);
      
      res.json({ schedules });
    } catch (error) {
      res.status(500).json({ message: "Failed to search schedules" });
    }
  });

  // Get routes by service type
  app.get("/api/travel/routes", async (req, res) => {
    try {
      const { serviceType, fromLocation, toLocation } = req.query;
      
      const filters: any = {};
      if (serviceType) filters.serviceType = serviceType as string;
      if (fromLocation) filters.fromLocation = fromLocation as string;
      if (toLocation) filters.toLocation = toLocation as string;

      const routes = await storage.getTravelRoutes(filters);
      
      res.json({ routes });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  // Travel Contracts Routes
  
  // Get user's travel contracts
  app.get("/api/travel/contracts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contracts = await storage.getTravelContractsByUser(userId);
      res.json({ contracts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  // Get specific contract
  app.get("/api/travel/contracts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contract = await storage.getTravelContract(id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      res.json({ contract });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  // Create travel contract
  app.post("/api/travel/contracts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate request body with Zod schema
      const insertTravelContractSchema = z.object({
        contractName: z.string().min(1),
        partnerName: z.string().min(1),
        serviceTypes: z.array(z.string()).optional().nullable(),
        routes: z.any().optional().nullable(),
        discountPercent: z.string().optional(),
        negotiatedRates: z.any().optional().nullable(),
        bookingLimits: z.any().optional().nullable(),
        billingCycle: z.enum(['monthly', 'quarterly', 'net30', 'net45']).optional(),
        invoicingTerms: z.string().optional().nullable(),
        validFrom: z.string().or(z.date()),
        validUntil: z.string().or(z.date()),
        specialSkus: z.any().optional().nullable(),
        blackoutDates: z.array(z.string()).optional().nullable(),
        status: z.enum(['active', 'cancelled', 'draft', 'expired']).optional(),
        approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
        documentUrl: z.string().optional().nullable(),
        signedDocumentUrl: z.string().optional().nullable(),
        signatoryName: z.string().optional().nullable(),
        signatoryEmail: z.string().email().optional().nullable(),
      });

      const validatedData = insertTravelContractSchema.parse(req.body);

      // Convert dates and ensure proper types
      const validFrom = typeof validatedData.validFrom === 'string' ? new Date(validatedData.validFrom) : validatedData.validFrom;
      const validUntil = typeof validatedData.validUntil === 'string' ? new Date(validatedData.validUntil) : validatedData.validUntil;
      
      // Validate dates are valid
      if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) {
        return res.status(400).json({ message: "Invalid date format for validFrom or validUntil" });
      }

      const contractData = {
        ...validatedData,
        userId,
        status: validatedData.status || 'draft',
        billingCycle: validatedData.billingCycle || 'monthly',
        approvalStatus: validatedData.approvalStatus || 'pending',
        validFrom,
        validUntil
      };

      const contract = await storage.createTravelContract(contractData);
      res.json({ contract });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(400).json({ message: "Failed to create contract" });
    }
  });

  // Update travel contract
  app.patch("/api/travel/contracts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contract = await storage.getTravelContract(id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updated = await storage.updateTravelContract(id, req.body);
      res.json({ contract: updated });
    } catch (error) {
      res.status(400).json({ message: "Failed to update contract" });
    }
  });

  // Delete travel contract
  app.delete("/api/travel/contracts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contract = await storage.getTravelContract(id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (contract.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteTravelContract(id);
      res.json({ message: "Contract deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Get booking receipt
  app.get("/api/travel/booking/:id/receipt", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const passengers = await storage.getTravelPassengersByBooking(id);
      const payments = await storage.getTravelPaymentsByBooking(id);
      const addons = await storage.getTravelAddonsByBooking(id);

      const receipt = {
        booking,
        passengers,
        payments,
        addons,
        generatedAt: new Date().toISOString()
      };

      res.json({ receipt });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate receipt" });
    }
  });

  // Modify booking
  app.post("/api/travel/booking/:id/modify", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { modificationType, newDetails, modificationCharge } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Create modification record
      const modification = await storage.createTravelModification({
        bookingId: id,
        userId,
        modificationType,
        status: 'pending',
        originalDetails: {
          departureDate: booking.departureDate,
          seatClass: booking.seatClass,
          seatNumbers: booking.seatNumbers
        },
        newDetails,
        modificationCharge: modificationCharge || "0"
      });

      res.json({ modification });
    } catch (error) {
      res.status(400).json({ message: "Failed to modify booking" });
    }
  });

  // Get live tracking
  app.get("/api/travel/booking/:id/tracking", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const tracking = await storage.getTravelLiveTrackingByBooking(id);
      res.json({ tracking });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking" });
    }
  });

  // Update live tracking (for simulation/testing)
  app.post("/api/travel/booking/:id/tracking", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const existingTracking = await storage.getTravelLiveTrackingByBooking(id);
      
      let tracking;
      if (existingTracking) {
        tracking = await storage.updateTravelLiveTracking(existingTracking.id, req.body);
      } else {
        tracking = await storage.createTravelLiveTracking({
          bookingId: id,
          ...req.body
        });
      }

      res.json({ tracking });
    } catch (error) {
      res.status(400).json({ message: "Failed to update tracking" });
    }
  });

  // Get booking add-ons
  app.get("/api/travel/booking/:id/addons", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const addons = await storage.getTravelAddonsByBooking(id);
      res.json({ addons });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch add-ons" });
    }
  });

  // Add booking add-on
  app.post("/api/travel/booking/:id/addons", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = await storage.getTravelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const addon = await storage.createTravelAddon({
        bookingId: id,
        ...req.body
      });

      res.json({ addon });
    } catch (error) {
      res.status(400).json({ message: "Failed to add addon" });
    }
  });

  // Travel Coupon Routes
  
  // Get available coupons for a service type
  app.get("/api/travel-coupons", requireAuth, async (req, res) => {
    try {
      const { serviceType } = req.query;
      
      if (!serviceType) {
        return res.status(400).json({ message: "Service type is required" });
      }

      const validServiceTypes = ["flight", "bus", "train", "cab", "metro", "rental", "hotel", "event", "movie"];
      if (!validServiceTypes.includes(serviceType as string)) {
        return res.status(400).json({ message: "Invalid service type" });
      }

      const coupons = await storage.getActiveTravelCoupons(serviceType as string);
      res.json(coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  // Validate and get coupon by code
  app.post("/api/travel-coupons/validate", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { code, serviceType, bookingAmount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!code || !serviceType || !bookingAmount) {
        return res.status(400).json({ 
          message: "Coupon code, service type, and booking amount are required" 
        });
      }

      const coupon = await storage.getTravelCouponByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ message: "Coupon is inactive" });
      }

      const now = new Date();
      const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
      const validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;

      if (!validFrom || !validUntil || now < validFrom || now > validUntil) {
        return res.status(400).json({ message: "Coupon has expired or not yet valid" });
      }

      const applicableServices = coupon.applicableServiceTypes as string[];
      if (!applicableServices.includes(serviceType)) {
        return res.status(400).json({ 
          message: `This coupon is not applicable for ${serviceType} bookings` 
        });
      }

      const minAmount = Number(coupon.minBookingAmount);
      if (bookingAmount < minAmount) {
        return res.status(400).json({ 
          message: `Minimum booking amount of ₹${minAmount} required` 
        });
      }

      if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }

      const userUsageCount = await storage.getUserTravelCouponUsageCount(coupon.id, userId);
      if (coupon.userLimit && userUsageCount >= coupon.userLimit) {
        return res.status(400).json({ 
          message: "You have already used this coupon the maximum number of times" 
        });
      }

      res.json(coupon);
    } catch (error) {
      console.error("Error validating coupon:", error);
      res.status(500).json({ message: "Failed to validate coupon" });
    }
  });

  // Apply coupon and record usage
  app.post("/api/travel-coupons/apply", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { couponId, bookingId, serviceType, discountAmount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!couponId || !serviceType || !discountAmount) {
        return res.status(400).json({ 
          message: "Coupon ID, service type, and discount amount are required" 
        });
      }

      const usage = await storage.createTravelCouponUsage({
        couponId,
        userId,
        bookingId,
        serviceType,
        discountAmount: typeof discountAmount === 'number' ? discountAmount.toString() : discountAmount
      });

      await storage.incrementTravelCouponUsage(couponId);

      res.json({ success: true, usage });
    } catch (error) {
      console.error("Error applying coupon:", error);
      res.status(500).json({ message: "Failed to apply coupon" });
    }
  });

  // Get user's coupon usage history
  app.get("/api/travel-coupons/usage", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const usageHistory = await storage.getUserTravelCouponUsage(userId);
      res.json(usageHistory);
    } catch (error) {
      console.error("Error fetching coupon usage:", error);
      res.status(500).json({ message: "Failed to fetch coupon usage" });
    }
  });

  // Investment & Financial Data Routes
  
  // Get investment portfolio
  app.get("/api/investments/portfolio", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const portfolio = await storage.getInvestmentPortfolioByUser(userId);
      
      // Enrich with real-time data
      const enrichedPortfolio = await Promise.all(
        portfolio.map(async (investment) => {
          let currentData = null;
          
          if (investment.investmentType === 'stocks' && investment.symbol) {
            currentData = await financialApiService.getStockData(investment.symbol);
          } else if (investment.investmentType === 'mutual_funds' && investment.symbol) {
            currentData = await financialApiService.getMutualFundData(investment.symbol);
          }
          
          return {
            ...investment,
            currentData
          };
        })
      );

      res.json({ portfolio: enrichedPortfolio });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Search investment products
  app.get("/api/investments/search", requireAuth, async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }

      let results = [];
      
      if (!type || type === 'stocks') {
        const stocks = await financialApiService.searchStocks(q);
        results.push(...stocks.map(stock => ({ ...stock, type: 'stock' })));
      }
      
      if (!type || type === 'mutual_funds') {
        const mutualFunds = await financialApiService.searchMutualFunds(q);
        results.push(...mutualFunds.map(fund => ({ ...fund, type: 'mutual_fund' })));
      }

      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Failed to search investments" });
    }
  });

  // Get stock/fund details
  app.get("/api/investments/details/:symbol", requireAuth, async (req, res) => {
    try {
      const { symbol } = req.params;
      const { type } = req.query;
      
      let data = null;
      
      if (type === 'stock') {
        data = await financialApiService.getStockData(symbol);
      } else if (type === 'mutual_fund') {
        data = await financialApiService.getMutualFundData(symbol);
      } else {
        // Try both if type not specified
        data = await financialApiService.getStockData(symbol);
        if (!data) {
          data = await financialApiService.getMutualFundData(symbol);
        }
      }
      
      if (!data) {
        return res.status(404).json({ message: "Investment not found" });
      }

      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment details" });
    }
  });

  // Get market predictions
  app.get("/api/investments/predictions", requireAuth, async (req, res) => {
    try {
      const predictions = await financialApiService.getMarketPredictions();
      res.json({ predictions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Create investment (buy stocks/mutual funds)
  app.post("/api/investments/buy", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { symbol, investmentType, quantity, price, investmentAmount } = req.body;
      
      if (!symbol || !investmentType || (!quantity && !investmentAmount)) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Get current market data
      let marketData = null;
      if (investmentType === 'stocks') {
        marketData = await financialApiService.getStockData(symbol);
      } else if (investmentType === 'mutual_funds') {
        marketData = await financialApiService.getMutualFundData(symbol);
      }

      if (!marketData) {
        return res.status(404).json({ message: "Investment not found" });
      }

      const currentPrice = investmentType === 'stocks' ? (marketData as any).currentPrice : (marketData as any).nav;
      const finalQuantity = quantity || (investmentAmount / currentPrice);
      const finalAmount = investmentAmount || (quantity * currentPrice);

      // Create investment portfolio entry
      const investment = await storage.createInvestmentPortfolio({
        userId,
        investmentType,
        instrumentName: marketData.name,
        symbol,
        quantity: finalQuantity.toString(),
        avgPrice: currentPrice.toString(),
        currentPrice: currentPrice.toString(),
        totalInvested: finalAmount.toString(),
        currentValue: finalAmount.toString(),
        gainLoss: "0",
        gainLossPercentage: "0",
        category: investmentType === 'mutual_funds' ? (marketData as any).category : (marketData as any).sector || 'stocks',
        riskLevel: investmentType === 'mutual_funds' ? (marketData as any).riskLevel : 'medium'
      });

      res.json({ investment });
    } catch (error) {
      res.status(400).json({ message: "Failed to create investment" });
    }
  });

  // Investment Watchlist API Routes
  app.get("/api/watchlist", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const watchlist = await storage.getWatchlistByUser(userId);
      res.json({ watchlist });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertInvestmentWatchlistSchema.parse({ ...req.body, userId });
      const item = await storage.addToWatchlist(data);
      res.json({ item });
    } catch (error) {
      res.status(400).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getWatchlistItem(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Watchlist item not found" });
      }
      
      await storage.removeFromWatchlist(id);
      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  app.patch("/api/watchlist/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getWatchlistItem(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Watchlist item not found" });
      }
      
      const updateData = insertInvestmentWatchlistSchema.partial().omit({ userId: true }).parse(req.body);
      const item = await storage.updateWatchlistItem(id, updateData);
      res.json({ item });
    } catch (error) {
      res.status(500).json({ message: "Failed to update watchlist item" });
    }
  });

  // Investment Orders API Routes
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orders = await storage.getOrdersByUser(userId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertInvestmentOrderSchema.parse({ ...req.body, userId });
      const order = await storage.createOrder(data);
      res.json({ order });
    } catch (error: any) {
      console.error("Order creation error:", error);
      const errorMessage = error?.errors?.[0]?.message || error?.message || "Failed to create order";
      res.status(400).json({ message: errorMessage });
    }
  });

  app.patch("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getOrder(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updateData = insertInvestmentOrderSchema.partial().omit({ userId: true }).parse(req.body);
      const order = await storage.updateOrder(id, updateData as any);
      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Transaction Confirmation API Routes
  app.get("/api/transaction-confirmation/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const confirmation = await storage.getTransactionConfirmation(id);
      if (!confirmation || confirmation.userId !== userId) {
        return res.status(404).json({ message: "Transaction confirmation not found" });
      }
      res.json(confirmation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction confirmation" });
    }
  });

  app.post("/api/transaction-confirmation", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertTransactionConfirmationSchema.parse({ ...req.body, userId });
      const confirmation = await storage.createTransactionConfirmation(data);
      res.json({ confirmation });
    } catch (error) {
      res.status(400).json({ message: "Failed to create transaction confirmation" });
    }
  });

  // Universal Transaction Success API Routes
  app.get("/api/transaction-success/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const record = await storage.getTransactionSuccessRecord(id);
      if (!record || record.userId !== userId) {
        return res.status(404).json({ message: "Transaction record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction record" });
    }
  });

  app.post("/api/transaction-success", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Generate a random coupon from partnered brands
      const couponBrands = [
        { 
          name: "Amazon", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
          categories: ["shopping"],
          valueRange: [100, 500]
        },
        { 
          name: "Flipkart", 
          logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
          categories: ["shopping"],
          valueRange: [100, 500]
        },
        { 
          name: "Swiggy", 
          logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
          categories: ["food"],
          valueRange: [50, 300]
        },
        { 
          name: "Zomato", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
          categories: ["food"],
          valueRange: [50, 300]
        },
        { 
          name: "MakeMyTrip", 
          logo: "https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/header/mmtLogoWhite.png",
          categories: ["travel"],
          valueRange: [200, 1000]
        },
        { 
          name: "BookMyShow", 
          logo: "https://in.bmscdn.com/webin/common/icons/logo.svg",
          categories: ["entertainment"],
          valueRange: [100, 500]
        },
      ];

      const randomBrand = couponBrands[Math.floor(Math.random() * couponBrands.length)];
      const couponValue = Math.floor(
        Math.random() * (randomBrand.valueRange[1] - randomBrand.valueRange[0] + 1) + 
        randomBrand.valueRange[0]
      );
      
      // Generate a random coupon code
      const couponCode = `${randomBrand.name.toUpperCase().slice(0, 4)}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Calculate coupon expiry (30 days from now)
      const couponValidUntil = new Date();
      couponValidUntil.setDate(couponValidUntil.getDate() + 30);

      const data = insertTransactionSuccessRecordSchema.parse({ 
        ...req.body, 
        userId,
        couponCode,
        couponBrand: randomBrand.name,
        couponTitle: `${randomBrand.name} Gift Voucher`,
        couponValue: couponValue.toString(),
        couponDescription: `Get ₹${couponValue} off on your next purchase at ${randomBrand.name}`,
        couponValidUntil,
        couponCategory: randomBrand.categories[0],
        couponTerms: `Valid for 30 days. Not applicable on sale items. Single use only.`,
        couponBrandLogo: randomBrand.logo,
      });
      
      const record = await storage.createTransactionSuccessRecord(data);
      res.json({ record });
    } catch (error: any) {
      console.error("Error creating transaction success record:", error);
      res.status(400).json({ message: error.message || "Failed to create transaction record" });
    }
  });

  // Investment Vendors API Routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const { assetType, isActive } = req.query;
      const filters: any = {};
      
      if (assetType) filters.assetType = assetType as string;
      if (isActive !== undefined) filters.isActive = parseInt(isActive as string);
      
      const vendors = await storage.getVendors(filters);
      res.json({ vendors });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const vendor = await storage.getVendor(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json({ vendor });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  // Market Data API Routes
  app.get("/api/market/trending", requireAuth, async (req, res) => {
    try {
      const data = await storage.getAllMarketData({ assetType: "stock" });
      const trending = data.slice(0, 10);
      res.json(trending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending market data" });
    }
  });

  app.get("/api/market", async (req, res) => {
    try {
      const { assetType } = req.query;
      const filters: any = {};
      
      if (assetType) filters.assetType = assetType as string;
      
      const data = await storage.getAllMarketData(filters);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/market/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await storage.getMarketData(symbol);
      if (!data) {
        return res.status(404).json({ message: "Market data not found" });
      }
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Live Crypto Price API (using CoinGecko)
  app.get("/api/crypto/live/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await financialApiService.getCryptoPrice(symbol);
      if (!data) {
        return res.status(404).json({ message: "Crypto data not found" });
      }
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto price" });
    }
  });

  // Live Gold Price API
  app.get("/api/precious-metals/gold", async (req, res) => {
    try {
      const data = await financialApiService.getGoldPrice();
      if (!data) {
        return res.status(404).json({ message: "Gold price not available" });
      }
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gold price" });
    }
  });

  // Live Silver Price API
  app.get("/api/precious-metals/silver", async (req, res) => {
    try {
      const data = await financialApiService.getSilverPrice();
      if (!data) {
        return res.status(404).json({ message: "Silver price not available" });
      }
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch silver price" });
    }
  });

  // User Vehicles API Routes
  app.get("/api/vehicles", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const vehicles = await storage.getVehiclesByUser(userId);
      res.json({ vehicles });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post("/api/vehicles", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertUserVehicleSchema.parse({ ...req.body, userId });
      const vehicle = await storage.createVehicle(data);
      res.json({ vehicle });
    } catch (error) {
      res.status(400).json({ message: "Failed to create vehicle" });
    }
  });

  app.patch("/api/vehicles/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getVehicle(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      const updateData = insertUserVehicleSchema.partial().omit({ userId: true }).parse(req.body);
      const vehicle = await storage.updateVehicle(id, updateData);
      res.json({ vehicle });
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getVehicle(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      await storage.deleteVehicle(id);
      res.json({ message: "Vehicle deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // FASTag Account API Routes
  app.get("/api/fastag/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accounts = await storage.getFastagAccountsByUser(userId);
      res.json({ accounts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FASTag accounts" });
    }
  });

  app.get("/api/fastag/accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const account = await storage.getFastagAccount(id);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "FASTag account not found" });
      }
      res.json({ account });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FASTag account" });
    }
  });

  app.post("/api/fastag/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertFastagAccountSchema.parse({ ...req.body, userId });
      const account = await storage.createFastagAccount(data);
      res.json({ account });
    } catch (error) {
      res.status(400).json({ message: "Failed to create FASTag account" });
    }
  });

  app.patch("/api/fastag/accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getFastagAccount(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "FASTag account not found" });
      }
      
      const updateData = insertFastagAccountSchema.partial().omit({ userId: true, vehicleId: true }).parse(req.body);
      const account = await storage.updateFastagAccount(id, updateData);
      res.json({ account });
    } catch (error) {
      res.status(500).json({ message: "Failed to update FASTag account" });
    }
  });

  // FASTag Transaction API Routes
  app.get("/api/fastag/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const transactions = await storage.getFastagTransactionsByUser(userId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FASTag transactions" });
    }
  });

  app.get("/api/fastag/accounts/:accountId/transactions", requireAuth, async (req, res) => {
    try {
      const { accountId } = req.params;
      const transactions = await storage.getFastagTransactionsByAccount(accountId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FASTag transactions" });
    }
  });

  app.post("/api/fastag/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertFastagTransactionSchema.parse({ ...req.body, userId });
      
      const account = await storage.getFastagAccount(data.fastagAccountId);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "FASTag account not found" });
      }
      
      const currentBalance = parseFloat(account.balance || "0");
      const amount = parseFloat(String(data.amount));
      
      if (data.transactionType === 'recharge') {
        const newBalance = (currentBalance + amount).toFixed(2);
        await storage.updateFastagAccount(data.fastagAccountId, { 
          balance: newBalance,
          lastRechargeDate: new Date()
        });
      } else if (data.transactionType === 'toll_payment') {
        if (currentBalance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        const newBalance = (currentBalance - amount).toFixed(2);
        await storage.updateFastagAccount(data.fastagAccountId, { 
          balance: newBalance
        });
      }
      
      const transaction = await storage.createFastagTransaction(data);
      res.json({ transaction });
    } catch (error) {
      res.status(400).json({ message: "Failed to create FASTag transaction" });
    }
  });

  // FASTag QR Scan API Route (Stub for demo)
  app.post("/api/fastag/scan", async (req, res) => {
    try {
      // In a real implementation, this would process the uploaded QR code image
      // For now, return mock data to demonstrate the flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      res.json({ 
        fastagData: { 
          fastagId: "MOCK-QR-SCAN",
          message: "QR scan simulated successfully" 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to scan QR code" });
    }
  });

  // Loan Amortization Schedule API Routes
  app.get("/api/loans/:loanId/schedule", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { loanId } = req.params;
      const loan = await storage.getLoanApplication(loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const schedule = await storage.getAmortizationScheduleByLoan(loanId);
      res.json({ schedule });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch amortization schedule" });
    }
  });

  app.post("/api/loans/:loanId/schedule", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { loanId } = req.params;
      const loan = await storage.getLoanApplication(loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const data = insertLoanAmortizationScheduleSchema.parse({ ...req.body, loanId });
      const scheduleItem = await storage.createAmortizationSchedule(data);
      res.status(201).json({ scheduleItem });
    } catch (error) {
      res.status(400).json({ message: "Failed to create schedule item" });
    }
  });

  app.patch("/api/schedule/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getAmortizationScheduleItem(id);
      if (!existing) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      
      const loan = await storage.getLoanApplication(existing.loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      
      const updateData = insertLoanAmortizationScheduleSchema.partial().omit({ loanId: true }).parse(req.body);
      const scheduleItem = await storage.updateAmortizationSchedule(id, updateData);
      
      res.json({ scheduleItem });
    } catch (error) {
      res.status(500).json({ message: "Failed to update schedule item" });
    }
  });

  // Loan Documents API Routes
  app.get("/api/loans/:loanId/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { loanId } = req.params;
      const loan = await storage.getLoanApplication(loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const documents = await storage.getLoanDocumentsByLoan(loanId);
      res.json({ documents });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loan documents" });
    }
  });

  app.post("/api/loans/:loanId/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { loanId } = req.params;
      const loan = await storage.getLoanApplication(loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Loan not found" });
      }
      
      const data = insertLoanDocumentSchema.parse({ ...req.body, loanId });
      const document = await storage.createLoanDocument(data);
      res.status(201).json({ document });
    } catch (error) {
      res.status(400).json({ message: "Failed to upload document" });
    }
  });

  app.patch("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getLoanDocument(id);
      if (!existing) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const loan = await storage.getLoanApplication(existing.loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const updateData = insertLoanDocumentSchema.partial().omit({ loanId: true }).parse(req.body);
      const document = await storage.updateLoanDocument(id, updateData);
      res.json({ document });
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getLoanDocument(id);
      if (!existing) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const loan = await storage.getLoanApplication(existing.loanId);
      if (!loan || loan.userId !== userId) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      await storage.deleteLoanDocument(id);
      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Saved Cards API Routes
  app.get("/api/cards", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const cards = await storage.getSavedCardsByUser(userId);
      res.json({ cards });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get("/api/cards/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const card = await storage.getSavedCard(id);
      if (!card || card.userId !== userId) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json({ card });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  app.post("/api/cards", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertSavedCardSchema.parse({ ...req.body, userId });
      const card = await storage.createSavedCard(data);
      res.status(201).json({ card });
    } catch (error) {
      res.status(400).json({ message: "Failed to add card" });
    }
  });

  app.patch("/api/cards/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getSavedCard(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      const updateData = insertSavedCardSchema.partial().omit({ userId: true }).parse(req.body);
      const card = await storage.updateSavedCard(id, updateData);
      res.json({ card });
    } catch (error) {
      res.status(500).json({ message: "Failed to update card" });
    }
  });

  app.delete("/api/cards/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getSavedCard(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      await storage.deleteSavedCard(id);
      res.json({ message: "Card deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  // Card Transactions API Routes
  app.get("/api/cards/:cardId/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { cardId } = req.params;
      const card = await storage.getSavedCard(cardId);
      if (!card || card.userId !== userId) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      const transactions = await storage.getCardTransactionsByCard(cardId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card transactions" });
    }
  });

  app.get("/api/card-transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const transactions = await storage.getCardTransactionsByUser(userId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch card transactions" });
    }
  });

  app.post("/api/card-transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertCardTransactionSchema.parse({ ...req.body, userId });
      const card = await storage.getSavedCard(data.cardId);
      if (!card || card.userId !== userId) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      const transaction = await storage.createCardTransaction(data);
      res.status(201).json({ transaction });
    } catch (error) {
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  // Bank Accounts API Routes
  app.get("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const accounts = await storage.getBankAccountsByUser(userId);
      res.json({ accounts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank accounts" });
    }
  });

  app.get("/api/bank-accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const account = await storage.getBankAccount(id);
      if (!account || account.userId !== userId) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      res.json({ account });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank account" });
    }
  });

  app.post("/api/bank-accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertBankAccountSchema.parse({ ...req.body, userId });
      const account = await storage.createBankAccount(data);
      res.status(201).json({ account });
    } catch (error) {
      res.status(400).json({ message: "Failed to add bank account" });
    }
  });

  app.patch("/api/bank-accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getBankAccount(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      const updateData = insertBankAccountSchema.partial().omit({ userId: true }).parse(req.body);
      const account = await storage.updateBankAccount(id, updateData);
      res.json({ account });
    } catch (error) {
      res.status(500).json({ message: "Failed to update bank account" });
    }
  });

  app.delete("/api/bank-accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getBankAccount(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Bank account not found" });
      }
      
      await storage.deleteBankAccount(id);
      res.json({ message: "Bank account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bank account" });
    }
  });

  // Activity Logs API Routes
  app.get("/api/activity", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { limit } = req.query;
      const logs = limit 
        ? await storage.getRecentActivityByUser(userId, parseInt(String(limit)))
        : await storage.getActivityLogsByUser(userId);
      
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  app.get("/api/activity/suspicious", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const logs = await storage.getSuspiciousActivityByUser(userId);
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suspicious activity" });
    }
  });

  app.post("/api/activity", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertActivityLogSchema.parse({ ...req.body, userId });
      const log = await storage.createActivityLog(data);
      res.status(201).json({ log });
    } catch (error) {
      res.status(400).json({ message: "Failed to create activity log" });
    }
  });

  // Stock Trades API Routes
  app.get("/api/stock-trades", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { symbol } = req.query;
      const trades = symbol
        ? await storage.getStockTradesBySymbol(userId, String(symbol))
        : await storage.getStockTradesByUser(userId);
      
      res.json({ trades });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock trades" });
    }
  });

  app.get("/api/stock-trades/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const trade = await storage.getStockTrade(id);
      if (!trade || trade.userId !== userId) {
        return res.status(404).json({ message: "Stock trade not found" });
      }
      
      res.json({ trade });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock trade" });
    }
  });

  app.post("/api/stock-trades", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertStockTradeSchema.parse({ ...req.body, userId });
      const trade = await storage.createStockTrade(data);
      res.status(201).json({ trade });
    } catch (error) {
      res.status(400).json({ message: "Failed to create stock trade" });
    }
  });

  app.patch("/api/stock-trades/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getStockTrade(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Stock trade not found" });
      }
      
      const updateData = insertStockTradeSchema.partial().omit({ userId: true }).parse(req.body);
      const trade = await storage.updateStockTrade(id, updateData);
      res.json({ trade });
    } catch (error) {
      res.status(500).json({ message: "Failed to update stock trade" });
    }
  });

  // Financial Goals API Routes
  app.get("/api/financial-goals", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const goals = await storage.getFinancialGoalsByUser(userId);
      res.json({ goals });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  app.get("/api/financial-goals/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const goal = await storage.getFinancialGoal(id);
      if (!goal || goal.userId !== userId) {
        return res.status(404).json({ message: "Financial goal not found" });
      }
      
      res.json({ goal });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial goal" });
    }
  });

  app.post("/api/financial-goals", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertFinancialGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createFinancialGoal(data);
      res.status(201).json({ goal });
    } catch (error) {
      res.status(400).json({ message: "Failed to create financial goal" });
    }
  });

  app.patch("/api/financial-goals/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getFinancialGoal(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Financial goal not found" });
      }
      
      const updateData = insertFinancialGoalSchema.partial().omit({ userId: true }).parse(req.body);
      const goal = await storage.updateFinancialGoal(id, updateData);
      res.json({ goal });
    } catch (error) {
      res.status(500).json({ message: "Failed to update financial goal" });
    }
  });

  app.delete("/api/financial-goals/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getFinancialGoal(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Financial goal not found" });
      }
      
      await storage.deleteFinancialGoal(id);
      res.json({ message: "Financial goal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete financial goal" });
    }
  });

  // Budgets API Routes
  app.get("/api/budgets", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { category } = req.query;
      const budgets = category
        ? await storage.getBudgetsByCategory(userId, String(category))
        : await storage.getBudgetsByUser(userId);
      
      res.json({ budgets });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.get("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const budget = await storage.getBudget(id);
      if (!budget || budget.userId !== userId) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      res.json({ budget });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget" });
    }
  });

  app.post("/api/budgets", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const data = insertBudgetSchema.parse({ ...req.body, userId });
      const budget = await storage.createBudget(data);
      res.status(201).json({ budget });
    } catch (error) {
      res.status(400).json({ message: "Failed to create budget" });
    }
  });

  app.patch("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getBudget(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      const updateData = insertBudgetSchema.partial().omit({ userId: true }).parse(req.body);
      const budget = await storage.updateBudget(id, updateData);
      res.json({ budget });
    } catch (error) {
      res.status(500).json({ message: "Failed to update budget" });
    }
  });

  app.delete("/api/budgets/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const existing = await storage.getBudget(id);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      await storage.deleteBudget(id);
      res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget" });
    }
  });

  // ======================
  // MOVIE BOOKING ROUTES
  // ======================

  app.get("/api/movies", async (req, res) => {
    try {
      const filters = movieFiltersSchema.parse(req.query);
      const movies = await storage.getMovies(filters);
      res.json({ success: true, movies });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const movie = await storage.getMovie(id.toLowerCase());
      
      if (!movie) {
        return res.status(404).json({ success: false, message: "Movie not found" });
      }
      
      res.json({ success: true, movie });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch movie" });
    }
  });

  app.get("/api/theaters", async (req, res) => {
    try {
      const filters = theaterFiltersSchema.parse(req.query);
      const theaters = await storage.getTheaters(filters);
      res.json({ success: true, theaters });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch theaters" });
    }
  });

  app.get("/api/theaters/:id", async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const theater = await storage.getTheater(id);
      
      if (!theater) {
        return res.status(404).json({ success: false, message: "Theater not found" });
      }
      
      res.json({ success: true, theater });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch theater" });
    }
  });

  app.get("/api/showtimes", async (req, res) => {
    try {
      const filters = showtimeFiltersSchema.parse(req.query);
      const showtimes = await storage.getMovieShowtimes(filters);
      res.json({ success: true, showtimes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch showtimes" });
    }
  });

  app.get("/api/showtimes/:id", async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const showtime = await storage.getMovieShowtime(id);
      
      if (!showtime) {
        return res.status(404).json({ success: false, message: "Showtime not found" });
      }
      
      res.json({ success: true, showtime });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch showtime" });
    }
  });

  app.get("/api/showtimes/:id/seat-categories", async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const seatCategories = await storage.getSeatCategoriesByShowtime(id);
      res.json({ success: true, seatCategories });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch seat categories" });
    }
  });

  app.get("/api/showtimes/:id/seat-layout", async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const seatLayout = await storage.getSeatLayout(id);
      res.json({ success: true, seatLayout });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch seat layout" });
    }
  });

  app.post("/api/showtimes/:id/hold-seats", requireAuth, createRateLimiter('HOLD_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id: showtimeId } = idParamsSchema.parse(req.params);
      
      // Validate batch hold request
      const batchHoldSchema = z.object({
        seatIds: z.array(z.string()).min(1).max(10),
        sessionId: z.string().optional(),
      });
      
      const { seatIds, sessionId } = batchHoldSchema.parse(req.body);

      // Step 1: Validate ALL seats are available before creating any holds
      const seatLayoutData = await storage.getSeatLayoutByShowtime(showtimeId);
      const unavailableSeats: string[] = [];
      
      for (const seatId of seatIds) {
        const seat = seatLayoutData.find(s => s.id === seatId);
        if (!seat) {
          unavailableSeats.push(seatId);
        } else if (seat.status !== "available") {
          unavailableSeats.push(seat.seatNumber || seatId);
        }
      }

      if (unavailableSeats.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: `Some seats are no longer available: ${unavailableSeats.join(", ")}`,
          unavailableSeats,
        });
      }

      // Step 2: Create holds for all seats (all are confirmed available)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const holdSessionId = sessionId || `session-${userId}-${Date.now()}`;
      const seatHolds = [];
      const createdHoldIds: string[] = [];
      
      try {
        for (const seatId of seatIds) {
          const seatHold = await storage.createSeatHold({
            seatId,
            userId,
            expiresAt,
            sessionId: holdSessionId,
          });
          seatHolds.push(seatHold);
          createdHoldIds.push(seatHold.id);
        }
        
        return res.status(201).json({ success: true, seatHolds, expiresAt: expiresAt.toISOString() });
      } catch (holdError) {
        // Rollback: delete any holds that were created
        for (const holdId of createdHoldIds) {
          try {
            await storage.deleteSeatHold(holdId);
          } catch (deleteError) {
            // Log but continue cleanup
          }
        }
        
        return res.status(500).json({ 
          success: false, 
          message: "Failed to hold seats. Please try again." 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to hold seats" 
      });
    }
  });

  app.delete("/api/seat-holds/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const seatHold = await storage.getSeatHold(id);
      
      if (!seatHold) {
        return res.status(404).json({ success: false, message: "Seat hold not found" });
      }
      
      if (seatHold.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to release this hold" });
      }
      
      await storage.deleteSeatHold(id);
      res.json({ success: true, message: "Seat hold released successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to release seat hold" });
    }
  });

  app.get("/api/food-menu/:theaterId", async (req, res) => {
    try {
      const { theaterId } = z.object({ theaterId: z.string().min(1) }).parse(req.params);
      const foodMenu = await storage.getFoodMenuByTheater(theaterId);
      res.json({ success: true, foodMenu });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch food menu" });
    }
  });

  app.get("/api/movie-bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await storage.getMovieBookingsByUser(userId);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/movie-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const booking = await storage.getMovieBooking(id);
      
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
  });

  app.post("/api/movie-bookings", requireAuth, createRateLimiter('BOOKING_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookingReference = `MOV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const data = insertMovieBookingSchema.parse({ 
        ...req.body, 
        userId,
        bookingReference
      });
      
      const booking = await storage.createMovieBooking(data);
      res.status(201).json({ success: true, booking, message: "Booking created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create booking" 
      });
    }
  });

  app.patch("/api/movie-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getMovieBooking(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }
      
      let updateData: any = insertMovieBookingSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const booking = await storage.updateMovieBooking(id, updateData);
      res.json({ success: true, booking, message: "Booking updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update booking" 
      });
    }
  });

  // ======================
  // EVENT BOOKING ROUTES
  // ======================

  app.get("/api/events", requireAuth, async (req, res) => {
    try {
      const filters = eventFiltersSchema.parse(req.query);
      const events = await storage.getEvents(filters);
      res.json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
      
      res.json({ success: true, event });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch event" });
    }
  });

  app.get("/api/events/:id/ticket-tiers", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const ticketTiers = await storage.getEventTicketTiersByEvent(id);
      res.json({ success: true, ticketTiers });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch ticket tiers" });
    }
  });

  app.post("/api/events/:eventId/hold-tickets", requireAuth, createRateLimiter('HOLD_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { eventId } = z.object({ eventId: z.string().min(1) }).parse(req.params);
      const data = insertEventTicketHoldSchema.parse({ 
        ...req.body, 
        userId,
        eventId,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });
      
      const ticketHold = await storage.createEventTicketHold(data);
      res.status(201).json({ success: true, ticketHold });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to hold tickets" 
      });
    }
  });

  app.delete("/api/event-ticket-holds/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      
      // Simply delete the hold since we don't have a get method for single holds
      // The storage layer will handle checking if it exists
      await storage.deleteEventTicketHold(id);
      res.json({ success: true, message: "Ticket hold released successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to release ticket hold" });
    }
  });

  app.get("/api/event-bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await storage.getEventBookingsByUser(userId);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/event-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const booking = await storage.getEventBooking(id);
      
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
  });

  app.post("/api/event-bookings", requireAuth, createRateLimiter('BOOKING_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookingReference = `EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const data = insertEventBookingSchema.parse({ 
        ...req.body, 
        userId,
        bookingReference
      });
      
      const booking = await storage.createEventBooking(data);
      res.status(201).json({ success: true, booking, message: "Booking created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create booking" 
      });
    }
  });

  app.patch("/api/event-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getEventBooking(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }
      
      let updateData: any = insertEventBookingSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const booking = await storage.updateEventBooking(id, updateData);
      res.json({ success: true, booking, message: "Booking updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update booking" 
      });
    }
  });

  // ======================
  // METRO BOOKING ROUTES
  // ======================

  app.get("/api/metro/stations", requireAuth, async (req, res) => {
    try {
      const filters = req.query.city || req.query.metroLine 
        ? { city: req.query.city as string | undefined, metroLine: req.query.metroLine as string | undefined }
        : undefined;
      const stations = await storage.getMetroStations(filters);
      res.json({ success: true, stations });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch metro stations" });
    }
  });

  app.get("/api/metro/stations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const station = await storage.getMetroStation(id);
      
      if (!station) {
        return res.status(404).json({ success: false, message: "Metro station not found" });
      }
      
      res.json({ success: true, station });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch metro station" });
    }
  });

  app.get("/api/metro/routes", requireAuth, async (req, res) => {
    try {
      const filters = req.query.fromStationId || req.query.toStationId || req.query.metroLine
        ? {
            fromStationId: req.query.fromStationId as string | undefined,
            toStationId: req.query.toStationId as string | undefined,
            metroLine: req.query.metroLine as string | undefined
          }
        : undefined;
      const routes = await storage.getMetroRoutes(filters);
      res.json({ success: true, routes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch metro routes" });
    }
  });

  app.get("/api/metro/routes/search", requireAuth, async (req, res) => {
    try {
      const { fromStationId, toStationId } = z.object({
        fromStationId: z.string().min(1),
        toStationId: z.string().min(1)
      }).parse(req.query);
      
      const routes = await storage.searchMetroRoutes(fromStationId, toStationId);
      res.json({ success: true, routes });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid search parameters" 
      });
    }
  });

  app.get("/api/metro/smart-cards", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const cards = await storage.getMetroSmartCardsByUser(userId);
      res.json({ success: true, cards });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch smart cards" });
    }
  });

  app.post("/api/metro/smart-cards", requireAuth, createRateLimiter('CARD_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const cardNumber = `MC${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const data = insertMetroSmartCardSchema.parse({ 
        ...req.body, 
        userId,
        cardNumber
      });
      
      const card = await storage.createMetroSmartCard(data);
      res.status(201).json({ success: true, card, message: "Smart card created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create smart card" 
      });
    }
  });

  app.patch("/api/metro/smart-cards/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getMetroSmartCard(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Smart card not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this card" });
      }
      
      const updateData = insertMetroSmartCardSchema.partial().omit({ userId: true, cardNumber: true }).parse(req.body);
      const card = await storage.updateMetroSmartCard(id, updateData);
      res.json({ success: true, card, message: "Smart card updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update smart card" 
      });
    }
  });

  app.get("/api/metro/tickets", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const tickets = await storage.getMetroTicketsByUser(userId);
      res.json({ success: true, tickets });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch metro tickets" });
    }
  });

  app.get("/api/metro/tickets/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const ticket = await storage.getMetroTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Metro ticket not found" });
      }
      
      if (ticket.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this ticket" });
      }
      
      res.json({ success: true, ticket });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch metro ticket" });
    }
  });

  app.post("/api/metro/tickets", requireAuth, createRateLimiter('BOOKING_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertMetroTicketSchema.parse({ 
        ...req.body, 
        userId
      });
      
      const ticket = await storage.createMetroTicket(data);
      res.status(201).json({ success: true, ticket, message: "Metro ticket booked successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to book metro ticket" 
      });
    }
  });

  app.patch("/api/metro/tickets/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getMetroTicket(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Metro ticket not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this ticket" });
      }
      
      let updateData: any = insertMetroTicketSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const ticket = await storage.updateMetroTicket(id, updateData);
      res.json({ success: true, ticket, message: "Metro ticket updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update metro ticket" 
      });
    }
  });

  app.get("/api/metro/travel-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const history = await storage.getMetroTravelHistoryByUser(userId);
      res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch travel history" });
    }
  });

  app.post("/api/metro/travel-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertMetroTravelHistorySchema.parse({ 
        ...req.body, 
        userId
      });
      
      const history = await storage.createMetroTravelHistory(data);
      res.status(201).json({ success: true, history, message: "Travel history recorded successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to record travel history" 
      });
    }
  });

  // ======================
  // RENTAL BOOKING ROUTES
  // ======================

  app.get("/api/rental/vehicles", requireAuth, async (req, res) => {
    try {
      const filters = req.query.vehicleType || req.query.city || req.query.category || req.query.status
        ? {
            vehicleType: req.query.vehicleType as string | undefined,
            city: req.query.city as string | undefined,
            category: req.query.category as string | undefined,
            status: req.query.status as string | undefined
          }
        : undefined;
      const vehicles = await storage.getRentalVehicles(filters);
      res.json({ success: true, vehicles });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental vehicles" });
    }
  });

  app.get("/api/rental/vehicles/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const vehicle = await storage.getRentalVehicle(id);
      
      if (!vehicle) {
        return res.status(404).json({ success: false, message: "Rental vehicle not found" });
      }
      
      res.json({ success: true, vehicle });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental vehicle" });
    }
  });

  app.get("/api/rental/locations", requireAuth, async (req, res) => {
    try {
      const filters = req.query.city || req.query.isPickupPoint !== undefined || req.query.isDropoffPoint !== undefined
        ? {
            city: req.query.city as string | undefined,
            isPickupPoint: req.query.isPickupPoint === 'true' ? 1 : req.query.isPickupPoint === 'false' ? 0 : undefined,
            isDropoffPoint: req.query.isDropoffPoint === 'true' ? 1 : req.query.isDropoffPoint === 'false' ? 0 : undefined
          }
        : undefined;
      const locations = await storage.getRentalLocations(filters);
      res.json({ success: true, locations });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental locations" });
    }
  });

  app.get("/api/rental/locations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const location = await storage.getRentalLocation(id);
      
      if (!location) {
        return res.status(404).json({ success: false, message: "Rental location not found" });
      }
      
      res.json({ success: true, location });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental location" });
    }
  });

  app.get("/api/rental/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await storage.getRentalBookingsByUser(userId);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental bookings" });
    }
  });

  app.get("/api/rental/bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const booking = await storage.getRentalBooking(id);
      
      if (!booking) {
        return res.status(404).json({ success: false, message: "Rental booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rental booking" });
    }
  });

  app.post("/api/rental/bookings", requireAuth, createRateLimiter('BOOKING_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalBookingSchema.parse({ 
        ...req.body, 
        userId
      });
      
      const booking = await storage.createRentalBooking(data);
      res.status(201).json({ success: true, booking, message: "Rental booking created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create rental booking" 
      });
    }
  });

  app.patch("/api/rental/bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getRentalBooking(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Rental booking not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }
      
      let updateData: any = insertRentalBookingSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const booking = await storage.updateRentalBooking(id, updateData);
      res.json({ success: true, booking, message: "Rental booking updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update rental booking" 
      });
    }
  });

  app.get("/api/rental/reviews/vehicle/:vehicleId", requireAuth, async (req, res) => {
    try {
      const { vehicleId } = z.object({ vehicleId: z.string().min(1) }).parse(req.params);
      const reviews = await storage.getRentalReviewsByVehicle(vehicleId);
      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch vehicle reviews" });
    }
  });

  app.post("/api/rental/reviews", requireAuth, createRateLimiter('REVIEW_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalReviewSchema.parse({ 
        ...req.body, 
        userId
      });
      
      const review = await storage.createRentalReview(data);
      res.status(201).json({ success: true, review, message: "Review created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create review" 
      });
    }
  });

  // ======================
  // HOTEL BOOKING ROUTES
  // ======================

  app.get("/api/hotels", requireAuth, async (req, res) => {
    try {
      const filters = hotelFiltersSchema.parse(req.query);
      const hotels = await storage.getHotels({
        city: filters.city,
        propertyType: filters.propertyType,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      });
      res.json({ success: true, hotels });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch hotels" });
    }
  });

  app.get("/api/hotels/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const hotel = await storage.getHotel(id);
      
      if (!hotel) {
        return res.status(404).json({ success: false, message: "Hotel not found" });
      }
      
      res.json({ success: true, hotel });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch hotel" });
    }
  });

  app.get("/api/hotels/:id/rooms", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const rooms = await storage.getHotelRoomsByHotel(id);
      res.json({ success: true, rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch rooms" });
    }
  });

  app.get("/api/hotel-rooms/:roomId/inventory", requireAuth, async (req, res) => {
    try {
      const { roomId } = z.object({ roomId: z.string().min(1) }).parse(req.params);
      const { startDate, endDate } = roomInventoryQuerySchema.parse(req.query);
      
      const inventory = await storage.getHotelRoomInventoryRange(
        roomId,
        startDate,
        endDate
      );
      res.json({ success: true, inventory });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch room inventory" });
    }
  });

  app.get("/api/hotel-bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await storage.getHotelBookingsByUser(userId);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/hotel-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const booking = await storage.getHotelBooking(id);
      
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
      }
      
      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
  });

  app.post("/api/hotel-bookings", requireAuth, createRateLimiter('BOOKING_CREATION'), async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookingReference = `HTL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const data = insertHotelBookingSchema.parse({ 
        ...req.body, 
        userId,
        bookingReference
      });
      
      const booking = await storage.createHotelBooking(data);
      res.status(201).json({ success: true, booking, message: "Booking created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create booking" 
      });
    }
  });

  app.patch("/api/hotel-bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getHotelBooking(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }
      
      let updateData: any = insertHotelBookingSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const booking = await storage.updateHotelBooking(id, updateData);
      res.json({ success: true, booking, message: "Booking updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update booking" 
      });
    }
  });

  app.get("/api/hotels/:id/reviews", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const reviews = await storage.getHotelReviewsByHotel(id);
      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/hotels/:id/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const data = insertHotelReviewSchema.parse({ 
        ...req.body, 
        userId,
        hotelId: id
      });
      
      const review = await storage.createHotelReview(data);
      res.status(201).json({ success: true, review, message: "Review submitted successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create review" 
      });
    }
  });

  // ============================================================================
  // RENTAL BOOKING ROUTES
  // ============================================================================

  const rentalFiltersSchema = z.object({
    vehicleType: z.string().optional(),
    city: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional()
  });

  app.get("/api/rental/vehicles", requireAuth, async (req, res) => {
    try {
      const filters = rentalFiltersSchema.parse(req.query);
      const vehicles = await storage.getRentalVehicles(filters);
      res.json({ success: true, vehicles });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/rental/vehicles/:id", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const vehicle = await storage.getRentalVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ success: false, message: "Vehicle not found" });
      }
      res.json({ success: true, vehicle });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch vehicle" });
    }
  });

  app.get("/api/rental/locations", requireAuth, async (req, res) => {
    try {
      const filters = z.object({
        city: z.string().optional(),
        isPickupPoint: z.coerce.number().optional(),
        isDropoffPoint: z.coerce.number().optional()
      }).parse(req.query);
      const locations = await storage.getRentalLocations(filters);
      res.json({ success: true, locations });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch locations" });
    }
  });

  app.post("/api/rental/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalBookingSchema.parse({ ...req.body, userId });
      const booking = await storage.createRentalBooking(data);
      res.status(201).json({ success: true, booking, message: "Booking created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create booking" 
      });
    }
  });

  app.get("/api/rental/bookings/user", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bookings = await storage.getRentalBookingsByUser(userId);
      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/rental/bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const booking = await storage.getRentalBooking(id);
      
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
      }

      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch booking" });
    }
  });

  app.patch("/api/rental/bookings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getRentalBooking(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
      }

      let updateData: any = insertRentalBookingSchema.partial().omit({ userId: true }).parse(req.body);
      // Convert totalAmount to string if it's a number
      if (updateData.totalAmount !== undefined && typeof updateData.totalAmount === 'number') {
        updateData.totalAmount = updateData.totalAmount.toString();
      }
      const booking = await storage.updateRentalBooking(id, updateData);
      res.json({ success: true, booking, message: "Booking updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update booking" 
      });
    }
  });

  app.post("/api/rental/trips", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalTripSchema.parse({ ...req.body, userId });
      
      // Verify booking ownership before creating trip
      const booking = await storage.getRentalBooking(data.bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to create trip for this booking" });
      }

      const trip = await storage.createRentalTrip(data);
      res.status(201).json({ success: true, trip, message: "Trip created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create trip" 
      });
    }
  });

  app.get("/api/rental/trips/booking/:bookingId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { bookingId } = z.object({ bookingId: z.string() }).parse(req.params);
      const trip = await storage.getRentalTripByBooking(bookingId);
      
      if (trip && trip.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this trip" });
      }

      res.json({ success: true, trip });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch trip" });
    }
  });

  app.patch("/api/rental/trips/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = idParamsSchema.parse(req.params);
      const existing = await storage.getRentalTrip(id);
      
      if (!existing) {
        return res.status(404).json({ success: false, message: "Trip not found" });
      }
      
      if (existing.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this trip" });
      }

      const updateData = insertRentalTripSchema.partial().omit({ userId: true, bookingId: true }).parse(req.body);
      const trip = await storage.updateRentalTrip(id, updateData);
      res.json({ success: true, trip, message: "Trip updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update trip" 
      });
    }
  });

  app.post("/api/rental/checkpoints", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalTripCheckpointSchema.parse(req.body);
      
      // Verify trip ownership before creating checkpoint
      const trip = await storage.getRentalTrip(data.tripId);
      if (!trip) {
        return res.status(404).json({ success: false, message: "Trip not found" });
      }
      if (trip.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to create checkpoint for this trip" });
      }

      const checkpoint = await storage.createRentalTripCheckpoint(data);
      res.status(201).json({ success: true, checkpoint, message: "Checkpoint created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create checkpoint" 
      });
    }
  });

  app.get("/api/rental/checkpoints/:tripId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { tripId } = z.object({ tripId: z.string() }).parse(req.params);
      const trip = await storage.getRentalTrip(tripId);
      
      if (trip && trip.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view checkpoints" });
      }

      const checkpoints = await storage.getRentalTripCheckpoints(tripId);
      res.json({ success: true, checkpoints });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch checkpoints" });
    }
  });

  app.post("/api/rental/documents", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalDocumentSchema.parse({ ...req.body, userId });
      
      // Verify booking ownership before creating document
      const booking = await storage.getRentalBooking(data.bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to upload documents for this booking" });
      }

      const document = await storage.createRentalDocument(data);
      res.status(201).json({ success: true, document, message: "Document uploaded successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to upload document" 
      });
    }
  });

  app.get("/api/rental/documents/:bookingId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { bookingId } = z.object({ bookingId: z.string() }).parse(req.params);
      const booking = await storage.getRentalBooking(bookingId);
      
      if (booking && booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view documents" });
      }

      const documents = await storage.getRentalDocumentsByBooking(bookingId);
      res.json({ success: true, documents });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch documents" });
    }
  });

  app.post("/api/rental/inspections", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalVehicleInspectionSchema.parse({ ...req.body, userId });
      
      // Verify booking ownership before creating inspection
      const booking = await storage.getRentalBooking(data.bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to create inspection for this booking" });
      }

      const inspection = await storage.createRentalInspection(data);
      res.status(201).json({ success: true, inspection, message: "Inspection created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create inspection" 
      });
    }
  });

  app.get("/api/rental/inspections/:bookingId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { bookingId } = z.object({ bookingId: z.string() }).parse(req.params);
      const booking = await storage.getRentalBooking(bookingId);
      
      if (booking && booking.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view inspections" });
      }

      const inspections = await storage.getRentalInspectionsByBooking(bookingId);
      res.json({ success: true, inspections });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch inspections" });
    }
  });

  app.get("/api/rental/vehicles/:id/reviews", requireAuth, async (req, res) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const reviews = await storage.getRentalReviewsByVehicle(id);
      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/rental/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = insertRentalReviewSchema.parse({ ...req.body, userId });
      const review = await storage.createRentalReview(data);
      res.status(201).json({ success: true, review, message: "Review submitted successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create review" 
      });
    }
  });

  // TravelVIP Routes
  app.get("/api/travelvip/membership", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const membership = await storage.getTravelVipMembershipByUser(userId);
      res.json({ success: true, membership });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch membership" });
    }
  });

  app.post("/api/travelvip/subscribe", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { planType, autoRenewal } = req.body;
      
      const prices = {
        monthly: 299,
        quarterly: 799,
        annual: 2499
      };

      const durations = {
        monthly: 30,
        quarterly: 90,
        annual: 365
      };

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durations[planType as keyof typeof durations]);

      const membershipData = {
        userId,
        planType,
        status: 'active',
        startDate: new Date(),
        endDate,
        price: prices[planType as keyof typeof prices].toString(),
        autoRenewal: autoRenewal ? 1 : 0
      };

      const membership = await storage.createTravelVipMembership(membershipData);
      
      const transactionData = {
        userId,
        membershipId: membership.id,
        transactionType: 'subscription',
        amount: membershipData.price,
        status: 'success',
        paymentMethod: 'upi'
      };
      await storage.createTravelVipTransaction(transactionData);

      res.status(201).json({ success: true, membership, message: "Subscription successful" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to subscribe" 
      });
    }
  });

  app.get("/api/travelvip/benefits", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const benefits = await storage.getTravelVipBenefitsByUser(userId);
      res.json({ success: true, benefits });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch benefits" });
    }
  });

  app.post("/api/travelvip/benefits/use", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const membership = await storage.getTravelVipMembershipByUser(userId);
      if (!membership || membership.status !== 'active') {
        return res.status(403).json({ success: false, message: "No active membership found" });
      }

      const data = { ...req.body, userId, membershipId: membership.id };
      const benefitUsage = await storage.createTravelVipBenefitUsage(data);
      res.status(201).json({ success: true, benefitUsage });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to record benefit usage" 
      });
    }
  });

  app.get("/api/travelvip/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const transactions = await storage.getTravelVipTransactionsByUser(userId);
      res.json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/travelvip/cancel", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const membership = await storage.getTravelVipMembershipByUser(userId);
      if (!membership) {
        return res.status(404).json({ success: false, message: "No membership found" });
      }

      await storage.updateTravelVipMembership(membership.id, { status: 'cancelled', autoRenewal: 0 });
      res.json({ success: true, message: "Membership cancelled successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to cancel membership" 
      });
    }
  });

  // Credit UPI routes
  app.get("/api/credit-upi/account", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCreditUpiAccountByUser(userId);
      res.json({ success: true, account });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch Credit UPI account" });
    }
  });

  app.post("/api/credit-upi/activate", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const existingAccount = await storage.getCreditUpiAccountByUser(userId);
      if (existingAccount) {
        return res.status(400).json({ success: false, message: "Credit UPI account already exists" });
      }

      const { upiPin } = req.body;
      if (!upiPin || upiPin.length !== 6) {
        return res.status(400).json({ success: false, message: "Valid 6-digit UPI PIN is required" });
      }

      const creditLimit = user.creditScore && user.creditScore >= 730 
        ? "50000" 
        : user.creditScore && user.creditScore >= 650 
        ? "25000" 
        : "10000";

      const accountData = {
        userId,
        upiId: `${user.phone}@instapay`,
        creditLimit,
        availableLimit: creditLimit,
        usedLimit: "0",
        outstandingAmount: "0",
        upiPin,
        isActivated: 1,
        activatedAt: new Date(),
        status: 'active'
      };

      const account = await storage.createCreditUpiAccount(accountData);
      res.status(201).json({ success: true, account, message: "Credit UPI activated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to activate Credit UPI" 
      });
    }
  });

  app.post("/api/credit-upi/transaction", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCreditUpiAccountByUser(userId);
      if (!account || !account.isActivated) {
        return res.status(403).json({ success: false, message: "Credit UPI account not activated" });
      }

      const { merchantName, merchantUpi, amount, description, category } = req.body;
      
      if (!merchantName || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid transaction details" });
      }

      const availableLimit = parseFloat(account.availableLimit || "0");
      if (amount > availableLimit) {
        return res.status(400).json({ success: false, message: "Insufficient credit limit" });
      }

      const newUsedLimit = parseFloat(account.usedLimit || "0") + amount;
      const newAvailableLimit = parseFloat(account.creditLimit || "0") - newUsedLimit;
      const newOutstanding = parseFloat(account.outstandingAmount || "0") + amount;

      const transactionData = {
        accountId: account.id,
        userId,
        merchantName,
        merchantUpi: merchantUpi || null,
        amount: amount.toString(),
        transactionId: `CUPI${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        description: description || `Payment to ${merchantName}`,
        category: category || 'shopping',
        status: 'success',
        balanceBefore: account.availableLimit,
        balanceAfter: newAvailableLimit.toString()
      };

      const transaction = await storage.createCreditUpiTransaction(transactionData);
      
      await storage.updateCreditUpiAccount(account.id, {
        usedLimit: newUsedLimit.toString(),
        availableLimit: newAvailableLimit.toString(),
        outstandingAmount: newOutstanding.toString()
      });

      res.status(201).json({ success: true, transaction, message: "Transaction successful" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Transaction failed" 
      });
    }
  });

  app.get("/api/credit-upi/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const transactions = await storage.getCreditUpiTransactionsByUser(userId);
      res.json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/credit-upi/transaction/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const transaction = await storage.getCreditUpiTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }

      if (transaction.userId !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized to view this transaction" });
      }

      res.json({ success: true, transaction });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/credit-upi/repayment", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCreditUpiAccountByUser(userId);
      if (!account) {
        return res.status(404).json({ success: false, message: "Credit UPI account not found" });
      }

      const { amount, repaymentType, paymentMethod } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid repayment amount" });
      }

      const outstandingAmount = parseFloat(account.outstandingAmount || "0");
      if (amount > outstandingAmount) {
        return res.status(400).json({ success: false, message: "Repayment amount exceeds outstanding balance" });
      }

      const newOutstanding = outstandingAmount - amount;
      const newUsedLimit = parseFloat(account.usedLimit || "0") - amount;
      const newAvailableLimit = parseFloat(account.creditLimit || "0") - newUsedLimit;

      const repaymentData = {
        accountId: account.id,
        userId,
        amount: amount.toString(),
        repaymentType: repaymentType || 'partial',
        paymentMethod: paymentMethod || 'upi',
        transactionId: `REPR${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'success',
        principalAmount: amount.toString(),
        interestAmount: "0",
        latePaymentCharges: "0",
        description: `Repayment of ₹${amount}`
      };

      const repayment = await storage.createCreditUpiRepayment(repaymentData);
      
      await storage.updateCreditUpiAccount(account.id, {
        outstandingAmount: newOutstanding.toString(),
        usedLimit: newUsedLimit.toString(),
        availableLimit: newAvailableLimit.toString()
      });

      res.status(201).json({ success: true, repayment, message: "Repayment successful" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Repayment failed" 
      });
    }
  });

  app.get("/api/credit-upi/repayments", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const repayments = await storage.getCreditUpiRepaymentsByUser(userId);
      res.json({ success: true, repayments });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch repayments" });
    }
  });

  app.get("/api/credit-upi/bills", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const bills = await storage.getCreditUpiBillsByUser(userId);
      res.json({ success: true, bills });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bills" });
    }
  });

  app.get("/api/credit-upi/current-bill", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCreditUpiAccountByUser(userId);
      if (!account) {
        return res.json({ success: true, bill: null });
      }

      const bill = await storage.getCurrentCreditUpiBill(account.id);
      res.json({ success: true, bill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch current bill" });
    }
  });

  // Family UPI routes
  app.get("/api/family-upi/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const accounts = await storage.getFamilyUpiAccountsByUser(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch family UPI accounts" });
    }
  });

  app.post("/api/family-upi/accounts", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const existingAccounts = await storage.getFamilyUpiAccountsByUser(userId);
      if (existingAccounts.length >= 3) {
        return res.status(400).json({ success: false, message: "Maximum 3 family UPI accounts allowed" });
      }

      const accountData = {
        userId,
        ...req.body,
        isActive: 1
      };

      const account = await storage.createFamilyUpiAccount(accountData);
      
      // Auto-add user as owner member
      const memberData = {
        familyAccountId: account.id,
        memberId: userId,
        memberName: "Account Owner",
        role: "owner" as const,
        canApprove: 1,
        canView: 1,
        isActive: 1
      };
      
      await storage.createFamilyUpiMember(memberData);
      
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create family UPI account" 
      });
    }
  });

  app.patch("/api/family-upi/accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const account = await storage.getFamilyUpiAccount(id);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to update this account" });
      }

      const updatedAccount = await storage.updateFamilyUpiAccount(id, req.body);
      res.json(updatedAccount);
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update account" 
      });
    }
  });

  app.delete("/api/family-upi/accounts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const account = await storage.getFamilyUpiAccount(id);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this account" });
      }

      await storage.deleteFamilyUpiAccount(id);
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete account" 
      });
    }
  });

  app.get("/api/family-upi/members/:accountId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { accountId } = req.params;
      const account = await storage.getFamilyUpiAccount(accountId);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view members" });
      }

      const members = await storage.getFamilyUpiMembersByAccount(accountId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch members" });
    }
  });

  app.post("/api/family-upi/members", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { familyAccountId } = req.body;
      const account = await storage.getFamilyUpiAccount(familyAccountId);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to add members" });
      }

      const memberData = {
        ...req.body,
        isActive: 1
      };

      const member = await storage.createFamilyUpiMember(memberData);
      
      // Update member count
      const members = await storage.getFamilyUpiMembersByAccount(familyAccountId);
      await storage.updateFamilyUpiAccount(familyAccountId, { memberCount: members.length });
      
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to add member" 
      });
    }
  });

  app.delete("/api/family-upi/members/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const member = await storage.getFamilyUpiMember(id);
      
      if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
      }

      const account = await storage.getFamilyUpiAccount(member.familyAccountId);
      if (!account || account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to remove this member" });
      }

      if (member.role === 'owner') {
        return res.status(400).json({ success: false, message: "Cannot remove account owner" });
      }

      await storage.deleteFamilyUpiMember(id);
      
      // Update member count
      const members = await storage.getFamilyUpiMembersByAccount(member.familyAccountId);
      await storage.updateFamilyUpiAccount(member.familyAccountId, { memberCount: members.length });
      
      res.json({ success: true, message: "Member removed successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to remove member" 
      });
    }
  });

  // Family UPI Detail & Analytics routes
  app.get("/api/family-upi/accounts/:id/details", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const details = await storage.getFamilyUpiAccountDetails(id);
      
      if (!details) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (details.account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this account" });
      }

      res.json(details);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch account details" });
    }
  });

  app.get("/api/family-upi/accounts/:id/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const account = await storage.getFamilyUpiAccount(id);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view transactions" });
      }

      const transactions = await storage.getFamilyUpiTransactionsWithMembers(id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/family-upi/accounts/:id/analytics", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.params;
      const account = await storage.getFamilyUpiAccount(id);
      
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }

      if (account.userId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view analytics" });
      }

      const analytics = await storage.getFamilyUpiMemberAnalytics(id);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
  });

  // Cash Park routes
  app.get("/api/cash-park/account", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCashParkAccountByUser(userId);
      res.json({ success: true, account });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch Cash Park account" });
    }
  });

  app.post("/api/cash-park/activate", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const existingAccount = await storage.getCashParkAccountByUser(userId);
      if (existingAccount) {
        return res.status(400).json({ success: false, message: "Cash Park account already exists" });
      }

      const { sweepThreshold, fdIncrementAmount } = req.body;
      
      const defaultSweepThreshold = 10000;
      const finalSweepThreshold = sweepThreshold || defaultSweepThreshold;
      
      if (finalSweepThreshold < 10000) {
        return res.status(400).json({ success: false, message: "Minimum threshold is ₹10,000" });
      }

      const accountData = {
        userId,
        sweepThreshold: finalSweepThreshold.toString(),
        fdIncrementAmount: (fdIncrementAmount || 1000).toString(),
        isActive: 1,
        currentInterestRate: "7.25",
        totalParkedAmount: "0",
        totalInterestEarned: "0",
        activeFdCount: 0,
        minimumTenureDays: 7,
        autoSweepEnabled: 1,
        notificationsEnabled: 1
      };

      const account = await storage.createCashParkAccount(accountData);
      res.status(201).json({ success: true, account, message: "Cash Park activated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to activate Cash Park" 
      });
    }
  });

  app.post("/api/cash-park/deposit", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCashParkAccountByUser(userId);
      if (!account) {
        return res.status(404).json({ success: false, message: "Cash Park account not found" });
      }

      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid deposit amount" });
      }

      const currentParked = parseFloat(account.totalParkedAmount || "0");
      const newTotal = currentParked + amount;

      const transactionData = {
        accountId: account.id,
        userId,
        transactionType: 'deposit',
        amount: amount.toString(),
        postBalance: newTotal.toString(),
        description: `Deposit of ₹${amount}`,
        transactionId: `DEP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'success'
      };

      const transaction = await storage.createCashParkTransaction(transactionData);
      
      await storage.updateCashParkAccount(account.id, {
        totalParkedAmount: newTotal.toString(),
        lastSweepDate: new Date()
      });

      res.status(201).json({ success: true, transaction, message: "Deposit successful" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Deposit failed" 
      });
    }
  });

  app.post("/api/cash-park/withdraw", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCashParkAccountByUser(userId);
      if (!account) {
        return res.status(404).json({ success: false, message: "Cash Park account not found" });
      }

      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid withdrawal amount" });
      }

      const currentParked = parseFloat(account.totalParkedAmount || "0");
      if (amount > currentParked) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
      }

      const newTotal = currentParked - amount;

      const transactionData = {
        accountId: account.id,
        userId,
        transactionType: 'withdrawal',
        amount: amount.toString(),
        postBalance: newTotal.toString(),
        description: `Withdrawal of ₹${amount}`,
        transactionId: `WTH${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'success'
      };

      const transaction = await storage.createCashParkTransaction(transactionData);
      
      await storage.updateCashParkAccount(account.id, {
        totalParkedAmount: newTotal.toString(),
        lastSweepDate: new Date()
      });

      res.status(201).json({ success: true, transaction, message: "Withdrawal successful" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Withdrawal failed" 
      });
    }
  });

  app.post("/api/cash-park/settings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCashParkAccountByUser(userId);
      if (!account) {
        return res.status(404).json({ success: false, message: "Cash Park account not found" });
      }

      const { sweepThreshold, fdIncrementAmount, autoSweepEnabled, notificationsEnabled } = req.body;

      const updates: any = {};
      if (sweepThreshold !== undefined) {
        if (sweepThreshold < 10000) {
          return res.status(400).json({ success: false, message: "Minimum threshold is ₹10,000" });
        }
        updates.sweepThreshold = sweepThreshold.toString();
      }
      if (fdIncrementAmount !== undefined) {
        if (fdIncrementAmount < 100) {
          return res.status(400).json({ success: false, message: "Minimum increment is ₹100" });
        }
        updates.fdIncrementAmount = fdIncrementAmount.toString();
      }
      if (autoSweepEnabled !== undefined) updates.autoSweepEnabled = autoSweepEnabled;
      if (notificationsEnabled !== undefined) updates.notificationsEnabled = notificationsEnabled;

      const updated = await storage.updateCashParkAccount(account.id, updates);
      res.json({ success: true, account: updated, message: "Settings updated successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update settings" 
      });
    }
  });

  app.get("/api/cash-park/fd-units", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const fdUnits = await storage.getCashParkFdUnitsByUser(userId);
      res.json({ success: true, fdUnits });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch FD units" });
    }
  });

  app.get("/api/cash-park/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const transactions = await storage.getCashParkTransactionsByUser(userId);
      res.json({ success: true, transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  // Cash Park Jars routes
  app.get("/api/cash-park/jars", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const jars = await storage.getCashParkJarsByUser(userId);
      res.json({ success: true, jars: jars || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jars" });
    }
  });

  app.get("/api/cash-park/jars/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const jarId = req.params.id;
      const jar = await storage.getCashParkJarById(jarId);

      if (!jar || jar.userId !== userId) {
        return res.status(404).json({ success: false, message: "Jar not found" });
      }

      res.json({ success: true, jar });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jar" });
    }
  });

  app.post("/api/cash-park/jars/create", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const account = await storage.getCashParkAccountByUser(userId);
      if (!account) {
        return res.status(404).json({ success: false, message: "Cash Park account not found. Please activate Cash Park first." });
      }

      const { name, goalAmount, currentBalance } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Jar name is required" });
      }

      const jarData = {
        accountId: account.id,
        userId,
        name: name.trim(),
        currentBalance: currentBalance ? currentBalance.toString() : "0",
        goalAmount: goalAmount ? goalAmount.toString() : null,
        interestEarned: "0"
      };

      const jar = await storage.createCashParkJar(jarData);
      res.status(201).json({ success: true, jar, message: "Jar created successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create jar" 
      });
    }
  });

  app.delete("/api/cash-park/jars/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const jarId = req.params.id;
      const jar = await storage.getCashParkJarById(jarId);

      if (!jar || jar.userId !== userId) {
        return res.status(404).json({ success: false, message: "Jar not found" });
      }

      // Check if jar has balance
      if (parseFloat(jar.currentBalance || "0") > 0) {
        return res.status(400).json({ success: false, message: "Cannot delete jar with balance. Please withdraw all funds first." });
      }

      const deleted = await storage.deleteCashParkJar(jarId);
      if (!deleted) {
        return res.status(500).json({ success: false, message: "Failed to delete jar" });
      }

      res.json({ success: true, message: "Jar deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete jar" 
      });
    }
  });

  app.get("/api/cash-park/jars/:id/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const jarId = req.params.id;
      
      // Verify jar belongs to user
      const jar = await storage.getCashParkJarById(jarId);
      if (!jar || jar.userId !== userId) {
        return res.status(404).json({ success: false, message: "Jar not found" });
      }

      const transactions = await storage.getCashParkTransactionsByJar(jarId);
      res.json({ success: true, transactions: transactions || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jar transactions" });
    }
  });

  // Funds Management endpoints
  app.get("/api/funds/summary", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let wallet = await storage.getUserWallet(userId);
      
      // Create wallet with initial balance if it doesn't exist
      if (!wallet) {
        wallet = await storage.createUserWallet({
          userId,
          totalBalance: "1000000",
          availableBalance: "1000000",
          lockedBalance: "0",
          currency: "INR"
        });
      }

      res.json({
        wallet: {
          totalBalance: wallet.totalBalance,
          availableBalance: wallet.availableBalance,
          lockedBalance: wallet.lockedBalance,
          currency: wallet.currency
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet summary" });
    }
  });

  app.post("/api/funds/add", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, method } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      let wallet = await storage.getUserWallet(userId);
      
      // Create wallet if it doesn't exist
      if (!wallet) {
        wallet = await storage.createUserWallet({
          userId,
          totalBalance: "0",
          availableBalance: "0",
          lockedBalance: "0",
          currency: "INR"
        });
      }

      // Update wallet balance
      const newTotalBalance = parseFloat(wallet.totalBalance || "0") + amount;
      const newAvailableBalance = parseFloat(wallet.availableBalance || "0") + amount;

      await storage.updateUserWallet(userId, {
        totalBalance: newTotalBalance.toString(),
        availableBalance: newAvailableBalance.toString()
      });

      // Create fund transaction record
      await storage.createFundTransaction({
        userId,
        transactionType: "credit",
        amount: amount.toString(),
        balanceBefore: wallet.availableBalance || "0",
        balanceAfter: newAvailableBalance.toString(),
        description: "Funds added via " + (method || "UPI"),
        paymentMethod: method || "upi",
        status: "completed"
      });

      res.json({ 
        success: true, 
        message: "Funds added successfully",
        newBalance: newAvailableBalance.toString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to add funds" });
    }
  });

  app.post("/api/funds/withdraw", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, method } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const wallet = await storage.getUserWallet(userId);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const availableBalance = parseFloat(wallet.availableBalance || "0");
      
      if (availableBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Update wallet balance
      const newTotalBalance = parseFloat(wallet.totalBalance || "0") - amount;
      const newAvailableBalance = availableBalance - amount;

      await storage.updateUserWallet(userId, {
        totalBalance: newTotalBalance.toString(),
        availableBalance: newAvailableBalance.toString()
      });

      // Create fund transaction record
      await storage.createFundTransaction({
        userId,
        transactionType: "debit",
        amount: amount.toString(),
        balanceBefore: wallet.availableBalance || "0",
        balanceAfter: newAvailableBalance.toString(),
        description: "Funds withdrawn via " + (method || "UPI"),
        paymentMethod: method || "upi",
        status: "completed"
      });

      res.json({ 
        success: true, 
        message: "Withdrawal successful",
        newBalance: newAvailableBalance.toString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to withdraw funds" });
    }
  });

  app.get("/api/funds/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const transactions = await storage.getFundTransactionsByUser(userId);
      
      // Map transactions to frontend format
      const formattedTransactions = transactions.map(txn => ({
        id: txn.id,
        type: txn.transactionType === "credit" ? "deposit" : "withdrawal",
        amount: parseFloat(txn.amount),
        status: txn.status,
        method: txn.paymentMethod || "UPI",
        timestamp: txn.createdAt?.toISOString() || new Date().toISOString()
      }));

      res.json(formattedTransactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ShareWise routes - expense splitting and group management
  
  // Configure multer for file uploads
  const uploadsDir = path.join(process.cwd(), "uploads", "receipts");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const receiptStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `receipt-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  const uploadReceipt = multer({
    storage: receiptStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
      }
    }
  });

  // Receipt upload endpoint
  app.post("/api/sharewise/upload-receipt", requireAuth, uploadReceipt.single('receipt'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileUrl = `/uploads/receipts/${req.file.filename}`;
      const fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image';

      res.json({
        url: fileUrl,
        type: fileType,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading receipt:", error);
      res.status(500).json({ message: "Failed to upload receipt" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }, (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });
  
  // Group operations
  app.get("/api/sharewise/groups", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const groups = await storage.listSharewiseGroupsByUser(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.get("/api/sharewise/groups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const group = await storage.getSharewiseGroupWithMembers(id);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(group);
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ message: "Failed to fetch group" });
    }
  });

  app.post("/api/sharewise/groups", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validation = insertSharewiseGroupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid group data", errors: validation.error.errors });
      }
      
      const group = await storage.createSharewiseGroup(validation.data);
      
      // Add creator as admin member
      await storage.addSharewiseGroupMember({
        groupId: group.id,
        userId,
        role: "admin"
      });
      
      const groupWithMembers = await storage.getSharewiseGroupWithMembers(group.id);
      res.json(groupWithMembers);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.patch("/api/sharewise/groups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const group = await storage.updateSharewiseGroup(id, updates);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(group);
    } catch (error) {
      console.error("Error updating group:", error);
      res.status(500).json({ message: "Failed to update group" });
    }
  });

  app.delete("/api/sharewise/groups/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSharewiseGroup(id);
      
      if (!success) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "Failed to delete group" });
    }
  });

  // Member operations
  app.get("/api/sharewise/groups/:groupId/members", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const members = await storage.getSharewiseGroupMembers(groupId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.post("/api/sharewise/groups/:groupId/members", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const validation = insertSharewiseGroupMemberSchema.safeParse({ ...req.body, groupId });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid member data", errors: validation.error.errors });
      }
      
      const member = await storage.addSharewiseGroupMember(validation.data);
      res.json(member);
    } catch (error) {
      console.error("Error adding member:", error);
      res.status(500).json({ message: "Failed to add member" });
    }
  });

  app.delete("/api/sharewise/groups/:groupId/members/:userId", requireAuth, async (req, res) => {
    try {
      const { groupId, userId } = req.params;
      const success = await storage.removeSharewiseGroupMember(groupId, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing member:", error);
      res.status(500).json({ message: "Failed to remove member" });
    }
  });

  // Expense operations
  app.get("/api/sharewise/groups/:groupId/expenses", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const expenses = await storage.listSharewiseExpensesByGroup(groupId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  // Get all expenses from all groups for the current user (must come before /:id route)
  app.get("/api/sharewise/expenses/all", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get all groups the user is a member of
      const groups = await storage.listSharewiseGroupsByUser(userId);
      
      // Fetch expenses from all groups
      const allExpenses = [];
      for (const group of groups) {
        const expenses = await storage.listSharewiseExpensesByGroup(group.id);
        // Add group name and split count to each expense
        for (const expense of expenses) {
          const expenseWithSplits = await storage.getSharewiseExpenseWithSplits(expense.id);
          allExpenses.push({
            ...expenseWithSplits,
            groupName: group.name,
            splitCount: expenseWithSplits?.splits?.length || 0
          });
        }
      }
      
      // Sort by date (most recent first)
      allExpenses.sort((a, b) => {
        const dateA = a.occurredAt ? new Date(a.occurredAt).getTime() : 0;
        const dateB = b.occurredAt ? new Date(b.occurredAt).getTime() : 0;
        return dateB - dateA;
      });
      
      res.json(allExpenses);
    } catch (error) {
      console.error("Error fetching all expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.get("/api/sharewise/expenses/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await storage.getSharewiseExpenseWithSplits(id);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      console.error("Error fetching expense:", error);
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });

  app.post("/api/sharewise/groups/:groupId/expenses", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { expense, splits } = req.body;
      
      const expenseValidation = insertSharewiseExpenseSchema.safeParse({ ...expense, groupId, paidBy: userId });
      if (!expenseValidation.success) {
        return res.status(400).json({ message: "Invalid expense data", errors: expenseValidation.error.errors });
      }
      
      const splitsValidation = z.array(insertSharewiseExpenseSplitSchema).safeParse(splits);
      if (!splitsValidation.success) {
        return res.status(400).json({ message: "Invalid splits data", errors: splitsValidation.error.errors });
      }
      
      const createdExpense = await storage.createSharewiseExpense(expenseValidation.data, splitsValidation.data);
      res.json(createdExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.delete("/api/sharewise/expenses/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSharewiseExpense(id);
      
      if (!success) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  app.patch("/api/sharewise/expenses/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { updateSharewiseExpenseSchema } = await import("@shared/schema");
      const validation = updateSharewiseExpenseSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid expense data", errors: validation.error.errors });
      }
      
      // Convert occurredAt string to Date if present
      const updateData: any = { ...validation.data };
      if (updateData.occurredAt && typeof updateData.occurredAt === 'string') {
        updateData.occurredAt = new Date(updateData.occurredAt);
      }
      
      const expense = await storage.updateSharewiseExpense(id, updateData);
      
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      res.json(expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  // Activity operations
  app.get("/api/sharewise/groups/:groupId/activity", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const activity = await storage.listSharewiseActivityByGroup(groupId);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Settlement operations
  app.get("/api/sharewise/groups/:groupId/settlements", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const settlements = await storage.listSharewiseSettlementsByGroup(groupId);
      res.json(settlements);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      res.status(500).json({ message: "Failed to fetch settlements" });
    }
  });

  app.post("/api/sharewise/groups/:groupId/settlements", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const validation = insertSharewiseSettlementSchema.safeParse({ ...req.body, groupId });
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid settlement data", errors: validation.error.errors });
      }
      
      const settlement = await storage.createSharewiseSettlement(validation.data);
      res.json(settlement);
    } catch (error) {
      console.error("Error creating settlement:", error);
      res.status(500).json({ message: "Failed to create settlement" });
    }
  });

  // Analytics and balance operations
  app.get("/api/sharewise/groups/:groupId/balances", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const balances = await storage.computeSharewiseGroupBalances(groupId);
      res.json(balances);
    } catch (error) {
      console.error("Error computing balances:", error);
      res.status(500).json({ message: "Failed to compute balances" });
    }
  });

  app.get("/api/sharewise/groups/:groupId/settlement-suggestions", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const suggestions = await storage.generateSharewiseSettlementSuggestions(groupId);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating settlement suggestions:", error);
      res.status(500).json({ message: "Failed to generate settlement suggestions" });
    }
  });

  app.get("/api/sharewise/groups/:groupId/analytics", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const analytics = await storage.getSharewiseGroupAnalytics(groupId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/sharewise/groups/:groupId/category-analytics", requireAuth, async (req, res) => {
    try {
      const { groupId } = req.params;
      const analytics = await storage.getSharewiseGroupAnalytics(groupId);
      res.json(analytics.categoryBreakdown || []);
    } catch (error) {
      console.error("Error fetching category analytics:", error);
      res.status(500).json({ message: "Failed to fetch category analytics" });
    }
  });

  app.post("/api/sharewise/join/:inviteCode", requireAuth, async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const group = await storage.getSharewiseGroupByInviteCode(inviteCode);
      
      if (!group) {
        return res.status(404).json({ message: "Invalid invite code" });
      }

      // Check if user is already a member
      const members = await storage.getSharewiseGroupMembers(group.id);
      const existingMember = members.find(m => m.userId === userId);
      
      if (existingMember) {
        return res.json({ message: "Already a member", group });
      }

      // Add user as member
      const member = await storage.addSharewiseGroupMember({
        groupId: group.id,
        userId,
        role: "member",
        status: "active"
      });

      res.json({ message: "Joined successfully", group, member });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

  // Coupon Mart routes - Coupon Selling, Trading & Exchange Marketplace
  
  // Get all listings with filters (coupon codes masked)
  app.get("/api/coupon-mart/listings", async (req, res) => {
    try {
      const { category, listingType, status } = req.query;
      const filters = {
        category: category as string | undefined,
        listingType: listingType as string | undefined,
        status: status as string | undefined,
      };
      const listings = await storage.getCouponMartListings(filters);
      
      // Mask coupon codes within the coupons array for public viewing
      const maskedListings = listings.map(listing => ({
        ...listing,
        coupons: Array.isArray(listing.coupons) ? (listing.coupons as any[]).map((coupon: any) => ({
          ...coupon,
          code: "•••••••"
        })) : []
      }));
      
      res.json(maskedListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  // Get single listing by ID (coupon code masked)
  app.get("/api/coupon-mart/listings/:id", optionalAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      // Ensure user has sample data if logged in
      if (userId) {
        await storage.ensureUserHasSampleCouponData(userId);
      }
      
      await storage.incrementCouponMartListingViews(id);
      const listing = await storage.getCouponMartListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Mask coupon codes within the coupons array for public viewing
      const maskedListing = {
        ...listing,
        coupons: Array.isArray(listing.coupons) ? (listing.coupons as any[]).map((coupon: any) => ({
          ...coupon,
          code: "•••••••"
        })) : []
      };
      
      res.json(maskedListing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  // Get user's listings (codes visible for own listings)
  app.get("/api/coupon-mart/my-listings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user has sample data
      await storage.ensureUserHasSampleCouponData(userId);
      
      const listings = await storage.getCouponMartListingsByUser(userId);
      
      // User can see their own coupon codes (codes remain visible for own listings)
      res.json(listings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  // Create new listing
  app.post("/api/coupon-mart/listings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Request data with new multi-coupon schema
      const requestData = {
        ...req.body,
        userId
      };
      
      // Validate request body
      const validation = insertCouponMartListingSchema.safeParse(requestData);
      
      if (!validation.success) {
        console.error("Validation errors:", JSON.stringify(validation.error.errors, null, 2));
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ 
          message: "Invalid listing data", 
          errors: validation.error.errors 
        });
      }
      
      const listing = await storage.createCouponMartListing(validation.data);
      
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Update listing
  app.patch("/api/coupon-mart/listings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const listing = await storage.getCouponMartListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updated = await storage.updateCouponMartListing(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  // Delete listing
  app.delete("/api/coupon-mart/listings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const listing = await storage.getCouponMartListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteCouponMartListing(id);
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  // Cancel listing
  app.patch("/api/coupon-mart/listings/:id/cancel", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const listing = await storage.getCouponMartListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      if (listing.status !== "active") {
        return res.status(400).json({ message: "Listing is not active" });
      }
      
      const updated = await storage.updateCouponMartListing(id, { status: "cancelled" });
      res.json(updated);
    } catch (error) {
      console.error("Error cancelling listing:", error);
      res.status(500).json({ message: "Failed to cancel listing" });
    }
  });

  // Purchase listing
  app.post("/api/coupon-mart/listings/:id/buy", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const listing = await storage.getCouponMartListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId === userId) {
        return res.status(400).json({ message: "Cannot buy your own listing" });
      }
      
      if (listing.status !== "active") {
        return res.status(400).json({ message: "Listing is not available" });
      }
      
      const transaction = await storage.createCouponMartTransaction({
        listingId: id,
        sellerId: listing.userId,
        buyerId: userId,
        transactionType: "purchase",
        amount: listing.sellingPrice || "0",
        revealedCodes: listing.coupons as any,
        status: "completed",
      });
      
      res.json(transaction);
    } catch (error) {
      console.error("Error purchasing listing:", error);
      res.status(500).json({ message: "Failed to purchase listing" });
    }
  });

  // Create trade offer
  app.post("/api/coupon-mart/listings/:id/trade-offer", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const listing = await storage.getCouponMartListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId === userId) {
        return res.status(400).json({ message: "Cannot trade with yourself" });
      }
      
      if (listing.status !== "active") {
        return res.status(400).json({ message: "Listing is not available" });
      }
      
      // Validate trade offer data
      const validation = insertCouponMartTradeOfferSchema.safeParse({
        listingId: id,
        offererId: userId,
        listingOwnerId: listing.userId,
        ...req.body,
      });
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid trade offer data", 
          errors: validation.error.errors 
        });
      }
      
      const offer = await storage.createCouponMartTradeOffer(validation.data);
      
      res.status(201).json(offer);
    } catch (error) {
      console.error("Error creating trade offer:", error);
      res.status(500).json({ message: "Failed to create trade offer" });
    }
  });

  // Get user's transactions
  app.get("/api/coupon-mart/transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { type } = req.query;
      
      if (type === "purchased") {
        const transactions = await storage.getCouponMartTransactionsByBuyer(userId);
        res.json(transactions);
      } else if (type === "sold") {
        const transactions = await storage.getCouponMartTransactionsBySeller(userId);
        res.json(transactions);
      } else {
        const purchased = await storage.getCouponMartTransactionsByBuyer(userId);
        const sold = await storage.getCouponMartTransactionsBySeller(userId);
        res.json({ purchased, sold });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get trade offers
  app.get("/api/coupon-mart/trade-offers", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user has sample data
      await storage.ensureUserHasSampleCouponData(userId);
      
      const allOffers = await storage.getCouponMartTradeOffersByUser(userId);
      
      // Separate sent and received offers
      const sentOffers = allOffers.filter(o => o.offererId === userId);
      const receivedOffers = allOffers.filter(o => o.listingOwnerId === userId);
      
      // Attach listing data to each offer
      const sentWithListings = await Promise.all(sentOffers.map(async (offer) => {
        const listing = await storage.getCouponMartListing(offer.listingId);
        return { ...offer, listing };
      }));
      
      const receivedWithListings = await Promise.all(receivedOffers.map(async (offer) => {
        const listing = await storage.getCouponMartListing(offer.listingId);
        return { ...offer, listing };
      }));
      
      res.json({ sent: sentWithListings, received: receivedWithListings });
    } catch (error) {
      console.error("Error fetching trade offers:", error);
      res.status(500).json({ message: "Failed to fetch trade offers" });
    }
  });

  // Get single trade offer by ID
  app.get("/api/coupon-mart/trade-offers/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user has sample data
      await storage.ensureUserHasSampleCouponData(userId);
      
      const offer = await storage.getCouponMartTradeOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Trade offer not found" });
      }
      
      // Check if user is involved in this offer
      if (offer.offererId !== userId && offer.listingOwnerId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get the listing details
      const listing = await storage.getCouponMartListing(offer.listingId);
      
      // Get the offerer's name
      const offerer = await storage.getUser(offer.offererId);
      const offererName = offerer?.name || "Unknown User";
      
      res.json({ offer, listing, offererName });
    } catch (error) {
      console.error("Error fetching trade offer:", error);
      res.status(500).json({ message: "Failed to fetch trade offer" });
    }
  });

  // Accept/reject trade offer
  app.patch("/api/coupon-mart/trade-offers/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, responseNote } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Fetch the offer to verify ownership
      const existingOffer = await storage.getCouponMartTradeOffer(id);
      
      if (!existingOffer) {
        return res.status(404).json({ message: "Trade offer not found" });
      }
      
      // Only the listing owner can accept or reject offers
      if (existingOffer.listingOwnerId !== userId) {
        return res.status(403).json({ message: "Only the listing owner can respond to this offer" });
      }
      
      const offer = await storage.updateCouponMartTradeOffer(id, status, responseNote);
      
      if (!offer) {
        return res.status(404).json({ message: "Trade offer not found" });
      }
      
      res.json(offer);
    } catch (error) {
      console.error("Error updating trade offer:", error);
      res.status(500).json({ message: "Failed to update trade offer" });
    }
  });

  // ===== BookSure Consultant Booking APIs =====
  
  // Get all consultant categories
  app.get("/api/consultant/categories", async (req, res) => {
    try {
      const categories = await storage.getConsultantCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching consultant categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get consultant category by ID
  app.get("/api/consultant/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getConsultantCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching consultant category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get consultant category by slug
  app.get("/api/consultant/categories/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getConsultantCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching consultant category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get consultant providers with filters
  app.get("/api/consultant/providers", async (req, res) => {
    try {
      const { categoryId, city, verified, rating } = req.query;
      
      const filters = {
        categoryId: categoryId as string | undefined,
        city: city as string | undefined,
        verified: verified ? verified === 'true' : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
      };
      
      const providers = await storage.getConsultantProviders(filters);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching consultant providers:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  // Search consultant providers
  app.get("/api/consultant/providers/search", async (req, res) => {
    try {
      const { q, categoryId } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const providers = await storage.searchConsultantProviders(q, categoryId as string | undefined);
      res.json(providers);
    } catch (error) {
      console.error("Error searching consultant providers:", error);
      res.status(500).json({ message: "Failed to search providers" });
    }
  });

  // Get consultant provider by ID
  app.get("/api/consultant/providers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const provider = await storage.getConsultantProvider(id);
      
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      res.json(provider);
    } catch (error) {
      console.error("Error fetching consultant provider:", error);
      res.status(500).json({ message: "Failed to fetch provider" });
    }
  });

  // Get consultant services by provider
  app.get("/api/consultant/providers/:providerId/services", async (req, res) => {
    try {
      const { providerId } = req.params;
      const services = await storage.getConsultantServicesByProvider(providerId);
      res.json(services);
    } catch (error) {
      console.error("Error fetching consultant services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get consultant service by ID
  app.get("/api/consultant/services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const service = await storage.getConsultantService(id);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error fetching consultant service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Get consultant bookings for user
  app.get("/api/consultant/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const bookings = await storage.getConsultantBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching consultant bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get consultant booking by ID
  app.get("/api/consultant/bookings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getConsultantBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error fetching consultant booking:", error);
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Create consultant booking
  app.post("/api/consultant/bookings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = consultantBookingFormSchema.parse(req.body);
      
      // Get service to calculate pricing
      const service = await storage.getConsultantService(validatedData.serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      // Get provider details
      const provider = await storage.getConsultantProvider(service.providerId);
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      // Calculate total amount
      const basePrice = parseFloat(service.price);
      const travelFee = validatedData.bookingType === 'in_person' ? 50 : 0;
      const taxAmount = (basePrice + travelFee) * 0.18; // 18% GST
      const totalAmount = basePrice + travelFee + taxAmount;
      
      const bookingData = {
        userId,
        providerId: service.providerId,
        serviceId: validatedData.serviceId,
        serviceType: service.category,
        bookingType: validatedData.bookingType,
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime,
        duration: service.duration,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerEmail: validatedData.customerEmail || null,
        address: validatedData.address || null,
        city: validatedData.city || null,
        pincode: validatedData.pincode || null,
        latitude: null,
        longitude: null,
        accessInstructions: validatedData.accessInstructions || null,
        specialRequests: validatedData.specialRequests || null,
        basePrice: basePrice.toFixed(2),
        travelFee: travelFee.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        paymentMode: validatedData.paymentMode,
        promoCode: validatedData.promoCode || null,
        status: "pending",
      };
      
      const booking = await storage.createConsultantBooking(bookingData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating consultant booking:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Update consultant booking status
  app.patch("/api/consultant/bookings/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const booking = await storage.updateConsultantBooking(id, updateData);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error updating consultant booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Get consultant reviews by provider
  app.get("/api/consultant/providers/:providerId/reviews", async (req, res) => {
    try {
      const { providerId } = req.params;
      const reviews = await storage.getConsultantReviewsByProvider(providerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching consultant reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Create consultant review
  app.post("/api/consultant/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = consultantReviewFormSchema.parse(req.body);
      
      // Get booking to verify it exists and belongs to user
      const booking = await storage.getConsultantBooking(validatedData.bookingId);
      if (!booking || booking.userId !== userId) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if review already exists
      const existingReview = await storage.getConsultantReviewByBooking(validatedData.bookingId);
      if (existingReview) {
        return res.status(400).json({ message: "Review already submitted for this booking" });
      }
      
      const reviewData = {
        ...validatedData,
        userId,
        providerId: booking.providerId,
      };
      
      const review = await storage.createConsultantReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating consultant review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Get consultant availability by provider
  app.get("/api/consultant/providers/:providerId/availability", async (req, res) => {
    try {
      const { providerId } = req.params;
      const availability = await storage.getConsultantAvailabilityByProvider(providerId);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching consultant availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // SwapNow Marketplace API Routes
  
  // Get all listings with optional filters
  app.get("/api/swap-now/listings", async (req, res) => {
    try {
      const { category, status, city, condition } = req.query;
      const filters = {
        category: category as string | undefined,
        status: (status as string) || "active",
        city: city as string | undefined,
        condition: condition as string | undefined,
      };
      const listings = await storage.getSwapNowListings(filters);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching SwapNow listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  // Get a single listing by ID
  app.get("/api/swap-now/listings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const listing = await storage.getSwapNowListing(id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Increment view count
      await storage.incrementSwapNowListingViews(id);
      
      res.json(listing);
    } catch (error) {
      console.error("Error fetching SwapNow listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  // Get user's listings
  app.get("/api/swap-now/my-listings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const listings = await storage.getSwapNowListingsByUser(userId);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching user's SwapNow listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  // Create a new listing
  app.post("/api/swap-now/listings", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertSwapNowListingSchema.parse({
        ...req.body,
        userId,
      });
      
      const listing = await storage.createSwapNowListing(validatedData);
      res.json(listing);
    } catch (error) {
      console.error("Error creating SwapNow listing:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid listing data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Update a listing
  app.patch("/api/swap-now/listings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const listing = await storage.getSwapNowListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updated = await storage.updateSwapNowListing(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating SwapNow listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  // Delete a listing
  app.delete("/api/swap-now/listings/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const listing = await storage.getSwapNowListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteSwapNowListing(id);
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting SwapNow listing:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  // Mark listing as sold
  app.post("/api/swap-now/listings/:id/mark-sold", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const { soldPrice } = req.body;
      const listing = await storage.getSwapNowListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updated = await storage.markSwapNowListingAsSold(id, soldPrice);
      res.json(updated);
    } catch (error) {
      console.error("Error marking listing as sold:", error);
      res.status(500).json({ message: "Failed to mark listing as sold" });
    }
  });

  // Get user's conversations
  app.get("/api/swap-now/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const conversations = await storage.getSwapNowConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation by ID with messages
  app.get("/api/swap-now/conversations/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const conversation = await storage.getSwapNowConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const messages = await storage.getSwapNowMessagesByConversation(id);
      res.json({ conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/swap-now/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const conversation = await storage.getSwapNowConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const messages = await storage.getSwapNowMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create or get conversation for a listing
  app.post("/api/swap-now/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { listingId } = req.body;
      const listing = await storage.getSwapNowListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Check if conversation already exists
      const existing = await storage.getSwapNowConversationByListingAndBuyer(listingId, userId);
      if (existing) {
        return res.json(existing);
      }
      
      // Create new conversation
      const conversation = await storage.createSwapNowConversation({
        listingId,
        buyerId: userId,
        sellerId: listing.userId,
      });
      
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Send a message in a conversation
  app.post("/api/swap-now/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { conversationId, content, messageType, offerAmount } = req.body;
      
      const conversation = await storage.getSwapNowConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const message = await storage.createSwapNowMessage({
        conversationId,
        senderId: userId,
        content,
        messageType: messageType || "text",
        offerAmount: offerAmount || null,
        offerStatus: offerAmount ? "pending" : null,
      });
      
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Mark message as read
  app.patch("/api/swap-now/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      await storage.markSwapNowMessageAsRead(id);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Create an offer - sends as a message
  app.post("/api/swap-now/offers", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { listingId, offerAmount, note } = req.body;
      
      const listing = await storage.getSwapNowListing(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Find or create conversation
      let conversation = await storage.getSwapNowConversationByListingAndBuyer(listingId, userId);
      if (!conversation) {
        conversation = await storage.createSwapNowConversation({
          listingId,
          buyerId: userId,
          sellerId: listing.userId,
        });
      }
      
      // Create offer message
      const message = await storage.createSwapNowMessage({
        conversationId: conversation.id,
        senderId: userId,
        content: note || `Offer made for ₹${offerAmount}`,
        messageType: "offer",
        offerAmount: offerAmount.toString(),
        offerStatus: "pending",
      });
      
      res.json(message);
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  // Respond to an offer (accept or reject)
  app.post("/api/swap-now/offers/:id/respond", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { id } = req.params;
      const { action } = req.body;
      
      if (action !== "accept" && action !== "reject") {
        return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'" });
      }
      
      // Get the offer message
      const message = await storage.getSwapNowMessage(id);
      if (!message || message.messageType !== "offer") {
        return res.status(404).json({ message: "Offer not found" });
      }
      
      // Get conversation to verify user is recipient
      const conversation = await storage.getSwapNowConversation(message.conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Verify user is the recipient (not the sender)
      if (message.senderId === userId) {
        return res.status(403).json({ message: "Cannot respond to your own offer" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Update offer status
      const newStatus = action === "accept" ? "accepted" : "rejected";
      await storage.updateSwapNowMessage(id, {
        offerStatus: newStatus,
      });
      
      // Get user names
      const buyer = await storage.getUser(conversation.buyerId);
      const seller = await storage.getUser(conversation.sellerId);
      const buyerName = buyer?.name || "Buyer";
      const sellerName = seller?.name || "Seller";
      
      // Create system message
      const senderName = message.senderId === conversation.buyerId ? buyerName : sellerName;
      const respondentName = userId === conversation.buyerId ? buyerName : sellerName;
      
      const systemMessage = await storage.createSwapNowMessage({
        conversationId: conversation.id,
        senderId: "system",
        content: `${respondentName} ${newStatus} the offer of ₹${message.offerAmount}`,
        messageType: "system",
      });
      
      res.json({ message: "Offer " + newStatus, offer: message, systemMessage });
    } catch (error) {
      console.error("Error responding to offer:", error);
      res.status(500).json({ message: "Failed to respond to offer" });
    }
  });

  // Get offers for a listing
  app.get("/api/swap-now/listings/:listingId/offers", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { listingId } = req.params;
      const listing = await storage.getSwapNowListing(listingId);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      // Only listing owner can see offers
      if (listing.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const offers = await storage.getSwapNowOffersByListing(listingId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Get user's favorites
  app.get("/api/swap-now/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const favorites = await storage.getSwapNowFavoritesByUser(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add to favorites
  app.post("/api/swap-now/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { listingId } = req.body;
      
      const favorite = await storage.createSwapNowFavorite({
        userId,
        listingId,
      });
      
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  // Remove from favorites
  app.delete("/api/swap-now/favorites/:listingId", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { listingId } = req.params;
      await storage.deleteSwapNowFavorite(userId, listingId);
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
