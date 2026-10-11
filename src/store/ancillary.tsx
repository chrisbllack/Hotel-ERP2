import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/* ============================================================================
 * Ancillary services domain — Spa & Wellness, Laundry, Transport.
 *
 * Kept in its own provider (rather than the main platform store) so the
 * hospitality-domain logic stays cohesive. Each page composes this with
 * usePlatform() to post service charges onto an in-house folio.
 * ========================================================================== */

export type SpaStatus = "booked" | "in_progress" | "completed" | "cancelled";
export type LaundryStatus = "collected" | "washing" | "ironing" | "ready" | "delivered";
export type TransportStatus = "requested" | "assigned" | "en_route" | "completed" | "cancelled";

export interface SpaTreatment {
  id: string;
  code: string;
  name: string;
  durationMin: number;
  price: number;
  category: "massage" | "facial" | "body" | "wellness";
}

export interface SpaAppointment {
  id: string;
  guestName: string;
  roomNumber?: string;
  therapist: string;
  treatmentId: string;
  slot: string; // ISO datetime
  status: SpaStatus;
  notes?: string;
}

export interface LaundryOrder {
  id: string;
  roomNumber: string;
  guestName: string;
  items: number;
  service: "wash_fold" | "dry_clean" | "press" | "express";
  status: LaundryStatus;
  amount: number;
  pledgedBy: string; // ISO datetime
  notes?: string;
}

export interface TransportJob {
  id: string;
  guestName: string;
  roomNumber?: string;
  type: "airport_transfer" | "city_tour" | "car_rental" | "taxi";
  vehicle: string;
  driver: string;
  pickupAt: string; // ISO datetime
  destination: string;
  status: TransportStatus;
  amount: number;
}

interface AncillaryState {
  treatments: SpaTreatment[];
  spaAppointments: SpaAppointment[];
  laundryOrders: LaundryOrder[];
  transportJobs: TransportJob[];
  createSpaAppointment: (a: Omit<SpaAppointment, "id" | "status">) => void;
  setSpaStatus: (id: string, status: SpaStatus) => void;
  createLaundryOrder: (o: Omit<LaundryOrder, "id" | "status">) => void;
  advanceLaundry: (id: string) => void;
  createTransportJob: (j: Omit<TransportJob, "id" | "status">) => void;
  setTransportStatus: (id: string, status: TransportStatus) => void;
}

const TREATMENTS: SpaTreatment[] = [
  { id: "trt-sw1", code: "SWD-60", name: "Signature Deep Tissue Massage", durationMin: 60, price: 35000, category: "massage" },
  { id: "trt-sw2", code: "ARO-90", name: "Aromatherapy Ritual", durationMin: 90, price: 52000, category: "massage" },
  { id: "trt-sw3", code: "FCL-45", name: "Radiance Facial", durationMin: 45, price: 28000, category: "facial" },
  { id: "trt-sw4", code: "SGR-120", name: "Shea & Gold Body Wrap", durationMin: 120, price: 68000, category: "body" },
  { id: "trt-sw5", code: "WEL-30", name: "Sauna & Steam Circuit", durationMin: 30, price: 15000, category: "wellness" },
];

const DAY = "2026-09-05";

const SPA_SEED: SpaAppointment[] = [
  { id: "spa-1", guestName: "Yusuf Bello", roomNumber: "050", therapist: "Ngozi A.", treatmentId: "trt-sw2", slot: `${DAY}T11:00`, status: "booked", notes: "VIP · firm pressure" },
  { id: "spa-2", guestName: "Adaeze Okonkwo", roomNumber: "001", therapist: "Bisi O.", treatmentId: "trt-sw3", slot: `${DAY}T13:30`, status: "in_progress" },
  { id: "spa-3", guestName: "Fatima Abubakar", roomNumber: "005", therapist: "Ngozi A.", treatmentId: "trt-sw1", slot: `${DAY}T15:00`, status: "booked" },
  { id: "spa-4", guestName: "Amara Eze", roomNumber: "042", therapist: "Chidi M.", treatmentId: "trt-sw5", slot: `${DAY}T09:00`, status: "completed" },
];

