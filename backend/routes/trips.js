import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Trip from '../models/Trip.js';
import Destination from '../models/Destination.js';
import Activity from '../models/Activity.js';
import Expense from '../models/Expense.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

const router = express.Router();

// Get all trips for authenticated user (summary)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { user_id: req.user.id },
      attributes: ['id', 'title', 'start_date', 'end_date', 'budget_limit', 'cover_photo', 'is_public'],
      include: [{
        model: Destination,
        attributes: ['id', 'city_name', 'country'],
        required: false
      }],
      order: [['start_date', 'DESC']]
    });

    const tripsSummary = trips.map(trip => {
      const tripData = trip.toJSON();
      return {
        id: tripData.id,
        title: tripData.title,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        budget_limit: tripData.budget_limit,
        cover_photo: tripData.cover_photo,
        is_public: tripData.is_public,
        city_count: tripData.Destinations ? tripData.Destinations.length : 0
      };
    });

    res.json(tripsSummary);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single trip with full details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: Destination,
          include: [{
            model: Activity,
            required: false
          }]
        },
        {
          model: Expense,
          required: false
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, start_date, end_date, budget_limit, cover_photo, is_public } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({ error: 'Title, start_date, and end_date are required' });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const share_token = crypto.randomBytes(32).toString('hex');

    const trip = await Trip.create({
      user_id: req.user.id,
      title,
      start_date,
      end_date,
      budget_limit: budget_limit || 0,
      cover_photo,
      is_public: is_public || false,
      share_token
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update trip
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const { title, start_date, end_date, budget_limit, cover_photo, is_public } = req.body;

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    // Validate that all destinations fall within new date range if dates are being updated
    if (start_date || end_date) {
      const newStartDate = start_date || trip.start_date;
      const newEndDate = end_date || trip.end_date;
      
      const destinations = await Destination.findAll({
        where: { trip_id: trip.id }
      });

      for (const dest of destinations) {
        if (new Date(dest.arrival_date) < new Date(newStartDate) || 
            new Date(dest.departure_date) > new Date(newEndDate)) {
          return res.status(400).json({ 
            error: 'Cannot update dates: some destinations fall outside the new date range' 
          });
        }
      }
    }

    await trip.update({
      title: title || trip.title,
      start_date: start_date || trip.start_date,
      end_date: end_date || trip.end_date,
      budget_limit: budget_limit !== undefined ? budget_limit : trip.budget_limit,
      cover_photo: cover_photo !== undefined ? cover_photo : trip.cover_photo,
      is_public: is_public !== undefined ? is_public : trip.is_public
    });

    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete trip
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get budget breakdown
router.get('/:id/budget', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Get all expenses grouped by category
    const expenses = await Expense.findAll({
      where: { trip_id: trip.id }
    });

    // Get activities costs
    const destinations = await Destination.findAll({
      where: { trip_id: trip.id },
      include: [{
        model: Activity,
        required: false
      }]
    });

    let activitiesCost = 0;
    destinations.forEach(dest => {
      dest.Activities?.forEach(activity => {
        activitiesCost += parseFloat(activity.cost || 0);
      });
    });

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(expense.amount || 0);
      return acc;
    }, {});

    // Add activities cost to expenses if any
    if (activitiesCost > 0) {
      expensesByCategory['Activities'] = (expensesByCategory['Activities'] || 0) + activitiesCost;
    }

    const totalCost = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);
    const budgetLimit = parseFloat(trip.budget_limit || 0);
    const remaining = budgetLimit - totalCost;

    res.json({
      budget_limit: budgetLimit,
      total_cost: totalCost,
      remaining: remaining,
      breakdown: expensesByCategory,
      percentage_used: budgetLimit > 0 ? (totalCost / budgetLimit) * 100 : 0
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add destination to trip
router.post('/:id/destinations', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const { city_name, country, arrival_date, departure_date, order_index } = req.body;

    if (!city_name || !country || !arrival_date || !departure_date) {
      return res.status(400).json({ error: 'City name, country, arrival_date, and departure_date are required' });
    }

    // Validate dates fall within trip range
    if (new Date(arrival_date) < new Date(trip.start_date) || 
        new Date(departure_date) > new Date(trip.end_date)) {
      return res.status(400).json({ error: 'Destination dates must fall within trip date range' });
    }

    if (new Date(arrival_date) > new Date(departure_date)) {
      return res.status(400).json({ error: 'Arrival date must be before departure date' });
    }

    // Get max order_index if not provided
    let finalOrderIndex = order_index;
    if (finalOrderIndex === undefined) {
      const maxOrder = await Destination.max('order_index', {
        where: { trip_id: trip.id }
      });
      finalOrderIndex = (maxOrder || -1) + 1;
    }

    const destination = await Destination.create({
      trip_id: trip.id,
      city_name,
      country,
      arrival_date,
      departure_date,
      order_index: finalOrderIndex
    });

    res.status(201).json(destination);
  } catch (error) {
    console.error('Add destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update destination
router.put('/destinations/:destId', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.destId, {
      include: [{
        model: Trip,
        where: { user_id: req.user.id }
      }]
    });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const { city_name, country, arrival_date, departure_date, order_index } = req.body;

    // Validate dates if being updated
    if (arrival_date || departure_date) {
      const trip = await Trip.findByPk(destination.trip_id);
      const newArrival = arrival_date || destination.arrival_date;
      const newDeparture = departure_date || destination.departure_date;

      if (new Date(newArrival) < new Date(trip.start_date) || 
          new Date(newDeparture) > new Date(trip.end_date)) {
        return res.status(400).json({ error: 'Destination dates must fall within trip date range' });
      }

      if (new Date(newArrival) > new Date(newDeparture)) {
        return res.status(400).json({ error: 'Arrival date must be before departure date' });
      }
    }

    await destination.update({
      city_name: city_name || destination.city_name,
      country: country || destination.country,
      arrival_date: arrival_date || destination.arrival_date,
      departure_date: departure_date || destination.departure_date,
      order_index: order_index !== undefined ? order_index : destination.order_index
    });

    res.json(destination);
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete destination
router.delete('/destinations/:destId', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.destId, {
      include: [{
        model: Trip,
        where: { user_id: req.user.id }
      }]
    });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    await destination.destroy();
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder destinations
router.put('/:id/destinations/reorder', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const { destinationIds } = req.body; // Array of destination IDs in new order

    if (!Array.isArray(destinationIds)) {
      return res.status(400).json({ error: 'destinationIds must be an array' });
    }

    // Update order_index for each destination
    for (let i = 0; i < destinationIds.length; i++) {
      await Destination.update(
        { order_index: i },
        { where: { id: destinationIds[i], trip_id: trip.id } }
      );
    }

    res.json({ message: 'Destinations reordered successfully' });
  } catch (error) {
    console.error('Reorder destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add activity to destination
router.post('/destinations/:destId/activities', authenticateToken, async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.destId, {
      include: [{
        model: Trip,
        where: { user_id: req.user.id }
      }]
    });

    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const { name, category, cost, time_slot, is_booked } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const activity = await Activity.create({
      destination_id: destination.id,
      name,
      category,
      cost: cost || 0,
      time_slot,
      is_booked: is_booked || false
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update activity
router.put('/activities/:activityId', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId, {
      include: [{
        model: Destination,
        include: [{
          model: Trip,
          where: { user_id: req.user.id }
        }]
      }]
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const { name, category, cost, time_slot, is_booked } = req.body;

    await activity.update({
      name: name || activity.name,
      category: category || activity.category,
      cost: cost !== undefined ? cost : activity.cost,
      time_slot: time_slot !== undefined ? time_slot : activity.time_slot,
      is_booked: is_booked !== undefined ? is_booked : activity.is_booked
    });

    res.json(activity);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete activity
router.delete('/activities/:activityId', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.activityId, {
      include: [{
        model: Destination,
        include: [{
          model: Trip,
          where: { user_id: req.user.id }
        }]
      }]
    });

    if (!activity) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    await activity.destroy();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add expense
router.post('/:id/expenses', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const { category, amount, date, description } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ error: 'Category, amount, and date are required' });
    }

    const expense = await Expense.create({
      trip_id: trip.id,
      category,
      amount,
      date,
      description
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shared trip by token
router.get('/shared/:token', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        share_token: req.params.token,
        is_public: true
      },
      include: [
        {
          model: Destination,
          include: [{
            model: Activity,
            required: false
          }],
          order: [['order_index', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or not publicly shared' });
    }

    // Return read-only data (exclude sensitive info)
    const tripData = trip.toJSON();
    delete tripData.user_id;
    delete tripData.share_token;

    res.json(tripData);
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

