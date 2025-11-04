# 📁 Project Structure

Complete directory and file organization for Aryan Certificate Portal.

```
aryan-certificate-portal/
│
├── blockchain/                           # Smart Contract Layer
│   ├── contracts/
│   │   └── InternCertificateNFT.sol     # Main ERC-721 certificate contract
│   ├── scripts/
│   │   ├── deploy.js                    # Deployment script for testnets
│   │   ├── grant-role.js                # Grant ISSUER_ROLE to address
│   │   ├── check-role.js                # Check roles for an address
│   │   └── get-stats.js                 # Get contract statistics
│   ├── test/
│   │   └── InternCertificateNFT.test.js # Comprehensive contract tests
│   ├── hardhat.config.js                # Hardhat configuration
│   ├── package.json                     # Blockchain dependencies
│   ├── .env.example                     # Environment template
│   └── .gitignore                       # Git ignore rules
│
├── frontend/                            # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── admin/
│   │   │   │   └── page.tsx            # Admin dashboard
│   │   │   ├── verify/
│   │   │   │   └── page.tsx            # Certificate verification page
│   │   │   ├── page.tsx                # Home page
│   │   │   ├── layout.tsx              # Root layout with providers
│   │   │   ├── providers.tsx           # Wagmi/RainbowKit providers
│   │   │   └── globals.css             # Global styles
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Navigation component
│   │   │   ├── MintSingleForm.tsx      # Single certificate mint form
│   │   │   ├── BatchUploadForm.tsx     # CSV batch upload form
│   │   │   └── CertificateList.tsx     # Certificate list with revoke
│   │   ├── config/
│   │   │   ├── wagmi.ts                # Wagmi configuration
│   │   │   └── constants.ts            # Contract ABI and constants
│   │   └── lib/
│   │       └── supabase.ts             # Supabase client and queries
│   ├── public/                          # Static assets
│   ├── next.config.js                   # Next.js configuration
│   ├── tailwind.config.ts               # Tailwind CSS config
│   ├── postcss.config.js                # PostCSS config
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── package.json                     # Frontend dependencies
│   ├── .env.example                     # Environment template
│   └── .gitignore                       # Git ignore rules
│
├── backend/                             # Node.js API Server
│   ├── server.js                        # Express server with routes
│   ├── package.json                     # Backend dependencies
│   ├── .env.example                     # Environment template
│   └── .gitignore                       # Git ignore rules
│
├── .env.example                         # Root environment template
├── sample-certificates.csv              # Sample CSV for batch upload
├── README.md                            # Main documentation
├── DEPLOYMENT.md                        # Deployment guide
├── TESTING.md                           # Testing guide
└── STRUCTURE.md                         # This file
```

## File Descriptions

### Blockchain Layer

#### `contracts/InternCertificateNFT.sol`
Main smart contract implementing ERC-721 with:
- Role-based access control (Owner, Issuer)
- Certificate minting with metadata hash
- Batch minting up to 50 certificates
- Certificate revocation
- Public verification functions
- Certificate querying by owner

**Key Features:**
- Uses OpenZeppelin's battle-tested contracts
- Stores SHA256 hash for tamper verification
- Emits events for all state changes
- Gas-optimized batch operations

#### `scripts/deploy.js`
Deployment script that:
- Deploys contract to specified network
- Displays contract address and owner
- Provides verification command
- Saves deployment info

Usage: `npm run deploy:amoy`

#### `scripts/grant-role.js`
Grants ISSUER_ROLE to address:
- Validates address format
- Checks if role already granted
- Executes transaction
- Verifies success

Usage: `CONTRACT_ADDRESS=0x... node scripts/grant-role.js 0xNEW_ADDRESS`

#### `scripts/check-role.js`
Checks roles for an address:
- Shows ADMIN_ROLE status
- Shows ISSUER_ROLE status
- Useful for debugging permissions

Usage: `CONTRACT_ADDRESS=0x... node scripts/check-role.js 0xADDRESS`

#### `scripts/get-stats.js`
Displays contract statistics:
- Total certificates issued
- Contract name and symbol
- Your account's roles
- Sample certificates (first 5)

Usage: `CONTRACT_ADDRESS=0x... npm run stats`

