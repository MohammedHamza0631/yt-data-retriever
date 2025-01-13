"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

function PlaylistCard({ playlist, index }: { playlist: any; index: number }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
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
                        {playlist.snippet.description || "No description available"}
                    </p>
                    <Link href={`/channel/playlist/${playlist.id}`}>
                        <Button className="w-full" variant="default">
                            View Videos
                        </Button>
                    </Link>
                </div>
            </Card>
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
