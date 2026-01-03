import express from 'express';

const router = express.Router();

// Mock city search endpoint
router.get('/cities', async (req, res) => {
  try {
    const { query, country, region } = req.query;

    // Mock data - in production, this would query a real database or API
    const mockCities = [
      { city_name: 'Paris', country: 'France', region: 'Europe', cost_index: 85 },
      { city_name: 'Tokyo', country: 'Japan', region: 'Asia', cost_index: 95 },
      { city_name: 'New York', country: 'USA', region: 'North America', cost_index: 100 },
      { city_name: 'Bangkok', country: 'Thailand', region: 'Asia', cost_index: 45 },
      { city_name: 'London', country: 'UK', region: 'Europe', cost_index: 90 },
      { city_name: 'Sydney', country: 'Australia', region: 'Oceania', cost_index: 88 },
      { city_name: 'Dubai', country: 'UAE', region: 'Middle East', cost_index: 92 },
      { city_name: 'Barcelona', country: 'Spain', region: 'Europe', cost_index: 70 },
      { city_name: 'Bali', country: 'Indonesia', region: 'Asia', cost_index: 40 },
      { city_name: 'Rome', country: 'Italy', region: 'Europe', cost_index: 75 },
      { city_name: 'Amsterdam', country: 'Netherlands', region: 'Europe', cost_index: 82 },
      { city_name: 'Singapore', country: 'Singapore', region: 'Asia', cost_index: 95 },
      { city_name: 'Istanbul', country: 'Turkey', region: 'Europe', cost_index: 50 },
      { city_name: 'Prague', country: 'Czech Republic', region: 'Europe', cost_index: 55 },
      { city_name: 'Lisbon', country: 'Portugal', region: 'Europe', cost_index: 60 }
    ];

    let filtered = mockCities;

    // Filter by query (city name)
    if (query) {
      filtered = filtered.filter(city => 
        city.city_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by country
    if (country) {
      filtered = filtered.filter(city => 
        city.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    // Filter by region
    if (region) {
      filtered = filtered.filter(city => 
        city.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error('City search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock activities search endpoint
router.get('/activities', async (req, res) => {
  try {
    const { query, category, city } = req.query;

    // Mock data
    const mockActivities = [
      { name: 'Eiffel Tower Visit', category: 'sightseeing', city: 'Paris', cost: 25, duration: '2-3 hours' },
      { name: 'Louvre Museum', category: 'sightseeing', city: 'Paris', cost: 17, duration: '3-4 hours' },
      { name: 'Sushi Making Class', category: 'food', city: 'Tokyo', cost: 80, duration: '2 hours' },
      { name: 'Shibuya Crossing Tour', category: 'sightseeing', city: 'Tokyo', cost: 0, duration: '1 hour' },
      { name: 'Statue of Liberty Tour', category: 'sightseeing', city: 'New York', cost: 24, duration: '2 hours' },
      { name: 'Broadway Show', category: 'entertainment', city: 'New York', cost: 120, duration: '2.5 hours' },
      { name: 'Grand Palace Tour', category: 'sightseeing', city: 'Bangkok', cost: 15, duration: '2 hours' },
      { name: 'Street Food Tour', category: 'food', city: 'Bangkok', cost: 35, duration: '3 hours' },
      { name: 'Big Ben & Westminster', category: 'sightseeing', city: 'London', cost: 0, duration: '1 hour' },
      { name: 'British Museum', category: 'sightseeing', city: 'London', cost: 0, duration: '3-4 hours' },
      { name: 'Sagrada Familia', category: 'sightseeing', city: 'Barcelona', cost: 26, duration: '2 hours' },
      { name: 'Tapas Tasting Tour', category: 'food', city: 'Barcelona', cost: 45, duration: '3 hours' },
      { name: 'Colosseum Tour', category: 'sightseeing', city: 'Rome', cost: 18, duration: '2 hours' },
      { name: 'Vatican Museums', category: 'sightseeing', city: 'Rome', cost: 21, duration: '3-4 hours' }
    ];

    let filtered = mockActivities;

    // Filter by query (activity name)
    if (query) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(activity => 
        activity.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by city
    if (city) {
      filtered = filtered.filter(activity => 
        activity.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error('Activity search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


