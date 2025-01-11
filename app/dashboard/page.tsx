"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchPlaylists, fetchAllPlaylistItems } from "@/lib/youtube";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, PlaySquare } from "lucide-react";

interface Playlist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

interface PlaylistItem {
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaylists() {
      if (session?.accessToken) {
        try {
          const data = await fetchPlaylists(session.accessToken);
          setPlaylists(data.items || []);
        } catch (error) {
          console.error("Error fetching playlists:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadPlaylists();
  }, [session]);

  async function handlePlaylistClick(playlistId: string) {
    if (session?.accessToken) {
      setSelectedPlaylist(playlistId);
      try {
        const items = await fetchAllPlaylistItems(session.accessToken, playlistId);
        setPlaylistItems(items || []);
      } catch (error) {
        console.error("Error fetching playlist items:", error);
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-background p-8">
        <h1 className="text-4xl font-bold mb-8">Your YouTube Playlists</h1>

        {playlists.length === 0 ? (
          <p className="text-center">No playlists found for this account.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="overflow-hidden">
                <div className="p-4">
                  <img
                    src={playlist.snippet.thumbnails?.default?.url || ""}
                    alt={playlist.snippet.title || ""}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-2">
                    {playlist.snippet.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {playlist.snippet.description}
                  </p>
                  <Link href={`/dashboard/${playlist.id}`}>
                    <Button className="w-full">View Videos</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
