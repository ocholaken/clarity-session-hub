
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Resources from "./pages/Resources";
import Counselors from "./pages/Counselors";
import Book from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import SaturdaySessions from "./pages/SaturdaySessions";
import ProtectedBooking from "./components/ProtectedBooking";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminCounselors from "./pages/admin/AdminCounselors";
import ClarityAIChatbot from "./components/ClarityAIChatbot";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { useAnonymousTracking } from "./hooks/useAnonymousTracking";

const queryClient = new QueryClient();

const AppShell = () => {
  useAnonymousTracking();

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/counselors" element={<Counselors />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/book" element={<ProtectedBooking><Book /></ProtectedBooking>} />
        <Route path="/booking" element={<ProtectedBooking><Book /></ProtectedBooking>} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sessions/saturday" element={<SaturdaySessions />} />

        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Admin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="counselors" element={<AdminCounselors />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ClarityAIChatbot />
      <FloatingWhatsApp />
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AdminAuthProvider>
            <AppShell />
          </AdminAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
