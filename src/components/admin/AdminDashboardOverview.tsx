
import React from "react";
import { 
  Users, 
  Calendar, 
  UserCheck,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data for the dashboard
const mockData = {
  totalAppointments: 347,
  activeCounselors: 12,
  upcomingSessions: 28,
  totalUsers: 489,
  paymentsReceived: "$8,745",
  // Weekly appointment data
  weeklyAppointments: [
    { name: "Mon", appointments: 12 },
    { name: "Tue", appointments: 19 },
    { name: "Wed", appointments: 15 },
    { name: "Thu", appointments: 21 },
    { name: "Fri", appointments: 18 },
    { name: "Sat", appointments: 14 },
    { name: "Sun", appointments: 8 },
  ]
};

const AdminDashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2>
        <p className="text-gray-600 mb-6">
          At a glance summary of your counseling service platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Counselors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeCounselors}</div>
            <p className="text-xs text-muted-foreground">
              +2 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments Received</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.paymentsReceived}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{ appointments: {} }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockData.weeklyAppointments}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3} 
                      name="Appointments"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Sessions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="flex items-center p-3 border rounded-lg">
                  <div className="bg-lavender-100 p-2 rounded-full mr-3">
                    <Calendar className="h-5 w-5 text-lavender-600" />
                  </div>
                  <div>
                    <p className="font-medium">Session with {["John Doe", "Jane Smith", "Robert Brown", "Sarah Williams"][i]}</p>
                    <p className="text-sm text-gray-500">{["10:00 AM", "1:30 PM", "3:00 PM", "5:15 PM"][i]} - {["Individual Therapy", "Couples Counseling", "Family Therapy", "Group Therapy"][i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
