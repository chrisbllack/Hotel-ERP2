// Seed data for the advanced inventory / stock-keeping and financial-agility
// modules. Figures are realistic for a 50-room Lagos property with a small
// central warehouse feeding kitchen, bar and housekeeping stores.

import type {
  AbcClassification,
  BinLocation,
  CashPositionPoint,
  CostVarianceLine,
  FinancialAgilityData,
  FinancialRatio,
  InventoryControlMetrics,
  ScenarioResult,
  SlowMovingStock,
  StockBatch,
  StockLedgerEntry,
  StoreRequisition,
  TreasuryAccount,
  UnitConversion,
} from "../types";

export const initialStockLedger: StockLedgerEntry[] = [
  { id: "led-001", timestamp: "2026-09-05T07:12:00", productId: "scp-001", productName: "Chicken Breast (Frozen)", sku: "MT-CHK-001", storeId: "store-central", storeName: "Central Warehouse", reason: "purchase_receipt", quantity: 120, unitCost: 3200, totalValue: 384000, balanceAfter: 420, batchNumber: "B-CHK-0905", expiryDate: "2026-12-04", reference: "GRN-2026-0912", performedBy: "Daniel Okafor" },
  { id: "led-002", timestamp: "2026-09-05T08:05:00", productId: "scp-001", productName: "Chicken Breast (Frozen)", sku: "MT-CHK-001", storeId: "store-kitchen", storeName: "Kitchen Dry Store", reason: "issue", quantity: -60, unitCost: 3200, totalValue: -192000, balanceAfter: 180, batchNumber: "B-CHK-0905", reference: "REQ-2026-0043", performedBy: "Grace Adeyemi" },
  { id: "led-003", timestamp: "2026-09-05T09:20:00", productId: "scp-002", productName: "Sunflower Cooking Oil 25L", sku: "DR-OIL-025", storeId: "store-central", storeName: "Central Warehouse", reason: "purchase_receipt", quantity: 30, unitCost: 42000, totalValue: 1260000, balanceAfter: 58, reference: "GRN-2026-0913", performedBy: "Daniel Okafor" },
  { id: "led-004", timestamp: "2026-09-05T10:40:00", productId: "scp-003", productName: "Heineken Lager 33cl (Crate)", sku: "BV-BEER-HEI", storeId: "store-wine", storeName: "Wine & Beverage Cellar", reason: "issue", quantity: -8, unitCost: 18500, totalValue: -148000, balanceAfter: 42, batchNumber: "B-HEI-0828", expiryDate: "2027-02-28", reference: "REQ-2026-0044", performedBy: "Emeka Nwankwo" },
  { id: "led-005", timestamp: "2026-09-05T11:15:00", productId: "scp-004", productName: "Fresh Tomatoes (Crate)", sku: "PR-TOM-001", storeId: "store-kitchen", storeName: "Kitchen Dry Store", reason: "wastage", quantity: -3, unitCost: 9500, totalValue: -28500, balanceAfter: 12, expiryDate: "2026-09-07", reference: "WST-2026-0021", performedBy: "Grace Adeyemi" },
  { id: "led-006", timestamp: "2026-09-04T18:30:00", productId: "scp-005", productName: "Bath Towels (White, 70x140)", sku: "HK-TOW-001", storeId: "store-linen", storeName: "Housekeeping Linen Store", reason: "transfer_in", quantity: 80, unitCost: 6500, totalValue: 520000, balanceAfter: 340, performedBy: "Blessing Uche" },
  { id: "led-007", timestamp: "2026-09-04T16:00:00", productId: "scp-006", productName: "HVAC Air Filters (MERV-13)", sku: "EN-FIL-M13", storeId: "store-eng", storeName: "Engineering Spares", reason: "issue", quantity: -12, unitCost: 22000, totalValue: -264000, balanceAfter: 26, reference: "WO-2026-0311", performedBy: "Tunde Salami" },
  { id: "led-008", timestamp: "2026-09-03T14:45:00", productId: "scp-002", productName: "Sunflower Cooking Oil 25L", sku: "DR-OIL-025", storeId: "store-kitchen", storeName: "Kitchen Dry Store", reason: "count_variance", quantity: -2, unitCost: 42000, totalValue: -84000, balanceAfter: 18, reference: "CNT-2026-007", performedBy: "Audit Team" },
  { id: "led-009", timestamp: "2026-09-03T09:10:00", productId: "scp-007", productName: "Coffee Beans (Arabica 1kg)", sku: "BV-COF-ARA", storeId: "store-central", storeName: "Central Warehouse", reason: "purchase_receipt", quantity: 45, unitCost: 24000, totalValue: 1080000, balanceAfter: 88, batchNumber: "B-COF-0903", expiryDate: "2026-11-30", reference: "GRN-2026-0908", performedBy: "Daniel Okafor" },
  { id: "led-010", timestamp: "2026-09-03T08:00:00", productId: "scp-008", productName: "Toilet Paper (48-roll carton)", sku: "HK-TPR-048", storeId: "store-linen", storeName: "Housekeeping Linen Store", reason: "issue", quantity: -5, unitCost: 16000, totalValue: -80000, balanceAfter: 38, reference: "REQ-2026-0041", performedBy: "Blessing Uche" },
];

