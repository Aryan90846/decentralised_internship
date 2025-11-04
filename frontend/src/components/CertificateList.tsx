'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Trash2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIGS, CHAIN_ID } from '@/config/constants';
import { getAllCertificates, updateCertificateRevocation, CertificateRecord } from '@/lib/supabase';

export function CertificateList() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await getAllCertificates();
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    if (isSuccess && revokingId) {
      updateCertificateRevocation(revokingId, true)
        .then(() => {
          toast.success('Certificate revoked successfully');
          loadCertificates();
          setRevokingId(null);
        })
        .catch((err) => {
          console.error('Error updating revocation status:', err);
          toast.error('Failed to update database');
        });
    }
  }, [isSuccess, revokingId]);

  const handleRevoke = async (tokenId: number) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) {
      return;
    }

    try {
      setRevokingId(tokenId);
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'revokeCertificate',
        args: [BigInt(tokenId)],
      });
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
      setRevokingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">No certificates issued yet</p>
      </div>
    );
  }

  const networkConfig = NETWORK_CONFIGS[CHAIN_ID as keyof typeof NETWORK_CONFIGS];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Issued Certificates ({certificates.length})
        </h3>
        <button
          onClick={loadCertificates}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Token ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Recipient
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Program
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Issued
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-sm font-mono text-slate-900">
                  #{cert.token_id}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-slate-900">
                    {cert.recipient_name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {cert.recipient_address.slice(0, 6)}...{cert.recipient_address.slice(-4)}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">
                  {cert.program}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {new Date(cert.issue_date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {cert.revoked ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Revoked
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`${networkConfig.explorer}/token/${CONTRACT_ADDRESS}?a=${cert.token_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {!cert.revoked && (
                      <button
                        onClick={() => handleRevoke(cert.token_id)}
                        disabled={isConfirming && revokingId === cert.token_id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {isConfirming && revokingId === cert.token_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
