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

  const getCostIndexColor = (index) => {
    if (index >= 80) return 'text-red-400';
    if (index >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const uniqueCountries = [...new Set(cities.map((c) => c.country))].sort();
  const uniqueRegions = [...new Set(cities.map((c) => c.region))].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">City Search</h1>

      {/* Search and Filters */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg glass-dark border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-3 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="px-4 py-3 rounded-lg glass-dark border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <h2 className="text-2xl font-bold text-white mb-4">
          Results ({filteredCities.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city, idx) => (
            <div
              key={idx}
              className="glass-dark rounded-xl p-4 hover:bg-white hover:bg-opacity-10 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-white">{city.city_name}</h3>
                  <p className="text-gray-400 text-sm">{city.country}</p>
                  <p className="text-gray-500 text-xs mt-1">{city.region}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-gray-400 text-xs">Cost Index</span>
                <span
                  className={`text-lg font-bold ${getCostIndexColor(city.cost_index)}`}
                >
                  {city.cost_index}/100
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      city.cost_index >= 80
                        ? 'bg-red-500'
                        : city.cost_index >= 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${city.cost_index}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredCities.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <p>No cities found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;


