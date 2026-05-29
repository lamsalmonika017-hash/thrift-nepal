# 🇳🇵 Thrift Nepal — Student Marketplace

Nepal's #1 student thrift marketplace. Buy & sell laptops, phones, books, clothes, furniture, and more — all from fellow Nepali students.

---

## 🚀 Quick Setup Guide

### Prerequisites
- Node.js v18+
- MySQL (via phpMyAdmin or XAMPP/WAMP)
- npm or yarn

---

## 1. Database Setup

### Using phpMyAdmin:
1. Open phpMyAdmin → Create a new database named `thrift_nepal`
2. Select the database → Click **SQL** tab
3. Paste the contents of `database/schema.sql` → Click **Go**

### Using MySQL CLI:
```bash
mysql -u root -p < database/schema.sql
```

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=thrift_nepal
DB_PORT=3306

JWT_SECRET=thrift_nepal_super_secret_key_change_this
JWT_EXPIRY=7d

PORT=5000

ADMIN_EMAIL=admin@thriftnepal.com
ADMIN_PASSWORD=Admin@123
ADMIN_USERNAME=admin
```

Start the backend:
```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

Backend runs at: http://localhost:5000

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 4. Your eSewa QR Code

The eSewa QR code (`backend/uploads/esewa-qr.png`) is already placed in the uploads folder.

During checkout, it's served at:
```
http://localhost:5000/uploads/esewa-qr.png
```

This is displayed automatically on the checkout payment page.

---

## 🔑 Default Admin Login

```
Email:    admin@thriftnepal.com
Password: Admin@123
```

Access admin panel at: http://localhost:5173/admin

---

## 📁 Project Structure

```
thrift-nepal/
├── backend/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   ├── jwt.js          # JWT auth + middleware
│   │   └── multer.js       # File upload config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── shopController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── index.js        # Order, Cart, Wishlist, Payment
│   ├── routes/
│   │   └── index.js
│   ├── uploads/
│   │   ├── esewa-qr.png    # Your eSewa QR code
│   │   ├── products/       # Product images
│   │   ├── payments/       # Payment screenshots
│   │   └── avatars/        # User profile photos
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js   # Axios API client
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── AdminPages.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Sell.jsx
│   │   │   └── UserPages.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── database/
    └── schema.sql
```

---

## 🛍️ Features

### For Students (Buyers)
- Browse all categories: Electronics, Laptops, Phones, Fashion, Books, Furniture, Gaming, etc.
- Search & filter by category, condition, price
- Add to cart & wishlist
- Checkout with eSewa QR payment
- Track orders

### For Students (Sellers)
- List items for free — no commission
- Upload up to 5 product photos
- Set price, condition, description
- Mark items as sold
- Manage your listings

### eSewa Payment Flow
1. Buyer places order
2. eSewa QR code is shown (Monika Lamsal · 9749332717)
3. Buyer scans & pays
4. Buyer uploads payment screenshot
5. Admin verifies in admin panel
6. Order gets confirmed

### Admin Panel (/admin)
- Dashboard with stats (users, products, orders, revenue)
- Manage all users (activate/deactivate)
- Manage all products (feature/delete)
- Manage orders (update status)
- **Verify payments** — view screenshot, approve or reject

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0F0F0F` |
| Dark | `#1A1A1A` |
| Card | `#242424` |
| Border | `#2E2E2E` |
| Orange Accent | `#FF6B35` |
| Beige | `#D9C3A5` |
| Text | `#E8E8E8` |
| Muted | `#888888` |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/me | ✅ |
| PUT | /api/auth/profile | ✅ |
| GET | /api/products | — |
| GET | /api/products/featured | — |
| GET | /api/products/trending | — |
| GET | /api/products/recent | — |
| GET | /api/products/:id | — |
| POST | /api/products | ✅ |
| PUT | /api/products/:id | ✅ |
| DELETE | /api/products/:id | ✅ |
| GET | /api/cart | ✅ |
| POST | /api/cart | ✅ |
| GET | /api/wishlist | ✅ |
| POST | /api/wishlist/toggle | ✅ |
| POST | /api/orders | ✅ |
| GET | /api/orders/my | ✅ |
| POST | /api/payments | ✅ |
| GET | /api/admin/stats | 🔐 Admin |
| GET | /api/admin/users | 🔐 Admin |
| GET | /api/admin/products | 🔐 Admin |
| GET | /api/admin/orders | 🔐 Admin |
| GET | /api/admin/payments | 🔐 Admin |
| PATCH | /api/admin/payments/:id/verify | 🔐 Admin |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router v6, Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express.js, MySQL2, JWT, bcryptjs, Multer

**Database:** MySQL (phpMyAdmin compatible)

**Payment:** eSewa QR Code (manual screenshot verification)

---

Made with ❤️ for Nepali students 🇳🇵
