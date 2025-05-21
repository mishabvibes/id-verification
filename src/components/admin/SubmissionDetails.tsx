'use client';

import { useState, useEffect } from 'react';
import { Submission, FormStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import HallTicketGenerator from '@/components/admin/HallTicketGenerator';
import HallTicketView from '@/components/admin/HallTicketView';

interface Props {
  submission: Submission;
}

export default function SubmissionDetails({ submission }: Props) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<FormStatus>(submission.status);
  const [hallTicketExists, setHallTicketExists] = useState(false);
  const [isCheckingHallTicket, setIsCheckingHallTicket] = useState(true);

  useEffect(() => {
    const checkHallTicket = async () => {
      try {
        setIsCheckingHallTicket(true);
        
        const response = await fetch(`/api/hall-tickets?submissionId=${submission._id}`);
        
        if (response.ok) {
          setHallTicketExists(true);
        } else {
          setHallTicketExists(false);
        }
      } catch (error) {
        console.error('Error checking hall ticket:', error);
      } finally {
        setIsCheckingHallTicket(false);
      }
    };
    
    if (submission._id) {
      checkHallTicket();
    }
  }, [submission._id]);

  const handleStatusChange = async () => {
    if (updatedStatus === submission.status) {
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`/api/submissions/${submission._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      toast.success('Status updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/submissions/${submission._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      
      toast.success('Submission deleted successfully');
      router.push('/admin/submissions');
    } catch (error: any) {
      toast.error(error.message || 'Error deleting submission');
    }
  };

  const handleHallTicketGenerated = () => {
    setHallTicketExists(true);
  };

  const getStatusBadgeClass = (status: FormStatus) => {
    switch (status) {
      case FormStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case FormStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case FormStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case FormStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Submission Details
          </h1>
          <p className="text-gray-500 mt-1">
            Review and manage student submission
          </p>
        </div>
        
        <div className="flex space-x-2">
          <div>
            <select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value as FormStatus)}
              className="border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={FormStatus.DRAFT}>Draft</option>
              <option value={FormStatus.SUBMITTED}>Submitted</option>
              <option value={FormStatus.APPROVED}>Approved</option>
              <option value={FormStatus.REJECTED}>Rejected</option>
            </select>
          </div>
          
          <button
            onClick={handleStatusChange}
            disabled={updatedStatus === submission.status || isUpdating}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              updatedStatus === submission.status || isUpdating
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-gray-500 text-sm">Unique ID:</span>
            <span className="ml-1 font-semibold">{submission.uniqueId}</span>
          </div>
          
          <div>
            <span className="text-gray-500 text-sm">Category:</span>
            <span className="ml-1 font-semibold">{submission.category}</span>
          </div>
          
          <div>
            <span className="text-gray-500 text-sm">Status:</span>
            <span className={`ml-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(submission.status)}`}>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          </div>
          
          <div>
            <span className="text-gray-500 text-sm">Submitted on:</span>
            <span className="ml-1 font-semibold">
              {new Date(submission.createdAt).toLocaleDateString()} at{' '}
              {new Date(submission.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-lg">Personal Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1">{submission.personalDetails.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Father's Name</h3>
                <p className="mt-1">{submission.personalDetails.fatherName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1">{submission.personalDetails.dateOfBirth}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1">{submission.personalDetails.phoneNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">WhatsApp Number</h3>
                <p className="mt-1">{submission.personalDetails.whatsappNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">SKSSF Membership ID</h3>
                <p className="mt-1">{submission.personalDetails.skssflMembershipId}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Position Held</h3>
              <p className="mt-1">
                {submission.personalDetails.positionHeld || 'None specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 whitespace-pre-line">{submission.personalDetails.address}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Photo</h3>
              <div className="mt-2">
                <img
                  src={submission.personalDetails.photoUrl}
                  alt="Student Photo"
                  className="h-40 w-32 object-cover border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-lg">Education Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Institute Type</h3>
              <p className="mt-1">{submission.educationDetails.instituteType}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Institute Name</h3>
                <p className="mt-1">{submission.educationDetails.instituteName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {submission.educationDetails.instituteType === 'Dars' ? 'Mudaris Name' : 'Principal Name'}
                </h3>
                <p className="mt-1">{submission.educationDetails.principalOrMudarisName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">District</h3>
                <p className="mt-1">{submission.educationDetails.district}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">State</h3>
                <p className="mt-1">{submission.educationDetails.state}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Zone</h3>
                <p className="mt-1">{submission.educationDetails.zone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hall Ticket Details</h3>
              <p className="mt-1 whitespace-pre-line">{submission.educationDetails.hallTicketDetails}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Proof</h3>
              <div className="mt-2">
                {submission.educationDetails.paymentProofUrl.endsWith('.pdf') ? (
                  <a
                    href={submission.educationDetails.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View PDF
                  </a>
                ) : (
                  <img
                    src={submission.educationDetails.paymentProofUrl}
                    alt="Payment Proof"
                    className="h-40 w-auto object-cover border rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isCheckingHallTicket ? (
        <div className="flex justify-center items-center h-32 mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {submission.status === FormStatus.APPROVED && !hallTicketExists ? (
            <HallTicketGenerator 
              submission={submission} 
              onGenerated={handleHallTicketGenerated} 
            />
          ) : (
            hallTicketExists && <HallTicketView submissionId={submission._id!} />
          )}
        </>
      )}
    </div>
  );
}