# EverGreat Tech Express API

> A comprehensive e-commerce backend system built with Node.js, Express, TypeScript, and MongoDB

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](CHANGELOG.md)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](package.json)

## 🚀 Features

- **🛍️ Complete Product Management** - Full CRUD with advanced filtering and search
- **🏷️ Cross-Category Subcategory System** - Subcategories can span multiple categories
- **👤 User Authentication & Authorization** - JWT-based with role management (User/Admin)
- **📁 File Upload & Image Management** - Cloudinary integration with optimization
- **🔍 Advanced Search & Filtering** - Comprehensive pagination and query system
- **🎯 Hero Banner Management** - Dynamic homepage content management
- **⚙️ Site Settings Management** - Configurable social links and contact information
- **🔒 Security Features** - Input validation, sanitization, and protection
- **📊 Performance Optimized** - Database indexing and efficient queries

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Examples](#examples)
- [Development](#development)
- [Deployment](#deployment)

## 🛠 Installation

### Prerequisites

- **Node.js** (≥16.0.0)
- **MongoDB** (≥4.4)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**

// TODO: Confirm the URL

```bash
git clone https://github.com/deXcripter/evergreat-tech.git
cd eg-express
```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Start production server**
   ```bash
   npm start
   ```

The server will be running at `http://localhost:3000`

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URI=mongodb://localhost:27017/evergreat-tech

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📚 API Documentation

**Base URL:** `http://localhost:3000/api/v1`

### 🔐 Authentication Endpoints

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| `POST` | `/auth/signup`      | User registration | ❌            |
| `POST` | `/auth/login`       | User login        | ❌            |
| `POST` | `/auth/admin/login` | Admin login       | ❌            |

### 🏷️ Category Endpoints

| Method   | Endpoint        | Description         | Auth Required |
| -------- | --------------- | ------------------- | ------------- |
| `GET`    | `/category`     | Get all categories  | ❌            |
| `GET`    | `/category/:id` | Get single category | ❌            |
| `POST`   | `/category`     | Create category     | 👨‍💼 Admin      |
| `PATCH`  | `/category/:id` | Update category     | 👨‍💼 Admin      |
| `DELETE` | `/category/:id` | Delete category     | 👨‍💼 Admin      |

### 🏪 Subcategory Endpoints (New in v2.0.0)

| Method   | Endpoint                    | Description                 | Auth Required |
| -------- | --------------------------- | --------------------------- | ------------- |
| `GET`    | `/subcategory`              | Get all subcategories       | ❌            |
| `GET`    | `/subcategory/:id`          | Get single subcategory      | ❌            |
| `GET`    | `/subcategory/:id/products` | Get products by subcategory | ❌            |
| `GET`    | `/subcategory/name/:name`   | Get subcategories by name   | ❌            |
| `POST`   | `/subcategory`              | Create subcategory          | 👨‍💼 Admin      |
| `PATCH`  | `/subcategory/:id`          | Update subcategory          | 👨‍💼 Admin      |
| `DELETE` | `/subcategory/:id`          | Delete subcategory          | 👨‍💼 Admin      |

### 📦 Product Endpoints

| Method   | Endpoint             | Description           | Auth Required |
| -------- | -------------------- | --------------------- | ------------- |
| `GET`    | `/product`           | Get all products      | ❌            |
| `GET`    | `/product/featured`  | Get featured products | ❌            |
| `GET`    | `/product/:id`       | Get single product    | ❌            |
| `POST`   | `/product`           | Create product        | 👨‍💼 Admin      |
| `PATCH`  | `/product/:id`       | Update product        | 👨‍💼 Admin      |
| `DELETE` | `/product/:id`       | Delete product        | 👨‍💼 Admin      |
| `DELETE` | `/product/image/:id` | Delete product image  | 👨‍💼 Admin      |

### 🎯 Hero Banner Endpoints

| Method   | Endpoint    | Description          | Auth Required |
| -------- | ----------- | -------------------- | ------------- |
| `GET`    | `/hero`     | Get all hero banners | ❌            |
| `POST`   | `/hero`     | Create hero banner   | 👨‍💼 Admin      |
| `PATCH`  | `/hero/:id` | Update hero banner   | 👨‍💼 Admin      |
| `DELETE` | `/hero/:id` | Delete hero banner   | 👨‍💼 Admin      |

### ⚙️ Settings Endpoints

| Method  | Endpoint    | Description          | Auth Required |
| ------- | ----------- | -------------------- | ------------- |
| `GET`   | `/settings` | Get site settings    | ❌            |
| `PATCH` | `/settings` | Update site settings | ❌            |

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the Authorization header for protected endpoints:

```javascript
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

### User Roles

- **👤 user**: Regular user with read access
- **👨‍💼 admin**: Full CRUD access to all resources

### Example Authentication Flow

```javascript
// 1. Register/Login
const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "password123",
  }),
});

