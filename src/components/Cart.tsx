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
  isExistingUser ?: boolean;
  isFirstTimeUser ?: boolean;
}

export default function Cart({ items, onRemove, onQuantityChange, onClose, tableNumber, isExistingUser , isFirstTimeUser  }: CartProps) {
  const subtotal = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const loyaltyDiscount = isExistingUser  ? subtotal * 0.05 : 0;
  const firstTimeDiscount = isFirstTimeUser  ? subtotal * 0.10 : 0;
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

    // Generate order number
    const orderNumber = `SG${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    const currentDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      hour12: true
    });
    
    // Header
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Spice Garden', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Authentic Indian Restaurant', 105, 30, { align: 'center' });
    doc.text(`Order #${orderNumber}`, 105, 40, { align: 'center' });

    // Customer Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Table: ${tableNumber}`, 20, 60);
    doc.text(`Date & Time: ${currentDate}`, 20, 70);
    doc.text(`Customer Type: ${isExistingUser  ? 'Returning Customer' : isFirstTimeUser  ? 'First Time Customer' : 'Guest'}`, 20, 80);

    // Items Table Header
    let y = 100;
    doc.setFillColor(70, 70, 70);
    doc.rect(15, y-5, 180, 10, 'F');
    doc.setFontSize(11);
    doc.text('Item', 20, y);
    doc.text('Type', 100, y);
    doc.text('Qty', 130, y);
    doc.text('Price', 150, y);
    doc.text('Total', 170, y);

    // Items
    y += 10;
    items.forEach(({ item, quantity }) => {
      doc.setFontSize(10);
      doc.text(item.name, 20, y);
      doc.text(item.type === 'veg' ? '🟢 Veg' : '🔴 Non-veg', 100, y);
      doc.text(quantity.toString(), 130, y);
      doc.text(`₹${item.price.toFixed(2)}`, 150, y);
      doc.text(`₹${(item.price * quantity).toFixed(2)}`, 170, y);
      y += 8;
    });

    // Totals
    y += 10;
    doc.line(15, y-5, 195, y-5);
    doc.setFontSize(11);
    doc.text('Subtotal:', 130, y);
    doc.text(`₹${subtotal.toFixed(2)}`, 170, y);

    if (isFirstTimeUser ) {
      y += 8;
      doc.setTextColor(0, 255, 0);
      doc.text('First Time Discount (10%):', 130, y);
      doc.text(`-₹${firstTimeDiscount.toFixed(2)}`, 170, y);
    }

    if (isExistingUser  ) {
      y += 8;
      doc.setTextColor(0, 255, 0);
      doc.text('Loyalty Discount (5%):', 130, y);
      doc.text(`-₹${loyaltyDiscount.toFixed(2)}`, 170, y);
    }

    y += 12;
    doc.setTextColor(255, 165, 0);
    doc.setFontSize(14);
    doc.text('Total:', 130, y);
    doc.text(`₹${total.toFixed(2)}`, 170, y);

    // Footer
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text('Thank you for dining with us!', 105, doc.internal.pageSize.height - 20, { align: 'center' });
    doc.text('Visit us again soon!', 105, doc.internal.pageSize.height - 15, { align: 'center' });
    
    doc.save(`spice-garden-bill-${orderNumber}.pdf`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-white">Your Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-gray-300">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={quantity}
                    onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                    className="rounded-lg border-gray-600 bg-gray-700 text-white"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-600 mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-300">Subtotal</p>
              <p className="text-white">₹{subtotal.toFixed(2)}</p>
            </div>
            {isFirstTimeUser  && (
              <div className="flex justify-between text-green-400">
                <p>First Time Discount (10%)</p>
                <p>-₹{firstTimeDiscount.toFixed(2)}</p>
              </div>
            )}
            {isExistingUser  && (
              <div className="flex justify-between text-green-400">
                <p>Loyalty Discount (5%)</p>
                <p>-₹{loyaltyDiscount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-orange-400">
              <p>Total</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange -700 transition-colors flex items-center justify-center space-x-2"
          >
            <Receipt size={20} />
            <span>Download Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}