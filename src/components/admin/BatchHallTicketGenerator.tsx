'use client';

import { useState } from 'react';
import { FormCategory } from '@/types';
import { toast } from 'react-hot-toast';

export default function BatchHallTicketGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [zone, setZone] = useState<string>('');

  // List of zones - this would be fetched from an API in a real application
  const ZONES = [
    'AREEKODE 1',
    'EDAVANNAPPARA 2',
    'EDAKKARA 3',
    'KALIKAVU 4',
    'KARUVARAKUNDU 5',
    'KIZHISSERY 6',
    'KOLATHUR 7',
    'KONDOTTY 8',
    'MAKKARAPARAMBA 9',
    'MALAPPURAM 10',
    'MANJERI 11',
    'MELATTUR 12',
    'MONGAM 13',
    'NILAMBUR 14',
    'PANDIKKAD 15',
    'PERINTHALMANNA 16',
    'PULAMANTHOL 17',
    'PULIKKAL 18',
    'THAZHEKODE 19',
    'WANDOOR 20',
  ];

  const generateBatchHallTickets = async () => {
    try {
      setIsGenerating(true);
      
      const filter: any = {};
      if (category) filter.category = category;
      if (zone) filter.zone = zone;
      
      const response = await fetch('/api/hall-tickets/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate hall tickets');
      }
      
      toast.success(data.message || `Generated ${data.generated} hall tickets`);
      
      // Reset filters after successful generation
      setCategory('');
      setZone('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate hall tickets');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Batch Hall Ticket Generation</h2>
      
      <p className="mb-4 text-gray-600">
        Generate hall tickets for all approved submissions that don't have a hall ticket yet. You can optionally filter by category or zone.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category (Optional)
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="ECC">ECC</option>
            <option value="TCC">TCC</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="zone" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Zone (Optional)
          </label>
          <select
            id="zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Zones</option>
            {ZONES.map((zoneName) => (
              <option key={zoneName} value={zoneName}>
                {zoneName}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={generateBatchHallTickets}
          disabled={isGenerating}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Hall Tickets'}
        </button>
      </div>
    </div>
  );
}