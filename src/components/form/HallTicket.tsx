'use client';

import { useState, useEffect } from 'react';
import { HallTicket as HallTicketType } from '@/types';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  uniqueId: string;
}

export default function HallTicket({ uniqueId }: Props) {
  const [hallTicket, setHallTicket] = useState<HallTicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchHallTicket = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/hall-tickets?uniqueId=${uniqueId}`);
        
        if (response.ok) {
          const data = await response.json();
          setHallTicket(data);
          
          if (data.status === 'issued') {
            await fetch(`/api/hall-tickets/${data._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 'downloaded' }),
            });
          }
          
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
        } else {
          if (response.status === 404) {
            // Hall ticket not generated yet
          } else {
            throw new Error('Failed to fetch hall ticket');
          }
        }
      } catch (error) {
        console.error('Error fetching hall ticket:', error);
        toast.error('Failed to load hall ticket. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (uniqueId) {
      fetchHallTicket();
    }
  }, [uniqueId]);

  const generatePDF = async () => {
    const hallTicketElement = document.getElementById('hall-ticket');
    
    if (!hallTicketElement) {
      toast.error('Could not generate PDF. Please try again.');
      return;
    }
    
    try {
      setIsGenerating(true);
      toast.loading('Generating your hall ticket...');

      // Force render the hall ticket with proper dimensions
      hallTicketElement.style.position = 'absolute';
      hallTicketElement.style.top = '0';
      hallTicketElement.style.left = '0';
      hallTicketElement.style.width = '210mm';
      hallTicketElement.style.height = 'auto';
      hallTicketElement.style.opacity = '1';
      hallTicketElement.style.visibility = 'visible';
      hallTicketElement.style.backgroundColor = 'white';
      hallTicketElement.style.margin = '0';
      hallTicketElement.style.padding = '0';
      hallTicketElement.style.transform = 'none';
      
      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(hallTicketElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
        logging: true,
        onclone: (document, element) => {
          element.style.visibility = 'visible';
          element.style.opacity = '1';
          element.style.position = 'absolute';
          element.style.top = '0';
          element.style.left = '0';
        }
      });

      // Hide the element again
      hallTicketElement.style.position = 'fixed';
      hallTicketElement.style.visibility = 'hidden';
      hallTicketElement.style.opacity = '0';
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      pdf.save(`Hall_Ticket_${uniqueId}.pdf`);
      toast.dismiss();
      toast.success('Hall ticket downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 text-center border border-gray-200 shadow-md rounded mx-auto max-w-[210mm]">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading Your Hall Ticket</h3>
          <p className="text-gray-500">Please wait while we retrieve your examination details...</p>
        </div>
      </div>
    );
  }

  if (!hallTicket) {
    return (
      <div className="bg-white p-8 border border-gray-200 shadow-md rounded mx-auto max-w-[210mm]">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="rounded-full bg-gray-100 p-3">
              <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Hall Ticket Not Available Yet</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Your hall ticket is not available yet. It will be generated after your application is reviewed and approved.</p>
              <p className="mt-2">Check back later or contact the examination office for more information.</p>
            </div>
            <div className="mt-4 bg-gray-100 p-4 border border-gray-200 rounded">
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your application may still be under review.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hall tickets are typically issued 15 days before the examination date.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>For urgent assistance, please contact support@entranceexam.org.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[210mm]">
      {/* Download Button Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">Download Hall Ticket</h3>
            <p className="mt-1 text-sm text-gray-500">Application ID: {hallTicket?.uniqueId}</p>
          </div>

          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className={`w-full sm:w-auto px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isGenerating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Hall Ticket
              </span>
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Click the button above to download your hall ticket in PDF format
          </p>
        </div>
      </div>

      {/* Hidden hall ticket for PDF generation */}
      <div 
        id="hall-ticket" 
        className="fixed invisible"
        style={{
          width: '210mm',
          backgroundColor: 'white',
          position: 'fixed',
          top: 0,
          left: 0,
          opacity: 0,
          zIndex: -1000,
        }}
      >
        <div className="bg-white">
          {/* Header */}
          <div className="px-8 py-6 border-b-2 border-black">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wider text-gray-900 uppercase">SKSSF TWALABA WING MALAPPURAM EAST</h1>
              <div className="mt-5 inline-block border-2 border-black px-6 py-1.5">
                <h2 className="text-xl font-bold tracking-wider text-gray-900 uppercase">ENTRANCE EXAMINATION HALL TICKET</h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Examination details */}
            <div className="mb-6 grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Academic Year</p>
                <p className="text-base font-bold">2025-2026</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Examination Date</p>
                <p className="text-base font-bold">05-10-2025 (10:00 AM - 01:00 PM)</p>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-600">Application Number</p>
                      <p className="text-base font-bold">{hallTicket?.uniqueId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-600">Program Code</p>
                      <p className="text-base font-bold">{hallTicket?.programCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-600">Candidate Name</p>
                    <p className="text-base font-bold">{hallTicket?.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-600">Date of Birth</p>
                      <p className="text-base">{hallTicket?.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-600">Membership ID</p>
                      <p className="text-base">{hallTicket?.membershipId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-600">Zone</p>
                    <p className="text-base">{hallTicket?.zone}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-600">Examination Centre</p>
                    <p className="text-base">{hallTicket?.centre}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="border-2 border-black w-full h-48 flex items-center justify-center bg-gray-50">
                  {hallTicket?.photoUrl ? (
                    <img 
                      src={hallTicket.photoUrl} 
                      alt="Candidate Photo" 
                      className="h-full w-auto object-contain"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-xs text-gray-500">Affix recent passport size photograph with attestation</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 flex justify-between">
              <div>
                <div className="border-b-2 border-black w-48 h-16"></div>
                <p className="mt-1 text-xs text-gray-600">Principal/Mudaris Signature</p>
              </div>
              <div>
                <div className="border-b-2 border-black w-48 h-16"></div>
                <p className="mt-1 text-xs text-gray-600">SKSSF Unit Secretary Signature</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 border-t-2 border-black mt-4">
            <div className="flex justify-between">
              <p className="text-xs font-medium text-gray-600">REF: AI/EEP/2025/{hallTicket?.uniqueId}</p>
              <p className="text-xs font-medium text-gray-600">This hall ticket is issued provisionally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}