export const initialStockBatches: StockBatch[] = [
  { id: "bat-001", productId: "scp-001", productName: "Chicken Breast (Frozen)", sku: "MT-CHK-001", storeId: "store-central", batchNumber: "B-CHK-0820", lotNumber: "LOT-4471", supplierName: "ColdChain Foods Ltd", receivedDate: "2026-08-20", expiryDate: "2026-11-18", quantityRemaining: 90, unit: "kg", unitCost: 3150, fefoRank: 1, temperatureLog: "-19.2°C on arrival" },
  { id: "bat-002", productId: "scp-001", productName: "Chicken Breast (Frozen)", sku: "MT-CHK-001", storeId: "store-central", batchNumber: "B-CHK-0905", lotNumber: "LOT-4512", supplierName: "ColdChain Foods Ltd", receivedDate: "2026-09-05", expiryDate: "2026-12-04", quantityRemaining: 180, unit: "kg", unitCost: 3200, fefoRank: 2, temperatureLog: "-19.2°C on arrival" },
  { id: "bat-003", productId: "scp-004", productName: "Fresh Tomatoes (Crate)", sku: "PR-TOM-001", storeId: "store-kitchen", batchNumber: "B-TOM-0902", supplierName: "Mile 12 Produce", receivedDate: "2026-09-02", expiryDate: "2026-09-07", quantityRemaining: 12, unit: "crate", unitCost: 9500, fefoRank: 1, temperatureLog: "Ambient 24°C" },
  { id: "bat-004", productId: "scp-003", productName: "Heineken Lager 33cl (Crate)", sku: "BV-BEER-HEI", storeId: "store-wine", batchNumber: "B-HEI-0828", lotNumber: "LOT-8830", supplierName: "InterContinental Beverages", receivedDate: "2026-08-28", expiryDate: "2027-02-28", quantityRemaining: 42, unit: "crate", unitCost: 18500, fefoRank: 1 },
  { id: "bat-005", productId: "scp-007", productName: "Coffee Beans (Arabica 1kg)", sku: "BV-COF-ARA", storeId: "store-central", batchNumber: "B-COF-0903", supplierName: "Lagos Roasters", receivedDate: "2026-09-03", expiryDate: "2026-11-30", quantityRemaining: 88, unit: "kg", unitCost: 24000, fefoRank: 1 },
  { id: "bat-006", productId: "scp-009", productName: "Prawns (Frozen, Headless)", sku: "MT-PRW-001", storeId: "store-central", batchNumber: "B-PRW-0830", supplierName: "Atlantic Seafoods", receivedDate: "2026-08-30", expiryDate: "2026-09-29", quantityRemaining: 24, unit: "kg", unitCost: 8500, fefoRank: 1, temperatureLog: "-18.6°C on arrival" },
];

