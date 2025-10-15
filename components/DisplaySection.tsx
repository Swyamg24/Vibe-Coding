"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

type DisplaySectionProps = {
  signer: ethers.Signer | null;
  rpcUrl?: string; // fallback if signer is not available
};

export default function DisplaySection({ signer, rpcUrl }: DisplaySectionProps) {
  const [storedImageUrl, setStoredImageUrl] = useState<string | null>(null);
  const [retrievedCid, setRetrievedCid] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);

  useEffect(() => {
    const loadStored = async () => {
      if (!signer && !rpcUrl) return;

      setIsReading(true);
      setReadError(null);
      setStoredImageUrl(null);
      setRetrievedCid(null);

      try {
        const provider = signer ? signer.provider : new ethers.JsonRpcProvider(rpcUrl!);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI as ethers.InterfaceAbi,
          provider
        );

        const cid = await contract.retrieve();
        setRetrievedCid(cid);

        if (cid && cid !== "") {
          setStoredImageUrl(`https://gateway.lighthouse.storage/ipfs/${cid}`);
        }
      } catch (err) {
        console.error(err);
        const e = err as { reason?: string; shortMessage?: string; message?: string };
        const reason = e?.reason || e?.shortMessage || e?.message || "Failed to read stored CID";
        setReadError(reason);
      } finally {
        setIsReading(false);
      }
    };

    loadStored();
  }, [signer, rpcUrl]);

  return (
    <section id="display" className="py-16 flex flex-col items-center bg-gray-100 w-full">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Stored Image</h2>

      {/* Loading */}
      {isReading && (
        <div className="flex items-center justify-center space-x-2 py-8">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-blue-600 font-medium">Loading stored image...</span>
        </div>
      )}

      {/* Error */}
      {readError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">{readError}</p>
        </div>
      )}

      {/* CID Display */}
      {retrievedCid && !isReading && (
        <p className="text-xs text-gray-500 mb-3">CID: {retrievedCid}</p>
      )}

      {/* Image */}
      {storedImageUrl && !isReading && (
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden max-w-md w-full">
          <img
            src={storedImageUrl}
            alt="Stored image from blockchain"
            className="w-full h-auto max-h-96 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* No image */}
      {!isReading && !storedImageUrl && !readError && (
        <p className="text-gray-500 text-center mt-8">
          No image stored on blockchain. Upload and store an image to see it here.
        </p>
      )}
    </section>
  );
}
