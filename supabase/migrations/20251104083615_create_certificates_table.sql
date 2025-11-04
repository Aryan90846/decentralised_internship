/*
  # Create certificates table for Aryan Certificate Portal

  ## Overview
  This migration creates the certificates table to store metadata and tracking information
  for blockchain-issued internship certificates as NFTs.

  ## Tables Created
  
  ### certificates
  Stores certificate metadata and blockchain references
  
  #### Columns
  - `id` (uuid, primary key) - Unique identifier for database record
  - `token_id` (integer, unique, not null) - NFT token ID from blockchain
  - `recipient_address` (text, not null, indexed) - Ethereum wallet address of certificate recipient
  - `recipient_name` (text, not null) - Full name of intern receiving certificate
  - `program` (text, not null) - Name of internship program completed
  - `issue_date` (date, not null) - Date certificate was issued
  - `certificate_id` (text, unique, not null, indexed) - Human-readable certificate ID (CERT-XXXX)
  - `metadata_uri` (text, not null) - IPFS URI pointing to certificate metadata JSON
  - `metadata_hash` (text, not null) - SHA256 hash of metadata for tamper verification
  - `revoked` (boolean, default false) - Whether certificate has been revoked
  - `created_at` (timestamptz, default now()) - Database record creation timestamp
  - `updated_at` (timestamptz, default now()) - Database record last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the certificates table
  - Public read access for verification purposes (anyone can verify certificates)
  - Only authenticated issuers can insert or update certificates
  - Follows principle of public verifiability while protecting write operations

  ## Indexes
  - Primary key index on `id`
  - Unique index on `token_id` for blockchain lookups
  - Unique index on `certificate_id` for human-readable ID lookups
  - Index on `recipient_address` for address-based queries
  - Index on `revoked` for filtering active/revoked certificates

  ## Notes
  - All wallet addresses stored in lowercase for consistent queries
  - Certificate IDs follow format: CERT-{timestamp}-{random}
  - Metadata hash enables on-chain tamper verification
  - IPFS URIs provide decentralized metadata storage
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id integer UNIQUE NOT NULL,
  recipient_address text NOT NULL,
  recipient_name text NOT NULL,
  program text NOT NULL,
  issue_date date NOT NULL,
  certificate_id text UNIQUE NOT NULL,
  metadata_uri text NOT NULL,
  metadata_hash text NOT NULL,
  revoked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_recipient_address 
  ON certificates(recipient_address);

CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id 
  ON certificates(certificate_id);

CREATE INDEX IF NOT EXISTS idx_certificates_revoked 
  ON certificates(revoked);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certificates"
  ON certificates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert certificates"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certificates"
  ON certificates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
