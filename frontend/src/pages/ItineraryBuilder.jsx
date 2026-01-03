import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableDestination = ({ destination, onDelete, onAddActivity, trip }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: destination.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-dark rounded-xl p-4 mb-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
            >
              ⋮⋮
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {destination.city_name}, {destination.country}
              </h3>
              <p className="text-gray-300 text-sm">
                {new Date(destination.arrival_date).toLocaleDateString()} -{' '}
                {new Date(destination.departure_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {destination.Activities && destination.Activities.length > 0 && (
            <div className="mt-4 space-y-2">
              {destination.Activities.map((activity) => (
                <div
                  key={activity.id}
                  className="glass rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{activity.name}</p>
                    <p className="text-gray-400 text-xs">
                      {activity.category} • {activity.time_slot || 'TBD'}
                    </p>
                  </div>
                  <span className="text-purple-400 font-semibold">
                    ${parseFloat(activity.cost || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onAddActivity(destination.id)}
            className="mt-3 text-sm text-purple-400 hover:text-purple-300"
          >
            + Add Activity
          </button>
        </div>

        <button
          onClick={() => onDelete(destination.id)}
          className="ml-4 text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [newDestination, setNewDestination] = useState({
    city_name: '',
    country: '',
    arrival_date: '',
    departure_date: '',
  });
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'sightseeing',
    cost: '',
    time_slot: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await axios.get(`/api/trips/${id}`);
      setTrip(response.data);
      setDestinations(response.data.Destinations || []);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = destinations.findIndex((d) => d.id === active.id);
      const newIndex = destinations.findIndex((d) => d.id === over.id);

      const newDestinations = arrayMove(destinations, oldIndex, newIndex);
      setDestinations(newDestinations);

      // Update order on backend
      try {
        await axios.put(`/api/trips/${id}/destinations/reorder`, {
          destinationIds: newDestinations.map((d) => d.id),
        });
      } catch (error) {
        console.error('Error reordering destinations:', error);
        fetchTrip(); // Revert on error
      }
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/trips/${id}/destinations`, {
        ...newDestination,
        arrival_date: newDestination.arrival_date,
        departure_date: newDestination.departure_date,
      });
      setNewDestination({
        city_name: '',
        country: '',
        arrival_date: '',
        departure_date: '',
      });
      setShowAddDestination(false);
      fetchTrip();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add destination');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/trips/destinations/${showAddActivity}/activities`, {
        ...newActivity,
        cost: parseFloat(newActivity.cost) || 0,
      });
      setNewActivity({
        name: '',
        category: 'sightseeing',
        cost: '',
        time_slot: '',
      });
      setShowAddActivity(null);
      fetchTrip();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add activity');
    }
  };

  const handleDeleteDestination = async (destId) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await axios.delete(`/api/trips/destinations/${destId}`);
        fetchTrip();
      } catch (error) {
        alert('Failed to delete destination');
      }
    }
  };

  if (loading || !trip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Itinerary Builder</h1>
          <p className="text-gray-300">{trip.title}</p>
        </div>
        <button
          onClick={() => navigate(`/trips/${id}`)}
          className="glass px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-20 transition-all"
        >
          ← Back to Trip
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Destinations</h2>
          <button
            onClick={() => setShowAddDestination(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            + Add Destination
          </button>
        </div>

        {showAddDestination && (
          <div className="glass-dark rounded-xl p-4 mb-4">
            <form onSubmit={handleAddDestination} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City Name"
                  value={newDestination.city_name}
                  onChange={(e) =>
                    setNewDestination({ ...newDestination, city_name: e.target.value })
                  }
                  required
                  className="px-4 py-2 rounded-lg glass border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newDestination.country}
                  onChange={(e) =>
                    setNewDestination({ ...newDestination, country: e.target.value })
                  }
                  required
                  className="px-4 py-2 rounded-lg glass border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="date"
                  placeholder="Arrival Date"
                  value={newDestination.arrival_date}
                  onChange={(e) =>
                    setNewDestination({ ...newDestination, arrival_date: e.target.value })
                  }
                  required
                  min={trip.start_date}
                  max={trip.end_date}
                  className="px-4 py-2 rounded-lg glass border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="date"
                  placeholder="Departure Date"
                  value={newDestination.departure_date}
                  onChange={(e) =>
                    setNewDestination({ ...newDestination, departure_date: e.target.value })
                  }
                  required
                  min={newDestination.arrival_date || trip.start_date}
                  max={trip.end_date}
                  className="px-4 py-2 rounded-lg glass border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDestination(false);
                    setNewDestination({
                      city_name: '',
                      country: '',
                      arrival_date: '',
                      departure_date: '',
                    });
                  }}
                  className="glass-dark px-6 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={destinations.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {destinations.map((destination) => (
              <SortableDestination
                key={destination.id}
                destination={destination}
                trip={trip}
                onDelete={handleDeleteDestination}
                onAddActivity={(destId) => setShowAddActivity(destId)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {destinations.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <p>No destinations added yet. Add your first destination to get started!</p>
          </div>
        )}
      </div>

      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Add Activity</h3>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <input
                type="text"
                placeholder="Activity Name"
                value={newActivity.name}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select
                value={newActivity.category}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="transport">Transport</option>
                <option value="stay">Stay</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Cost"
                value={newActivity.cost}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, cost: e.target.value })
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="time"
                placeholder="Time Slot"
                value={newActivity.time_slot}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, time_slot: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddActivity(null);
                    setNewActivity({
                      name: '',
                      category: 'sightseeing',
                      cost: '',
                      time_slot: '',
                    });
                  }}
                  className="flex-1 glass-dark px-6 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;


