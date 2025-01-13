// app/api/channel-playlists/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!channelId || !apiKey) {
    return NextResponse.json(
      { error: "Channel ID and API key are required." },
      { status: 400 }
    );
  }

  try {
    // Fetching the playlists for the given channelId
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&key=${apiKey}`
    );

    // Check if the response is ok
    if (!response.ok) {
      const errorDetails = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch playlists", details: errorDetails },
        { status: response.status }
      );
    }

    // Parse the successful response
    const data = await response.json();
    if (data.items.length === 0) {
      return NextResponse.json({ message: "No playlists found." });
    }

    return NextResponse.json(data);
  } catch (error) {
    // Catch and handle network errors or unexpected issues
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching playlists.", details: error },
      { status: 500 }
    );
  }
}