const { token } = await response.json();

// 2. Use token for protected requests
const protectedResponse = await fetch("/api/v1/product", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
  body: formData,
});
```

## 📊 Data Models

### User Model

```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  username: string;
  role: "user" | "admin";
  email: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model

```typescript
interface iCategory {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Subcategory Model (New in v2.0.0)

```typescript
interface iSubcategory {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model (Updated in v2.0.0)

```typescript
interface iProduct {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: ObjectId; // Updated: ObjectId reference
  subcategory?: ObjectId; // Updated: ObjectId reference
  images: string[];
  specs: { [key: string]: string | number | boolean };
  inStock: boolean;
  featured: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 💡 Examples

### Create a Product with Subcategory

```javascript
const formData = new FormData();
formData.append("name", "iPhone 15 Pro");
formData.append("description", "Latest iPhone with advanced features");
formData.append("price", "999");
formData.append("category", "60d5ecb74b24a07f8e4e4c88"); // Category ObjectId
formData.append("subcategory", "60d5ecb74b24a07f8e4e4c89"); // Subcategory ObjectId
formData.append(
  "specs",
  JSON.stringify({
    storage: "256GB",
    color: "Pro Max",
    warranty: "1 year",
  })
);
formData.append("images", file1);
formData.append("images", file2);

const response = await fetch("/api/v1/product", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
  },
  body: formData,
});

const result = await response.json();
console.log(result.data.product);
```

### Get Products with Advanced Filtering

```javascript
const params = new URLSearchParams({
  page: "1",
  limit: "10",
  category: "60d5ecb74b24a07f8e4e4c88",
  subcategory: "60d5ecb74b24a07f8e4e4c89",
  minPrice: "100",
  maxPrice: "1000",
  inStock: "true",
  featured: "false",
  query: "iPhone",
});

const response = await fetch(`/api/v1/product?${params}`);
const products = await response.json();
```

### Get Products by Subcategory (New in v2.0.0)

```javascript
// Get all Apple products across categories
const response = await fetch(
  "/api/v1/subcategory/60d5ecb74b24a07f8e4e4c89/products"
);

// Get Apple products only in smartphones category
const filteredResponse = await fetch(
  "/api/v1/subcategory/60d5ecb74b24a07f8e4e4c89/products?category=60d5ecb74b24a07f8e4e4c88"
);
```

### Find Cross-Category Subcategories

```javascript
// Find all instances of "Apple" subcategory
const response = await fetch("/api/v1/subcategory/name/apple");
const result = await response.json();

console.log(result.data.instances); // All Apple subcategory instances
```

### Upload Example

```javascript
const subcategoryData = {
  name: "Subcategory Name",
  description: "Subcategory Description",
};

await fetch("/api/v1/subcategory", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(subcategoryData),
});
```

## 🔍 Advanced Features

### Cross-Category Subcategories (New in v2.0.0)

The subcategory system supports the same subcategory name across different categories:

- **Apple** can exist in both **Smartphones** and **Laptops** categories
- Each instance has its own unique ObjectId
- Products reference specific subcategory instances
- Search across all instances using the name-based endpoint

### Query Parameters

#### Products

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100000)
- `query`: Search by name (case-insensitive)
- `category`: Filter by category ObjectId
- `subcategory`: Filter by subcategory ObjectId _(New in v2.0.0)_
- `inStock`: Filter by stock status (true/false)
- `featured`: Filter by featured status (true/false)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: Sort direction (asc/desc)

#### Categories & Subcategories

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `query`: Search by name (case-insensitive)
- `sort`: Sort direction (asc/desc)

### Pagination Response Format

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "currentPage": 1,
    "limit": 10
  }
}
```

