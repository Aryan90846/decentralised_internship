# 🧪 Testing Guide - Aryan Certificate Portal

Comprehensive testing documentation for the decentralized certificate system.

## Smart Contract Testing

### Run All Tests

```bash
cd blockchain
npm test
```

Expected output:

```
InternCertificateNFT
  Deployment
    ✓ Should set the right owner
    ✓ Should grant issuer role to owner
    ✓ Should have correct name and symbol
  Minting
    ✓ Should mint certificate successfully
    ✓ Should fail if non-issuer tries to mint
    ✓ Should fail if duplicate metadata hash
    ✓ Should batch mint successfully
  Verification
    ✓ Should verify certificate correctly
    ✓ Should verify by metadata hash
  Revocation
    ✓ Should revoke certificate
    ✓ Should fail if non-issuer tries to revoke
    ✓ Should fail if certificate already revoked
  Query Functions
    ✓ Should get certificates by owner

13 passing (2s)
```

### Test Coverage

```bash
npm run coverage
```

Target: >90% coverage for all contract functions

### Gas Report

```bash
REPORT_GAS=true npm test
```

View gas costs for each function:
- `mintCertificate`: ~150,000 gas
- `batchMint` (10 certs): ~1,200,000 gas
- `revokeCertificate`: ~50,000 gas

## Frontend Testing

### Manual Testing Checklist

#### Home Page (`/`)

- [ ] Page loads without errors
- [ ] All links work correctly
- [ ] Feature cards display properly
- [ ] Navigation to admin and verify pages works
- [ ] Responsive on mobile, tablet, desktop

#### Admin Dashboard (`/admin`)

**Without Wallet Connected:**
- [ ] Shows "Connect Your Wallet" message
- [ ] Connect button visible and functional

**With Non-Issuer Wallet:**
- [ ] Shows "Access Denied" message
- [ ] Displays connected wallet address
- [ ] Cannot access mint functions

**With Issuer Wallet:**
- [ ] Three tabs visible: Single, Batch, List
- [ ] Can switch between tabs

**Single Certificate Form:**
- [ ] All form fields render correctly
- [ ] Wallet address validation works
- [ ] Invalid address shows error
- [ ] Form submission triggers MetaMask
- [ ] Success message appears after mint
- [ ] Form clears after successful mint
- [ ] Loading states show during transaction

**Batch Upload:**
- [ ] CSV template downloads correctly
- [ ] File upload area works
- [ ] Only accepts .csv files
- [ ] Shows selected filename
- [ ] Upload triggers processing
- [ ] Success message shows certificate count
- [ ] Error handling for invalid CSV

**Certificate List:**
- [ ] Displays all issued certificates
- [ ] Shows correct token ID, name, program
- [ ] Status badges (Active/Revoked) correct
- [ ] External link to Polygonscan works
- [ ] Revoke button appears for active certs
- [ ] Revoke button disabled during transaction
- [ ] Revoked status updates after transaction
- [ ] Refresh button reloads list

#### Verify Page (`/verify`)

**Search Options:**
- [ ] Three tabs: Token ID, Wallet, Cert ID
- [ ] Tab switching works smoothly
- [ ] Placeholder text updates per tab

**Token ID Search:**
- [ ] Valid token ID shows certificate
- [ ] Shows "Valid Certificate" with green check
- [ ] Displays all certificate details
- [ ] Revoked certificate shows red X
- [ ] Invalid token ID shows not found

**Wallet Address Search:**
- [ ] Valid address with certificates works
- [ ] Shows first certificate found
- [ ] Invalid address format shows error
- [ ] Address with no certificates handled

**Certificate ID Search:**
- [ ] Valid cert ID shows certificate
- [ ] Invalid cert ID shows not found
- [ ] Case sensitive/insensitive handling

**Certificate Display:**
- [ ] All metadata fields visible
- [ ] Issue date formatted correctly
- [ ] Metadata hash displayed
- [ ] "View on Explorer" link works
- [ ] Opens in new tab

### Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Wallet Integration

