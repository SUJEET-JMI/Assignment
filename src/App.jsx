import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import AddStationPage from "./pages/AddStationPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddStationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
