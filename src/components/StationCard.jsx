import { countClick, voteStation } from "../services/api";

const StationCard = ({ s }) => (
  <div className="bg-gradient-to-br from-white via-gray-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 min-h-[320px] sm:min-h-[350px] flex flex-col group hover:-translate-y-1">
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-bold text-base sm:text-lg text-gray-800 leading-tight line-clamp-2 pr-2">{s.name}</h3>
      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        <span>🎧</span>
        <span className="uppercase">{s.codec}</span>
      </div>
    </div>

    <div className="space-y-3 mb-4 flex-1">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-base">🌍</span>
        <span className="truncate">{s.country}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-base">🗣</span>
        <span className="truncate">{s.language || "N/A"}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-base">🎵</span>
        <span className="truncate" title={s.tags}>{s.tags || "N/A"}</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
        <span>👍</span>
        <span className="font-medium">{s.votes}</span>
      </div>
      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
        <span>🔥</span>
        <span className="font-medium">{s.clickcount}</span>
      </div>
    </div>

    {s.url_resolved && (
      <audio
        controls
        className="w-full mb-4 rounded-xl border border-gray-200 shadow-sm"
        src={s.url_resolved}
        onPlay={() => countClick(s.stationuuid)}
      />
    )}

    <button
      onClick={() => voteStation(s.stationuuid)}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-auto group-hover:shadow-xl"
    >
      <span className="flex items-center justify-center gap-2">
        <span>👍</span>
        <span>Vote for Station</span>
      </span>
    </button>
  </div>
);

export default StationCard;
