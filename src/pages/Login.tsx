
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogIn, UserCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = sessionStorage.getItem("redirectAfterLogin") ?? searchParams.get("redirect");
  const pendingServiceId = searchParams.get("service");
  const wasRedirected = Boolean(redirectPath);
  const wasResourceRedirected = redirectPath?.startsWith("/resources") ?? false;

  useEffect(() => {
    if (location.state?.accountCreated) {
      toast.success("Account created successfully! Please sign in to continue.");
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location.pathname, location.search, location.state, navigate]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email.trim(),
      password: data.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error("Login failed", { description: error.message });
      return;
    }
    const signedInUser = authData.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signedInUser.id)
      .single();
    sessionStorage.setItem("user", JSON.stringify({ email: data.email.trim() }));
    let targetPath = "/";
    if (
      profile?.role === "admin" &&
      !redirectPath &&
      !pendingServiceId &&
      !localStorage.getItem("pending_booking_service")
    ) {
      targetPath = "/admin";
    } else {
      let storedServiceId: string | undefined;
      const pendingService = localStorage.getItem("pending_booking_service");
      if (pendingService) {
        try {
          const parsed: unknown = JSON.parse(pendingService);
          if (parsed && typeof parsed === "object" && "id" in parsed && typeof parsed.id === "string") {
            storedServiceId = parsed.id;
          }
        } catch {
          localStorage.removeItem("pending_booking_service");
        }
      }

      const serviceId = pendingServiceId ?? storedServiceId;
      const requestedRedirect = redirectPath?.startsWith("/") && !redirectPath.startsWith("//")
        ? redirectPath
        : "/";
      const destination = new URL(requestedRedirect, window.location.origin);
      if (serviceId) destination.searchParams.set("service", serviceId);
      targetPath = `${destination.pathname}${destination.search}${destination.hash}`;
    }
    sessionStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("pending_booking_service");
    toast.success("Login successful!", { description: "Welcome back to Clarity Sessions!" });
    window.location.href = targetPath;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-lavender-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
              {wasRedirected && (
                <p className="mt-3 text-sm font-medium text-lavender-600">
                  {wasResourceRedirected ? "Please log in to access this resource." : "Please log in to book a session."}
                </p>
              )}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          {...field} 
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-lavender-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-lavender-500 hover:bg-lavender-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to={`/register${window.location.search}`} className="text-lavender-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
