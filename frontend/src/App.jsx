import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import ItineraryBuilder from './pages/ItineraryBuilder';
import BudgetDashboard from './pages/BudgetDashboard';
import TripTimeline from './pages/TripTimeline';
import CitySearch from './pages/CitySearch';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/trips/new" element={<CreateTrip />} />
                    <Route path="/trips/:id" element={<TripDetail />} />
                    <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
                    <Route path="/trips/:id/budget" element={<BudgetDashboard />} />
                    <Route path="/trips/:id/timeline" element={<TripTimeline />} />
                    <Route path="/search" element={<CitySearch />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

