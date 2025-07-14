"use client"

import { useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

export default function DopamineVideo2({ startRecording, stopRecording, isCameraOn }: { startRecording: () => void; stopRecording: () => void; isCameraOn: boolean }) {
    const [playing, setPlaying] = useState(false);

    const handleStateChange = (event: YouTubeEvent) => {
        if (event.data === 1) {
            startRecording();
            setPlaying(true);
        } else if (event.data === 2 || event.data === 0) {
            stopRecording();
            setPlaying(false);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            <div className="w-full aspect-video">
                <YouTube
                    videoId="WWQg30Zf--A"
                    onStateChange={handleStateChange}
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                            rel: 0,
                            modestbranding: 1,
                            playsinline: 1,
                            controls: 1,
                        },
                    }}
                    className="w-full h-full"
                />
            </div>
            {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg">
                    <span className="text-white bg-black px-4 py-2 rounded">Camera is off</span>
                </div>
            )}
        </div>
    );
}