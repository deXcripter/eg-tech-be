# Changelog

All notable changes to the EverGreat Tech Express API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-05-25

### 🚀 Major Features Added

#### Complete Subcategory System Implementation

- **NEW**: Standalone subcategory entity with full CRUD operations (name, description, active status).
- **NEW**: Cross-category subcategory support (same name across different categories).
- **NEW**: Advanced product filtering by subcategory with pagination.
- **NEW**: Proper ObjectId references between products, categories, and subcategories.

#### New API Endpoints

- `POST /api/v1/subcategory` - Create subcategory.
- `GET /api/v1/subcategory` - List all subcategories with pagination and search.
- `GET /api/v1/subcategory/:id` - Get single subcategory details.
- `PATCH /api/v1/subcategory/:id` - Update subcategory.
- `DELETE /api/v1/subcategory/:id` - Delete subcategory with referential integrity.
- `GET /api/v1/subcategory/:id/products` - Get all products in a subcategory with advanced filtering.
- `GET /api/v1/subcategory/name/:name` - Find subcategory instances by name across categories.

### 🔧 Breaking Changes

#### Product Model Updates

- **BREAKING**: `category` field changed from String to ObjectId reference.
- **BREAKING**: `subcategory` field changed from String to ObjectId reference.
- **ENHANCED**: Added automatic population of category and subcategory data in responses.

#### Subcategory Feature Update

- **REMOVED**: Image support (`coverImage`) for subcategories. Subcategories now only consist of name, description, and active status.

#### Validation Enhancements

- **BREAKING**: Product validation now requires ObjectId format for category and subcategory fields.
- **ENHANCED**: Added ObjectId format validation using Joi custom validators.
- **NEW**: Referential integrity checks for category and subcategory existence.

### 🛠 Technical Improvements

#### Database Optimizations

- **NEW**: Compound indexes on subcategory names for efficient searching.
- **NEW**: Automatic slug generation for subcategories.
- **ENHANCED**: Improved query performance with selective field population.
- **NEW**: Static method `findByNameAcrossCategories` for cross-category subcategory searches.

#### API Response Enhancements

- **ENHANCED**: Product endpoints now return populated category and subcategory data.
- **NEW**: Subcategory product count and sample products in name-based searches.
- **ENHANCED**: Comprehensive pagination metadata across all endpoints.
- **NEW**: Cross-reference filtering (products by subcategory within specific category).

#### Advanced Filtering

- **NEW**: Products can be filtered by subcategory ObjectId.
- **NEW**: Enhanced product filtering with subcategory support in query middleware.
- **ENHANCED**: Price range filtering on subcategory product endpoints.
- **NEW**: Stock and featured status filtering on subcategory products.

### 🛡️ Security & Validation

#### Referential Integrity

- **NEW**: Prevent deletion of subcategories with associated products.
- **ENHANCED**: Validation of category existence during product creation/update.
- **NEW**: Validation of subcategory existence during product creation/update.
- **NEW**: Comprehensive error handling for relationship validation.

#### Input Validation

- **ENHANCED**: ObjectId format validation using Joi custom validators.
- **NEW**: Subcategory name uniqueness validation.
- **ENHANCED**: Improved error messages for validation failures.
- **NEW**: Cross-field validation for price ranges.

### 🎯 Developer Experience

#### TypeScript Enhancements

- **NEW**: Complete type definitions for subcategory model and methods.
- **ENHANCED**: Updated product interface with ObjectId references.
- **NEW**: Type-safe population methods for relationships.
- **ENHANCED**: Improved model method signatures.

#### Error Handling

- **ENHANCED**: Specific error messages for missing categories/subcategories.
- **NEW**: Detailed validation errors for ObjectId format issues.
- **ENHANCED**: Graceful handling of referential integrity violations.
- **NEW**: Comprehensive error context in validation failures.

### 📊 Migration Guide

#### Database Migration Required

```javascript
// 1. Create subcategory documents from existing product subcategory strings
const uniqueSubcategories = await Product.distinct("subcategory", {
  subcategory: { $ne: null, $type: "string" },
});

for (const subcatName of uniqueSubcategories) {
  await Subcategory.create({
    name: subcatName,
    description: `${subcatName} products`,
    isActive: true,
  });
}

// 2. Update product documents to use ObjectId references
const products = await Product.find({
  subcategory: { $type: "string" },
});

for (const product of products) {
  const subcategory = await Subcategory.findOne({
    name: product.subcategory,
  });
  if (subcategory) {
    product.subcategory = subcategory._id;
    await product.save();
  }
}
```

#### API Client Updates Required

- Update product creation/update calls to use ObjectId for category/subcategory.
- Handle populated category/subcategory objects in product responses.
- Update filtering logic to use ObjectId values instead of strings.

---

## [1.5.0] - 2025-04-15

### Added

