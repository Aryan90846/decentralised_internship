# 🚀 Deployment Guide - Aryan Certificate Portal

Complete step-by-step guide to deploy your decentralized certificate DApp to production.

## Prerequisites Checklist

- [ ] MetaMask wallet with private key
- [ ] ~0.1 MATIC on Polygon Amoy (from faucet)
- [ ] Polygonscan API key (for contract verification)
- [ ] Supabase account with project created
- [ ] WalletConnect Project ID (free at walletconnect.com)
- [ ] Node.js 18+ installed
- [ ] Git installed

## Step 1: Get Testnet Tokens

### Polygon Amoy Faucet

1. Visit https://faucet.polygon.technology/
2. Connect your MetaMask wallet
3. Select "Polygon Amoy" network
4. Request MATIC tokens (0.1 MATIC sufficient)
5. Wait for transaction confirmation (~30 seconds)

**Alternative Faucet**: https://www.alchemy.com/faucets/polygon-amoy

### Verify Balance

```bash
# Check your balance
cast balance <YOUR_WALLET_ADDRESS> --rpc-url https://rpc-amoy.polygon.technology/
```

## Step 2: Set Up Supabase

### Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization or create new one
4. Project settings:
   - Name: `aryan-certificates`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
   - Pricing: Free tier is sufficient

### Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (`SUPABASE_URL`)
   - **anon public key** (`SUPABASE_ANON_KEY`)
   - **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`)

### Database is Already Set Up!

The migration has already created the `certificates` table with proper RLS policies. Verify by:

1. Go to Table Editor in Supabase dashboard
2. You should see `certificates` table with all columns

## Step 3: Get API Keys

### Polygonscan API Key

1. Visit https://polygonscan.com/apis
2. Click "Register"
3. Create account and verify email
4. Go to "My API Keys"
5. Click "Add" to create new key
6. Copy the API key

### WalletConnect Project ID

1. Visit https://cloud.walletconnect.com/
2. Sign up / Sign in
3. Click "Create New Project"
4. Project Name: "Aryan Certificate Portal"
5. Copy the Project ID

## Step 4: Configure Environment Variables

### Blockchain Configuration

Create `blockchain/.env`:

```bash
cd blockchain
cp .env.example .env
nano .env  # or use any text editor
```

Fill in:

```env
PRIVATE_KEY=0xyour_private_key_without_0x_prefix
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

**⚠️ SECURITY WARNING**: Never commit `.env` file or share private key!

### Get Your Private Key from MetaMask

1. Open MetaMask
2. Click account menu → Account Details
3. Click "Export Private Key"
4. Enter password
5. Copy private key (without "0x" prefix)

## Step 5: Deploy Smart Contract

```bash
cd blockchain

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests to ensure everything works
npm test

# Deploy to Polygon Amoy
npm run deploy:amoy
```

Expected output:

```
🚀 Deploying InternCertificateNFT to amoy
📝 Deploying with account: 0xbE27dFb76bdb342313B13357252A42a4CA34431d
💰 Account balance: 0.0984 ETH
✅ InternCertificateNFT deployed to: 0xABCDEF1234567890...
📋 Contract owner: 0xbE27dFb76bdb342313B13357252A42a4CA34431d
```

**🔴 IMPORTANT**: Copy the deployed contract address!

### Verify Contract on Polygonscan

```bash
# Replace <CONTRACT_ADDRESS> with your deployed address
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

Wait ~30 seconds for verification. Your contract will be verified and visible on Polygonscan!

View at: `https://amoy.polygonscan.com/address/<CONTRACT_ADDRESS>`

## Step 6: Configure Frontend

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
nano .env.local
```

Fill in:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Install and Test Frontend

```bash
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 and test:

1. Connect wallet
2. Verify admin access
3. Try minting a test certificate

## Step 7: Configure Backend

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
nano .env
```

Fill in:

```env
PORT=3001
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

### Install and Start Backend

```bash
npm install

# Start server
npm start
```

Backend should run on http://localhost:3001

## Step 8: Test Complete System

### Test Single Certificate Mint

1. Open http://localhost:3000/admin
2. Connect wallet (must be contract owner)
3. Fill single certificate form:
   - Address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1`
   - Name: `Test User`
   - Program: `Full Stack Web3 Internship`
   - Date: Today's date
4. Click "Mint Certificate"
5. Approve transaction in MetaMask
6. Wait for confirmation

### Test Verification

1. Go to http://localhost:3000/verify
2. Enter token ID: `1`
3. Click "Verify Certificate"
4. Should see certificate details and "Valid Certificate" status

### Test Batch Upload

1. Go to Admin → Batch Upload
2. Download CSV template
3. Fill with test data (2-3 entries)
4. Upload CSV
5. Click "Mint Batch"
6. Approve transaction

## Step 9: Deploy to Production

### Deploy Frontend (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: aryan-certificate-portal
# - Framework: Next.js (detected automatically)
```

