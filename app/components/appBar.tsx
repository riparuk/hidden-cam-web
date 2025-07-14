"use client"

import { useState } from "react"
import { EllipsisVertical, ArrowLeftRight, Power, Save, ScanEye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type AppBarProps = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isCameraOn: boolean;
    toggleCamera: () => void;
    switchCamera: () => void;
  };

export default function AppBar({ videoRef, isCameraOn, toggleCamera, switchCamera }: AppBarProps) {
    const router = useRouter();
    const [isSmallPreview, setIsSmallPreview] = useState(false);
    const [title, setTitle] = useState("Hidden Cam");
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState(title);

  return (
    <>
    <header className="w-full border-b px-4 py-2 flex items-center justify-between">
      <Link href="/" className="text-lg font-semibold">
      <div className="flex items-center gap-2">
        <video ref={videoRef} autoPlay playsInline muted preload="auto" className={cn("w-5 h-5 rounded-sm bg-black object-cover", isSmallPreview? "hidden" : "")} />
        {title}
      </div>
      </Link>
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel onClick={toggleCamera}>
                <div className="flex items-center gap-2">
                    <Power className={cn("h-4 w-4", isCameraOn ? "text-red-500" : "text-green-500")} />
                    {isCameraOn ? "Off" : "On"}
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel onClick={switchCamera}>
                <div className="flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    Switch
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel onClick={() => router.push("/save")}>
                <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Saves
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel onClick={() => {isSmallPreview ? setIsSmallPreview(false) : setIsSmallPreview(true)}}>
                <div className="flex items-center gap-2">
                    <ScanEye className={cn("h-4 w-4", isSmallPreview ? "text-red-500" : "")} />
                    Preview
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel onClick={() => setShowModal(true)}>
                <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Title
                </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Title</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              setTitle(newTitle);
              setShowModal(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}