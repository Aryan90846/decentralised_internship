# 🎓 Aryan Certificate Portal

> Blockchain-powered internship certificate issuance system with NFT-based verification

A complete production-ready decentralized application (DApp) for issuing tamper-proof internship certificates as NFTs on Polygon Amoy testnet. Built by **Aryan Web3 Labs**.

## 🌟 Features

- **Blockchain Verified**: Certificates stored on Polygon Amoy with cryptographic proof
- **NFT-Based**: ERC-721 standard certificates with full metadata
- **Tamper-Proof**: SHA256 hash validation for authenticity
- **Public Verification**: Anyone can verify certificates by token ID, wallet, or certificate ID
- **Batch Issuance**: CSV upload for minting multiple certificates
- **Role-Based Access**: Owner and Issuer roles for controlled minting
- **Revocation Support**: Ability to revoke certificates on-chain
- **Modern UI**: Clean, responsive interface built with Next.js and TailwindCSS

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Polygon Amoy Testnet                     │
│              InternCertificateNFT (ERC-721)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│         Wagmi + RainbowKit + TailwindCSS                     │
│  - Admin Dashboard  - Verification Page  - Wallet Connect    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│        CSV Processing + Metadata Upload + QR Generation      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
│           Certificate Metadata + Indexing + Search           │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Polygon Amoy testnet MATIC (from faucet)
- Supabase account
- WalletConnect Project ID (optional but recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install blockchain dependencies
cd blockchain
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment Variables

#### Blockchain (.env in blockchain/)

```env
PRIVATE_KEY=your_wallet_private_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### Frontend (.env.local in frontend/)

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env in backend/)

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

### 3. Get Testnet Tokens

**Polygon Amoy Faucet:**
- https://faucet.polygon.technology/
- Request MATIC tokens for gas fees

**Alternative (Base Sepolia):**
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### 4. Deploy Smart Contract

```bash
cd blockchain

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Polygon Amoy
npm run deploy:amoy

# Verify on Polygonscan (after deployment)
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

Copy the deployed contract address to your frontend `.env.local`.

### 5. Set Up Supabase

The database table is already created via migration. Verify in Supabase dashboard:

```sql
-- Table: certificates
-- Columns: id, token_id, recipient_address, recipient_name,
--          program, issue_date, certificate_id, metadata_uri,
--          metadata_hash, revoked, created_at, updated_at
```

### 6. Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit: http://localhost:3000

## 📖 Usage Guide

### Admin Dashboard

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Verify Permissions**: Must have ISSUER_ROLE on contract
3. **Mint Single Certificate**:
   - Enter recipient wallet address
   - Fill in recipient name
   - Select program
   - Choose issue date
   - Click "Mint Certificate"
4. **Batch Upload**:
   - Download CSV template
   - Fill with recipient data
   - Upload CSV file
   - Click "Mint Batch"

### CSV Format

```csv
recipient_address,recipient_name,program,issue_date
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1,John Doe,Full Stack Web3 Internship,2024-01-15
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199,Jane Smith,Smart Contract Development Internship,2024-01-20
```

### Certificate Verification

1. Go to `/verify` page
2. Choose search method:
   - **Token ID**: Enter NFT token ID (e.g., 1, 2, 3)
   - **Wallet Address**: Enter recipient's wallet
   - **Certificate ID**: Enter certificate ID (CERT-XXX)
3. View certificate details, status, and metadata

### Revoke Certificate

1. Go to Admin Dashboard → All Certificates
2. Find certificate in list
3. Click trash icon
4. Confirm transaction
5. Certificate marked as revoked on-chain

## 🔐 Smart Contract

### Contract Address

- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **Contract**: `InternCertificateNFT`
- **Standard**: ERC-721 + AccessControl

### Key Functions

```solidity
// Mint single certificate
function mintCertificate(
    address receiver,
    string memory metadataURI,
    bytes32 metadataHash
) public returns (uint256)

// Batch mint certificates
function batchMint(
    address[] memory receivers,
    string[] memory metadataURIs,
    bytes32[] memory metadataHashes
) public returns (uint256[] memory)

// Revoke certificate
function revokeCertificate(uint256 tokenId) public

// Verify certificate
function verifyCertificate(uint256 tokenId)
    public view returns (
        bool exists,
        bool revoked,
        address recipient,
        string memory metadataURI,
        bytes32 metadataHash,
        uint256 issuedAt
    )
```

### Roles

- **DEFAULT_ADMIN_ROLE**: Full contract control (owner)
- **ISSUER_ROLE**: Can mint and revoke certificates

### Events

```solidity
event CertificateIssued(
    address indexed to,
    uint256 indexed tokenId,
    string uri,
    bytes32 metadataHash
)

event CertificateRevoked(
    uint256 indexed tokenId,
    address indexed revoker
)
```

## 🗄️ Database Schema

### certificates table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| token_id | integer | NFT token ID (unique) |
| recipient_address | text | Wallet address (indexed) |
| recipient_name | text | Full name |
| program | text | Internship program |
| issue_date | date | Issue date |
| certificate_id | text | Human-readable ID (unique) |
| metadata_uri | text | IPFS URI |
| metadata_hash | text | SHA256 hash |
| revoked | boolean | Revocation status |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

## 🛠️ API Endpoints

### POST /api/upload-metadata
Upload certificate metadata and generate QR code

**Request:**
```json
{
  "metadata": { ... },
  "certId": "CERT-XXX"
}
```

**Response:**
```json
{
  "ipfsUri": "ipfs://...",
  "metadataHash": "0x...",
  "metadata": { ... }
}
```

### POST /api/batch-mint
Process CSV and prepare batch mint data

**Request:** Multipart form data with CSV file

**Response:**
```json
{
  "count": 10,
  "receivers": ["0x..."],
  "metadataURIs": ["ipfs://..."],
  "metadataHashes": ["0x..."],
  "dbRecords": [...]
}
```

### GET /api/search
Search certificates by address or certificate ID

**Query Parameters:**
- `type`: "address" | "certId"
- `value`: search value

**Response:**
```json
{
  "tokenId": 1
}
```

## 🧪 Testing

```bash
cd blockchain

# Run all tests
npm test

# Run with coverage
npx hardhat coverage

# Run with gas reporter
REPORT_GAS=true npm test
```

## 🔒 Security Features

1. **Role-Based Access Control**: Only authorized issuers can mint
2. **Metadata Hash Verification**: Tamper-proof certificate validation
3. **RLS Policies**: Supabase row-level security for data protection
4. **Public Verifiability**: Anyone can verify, only issuers can write
5. **Revocation Support**: Ability to invalidate certificates on-chain
6. **Input Validation**: Address and data validation on all inputs

## 📱 Frontend Routes

- `/` - Home page with feature overview
- `/admin` - Admin dashboard (requires ISSUER_ROLE)
- `/verify` - Public certificate verification page

## 🎨 Tech Stack

### Smart Contracts
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Ethers.js v6

### Frontend
- Next.js 14
- React 18
- TypeScript
- Wagmi v2
- RainbowKit
- TailwindCSS
- Lucide Icons

### Backend
- Node.js
- Express
- CSV Parser
- QRCode Generator
- Ethers.js

### Database & Storage
- Supabase (PostgreSQL)
- IPFS (planned for production)

## 🌐 Network Configuration

### Polygon Amoy (Primary)
- **Chain ID**: 80002
- **RPC**: https://rpc-amoy.polygon.technology/
- **Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/

### Base Sepolia (Fallback)
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## 📦 Project Structure

```
aryan-certificate-portal/
├── blockchain/               # Smart contracts
│   ├── contracts/           # Solidity contracts
│   ├── scripts/             # Deployment scripts
│   ├── test/                # Contract tests
│   └── hardhat.config.js    # Hardhat configuration
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── config/         # Configuration files
│   │   └── lib/            # Utility libraries
│   └── package.json
├── backend/                 # Express API
│   ├── server.js           # Main server file
│   └── package.json
└── README.md               # This file
```

## 🚀 Deployment

### Smart Contract Deployment

```bash
cd blockchain
npm run deploy:amoy
# Save contract address

# Verify contract
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel deploy --prod
```

Environment variables required in Vercel:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend Deployment

Deploy to Railway, Render, or any Node.js hosting:

```bash
cd backend
# Set environment variables
npm start
```

## 🤝 Contributing

This is a production-ready template. For custom modifications:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - Aryan Web3 Labs

## 👥 Credits

**Organization**: Aryan Web3 Labs
**Admin Wallet**: 0xbE27dFb76bdb342313B13357252A42a4CA34431d
**Project**: Aryan Certificate Portal

Built with ❤️ using blockchain technology for trustless certification.

## 🐛 Troubleshooting

### "Insufficient funds" error
- Get testnet tokens from Polygon Amoy faucet
- Ensure you're on the correct network (Chain ID 80002)

### "Access Denied" on admin page
- Your wallet must have ISSUER_ROLE
- Owner grants role via: `grantRole(ISSUER_ROLE, address)`

### Contract not found
- Verify CONTRACT_ADDRESS in .env is correct
- Check you're on the right network (Amoy = 80002)

### Transaction fails
- Check gas limit settings
- Ensure sufficient MATIC balance
- Verify all addresses are valid

### Frontend build errors
- Run `npm install` in frontend directory
- Check Node.js version (18+)
- Clear `.next` folder and rebuild

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Review troubleshooting section
- Contact Aryan Web3 Labs

---

**Ready to deploy?** Follow the Quick Start guide and start issuing blockchain certificates! 🎓✨
