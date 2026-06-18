# 🛒 ShopEZ — Full Stack MERN E-Commerce Application

A complete e-commerce platform built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 📁 Project Structure

```
ShopEZ/
├── client/                        # React Frontend
│   ├── public/
│   │   
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Top navigation bar
│   │   │   ├── Footer.js          # Footer
│   │   │   └── ProductCard.js     # Reusable product card
│   │   ├── pages/
│   │   │   ├── HomePage.js        # Hero + featured products
│   │   │   ├── ProductsPage.js    # Product listing + filters
│   │   │   ├── ProductDetail.js   # Single product view
│   │   │   ├── CartPage.js        # Shopping cart
│   │   │   ├── CheckoutPage.js    # Address + payment
│   │   │   ├── OrderSuccess.js    # Post-order confirmation
│   │   │   ├── ProfilePage.js     # User orders history
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── admin/
│   │   │       ├── AdminLayout.js     # Sidebar layout
│   │   │       ├── AdminDashboard.js  # Stats overview
│   │   │       ├── AdminProducts.js   # Product CRUD
│   │   │       ├── AdminOrders.js     # Order management
│   │   │       └── AdminUsers.js      # User management
│   │   ├── utils/
│   │   │   ├── api.js             # Axios API calls
│   │   │   ├── AuthContext.js     # Global auth state
│   │   │   └── CartContext.js     # Global cart state
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
|   └── index.html
│   └── package.json
|   └── vite.config.js
│
├── server/                        # Express Backend
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # Product CRUD
│   │   ├── cartController.js      # Cart operations
│   │   ├── orderController.js     # Order placement & tracking
│   │   └── adminController.js     # Admin-only operations
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly
│   ├── models/
│   │   └── Schema.js              # All Mongoose schemas
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── index.js                   # Express server entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── package.json                   # Root (concurrently)
└── .gitignore

```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 2. Clone / Copy the Project
Place the ShopEZ folder wherever you like.

### 3. Configure MongoDB Atlas
1. Create a free cluster on MongoDB Atlas
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Copy your connection string

### 4. Set up Environment Variables
Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopez?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

### 5. Install Dependencies

**Root (concurrently runner):**
```bash
cd ShopEZ
npm install
```

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 6. Run the Application

**Option A — Run both together from root:**
```bash
cd ShopEZ
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1
cd ShopEZ/server
npm run dev

# Terminal 2
cd ShopEZ/client
npm start
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔑 Creating an Admin User

Register a normal user via the UI, then in MongoDB Atlas update their `usertype` field:
```json
{ "usertype": "ADMIN" }
```
Or register directly via API:
```bash
POST http://localhost:5000/api/auth/register
{
  "username": "Admin",
  "email": "admin@shopez.com",
  "password": "admin123",
  "usertype": "ADMIN"
}
```

---

## 🚀 API Endpoints

### Auth
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| POST   | /api/auth/register    | Public  |
| POST   | /api/auth/login       | Public  |
| GET    | /api/auth/profile     | User    |

### Products
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | /api/products         | Public  |
| GET    | /api/products/:id     | Public  |
| POST   | /api/products         | Admin   |
| PUT    | /api/products/:id     | Admin   |
| DELETE | /api/products/:id     | Admin   |

### Cart
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | /api/cart             | User    |
| POST   | /api/cart             | User    |
| PUT    | /api/cart/:id         | User    |
| DELETE | /api/cart/:id         | User    |
| DELETE | /api/cart/clear       | User    |

### Orders
| Method | Endpoint                      | Access  |
|--------|-------------------------------|---------|
| POST   | /api/orders                   | User    |
| GET    | /api/orders/my-orders         | User    |
| GET    | /api/orders/:id               | User    |
| GET    | /api/orders/admin/all         | Admin   |
| PUT    | /api/orders/admin/:id/status  | Admin   |

### Admin
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | /api/admin/stats      | Admin   |
| GET    | /api/admin/users      | Admin   |
| DELETE | /api/admin/users/:id  | Admin   |
| GET    | /api/admin/config     | Admin   |
| PUT    | /api/admin/config     | Admin   |

---

## ✨ Features

- **User Auth** — Register, Login, JWT-protected routes
- **Product Catalog** — Browse, search, filter by category/gender/price
- **Product Detail** — Size selector, quantity picker, image gallery
- **Shopping Cart** — Add, remove, update quantities, live totals
- **Checkout** — 2-step: address → payment (COD / Online simulation)
- **Order Tracking** — Order history, status tracking, delivery date
- **Admin Dashboard** — Stats, product CRUD, order status, user management
- **Role-based Access** — USER and ADMIN roles with route guards

---

## 🛠 Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 18, React Router v6       |
| Styling   | Custom CSS, react-icons         |
| HTTP      | Axios with JWT interceptor      |
| Backend   | Node.js, Express.js             |
| Database  | MongoDB Atlas + Mongoose        |
| Auth      | JWT + bcryptjs                  |
| Dev Tools | nodemon, concurrently           |
