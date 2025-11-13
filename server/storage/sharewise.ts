import {
  type SharewiseGroup,
  type SharewiseGroupMember,
  type SharewiseExpense,
  type SharewiseExpenseSplit,
  type SharewiseExpenseItem,
  type SharewiseActivity,
  type SharewiseSettlement,
  type InsertSharewiseGroup,
  type InsertSharewiseGroupMember,
  type InsertSharewiseExpense,
  type InsertSharewiseExpenseSplit,
  type InsertSharewiseExpenseItem,
  type InsertSharewiseActivity,
  type InsertSharewiseSettlement,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface MemberBalance {
  userId: string;
  netBalance: number;
  totalPaid: number;
  totalOwed: number;
}

export interface SettlementSuggestion {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export interface GroupWithMembers extends SharewiseGroup {
  members: SharewiseGroupMember[];
  memberCount: number;
}

export interface ExpenseWithSplits extends SharewiseExpense {
  splits: SharewiseExpenseSplit[];
}

export class ShareWiseStorage {
  private groups: Map<string, SharewiseGroup>;
  private members: Map<string, SharewiseGroupMember>;
  private expenses: Map<string, SharewiseExpense>;
  private splits: Map<string, SharewiseExpenseSplit>;
  private items: Map<string, SharewiseExpenseItem>;
  private activity: Map<string, SharewiseActivity>;
  private settlements: Map<string, SharewiseSettlement>;

  constructor() {
    this.groups = new Map();
    this.members = new Map();
    this.expenses = new Map();
    this.splits = new Map();
    this.items = new Map();
    this.activity = new Map();
    this.settlements = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    const userId1 = "user-1";
    const userId2 = "user-2";
    const userId3 = "user-3";
    const userId4 = "user-4";
    const userId5 = "user-5";

    const group1Id = "group-1";
    const group2Id = "group-2";
    const group3Id = "group-3";
    const group4Id = "group-4";
    const group5Id = "group-5";
    const group6Id = "group-6";

    const group1: SharewiseGroup = {
      id: group1Id,
      name: "Weekend Trip to Goa",
      description: "Beach vacation with friends",
      groupType: "trip",
      currency: "INR",
      createdBy: userId1,
      createdAt: new Date("2025-10-01"),
      updatedAt: new Date("2025-10-15"),
    };

    const group2: SharewiseGroup = {
      id: group2Id,
      name: "Office Lunch Group",
      description: "Daily office lunch expenses",
      groupType: "home",
      currency: "INR",
      createdBy: userId2,
      createdAt: new Date("2025-09-15"),
      updatedAt: new Date("2025-10-18"),
    };

    const group3: SharewiseGroup = {
      id: group3Id,
      name: "House Rent & Utilities",
      description: "Monthly apartment expenses",
      groupType: "home",
      currency: "INR",
      createdBy: userId1,
      createdAt: new Date("2025-08-01"),
      updatedAt: new Date("2025-10-10"),
    };

    const group4: SharewiseGroup = {
      id: group4Id,
      name: "Birthday Celebration",
      description: "Sarah's 25th birthday party",
      groupType: "event",
      currency: "INR",
      createdBy: userId2,
      createdAt: new Date("2025-10-12"),
      updatedAt: new Date("2025-10-13"),
    };

    const group5: SharewiseGroup = {
      id: group5Id,
      name: "Couple Expenses",
      description: "Shared monthly expenses",
      groupType: "couple",
      currency: "INR",
      createdBy: userId1,
      createdAt: new Date("2025-07-01"),
      updatedAt: new Date("2025-10-18"),
    };

    const group6: SharewiseGroup = {
      id: group6Id,
      name: "Business Trip - Mumbai",
      description: "Client meeting expenses",
      groupType: "business",
      currency: "INR",
      createdBy: userId3,
      createdAt: new Date("2025-10-10"),
      updatedAt: new Date("2025-10-11"),
    };

    this.groups.set(group1Id, group1);
    this.groups.set(group2Id, group2);
    this.groups.set(group3Id, group3);
    this.groups.set(group4Id, group4);
    this.groups.set(group5Id, group5);
    this.groups.set(group6Id, group6);

    const member1_1: SharewiseGroupMember = {
      id: "member-1-1",
      groupId: group1Id,
      userId: userId1,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-10-01"),
    };

    const member1_2: SharewiseGroupMember = {
      id: "member-1-2",
      groupId: group1Id,
      userId: userId2,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-01"),
    };

    const member1_3: SharewiseGroupMember = {
      id: "member-1-3",
      groupId: group1Id,
      userId: userId3,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-02"),
    };

    const member2_1: SharewiseGroupMember = {
      id: "member-2-1",
      groupId: group2Id,
      userId: userId1,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-09-15"),
    };

    const member2_2: SharewiseGroupMember = {
      id: "member-2-2",
      groupId: group2Id,
      userId: userId2,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-09-15"),
    };

    const member2_3: SharewiseGroupMember = {
      id: "member-2-3",
      groupId: group2Id,
      userId: userId3,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-09-16"),
    };

    const member3_1: SharewiseGroupMember = {
      id: "member-3-1",
      groupId: group3Id,
      userId: userId1,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-08-01"),
    };

    const member3_2: SharewiseGroupMember = {
      id: "member-3-2",
      groupId: group3Id,
      userId: userId2,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-08-01"),
    };

    const member4_1: SharewiseGroupMember = {
      id: "member-4-1",
      groupId: group4Id,
      userId: userId2,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-10-12"),
    };

    const member4_2: SharewiseGroupMember = {
      id: "member-4-2",
      groupId: group4Id,
      userId: userId1,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-12"),
    };

    const member4_3: SharewiseGroupMember = {
      id: "member-4-3",
      groupId: group4Id,
      userId: userId3,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-12"),
    };

    const member4_4: SharewiseGroupMember = {
      id: "member-4-4",
      groupId: group4Id,
      userId: userId4,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-12"),
    };

    const member5_1: SharewiseGroupMember = {
      id: "member-5-1",
      groupId: group5Id,
      userId: userId1,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-07-01"),
    };

    const member5_2: SharewiseGroupMember = {
      id: "member-5-2",
      groupId: group5Id,
      userId: userId4,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-07-01"),
    };

    const member6_1: SharewiseGroupMember = {
      id: "member-6-1",
      groupId: group6Id,
      userId: userId3,
      role: "owner",
      status: "active",
      joinedAt: new Date("2025-10-10"),
    };

    const member6_2: SharewiseGroupMember = {
      id: "member-6-2",
      groupId: group6Id,
      userId: userId5,
      role: "member",
      status: "active",
      joinedAt: new Date("2025-10-10"),
    };

    this.members.set(member1_1.id, member1_1);
    this.members.set(member1_2.id, member1_2);
    this.members.set(member1_3.id, member1_3);
    this.members.set(member2_1.id, member2_1);
    this.members.set(member2_2.id, member2_2);
    this.members.set(member2_3.id, member2_3);
    this.members.set(member3_1.id, member3_1);
    this.members.set(member3_2.id, member3_2);
    this.members.set(member4_1.id, member4_1);
    this.members.set(member4_2.id, member4_2);
    this.members.set(member4_3.id, member4_3);
    this.members.set(member4_4.id, member4_4);
    this.members.set(member5_1.id, member5_1);
    this.members.set(member5_2.id, member5_2);
    this.members.set(member6_1.id, member6_1);
    this.members.set(member6_2.id, member6_2);

    const expense1: SharewiseExpense = {
      id: "expense-1",
      groupId: group1Id,
      title: "Hotel Booking - 3 Nights",
      amount: "15000.00",
      currency: "INR",
      category: "accommodation",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Beachfront resort in North Goa",
      createdBy: userId1,
      occurredAt: new Date("2025-10-05"),
      createdAt: new Date("2025-10-05"),
      updatedAt: new Date("2025-10-05"),
    };

    const expense2: SharewiseExpense = {
      id: "expense-2",
      groupId: group1Id,
      title: "Car Rental",
      amount: "4500.00",
      currency: "INR",
      category: "transport",
      paidBy: userId2,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "3-day rental for local sightseeing",
      createdBy: userId2,
      occurredAt: new Date("2025-10-06"),
      createdAt: new Date("2025-10-06"),
      updatedAt: new Date("2025-10-06"),
    };

    const expense3: SharewiseExpense = {
      id: "expense-3",
      groupId: group2Id,
      title: "Team Lunch - Italian",
      amount: "1200.00",
      currency: "INR",
      category: "food",
      paidBy: userId2,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: null,
      createdBy: userId2,
      occurredAt: new Date("2025-10-17"),
      createdAt: new Date("2025-10-17"),
      updatedAt: new Date("2025-10-17"),
    };

    const expense11: SharewiseExpense = {
      id: "expense-11",
      groupId: group2Id,
      title: "Coffee & Snacks",
      amount: "450.00",
      currency: "INR",
      category: "food",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Afternoon coffee break",
      createdBy: userId1,
      occurredAt: new Date("2025-10-16"),
      createdAt: new Date("2025-10-16"),
      updatedAt: new Date("2025-10-16"),
    };

    const expense12: SharewiseExpense = {
      id: "expense-12",
      groupId: group2Id,
      title: "Team Dinner - Chinese",
      amount: "1800.00",
      currency: "INR",
      category: "food",
      paidBy: userId3,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Friday team dinner",
      createdBy: userId3,
      occurredAt: new Date("2025-10-18"),
      createdAt: new Date("2025-10-18"),
      updatedAt: new Date("2025-10-18"),
    };

    const expense13: SharewiseExpense = {
      id: "expense-13",
      groupId: group2Id,
      title: "Breakfast Meeting",
      amount: "600.00",
      currency: "INR",
      category: "food",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Monday morning meeting",
      createdBy: userId1,
      occurredAt: new Date("2025-10-14"),
      createdAt: new Date("2025-10-14"),
      updatedAt: new Date("2025-10-14"),
    };

    const expense4: SharewiseExpense = {
      id: "expense-4",
      groupId: group4Id,
      title: "Birthday Cake & Decorations",
      amount: "3500.00",
      currency: "INR",
      category: "entertainment",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Custom chocolate cake from Theobroma",
      createdBy: userId1,
      occurredAt: new Date("2025-10-13"),
      createdAt: new Date("2025-10-13"),
      updatedAt: new Date("2025-10-13"),
    };

    const expense5: SharewiseExpense = {
      id: "expense-5",
      groupId: group4Id,
      title: "Restaurant Dinner",
      amount: "8000.00",
      currency: "INR",
      category: "food",
      paidBy: userId2,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Birthday dinner at Olive Bar & Kitchen",
      createdBy: userId2,
      occurredAt: new Date("2025-10-13"),
      createdAt: new Date("2025-10-13"),
      updatedAt: new Date("2025-10-13"),
    };

    const expense6: SharewiseExpense = {
      id: "expense-6",
      groupId: group5Id,
      title: "Groceries - Monthly",
      amount: "6500.00",
      currency: "INR",
      category: "groceries",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "BigBasket order",
      createdBy: userId1,
      occurredAt: new Date("2025-10-15"),
      createdAt: new Date("2025-10-15"),
      updatedAt: new Date("2025-10-15"),
    };

    const expense7: SharewiseExpense = {
      id: "expense-7",
      groupId: group6Id,
      title: "Flight Tickets to Mumbai",
      amount: "12000.00",
      currency: "INR",
      category: "transport",
      paidBy: userId3,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Round trip - Delhi to Mumbai",
      createdBy: userId3,
      occurredAt: new Date("2025-10-10"),
      createdAt: new Date("2025-10-10"),
      updatedAt: new Date("2025-10-10"),
    };

    const expense8: SharewiseExpense = {
      id: "expense-8",
      groupId: group3Id,
      title: "Monthly Rent",
      amount: "25000.00",
      currency: "INR",
      category: "housing",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "October rent payment",
      createdBy: userId1,
      occurredAt: new Date("2025-10-01"),
      createdAt: new Date("2025-10-01"),
      updatedAt: new Date("2025-10-01"),
    };

    const expense9: SharewiseExpense = {
      id: "expense-9",
      groupId: group3Id,
      title: "Electricity Bill",
      amount: "2500.00",
      currency: "INR",
      category: "utilities",
      paidBy: userId2,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "September electricity bill",
      createdBy: userId2,
      occurredAt: new Date("2025-10-05"),
      createdAt: new Date("2025-10-05"),
      updatedAt: new Date("2025-10-05"),
    };

    const expense10: SharewiseExpense = {
      id: "expense-10",
      groupId: group3Id,
      title: "Internet & WiFi",
      amount: "1200.00",
      currency: "INR",
      category: "utilities",
      paidBy: userId1,
      splitType: "equal",
      attachmentUrl: null,
      attachmentType: null,
      ocrData: null,
      isRecurring: null,
      recurringFrequency: null,
      recurringEndDate: null,
      parentExpenseId: null,
      notes: "Monthly broadband plan",
      createdBy: userId1,
      occurredAt: new Date("2025-10-03"),
      createdAt: new Date("2025-10-03"),
      updatedAt: new Date("2025-10-03"),
    };

    this.expenses.set(expense1.id, expense1);
    this.expenses.set(expense2.id, expense2);
    this.expenses.set(expense3.id, expense3);
    this.expenses.set(expense11.id, expense11);
    this.expenses.set(expense12.id, expense12);
    this.expenses.set(expense13.id, expense13);
    this.expenses.set(expense4.id, expense4);
    this.expenses.set(expense5.id, expense5);
    this.expenses.set(expense6.id, expense6);
    this.expenses.set(expense7.id, expense7);
    this.expenses.set(expense8.id, expense8);
    this.expenses.set(expense9.id, expense9);
    this.expenses.set(expense10.id, expense10);

    const split1_1: SharewiseExpenseSplit = {
      id: "split-1-1",
      expenseId: expense1.id,
      userId: userId1,
      shareAmount: "5000.00",
      owesAmount: "5000.00",
      paidAmount: "15000.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-05"),
    };

    const split1_2: SharewiseExpenseSplit = {
      id: "split-1-2",
      expenseId: expense1.id,
      userId: userId2,
      shareAmount: "5000.00",
      owesAmount: "5000.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-05"),
    };

    const split1_3: SharewiseExpenseSplit = {
      id: "split-1-3",
      expenseId: expense1.id,
      userId: userId3,
      shareAmount: "5000.00",
      owesAmount: "5000.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-05"),
    };

    const split2_1: SharewiseExpenseSplit = {
      id: "split-2-1",
      expenseId: expense2.id,
      userId: userId1,
      shareAmount: "1500.00",
      owesAmount: "1500.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-06"),
    };

    const split2_2: SharewiseExpenseSplit = {
      id: "split-2-2",
      expenseId: expense2.id,
      userId: userId2,
      shareAmount: "1500.00",
      owesAmount: "1500.00",
      paidAmount: "4500.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-06"),
    };

    const split2_3: SharewiseExpenseSplit = {
      id: "split-2-3",
      expenseId: expense2.id,
      userId: userId3,
      shareAmount: "1500.00",
      owesAmount: "1500.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-06"),
    };

    const split3_1: SharewiseExpenseSplit = {
      id: "split-3-1",
      expenseId: expense3.id,
      userId: userId1,
      shareAmount: "400.00",
      owesAmount: "400.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-17"),
    };

    const split3_2: SharewiseExpenseSplit = {
      id: "split-3-2",
      expenseId: expense3.id,
      userId: userId2,
      shareAmount: "400.00",
      owesAmount: "400.00",
      paidAmount: "1200.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-17"),
    };

    const split3_3: SharewiseExpenseSplit = {
      id: "split-3-3",
      expenseId: expense3.id,
      userId: userId3,
      shareAmount: "400.00",
      owesAmount: "400.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-17"),
    };

    // Expense 4 splits (Birthday - 4 people)
    const split4_1: SharewiseExpenseSplit = {
      id: "split-4-1",
      expenseId: expense4.id,
      userId: userId1,
      shareAmount: "875.00",
      owesAmount: "875.00",
      paidAmount: "3500.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split4_2: SharewiseExpenseSplit = {
      id: "split-4-2",
      expenseId: expense4.id,
      userId: userId2,
      shareAmount: "875.00",
      owesAmount: "875.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split4_3: SharewiseExpenseSplit = {
      id: "split-4-3",
      expenseId: expense4.id,
      userId: userId3,
      shareAmount: "875.00",
      owesAmount: "875.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split4_4: SharewiseExpenseSplit = {
      id: "split-4-4",
      expenseId: expense4.id,
      userId: userId4,
      shareAmount: "875.00",
      owesAmount: "875.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    // Expense 5 splits (Restaurant - 4 people)
    const split5_1: SharewiseExpenseSplit = {
      id: "split-5-1",
      expenseId: expense5.id,
      userId: userId1,
      shareAmount: "2000.00",
      owesAmount: "2000.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split5_2: SharewiseExpenseSplit = {
      id: "split-5-2",
      expenseId: expense5.id,
      userId: userId2,
      shareAmount: "2000.00",
      owesAmount: "2000.00",
      paidAmount: "8000.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split5_3: SharewiseExpenseSplit = {
      id: "split-5-3",
      expenseId: expense5.id,
      userId: userId3,
      shareAmount: "2000.00",
      owesAmount: "2000.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    const split5_4: SharewiseExpenseSplit = {
      id: "split-5-4",
      expenseId: expense5.id,
      userId: userId4,
      shareAmount: "2000.00",
      owesAmount: "2000.00",
      paidAmount: "0.00",
      sharePercentage: "25.00",
      shareUnits: null,
      createdAt: new Date("2025-10-13"),
    };

    // Expense 6 splits (Couple - 2 people)
    const split6_1: SharewiseExpenseSplit = {
      id: "split-6-1",
      expenseId: expense6.id,
      userId: userId1,
      shareAmount: "3250.00",
      owesAmount: "3250.00",
      paidAmount: "6500.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-15"),
    };

    const split6_2: SharewiseExpenseSplit = {
      id: "split-6-2",
      expenseId: expense6.id,
      userId: userId4,
      shareAmount: "3250.00",
      owesAmount: "3250.00",
      paidAmount: "0.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-15"),
    };

    // Expense 7 splits (Business - 2 people)
    const split7_1: SharewiseExpenseSplit = {
      id: "split-7-1",
      expenseId: expense7.id,
      userId: userId3,
      shareAmount: "6000.00",
      owesAmount: "6000.00",
      paidAmount: "12000.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-10"),
    };

    const split7_2: SharewiseExpenseSplit = {
      id: "split-7-2",
      expenseId: expense7.id,
      userId: userId5,
      shareAmount: "6000.00",
      owesAmount: "6000.00",
      paidAmount: "0.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-10"),
    };

    // Expense 8 splits (House Rent - 2 people)
    const split8_1: SharewiseExpenseSplit = {
      id: "split-8-1",
      expenseId: expense8.id,
      userId: userId1,
      shareAmount: "12500.00",
      owesAmount: "12500.00",
      paidAmount: "25000.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-01"),
    };

    const split8_2: SharewiseExpenseSplit = {
      id: "split-8-2",
      expenseId: expense8.id,
      userId: userId2,
      shareAmount: "12500.00",
      owesAmount: "12500.00",
      paidAmount: "0.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-01"),
    };

    // Expense 9 splits (Electricity - 2 people)
    const split9_1: SharewiseExpenseSplit = {
      id: "split-9-1",
      expenseId: expense9.id,
      userId: userId1,
      shareAmount: "1250.00",
      owesAmount: "1250.00",
      paidAmount: "0.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-05"),
    };

    const split9_2: SharewiseExpenseSplit = {
      id: "split-9-2",
      expenseId: expense9.id,
      userId: userId2,
      shareAmount: "1250.00",
      owesAmount: "1250.00",
      paidAmount: "2500.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-05"),
    };

    // Expense 10 splits (Internet - 2 people)
    const split10_1: SharewiseExpenseSplit = {
      id: "split-10-1",
      expenseId: expense10.id,
      userId: userId1,
      shareAmount: "600.00",
      owesAmount: "600.00",
      paidAmount: "1200.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-03"),
    };

    const split10_2: SharewiseExpenseSplit = {
      id: "split-10-2",
      expenseId: expense10.id,
      userId: userId2,
      shareAmount: "600.00",
      owesAmount: "600.00",
      paidAmount: "0.00",
      sharePercentage: "50.00",
      shareUnits: null,
      createdAt: new Date("2025-10-03"),
    };

    // Expense 11 splits (Coffee & Snacks - 3 people)
    const split11_1: SharewiseExpenseSplit = {
      id: "split-11-1",
      expenseId: expense11.id,
      userId: userId1,
      shareAmount: "150.00",
      owesAmount: "150.00",
      paidAmount: "450.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-16"),
    };

    const split11_2: SharewiseExpenseSplit = {
      id: "split-11-2",
      expenseId: expense11.id,
      userId: userId2,
      shareAmount: "150.00",
      owesAmount: "150.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-16"),
    };

    const split11_3: SharewiseExpenseSplit = {
      id: "split-11-3",
      expenseId: expense11.id,
      userId: userId3,
      shareAmount: "150.00",
      owesAmount: "150.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-16"),
    };

    // Expense 12 splits (Team Dinner - Chinese - 3 people)
    const split12_1: SharewiseExpenseSplit = {
      id: "split-12-1",
      expenseId: expense12.id,
      userId: userId1,
      shareAmount: "600.00",
      owesAmount: "600.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-18"),
    };

    const split12_2: SharewiseExpenseSplit = {
      id: "split-12-2",
      expenseId: expense12.id,
      userId: userId2,
      shareAmount: "600.00",
      owesAmount: "600.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-18"),
    };

    const split12_3: SharewiseExpenseSplit = {
      id: "split-12-3",
      expenseId: expense12.id,
      userId: userId3,
      shareAmount: "600.00",
      owesAmount: "600.00",
      paidAmount: "1800.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-18"),
    };

    // Expense 13 splits (Breakfast Meeting - 3 people)
    const split13_1: SharewiseExpenseSplit = {
      id: "split-13-1",
      expenseId: expense13.id,
      userId: userId1,
      shareAmount: "200.00",
      owesAmount: "200.00",
      paidAmount: "600.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-14"),
    };

    const split13_2: SharewiseExpenseSplit = {
      id: "split-13-2",
      expenseId: expense13.id,
      userId: userId2,
      shareAmount: "200.00",
      owesAmount: "200.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-14"),
    };

    const split13_3: SharewiseExpenseSplit = {
      id: "split-13-3",
      expenseId: expense13.id,
      userId: userId3,
      shareAmount: "200.00",
      owesAmount: "200.00",
      paidAmount: "0.00",
      sharePercentage: "33.33",
      shareUnits: null,
      createdAt: new Date("2025-10-14"),
    };

    this.splits.set(split1_1.id, split1_1);
    this.splits.set(split1_2.id, split1_2);
    this.splits.set(split1_3.id, split1_3);
    this.splits.set(split2_1.id, split2_1);
    this.splits.set(split2_2.id, split2_2);
    this.splits.set(split2_3.id, split2_3);
    this.splits.set(split3_1.id, split3_1);
    this.splits.set(split3_2.id, split3_2);
    this.splits.set(split3_3.id, split3_3);
    this.splits.set(split4_1.id, split4_1);
    this.splits.set(split4_2.id, split4_2);
    this.splits.set(split4_3.id, split4_3);
    this.splits.set(split4_4.id, split4_4);
    this.splits.set(split5_1.id, split5_1);
    this.splits.set(split5_2.id, split5_2);
    this.splits.set(split5_3.id, split5_3);
    this.splits.set(split5_4.id, split5_4);
    this.splits.set(split6_1.id, split6_1);
    this.splits.set(split6_2.id, split6_2);
    this.splits.set(split7_1.id, split7_1);
    this.splits.set(split7_2.id, split7_2);
    this.splits.set(split8_1.id, split8_1);
    this.splits.set(split8_2.id, split8_2);
    this.splits.set(split9_1.id, split9_1);
    this.splits.set(split9_2.id, split9_2);
    this.splits.set(split10_1.id, split10_1);
    this.splits.set(split10_2.id, split10_2);
    this.splits.set(split11_1.id, split11_1);
    this.splits.set(split11_2.id, split11_2);
    this.splits.set(split11_3.id, split11_3);
    this.splits.set(split12_1.id, split12_1);
    this.splits.set(split12_2.id, split12_2);
    this.splits.set(split12_3.id, split12_3);
    this.splits.set(split13_1.id, split13_1);
    this.splits.set(split13_2.id, split13_2);
    this.splits.set(split13_3.id, split13_3);

    // Activity seed data
    const activity1: SharewiseActivity = {
      id: "activity-1",
      groupId: group1Id,
      actorId: userId1,
      activityType: "group_created",
      entityId: group1Id,
      details: "Created group 'Weekend Trip to Goa'",
      createdAt: new Date("2025-10-01T10:00:00"),
    };

    const activity2: SharewiseActivity = {
      id: "activity-2",
      groupId: group1Id,
      actorId: userId2,
      activityType: "member_joined",
      entityId: "member-1-2",
      details: "Joined the group",
      createdAt: new Date("2025-10-01T10:30:00"),
    };

    const activity3: SharewiseActivity = {
      id: "activity-3",
      groupId: group1Id,
      actorId: userId3,
      activityType: "member_joined",
      entityId: "member-1-3",
      details: "Joined the group",
      createdAt: new Date("2025-10-02T09:00:00"),
    };

    const activity4: SharewiseActivity = {
      id: "activity-4",
      groupId: group1Id,
      actorId: userId1,
      activityType: "expense_added",
      entityId: expense1.id,
      details: "Added expense 'Hotel Booking' for ₹12,000.00",
      createdAt: new Date("2025-10-05T14:00:00"),
    };

    const activity5: SharewiseActivity = {
      id: "activity-5",
      groupId: group1Id,
      actorId: userId2,
      activityType: "expense_added",
      entityId: expense2.id,
      details: "Added expense 'Beach Restaurant Dinner' for ₹2,400.00",
      createdAt: new Date("2025-10-06T20:30:00"),
    };

    const activity6: SharewiseActivity = {
      id: "activity-6",
      groupId: group1Id,
      actorId: userId3,
      activityType: "expense_added",
      entityId: expense3.id,
      details: "Added expense 'Scooter Rental' for ₹1,800.00",
      createdAt: new Date("2025-10-07T11:00:00"),
    };

    const activity7: SharewiseActivity = {
      id: "activity-7",
      groupId: group2Id,
      actorId: userId2,
      activityType: "group_created",
      entityId: group2Id,
      details: "Created group 'Office Lunch Group'",
      createdAt: new Date("2025-09-15T09:00:00"),
    };

    const activity8: SharewiseActivity = {
      id: "activity-8",
      groupId: group2Id,
      actorId: userId1,
      activityType: "member_joined",
      entityId: "member-2-1",
      details: "Joined the group",
      createdAt: new Date("2025-09-15T09:15:00"),
    };

    const activity9: SharewiseActivity = {
      id: "activity-9",
      groupId: group2Id,
      actorId: userId2,
      activityType: "expense_added",
      entityId: expense4.id,
      details: "Added expense 'Team Lunch at Italian Place' for ₹1,500.00",
      createdAt: new Date("2025-09-20T13:30:00"),
    };

    const activity10: SharewiseActivity = {
      id: "activity-10",
      groupId: group2Id,
      actorId: userId3,
      activityType: "expense_added",
      entityId: expense5.id,
      details: "Added expense 'Pizza Friday' for ₹900.00",
      createdAt: new Date("2025-09-27T12:45:00"),
    };

    const activity11: SharewiseActivity = {
      id: "activity-11",
      groupId: group3Id,
      actorId: userId1,
      activityType: "group_created",
      entityId: group3Id,
      details: "Created group 'House Rent & Utilities'",
      createdAt: new Date("2025-08-01T10:00:00"),
    };

    const activity12: SharewiseActivity = {
      id: "activity-12",
      groupId: group3Id,
      actorId: userId2,
      activityType: "member_joined",
      entityId: "member-3-2",
      details: "Joined the group",
      createdAt: new Date("2025-08-01T10:30:00"),
    };

    const activity13: SharewiseActivity = {
      id: "activity-13",
      groupId: group3Id,
      actorId: userId1,
      activityType: "expense_added",
      entityId: expense6.id,
      details: "Added expense 'Monthly Rent - October' for ₹25,000.00",
      createdAt: new Date("2025-10-01T09:00:00"),
    };

    const activity14: SharewiseActivity = {
      id: "activity-14",
      groupId: group3Id,
      actorId: userId2,
      activityType: "expense_added",
      entityId: expense7.id,
      details: "Added expense 'Electricity Bill' for ₹1,200.00",
      createdAt: new Date("2025-10-05T16:00:00"),
    };

    const activity15: SharewiseActivity = {
      id: "activity-15",
      groupId: group3Id,
      actorId: userId1,
      activityType: "expense_added",
      entityId: expense8.id,
      details: "Added expense 'Internet & WiFi' for ₹800.00",
      createdAt: new Date("2025-10-08T11:00:00"),
    };

    const activity16: SharewiseActivity = {
      id: "activity-16",
      groupId: group4Id,
      actorId: userId2,
      activityType: "group_created",
      entityId: group4Id,
      details: "Created group 'Birthday Celebration'",
      createdAt: new Date("2025-10-12T08:00:00"),
    };

    const activity17: SharewiseActivity = {
      id: "activity-17",
      groupId: group4Id,
      actorId: userId1,
      activityType: "expense_added",
      entityId: expense9.id,
      details: "Added expense 'Birthday Cake & Decorations' for ₹3,500.00",
      createdAt: new Date("2025-10-12T15:00:00"),
    };

    const activity18: SharewiseActivity = {
      id: "activity-18",
      groupId: group4Id,
      actorId: userId3,
      activityType: "expense_added",
      entityId: expense10.id,
      details: "Added expense 'Party Venue Booking' for ₹8,000.00",
      createdAt: new Date("2025-10-12T16:00:00"),
    };

    const activity19: SharewiseActivity = {
      id: "activity-19",
      groupId: group5Id,
      actorId: userId1,
      activityType: "group_created",
      entityId: group5Id,
      details: "Created group 'Couple Expenses'",
      createdAt: new Date("2025-07-01T10:00:00"),
    };

    const activity20: SharewiseActivity = {
      id: "activity-20",
      groupId: group5Id,
      actorId: userId2,
      activityType: "expense_added",
      entityId: expense11.id,
      details: "Added expense 'Grocery Shopping' for ₹3,200.00",
      createdAt: new Date("2025-10-15T18:00:00"),
    };

    const activity21: SharewiseActivity = {
      id: "activity-21",
      groupId: group5Id,
      actorId: userId1,
      activityType: "expense_added",
      entityId: expense12.id,
      details: "Added expense 'Movie & Dinner Date' for ₹1,800.00",
      createdAt: new Date("2025-10-16T21:00:00"),
    };

    const activity22: SharewiseActivity = {
      id: "activity-22",
      groupId: group6Id,
      actorId: userId3,
      activityType: "group_created",
      entityId: group6Id,
      details: "Created group 'Business Trip - Mumbai'",
      createdAt: new Date("2025-10-10T07:00:00"),
    };

    const activity23: SharewiseActivity = {
      id: "activity-23",
      groupId: group6Id,
      actorId: userId3,
      activityType: "expense_added",
      entityId: expense13.id,
      details: "Added expense 'Client Meeting Lunch' for ₹600.00",
      createdAt: new Date("2025-10-10T13:00:00"),
    };

    this.activity.set(activity1.id, activity1);
    this.activity.set(activity2.id, activity2);
    this.activity.set(activity3.id, activity3);
    this.activity.set(activity4.id, activity4);
    this.activity.set(activity5.id, activity5);
    this.activity.set(activity6.id, activity6);
    this.activity.set(activity7.id, activity7);
    this.activity.set(activity8.id, activity8);
    this.activity.set(activity9.id, activity9);
    this.activity.set(activity10.id, activity10);
    this.activity.set(activity11.id, activity11);
    this.activity.set(activity12.id, activity12);
    this.activity.set(activity13.id, activity13);
    this.activity.set(activity14.id, activity14);
    this.activity.set(activity15.id, activity15);
    this.activity.set(activity16.id, activity16);
    this.activity.set(activity17.id, activity17);
    this.activity.set(activity18.id, activity18);
    this.activity.set(activity19.id, activity19);
    this.activity.set(activity20.id, activity20);
    this.activity.set(activity21.id, activity21);
    this.activity.set(activity22.id, activity22);
    this.activity.set(activity23.id, activity23);
  }

  // Group Operations
  async listGroupsByUser(userId: string): Promise<GroupWithMembers[]> {
    let userGroupIds = Array.from(this.members.values())
      .filter(m => m.userId === userId && m.status === 'active')
      .map(m => m.groupId);

    // If user has no groups, add them to dummy groups for demo purposes
    if (userGroupIds.length === 0 && this.groups.size > 0) {
      const dummyGroupIds = ["group-1", "group-2", "group-3", "group-4"];
      for (const groupId of dummyGroupIds) {
        if (this.groups.has(groupId)) {
          const memberId = `member-${userId}-${groupId}`;
          const member: SharewiseGroupMember = {
            id: memberId,
            groupId: groupId,
            userId: userId,
            role: "member",
            status: "active",
            joinedAt: new Date(),
          };
          this.members.set(memberId, member);
          userGroupIds.push(groupId);
        }
      }
    }

    const groups = Array.from(this.groups.values())
      .filter(g => userGroupIds.includes(g.id))
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));

    return Promise.all(groups.map(async group => {
      const members = await this.getGroupMembers(group.id);
      return {
        ...group,
        members,
        memberCount: members.length
      };
    }));
  }

  async getGroup(id: string): Promise<SharewiseGroup | undefined> {
    return this.groups.get(id);
  }

  async getGroupWithMembers(id: string): Promise<GroupWithMembers | undefined> {
    const group = await this.getGroup(id);
    if (!group) return undefined;

    const members = await this.getGroupMembers(id);
    return {
      ...group,
      members,
      memberCount: members.length
    };
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check if code already exists
    const exists = Array.from(this.groups.values()).some(g => g.inviteCode === code);
    return exists ? this.generateInviteCode() : code;
  }

  async createGroup(insertGroup: InsertSharewiseGroup): Promise<SharewiseGroup> {
    const id = randomUUID();
    const inviteCode = this.generateInviteCode();
    const group: SharewiseGroup = {
      ...insertGroup,
      id,
      inviteCode,
      description: insertGroup.description ?? null,
      groupType: insertGroup.groupType ?? null,
      groupPhoto: insertGroup.groupPhoto ?? null,
      groupColor: insertGroup.groupColor ?? null,
      currency: insertGroup.currency ?? null,
      isArchived: insertGroup.isArchived ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.groups.set(id, group);

    // Add creator as owner
    await this.addGroupMember({
      groupId: id,
      userId: insertGroup.createdBy,
      role: 'owner',
      status: 'active',
    });

    return group;
  }

  async getGroupByInviteCode(inviteCode: string): Promise<SharewiseGroup | undefined> {
    return Array.from(this.groups.values()).find(g => g.inviteCode === inviteCode);
  }

  async updateGroup(id: string, updates: Partial<SharewiseGroup>): Promise<SharewiseGroup | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;

    const updatedGroup = {
      ...group,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const deleted = this.groups.delete(id);
    if (deleted) {
      // Delete all related data (cascade handled by Map cleanup)
      Array.from(this.members.values())
        .filter(m => m.groupId === id)
        .forEach(m => this.members.delete(m.id));
      
      Array.from(this.expenses.values())
        .filter(e => e.groupId === id)
        .forEach(e => {
          // Delete splits for this expense
          Array.from(this.splits.values())
            .filter(s => s.expenseId === e.id)
            .forEach(s => this.splits.delete(s.id));
          this.expenses.delete(e.id);
        });
      
      Array.from(this.settlements.values())
        .filter(s => s.groupId === id)
        .forEach(s => this.settlements.delete(s.id));
    }
    return deleted;
  }

  // Member Operations
  async getGroupMembers(groupId: string): Promise<SharewiseGroupMember[]> {
    return Array.from(this.members.values())
      .filter(m => m.groupId === groupId && m.status === 'active')
      .sort((a, b) => (a.joinedAt?.getTime() || 0) - (b.joinedAt?.getTime() || 0));
  }

  async addGroupMember(insertMember: InsertSharewiseGroupMember): Promise<SharewiseGroupMember> {
    const id = randomUUID();
    const member: SharewiseGroupMember = {
      ...insertMember,
      id,
      role: insertMember.role ?? null,
      status: insertMember.status ?? null,
      joinedAt: new Date(),
    };
    this.members.set(id, member);
    return member;
  }

  async removeGroupMember(groupId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.members.values())
      .find(m => m.groupId === groupId && m.userId === userId);
    
    if (!member) return false;

    // Mark as removed instead of deleting
    member.status = 'removed';
    this.members.set(member.id, member);
    return true;
  }

  async updateMemberRole(groupId: string, userId: string, role: string): Promise<SharewiseGroupMember | undefined> {
    const member = Array.from(this.members.values())
      .find(m => m.groupId === groupId && m.userId === userId);
    
    if (!member) return undefined;

    member.role = role;
    this.members.set(member.id, member);
    return member;
  }

  // Expense Operations
  async listExpensesByGroup(groupId: string): Promise<ExpenseWithSplits[]> {
    const expenses = Array.from(this.expenses.values())
      .filter(e => e.groupId === groupId)
      .sort((a, b) => (b.occurredAt?.getTime() || 0) - (a.occurredAt?.getTime() || 0));

    return Promise.all(expenses.map(async expense => {
      const splits = await this.getExpenseSplits(expense.id);
      return {
        ...expense,
        splits
      };
    }));
  }

  async getExpense(id: string): Promise<SharewiseExpense | undefined> {
    return this.expenses.get(id);
  }

  async getExpenseWithSplits(id: string): Promise<ExpenseWithSplits | undefined> {
    const expense = await this.getExpense(id);
    if (!expense) return undefined;

    const splits = await this.getExpenseSplits(id);
    return {
      ...expense,
      splits
    };
  }

  async createExpense(
    insertExpense: InsertSharewiseExpense,
    insertSplits: InsertSharewiseExpenseSplit[]
  ): Promise<ExpenseWithSplits> {
    const id = randomUUID();
    const expense: SharewiseExpense = {
      ...insertExpense,
      id,
      notes: insertExpense.notes ?? null,
      currency: insertExpense.currency ?? null,
      splitType: insertExpense.splitType ?? null,
      attachmentUrl: insertExpense.attachmentUrl ?? null,
      attachmentType: insertExpense.attachmentType ?? null,
      ocrData: insertExpense.ocrData ?? null,
      isRecurring: insertExpense.isRecurring ?? null,
      recurringFrequency: insertExpense.recurringFrequency ?? null,
      recurringEndDate: insertExpense.recurringEndDate ?? null,
      parentExpenseId: insertExpense.parentExpenseId ?? null,
      occurredAt: insertExpense.occurredAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.expenses.set(id, expense);

    // Create splits
    const splits = await Promise.all(
      insertSplits.map(async (insertSplit) => {
        const splitId = randomUUID();
        const split: SharewiseExpenseSplit = {
          ...insertSplit,
          id: splitId,
          expenseId: id,
          sharePercentage: insertSplit.sharePercentage ?? null,
          shareUnits: insertSplit.shareUnits ?? null,
          paidAmount: insertSplit.paidAmount ?? null,
          createdAt: new Date(),
        };
        this.splits.set(splitId, split);
        return split;
      })
    );

    return {
      ...expense,
      splits
    };
  }

  async updateExpense(id: string, updates: Partial<SharewiseExpense>): Promise<SharewiseExpense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    // Protect immutable fields
    const { 
      id: _id, 
      groupId: _groupId, 
      paidBy: _paidBy, 
      createdBy: _createdBy, 
      createdAt: _createdAt,
      ...safeUpdates 
    } = updates as any;

    const updatedExpense = {
      ...expense,
      ...safeUpdates,
      id,
      updatedAt: new Date(),
    };
    
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const deleted = this.expenses.delete(id);
    if (deleted) {
      // Delete all splits for this expense
      Array.from(this.splits.values())
        .filter(s => s.expenseId === id)
        .forEach(s => this.splits.delete(s.id));
    }
    return deleted;
  }

  async getExpenseSplits(expenseId: string): Promise<SharewiseExpenseSplit[]> {
    return Array.from(this.splits.values())
      .filter(s => s.expenseId === expenseId);
  }

  // Settlement Operations
  async listSettlementsByGroup(groupId: string): Promise<SharewiseSettlement[]> {
    return Array.from(this.settlements.values())
      .filter(s => s.groupId === groupId)
      .sort((a, b) => (b.settledAt?.getTime() || 0) - (a.settledAt?.getTime() || 0));
  }

  async createSettlement(insertSettlement: InsertSharewiseSettlement): Promise<SharewiseSettlement> {
    const id = randomUUID();
    const settlement: SharewiseSettlement = {
      ...insertSettlement,
      id,
      currency: insertSettlement.currency ?? null,
      method: insertSettlement.method ?? null,
      notes: insertSettlement.notes ?? null,
      settledAt: new Date(),
      createdAt: new Date(),
    };
    this.settlements.set(id, settlement);
    return settlement;
  }

  // Balance Calculations
  async computeGroupBalances(groupId: string): Promise<MemberBalance[]> {
    const expenses = await this.listExpensesByGroup(groupId);
    const settlements = await this.listSettlementsByGroup(groupId);
    const members = await this.getGroupMembers(groupId);

    const balanceMap = new Map<string, MemberBalance>();

    // Initialize balances for all members
    members.forEach(member => {
      balanceMap.set(member.userId, {
        userId: member.userId,
        netBalance: 0,
        totalPaid: 0,
        totalOwed: 0,
      });
    });

    // Calculate from expenses
    expenses.forEach(expense => {
      const totalAmount = parseFloat(expense.amount);
      const paidBy = expense.paidBy;

      // Add to payer's total paid
      const payerBalance = balanceMap.get(paidBy);
      if (payerBalance) {
        payerBalance.totalPaid += totalAmount;
        payerBalance.netBalance += totalAmount;
      }

      // Subtract from each person's share
      expense.splits.forEach(split => {
        const owesAmount = parseFloat(split.owesAmount);
        const balance = balanceMap.get(split.userId);
        if (balance) {
          balance.totalOwed += owesAmount;
          balance.netBalance -= owesAmount;
        }
      });
    });

    // Adjust for settlements
    settlements.forEach(settlement => {
      const amount = parseFloat(settlement.amount);
      
      const fromBalance = balanceMap.get(settlement.fromUserId);
      if (fromBalance) {
        fromBalance.netBalance += amount;
      }

      const toBalance = balanceMap.get(settlement.toUserId);
      if (toBalance) {
        toBalance.netBalance -= amount;
      }
    });

    return Array.from(balanceMap.values());
  }

  async generateSettlementSuggestions(groupId: string): Promise<SettlementSuggestion[]> {
    const balances = await this.computeGroupBalances(groupId);
    
    // Separate people who owe from people who are owed
    const owes = balances.filter(b => b.netBalance < 0).map(b => ({ ...b }));
    const owed = balances.filter(b => b.netBalance > 0).map(b => ({ ...b }));

    const suggestions: SettlementSuggestion[] = [];

    // Greedy algorithm to minimize transactions
    let i = 0, j = 0;
    while (i < owes.length && j < owed.length) {
      const debt = Math.abs(owes[i].netBalance);
      const credit = owed[j].netBalance;

      const amount = Math.min(debt, credit);
      
      if (amount > 0.01) { // Ignore very small amounts
        suggestions.push({
          fromUserId: owes[i].userId,
          toUserId: owed[j].userId,
          amount: parseFloat(amount.toFixed(2))
        });
      }

      owes[i].netBalance += amount;
      owed[j].netBalance -= amount;

      if (Math.abs(owes[i].netBalance) < 0.01) i++;
      if (owed[j].netBalance < 0.01) j++;
    }

    return suggestions;
  }

  // Analytics
  async getGroupAnalytics(groupId: string) {
    const expenses = await this.listExpensesByGroup(groupId);
    const members = await this.getGroupMembers(groupId);

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    let totalSpent = 0;

    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      totalSpent += amount;
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount;
    });

    // Member spending (who paid what)
    const memberPaid: Record<string, number> = {};
    expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      memberPaid[expense.paidBy] = (memberPaid[expense.paidBy] || 0) + amount;
    });

    return {
      totalSpent,
      expenseCount: expenses.length,
      categoryBreakdown: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100
      })),
      memberSpending: Object.entries(memberPaid).map(([userId, amount]) => ({
        userId,
        amount,
        percentage: (amount / totalSpent) * 100
      }))
    };
  }

  // Activity tracking
  async logActivity(insertActivity: InsertSharewiseActivity): Promise<SharewiseActivity> {
    const id = randomUUID();
    const activity: SharewiseActivity = {
      ...insertActivity,
      id,
      entityId: insertActivity.entityId ?? null,
      details: insertActivity.details ?? null,
      createdAt: new Date(),
    };
    this.activity.set(id, activity);
    return activity;
  }

  async listActivityByGroup(groupId: string): Promise<SharewiseActivity[]> {
    return Array.from(this.activity.values())
      .filter(a => a.groupId === groupId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}
