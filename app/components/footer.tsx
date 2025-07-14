"use client"

export default function Footer() {
    return (
        <footer className="text-center text-sm text-muted-foreground p-6 border-t border-gray-200 space-y-1">
            <div>&copy; {new Date().getFullYear()} Hidden Cam. All rights reserved.</div>
            <div>
                <a
                    href="https://github.com/riparuk/hidden-cam-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                >
                    Open Source - GitHub Repository
                </a>
            </div>
        </footer>
    );
}