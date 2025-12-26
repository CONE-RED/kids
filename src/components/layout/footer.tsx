"use client";

import Image from "next/image";

export function Footer(): React.ReactElement {
  return (
    <footer className="py-6 border-t bg-white/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
          {/* Cone Red Logo */}
          <a
            href="https://cone.red"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/cone-red-logo.svg"
              alt="Cone Red"
              width={100}
              height={25}
              className="h-5 w-auto"
            />
          </a>

          <span className="hidden md:inline text-gray-300">•</span>

          {/* Credits */}
          <div className="flex items-center gap-2">
            <span>by Dima Levin with love</span>
            <span className="text-gray-300">•</span>
            <a
              href="https://linkedin.com/in/leeevind"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
