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
    { city: 'Paris', country: 'France', image: '🇫🇷' },
    { city: 'Tokyo', country: 'Japan', image: '🇯🇵' },
    { city: 'Barcelona', country: 'Spain', image: '🇪🇸' },
    { city: 'Bali', country: 'Indonesia', image: '🇮🇩' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Link
          to="/trips/new"
          className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
        >
          ➕ Plan New Trip
        </Link>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips - Large Card */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Trips</h2>
          {trips.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <p className="text-xl mb-4">No trips yet</p>
              <Link
                to="/trips/new"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
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
                  className="block glass-dark rounded-xl p-4 hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {trip.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {new Date(trip.start_date).toLocaleDateString()} -{' '}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {trip.city_count} {trip.city_count === 1 ? 'city' : 'cities'}
                      </p>
                    </div>
                    <div className="text-4xl">✈️</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular Destinations */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Popular Destinations</h2>
          <div className="space-y-3">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="glass-dark rounded-lg p-3 flex items-center space-x-3 hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
              >
                <span className="text-3xl">{dest.image}</span>
                <div>
                  <p className="font-semibold text-white">{dest.city}</p>
                  <p className="text-sm text-gray-400">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Total Trips</p>
              <p className="text-3xl font-bold text-white">{trips.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Cities</p>
              <p className="text-3xl font-bold text-white">
                {trips.reduce((sum, trip) => sum + trip.city_count, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* All Trips Link */}
        {trips.length > 0 && (
          <div className="lg:col-span-3 glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">All Your Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="glass-dark rounded-xl p-4 hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <h3 className="font-semibold text-white mb-2">{trip.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(trip.start_date).toLocaleDateString()} -{' '}
                    {new Date(trip.end_date).toLocaleDateString()}
                  </p>
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

