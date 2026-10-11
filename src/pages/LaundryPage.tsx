import { useMemo, useState } from "react";
import { Badge, Card, CardHeader, PageHeader, StatCard, Table, Td, Tr } from "../components/ui/primitives";
import { Button, Chip, Field, Input, Modal, Select, useToast } from "../components/ui/kit";
import { useAncillary, type LaundryStatus } from "../store/ancillary";
import { usePlatform } from "../store/platform";
import { findOpenFolioForRoom, fmtTime } from "../lib/ancillary";
import { money, num } from "../lib/utils";
import { Shirt, Timer, Truck, WashingMachine } from "lucide-react";

const FLOW: LaundryStatus[] = ["collected", "washing", "ironing", "ready", "delivered"];
const TONE: Record<LaundryStatus, "info" | "accent" | "success" | "warning" | "neutral"> = {
  collected: "info",
  washing: "accent",
  ironing: "warning",
  ready: "success",
  delivered: "neutral",
};

export default function LaundryPage() {
  const { laundryOrders, createLaundryOrder, advanceLaundry } = useAncillary();
  const { folios, postCharge } = usePlatform();
  const { push } = useToast();
  const [open, setOpen] = useState(false);

  const active = laundryOrders.filter((o) => o.status !== "delivered");
  const revenue = laundryOrders.reduce((s, o) => s + o.amount, 0);

  const byStatus = useMemo(
    () => FLOW.map((s) => ({ status: s, items: laundryOrders.filter((o) => o.status === s) })),
    [laundryOrders],
  );

  const postAndDeliver = (id: string) => {
    const order = laundryOrders.find((o) => o.id === id);
    if (!order) return;
    const folio = findOpenFolioForRoom(folios, order.roomNumber);
    if (!folio) {
      push({ tone: "error", title: "No open folio", description: `Room ${order.roomNumber} has no in-house account.` });
      return;
    }
    postCharge(folio.id, `Laundry · ${order.service.replace("_", " ")} (${order.items} pcs)`, order.amount);
    advanceLaundry(id);
    advanceLaundry(id); // ready -> delivered on the same action
    push({ tone: "success", title: "Delivered & charged", description: `${money(order.amount)} → room ${order.roomNumber}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb="M-ANC · Ancillary Services"
        title="Laundry & Linen"
        subtitle="Guest laundry lifecycle from collection to delivery, with automatic folio posting on completion."
        actions={<Button variant="accent" leftIcon={<Shirt size={15} />} onClick={() => setOpen(true)}>New order</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active orders" value={num(active.length)} sub={`${num(laundryOrders.reduce((s, o) => s + o.items, 0))} garments in cycle`} icon={<WashingMachine size={16} />} />
        <StatCard label="Ready to deliver" value={num(laundryOrders.filter((o) => o.status === "ready").length)} accent="emerald" sub="awaiting room delivery" icon={<Truck size={16} />} />
        <StatCard label="Avg. turnaround" value="6.5 h" accent="sky" sub="collected → ready" icon={<Timer size={16} />} />
        <StatCard label="Laundry revenue" value={money(revenue, true)} accent="gold" sub="posted to folios" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {byStatus.map(({ status, items }) => (
          <Card key={status} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge className="capitalize">{status}</Badge>
              <span className="font-display text-lg text-brand-50">{items.length}</span>
            </div>
            <ul className="space-y-2">
              {items.map((o) => (
                <li key={o.id} className="rounded-lg border border-brand-800/60 bg-brand-950/50 p-2.5">
                  <p className="text-xs font-medium text-brand-50">{o.guestName}</p>
                  <p className="text-[10px] text-brand-200/50">Room {o.roomNumber} · {o.items} pcs · {o.service.replace("_", " ")}</p>
                  <p className="mt-1 text-[10px] text-gold-400/80">by {fmtTime(o.pledgedBy)}</p>
                </li>
              ))}
              {items.length === 0 ? <li className="py-2 text-center text-[11px] text-brand-200/35">—</li> : null}
            </ul>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Order register" subtitle="Full laundry ledger with folio status" />
        <Table head={["Guest", "Room", "Items", "Service", "Pledged", "Amount", "Status", "Action"]}>
          {laundryOrders.map((o) => (
            <Tr key={o.id}>
              <Td><span className="font-medium text-brand-50">{o.guestName}</span></Td>
              <Td><Chip tone="neutral">{o.roomNumber}</Chip></Td>
              <Td>{num(o.items)}</Td>
              <Td className="capitalize">{o.service.replace("_", " ")}</Td>
              <Td><span className="font-mono text-xs">{fmtTime(o.pledgedBy)}</span></Td>
              <Td><span className="font-mono text-xs tabular-nums">{money(o.amount)}</span></Td>
              <Td><Chip tone={TONE[o.status]}>{o.status}</Chip></Td>
              <Td>
                {o.status === "delivered" ? (
                  <span className="text-[11px] text-brand-200/40">Closed</span>
                ) : o.status === "ready" ? (
                  <Button size="sm" variant="secondary" onClick={() => postAndDeliver(o.id)}>Deliver & charge</Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => advanceLaundry(o.id)}>Advance</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <NewLaundryModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(o) => {
          createLaundryOrder(o);
          push({ tone: "success", title: "Laundry order created", description: `Room ${o.roomNumber} · ${o.items} items` });
        }}
      />
    </div>
  );
}

function NewLaundryModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (o: { roomNumber: string; guestName: string; items: number; service: "wash_fold" | "dry_clean" | "press" | "express"; amount: number; pledgedBy: string; notes?: string }) => void;
}) {
  const [roomNumber, setRoom] = useState("");
  const [guestName, setGuest] = useState("");
  const [items, setItems] = useState(5);
  const [service, setService] = useState<"wash_fold" | "dry_clean" | "press" | "express">("wash_fold");
  const [amount, setAmount] = useState(6000);

  const submit = () => {
    if (!roomNumber.trim() || !guestName.trim()) return;
    onCreate({ roomNumber: roomNumber.trim(), guestName: guestName.trim(), items, service, amount, pledgedBy: "2026-09-05T18:00" });
    setRoom(""); setGuest("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New laundry order"
      description="Log garments collected from a guest room."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="accent" onClick={submit}>Create order</Button></>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Room" required><Input value={roomNumber} onChange={(e) => setRoom(e.target.value)} placeholder="015" /></Field>
        <Field label="Guest name" required><Input value={guestName} onChange={(e) => setGuest(e.target.value)} placeholder="Ngozi Obi" /></Field>
        <Field label="Garment count"><Input type="number" min={1} value={items} onChange={(e) => setItems(Number(e.target.value))} /></Field>
        <Field label="Service">
          <Select value={service} onChange={(e) => setService(e.target.value as typeof service)}>
            <option value="wash_fold">Wash &amp; fold</option>
            <option value="dry_clean">Dry clean</option>
            <option value="press">Press only</option>
            <option value="express">Express (4h)</option>
          </Select>
        </Field>
        <Field label="Amount" className="sm:col-span-2"><Input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
      </div>
    </Modal>
  );
}
