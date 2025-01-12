"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchPlaylists } from "@/lib/youtube";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Youtube, PlayCircle } from "lucide-react";
import { CardBorder } from "@/components/CardBorder";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
          transition={{ duration: 0.4, delay: index * 0.1 }}
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
                      {playlist.snippet.description}
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

export default function Dashboard() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/5 dark:bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-200/10 dark:bg-rose-500/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative pt-16 min-h-screen p-8 mt-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              Your YouTube Playlists
            </h1>
            <p className="text-muted-foreground mb-8">
              View all your YouTube playlists in one place
            </p>

            {playlists.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-12 rounded-lg border border-red-100 dark:border-red-900/20 backdrop-blur-sm"
              >
                <Youtube className="w-16 h-16 mx-auto mb-4 text-red-500/50" />
                <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                  No Playlists Found
                </p>
                <p className="text-muted-foreground">
                  Start creating playlists on YouTube to see them here
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {playlists.map((playlist, index) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}