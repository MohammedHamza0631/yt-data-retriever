// app/db/actions.ts
"use server";

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
export const sql = neon(process.env.DATABASE_URL);

// Fetch playlists for the logged-in user
export async function getUserPlaylists(ownerEmail: string) {
  return await sql`
    SELECT * FROM playlists WHERE owner_email = ${ownerEmail};
  `;
}

// Save playlists to the database
export async function savePlaylist({
  youtubePlaylistId,
  title,
  description,
  thumbnailUrl,
  ownerEmail,
}: {
  youtubePlaylistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  ownerEmail: string;
}) {
  await sql`
    INSERT INTO playlists (youtube_playlist_id, title, description, thumbnail_url, owner_email)
    VALUES (${youtubePlaylistId}, ${title}, ${description}, ${thumbnailUrl}, ${ownerEmail})
    ON CONFLICT (youtube_playlist_id) DO NOTHING;
  `;
}
