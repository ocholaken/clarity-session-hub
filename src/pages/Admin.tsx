
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminAppointmentManagement from "@/components/admin/AdminAppointmentManagement";
import AdminSessionRecords from "@/components/admin/AdminSessionRecords";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminContentManagement from "@/components/admin/AdminContentManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  BookText, 
  PieChart, 
  Settings 
} from "lucide-react";

// Simple admin authentication - in a real app, this would use a secure authentication system
const ADMIN_PASSWORD = "admin123"; // This is just for demo purposes

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  const renderTabIcon = (tabName: string) => {
    switch (tabName) {
      case "overview":
        return <LayoutDashboard className="h-5 w-5" />;
      case "users":
        return <Users className="h-5 w-5" />;
      case "appointments":
        return <Calendar className="h-5 w-5" />;
      case "sessions":
        return <FileText className="h-5 w-5" />;
      case "payments":
        return <CreditCard className="h-5 w-5" />;
      case "content":
        return <BookText className="h-5 w-5" />;
      case "analytics":
        return <PieChart className="h-5 w-5" />;
      case "settings":
        return <Settings className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-8 md:py-12 bg-lavender-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">
                Manage your counseling service platform
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
          <section className="py-8 bg-gray-50">
            <div className="container">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-64 bg-white rounded-xl shadow-md p-4">
                    <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full">
                      {[
                        { id: "overview", label: "Dashboard" },
                        { id: "users", label: "User Management" },
                        { id: "appointments", label: "Appointments" },
                        { id: "sessions", label: "Session Records" },
                        { id: "payments", label: "Payments" },
                        { id: "content", label: "Content" },
                        { id: "analytics", label: "Analytics" },
                        { id: "settings", label: "Settings" }
                      ].map((tab) => (
                        <TabsTrigger 
                          key={tab.id}
                          value={tab.id} 
                          className="w-full justify-start px-3 py-2 mb-1 data-[state=active]:bg-lavender-100 data-[state=active]:text-lavender-800"
                        >
                          <span className="flex items-center">
                            {renderTabIcon(tab.id)}
                            <span className="ml-2">{tab.label}</span>
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <div className="mt-8">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setIsAuthenticated(false);
                          setPassword('');
                          toast.info("Logged out successfully");
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-xl shadow-md p-6">
                    <TabsContent value="overview" className="mt-0">
                      <AdminDashboardOverview />
                    </TabsContent>
                    <TabsContent value="users" className="mt-0">
                      <AdminUserManagement />
                    </TabsContent>
                    <TabsContent value="appointments" className="mt-0">
                      <AdminAppointmentManagement />
                    </TabsContent>
                    <TabsContent value="sessions" className="mt-0">
                      <AdminSessionRecords />
                    </TabsContent>
                    <TabsContent value="payments" className="mt-0">
                      <AdminPayments />
                    </TabsContent>
                    <TabsContent value="content" className="mt-0">
                      <AdminContentManagement />
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-0">
                      <AdminAnalytics />
                    </TabsContent>
                    <TabsContent value="settings" className="mt-0">
                      <AdminSettings />
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
