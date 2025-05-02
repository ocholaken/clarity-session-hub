
import React, { useState } from "react";
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";

// This would typically come from a database
// Mocking booking data for demonstration
const mockBookings = [
  {
    id: 1,
    name: "John Doe",
    phone: "0712345678",
    service: "Individual Therapy",
    date: "2025-05-05",
    time: "10:00 AM",
    status: "Confirmed"
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "0723456789",
    service: "Couples Counseling",
    date: "2025-05-06",
    time: "2:00 PM",
    status: "Pending"
  },
  {
    id: 3,
    name: "Michael Johnson",
    phone: "0769331729",
    service: "Family Therapy",
    date: "2025-05-07",
    time: "3:00 PM",
    status: "Confirmed"
  },
  {
    id: 4,
    name: "Sarah Williams",
    phone: "0734567890",
    service: "Group Therapy",
    date: "2025-05-08",
    time: "11:00 AM",
    status: "Canceled"
  },
  {
    id: 5,
    name: "Robert Brown",
    phone: "0769331729",
    service: "Individual Therapy",
    date: "2025-05-09",
    time: "9:00 AM",
    status: "Confirmed"
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState(mockBookings);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = mockBookings.filter(booking => 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setBookings(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    
    if (status === "all") {
      setBookings(mockBookings);
    } else {
      const filtered = mockBookings.filter(booking => 
        booking.status.toLowerCase() === status.toLowerCase()
      );
      setBookings(filtered);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    
    setBookings(updatedBookings);
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search by name, phone or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline">
                    <Search className="h-4 w-4 mr-2" /> Search
                  </Button>
                </form>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className={filterStatus === "all" ? "bg-lavender-500 hover:bg-lavender-600 text-white" : ""}
                  onClick={() => handleStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === "confirmed" ? "default" : "outline"}
                  className={filterStatus === "confirmed" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  onClick={() => handleStatusFilter("confirmed")}
                  size="sm"
                >
                  Confirmed
                </Button>
                <Button 
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  className={filterStatus === "pending" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                  onClick={() => handleStatusFilter("pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button 
                  variant={filterStatus === "canceled" ? "default" : "outline"}
                  className={filterStatus === "canceled" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                  onClick={() => handleStatusFilter("canceled")}
                  size="sm"
                >
                  Canceled
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Date
                      </div>
                    </TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                              onClick={() => handleStatusChange(booking.id, "Confirmed")}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                              onClick={() => handleStatusChange(booking.id, "Canceled")}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Booking Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.status === "Confirmed").length}
                    </div>
                    <div className="text-sm text-gray-500">Confirmed Bookings</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-yellow-600">
                      {bookings.filter(b => b.status === "Pending").length}
                    </div>
                    <div className="text-sm text-gray-500">Pending Bookings</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-gray-600">
                      {bookings.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
