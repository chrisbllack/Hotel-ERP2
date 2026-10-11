// Shared domain types — mirror the platform data model (ADR-0006 submodules)

export type RoomStatus =
  | "occupied_clean"
  | "occupied_dirty"
  | "vacant_clean"
  | "vacant_dirty"
  | "reserved"
  | "out_of_order"
  | "out_of_service";

export interface Room {
  id: string;
  number: string;
  roomTypeId: string;
  floorId: string;
  status: RoomStatus;
  housekeepingStatus: "clean" | "dirty" | "inspected";
  wing?: "East" | "West";
  bedType?: "King" | "Twin" | "Queen" | "Suite";
  features?: string[];
  connectingRoomId?: string | null;
  connectingRoomNumber?: string | null;
  oooReason?: string;
  oooReturnDate?: string;
  outOfOrderReason?: string;
  outOfOrderReturnDate?: string;
  assignedHousekeeper?: string | null;
  cleaningCredits?: number;
  dndActive?: boolean;
  murActive?: boolean;
}

export interface RoomType {
  id: string;
  code: string;
  name: string;
  baseRate: number;
  maxOccupancy: number;
  description?: string;
  amenities?: string[];
}

export type GuestFlag = "VIP" | "Blacklist" | "High-Spend";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  company: string;
  idType?: string;
  idNumber?: string;
  vipTier?: "Standard" | "Silver" | "Gold" | "Platinum" | "Diamond";
  totalStays?: number;
  lifetimeSpend?: number;
  preferences?: string[];
  flags?: GuestFlag[];
  blacklistReason?: string;
  flagNotes?: string;
}

export type ReservationStatus =
  | "confirmed"
  | "tentative"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

export interface Reservation {
  id: string;
  confirmationNumber: string;
  confirmationCode?: string;
  guestId: string;
  roomTypeId: string | null;
  roomId: string | null;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  adults: number;
  children: number;
  status: ReservationStatus;
  source: string;
  totalEstimate: number;
  depositPaid: number;
  isVip: boolean;
  ratePlanCode?: string;
  ratePerNight?: number;
  rateAdjustment?: number;
  marketSegment?: string;
  specialRequests?: string;
  keyCardsIssued?: number;
  assignedRoomNumber?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  guestName?: string;
}

export interface GuestStay {
  id: string;
  reservationId: string;
  guestId: string;
  guestName?: string;
  confirmationCode?: string;
  roomId: string;
  expectedArrival: string;
  expectedDeparture: string;
  status: "active" | "departed";
  actualArrival?: string;
  actualDeparture?: string;
}

export interface Folio {
  id: string;
  guestStayId: string;
  reservationId?: string;
  folioNumber: string;
  status: "open" | "closed";
  balance: number; // negative = guest owes (debits exceed credits)
  currency: string;
  guestName?: string;
  roomNumber?: string;
}

export interface FolioLine {
  id?: string;
  folioId: string;
  type?: "debit" | "credit";
  description: string;
  amount: number;
  window?: number; // 1: Room & Tax, 2: Extras & Incidental, 3: Direct Bill
  windowNumber?: number;
  chargeCode?: string;
  date?: string;
  department?: string;
  reference?: string;
  taxAmount?: number;
  serviceCharge?: number;
  subtotal?: number;
  totalAmount?: number;
  paymentMethod?: string;
  postedAt?: string;
  postedBy?: string;
  status?: "posted" | "void";
}

export interface GuestTrace {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  department: "front_desk" | "housekeeping" | "room_service" | "concierge" | "maintenance";
  message: string;
  time: string;
  status: "pending" | "resolved";
  resolvedBy?: string;
}

export interface KeyCardRecord {
  id: string;
  reservationId: string;
  roomNumber: string;
  guestName: string;
  keyType: "guest" | "duplicate" | "master" | "mobile_nfc";
  issuedAt: string;
  validUntil: string;
  cardUid: string;
  status: "active" | "revoked";
}

export interface NightAudit {
  id: string;
  businessDate: string;
  totalRooms: number;
  occupiedRooms: number;
  arrivals: number;
  departures: number;
  noShows: number;
  totalRoomCharges: number;
  totalTax: number;
  totalPayments: number;
  status: "completed" | "pending";
}

export interface Outlet {
  id: string;
  name: string;
  code: string;
  type: "restaurant" | "bar" | "room_service";
  status: "active" | "inactive";
}

export interface MenuCategory {
  id: string;
  name: string;
  outletId: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  price: number;
  isAvailable: boolean;
  preparationTime: number;
}

export interface PosOrder {
  id: string;
  outletId: string;
  orderNumber: string;
  status: "open" | "closed" | "voided";
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paymentStatus: "paid" | "pending" | "voided";
  createdAt: string;
}

export interface PosOrderLine {
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  status: "completed" | "pending" | "voided";
}

export type HkTaskStatus = "pending" | "in_progress" | "completed" | "inspected";
export type HkPriority = "normal" | "high" | "urgent";

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber?: string;
  taskType: string;
  priority: HkPriority;
  status: HkTaskStatus;
  assignedTo: string | null;
  description?: string;
  createdAt?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  departmentId: string;
  position: string;
  salary: number;
  shift?: "morning" | "evening" | "night" | "rotating";
  status: "active" | "on_leave" | "terminated";
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface GlAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountClass: "asset" | "liability" | "equity" | "revenue" | "expense";
  accountType: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  description: string;
  status: "draft" | "posted" | "reversed";
}

export interface CashierShift {
  id: string;
  shiftNumber: string;
  openingFloat: number;
  closingFloat: number | null;
  totalSales: number;
  totalRefunds: number;
  status: "open" | "closed";
}

export interface LoyaltyTier {
  id: string;
  name: string;
  code: string;
  minPoints: number;
  discountPercent: number;
  benefits: string;
  status: "active" | "inactive";
}

