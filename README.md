# Spice Garden - Restaurant Ordering System

A modern restaurant ordering system with face recognition, built with React, TypeScript, and Tailwind CSS.

## Features

- Table-based ordering system
- Face recognition for returning customers
- Interactive menu with categories and filters
- Real-time cart management
- Bill generation with PDF download
- Toast notifications
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Face-api.js
- Dexie (IndexedDB)
- jsPDF
- Lucide React Icons

## Getting Started

1. Import this project in StackBlitz
2. The development server will start automatically
3. Enter a table number to begin
4. Allow camera access for face recognition feature

## Project Structure

```
src/
├── components/         # React components
│   ├── Bill.tsx       # Bill generation
│   ├── Cart.tsx       # Shopping cart
│   ├── FaceRecognition.tsx  # Face recognition
│   ├── Menu.tsx       # Restaurant menu
│   ├── TableInput.tsx # Table number input
│   └── Toast.tsx      # Notifications
├── data/
│   └── menu.ts        # Menu items data
├── utils/
│   └── db.ts          # Database utilities
├── App.tsx            # Main application
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Usage

1. **Table Input**: Enter your table number to start ordering
2. **Face Recognition**: System recognizes returning customers
3. **Menu Browsing**: Filter by category and type (veg/non-veg)
4. **Cart Management**: Add items, adjust quantities
5. **Bill Generation**: Download bill as PDF

## License

MIT