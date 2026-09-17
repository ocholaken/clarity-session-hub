import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Check, Loader2, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

interface DbService {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
}

const HOURS = [9, 10, 11, 13, 14, 15, 16];

const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
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
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<"select" | "details" | "confirm">("select");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const services = [
    { id: "1", name: "Individual Therapy", description: "One-on-one counseling session", duration_minutes: 60, price: 3500 },
    { id: "2", name: "Couples Therapy", description: "Relationship counseling for couples", duration_minutes: 90, price: 5000 },
    { id: "3", name: "Family Session", description: "Family support and counseling", duration_minutes: 60, price: 4000 },
  ] as DbService[];
  const loadingServices = false;

  // Prefill from the signed-in account when available
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      setUser(u);
      if (!u) return;
      setForm((f) => ({
        ...f,
        email: f.email || u.email || "",
        name: f.name || (u.user_metadata?.full_name as string) || "",
      }));
    });
  }, []);

  const dayStart = date ? startOfDay(date) : null;
  const dayEnd = dayStart ? new Date(dayStart.getTime() + 86400000) : null;

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
  const isTaken = (_d: Date) => bookedTimes.length > 0;

  const goToDetails = () => {
    if (!service) return toast.error("Please choose a service");
    if (!slot) return toast.error("Please choose a date and time");
    setStep("details");
  };

  const handleContinue = () => {
    goToDetails();
  };

  const goToConfirm = () => {
    if (form.name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error("Please enter a valid email");
    if (!normalizeMpesaPhone(form.phone.trim())) return toast.error("Enter a valid M-Pesa number, for example 07XXXXXXXX");
    setStep("confirm");
  };

  const confirmBooking = async () => {
    if (!service || !slot) return;
    setSubmitting(true);

    console.log("SelectedDate:", date);
    console.log("SelectedTime:", slot);

    const selectedService = service;
    const selectedDate = date ? date.toISOString().split("T")[0] : null;
    const selectedTime = slot.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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

    const { data: payment, error: paymentError } = await supabase.functions.invoke("mpesa-stk", {
      body: { phone, amount: selectedService.price },
    });
    if (paymentError || !payment?.success) {
      setSubmitting(false);
      toast.error(payment?.error || paymentError?.message || "Unable to start M-Pesa payment");
      return;
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log("user", currentUser?.id);

    const { data, error } = await supabase.from("bookings").insert({
      user_id: currentUser?.id,
      counselor_id: selectedService?.id || "1",
      counselor_name: selectedService?.name || "Individual Therapy",
      booking_date: selectedDate,
      booking_time: selectedTime,
      status: "pending",
    }).select();

    console.log("Insert result:", { data, error });

    if (error) {
      setSubmitting(false);
      console.error("Supabase error:", error);
      toast.error(`Booking failed: ${error.message}`);
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
              <p className="text-lg md:text-xl text-gray-600">
                Choose a service, pick a free date and time, and confirm your session.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-5 md:p-8">
              {step === "select" && (
                <>
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">1. Choose a service</h2>
                    {loadingServices ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading services…
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
                              <span className="text-gray-500">{s.duration_minutes} min</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">2. Choose a date</h2>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setSlot(null);
                        }}
                        className="rounded-md border"
                        disabled={(d) => d < startOfDay(new Date()) || d.getDay() === 0}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-3">3. Choose a time</h2>
                    {!date ? (
                      <p className="text-gray-500 text-center">Please select a date first</p>
                    ) : loadingBooked ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-gray-500 text-center">No times left on this day.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {slots.map((d) => {
                          const taken = isTaken(d);
                          const selected = slot?.getTime() === d.getTime();
                          return (
                            <button
                              key={d.toISOString()}
                              type="button"
                              disabled={taken}
                              onClick={() => setSlot(d)}
                              className={`border rounded-md p-3 min-h-[48px] text-center transition-colors ${
                                taken
                                  ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                  : selected
                                  ? "bg-lavender-500 text-white border-lavender-500"
                                  : "hover:border-lavender-300 active:bg-lavender-50"
                              }`}
                            >
                              {d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                              {taken && <span className="block text-xs">Booked</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full sm:w-auto bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px] px-8"
                    onClick={handleContinue}
                    disabled={!date || !slot || !user || submitting}
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
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (M-Pesa number)</Label>
                      <Input
                        id="phone"
                        inputMode="tel"
                        placeholder="07XXXXXXXX or 2547XXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Anything we should know? (optional)</Label>
                      <Textarea
                        id="notes"
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

              {step === "confirm" && service && slot && (
                <div className="max-w-xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-lavender-600" /> Confirm your booking
                  </h2>
                  <dl className="space-y-4">
                    {[
                      ["Service", service.name],
                      ["Date", slot.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
                      ["Time", slot.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })],
                      ["Duration", `${service.duration_minutes} minutes`],
                      ["Name", form.name],
                      ["Email", form.email],
                      ["Phone", form.phone],
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
