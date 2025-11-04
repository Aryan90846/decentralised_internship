'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { Search, CheckCircle, XCircle, Loader2, Download, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIGS, CHAIN_ID } from '@/config/constants';
import { ethers } from 'ethers';

type SearchType = 'tokenId' | 'address' | 'certId';

export default function VerifyPage() {
  const [searchType, setSearchType] = useState<SearchType>('tokenId');
  const [searchValue, setSearchValue] = useState('');
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [searching, setSearching] = useState(false);

  const { data: certificateData, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'verifyCertificate',
    args: tokenId !== null ? [tokenId] : undefined,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);

    try {
      if (searchType === 'tokenId') {
        setTokenId(BigInt(searchValue));
      } else if (searchType === 'address') {
        const response = await fetch(`/api/search?type=address&value=${searchValue}`);
        const data = await response.json();
        if (data.tokenId) {
          setTokenId(BigInt(data.tokenId));
        }
      } else if (searchType === 'certId') {
        const response = await fetch(`/api/search?type=certId&value=${searchValue}`);
        const data = await response.json();
        if (data.tokenId) {
          setTokenId(BigInt(data.tokenId));
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const exists = certificateData?.[0] as boolean;
  const revoked = certificateData?.[1] as boolean;
  const recipient = certificateData?.[2] as string;
  const metadataURI = certificateData?.[3] as string;
  const metadataHash = certificateData?.[4] as string;
  const issuedAt = certificateData?.[5] as bigint;

  const networkConfig = NETWORK_CONFIGS[CHAIN_ID as keyof typeof NETWORK_CONFIGS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Verify Certificate
          </h1>
          <p className="text-lg text-slate-600">
            Check the authenticity of any internship certificate
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Search By
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSearchType('tokenId')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    searchType === 'tokenId'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Token ID
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('address')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    searchType === 'address'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Wallet Address
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('certId')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    searchType === 'certId'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Certificate ID
                </button>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === 'tokenId'
                    ? 'Enter token ID (e.g., 1)'
                    : searchType === 'address'
                    ? 'Enter wallet address (0x...)'
                    : 'Enter certificate ID (CERT-...)'
                }
                className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={!searchValue || searching || isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {searching || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Verify Certificate
                </>
              )}
            </button>
          </form>
        </div>

        {tokenId !== null && !isLoading && (
          <div className="glass-card rounded-2xl p-8">
            {exists ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {revoked ? (
                      <XCircle className="w-12 h-12 text-red-600 mr-4" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-green-600 mr-4" />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {revoked ? 'Certificate Revoked' : 'Valid Certificate'}
                      </h3>
                      <p className="text-slate-600">Token ID: #{tokenId.toString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Recipient</p>
                    <p className="text-lg font-mono text-slate-900">{recipient}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">Issued At</p>
                    <p className="text-lg text-slate-900">
                      {new Date(Number(issuedAt) * 1000).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">Metadata Hash</p>
                    <p className="text-sm font-mono text-slate-900 break-all">
                      {metadataHash}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-500">Metadata URI</p>
                    <p className="text-sm text-slate-900 break-all">{metadataURI}</p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-slate-200">
                  <a
                    href={`${networkConfig.explorer}/token/${CONTRACT_ADDRESS}?a=${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View on Explorer
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Certificate Not Found
                </h3>
                <p className="text-slate-600">
                  No certificate exists with this identifier
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
