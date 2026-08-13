# ShopEZ — Full-Stack E-Commerce Application

**ShopEZ** is a functional, internship-evaluation-ready MERN (MongoDB, Express, React, Node.js) full-stack e-commerce web application. Built with security, performance, and clean code architecture, ShopEZ offers complete customer workflows, robust backend validations, server-authoritative checkout, stock inventory auto-reduction, and a feature-rich Admin Dashboard with interactive analytics.

---

## 🌟 Key Features

### 👤 User Authentication & Authorization
- **JWT Authentication**: Secure JSON Web Token auth with persistent state storage.
- **bcrypt Password Hashing**: Passwords salted and hashed before storing in MongoDB.
- **Role-Based Access Control (RBAC)**: Strict route protection dividing `USER` and `ADMIN` roles.
- **Profile Management**: Update profile details, email, and password securely.

### 🛍️ Product Catalog & Search System
- **Advanced Filtering**: Filter by category, price range, stock availability, and rating.
- **Multi-field Search**: MongoDB text & regex index search across title, description, category, and brand.
- **Sorting Options**: Sort by newest, price low-to-high, price high-to-low, highest rated, and discount percentage.
- **Pagination & Stock Badges**: Real-time stock indicators (`In Stock`, `Low Stock`, `Out of Stock`).
- **Product Reviews & Ratings**: Authenticated user product reviews with auto-calculated aggregate star rating.

### 🛒 Shopping Cart & Checkout
- **Real-Time Stock Enforcement**: Prevents adding or incrementing items beyond current MongoDB stock.
- **Server-Authoritative Calculations**: Item subtotal, 5% tax, shipping thresholds ($100+ free shipping), and totals calculated on the backend to prevent price tampering.
- **Simulated Payment Gateway**: Safe checkout simulation creating an order receipt without exposing financial credentials.
- **Inventory Auto-Reduction**: Product stock automatically decrements upon checkout completion and returns upon order cancellation.

### 📦 Order Management & Tracking
- **Order Status Stepper**: Visual timeline tracking statuses: `PLACED` ➔ `CONFIRMED` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` / `CANCELLED`.
- **Order Cancellation**: Eligible orders can be cancelled by users or admins, restoring item stock to the catalog.

### 📊 Admin Panel & Analytics Dashboard
- **KPI Metrics**: Total Revenue, Total Orders, Product Count, Registered Users, Pending Orders, Delivered Orders, and Low Stock Alerts.
- **Interactive Charts**: Recharts visualizations for monthly revenue growth trends and order status distribution.
- **Inventory Management**: Create new products, edit details, set discounts, and update stock directly from modal forms.
- **User Management**: View registered accounts, change user roles between `USER` and `ADMIN`, and remove unauthorized accounts.
- **Order Management**: Transition order statuses across delivery stages.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Core**: React.js (Vite)
- **Routing**: React Router v6
- **State Management**: React Context API (`AuthContext`, `CartContext`)
- **HTTP Client**: Axios with request/response interceptors for JWT Bearer tokens
- **Styling**: Bootstrap 5 + Custom Modern CSS Design System (Glassmorphic elements, vibrant color tokens, rounded cards)
- **Analytics & Icons**: Recharts & Lucide React

### Backend (`/server`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ORM (Schema validation, indexing, pre-save hooks)
- **Database Resilience**: Dual-mode MongoDB connection (Standard local/remote MongoDB URI with automated `mongodb-memory-server` fallback for zero-dependency local execution)
- **Security**: `jsonwebtoken` (JWT), `bcryptjs`, CORS, `dotenv`

---

## 📁 Directory Structure

```text
ShopEZ/
├── client/                     # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/         # Navbar, Footer, ProductCard, Filters, CartItem, StatusBadge, etc.
│   │   ├── context/            # AuthContext.jsx, CartContext.jsx
│   │   ├── pages/              # HomePage, ProductsPage, ProductDetailsPage, CartPage, CheckoutPage, etc.
│   │   │   └── admin/          # AdminDashboardPage, AdminProductsPage, AdminUsersPage, AdminOrdersPage
│   │   ├── services/           # api.js (Axios Instance with Interceptors)
│   │   ├── App.jsx             # Router definition with Protected and Admin routes
│   │   ├── index.css           # Modern CSS Design Tokens & Reset
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js & Express Backend REST API
│   ├── config/
│   │   └── db.js               # Dual-Mode MongoDB Mongoose Connection
│   ├── controllers/            # authController, productController, cartController, orderController, etc.
│   ├── middleware/             # authMiddleware (protect & admin), errorMiddleware
│   ├── models/                 # User.js, Product.js, Cart.js, Order.js, Review.js
│   ├── routes/                 # authRoutes, productRoutes, cartRoutes, orderRoutes, etc.
│   ├── utils/                  # generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── seeder.js               # Auto Database Seeder Script (18+ items, categories, demo users)
│   └── server.js               # Main Express Entry Point
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### 1. Clone & Set Up Backend