export const initialAbcClassifications: AbcClassification[] = [
  { productId: "scp-002", productName: "Sunflower Cooking Oil 25L", sku: "DR-OIL-025", category: "Dry Provisions", annualUsageValue: 18144000, cumulativeSharePct: 21.3, class: "A", cycleCountFrequency: "weekly", countTolerancePct: 0.5 },
  { productId: "scp-001", productName: "Chicken Breast (Frozen)", sku: "MT-CHK-001", category: "Meat & Seafood", annualUsageValue: 15360000, cumulativeSharePct: 39.3, class: "A", cycleCountFrequency: "weekly", countTolerancePct: 0.5 },
  { productId: "scp-007", productName: "Coffee Beans (Arabica 1kg)", sku: "BV-COF-ARA", category: "Beverages & Wines", annualUsageValue: 10368000, cumulativeSharePct: 51.4, class: "A", cycleCountFrequency: "weekly", countTolerancePct: 0.5 },
  { productId: "scp-003", productName: "Heineken Lager 33cl (Crate)", sku: "BV-BEER-HEI", category: "Beverages & Wines", annualUsageValue: 9324000, cumulativeSharePct: 62.4, class: "A", cycleCountFrequency: "weekly", countTolerancePct: 0.5 },
  { productId: "scp-009", productName: "Prawns (Frozen, Headless)", sku: "MT-PRW-001", category: "Meat & Seafood", annualUsageValue: 6120000, cumulativeSharePct: 69.6, class: "B", cycleCountFrequency: "monthly", countTolerancePct: 1 },
  { productId: "scp-008", productName: "Toilet Paper (48-roll carton)", sku: "HK-TPR-048", category: "Housekeeping", annualUsageValue: 3456000, cumulativeSharePct: 73.7, class: "B", cycleCountFrequency: "monthly", countTolerancePct: 1 },
  { productId: "scp-005", productName: "Bath Towels (White, 70x140)", sku: "HK-TOW-001", category: "Housekeeping", annualUsageValue: 3120000, cumulativeSharePct: 77.4, class: "B", cycleCountFrequency: "monthly", countTolerancePct: 1 },
  { productId: "scp-004", productName: "Fresh Tomatoes (Crate)", sku: "PR-TOM-001", category: "Fresh Produce", annualUsageValue: 2964000, cumulativeSharePct: 80.9, class: "B", cycleCountFrequency: "monthly", countTolerancePct: 1.5 },
  { productId: "scp-006", productName: "HVAC Air Filters (MERV-13)", sku: "EN-FIL-M13", category: "Engineering", annualUsageValue: 1584000, cumulativeSharePct: 82.8, class: "C", cycleCountFrequency: "quarterly", countTolerancePct: 2 },
  { productId: "scp-010", productName: "Guest Amenities Kit", sku: "HK-AMN-KIT", category: "Housekeeping", annualUsageValue: 1440000, cumulativeSharePct: 84.5, class: "C", cycleCountFrequency: "quarterly", countTolerancePct: 2 },
];

export const initialBinLocations: BinLocation[] = [
  { id: "bin-001", storeId: "store-central", code: "CW-A1-R2-S3-B04", zone: "Dry Goods", aisle: "A1", rack: "R2", shelf: "S3", bin: "B04", capacityUnits: 500, usedUnits: 420, temperatureZone: "ambient" },
  { id: "bin-002", storeId: "store-central", code: "CW-A1-R2-S1-B01", zone: "Dry Goods", aisle: "A1", rack: "R2", shelf: "S1", bin: "B01", capacityUnits: 300, usedUnits: 58, temperatureZone: "ambient" },
  { id: "bin-003", storeId: "store-central", code: "CW-C1-R1-S2-B07", zone: "Cold Chain", aisle: "C1", rack: "R1", shelf: "S2", bin: "B07", capacityUnits: 200, usedUnits: 24, temperatureZone: "frozen", notes: "FEFO — oldest stock front-loaded" },
  { id: "bin-004", storeId: "store-wine", code: "WB-W1-R3-S2-B12", zone: "Cellar", aisle: "W1", rack: "R3", shelf: "S2", bin: "B12", capacityUnits: 80, usedUnits: 42, temperatureZone: "wine-cellar", notes: "14°C constant, humidity 65%" },
  { id: "bin-005", storeId: "store-kitchen", code: "KD-D1-R1-S4-B02", zone: "Dry Store", aisle: "D1", rack: "R1", shelf: "S4", bin: "B02", capacityUnits: 150, usedUnits: 12, temperatureZone: "dry" },
  { id: "bin-006", storeId: "store-linen", code: "LN-L1-R2-S1-B03", zone: "Linen", aisle: "L1", rack: "R2", shelf: "S1", bin: "B03", capacityUnits: 600, usedUnits: 340, temperatureZone: "ambient" },
];

