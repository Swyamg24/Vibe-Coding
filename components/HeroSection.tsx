"use client";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 relative">
      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Your Identity, <span className="text-indigo-400">On-Chain</span>
      </h1>

      {/* Subheading */}
      <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
        Issue, Hold, and Verify your <span className="text-purple-400">Proof-of-Vibe</span> credential — 
        all in your browser, with no backend.
      </p>

      {/* Call to Action */}
      <a
        href="#issuer"
        className="mt-10 inline-block px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-transform duration-300"
      >
        Claim Your Credential 🚀
      </a>

      {/* Decorative Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>
      </div>
    </section>
  );
}
