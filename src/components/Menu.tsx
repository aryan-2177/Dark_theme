import React, { useState } from 'react';
import { MenuItem, menuItems } from '../data/menu';
import { ShoppingCart, Filter, UtensilsCrossed } from 'lucide-react';
import Toast from './Toast';

interface MenuProps {
  tableNumber: number;
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ tableNumber, onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['all', 'starters', 'main', 'street', 'drinks', 'desserts'];
  const types = ['all', 'veg', 'non-veg'];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    const typeMatch = activeType === 'all' || item.type === activeType;
    return categoryMatch && typeMatch;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    setToastMessage(`${item.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      starters: '🍱 Appetizing Starters',
      main: '🍛 Signature Main Course',
      street: '🥘 Street Food Delights',
      drinks: '🥤 Refreshing Beverages',
      desserts: '🍨 Sweet Endings'
    };
    return titles[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={32} className="text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Spice Garden</h1>
          </div>
          <p className="text-gray-600 mt-1">Table {tableNumber}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
          <Filter size={20} className="text-gray-500" />
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="border-none bg-transparent focus:ring-0"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-lg ${
                activeType === type
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors shadow`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-orange-200 pb-2">
              {getCategoryTitle(category)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleAddToCart(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">₹{item.price}</span>
                      <div className="flex items-center space-x-1 text-orange-600">
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showToast && <Toast message={toastMessage} />}
    </div>
  );
}