const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InternCertificateNFT", function () {
  let certificate;
  let owner;
  let issuer;
  let recipient;
  let unauthorized;

  const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
  const sampleURI = "ipfs://QmTest123";
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("sample metadata"));

  beforeEach(async function () {
    [owner, issuer, recipient, unauthorized] = await ethers.getSigners();

    const InternCertificateNFT = await ethers.getContractFactory("InternCertificateNFT");
    certificate = await InternCertificateNFT.deploy();
    await certificate.waitForDeployment();

    await certificate.grantRole(ISSUER_ROLE, issuer.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const DEFAULT_ADMIN_ROLE = await certificate.DEFAULT_ADMIN_ROLE();
      expect(await certificate.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant issuer role to owner", async function () {
      expect(await certificate.hasRole(ISSUER_ROLE, owner.address)).to.be.true;
    });

    it("Should have correct name and symbol", async function () {
      expect(await certificate.name()).to.equal("Aryan Internship Certificate");
      expect(await certificate.symbol()).to.equal("ACERT");
    });
  });

  describe("Minting", function () {
    it("Should mint certificate successfully", async function () {
      await expect(
        certificate.connect(issuer).mintCertificate(
          recipient.address,
          sampleURI,
          sampleHash
        )
      )
        .to.emit(certificate, "CertificateIssued")
        .withArgs(recipient.address, 1, sampleURI, sampleHash);

      expect(await certificate.ownerOf(1)).to.equal(recipient.address);
      expect(await certificate.tokenURI(1)).to.equal(sampleURI);
    });

    it("Should fail if non-issuer tries to mint", async function () {
      await expect(
        certificate.connect(unauthorized).mintCertificate(
          recipient.address,
          sampleURI,
          sampleHash
        )
      ).to.be.reverted;
    });

    it("Should fail if duplicate metadata hash", async function () {
      await certificate.connect(issuer).mintCertificate(
        recipient.address,
        sampleURI,
        sampleHash
      );

      await expect(
        certificate.connect(issuer).mintCertificate(
          recipient.address,
          "ipfs://different",
          sampleHash
        )
      ).to.be.revertedWith("Certificate already exists");
    });

    it("Should batch mint successfully", async function () {
      const receivers = [recipient.address, unauthorized.address];
      const uris = ["ipfs://cert1", "ipfs://cert2"];
      const hashes = [
        ethers.keccak256(ethers.toUtf8Bytes("cert1")),
        ethers.keccak256(ethers.toUtf8Bytes("cert2"))
      ];

      const tx = await certificate.connect(issuer).batchMint(receivers, uris, hashes);
      await tx.wait();

      expect(await certificate.ownerOf(1)).to.equal(recipient.address);
      expect(await certificate.ownerOf(2)).to.equal(unauthorized.address);
      expect(await certificate.getTotalCertificates()).to.equal(2);
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await certificate.connect(issuer).mintCertificate(
        recipient.address,
        sampleURI,
        sampleHash
      );
    });

    it("Should verify certificate correctly", async function () {
      const [exists, revoked, recipientAddr, uri, hash, issuedAt] =
        await certificate.verifyCertificate(1);

      expect(exists).to.be.true;
      expect(revoked).to.be.false;
      expect(recipientAddr).to.equal(recipient.address);
      expect(uri).to.equal(sampleURI);
      expect(hash).to.equal(sampleHash);
      expect(issuedAt).to.be.gt(0);
    });

    it("Should verify by metadata hash", async function () {
      const [exists, tokenId, revoked, recipientAddr] =
        await certificate.verifyCertificateByHash(sampleHash);

      expect(exists).to.be.true;
      expect(tokenId).to.equal(1);
      expect(revoked).to.be.false;
      expect(recipientAddr).to.equal(recipient.address);
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await certificate.connect(issuer).mintCertificate(
        recipient.address,
        sampleURI,
        sampleHash
      );
    });

    it("Should revoke certificate", async function () {
      await expect(certificate.connect(issuer).revokeCertificate(1))
        .to.emit(certificate, "CertificateRevoked")
        .withArgs(1, issuer.address);

      const [, revoked] = await certificate.verifyCertificate(1);
      expect(revoked).to.be.true;
    });

    it("Should fail if non-issuer tries to revoke", async function () {
      await expect(
        certificate.connect(unauthorized).revokeCertificate(1)
      ).to.be.reverted;
    });

    it("Should fail if certificate already revoked", async function () {
      await certificate.connect(issuer).revokeCertificate(1);

      await expect(
        certificate.connect(issuer).revokeCertificate(1)
      ).to.be.revertedWith("Certificate already revoked");
    });
  });

  describe("Query Functions", function () {
    it("Should get certificates by owner", async function () {
      await certificate.connect(issuer).mintCertificate(
        recipient.address,
        "ipfs://cert1",
        ethers.keccak256(ethers.toUtf8Bytes("cert1"))
      );

      await certificate.connect(issuer).mintCertificate(
        recipient.address,
        "ipfs://cert2",
        ethers.keccak256(ethers.toUtf8Bytes("cert2"))
      );

      const tokenIds = await certificate.getCertificatesByOwner(recipient.address);
      expect(tokenIds.length).to.equal(2);
      expect(tokenIds[0]).to.equal(1);
      expect(tokenIds[1]).to.equal(2);
    });
  });
});