- [ ] MetaMask connection works
- [ ] WalletConnect works (mobile)
- [ ] Coinbase Wallet works
- [ ] Trust Wallet works
- [ ] Correct network detection (Amoy = 80002)
- [ ] Network switch prompt appears if wrong network
- [ ] Disconnection works properly
- [ ] Reconnection restores state

### Performance Testing

- [ ] Page load under 3 seconds
- [ ] Contract reads under 2 seconds
- [ ] Certificate list loads quickly (100+ certs)
- [ ] No console errors in browser
- [ ] No memory leaks on long sessions

## Backend API Testing

### Using cURL

#### Upload Metadata

```bash
curl -X POST http://localhost:3001/api/upload-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "name": "Test Certificate",
      "description": "Test description",
      "attributes": []
    },
    "certId": "CERT-TEST-123"
  }'
```

Expected: 200 OK with `ipfsUri`, `metadataHash`, `metadata`

#### Search by Address

```bash
curl "http://localhost:3001/api/search?type=address&value=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
```

Expected: 200 OK with `tokenId` or 404 if not found

#### Search by Certificate ID

```bash
curl "http://localhost:3001/api/search?type=certId&value=CERT-123"
```

Expected: 200 OK with `tokenId` or 404 if not found

#### Batch Mint

```bash
curl -X POST http://localhost:3001/api/batch-mint \
  -F "file=@sample-certificates.csv"
```

Expected: 200 OK with `count`, `receivers`, `metadataURIs`, `metadataHashes`

### API Error Handling

Test these scenarios:

- [ ] Missing file in batch upload → 400 error
- [ ] Invalid CSV format → 400 error
- [ ] Batch over 50 certificates → 400 error
- [ ] Empty CSV → 400 error
- [ ] Invalid address in search → 500 handled gracefully
- [ ] Database connection error → 500 with error message

## Database Testing

### Supabase Queries

#### Check Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'certificates';
```

Should show all 12 columns with correct types.

#### Check RLS Policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'certificates';
```

Should show 3 policies:
1. Anyone can view certificates (SELECT, public)
2. Authenticated users can insert (INSERT, authenticated)
3. Authenticated users can update (UPDATE, authenticated)

#### Test Data Integrity

```sql
-- Check for duplicate token IDs
SELECT token_id, COUNT(*)
FROM certificates
GROUP BY token_id
HAVING COUNT(*) > 1;
```

Should return 0 rows.

```sql
-- Check for duplicate certificate IDs
SELECT certificate_id, COUNT(*)
FROM certificates
GROUP BY certificate_id
HAVING COUNT(*) > 1;
```

Should return 0 rows.

#### Test Indexes

```sql
EXPLAIN ANALYZE
SELECT * FROM certificates
WHERE recipient_address = '0x742d35cc6634c0532925a3b844bc9e7595f0beb1';
```

Should use `idx_certificates_recipient_address` index.

### Data Validation Tests

- [ ] Token ID is always positive integer
- [ ] Wallet addresses stored in lowercase
- [ ] Certificate IDs follow CERT-* format
- [ ] Issue dates are valid dates
- [ ] Revoked is always boolean
- [ ] Timestamps have timezone

## Integration Testing

### End-to-End Flow

#### Single Certificate Issuance

1. [ ] Admin connects wallet
2. [ ] Admin fills single certificate form
3. [ ] Admin submits form
4. [ ] MetaMask prompts for approval
5. [ ] Transaction submitted to blockchain
6. [ ] Transaction confirmed
7. [ ] Certificate saved to database
8. [ ] Success message shown
9. [ ] Certificate appears in list
10. [ ] Verification page shows certificate

#### Batch Certificate Issuance

1. [ ] Admin downloads CSV template
2. [ ] Admin fills CSV with 5 recipients
3. [ ] Admin uploads CSV file
4. [ ] Backend processes CSV
5. [ ] Metadata generated for all
6. [ ] Admin approves transaction
7. [ ] All certificates minted on-chain
8. [ ] All certificates saved to database
9. [ ] Success message shows count
10. [ ] All certificates visible in list

#### Certificate Verification

