# ⚡ Quick Start - Aryan Certificate Portal

Get up and running in 10 minutes!

## Prerequisites

- [x] Node.js 18+ installed
- [x] MetaMask wallet installed
- [x] Basic terminal knowledge

## Step 1: Get Testnet MATIC (2 minutes)

1. Visit **https://faucet.polygon.technology/**
2. Connect your MetaMask wallet
3. Select **"Polygon Amoy"** network
4. Click **"Submit"** to get free testnet MATIC
5. Wait 30 seconds for confirmation

✅ You should now have ~0.1 MATIC in your wallet

## Step 2: Set Up Supabase (3 minutes)

1. Go to **https://supabase.com/dashboard**
2. Click **"New Project"**
3. Fill in:
   - Name: `aryan-certificates`
   - Password: (create strong password)
   - Region: (closest to you)
4. Click **"Create project"** and wait 2 minutes
5. Once ready, go to **Settings → API**
6. Copy these 3 values:
   - Project URL
   - anon public key
   - service_role key

✅ Save these values - you'll need them soon!

## Step 3: Install Dependencies (2 minutes)

```bash
# Navigate to project root
cd aryan-certificate-portal

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

✅ All dependencies installed!

## Step 4: Configure Blockchain (1 minute)

```bash
cd blockchain
cp .env.example .env
```

Edit `blockchain/.env` with your values:

```env
# Get from MetaMask: Account Details → Export Private Key
PRIVATE_KEY=your_metamask_private_key_here

# Get free at: https://polygonscan.com/apis
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

⚠️ **Keep your private key secret!**

## Step 5: Deploy Smart Contract (1 minute)

```bash
cd blockchain

# Compile contract
npm run compile

# Run tests (optional but recommended)
npm test

# Deploy to Polygon Amoy
npm run deploy:amoy
```

You'll see output like:

```
✅ InternCertificateNFT deployed to: 0xABC123...
```

✅ **Copy this contract address!** You'll need it next.

## Step 6: Configure Frontend (1 minute)

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
# Use the contract address from Step 5
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere

# Always 80002 for Polygon Amoy
NEXT_PUBLIC_CHAIN_ID=80002

# Get free at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id

# From Supabase (Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 7: Configure Backend (1 minute)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3001

# From Supabase (Step 2)
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

FRONTEND_URL=http://localhost:3000
```

## Step 8: Start Everything! (1 minute)

Open **2 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
🚀 Backend server running on port 3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

## Step 9: Test It Out! (2 minutes)

1. **Open http://localhost:3000 in browser**

2. **Connect your wallet**
   - Click "Admin Dashboard" in top right
   - Click "Connect Wallet"
   - Approve in MetaMask

3. **Mint your first certificate**
   - Fill in the form:
     - **Address**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`
     - **Name**: `Test User`
     - **Program**: `Full Stack Web3 Internship`
     - **Date**: Today's date
   - Click "Mint Certificate"
   - Approve transaction in MetaMask
   - Wait for confirmation ⏳

4. **Verify the certificate**
   - Click "Verify" in navigation
   - Enter Token ID: `1`
   - Click "Verify Certificate"
   - See certificate details! ✅

## Step 10: Issue Sample Certificates (BONUS)

Want to populate with demo data?

```bash
# Use the included sample CSV
cd ..  # back to project root
```

1. Go to **Admin → Batch Upload** tab
2. Download the template (or use `sample-certificates.csv`)
3. Upload the file
4. Click "Mint Batch"
5. Approve transaction
6. Wait for 5 certificates to be minted! 🎉

---

## 🎉 You're Done!

Your decentralized certificate system is now running!

### What You Can Do Now:

✅ **Issue Certificates**
- Single certificates via form
- Batch certificates via CSV upload

✅ **Verify Certificates**
- By token ID
- By wallet address
- By certificate ID

✅ **Manage Certificates**
- View all issued certificates
- Revoke certificates
- Check status on blockchain

### Next Steps:

1. **Grant Issuer Role to Others**
   ```bash
   cd blockchain
   CONTRACT_ADDRESS=0xYourAddress npm run grant-role 0xNewIssuerAddress
   ```

2. **View Contract on Polygonscan**
   - Visit: `https://amoy.polygonscan.com/address/YOUR_CONTRACT`
   - See all transactions and holders

3. **Deploy to Production**
   - See `DEPLOYMENT.md` for Vercel + Railway setup
   - Takes ~15 minutes

### Quick Commands Cheat Sheet

```bash
# Check contract stats
cd blockchain && CONTRACT_ADDRESS=0x... npm run stats

# Check if address has role
cd blockchain && CONTRACT_ADDRESS=0x... npm run check-role 0xADDRESS

# Run tests
cd blockchain && npm test

# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev
```

### Common Issues

**"Insufficient funds" error**
→ Get more MATIC from faucet

**"Access Denied" on admin page**
→ You must be contract owner (deployer wallet)

**Contract not found**
→ Check `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

**Backend can't connect to Supabase**
→ Verify `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`

### Support

- 📖 Full docs: `README.md`
- 🚀 Deployment: `DEPLOYMENT.md`
- 🧪 Testing: `TESTING.md`
- 📁 Structure: `STRUCTURE.md`

---

## 📊 Your System At a Glance

```
┌─────────────────────────────────────────┐
│  Blockchain: Polygon Amoy (Testnet)     │
│  Contract: InternCertificateNFT         │
│  Address: 0xYourContractAddress         │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  Frontend: http://localhost:3000        │
│  - Home page                            │
│  - Admin dashboard                      │
│  - Verify page                          │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  Backend: http://localhost:3001         │
│  - Metadata upload                      │
│  - Batch processing                     │
│  - Certificate search                   │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  Database: Supabase                     │
│  - certificates table                   │
│  - RLS policies                         │
│  - Indexes for fast queries             │
└─────────────────────────────────────────┘
```

**Admin Wallet**: 0xbE27dFb76bdb342313B13357252A42a4CA34431d

**Organization**: Aryan Web3 Labs

---

🚀 **Ready to issue blockchain certificates!**

Start minting, verifying, and managing certificates on the blockchain! ✨
