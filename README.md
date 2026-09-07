# Naik Foods – Full Stack MERN E-Commerce Application

A high-performance, modern, and responsive MERN-stack (MongoDB, Express.js, React, Node.js) web application built for **Naik Foods** — authentic Maharashtrian homemade delicacies, snacks, pickles, and traditional spices.

---

## Key Highlights & Architectural Features

### 1. Brand Identity & Sleek Aesthetics
- **Chakali Spiral SVG Emblem**: Custom brand emblem rendered in brand orange (`#EA580C`) alongside the slogan *Pure • Authentic • Homemade*.
- **Official Product Imagery**: Uses authentic product photos and high-resolution Cloudinary media links (`https://res.cloudinary.com/...`).
- **Clean SVG Icon System**: Replaced all generic/AI emojis with vector SVG icons across Navbar, Footer, Product Detail Page, Cart, and notifications.

### 2. Header & Navigation System
- **5 Core Header Links**: `Home`, `About`, `Shop`, `Blogs`, `Contact`.
- **`≡ Category ▾` Popover Menu**: Dark green (`#14532d`) category dropdown button with instant category filters (*Snacks and Namkeen*, *Pickles & Condiments*, *Spices & Masalas*, *Sweets & Bakery*, *Chakali*, *Laddoo*).
- **Search Autocomplete**: Real-time product search bar with dropdown preview thumbnails and price tags.
- **Interactive Cart Counter**: Live badge on cart icon that pops with bounce animation whenever items are added.

### 3. Compact & Responsive Product Cards
- **Refined Card Design**: 12px rounded white cards with light border (`#e2e8f0`), `object-fit: contain` media frame, bold category labels, star rating pills (`★ 4.7`), weight variant selectors (`250g`), dashed footer dividers, and green `Add` / `Add to Cart` buttons.
- **Responsive Grids**: Configured with `minmax(210px, 1fr)` auto-fill layout for seamless viewing on mobile, tablet, and desktop displays.

### 4. Backend Regional Pincode Restriction Control
- **Strict Serviceability Rules**: Restricted exclusively to Maharashtrian regional pincodes:
  - **Pune**: `411xxx`, `412xxx`
  - **Vidarbha**: `440xxx`–`445xxx` (Nagpur, Amravati, Akola, Wardha, etc.)
  - **Konkan**: `400xxx`–`402xxx`, `415xxx`, `416xxx` (Mumbai, Thane, Raigad, Ratnagiri, Sindhudurg)
  - **Nashik**: `422xxx`, `423xxx`
- **Public Serviceability Checker (`GET /api/products/check-pincode`)**: Live checker on the Home page and Product Detail page.
- **Backend Order Protection (`POST /api/orders`)**: Rejects order creation attempts outside these 4 serviceable regions.

### 5. Cart, Coupons & Order System
- **Quantity Selector**: `- 1 +` quantity controls that dynamically re-evaluate cart totals.
- **Instant Toast Notification**: Displays floating confirmation toast (`Added 2x Tangy Tomato Rings to cart!`) upon item addition.
- **Coupons & Thresholds**: Supports discount coupons (`NAIK10` for 10% OFF, `FREE50` for ₹50 OFF), 5% GST tax calculation, and free delivery progress bar for orders above ₹999.

---

## Project Structure

```
f:\Assignment\
├── client\                  # React Frontend (Vite + Redux Toolkit)
│   ├── public\              # Authentic food images (/chakali.png, /laado.png, etc.)
│   ├── src\
│   │   ├── api\             # Axios HTTP client with JWT interceptor
│   │   ├── components\
│   │   │   ├── common\      # Navbar, Footer, BottomNav, Newsletter, Icons
│   │   │   ├── product\     # ProductCard (Compact card design)
│   │   │   └── cart\        # DeliveryProgress bar
│   │   ├── pages\           # Home, Shop, ProductDetail, Cart, Checkout, OrderTracking, etc.
│   │   ├── store\           # Redux Toolkit (cartSlice, authSlice, store)
│   │   ├── App.jsx          # Routes & main layout wrapper
│   │   ├── index.css        # Global CSS design tokens
│   │   └── main.jsx         # React root
│   └── package.json
│
└── server\                  # Node.js + Express + MongoDB Backend
    ├── config\              # Database configuration (db.js)
    ├── controllers\         # productController, authController, orderController
    ├── middleware\          # authMiddleware (JWT protect + admin guard)
    ├── models\              # Product, User, Order Mongoose schemas
    ├── routes\              # products, auth, orders express routers
    ├── utils\               # generateToken.js, seed.js
    └── server.js            # Express app entry point
```

---

## Step-by-Step Setup & Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB server running at `mongodb://localhost:27017/naikfoods` (or MongoDB Atlas connection string)

### Step 1: Open Project Directory
```bash
cd f:\Assignment
```

### Step 2: Configure & Install Server
```bash
cd server
npm install
```

Ensure `.env` file exists in `f:\Assignment\server\.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/naikfoods
JWT_SECRET=naik_foods_super_secret_key_2026
```

### Step 3: Seed MongoDB Database
Execute the seed utility script to clear old data, seed 14 official products, and create the default admin user:
```bash
node utils/seed.js
```
*Seeded Catalog Products:*
- **Beetroot Chips** (`₹70`)
- **Cheeseling** (`₹110`)
- **Corn Chakali** (`₹50`)
- **Thepla Puri** (`₹90`)
- **Jwari Bhel** (`₹30`)
- **Ambadi Bhajiche Lonche** (`₹190`)
- **Banana Wefers** (`₹45`)
- **Prawns Pickle (Kolambi Lonche)** (`₹280`)
- **Tangy Tomato Rings** (`₹100`)
- **Methi Thalipith Bhajni** (`₹70`)
- **Bhajani Special Chakali** (`₹100`)
- **Pure Cow Ghee Besan Laddoo** (`₹130`)
- **Goda Masala Special** (`₹120`)
- **Kolhapuri Kanda Lasun Masala** (`₹99`)

*Default Admin Account:*
- **Email**: `admin@naikfoods.co.in`
- **Password**: `admin123`

### Step 4: Configure & Install Client
```bash
cd ../client
npm install
```

---

## Running the Application

### Option A: Run Backend Server
```bash
cd f:\Assignment\server
npm start
# Server running on http://localhost:5000
```

### Option B: Run Frontend Development Server
```bash
cd f:\Assignment\client
npm run dev
# Frontend running on http://localhost:5173
```

---

## API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products (supports search, category, sort) | Public |
| `GET` | `/api/products/check-pincode` | Validate pincode serviceability (Pune, Vidarbha, Konkan, Nashik) | Public |
| `GET` | `/api/products/autocomplete` | Real-time search query suggestions | Public |
| `GET` | `/api/products/:id` | Fetch product details by ID, slug, or name match | Public |
| `POST` | `/api/products/:id/reviews` | Submit user rating & text review | Authenticated |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login user & return JWT token | Public |
| `POST` | `/api/orders` | Submit order with regional pincode validation | Authenticated |
| `GET` | `/api/orders/myorders` | Fetch order history for logged-in user | Authenticated |

---

## Build & Production Verification

To compile the production build:
```bash
cd f:\Assignment\client
npm run build
# Generates production bundle in dist/
```
