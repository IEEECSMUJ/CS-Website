import { unstable_cache } from 'next/cache';
import sql from './db';
import type { EventItem } from '@/data/eventsData';
import { eventsData } from '@/data/eventsData';

function toEvent(r: Record<string, any>): EventItem {
  const eventDate = new Date(r.event_date);
  const now = new Date();

  // Format date as e.g. "OCT 12, 2026"
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return {
    id: String(r.id),
    title: String(r.title ?? ''),
    description: String(r.description ?? ''),
    image: String(r.cover_image ?? ''),
    completed: eventDate < now,
    venue: 'Manipal University Jaipur', // default fallback
    date: formattedDate,
    registerUrl: `/events/${r.id}`, // link to dynamic page
    tag: String(r.tag ?? 'Workshop'),
  };
}

export const getEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    if (!process.env.DATABASE_URL) {
      console.warn("WARNING: DATABASE_URL is not set. Using local events data.");
      return eventsData;
    }

    try {
      const rows = await sql`
        SELECT id, title, description, cover_image, event_date, tag, status
        FROM events
        WHERE status = 'published'
        ORDER BY display_order ASC, event_date DESC
      ` as unknown as Record<string, any>[];

      return rows.map(toEvent);
    } catch (error) {
      console.error("Error fetching events from database, falling back to local data:", error);
      return eventsData;
    }
  },
  ['events-list'],
  { revalidate: 3600 } // Cache for 1 hour, revalidated manually
);

export async function getEventById(id: string): Promise<EventItem | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set. Trying to find event in local data.");
    return eventsData.find(e => e.id === id) || null;
  }

  try {
    const rows = await sql`
      SELECT id, title, description, cover_image, event_date, tag, status
      FROM events
      WHERE id = ${id}
      LIMIT 1
    ` as unknown as Record<string, any>[];

    if (rows.length === 0) return null;
    return toEvent(rows[0]);
  } catch (error) {
    console.error(`Error fetching event by id ${id} from database, falling back to local data:`, error);
    return eventsData.find(e => e.id === id) || null;
  }
}