#### `test/InternCertificateNFT.test.js`
Comprehensive test suite covering:
- Deployment and initialization
- Minting single and batch
- Access control enforcement
- Verification functions
- Revocation logic
- Query functions
- Edge cases and error handling

Run: `npm test`

### Frontend Layer

#### `app/page.tsx` (Home)
Landing page featuring:
- Hero section with project overview
- Feature cards highlighting benefits
- Call-to-action links to admin and verify
- Responsive design
- Footer with organization info

#### `app/admin/page.tsx`
Admin dashboard with:
- Wallet connection check
- Role verification (must have ISSUER_ROLE)
- Three tabs: Single, Batch, List
- State management for active tab
- Loading states during role check

#### `app/verify/page.tsx`
Public verification page with:
- Three search methods (Token ID, Address, Cert ID)
- Search form with validation
- Certificate detail display
- Status indicator (active/revoked)
- Link to blockchain explorer
- Not found handling

#### `components/Navbar.tsx`
Navigation component with:
- Logo and branding
- Navigation links (Home, Verify, Admin)
- RainbowKit ConnectButton
- Sticky positioning
- Responsive design

#### `components/MintSingleForm.tsx`
Single certificate minting:
- Form fields for recipient details
- Address validation
- Program dropdown
- Date picker
- Transaction handling
- Loading states
- Success/error feedback

#### `components/BatchUploadForm.tsx`
Batch certificate upload:
- CSV template download
- Drag-and-drop file upload
- File validation (.csv only)
- Processing indicator
- Instructions and requirements
- Error handling

#### `components/CertificateList.tsx`
Certificate management:
- Fetches all certificates from DB
- Displays in table format
- Shows token ID, name, program, status
- Revoke button for active certs
- Links to blockchain explorer
- Refresh functionality
- Loading and empty states

#### `config/wagmi.ts`
Wagmi configuration:
- RainbowKit setup
- Supported chains (Amoy, Base Sepolia)
- WalletConnect project ID
- SSR support

#### `config/constants.ts`
Application constants:
- Contract address and chain ID
- Contract ABI (typed)
- IPFS gateway URLs
- Network configurations
- Explorer links
- Faucet URLs

#### `lib/supabase.ts`
Supabase client and utilities:
- Client initialization
- Type definitions for Certificate record
- CRUD functions:
  - `saveCertificateToDb`
  - `getCertificateByTokenId`
  - `getCertificatesByCertId`
  - `getCertificatesByAddress`
  - `updateCertificateRevocation`
  - `getAllCertificates`

### Backend Layer

#### `server.js`
Express API server with routes:

**POST /api/upload-metadata**
- Accepts certificate metadata
- Generates SHA256 hash
- Creates QR code
- Returns IPFS URI

**POST /api/batch-mint**
- Accepts CSV file upload
- Parses and validates CSV
- Generates metadata for each cert
- Returns arrays for batch minting

**GET /api/search**
- Search by wallet address or cert ID
- Queries Supabase database
- Returns matching token ID

### Database Schema

#### `certificates` table (Supabase)

Columns:
- `id` (uuid) - Primary key
- `token_id` (integer) - NFT token ID, unique
- `recipient_address` (text) - Wallet address, indexed
- `recipient_name` (text) - Full name
- `program` (text) - Internship program
- `issue_date` (date) - Certificate issue date
- `certificate_id` (text) - Human-readable ID, unique
- `metadata_uri` (text) - IPFS URI
- `metadata_hash` (text) - SHA256 hash
- `revoked` (boolean) - Revocation status
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Update timestamp

Indexes:
- Primary key on `id`
- Unique on `token_id`
- Unique on `certificate_id`
- Index on `recipient_address`
- Index on `revoked`

RLS Policies:
- Public SELECT (anyone can verify)
- Authenticated INSERT (issuers can mint)
- Authenticated UPDATE (issuers can revoke)

### Configuration Files

#### `.env.example`
Template for environment variables showing:
- Required keys for each service
- Example values where appropriate
- Comments explaining each variable

Different .env files for:
- Root directory (all variables)
- blockchain/ (deployment keys)
- frontend/ (public frontend vars)
- backend/ (API keys and secrets)

#### `package.json` files
Each subdirectory has its own package.json:

