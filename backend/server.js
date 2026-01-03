import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/index.js'; // Initialize model associations
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Globe Trotter API is running' });
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    
    // Sync models (in development - use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      sequelize.sync({ alter: false }).then(() => {
        console.log('Database models synchronized.');
      });
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

export default app;