export interface PaymentMethod {
  name: string;
  code: string;
  type: "cash" | "card" | "transfer" | "online" | "mobile" | "credit" | "complimentary";
  isActive: boolean;
}

export interface EventBooking {
  id: string;
  name: string;
  eventType: string;
  clientName: string;
  venueId: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  packageName: string;
  totalAmount: number;
  status: "inquiry" | "tentative" | "confirmed" | "completed" | "cancelled";
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  status: "available" | "maintenance";
}

export interface Channel {
  id: string;
  name: string;
  code: string;
  type: "ota" | "gds" | "direct" | "wholesaler";
  status: "connected" | "disconnected" | "error";
  lastSyncAt: string | null;
}

export interface HardwareDevice {
  id: string;
  deviceType: "door_lock" | "printer" | "pos_terminal" | "kds" | "scanner" | "iptv" | "biometric";
  vendor: string;
  model: string;
  serialNumber: string;
  location: string;
  status: "online" | "offline" | "error";
  lastHealthCheck: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
}

export type Role =
  | "admin"
  | "general_manager"
  | "front_desk"
  | "cashier"
  | "housekeeping"
  | "fnb"
  | "accountant"
  | "hr";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "System Administrator",
  general_manager: "General Manager",
  front_desk: "Front Desk",
  cashier: "Cashier",
  housekeeping: "Housekeeping",
  fnb: "Food & Beverage",
  accountant: "Accountant",
  hr: "Human Resources",
};

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  module: string;
  action: string;
  entityId: string;
  createdAt: string;
}

export interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  reorderLevel: number;
}

export interface StockLevel {
  productId: string;
  storeId: string;
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  type: "main" | "kitchen" | "bar" | "housekeeping";
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  paymentTerms: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  orderDate: string;
  status: "draft" | "pending_approval" | "approved" | "received" | "cancelled";
  total: number;
}

// ----------------- Shift Handover -----------------
export interface ShiftHandoverTask {
  id: string;
  description: string;
  category: "checkout" | "vip_arrival" | "wakeup_call" | "luggage" | "maintenance" | "key_audit" | "other";
  status: "pending" | "completed" | "in_progress";
  priority: "normal" | "high" | "urgent";
  dueTime?: string;
}

export interface ShiftGuestNote {
  id: string;
  guestName: string;
  roomNumber: string;
  note: string;
  severity: "info" | "attention" | "urgent";
  actionRequired?: string;
}

export interface ShiftHandoverRecord {
  id: string;
  handoverNumber: string;
  shiftType: "morning_am" | "evening_pm" | "night_graveyard";
  shiftDate: string;
  departingStaffName: string;
  incomingStaffName: string;
  status: "draft" | "submitted" | "acknowledged";
  submittedAt: string;
  acknowledgedAt?: string;
  
  // Cash Drawer Counts & Float
  openingFloat: number;
  expectedCashDrop: number;
  countedCashTotal: number;
  cashVariance: number;
  varianceExplanation?: string;
  denominations: {
    n1000: number;
    n500: number;
    n200: number;
    n100: number;
    n50: number;
  };
  posCardBatchesSettled: boolean;
  totalCardPayments: number;
  
  // Tasks & Responsibilities
  tasks: ShiftHandoverTask[];
  
  // Critical Guest Notes & Incident Log
  guestNotes: ShiftGuestNote[];
  
  // Security Verification
  departingStaffPinVerified: boolean;
  incomingStaffPinVerified: boolean;
  handoverSummaryNotes: string;
}

// ----------------- Preventative Maintenance -----------------
export type EquipmentType =
  | "hvac"
  | "door_lock"
  | "plumbing"
  | "fire_safety"
  | "generator"
  | "elevator"
  | "electrical"
  | "tv_av";

export type RecurringFrequency =
  | "weekly"
  | "bi_weekly"
  | "monthly"
  | "quarterly"
  | "semi_annual"
  | "annual";

export interface PreventativeMaintenanceChecklistItem {
  id: string;
  item?: string;
  task?: string;
  expectedReading?: string;
  passed?: boolean;
  reading?: string;
  notes?: string;
}

export interface PreventativeMaintenanceSchedule {
  id: string;
  scheduleCode: string;
  title: string;
  equipmentType: EquipmentType | "HVAC & Air Con" | "Fire & Smoke Safety" | "Plumbing & Water Heaters" | "RFID Door Locks" | "Electrical & Backup Generator" | "Elevators & Lifts" | "Refrigeration & Minibars" | "Windows & Balconies";
  targetType?: "room" | "floor" | "common_area" | "central_plant";
  targetIds?: string[];
  targetLocations?: string[];
  frequency: RecurringFrequency;
  assignedEngineer: string;
  lastCompletedDate?: string | null;
  nextDueDate: string;
  status: "scheduled" | "due_soon" | "overdue" | "in_progress" | "completed" | "active";
  checklist: PreventativeMaintenanceChecklistItem[];
  complianceScore?: number;
  notes?: string;
  estimatedDurationMinutes?: number;
  compliancePercentage?: number;
}

export interface PmInspectionLog {
  id: string;
  scheduleId: string;
  scheduleTitle: string;
  equipmentType: string;
  inspectedTarget: string;
  technicianName?: string;
  inspectedAt?: string;
  result?: "passed" | "passed_with_notes" | "failed_repair_needed" | "passed_minor_issues";
  readings?: Record<string, string>;
  findings?: string;
  spawnedWorkOrderId?: string;
  measuredReadings?: { label: string; target: string; actual: string }[];
  findingsAndRepairs?: string;
}

// ----------------- Yield & Revenue Management -----------------
export interface CompetitorRate {
  competitorName: string;
  roomType: string;
  rate: number;
  varianceVsUs: number;
  channel: string;
}

