import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow container py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          By booking a session with Clarity Sessions you agree to these terms. Sessions are
          provided by qualified counselors and are intended for personal growth and wellbeing;
          they are not a substitute for emergency medical care.
        </p>
        <p>
          Bookings are confirmed once payment is verified. If you need to cancel or reschedule,
          please do so at least 24 hours before your session so the time slot can be offered
          to another client.
        </p>
        <p>
          All information shared within sessions is confidential, except where disclosure is
          required by law or where there is a risk of harm.
        </p>
        <p>
          Misuse of the website, including attempting to access administrative areas without
          authorization, may result in account suspension.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
