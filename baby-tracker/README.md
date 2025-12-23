# 👶 מעקב תזונת תינוק

אפליקציה למעקב אחרי תזונת תינוק ואירועי הקאות, כולל ניתוח דפוסים וקורלציות.

## ✨ תכונות

- ➕ רישום האכלות עם תיאור, קטגוריות ושעה
- 🤮 רישום הקאות עם דירוג חומרה
- 📊 ניתוח קורלציות בין סוגי מזון להקאות
- ⏱️ ניתוח זמנים - כמה זמן מאכילה להקאה
- 📈 גרפים של דפוסים שעתיים
- 🚨 זיהוי מאכלים "חשודים"
- 📱 רספונסיבי לחלוטין - עובד מעולה במובייל
- ☁️ סנכרון בין מכשירים דרך MongoDB

## 🚀 התקנה

### 1. הגדרת השרת

```bash
cd server
npm install
```

צור קובץ `.env` (העתק מ-`.env.example`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/baby-tracker?retryWrites=true&w=majority
PORT=5002
CLIENT_URL=http://localhost:5173
```

הפעל את השרת:

```bash
npm run dev
```

### 2. הגדרת הקליינט

```bash
cd client
npm install
npm run dev
```

האפליקציה תרוץ ב: http://localhost:5173

## 🏗️ מבנה הפרויקט

```
baby-tracker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # קומפוננטות משותפות
│   │   ├── pages/          # דפי האפליקציה
│   │   ├── services/       # API calls
│   │   └── utils/          # פונקציות עזר
│   └── ...
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── index.js            # Entry point
└── README.md
```

## 📊 האלגוריתמים

### קורלציה לפי קטגוריות
מחשב כמה אחוז מההאכלות בכל קטגוריה (חלבון, פחממות, וכו') התרחשו עד 4 שעות לפני הקאה.

### ניתוח זמנים
מחשב את הזמן הממוצע מאכילה להקאה, ומציג התפלגות לפי טווחי זמן.

### דפוס שעתי
מראה באיזה שעות ביום יש יותר האכלות והקאות.

### מאכלים חשודים
מזהה מאכלים ספציפיים (לפי תיאור) שמופיעים לעתים קרובות לפני הקאות.

## 🛠️ טכנולוגיות

- **Frontend**: React, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas

## 📝 API Endpoints

### האכלות
- `GET /api/feedings` - כל ההאכלות
- `POST /api/feedings` - הוספת האכלה
- `PUT /api/feedings/:id` - עדכון
- `DELETE /api/feedings/:id` - מחיקה

### הקאות
- `GET /api/vomits` - כל ההקאות
- `POST /api/vomits` - הוספת הקאה
- `PUT /api/vomits/:id` - עדכון
- `DELETE /api/vomits/:id` - מחיקה

### אנליטיקס
- `GET /api/analytics/category-correlation` - קורלציה לפי קטגוריות
- `GET /api/analytics/time-analysis` - ניתוח זמנים
- `GET /api/analytics/hourly-pattern` - דפוס שעתי
- `GET /api/analytics/food-analysis` - ניתוח מאכלים ספציפיים

## 📄 רישיון

MIT
