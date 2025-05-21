'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/admin/DashboardHeader';
import BatchHallTicketGenerator from '@/components/admin/BatchHallTicketGenerator';
import Sidebar from '@/components/admin/Sidebar';
import { HallTicket } from '@/types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export default function HallTicketsPage() {
    const { status } = useSession();
    const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState<HallTicket | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            redirect('/admin/login');
        }

        const fetchHallTickets = async (page: number = 1) => {
            try {
                setIsLoading(true);

                const response = await fetch(`/api/hall-tickets/list?page=${page}&limit=10`);

                if (!response.ok) {
                    throw new Error('Failed to fetch hall tickets');
                }

                const data = await response.json();
                setHallTickets(data.hallTickets);
                setPagination(data.pagination);
            } catch (error: any) {
                toast.error(error.message || 'Error fetching hall tickets');
            } finally {
                setIsLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchHallTickets(currentPage);
        }
    }, [status, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'issued':
                return 'bg-yellow-100 text-yellow-800';
            case 'downloaded':
                return 'bg-blue-100 text-blue-800';
            case 'used':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const generatePDF = async (ticket: HallTicket) => {
        const hallTicketElement = document.getElementById(`hall-ticket-${ticket._id}`);
        
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
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`Hall_Ticket_${ticket.uniqueId}.pdf`);
            toast.dismiss();
            toast.success('Hall ticket downloaded successfully');
            
            // Update status to downloaded
            if (ticket.status === 'issued') {
                await fetch(`/api/hall-tickets/${ticket._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'downloaded' }),
                });
                setHallTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: 'downloaded' } : t));
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.dismiss();
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = (ticket: HallTicket) => {
        setSelectedTicket(ticket);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <DashboardHeader />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Hall Tickets</h1>
                        {status === 'authenticated' && (
                            <div className="mb-6">
                                <BatchHallTicketGenerator />
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    {hallTickets.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-gray-500">No hall tickets found</p>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        ID
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Program
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Zone
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Issued Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {hallTickets.map((ticket) => (
                                                    <tr key={ticket._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {ticket.uniqueId}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ticket.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ticket.programCode}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ticket.zone}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(ticket.issuedAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link
                                                                href={`/admin/submissions/${ticket.submissionId}`}
                                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                            >
                                                                View Details
                                                            </Link>
                                                            <button
                                                                onClick={() => handlePrint(ticket)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Print
                                                            </button>
                                                            <button
                                                                onClick={() => generatePDF(ticket)}
                                                                disabled={isGenerating}
                                                                className={`ml-4 text-indigo-600 hover:text-indigo-900 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                Download PDF
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {pagination.pages > 1 && (
                                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1 || isLoading}
                                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 || isLoading
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === pagination.pages || isLoading}
                                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === pagination.pages || isLoading
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{hallTickets.length ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to{' '}
                                                    <span className="font-medium">
                                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                                    </span>{' '}
                                                    of <span className="font-medium">{pagination.total}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1 || isLoading}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 || isLoading
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <svg
                                                            className="h-5 w-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                                                        .filter(page => {
                                                            return (
                                                                page === 1 ||
                                                                page === pagination.pages ||
                                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                                            );
                                                        })
                                                        .map((page, index, array) => {
                                                            const prevPage = array[index - 1];
                                                            const showEllipsisBefore = prevPage && page - prevPage > 1;

                                                            return (
                                                                <div key={page} className="flex items-center">
                                                                    {showEllipsisBefore && (
                                                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                            ...
                                                                        </span>
                                                                    )}

                                                                    <button
                                                                        onClick={() => handlePageChange(page)}
                                                                        disabled={isLoading}
                                                                        className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page
                                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                            } text-sm font-medium`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}

                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === pagination.pages || isLoading}
                                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === pagination.pages || isLoading
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <svg
                                                            className="h-5 w-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Hidden Hall Ticket for Printing */}
            {selectedTicket && (
                <div className="hidden print:block" id={`hall-ticket-${selectedTicket._id}`}>
                    <div className="bg-white shadow-md print:shadow-none relative">
                        {/* Watermark (visible only in print) */}
                        <div className="absolute inset-0 flex items-center justify-center print:block hidden">
                            <div className="absolute opacity-5 rotate-20 transform text-9xl font-bold text-black">
                                ORIGINAL
                            </div>
                        </div>

                        {/* Official header with emblem */}
                        <div className="px-8 py-6 border-b-2 border-black flex flex-col items-center">
                            <div className="flex items-center justify-center space-x-6">
                                <div className="w-16 h-16 flex items-center justify-center"></div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold tracking-wider text-gray-900 uppercase">ANVARUL ISLAM ARABIC COLLEGE</h1>
                                    <p className="text-sm font-medium tracking-wider text-gray-700 uppercase">Affiliated to Kerala University</p>
                                    <p className="text-sm font-medium mt-1 text-gray-600">RAMAPURAM, KERALA - 679578</p>
                                </div>
                                <div className="w-16 h-16 flex items-center justify-center"></div>
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
                                            <p className="text-base font-bold">{selectedTicket.uniqueId}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-600">Program Code</p>
                                            <p className="text-base font-bold">{selectedTicket.programCode}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-600">Candidate Name</p>
                                        <p className="text-base font-bold">{selectedTicket.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-600">Date of Birth</p>
                                            <p className="text-base">{selectedTicket.dateOfBirth}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-600">Membership ID</p>
                                            <p className="text-base">{selectedTicket.membershipId}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-600">Zone</p>
                                        <p className="text-base">{selectedTicket.zone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-600">Examination Centre</p>
                                        <p className="text-base">{selectedTicket.centre}</p>
                                    </div>
                                </div>

                                {/* Right column - 1/3 width */}
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <div className="border-2 border-black w-full h-48 flex items-center justify-center bg-gray-50">
                                        {selectedTicket.photoUrl ? (
                                            <img 
                                                src={selectedTicket.photoUrl} 
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
                                <div className="flex items-center justify-between">
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
                            <p className="text-xs font-medium text-gray-600">REF: AI/EEP/2025/{selectedTicket.uniqueId}</p>
                            <p className="text-xs font-medium text-gray-600">This hall ticket is issued provisionally subject to verification of eligibility conditions.</p>
                        </div>
                    </div>
                </div>
            )}

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
                    
                    #hall-ticket-${selectedTicket?._id} {
                        page-break-inside: avoid;
                        border: 1px solid #000;
                    }
                }
            `}</style>
        </div>
    );
}