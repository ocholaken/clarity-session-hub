import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // <— IMPORTANT

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;
      alert("Message sent successfully! Thank you.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      alert("REAL ERROR: " + err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <Input placeholder="Phone (555) 123-4567" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <Input placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          <Textarea placeholder="Your message..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;