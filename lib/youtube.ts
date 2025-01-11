export async function fetchPlaylists(accessToken: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { items: [] }; // Handle no playlists gracefully
    }
    throw new Error(`Error fetching playlists: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllPlaylistItems(accessToken: string, playlistId: string) {
  let videos: any[] = [];
  let nextPageToken = "";

  do {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${nextPageToken}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching playlist items: ${response.statusText}`);
    }

    const data = await response.json();
    videos = videos.concat(data.items || []);
    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return videos;
}
