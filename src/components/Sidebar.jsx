import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/add', label: 'Add Station', icon: '➕' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white w-64 min-h-screen shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-lg"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Logo/Brand Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            RadioHub
          </h1>
          <p className="text-xs text-blue-200 mt-1">Music Discovery</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white hover:shadow-md hover:transform hover:scale-102'
              }`}
            >
              {/* Active indicator */}
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}

              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon */}
              <div className={`relative z-10 text-xl transition-transform duration-200 ${
                location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </div>

              {/* Label */}
              <span className="relative z-10 font-medium">{item.label}</span>

              {/* Active glow effect */}
              {location.pathname === item.path && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 blur-sm rounded-xl"></div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
