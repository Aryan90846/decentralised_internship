'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/constants';
import { ethers } from 'ethers';

export function MintSingleForm() {
  const [formData, setFormData] = useState({
    recipientAddress: '',
    recipientName: '',
    program: 'Full Stack Web3 Internship',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ethers.isAddress(formData.recipientAddress)) {
      toast.error('Invalid wallet address');
      return;
    }

    try {
      const certId = `CERT-${Date.now()}`;

      const metadata = {
        name: `Internship Certificate — ${formData.recipientName}`,
        description: `${formData.recipientName} successfully completed ${formData.program}`,
        image: 'ipfs://placeholder',
        attributes: [
          { trait_type: 'name', value: formData.recipientName },
          { trait_type: 'wallet', value: formData.recipientAddress },
          { trait_type: 'program', value: formData.program },
          { trait_type: 'issue_date', value: formData.issueDate },
          { trait_type: 'certificate_id', value: certId },
        ],
      };

      const metadataString = JSON.stringify(metadata);
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));

      const response = await fetch('/api/upload-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata, certId }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload metadata');
      }

      const { ipfsUri } = await response.json();

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mintCertificate',
        args: [formData.recipientAddress as `0x${string}`, ipfsUri, metadataHash],
      });

      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (err: any) {
      console.error('Error minting certificate:', err);
      toast.error(err.message || 'Failed to mint certificate');
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      setFormData({
        recipientAddress: '',
        recipientName: '',
        program: 'Full Stack Web3 Internship',
        issueDate: new Date().toISOString().split('T')[0],
      });
      toast.success('Certificate minted successfully!');
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Recipient Wallet Address
        </label>
        <input
          type="text"
          required
          value={formData.recipientAddress}
          onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
          placeholder="0x..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Recipient Name
        </label>
        <input
          type="text"
          required
          value={formData.recipientName}
          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Program
        </label>
        <select
          value={formData.program}
          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
        >
          <option>Full Stack Web3 Internship</option>
          <option>Smart Contract Development Internship</option>
          <option>Blockchain Research Internship</option>
          <option>DApp Development Internship</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Issue Date
        </label>
        <input
          type="date"
          required
          value={formData.issueDate}
          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isPending || isConfirming ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {isPending ? 'Preparing...' : 'Confirming...'}
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Mint Certificate
          </>
        )}
      </button>

      {hash && (
        <div className="text-sm text-slate-600">
          Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
        </div>
      )}
    </form>
  );
}
