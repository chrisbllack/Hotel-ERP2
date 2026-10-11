import { useMemo, useState } from "react";
import { Badge, Card, CardHeader, PageHeader, StatCard, Table, Td, Tr } from "../components/ui/primitives";
import { Button, Chip, Field, Input, Modal, Segmented, Select, useToast } from "../components/ui/kit";
import { useAncillary, type SpaStatus } from "../store/ancillary";
import { usePlatform } from "../store/platform";
import { findOpenFolioForRoom, fmtTime } from "../lib/ancillary";
import { money, num } from "../lib/utils";
import { CalendarCheck, Clock, Sparkles, Waves } from "lucide-react";

const STATUS_TONE: Record<SpaStatus, "info" | "accent" | "success" | "danger"> = {
  booked: "info",
  in_progress: "accent",
  completed: "success",
  cancelled: "danger",
};

export default function SpaPage() {
  const { treatments, spaAppointments, createSpaAppointment, setSpaStatus } = useAncillary();
  const { folios, postCharge } = usePlatform();
  const { push } = useToast();
  const [filter, setFilter] = useState<"all" | SpaStatus>("all");
  const [open, setOpen] = useState(false);

  const treatmentById = useMemo(() => new Map(treatments.map((t) => [t.id, t])), [treatments]);
  const rows = useMemo(
    () => spaAppointments.filter((a) => filter === "all" || a.status === filter).sort((a, b) => a.slot.localeCompare(b.slot)),
    [spaAppointments, filter],
  );

  const revenue = spaAppointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (treatmentById.get(a.treatmentId)?.price ?? 0), 0);
  const utilisation = treatments.length
    ? Math.round((spaAppointments.filter((a) => a.status !== "cancelled").length / (treatments.length * 3)) * 100)
    : 0;

  const postToFolio = (apptId: string) => {
    const appt = spaAppointments.find((a) => a.id === apptId);
    if (!appt) return;
    const treatment = treatmentById.get(appt.treatmentId);
    if (!treatment) return;
    const folio = findOpenFolioForRoom(folios, appt.roomNumber);
    if (!folio) {
      push({ tone: "error", title: "No open folio", description: `${appt.guestName} has no in-house account to post to.` });
      return;
    }
    const tax = Math.round(treatment.price * 0.075 * 100) / 100;
    postCharge(folio.id, `Spa · ${treatment.name}`, treatment.price + tax);
    setSpaStatus(appt.id, "completed");
    push({ tone: "success", title: "Posted to folio", description: `${money(treatment.price + tax)} → room ${appt.roomNumber}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="M-ANC · Ancillary Services"
        title="Spa & Wellness"
        subtitle="Treatment menu, therapist roster and booking desk — completed sessions post straight to the guest folio."
        actions={<Button variant="accent" leftIcon={<Sparkles size={15} />} onClick={() => setOpen(true)}>New booking</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today's bookings" value={num(spaAppointments.length)} sub="across 3 therapists" icon={<CalendarCheck size={16} />} />
        <StatCard label="In progress" value={num(spaAppointments.filter((a) => a.status === "in_progress").length)} accent="gold" sub="on the treatment floor" icon={<Waves size={16} />} />
        <StatCard label="Completed revenue" value={money(revenue, true)} accent="emerald" sub="posted to folios" />
        <StatCard label="Therapist utilisation" value={`${utilisation}%`} accent="sky" sub="vs. available slots" icon={<Clock size={16} />} />
      </div>

      <Card>
        <CardHeader
          title="Treatment diary"
          subtitle="Chronological schedule with live status"
          action={
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "booked", label: "Booked" },
                { value: "in_progress", label: "In progress" },
                { value: "completed", label: "Done" },
              ]}
            />
          }
        />
        <Table head={["Time", "Guest", "Room", "Treatment", "Therapist", "Price", "Status", ""]}>
          {rows.map((a) => {
            const t = treatmentById.get(a.treatmentId);
            return (
              <Tr key={a.id}>
                <Td><span className="font-mono text-xs text-gold-300">{fmtTime(a.slot)}</span></Td>
                <Td><span className="font-medium text-brand-50">{a.guestName}</span></Td>
                <Td>{a.roomNumber ? <Chip tone="neutral">{a.roomNumber}</Chip> : <span className="text-xs text-brand-200/40">day guest</span>}</Td>
                <Td>
                  <span className="block text-sm text-brand-50">{t?.name}</span>
                  <span className="block text-[11px] text-brand-200/45">{t?.durationMin} min · {t?.code}</span>
                </Td>
                <Td>{a.therapist}</Td>
                <Td><span className="font-mono text-xs tabular-nums">{money(t?.price ?? 0)}</span></Td>
                <Td><Chip tone={STATUS_TONE[a.status]}>{a.status.replace("_", " ")}</Chip></Td>
                <Td>
                  {a.status === "in_progress" ? (
                    <Button size="sm" variant="secondary" onClick={() => postToFolio(a.id)}>Charge to folio</Button>
                  ) : a.status === "booked" ? (
                    <Button size="sm" variant="ghost" onClick={() => setSpaStatus(a.id, "in_progress")}>Start</Button>
                  ) : null}
                </Td>
              </Tr>
            );
          })}
        </Table>
        {rows.length === 0 ? <p className="px-5 py-10 text-center text-sm text-brand-200/50">No appointments in this view.</p> : null}
      </Card>

      <Card>
        <CardHeader title="Treatment menu" subtitle="Priced services · posts with 7.5% VAT" />
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <div key={t.id} className="rounded-xl border border-brand-800/70 bg-brand-950/50 p-4">
              <div className="flex items-center justify-between">
                <Badge className="border-gold-500/30 bg-gold-500/10 text-gold-300">{t.category}</Badge>
                <span className="font-mono text-sm text-brand-50">{money(t.price)}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-brand-50">{t.name}</p>
              <p className="text-[11px] text-brand-200/50">{t.code} · {t.durationMin} minutes</p>
            </div>
          ))}
        </div>
      </Card>

      <NewSpaBookingModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(a) => {
          createSpaAppointment(a);
          push({ tone: "success", title: "Booking added", description: `${a.guestName} · ${fmtTime(a.slot)}` });
        }}
      />
    </div>
  );
}

function NewSpaBookingModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (a: { guestName: string; roomNumber?: string; therapist: string; treatmentId: string; slot: string; notes?: string }) => void;
}) {
  const { treatments } = useAncillary();
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [treatmentId, setTreatmentId] = useState(treatments[0]?.id ?? "");
  const [therapist, setTherapist] = useState("Ngozi A.");
  const [time, setTime] = useState("11:00");

  const submit = () => {
    if (!guestName.trim()) return;
    onCreate({ guestName: guestName.trim(), roomNumber: roomNumber || undefined, therapist, treatmentId, slot: `2026-09-05T${time}` });
    setGuestName(""); setRoomNumber("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New spa booking"
      description="Reserve a treatment slot for an in-house guest or day visitor."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="accent" onClick={submit}>Book treatment</Button></>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guest name" required className="sm:col-span-2">
          <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="e.g. Yusuf Bello" />
        </Field>
        <Field label="Room (optional)" hint="Leave blank for a day guest">
          <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="050" />
        </Field>
        <Field label="Time">
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Treatment">
          <Select value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)}>
            {treatments.map((t) => (
              <option key={t.id} value={t.id}>{t.name} · {money(t.price)}</option>
            ))}
          </Select>
        </Field>
        <Field label="Therapist">
          <Select value={therapist} onChange={(e) => setTherapist(e.target.value)}>
            {["Ngozi A.", "Bisi O.", "Chidi M.", "Halima Y."].map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
