// Category definitions
export const CATEGORIES = [
  { id: 'protein', label: 'חלבון', color: 'bg-red-100 text-red-700 border-red-200', emoji: '🥩' },
  { id: 'carbs', label: 'פחממות', color: 'bg-amber-100 text-amber-700 border-amber-200', emoji: '🍞' },
  { id: 'vegetables', label: 'ירקות', color: 'bg-green-100 text-green-700 border-green-200', emoji: '🥬' },
  { id: 'fruits', label: 'פירות', color: 'bg-pink-100 text-pink-700 border-pink-200', emoji: '🍎' },
  { id: 'dairy', label: 'חלבי', color: 'bg-blue-100 text-blue-700 border-blue-200', emoji: '🥛' },
  { id: 'formula', label: 'תמ"ל', color: 'bg-purple-100 text-purple-700 border-purple-200', emoji: '🍼' },
  { id: 'fats', label: 'שומנים', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', emoji: '🥑' },
  { id: 'other', label: 'אחר', color: 'bg-gray-100 text-gray-700 border-gray-200', emoji: '🍽️' },
];

export const getCategoryInfo = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};

// Severity definitions
export const SEVERITIES = [
  { id: 'mild', label: 'קל', color: 'bg-green-100 text-green-700', emoji: '😊' },
  { id: 'moderate', label: 'בינוני', color: 'bg-yellow-100 text-yellow-700', emoji: '😐' },
  { id: 'severe', label: 'חמור', color: 'bg-red-100 text-red-700', emoji: '😣' },
];

export const getSeverityInfo = (severityId) => {
  return SEVERITIES.find(s => s.id === severityId) || SEVERITIES[1];
};

// Date formatting
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('he-IL', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  return time;
};

export const formatDateTime = (date, time) => {
  const d = new Date(date);
  return `${formatShortDate(d)} ${time}`;
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Get current time in HH:MM format
export const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

// Get relative time (e.g., "לפני שעה")
export const getRelativeTime = (date, time) => {
  const eventDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  eventDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const diffMs = now - eventDate;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  return formatShortDate(date);
};

// Hebrew category label
export const getCategoryLabel = (categoryId) => {
  const labels = {
    protein: 'חלבון',
    carbs: 'פחממות',
    vegetables: 'ירקות',
    fruits: 'פירות',
    dairy: 'חלבי',
    fats: 'שומנים',
    other: 'אחר',
  };
  return labels[categoryId] || categoryId;
};
