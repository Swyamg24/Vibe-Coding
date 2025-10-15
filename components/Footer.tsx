"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    // FIX: Removed "mt-20" from this line
    <footer className="w-full bg-black/80 backdrop-blur-md text-white py-6 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left: Copyright */}
        <p className="text-sm text-gray-400 mb-4 md:mb-0">
          &copy; {year} Proof-of-Vibe. All rights reserved.
        </p>

        {/* Right: Links (optional) */}
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}