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
import { Youtube, PlayCircle } from "lucide-react";
import { CardBorder } from "@/components/CardBorder";

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
        threshold: 0.1
    });

    return (
        <motion.div
            ref={ref}
            variants={item}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            transition={{ duration: 0.2, delay: index * 0.05 }}
        >
            <CardBorder className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="p-4">
                    <div className="relative overflow-hidden rounded-md">
                        <motion.img
                            src={video.snippet.thumbnails?.default?.url || ""}
                            alt={video.snippet.title || ""}
                            className="w-full h-32 object-cover rounded-md mb-2 transform transition-transform duration-300"
                            whileHover={{ scale: 1.05 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <PlayCircle className="absolute bottom-4 right-4 w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {video.snippet.title}
                    </h3>
                    <Button
                        className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 dark:from-red-500 dark:to-rose-400 text-white shadow-lg group"
                        onClick={() =>
                            window.open(
                                `https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
                                "_blank"
                            )
                        }
                    >
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch Video
                    </Button>
                </div>
            </CardBorder>
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
            <div className="mt-8 min-h-screen bg-gradient-to-b from-background to-background/95">
                {/* Background Gradient Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/5 dark:bg-red-500/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-rose-200/10 dark:bg-rose-500/5 blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative pt-16 p-8 mt-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-7xl mx-auto"
                    >
                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
                            Playlist Videos
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            Browse and watch videos from your playlist
                        </p>

                        <AnimatePresence>
                            {videos.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center p-12 rounded-lg border border-red-100 dark:border-red-900/20 backdrop-blur-sm"
                                >
                                    <Youtube className="w-16 h-16 mx-auto mb-4 text-red-500/50" />
                                    <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                                        No Videos Found
                                    </p>
                                    <p className="text-muted-foreground">
                                        This playlist is empty
                                    </p>
                                </motion.div>
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
                </motion.div>
            </div>
        </>
    );
}