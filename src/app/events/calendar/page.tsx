import { getEvents } from '@/lib/getEvents';
import CalendarClientPage from './CalendarClientPage';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const events = await getEvents();
  return <CalendarClientPage events={events} />;
}