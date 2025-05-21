'use client';

import { FormCategory } from '@/types';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import HallTicket from '@/components/form/HallTicket';
import HallTicketStatus from '@/components/form/HallTicketStatus';
import Link from 'next/link';

interface Props {
  submissionId: string;
  category: FormCategory;
}

export default function FormSubmit({ submissionId, category }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'confirmation' | 'hall-ticket'>('confirmation');
  const [statusChecked, setStatusChecked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Add entrance animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      try {
        if (statusChecked) return;
        
        const response = await fetch(`/api/submissions/${submissionId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // If the submission is approved, we can check for hall ticket
          if (data.status === 'approved') {
            const hallTicketResponse = await fetch(`/api/hall-tickets?uniqueId=${submissionId}`);
            
            if (hallTicketResponse.ok) {
              // If hall ticket exists, switch to hall ticket tab
              setActiveTab('hall-ticket');
            }
          }
          
          setStatusChecked(true);
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
      }
    };
    
    checkSubmissionStatus();
  }, [submissionId, statusChecked]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setIsCopied(true);
    toast.success('ID copied to clipboard!');
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const formatDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="text-center py-8">
      <div className={`transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <div className="mb-8">
          <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-green-100 mb-4 relative">
            <svg className="absolute inset-0 w-24 h-24 text-green-100 animate-ping opacity-30" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
            </svg>
            <svg
              className="w-12 h-12 text-green-600 relative"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Application Submitted Successfully!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Your entrance exam application has been received and is being processed. Please save your unique ID for future reference.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 max-w-xl mx-auto mb-8 shadow-sm border border-blue-100">
          <div className="text-sm text-gray-500 mb-2">Your Unique Application ID</div>
          <div className="flex items-center justify-center space-x-3">
            <div className="text-2xl font-mono font-bold text-indigo-700 tracking-wide">{submissionId}</div>
            <button
              onClick={handleCopyId}
              className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
              title="Copy ID"
            >
              {isCopied ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 text-gray-500 text-sm">
            Category: <span className="font-medium text-gray-700">{category}</span>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto border rounded-xl overflow-hidden bg-white shadow-md">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'confirmation'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('confirmation')}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirmation Details
              </span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'hall-ticket'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('hall-ticket')}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Hall Ticket
              </span>
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'confirmation' ? (
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Timeline</h3>
                  <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:h-full before:w-0.5 before:bg-blue-100">
                    <div className="relative">
                      <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800">Application Submitted</h4>
                      <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800">Application Review</h4>
                      <p className="text-xs text-gray-500">Expected by {formatDate(3)}</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-500">Hall Ticket Generation</h4>
                      <p className="text-xs text-gray-500">Available from June 25, 2025</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-500">Examination Date</h4>
                      <p className="text-xs text-gray-500">July 10, 2025</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium text-gray-500">Results Announcement</h4>
                      <p className="text-xs text-gray-500">August 05, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Information</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>You will receive a confirmation email shortly. Please check your inbox and spam folder.</li>
                          <li>Keep your application ID safe for future reference.</li>
                          <li>Your application is under review. Once approved, you'll be able to download your hall ticket.</li>
                          <li>Make sure to bring a printed copy of your hall ticket and a valid ID to the examination center.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <h3 className="text-base font-semibold text-blue-800 mb-3">Need Further Assistance?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start">
                      <div className="flex-shrink-0 text-blue-500">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Email Support</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Send us an email for any queries
                        </p>
                        <a href="mailto:support@entranceexam.org" className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-500">
                          support@entranceexam.org
                        </a>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-start">
                      <div className="flex-shrink-0 text-blue-500">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Helpline</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Call us for immediate assistance
                        </p>
                        <a href="tel:+919876543210" className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-500">
                          +91 9876 543 210
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('hall-ticket')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Check Hall Ticket Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* This component would be implemented separately */}
                {/* <HallTicket uniqueId={submissionId} /> */}
                
                {/* Placeholder for Hall Ticket component */}
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Hall Ticket Not Available Yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Hall tickets will be available for download from June 25, 2025. <br />
                    Please check back later or wait for our email notification.
                  </p>
                  
                  <div className="mt-6">
                    <div className="inline-flex items-center rounded-full px-4 py-2 bg-blue-100 text-blue-800 text-sm">
                      <svg className="mr-1.5 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Status: Pending Review
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">About Your Hall Ticket</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Once your application is approved, your hall ticket will be generated and made available for download. The hall ticket contains important details including your examination center, timing, and other important instructions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('confirmation')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Back to Confirmation Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 space-x-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h1a2 2 0 002-2v-7.586l-2-2z" />
            </svg>
            Back to Home
          </Link>
          
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </a>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For any queries, please contact us at{' '}
            <a href="mailto:support@entranceexam.org" className="text-blue-600 hover:text-blue-800 font-medium">
              support@entranceexam.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}