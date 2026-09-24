# AgricHub Marketplace

# Database Schema

**Version:** 1.0

**Status:** Approved

**Last Updated:** July 8, 2026

---

# Overview

This document defines the official database schema for the AgricHub Marketplace MVP.

All Django models must conform to this schema unless a formal schema revision is approved.

---

# Entity Relationship Overview

User
│
├── Products
├── Orders
├── Reviews
└── Notifications

Category
│
└── Products

Product
│
├── Cart Items
├── Order Items
└── Reviews

Cart
│
└── Cart Items

Order
│
└── Order Items

---

# 1. User

Table Name

accounts_user

Purpose

Stores all platform users.

Fields

| Field | Type | Required |
|--------|------|----------|
| id | Integer | Yes |
| email | Email | Yes |
| first_name | String | Yes |
| last_name | String | Yes |
| phone_number | String | No |
| role | Buyer/Farmer | Yes |
| is_active | Boolean | Yes |
| is_staff | Boolean | Yes |
| is_superuser | Boolean | Yes |
| is_verified | Boolean | Yes |
| date_joined | DateTime | Yes |
| created_at | DateTime | Yes |
| updated_at | DateTime | Yes |

Relationships

One User can own many Products.

One User can create many Orders.

One User has one Shopping Cart.

---

# 2. Category

Table Name

products_category

Fields

| Field | Type |
|--------|------|
| id | Integer |
| name | String |
| slug | String |

Relationships

One Category contains many Products.

---

# 3. Product

Table Name

products_product

Fields

| Field | Type |
|--------|------|
| id | Integer |
| farmer | FK(User) |
| category | FK(Category) |
| name | String |
| description | Text |
| price | Decimal |
| quantity | Integer |
| unit | Choice |
| image | Image |
| is_available | Boolean |
| created_at | DateTime |
| updated_at | DateTime |

Relationships

Belongs to one Farmer.

Belongs to one Category.

Can exist in many Carts.

Can exist in many Orders.

Can have many Reviews.

---

# 4. Cart

Table Name

cart_cart

Fields

| Field | Type |
|--------|------|
| id | Integer |
| buyer | OneToOne(User) |
| created_at | DateTime |
| updated_at | DateTime |

---

# 5. Cart Item

Table Name

cart_cartitem

Fields

| Field | Type |
|--------|------|
| id | Integer |
| cart | FK(Cart) |
| product | FK(Product) |
| quantity | Integer |
| subtotal | Decimal |

---

# 6. Order

Table Name

orders_order

Fields

| Field | Type |
|--------|------|
| id | Integer |
| buyer | FK(User) |
| total_amount | Decimal |
| status | Choice |
| created_at | DateTime |
| updated_at | DateTime |

Order Status

Pending

Accepted

Processing

Ready

Out for Delivery

Delivered

Completed

Cancelled

---

# 7. Order Item

Table Name

orders_orderitem

Fields

| Field | Type |
|--------|------|
| id | Integer |
| order | FK(Order) |
| product | FK(Product) |
| quantity | Integer |
| unit_price | Decimal |
| subtotal | Decimal |

---

# 8. Payment

Table Name

payments_payment

Fields

| Field | Type |
|--------|------|
| id | Integer |
| order | OneToOne(Order) |
| amount | Decimal |
| payment_method | Choice |
| payment_status | Choice |
| transaction_reference | String |
| paid_at | DateTime |

Payment Status

Pending

Successful

Failed

Refunded

---

# 9. Delivery

Table Name

delivery_delivery

Fields

| Field | Type |
|--------|------|
| id | Integer |
| order | OneToOne(Order) |
| delivery_address | Text |
| status | Choice |
| estimated_delivery_date | Date |
| delivered_at | DateTime |

---

# 10. Review

Table Name

reviews_review

Fields

| Field | Type |
|--------|------|
| id | Integer |
| buyer | FK(User) |
| product | FK(Product) |
| rating | Integer |
| comment | Text |
| created_at | DateTime |

---

# 11. Notification

Table Name

notifications_notification

Fields

| Field | Type |
|--------|------|
| id | Integer |
| user | FK(User) |
| title | String |
| message | Text |
| is_read | Boolean |
| created_at | DateTime |

---

# Database Design Principles

- Use Foreign Keys for relationships.
- Use One-to-One relationships where ownership is exclusive.
- Store timestamps for auditability.
- Avoid duplicate data.
- Use cascading deletes only where appropriate.
- Keep business rules in the application layer.

---

# Version Control

Any future schema change must:

- Identify the business requirement.
- Assess migration impact.
- Update this document.
- Be approved before implementation.

# AgricHub Africa — API Specification

## Overview

AgricHub Africa exposes a RESTful API that powers the Web Application, Mobile Application, future third-party integrations, and internal platform services.

The API is built using Django REST Framework and follows consistent REST principles, JWT authentication, predictable resource naming, pagination, filtering, and standardized JSON responses.

Base URL

```
/api/
```

---

# Authentication

Authentication uses JSON Web Tokens (JWT).

Supported features include:

- User Registration
- User Login
- Token Refresh
- User Profile
- Password Management

---

# Current API Modules

## Accounts

Responsible for:

- Authentication
- User Accounts
- Profiles
- Roles
- Farmer Registration

---

## Products

Responsible for:

- Categories
- Product Listings
- Product Details
- Product Images
- Product Search
- Product Filtering

---

## Farmers

Responsible for:

- Farmer Dashboard
- Farmer Products
- Farmer Orders
- Farmer Profile

---

## Cart

Responsible for:

- Shopping Cart
- Cart Items
- Quantity Updates
- Cart Totals

---

## Orders

Responsible for:

- Checkout
- Orders
- Order Details
- Order Status

---

## Payments

Responsible for:

- Payment Processing
- Transaction Status
- Payment Verification

---

## Notifications

Responsible for:

- User Notifications
- Read Status
- Notification History

---

## Reviews

Responsible for:

- Product Reviews
- Farmer Ratings
- Buyer Feedback

---

# Future API Modules

As AgricHub evolves into a complete agricultural ecosystem, additional APIs will be introduced.

## Logistics API

- Delivery Quotes
- Shipment Creation
- Pickup Requests
- Delivery Tracking
- Estimated Delivery Time

---

## Transport API

- Driver Registration
- Vehicle Management
- Delivery Assignment
- Capacity Management

---

## Warehouse API

- Warehouse Listings
- Storage Requests
- Inventory Movement
- Collection Centres

---

## Finance API

- Wallet
- Escrow
- Farmer Loans
- Commission Reports

---

## Analytics API

- Farmer Performance
- Marketplace Statistics
- Sales Reports
- Revenue Analytics

---

## AI Services API

- Product Recommendations
- Demand Forecasting
- Dynamic Pricing
- Route Optimization

---

# API Standards

AgricHub APIs follow these standards:

- RESTful architecture
- JSON request/response format
- JWT Authentication
- Pagination
- Filtering
- Search
- Ordering
- Role-Based Authorization
- Standard HTTP Status Codes

---

# Documentation

Interactive API documentation is automatically generated using Django REST Framework Spectacular.

```
/api/schema/

/api/docs/

/api/redoc/
```

These endpoints provide the latest API documentation and should be considered the primary reference for endpoint details.