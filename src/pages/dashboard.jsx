import { useEffect, useState } from "react";
import * as api   from "../services/api";
import StationList from "../components/StationList";
import StationCard from "../components/StationCard";
import SearchPanel from "../components/SearchPanel";
import AddStation from "../components/AddStation";

const Dashboard = () => {
  const [stations, setStations] = useState([]);

  const load = async (type) => {
    const map = {
      clicks: api.byClicks,
      votes: api.byVotes,
      recent: api.byRecentClick,
      changed: api.byRecentlyChanged,
      broken: api.brokenStations,
      old: api.oldVersions,
    };
    setStations(await map[type]());
  };

  useEffect(() => {
    load("clicks");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600 text-lg">Discover and explore radio stations from around the world</p>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Stations</h3>
          <SearchPanel onSearch={(q) => api.searchStations(q).then(setStations)} />
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => load("clicks")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Top Clicks
            </button>
            <button
              onClick={() => load("votes")}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Top Votes
            </button>
            <button
              onClick={() => load("recent")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Recent Click
            </button>
            <button
              onClick={() => load("changed")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
            >
              Recently Changed
            </button>
            <button
              onClick={() => load("old")}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Old Versions
            </button>
            <button
              onClick={() => load("broken")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Broken
            </button>
          </div>
        </div>

        {/* Station List */}
        <StationList stations={stations} />
      </div>
    </div>
  );
};

export default Dashboard;
