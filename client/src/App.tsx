import { lazy, Suspense, useEffect, type FC } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";

const Redirect: FC<{ to: string }> = ({ to }) => {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(to, { replace: true });
  }, [to, navigate]);
  return null;
};

import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { NavigationHistoryProvider } from "@/hooks/use-navigation-history";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { LoadingLogo } from "@/components/ui/loading-logo";

const PageLoader = () => {
  const [location] = useLocation();
  const showBottomNav = ["/", "/booking", "/pro-tools", "/investment"].includes(location);
  
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-black pb-24">
        <div className="flex flex-col items-center gap-6">
          <LoadingLogo size="xl" />
          <p className="text-white/60 text-sm font-light tracking-wide animate-pulse">Loading...</p>
        </div>
      </div>
      {showBottomNav && <BottomNavigation />}
    </>
  );
};

const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const Marketplace = lazy(() => import("@/pages/marketplace"));
const MyReport = lazy(() => import("@/pages/myreport"));
const MyReportInfo = lazy(() => import("@/pages/myreport-info"));
const Security = lazy(() => import("@/pages/security"));
const SecurityInfo = lazy(() => import("@/pages/security-info"));
const Coach = lazy(() => import("@/pages/coach"));
const Fitness = lazy(() => import("@/pages/fitness"));
const FitnessInfo = lazy(() => import("@/pages/fitness/info"));
const MarathonBooking = lazy(() => import("@/pages/marathon-booking"));
const Learn = lazy(() => import("@/pages/learn"));
const MyPath = lazy(() => import("@/pages/mypath"));
const ProTools = lazy(() => import("@/pages/pro-tools"));
const MarketNews = lazy(() => import("@/pages/market-news"));
const LoanApplication = lazy(() => import("@/pages/loan-application"));
const EmiCalculator = lazy(() => import("@/pages/emi-calculator"));
const MyLoans = lazy(() => import("@/pages/my-loans"));
const MyPayments = lazy(() => import("@/pages/my-payments"));
const Profile = lazy(() => import("@/pages/profile"));
const Booking = lazy(() => import("@/pages/booking"));
const Notifications = lazy(() => import("@/pages/notifications"));
const EligibilityCheck = lazy(() => import("@/pages/eligibility-check"));
const CibilChecker = lazy(() => import("@/pages/cibil-checker"));
const Support = lazy(() => import("@/pages/support"));
const EmiSchedule = lazy(() => import("@/pages/emi-schedule"));
const MyEmis = lazy(() => import("@/pages/my-emis"));
const EmiDetail = lazy(() => import("@/pages/emi-detail"));
const LoanDetail = lazy(() => import("@/pages/loan-detail"));
const MarketplaceLoanDetail = lazy(() => import("@/pages/marketplace-loan-detail"));
const CreditCardMarketplace = lazy(() => import("@/pages/credit-card-marketplace"));
const CreditCardDetail = lazy(() => import("@/pages/credit-card-detail"));
const CreditCardApplication = lazy(() => import("@/pages/credit-card-application"));
const SuperPayLoans = lazy(() => import("@/pages/hex-loans"));
const LoanConfirmation = lazy(() => import("@/pages/loan-confirmation"));
const LoanCongratulations = lazy(() => import("@/pages/loan-congratulations"));
const InsuranceCongratulations = lazy(() => import("@/pages/insurance-congratulations"));
const CreditCardCongratulations = lazy(() => import("@/pages/credit-card-congratulations"));
const CourseDetail = lazy(() => import("@/pages/course-detail"));
const RepaymentCalculator = lazy(() => import("@/pages/repayment-calculator"));
const CreatorConnect = lazy(() => import("@/pages/creator-connect"));
const CreatorDetail = lazy(() => import("@/pages/creator-detail"));
const BudgetPlanner = lazy(() => import("@/pages/budget-planner"));
const GoalTracker = lazy(() => import("@/pages/goal-tracker"));
const ExpenseTracker = lazy(() => import("@/pages/expense-tracker"));
const MyBookings = lazy(() => import("@/pages/my-bookings"));
const AllTickets = lazy(() => import("@/pages/all-tickets"));
const TicketDetail = lazy(() => import("@/pages/ticket-detail"));
const FitnessLeaderboard = lazy(() => import("@/pages/fitness-leaderboard"));
const FitnessRewards = lazy(() => import("@/pages/fitness-rewards"));
const UpiPayment = lazy(() => import("@/pages/upi-payment"));
const UpiScanner = lazy(() => import("@/pages/upi-scanner"));
const UpiQr = lazy(() => import("@/pages/upi-qr"));
const UpiCollect = lazy(() => import("@/pages/upi-collect"));
const BillPayment = lazy(() => import("@/pages/bill-payment"));
const BillPaymentHistory = lazy(() => import("@/pages/bill-payment-history"));
const UpiHistory = lazy(() => import("@/pages/upi-history"));
const UpiEmiPayment = lazy(() => import("@/pages/upi-emi-payment"));
const EmiPaymentSuccess = lazy(() => import("@/pages/emi-payment-success"));
const UpiRewards = lazy(() => import("@/pages/upi-rewards"));
const FamilyUpi = lazy(() => import("@/pages/family-upi"));
const FamilyUpiCreate = lazy(() => import("@/pages/family-upi-create"));
const FamilyUpiEdit = lazy(() => import("@/pages/family-upi-edit"));
const FamilyUpiDetail = lazy(() => import("@/pages/family-upi-detail"));
const InvestmentNew = lazy(() => import("@/pages/investment-new"));
const InvestmentDetail = lazy(() => import("@/pages/investment-detail"));
const InvestmentPredictions = lazy(() => import("@/pages/investment-predictions"));
const MarketForecast = lazy(() => import("@/pages/market-forecast"));
const Funds = lazy(() => import("@/pages/funds"));
const Rewards = lazy(() => import("@/pages/rewards"));
const RewardDetail = lazy(() => import("@/pages/reward-detail"));
const ViewAllServices = lazy(() => import("@/pages/view-all-services"));
const Insurance = lazy(() => import("@/pages/insurance"));
const InsuranceDetail = lazy(() => import("@/pages/insurance-detail"));
const InsuranceApplication = lazy(() => import("@/pages/insurance-application"));
const MyInsurance = lazy(() => import("@/pages/my-insurance"));
const MyInsuranceDetail = lazy(() => import("@/pages/insurance-detail"));
const BillsRecharge = lazy(() => import("@/pages/bills-recharge"));
const Analytics = lazy(() => import("@/pages/analytics"));
const PaymentDetail = lazy(() => import("@/pages/payment-detail"));
const Fastag = lazy(() => import("@/pages/fastag"));
const FastagDetail = lazy(() => import("@/pages/fastag-detail"));
const FastagScanner = lazy(() => import("@/pages/fastag-scanner"));
const TravelBookingDetails = lazy(() => import("@/pages/travel-booking-details"));
const TravelPayment = lazy(() => import("@/pages/travel-payment"));
const TravelConfirmation = lazy(() => import("@/pages/travel-confirmation"));
const MyTrips = lazy(() => import("@/pages/my-trips"));
const MyShipments = lazy(() => import("@/pages/my-shipments"));
const FlightsList = lazy(() => import("@/pages/flights-list"));
const FlightSearch = lazy(() => import("@/pages/flight-search"));
const FlightSearchNew = lazy(() => import("@/pages/flight-search-new"));
const FlightsResults = lazy(() => import("@/pages/flights-results"));
const FlightSearchModern = lazy(() => import("@/pages/flight-search-modern"));
const FlightsResultsModern = lazy(() => import("@/pages/flights-results-modern"));
const FlightSeatSelection = lazy(() => import("@/pages/flight-seat-selection"));
const FlightPassengerDetails = lazy(() => import("@/pages/flight-passenger-details"));
const FlightBookingSuccess = lazy(() => import("@/pages/flight-booking-success"));
const TrainsList = lazy(() => import("@/pages/trains-list"));
const BusesList = lazy(() => import("@/pages/buses-list"));
const CabsList = lazy(() => import("@/pages/cabs-list"));
const MetroList = lazy(() => import("@/pages/metro-list"));
const RentalsList = lazy(() => import("@/pages/rentals-list"));
const FlightDetail = lazy(() => import("@/pages/flight-detail"));
const FlightBookingDetail = lazy(() => import("@/pages/flight-booking-detail"));
const FlightBookingComprehensive = lazy(() => import("@/pages/flight-booking-comprehensive"));
const FlightPayment = lazy(() => import("@/pages/flight-payment"));
const BusBookingComprehensive = lazy(() => import("@/pages/bus-booking-comprehensive"));
const FlightSearchPage = lazy(() => import("@/pages/booking/flight/search"));
const FlightResultsPage = lazy(() => import("@/pages/booking/flight/results"));
const BusSearchPage = lazy(() => import("@/pages/booking/bus/search"));
const BusResultsPage = lazy(() => import("@/pages/booking/bus/results"));
const BusSeatSelectionPage = lazy(() => import("@/pages/booking/bus/seat-selection"));
const BusPassengerDetailsPage = lazy(() => import("@/pages/booking/bus/passenger-details"));
const BusBookingSuccessPage = lazy(() => import("@/pages/booking/bus/success"));
const BusBookingComprehensivePage = lazy(() => import("@/pages/booking/bus/comprehensive"));
const TrainSearchPage = lazy(() => import("@/pages/booking/train/search"));
const TrainResultsPage = lazy(() => import("@/pages/booking/train/results"));
const TrainClassSelectionPage = lazy(() => import("@/pages/booking/train/comprehensive"));
const TrainPassengerDetailsPage = lazy(() => import("@/pages/booking/train/passenger-details"));
const TrainBookingSuccessPage = lazy(() => import("@/pages/booking/train/success"));
const MetroSearchPage = lazy(() => import("@/pages/booking/metro/search"));
const MetroResultsPage = lazy(() => import("@/pages/booking/metro/results"));
const MetroBookingComprehensivePage = lazy(() => import("@/pages/booking/metro/comprehensive"));
const EventSearchPage = lazy(() => import("@/pages/booking/event/search"));
const EventResultsPage = lazy(() => import("@/pages/booking/event/results"));
const EventBookingComprehensivePage = lazy(() => import("@/pages/booking/event/comprehensive"));
const HotelSearchPage = lazy(() => import("@/pages/booking/hotel/search"));
const HotelResultsPage = lazy(() => import("@/pages/booking/hotel/results"));
const HotelDetailsPage = lazy(() => import("@/pages/booking/hotel/details"));
const HotelBookPage = lazy(() => import("@/pages/booking/hotel/book"));
const HotelGuestDetailsPage = lazy(() => import("@/pages/booking/hotel/guest-details"));
const HotelBookingSuccessPage = lazy(() => import("@/pages/booking/hotel/success"));
const HotelComprehensiveBookingPage = lazy(() => import("@/pages/booking/hotel/comprehensive"));
const TrainDetail = lazy(() => import("@/pages/train-detail"));
const BusDetail = lazy(() => import("@/pages/bus-detail"));
const CabDetail = lazy(() => import("@/pages/cab-detail"));
const CabBookingHome = lazy(() => import("@/pages/cab-booking-home"));
const CabSelection = lazy(() => import("@/pages/cab-selection"));
const CabBookingConfirm = lazy(() => import("@/pages/cab-booking-confirm"));
const CabBookingSuccess = lazy(() => import("@/pages/cab-booking-success"));
const DriverProfile = lazy(() => import("@/pages/driver-profile"));
const MetroDetail = lazy(() => import("@/pages/metro-detail"));
const RentalDetail = lazy(() => import("@/pages/rental-detail"));
const MutualFundBuy = lazy(() => import("@/pages/mutual-fund-buy"));
const MutualFundConfirmation = lazy(() => import("@/pages/mutual-fund-confirmation"));
const InvestmentTracking = lazy(() => import("@/pages/investment-tracking"));
const Cards = lazy(() => import("@/pages/cards"));
const BankAccounts = lazy(() => import("@/pages/bank-accounts"));
const Activity = lazy(() => import("@/pages/activity"));
const Referrals = lazy(() => import("@/pages/referrals"));
const NotFound = lazy(() => import("@/pages/not-found"));
const BankTransfer = lazy(() => import("@/pages/bank-transfer"));
const BankTransferPayment = lazy(() => import("@/pages/bank-transfer-payment"));
const BankTransferDetail = lazy(() => import("@/pages/bank-transfer-detail"));
const SelfTransfer = lazy(() => import("@/pages/self-transfer"));
const MetalDetail = lazy(() => import("@/pages/metal-detail"));
const BillDetail = lazy(() => import("@/pages/bill-detail"));
const TransactionDetail = lazy(() => import("@/pages/transaction-detail"));
// BookSure Consultant Booking Pages
const ConsultantExplore = lazy(() => import("@/pages/consultant-explore"));
const ConsultantCategory = lazy(() => import("@/pages/consultant-category"));
const ConsultantProvider = lazy(() => import("@/pages/consultant-provider"));
const ConsultantDetail = lazy(() => import("@/pages/consultant-detail"));
const ConsultantBooking = lazy(() => import("@/pages/consultant-booking"));
const ConsultantBookingComprehensive = lazy(() => import("@/pages/consultant-booking-comprehensive"));
const ConsultantConfirmation = lazy(() => import("@/pages/consultant-confirmation"));
const ConsultantHistory = lazy(() => import("@/pages/consultant-history"));
const ConsultantInfo = lazy(() => import("@/pages/consultant/info"));
const GiftCoupons = lazy(() => import("@/pages/gift-coupons"));
const CompareVendors = lazy(() => import("@/pages/compare-vendors"));
const ProfileAbout = lazy(() => import("@/pages/profile-about"));
const Settings = lazy(() => import("@/pages/settings"));
const KYCApplication = lazy(() => import("@/pages/kyc-application"));
const MyPersonalFinanceDashboard = lazy(() => import("@/pages/my-personal-finance-dashboard"));
const EditProfile = lazy(() => import("@/pages/edit-profile"));
const MyBills = lazy(() => import("@/pages/my-bills"));
const MyInvestments = lazy(() => import("@/pages/my-investments"));
const MyCards = lazy(() => import("@/pages/my-cards"));
const CardDetail = lazy(() => import("@/pages/card-detail"));
const MyCoupons = lazy(() => import("@/pages/my-coupons"));
const CouponMart = lazy(() => import("@/pages/coupon-mart"));
const CouponMartListingDetail = lazy(() => import("@/pages/coupon-mart-listing-detail"));
const CouponMartMyListings = lazy(() => import("@/pages/coupon-mart-my-listings"));
const CouponMartTransactions = lazy(() => import("@/pages/coupon-mart-transactions"));
const CouponMartNewListing = lazy(() => import("@/pages/coupon-mart-new-listing"));
const CouponMartEditListing = lazy(() => import("@/pages/coupon-mart-edit-listing"));
const CouponMartInfo = lazy(() => import("@/pages/coupon-mart-info"));
const CouponMartPayment = lazy(() => import("@/pages/coupon-mart-payment"));
const CouponMartUpiPayment = lazy(() => import("@/pages/coupon-mart-upi-payment"));
const CouponMartProcessPayment = lazy(() => import("@/pages/coupon-mart-process-payment"));
const CouponMartPaymentConfirm = lazy(() => import("@/pages/coupon-mart-payment-confirm"));
const CouponMartPaymentSuccess = lazy(() => import("@/pages/coupon-mart-payment-success"));
const CouponMartListingSuccess = lazy(() => import("@/pages/coupon-mart-listing-success"));
const CouponMartTrade = lazy(() => import("@/pages/coupon-mart-trade"));
const CouponMartOfferDetail = lazy(() => import("@/pages/coupon-mart-offer-detail"));
const MyStockHistory = lazy(() => import("@/pages/my-stock-history"));
const MyBankAccounts = lazy(() => import("@/pages/my-bank-accounts"));
const BankAccountDetail = lazy(() => import("@/pages/bank-account-detail"));
const AddAccount = lazy(() => import("@/pages/add-account"));
const AddElectricityAccount = lazy(() => import("@/pages/add-electricity-account"));
const AddMobileAccount = lazy(() => import("@/pages/add-mobile-account"));
const AddDTHAccount = lazy(() => import("@/pages/add-dth-account"));
const AddGasAccount = lazy(() => import("@/pages/add-gas-account"));
const AddWaterAccount = lazy(() => import("@/pages/add-water-account"));
const AddBroadbandAccount = lazy(() => import("@/pages/add-broadband-account"));
const AddFastagAccount = lazy(() => import("@/pages/add-fastag-account"));
const AddMunicipalAccount = lazy(() => import("@/pages/add-municipal-account"));
const MyRewards = lazy(() => import("@/pages/my-rewards"));
const MyReferrals = lazy(() => import("@/pages/my-referrals"));
const MyActivity = lazy(() => import("@/pages/my-activity"));
const MyPayHistory = lazy(() => import("@/pages/my-pay-history"));
const ShareWiseGroups = lazy(() => import("@/pages/sharewise/groups"));
const ShareWiseGroupDetail = lazy(() => import("@/pages/sharewise/group-detail"));
const ShareWiseInfo = lazy(() => import("@/pages/sharewise/info"));
const ShareWiseCreateGroup = lazy(() => import("@/pages/sharewise/create-group"));
const ShareWiseExpenseDetail = lazy(() => import("@/pages/sharewise/expense-detail"));
const ShareWiseJoin = lazy(() => import("@/pages/sharewise/join"));
const TripDetail = lazy(() => import("@/pages/trip-detail"));
const InvestmentCongrats = lazy(() => import("@/pages/investment-congrats"));
const SipNew = lazy(() => import("@/pages/sip-new"));
const SipDetail = lazy(() => import("@/pages/sip-detail"));
const TravelBookings = lazy(() => import("@/pages/travel-bookings"));
const LearnContentDetail = lazy(() => import("@/pages/learn-content-detail"));
const SipList = lazy(() => import("@/pages/sip-list"));
const FixedDeposits = lazy(() => import("@/pages/fixed-deposits"));
const FixedDepositDetail = lazy(() => import("@/pages/fixed-deposit-detail"));
const FixedDepositCalculator = lazy(() => import("@/pages/fixed-deposit-calculator"));
const BillPaymentBroadband = lazy(() => import("@/pages/bill-payment-broadband"));
const BillPaymentElectricity = lazy(() => import("@/pages/bill-payment-electricity"));
const BillPaymentWater = lazy(() => import("@/pages/bill-payment-water"));
const BillPaymentMobile = lazy(() => import("@/pages/bill-payment-mobile"));
const BillPaymentOTT = lazy(() => import("@/pages/bill-payment-ott"));
const BillPaymentDTH = lazy(() => import("@/pages/bill-payment-dth"));
const BillPaymentGas = lazy(() => import("@/pages/bill-payment-gas"));
const BillPaymentFASTag = lazy(() => import("@/pages/bill-payment-fastag"));
const BillPaymentMunicipal = lazy(() => import("@/pages/bill-payment-municipal"));
const MobileAccountDetail = lazy(() => import("@/pages/mobile-account-detail"));
const MobileTransactionDetail = lazy(() => import("@/pages/mobile-transaction-detail"));
const ElectricityBillAccountDetail = lazy(() => import("@/pages/electricity-bill-account-detail"));
const DTHRechargeAccountDetail = lazy(() => import("@/pages/dth-recharge-account-detail"));
const GasBillAccountDetail = lazy(() => import("@/pages/gas-bill-account-detail"));
const WaterBillAccountDetail = lazy(() => import("@/pages/water-bill-account-detail"));
const BroadbandBillAccountDetail = lazy(() => import("@/pages/broadband-bill-account-detail"));
const FASTagAccountDetail = lazy(() => import("@/pages/fastag-account-detail"));
const MunicipalTaxAccountDetail = lazy(() => import("@/pages/municipal-tax-account-detail"));
const StocksList = lazy(() => import("@/pages/stocks-list"));
const MutualFundsList = lazy(() => import("@/pages/mutual-funds-list"));
const TransactionSuccess = lazy(() => import("@/pages/transaction-success"));
const TravelVIP = lazy(() => import("@/pages/travelvip"));
const TravelVIPMembership = lazy(() => import("@/pages/travelvip-membership"));
const TripNow = lazy(() => import("@/pages/trip-now"));
const TripWishlist = lazy(() => import("@/pages/trip-wishlist"));
const TripDetailNew = lazy(() => import("@/pages/trip-detail-new"));
const TripBooking = lazy(() => import("@/pages/trip-booking"));
const CryptoDetail = lazy(() => import("@/pages/crypto-detail"));
const CryptoList = lazy(() => import("@/pages/crypto-list"));
const MarketIndexDetail = lazy(() => import("@/pages/market-index-detail"));
const Movies = lazy(() => import("@/pages/movies"));
const MovieDetail = lazy(() => import("@/pages/movie-detail"));
const MovieSearchPage = lazy(() => import("@/pages/booking/movie/search"));
const MovieResultsPage = lazy(() => import("@/pages/booking/movie/results"));
const MovieBookingComprehensivePage = lazy(() => import("@/pages/booking/movie/comprehensive"));
const MoviePayment = lazy(() => import("@/pages/movie-payment"));
const MetroPayment = lazy(() => import("@/pages/metro-payment"));
const MovieBooking = lazy(() => import("@/pages/movie-booking"));
const MovieSeatSelection = lazy(() => import("@/pages/movie-seat-selection"));
const MoviePassengerDetails = lazy(() => import("@/pages/movie-passenger-details"));
const MovieFnB = lazy(() => import("@/pages/movie-fnb"));
const MovieCheckout = lazy(() => import("@/pages/movie-checkout"));
const MovieBookingSuccess = lazy(() => import("@/pages/movie-booking-success"));
const MovieBookings = lazy(() => import("@/pages/movie-bookings"));
const SIPBuy = lazy(() => import("@/pages/sip-buy"));
const SIPCongrats = lazy(() => import("@/pages/sip-congrats"));
const MutualFundBuyPage = lazy(() => import("@/pages/mutual-fund-buy-page"));
const MutualFundCongratsPage = lazy(() => import("@/pages/mutual-fund-congrats-page"));
const FDBuy = lazy(() => import("@/pages/fd-buy"));
const FDCongrats = lazy(() => import("@/pages/fd-congrats"));
const GoldProviders = lazy(() => import("@/pages/gold-providers"));
const SilverProviders = lazy(() => import("@/pages/silver-providers"));
const DiamondProviders = lazy(() => import("@/pages/diamond-providers"));
const FDProviders = lazy(() => import("@/pages/fd-providers"));
const SIPProviders = lazy(() => import("@/pages/sip-providers"));
const SWPList = lazy(() => import("@/pages/swp-list"));
const SWPDetail = lazy(() => import("@/pages/swp-detail"));
const SWPBuy = lazy(() => import("@/pages/swp-buy"));
const SWPCongrats = lazy(() => import("@/pages/swp-congrats"));
const STPList = lazy(() => import("@/pages/stp-list"));
const STPDetail = lazy(() => import("@/pages/stp-detail"));
const STPBuy = lazy(() => import("@/pages/stp-buy"));
const STPCongrats = lazy(() => import("@/pages/stp-congrats"));
const TransactionFailure = lazy(() => import("@/pages/transaction-failure"));
const EventsList = lazy(() => import("@/pages/events-list"));
const EventDetail = lazy(() => import("@/pages/event-detail"));
const EventTicketSelection = lazy(() => import("@/pages/event-ticket-selection"));
const EventBookingConfirmation = lazy(() => import("@/pages/event-booking-confirmation"));
const EventBooking = lazy(() => import("@/pages/event-booking"));
const EventSeatSelection = lazy(() => import("@/pages/event-seat-selection"));
const EventPassengerDetails = lazy(() => import("@/pages/event-passenger-details"));
const MetroBooking = lazy(() => import("@/pages/metro-booking"));
const MyMetroTickets = lazy(() => import("@/pages/my-metro-tickets"));
const RentalBooking = lazy(() => import("@/pages/rental-booking"));
const RentalBookingComprehensive = lazy(() => import("@/pages/rental-booking-comprehensive"));
const RentalVehicleDetail = lazy(() => import("@/pages/rental-vehicle-detail"));
const MyRentalBookings = lazy(() => import("@/pages/my-rental-bookings"));
const CabSearchPage = lazy(() => import("@/pages/booking/cab/search"));
const CabResultsPage = lazy(() => import("@/pages/booking/cab/results"));
const CabConfirmPage = lazy(() => import("@/pages/booking/cab/confirm"));
const CabTrackingPage = lazy(() => import("@/pages/booking/cab/tracking"));
const CabSuccessPage = lazy(() => import("@/pages/booking/cab/success"));
const RentalSearchPage = lazy(() => import("@/pages/booking/rental/search"));
const RentalBrowsePage = lazy(() => import("@/pages/booking/rental/browse"));
const RentalDetailsPage = lazy(() => import("@/pages/booking/rental/details"));
const RentalBookPage = lazy(() => import("@/pages/booking/rental/book"));
const RentalSuccessPage = lazy(() => import("@/pages/booking/rental/success"));