export interface MarketEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  impactLevel: "low" | "medium" | "high" | "compression";
  estimatedInflow: string;
}

export interface DynamicRateRecommendation {
  id?: string;
  roomTypeId: string;
  roomTypeName: string;
  currentBaseRate: number;
  recommendedRate: number;
  variancePercent: number;
  confidenceScore: number;
  demandFactor: "High Weekend Pace" | "Compression Event" | "Low Mid-week Demand" | "Competitor Undercut" | "Surge Occupancy";
  suggestedAction: "Increase Rate" | "Decrease Rate" | "Hold Base" | "Attach Min Length of Stay";
  minStayRequirement?: number;
  projectedRevPARGain: number;
  applied: boolean;
  targetDate?: string;
  percentageAdjustment?: number;
  rationale?: string;
  projectedRevparGain?: number;
  competitorAvgRate?: number;
}

export interface YieldRule {
  id: string;
  name: string;
  condition?: string;
  action?: string;
  isActive: boolean;
  lastTriggered?: string;
  conditionType?: string;
  thresholdValue?: number;
  actionAdjustmentPercent?: number;
  description?: string;
}

// ----------------- Night Audit -----------------
export interface NightAuditReport {
  id: string;
  businessDate: string;
  completedAt: string;
  auditorName: string;
  roomsCharged: number;
  totalRoomRevenue: number;
  totalTaxPosted: number;
  totalServiceChargePosted: number;
  totalFnbRevenue: number;
  totalOtherRevenue: number;
  grandTotalRevenue: number;
  totalPaymentsCollected: number;
  cityLedgerTransfers: number;
  cashierVariancesTotal: number;
  noShowsCount: number;
  roomsOooCount: number;
  endingOccupancyRate: number;
  adr: number;
  revpar: number;
  trialBalanceBalanced: boolean;
  status: "balanced" | "warnings" | "posted";
}

// ----------------- Guest Sentiment & CRM -----------------
export interface GuestSurveyResponse {
  id: string;
  guestId?: string;
  guestName: string;
  stayId?: string;
  roomNumber: string;
  checkoutDate: string;
  submittedAt: string;
  channel: "Post-Stay Email" | "In-Room QR / Tablet" | "WhatsApp Concierge" | "OTA Direct Review" | "Google Review" | "post_stay_email" | "in_room_qr" | "whatsapp_concierge" | "ota_direct_review" | "google_review";
  overallScore: number;
  npsType?: "promoter" | "passive" | "detractor";
  categories: {
    frontDesk: number;
    cleanliness: number;
    dining: number;
    roomComfort: number;
    comfort?: number;
    value: number;
  };
  sentiment: "positive" | "neutral" | "negative" | "promoter" | "passive" | "detractor";
  comment: string;
  highlights?: string[];
  highlightTags?: string[];
  reservationId?: string;
  serviceRecoveryTicketId?: string;
}

export interface ServiceRecoveryTicket {
  id: string;
  surveyId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomNumber: string;
  issueSummary: string;
  department: "Front Desk" | "Housekeeping" | "Food & Beverage" | "Maintenance" | "Billing";
  priority: "high" | "urgent";
  status: "open" | "contacted" | "compensation_offered" | "resolved";
  assignedManager: string;
  compensationOffered?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ----------------- Lost and Found (M-HKP) -----------------
export type LostAndFoundStatus = "logged" | "claimed" | "returned" | "disposed";

export interface LostAndFoundItem {
  id: string;
  itemNumber: string;
  name: string;
  category: "Electronics" | "Jewelry & Valuables" | "Clothing & Apparel" | "Documents & Passports" | "Bags & Luggage" | "Keys & Cards" | "Other";
  description: string;
  roomNumber?: string;
  locationFound: string;
  foundByStaffName: string;
  foundDate: string;
  estimatedValue?: number;
  storageLocker: string;
  status: LostAndFoundStatus;
  guestId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  claimedAt?: string;
  claimedBy?: string;
  returnedAt?: string;
  returnedByStaff?: string;
  disposedAt?: string;
  disposalReason?: string;
  emailSentAt?: string;
  notes?: string;
}

// ----------------- Room Energy Consumption & BMS (M-ENG) -----------------
export interface RoomEnergyReading {
  roomId: string;
  roomNumber: string;
  floor: number;
  occupancyStatus: "occupied" | "vacant";
  keycardInserted: boolean;
  powerDrawKw: number;
  dailyKwh: number;
  currentTemp: number; // in Celsius
  targetTemp: number;
  hvacState: "cooling" | "heating" | "fan_only" | "eco_standby" | "off";
  lightingState: "all_off" | "partial" | "all_on";
  waterFlowLpm: number;
  highConsumptionAlert: boolean;
  alertReason?: string;
  ecoModeEngaged: boolean;
  lastTelemetryTime: string;
}

// ----------------- Smart Room Controls & Guest Portal (M-GST) -----------------
export interface SmartRoomControl {
  roomId: string;
  roomNumber: string;
  reservationId?: string;
  guestName?: string;
  dndActive: boolean; // Do Not Disturb
  murActive: boolean; // Make Up Room
  targetTemperature: number; // 16 - 28 Celsius
  currentTemperature: number;
  hvacMode: "cool" | "heat" | "fan" | "eco" | "off";
  fanSpeed: "auto" | "low" | "medium" | "high";
  lightingScene: "all_off" | "relax" | "bright" | "night" | "work" | "ambient" | "custom";
  lights: {
    master: boolean;
    entryway: boolean;
    bedroom: boolean;
    bathroom: boolean;
    nightstand: boolean;
  };
  doorLocked: boolean;
  privacyLatchEngaged: boolean;
  lastUpdated: string;
}

// ----------------- Hospitality Finance & Accounting (USALI) -----------------
export interface USALILineItem {
  code: string;
  name: string;
  monthActual: number;
  monthBudget: number;
  monthVariance: number;
  ytdActual: number;
  ytdBudget: number;
  pctRevenue: number;
}

export interface USALIDepartmentStatement {
  department: "Rooms" | "Food & Beverage" | "Other Operated" | "Undistributed A&G" | "Undistributed POM" | "Undistributed Utilities" | "Non-Operating / GOP";
  title: string;
  grossRevenue: number;
  directExpenses: number;
  departmentalProfit: number;
  marginPct: number;
  lines: USALILineItem[];
}

export interface CityLedgerInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  guestName: string;
  folioNumber: string;
  amount: number;
  whtAmount: number; // Withholding tax 5%
  netPayable: number;
  status: "unbilled" | "invoiced" | "partial" | "settled" | "overdue";
  daysOverdue: number;
  settledAt?: string;
}

