
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StudentResultsTable from '../components/StudentResultsTable';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Define the type for student results
interface StudentResult {
  id: string;
  name: string;
  email: string;
  level1_score: number;
  level2_score: number;
  level3_score: number;
  total_score: number;
  last_attempt: string;
}

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<StudentResult[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(true);
  
  // If user is not logged in or not a teacher, redirect
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== 'teacher') {
    return <Navigate to="/dashboard" />;
  }
  
  // Fetch student results from Supabase when the component mounts
  useEffect(() => {
    const fetchStudentResults = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_performance')
          .select('*');
          
        if (error) {
          console.error('Error fetching student performance:', error);
          toast.error('Failed to load student results');
          setStudentResults([]);
          setFilteredResults([]);
        } else if (data) {
          // Process the data into the format we need
          const results: StudentResult[] = data.map(student => ({
            id: student.user_id || '',
            name: student.name || 'Unknown',
            email: student.email || 'No email',
            level1_score: student.level1_score || 0,
            level2_score: student.level2_score || 0,
            level3_score: student.level3_score || 0,
            total_score: student.total_score || 0,
            last_attempt: student.last_attempt || '',
          }));
          
          setStudentResults(results);
          setFilteredResults(results);
        }
      } catch (error) {
        console.error('Exception fetching student results:', error);
        toast.error('Failed to load student results');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentResults();
  }, [currentUser]);
  
  // Filter and sort results when search or sort criteria change
  useEffect(() => {
    let results = [...studentResults];
    
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
        case 'total_score':
          return b.total_score - a.total_score;
        case 'last_attempt':
          return new Date(b.last_attempt).getTime() - new Date(a.last_attempt).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredResults(results);
  }, [searchTerm, sortBy, studentResults]);
  
  // Export to CSV
  const handleExportCSV = () => {
    // Create CSV header
    let csv = 'Name,Email,Level 1 Score,Level 2 Score,Level 3 Score,Total Score,Last Attempt\n';
    
    // Add data rows
    filteredResults.forEach(student => {
      csv += `${student.name},${student.email},${student.level1_score},${student.level2_score},${student.level3_score},${student.total_score},${student.last_attempt}\n`;
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
      accessorKey: "level1_score",
      header: "Level 1",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level1_score}/10
        </div>
      ),
    },
    {
      accessorKey: "level2_score",
      header: "Level 2",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level2_score}/10
        </div>
      ),
    },
    {
      accessorKey: "level3_score",
      header: "Level 3",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.level3_score}/10
        </div>
      ),
    },
    {
      accessorKey: "total_score",
      header: "Overall",
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.total_score}/30
        </div>
      ),
    },
    {
      accessorKey: "last_attempt",
      header: "Last Attempt",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.last_attempt ? new Date(row.original.last_attempt).toLocaleDateString() : 'No attempts'}
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
            <div className="text-3xl font-bold">{filteredResults.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredResults.length > 0 
                ? Math.round(filteredResults.reduce((acc, student) => acc + student.total_score, 0) / filteredResults.length)
                : 0}/30
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredResults.length > 0
                ? Math.max(...filteredResults.map(student => student.total_score))
                : 0}/30
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredResults.length > 0
                ? Math.min(...filteredResults.map(student => student.total_score))
                : 0}/30
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
                  <SelectItem value="total_score">Highest Score</SelectItem>
                  <SelectItem value="last_attempt">Most Recent</SelectItem>
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
          
          {isLoading ? (
            <div className="text-center py-8">Loading student results...</div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No students match your search' : 'No student data available yet'}
            </div>
          ) : (
            <StudentResultsTable
              columns={columns}
              data={filteredResults}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
