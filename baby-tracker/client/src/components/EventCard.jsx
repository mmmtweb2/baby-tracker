import React from 'react';
import { Utensils, AlertCircle, Trash2 } from 'lucide-react';
import { getCategoryInfo, getSeverityInfo, getRelativeTime } from '../utils/helpers';

export default function EventCard({ event, onDelete }) {
  const isFeeding = event.type === 'feeding';
  
  return (
    <div className="card-hover bg-white rounded-2xl p-4 shadow-sm border border-baby-100">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${isFeeding ? 'bg-sage-100 text-sage-600' : 'bg-red-100 text-red-500'}
        `}>
          {isFeeding ? <Utensils className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-800">
                {isFeeding ? event.data.description : 'הקאה'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {getRelativeTime(event.date, event.time)} • {event.time}
              </p>
            </div>
            
            {onDelete && (
              <button
                onClick={() => onDelete(event)}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Categories or Severity */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {isFeeding ? (
              event.data.categories?.map(catId => {
                const cat = getCategoryInfo(catId);
                return (
                  <span
                    key={catId}
                    className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}
                  >
                    {cat.emoji} {cat.label}
                  </span>
                );
              })
            ) : (
              <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityInfo(event.data.severity).color}`}>
                {getSeverityInfo(event.data.severity).emoji} {getSeverityInfo(event.data.severity).label}
              </span>
            )}
          </div>
          
          {/* Notes */}
          {((isFeeding && event.data.amount) || event.data.notes) && (
            <p className="text-xs text-gray-500 mt-2">
              {isFeeding && event.data.amount && `כמות: ${event.data.amount}`}
              {event.data.notes && ` • ${event.data.notes}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
