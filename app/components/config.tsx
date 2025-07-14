"use client"

import { getCameraSettings } from "../cameraConfig";
import { useEffect, useState } from "react";

export default function Config() {
    const [cameraSettings, setCameraSettings] = useState(getCameraSettings());
    useEffect(() => {
        const savedSettings = getCameraSettings();
        setCameraSettings(savedSettings);
    }, []);
    return (
        <div>
            <h1>Config</h1>
            <p>Default Facing Mode: {cameraSettings.defaultFacingMode}</p>
            <p>Default Mirror: {cameraSettings.defaultMirror}</p>
            <p>Default Muted: {cameraSettings.defaultMuted}</p>
            <p>Allow Audio: {cameraSettings.allowAudio}</p>
            <p>Hidden Preview: {cameraSettings.hiddenPreview}</p>
        </div>
    );
}