export const initialUnitConversions: UnitConversion[] = [
  { productId: "scp-001", baseUnit: "kg", purchaseUnit: "carton (10kg)", factor: 10, issueUnit: "g", issueFactor: 1000 },
  { productId: "scp-002", baseUnit: "bottle (1L)", purchaseUnit: "drum (25L)", factor: 25, issueUnit: "ml", issueFactor: 1000 },
  { productId: "scp-003", baseUnit: "bottle (33cl)", purchaseUnit: "crate (24)", factor: 24, issueUnit: "bottle (33cl)", issueFactor: 1 },
  { productId: "scp-007", baseUnit: "kg", purchaseUnit: "sack (25kg)", factor: 25, issueUnit: "g", issueFactor: 1000 },
  { productId: "scp-008", baseUnit: "roll", purchaseUnit: "carton (48)", factor: 48, issueUnit: "roll", issueFactor: 1 },
];

export const initialStoreRequisitions: StoreRequisition[] = [
  {
    id: "req-0043", requisitionNumber: "REQ-2026-0043", requestingDepartment: "Kitchen", issuingStoreId: "store-central", issuingStoreName: "Central Warehouse",
    requestedBy: "Chef Grace Adeyemi", approvedBy: "Daniel Okafor", requestDate: "2026-09-05", requiredDate: "2026-09-05", status: "issued", totalValue: 192000,
    lines: [{ productId: "scp-001", name: "Chicken Breast (Frozen)", requestedQty: 60, approvedQty: 60, issuedQty: 60, unit: "kg", unitCost: 3200, batchNumber: "B-CHK-0905" }],
    notes: "Weekend à la carte demand",
  },
  {
    id: "req-0044", requisitionNumber: "REQ-2026-0044", requestingDepartment: "Bar", issuingStoreId: "store-wine", issuingStoreName: "Wine & Beverage Cellar",
    requestedBy: "Emeka Nwankwo", approvedBy: "Daniel Okafor", requestDate: "2026-09-05", requiredDate: "2026-09-06", status: "issued", totalValue: 148000,
    lines: [{ productId: "scp-003", name: "Heineken Lager 33cl (Crate)", requestedQty: 8, approvedQty: 8, issuedQty: 8, unit: "crate", unitCost: 18500, batchNumber: "B-HEI-0828" }],
  },
  {
    id: "req-0045", requisitionNumber: "REQ-2026-0045", requestingDepartment: "Housekeeping", issuingStoreId: "store-linen", issuingStoreName: "Housekeeping Linen Store",
    requestedBy: "Blessing Uche", requestDate: "2026-09-05", requiredDate: "2026-09-07", status: "pending_approval", totalValue: 236000,
    lines: [
      { productId: "scp-008", name: "Toilet Paper (48-roll carton)", requestedQty: 6, approvedQty: 0, issuedQty: 0, unit: "carton", unitCost: 16000 },
      { productId: "scp-010", name: "Guest Amenities Kit", requestedQty: 140, approvedQty: 0, issuedQty: 0, unit: "kit", unitCost: 1000 },
    ],
    notes: "Monthly par top-up for floors 3–5",
  },
  {
    id: "req-0046", requisitionNumber: "REQ-2026-0046", requestingDepartment: "Engineering", issuingStoreId: "store-eng", issuingStoreName: "Engineering Spares",
    requestedBy: "Tunde Salami", approvedBy: "Daniel Okafor", requestDate: "2026-09-04", requiredDate: "2026-09-04", status: "issued", totalValue: 264000,
    lines: [{ productId: "scp-006", name: "HVAC Air Filters (MERV-13)", requestedQty: 12, approvedQty: 12, issuedQty: 12, unit: "unit", unitCost: 22000 }],
    notes: "Quarterly PM — floors 1 & 2 AHUs",
  },
  {
    id: "req-0047", requisitionNumber: "REQ-2026-0047", requestingDepartment: "Kitchen", issuingStoreId: "store-central", issuingStoreName: "Central Warehouse",
    requestedBy: "Chef Grace Adeyemi", requestDate: "2026-09-05", requiredDate: "2026-09-08", status: "approved", totalValue: 340000,
    lines: [{ productId: "scp-009", name: "Prawns (Frozen, Headless)", requestedQty: 40, approvedQty: 40, issuedQty: 0, unit: "kg", unitCost: 8500 }],
    notes: "Seafood buffet — awaiting FEFO batch allocation",
  },
];

