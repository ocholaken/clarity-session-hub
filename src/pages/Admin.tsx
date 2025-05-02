
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AdminDashboard from "@/components/AdminDashboard";

// Simple admin authentication - in a real app, this would use a secure authentication system
const ADMIN_PASSWORD = "admin123"; // This is just for demo purposes

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">
                Manage your bookings and appointments
              </p>
            </div>
          </div>
        </section>

        {!isAuthenticated ? (
          <section className="py-12">
            <div className="container">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          className="w-full"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-lavender-500 hover:bg-lavender-600 text-white"
                      >
                        Login
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <AdminDashboard />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
