export interface SubscriberRecord {
  id: string;
  email: string;
  created_at: string;
  status: string;
}

export interface RealVisitRecord {
  id: string;
  visitorId: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  totalSubscribers: number;
  conversionRate: number;
  chartData: { date: string; fullDate: string; visits: number; uniques: number }[];
  subscribers: SubscriberRecord[];
}

const STORAGE_KEY_REAL_VISITS = 'paralife_real_visits_v1';
const STORAGE_KEY_VISITOR_ID = 'paralife_anon_visitor_uuid';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Get or create anonymous visitor ID (persists per browser)
 */
export const getVisitorId = (): string => {
  let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
  }
  return id;
};

/**
 * Record a real visit on site load
 */
export const trackPageView = async (): Promise<void> => {
  try {
    const visitorId = getVisitorId();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const newVisit: RealVisitRecord = {
      id: 'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      visitorId,
      timestamp: Date.now(),
      date: dateStr,
    };

    // 1. Save to Local Storage real visits log
    const raw = localStorage.getItem(STORAGE_KEY_REAL_VISITS);
    const list: RealVisitRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(newVisit);
    
    // Keep max 2000 real records
    if (list.length > 2000) list.length = 2000;
    localStorage.setItem(STORAGE_KEY_REAL_VISITS, JSON.stringify(list));

    // 2. Try pushing to Supabase page_views if table exists
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const baseUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
      fetch(`${baseUrl}/rest/v1/page_views`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          created_at: now.toISOString(),
        }),
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[Analytics Error]:', err);
  }
};

/**
 * Fetch 100% real analytics data from Supabase and live visit storage
 */
export const getAnalyticsSummary = async (daysRange = 14): Promise<AnalyticsSummary> => {
  // 1. Fetch real subscribers from Supabase
  let subscribers: SubscriberRecord[] = [];
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const baseUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
      const response = await fetch(
        `${baseUrl}/rest/v1/subscribers?select=id,email,created_at,status&order=created_at.desc`,
        {
          method: 'GET',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (response.ok) {
        subscribers = await response.json();
      }
    } catch (e) {
      console.warn('[Fetch Subscribers Warn]:', e);
    }
  }

  // 2. Read real visits
  const raw = localStorage.getItem(STORAGE_KEY_REAL_VISITS);
  const realVisits: RealVisitRecord[] = raw ? JSON.parse(raw) : [];

  // Ensure at least the current session is recorded
  if (realVisits.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    realVisits.push({
      id: 'v_init',
      visitorId: getVisitorId(),
      timestamp: Date.now(),
      date: today,
    });
    localStorage.setItem(STORAGE_KEY_REAL_VISITS, JSON.stringify(realVisits));
  }

  // 3. Build real day-by-day chart data
  const chartData: { date: string; fullDate: string; visits: number; uniques: number }[] = [];
  const now = new Date();

  // Create date buckets for the selected range
  for (let i = daysRange - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const dateLabel = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const fullDateLabel = d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const dayVisits = realVisits.filter((v) => v.date === dateKey);
    const dayUniques = new Set(dayVisits.map((v) => v.visitorId)).size;

    chartData.push({
      date: dateLabel,
      fullDate: fullDateLabel,
      visits: dayVisits.length,
      uniques: dayUniques,
    });
  }

  // 4. Calculate real total metrics
  const totalVisits = realVisits.length;
  const uniqueVisitors = new Set(realVisits.map((v) => v.visitorId)).size;
  
  const todayKey = now.toISOString().split('T')[0];
  const todayVisits = realVisits.filter((v) => v.date === todayKey).length;

  const totalSubscribers = subscribers.length;
  const conversionRate =
    uniqueVisitors > 0
      ? Number(((totalSubscribers / uniqueVisitors) * 100).toFixed(1))
      : 0;

  return {
    totalVisits,
    uniqueVisitors,
    todayVisits,
    totalSubscribers,
    conversionRate,
    chartData,
    subscribers,
  };
};
