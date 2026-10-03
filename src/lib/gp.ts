export type PublicGpEvent = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string | null;
};

export function datesOverlapEvent(
  startDate: string,
  endDate: string,
  events: PublicGpEvent[]
) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  return (
    events.find((event) => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      return start <= eventEnd && end >= eventStart;
    }) ?? null
  );
}

export function formatEventRange(start: string | Date, end: string | Date) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(s)} – ${fmt(e)}`;
}
