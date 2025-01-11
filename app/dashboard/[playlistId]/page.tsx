"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchAllPlaylistItems } from "@/lib/youtube";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function PlaylistPage({ params }: { params: { playlistId: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.accessToken) {
            router.push("/"); // Redirect to home if not logged in
            return;
        }

        async function loadVideos() {
            try {
                if (session?.accessToken) {
                    const fetchedVideos = await fetchAllPlaylistItems(session.accessToken, params.playlistId);
                    setVideos(fetchedVideos);
                } else {
                    console.error("Session or access token is null");
                }
                //setVideos(fetchedVideos);
            } catch (error) {
                console.error("Error fetching playlist videos:", error);
            } finally {
                setLoading(false);
            }
        }

        loadVideos();
    }, [session, params.playlistId, router]);

    if (loading) {
        return <p className="text-center mt-16">Loading videos...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="pt-16 p-8">
                <h1 className="text-2xl font-bold mb-6">Playlist Videos</h1>
                {videos.length === 0 ? (
                    <p className="text-center">No videos found for this playlist.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <div key={video.snippet.resourceId.videoId} className="overflow-hidden">
                                <div className="p-4">
                                    <img
                                        src={video.snippet.thumbnails?.default?.url || ""}
                                        alt={video.snippet.title || ""}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                    <h3 className="font-medium">{video.snippet.title}</h3>
                                    <Button
                                        className="w-full mt-2"
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
