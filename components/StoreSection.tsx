"use client";
import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

type StoreSectionProps = {
  uploadedFile: any; // The output from UploadSection
  signer: ethers.Signer | null; // Wallet signer
  isConnected: boolean;
  isMatching: boolean; // If connected chain matches supported chain
};

export default function StoreSection({ uploadedFile, signer, isConnected, isMatching }: StoreSectionProps) {
  const [isStoring, setIsStoring] = useState(false);
  const [storeSuccess, setStoreSuccess] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  const handleStore = useCallback(async () => {
    if (!uploadedFile || !signer || !isConnected || !isMatching) return;

    setIsStoring(true);
    setStoreError(null);
    setStoreSuccess(false);

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI as ethers.InterfaceAbi,
        signer
      );

      const cid = uploadedFile.data.Hash;
      const tx = await contract.store(cid);
      await tx.wait();

      setStoreSuccess(true);
    } catch (err) {
      console.error(err);
      const e = err as { reason?: string; shortMessage?: string; message?: string };
      const reason = e?.reason || e?.shortMessage || e?.message || "Store transaction failed";
      setStoreError(reason);
    } finally {
      setIsStoring(false);
    }
  }, [uploadedFile, signer, isConnected, isMatching]);

  return (
    <section className="py-12 flex flex-col items-center bg-gray-50 w-full">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Store on Blockchain</h2>

      <button
        onClick={handleStore}
        disabled={isStoring || !uploadedFile || !isConnected || !isMatching}
        className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
          isStoring || !uploadedFile || !isConnected || !isMatching
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isStoring ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Storing...</span>
          </div>
        ) : (
          "Store on Blockchain"
        )}
      </button>

      {/* Success */}
      {storeSuccess && (
        <p className="text-green-600 mt-3 font-medium">✅ Successfully stored on blockchain!</p>
      )}

      {/* Error */}
      {storeError && (
        <p className="text-red-600 mt-3 font-medium">{storeError}</p>
      )}
    </section>
  );
}