export interface CityLedgerAccount {
  id: string;
  accountNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  creditLimit: number;
  currentBalance: number;
  aging: {
    current: number;    // 0-30 days
    days31to60: number; // 31-60 days
    days61to90: number; // 61-90 days
    over90: number;     // >90 days
  };
  invoices: CityLedgerInvoice[];
  status: "active" | "on_hold" | "suspended";
}

export interface AccountsPayableInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  category: "Food & Beverage" | "Guest Supplies & Amenities" | "Linen & Laundry" | "Engineering & Energy" | "IT & Licenses" | "Professional Services";
  poNumber: string;
  grnNumber: string;
  threeWayMatched: boolean;
  invoiceDate: string;
  dueDate: string;
  grossAmount: number;
  vatAmount: number; // 7.5%
  whtRate: number;   // 5% or 10%
  whtAmount: number;
  netPayable: number;
  status: "pending_3way" | "approved" | "scheduled" | "paid";
  paymentBatchId?: string;
  paymentVoucherRef?: string;
}

export interface TaxRemittanceSchedule {
  id: string;
  taxType: "VAT (7.5%)" | "Tourism & Consumption (5%)" | "Withholding Tax (WHT 5%)" | "PAYE Payroll Tax";
  period: string;
  taxableBase: number;
  taxPayable: number;
  collectedToDate: number;
  dueDate: string;
  status: "accruing" | "reconciled" | "remitted";
  filingRef?: string;
}

// ----------------- Food & Beverage Operations (M-FNB) -----------------
export type TableStatus = "available" | "seated" | "order_placed" | "billed" | "vacant" | "occupied" | "reserved" | "billing" | "dirty";
export type RestaurantZone = "Main Dining Room" | "Terrace & Poolside" | "Executive Lounge" | "In-Room Dining (IRDs)";

export interface RestaurantTable {
  id: string;
  number: string;
  tableNumber?: string;
  outletName?: string;
  section?: string;
  zone: RestaurantZone;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  currentOrderNumber?: string;
  guestName?: string;
  roomNumber?: string;
  serverName?: string;
  seatedAt?: string;
  totalAmount?: number;
  currentOrderTotal?: number;
  activeCovers?: number;
}

export type KitchenStation = "Hot Kitchen" | "Grill & Broiler" | "Pantry & Cold Salads" | "Pastry & Dessert" | "Bar Dispenser";
export type KotStation = "hot_kitchen" | "cold_larder" | "pastry" | "bar";
export type KotStatus = "queued" | "cooking" | "ready" | "served" | "fired" | "preparing";

export interface KotItem {
  id: string;
  menuItemId: string;
  name: string;
  itemName?: string;
  quantity: number;
  modifiers?: string[];
  course: "Starters" | "Mains" | "Dessert" | "Beverage";
  status: KotStatus;
  station: KitchenStation;
  specialInstructions?: string;
}

export interface KitchenOrderTicket {
  id: string;
  ticketNumber: string;
  outletName: string;
  tableOrRoom: string;
  tableNumber?: string;
  serverName: string;
  createdAt: string;
  firedAt?: string;
  station?: KotStation;
  priority?: "normal" | "high" | "urgent";
  orderType: "dine_in" | "room_service" | "poolside" | "takeaway";
  guestName?: string;
  roomNumber?: string;
  status: KotStatus;
  elapsedMinutes: number;
  items: KotItem[];
  specialInstructions?: string;
}

/** Alias used by the KDS view for station-typed props. */
export type KitchenTicket = KitchenOrderTicket;

export interface RecipeIngredient {
  productId: string;
  name: string;
  portionQty: number;
  quantity?: number;
  unit: string;
  unitCost: number;
  costPerUnit?: number;
  lineCost: number;
  totalCost?: number;
  yieldPct?: number;
}

export interface RecipeCostingItem {
  id: string;
  menuItemId: string;
  name: string;
  recipeCode?: string;
  itemName?: string;
  portionSize?: string;
  category: string;
  sellingPrice: number;
  foodCost: number;
  foodCostPct: number; // e.g. 28.5%
  targetCostPct?: number; // e.g. 30.0%
  targetFoodCostPct?: number;
  rawCostTotal?: number;
  grossMargin: number;
  engineeringClass: "Star (High Margin / Popular)" | "Plowhorse (Low Margin / Popular)" | "Puzzle (High Margin / Niche)" | "Dog (Low Margin / Low Popularity)";
  popularityScore: number; // monthly sales count
  ingredients: RecipeIngredient[];
}

/** Alias used by the recipe costing UI. */
export type RecipeCosting = RecipeCostingItem;

