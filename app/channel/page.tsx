"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Youtube, PlayCircle } from "lucide-react";
import { CardBorder } from "@/components/CardBorder";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

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
  
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function PlaylistCard({ playlist, index }: { playlist: Playlist; index: number }) {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1
    });
  
    return (
      <motion.div
        ref={ref}
        variants={item}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <CardBorder className="group overflow-hidden hover:shadow-xl transition-all duration-300 dark:bg-gray-800/50 border border-red-100 dark:border-red-900/20 backdrop-blur-sm rounded-lg">
          <div className="p-4">
            <div className="relative overflow-hidden rounded-md">
              <motion.img
                src={playlist.snippet.thumbnails?.default?.url || ""}
                alt={playlist.snippet.title || ""}
                className="w-full h-48 object-cover rounded-md mb-4 transform transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <PlayCircle className="absolute bottom-6 right-6 w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2 line-clamp-1 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              {playlist.snippet.title}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {playlist.snippet.description || "No description available"}
            </p>
            <Link href={`/dashboard/${playlist.id}`}>
              <Button className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 dark:from-red-500 dark:to-rose-400 text-white shadow-lg group">
                <Youtube className="mr-2 h-4 w-4" />
                View Videos
              </Button>
            </Link>
          </div>
        </CardBorder>
      </motion.div>
    );
  }

export default function ChannelSearchPage() {
    const [channelId, setChannelId] = useState("");
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null); // Reset error on new search
        try {
            const response = await fetch(
                `/api/channel-playlists?channelId=${channelId}`
            );
            const data = await response.json();

            if (response.ok) {
                setPlaylists(data.items || []);
            } else {
                setError(data.error || "An unknown error occurred");
            }
        } catch (error) {
            setError("Failed to fetch playlists due to a network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="mt-16 p-8 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Search YouTube Channel</h1>
                <input
                    type="text"
                    placeholder="Enter Channel ID"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className="border p-2 rounded-md w-full mb-4"
                />
                <Button onClick={handleSearch} disabled={!channelId || loading}>
                    Search
                </Button>

                {loading && (
                    <div className="mt-4">
                        <LoadingSpinner />
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-red-500">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && playlists.length === 0 && !error && (
                    <div className="mt-4 text-center text-muted-foreground">
                        No public playlists found for this channel.
                    </div>
                )}

                {playlists.length > 0 && (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                    >
                        {playlists.map((playlist, index) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
}
