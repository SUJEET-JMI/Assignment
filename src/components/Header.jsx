const Header = () => (
  <header className="bg-white text-gray-800 p-6 shadow-md border-b border-gray-200">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-2xl text-white">🎵</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-900">
          Radio Stations
        </h1>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
        <span>📻</span>
        <span>Listen Anywhere</span>
      </div>
    </div>
  </header>
);

export default Header;
