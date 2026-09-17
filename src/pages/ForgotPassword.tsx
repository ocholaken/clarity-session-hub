import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "http://localhost:8080/reset-password",
    });

    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="w-8 h-8 text-lavender-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
              <p className="text-gray-600 mt-2 text-center">We&apos;ll send you a link to reset it.</p>
            </div>

            {sent ? (
              <div className="rounded-lg bg-lavender-50 p-4 text-center text-gray-700">
                <p className="font-semibold">Check your email</p>
                <p className="mt-1 text-sm">We sent a password reset link to {email}.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                <Button type="submit" className="w-full bg-lavender-500 hover:bg-lavender-600 text-white" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-lavender-600 hover:underline font-medium">Back to login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;