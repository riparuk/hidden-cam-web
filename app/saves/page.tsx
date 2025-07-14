"use client"

import { getAllRecordings, deleteRecording, clearRecordings } from "../storageUtils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, ArrowLeft, MoreHorizontal, Eraser } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Save() {
    const [recordings, setRecordings] = useState<{ timestamp: number; id: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [videoURLs, setVideoURLs] = useState<Record<number, string>>({});
    const router = useRouter();

    useEffect(() => {
        getAllRecordings().then((data) => {
          setRecordings(data.map(({ id, timestamp }) => ({ id, timestamp })));
          setIsLoading(false);
        });
    }, []);

    useEffect(() => {
      if (!isLoading) {
        getAllRecordings().then((data) => {
          const urls: Record<number, string> = {};
          data.forEach(({ id, blob }) => {
            urls[id] = URL.createObjectURL(blob);
          });
          setVideoURLs(urls);
        });
      }
    }, [isLoading]);

    useEffect(() => {
      return () => {
        Object.values(videoURLs).forEach((url) => URL.revokeObjectURL(url));
      };
    }, [videoURLs]);

    const handleClearAll = async () => {
      await clearRecordings();
      const updated = await getAllRecordings();
      setRecordings(updated.map(({ id, timestamp }) => ({ id, timestamp })));
      setShowConfirm(false);
    };

    const handleConfirmDelete = async () => {
      if (confirmDeleteId !== null) {
        await deleteRecording(confirmDeleteId);
        const updated = await getAllRecordings();
        setRecordings(updated.map(({ id, timestamp }) => ({ id, timestamp })));
        setConfirmDeleteId(null);
      }
    };

    return (
      <div className="mx-auto space-y-4">
        <div className="w-full px-6 py-5 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Eraser className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear all recordings?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This action will permanently remove all recordings stored in your browser.
              </p>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearAll}>
                  Yes, clear all
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {recordings.length === 0 && !isLoading && (
            <p className="text-muted-foreground">No recordings found.</p>
          )}
          {isLoading ? (
            <div className="text-center text-muted-foreground py-10">Loading recordings...</div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-6 pb-6">
              {recordings.map((rec) => (
                <Card key={rec.id} className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium mr-2">
                      {new Date(rec.timestamp).toLocaleString()}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={async () => {
                            const all = await getAllRecordings();
                            const found = all.find(r => r.id === rec.id);
                            if (!found) return;
                            const url = URL.createObjectURL(found.blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `recording-${rec.id}.webm`;
                            a.click();
                          }}
                        >
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setConfirmDeleteId(rec.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-0">
                    <video
                      src={videoURLs[rec.id]}
                      preload="metadata"
                      muted
                      playsInline
                      controls
                      className="w-full h-48 object-cover"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this recording?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">This recording will be permanently deleted.</p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}