export interface BanquetEventOrder {
  id: string;
  beoNumber: string;
  eventTitle?: string;
  eventName?: string;
  clientName: string;
  clientCompany?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  hallName?: string;
  venue?: string;
  expectedCovers?: number;
  expectedPax?: number;
  guaranteedCovers?: number;
  guaranteedPax?: number;
  mealServiceType?: "International Buffet" | "Plated 4-Course VIP" | "Cocktail & Canapés" | "Working Executive Lunch";
  menuHighlights?: string[];
  menuPackage?: string;
  beveragePackage?: "Full Open Premium Bar" | "Wine & Soft Drinks Package" | "On Consumption";
  specialDietaryNotes?: string;
  totalBudget?: number;
  contractAmount?: number;
  depositReceived?: number;
  depositPaid?: number;
  avRequirements?: string[];
  status: "tentative" | "contracted" | "food_tasting_done" | "in_preparation" | "completed" | "definite";
}

export interface KitchenWasteLog {
  id: string;
  date: string;
  station: KitchenStation | string;
  itemName: string;
  quantity: number;
  unit: string;
  costLoss: number;
  reason: "Burnt / Overcooked" | "Expired / Spoilage" | "Prep Trimmings" | "Buffet Surplus" | "Guest Return" | "trim_loss" | "spoilage" | "burnt" | "expired";
  loggedByChef?: string;
  loggedBy?: string;
  actionTaken?: string;
}

// ----------------- Supply Chain & Inventory (M-INV) -----------------
export interface SupplyChainStore {
  id: string;
  code: string;
  name: string;
  type: "Central Warehouse" | "Kitchen Dry Store" | "Walk-in Cold Room" | "Wine & Beverage Cellar" | "Housekeeping Linen & Amenities" | "Engineering Spares";
  managerName: string;
  custodian?: string;
  location: string;
  activeSkus: number;
  totalValue: number;
}

export interface SupplyChainProduct {
  id: string;
  sku: string;
  name: string;
  category: "Perishables & Produce" | "Meat & Seafood" | "Dry Provisions" | "Beverage & Spirits" | "Guest Amenities" | "Linen & Textiles" | "Chemicals & Cleaning" | "Engineering Spares";
  unit: string;
  costPrice: number;
  unitCost?: number;
  parLevel: number;
  reorderPoint: number;
  safetyStock: number;
  storageCondition: "Ambient Dry" | "Refrigerated (+2°C to +4°C)" | "Deep Freeze (-18°C)" | "Secure Locked Vault";
  supplierName: string;
  primarySupplier?: string;
  leadTimeDays: number;
  stockByStore: Record<string, number>; // storeId -> quantity
  totalQuantity: number;
  totalStock?: number;
  totalValue: number;
  status: "healthy" | "low_stock" | "critical";
}

export interface RequisitionItem {
  productId?: string;
  name?: string;
  itemName?: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  estimatedUnitCost?: number;
  total?: number;
  purpose?: string;
}

export interface PurchaseRequisition {
  id: string;
  requisitionNumber?: string;
  prNumber?: string;
  department: "Food & Beverage - Kitchen" | "Front Office & Guest Services" | "Housekeeping" | "Maintenance & Engineering" | "Food & Beverage - Bar" | string;
  requestedBy: string;
  requestDate?: string;
  date?: string;
  requiredByDate?: string;
  urgency?: "Routine Par Fill" | "Event Demand" | "Emergency Rush";
  items: RequisitionItem[];
  totalEstimate?: number;
  estimatedTotal?: number;
  budgetCode?: string;
  justification?: string;
  status: "draft" | "submitted" | "hod_approved" | "procurement_po_created" | "rejected" | "pending_approval" | "approved" | "po_created";
  poNumber?: string;
  notes?: string;
}

export interface GrnLineItem {
  productId: string;
  name: string;
  itemName?: string;
  orderedQty: number;
  quantityOrdered?: number;
  receivedQty: number;
  quantityReceived?: number;
  rejectedQty: number;
  quantityRejected?: number;
  unit: string;
  unitCost: number;
  unitPrice?: number;
  total?: number;
  rejectionReason?: string;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  storeTarget: string;
  deliveryNoteNumber: string;
  temperatureOnArrival?: string; // e.g. "-19.2°C"
  temperatureCheck?: number;
  hygieneCondition: "Passed Inspection" | "Requires Washing" | "Rejected";
  qualityInspectionPassed?: boolean;
  items: GrnLineItem[];
  totalAcceptedValue: number;
  totalValue?: number;
  hasVariance: boolean;
  status: "inspected" | "posted_to_inventory" | "rejected" | "received" | "inspecting";
}

export interface StoreTransferRecord {
  id: string;
  transferNumber: string;
  transferDate?: string;
  date?: string;
  fromStoreName?: string;
  toStoreName?: string;
  fromStoreId?: string;
  toStoreId?: string;
  requestedBy?: string;
  authorizedBy?: string;
  transferredBy?: string;
  items: Array<{
    productId: string;
    name?: string;
    productName?: string;
    quantity: number;
    unit: string;
  }>;
  status: "pending_dispatch" | "in_transit" | "received" | "completed";
  notes?: string;
}

export interface StocktakeLineItem {
  sku: string;
  name?: string;
  productName?: string;
  systemQty: number;
  systemQuantity?: number;
  physicalQty: number;
  physicalQuantity?: number;
  varianceQty?: number;
  variance?: number;
  unit?: string;
  unitCost: number;
  varianceCost?: number;
  costImpact?: number;
  reason?: string;
  notes?: string;
}

export interface StocktakeAuditRecord {
  id: string;
  auditNumber: string;
  storeName: string;
  auditDate?: string;
  date?: string;
  auditorName?: string;
  auditedBy?: string;
  categoriesAudited: string[];
  totalSkusCounted: number;
  totalSystemValue: number;
  totalPhysicalValue: number;
  varianceValue: number;
  variancePct: number;
  netVarianceCost?: number;
  discrepanciesCount: number;
  status: "in_progress" | "reconciled" | "posted_adjustment";
  items?: StocktakeLineItem[];
  itemsSample?: StocktakeLineItem[];
}

/** Alias used by the stocktake audit UI. */
export type StocktakeAudit = StocktakeAuditRecord;

