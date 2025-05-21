'use client';

import { useState, useEffect } from 'react';
import { FormStatus } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
  submissionId: string;
}

export default function HallTicketStatus({ submissionId }: Props) {
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [hallTicketExists, setHallTicketExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        
        // First check submission status
        const submissionResponse = await fetch(`/api/submissions/${submissionId}`);
        
        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          setStatus(submissionData.status);
          
          // If approved, check if hall ticket exists
          if (submissionData.status === FormStatus.APPROVED) {
            const hallTicketResponse = await fetch(`/api/hall-tickets?submissionId=${submissionId}`);
            
            if (hallTicketResponse.ok) {
              setHallTicketExists(true);
            }
          }
        } else {
          toast.error('Failed to check submission status');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        toast.error('An error occurred while checking status');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (submissionId) {
      checkStatus();
    }
  }, [submissionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (!status) {
      return {
        title: 'Status Unknown',
        description: 'Unable to determine the status of your application.',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: (
          <svg
            className="h-6 w-6 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
    }
    
    switch (status) {
      case FormStatus.DRAFT:
        return {
          title: 'Draft',
          description: 'Your application is in draft mode. Please complete and submit it for review.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: (
            <svg
              className="h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
        };
      case FormStatus.SUBMITTED:
        return {
          title: 'Under Review',
          description: 'Your application has been submitted and is currently under review.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: (
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case FormStatus.APPROVED:
        return {
          title: hallTicketExists ? 'Approved - Hall Ticket Available' : 'Approved - Hall Ticket Pending',
          description: hallTicketExists 
            ? 'Your application has been approved. You can now download your hall ticket.'
            : 'Your application has been approved. Your hall ticket will be available soon.',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: (
            <svg
              className="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case FormStatus.REJECTED:
        return {
          title: 'Rejected',
          description: 'We regret to inform you that your application has been rejected.',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: (
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      default:
        return {
          title: 'Status Unknown',
          description: 'Unable to determine the status of your application.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: (
            <svg
              className="h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`p-4 ${statusDisplay.bgColor} rounded-md`}>
      <div className="flex">
        <div className="flex-shrink-0">{statusDisplay.icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${statusDisplay.color}`}>
            {statusDisplay.title}
          </h3>
          <div className="mt-2 text-sm text-gray-700">
            <p>{statusDisplay.description}</p>
          </div>
          {status === FormStatus.APPROVED && hallTicketExists && (
            <div className="mt-4">
              <button
                onClick={() => router.push(`/check-hall-ticket?id=${submissionId}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Hall Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}