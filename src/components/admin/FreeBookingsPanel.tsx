import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type FreeBooking = {
  id: string;
  service_name: string | null;
  customer_name: string | null;
  client_name?: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  client_phone?: string | null;
  phone?: string | null;
  school_name?: string | null;
  contact_role?: string | null;
  student_count?: number | null;
  amount_due?: number | null;
  price?: number | null;
  deposit?: number | null;
  service_category?: string | null;
  booking_date: string | null;
  booking_time?: string | null;
  status: string | null;
  created_at: string | null;
};

type BookingQueryResult = {
  data: FreeBooking[] | null;
  error: { message: string } | null;
};

type BookingDeleteResult = {
  error: { message: string } | null;
};

type BookingsClient = {
  from: (table: "bookings") => {
    select: (columns: "*") => {
      order: (
        column: "created_at",
        options: { ascending: false },
      ) => PromiseLike<BookingQueryResult>;
    };
    delete: () => {
      eq: (column: "id", value: string) => PromiseLike<BookingDeleteResult>;
    };
  };
};

const FreeBookingsPanel = ({
  onBookingsChange,
  title = "Free reservations",
}: {
  onBookingsChange: (bookings: FreeBooking[]) => void;
  title?: string;
}) => {
  const [bookings, setBookings] = useState<FreeBooking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await (supabase as unknown as BookingsClient)
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Free bookings load failed", queryError);
      setError(queryError.message);
      toast.error(`Could not load bookings: ${queryError.message}`);
      setLoading(false);
      return;
    }

    const loadedBookings = data ?? [];
    setBookings(loadedBookings);
    onBookingsChange(loadedBookings);
    setLoading(false);
  }, [onBookingsChange]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const visibleBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return bookings;

    return bookings.filter((booking) =>
      `${booking.school_name ?? ""} ${booking.client_name ?? ""} ${booking.customer_name ?? ""} ${booking.client_phone ?? ""} ${booking.customer_phone ?? ""} ${booking.phone ?? ""} ${booking.customer_email ?? ""}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [bookings, search]);

  const deleteBooking = async (booking: FreeBooking) => {
    const name = booking.customer_name || "this reservation";
    if (!window.confirm(`Delete the booking for ${name}? This cannot be undone.`)) return;

    setDeletingId(booking.id);
    const { error: deleteError } = await (supabase as unknown as BookingsClient)
      .from("bookings")
      .delete()
      .eq("id", booking.id);

    if (deleteError) {
      console.error("Free booking delete failed", deleteError);
      toast.error(`Could not delete booking: ${deleteError.message}`);
      setDeletingId(null);
      return;
    }

    const remainingBookings = bookings.filter((item) => item.id !== booking.id);
    setBookings(remainingBookings);
    onBookingsChange(remainingBookings);
    toast.success("Booking deleted");
    setDeletingId(null);
  };

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleString() : "—";
  const getPhone = (booking: FreeBooking) =>
    booking.client_phone || booking.customer_phone || booking.phone || "";
  const getName = (booking: FreeBooking) =>
    booking.client_name || booking.customer_name || booking.school_name || "—";
  const getAmount = (booking: FreeBooking) =>
    booking.amount_due ?? booking.price ?? booking.deposit;
  const getWhatsAppPhone = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, "");
    return /^0[17]\d{8}$/.test(digits) ? `254${digits.slice(1)}` : digits;
  };
  const isInstitutionBooking = (booking: FreeBooking) =>
    Boolean(booking.school_name) ||
    booking.service_category?.toLowerCase() === "schools" ||
    /school|bullying|teachers|leadership|exam/i.test(booking.service_name ?? "");
  const institutionBookings = visibleBookings.filter(isInstitutionBooking);
  const clinicalBookings = visibleBookings.filter(
    (booking) => !isInstitutionBooking(booking) && booking.service_category?.toLowerCase() !== "schools",
  );
  const institutionTotal = institutionBookings.reduce(
    (total, booking) => total + Number(getAmount(booking) ?? 0),
    0,
  );

  const renderPhone = (booking: FreeBooking) => {
    const phone = getPhone(booking);
    if (!phone) return <span className="text-red-600">MISSING</span>;

    return (
      <>
        <a href={`tel:${phone}`} className="text-blue-700 underline">{phone}</a>
        <a
          href={`https://wa.me/${getWhatsAppPhone(phone)}`}
          target="_blank"
          rel="noreferrer"
          className="ml-2 inline-flex rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white"
        >
          WhatsApp
        </a>
      </>
    );
  };

  const renderBookingsTable = (rows: FreeBooking[], institution: boolean) => {
    const columnCount = institution ? 12 : 7;

    return (
      <div className="overflow-x-auto rounded-xl border border-[#0a3322]/10">
        <table className={`w-full ${institution ? "min-w-[1450px]" : "min-w-[900px]"} border-collapse text-left text-sm`}>
          <thead className="bg-[#f4f1e7] text-[11px] uppercase tracking-[0.13em] text-[#315646]">
            <tr>
              <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Created</th>
              {institution ? (
                <>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">School Name</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Contact Person</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Role</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Phone</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Students</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Service</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Amount KES</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Time Period</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                </>
              ) : (
                <>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Customer Name</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Phone</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Service</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Time</th>
                </>
              )}
              <th scope="col" className="px-4 py-3 text-right font-semibold"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0a3322]/[0.08]">
            {loading ? (
              Array.from({ length: 4 }, (_, rowIndex) => (
                <tr key={rowIndex} aria-hidden="true">
                  {Array.from({ length: columnCount }, (_, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-[#0a3322]/[0.08]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-12 text-center text-sm text-slate-500">
                  {search
                    ? "No matching bookings found."
                    : institution
                      ? "No institution bookings yet."
                      : bookings.length === 0
                        ? "No free reservations yet"
                        : "No clinical bookings found."}
                </td>
              </tr>
            ) : (
              rows.map((booking) => {
                const status = (booking.status ?? "pending").toLowerCase();
                const statusClass =
                  status === "confirmed"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : status === "pending"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-slate-50 text-slate-700";

                return (
                  <tr key={booking.id} className="transition hover:bg-[#fbfaf6]">
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(booking.created_at)}</td>
                    {institution ? (
                      <>
                        <td className="px-4 py-4 font-semibold text-[#173b2d]">{booking.school_name || booking.client_name || "—"}</td>
                        <td className="px-4 py-4 text-slate-700">{booking.client_name || booking.customer_name || "—"}</td>
                        <td className="px-4 py-4 text-slate-700">{booking.contact_role || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-bold text-blue-700">{renderPhone(booking)}</td>
                        <td className="px-4 py-4 text-slate-700">{booking.student_count ?? "—"}</td>
                        <td className="px-4 py-4 text-slate-700">{booking.service_name || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                          {getAmount(booking) == null ? "—" : `KES ${Number(getAmount(booking)).toLocaleString()}`}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(booking.booking_date)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">{booking.booking_time || "—"}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 font-semibold text-[#173b2d]">{getName(booking)}</td>
                        <td className="whitespace-nowrap px-4 py-4 font-bold text-black">{renderPhone(booking)}</td>
                        <td className="px-4 py-4 text-slate-700">{booking.service_name || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(booking.booking_date ?? booking.created_at)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">{booking.booking_time || "—"}</td>
                      </>
                    )}
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void deleteBooking(booking)}
                        disabled={deletingId === booking.id}
                        aria-label={`Delete booking for ${getName(booking) === "—" ? "customer" : getName(booking)}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-white shadow-[0_24px_70px_rgba(10,51,34,0.12)]">
      <div className="flex flex-col gap-4 border-b border-[#d4af37]/25 bg-[#0a3322] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between md:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6cc75]">
            Clarity Sessions Hub
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-wide text-white sm:text-2xl">
              {title}
            </h2>
            <span className="inline-flex min-w-9 items-center justify-center rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 px-3 py-1 text-sm font-bold tabular-nums text-[#f3dc8c]">
              {bookings.length}
              <span className="sr-only"> total bookings</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void loadBookings()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#d4af37]/60 bg-[#d4af37]/10 px-4 py-2 text-sm font-semibold text-[#f3dc8c] transition hover:bg-[#d4af37]/20 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="space-y-4 p-4 md:p-6">
        <label className="relative block w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0a3322]/50" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer name or email"
            aria-label="Search bookings by customer name or email"
            className="h-11 w-full rounded-lg border border-[#0a3322]/15 bg-[#fbfaf6] pl-10 pr-3 text-sm text-[#173b2d] outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
          />
        </label>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Bookings could not be loaded. Check the bookings table access policy and try refreshing. {error}
          </div>
        )}

        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-[#0a3322]">
              Institution Bookings ({institutionBookings.length}) - Schools Program
            </h3>
            <p className="font-semibold text-[#725c12]">
              Total: KES {institutionTotal.toLocaleString()}
            </p>
          </div>
          {renderBookingsTable(institutionBookings, true)}
        </section>

        <section className="space-y-3 pt-3">
          <h3 className="text-lg font-semibold text-[#0a3322]">
            Clinical Bookings ({clinicalBookings.length})
          </h3>
          {renderBookingsTable(clinicalBookings, false)}
        </section>
      </div>
    </section>
  );
};

export default FreeBookingsPanel;
