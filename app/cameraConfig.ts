// /app/lib/cameraSettings.ts

export interface CameraSettings {
  defaultFacingMode: "user" | "environment";
  defaultMirror: boolean;
  defaultMuted: boolean;
  allowAudio: boolean;
  hiddenPreview: boolean;
  previewSizePercentage: number;
}

const defaultSettings: CameraSettings = {
  defaultFacingMode: "user",
  defaultMirror: false,
  defaultMuted: true,
  allowAudio: true,
  hiddenPreview: false,
  previewSizePercentage: 50,
};

const STORAGE_KEY = "camera_settings";

export function getCameraSettings(): CameraSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export function saveCameraSettings(settings: Partial<CameraSettings>) {
  if (typeof window === "undefined") return;
  try {
    const current = getCameraSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save camera settings", e);
  }
}