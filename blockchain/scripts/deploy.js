const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying InternCertificateNFT to", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  const InternCertificateNFT = await hre.ethers.getContractFactory("InternCertificateNFT");
  const certificate = await InternCertificateNFT.deploy();

  await certificate.waitForDeployment();
  const contractAddress = await certificate.getAddress();

  console.log("✅ InternCertificateNFT deployed to:", contractAddress);
  console.log("📋 Contract owner:", deployer.address);

  const ISSUER_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("ISSUER_ROLE"));
  const hasIssuerRole = await certificate.hasRole(ISSUER_ROLE, deployer.address);
  console.log("👤 Owner has ISSUER_ROLE:", hasIssuerRole);

  if (hre.network.name === "amoy") {
    console.log("\n🔍 Verify contract with:");
    console.log(`npx hardhat verify --network amoy ${contractAddress}`);
    console.log("\n🌐 View on Polygonscan:");
    console.log(`https://amoy.polygonscan.com/address/${contractAddress}`);
  } else if (hre.network.name === "baseSepolia") {
    console.log("\n🔍 Verify contract with:");
    console.log(`npx hardhat verify --network baseSepolia ${contractAddress}`);
    console.log("\n🌐 View on Basescan:");
    console.log(`https://sepolia.basescan.org/address/${contractAddress}`);
  }

  console.log("\n📄 Save this configuration:");
  console.log(JSON.stringify({
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    owner: deployer.address,
    deployedAt: new Date().toISOString()
  }, null, 2));

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
