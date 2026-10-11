import type { Folio } from "../types";

/**
 * Find the open folio for a room so ancillary services (spa, laundry,
 * transport) can post their charge onto the guest's account.
 */
export function findOpenFolioForRoom(folios: Folio[], roomNumber?: string): Folio | undefined {
  if (!roomNumber) return undefined;
  return folios.find((f) => f.status === "open" && f.roomNumber === roomNumber);
}

export const fmtTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};