**blockchain/package.json**
- Hardhat and testing tools
- OpenZeppelin contracts
- Scripts for deploy, test, coverage

**frontend/package.json**
- Next.js 14 and React 18
- Wagmi v2 and RainbowKit
- TailwindCSS and Lucide icons
- Supabase client

**backend/package.json**
- Express server
- CSV parser
- QR code generator
- Supabase client
- Ethers.js

### Documentation Files

#### `README.md`
Main documentation covering:
- Project overview and features
- Architecture diagram
- Prerequisites and setup
- Quick start guide
- Usage instructions
- Smart contract details
- API documentation
- Deployment information
- Troubleshooting

#### `DEPLOYMENT.md`
Step-by-step deployment guide:
- Getting testnet tokens
- Setting up Supabase
- Obtaining API keys
- Configuring environment variables
- Deploying smart contract
- Verifying contract
- Deploying frontend
- Deploying backend
- Production checklist

#### `TESTING.md`
Comprehensive testing guide:
- Smart contract tests
- Frontend manual tests
- Backend API tests
- Database tests
- Integration tests
- Security tests
- Load tests
- Regression tests
- Bug tracking

#### `STRUCTURE.md`
This file - complete project organization

### Data Files

#### `sample-certificates.csv`
Example CSV with 5 sample certificates:
- Correct format
- Valid Ethereum addresses
- Various programs
- Proper date format

Used for:
- Testing batch upload
- Demo certificates
- Template reference

## Technology Stack Summary

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Libraries**: OpenZeppelin Contracts v5
- **Testing**: Mocha + Chai
- **Network**: Polygon Amoy (testnet)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **Web3**: Wagmi v2 + RainbowKit
- **State**: React hooks + TanStack Query
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Libraries**:
  - csv-parser (CSV processing)
  - qrcode (QR generation)
  - multer (file uploads)
  - ethers.js (blockchain interaction)

### Database
- **Provider**: Supabase
- **Type**: PostgreSQL
- **Features**: RLS, real-time subscriptions
- **Client**: @supabase/supabase-js

### Infrastructure
- **Blockchain**: Polygon Amoy (Chain ID 80002)
- **Storage**: IPFS (planned for production)
- **Hosting**:
  - Frontend → Vercel
  - Backend → Railway/Render
  - Database → Supabase Cloud

## Development Workflow

### 1. Initial Setup
```bash
# Clone repository
git clone <repo-url>

# Install all dependencies
cd blockchain && npm install
cd ../frontend && npm install
cd ../backend && npm install
```

### 2. Configure Environment
```bash
# Copy all .env.example files
cp blockchain/.env.example blockchain/.env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Fill in values in each .env file
```

### 3. Deploy Smart Contract
```bash
cd blockchain
npm run compile
npm test
npm run deploy:amoy
# Copy contract address
```

### 4. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 5. Test End-to-End
- Visit http://localhost:3000
- Connect wallet
- Mint test certificate
- Verify certificate
- Test all features

### 6. Deploy to Production
- Deploy contract and verify
- Deploy frontend to Vercel
- Deploy backend to Railway
- Update environment variables
- Test production deployment

## Security Best Practices

### Environment Variables
- Never commit .env files
- Use .env.example as template
- Rotate keys regularly
- Use different keys for dev/prod

### Private Keys
- Never hardcode private keys
- Use environment variables only
- Keep keys in secure location
- Never share with anyone

### Smart Contract
- Audited OpenZeppelin contracts
- Role-based access control
- Comprehensive testing
- Gas optimization

### Frontend
- No sensitive data in client
- Input validation on all forms
- XSS protection
- Secure headers

### Backend
- API rate limiting
- File upload restrictions
- Input sanitization
- Error handling

### Database
- RLS enabled
- Minimal permissions
- Regular backups
- Query optimization

## Maintenance Tasks

### Regular
- Monitor gas costs
- Check contract transactions
- Review error logs
- Update dependencies

### Monthly
- Backup database
- Review security
- Update documentation
- Check performance metrics

### As Needed
- Grant ISSUER_ROLE to new admins
- Revoke compromised certificates
- Update contract (new deployment)
- Scale backend infrastructure

---

📊 **Complete Project Structure**: All files organized and documented!

Aryan Web3 Labs - Clean Code, Clear Structure