// ---------------------------------------------------------------------------
// Cash Flow Projections & 30-Day Liquidity Forecast
// ---------------------------------------------------------------------------

export interface DailyCashFlowEntry {
  date: string;
  dayNumber: number;
  dayName: string;
  inflows: {
    roomRevenueSettlements: number;
    roomAdvanceDeposits: number;
    cityLedgerCollections: number;
    fnbAndOutletsRevenue: number;
    otherOperatingInflows: number;
    totalInflow: number;
  };
  outflows: {
    payrollAndWages: number;
    vendorAccountsPayable: number;
    utilitiesAndDiesel: number;
    statutoryTaxes: number;
    loanServiceAndCapex: number;
    totalOutflow: number;
  };
  netCashFlow: number;
  openingBalance: number;
  closingBalance: number;
  isMinReserveBreached: boolean;
  notes?: string;
}

export interface CashFlowScenario {
  occupancyAdjustmentPct: number;
  arCollectionDelayDays: number;
  capexFreeze: boolean;
}

// ---------------------------------------------------------------------------
// Supplier Contract Management & SLAs
// ---------------------------------------------------------------------------

export type SupplierContractCategory =
  | "fnb_perishables"
  | "fnb_beverages"
  | "fnb_dry_goods"
  | "facility_hvac_power"
  | "facility_fire_life_safety"
  | "housekeeping_linen_chem"
  | "it_telecom";

export type SupplierContractStatus =
  | "active"
  | "expiring_soon"
  | "in_renewal"
  | "expired"
  | "terminated";

export type RenewalType =
  | "auto_renew_30d"
  | "auto_renew_60d"
  | "manual_negotiation"
  | "tender_required";

export interface SupplierContractSla {
  deliveryTimelinessPct: number;
  currentTimelinessPct: number;
  fillRatePct: number;
  currentFillRatePct: number;
  tempQualityCompliancePct: number;
  currentQualityCompliancePct: number;
  emergencyResponseTimeMinutes?: number;
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "F";
  penaltyClausesActive: boolean;
  lastAuditDate: string;
}

export interface SupplierContract {
  id: string;
  contractNumber: string;
  supplierId: string;
  supplierName: string;
  category: SupplierContractCategory;
  title: string;
  annualValue: number;
  paymentTerms: string;
  startDate: string;
  endDate: string;
  noticePeriodDays: number;
  renewalType: RenewalType;
  status: SupplierContractStatus;
  sla: SupplierContractSla;
  keyContacts: {
    accountManager: string;
    phone: string;
    email: string;
  };
  deliverablesSummary: string;
  renewalAlertDays: number;
  lastRenewalNoticeSent?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Kitchen Prep & Recipe Scaling
// ---------------------------------------------------------------------------

export type KitchenPrepStation =
  | "hot_line"
  | "cold_pantry"
  | "butchery"
  | "bakery_pastry"
  | "banquet_prep";

export type KitchenShift = "breakfast" | "lunch" | "dinner" | "banquet" | "all_day";

export type PrepItemStatus = "pending" | "in_prep" | "completed" | "qc_verified";

export interface ScaledIngredientRequirement {
  ingredientId: string;
  name: string;
  baseQty: number;
  scaledQty: number;
  unit: string;
  inventoryStore: string;
  currentStockQty: number;
  stockStatus: "sufficient" | "low_stock" | "stockout";
}

export interface KitchenPrepItem {
  id: string;
  dishName: string;
  category: string;
  mealPeriod: KitchenShift;
  station: KitchenPrepStation;
  baseYieldPortions: number;
  forecastedPortions: number;
  scalingFactor: number;
  leadTimeMinutes: number;
  assignedChef: string;
  status: PrepItemStatus;
  ingredients: ScaledIngredientRequirement[];
  criticalAllergens: string[];
  storageLocation: string;
  notes?: string;
}

export interface KitchenOccupancyForecast {
  hotelOccupancyRatePct: number;
  inHouseGuests: number;
  expectedArrivalGuests: number;
  forecastedBreakfastCovers: number;
  forecastedLunchCovers: number;
  forecastedDinnerCovers: number;
  forecastedBanquetCovers: number;
  totalForecastedCovers: number;
}

// ---------------------------------------------------------------------------
// Maintenance Audit Trail (Assets Module)
// ---------------------------------------------------------------------------

export interface ReplacedPart {
  id: string;
  partNumber: string;
  partName: string;
  category: "Mechanical" | "Electrical" | "Plumbing" | "HVAC & Refrigeration" | "Electronics" | "Consumables" | "Commercial Kitchen";
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplierOrBatch?: string;
  warrantyExpiry?: string;
  serialNumber?: string;
  warrantyMonths?: number;
}

export interface MaintenanceAuditRecord {
  id: string;
  workOrderNumber: string;
  repairTicketCode: string;
  assetId?: string;
  assetTag: string;
  assetName: string;
  assetCategory: "HVAC & Climate" | "Generators & Power" | "Chillers & Refrigeration" | "Elevators & Escalators" | "Commercial Kitchen" | "Plumbing & Boilers" | "Fire Safety & Access";
  location: string;
  failureReported: string;
  diagnosis: string;
  actionTaken: string;
  
  // Technician Accountability
  technicianId: string;
  technicianName: string;
  technicianCertification: string;
  technicianSignatureDate: string;
  
  // Supervisor / QC Verification
  supervisorName: string;
  supervisorApprovalStatus: "verified_passed" | "conditional_pass" | "rework_required" | "pending_qc";
  supervisorSignOffDate?: string;
  supervisorNotes?: string;

  // Parts Replaced
  partsReplaced: ReplacedPart[];
  totalPartsCost: number;

  // Time Accountability & Labor
  taskStartedAt: string;
  taskCompletedAt: string;
  timeTakenMinutes: number;
  technicianHourlyRate: number;
  laborCost: number;
  totalRepairCost: number;