## 📁 File Upload

### Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)
- **SVG** (.svg)

### File Size Limits

- **Maximum file size**: 5MB per image
- **Maximum images per product**: 10
- **Image optimization**: Automatic via Cloudinary

### Upload Example

```javascript
const formData = new FormData();
formData.append("name", "Subcategory Name");
formData.append("description", "Subcategory Description");
formData.append("coverImage", imageFile); // Optional

await fetch("/api/v1/subcategory", {
  method: "POST",
  headers: { Authorization: "Bearer <token>" },
  body: formData,
});
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: User and admin permissions
- **Input Validation**: Joi-based schema validation
- **MongoDB Injection Protection**: Query sanitization
- **File Upload Security**: Type and size validation
- **CORS Configuration**: Controlled cross-origin access
- **Password Security**: bcrypt hashing
- **Error Handling**: Secure error messages

## 🚀 Performance Features

- **Database Indexing**: Optimized for fast queries
- **Image Optimization**: Cloudinary integration
- **Pagination**: Efficient large dataset handling
- **Population**: Selective field loading
- **Caching-friendly**: Slug-based URLs
- **Query Optimization**: MongoDB aggregation pipelines

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run lint        # Run ESLint (if configured)
npm run type-check  # TypeScript type checking
```

### Project Structure

```
src/
├── controllers/     # Route handlers and business logic
├── middlewares/     # Custom middleware functions
├── models/         # MongoDB/Mongoose models
├── routes/         # API route definitions
├── utils/          # Utility functions and helpers
├── validations/    # Joi validation schemas
├── config/         # Database and app configuration
└── app.ts          # Express app setup and configuration
```

### Development Workflow

1. **Make changes** to source code in `src/`
2. **TypeScript compilation** happens automatically
3. **Server restarts** automatically with nodemon
4. **Test endpoints** using your preferred API client
5. **Build for production** using `npm run build`

### Adding New Features

1. **Create model** in `src/models/`
2. **Add validation** in `src/validations/`
3. **Implement controller** in `src/controllers/`
4. **Define routes** in `src/routes/`
5. **Register routes** in `src/app.ts`

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret
CLOUDINARY_CLOUD_NAME=your-production-cloud
CLOUDINARY_API_KEY=your-production-key
CLOUDINARY_API_SECRET=your-production-secret
PORT=3000
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start dist/server.js --name "evergreat-api"
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and patterns
- Add TypeScript types for all new code
- Include validation for new endpoints
- Update documentation for API changes
- Add tests for new functionality

## 📝 API Response Examples

### Successful Response

```json
{
  "status": "success",
  "data": {
    "product": {
      "_id": "60d5ecb74b24a07f8e4e4c90",
      "name": "iPhone 15 Pro",
      "category": {
        "name": "smartphones",
        "slug": "smartphones"
      },
      "subcategory": {
        "name": "apple",
        "slug": "apple"
      }
    }
  }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Product name is required"
}
```

### Pagination Response

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "currentPage": 1,
    "limit": 10
  }
}
```

## 📚 Additional Resources

- **[Changelog](CHANGELOG.md)** - Detailed version history
- **[GitHub Repository](https://github.com/deXcripter/React_Native)** - Source code
- **[Issues](https://github.com/deXcripter/React_Native/issues)** - Bug reports and feature requests

## 📞 Support

- **Email**: support@evergreattech.com
- **Developer**: Johnpaul Nnaji
- **GitHub**: [@deXcripter](https://github.com/deXcripter)

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **MongoDB & Mongoose** - Database and ODM
- **Cloudinary** - Image management and optimization
- **TypeScript** - Type safety and developer experience
- **Joi** - Data validation library

---

**Built with ❤️ by Johnpaul (deXcripter)**
