import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import CategoryPicker from '../components/CategoryPicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { feedingsApi } from '../services/api';
import { getCurrentDate, getCurrentTime } from '../utils/helpers';

export default function AddFeedingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    time: getCurrentTime(),
    description: '',
    categories: [],
    amount: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      alert('יש להזין תיאור של האוכל');
      return;
    }
    
    try {
      setLoading(true);
      await feedingsApi.create(formData);
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
        title="הוספת האכלה" 
        subtitle="רשום מה התינוקת אכלה"
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

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              מה אכלה? *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="לדוגמה: כריך עם חביתה"
              className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300"
              autoFocus
            />
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              קטגוריות (ניתן לבחור מספר)
            </label>
            <CategoryPicker
              selected={formData.categories}
              onChange={(categories) => setFormData({ ...formData, categories })}
            />
          </div>

          {/* Amount & Notes */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כמות (אופציונלי)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="לדוגמה: חצי כריך, 100 גרם"
                  className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הערות (אופציונלי)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="הערות נוספות..."
                  rows={2}
                  className="w-full px-4 py-3 bg-baby-50 rounded-xl border border-baby-100 focus:ring-2 focus:ring-sage-300 focus:border-sage-300 resize-none"
                />
              </div>
            </div>
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
              className="flex-[2] py-4 px-6 bg-sage-500 text-white rounded-xl font-medium hover:bg-sage-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-sage-200"
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
