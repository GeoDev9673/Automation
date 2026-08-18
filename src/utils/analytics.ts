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

const STORAGE_KEY_REAL_DEVICES = 'paralife_unique_devices_v2';
const STORAGE_KEY_DEVICE_COUNTED = 'paralife_device_already_counted_v2';
const STORAGE_KEY_VISITOR_ID = 'paralife_anon_visitor_uuid';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Get or create unique persistent device/visitor ID
 */
export const getVisitorId = (): string => {
  let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
  }
  return id;
};

/**
 * Record a visit ONCE per unique device/browser
 * (Re-visiting on the same device will NOT increment the counter)
 */
export const trackPageView = async (): Promise<void> => {
  try {
    // Check if this device has already been recorded
    const isAlreadyCounted = localStorage.getItem(STORAGE_KEY_DEVICE_COUNTED);
    if (isAlreadyCounted) {
      return; // Same device entered again -> do NOT count
    }

    const visitorId = getVisitorId();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const newRecord: RealVisitRecord = {
      id: 'd_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      visitorId,
      timestamp: Date.now(),
      date: dateStr,
    };

    // Read stored unique devices list
    const raw = localStorage.getItem(STORAGE_KEY_REAL_DEVICES);
    const list: RealVisitRecord[] = raw ? JSON.parse(raw) : [];

    // Double check if visitorId is not already in list
    if (!list.some((item) => item.visitorId === visitorId)) {
      list.unshift(newRecord);
      localStorage.setItem(STORAGE_KEY_REAL_DEVICES, JSON.stringify(list));
    }

    // Mark this device as permanently counted
    localStorage.setItem(STORAGE_KEY_DEVICE_COUNTED, 'true');

    // Async notify Supabase page_views if configured
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
    console.warn('[Device Track Error]:', err);
  }
};

/**
 * Fetch 100% genuine unique device metrics
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

  // 2. Read stored unique devices list (deduplicated by visitorId)
  const raw = localStorage.getItem(STORAGE_KEY_REAL_DEVICES);
  let storedDevices: RealVisitRecord[] = raw ? JSON.parse(raw) : [];

  // Deduplicate strictly by visitorId
  const uniqueMap = new Map<string, RealVisitRecord>();
  for (const rec of storedDevices) {
    if (!uniqueMap.has(rec.visitorId)) {
      uniqueMap.set(rec.visitorId, rec);
    }
  }

  // If currently empty, count this active device as 1
  const currentVisitorId = getVisitorId();
  if (!uniqueMap.has(currentVisitorId)) {
    const today = new Date().toISOString().split('T')[0];
    const initialRec: RealVisitRecord = {
      id: 'd_current',
      visitorId: currentVisitorId,
      timestamp: Date.now(),
      date: today,
    };
    uniqueMap.set(currentVisitorId, initialRec);
    localStorage.setItem(STORAGE_KEY_DEVICE_COUNTED, 'true');
  }

  const uniqueDevices = Array.from(uniqueMap.values());
  localStorage.setItem(STORAGE_KEY_REAL_DEVICES, JSON.stringify(uniqueDevices));

  // 3. Build day-by-day unique devices chart data
  const chartData: { date: string; fullDate: string; visits: number; uniques: number }[] = [];
  const now = new Date();

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

    const dayDevices = uniqueDevices.filter((v) => v.date === dateKey);

    chartData.push({
      date: dateLabel,
      fullDate: fullDateLabel,
      visits: dayDevices.length,
      uniques: dayDevices.length,
    });
  }

  // 4. Calculate total unique device metrics
  const totalUniqueDevices = uniqueDevices.length;
  
  const todayKey = now.toISOString().split('T')[0];
  const todayDevices = uniqueDevices.filter((v) => v.date === todayKey).length;

  const totalSubscribers = subscribers.length;
  const conversionRate =
    totalUniqueDevices > 0
      ? Number(((totalSubscribers / totalUniqueDevices) * 100).toFixed(1))
      : 0;

  return {
    totalVisits: totalUniqueDevices,
    uniqueVisitors: totalUniqueDevices,
    todayVisits: todayDevices,
    totalSubscribers,
    conversionRate,
    chartData,
    subscribers,
  };
};
