
export async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("videosDB", 2);
  
      request.onerror = () => reject(request.error);
  
      request.onupgradeneeded = () => {
        const db = request.result;
  
        if (!db.objectStoreNames.contains("recordings")) {
          db.createObjectStore("recordings", { keyPath: "id", autoIncrement: true });
        }
  
        if (!db.objectStoreNames.contains("dopamine")) {
          db.createObjectStore("dopamine", { keyPath: "id" });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
    });
  }

export async function saveRecording(blob: Blob) {
    const db = await openDB();
    const tx = db.transaction("recordings", "readwrite");
    const store = tx.objectStore("recordings");
    const record = {
        timestamp: Date.now(),
        blob,
    };
    const request = store.add(record);
    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getAllRecordings() {
    const db = await openDB();
    const tx = db.transaction("recordings", "readonly");
    const store = tx.objectStore("recordings");
    const request = store.getAll();
    return new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteRecording(id: number) {
    const db = await openDB();
    const tx = db.transaction("recordings", "readwrite");
    const store = tx.objectStore("recordings");
    const request = store.delete(id);
    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function clearRecordings() {
    const db = await openDB();
    const tx = db.transaction("recordings", "readwrite");
    const store = tx.objectStore("recordings");
    const request = store.clear();
    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function downloadAndStoreVideo() {
    const res = await fetch("/dopamine.mp4"); // atau remote URL
    const blob = await res.blob();
  
    const db = await openDB();
    const tx = db.transaction("dopamine", "readwrite");
    const store = tx.objectStore("dopamine");
    store.put({ id: "dopamine", blob });
}

export async function loadVideoFromIndexedDB() {
    const db = await openDB();
    const tx = db.transaction("dopamine", "readonly");
    const store = tx.objectStore("dopamine");
    const request = store.get("dopamine");
    return new Promise<string | null>((resolve, reject) => {
        request.onsuccess = () => {
            const record = request.result;
            if (record?.blob) {
                resolve(URL.createObjectURL(record.blob));
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject(request.error);
    });
}


