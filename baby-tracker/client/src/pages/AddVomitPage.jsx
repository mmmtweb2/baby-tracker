import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import SeverityPicker from '../components/SeverityPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { vomitsApi } from '../services/api';
import { getCurrentDate, getCurrentTime } from '../utils/helpers';

export default function AddVomitPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    time: getCurrentTime(),
    severity: 'moderate',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await vomitsApi.create(formData);
      navigate('/', { replace: true });
    } catch (err) {
      alert('שגיאה בשמירה: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header 
        title="רישום הקאה" 
        subtitle="סמן מתי הייתה הקאה"
      />
      
      <main className="max-w-lg mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              תאריך ושעה
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300"
              />
            </div>
          </div>

          {/* Severity */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              עוצמת ההקאה
            </label>
            <SeverityPicker
              selected={formData.severity}
              onChange={(severity) => setFormData({ ...formData, severity })}
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              הערות (אופציונלי)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="הערות נוספות..."
              rows={3}
              className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-6 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  שמור
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