  // Asset Condition & Impact
  preRepairCondition: "Critical Failure / Inoperable" | "Degraded Performance" | "Safety Hazard" | "Intermittent Fault";
  postRepairCondition: "Operational (Optimal Efficiency)" | "Operational (Monitoring Required)" | "Temporary Fix Applied";
  downtimeHours: number;
  preventativeAdvice?: string;
  status: "completed" | "verified" | "in_review";

  // Flat audit-trail fields consumed by the asset audit UI
  repairDate?: string;
  startedAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  leadTechnicianId?: string;
  leadTechnicianName?: string;
  assistantTechnicians?: string[];
  problemDescription?: string;
  rootCauseAnalysis?: string;
  preventionRecommendation?: string;
  safetyProtocolPassed?: boolean;
  laborHoursLogged?: number;
  totalLaborCost?: number;
  totalCost?: number;
}

// ---------------------------------------------------------------------------
// Personalized Preference Log (Guest 360 Profile)
// ---------------------------------------------------------------------------

export type PillowType =
  | "Feather & Down"
  | "Memory Foam"
  | "Buckwheat Hull"
  | "Firm Hypoallergenic"
  | "Silk & Microfiber"
  | "Contour Ergonomic";

export type DietaryRestriction =
  | "Gluten-Free"
  | "Strict Halal"
  | "Shellfish Allergy"
  | "Tree Nut Allergy"
  | "Peanut Allergy"
  | "Vegan"
  | "Vegetarian"
  | "Lactose-Free"
  | "Diabetic Friendly"
  | "Low Sodium"
  | "Kosher";

export interface GuestPreferenceLogEntry {
  id: string;
  timestamp: string;
  category: "climate" | "bedding" | "dietary" | "amenity" | "room_location";
  changeDescription: string;
  source: "Guest App" | "Front Desk Check-in" | "Concierge Trace" | "Post-Stay Survey" | "VIP Butler";
  staffMember?: string;
}

export interface GuestPersonalizedPreferences {
  guestId: string;
  guestName: string;
  
  // Room Temperature & Climate
  preferredTemperatureCelsius: number; // 16.0 - 28.0
  preferredAcMode: "cool" | "heat" | "fan" | "eco";
  preferredFanSpeed: "auto" | "low" | "medium" | "high";
  
  // Bedding & Sleep Comfort
  pillowType: PillowType;
  pillowCount: number;
  mattressTopperPreference?: "Extra Soft Plush" | "Firm Orthopedic" | "Featherbed" | "Standard Luxury";
  duvetWeight?: "Lightweight Summer" | "All-Season Goose Down" | "Heavy Weight";

  // Dietary Restrictions & Dining
  dietaryRestrictions: DietaryRestriction[];
  dietaryNotes?: string;
  beveragePreference?: "Perrier Sparkling" | "San Pellegrino" | "Fresh Coconut Water" | "English Breakfast Tea" | "Hibiscus Zobo" | "Espresso Double";
  winePreference?: "Cabernet Sauvignon" | "Chardonnay Oak" | "Champagne Brut" | "Non-Alcoholic";

  // Room Location & Amenities
  floorPreference: "High Floor (Floors 5-7)" | "Low Floor (Floors 1-2)" | "Near Elevator" | "Quiet End of Hall" | "Lagoon / Ocean View";
  turndownPreference: "18:00 Standard" | "19:30 Evening" | "21:00 Late Night" | "Declined";
  newspaperPreference?: "Financial Times" | "The Guardian Nigeria" | "BusinessDay" | "Digital Only";
  roomFragrance?: "White Tea & Thyme" | "Lavender Relaxing" | "Fresh Citrus Bergamot" | "Unscented Hypoallergenic";

  // Pre-Arrival Automation Engine
  preArrivalAutomation: {
    autoPreSetEnabled: boolean;
    assignedRoomNumber?: string;
    lastDispatchedAt?: string;
    status: "idle" | "ready_for_dispatch" | "controls_active" | "pre_conditioned";
    dispatchedActions: Array<{
      id: string;
      timestamp: string;
      system: "IoT Climate Control" | "Housekeeping Linen Dispatch" | "F&B Kitchen Alert" | "VIP Welcome Amenity";
      detail: string;
      status: "applied" | "in_progress" | "verified";
    }>;
  };

  // Preference Log History
  history: GuestPreferenceLogEntry[];
}

// ---------------------------------------------------------------------------
// Inventory Threshold Alerts & Burn Rate System
// ---------------------------------------------------------------------------

export interface CoreInventoryThresholdItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  category: "Meat & Seafood" | "Dairy & Cold-Chain" | "Fresh Produce" | "Dry Provisions" | "Beverages & Wines" | "Bakery & Pastry";
  storeLocation: string;
  unit: string;
  currentStock: number;
  dailyBurnRate: number;
  burnRateBasis: string;
  minStockDaysThreshold: number;
  criticalStockDaysThreshold: number;
  parTargetLevel: number;
  costPerUnit: number;
  leadTimeDays: number;
  primarySupplierName: string;
  supplierContact: string;
  supplierEmail: string;
  status: "healthy" | "warning_low" | "critical_depletion" | "stockout";
  isAutoAlertEnabled: boolean;
  alertRecipientEmails: string[];
  alertRecipientRoles: string[];
  lastAlertSentAt?: string;
  openPoNumber?: string;
}

export interface InventoryAlertNotification {
  id: string;
  alertCode: string;
  timestamp: string;
  itemId: string;
  itemName: string;
  sku: string;
  severity: "critical" | "warning";
  channel: "email" | "push" | "both";
  currentStockFormatted: string;
  dailyBurnRateFormatted: string;
  runwayDays: number;
  emailSubject: string;
  emailBody: string;
  pushTitle: string;
  pushMessage: string;
  recipients: string[];
  deliveryStatus: "delivered" | "dispatched" | "failed";
  actionStatus: "pending_reorder" | "po_created" | "acknowledged" | "dismissed";
  linkedPoNumber?: string;
}

