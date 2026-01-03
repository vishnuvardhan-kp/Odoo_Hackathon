# Quick Setup Guide

## ✅ Current Status
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed  
- ✅ Backend server running on http://localhost:5000
- ✅ Frontend server running on http://localhost:3000

## 🔧 Database Setup Required

### Step 1: Create MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Run the following commands:

```sql
CREATE DATABASE IF NOT EXISTS globe_trotter;
USE globe_trotter;
```

3. Run the schema file:
```bash
mysql -u root -p globe_trotter < schema.sql
```

Or copy and paste the contents of `schema.sql` into MySQL.

### Step 2: Configure Backend Environment

Create a `.env` file in the `backend` directory with:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=globe_trotter
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password (leave empty if no password).

### Step 3: Restart Backend Server

After creating the `.env` file, restart the backend:

```bash
cd backend
npm start
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 🐛 Troubleshooting

### Database Connection Error
- Make sure MySQL is running
- Verify database credentials in `.env` file
- Ensure the `globe_trotter` database exists

### Port Already in Use
- Backend (5000): Change PORT in `.env` file
- Frontend (3000): Vite will automatically use next available port

### Frontend Can't Connect to Backend
- Check that backend is running on port 5000
- Verify CORS is enabled (already configured)
- Check browser console for errors

## 📝 Next Steps

1. Create the database using `schema.sql`
2. Create `.env` file in `backend` directory
3. Restart backend server
4. Open http://localhost:3000 in your browser
5. Sign up for a new account and start planning trips!


