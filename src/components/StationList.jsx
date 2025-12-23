import StationCard from "./StationCard";

const StationList = ({ stations = [] }) => {
  if (!stations || stations.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No stations found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 auto-rows-fr">
      {stations.map((station, index) => (
        <StationCard key={`${station.stationuuid}-${index}`} s={station} />
      ))}
    </div>
  );
};

export default StationList;