// ---------------------------------------------------------------------------
// Advanced Inventory, Stores & Stock-keeping (M-INV deep layer)
//
// Extends the multi-store foundation with the controls world-class hotel
// storerooms run on: bin locations, batch/lot + expiry (FEFO), a perpetual
// stock ledger, per-unit conversions, ABC/cycle-count classification, $/€
// landed cost, and internal store requisitions (issue/return).
// ---------------------------------------------------------------------------

export type StockValuationMethod = "fifo" | "weighted_average" | "standard";

export type StockLedgerReason =
  | "opening"
  | "purchase_receipt"
  | "issue"
  | "return"
  | "transfer_out"
  | "transfer_in"
  | "adjustment"
  | "wastage"
  | "production_in"
  | "production_out"
  | "count_variance";

export interface StockLedgerEntry {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  storeId: string;
  storeName: string;
  reason: StockLedgerReason;
  /** Positive = receipt/return, negative = issue/consumption. Base units. */
  quantity: number;
  unitCost: number;
  totalValue: number;
  /** Running on-hand balance in the store after this movement. */
  balanceAfter: number;
  batchNumber?: string;
  expiryDate?: string;
  reference?: string;
  performedBy: string;
}

export interface StockBatch {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  storeId: string;
  batchNumber: string;
  lotNumber?: string;
  supplierName: string;
  receivedDate: string;
  expiryDate: string;
  quantityRemaining: number;
  unit: string;
  unitCost: number;
  /** FEFO rank — 1 is the first to be consumed. Derived, shown for clarity. */
  fefoRank: number;
  temperatureLog?: string;
}

export type AbcClass = "A" | "B" | "C";

export interface AbcClassification {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  annualUsageValue: number;
  /** Cumulative share of total usage value (Pareto). */
  cumulativeSharePct: number;
  class: AbcClass;
  cycleCountFrequency: "weekly" | "monthly" | "quarterly";
  countTolerancePct: number;
}

export interface BinLocation {
  id: string;
  storeId: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
  capacityUnits: number;
  usedUnits: number;
  temperatureZone: "ambient" | "chilled" | "frozen" | "wine-cellar" | "dry";
  notes?: string;
}

export interface UnitConversion {
  productId: string;
  baseUnit: string;
  purchaseUnit: string;
  /** Base units obtained from one purchase unit (e.g. 1 crate = 24 bottles). */
  factor: number;
  issueUnit: string;
  issueFactor: number;
}

export interface StoreRequisition {
  id: string;
  requisitionNumber: string;
  requestingDepartment: string;
  issuingStoreId: string;
  issuingStoreName: string;
  requestedBy: string;
  approvedBy?: string;
  requestDate: string;
  requiredDate: string;
  status: "draft" | "pending_approval" | "approved" | "issued" | "partially_issued" | "rejected";
  lines: Array<{
    productId: string;
    name: string;
    requestedQty: number;
    approvedQty: number;
    issuedQty: number;
    unit: string;
    unitCost: number;
    batchNumber?: string;
  }>;
  totalValue: number;
  notes?: string;
}

export interface SlowMovingStock {
  productId: string;
  productName: string;
  sku: string;
  storeName: string;
  onHand: number;
  lastMovementDate: string | null;
  daysSinceMovement: number;
  tiedUpCapital: number;
  suggestedAction: "promote" | "transfer" | "discount" | "write_off";
}

export interface InventoryControlMetrics {
  totalSkus: number;
  totalStores: number;
  inventoryValue: number;
  stockTurnoverRatio: number;
  daysInventoryOutstanding: number;
  shrinkagePct: number;
  stockoutRatePct: number;
  expiringWithin30Days: number;
  expiringValueAtRisk: number;
}

// ---------------------------------------------------------------------------
// Financial Agility (M-FIN decision layer)
// ---------------------------------------------------------------------------

export interface FinancialRatio {
  id: string;
  name: string;
  category: "liquidity" | "profitability" | "efficiency" | "leverage" | "hospitality";
  value: number;
  benchmark: number;
  unit: "ratio" | "percent" | "days" | "currency";
  /** Worst → best direction for variance colouring. */
  higherIsBetter: boolean;
  formula: string;
  interpretation: string;
}

export interface CashPositionPoint {
  date: string;
  operating: number;
  investing: number;
  financing: number;
  closingCash: number;
  minimumReserve: number;
}

export interface ScenarioResult {
  id: string;
  name: string;
  assumptions: {
    occupancyAdjustmentPct: number;
    adrAdjustmentPct: number;
    payrollAdjustmentPct: number;
    arCollectionDelayDays: number;
    capexFreeze: boolean;
  };
  projectedRevenue: number;
  projectedEbitda: number;
  projectedClosingCash: number;
  runwayWeeks: number;
  covenantBreach: boolean;
  verdict: "healthy" | "watch" | "stressed";
}

export interface TreasuryAccount {
  id: string;
  name: string;
  bank: string;
  currency: string;
  type: "operating" | "payroll" | "tax" | "reserve" | "collections";
  balance: number;
  availableBalance: number;
  sweepTarget?: number;
  lastReconciledAt: string;
  unreconciledItems: number;
}

export interface CostVarianceLine {
  id: string;
  costCentre: string;
  account: string;
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
  driver: string;
  /** True when the variance is favourable (revenue up or cost down). */
  favourable: boolean;
}

export interface FinancialAgilityData {
  metrics: InventoryControlMetrics;
  ratios: FinancialRatio[];
  cashPosition: CashPositionPoint[];
  scenarios: ScenarioResult[];
  treasuryAccounts: TreasuryAccount[];
  costVariances: CostVarianceLine[];
}




