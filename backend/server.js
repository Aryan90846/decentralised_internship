import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvParser from 'csv-parser';
import { ethers } from 'ethers';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CONTRACT_ABI = [
  "function batchMint(address[] memory receivers, string[] memory metadataURIs, bytes32[] memory metadataHashes) public returns (uint256[] memory)",
];

app.post('/api/upload-metadata', async (req, res) => {
  try {
    const { metadata, certId } = req.body;

    const metadataString = JSON.stringify(metadata);
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));

    const ipfsUri = `ipfs://demo/${certId}`;

    const qrData = `${process.env.FRONTEND_URL}/verify?tokenId=${certId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    metadata.image = qrCodeDataUrl;
    metadata.metadata_hash = metadataHash;

    res.json({ ipfsUri, metadataHash, metadata });
  } catch (error) {
    console.error('Error uploading metadata:', error);
    res.status(500).json({ error: 'Failed to upload metadata' });
  }
});

app.post('/api/batch-mint', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const certificates = [];
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csvParser())
      .on('data', (row) => {
        certificates.push({
          recipientAddress: row.recipient_address,
          recipientName: row.recipient_name,
          program: row.program,
          issueDate: row.issue_date,
        });
      })
      .on('end', async () => {
        if (certificates.length === 0) {
          return res.status(400).json({ error: 'No valid certificates in CSV' });
        }

        if (certificates.length > 50) {
          return res.status(400).json({ error: 'Maximum 50 certificates per batch' });
        }

        const receivers = [];
        const metadataURIs = [];
        const metadataHashes = [];
        const dbRecords = [];

        for (const cert of certificates) {
          const certId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const metadata = {
            name: `Internship Certificate — ${cert.recipientName}`,
            description: `${cert.recipientName} successfully completed ${cert.program}`,
            image: 'ipfs://placeholder',
            attributes: [
              { trait_type: 'name', value: cert.recipientName },
              { trait_type: 'wallet', value: cert.recipientAddress },
              { trait_type: 'program', value: cert.program },
              { trait_type: 'issue_date', value: cert.issueDate },
              { trait_type: 'certificate_id', value: certId },
            ],
          };

          const metadataString = JSON.stringify(metadata);
          const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(metadataString));
          const ipfsUri = `ipfs://demo/${certId}`;

          receivers.push(cert.recipientAddress);
          metadataURIs.push(ipfsUri);
          metadataHashes.push(metadataHash);

          dbRecords.push({
            recipient_address: cert.recipientAddress.toLowerCase(),
            recipient_name: cert.recipientName,
            program: cert.program,
            issue_date: cert.issueDate,
            certificate_id: certId,
            metadata_uri: ipfsUri,
            metadata_hash: metadataHash,
          });
        }

        res.json({
          count: certificates.length,
          receivers,
          metadataURIs,
          metadataHashes,
          dbRecords,
        });
      });
  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ error: 'Failed to process batch' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { type, value } = req.query;

    let query = supabase.from('certificates').select('token_id');

    if (type === 'address') {
      query = query.eq('recipient_address', value.toLowerCase());
    } else if (type === 'certId') {
      query = query.eq('certificate_id', value);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    if (data) {
      res.json({ tokenId: data.token_id });
    } else {
      res.status(404).json({ error: 'Certificate not found' });
    }
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
