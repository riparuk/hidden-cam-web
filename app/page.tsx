"use client"

import { useEffect, useRef, useState } from "react";
import AppBar from "./components/appBar";
import DopamineVideo from "./components/dopamineVideo";
import { saveRecording } from "./storageUtils";

export default function Home() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
  
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };
  
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      saveRecording(blob);
    };
  
    recorder.start();
  };
  
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };
  // Camera states
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [isCameraOn, setIsCameraOn] = useState(false);
  // Camera device selection
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function startCamera(
    facingMode: "user" | "environment" = "user",
    deviceId?: string
  ) {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      console.warn("Browser not ready or not support getUserMedia.");
      return;
    }
  
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode },
        audio: true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setIsCameraOn(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraOn(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  useEffect(() => {
    // Load available video devices
    async function loadDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videos = devices.filter((d) => d.kind === "videoinput");
        setVideoDevices(videos);
      } catch (e) {
        setVideoDevices([]);
      }
    }
    if (hasMounted) {
      loadDevices();
      startCamera(cameraFacingMode);
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted]);

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera(cameraFacingMode, selectedDeviceId ?? undefined);
    }
    // setIsCameraOn((prev) => !prev);
  };

  const switchCamera = () => {
    const newMode = cameraFacingMode === "user" ? "environment" : "user";
    stopCamera();
    startCamera(newMode, selectedDeviceId ?? undefined);
    setCameraFacingMode(newMode);
  };

  // Handler for dropdown camera device selection
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    stopCamera();
    startCamera(cameraFacingMode, deviceId || undefined);
  };

  if (!hasMounted) return null;

  return (
    <div>
      <AppBar videoRef={videoRef} isCameraOn={isCameraOn} toggleCamera={toggleCamera} switchCamera={switchCamera} />
      <DopamineVideo startRecording={startRecording} stopRecording={stopRecording} isCameraOn={isCameraOn} />
      <div className="flex flex-col items-center gap-6 p-6">
        {/* Dropdown for camera selection */}
        {videoDevices.length >= 0 && (
          <select
            className="border px-2 py-1 rounded"
            value={selectedDeviceId ?? ""}
            onChange={handleDeviceChange}
          >
            <option value="">Default Camera</option>
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
