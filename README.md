# Vehicle Rental System

A backend application for managing vehicle rentals. This system allows users to browse and book vehicles, while administrators can manage the fleet and oversee bookings.

##  Live Deployment
**Live URL:** https://vehicle-rental-system-ivory-five.vercel.app/

##  Features

- **User Authentication & Authorization**:
  - Secure Sign Up and Sign In using JWT and bcrypt.
  - Role-Based Access Control (RBAC) having `Admin` and `Customer` roles.
- **Vehicle Management**:
  - Admins can Create, Update, and Delete vehicles.
  - Publicly accessible vehicle listing and details.
  - Validation to prevent duplicate vehicle registration.
- **Booking System**:
  - Customers can book available vehicles.
  - Automatic calculation of rental costs.
  - **Automated Expired Booking Return**: A background cron job automatically processes returns for bookings that have exceeded their rental period.
- **Error Handling**:
  - Global error handling for consistent API responses.
  - Specific validation errors (e.g., duplicate emails, invalid input).

##  Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (using `pg` library for raw SQL queries)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Tooling**: `tsx` for development

##  Setup & Installation Instructions

### Prerequisites
- Node.js installed


### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TOMJID/Vehicle-Rental-System.git
   cd Vehicle-Rental-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   
   CONNECTION_STR=your_postgresql_connection_string
   
   JWT_SECRET=your_jwt_secret_key
   ```
   *Note: The application will automatically create the necessary database tables on the first run.*

4. **Run the Server:**
   ```bash
   npm run dev
   ```

##  API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - Login

### Vehicles
- `POST /api/v1/vehicles` - Add a vehicle (Admin only)
- `GET /api/v1/vehicles` - Get all vehicles
- `GET /api/v1/vehicles/:vehicleId` - Get single vehicle
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

### Bookings
- `POST /api/v1/bookings` - Create a booking (Customer only)
- `GET /api/v1/bookings` - Get bookings (Admin: all, Customer: own)
- `PUT /api/v1/bookings/:bookingId` - Update booking status

---
<h3 align="center">  _Developed by Tomjid_ </h3>
