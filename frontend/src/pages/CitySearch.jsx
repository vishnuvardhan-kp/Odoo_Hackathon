import { useState, useEffect } from 'react';
import axios from 'axios';

const CitySearch = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    filterCities();
  }, [searchQuery, selectedCountry, selectedRegion, cities]);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/search/cities');
      setCities(response.data);
      setFilteredCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCities = () => {
    let filtered = [...cities];

    if (searchQuery) {
      filtered = filtered.filter((city) =>
        city.city_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((city) =>
        city.country.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter((city) =>
        city.region.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    setFilteredCities(filtered);
  };

  const getCityImage = (cityName) => {
    const cityImages = {
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
      'Bangkok': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
      'Sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
      'Barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80',
      'Bali': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80',
      'Rome': 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=400&q=80',
      'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80',
      'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
      'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
      'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80',
      'Lisbon': 'https://images.unsplash.com/photo-1555881403-5d6c52a0e6b3?w=400&q=80',
    };
    return cityImages[cityName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80';
  };

  const getCostIndexColor = (index) => {
    if (index >= 80) return 'text-red-500';
    if (index >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getCostBarColor = (index) => {
    if (index >= 80) return 'bg-red-500';
    if (index >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const uniqueCountries = [...new Set(cities.map((c) => c.country))].sort();
  const uniqueRegions = [...new Set(cities.map((c) => c.region))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Discovering amazing cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="hero-section">
        <h1 className="text-4xl font-bold text-white mb-2">Discover Amazing Cities</h1>
        <p className="text-white/90 text-lg">Explore destinations around the world</p>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Regions</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Results ({filteredCities.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city, idx) => (
            <div
              key={idx}
              className="city-card"
            >
              <img 
                src={getCityImage(city.city_name)} 
                alt={city.city_name}
                className="city-card-image"
              />
              <div className="city-card-content">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{city.city_name}</h3>
                <p className="text-gray-600 text-sm mb-1">{city.country}</p>
                <p className="text-gray-500 text-xs mb-4">{city.region}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-xs font-medium">Cost Index</span>
                    <span
                      className={`text-lg font-bold ${getCostIndexColor(city.cost_index)}`}
                    >
                      {city.cost_index}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getCostBarColor(city.cost_index)}`}
                      style={{ width: `${city.cost_index}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80" 
              alt="No results" 
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
            />
            <p className="text-gray-600 text-lg">No cities found matching your criteria</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;


