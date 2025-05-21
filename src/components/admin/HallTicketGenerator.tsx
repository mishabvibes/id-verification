'use client';

import { useState } from 'react';
import { Submission } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
  submission: Submission;
  onGenerated: () => void;
}

export default function HallTicketGenerator({ submission, onGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHallTicket = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/hall-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId: submission._id }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check if it's because the hall ticket already exists
        if (response.status === 409) {
          toast.success('Hall ticket already exists for this submission');
        } else {
          throw new Error(data.error || 'Failed to generate hall ticket');
        }
      } else {
        toast.success('Hall ticket generated successfully');
      }
      
      onGenerated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate hall ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Hall Ticket Generation</h2>
      
      <p className="mb-4 text-gray-600">
        Generate a hall ticket for this candidate to allow them to appear for the entrance examination.
      </p>
      
      <button
        onClick={generateHallTicket}
        disabled={isGenerating}
        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Hall Ticket'}
      </button>
    </div>
  );
}