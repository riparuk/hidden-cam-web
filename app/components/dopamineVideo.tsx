"use client"

import { ArrowDownToLine, PlayCircle, StopCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { downloadAndStoreVideo, loadVideoFromIndexedDB } from "../storageUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DopamineVideo({ startRecording, stopRecording, isCameraOn }: { startRecording: () => void; stopRecording: () => void; isCameraOn: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [videoSizeMB, setVideoSizeMB] = useState<number | null>(null);

    const handlePlay = () => {
        videoRef.current?.play();
        startRecording();
        setPlaying(true);
    };

    const handleStop = () => {
        videoRef.current?.pause();
        stopRecording();
        setPlaying(false);
    };

    useEffect(() => {
        loadVideoFromIndexedDB().then((url) => {
            if (url) {
                setVideoSrc(url);
            } else {
                fetch("/dopamine.mp4", { method: "HEAD" })
                    .then((res) => {
                        const size = res.headers.get("Content-Length");
                        if (size) setVideoSizeMB(Math.ceil(parseInt(size) / 1024 / 1024));
                    })
                    .catch(() => {});
            }
        });
    }, []);

    const handleDownload = async () => {
        setIsDownloading(true);
        await downloadAndStoreVideo();
        const url = await loadVideoFromIndexedDB();
        if (url) setVideoSrc(url);
        setIsDownloading(false);
    };

    useEffect(() => {
        if (!isCameraOn) {
            handleStop();
        }
    }, [isCameraOn]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {videoSrc && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    playsInline
                    muted
                    preload="auto"
                    className="w-full h-full"
                />
            )}
            {!videoSrc && (
                <Card className="w-full text-center !rounded-none w-100 m-6">
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-2xl">
                            Dopamine Not Available
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground lg:text-xl">
                            You need to download the video first (works offline after). 
                        </p>
                        <div className="lg:text-xl flex flex-col items-center gap-2 text-sm text-muted-foreground bg-black/5 p-2 rounded border border-gray-200 lg:w-[300px] mx-auto ">
                            <div className="flex items-center gap-2">
                                <PlayCircle className="w-4 h-4" />
                                Play = Start recording. 
                            </div>
                            <div className="flex items-center gap-2">
                                <StopCircle className="w-4 h-4" />
                                Pause = Stop recording.
                            </div>
                        </div>
                        {videoSizeMB && (
                            <p className="text-xs text-muted-foreground lg:text-xl">Video size: {videoSizeMB} MB</p>
                        )}
                        <Button className="lg:text-xl" onClick={handleDownload} disabled={isDownloading}>
                            {isDownloading ? "Downloading..." : "Download Video"}
                        </Button>
                    </CardContent>
                </Card>
            )}
            {videoSrc && !playing ? (
                <button
                    onClick={handlePlay}
                    className={cn("absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg gap-2", !isCameraOn && "opacity-50")}
                    disabled={!isCameraOn}
                >
                    <PlayCircle className={cn("w-10 h-10", !isCameraOn && "text-gray-400")} />
                    {isCameraOn ? "Play" : "Camera Off"}
                </button>
            ) : (
                videoSrc && (
                    <button
                        onClick={handleStop}
                        className="absolute inset-0 flex items-center justify-center text-white text-lg opacity-20"
                    >
                        <StopCircle className="w-10 h-10" />
                        {isCameraOn ? "" : "Camera Off"}
                    </button>
                )
            )}
        </div>
    );
}