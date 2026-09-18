import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;
      setSuccess("Thank you for messaging Clarity Session Hub! We have received your message and will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      setSuccess("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 max-w-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <Input name="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <Input name="phone" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input name="subject" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          <Textarea name="message" placeholder="Your message..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;