export const initialSlowMovingStock: SlowMovingStock[] = [
  { productId: "scp-011", productName: "Imported Truffle Paste 500g", sku: "DR-TRF-500", storeName: "Central Warehouse", onHand: 18, lastMovementDate: "2026-06-12", daysSinceMovement: 85, tiedUpCapital: 1125000, suggestedAction: "promote" },
  { productId: "scp-012", productName: "Vintage Champagne (2015)", sku: "BV-CHP-2015", storeName: "Wine & Beverage Cellar", onHand: 24, lastMovementDate: "2026-07-02", daysSinceMovement: 65, tiedUpCapital: 2880000, suggestedAction: "discount" },
  { productId: "scp-013", productName: "Banquet Chair Covers (Gold)", sku: "EV-CHR-GLD", storeName: "Events Store", onHand: 400, lastMovementDate: "2026-05-20", daysSinceMovement: 108, tiedUpCapital: 1800000, suggestedAction: "transfer" },
  { productId: "scp-014", productName: "Decorative Room Vases (Ceramic)", sku: "HK-VAS-CER", storeName: "Housekeeping Linen Store", onHand: 60, lastMovementDate: null, daysSinceMovement: 180, tiedUpCapital: 900000, suggestedAction: "write_off" },
  { productId: "scp-015", productName: "Seasonal Detox Juice Blend", sku: "BV-JUI-DTX", storeName: "Kitchen Dry Store", onHand: 40, lastMovementDate: "2026-07-28", daysSinceMovement: 39, tiedUpCapital: 320000, suggestedAction: "promote" },
];

export const initialInventoryControlMetrics: InventoryControlMetrics = {
  totalSkus: 412,
  totalStores: 6,
  inventoryValue: 84320000,
  stockTurnoverRatio: 9.4,
  daysInventoryOutstanding: 38.8,
  shrinkagePct: 1.2,
  stockoutRatePct: 2.7,
  expiringWithin30Days: 6,
  expiringValueAtRisk: 1248000,
};

// ---------------------------------------------------------------------------
// Financial agility
// ---------------------------------------------------------------------------

