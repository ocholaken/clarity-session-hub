
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Check,
  X,
  Clock,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    clientName: "John Doe",
    counselorName: "Dr. Emily Clark",
    service: "Individual Therapy",
    date: "2025-05-06",
    time: "10:00 AM",
    status: "confirmed",
    phone: "0712345678"
  },
  {
    id: 2,
    clientName: "Jane Smith",
    counselorName: "Dr. James Wilson",
    service: "Couples Counseling",
    date: "2025-05-06",
    time: "2:00 PM",
    status: "pending",
    phone: "0723456789"
  },
  {
    id: 3,
    clientName: "Robert Brown",
    counselorName: "Dr. Lisa Rodriguez",
    service: "Family Therapy",
    date: "2025-05-07",
    time: "3:00 PM",
    status: "confirmed",
    phone: "0769331729"
  },
  {
    id: 4,
    clientName: "Sarah Williams",
    counselorName: "Dr. David Kim",
    service: "Group Therapy",
    date: "2025-05-08",
    time: "11:00 AM",
    status: "canceled",
    phone: "0734567890"
  },
  {
    id: 5,
    clientName: "Michael Johnson",
    counselorName: "Dr. Emily Clark",
    service: "Individual Therapy",
    date: "2025-05-09",
    time: "9:00 AM",
    status: "completed",
    phone: "0745678901"
  }
];

const AdminAppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredAppointments = mockAppointments.filter(appointment => {
    // Search term filter
    const matchesSearch = 
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.counselorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm);
    
    // Status filter
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    // Date filter
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    toast.success(`Appointment ${appointmentId} status changed to ${newStatus}`);
  };

  // Count appointments by status
  const confirmedCount = mockAppointments.filter(a => a.status === "confirmed").length;
  const pendingCount = mockAppointments.filter(a => a.status === "pending").length;
  const canceledCount = mockAppointments.filter(a => a.status === "canceled").length;
  const completedCount = mockAppointments.filter(a => a.status === "completed").length;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Appointment Management</h2>
        <p className="text-gray-600 mb-6">
          View and manage all appointment bookings
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className={`border-l-4 ${statusFilter === "all" ? "border-l-lavender-500" : ""}`}>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">All</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{mockAppointments.length}</div>
          </CardContent>
        </Card>
        <Card 
          className={`border-l-4 ${statusFilter === "confirmed" ? "border-l-green-500" : ""}`} 
          onClick={() => setStatusFilter("confirmed")}
        >
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{confirmedCount}</div>
          </CardContent>
        </Card>
        <Card 
          className={`border-l-4 ${statusFilter === "pending" ? "border-l-yellow-500" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card 
          className={`border-l-4 ${statusFilter === "canceled" ? "border-l-red-500" : ""}`}
          onClick={() => setStatusFilter("canceled")}
        >
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{canceledCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-auto">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setDateFilter("");
          }}
          variant="outline"
          className="w-full md:w-auto"
        >
          Reset Filters
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Counselor</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.clientName}</TableCell>
                  <TableCell>{appointment.counselorName}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {appointment.status !== "confirmed" && appointment.status !== "completed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
                          onClick={() => handleStatusChange(appointment.id, "confirmed")}
                        >
                          <Check className="h-4 w-4 mr-1" /> Confirm
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                          onClick={() => handleStatusChange(appointment.id, "completed")}
                        >
                          <Clock className="h-4 w-4 mr-1" /> Mark Complete
                        </Button>
                      )}
                      {appointment.status !== "canceled" && appointment.status !== "completed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                          onClick={() => handleStatusChange(appointment.id, "canceled")}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAppointmentManagement;
