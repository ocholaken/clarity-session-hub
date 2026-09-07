import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CalendarDays } from "lucide-react";

interface Row {
  id: string;
  client_name: string;
  scheduled_at: string;
  status: string;
  notes: string | null;
  services: { name: string; price: number } | null;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-200 text-gray-700",
  missed: "bg-red-100 text-red-800",
};

const MyBookings = () => {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id,client_name,scheduled_at,status,notes,services(name,price)")
        .order("scheduled_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-10 md:py-14 bg-lavender-50">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">My Bookings</h1>
            <p className="text-gray-600">Track your sessions and their status.</p>
          </div>
        </section>

        <section className="py-10">
          <div className="container max-w-3xl">
            {userId === undefined ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-lavender-600" />
              </div>
            ) : userId === null ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="mb-4 text-gray-600">Please sign in to see your bookings.</p>
                <Button asChild className="bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px]">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-lavender-600" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <CalendarDays className="h-8 w-8 mx-auto mb-3 text-lavender-500" />
                <p className="mb-4 text-gray-600">You have no bookings yet.</p>
                <Button asChild className="bg-lavender-500 hover:bg-lavender-600 text-white min-h-[48px]">
                  <Link to="/book">Book a session</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li key={b.id} className="bg-white rounded-xl shadow-md p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{b.services?.name ?? "Session"}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(b.scheduled_at).toLocaleString(undefined, {
                            weekday: "short",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                        {b.notes && <p className="text-sm text-gray-500 mt-2">{b.notes}</p>}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[b.status] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {b.status}
                        </span>
                        {b.services && (
                          <p className="mt-2 text-sm font-semibold text-lavender-600">
                            KES {Number(b.services.price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
