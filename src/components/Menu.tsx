import React, { useState } from 'react';
import { MenuItem, menuItems } from '../data/menu';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
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

  const categories = ['all', 'starters', 'main', 'street', 'Breads', 'Rice', 'drinks', 'desserts'];
  const types = ['all', 'veg', 'non-veg'];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
    const typeMatch = activeType === 'all' || item.type === activeType;
    return categoryMatch && typeMatch;
  });

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
      all: '🍽️ All Dishes',
      starters: '🍱 Appetizing Starters',
      main: '🍛 Signature Main Course',
      street: '🥘 Street Food Delights',
      drinks: '🥤 Refreshing Beverages',
      desserts: '🍨 Sweet Endings',
      Breads: '🍞 Desi Roti',
      Rice: '🍚 Pulao Rice'
    };
    return titles[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      all: '🍽️',
      starters: '🍱',
      main: '🍛',
      street: '🍕',
      drinks: '🥂',
      desserts: '🍨',
      Breads: '🍞',
      Rice: '🍚'
    };
    return icons[category] || '🍽️';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white"> {/* Set outer background here */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={32} className="text-orange-400" />
              <h1 className="text-3xl font-bold">Spice Garden</h1>
            </div>
            <p className="mt-1">Table {tableNumber}</p>
          </div>
        </div>

        <nav className="mb-8">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? 'bg-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg -gray-700 shadow'
                  }`}
                >
                  <span>{getCategoryIcon(category)}</span>
                  <span className="font-medium capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg ${
                  activeType === type
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } transition-colors shadow`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-12">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-orange-200 pb-2">
                {getCategoryTitle(category)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleAddToCart(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">₹{item.price}</span>
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
    </div>
  );
}