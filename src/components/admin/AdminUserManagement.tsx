
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
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck 
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for clients and counselors
const mockClients = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "0712345678", status: "active", joinDate: "2025-01-12" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0723456789", status: "active", joinDate: "2025-02-05" },
  { id: 3, name: "Robert Brown", email: "robert@example.com", phone: "0769331729", status: "blocked", joinDate: "2025-02-15" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "0734567890", status: "active", joinDate: "2025-03-22" },
  { id: 5, name: "Michael Johnson", email: "michael@example.com", phone: "0745678901", status: "active", joinDate: "2025-04-10" },
];

const mockCounselors = [
  { id: 1, name: "Dr. Emily Clark", email: "emily@example.com", phone: "0756789012", specialization: "Trauma Therapy", status: "active", joinDate: "2024-12-01" },
  { id: 2, name: "Dr. James Wilson", email: "james@example.com", phone: "0767890123", specialization: "Couples Therapy", status: "active", joinDate: "2025-01-15" },
  { id: 3, name: "Dr. Lisa Rodriguez", email: "lisa@example.com", phone: "0778901234", specialization: "Child Psychology", status: "inactive", joinDate: "2025-02-10" },
  { id: 4, name: "Dr. David Kim", email: "david@example.com", phone: "0789012345", specialization: "Depression & Anxiety", status: "active", joinDate: "2025-03-05" },
];

const AdminUserManagement = () => {
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [counselorSearchTerm, setCounselorSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clients");

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.phone.includes(clientSearchTerm)
  );

  const filteredCounselors = mockCounselors.filter(counselor => 
    counselor.name.toLowerCase().includes(counselorSearchTerm.toLowerCase()) ||
    counselor.email.toLowerCase().includes(counselorSearchTerm.toLowerCase()) ||
    counselor.phone.includes(counselorSearchTerm) ||
    counselor.specialization.toLowerCase().includes(counselorSearchTerm.toLowerCase())
  );

  const handleBlockUser = (id: number) => {
    toast.success(`User ${id} status updated`);
  };

  const handleDeleteUser = (id: number) => {
    toast.success(`User ${id} deleted successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600 mb-6">
          Manage clients and counselors on your platform
        </p>
      </div>

      <Tabs defaultValue="clients" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="counselors">Counselors</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Input
                placeholder="Search clients..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
              <UserPlus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.joinDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          client.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info(`Edit user: ${client.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBlockUser(client.id)}
                            className={client.status === "active" ? "border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700" : "border-green-200 bg-green-50 hover:bg-green-100 text-green-700"}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700" onClick={() => handleDeleteUser(client.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No clients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="counselors" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Input
                placeholder="Search counselors..."
                value={counselorSearchTerm}
                onChange={(e) => setCounselorSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
              <UserCheck className="mr-2 h-4 w-4" /> Add Counselor
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCounselors.length > 0 ? (
                  filteredCounselors.map((counselor) => (
                    <TableRow key={counselor.id}>
                      <TableCell className="font-medium">{counselor.name}</TableCell>
                      <TableCell>{counselor.email}</TableCell>
                      <TableCell>{counselor.phone}</TableCell>
                      <TableCell>{counselor.specialization}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          counselor.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {counselor.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info(`Edit counselor: ${counselor.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700" onClick={() => handleDeleteUser(counselor.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No counselors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUserManagement;
