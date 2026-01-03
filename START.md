# 🚀 Globe Trotter - Quick Start

## ✅ Servers Status

Both servers are currently running:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000

## 📋 Setup Checklist

### 1. Database Setup (Required)

Before using the application, you need to set up the MySQL database:

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
CREATE DATABASE globe_trotter;
USE globe_trotter;
SOURCE schema.sql;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new schema named `globe_trotter`
4. Open `schema.sql` and execute it

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

**Windows PowerShell:**
```powershell
cd backend
@"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=globe_trotter
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or use the setup script:**
```powershell
.\setup-env.ps1
```

**Manual Creation:**
Create `backend/.env` file with:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=globe_trotter
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Restart Backend (After .env creation)

```bash
# Stop current backend (Ctrl+C in terminal)
# Then restart:
cd backend
npm start
```

## 🌐 Access Application

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. Sign up for a new account
4. Start planning your trips!

## 🔍 Verify Setup

**Check Backend Health:**
- Visit: http://localhost:5000/api/health
- Should return: `{"status":"OK","message":"Globe Trotter API is running"}`

**Check Database Connection:**
- Look at backend console output
- Should see: "Database connection established successfully."

## 🛠️ Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists in `backend` directory
- Check MySQL is running

### Database connection error
- Verify MySQL is running: `mysql --version`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env` file

### Frontend can't connect
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy settings in `vite.config.js`

## 📝 Notes

- Default MySQL user is `root` with no password
- Change `DB_PASSWORD` in `.env` if your MySQL has a password
- The JWT_SECRET should be changed in production
- Both servers auto-reload on code changes (if using `npm run dev`)


