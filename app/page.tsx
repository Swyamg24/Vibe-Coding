"use client";

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import UploadSection from "../components/UploadSection";
import StoreSection from "../components/StoreSection";
import DisplaySection from "../components/DisplaySection";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/hooks/useEthers";
import { ethers } from "ethers";

export default function Home() {
  const { isConnected } = useAccount();
  const signer = useEthersSigner() as ethers.Signer | null; // ensure proper type
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white-pattern text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Upload Section */}
      {isConnected && signer && (
        <UploadSection
          signer={signer}
          onUploadComplete={(file) => setUploadedFile(file)}
        />
      )}

      {/* Store Section */}
      {isConnected && signer && uploadedFile && (
        <StoreSection
          uploadedFile={uploadedFile}
          signer={signer}
          isConnected={isConnected}
          isMatching={true} // optional: add chain check
        />
      )}

      {/* Display Section */}
      {isConnected && signer && (
        <DisplaySection
          signer={signer}
          rpcUrl={process.env.NEXT_PUBLIC_RPC_URL}
        />
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}
