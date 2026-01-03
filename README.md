# 🌍 Globe Trotter - Travel Planning Platform

A complete full-stack web application for personalized multi-city travel planning, budgeting, and collaboration.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication
- **Trip Management**: Create, view, update, and delete trips
- **Itinerary Builder**: Drag-and-drop interface for organizing destinations and activities
- **Budget Tracking**: Real-time budget monitoring with visual charts
- **City Search**: Search and filter cities by country/region with cost index
- **Responsive Design**: Modern dark mode UI with glassmorphism effects

## 🛠️ Tech Stack

### Backend
- Node.js with Express.js
- MySQL database
- Sequelize ORM
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router
- Axios for API calls
- @dnd-kit for drag-and-drop
- Recharts for data visualization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Database Setup

1. Create a MySQL database:
```sql
mysql -u root -p
CREATE DATABASE globe_trotter;
```

2. Run the schema script:
```bash
mysql -u root -p globe_trotter < schema.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=globe_trotter
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
globe-trotter/
├── schema.sql                 # MySQL database schema
├── backend/
│   ├── config/
│   │   └── database.js        # Sequelize configuration
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Destination.js
│   │   ├── Activity.js
│   │   └── Expense.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── search.js
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── server.js              # Express server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Layout.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── CreateTrip.jsx
    │   │   ├── TripDetail.jsx
    │   │   ├── ItineraryBuilder.jsx
    │   │   ├── BudgetDashboard.jsx
    │   │   └── CitySearch.jsx
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # React entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Trips
- `GET /api/trips` - Get all trips (summary)
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `GET /api/trips/:id/budget` - Get budget breakdown

### Destinations
- `POST /api/trips/:id/destinations` - Add destination
- `PUT /api/trips/destinations/:destId` - Update destination
- `DELETE /api/trips/destinations/:destId` - Delete destination
- `PUT /api/trips/:id/destinations/reorder` - Reorder destinations

### Activities
- `POST /api/trips/destinations/:destId/activities` - Add activity
- `PUT /api/trips/activities/:activityId` - Update activity
- `DELETE /api/trips/activities/:activityId` - Delete activity

### Expenses
- `POST /api/trips/:id/expenses` - Add expense

### Search
- `GET /api/search/cities` - Search cities
- `GET /api/search/activities` - Search activities

### Sharing
- `GET /api/trips/shared/:token` - Get shared trip (read-only)

## 🎨 UI Features

- **Bento Grid Dashboard**: Modern grid layout showing upcoming trips and popular destinations
- **Glassmorphism Design**: Translucent backgrounds with blur effects
- **Dark Mode**: Beautiful gradient backgrounds with dark theme
- **Responsive Sidebar**: Collapsible navigation menu for mobile devices
- **Drag & Drop**: Intuitive reordering of destinations in itinerary builder
- **Data Visualization**: Pie charts and bar charts for budget analysis

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- Input validation on both frontend and backend

## 📝 Notes

- The search endpoints currently return mock data. In production, integrate with real travel APIs.
- The database schema uses foreign keys with CASCADE delete for data integrity.
- All dates are validated to ensure destinations fall within trip date ranges.

## 🚧 Future Enhancements

- Real-time collaboration features
- Integration with travel booking APIs
- Photo uploads for trips and destinations
- Email notifications
- Mobile app version
- Advanced analytics and insights

## 📄 License

This project is open source and available for educational purposes.

