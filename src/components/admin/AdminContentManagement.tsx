
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
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  FilePlus,
  BookOpen,
  MessageCircle
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock content data
const mockArticles = [
  {
    id: 1,
    title: "Understanding Anxiety: Causes and Treatment Options",
    author: "Dr. Emily Clark",
    category: "Mental Health",
    date: "2025-04-10",
    status: "published",
    views: 1245
  },
  {
    id: 2,
    title: "5 Effective Strategies for Managing Depression",
    author: "Dr. James Wilson",
    category: "Mental Health",
    date: "2025-04-05",
    status: "published",
    views: 892
  },
  {
    id: 3,
    title: "Communication Skills for Healthy Relationships",
    author: "Dr. Lisa Rodriguez",
    category: "Relationships",
    date: "2025-03-28",
    status: "draft",
    views: 0
  },
  {
    id: 4,
    title: "Trauma-Informed Care: A Guide for Professionals",
    author: "Dr. David Kim",
    category: "Professional Resources",
    date: "2025-03-22",
    status: "published",
    views: 456
  },
  {
    id: 5,
    title: "Mindfulness Techniques for Stress Reduction",
    author: "Dr. Emily Clark",
    category: "Self-Help",
    date: "2025-03-15",
    status: "published",
    views: 1023
  }
];

const mockFAQs = [
  {
    id: 1,
    question: "How long does each counseling session last?",
    answer: "Our standard counseling sessions last 50 minutes. Extended sessions of 80 minutes are available upon request.",
    category: "Services",
    status: "published"
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, PayPal, and mobile payment options like MPesa for your convenience.",
    category: "Billing",
    status: "published"
  },
  {
    id: 3,
    question: "Is my information kept confidential?",
    answer: "Yes, all client information is kept strictly confidential in accordance with professional ethical standards and privacy laws.",
    category: "Privacy",
    status: "published"
  },
  {
    id: 4,
    question: "How do I cancel or reschedule an appointment?",
    answer: "You can cancel or reschedule appointments through your client portal or by calling our office at least 24 hours in advance.",
    category: "Appointments",
    status: "published"
  },
  {
    id: 5,
    question: "Do you offer online counseling sessions?",
    answer: "Yes, we offer secure video counseling sessions for clients who prefer remote appointments or cannot visit our office.",
    category: "Services",
    status: "draft"
  }
];

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFAQs = mockFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setEditing(true);
  };

  const handleSaveItem = () => {
    toast.success("Content saved successfully");
    setEditing(false);
    setCurrentItem(null);
  };

  const handleDeleteItem = (id: number, type: string) => {
    toast.success(`${type === 'article' ? 'Article' : 'FAQ'} deleted successfully`);
  };

  const handlePublish = (id: number, type: string) => {
    toast.success(`${type === 'article' ? 'Article' : 'FAQ'} published successfully`);
  };

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Published
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
        Draft
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Content Management</h2>
        <p className="text-gray-600 mb-6">
          Manage articles, blogs, FAQs, and other content resources
        </p>
      </div>

      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Articles
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> FAQs
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Resources
          </TabsTrigger>
        </TabsList>

        {!editing ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-80"
                />
              </div>
              <Button 
                onClick={() => {
                  setCurrentItem({});
                  setEditing(true);
                }}
                className="bg-lavender-500 hover:bg-lavender-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> 
                New {activeTab === "articles" ? "Article" : activeTab === "faqs" ? "FAQ" : "Resource"}
              </Button>
            </div>

            <TabsContent value="articles" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>{article.author}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>{article.date}</TableCell>
                          <TableCell>{article.views}</TableCell>
                          <TableCell>{getStatusBadge(article.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => toast.info(`Viewing article: ${article.title}`)} title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditItem(article)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {article.status === "draft" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-200 bg-green-50 hover:bg-green-100 text-green-700" 
                                  onClick={() => handlePublish(article.id, 'article')} 
                                  title="Publish"
                                >
                                  <FilePlus className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700" 
                                onClick={() => handleDeleteItem(article.id, 'article')}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No articles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="font-medium">{faq.question}</TableCell>
                          <TableCell>{faq.category}</TableCell>
                          <TableCell>{getStatusBadge(faq.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => handleEditItem(faq)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {faq.status === "draft" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-200 bg-green-50 hover:bg-green-100 text-green-700" 
                                  onClick={() => handlePublish(faq.id, 'faq')} 
                                  title="Publish"
                                >
                                  <FilePlus className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700" 
                                onClick={() => handleDeleteItem(faq.id, 'faq')}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No FAQs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({length: 6}).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg">
                        {["Anxiety Management Guide", "Depression Self-Help", "Relationship Communication Workbook", 
                          "Trauma Recovery Exercises", "Mindfulness Practice Guide", "Stress Management Techniques"][i]}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {["PDF Document", "Video Resource", "Interactive Workbook", 
                          "Audio Session", "PDF Worksheet", "Presentation"][i]}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </>
        ) : (
          <div className="bg-white rounded-md border p-6">
            {activeTab === "articles" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">
                  {currentItem?.id ? "Edit Article" : "Create Article"}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" defaultValue={currentItem?.title || ""} className="mt-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" defaultValue={currentItem?.author || ""} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" defaultValue={currentItem?.category || ""} className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" rows={15} className="mt-1" />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveItem} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                      Save Article
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">
                  {currentItem?.id ? "Edit FAQ" : "Create FAQ"}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input id="question" defaultValue={currentItem?.question || ""} className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea id="answer" defaultValue={currentItem?.answer || ""} rows={5} className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="faqCategory">Category</Label>
                    <Input id="faqCategory" defaultValue={currentItem?.category || ""} className="mt-1" />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveItem} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                      Save FAQ
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Upload Resource</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resourceTitle">Title</Label>
                    <Input id="resourceTitle" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="resourceType">Resource Type</Label>
                    <Input id="resourceType" placeholder="PDF, Video, Audio, etc." className="mt-1" />
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <FilePlus className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Button className="mt-4" variant="outline" size="sm">
                        Select File
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="resourceDescription">Description</Label>
                    <Textarea id="resourceDescription" rows={3} className="mt-1" />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveItem} className="bg-lavender-500 hover:bg-lavender-600 text-white">
                      Upload Resource
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default AdminContentManagement;
