export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'starters' | 'main' | 'street' | 'drinks' | 'desserts';
  type: 'veg' | 'non-veg';
  description: string;
  image: string;
}

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Samosa',
    price: 6.99,
    category: 'starters',
    type: 'veg',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Chicken Tikka',
    price: 12.99,
    category: 'starters',
    type: 'non-veg',
    description: 'Tender chicken marinated in yogurt and spices, grilled to perfection',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    name: 'Butter Chicken',
    price: 18.99,
    category: 'main',
    type: 'non-veg',
    description: 'Tender chicken in rich tomato and butter gravy',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    name: 'Palak Paneer',
    price: 16.99,
    category: 'main',
    type: 'veg',
    description: 'Fresh cottage cheese cubes in creamy spinach gravy',
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    name: 'Dal Makhani',
    price: 14.99,
    category: 'main',
    type: 'veg',
    description: 'Black lentils slow-cooked with cream and butter',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '6',
    name: 'Pav Bhaji',
    price: 12.99,
    category: 'street',
    type: 'veg',
    description: 'Spiced vegetable mash served with buttered rolls',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '7',
    name: 'Chicken Biryani',
    price: 19.99,
    category: 'main',
    type: 'non-veg',
    description: 'Fragrant rice cooked with spiced chicken and aromatics',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '8',
    name: 'Mango Lassi',
    price: 5.99,
    category: 'drinks',
    type: 'veg',
    description: 'Sweet yogurt drink blended with mango pulp',
    image: 'https://images.unsplash.com/photo-1626078293852-4c8ff5de3567?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '9',
    name: 'Masala Chai',
    price: 3.99,
    category: 'drinks',
    type: 'veg',
    description: 'Traditional spiced Indian tea with milk',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '10',
    name: 'Gulab Jamun',
    price: 6.99,
    category: 'desserts',
    type: 'veg',
    description: 'Deep-fried milk solids soaked in rose-scented syrup',
    image: 'https://images.unsplash.com/photo-1605841922044-13e9c50e6b4c?auto=format&fit=crop&q=80&w=400'
  }
];