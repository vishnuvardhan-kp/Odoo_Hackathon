import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/api/trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const popularDestinations = [
    { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
    { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
    { city: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80' },
    { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/90 text-lg">Plan your next adventure with ease</p>
          </div>
          <Link
            to="/trips/new"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            Plan New Trip
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips - Large Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Trips</h2>
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80" 
                  alt="Travel" 
                  className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg"
                />
              </div>
              <p className="text-xl mb-4 text-gray-700 font-semibold">No trips yet</p>
              <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
              <Link
                to="/trips/new"
                className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.slice(0, 3).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="block trip-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {trip.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(trip.start_date).toLocaleDateString()} -{' '}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600 text-sm font-medium">
                          {trip.city_count} {trip.city_count === 1 ? 'city' : 'cities'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs">TRIP</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular Destinations</h2>
          <div className="space-y-3">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="city-card cursor-pointer"
              >
                <img 
                  src={dest.image} 
                  alt={dest.city}
                  className="city-card-image"
                />
                <div className="city-card-content">
                  <h3 className="font-semibold text-gray-800">{dest.city}</h3>
                  <p className="text-sm text-gray-600 country">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Stats</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-600 text-sm mb-2 font-medium">Total Trips</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{trips.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-600 text-sm mb-2 font-medium">Total Cities</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {trips.reduce((sum, trip) => sum + trip.city_count, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* All Trips Link */}
        {trips.length > 0 && (
          <div className="lg:col-span-3 glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Your Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="trip-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 text-lg">{trip.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(trip.start_date).toLocaleDateString()} -{' '}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-3 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">MAP</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


