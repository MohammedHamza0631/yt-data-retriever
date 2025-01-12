"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PlayCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-2xl">
        <div className="flex justify-center">
          <Image src="/logo.png" width={100} height={100} alt="Logo" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          YouTube Playlist Retriever
        </h1>
        <p className="text-gray-600 max-w-md">
          Access and manage your YouTube playlists with ease. Sign in with your
          Google account to get started.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/api/auth/signin/google">Sign in with Google</Link>
        </Button>
      </div>
    </div>
  );
}
