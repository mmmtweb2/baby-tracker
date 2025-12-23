import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AddFeedingPage from './pages/AddFeedingPage';
import AddVomitPage from './pages/AddVomitPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-heebo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-feeding" element={<AddFeedingPage />} />
          <Route path="/add-vomit" element={<AddVomitPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}
