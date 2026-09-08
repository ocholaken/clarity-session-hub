import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow container py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Clarity Sessions respects your privacy. Any personal information you share with us —
          such as your name, contact details and booking information — is used only to provide
          and manage your counseling sessions.
        </p>
        <p>
          Session notes and communications are treated as confidential and are only accessible
          to authorized staff. We never sell or share your personal data with third parties
          for marketing purposes.
        </p>
        <p>
          Payment information is processed securely by our payment providers; we never store
          card numbers, CVVs or mobile money PINs on our systems.
        </p>
        <p>
          You may request a copy or deletion of your personal data at any time by contacting us
          through the Contact page.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
