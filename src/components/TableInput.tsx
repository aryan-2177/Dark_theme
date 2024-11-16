import React, { useState } from 'react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

interface TableInputProps {
  onTableSubmit: (table: number) => void;
}

export default function TableInput({ onTableSubmit }: TableInputProps) {
  const [tableNumber, setTableNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber) {
      onTableSubmit(parseInt(tableNumber));
    }
  };

  return (
    <div style={{ 
      backgroundImage: `url("/img.jpg")`,
      backgroundSize: 'cover', // Ensures the image covers the entire area
      backgroundRepeat: 'no-repeat' // Prevents the image from repeating
    }} className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-[rgba(0,0,0,0.7)] p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <UtensilsCrossed size={48} className="text-orange-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Spice Garden
        </h1>
        <p className="text-center text-gray-300 mb-6">Authentic Indian Cuisine</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="table" className="block text-sm font-medium text-gray-300 mb-2">
              Please Enter Your Table Number
            </label>
            <input
              type="number"
              id="table"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Enter table number"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <span>View Menu</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}