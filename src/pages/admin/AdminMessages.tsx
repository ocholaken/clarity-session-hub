import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/hooks/useAdminData";

const AdminMessages = () => {
  const { data: messages = [], isLoading } = useMessages();
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });

  const toggleRead = async (id: string, isRead: boolean) => {
    const { error } = await supabase.from("messages").update({ is_read: !isRead }).eq("id", id);
    if (error) return toast.error("Could not update the message");
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error("Could not delete the message");
    toast.success("Message deleted");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">Enquiries sent through the contact form.</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <Card key={m.id} className={m.is_read ? "" : "border-primary/40"}>
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{m.subject || "No subject"}</p>
                  {!m.is_read && (
                    <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">New</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {m.name} · {m.email} · {new Date(m.created_at).toLocaleString()}
                </p>
                <p className="mt-3 whitespace-pre-line">{m.message}</p>
              </div>
              <div className="flex sm:flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleRead(m.id, m.is_read)}>
                  {m.is_read ? <Mail className="h-4 w-4 mr-2" /> : <MailOpen className="h-4 w-4 mr-2" />}
                  {m.is_read ? "Unread" : "Read"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(m.id)}>
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && messages.length === 0 && (
          <p className="text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
