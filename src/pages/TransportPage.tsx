import { useState } from "react";
import { Card, CardHeader, PageHeader, StatCard, Table, Td, Tr } from "../components/ui/primitives";
import { Button, Chip, Field, Input, Modal, Select, useToast } from "../components/ui/kit";
import { useAncillary, type TransportStatus } from "../store/ancillary";
import { usePlatform } from "../store/platform";
import { findOpenFolioForRoom, fmtTime } from "../lib/ancillary";
import { money, num } from "../lib/utils";
import { Car, MapPin, Route, Users } from "lucide-react";

const TONE: Record<TransportStatus, "info" | "accent" | "success" | "danger" | "neutral"> = {
  requested: "info",
  assigned: "accent",
  en_route: "success",
  completed: "neutral",
  cancelled: "danger",
};
const TYPE_LABEL: Record<string, string> = {
  airport_transfer: "Airport transfer",
  city_tour: "City tour",
  car_rental: "Car rental",
  taxi: "Taxi",
};

export default function TransportPage() {
  const { transportJobs, createTransportJob, setTransportStatus } = useAncillary();
  const { folios, postCharge } = usePlatform();
  const { push } = useToast();
  const [open, setOpen] = useState(false);

  const active = transportJobs.filter((t) => t.status === "assigned" || t.status === "en_route" || t.status === "requested");
  const revenue = transportJobs.filter((t) => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  const complete = (id: string) => {
    const job = transportJobs.find((t) => t.id === id);
    if (!job) return;
    if (job.roomNumber) {
      const folio = findOpenFolioForRoom(folios, job.roomNumber);
      if (folio) postCharge(folio.id, `Transport · ${TYPE_LABEL[job.type]} to ${job.destination}`, job.amount);
    }
    setTransportStatus(id, "completed");
    push({ tone: "success", title: "Trip completed", description: job.roomNumber ? `${money(job.amount)} → room ${job.roomNumber}` : "Settled in cash" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="M-ANC · Ancillary Services"
        title="Transport & Tours"
        subtitle="Airport transfers, city tours and car rentals with driver dispatch and automatic guest billing."
        actions={<Button variant="accent" leftIcon={<Car size={15} />} onClick={() => setOpen(true)}>New trip</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active trips" value={num(active.length)} sub="requested, assigned or en-route" icon={<Route size={16} />} />
        <StatCard label="Drivers on duty" value="6" accent="sky" sub="2 vehicles spare" icon={<Users size={16} />} />
        <StatCard label="Completed revenue" value={money(revenue, true)} accent="emerald" sub="billed to folios" />
        <StatCard label="Fleet utilisation" value="72%" accent="gold" sub="today vs. capacity" icon={<Car size={16} />} />
      </div>

      <Card>
        <CardHeader title="Dispatch board" subtitle="Today's trips in pickup order" />
        <Table head={["Pickup", "Guest", "Room", "Type", "Vehicle / driver", "Destination", "Amount", "Status", "Action"]}>
          {[...transportJobs].sort((a, b) => a.pickupAt.localeCompare(b.pickupAt)).map((t) => (
            <Tr key={t.id}>
              <Td><span className="font-mono text-xs text-gold-300">{fmtTime(t.pickupAt)}</span></Td>
              <Td><span className="font-medium text-brand-50">{t.guestName}</span></Td>
              <Td>{t.roomNumber ? <Chip tone="neutral">{t.roomNumber}</Chip> : <span className="text-xs text-brand-200/40">—</span>}</Td>
              <Td>{TYPE_LABEL[t.type]}</Td>
              <Td>
                <span className="block text-xs text-brand-50">{t.vehicle}</span>
                <span className="block text-[10px] text-brand-200/45">{t.driver}</span>
              </Td>
              <Td><span className="flex items-center gap-1 text-xs text-brand-100/80"><MapPin size={11} /> {t.destination}</span></Td>
              <Td><span className="font-mono text-xs tabular-nums">{money(t.amount)}</span></Td>
              <Td><Chip tone={TONE[t.status]}>{t.status.replace("_", " ")}</Chip></Td>
              <Td>
                {t.status === "completed" || t.status === "cancelled" ? (
                  <span className="text-[11px] text-brand-200/40">Closed</span>
                ) : t.status === "en_route" ? (
                  <Button size="sm" variant="secondary" onClick={() => complete(t.id)}>Complete</Button>
                ) : t.status === "assigned" ? (
                  <Button size="sm" variant="ghost" onClick={() => setTransportStatus(t.id, "en_route")}>Depart</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setTransportStatus(t.id, "assigned")}>Assign</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <NewTransportModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(j) => {
          createTransportJob(j);
          push({ tone: "success", title: "Trip requested", description: `${j.guestName} · ${TYPE_LABEL[j.type]}` });
        }}
      />
    </div>
  );
}

function NewTransportModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (j: { guestName: string; roomNumber?: string; type: "airport_transfer" | "city_tour" | "car_rental" | "taxi"; vehicle: string; driver: string; pickupAt: string; destination: string; amount: number }) => void;
}) {
  const [guestName, setGuest] = useState("");
  const [roomNumber, setRoom] = useState("");
  const [type, setType] = useState<"airport_transfer" | "city_tour" | "car_rental" | "taxi">("airport_transfer");
  const [destination, setDest] = useState("");
  const [time, setTime] = useState("14:00");
  const [amount, setAmount] = useState(25000);

  const submit = () => {
    if (!guestName.trim() || !destination.trim()) return;
    onCreate({
      guestName: guestName.trim(), roomNumber: roomNumber || undefined, type,
      vehicle: "Toyota Hiace", driver: "Unassigned", pickupAt: `2026-09-05T${time}`, destination: destination.trim(), amount,
    });
    setGuest(""); setRoom(""); setDest("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New transport request"
      description="Book an airport transfer, city tour or car rental."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="accent" onClick={submit}>Request trip</Button></>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guest name" required><Input value={guestName} onChange={(e) => setGuest(e.target.value)} placeholder="Tunde Fashola" /></Field>
        <Field label="Room (optional)"><Input value={roomNumber} onChange={(e) => setRoom(e.target.value)} placeholder="041" /></Field>
        <Field label="Trip type">
          <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="airport_transfer">Airport transfer</option>
            <option value="city_tour">City tour</option>
            <option value="car_rental">Car rental</option>
            <option value="taxi">Taxi</option>
          </Select>
        </Field>
        <Field label="Pickup time"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        <Field label="Destination" required className="sm:col-span-2"><Input value={destination} onChange={(e) => setDest(e.target.value)} placeholder="MMIA Terminal 1" /></Field>
        <Field label="Charge amount" className="sm:col-span-2"><Input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
      </div>
    </Modal>
  );
}
