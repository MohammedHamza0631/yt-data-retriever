"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchAllPlaylistItems } from "@/lib/youtube";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

function VideoCard({ video, index }: { video: any; index: number }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.8
    });

    return (
        <motion.div
            ref={ref}
            variants={item}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="p-4">
                <motion.img
                    src={video.snippet.thumbnails?.default?.url || ""}
                    alt={video.snippet.title || ""}
                    className="w-full h-32 object-cover rounded-md mb-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <h3 className="font-medium line-clamp-2 mb-2">{video.snippet.title}</h3>
                <Button
                    className="w-full"
                    onClick={() =>
                        window.open(
                            `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
                            "_blank"
                        )
                    }
                >
                    Watch Video
                </Button>
            </div>
        </motion.div>
    );
}

export default function PlaylistPage({ params }: { params: { playlistId: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.accessToken) {
            router.push("/");
            return;
        }

        async function loadVideos() {
            try {
                if (session?.accessToken) {
                    const fetchedVideos = await fetchAllPlaylistItems(session.accessToken, params.playlistId);
                    setVideos(fetchedVideos);
                }
            } catch (error) {
                console.error("Error fetching playlist videos:", error);
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, [session, params.playlistId, router]);

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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-16 p-8"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl font-bold mb-6"
                >
                    Playlist Videos
                </motion.h1>

                <AnimatePresence>
                    {videos.length === 0 ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-muted-foreground"
                        >
                            No videos found for this playlist.
                        </motion.p>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {videos.map((video, index) => (
                                <VideoCard key={video.snippet.resourceId.videoId} video={video} index={index} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}