'use client';

import { useState, useEffect } from 'react';
import { HallTicket as HallTicketType } from '@/types';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  submissionId: string;
}

export default function HallTicketView({ submissionId }: Props) {
  const [hallTicket, setHallTicket] = useState<HallTicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchHallTicket = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/hall-tickets?submissionId=${submissionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setHallTicket(data);
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
        toast.error('Failed to load hall ticket');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (submissionId) {
      fetchHallTicket();
    }
  }, [submissionId]);

  const generatePDF = async () => {
    const hallTicketElement = document.getElementById('admin-hall-ticket');
    
    if (!hallTicketElement) {
      toast.error('Could not generate PDF. Please try again.');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const canvas = await html2canvas(hallTicketElement, {
        scale: 2,
        useCORS: true,
        logging: false,
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
      
      pdf.save(`Hall_Ticket_${hallTicket?.uniqueId}.pdf`);
      toast.success('Hall ticket downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hallTicket) {
    return (
      <div className="bg-white rounded-lg border p-6 mt-6">
        <div className="text-center py-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hall ticket</h3>
          <p className="mt-1 text-sm text-gray-500">
            Hall ticket has not been generated for this submission yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Hall Ticket</h2>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? 'Generating PDF...' : 'Download Hall Ticket'}
        </button>
      </div>
      
      <div className="border p-4 rounded-lg" id="admin-hall-ticket">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">ENTRANCE EXAMINATION HALL TICKET</h2>
          <p className="text-gray-600 mt-1">ANVARUL ISLAM ARABIC COLLAGE RAMAPURAM</p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID Number</p>
                  <p className="font-semibold">{hallTicket.uniqueId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Program Code</p>
                  <p className="font-semibold">{hallTicket.programCode}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Examination Centre</p>
                <p className="font-semibold">{hallTicket.centre}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-semibold">{hallTicket.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="font-semibold">{hallTicket.dateOfBirth}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Zone</p>
                  <p className="font-semibold">{hallTicket.zone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Membership ID</p>
                  <p className="font-semibold">{hallTicket.membershipId}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden h-40 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-sm text-center px-4">Candidate Photo</p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div>
            <div className="border-t pt-2">
              <p className="text-sm text-center text-gray-500">Signature of the Candidate</p>
            </div>
            <div className="h-16 border-b border-dashed"></div>
          </div>
          
          <div>
            <div className="border-t pt-2">
              <p className="text-sm text-center text-gray-500">Principal/Mudaris Signature</p>
            </div>
            <div className="h-16 border-b border-dashed"></div>
          </div>
          
          <div>
            <div className="border-t pt-2">
              <p className="text-sm text-center text-gray-500">SKSSF Unit Secretary Signature</p>
            </div>
            <div className="h-16 border-b border-dashed"></div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Candidate must bring this hall ticket to the examination hall.</li>
            <li>Candidate should reach the examination centre at least 30 minutes before the exam.</li>
            <li>Mobile phones and other electronic devices are not allowed in the examination hall.</li>
            <li>Bring your own pen, pencil, and other stationery items.</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Status:</span>{' '}
          <span className="capitalize">{hallTicket.status}</span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Issued on:</span>{' '}
          {new Date(hallTicket.issuedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}