# AgricHub Marketplace
## Database Schema

This document defines the database structure for the AgricHub Marketplace MVP.

Only models approved in the Product Bible should be included here.

---

# Users

## User

| Field | Type | Notes |
|--------|------|-------|
| id | BigAutoField | Primary Key |
| email | EmailField | Unique |
| first_name | CharField | |
| last_name | CharField | |
| phone_number | CharField | |
| role | CharField | buyer / farmer |
| is_active | BooleanField | |
| is_staff | BooleanField | |
| is_verified | BooleanField | |
| created_at | DateTimeField | |
| updated_at | DateTimeField | |

---

# Products

## Category

| Field | Type | Notes |
|--------|------|-------|
| id | BigAutoField | Primary Key |
| name | CharField | Unique |
| slug | SlugField | Unique |

---

## Product

| Field | Type | Notes |
|--------|------|-------|
| id | BigAutoField | Primary Key |
| farmer | ForeignKey(User) | Farmer |
| category | ForeignKey(Category) | |
| name | CharField | |
| description | TextField | |
| price | DecimalField | |
| quantity | PositiveIntegerField | |
| unit | CharField | kg, bag, basket, etc. |
| image | ImageField | |
| is_available | BooleanField | |
| created_at | DateTimeField | |
| updated_at | DateTimeField | |

---

# Shopping Cart

## Cart

Each buyer owns one active shopping cart.

| Field | Type | Notes |
|--------|------|-------|
| id | BigAutoField | Primary Key |
| buyer | OneToOneField(User) | One cart per buyer |
| created_at | DateTimeField | |
| updated_at | DateTimeField | |

---

## CartItem

Represents one product inside a buyer's cart.

| Field | Type | Notes |
|--------|------|-------|
| id | BigAutoField | Primary Key |
| cart | ForeignKey(Cart) | |
| product | ForeignKey(Product) | |
| quantity | PositiveIntegerField | |

---

# Relationships

User (Buyer)
    │
    │ OneToOne
    ▼
Cart
    │
    │ OneToMany
    ▼
CartItem
    │
    │ ManyToOne
    ▼
Product
    │
    ▼
Category

---

# MVP Notes

The following are intentionally **not** included in the MVP:

- Coupons
- Promo Codes
- Wishlists
- Saved Carts
- Guest Carts
- Shipping Costs
- Tax Calculations
- Multiple Active Carts
- Inventory Reservations

These features may be added in future versions if approved in the Product Bible.

Later we'll add tables such as:

TransportPartner
Shipment
DeliveryQuote
Vehicle
Warehouse
FarmLocation
DeliveryAddress
Route
TrackingEvent

No need to touch it until we actually implement logistics.

# AgricHub Africa — Database Schema

## Overview

AgricHub Africa uses PostgreSQL as its primary relational database. The schema is designed using a modular approach where each business domain owns its data while maintaining clear relationships across the platform.

The database is structured to support millions of users and future expansion into logistics, warehousing, finance, and agricultural supply chain management.

---

# Current Core Entities

## Users

Stores all platform users.

User roles include:

- Buyer
- Farmer
- Administrator

---

## Farmer Profile

Extends the User model with:

- Farm Information
- Farm Address
- State
- Local Government
- Verification Status
- Business Details

---

## Categories

Stores agricultural product categories.

Examples:

- Vegetables
- Fruits
- Livestock
- Grains
- Tubers
- Poultry
- Seafood

---

## Products

Represents products listed by farmers.

Contains:

- Farmer
- Category
- Name
- Description
- Price
- Quantity
- Images
- Availability

---

## Cart

Represents a buyer's active shopping cart.

Contains:

- Buyer
- Cart Items
- Total Amount

---

## Orders

Stores completed purchases.

Contains:

- Buyer
- Farmer
- Ordered Products
- Total Cost
- Payment Status
- Order Status

---

## Payments

Stores payment transactions linked to orders.

---

## Notifications

Stores system-generated notifications sent to users.

---

## Reviews

Stores ratings and reviews submitted by buyers.

---

# Planned Database Modules

## Logistics

Future entities include:

- Shipment
- Delivery Quote
- Pickup Request
- Delivery Address
- Tracking Event

---

## Transport

Future entities include:

- Driver
- Vehicle
- Transport Company
- Route
- Delivery Assignment

---

## Warehousing

Future entities include:

- Warehouse
- Collection Centre
- Storage Request
- Inventory Movement

---

## Finance

Future entities include:

- Wallet
- Escrow Account
- Loan
- Commission Transaction

---

## Analytics

Future entities include:

- Sales Metrics
- Farmer Performance
- Marketplace Reports
- Demand Forecasts

---

# Database Design Principles

AgricHub follows these principles:

- Normalized relational structure
- Foreign key relationships
- Soft expansion through modular applications
- UUID-ready architecture where appropriate
- Indexed search fields
- Optimized query performance
- Scalable migration strategy

---

# Future Scalability

The schema is intentionally designed so new supply chain modules can be added without disrupting existing marketplace operations.

Marketplace functionality remains the platform's foundation, while logistics, transport, warehousing, finance, and analytics extend the same data model to create a fully integrated agricultural ecosystem.