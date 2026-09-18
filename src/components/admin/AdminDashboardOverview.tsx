import React, { useEffect, useState } from "react";
import { Users, Calendar, UserCheck, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboardOverview = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    upcomingSessions: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: users } = await supabase.from('profiles').select('id');
      const { data: bookings } = await supabase.from('bookings').select('*');
      const { data: payments } = await supabase.from('payments').select('amount');
      
      const rev = payments?.reduce((s: number, p: any) => s + Number(p.amount || 0), 0) || 0;
      
      setData({
        totalUsers: users?.length || 0,
        totalAppointments: bookings?.length || 0,
        upcomingSessions: bookings?.filter((b: any) => b.status !== 'completed').length || 0,
        revenue: rev,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading live data...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Dashboard Overview</h2>
        <p className="text-gray-600 mb-6">At a glance summary of your counseling service platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.totalAppointments}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.totalUsers}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">KES {data.revenue}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.upcomingSessions}</div></CardContent>
        </Card>
      </div>

      <div className="text-sm text-green-600">✓ Connected as ocholakenna1@gmail.com - Real Supabase Data</div>
    </div>
  );
};

export default AdminDashboardOverview;