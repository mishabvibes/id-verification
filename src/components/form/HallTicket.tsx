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
          
          // Update hall ticket status to downloaded if it's the first time
          if (data.status === 'issued') {
            await fetch(`/api/hall-tickets/${data._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 'downloaded' }),
            });
          }
          
          // Add animation delay
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
        } else {
          // If hall ticket not found, handle gracefully
          if (response.status === 404) {
            // It's okay, hall ticket is not generated yet
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
      
      const canvas = await html2canvas(hallTicketElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 size: 210 x 297 mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // In case the hall ticket is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
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
      <div className="bg-white p-8 text-center border border-gray-200 shadow-md rounded">
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
      <div className="bg-white p-8 border border-gray-200 shadow-md rounded">
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
    <div className={`space-y-6 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Action buttons */}
      <div className="flex justify-between items-center p-4 bg-white border border-gray-200 shadow-sm rounded print:hidden">
        <div className="text-sm font-medium">
          Application ID: <span className="font-bold">{hallTicket.uniqueId}</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Hall Ticket
          </button>
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none shadow-sm ${
              isGenerating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Hall Ticket Card */}
      <div id="hall-ticket" className="bg-white shadow-md print:shadow-none relative">
        {/* Watermark (visible only in print) */}
        <div className="absolute inset-0 flex items-center justify-center print:block hidden">
          <div className="absolute opacity-5 rotate-20 transform text-9xl font-bold text-black">
            ORIGINAL
          </div>
        </div>
      
        {/* Official header with emblem */}
        <div className="px-8 py-6 border-b-2 border-black flex flex-col items-center">
          <div className="flex items-center justify-center space-x-6">
            <div className="w-16 h-16 flex items-center justify-center">

            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wider text-gray-900 uppercase">ANVARUL ISLAM ARABIC COLLEGE</h1>
              <p className="text-sm font-medium tracking-wider text-gray-700 uppercase">Affiliated to Kerala University</p>
              <p className="text-sm font-medium mt-1 text-gray-600">RAMAPURAM, KERALA - 679578</p>
            </div>
            <div className="w-16 h-16 flex items-center justify-center">
              {/* Empty div for alignment */}
            </div>
          </div>
          
          <div className="mt-5">
            <div className="inline-block border-2 border-black px-6 py-1.5">
              <h2 className="text-xl font-bold tracking-wider text-gray-900 uppercase">ENTRANCE EXAMINATION HALL TICKET</h2>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {/* Examination details */}
          <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Academic Year</p>
              <p className="text-base font-bold">2025-2026</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">Examination Date</p>
              <p className="text-base font-bold">10-07-2025 (10:00 AM - 01:00 PM)</p>
            </div>
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - 2/3 width */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600">Application Number</p>
                  <p className="text-base font-bold">{hallTicket.uniqueId}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600">Program Code</p>
                  <p className="text-base font-bold ">{hallTicket.programCode}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Candidate Name</p>
                <p className="text-base font-bold ">{hallTicket.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600">Date of Birth</p>
                  <p className="text-base ">{hallTicket.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-600">Membership ID</p>
                  <p className="text-base ">{hallTicket.membershipId}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Zone</p>
                <p className="text-base ">{hallTicket.zone}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Examination Centre</p>
                <p className="text-base ">{hallTicket.centre}</p>
              </div>
            </div>
            
            {/* Right column - 1/3 width */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="border-2 border-black w-full h-48 flex items-center justify-center bg-gray-50">
                {hallTicket.photoUrl ? (
                  <img 
                    src={hallTicket.photoUrl} 
                    alt="Candidate Photo" 
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-xs text-gray-500">Affix recent passport size photograph with attestation</p>
                  </div>
                )}
              </div>
              <span className="text-xs text-center text-gray-500 px-2 mt-2">
                Affix recent passport size photograph with attestation
              </span>
            </div>
          </div>
          
          {/* Authentication section */}
          <div className="mt-8">
            {/* <div>
              <div className="flex items-center justify-center space-y-2 flex-col">
                <div className="border-2 border-black w-32 h-32 flex items-center justify-center bg-gray-50 p-2">
                  <p className="text-xs text-center text-gray-500">Official Seal</p>
                </div>
              </div>
            </div> */}
            
            <div className=" flex items-center justify-between ">
              <div className="mt-4">
                <div className="border-b-2 border-black pt-10 w-48"></div>
                <p className="mt-1 text-xs text-gray-600">Principal/Mudaris Signature</p>
              </div>
              
              <div className="mt-4">
                <div className="border-b-2 border-black pt-10 w-48"></div>
                <p className="mt-1 text-xs text-gray-600">SKSSF Unit Secretary Signature</p>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 pt-6 border-t-2 border-black">
            <h3 className="text-base font-bold uppercase mb-3">Instructions to Candidates:</h3>
            <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-700">
              <li>Candidates should reach the examination center 30 minutes before the commencement of the examination.</li>
              <li>Candidates should bring this Hall Ticket along with a valid photo ID proof to the examination hall.</li>
              <li>Candidates will not be permitted to enter the examination hall after 30 minutes of commencement of the examination.</li>
              <li>Mobile phones, calculators, or any other electronic devices are strictly prohibited in the examination hall.</li>
              <li>Candidates should bring their own blue/black ballpoint pens, pencils, and erasers.</li>
              <li>Candidates caught in any malpractice will be debarred from the examination and their candidature will be cancelled.</li>
              <li>This Hall Ticket must be preserved until the admission procedure is completed.</li>
              <li>No candidate will be allowed to leave the examination hall before the completion of the examination.</li>
            </ol>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t-2 border-black flex justify-between items-center">
          <p className="text-xs font-medium text-gray-600">REF: AI/EEP/2025/{hallTicket.uniqueId}</p>
          <p className="text-xs font-medium text-gray-600">This hall ticket is issued provisionally subject to verification of eligibility conditions.</p>
        </div>
      </div>
      
      {/* Mobile action buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex space-x-4 justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none transition-colors ${
            isGenerating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </>
          )}
        </button>
      </div>
      
      {/* Spacer for fixed buttons */}
      <div className="h-16 md:hidden print:hidden"></div>
      
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          @page {
            size: portrait;
            margin: 1cm;
          }
          
          #hall-ticket {
            page-break-inside: avoid;
            border: 1px solid #000;
          }
        }
      `}</style>
    </div>
  );
}