// Courier Pages
const CourierSearch = lazy(() => import("@/pages/booking/courier/search"));
const CourierVehicles = lazy(() => import("@/pages/booking/courier/vehicles"));
const CourierDetails = lazy(() => import("@/pages/booking/courier/details"));
const CourierConfirm = lazy(() => import("@/pages/booking/courier/confirm"));
const CourierTracking = lazy(() => import("@/pages/booking/courier/tracking"));
const CourierSuccess = lazy(() => import("@/pages/booking/courier/success"));
const CreditUpiInfo = lazy(() => import("@/pages/credit-upi-info"));
const CreditUpi = lazy(() => import("@/pages/credit-upi"));
const CreditUpiPay = lazy(() => import("@/pages/credit-upi-pay"));
const CreditUpiRepay = lazy(() => import("@/pages/credit-upi-repay"));
const CreditUpiTransactionDetail = lazy(() => import("@/pages/credit-upi-transaction-detail"));
const CashPark = lazy(() => import("@/pages/cash-park"));
const CashParkInfo = lazy(() => import("@/pages/cash-park-info"));
const CashParkSettings = lazy(() => import("@/pages/cash-park-settings"));
const CashParkJarDetail = lazy(() => import("@/pages/cash-park-jar-detail"));
const CashParkTransactions = lazy(() => import("@/pages/cash-park-transactions"));
const FamilyUpiInfo = lazy(() => import("@/pages/family-upi-info"));
const FixedDepositsInfo = lazy(() => import("@/pages/fixed-deposits-info"));
const BillsRechargeInfo = lazy(() => import("@/pages/bills-recharge-info"));
const CardsInfo = lazy(() => import("@/pages/cards-info"));
const InsuranceInfo = lazy(() => import("@/pages/insurance-info"));
const BudgetPlannerInfo = lazy(() => import("@/pages/budget-planner-info"));
const ExpenseTrackerInfo = lazy(() => import("@/pages/expense-tracker-info"));
const ExpenseDetail = lazy(() => import("@/pages/expense-detail"));
const GoalTrackerInfo = lazy(() => import("@/pages/goal-tracker-info"));
const RewardsInfo = lazy(() => import("@/pages/rewards-info"));
const ReferralsInfo = lazy(() => import("@/pages/referrals-info"));
const InvestmentInfo = lazy(() => import("@/pages/investment-info"));
const FastagInfo = lazy(() => import("@/pages/fastag-info"));
const WaterBillSuccess = lazy(() => import("@/pages/water-bill-success"));
const ElectricityBillSuccess = lazy(() => import("@/pages/electricity-bill-success"));
const ElectricityBillTransaction = lazy(() => import("@/pages/electricity-bill-transaction"));
const WaterBillTransaction = lazy(() => import("@/pages/water-bill-transaction"));
const DTHRechargeSuccess = lazy(() => import("@/pages/dth-recharge-success"));
const DTHRechargeTransaction = lazy(() => import("@/pages/dth-recharge-transaction"));
const GasBillSuccess = lazy(() => import("@/pages/gas-bill-success"));
const GasBillTransaction = lazy(() => import("@/pages/gas-bill-transaction"));
const BroadbandBillSuccess = lazy(() => import("@/pages/broadband-bill-success"));
const BroadbandBillTransaction = lazy(() => import("@/pages/broadband-bill-transaction"));
const FASTagRechargeSuccess = lazy(() => import("@/pages/fastag-recharge-success"));
const FASTagRechargeTransaction = lazy(() => import("@/pages/fastag-recharge-transaction"));
const MunicipalTaxSuccess = lazy(() => import("@/pages/municipal-tax-success"));
const MunicipalTaxTransaction = lazy(() => import("@/pages/municipal-tax-transaction"));
const MobileRechargeSuccess = lazy(() => import("@/pages/mobile-recharge-success"));
const MobileRechargeTransaction = lazy(() => import("@/pages/mobile-recharge-transaction"));

