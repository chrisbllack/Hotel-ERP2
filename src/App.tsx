import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMarket } from "./i18n/MarketProvider";
import { AuthProvider } from "./auth/auth";
import { RequireAuth } from "./auth/RequireAuth";
import { PlatformProvider } from "./store/platform";
import { AncillaryProvider } from "./store/ancillary";
import { ToastProvider, Spinner } from "./components/ui/kit";
import { AppShell } from "./components/AppShell";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

/* Operational screens are route-split: each page loads on demand, keeping the
   initial payload small. Landing + auth stay eager so the public entry renders
   without a loading flash. */
const dashboard = lazy(() => import("./pages/DashboardPage"));
const frontDesk = lazy(() => import("./pages/FrontDeskPage"));
const shiftHandover = lazy(() => import("./pages/ShiftHandoverPage"));
const rooms = lazy(() => import("./pages/RoomsPage"));
const reservations = lazy(() => import("./pages/ReservationsPage"));
const housekeeping = lazy(() => import("./pages/HousekeepingPage"));
const maintenance = lazy(() => import("./pages/MaintenancePage"));
const yieldManagement = lazy(() => import("./pages/YieldManagementPage"));
const nightAudit = lazy(() => import("./pages/NightAuditPage"));
const pos = lazy(() => import("./pages/PosPage"));
const inventory = lazy(() => import("./pages/InventoryPage"));
const finance = lazy(() => import("./pages/FinancePage"));
const hr = lazy(() => import("./pages/HrPage"));
const crm = lazy(() => import("./pages/CrmPage"));
const channels = lazy(() => import("./pages/ChannelsPage"));
const payments = lazy(() => import("./pages/PaymentsPage"));
const events = lazy(() => import("./pages/EventsPage"));
const hardware = lazy(() => import("./pages/HardwarePage"));
const reports = lazy(() => import("./pages/ReportsPage"));
const admin = lazy(() => import("./pages/AdminPage"));
const localization = lazy(() => import("./pages/localization/LocalizationPage"));
const spa = lazy(() => import("./pages/SpaPage"));
const laundry = lazy(() => import("./pages/LaundryPage"));
const transport = lazy(() => import("./pages/TransportPage"));

const book = lazy(() => import("./pages/booking/BookPage"));
const guestDetails = lazy(() => import("./pages/booking/GuestDetailsPage"));
const confirmation = lazy(() => import("./pages/booking/ConfirmationPage"));
const bookingLookup = lazy(() => import("./pages/booking/BookingLookupPage"));

type LazyPage = LazyExoticComponent<ComponentType>;

const protectedRoutes: Array<[string, LazyPage]> = [
  ["/dashboard", dashboard],
  ["/front-desk", frontDesk],
  ["/shift-handover", shiftHandover],
  ["/rooms", rooms],
  ["/reservations", reservations],
  ["/housekeeping", housekeeping],
  ["/maintenance", maintenance],
  ["/yield-management", yieldManagement],
  ["/night-audit", nightAudit],
  ["/pos", pos],
  ["/inventory", inventory],
  ["/finance", finance],
  ["/hr", hr],
  ["/crm", crm],
  ["/spa", spa],
  ["/laundry", laundry],
  ["/transport", transport],
  ["/channels", channels],
  ["/payments", payments],
  ["/events", events],
  ["/hardware", hardware],
  ["/reports", reports],
  ["/localization", localization],
  ["/admin", admin],
];

const publicRoutes: Array<[string, LazyPage]> = [
  ["/book", book],
  ["/book/guests", guestDetails],
  ["/booking/confirmation", confirmation],
  ["/booking/lookup", bookingLookup],
];

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-brand-300">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export default function App() {
  // Re-render the routed subtree when the operating market changes so pure
  // formatting helpers (money/date) reflect the new currency/locale. Providers
  // above the key stay mounted, preserving auth and platform state.
  const { marketId } = useMarket();
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PlatformProvider>
            <AncillaryProvider>
              <AppRoutes key={marketId} />
            </AncillaryProvider>
          </PlatformProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public product surfaces */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {publicRoutes.map(([path, Page]) => (
          <Route key={path} path={path} element={<Page />} />
        ))}

        {/* Staff console (protected) */}
        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          {protectedRoutes.map(([path, Page]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
