import React from 'react';
import { MenuItem } from '../data/menu';
import { PrinterIcon, X, UtensilsCrossed } from 'lucide-react';

interface BillProps {
  tableNumber: number;
  items: { item: MenuItem; quantity: number }[];
  onClose: () => void;
}

export default function Bill({ tableNumber, items, onClose }: BillProps) {
  const subtotal = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed size={24} className="text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Spice Garden</h2>
              </div>
              <p className="text-gray-600">Table {tableNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="text-gray-800">{item.name}</p>
                  <p className="text-gray-600 text-sm">x{quantity}</p>
                </div>
                <p className="text-gray-800">${(item.price * quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="text-gray-800">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax (10%)</p>
              <p className="text-gray-800">${tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <PrinterIcon size={20} />
            <span>Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}