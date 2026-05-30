# CarPartner — Startup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

## Quick Start

### 1. Seed Demo Users (first time only)
```bash
cd server
node seedAdmin.js
```

### 2. Start Backend
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### 3. Start Frontend (new terminal)
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

## Demo Accounts
| Role   | Email           | Password  |
|--------|-----------------|-----------|
| Admin  | admin@cp.com   | admin123  |
| Owner  | owner@cp.com   | owner123  |
| Renter | renter@cp.com  | renter123 |

## Features
- **Home**: Premium landing with vehicle categories, search, featured listings
- **Browse**: Filter by type, location, rental type with pagination
- **Vehicle Detail**: Full info, gallery, booking form with live price calc
- **Request Vehicle**: Submit a request when no suitable vehicle found
- **Owner Dashboard**: List vehicles, view bookings & earnings
- **Renter Dashboard**: Manage bookings & requests
- **Admin Panel**: Approve/reject vehicles & bookings, manage users & requests

## API Endpoints
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/vehicles` — Browse vehicles
- `POST /api/vehicles` — List vehicle (owner)
- `POST /api/bookings/vehicle/:id` — Book vehicle (renter)
- `POST /api/requests` — Request a vehicle (renter)
- `GET /api/admin/dashboard` — Admin stats
- `PUT /api/admin/vehicles/:id/status` — Approve/reject vehicle
- `PUT /api/admin/bookings/:id/status` — Manage booking
