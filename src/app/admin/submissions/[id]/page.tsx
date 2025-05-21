'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/admin/DashboardHeader';
import Sidebar from '@/components/admin/Sidebar';
import SubmissionDetails from '@/components/admin/SubmissionDetails';
import { Submission } from '@/types';
import { toast } from 'react-hot-toast';
import AuthWrapper from '@/components/admin/AuthWrapper';

export default function SubmissionDetailPage() {
  const params = useParams();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching submission with id:', params.id);
        
        const response = await fetch(`/api/submissions/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch submission details');
        }
        
        const data = await response.json();
        console.log('Submission data received:', data);
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        let errorMessage = 'Error fetching submission details';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      fetchSubmission();
    }
  }, [params.id]);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <DashboardHeader />
        
        <div className="flex flex-1">
          <Sidebar />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-white shadow rounded-lg p-6 text-center text-red-500">
                  <h2 className="text-xl font-bold mb-2">Error Loading Submission</h2>
                  <p>{error}</p>
                  <p className="mt-4 text-gray-600">Please try refreshing the page or contact support.</p>
                </div>
              ) : submission ? (
                <SubmissionDetails submission={submission} />
              ) : (
                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                  <h2 className="text-xl font-bold mb-2">Submission Not Found</h2>
                  <p>The submission you're looking for may have been deleted or the ID is invalid.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthWrapper>
  );
}