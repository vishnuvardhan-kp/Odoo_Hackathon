import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-xl">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{trip.title}</h1>
          <p className="text-gray-300">
            {new Date(trip.start_date).toLocaleDateString()} -{' '}
            {new Date(trip.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/trips/${id}/itinerary`}
            className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
          >
            📅 Itinerary
          </Link>
          <Link
            to={`/trips/${id}/timeline`}
            className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
          >
            📊 Timeline
          </Link>
          <Link
            to={`/trips/${id}/budget`}
            className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
          >
            💰 Budget
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Destinations</h2>
          {trip.Destinations && trip.Destinations.length > 0 ? (
            <div className="space-y-4">
              {trip.Destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="glass-dark rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {dest.city_name}, {dest.country}
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {new Date(dest.arrival_date).toLocaleDateString()} -{' '}
                        {new Date(dest.departure_date).toLocaleDateString()}
                      </p>
                      {dest.Activities && dest.Activities.length > 0 && (
                        <p className="text-gray-400 text-xs mt-2">
                          {dest.Activities.length} {dest.Activities.length === 1 ? 'activity' : 'activities'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-300">
              <p>No destinations added yet</p>
              <Link
                to={`/trips/${id}/itinerary`}
                className="inline-block mt-4 text-purple-400 hover:text-purple-300"
              >
                Add destinations →
              </Link>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Trip Info</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Budget Limit</p>
              <p className="text-2xl font-bold text-white">
                ${parseFloat(trip.budget_limit || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Destinations</p>
              <p className="text-2xl font-bold text-white">
                {trip.Destinations?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;