// Failure pages
const WaterBillFailure = lazy(() => import("@/pages/water-bill-failure"));
const ElectricityBillFailure = lazy(() => import("@/pages/electricity-bill-failure"));
const GasBillFailure = lazy(() => import("@/pages/gas-bill-failure"));
const DTHRechargeFailure = lazy(() => import("@/pages/dth-recharge-failure"));
const BroadbandBillFailure = lazy(() => import("@/pages/broadband-bill-failure"));
const FASTagRechargeFailure = lazy(() => import("@/pages/fastag-recharge-failure"));
const MunicipalTaxFailure = lazy(() => import("@/pages/municipal-tax-failure"));
const MobileRechargeFailure = lazy(() => import("@/pages/mobile-recharge-failure"));

const AddOTTAccount = lazy(() => import("@/pages/add-ott-account"));
const OTTSubscriptionAccountDetail = lazy(() => import("@/pages/ott-subscription-account-detail"));
const OTTSubscriptionTransaction = lazy(() => import("@/pages/ott-subscription-transaction"));
const OTTSubscriptionSuccess = lazy(() => import("@/pages/ott-subscription-success"));
const OTTSubscriptionFailure = lazy(() => import("@/pages/ott-subscription-failure"));

// Delivery Now Pages
const DeliveryNowCategories = lazy(() => import("@/pages/delivery-now/categories"));
const DeliveryNowListing = lazy(() => import("@/pages/delivery-now/listing"));
const DeliveryNowCatalogListing = lazy(() => import("@/pages/delivery-now/catalog-listing").then(m => ({ default: m.CatalogListing })));
const DeliveryNowProductDetail = lazy(() => import("@/pages/delivery-now/product-detail").then(m => ({ default: m.ProductDetail })));
const DeliveryNowVendorDetail = lazy(() => import("@/pages/delivery-now/vendor-detail"));
const DeliveryNowCart = lazy(() => import("@/pages/delivery-now/cart"));
const DeliveryNowCheckout = lazy(() => import("@/pages/delivery-now/checkout"));
const DeliveryNowOrderTracking = lazy(() => import("@/pages/delivery-now/tracking"));
const DeliveryNowOrderSuccess = lazy(() => import("@/pages/delivery-now/success"));
const DeliveryNowOrderHistory = lazy(() => import("@/pages/delivery-now/orders"));
const DeliveryNowOrderDetail = lazy(() => import("@/pages/delivery-now/order-detail"));
const DeliveryNowWishlist = lazy(() => import("@/pages/delivery-now/wishlist"));
const DeliveryNowAddresses = lazy(() => import("@/pages/delivery-now/addresses"));
const DeliveryNowAddAddress = lazy(() => import("@/pages/delivery-now/add-address"));
const DeliveryNowCoupons = lazy(() => import("@/pages/delivery-now/coupons"));

