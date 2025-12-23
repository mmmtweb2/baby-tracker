import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Clock, PieChart as PieIcon, AlertTriangle, Calendar } from 'lucide-react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyticsApi } from '../services/api';
import { getCategoryLabel } from '../utils/helpers';

const COLORS = ['#627462', '#d08460', '#7d8f7d', '#c06d4a', '#a3b1a3', '#a05a3e', '#c6cfc6'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [data, setData] = useState({
    categoryCorrelation: [],
    timeAnalysis: null,
    hourlyPattern: [],
    foodAnalysis: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoryCorrelation, timeAnalysis, hourlyPattern, foodAnalysis] = await Promise.all([
        analyticsApi.getCategoryCorrelation(days),
        analyticsApi.getTimeAnalysis(days),
        analyticsApi.getHourlyPattern(days),
        analyticsApi.getFoodAnalysis(days),
      ]);
      
      setData({
        categoryCorrelation,
        timeAnalysis,
        hourlyPattern,
        foodAnalysis,
      });
    } catch (err) {
      setError('לא ניתן לטעון את הנתונים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <Header title="ניתוח נתונים" subtitle="מחפש דפוסים..." />
        <LoadingSpinner className="py-20" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-24">
        <Header title="ניתוח נתונים" />
        <main className="max-w-lg mx-auto px-4">
          <div className="bg-red-50 rounded-2xl p-6 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <button onClick={loadAnalytics} className="text-sm text-red-700 underline">
              נסה שוב
            </button>
          </div>
        </main>
      </div>
    );
  }

  const hasData = data.categoryCorrelation.length > 0 || data.timeAnalysis?.totalVomitsAnalyzed > 0;

  return (
    <div className="min-h-screen pb-24">
      <Header 
        title="ניתוח נתונים" 
        subtitle="זיהוי דפוסים והקשרים"
      />
      
      <main className="max-w-lg mx-auto px-4 space-y-6">
        {/* Time Range Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-sage-600" />
            <span className="text-sm font-medium text-gray-700">טווח זמן</span>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  days === d
                    ? 'bg-sage-500 text-white'
                    : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                }`}
              >
                {d} ימים
              </button>
            ))}
          </div>
        </div>

        {!hasData ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-baby-100">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              אין מספיק נתונים לניתוח.
              <br />
              הוסיפו עוד רשומות כדי לראות דפוסים.
            </p>
          </div>
        ) : (
          <>
            {/* Category Correlation */}
            {data.categoryCorrelation.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
                <div className="flex items-center gap-2 mb-4">
                  <PieIcon className="w-5 h-5 text-sage-600" />
                  <h2 className="font-bold text-gray-800">קורלציה לפי קטגוריות</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  אחוז ההאכלות מכל קטגוריה שקרו עד 4 שעות לפני הקאה
                </p>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data.categoryCorrelation.map(d => ({
                        ...d,
                        name: getCategoryLabel(d.category),
                      }))}
                      layout="vertical"
                    >
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis type="category" dataKey="name" width={60} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'קורלציה']}
                        contentStyle={{ direction: 'rtl' }}
                      />
                      <Bar dataKey="correlationPercent" fill="#627462" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* High correlation warning */}
                {data.categoryCorrelation.some(c => c.correlationPercent > 50) && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl flex gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      קטגוריות עם קורלציה גבוהה (מעל 50%) עשויות להיות בעייתיות.
                      שקלו להפחית או לעקוב מקרוב.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Time Analysis */}
            {data.timeAnalysis && data.timeAnalysis.totalVomitsAnalyzed > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-sage-600" />
                  <h2 className="font-bold text-gray-800">ניתוח זמנים</h2>
                </div>
                
                <div className="bg-sage-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-sm text-sage-600">זמן ממוצע מאכילה להקאה</p>
                  <p className="text-3xl font-bold text-sage-700 mt-1">
                    {data.timeAnalysis.averageGapMinutes < 60 
                      ? `${data.timeAnalysis.averageGapMinutes} דקות`
                      : `${Math.round(data.timeAnalysis.averageGapMinutes / 60 * 10) / 10} שעות`
                    }
                  </p>
                  <p className="text-xs text-sage-500 mt-1">
                    מבוסס על {data.timeAnalysis.totalVomitsAnalyzed} הקאות
                  </p>
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.timeAnalysis.timeRangeDistribution}>
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#d08460" radius={[4, 4, 0, 0]} name="מספר הקאות" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Hourly Pattern */}
            {data.hourlyPattern.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-sage-600" />
                  <h2 className="font-bold text-gray-800">דפוס שעתי</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  פיזור האכלות והקאות לפי שעות היום
                </p>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.hourlyPattern}>
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(h) => `${h}:00`}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(h) => `שעה ${h}:00`}
                        contentStyle={{ direction: 'rtl' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="feedings" 
                        stroke="#627462" 
                        strokeWidth={2}
                        name="האכלות"
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vomits" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        name="הקאות"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Food Analysis */}
            {data.foodAnalysis.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="font-bold text-gray-800">מאכלים חשודים</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  מאכלים ספציפיים שמופיעים לעתים קרובות לפני הקאות
                </p>

                <div className="space-y-2">
                  {data.foodAnalysis.slice(0, 5).map((food, index) => (
                    <div 
                      key={food.food}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        food.correlationPercent > 50 ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{food.food}</p>
                        <p className="text-xs text-gray-500">
                          {food.beforeVomit} מתוך {food.totalOccurrences} פעמים
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${
                        food.correlationPercent > 50 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {food.correlationPercent}%
                      </span>
                    </div>
                  ))}
                </div>

                {data.foodAnalysis.length === 0 && (
                  <p className="text-center text-gray-400 py-4">
                    צריך יותר נתונים לזיהוי מאכלים ספציפיים
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
