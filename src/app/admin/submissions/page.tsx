'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import Sidebar from '@/components/admin/Sidebar';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import { Submission } from '@/types';
import { toast } from 'react-hot-toast';
import AuthWrapper from '@/components/admin/AuthWrapper';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({
      total: 0,
      page: 1,
      limit: 10,
      pages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchSubmissions = async () => {
        try {
          setIsLoading(true);
          
          const response = await fetch('/api/submissions?page=1&limit=10');
          
          if (!response.ok) {
            throw new Error('Failed to fetch submissions');
          }
          
          const data = await response.json();
          setSubmissions(data.submissions);
          setPagination(data.pagination);
        } catch (error) {
          toast.error((error instanceof Error ? error.message : 'Error fetching submissions'));
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSubmissions();
    }, []);
  
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <DashboardHeader />
          
          <div className="flex flex-1">
            <Sidebar />
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submissions</h1>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <SubmissionsTable
                    initialSubmissions={submissions}
                    initialPagination={pagination}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </AuthWrapper>
    );
  }