1. [ ] User visits verify page
2. [ ] User enters token ID
3. [ ] System queries blockchain
4. [ ] System fetches metadata from DB
5. [ ] Certificate details displayed
6. [ ] Status shows active/revoked
7. [ ] External links work

#### Certificate Revocation

1. [ ] Admin finds certificate in list
2. [ ] Admin clicks revoke button
3. [ ] Confirmation prompt appears
4. [ ] Admin confirms
5. [ ] MetaMask prompts approval
6. [ ] Transaction submitted
7. [ ] Transaction confirmed
8. [ ] Database updated
9. [ ] Status changes to "Revoked"
10. [ ] Verify page shows revoked status

## Security Testing

### Smart Contract Security

- [ ] Only issuers can mint certificates
- [ ] Only issuers can revoke certificates
- [ ] Cannot mint duplicate metadata hashes
- [ ] Cannot revoke already revoked certificate
- [ ] Cannot revoke non-existent certificate
- [ ] Access control properly enforced
- [ ] Events emitted for all state changes

### Frontend Security

- [ ] No private keys in client code
- [ ] Environment variables not exposed
- [ ] XSS protection in place
- [ ] Input validation on all forms
- [ ] CSRF protection enabled
- [ ] Secure headers configured

### Backend Security

- [ ] Environment variables loaded correctly
- [ ] No secrets in logs
- [ ] File upload size limits enforced
- [ ] CSV parsing sanitized
- [ ] SQL injection protection (Supabase)
- [ ] Rate limiting considered
- [ ] CORS properly configured

### Database Security

- [ ] RLS enabled on certificates table
- [ ] Public can only SELECT
- [ ] Authenticated required for INSERT/UPDATE
- [ ] Service role key never exposed to client
- [ ] Anon key has limited permissions

## Load Testing

### Smart Contract

Test batch minting:

```javascript
// Test minting 50 certificates (max batch)
const receivers = Array(50).fill('0x...');
const uris = Array(50).fill('ipfs://...');
const hashes = Array(50).fill('0x...');

await certificate.batchMint(receivers, uris, hashes);
```

Expected: Transaction succeeds, gas under 3M

### Backend API

Use Apache Bench or similar:

```bash
# Test 100 requests to search endpoint
ab -n 100 -c 10 http://localhost:3001/api/search?type=address&value=0x123...
```

Target: 95% of requests under 500ms

### Database Queries

Test with 1000+ certificates:

```sql
-- Should complete under 100ms
SELECT * FROM certificates
WHERE recipient_address = '0x123...'
LIMIT 10;

-- Should use index
EXPLAIN ANALYZE
SELECT * FROM certificates
WHERE certificate_id = 'CERT-123';
```

## Regression Testing

After any code changes, re-run:

1. [ ] All smart contract tests
2. [ ] Frontend manual tests (critical paths)
3. [ ] Backend API tests
4. [ ] Integration tests (mint + verify)

## Bug Tracking

Document issues found:

| ID | Component | Description | Severity | Status |
|----|-----------|-------------|----------|--------|
| 1  | Frontend  | Wallet not connecting | High | Fixed |
| 2  | Backend   | CSV parse error | Medium | Open |

## Test Data Cleanup

After testing:

```sql
-- Clear test data (if needed)
DELETE FROM certificates WHERE recipient_name LIKE 'Test%';
```

⚠️ **Never run cleanup on production!**

## Continuous Integration

Recommended CI pipeline:

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd blockchain && npm install && npm test
      - run: cd frontend && npm install && npm run lint
```

## Testing Checklist Summary

Before deployment:

- [ ] All smart contract tests pass
- [ ] Frontend loads without errors
- [ ] Admin dashboard functional
- [ ] Verification page works
- [ ] Backend API responds correctly
- [ ] Database queries optimized
- [ ] Security tests completed
- [ ] Cross-browser testing done
- [ ] Mobile responsive verified
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Gas costs acceptable
- [ ] Performance metrics met

---

✅ **All tests passing?** Your system is ready for production!

Aryan Web3 Labs - Quality Assurance First
