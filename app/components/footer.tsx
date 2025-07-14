"use client"

export default function Footer() {
    return (
        <footer className="text-center text-sm text-muted-foreground p-6 border-t border-gray-200">
            &copy; {new Date().getFullYear()} Hidden Cam. All rights reserved.
        </footer>
    );
}