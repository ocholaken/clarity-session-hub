
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
  FileDown,
  FileUp,
  Eye,
  Lock,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock data for session records
const mockSessionRecords = [
  {
    id: 1,
    clientName: "John Doe",
    counselorName: "Dr. Emily Clark",
    sessionType: "Individual Therapy",
    date: "2025-04-12",
    duration: "50 min",
    status: "completed",
    hasNotes: true,
    isConfidential: true
  },
  {
    id: 2,
    clientName: "Jane Smith",
    counselorName: "Dr. James Wilson",
    sessionType: "Couples Counseling",
    date: "2025-04-15",
    duration: "60 min",
    status: "completed",
    hasNotes: true,
    isConfidential: false
  },
  {
    id: 3,
    clientName: "Robert Brown",
    counselorName: "Dr. Lisa Rodriguez",
    sessionType: "Family Therapy",
    date: "2025-04-20",
    duration: "90 min",
    status: "no-show",
    hasNotes: false,
    isConfidential: false
  },
  {
    id: 4,
    clientName: "Sarah Williams",
    counselorName: "Dr. David Kim",
    sessionType: "Group Therapy",
    date: "2025-04-22",
    duration: "120 min",
    status: "completed",
    hasNotes: true,
    isConfidential: true
  },
  {
    id: 5,
    clientName: "Michael Johnson",
    counselorName: "Dr. Emily Clark",
    sessionType: "Individual Therapy",
    date: "2025-04-28",
    duration: "50 min",
    status: "canceled",
    hasNotes: false,
    isConfidential: false
  }
];

// Mock session notes
const mockSessionNote = `
# Session Notes: Individual Therapy

## Client Information
- Name: John Doe
- Date: April 12, 2025
- Session: #4

## Session Summary
Client discussed ongoing work stress and relationship difficulties. Reported improved sleep but continuing anxiety symptoms. Practiced mindfulness techniques during session.

## Key Observations
- Decreased anxiety symptoms since last session
- Improved engagement with coping strategies
- Still showing signs of avoidance with specific topics

## Treatment Plan Updates
- Continue weekly sessions
- Assign daily mindfulness practice
- Introduce cognitive restructuring techniques next session

## Next Steps
- Schedule follow-up for next week
- Review homework assignment
- Provide additional resources on stress management

## Confidentiality Note
This record contains confidential information protected by therapist-client privilege.
`;

const AdminSessionRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingNotes, setViewingNotes] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = mockSessionRecords.filter(record => 
    record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.counselorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.sessionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date.includes(searchTerm)
  );

  const openNotes = (record) => {
    setSelectedRecord(record);
    setViewingNotes(true);
  };

  const closeNotes = () => {
    setSelectedRecord(null);
    setViewingNotes(false);
  };

  const handleDownloadPDF = (id: number) => {
    toast.success(`Downloading session record #${id} as PDF`);
  };

  const handleUploadNotes = (id: number) => {
    toast.success(`Upload dialog for session #${id} opened`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "no-show":
        return "bg-red-100 text-red-800";
      case "canceled":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Session Records</h2>
        <p className="text-gray-600 mb-6">
          View and manage counseling session records and notes
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search session records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full md:w-80"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => toast.success("Exported all records")}
            className="hidden md:flex"
          >
            <FileDown className="mr-2 h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Counselor</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.clientName}</TableCell>
                  <TableCell>{record.counselorName}</TableCell>
                  <TableCell>{record.sessionType}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.isConfidential && (
                      <div className="flex items-center text-amber-600">
                        <Lock className="h-4 w-4 mr-1" />
                        <span className="text-xs">Confidential</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {record.hasNotes && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openNotes(record)}
                          className="h-8"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadPDF(record.id)}
                        className="h-8"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUploadNotes(record.id)}
                        className="h-8"
                      >
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No session records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewingNotes} onOpenChange={closeNotes}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Session Notes
            </DialogTitle>
            <DialogDescription>
              {selectedRecord && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{selectedRecord.clientName}</span> with {selectedRecord.counselorName} • {selectedRecord.date}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Card className="mt-2">
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                {mockSessionNote.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold mb-4">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.substring(3)}</h2>;
                  } else if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.substring(2)}</li>;
                  } else if (line === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i} className="mb-2">{line}</p>;
                  }
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button 
                variant="outline" 
                onClick={() => handleDownloadPDF(selectedRecord?.id)}
              >
                <FileDown className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              <Button 
                onClick={closeNotes}
              >
                Close
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSessionRecords;