export const initialFinancialRatios: FinancialRatio[] = [
  { id: "fr-01", name: "Current Ratio", category: "liquidity", value: 1.68, benchmark: 1.5, unit: "ratio", higherIsBetter: true, formula: "Current Assets ÷ Current Liabilities", interpretation: "Comfortably above the 1.5 hotel benchmark; liquidity is sound." },
  { id: "fr-02", name: "Quick Ratio", category: "liquidity", value: 1.12, benchmark: 1.0, unit: "ratio", higherIsBetter: true, formula: "(Current Assets − Inventory) ÷ Current Liabilities", interpretation: "Meets benchmark without relying on slow-moving stock." },
  { id: "fr-03", name: "GOPPAR", category: "hospitality", value: 42300, benchmark: 38000, unit: "currency", higherIsBetter: true, formula: "Gross Operating Profit ÷ Available Rooms", interpretation: "Gross operating profit per available room is ahead of comparable Lagos properties." },
  { id: "fr-04", name: "EBITDA Margin", category: "profitability", value: 0.286, benchmark: 0.25, unit: "percent", higherIsBetter: true, formula: "EBITDA ÷ Total Revenue", interpretation: "Healthy margin for a full-service city hotel; watch payroll creep." },
  { id: "fr-05", name: "Net Profit Margin", category: "profitability", value: 0.121, benchmark: 0.1, unit: "percent", higherIsBetter: true, formula: "Net Profit ÷ Total Revenue", interpretation: "Above the 10% benchmark after tax and financing." },
  { id: "fr-06", name: "Days Sales Outstanding", category: "efficiency", value: 41, benchmark: 35, unit: "days", higherIsBetter: false, formula: "AR ÷ Revenue × Days", interpretation: "City ledger collections run six days behind benchmark — chase corporate accounts." },
  { id: "fr-07", name: "Days Payable Outstanding", category: "efficiency", value: 33, benchmark: 40, unit: "days", higherIsBetter: true, formula: "AP ÷ COGS × Days", interpretation: "Paying vendors faster than benchmark; negotiate 45-day terms to free working capital." },
  { id: "fr-08", name: "Debt-to-Equity", category: "leverage", value: 0.72, benchmark: 0.9, unit: "ratio", higherIsBetter: false, formula: "Total Debt ÷ Total Equity", interpretation: "Conservative leverage with headroom for capex financing." },
  { id: "fr-09", name: "Interest Coverage", category: "leverage", value: 4.6, benchmark: 3.0, unit: "ratio", higherIsBetter: true, formula: "EBIT ÷ Interest Expense", interpretation: "Earnings cover interest comfortably — covenant headroom is strong." },
  { id: "fr-10", name: "RevPAR Index", category: "hospitality", value: 112, benchmark: 100, unit: "ratio", higherIsBetter: true, formula: "(Hotel RevPAR ÷ Comp Set RevPAR) × 100", interpretation: "Capturing 12% more revenue per available room than the competitive set." },
];

export const initialCashPosition: CashPositionPoint[] = [
  { date: "2026-09-05", operating: 4200000, investing: -1200000, financing: 0, closingCash: 38600000, minimumReserve: 25000000 },
  { date: "2026-09-12", operating: 2600000, investing: 0, financing: -3000000, closingCash: 38200000, minimumReserve: 25000000 },
  { date: "2026-09-19", operating: 1800000, investing: -450000, financing: 0, closingCash: 39550000, minimumReserve: 25000000 },
  { date: "2026-09-26", operating: 3400000, investing: 0, financing: -2500000, closingCash: 40450000, minimumReserve: 25000000 },
  { date: "2026-10-03", operating: -6200000, investing: 0, financing: 0, closingCash: 34250000, minimumReserve: 25000000 },
  { date: "2026-10-10", operating: 4600000, investing: 0, financing: -1500000, closingCash: 37350000, minimumReserve: 25000000 },
];

export const initialScenarios: ScenarioResult[] = [
  {
    id: "sc-base", name: "Base Case",
    assumptions: { occupancyAdjustmentPct: 0, adrAdjustmentPct: 0, payrollAdjustmentPct: 0, arCollectionDelayDays: 0, capexFreeze: false },
    projectedRevenue: 31200000, projectedEbitda: 8920000, projectedClosingCash: 37350000, runwayWeeks: 26, covenantBreach: false, verdict: "healthy",
  },
  {
    id: "sc-downside", name: "Downside — Occupancy −12%",
    assumptions: { occupancyAdjustmentPct: -12, adrAdjustmentPct: -3, payrollAdjustmentPct: 0, arCollectionDelayDays: 10, capexFreeze: false },
    projectedRevenue: 26180000, projectedEbitda: 5940000, projectedClosingCash: 22800000, runwayWeeks: 17, covenantBreach: true, verdict: "stressed",
  },
  {
    id: "sc-austerity", name: "Austerity Response",
    assumptions: { occupancyAdjustmentPct: -12, adrAdjustmentPct: -3, payrollAdjustmentPct: -8, arCollectionDelayDays: 10, capexFreeze: true },
    projectedRevenue: 26180000, projectedEbitda: 7480000, projectedClosingCash: 31200000, runwayWeeks: 24, covenantBreach: false, verdict: "watch",
  },
  {
    id: "sc-upside", name: "Upside — Compression Event",
    assumptions: { occupancyAdjustmentPct: 9, adrAdjustmentPct: 14, payrollAdjustmentPct: 4, arCollectionDelayDays: 0, capexFreeze: false },
    projectedRevenue: 38600000, projectedEbitda: 13100000, projectedClosingCash: 47600000, runwayWeeks: 32, covenantBreach: false, verdict: "healthy",
  },
];

