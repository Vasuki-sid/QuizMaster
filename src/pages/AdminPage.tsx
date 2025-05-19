
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
  level1Score: number;
  level2Score: number;
  level3Score: number;
  overallScore: number;
  lastAttempt: string;
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
        // First get all profiles that are students
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student');
          
        if (profilesError) {
          throw profilesError;
        }
        
        if (!profiles || profiles.length === 0) {
          setStudentResults([]);
          setFilteredResults([]);
          setIsLoading(false);
          return;
        }
        
        // Then get all quiz attempts
        const { data: attempts, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('*')
          .in('user_id', profiles.map(profile => profile.id));
          
        if (attemptsError) {
          throw attemptsError;
        }
        
        // Process the data into the format we need
        const results: StudentResult[] = profiles.map(profile => {
          // Filter attempts for this student
          const studentAttempts = attempts?.filter(attempt => attempt.user_id === profile.id) || [];
          
          // Calculate scores by level
          const level1Attempts = studentAttempts.filter(attempt => attempt.level === 1);
          const level2Attempts = studentAttempts.filter(attempt => attempt.level === 2);
          const level3Attempts = studentAttempts.filter(attempt => attempt.level === 3);
          
          // Get the best score for each level
          const level1Score = level1Attempts.length > 0 
            ? Math.max(...level1Attempts.map(a => a.score)) : 0;
          const level2Score = level2Attempts.length > 0 
            ? Math.max(...level2Attempts.map(a => a.score)) : 0;
          const level3Score = level3Attempts.length > 0 
            ? Math.max(...level3Attempts.map(a => a.score)) : 0;
          
          // Calculate overall score
          const overallScore = level1Score + level2Score + level3Score;
          
          // Find the most recent attempt
          const lastAttempt = studentAttempts.length > 0
            ? studentAttempts.sort((a, b) => 
                new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime()
              )[0].attempted_at
            : '';
            
          return {
            id: profile.id,
            name: profile.name || 'Unknown',
            email: profile.email || 'No email',
            level1Score,
            level2Score,
            level3Score,
            overallScore,
            lastAttempt
          };
        });
        
        setStudentResults(results);
        setFilteredResults(results);
      } catch (error) {
        console.error('Error fetching student results:', error);
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
        case 'overallScore':
          return b.overallScore - a.overallScore;
        case 'lastAttempt':
          return new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime();
        default:
          return 0;
      }
    });
    
    setFilteredResults(results);
  }, [searchTerm, sortBy, studentResults]);
  
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
          {row.original.lastAttempt ? new Date(row.original.lastAttempt).toLocaleDateString() : 'No attempts'}
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
                ? Math.round(filteredResults.reduce((acc, student) => acc + student.overallScore, 0) / filteredResults.length)
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
                ? Math.max(...filteredResults.map(student => student.overallScore))
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
                ? Math.min(...filteredResults.map(student => student.overallScore))
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