const LAUNDRY_SEED: LaundryOrder[] = [
  { id: "lau-1", roomNumber: "015", guestName: "Ngozi Obi", items: 8, service: "express", status: "washing", amount: 12000, pledgedBy: `${DAY}T19:00` },
  { id: "lau-2", roomNumber: "042", guestName: "Amara Eze", items: 4, service: "press", status: "ready", amount: 6000, pledgedBy: `${DAY}T16:00` },
  { id: "lau-3", roomNumber: "020", guestName: "Ibrahim Mohammed", items: 12, service: "wash_fold", status: "collected", amount: 15000, pledgedBy: `${DAY}T20:00`, notes: "Blood stain — pre-treat" },
  { id: "lau-4", roomNumber: "002", guestName: "Chukwuemeka Nwosu", items: 3, service: "dry_clean", status: "ironing", amount: 9000, pledgedBy: `${DAY}T18:30` },
];

const TRANSPORT_SEED: TransportJob[] = [
  { id: "trn-1", guestName: "Yusuf Bello", roomNumber: "050", type: "airport_transfer", vehicle: "Toyota Hiace", driver: "Musa I.", pickupAt: `${DAY}T06:30`, destination: "MMIA Terminal 1", status: "completed", amount: 25000 },
  { id: "trn-2", guestName: "Tunde Fashola", roomNumber: "041", type: "city_tour", vehicle: "Toyota Camry", driver: "Kunle A.", pickupAt: `${DAY}T10:00`, destination: "Lekki Conservation Centre", status: "en_route", amount: 40000 },
  { id: "trn-3", guestName: "Adaeze Okonkwo", roomNumber: "001", type: "airport_transfer", vehicle: "SUV Prado", driver: "Sani B.", pickupAt: `${DAY}T17:15`, destination: "MMIA Terminal 2", status: "assigned", amount: 35000 },
  { id: "trn-4", guestName: "Fatima Abubakar", roomNumber: "005", type: "car_rental", vehicle: "Honda CR-V", driver: "Self-drive", pickupAt: `${DAY}T09:00`, destination: "Victoria Island office", status: "completed", amount: 55000 },
];

const seq = () => Math.random().toString(36).slice(2, 8);

const AncillaryContext = createContext<AncillaryState | null>(null);

export function AncillaryProvider({ children }: { children: ReactNode }) {
  const [spaAppointments, setSpa] = useState<SpaAppointment[]>(SPA_SEED);
  const [laundryOrders, setLaundry] = useState<LaundryOrder[]>(LAUNDRY_SEED);
  const [transportJobs, setTransport] = useState<TransportJob[]>(TRANSPORT_SEED);

  const createSpaAppointment = useCallback<AncillaryState["createSpaAppointment"]>((a) => {
    setSpa((prev) => [...prev, { ...a, id: `spa-${seq()}`, status: "booked" }]);
  }, []);
  const setSpaStatus = useCallback<AncillaryState["setSpaStatus"]>((id, status) => {
    setSpa((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }, []);

  const createLaundryOrder = useCallback<AncillaryState["createLaundryOrder"]>((o) => {
    setLaundry((prev) => [...prev, { ...o, id: `lau-${seq()}`, status: "collected" }]);
  }, []);
  const advanceLaundry = useCallback<AncillaryState["advanceLaundry"]>((id) => {
    const order: LaundryStatus[] = ["collected", "washing", "ironing", "ready", "delivered"];
    setLaundry((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = order[Math.min(order.indexOf(o.status) + 1, order.length - 1)];
        return { ...o, status: next };
      }),
    );
  }, []);

  const createTransportJob = useCallback<AncillaryState["createTransportJob"]>((j) => {
    setTransport((prev) => [...prev, { ...j, id: `trn-${seq()}`, status: "requested" }]);
  }, []);
  const setTransportStatus = useCallback<AncillaryState["setTransportStatus"]>((id, status) => {
    setTransport((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const value = useMemo<AncillaryState>(
    () => ({
      treatments: TREATMENTS,
      spaAppointments,
      laundryOrders,
      transportJobs,
      createSpaAppointment,
      setSpaStatus,
      createLaundryOrder,
      advanceLaundry,
      createTransportJob,
      setTransportStatus,
    }),
    [spaAppointments, laundryOrders, transportJobs, createSpaAppointment, setSpaStatus, createLaundryOrder, advanceLaundry, createTransportJob, setTransportStatus],
  );

  return <AncillaryContext.Provider value={value}>{children}</AncillaryContext.Provider>;
}

export function useAncillary(): AncillaryState {
  const ctx = useContext(AncillaryContext);
  if (!ctx) throw new Error("useAncillary must be used within AncillaryProvider");
  return ctx;
}
