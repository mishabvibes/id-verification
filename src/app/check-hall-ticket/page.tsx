'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HallTicket from '@/components/form/HallTicket';
import Link from 'next/link';

export default function CheckHallTicketPage() {
  const [uniqueId, setUniqueId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [hallTicketFound, setHallTicketFound] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    // Entrance animation
    setIsVisible(true);
    
    // Check local storage for recently used IDs
    const storedIds = localStorage.getItem('recentHallTicketIds');
    if (storedIds) {
      try {
        const parsedIds = JSON.parse(storedIds);
        if (Array.isArray(parsedIds)) {
          setRecentIds(parsedIds.slice(0, 3)); // Keep only 3 most recent
        }
      } catch (error) {
        console.error('Failed to parse stored IDs:', error);
      }
    }
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uniqueId.trim()) {
      toast.error('Please enter your unique ID');
      return;
    }
    
    try {
      setIsChecking(true);
      
      // First check if the hall ticket exists
      const response = await fetch(`/api/hall-tickets?uniqueId=${uniqueId.trim()}`);
      
      if (response.ok) {
        // Store the ID in local storage for future use
        const cleanId = uniqueId.trim();
        const updatedIds = [cleanId, ...recentIds.filter(id => id !== cleanId)].slice(0, 3);
        localStorage.setItem('recentHallTicketIds', JSON.stringify(updatedIds));
        setRecentIds(updatedIds);
        
        // Fade out animation before showing hall ticket
        setIsVisible(false);
        setTimeout(() => {
          setHallTicketFound(true);
          setTimeout(() => setIsVisible(true), 100);
        }, 300);
      } else {
        if (response.status === 404) {
          toast.error('Hall ticket not found. It may not be issued yet or the ID is incorrect.');
        } else {
          throw new Error('Failed to check hall ticket');
        }
      }
    } catch (error) {
      console.error('Error checking hall ticket:', error);
      toast.error('Failed to check hall ticket. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleIdSelect = (id: string) => {
    setUniqueId(id);
  };

  const handleReset = () => {
    setIsVisible(false);
    setTimeout(() => {
      setHallTicketFound(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Hall Ticket Center
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Check, view and download your examination hall ticket
            </p>
          </div>
        </div>
        {/* Wave Divider */}
        <div className="relative mt-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#f9fafb">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      
      <main className="flex-grow py-12 -mt-6 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            {!hallTicketFound ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                <div className="mb-8 text-center">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Check Your Hall Ticket</h2>
                  <p className="mt-2 text-gray-600">
                    Enter your unique ID to view and download your examination hall ticket
                  </p>
                </div>
                
                <form onSubmit={handleCheck} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">
                      Your Unique Application ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="uniqueId"
                        value={uniqueId}
                        onChange={(e) => setUniqueId(e.target.value)}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                        placeholder="Enter your unique ID (e.g. ECC123456789)"
                        disabled={isChecking}
                      />
                      {uniqueId && (
                        <button
                          type="button"
                          onClick={() => setUniqueId('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {recentIds.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Recently Used IDs
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {recentIds.map((id, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleIdSelect(id)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isChecking}
                      className={`w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg flex items-center justify-center ${
                        isChecking ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isChecking ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking...
                        </>
                      ) : (
                        <>
                          Check Hall Ticket
                          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-800">Important Information:</h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Your hall ticket will be available after your application is approved and processed.</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Make sure to enter the unique ID provided when you submitted your application.</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <span>If you've lost your unique ID, please contact the examination office via email at <a href="mailto:support@entranceexam.org" className="text-blue-600 hover:underline">support@entranceexam.org</a>.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-center text-center pt-4">
                      <Link href="/form" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Haven't applied yet? Complete your application
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Search
                  </button>
                </div>
                
                <HallTicket uniqueId={uniqueId} />
              </div>
            )}
          </div>
          
          {/* Help Box */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you have any questions or need assistance with your hall ticket,
                  please contact our support team at{' '}
                  <a href="mailto:support@entranceexam.org" className="text-blue-600 hover:text-blue-800 font-medium">
                    support@entranceexam.org
                  </a>
                  {' '}or call{' '}
                  <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 font-medium">
                    +91 9876 543 210
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}