```bash
cd server
npm install
```

### 2. Environment Variables Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=shopez_super_secret_jwt_key_2026_internship_evaluation
NODE_ENV=development
```

*(Note: If no local MongoDB service is installed on the machine, the server will automatically launch an in-memory Mongo instance seamlessly!)*

### 3. Seed Initial Demo Data

Run the seeder script to populate products, admin user, test user, sample reviews, and sample analytics orders:

```bash
npm run seed
```

#### Demo Credentials:
- **Admin User**: `admin@shopez.com` | Password: `admin123`
- **Standard Customer**: `john@example.com` | Password: `user123`

### 4. Start Backend Express Server

```bash
npm run dev
# Server will run at http://localhost:5000
```

### 5. Set Up & Run Frontend

Open a new terminal window:

```bash
cd client
npm install
npm run dev
# Frontend application will open at http://localhost:3000
```

---

## 🔑 REST API Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new user account |
| **POST** | `/api/auth/login` | Public | Login & receive JWT token |
| **GET** | `/api/auth/profile` | Protected | Fetch current user profile |
| **PUT** | `/api/auth/profile` | Protected | Update profile & password |
| **GET** | `/api/products` | Public | List products with search, filters, sort & pagination |
| **GET** | `/api/products/:id` | Public | Get product details & customer reviews |
| **POST** | `/api/products` | Admin | Create a new product in inventory |
| **PUT** | `/api/products/:id` | Admin | Update product information & stock |
| **DELETE**| `/api/products/:id` | Admin | Remove product from catalog |
| **POST** | `/api/products/:id/reviews`| Protected | Post product rating & review comment |
| **GET** | `/api/cart` | Protected | Fetch user's cart |
| **POST** | `/api/cart` | Protected | Add item to cart (with stock check) |
| **PUT** | `/api/cart/:productId` | Protected | Update cart item quantity |
| **DELETE**| `/api/cart/:productId` | Protected | Remove item from cart |
| **POST** | `/api/orders` | Protected | Create order & reduce stock atomically |
| **GET** | `/api/orders/myorders`| Protected | Get user's order history |
| **GET** | `/api/orders/:id` | Protected | Get detailed order receipt & timeline |
| **PUT** | `/api/orders/:id/cancel`| Protected | Cancel order & restore inventory stock |
| **GET** | `/api/admin/dashboard` | Admin | Fetch analytics KPIs, charts, low stock alerts |
| **GET** | `/api/users` | Admin | List all registered users |
| **PUT** | `/api/users/:id/role` | Admin | Toggle user role (`USER` / `ADMIN`) |

---

## 🎓 Internship Evaluation Presentation Points

When presenting **ShopEZ** to your internship mentor or evaluator, highlight these 10 technical points:

1. **Full-Stack MERN Architecture**: Modular separation between React frontend client and Node/Express backend REST API with reusable middleware services.
2. **Robust JWT & bcrypt Authentication**: Stateless session management using JWT bearer tokens in request headers and salted bcrypt hashing for passwords.
3. **Role-Based Authorization (RBAC)**: Custom Express middleware (`protect` and `admin`) guaranteeing end-to-end security on API endpoints and React client routes (`ProtectedRoute`, `AdminRoute`).
4. **Server-Authoritative Price Calculation**: Prices, taxes, shipping rules, and total amounts are verified directly on the backend during order creation to prevent frontend tampering.
5. **Atomic Stock Inventory Management**: Product stock automatically decrements upon checkout completion and is restored if an eligible order is cancelled.
6. **MongoDB Database Design & Indexing**: Uses text indexes for fast search across title, brand, and category, alongside pre-save schema hooks for dynamic price calculation.
7. **Resilient Embedded Database Fallback**: Built-in fallback to `MongoMemoryServer` ensures zero setup failures regardless of local environment constraints.
8. **Interactive Admin Analytics**: Live dashboard featuring KPI statistics, Recharts graphs for monthly revenue trends, order status distribution, and automated low-stock alerts.
9. **Form Validation & Centralized Error Handling**: Dual-layer input validation (frontend UX feedback + backend Express error handler returning semantic HTTP status codes).
10. **Modern Visual Design System**: Modern responsive UI with CSS variables, Bootstrap 5, glassmorphism card accents, loading states, empty states, and status timeline steppers.

---

## 📜 License
This project is open-source under the [ISC License](LICENSE).
