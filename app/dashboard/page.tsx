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
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
        <div className="p-4">
          <motion.img
            src={playlist.snippet.thumbnails?.default?.url || ""}
            alt={playlist.snippet.title || ""}
            className="w-full h-48 object-cover rounded-md mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <h2 className="text-xl font-semibold mb-2 line-clamp-1">
            {playlist.snippet.title}
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {playlist.snippet.description}
          </p>
          <Link href={`/dashboard/${playlist.id}`}>
            <Button className="w-full" variant="default">
              View Videos
            </Button>
          </Link>
        </div>
      </Card>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-16 min-h-screen bg-background p-8 mt-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-8"
        >
          Your YouTube Playlists
        </motion.h1>

        {playlists.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-muted-foreground"
          >
            No playlists found for this account.
          </motion.p>
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
    </>
  );
}