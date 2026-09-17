import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Unable to load messages");
      const data = await response.json() as ContactMessage[];
      setMessages(data);
    } catch (loadError) {
      console.error(loadError);
      setError("Messages could not be loaded. Make sure the development server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadMessages(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Clarity inbox</p>
          <h2 className="text-2xl font-bold tracking-tight">Contact Messages</h2>
          <p className="mt-1 text-muted-foreground">Every enquiry from the Clarity Sessions contact form.</p>
        </div>
        <Button variant="outline" onClick={() => void loadMessages()} disabled={isLoading} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Subject</th>
                  <th className="px-5 py-4 font-semibold">Message</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((item) => (
                  <tr key={`${item.date}-${item.email}`} className="align-top transition-colors hover:bg-secondary/50">
                    <td className="px-5 py-4 font-semibold text-foreground">{item.name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{item.email}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{item.subject}</td>
                    <td className="max-w-[360px] whitespace-pre-line px-5 py-4 leading-6 text-muted-foreground">{item.message}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">{new Date(item.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && messages.length === 0 && <div className="p-12 text-center text-muted-foreground"><Mail className="mx-auto mb-3 h-8 w-8 text-primary/60" /><p>No messages yet.</p></div>}
          {isLoading && <div className="p-12 text-center text-muted-foreground">Loading messages...</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
