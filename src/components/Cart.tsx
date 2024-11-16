import React from 'react';
import { MenuItem } from '../data/menu';
import { Trash2, Receipt, X } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CartProps {
  items: { item: MenuItem; quantity: number }[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onClose: () => void;
  tableNumber: number;
  isExistingUser?: boolean;
  isFirstTimeUser?: boolean;
}

export default function Cart({ items, onRemove, onQuantityChange, onClose, tableNumber, isExistingUser, isFirstTimeUser }: CartProps) {
  const subtotal = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const loyaltyDiscount = isExistingUser ? subtotal * 0.05 : 0;
  const firstTimeDiscount = isFirstTimeUser ? subtotal * 0.10 : 0;
  const totalDiscount = loyaltyDiscount + firstTimeDiscount;
  const total = subtotal - totalDiscount;

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Enable Unicode for Rupee symbol
    doc.addFont('https://fonts.gstatic.com/s/notosans/v30/o-0IIpQlx3QUlC5A4PNb4g.ttf', 'Noto Sans', 'normal');
    doc.setFont('Noto Sans');
    
    // Add decorative header
    doc.setFillColor(235, 88, 12);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Spice Garden', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Table ${tableNumber}`, 105, 30, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(235, 88, 12);
    doc.setLineWidth(0.5);
    doc.rect(10, 45, 190, doc.internal.pageSize.height - 55, 'S');
    
    let y = 60;
    items.forEach(({ item, quantity }) => {
      doc.text(`${item.name} x${quantity}`, 20, y);
      doc.text(`₹${(item.price * quantity).toFixed(2)}`, 180, y, { align: 'right' });
      y += 10;
    });
    
    y += 10;
    doc.text('Subtotal:', 20, y);
    doc.text(`₹${subtotal.toFixed(2)}`, 180, y, { align: 'right' });
    
    if (isFirstTimeUser) {
      y += 10;
      doc.setTextColor(0, 150, 0);
      doc.text('First Time Discount (10%):', 20, y);
      doc.text(`-₹${firstTimeDiscount.toFixed(2)}`, 180, y, { align: 'right' });
    }

    if (isExistingUser) {
      y += 10;
      doc.setTextColor(0, 150, 0);
      doc.text('Loyalty Discount (5%):', 20, y);
      doc.text(`-₹${loyaltyDiscount.toFixed(2)}`, 180, y, { align: 'right' });
    }
    
    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(235, 88, 12);
    doc.text('Total:', 20, y);
    doc.text(`₹${total.toFixed(2)}`, 180, y, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for dining with us!', 105, doc.internal.pageSize.height - 20, { align: 'center' });
    
    doc.save(`spice-garden-bill-table-${tableNumber}.pdf`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={quantity}
                    onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                    className="rounded-lg border-gray-300"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="text-gray-800">₹{subtotal.toFixed(2)}</p>
            </div>
            {isFirstTimeUser && (
              <div className="flex justify-between text-green-600">
                <p>First Time Discount (10%)</p>
                <p>-₹{firstTimeDiscount.toFixed(2)}</p>
              </div>
            )}
            {isExistingUser && (
              <div className="flex justify-between text-green-600">
                <p>Loyalty Discount (5%)</p>
                <p>-₹{loyaltyDiscount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Receipt size={20} />
            <span>Download Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}