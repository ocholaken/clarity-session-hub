
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Settings,
  User,
  Clock,
  Shield,
  Bell,
  Mail,
  Building,
  RefreshCw
} from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile settings
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("+254 123 456 789");
  
  // Business hours settings
  const [weekdayStart, setWeekdayStart] = useState("09:00");
  const [weekdayEnd, setWeekdayEnd] = useState("17:00");
  const [weekendStart, setWeekendStart] = useState("10:00");
  const [weekendEnd, setWeekendEnd] = useState("15:00");
  const [closedDays, setClosedDays] = useState(["Sunday"]);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  
  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleSaveBusinessHours = () => {
    toast.success("Business hours saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleResetSystem = () => {
    toast.success("System reset scheduled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Settings</h2>
        <p className="text-gray-600 mb-6">
          Manage your system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Business Hours
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="admin-name">Name</Label>
                <Input 
                  id="admin-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="admin-email">Email</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="admin-phone">Phone</Label>
                <Input 
                  id="admin-phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="admin-role">Role</Label>
                <Select defaultValue="superadmin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Office Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="admin-password">Change Password</Label>
                <Input id="admin-password" type="password" placeholder="New password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your operating hours and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Weekday Hours (Monday - Friday)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="weekday-start">Opening Time</Label>
                      <Input 
                        id="weekday-start" 
                        type="time" 
                        value={weekdayStart} 
                        onChange={(e) => setWeekdayStart(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="weekday-end">Closing Time</Label>
                      <Input 
                        id="weekday-end" 
                        type="time" 
                        value={weekdayEnd} 
                        onChange={(e) => setWeekdayEnd(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Weekend Hours (Saturday)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="weekend-start">Opening Time</Label>
                      <Input 
                        id="weekend-start" 
                        type="time" 
                        value={weekendStart} 
                        onChange={(e) => setWeekendStart(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="weekend-end">Closing Time</Label>
                      <Input 
                        id="weekend-end" 
                        type="time" 
                        value={weekendEnd} 
                        onChange={(e) => setWeekendEnd(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Closed Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`closed-${day}`} 
                          checked={closedDays.includes(day)} 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClosedDays([...closedDays, day]);
                            } else {
                              setClosedDays(closedDays.filter(d => d !== day));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`closed-${day}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBusinessHours} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                Save Business Hours
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch 
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              
              <div className="space-y-1 pt-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input 
                  id="password-expiry" 
                  type="number" 
                  value={passwordExpiry} 
                  onChange={(e) => setPasswordExpiry(e.target.value)} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for no expiration
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  value={sessionTimeout} 
                  onChange={(e) => setSessionTimeout(e.target.value)} 
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="user-roles">Default User Role</Label>
                <Select defaultValue="client">
                  <SelectTrigger id="user-roles">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch 
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Appointment Reminders</Label>
                  <p className="text-sm text-gray-500">
                    Send appointment reminders to clients
                  </p>
                </div>
                <Switch 
                  checked={appointmentReminders}
                  onCheckedChange={setAppointmentReminders}
                />
              </div>

              <div className="space-y-1 pt-2">
                <Label htmlFor="reminder-time">Reminder Time (hours before appointment)</Label>
                <Select defaultValue="24">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>
                  Manage system maintenance and backup options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Automatic Backup</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" onClick={() => toast.success("Backup started")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Manual Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Reset</CardTitle>
                <CardDescription>
                  Reset system settings or perform maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Resetting the system will clear temporary data and optimize performance.
                    This does not affect your client records or appointment data.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive"
                    onClick={handleResetSystem}
                  >
                    Reset System
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure email server settings for system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" placeholder="username@example.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("Test email sent")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Test Connection
                  </Button>
                  <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
                    Save Email Settings
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
