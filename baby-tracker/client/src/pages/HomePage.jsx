import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Utensils, AlertCircle, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsApi, feedingsApi, vomitsApi } from '../services/api';
import { formatShortDate, isSameDay } from '../utils/helpers';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ feedings: 0, vomits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [timeline, feedings, vomits] = await Promise.all([
        analyticsApi.getDailySummary(7),
        feedingsApi.getAll(),
        vomitsApi.getAll(),
      ]);
      
      setEvents(timeline.slice(0, 10));
      
      // Count today's events
      const today = new Date();
      const todayFeedings = feedings.filter(f => isSameDay(f.date, today)).length;
      const todayVomits = vomits.filter(v => isSameDay(v.date, today)).length;
      setStats({ feedings: todayFeedings, vomits: todayVomits });
      
    } catch (err) {
      setError('לא ניתן לטעון את הנתונים. בדוק את החיבור לשרת.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event) => {
  if (!event.id && !event._id) {
    alert('לא ניתן למחוק רשומה זו');
    return;
  }
  if (!confirm('למחוק את הרשומה?')) return;
  
  try {
    const id = event._id || event.id;
    if (event.type === 'feeding') {
      await feedingsApi.delete(id);
    } else {
      await vomitsApi.delete(id);
    }
    loadData();
  } catch (err) {
    alert('שגיאה במחיקה');
  }
};

  return (
    <div className="min-h-screen pb-24">
      <Header 
        title="מעקב תזונה" 
        subtitle="תעקבו אחרי הארוחות וזהו דפוסים"
      />
      
      <main className="max-w-lg mx-auto px-4 -mt-2">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            to="/add-feeding"
            className="card-hover bg-white rounded-2xl p-4 shadow-sm border border-baby-100 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-sage-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">הוסף האכלה</p>
              <p className="text-xs text-gray-400">רשום ארוחה</p>
            </div>
          </Link>
          
          <Link
            to="/add-vomit"
            className="card-hover bg-white rounded-2xl p-4 shadow-sm border border-baby-100 flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">רשום הקאה</p>
              <p className="text-xs text-gray-400">סמן אירוע</p>
            </div>
          </Link>
        </div>

        {/* Today Stats */}
        <div className="bg-gradient-to-l from-sage-500 to-sage-600 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm">היום</p>
              <p className="text-white text-lg font-bold mt-1">
                {stats.feedings} האכלות • {stats.vomits} הקאות
              </p>
            </div>
            <Link 
              to="/analytics"
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-xl p-3"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">היסטוריה אחרונה</h2>
          <Link 
            to="/history" 
            className="text-sage-600 text-sm font-medium flex items-center gap-1 hover:text-sage-700"
          >
            הכל
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-6 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={loadData}
              className="text-sm text-red-700 underline"
            >
              נסה שוב
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-baby-100">
            <p className="text-gray-500 mb-4">עדיין אין רשומות</p>
            <Link
              to="/add-feeding"
              className="inline-flex items-center gap-2 text-sage-600 font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              הוסף האכלה ראשונה
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <EventCard 
                key={`${event.type}-${event._id || index}`} 
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
