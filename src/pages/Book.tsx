import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, Loader2, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { serviceCatalog, type CatalogService } from "@/lib/service-catalog";

type BookingInsert = {
  user_id: string;
  service_name: string;
  client_name: string;
  client_phone: string;
  school_name: string | null;
  contact_role: string;
  student_count: number;
  service_id: string;
  booking_date: string;
  booking_time: string;
  amount_due: number;
  status: string;
};

type BookingInsertClient = {
  from: (table: "bookings") => {
    select: (columns: "*") => {
      limit: (count: number) => PromiseLike<{
        data: unknown[] | null;
        error: { message: string } | null;
      }>;
    };
    insert: (values: BookingInsert[]) => {
      select: () => PromiseLike<{ data: unknown; error: { message: string } | null }>;
    };
  };
};

const HOURS = [9, 10, 11, 13, 14, 15, 16];

const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForDB = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return new Date(value).toISOString().split("T")[0];
};

const normalizeMpesaPhone = (value: string) => {
  const phone = value.replace(/\s+/g, "");
  if (/^07\d{8}$/.test(phone)) return `254${phone.slice(1)}`;
  if (/^01\d{8}$/.test(phone)) return `254${phone.slice(1)}`;
  if (/^2547\d{8}$/.test(phone)) return phone;
  if (/^2541\d{8}$/.test(phone)) return phone;
  if (/^\+2547\d{8}$/.test(phone)) return phone.slice(1);
  if (/^\+2541\d{8}$/.test(phone)) return phone.slice(1);
  return null;
};

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(() => startOfDay(new Date()));
  const [slot, setSlot] = useState<Date | null>(null);
  const [schoolTime, setSchoolTime] = useState("Morning (8am-12pm)");
  const [slotNotice, setSlotNotice] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<"select" | "details" | "confirm">("select");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [schoolDetails, setSchoolDetails] = useState({
    schoolName: "",
    contactRole: "",
    studentCount: "",
  });

  const services: CatalogService[] = serviceCatalog;
  const loadingServices = false;

  // Prefill from the signed-in account when available
  useEffect(() => {
    const requestedService = searchParams.get("service");
    if (requestedService && serviceCatalog.some((item) => item.id === requestedService)) {
      setServiceId(requestedService);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        const returnTo = `${location.pathname}${location.search}`;
        sessionStorage.setItem("redirectAfterLogin", returnTo);
        window.location.href = "/login";
        return;
      }
      setForm((f) => ({
        ...f,
        email: f.email || u.email || "",
        name: f.name || (u.user_metadata?.full_name as string) || "",
      }));
    });
  }, [location.pathname, location.search, navigate, searchParams]);

  const dayStart = date ? startOfDay(date) : null;

  const bookedTimes = [] as string[];
  const loadingBooked = false;

  const slots = useMemo(() => {
    if (!dayStart) return [];
    return HOURS.map((h) => {
      const d = new Date(dayStart);
      d.setHours(h, 0, 0, 0);
      return d;
    }).filter((d) => d.getTime() > Date.now());
  }, [dayStart]);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const isSchoolService = service?.category === "schools";
  const isTaken = (candidate: Date) =>
    bookedTimes.some((bookedTime) => new Date(bookedTime).getTime() === candidate.getTime());
  const availableSlots = slots.filter((candidate) => candidate.getTime() > Date.now() && !isTaken(candidate));

  useEffect(() => {
    if (!service || isSchoolService || !date || availableSlots.length > 0) return;

    const nextDay = startOfDay(date);
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getTime() <= startOfDay(new Date()).getTime()) return;

    setSlotNotice("Choose tomorrow - today fully booked");
    setDate(nextDay);
    setSlot(null);
  }, [availableSlots.length, date, isSchoolService, service]);

  const goToDetails = () => {
    if (!service) return toast.error("Please choose a service");
    if (!date) return toast.error("Please choose a date");
    if (isSchoolService ? !schoolTime : !slot) return toast.error("Please choose a date and time");
    setStep("details");
  };

  const handleContinue = () => {
    goToDetails();
  };

  const goToConfirm = () => {
    if (form.name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error("Please enter a valid email");
    if (isSchoolService && schoolDetails.schoolName.trim().length < 2) return toast.error("Please enter the school name");
    if (isSchoolService && !schoolDetails.contactRole) return toast.error("Please select your contact role");
    if (isSchoolService && (!Number.isInteger(Number(schoolDetails.studentCount)) || Number(schoolDetails.studentCount) < 1)) {
      return toast.error("Enter the number of students");
    }
    if (!form.phone.trim() || form.phone.trim().length < 10) return toast.error("Phone required");
    if (!/^07[0-9]{8}$/.test(form.phone.trim())) return toast.error("Enter a phone number in the format 07XXXXXXXX");
    if (!normalizeMpesaPhone(form.phone.trim())) return toast.error("Enter a valid M-Pesa number, for example 07XXXXXXXX");
    setStep("confirm");
  };

  const confirmBooking = async () => {
    if (!service || (!isSchoolService && !slot)) return;
    setSubmitting(true);

    const selectedService = service;
    const selectedDate = date ? formatLocalDate(date) : null;
    const selectedTime = isSchoolService
      ? schoolTime
      : slot?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? "";
    if (!selectedDate) {
      setSubmitting(false);
      toast.error("Select date first");
      return;
    }

    const phone = normalizeMpesaPhone(form.phone.trim());
    if (!phone) {
      setSubmitting(false);
      toast.error("Enter a valid M-Pesa number");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user;
    if (!currentUser) {
      setSubmitting(false);
      sessionStorage.setItem("redirectAfterLogin", `${location.pathname}${location.search}`);
      window.location.href = "/login";
      return;
    }

    const { data: payment, error: paymentError } = await supabase.functions.invoke("mpesa-stk", {
      body: { phone, amount: selectedService.price },
    });
    if (paymentError || !payment?.success) {
      setSubmitting(false);
      toast.error(payment?.error || paymentError?.message || "Unable to start M-Pesa payment");
      return;
    }

    const bookingsClient = (supabase as unknown as BookingInsertClient).from("bookings");
    const { error: columnProbeError } = await bookingsClient.select("*").limit(1);
    if (columnProbeError) {
      console.warn("Could not inspect existing bookings before insert", columnProbeError);
    }

    const payload: BookingInsert = {
      user_id: currentUser.id,
      client_name: form.name.trim() || schoolDetails.schoolName.trim(),
      client_phone: form.phone.trim(),
      school_name: schoolDetails.schoolName.trim() || null,
      contact_role: schoolDetails.contactRole || "Principal",
      student_count: Number.parseInt(schoolDetails.studentCount, 10) || 3000,
      service_name: selectedService.name,
      service_id: selectedService.id,
      booking_date: selectedDate || formatLocalDate(new Date()),
      booking_time: selectedTime || "Full Day",
      amount_due: selectedService.price,
      status: "pending",
    };
    const { error } = await bookingsClient.insert([payload]).select();

    if (error) {
      setSubmitting(false);
      console.error("Supabase error:", error);
      toast.error(error.message);
      return;
    }

    setSubmitting(false);

    toast.success(`Check ${form.phone.replace(/^254/, "0")} for STK prompt`);

    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-10 md:py-16 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Book a Session</h1>
              <p className="text-base md:text-xl text-gray-600">
                Choose a service, pick a free date and time, and confirm your session.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container">
            <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-4 shadow-md sm:p-5 md:p-8">
              {step === "select" && (
                <>
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">1. Choose a service</h2>
                    {loadingServices ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading services…
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                        {services.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setServiceId(s.id)}
                            className={`text-left border rounded-lg p-4 min-h-[64px] transition-colors ${
                              serviceId === s.id
                                ? "border-lavender-500 bg-lavender-50"
                                : "border-gray-200 hover:border-lavender-300 active:bg-lavender-50"
                            }`}
                          >
                            <div className="font-medium">{s.name}</div>
                            <div className="flex justify-between mt-2 text-sm">
                              <span className="text-lavender-600 font-semibold">
                                KES {Number(s.price).toLocaleString()}
                              </span>
                              <span className="text-gray-500">{s.duration_label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">2. Choose a date</h2>
                    <div className="mx-auto max-w-sm space-y-2">
                      <Label htmlFor="booking-date">Date</Label>
                      <Input
                        id="booking-date"
                        type="date"
                        className="block w-full py-3 px-4 rounded-xl border text-base"
                        required
                        value={date ? formatLocalDate(date) : ""}
                        min={formatLocalDate(new Date())}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          if (!value) {
                            setDate(undefined);
                            setSlot(null);
                            return;
                          }
                          const nextDate = new Date(`${value}T00:00:00`);
                          if (!isSchoolService && nextDate.getDay() === 0) {
                            setDate(date);
                            toast.error("Please choose a day other than Sunday");
                            return;
                          }
                          setSlotNotice("");
                          setDate(nextDate);
                          setSlot(null);
                        }}
                      />
                    </div>
                  </div>

                  {isSchoolService ? (
                    <div className="mb-8 max-w-sm space-y-2">
                      <Label htmlFor="school-time">3. Choose a time</Label>
                      <select
                        id="school-time"
                        value={schoolTime}
                        onChange={(event) => setSchoolTime(event.target.value)}
                        className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base"
                        required
                      >
                        <option>Morning (8am-12pm)</option>
                        <option>Afternoon (2pm-5pm)</option>
                        <option>Full Day</option>
                      </select>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-3">3. Choose a time</h2>
                      {slotNotice && <p className="mb-3 text-center text-sm text-amber-700">{slotNotice}</p>}
                      {!date ? (
                        <p className="text-gray-500 text-center">Please select a date first</p>
                      ) : loadingBooked ? (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-gray-500 text-center">No times available. Choose another day.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availableSlots.map((d) => {
                            const selected = slot?.getTime() === d.getTime();
                            return (
                              <button
                                key={d.toISOString()}
                                type="button"
                                onClick={() => setSlot(d)}
                                className={`border rounded-md p-3 min-h-[48px] text-center transition-colors ${
                                  selected
                                    ? "bg-lavender-500 text-white border-lavender-500"
                                    : "hover:border-lavender-300 active:bg-lavender-50"
                                }`}
                              >
                                {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    className="w-full sm:w-auto bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px] px-8"
                    onClick={handleContinue}
                    disabled={!date || (!isSchoolService && !slot) || !user || submitting}
                  >
                    {!user ? "Login to Continue" : "Continue"}
                  </Button>
                </>
              )}

              {step === "details" && (
                <div className="max-w-xl mx-auto">
                  <h2 className="text-lg font-semibold mb-4">4. Your details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{isSchoolService ? "Contact full name" : "Full name"}</Label>
                      <Input
                        id="name"
                        className="text-base"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        className="text-base"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isSchoolService ? "Contact Phone" : "Phone (M-Pesa number)"}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="text-base"
                        inputMode="tel"
                        pattern="^07[0-9]{8}$"
                        placeholder="07XXXXXXXX"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    {isSchoolService && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="school-name">School Name</Label>
                          <Input
                            id="school-name"
                            className="text-base"
                            required
                            value={schoolDetails.schoolName}
                            onChange={(event) => setSchoolDetails({ ...schoolDetails, schoolName: event.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-role">Contact Role</Label>
                          <select
                            id="contact-role"
                            required
                            value={schoolDetails.contactRole}
                            onChange={(event) => setSchoolDetails({ ...schoolDetails, contactRole: event.target.value })}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-base"
                          >
                            <option value="">Select a role</option>
                            <option value="Principal">Principal</option>
                            <option value="Deputy">Deputy</option>
                            <option value="G&C">Guidance &amp; Counselling</option>
                            <option value="Teacher">Teacher</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-count">Number of Students</Label>
                          <Input
                            id="student-count"
                            className="text-base"
                            type="number"
                            min="1"
                            required
                            value={schoolDetails.studentCount}
                            onChange={(event) => setSchoolDetails({ ...schoolDetails, studentCount: event.target.value })}
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Anything we should know? (optional)</Label>
                      <Textarea
                        id="notes"
                        className="text-base"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      className="bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px] flex-1"
                      onClick={goToConfirm}
                    >
                      Review booking
                    </Button>
                    <Button
                      variant="outline"
                      className="min-h-[48px] flex-1"
                      onClick={() => setStep("select")}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {step === "confirm" && service && date && (isSchoolService || slot) && (
                <div className="max-w-xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-lavender-600" /> Confirm your booking
                  </h2>
                  <dl className="space-y-4">
                    {[
                      ["Service", service.name],
                      ["Date", date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                      ["Time", isSchoolService ? schoolTime : slot?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) ?? ""],
                      ["Duration", service.duration_label],
                      [isSchoolService ? "Contact" : "Name", form.name],
                      ["Email", form.email],
                      ["Phone", form.phone],
                      ...(isSchoolService ? [
                        ["School", schoolDetails.schoolName],
                        ["Role", schoolDetails.contactRole],
                        ["Students", schoolDetails.studentCount],
                      ] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b pb-3 gap-4">
                        <dt className="text-gray-600">{k}</dt>
                        <dd className="font-medium text-right break-words">{v}</dd>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <dt className="text-gray-600">Amount due</dt>
                      <dd className="font-semibold text-lavender-600">
                        KES {Number(service.price).toLocaleString()}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      className="bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px] flex-1"
                      onClick={confirmBooking}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking…
                        </>
                      ) : (
                        <>
                          Confirm booking <Check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="min-h-[48px] flex-1"
                      onClick={() => setStep("details")}
                      disabled={submitting}
                    >
                      Back
                    </Button>
                  </div>
                  <p className="mt-5 text-sm text-center text-gray-500">
                  Check {form.phone.replace(/^254/, "0")} for STK prompt. Complete payment to finish your booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Book;
