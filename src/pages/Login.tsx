
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email.trim(),
      password: data.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error("Login failed", { description: error.message });
      return;
    }
    toast.success("Login successful!", { description: "Welcome back to Clarity Sessions!" });
    navigate("/");
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
                <Link to="/register" className="text-lavender-600 hover:underline font-medium">
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
