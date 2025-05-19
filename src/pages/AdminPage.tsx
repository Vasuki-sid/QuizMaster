
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentResultsTable from '../components/StudentResultsTable';

// Sample data
const mockStudentResults = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    level1Score: 8,
    level2Score: 7,
    level3Score: 6,
    overallScore: 21,
    lastAttempt: '2025-05-18'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    level1Score: 9,
    level2Score: 8,
    level3Score: 7,
    overallScore: 24,
    lastAttempt: '2025-05-17'
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    email: 'mohammed@example.com',
    level1Score: 7,
    level2Score: 6,
    level3Score: 5,
    overallScore: 18,
    lastAttempt: '2025-05-16'
  },
  {
    id: '4',
    name: 'Sarah Green',
    email: 'sarah@example.com',
    level1Score: 10,
    level2Score: 9,
    level3Score: 8,
    overallScore: 27,
    lastAttempt: '2025-05-15'
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john@example.com',
    level1Score: 6,
    level2Score: 7,
    level3Score: 9,
    overallScore: 22,
    lastAttempt: '2025-05-15'
  }
];

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState(mockStudentResults);
  const [sortBy, setSortBy] = useState<string>('name');
  
  // If user is not logged in or not a teacher, redirect
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== 'teacher') {
    return <Navigate to="/dashboard" />;
  }
  
  // Filter and sort results when search or sort criteria change
  useEffect(() => {
    let results = [...mockStudentResults];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.email.toLowerCase().includes(term)
      );
    }
    
    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'overallScore':
          return b.overallScore - a.overallScore;
        case 'lastAttempt':
          return new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredResults(results);
  }, [searchTerm, sortBy]);
  
  // Export to CSV
  const handleExportCSV = () => {
    // Create CSV header
    let csv = 'Name,Email,Level 1 Score,Level 2 Score,Level 3 Score,Overall Score,Last Attempt\n';
    
    // Add data rows
    filteredResults.forEach(student => {
      csv += `${student.name},${student.email},${student.level1Score},${student.level2Score},${student.level3Score},${student.overallScore},${student.lastAttempt}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'student_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }: any) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: any) => <div className="text-sm">{row.original.email}</div>,
    },
    {
      accessorKey: "level1Score",
      header: "Level 1",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level1Score}/10
        </div>
      ),
    },
    {
      accessorKey: "level2Score",
      header: "Level 2",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level2Score}/10
        </div>
      ),
    },
    {
      accessorKey: "level3Score",
      header: "Level 3",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level3Score}/10
        </div>
      ),
    },
    {
      accessorKey: "overallScore",
      header: "Overall",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.overallScore}/30
        </div>
      ),
    },
    {
      accessorKey: "lastAttempt",
      header: "Last Attempt",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.original.lastAttempt).toLocaleDateString()}
        </div>
      ),
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
      <p className="text-gray-600 mb-8">View and manage student results</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStudentResults.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(mockStudentResults.reduce((acc, student) => acc + student.overallScore, 0) / mockStudentResults.length)}/30
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.max(...mockStudentResults.map(student => student.overallScore))}/30
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.min(...mockStudentResults.map(student => student.overallScore))}/30
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="overallScore">Highest Score</SelectItem>
                  <SelectItem value="lastAttempt">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleExportCSV}
              className="bg-quiz-primary hover:bg-quiz-secondary sm:w-auto"
            >
              Export CSV
            </Button>
          </div>
          
          <StudentResultsTable
            columns={columns}
            data={filteredResults}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
