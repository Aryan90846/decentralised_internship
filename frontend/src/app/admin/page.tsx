'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useChainId } from 'wagmi';
import { Upload, Plus, FileSpreadsheet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/constants';
import { CertificateList } from '@/components/CertificateList';
import { MintSingleForm } from '@/components/MintSingleForm';
import { BatchUploadForm } from '@/components/BatchUploadForm';

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'list'>('single');
  const [isIssuer, setIsIssuer] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  const { data: issuerRoleHash } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'ISSUER_ROLE',
  });

  const { data: hasRole } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasRole',
    args: issuerRoleHash && address ? [issuerRoleHash, address] : undefined,
  });

  useEffect(() => {
    if (hasRole !== undefined) {
      setIsIssuer(hasRole as boolean);
      setIsCheckingRole(false);
    }
  }, [hasRole]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-slate-600">
              Please connect your wallet to access the admin dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isIssuer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Access Denied
            </h2>
            <p className="text-slate-600 mb-2">
              You don't have permission to issue certificates.
            </p>
            <p className="text-sm text-slate-500">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">
            Issue and manage internship certificates
          </p>
        </div>

        <div className="flex space-x-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'single'
                ? 'text-brand-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Single Certificate
            {activeTab === 'single' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'batch'
                ? 'text-brand-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 inline mr-2" />
            Batch Upload
            {activeTab === 'batch' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'list'
                ? 'text-brand-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            All Certificates
            {activeTab === 'list' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600" />
            )}
          </button>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {activeTab === 'single' && <MintSingleForm />}
          {activeTab === 'batch' && <BatchUploadForm />}
          {activeTab === 'list' && <CertificateList />}
        </div>
      </div>
    </div>
  );
}
