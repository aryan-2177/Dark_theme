import React, { useState } from 'react';
import TableInput from './components/TableInput';
import Menu from './components/Menu';
import Cart from './components/Cart';
import FaceRecognition from './components/FaceRecognition';
import { MenuItem } from './data/menu';
import { Database } from './utils/db';
import { ShoppingCart } from 'lucide-react';

function App() {
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const db = new Database();

  const handleTableSubmit = (table: number) => {
    setTableNumber(table);
    setShowFaceRecognition(true);
  };

  const handleUserIdentified = (previousOrders: MenuItem[], existing: boolean, firstTime: boolean) => {
    setIsExistingUser(existing);
    setIsFirstTimeUser(firstTime);
    if (previousOrders.length > 0) {
      setCartItems(previousOrders.map(item => ({ item, quantity: 1 })));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.item.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(i => (i.item.id === id ? { ...i, quantity } : i))
    );
  };

  if (!tableNumber) {
    return <TableInput onTableSubmit={handleTableSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <button
        onClick={() => setShowCart(true)}
        className="fixed top-4 right-4 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-50"
      >
        <ShoppingCart size={24} />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      <Menu
        tableNumber={tableNumber}
        onAddToCart={handleAddToCart}
      />
      
      {showCart && (
        <Cart
          items={cartItems}
          onRemove={handleRemoveFromCart}
          onQuantityChange={handleQuantityChange}
          onClose={() => setShowCart(false)}
          tableNumber={tableNumber}
          isExistingUser={isExistingUser}
          isFirstTimeUser={isFirstTimeUser}
        />
      )}
      
      {showFaceRecognition && (
        <FaceRecognition
          onUserIdentified={handleUserIdentified}
          onComplete={() => setShowFaceRecognition(false)}
        />
      )}
    </div>
  );
}

export default App;