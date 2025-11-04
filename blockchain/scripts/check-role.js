const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const checkAddress = process.argv[2];

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  if (!checkAddress) {
    console.error("❌ Usage: node check-role.js <ADDRESS_TO_CHECK>");
    process.exit(1);
  }

  console.log("🔍 Checking roles for address:", checkAddress);
  console.log("📋 Contract:", contractAddress);

  const InternCertificateNFT = await hre.ethers.getContractFactory("InternCertificateNFT");
  const certificate = InternCertificateNFT.attach(contractAddress);

  const DEFAULT_ADMIN_ROLE = await certificate.DEFAULT_ADMIN_ROLE();
  const ISSUER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ISSUER_ROLE"));

  const isAdmin = await certificate.hasRole(DEFAULT_ADMIN_ROLE, checkAddress);
  const isIssuer = await certificate.hasRole(ISSUER_ROLE, checkAddress);

  console.log("\n📊 Results:");
  console.log("  DEFAULT_ADMIN_ROLE:", isAdmin ? "✅ YES" : "❌ NO");
  console.log("  ISSUER_ROLE:", isIssuer ? "✅ YES" : "❌ NO");

  if (!isAdmin && !isIssuer) {
    console.log("\n⚠️  This address has no special roles");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
