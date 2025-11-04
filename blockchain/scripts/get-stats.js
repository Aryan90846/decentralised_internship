const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("❌ Please set CONTRACT_ADDRESS environment variable");
    process.exit(1);
  }

  console.log("📊 Fetching contract statistics...");
  console.log("📋 Contract:", contractAddress);

  const InternCertificateNFT = await hre.ethers.getContractFactory("InternCertificateNFT");
  const certificate = InternCertificateNFT.attach(contractAddress);

  const totalCerts = await certificate.getTotalCertificates();
  const name = await certificate.name();
  const symbol = await certificate.symbol();

  console.log("\n📈 Contract Statistics:");
  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Total Certificates Issued:", totalCerts.toString());

  const [signer] = await hre.ethers.getSigners();
  const ISSUER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ISSUER_ROLE"));
  const isIssuer = await certificate.hasRole(ISSUER_ROLE, signer.address);

  console.log("\n👤 Your Account:", signer.address);
  console.log("  Has ISSUER_ROLE:", isIssuer ? "✅ YES" : "❌ NO");

  if (totalCerts > 0) {
    console.log("\n🎓 Sample Certificates:");
    const sampleCount = totalCerts > 5 ? 5 : Number(totalCerts);
    for (let i = 1; i <= sampleCount; i++) {
      try {
        const owner = await certificate.ownerOf(i);
        const [exists, revoked] = await certificate.verifyCertificate(i);
        console.log(`  Token #${i}:`);
        console.log(`    Owner: ${owner}`);
        console.log(`    Status: ${revoked ? "🔴 REVOKED" : "🟢 ACTIVE"}`);
      } catch (error) {
        console.log(`  Token #${i}: Not found or burned`);
      }
    }
  }

  console.log("\n🌐 View on Explorer:");
  console.log(`  https://amoy.polygonscan.com/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
