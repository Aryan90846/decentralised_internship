export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002');

export const CONTRACT_ABI = [
  "function mintCertificate(address receiver, string memory metadataURI, bytes32 metadataHash) public returns (uint256)",
  "function batchMint(address[] memory receivers, string[] memory metadataURIs, bytes32[] memory metadataHashes) public returns (uint256[] memory)",
  "function revokeCertificate(uint256 tokenId) public",
  "function verifyCertificate(uint256 tokenId) public view returns (bool exists, bool revoked, address recipient, string memory metadataURI, bytes32 metadataHash, uint256 issuedAt)",
  "function verifyCertificateByHash(bytes32 metadataHash) public view returns (bool exists, uint256 tokenId, bool revoked, address recipient)",
  "function getCertificatesByOwner(address owner) public view returns (uint256[] memory)",
  "function getTotalCertificates() public view returns (uint256)",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function grantRole(bytes32 role, address account) public",
  "function ISSUER_ROLE() public view returns (bytes32)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event CertificateIssued(address indexed to, uint256 indexed tokenId, string uri, bytes32 metadataHash)",
  "event CertificateRevoked(uint256 indexed tokenId, address indexed revoker)"
] as const;

export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];

export const NETWORK_CONFIGS = {
  80002: {
    name: 'Polygon Amoy',
    explorer: 'https://amoy.polygonscan.com',
    rpc: 'https://rpc-amoy.polygon.technology/',
    faucet: 'https://faucet.polygon.technology/',
  },
  84532: {
    name: 'Base Sepolia',
    explorer: 'https://sepolia.basescan.org',
    rpc: 'https://sepolia.base.org',
    faucet: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet',
  },
};