Add environment variables in Vercel dashboard:

1. Go to project settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Redeploy: `vercel --prod`

### Deploy Backend (Railway - Recommended)

1. Visit https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Set root directory to `backend/`
7. Build command: `npm install`
8. Start command: `npm start`

**Alternative**: Deploy to Render, Heroku, or any Node.js host

### Update Frontend with Production Backend URL

In Vercel, update environment variable:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

Redeploy frontend.

## Step 10: Grant Issuer Role to Additional Admins

If you want to add more wallet addresses that can issue certificates:

```bash
cd blockchain

# Create a script: scripts/grant-role.js
node scripts/grant-role.js <NEW_ISSUER_ADDRESS>
```

Or use Polygonscan:

1. Go to your contract on Polygonscan
2. Click "Write Contract"
3. Connect wallet (must be owner)
4. Find `grantRole` function
5. Enter:
   - `role`: Call `ISSUER_ROLE()` function first to get hash
   - `account`: Address to grant role to
6. Execute transaction

## Step 11: Issue Sample Certificates

Create 5 sample certificates for demo:

### Sample Recipients CSV

```csv
recipient_address,recipient_name,program,issue_date
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1,Alice Johnson,Full Stack Web3 Internship,2024-11-01
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199,Bob Smith,Smart Contract Development Internship,2024-11-05
0xdd2fd4581271e230360230f9337d5c0430bf44c0,Carol Williams,Blockchain Research Internship,2024-11-10
0x2546bcd3c84621e976d8185a91a922ae77ecec30,David Brown,DApp Development Internship,2024-11-15
0xbda5747bfd65f08deb54cb465eb87d40e51b197e,Eve Davis,Full Stack Web3 Internship,2024-11-20
```

Upload this CSV in Admin → Batch Upload

## Production Checklist

- [ ] Smart contract deployed and verified on Polygonscan
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and running
- [ ] Supabase database configured with RLS
- [ ] All environment variables set correctly
- [ ] Test certificate minted successfully
- [ ] Verification page working
- [ ] Batch upload tested
- [ ] 5 sample certificates issued
- [ ] Contract address documented
- [ ] Admin wallet address saved securely

## Important URLs to Save

```
Network: Polygon Amoy
Chain ID: 80002
Contract Address: 0x...
Contract on Explorer: https://amoy.polygonscan.com/address/0x...
Frontend URL: https://your-app.vercel.app
Backend URL: https://your-backend.railway.app
Admin Wallet: 0xbE27dFb76bdb342313B13357252A42a4CA34431d
```

## Monitoring and Maintenance

### Monitor Gas Costs

- Each mint costs ~0.001-0.003 MATIC
- Batch mint (10 certs) costs ~0.01-0.02 MATIC
- Keep wallet funded with 0.1+ MATIC

### Check Contract on Polygonscan

Regularly verify:
- Transaction history
- Token holders
- Total certificates issued

### Monitor Backend Logs

Check Railway/Render logs for:
- API errors
- Failed uploads
- Database connection issues

### Backup Database

Export Supabase data monthly:
1. Go to Database → Backups
2. Download backup
3. Store securely

## Troubleshooting

### Contract Deployment Failed

**Error**: "Insufficient funds"
- **Solution**: Get more MATIC from faucet

**Error**: "Nonce too high"
- **Solution**: Reset MetaMask account (Settings → Advanced → Reset Account)

### Frontend Can't Connect to Contract

- Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` is correct
- Ensure `NEXT_PUBLIC_CHAIN_ID=80002`
- Check you're on Polygon Amoy in MetaMask

### "Access Denied" on Admin Page

- Your wallet must have ISSUER_ROLE
- Owner address: `0xbE27dFb76bdb342313B13357252A42a4CA34431d`
- Grant role using Step 10 instructions

### Backend API Errors

- Check all environment variables are set
- Verify Supabase connection
- Check backend logs for details

### Vercel Build Failed

- Ensure all dependencies in package.json
- Check Node.js version (18+)
- Review build logs for specific errors

## Support

Need help? Check:
- README.md for full documentation
- GitHub issues for common problems
- Hardhat docs: https://hardhat.org/
- Wagmi docs: https://wagmi.sh/
- Supabase docs: https://supabase.com/docs

---

🎉 **Congratulations!** Your decentralized certificate system is now live!

Aryan Web3 Labs - Building the future of credentials