- **Site Settings Management**: Complete CRUD for social links, contact info.
- **Hero Banner System**: Dynamic homepage content management.
- **Enhanced Error Handling**: Custom AppError class with better error context.
- **Cloudinary Integration**: Optimized image management and storage.

### Changed

- **File Upload Validation**: Improved security and error handling.
- **Pagination System**: Enhanced metadata and edge case handling.
- **Error Response Format**: Standardized error responses across all endpoints.

### Fixed

- **Image Upload Memory Leaks**: Proper cleanup of temporary files.
- **Pagination Edge Cases**: Correct calculation for boundary conditions.
- **Authentication Token Validation**: Improved JWT error handling.

---

## [1.4.0] - 2025-03-20

### Added

- **Featured Products Endpoint**: `GET /api/v1/product/featured`.
- **Product Rating System**: 0-5 star rating with validation.
- **Advanced Product Search**: Search within specifications.
- **Image Deletion Functionality**: Remove individual product images.

### Changed

- **Product Validation Schema**: Enhanced with rating and featured fields.
- **Query Performance**: Database indexes for faster searches.
- **API Response Consistency**: Standardized response format.

### Fixed

- **Product Image Upload**: Concurrency issues during multiple uploads.
- **Memory Optimization**: Large dataset handling improvements.

---

## [1.3.0] - 2025-02-10

### Added

- **Category Management System**: Complete CRUD operations.
- **Category-based Product Filtering**: Filter products by category.
- **Cover Image Support**: Image upload for categories.
- **Slug-based URLs**: SEO-friendly category URLs.

### Changed

- **Product Model**: Added category references and validation.
- **Validation System**: Enhanced category relationship validation.
- **Error Messages**: More descriptive validation error messages.

### Fixed

- **Category Deletion**: Prevent deletion when products exist.
- **Image Upload Validation**: Better file type and size validation.

---

## [1.2.0] - 2025-01-25

### Added

- **Advanced Pagination**: Comprehensive metadata and navigation.
- **Product Search**: Full-text search across product names.
- **Price Range Filtering**: Min/max price query parameters.
- **Stock Status Filtering**: In-stock/out-of-stock filtering.

### Changed

- **Product Controller**: Better error handling and validation.
- **Query Parameter Validation**: Joi-based query validation.
- **Response Format**: Improved client integration.

### Fixed

- **Pagination Calculations**: Edge cases and boundary conditions.
- **Search Performance**: Optimized database queries.

---

## [1.1.0] - 2025-01-10

### Added

- **File Upload System**: Multer integration with validation.
- **Image Optimization**: Cloudinary integration for image processing.
- **Product Image Management**: Multiple images per product.
- **File Type Validation**: Security measures for uploads.

### Changed

- **Product Model**: Image arrays and upload handling.
- **Validation**: File upload validation and error handling.
- **Storage**: Cloud-based image storage.

### Security

- **File Type Validation**: Whitelist of allowed image formats.
- **File Size Limits**: 5MB per image, 10 images per product.
- **Upload Security**: Secure file handling and storage.

---

## [1.0.0] - 2024-12-15

### Added

- **Initial API Structure**: Express.js with TypeScript.
- **User Authentication**: JWT-based authentication system.
- **Role-based Access Control**: User and admin roles.
- **Product CRUD**: Basic product management.
- **MongoDB Integration**: Mongoose ODM with validation.
- **Input Validation**: Joi schema validation.
- **CORS Configuration**: Cross-origin resource sharing.
- **Environment Configuration**: Environment-based settings.

### Security

- **JWT Authentication**: Secure token-based authentication.
- **Password Hashing**: bcrypt for password security.
- **Input Sanitization**: Validation and sanitization.
- **MongoDB Injection Protection**: Query sanitization.

---

## [0.1.0] - 2024-12-01

### Added

- **Project Initialization**: Basic project structure.
- **Express Server**: Basic server setup.
- **TypeScript Configuration**: Development environment.
- **Database Connection**: MongoDB connection setup.
- **Basic Routing**: Initial route structure.

---

## Breaking Changes Summary

### v2.0.0 Breaking Changes

1. **Product Model**: Category and subcategory fields now require ObjectId format.
2. **API Responses**: Product endpoints return populated objects instead of strings.
3. **Validation**: ObjectId validation required for category/subcategory references.
4. **Database Schema**: Migration required for existing data.

### Migration Support

For assistance with migration from v1.x to v2.0.0:

- Email: support@evergreattech.com
- Documentation: Complete migration scripts provided above.
- Breaking Change Guide: Detailed in v2.0.0 section.

---

## Support & Documentation

- **API Documentation**: See README.md for complete API reference.
- **GitHub Repository**: [EverGreat Tech Express API](https://github.com/deXcripter/React_Native).
- **Issues**: Report bugs and feature requests via GitHub Issues.
- **Support Email**: support@evergreattech.com.

---

**Maintained by:** Johnpaul Nnaji Obinna  
**License:** ISC  
**Node.js Version:** 16.x or higher  
**MongoDB Version:** 4.4 or higher
