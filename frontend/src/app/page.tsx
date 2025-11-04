import Link from 'next/link';
import { Shield, FileCheck, Search, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">
                Aryan Certificate Portal
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/verify"
                className="text-slate-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Verify
              </Link>
              <Link
                href="/admin"
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Web3 Internship Certificates
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Issue tamper-proof, blockchain-verified internship certificates as NFTs.
            Powered by Aryan Web3 Labs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Blockchain Verified"
            description="Certificates stored on Polygon Amoy testnet with cryptographic proof"
          />
          <FeatureCard
            icon={<FileCheck className="w-8 h-8" />}
            title="Tamper-Proof"
            description="SHA256 hash validation ensures certificate authenticity"
          />
          <FeatureCard
            icon={<Search className="w-8 h-8" />}
            title="Public Verification"
            description="Anyone can verify certificate validity using token ID or wallet"
          />
        </div>

        <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/verify"
              className="group p-6 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all"
            >
              <Search className="w-12 h-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Verify Certificate
              </h3>
              <p className="text-slate-600">
                Check the authenticity of any certificate by token ID, wallet address, or certificate ID
              </p>
            </Link>

            <Link
              href="/admin"
              className="group p-6 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all"
            >
              <Award className="w-12 h-12 text-brand-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Issue Certificates
              </h3>
              <p className="text-slate-600">
                Connect your wallet to mint certificates individually or in batches
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Powered by</p>
          <div className="flex justify-center items-center space-x-8 text-slate-500">
            <span className="font-semibold">Polygon Amoy</span>
            <span>•</span>
            <span className="font-semibold">IPFS</span>
            <span>•</span>
            <span className="font-semibold">ERC-721</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p className="font-medium">Aryan Web3 Labs</p>
            <p className="text-sm mt-2">
              Admin: 0xbE27dFb76bdb342313B13357252A42a4CA34431d
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="text-brand-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