export const initialTreasuryAccounts: TreasuryAccount[] = [
  { id: "ta-01", name: "Main Operating Account", bank: "GTBank", currency: "NGN", type: "operating", balance: 22400000, availableBalance: 21950000, sweepTarget: 18000000, lastReconciledAt: "2026-09-05T06:30:00", unreconciledItems: 2 },
  { id: "ta-02", name: "Payroll Account", bank: "Zenith Bank", currency: "NGN", type: "payroll", balance: 8200000, availableBalance: 8200000, lastReconciledAt: "2026-09-04T18:00:00", unreconciledItems: 0 },
  { id: "ta-03", name: "Tax & Statutory Account", bank: "Access Bank", currency: "NGN", type: "tax", balance: 4100000, availableBalance: 4100000, lastReconciledAt: "2026-09-03T17:15:00", unreconciledItems: 1 },
  { id: "ta-04", name: "Reserve / Escrow", bank: "First Bank", currency: "NGN", type: "reserve", balance: 25000000, availableBalance: 25000000, lastReconciledAt: "2026-09-01T12:00:00", unreconciledItems: 0 },
  { id: "ta-05", name: "Collections (Paystack)", bank: "Paystack Settlement", currency: "NGN", type: "collections", balance: 4900000, availableBalance: 4650000, sweepTarget: 0, lastReconciledAt: "2026-09-05T07:00:00", unreconciledItems: 4 },
];

export const initialCostVariances: CostVarianceLine[] = [
  { id: "cv-01", costCentre: "Food & Beverage — Kitchen", account: "Food Cost", budget: 6800000, actual: 7240000, variance: -440000, variancePct: -6.5, driver: "Seafood price spike + buffet over-production", favourable: false },
  { id: "cv-02", costCentre: "Housekeeping", account: "Laundry & Linen", budget: 2100000, actual: 1960000, variance: 140000, variancePct: 6.7, driver: "Outsourced laundry renegotiated", favourable: true },
  { id: "cv-03", costCentre: "Engineering", account: "Utilities & Diesel", budget: 5200000, actual: 6180000, variance: -980000, variancePct: -18.8, driver: "Grid outages — generator runtime up 34%", favourable: false },
  { id: "cv-04", costCentre: "Rooms Division", account: "Payroll", budget: 8900000, actual: 8920000, variance: -20000, variancePct: -0.2, driver: "On budget", favourable: false },
  { id: "cv-05", costCentre: "Sales & Marketing", account: "OTA Commissions", budget: 3200000, actual: 2890000, variance: 310000, variancePct: 9.7, driver: "Shift to direct bookings — channel mix improved", favourable: true },
  { id: "cv-06", costCentre: "Administration", account: "Professional Fees", budget: 1500000, actual: 1710000, variance: -210000, variancePct: -14.0, driver: "One-off tax advisory engagement", favourable: false },
];

export const initialFinancialAgility: FinancialAgilityData = {
  metrics: initialInventoryControlMetrics,
  ratios: initialFinancialRatios,
  cashPosition: initialCashPosition,
  scenarios: initialScenarios,
  treasuryAccounts: initialTreasuryAccounts,
  costVariances: initialCostVariances,
};
