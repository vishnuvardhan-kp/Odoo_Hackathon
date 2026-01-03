import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TripTimeline = () => {
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

  const getDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const getDestinationForDate = (date, destinations) => {
    const dateStr = date.toISOString().split('T')[0];
    return destinations.find(
      (dest) =>
        dest.arrival_date <= dateStr && dest.departure_date >= dateStr
    );
  };

  if (loading || !trip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const days = getDaysBetween(trip.start_date, trip.end_date);
  const destinations = trip.Destinations || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trip Timeline</h1>
          <p className="text-gray-300">{trip.title}</p>
        </div>
        <Link
          to={`/trips/${id}`}
          className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
        >
          ← Back to Trip
        </Link>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500"></div>

          {/* Timeline items */}
          <div className="space-y-8">
            {days.map((day, index) => {
              const destination = getDestinationForDate(day, destinations);
              const isFirstDay = index === 0;
              const isLastDay = index === days.length - 1;
              const isNewDestination =
                destination &&
                destination.arrival_date === day.toISOString().split('T')[0];

              return (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                      isNewDestination
                        ? 'bg-purple-500 border-purple-300'
                        : 'bg-pink-500 border-pink-300'
                    } z-10`}
                  ></div>

                  {/* Content */}
                  <div className="ml-12 flex-1">
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {day.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                        {isFirstDay && (
                          <span className="text-xs text-purple-400 font-semibold">
                            START
                          </span>
                        )}
                        {isLastDay && (
                          <span className="text-xs text-pink-400 font-semibold">
                            END
                          </span>
                        )}
                      </div>

                      {destination ? (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-2xl">📍</span>
                            <div>
                              <p className="text-white font-medium">
                                {destination.city_name}, {destination.country}
                              </p>
                              {isNewDestination && (
                                <p className="text-xs text-purple-400">
                                  Arrival Day
                                </p>
                              )}
                            </div>
                          </div>

                          {destination.Activities &&
                            destination.Activities.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {destination.Activities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="glass rounded-lg p-2 flex items-center justify-between"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm">
                                        {activity.time_slot || 'TBD'}
                                      </span>
                                      <span className="text-white text-sm">
                                        {activity.name}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                      {activity.category}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No destination scheduled
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripTimeline;


