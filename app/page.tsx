"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { WalletConnect } from "@/components/walletConnect";
import { useAccount } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { useEthersProvider, useEthersSigner } from "@/hooks/useEthers";
import lighthouse from '@lighthouse-web3/sdk';

export default function IdentityPage() {
    const { isConnected, address } = useAccount();
    const signer = useEthersSigner();
    const provider = useEthersProvider();

    // State for file upload to IPFS (Lighthouse)
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileCid, setUploadedFileCid] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // State for claiming credential on the blockchain
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [claimSuccess, setClaimSuccess] = useState(false);

    // State for viewing the user's existing credential from the blockchain
    const [isReading, setIsReading] = useState(false);
    const [readError, setReadError] = useState<string | null>(null);
    const [userCredentialUrl, setUserCredentialUrl] = useState<string | null>(null);
    const [retrievedCid, setRetrievedCid] = useState<string | null>(null);

    // --- Lighthouse File Upload Logic ---
    const onUploadChange = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
        if (!apiKey) {
            setUploadError("Lighthouse API key not found in environment variables.");
            return;
        }
        setIsUploading(true);
        setUploadError(null);
        setUploadedFileCid(null);
        setUploadProgress(0);
        try {
            const progressCallback = (progressData: any) => {
                const percentageDone = Number(((progressData.uploaded / progressData.total) * 100).toFixed(2));
                setUploadProgress(percentageDone);
            };
            const output = await lighthouse.upload(files, apiKey, false, progressCallback);
            const cid = output?.data?.Hash;
            if (!cid) throw new Error("Upload failed: No CID was returned from Lighthouse.");
            
            setUploadedFileCid(cid);
            setUploadProgress(100);
        } catch (e) {
            setUploadError(e instanceof Error ? e.message : "An unknown upload error occurred.");
        } finally {
            setIsUploading(false);
        }
    };
    
    // --- Smart Contract Interaction Logic ---

    // Function to call the `claimCredential` function in the smart contract
    const handleClaimCredential = useCallback(async () => {
        if (!isConnected || !signer || !uploadedFileCid) {
            setClaimError("Please connect your wallet and upload a file first.");
            return;
        }
        
        try {
            setIsClaiming(true);
            setClaimError(null);
            setClaimSuccess(false);

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const tx = await contract.claimCredential(uploadedFileCid);
            await tx.wait(); // Wait for the transaction to be mined
            
            setClaimSuccess(true);
            setUploadedFileCid(null); // Clear the uploaded file to prevent accidental re-submission

        } catch (e: any) {
            const reason = e.reason || e.message || "Transaction failed. Please check the console.";
            setClaimError(reason);
            console.error(e);
        } finally {
            setIsClaiming(false);
        }
    }, [isConnected, signer, uploadedFileCid]);

    // Effect to load the current user's credential from the blockchain
    useEffect(() => {
        const loadUserCredential = async () => {
            if (!isConnected || !provider || !address) {
                // Clear state if user disconnects
                setUserCredentialUrl(null);
                setRetrievedCid(null);
                return;
            };

            try {
                setIsReading(true);
                setReadError(null);
                setUserCredentialUrl(null);
                setRetrievedCid(null);
                
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                
                // Call the 'viewCredential' function for the connected user's address
                const cid = await contract.viewCredential(address);
                
                if (cid && cid !== "") {
                    setRetrievedCid(cid);
                    setUserCredentialUrl(`https://gateway.lighthouse.storage/ipfs/${cid}`);
                }
            } catch (e: any) {
                const reason = e.reason || e.message || "Failed to read credential from the blockchain.";
                setReadError(reason);
                console.error(e);
            } finally {
                setIsReading(false);
            }
        };

        loadUserCredential();
    // This effect runs when the user's connection status, address, or provider changes,
    // or after a new credential has been successfully claimed.
    }, [isConnected, provider, address, claimSuccess]);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex justify-between items-center p-4 md:p-6 container mx-auto">
                 <Link href="/">
                    <Image
                        className="cursor-pointer"
                        src="/assets/logos/logo.svg"
                        width={150}
                        height={150}
                        alt="Logo"
                    />
                </Link>
                <WalletConnect />
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-6">
                {!isConnected ? (
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-800">Decentralized Identity Toolkit</h1>
                        <p className="mt-4 text-lg text-gray-600">Please connect your wallet to manage your credentials.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Column 1: Claim Credentials */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-5 text-gray-900">Claim Your Credential</h2>
                            
                            <div className="space-y-6">
                                {/* Step 1: File Uploader */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">1. Upload your identity document</label>
                                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {/* You can add an SVG icon here */}
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => onUploadChange(e.target.files)} disabled={isUploading} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PDF, PNG, JPG, etc. up to 10MB</p>
                                        </div>
                                    </div>
                                    {isUploading && <p className="mt-2 text-sm text-blue-600">Uploading... {uploadProgress.toFixed(0)}%</p>}
                                    {uploadError && <p className="mt-2 text-sm text-red-600">Error: {uploadError}</p>}
                                    {uploadedFileCid && <p className="mt-2 text-sm text-green-600">✅ Upload complete!</p>}
                                </div>
                                
                                {/* Step 2: Claim Button */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">2. Save credential to the Blockchain</label>
                                    <button
                                        onClick={handleClaimCredential}
                                        disabled={!uploadedFileCid || isClaiming}
                                        className="mt-2 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        {isClaiming ? 'Claiming on-chain...' : 'Claim My Credential'}
                                    </button>
                                    {claimError && <p className="mt-2 text-sm text-red-600">Error: {claimError}</p>}
                                    {claimSuccess && <p className="mt-2 text-sm text-green-600">🎉 Credential successfully claimed on the blockchain!</p>}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: View Your Credential */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-5 text-gray-900">Your Stored Credential</h2>
                            <div className="h-full flex flex-col items-center justify-center">
                                {isReading && <p className="text-gray-500">Loading your credential...</p>}
                                {readError && <p className="text-red-600">Error: {readError}</p>}
                                {!isReading && !userCredentialUrl && (
                                    <div className="text-center text-gray-500">
                                        <p>You have not claimed a credential yet.</p>
                                        <p className="text-sm mt-1">Claim one on the left to see it here.</p>
                                    </div>
                                )}
                                
                                {userCredentialUrl && (
                                    <div className="w-full text-center">
                                        <p className="text-sm text-gray-600 mb-2 break-all">
                                            <strong>CID:</strong> {retrievedCid}
                                        </p>
                                        <div className="mt-4 border-2 border-gray-200 rounded-lg overflow-hidden">
                                            <img src={userCredentialUrl} alt="User Credential Document" className="w-full h-auto max-h-96 object-contain"/>
                                        </div>
                                         <a href={userCredentialUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-indigo-600 hover:underline">
                                            View document in new tab
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}