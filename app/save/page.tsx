"use client"

import { getAllRecordings, deleteRecording } from "../storageUtils";
import { useEffect, useState } from "react";

export default function Save() {
    const [recordings, setRecordings] = useState<{ blob: Blob; timestamp: number; id: number }[]>([]);
    useEffect(() => {
        getAllRecordings().then(setRecordings);
    }, []);
    return (
        <div>
            <h1>Rekaman Tersimpan</h1>
            {recordings.length === 0 ? (
                <p>Tidak ada rekaman tersimpan.</p>
            ) : (
                <ul>
                    {recordings.map((rec, idx) => (
                        <li key={idx}>
                            <video src={URL.createObjectURL(rec.blob)} controls className="w-full max-w-md rounded border" />
                            <p className="text-sm text-muted-foreground">
                                Rekaman ke-{idx + 1} • {new Date(rec.timestamp).toLocaleString()}
                            </p>
                            <button onClick={() => deleteRecording(rec.id)}>Hapus</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
