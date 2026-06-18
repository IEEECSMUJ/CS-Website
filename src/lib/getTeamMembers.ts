import { unstable_cache } from 'next/cache';
import sql from './db';
import type { TeamMember } from '@/data/teamData';

function toMember(r: Record<string, unknown>): TeamMember {
  return {
    name:      String(r.name      ?? ''),
    role:      String(r.role      ?? ''),
    image:     String(r.image_url ?? ''),
    linkedin:  r.linkedin_url  ? String(r.linkedin_url)  : undefined,
    github:    r.github_url    ? String(r.github_url)    : undefined,
    instagram: r.instagram_url ? String(r.instagram_url) : undefined,
  };
}

export const getTeamMembers = unstable_cache(
  async () => {
    const rows = await sql`
      SELECT name, role, image_url, "group", linkedin_url, github_url, instagram_url
      FROM team_members
      WHERE is_active = true
      ORDER BY 
        CASE "group" WHEN 'ec' THEN 1 WHEN 'web' THEN 2 WHEN 'core' THEN 3 ELSE 4 END,
        display_order ASC,
        name ASC
    ` as unknown as Record<string, unknown>[];

    return {
      ec:   rows.filter(r => r.group === 'ec').map(toMember),
      web:  rows.filter(r => r.group === 'web').map(toMember),
      core: rows.filter(r => r.group === 'core').map(toMember),
    };
  },
  ['team-members'],
  { revalidate: 3600 } // Revalidate every hour, or manually via webhook
);