// SwapNow Marketplace Pages
const SwapNowExplore = lazy(() => import("@/pages/swap-now-explore"));
const SwapNowDetail = lazy(() => import("@/pages/swap-now-detail"));
const SwapNowNewListing = lazy(() => import("@/pages/swap-now-new-listing"));
const SwapNowEditListing = lazy(() => import("@/pages/swap-now-edit-listing"));
const SwapNowMyListings = lazy(() => import("@/pages/swap-now-my-listings"));
const SwapNowMessages = lazy(() => import("@/pages/swap-now-messages"));
const SwapNowInfo = lazy(() => import("@/pages/swap-now-info"));
const SwapNowListingSuccess = lazy(() => import("@/pages/swap-now-listing-success"));

function Router() {
  const [location] = useLocation();
  
  // Pages that should not have page transitions (bottom nav stays fixed)
  const noTransitionPages = ["/", "/booking", "/pro-tools", "/investment"];
  const shouldHaveTransition = !noTransitionPages.includes(location);
  
  const routesContent = (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/myreport" component={MyReport} />
        <Route path="/myreport/info" component={MyReportInfo} />
        <Route path="/security" component={Security} />
        <Route path="/security/info" component={SecurityInfo} />
        <Route path="/coach" component={Coach} />
        <Route path="/fitness" component={Fitness} />
        <Route path="/fitness/info" component={FitnessInfo} />
        <Route path="/fitness/leaderboard" component={FitnessLeaderboard} />
        <Route path="/fitness/rewards" component={FitnessRewards} />
        <Route path="/marathons/:marathonId/book" component={MarathonBooking} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:id" component={LearnContentDetail} />
        <Route path="/mypath" component={MyPath} />
        <Route path="/pro-tools" component={ProTools} />
        <Route path="/market-news" component={MarketNews} />
        <Route path="/loan-application" component={LoanApplication} />
        <Route path="/emi-calculator" component={EmiCalculator} />
        <Route path="/my-loans" component={MyLoans} />
        <Route path="/my-payments" component={MyPayments} />
        <Route path="/profile" component={Profile} />
        <Route path="/booking" component={Booking} />
        <Route path="/profile/about" component={ProfileAbout} />
        <Route path="/settings" component={Settings} />
        <Route path="/kyc-application" component={KYCApplication} />
        <Route path="/edit-profile" component={EditProfile} />
        <Route path="/my-personal-finance-dashboard" component={MyPersonalFinanceDashboard} />
        <Route path="/budget-planner/info" component={BudgetPlannerInfo} />
        <Route path="/budget-planner" component={BudgetPlanner} />
        <Route path="/goal-tracker/info" component={GoalTrackerInfo} />
        <Route path="/goal-tracker" component={GoalTracker} />
        <Route path="/expense-tracker/info" component={ExpenseTrackerInfo} />
        <Route path="/expense-tracker/:id" component={ExpenseDetail} />
        <Route path="/expense-tracker" component={ExpenseTracker} />
        <Route path="/my-bills" component={MyBills} />
        <Route path="/my-investments" component={MyInvestments} />
        <Route path="/my-cards" component={MyCards} />
        <Route path="/my-cards/:cardId" component={CardDetail} />
        <Route path="/my-insurance" component={MyInsurance} />
        <Route path="/my-insurance/:id" component={MyInsuranceDetail} />
        <Route path="/my-bank-accounts" component={MyBankAccounts} />
        <Route path="/my-bank-accounts/:id" component={BankAccountDetail} />
        <Route path="/add-account" component={AddAccount} />
        <Route path="/my-rewards" component={MyRewards} />
        <Route path="/my-referrals" component={MyReferrals} />
        <Route path="/my-activity" component={MyActivity} />
        <Route path="/my-pay-history" component={MyPayHistory} />
        <Route path="/sharewise/groups" component={ShareWiseGroups} />
        <Route path="/sharewise/groups/create" component={ShareWiseCreateGroup} />
        <Route path="/sharewise/groups/:id" component={ShareWiseGroupDetail} />
        <Route path="/sharewise/groups/:groupId/expenses/:expenseId" component={ShareWiseExpenseDetail} />
        <Route path="/sharewise/join/:inviteCode" component={ShareWiseJoin} />
        <Route path="/sharewise/info" component={ShareWiseInfo} />
        <Route path="/swap-now/explore" component={SwapNowExplore} />
        <Route path="/swap-now/listings/:id" component={SwapNowDetail} />
        <Route path="/swap-now/new-listing" component={SwapNowNewListing} />
        <Route path="/swap-now/listing-success" component={SwapNowListingSuccess} />
        <Route path="/swap-now/listings/:id/edit" component={SwapNowEditListing} />
        <Route path="/swap-now/my-listings" component={SwapNowMyListings} />
        <Route path="/swap-now/messages" component={SwapNowMessages} />
        <Route path="/swap-now/info" component={SwapNowInfo} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/eligibility-check" component={EligibilityCheck} />
        <Route path="/cibil-checker" component={CibilChecker} />
        <Route path="/support" component={Support} />
        <Route path="/transaction-history" component={EmiSchedule} />
        <Route path="/emi-schedule" component={() => { const [, navigate] = useLocation(); navigate("/transaction-history"); return null; }} />
        <Route path="/payment-schedule" component={() => { const [, navigate] = useLocation(); navigate("/transaction-history"); return null; }} />
        <Route path="/my-emis" component={MyEmis} />
        <Route path="/emi/:emiId" component={EmiDetail} />
        <Route path="/loan/:loanId" component={LoanDetail} />
        <Route path="/marketplace/loan/:id" component={MarketplaceLoanDetail} />
        <Route path="/credit-card-marketplace" component={CreditCardMarketplace} />
        <Route path="/credit-card-detail/:id" component={CreditCardDetail} />
        <Route path="/credit-card-application" component={CreditCardApplication} />
        <Route path="/credit-card-congratulations" component={CreditCardCongratulations} />
        <Route path="/hex-loans" component={SuperPayLoans} />
        <Route path="/kcredit-loans" component={() => { const [, navigate] = useLocation(); navigate("/hex-loans"); return null; }} />
        <Route path="/incred-loans" component={() => { const [, navigate] = useLocation(); navigate("/hex-loans"); return null; }} />
        <Route path="/loan-confirmation" component={LoanConfirmation} />
        <Route path="/loan-congratulations" component={LoanCongratulations} />
        <Route path="/insurance-congratulations" component={InsuranceCongratulations} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/repayment-calculator" component={RepaymentCalculator} />
        <Route path="/creators" component={CreatorConnect} />
        <Route path="/creator-connect" component={CreatorConnect} />
        <Route path="/creators/:id" component={CreatorDetail} />
        <Route path="/my-bookings" component={MyBookings} />
        <Route path="/upi-payment" component={UpiPayment} />
        <Route path="/upi-scanner" component={UpiScanner} />
        <Route path="/upi-qr" component={UpiQr} />
        <Route path="/upi-collect" component={UpiCollect} />
        <Route path="/bank-transfer" component={BankTransfer} />
        <Route path="/bank-transfer-payment" component={BankTransferPayment} />
        <Route path="/bank-transfer-detail/:id" component={BankTransferDetail} />
        <Route path="/self-transfer" component={SelfTransfer} />
        <Route path="/bill-payment/broadband" component={BillPaymentBroadband} />
        <Route path="/bill-payment/water" component={BillPaymentWater} />
        <Route path="/bill-payment/electricity" component={BillPaymentElectricity} />
        <Route path="/bill-payment/mobile" component={BillPaymentMobile} />
        <Route path="/bill-payment/ott" component={BillPaymentOTT} />
        <Route path="/bill-payment/dth" component={BillPaymentDTH} />
        <Route path="/bill-payment/gas" component={BillPaymentGas} />
        <Route path="/bill-payment/fastag" component={BillPaymentFASTag} />
        <Route path="/bill-payment/municipal" component={BillPaymentMunicipal} />
        <Route path="/dth-recharge" component={BillPaymentDTH} />
        <Route path="/dth-recharge/:id" component={DTHRechargeAccountDetail} />
        <Route path="/dth-recharge/account/:id" component={DTHRechargeAccountDetail} />
        <Route path="/dth-recharge/transaction/:id" component={DTHRechargeTransaction} />
        <Route path="/mobile-recharge/:id" component={MobileAccountDetail} />
        <Route path="/mobile-recharge/account/:id" component={MobileAccountDetail} />
        <Route path="/mobile-recharge/transaction/:id" component={MobileTransactionDetail} />
        <Route path="/mobile-recharge" component={BillPaymentMobile} />
        <Route path="/add-electricity-account" component={AddElectricityAccount} />
        <Route path="/add-mobile-account" component={AddMobileAccount} />
        <Route path="/add-dth-account" component={AddDTHAccount} />
        <Route path="/add-gas-account" component={AddGasAccount} />
        <Route path="/add-water-account" component={AddWaterAccount} />
        <Route path="/add-broadband-account" component={AddBroadbandAccount} />
        <Route path="/add-fastag-account" component={AddFastagAccount} />
        <Route path="/add-municipal-account" component={AddMunicipalAccount} />
        <Route path="/add-ott-account" component={AddOTTAccount} />
        <Route path="/electricity-bill/account/:id" component={ElectricityBillAccountDetail} />
        <Route path="/electricity-bill/transaction/:id" component={ElectricityBillTransaction} />
        <Route path="/electricity-bill" component={BillPaymentElectricity} />
        <Route path="/gas-bill/account/:id" component={GasBillAccountDetail} />
        <Route path="/gas-bill/transaction/:id" component={GasBillTransaction} />
        <Route path="/gas-bill" component={BillPaymentGas} />
        <Route path="/water-bill/account/:id" component={WaterBillAccountDetail} />
        <Route path="/water-bill/transaction/:id" component={WaterBillTransaction} />
        <Route path="/water-bill" component={BillPaymentWater} />
        <Route path="/broadband-bill/account/:id" component={BroadbandBillAccountDetail} />
        <Route path="/broadband-bill/transaction/:id" component={BroadbandBillTransaction} />
        <Route path="/broadband-bill" component={BillPaymentBroadband} />
        <Route path="/fastag-recharge/:id" component={FASTagAccountDetail} />
        <Route path="/fastag-recharge/account/:id" component={FASTagAccountDetail} />
        <Route path="/fastag/account/:id" component={FASTagAccountDetail} />
        <Route path="/fastag-recharge/transaction/:id" component={FASTagRechargeTransaction} />
        <Route path="/municipal-tax/account/:id" component={MunicipalTaxAccountDetail} />
        <Route path="/municipal-tax/transaction/:id" component={MunicipalTaxTransaction} />
        <Route path="/municipal-tax" component={BillPaymentMunicipal} />
        <Route path="/ott-subscription/account/:id" component={OTTSubscriptionAccountDetail} />
        <Route path="/ott-subscription/transaction/:id" component={OTTSubscriptionTransaction} />
        <Route path="/ott-subscription" component={BillPaymentOTT} />
        <Route path="/water-bill/success" component={WaterBillSuccess} />
        <Route path="/electricity-bill/success" component={ElectricityBillSuccess} />
        <Route path="/dth-recharge/success" component={DTHRechargeSuccess} />
        <Route path="/gas-bill/success" component={GasBillSuccess} />
        <Route path="/broadband-bill/success" component={BroadbandBillSuccess} />
        <Route path="/fastag-recharge/success" component={FASTagRechargeSuccess} />
        <Route path="/municipal-tax/success" component={MunicipalTaxSuccess} />
        <Route path="/mobile-recharge/success" component={MobileRechargeSuccess} />
        <Route path="/ott-subscription/success" component={OTTSubscriptionSuccess} />
        <Route path="/mobile-recharge-success" component={() => { const [, navigate] = useLocation(); navigate("/mobile-recharge/success"); return null; }} />
        
        {/* Failure routes */}
        <Route path="/water-bill/failure" component={WaterBillFailure} />
        <Route path="/electricity-bill/failure" component={ElectricityBillFailure} />
        <Route path="/gas-bill/failure" component={GasBillFailure} />
        <Route path="/dth-recharge/failure" component={DTHRechargeFailure} />
        <Route path="/broadband-bill/failure" component={BroadbandBillFailure} />
        <Route path="/fastag-recharge/failure" component={FASTagRechargeFailure} />
        <Route path="/municipal-tax/failure" component={MunicipalTaxFailure} />
        <Route path="/mobile-recharge/failure" component={MobileRechargeFailure} />
        <Route path="/ott-subscription/failure" component={OTTSubscriptionFailure} />
        
        <Route path="/bill-payment/pay/:billId" component={BillDetail} />
        <Route path="/bill-payment/:category" component={BillPayment} />
        <Route path="/bill-payment" component={BillPayment} />
        <Route path="/bill-detail/:billId" component={BillDetail} />
        <Route path="/transaction-detail/:id" component={TransactionDetail} />
        <Route path="/bill-payment-history" component={BillPaymentHistory} />
        <Route path="/upi-history" component={UpiHistory} />
        <Route path="/upi-emi-payment" component={UpiEmiPayment} />
        <Route path="/upi-emi-payment/:loanId" component={UpiEmiPayment} />
        <Route path="/emi-payment-success" component={EmiPaymentSuccess} />
        <Route path="/upi-rewards" component={UpiRewards} />
        <Route path="/family-upi/info" component={FamilyUpiInfo} />
        <Route path="/family-upi/create" component={FamilyUpiCreate} />
        <Route path="/family-upi/edit/:id" component={FamilyUpiEdit} />
        <Route path="/family-upi/detail/:id" component={FamilyUpiDetail} />
        <Route path="/family-upi" component={FamilyUpi} />
        <Route path="/investment-new/info" component={InvestmentInfo} />
        <Route path="/investment/info" component={InvestmentInfo} />
        <Route path="/investment" component={InvestmentNew} />
        <Route path="/investment/stocks" component={StocksList} />
        <Route path="/investment/crypto" component={CryptoList} />
        <Route path="/investment/mutual-funds" component={MutualFundsList} />
        <Route path="/investment/sip" component={SipList} />
        <Route path="/investment/sip/new" component={SipNew} />
        <Route path="/investment/sip/:id/buy" component={SIPBuy} />
        <Route path="/investment/sip/congrats" component={SIPCongrats} />
        <Route path="/investment/sip/:id" component={SipDetail} />
        <Route path="/sip-detail/:id" component={SipDetail} />
        <Route path="/investment/compare-vendors" component={CompareVendors} />
        <Route path="/mutual-fund/buy/:id" component={MutualFundBuyPage} />
        <Route path="/mutual-fund/congrats" component={MutualFundCongratsPage} />
        <Route path="/investment/fd" component={FixedDeposits} />
        <Route path="/fixed-deposits/info" component={FixedDepositsInfo} />
        <Route path="/fixed-deposits" component={FixedDeposits} />
        <Route path="/fixed-deposits-calculator" component={FixedDepositCalculator} />
        <Route path="/fixed-deposits/:fdId/buy" component={FDBuy} />
        <Route path="/fd/congrats" component={FDCongrats} />
        <Route path="/fixed-deposits/:fdId" component={FixedDepositDetail} />
        <Route path="/investment/gold/providers" component={GoldProviders} />
        <Route path="/investment/gold/:metalId" component={MetalDetail} />
        <Route path="/investment/silver/providers" component={SilverProviders} />
        <Route path="/investment/silver/:metalId" component={MetalDetail} />
        <Route path="/investment/diamond/providers" component={DiamondProviders} />
        <Route path="/investment/diamond/:metalId" component={MetalDetail} />
        <Route path="/investment/fd/providers" component={FDProviders} />
        <Route path="/investment/sip/providers" component={SIPProviders} />
        <Route path="/investment/swp" component={SWPList} />
        <Route path="/investment/swp/:id" component={SWPDetail} />
        <Route path="/investment/swp/:id/buy" component={SWPBuy} />
        <Route path="/investment/swp/congrats" component={SWPCongrats} />
        <Route path="/investment/stp" component={STPList} />
        <Route path="/investment/stp/:id" component={STPDetail} />
        <Route path="/investment/stp/:id/buy" component={STPBuy} />
        <Route path="/investment/stp/congrats" component={STPCongrats} />
        <Route path="/stocks/:symbol" component={InvestmentDetail} />
        <Route path="/indices/:symbol" component={MarketIndexDetail} />
        <Route path="/crypto/:symbol" component={CryptoDetail} />
        <Route path="/investment/:metalId" component={MetalDetail} />
        <Route path="/investment/:metalId/buy" component={MetalDetail} />
        <Route path="/investment/:metalId/sell" component={MetalDetail} />
        <Route path="/investment-detail/:symbol" component={InvestmentDetail} />
        <Route path="/investment-predictions" component={InvestmentPredictions} />
        <Route path="/market-forecast" component={MarketForecast} />
        <Route path="/funds" component={Funds} />
        <Route path="/rewards/info" component={RewardsInfo} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/reward-detail/:id" component={RewardDetail} />
        <Route path="/view-all-services" component={ViewAllServices} />
        <Route path="/insurance/info" component={InsuranceInfo} />
        <Route path="/insurance" component={Insurance} />
        <Route path="/insurance/:policyId" component={InsuranceDetail} />
        <Route path="/insurance-application" component={InsuranceApplication} />
        <Route path="/bills-recharge/info" component={BillsRechargeInfo} />
        <Route path="/bills-recharge" component={BillsRecharge} />
        <Route path="/fastag-scanner" component={FastagScanner} />
        <Route path="/fastag/:accountId" component={FastagDetail} />
        <Route path="/fastag/info" component={FastagInfo} />
        <Route path="/fastag" component={() => { const [, navigate] = useLocation(); navigate("/bill-payment/fastag"); return null; }} />
        <Route path="/travel" component={() => { const [, navigate] = useLocation(); navigate("/booking"); return null; }} />
        <Route path="/travel-booking" component={() => { const [, navigate] = useLocation(); navigate("/booking"); return null; }} />
        <Route path="/travel-booking-details/:id" component={TravelBookingDetails} />
        <Route path="/travel-payment" component={TravelPayment} />
        <Route path="/travel-confirmation" component={TravelConfirmation} />
        <Route path="/my-trips" component={MyTrips} />
        <Route path="/my-shipments" component={MyShipments} />
        <Route path="/booking/flight/search" component={FlightSearchPage} />
        <Route path="/booking/flight/results" component={FlightResultsPage} />
        <Route path="/booking/flight/:id" component={FlightBookingComprehensive} />
        <Route path="/flight-booking-detail/:id" component={FlightBookingDetail} />
        <Route path="/flight-payment" component={FlightPayment} />
        <Route path="/booking/bus/search" component={BusSearchPage} />
        <Route path="/booking/bus/results" component={BusResultsPage} />
        <Route path="/booking/bus/seat-selection" component={BusSeatSelectionPage} />
        <Route path="/booking/bus/:date/:id" component={BusBookingComprehensivePage} />
        <Route path="/booking/bus/passenger-details" component={BusPassengerDetailsPage} />
        <Route path="/booking/bus/success" component={BusBookingSuccessPage} />
        <Route path="/booking/train/search" component={TrainSearchPage} />
        <Route path="/booking/train/results" component={TrainResultsPage} />
        <Route path="/booking/train/classes" component={TrainClassSelectionPage} />
        <Route path="/booking/train/passenger-details" component={TrainPassengerDetailsPage} />
        <Route path="/booking/train/success" component={TrainBookingSuccessPage} />
        <Route path="/my-trips/flights" component={FlightsList} />
        <Route path="/my-trips/flights/:id" component={FlightDetail} />
        <Route path="/flights/search" component={FlightSearchModern} />
        <Route path="/flights/results" component={FlightsResultsModern} />
        <Route path="/flights/seat-selection" component={FlightSeatSelection} />
        <Route path="/flights/passenger-details" component={FlightPassengerDetails} />
        <Route path="/flights/booking-success" component={FlightBookingSuccess} />
        <Route path="/my-trips/trains" component={TrainsList} />
        <Route path="/my-trips/trains/:id" component={TrainDetail} />
        <Route path="/my-trips/buses" component={BusesList} />
        <Route path="/my-trips/buses/:id" component={BusDetail} />
        <Route path="/my-trips/cabs" component={CabsList} />
        <Route path="/my-trips/cabs/:id" component={CabDetail} />
        <Route path="/my-trips/metro" component={MetroList} />
        <Route path="/my-trips/metro/:id" component={MetroDetail} />
        <Route path="/my-trips/rentals" component={RentalsList} />
        <Route path="/my-trips/rentals/:id" component={RentalDetail} />
        <Route path="/travel-bookings" component={TravelBookings} />
        <Route path="/trip/:tripId" component={TripDetail} />
        <Route path="/mutual-fund-buy/:id" component={MutualFundBuy} />
        <Route path="/mutual-fund-confirmation" component={MutualFundConfirmation} />
        <Route path="/investment-tracking" component={InvestmentTracking} />
        <Route path="/investment-congrats" component={InvestmentCongrats} />
        <Route path="/transaction-success" component={TransactionSuccess} />
        <Route path="/travelvip" component={TravelVIP} />
        <Route path="/travelvip/membership" component={TravelVIPMembership} />
        <Route path="/trip-now" component={TripNow} />
        <Route path="/trip-wishlist" component={TripWishlist} />
        <Route path="/trip-detail/:tripId" component={TripDetailNew} />
        <Route path="/trip-booking/:tripId" component={TripBooking} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/payment-detail/:id" component={PaymentDetail} />
        <Route path="/cards/info" component={CardsInfo} />
        <Route path="/cards" component={Cards} />
        <Route path="/bank-accounts" component={BankAccounts} />
        <Route path="/activity" component={Activity} />
        <Route path="/referrals/info" component={ReferralsInfo} />
        <Route path="/referrals" component={() => <Redirect to="/my-referrals" />} />
        <Route path="/gift-cards" component={GiftCoupons} />
        <Route path="/gift-coupons" component={GiftCoupons} />
        <Route path="/profile/coupons" component={MyCoupons} />
        <Route path="/coupon-mart" component={CouponMart} />
        <Route path="/coupon-mart/listing/:id" component={CouponMartListingDetail} />
        <Route path="/coupon-mart/my-listings" component={CouponMartMyListings} />
        <Route path="/coupon-mart/transactions" component={CouponMartTransactions} />
        <Route path="/coupon-mart/new-listing" component={CouponMartNewListing} />
        <Route path="/coupon-mart/edit-listing/:id" component={CouponMartEditListing} />
        <Route path="/coupon-mart/info" component={CouponMartInfo} />
        <Route path="/coupon-mart/trade/:id" component={CouponMartTrade} />
        <Route path="/coupon-mart/offer/:id" component={CouponMartOfferDetail} />
        <Route path="/coupon-mart/payment/:id/upi" component={CouponMartUpiPayment} />
        <Route path="/coupon-mart/payment/:id/process" component={CouponMartProcessPayment} />
        <Route path="/coupon-mart/payment/:id/confirm" component={CouponMartPaymentConfirm} />
        <Route path="/coupon-mart/payment/:id" component={CouponMartPayment} />
        <Route path="/coupon-mart/payment-success" component={CouponMartPaymentSuccess} />
        <Route path="/coupon-mart/listing-success" component={CouponMartListingSuccess} />
        <Route path="/profile/stock-history" component={MyStockHistory} />
        <Route path="/movies" component={Movies} />
        <Route path="/movie-bookings" component={MovieBookings} />
        <Route path="/movie-booking" component={MovieBooking} />
        <Route path="/movies/:id" component={MovieDetail} />
        <Route path="/movies/:id/seats" component={MovieSeatSelection} />
        <Route path="/movie-passenger-details" component={MoviePassengerDetails} />
        <Route path="/movies/fnb" component={MovieFnB} />
        <Route path="/movies/checkout" component={MovieCheckout} />
        <Route path="/movies/booking-success/:bookingId" component={MovieBookingSuccess} />
        <Route path="/booking/movie/search" component={MovieSearchPage} />
        <Route path="/booking/movie/results" component={MovieResultsPage} />
        <Route path="/booking/movie/:date/:id" component={MovieBookingComprehensivePage} />
        <Route path="/movie-payment" component={MoviePayment} />
        <Route path="/transaction-failure" component={TransactionFailure} />
        <Route path="/booking/event/search" component={EventSearchPage} />
        <Route path="/booking/event/results" component={EventResultsPage} />
        <Route path="/booking/event/:date/:id" component={EventBookingComprehensivePage} />
        <Route path="/booking/hotel/search" component={HotelSearchPage} />
        <Route path="/booking/hotel/results" component={HotelResultsPage} />
        <Route path="/booking/hotel/comprehensive" component={HotelComprehensiveBookingPage} />
        <Route path="/booking/hotel/details" component={HotelDetailsPage} />
        <Route path="/booking/hotel/book" component={HotelBookPage} />
        <Route path="/booking/hotel/guest-details" component={HotelGuestDetailsPage} />
        <Route path="/booking/hotel/success" component={HotelBookingSuccessPage} />
        <Route path="/events" component={EventsList} />
        <Route path="/events/:id" component={EventDetail} />
        <Route path="/event-detail/:id" component={EventDetail} />
        <Route path="/events/:id/booking" component={EventBooking} />
        <Route path="/events/:id/seats" component={EventSeatSelection} />
        <Route path="/event-passenger-details" component={EventPassengerDetails} />
        <Route path="/events/:id/tickets" component={EventTicketSelection} />
        <Route path="/events/:id/confirmation" component={EventBookingConfirmation} />
        
        {/* BookSure Consultant Booking Routes */}
        <Route path="/consultant/explore" component={ConsultantExplore} />
        <Route path="/consultant/info" component={ConsultantInfo} />
        <Route path="/consultant/category/:categoryId" component={ConsultantCategory} />
        <Route path="/consultant/provider/:providerId" component={ConsultantProvider} />
        <Route path="/consultant/detail/:providerId" component={ConsultantDetail} />
        <Route path="/consultant/booking/:serviceId" component={ConsultantBookingComprehensive} />
        <Route path="/consultant/booking/confirmation/:bookingId" component={ConsultantConfirmation} />
        <Route path="/consultant/history" component={ConsultantHistory} />
        
        <Route path="/booking/metro/search" component={MetroSearchPage} />
        <Route path="/booking/metro/results" component={MetroResultsPage} />
        <Route path="/booking/metro/:date/:id" component={MetroBookingComprehensivePage} />
        <Route path="/metro-payment" component={MetroPayment} />
        <Route path="/metro-booking" component={MetroBooking} />
        <Route path="/my-metro-tickets" component={MyMetroTickets} />
        <Route path="/all-tickets" component={AllTickets} />
        <Route path="/ticket-detail/:id" component={TicketDetail} />
        <Route path="/rental-booking" component={RentalBooking} />
        <Route path="/rental-booking/:id" component={RentalBookingComprehensive} />
        <Route path="/rental-detail" component={RentalVehicleDetail} />
        <Route path="/my-rental-bookings" component={MyRentalBookings} />
        <Route path="/booking/cab" component={CabBookingHome} />
        <Route path="/booking/cab/select" component={CabSelection} />
        <Route path="/booking/cab/confirm" component={CabBookingConfirm} />
        <Route path="/booking/cab/success" component={CabBookingSuccess} />
        <Route path="/driver/:id" component={DriverProfile} />
        <Route path="/booking/cab/search" component={CabSearchPage} />
        <Route path="/booking/cab/results" component={CabResultsPage} />
        <Route path="/booking/cab/tracking" component={CabTrackingPage} />
        <Route path="/booking/rental/search" component={RentalSearchPage} />
        <Route path="/booking/rental/browse" component={RentalBrowsePage} />
        <Route path="/booking/rental/details" component={RentalDetailsPage} />
        <Route path="/booking/rental/book" component={RentalBookPage} />
        <Route path="/booking/rental/success" component={RentalSuccessPage} />
        
        {/* Courier Routes */}
        <Route path="/booking/courier/search" component={CourierSearch} />
        <Route path="/booking/courier/vehicles" component={CourierVehicles} />
        <Route path="/booking/courier/details" component={CourierDetails} />
        <Route path="/booking/courier/confirm" component={CourierConfirm} />
        <Route path="/booking/courier/tracking/:id" component={CourierTracking} />
        <Route path="/booking/courier/success/:id" component={CourierSuccess} />
        
        <Route path="/credit-upi/info" component={CreditUpiInfo} />
        <Route path="/credit-upi-info" component={CreditUpiInfo} />
        <Route path="/credit-upi" component={CreditUpi} />
        <Route path="/credit-upi/pay" component={CreditUpiPay} />
        <Route path="/credit-upi/repay" component={CreditUpiRepay} />
        <Route path="/credit-upi/transaction/:id" component={CreditUpiTransactionDetail} />
        <Route path="/cash-park/info" component={CashParkInfo} />
        <Route path="/cash-park/transactions" component={CashParkTransactions} />
        <Route path="/cash-park/settings" component={CashParkSettings} />
        <Route path="/cash-park/jar/:id" component={CashParkJarDetail} />
        <Route path="/cash-park" component={CashPark} />
        
        {/* Delivery Now Routes - Specific routes first, then generic */}
        <Route path="/delivery-now" component={DeliveryNowCategories} />
        <Route path="/delivery-now/cart" component={DeliveryNowCart} />
        <Route path="/delivery-now/checkout" component={DeliveryNowCheckout} />
        <Route path="/delivery-now/addresses" component={DeliveryNowAddresses} />
        <Route path="/delivery-now/add-address" component={DeliveryNowAddAddress} />
        <Route path="/delivery-now/coupons" component={DeliveryNowCoupons} />
        <Route path="/delivery-now/orders" component={DeliveryNowOrderHistory} />
        <Route path="/delivery-now/wishlist" component={DeliveryNowWishlist} />
        <Route path="/delivery-now/order/:id" component={DeliveryNowOrderDetail} />
        <Route path="/delivery-now/track/:id" component={DeliveryNowOrderTracking} />
        <Route path="/delivery-now/success/:id" component={DeliveryNowOrderSuccess} />
        
        {/* Product Detail Routes (must come before category routes) */}
        <Route path="/delivery-now/:category/product/:id" component={DeliveryNowProductDetail} />
        
        {/* Catalog-based categories (Flipkart/Zepto style) */}
        <Route path="/delivery-now/supermart" component={DeliveryNowCatalogListing} />
        <Route path="/delivery-now/medicine" component={DeliveryNowCatalogListing} />
        <Route path="/delivery-now/electronics" component={DeliveryNowCatalogListing} />
        <Route path="/delivery-now/beauty" component={DeliveryNowCatalogListing} />
        <Route path="/delivery-now/pet" component={DeliveryNowCatalogListing} />
        <Route path="/delivery-now/home" component={DeliveryNowCatalogListing} />
        
        {/* Courier redirect - must come before generic category route */}
        <Route path="/delivery-now/courier">
          {() => <Redirect to="/booking/courier/search" />}
        </Route>
        
        {/* Hotel-based categories (vendor listing) */}
        <Route path="/delivery-now/vendor/:id">
          {(params) => <Redirect to={`/delivery-now/hotel-food/vendor/${params.id}`} />}
        </Route>
        <Route path="/delivery-now/:category/vendor/:id" component={DeliveryNowVendorDetail} />
        <Route path="/delivery-now/:category" component={DeliveryNowListing} />
        
        <Route component={NotFound} />
    </Switch>
  );
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        {shouldHaveTransition ? (
          <PageTransition key={location}>
            {routesContent}
          </PageTransition>
        ) : (
          routesContent
        )}
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ErrorBoundary>
            <WishlistProvider>
              <NavigationHistoryProvider>
                <ScrollToTop />
                <div className="mobile-container">
                  <Toaster />
                  <Router />
                </div>
              </NavigationHistoryProvider>
            </WishlistProvider>
          </ErrorBoundary>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
