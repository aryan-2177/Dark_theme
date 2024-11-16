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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <UtensilsCrossed size={48} className="text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Spice Garden
        </h1>
        <p className="text-center text-gray-600 mb-6">Authentic Indian Cuisine</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="table" className="block text-sm font-medium text-gray-700 mb-2">
              Please Enter Your Table Number
            </label>
            <input
              type="number"
              id="table"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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