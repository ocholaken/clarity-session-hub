import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mb-4">
                <LockKeyhole className="w-8 h-8 text-lavender-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
              <p className="text-gray-600 mt-2 text-center">Choose a new password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New password</label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
              <Button type="submit" className="w-full bg-lavender-500 hover:bg-lavender-600 text-white" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;