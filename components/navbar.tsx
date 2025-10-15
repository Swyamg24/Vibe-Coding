"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to connect your wallet.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-black/80 backdrop-blur-md text-white border-b border-white/10">
      {/* Left: Logo / Title */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-wide">🌀 Proof-of-Vibe</span>
      </div>

      {/* Right: Connect Wallet */}
      <div>
        {walletAddress ? (
          <span className="bg-green-600/20 text-green-400 px-4 py-2 rounded-xl text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all text-sm font-semibold"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
