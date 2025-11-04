const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const newIssuerAddress = process.argv[2];

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  if (!newIssuerAddress) {
    console.error("❌ Usage: node grant-role.js <NEW_ISSUER_ADDRESS>");
    process.exit(1);
  }

  if (!hre.ethers.isAddress(newIssuerAddress)) {
    console.error("❌ Invalid Ethereum address");
    process.exit(1);
  }

  console.log("🔑 Granting ISSUER_ROLE...");
  console.log("📋 Contract:", contractAddress);
  console.log("👤 New Issuer:", newIssuerAddress);

  const [signer] = await hre.ethers.getSigners();
  console.log("📝 Granting from:", signer.address);

  const InternCertificateNFT = await hre.ethers.getContractFactory("InternCertificateNFT");
  const certificate = InternCertificateNFT.attach(contractAddress);

  const ISSUER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ISSUER_ROLE"));

  const hasRole = await certificate.hasRole(ISSUER_ROLE, newIssuerAddress);
  if (hasRole) {
    console.log("⚠️  Address already has ISSUER_ROLE");
    return;
  }

  const tx = await certificate.grantRole(ISSUER_ROLE, newIssuerAddress);
  console.log("⏳ Transaction submitted:", tx.hash);

  await tx.wait();
  console.log("✅ ISSUER_ROLE granted successfully!");

  const verified = await certificate.hasRole(ISSUER_ROLE, newIssuerAddress);
  console.log("🔍 Verification:", verified ? "SUCCESS" : "FAILED");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
