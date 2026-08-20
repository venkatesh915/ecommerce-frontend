# BharatBazaar 🛒

A modern full-stack e-commerce frontend application built with **React, Vite, TypeScript, and Tailwind CSS**.

BharatBazaar provides a shopping experience similar to Amazon/Flipkart with product browsing, categories, cart management, wishlist, authentication, orders, and user features.

---

## 🚀 Live Demo

Frontend:
```
https://ecommerce-frontend-kohl-two.vercel.app/
```

Backend API:
```
https://ecommerce-backend-86vx.onrender.com
```

---

# ✨ Features

## User Features

✅ User Registration  
✅ User Login / Logout  
✅ JWT Authentication  
✅ User Profile Management  
✅ Product Search  
✅ Product Filtering  
✅ Category Browsing  
✅ Product Details Page  
✅ Product Image Gallery  
✅ Add to Cart  
✅ Update Cart Quantity  
✅ Remove Cart Items  
✅ Wishlist Management  
✅ Address Management  
✅ Order Placement  
✅ Order History  
✅ Product Reviews  
✅ Dark / Light Theme Support  


## Shopping Features

✅ Responsive Product Cards  
✅ Category Sections  
✅ Product Recommendations  
✅ Flash Sale Banner  
✅ Scrolling Offers Banner  
✅ Mobile Responsive Design  
✅ Cart Counter  
✅ Price Formatting  
✅ Amazon-style Navigation


## Admin Features

✅ Admin Dashboard  
✅ Manage Products  
✅ Manage Categories  
✅ Manage Orders  
✅ Manage Users  

---

# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Zustand State Management
- Axios
- Lucide React Icons


## Deployment

- Vercel


---

# 📂 Project Structure

```
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Orders.tsx
│   │   └── ...
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md

```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <My-repository-url>
```

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create a file:

```
.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://your-backend-url.com
```

---

# ▶️ Run Development Server

Start frontend:

```bash
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

# 🏗️ Production Build

Create production build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

# 🔌 API Integration

Frontend communicates with FastAPI backend using Axios.

Example:

```typescript
axios.get(
 `${import.meta.env.VITE_API_URL}/products`
)
```

---

# 🎨 UI Theme

Brand:

```
BharatBazaar
```

Primary Color:

```
#FF6B00
```

Dark Theme:

```
#0F172A
```

Fonts:

```
Poppins
Inter
```

---

# 🌐 Deployment

## Vercel Deployment

Steps:

1. Push code to GitHub

2. Import project in Vercel

3. Add environment variable:

```
VITE_API_URL
```

4. Deploy


---

# 📱 Responsive Support

Supported devices:

✅ Desktop  
✅ Laptop  
✅ Tablet  
✅ Mobile  


---

# 🔐 Security

Implemented:

- JWT token authentication
- Protected routes
- Role-based UI rendering
- Environment variable based API configuration


---

# 👨‍💻 Developer

**Venky**

BharatBazaar E-Commerce Platform

---

# 📄 License

This project is developed for learning and portfolio purposes.
