"use client";
import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";

type UploadSectionProps = {
  signer: ethers.Signer;
  onUploadComplete: (file: any) => void;
};

export default function UploadSection({ signer, onUploadComplete }: UploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onUploadChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
    if (!apiKey) {
      setUploadError("Lighthouse API key not configured");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
     const output = await lighthouse.upload(files, apiKey, undefined, (progressData: any) => {
  // safely extract uploaded and total
  const uploaded = progressData?.uploaded ?? 0;
  const total = progressData?.total ?? 1; // avoid division by zero
  const pct = ((uploaded / total) * 100).toFixed(2);
  setUploadProgress(parseFloat(pct));
});


      onUploadComplete(output); // pass uploaded file to parent
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-12 flex flex-col items-center bg-gray-50 w-full">
      <h2 className="text-3xl font-semibold mb-6">Upload Your File</h2>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => onUploadChange(e.target.files)}
          disabled={isUploading}
        />
        <label className="flex flex-col items-center justify-center w-96 h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400">
          {isUploading ? (
            <p>Uploading... {uploadProgress.toFixed(0)}%</p>
          ) : (
            <p>Click or drag file to upload</p>
          )}
        </label>
      </div>
      {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
    </section>
  );
}
